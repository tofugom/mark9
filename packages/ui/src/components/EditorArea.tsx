import React from "react";

export function EditorArea({
  children,
}: React.PropsWithChildren): React.ReactElement {
  return (
    <div className="flex-1 overflow-auto bg-white min-w-0">
      {children}
    </div>
  );
}
