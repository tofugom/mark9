import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { useCommandStore } from "../stores/command-store.js";
import type { Command } from "../stores/command-store.js";

export function CommandPalette(): React.ReactElement | null {
  const isOpen = useCommandStore((s) => s.isOpen);
  const close = useCommandStore((s) => s.close);
  const searchCommands = useCommandStore((s) => s.searchCommands);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = searchCommands(query);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      // Delay focus to after render
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Keep selected index in bounds
  useEffect(() => {
    if (selectedIndex >= results.length) {
      setSelectedIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const executeCommand = useCallback(
    (command: Command) => {
      close();
      // Execute after close animation
      requestAnimationFrame(() => {
        command.execute();
      });
    },
    [close],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            executeCommand(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [results, selectedIndex, executeCommand, close],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center pt-[15vh]"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Palette */}
      <div
        className="relative w-[560px] max-h-[400px] bg-[var(--bg-editor)] border border-[var(--border-primary)] rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-primary)]">
          <Search size={16} className="text-[var(--text-secondary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent outline-none text-[14px] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
          />
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          className="overflow-y-auto flex-1"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-[13px] text-[var(--text-secondary)]">
              No commands found
            </div>
          ) : (
            results.map((cmd, i) => (
              <button
                key={cmd.id}
                type="button"
                className={`w-full flex items-center justify-between px-4 py-2 text-left text-[13px] cursor-pointer transition-colors ${
                  i === selectedIndex
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                      i === selectedIndex
                        ? "bg-white/20 text-white"
                        : "bg-[var(--editor-code-bg)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {cmd.category}
                  </span>
                  <span>{cmd.label}</span>
                </div>
                {cmd.shortcut && (
                  <span
                    className={`text-[11px] ${
                      i === selectedIndex
                        ? "text-white/70"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {cmd.shortcut}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
