import React from "react";
import { useCollabStore } from "../stores/collab-store.js";
import { useAwareness } from "../hooks/useAwareness.js";

export function ConnectionStatus(): React.ReactElement | null {
  const isActive = useCollabStore((s) => s.isActive);
  const connectionState = useCollabStore((s) => s.connectionState);
  const users = useAwareness();

  if (!isActive) return null;

  const dotColor =
    connectionState === "connected"
      ? "bg-green-500"
      : connectionState === "connecting"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <span className="flex items-center gap-1.5" title={`Collab: ${connectionState}`}>
      <span className={`w-[6px] h-[6px] rounded-full ${dotColor}`} />
      <span>{users.length} user{users.length !== 1 ? "s" : ""}</span>
    </span>
  );
}
