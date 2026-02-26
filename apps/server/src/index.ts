/**
 * Mark9 Collaboration Server
 *
 * Hono + Bun WebSocket server that bridges y-websocket for real-time
 * collaborative editing. Each room corresponds to a shared workspace.
 *
 * y-websocket's WebsocketProvider connects to: ws://host:port/<roomId>
 * so this server upgrades ANY path that isn't /health or /rooms/* to WebSocket.
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PORT, HOST } from "./config.js";
import { getOrCreateRoom, removeClient, getRoomInfo, startCleanupInterval } from "./room-manager.js";

// y-websocket server utilities
// @ts-expect-error — y-websocket/bin/utils has no type declarations
import { setupWSConnection } from "y-websocket/bin/utils";

const app = new Hono();

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok", uptime: process.uptime() }));

app.get("/rooms/:roomId", (c) => {
  const roomId = c.req.param("roomId");
  const info = getRoomInfo(roomId);
  return c.json({ roomId, ...info });
});

// Known HTTP-only routes that should NOT be upgraded to WebSocket
const HTTP_ROUTES = ["/health", "/rooms/"];

const server = Bun.serve({
  port: PORT,
  hostname: HOST,

  fetch(req, server) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Check if this is a known HTTP route → delegate to Hono
    if (HTTP_ROUTES.some((r) => pathname.startsWith(r))) {
      return app.fetch(req);
    }

    // Everything else is a WebSocket upgrade for a room.
    // y-websocket connects to ws://host:port/<roomId>
    // Extract roomId by stripping leading "/" and optional "ws/" prefix
    let roomId = pathname.slice(1); // remove leading "/"
    if (roomId.startsWith("ws/")) {
      roomId = roomId.slice(3);
    }

    if (!roomId) {
      return app.fetch(req); // fallback to Hono for "/"
    }

    // Check for WebSocket upgrade header
    const upgradeHeader = req.headers.get("upgrade");
    if (upgradeHeader?.toLowerCase() !== "websocket") {
      // Not a WS request — maybe a browser navigating to /<roomId>
      return new Response(`Room: ${roomId}`, { status: 200 });
    }

    const upgraded = server.upgrade(req, {
      data: { roomId },
    });

    if (upgraded) return undefined as unknown as Response;
    return new Response("WebSocket upgrade failed", { status: 500 });
  },

  websocket: {
    open(ws) {
      const { roomId } = ws.data as { roomId: string };
      console.log(`[ws] Client connected to room: ${roomId}`);
      getOrCreateRoom(roomId, ws);

      // Adapt Bun WebSocket to the interface y-websocket expects.
      // y-websocket's setupWSConnection expects a Node.js ws-like object
      const wsAdapter = {
        send: (data: ArrayBuffer | Uint8Array | string) => {
          try {
            ws.send(data);
          } catch {
            // Client may have disconnected
          }
        },
        readyState: 1, // OPEN
        _listeners: new Map<string, Set<(...args: unknown[]) => void>>(),
        on(event: string, listener: (...args: unknown[]) => void) {
          if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
          }
          this._listeners.get(event)!.add(listener);
        },
        emit(event: string, ...args: unknown[]) {
          const listeners = this._listeners.get(event);
          if (listeners) {
            for (const fn of listeners) fn(...args);
          }
        },
        close() {
          ws.close();
        },
      };

      // Store adapter on the Bun ws for use in message/close handlers
      (ws as unknown as Record<string, unknown>)._adapter = wsAdapter;

      setupWSConnection(wsAdapter, undefined, { docName: roomId });
    },

    message(ws, message) {
      const adapter = (ws as unknown as Record<string, unknown>)._adapter as {
        emit: (event: string, ...args: unknown[]) => void;
      };
      if (adapter) {
        // Forward binary messages to y-websocket
        const data =
          message instanceof ArrayBuffer
            ? new Uint8Array(message)
            : message;
        adapter.emit("message", data);
      }
    },

    close(ws) {
      const { roomId } = ws.data as { roomId: string };
      console.log(`[ws] Client disconnected from room: ${roomId}`);
      removeClient(roomId, ws);

      const adapter = (ws as unknown as Record<string, unknown>)._adapter as {
        emit: (event: string, ...args: unknown[]) => void;
      };
      if (adapter) {
        adapter.emit("close");
      }
    },
  },
});

// Start idle room cleanup
startCleanupInterval();

console.log(`Mark9 Collab Server running at http://${HOST}:${PORT}`);
console.log(`WebSocket endpoint: ws://${HOST}:${PORT}/<roomId>`);
