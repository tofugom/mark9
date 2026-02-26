import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { useCollabStore } from "../stores/collab-store.js";

export interface JoinDialogProps {
  /** WebSocket server URL. */
  serverUrl?: string;
  /** Called after successfully joining. */
  onClose: () => void;
}

export function JoinDialog({
  serverUrl = "ws://localhost:4444",
  onClose,
}: JoinDialogProps): React.ReactElement {
  const localUserName = useCollabStore((s) => s.localUserName);
  const setLocalUserName = useCollabStore((s) => s.setLocalUserName);
  const joinSession = useCollabStore((s) => s.joinSession);

  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState(localUserName);

  const handleJoin = useCallback(() => {
    const code = roomCode.trim().toLowerCase();
    const name = nickname.trim() || "Anonymous";
    if (code.length !== 6) return;

    setLocalUserName(name);
    joinSession(serverUrl, code, name);
    onClose();
  }, [roomCode, nickname, serverUrl, joinSession, setLocalUserName, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleJoin();
      if (e.key === "Escape") onClose();
    },
    [handleJoin, onClose],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-lg shadow-2xl w-[340px] p-5 border border-[var(--border-sidebar)]"
        style={{ backgroundColor: "var(--bg-sidebar)" }}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
            Join Session
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Room code */}
        <label className="block mb-3">
          <span className="text-[12px] font-medium text-[var(--text-secondary)] mb-1 block">
            Room Code
          </span>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.slice(0, 6))}
            placeholder="abc123"
            maxLength={6}
            autoFocus
            className="w-full h-[34px] px-3 rounded border border-[var(--border-sidebar)] text-[var(--text-primary)] text-[14px] font-mono tracking-[0.15em] text-center placeholder:text-[var(--text-secondary)]/40 focus:outline-none focus:border-[var(--accent)]"
            style={{ backgroundColor: "var(--bg-app)" }}
          />
        </label>

        {/* Nickname */}
        <label className="block mb-4">
          <span className="text-[12px] font-medium text-[var(--text-secondary)] mb-1 block">
            Nickname
          </span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Anonymous"
            maxLength={20}
            className="w-full h-[34px] px-3 rounded border border-[var(--border-sidebar)] text-[var(--text-primary)] text-[14px] placeholder:text-[var(--text-secondary)]/40 focus:outline-none focus:border-[var(--accent)]"
            style={{ backgroundColor: "var(--bg-app)" }}
          />
        </label>

        {/* Join button */}
        <button
          type="button"
          onClick={handleJoin}
          disabled={roomCode.trim().length !== 6}
          className="w-full h-[34px] rounded text-[13px] font-medium bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Join
        </button>
      </div>
    </div>
  );
}
