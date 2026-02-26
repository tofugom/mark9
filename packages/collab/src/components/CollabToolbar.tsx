import React, { useState, useCallback } from "react";
import { Share2, LogIn, LogOut, Copy, Check, RefreshCw } from "lucide-react";
import { useCollabStore } from "../stores/collab-store.js";

export interface CollabToolbarProps {
  /** Default WebSocket server URL. */
  serverUrl?: string;
  /** Called when the user wants to open the join dialog. */
  onJoinClick?: () => void;
  /** Called after a session is started (host). */
  onSessionStarted?: () => void;
}

export function CollabToolbar({
  serverUrl = "ws://localhost:4444",
  onJoinClick,
  onSessionStarted,
}: CollabToolbarProps): React.ReactElement {
  const isActive = useCollabStore((s) => s.isActive);
  const roomId = useCollabStore((s) => s.roomId);
  const isHost = useCollabStore((s) => s.isHost);
  const connectionState = useCollabStore((s) => s.connectionState);
  const localUserName = useCollabStore((s) => s.localUserName);
  const startSession = useCollabStore((s) => s.startSession);
  const leaveSession = useCollabStore((s) => s.leaveSession);
  const regenerateSession = useCollabStore((s) => s.regenerateSession);

  const [copied, setCopied] = useState(false);

  const handleStart = useCallback(() => {
    startSession(serverUrl, localUserName);
    onSessionStarted?.();
  }, [serverUrl, localUserName, startSession, onSessionStarted]);

  const handleCopyCode = useCallback(async () => {
    if (!roomId) return;
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomId]);

  if (!isActive) {
    return (
      <div className="px-4 py-3 space-y-2">
        <button
          type="button"
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 h-[32px] rounded text-[13px] font-medium bg-[var(--accent)] text-white hover:opacity-90 cursor-pointer"
        >
          <Share2 size={14} />
          Start Sharing
        </button>
        <button
          type="button"
          onClick={onJoinClick}
          className="w-full flex items-center justify-center gap-2 h-[32px] rounded text-[13px] font-medium text-[var(--text-sidebar)] border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
        >
          <LogIn size={14} />
          Join Session
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Room code */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Room
        </span>
        <code className="flex-1 text-center text-[15px] font-mono font-bold tracking-[0.2em] text-[var(--text-primary)]">
          {roomId}
        </code>
        <button
          type="button"
          onClick={handleCopyCode}
          className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] cursor-pointer"
          title="Copy room code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Connection status */}
      <div className="text-[12px] text-[var(--text-secondary)] text-center">
        {connectionState === "connecting" && "Connecting..."}
        {connectionState === "connected" && (
          <span className="text-green-500">Connected</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isHost && (
          <button
            type="button"
            onClick={() => regenerateSession()}
            className="flex-1 flex items-center justify-center gap-1.5 h-[28px] rounded text-[12px] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
            title="End session and create a new room code"
          >
            <RefreshCw size={12} />
            New Code
          </button>
        )}
        <button
          type="button"
          onClick={leaveSession}
          className="flex-1 flex items-center justify-center gap-1.5 h-[28px] rounded text-[12px] text-red-400 border border-red-400/30 hover:bg-red-400/10 cursor-pointer"
        >
          <LogOut size={12} />
          Leave
        </button>
      </div>
    </div>
  );
}
