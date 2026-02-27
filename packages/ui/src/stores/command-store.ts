import { create } from "zustand";

export interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  execute: () => void;
}

export interface CommandState {
  commands: Command[];
  isOpen: boolean;

  registerCommand: (command: Command) => void;
  registerCommands: (commands: Command[]) => void;
  unregisterCommand: (id: string) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  searchCommands: (query: string) => Command[];
}

/**
 * Simple fuzzy match: checks if all characters of the query appear
 * in order within the target string (case-insensitive).
 */
function fuzzyMatch(target: string, query: string): boolean {
  const t = target.toLowerCase();
  const q = query.toLowerCase();
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti);
    if (idx === -1) return false;
    ti = idx + 1;
  }
  return true;
}

export const useCommandStore = create<CommandState>((set, get) => ({
  commands: [],
  isOpen: false,

  registerCommand: (command) => {
    set((state) => {
      // Replace if exists, otherwise add
      const filtered = state.commands.filter((c) => c.id !== command.id);
      return { commands: [...filtered, command] };
    });
  },

  registerCommands: (commands) => {
    set((state) => {
      const ids = new Set(commands.map((c) => c.id));
      const filtered = state.commands.filter((c) => !ids.has(c.id));
      return { commands: [...filtered, ...commands] };
    });
  },

  unregisterCommand: (id) => {
    set((state) => ({
      commands: state.commands.filter((c) => c.id !== id),
    }));
  },

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  searchCommands: (query) => {
    const { commands } = get();
    if (!query.trim()) return commands;
    return commands.filter(
      (c) =>
        fuzzyMatch(c.label, query) ||
        fuzzyMatch(c.category, query) ||
        fuzzyMatch(`${c.category}: ${c.label}`, query),
    );
  },
}));
