import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import type { Awareness } from "y-protocols/awareness";
import type { CollabFileNode } from "../types.js";

/**
 * Manages a shared Yjs workspace — one Y.Doc containing multiple files.
 *
 * Structure inside the Y.Doc:
 *   Top-level XmlFragments — "doc:<filePath>" per file (ProseMirror content)
 *   Y.Map("fileTree")   — serialised file tree for sidebar sync
 *   Y.Map("presence")   — clientId → currently-edited file path
 *   Y.Map("meta")       — room metadata (hostClientId, etc.)
 */
export class WorkspaceManager {
  readonly doc: Y.Doc;
  provider: WebsocketProvider | null = null;
  persistence: IndexeddbPersistence | null = null;

  private readonly fileTreeMap: Y.Map<unknown>;
  private readonly presenceMap: Y.Map<string>;
  private readonly metaMap: Y.Map<unknown>;

  constructor() {
    this.doc = new Y.Doc();
    this.fileTreeMap = this.doc.getMap("fileTree");
    this.presenceMap = this.doc.getMap("presence") as Y.Map<string>;
    this.metaMap = this.doc.getMap("meta");
  }

  /** Connect to the collab server via WebSocket. */
  connect(
    serverUrl: string,
    roomId: string,
    userName: string,
    userColor: string,
  ): void {
    this.provider = new WebsocketProvider(serverUrl, roomId, this.doc);

    this.provider.awareness.setLocalStateField("user", {
      name: userName,
      color: userColor,
    });

    // Offline persistence
    this.persistence = new IndexeddbPersistence(
      `mark9-collab-${roomId}`,
      this.doc,
    );
  }

  /** Get (or create) the Y.XmlFragment for a specific file. */
  getFragment(filePath: string): Y.XmlFragment {
    return this.doc.getXmlFragment(`doc:${filePath}`);
  }

  /** Set the file tree structure (host initialises this). */
  setFileTree(tree: CollabFileNode[]): void {
    this.fileTreeMap.set("root", tree);
  }

  /** Read the shared file tree. */
  getFileTree(): CollabFileNode[] {
    return (this.fileTreeMap.get("root") as CollabFileNode[] | undefined) ?? [];
  }

  /** Observe file tree changes. */
  onFileTreeChange(callback: (tree: CollabFileNode[]) => void): () => void {
    const handler = () => {
      callback(this.getFileTree());
    };
    this.fileTreeMap.observe(handler);
    return () => this.fileTreeMap.unobserve(handler);
  }

  /** Update which file the local user is editing. */
  setCurrentFile(filePath: string | null): void {
    const clientId = String(this.doc.clientID);
    if (filePath) {
      this.presenceMap.set(clientId, filePath);
    } else {
      this.presenceMap.delete(clientId);
    }
    this.provider?.awareness.setLocalStateField("currentFile", filePath);
  }

  /** Set this client as the room host. */
  setHost(): void {
    this.metaMap.set("hostClientId", this.doc.clientID);
  }

  /** Check whether the given clientId is the room host. */
  isHost(clientId?: number): boolean {
    const id = clientId ?? this.doc.clientID;
    return this.metaMap.get("hostClientId") === id;
  }

  /** Get the awareness instance (null before connect). */
  getAwareness(): Awareness | null {
    return this.provider?.awareness ?? null;
  }

  /** Disconnect from the server and clean up. */
  disconnect(): void {
    this.provider?.disconnect();
    this.provider?.destroy();
    this.provider = null;
    this.persistence?.destroy();
    this.persistence = null;
  }

  /** Full teardown — disconnect + destroy the Y.Doc. */
  destroy(): void {
    this.disconnect();
    this.doc.destroy();
  }
}
