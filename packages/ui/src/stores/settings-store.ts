import { create } from "zustand";

export type AutoSaveInterval = "off" | "1s" | "5s" | "30s";

const STORAGE_KEY = "mark9-settings";

interface PersistedSettings {
  autoSave: AutoSaveInterval;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
}

const DEFAULTS: PersistedSettings = {
  autoSave: "off",
  fontSize: 16,
  tabSize: 2,
  wordWrap: true,
  showLineNumbers: false,
};

const VALID_AUTO_SAVE: AutoSaveInterval[] = ["off", "1s", "5s", "30s"];

function validateSettings(data: unknown): Partial<PersistedSettings> {
  if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
  const obj = data as Record<string, unknown>;
  const result: Partial<PersistedSettings> = {};

  if (typeof obj.autoSave === "string" && VALID_AUTO_SAVE.includes(obj.autoSave as AutoSaveInterval)) {
    result.autoSave = obj.autoSave as AutoSaveInterval;
  }
  if (typeof obj.fontSize === "number" && obj.fontSize >= 10 && obj.fontSize <= 32) {
    result.fontSize = obj.fontSize;
  }
  if (typeof obj.tabSize === "number" && obj.tabSize >= 1 && obj.tabSize <= 8) {
    result.tabSize = obj.tabSize;
  }
  if (typeof obj.wordWrap === "boolean") {
    result.wordWrap = obj.wordWrap;
  }
  if (typeof obj.showLineNumbers === "boolean") {
    result.showLineNumbers = obj.showLineNumbers;
  }
  return result;
}

function loadSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      return { ...DEFAULTS, ...validateSettings(parsed) };
    }
  } catch {
    // localStorage unavailable or corrupt
  }
  return { ...DEFAULTS };
}

function persistSettings(settings: PersistedSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable
  }
}

export interface SettingsState {
  autoSave: AutoSaveInterval;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;

  setAutoSave: (value: AutoSaveInterval) => void;
  setFontSize: (value: number) => void;
  setTabSize: (value: number) => void;
  setWordWrap: (value: boolean) => void;
  setShowLineNumbers: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = loadSettings();

  return {
    ...initial,

    setAutoSave: (value: AutoSaveInterval) => {
      set({ autoSave: value });
      persistSettings({ ...get(), autoSave: value });
    },

    setFontSize: (value: number) => {
      const clamped = Math.min(24, Math.max(14, value));
      set({ fontSize: clamped });
      persistSettings({ ...get(), fontSize: clamped });
    },

    setTabSize: (value: number) => {
      set({ tabSize: value });
      persistSettings({ ...get(), tabSize: value });
    },

    setWordWrap: (value: boolean) => {
      set({ wordWrap: value });
      persistSettings({ ...get(), wordWrap: value });
    },

    setShowLineNumbers: (value: boolean) => {
      set({ showLineNumbers: value });
      persistSettings({ ...get(), showLineNumbers: value });
    },
  };
});
