import React from "react";
import { UserX, Crown } from "lucide-react";
import { useAwareness } from "../hooks/useAwareness.js";
import { useCollabStore } from "../stores/collab-store.js";
import { getWorkspaceManager } from "../stores/collab-store.js";

export function UserList(): React.ReactElement {
  const users = useAwareness();
  const isHost = useCollabStore((s) => s.isHost);
  const kickUser = useCollabStore((s) => s.kickUser);

  const manager = getWorkspaceManager();
  const localClientId = manager?.doc.clientID ?? 0;

  if (users.length === 0) {
    return (
      <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
        No participants
      </div>
    );
  }

  return (
    <div className="px-2 py-1">
      {users.map((user) => {
        const isLocal = user.clientId === localClientId;
        const isHostUser = manager?.isHost(user.clientId) ?? false;

        return (
          <div
            key={user.clientId}
            className="flex items-center gap-2 h-[30px] px-2 rounded hover:bg-[var(--bg-hover)] group"
          >
            {/* Avatar */}
            <div
              className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + file info */}
            <div className="flex-1 min-w-0">
              <span className="text-[13px] text-[var(--text-sidebar)] truncate block">
                {user.name}
                {isLocal && (
                  <span className="text-[var(--text-secondary)]"> (you)</span>
                )}
              </span>
            </div>

            {/* Host badge */}
            {isHostUser && (
              <span title="Host">
                <Crown size={12} className="text-yellow-500 shrink-0" />
              </span>
            )}

            {/* Kick button (visible to host only, for non-local users) */}
            {isHost && !isLocal && (
              <button
                type="button"
                onClick={() => kickUser(user.clientId)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-red-400 hover:bg-red-400/10 cursor-pointer transition-opacity"
                title={`Kick ${user.name}`}
              >
                <UserX size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
