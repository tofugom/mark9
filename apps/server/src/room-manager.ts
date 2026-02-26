import { ROOM_IDLE_TIMEOUT } from "./config.js";

interface Room {
  /** The host's WebSocket (first to connect). */
  hostWs: unknown;
  /** All connected WebSockets for this room. */
  clients: Set<unknown>;
  /** Last activity timestamp (for idle cleanup). */
  lastActivity: number;
}

const rooms = new Map<string, Room>();

export function getOrCreateRoom(roomId: string, ws: unknown): Room {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      hostWs: ws,
      clients: new Set(),
      lastActivity: Date.now(),
    };
    rooms.set(roomId, room);
  }
  room.clients.add(ws);
  room.lastActivity = Date.now();
  return room;
}

export function removeClient(roomId: string, ws: unknown): void {
  const room = rooms.get(roomId);
  if (!room) return;

  room.clients.delete(ws);

  // Remove empty rooms
  if (room.clients.size === 0) {
    rooms.delete(roomId);
  }
}

export function getRoomInfo(roomId: string): { exists: boolean; clients: number } {
  const room = rooms.get(roomId);
  if (!room) return { exists: false, clients: 0 };
  return { exists: true, clients: room.clients.size };
}

/** Periodically clean up idle rooms. */
export function startCleanupInterval(): void {
  setInterval(() => {
    const now = Date.now();
    for (const [roomId, room] of rooms) {
      if (now - room.lastActivity > ROOM_IDLE_TIMEOUT && room.clients.size === 0) {
        rooms.delete(roomId);
      }
    }
  }, 60_000); // Check every minute
}
