import { create } from "zustand";

const STORAGE_KEY = "mark9-recent-files";
const MAX_RECENTS = 10;

export interface RecentFileEntry {
  name: string;
  path: string;
  timestamp: number;
}

/** Persisted subset — only name + timestamp, no full paths. */
interface PersistedEntry {
  name: string;
  timestamp: number;
}

export interface RecentFilesState {
  recents: RecentFileEntry[];
  addRecent: (name: string, path: string) => void;
  getRecents: () => RecentFileEntry[];
  clearRecents: () => void;
}

function isValidPersistedEntry(item: unknown): item is PersistedEntry {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.name === "string" &&
    typeof obj.timestamp === "number" &&
    obj.name.length <= 255
  );
}

function loadRecents(): RecentFileEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(isValidPersistedEntry)
          .slice(0, MAX_RECENTS)
          .map((e) => ({ name: e.name, path: "", timestamp: e.timestamp }));
      }
    }
  } catch {
    // localStorage unavailable or corrupt
  }
  return [];
}

/** Persist only names and timestamps — never store full paths. */
function persistRecents(recents: RecentFileEntry[]): void {
  try {
    const safe: PersistedEntry[] = recents.map((r) => ({
      name: r.name,
      timestamp: r.timestamp,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // localStorage unavailable
  }
}

export const useRecentFilesStore = create<RecentFilesState>((set, get) => ({
  recents: loadRecents(),

  addRecent: (name: string, path: string) => {
    const existing = get().recents.filter((r) => r.name !== name || r.path !== path);
    const entry: RecentFileEntry = {
      name,
      path,
      timestamp: Date.now(),
    };
    const updated = [entry, ...existing].slice(0, MAX_RECENTS);
    set({ recents: updated });
    persistRecents(updated);
  },

  getRecents: () => get().recents,

  clearRecents: () => {
    set({ recents: [] });
    persistRecents([]);
  },
}));
