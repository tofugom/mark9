import { create } from "zustand";

export interface LayoutState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  outlineOpen: boolean;
  commentsPanelOpen: boolean;
  toggleSidebar: () => void;
  toggleOutline: () => void;
  toggleCommentsPanel: () => void;
  setSidebarWidth: (width: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarOpen: true,
  sidebarWidth: 260,
  outlineOpen: false,
  commentsPanelOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleOutline: () => set((s) => ({ outlineOpen: !s.outlineOpen })),
  toggleCommentsPanel: () =>
    set((s) => ({ commentsPanelOpen: !s.commentsPanelOpen })),
  setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
}));
