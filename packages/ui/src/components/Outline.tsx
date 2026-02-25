import React from "react";
import { useLayoutStore } from "../stores/layout-store.js";

export function Outline(): React.ReactElement | null {
  const outlineOpen = useLayoutStore((s) => s.outlineOpen);

  if (!outlineOpen) {
    return null;
  }

  return (
    <div className="w-52 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto shrink-0">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Outline
      </h3>
      <ul className="space-y-1 text-sm text-gray-600">
        <li className="py-0.5 text-gray-400 italic">No headings found</li>
      </ul>
    </div>
  );
}
