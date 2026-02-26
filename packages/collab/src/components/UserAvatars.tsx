import React from "react";
import { useAwareness } from "../hooks/useAwareness.js";

export interface UserAvatarsProps {
  /** Only show users editing this file (null = show all). */
  currentFile?: string | null;
  /** Max avatars to display before "+N" overflow. */
  max?: number;
}

export function UserAvatars({
  currentFile = null,
  max = 5,
}: UserAvatarsProps): React.ReactElement | null {
  const allUsers = useAwareness();

  if (allUsers.length === 0) return null;

  const filtered = currentFile
    ? allUsers.filter((u) => u.currentFile === currentFile)
    : allUsers;

  if (filtered.length === 0) return null;

  const visible = filtered.slice(0, max);
  const overflow = filtered.length - max;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((user) => (
        <div
          key={user.clientId}
          className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[var(--bg-toolbar)]"
          style={{ backgroundColor: user.color }}
          title={user.name}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold text-[var(--text-secondary)] bg-[var(--bg-hover)] border-2 border-[var(--bg-toolbar)]">
          +{overflow}
        </div>
      )}
    </div>
  );
}
