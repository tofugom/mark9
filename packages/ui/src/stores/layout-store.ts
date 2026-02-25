import { create } from "zustand";

export interface LayoutState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  outlineOpen: boolean;
  toggleSidebar: () => void;
  toggleOutline: () => void;
  setSidebarWidth: (width: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarOpen: true,
  sidebarWidth: 260,
  outlineOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleOutline: () => set((s) => ({ outlineOpen: !s.outlineOpen })),
  setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
}));
