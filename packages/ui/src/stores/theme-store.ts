import { create } from "zustand";

export type ThemeName = "light" | "dark" | "sepia";

const THEME_ORDER: ThemeName[] = ["light", "dark", "sepia"];
const STORAGE_KEY = "mark9-theme";

function getInitialTheme(): ThemeName {
  // 1. Check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "sepia") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }

  // 2. Check system preference
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  // 3. Default to light
  return "light";
}

function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
}

export interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => {
  // Apply initial theme immediately
  const initial = getInitialTheme();
  applyTheme(initial);

  return {
    theme: initial,

    setTheme: (theme: ThemeName) => {
      applyTheme(theme);
      set({ theme });
    },

    cycleTheme: () => {
      const current = get().theme;
      const idx = THEME_ORDER.indexOf(current);
      const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
      applyTheme(next);
      set({ theme: next });
    },
  };
});
