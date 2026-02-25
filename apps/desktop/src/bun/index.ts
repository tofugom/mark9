/**
 * @mark9/desktop - Main process entry point
 *
 * This is the Bun-side entry point for the Electrobun desktop app.
 * It creates the main window, sets up the application menu, and
 * registers RPC handlers that the webview renderer calls into.
 */

import Electrobun, {
  BrowserWindow,
  ApplicationMenu,
  defineElectrobunRPC,
} from "electrobun/bun";

import type { Mark9RPCSchema } from "../rpc/index.js";
import * as fsOps from "../platform/fs.js";
import * as gitOps from "../platform/git.js";

// ─── RPC handlers ────────────────────────────────────────────────────

const rpc = defineElectrobunRPC<Mark9RPCSchema>("bun", {
  maxRequestTime: 30_000,
  handlers: {
    requests: {
      // Filesystem
      "fs:readFile": (params) => fsOps.readFile(params),
      "fs:writeFile": (params) => fsOps.writeFile(params),
      "fs:readDir": (params) => fsOps.readDir(params),
      "fs:exists": (params) => fsOps.exists(params),
      "fs:mkdir": (params) => fsOps.mkdir(params),
      "fs:stat": (params) => fsOps.fileStat(params),
      "fs:remove": (params) => fsOps.remove(params),
      "fs:rename": (params) => fsOps.rename(params),

      // Git
      "git:isRepo": (params) => gitOps.isRepo(params),
      "git:status": (params) => gitOps.getStatus(params),
      "git:stage": (params) => gitOps.stage(params),
      "git:commit": (params) => gitOps.commit(params),
      "git:push": (params) => gitOps.push(params),
      "git:pull": (params) => gitOps.pull(params),
      "git:log": (params) => gitOps.log(params),
      "git:branches": (params) => gitOps.branches(params),
      "git:currentBranch": (params) => gitOps.currentBranch(params),

      // Dialogs (placeholder - uses Electrobun Utils API)
      "dialog:openFile": async (_params) => {
        // TODO: Implement with Electrobun.Utils.showOpenDialog when available
        return null;
      },
      "dialog:saveFile": async (_params) => {
        // TODO: Implement with Electrobun.Utils.showSaveDialog when available
        return null;
      },

      // Window operations
      "window:setTitle": (params) => {
        mainWindow.setTitle(params.title);
      },
      "window:minimize": () => {
        mainWindow.minimize();
      },
      "window:maximize": () => {
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
      },
      "window:close": () => {
        mainWindow.close();
      },
      "window:toggleFullscreen": () => {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      },
    },
    messages: {
      "editor:contentChanged": (payload) => {
        // Update title bar to reflect unsaved changes
        const dirtyMarker = payload.isDirty ? " *" : "";
        mainWindow.setTitle(`Mark9${dirtyMarker}`);
      },
      "editor:ready": () => {
        console.log("[Mark9] Editor is ready");
      },
    },
  },
});

// ─── Application menu ────────────────────────────────────────────────

ApplicationMenu.setApplicationMenu([
  {
    label: "Mark9",
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "showAll" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "New File",
        accelerator: "CommandOrControl+N",
        action: "file:new",
      },
      {
        label: "Open File...",
        accelerator: "CommandOrControl+O",
        action: "file:open",
      },
      {
        label: "Open Folder...",
        accelerator: "CommandOrControl+Shift+O",
        action: "file:openFolder",
      },
      { type: "separator" },
      {
        label: "Save",
        accelerator: "CommandOrControl+S",
        action: "file:save",
      },
      {
        label: "Save As...",
        accelerator: "CommandOrControl+Shift+S",
        action: "file:saveAs",
      },
      { type: "separator" },
      { role: "close" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteAndMatchStyle" },
      { role: "selectAll" },
      { type: "separator" },
      {
        label: "Find...",
        accelerator: "CommandOrControl+F",
        action: "edit:find",
      },
      {
        label: "Replace...",
        accelerator: "CommandOrControl+H",
        action: "edit:replace",
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Toggle Sidebar",
        accelerator: "CommandOrControl+B",
        action: "view:toggleSidebar",
      },
      {
        label: "Toggle Source Mode",
        accelerator: "CommandOrControl+/",
        action: "view:toggleSource",
      },
      { type: "separator" },
      {
        label: "Zoom In",
        accelerator: "CommandOrControl+Plus",
        action: "view:zoomIn",
      },
      {
        label: "Zoom Out",
        accelerator: "CommandOrControl+Minus",
        action: "view:zoomOut",
      },
      {
        label: "Reset Zoom",
        accelerator: "CommandOrControl+0",
        action: "view:zoomReset",
      },
      { type: "separator" },
      { role: "toggleFullScreen" },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Mark9 Documentation",
        action: "help:docs",
      },
      {
        label: "Report Issue",
        action: "help:reportIssue",
      },
      { type: "separator" },
      {
        label: "About Mark9",
        action: "help:about",
      },
    ],
  },
]);

// Forward menu actions to the webview as RPC messages
ApplicationMenu.on("application-menu-clicked", (event: unknown) => {
  const menuEvent = event as { data: { action: string } };
  if (menuEvent?.data?.action) {
    rpc.send("menu:action", { action: menuEvent.data.action });
  }
});

// ─── Main window ─────────────────────────────────────────────────────

const mainWindow = new BrowserWindow({
  title: "Mark9",
  frame: {
    x: 100,
    y: 100,
    width: 1200,
    height: 800,
  },
  url: "views://main/index.html",
  titleBarStyle: "hiddenInset",
  transparent: false,
  sandbox: false,
  rpc,
});

// ─── File watcher integration ────────────────────────────────────────

let stopWatcher: (() => void) | null = null;

/**
 * Start watching a workspace directory and forward events to the webview.
 */
async function watchWorkspace(dir: string): Promise<void> {
  // Stop any existing watcher
  if (stopWatcher) {
    stopWatcher();
    stopWatcher = null;
  }

  stopWatcher = await fsOps.watch(dir, (event) => {
    rpc.send("fs:watch", event);
  });
}

// ─── Cleanup ─────────────────────────────────────────────────────────

Electrobun.events.on("before-quit", () => {
  fsOps.stopAllWatchers();
});

// Export for potential use in tests
export { mainWindow, rpc, watchWorkspace };
