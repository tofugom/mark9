// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __promiseAll = (args) => Promise.all(args);
var __require = import.meta.require;

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/events/event.ts
class ElectrobunEvent {
  name;
  data;
  _response;
  responseWasSet = false;
  constructor(name, data) {
    this.name = name;
    this.data = data;
  }
  get response() {
    return this._response;
  }
  set response(value) {
    this._response = value;
    this.responseWasSet = true;
  }
  clearResponse() {
    this._response = undefined;
    this.responseWasSet = false;
  }
}

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/events/windowEvents.ts
var windowEvents_default;
var init_windowEvents = __esm(() => {
  windowEvents_default = {
    close: (data) => new ElectrobunEvent("close", data),
    resize: (data) => new ElectrobunEvent("resize", data),
    move: (data) => new ElectrobunEvent("move", data),
    focus: (data) => new ElectrobunEvent("focus", data)
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/events/webviewEvents.ts
var webviewEvents_default;
var init_webviewEvents = __esm(() => {
  webviewEvents_default = {
    willNavigate: (data) => new ElectrobunEvent("will-navigate", data),
    didNavigate: (data) => new ElectrobunEvent("did-navigate", data),
    didNavigateInPage: (data) => new ElectrobunEvent("did-navigate-in-page", data),
    didCommitNavigation: (data) => new ElectrobunEvent("did-commit-navigation", data),
    domReady: (data) => new ElectrobunEvent("dom-ready", data),
    newWindowOpen: (data) => new ElectrobunEvent("new-window-open", data),
    hostMessage: (data) => new ElectrobunEvent("host-message", data),
    downloadStarted: (data) => new ElectrobunEvent("download-started", data),
    downloadProgress: (data) => new ElectrobunEvent("download-progress", data),
    downloadCompleted: (data) => new ElectrobunEvent("download-completed", data),
    downloadFailed: (data) => new ElectrobunEvent("download-failed", data)
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/events/trayEvents.ts
var trayEvents_default;
var init_trayEvents = __esm(() => {
  trayEvents_default = {
    trayClicked: (data) => new ElectrobunEvent("tray-clicked", data)
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/events/ApplicationEvents.ts
var ApplicationEvents_default;
var init_ApplicationEvents = __esm(() => {
  ApplicationEvents_default = {
    applicationMenuClicked: (data) => new ElectrobunEvent("application-menu-clicked", data),
    contextMenuClicked: (data) => new ElectrobunEvent("context-menu-clicked", data),
    openUrl: (data) => new ElectrobunEvent("open-url", data),
    beforeQuit: (data) => new ElectrobunEvent("before-quit", data)
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/events/eventEmitter.ts
import EventEmitter from "events";
var ElectrobunEventEmitter, electrobunEventEmitter, eventEmitter_default;
var init_eventEmitter = __esm(() => {
  init_windowEvents();
  init_webviewEvents();
  init_trayEvents();
  init_ApplicationEvents();
  ElectrobunEventEmitter = class ElectrobunEventEmitter extends EventEmitter {
    constructor() {
      super();
    }
    emitEvent(ElectrobunEvent2, specifier) {
      if (specifier) {
        this.emit(`${ElectrobunEvent2.name}-${specifier}`, ElectrobunEvent2);
      } else {
        this.emit(ElectrobunEvent2.name, ElectrobunEvent2);
      }
    }
    events = {
      window: {
        ...windowEvents_default
      },
      webview: {
        ...webviewEvents_default
      },
      tray: {
        ...trayEvents_default
      },
      app: {
        ...ApplicationEvents_default
      }
    };
  };
  electrobunEventEmitter = new ElectrobunEventEmitter;
  eventEmitter_default = electrobunEventEmitter;
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/shared/rpc.ts
function missingTransportMethodError(methods, action) {
  const methodsString = methods.map((m) => `"${m}"`).join(", ");
  return new Error(`This RPC instance cannot ${action} because the transport did not provide one or more of these methods: ${methodsString}`);
}
function createRPC(options = {}) {
  let debugHooks = {};
  let transport = {};
  let requestHandler = undefined;
  function setTransport(newTransport) {
    if (transport.unregisterHandler)
      transport.unregisterHandler();
    transport = newTransport;
    transport.registerHandler?.(handler);
  }
  function setRequestHandler(h) {
    if (typeof h === "function") {
      requestHandler = h;
      return;
    }
    requestHandler = (method, params) => {
      const handlerFn = h[method];
      if (handlerFn)
        return handlerFn(params);
      const fallbackHandler = h._;
      if (!fallbackHandler)
        throw new Error(`The requested method has no handler: ${String(method)}`);
      return fallbackHandler(method, params);
    };
  }
  const { maxRequestTime = DEFAULT_MAX_REQUEST_TIME } = options;
  if (options.transport)
    setTransport(options.transport);
  if (options.requestHandler)
    setRequestHandler(options.requestHandler);
  if (options._debugHooks)
    debugHooks = options._debugHooks;
  let lastRequestId = 0;
  function getRequestId() {
    if (lastRequestId <= MAX_ID)
      return ++lastRequestId;
    return lastRequestId = 0;
  }
  const requestListeners = new Map;
  const requestTimeouts = new Map;
  function requestFn(method, ...args) {
    const params = args[0];
    return new Promise((resolve, reject) => {
      if (!transport.send)
        throw missingTransportMethodError(["send"], "make requests");
      const requestId = getRequestId();
      const request2 = {
        type: "request",
        id: requestId,
        method,
        params
      };
      requestListeners.set(requestId, { resolve, reject });
      if (maxRequestTime !== Infinity)
        requestTimeouts.set(requestId, setTimeout(() => {
          requestTimeouts.delete(requestId);
          reject(new Error("RPC request timed out."));
        }, maxRequestTime));
      debugHooks.onSend?.(request2);
      transport.send(request2);
    });
  }
  const request = new Proxy(requestFn, {
    get: (target, prop, receiver) => {
      if (prop in target)
        return Reflect.get(target, prop, receiver);
      return (params) => requestFn(prop, params);
    }
  });
  const requestProxy = request;
  function sendFn(message, ...args) {
    const payload = args[0];
    if (!transport.send)
      throw missingTransportMethodError(["send"], "send messages");
    const rpcMessage = {
      type: "message",
      id: message,
      payload
    };
    debugHooks.onSend?.(rpcMessage);
    transport.send(rpcMessage);
  }
  const send = new Proxy(sendFn, {
    get: (target, prop, receiver) => {
      if (prop in target)
        return Reflect.get(target, prop, receiver);
      return (payload) => sendFn(prop, payload);
    }
  });
  const sendProxy = send;
  const messageListeners = new Map;
  const wildcardMessageListeners = new Set;
  function addMessageListener(message, listener) {
    if (!transport.registerHandler)
      throw missingTransportMethodError(["registerHandler"], "register message listeners");
    if (message === "*") {
      wildcardMessageListeners.add(listener);
      return;
    }
    if (!messageListeners.has(message))
      messageListeners.set(message, new Set);
    messageListeners.get(message).add(listener);
  }
  function removeMessageListener(message, listener) {
    if (message === "*") {
      wildcardMessageListeners.delete(listener);
      return;
    }
    messageListeners.get(message)?.delete(listener);
    if (messageListeners.get(message)?.size === 0)
      messageListeners.delete(message);
  }
  async function handler(message) {
    debugHooks.onReceive?.(message);
    if (!("type" in message))
      throw new Error("Message does not contain a type.");
    if (message.type === "request") {
      if (!transport.send || !requestHandler)
        throw missingTransportMethodError(["send", "requestHandler"], "handle requests");
      const { id, method, params } = message;
      let response;
      try {
        response = {
          type: "response",
          id,
          success: true,
          payload: await requestHandler(method, params)
        };
      } catch (error) {
        if (!(error instanceof Error))
          throw error;
        response = {
          type: "response",
          id,
          success: false,
          error: error.message
        };
      }
      debugHooks.onSend?.(response);
      transport.send(response);
      return;
    }
    if (message.type === "response") {
      const timeout = requestTimeouts.get(message.id);
      if (timeout != null)
        clearTimeout(timeout);
      const { resolve, reject } = requestListeners.get(message.id) ?? {};
      if (!message.success)
        reject?.(new Error(message.error));
      else
        resolve?.(message.payload);
      return;
    }
    if (message.type === "message") {
      for (const listener of wildcardMessageListeners)
        listener(message.id, message.payload);
      const listeners = messageListeners.get(message.id);
      if (!listeners)
        return;
      for (const listener of listeners)
        listener(message.payload);
      return;
    }
    throw new Error(`Unexpected RPC message type: ${message.type}`);
  }
  const proxy = { send: sendProxy, request: requestProxy };
  return {
    setTransport,
    setRequestHandler,
    request,
    requestProxy,
    send,
    sendProxy,
    addMessageListener,
    removeMessageListener,
    proxy
  };
}
function defineElectrobunRPC(_side, config) {
  const rpcOptions = {
    maxRequestTime: config.maxRequestTime,
    requestHandler: {
      ...config.handlers.requests,
      ...config.extraRequestHandlers
    },
    transport: {
      registerHandler: () => {}
    }
  };
  const rpc = createRPC(rpcOptions);
  const messageHandlers = config.handlers.messages;
  if (messageHandlers) {
    rpc.addMessageListener("*", (messageName, payload) => {
      const globalHandler = messageHandlers["*"];
      if (globalHandler) {
        globalHandler(messageName, payload);
      }
      const messageHandler = messageHandlers[messageName];
      if (messageHandler) {
        messageHandler(payload);
      }
    });
  }
  return rpc;
}
var MAX_ID = 10000000000, DEFAULT_MAX_REQUEST_TIME = 1000;

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/shared/platform.ts
import { platform, arch } from "os";
var platformName, archName, OS, ARCH;
var init_platform = __esm(() => {
  platformName = platform();
  archName = arch();
  OS = (() => {
    switch (platformName) {
      case "win32":
        return "win";
      case "darwin":
        return "macos";
      case "linux":
        return "linux";
      default:
        throw new Error(`Unsupported platform: ${platformName}`);
    }
  })();
  ARCH = (() => {
    if (OS === "win") {
      return "x64";
    }
    switch (archName) {
      case "arm64":
        return "arm64";
      case "x64":
        return "x64";
      default:
        throw new Error(`Unsupported architecture: ${archName}`);
    }
  })();
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/shared/naming.ts
function sanitizeAppName(appName) {
  return appName.replace(/ /g, "");
}
function getAppFileName(appName, buildEnvironment) {
  const sanitized = sanitizeAppName(appName);
  return buildEnvironment === "stable" ? sanitized : `${sanitized}-${buildEnvironment}`;
}
function getPlatformPrefix(buildEnvironment, os, arch2) {
  return `${buildEnvironment}-${os}-${arch2}`;
}
function getTarballFileName(appFileName, os) {
  return os === "macos" ? `${appFileName}.app.tar.zst` : `${appFileName}.tar.zst`;
}

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/Utils.ts
var exports_Utils = {};
__export(exports_Utils, {
  showNotification: () => showNotification,
  showMessageBox: () => showMessageBox,
  showItemInFolder: () => showItemInFolder,
  quit: () => quit,
  paths: () => paths,
  openPath: () => openPath,
  openFileDialog: () => openFileDialog,
  openExternal: () => openExternal,
  moveToTrash: () => moveToTrash,
  clipboardWriteText: () => clipboardWriteText,
  clipboardWriteImage: () => clipboardWriteImage,
  clipboardReadText: () => clipboardReadText,
  clipboardReadImage: () => clipboardReadImage,
  clipboardClear: () => clipboardClear,
  clipboardAvailableFormats: () => clipboardAvailableFormats
});
import { homedir, tmpdir } from "os";
import { join } from "path";
import { readFileSync } from "fs";
function getLinuxXdgUserDirs() {
  try {
    const content = readFileSync(join(home, ".config", "user-dirs.dirs"), "utf-8");
    const dirs = {};
    for (const line of content.split(`
`)) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("="))
        continue;
      const eqIdx = trimmed.indexOf("=");
      const key = trimmed.slice(0, eqIdx);
      let value = trimmed.slice(eqIdx + 1);
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      value = value.replace(/\$HOME/g, home);
      dirs[key] = value;
    }
    return dirs;
  } catch {
    return {};
  }
}
function xdgUserDir(key, fallbackName) {
  if (OS !== "linux")
    return "";
  if (!_xdgUserDirs)
    _xdgUserDirs = getLinuxXdgUserDirs();
  return _xdgUserDirs[key] || join(home, fallbackName);
}
function getVersionInfo() {
  if (_versionInfo)
    return _versionInfo;
  try {
    const resourcesDir = "Resources";
    const raw = readFileSync(join("..", resourcesDir, "version.json"), "utf-8");
    const parsed = JSON.parse(raw);
    _versionInfo = { identifier: parsed.identifier, channel: parsed.channel };
    return _versionInfo;
  } catch (error) {
    console.error("Failed to read version.json", error);
    throw error;
  }
}
function getAppDataDir() {
  switch (OS) {
    case "macos":
      return join(home, "Library", "Application Support");
    case "win":
      return process.env["LOCALAPPDATA"] || join(home, "AppData", "Local");
    case "linux":
      return process.env["XDG_DATA_HOME"] || join(home, ".local", "share");
  }
}
function getCacheDir() {
  switch (OS) {
    case "macos":
      return join(home, "Library", "Caches");
    case "win":
      return process.env["LOCALAPPDATA"] || join(home, "AppData", "Local");
    case "linux":
      return process.env["XDG_CACHE_HOME"] || join(home, ".cache");
  }
}
function getLogsDir() {
  switch (OS) {
    case "macos":
      return join(home, "Library", "Logs");
    case "win":
      return process.env["LOCALAPPDATA"] || join(home, "AppData", "Local");
    case "linux":
      return process.env["XDG_STATE_HOME"] || join(home, ".local", "state");
  }
}
function getConfigDir() {
  switch (OS) {
    case "macos":
      return join(home, "Library", "Application Support");
    case "win":
      return process.env["APPDATA"] || join(home, "AppData", "Roaming");
    case "linux":
      return process.env["XDG_CONFIG_HOME"] || join(home, ".config");
  }
}
function getUserDir(macName, winName, xdgKey, fallbackName) {
  switch (OS) {
    case "macos":
      return join(home, macName);
    case "win": {
      const userProfile = process.env["USERPROFILE"] || home;
      return join(userProfile, winName);
    }
    case "linux":
      return xdgUserDir(xdgKey, fallbackName);
  }
}
var moveToTrash = (path) => {
  return ffi.request.moveToTrash({ path });
}, showItemInFolder = (path) => {
  return ffi.request.showItemInFolder({ path });
}, openExternal = (url) => {
  return ffi.request.openExternal({ url });
}, openPath = (path) => {
  return ffi.request.openPath({ path });
}, showNotification = (options) => {
  const { title, body, subtitle, silent } = options;
  ffi.request.showNotification({ title, body, subtitle, silent });
}, isQuitting = false, quit = () => {
  if (isQuitting)
    return;
  isQuitting = true;
  const beforeQuitEvent = electrobunEventEmitter.events.app.beforeQuit({});
  electrobunEventEmitter.emitEvent(beforeQuitEvent);
  if (beforeQuitEvent.responseWasSet && beforeQuitEvent.response?.allow === false) {
    isQuitting = false;
    return;
  }
  native.symbols.stopEventLoop();
  native.symbols.waitForShutdownComplete(5000);
  native.symbols.forceExit(0);
}, openFileDialog = async (opts = {}) => {
  const optsWithDefault = {
    ...{
      startingFolder: "~/",
      allowedFileTypes: "*",
      canChooseFiles: true,
      canChooseDirectory: true,
      allowsMultipleSelection: true
    },
    ...opts
  };
  const result = await ffi.request.openFileDialog({
    startingFolder: optsWithDefault.startingFolder,
    allowedFileTypes: optsWithDefault.allowedFileTypes,
    canChooseFiles: optsWithDefault.canChooseFiles,
    canChooseDirectory: optsWithDefault.canChooseDirectory,
    allowsMultipleSelection: optsWithDefault.allowsMultipleSelection
  });
  const filePaths = result.split(",");
  return filePaths;
}, showMessageBox = async (opts = {}) => {
  const {
    type = "info",
    title = "",
    message = "",
    detail = "",
    buttons = ["OK"],
    defaultId = 0,
    cancelId = -1
  } = opts;
  const response = ffi.request.showMessageBox({
    type,
    title,
    message,
    detail,
    buttons,
    defaultId,
    cancelId
  });
  return { response };
}, clipboardReadText = () => {
  return ffi.request.clipboardReadText();
}, clipboardWriteText = (text) => {
  ffi.request.clipboardWriteText({ text });
}, clipboardReadImage = () => {
  return ffi.request.clipboardReadImage();
}, clipboardWriteImage = (pngData) => {
  ffi.request.clipboardWriteImage({ pngData });
}, clipboardClear = () => {
  ffi.request.clipboardClear();
}, clipboardAvailableFormats = () => {
  return ffi.request.clipboardAvailableFormats();
}, home, _xdgUserDirs, _versionInfo, paths;
var init_Utils = __esm(async () => {
  init_eventEmitter();
  init_platform();
  await init_native();
  process.exit = (code) => {
    if (isQuitting) {
      native.symbols.forceExit(code ?? 0);
      return;
    }
    quit();
  };
  home = homedir();
  paths = {
    get home() {
      return home;
    },
    get appData() {
      return getAppDataDir();
    },
    get config() {
      return getConfigDir();
    },
    get cache() {
      return getCacheDir();
    },
    get temp() {
      return tmpdir();
    },
    get logs() {
      return getLogsDir();
    },
    get documents() {
      return getUserDir("Documents", "Documents", "XDG_DOCUMENTS_DIR", "Documents");
    },
    get downloads() {
      return getUserDir("Downloads", "Downloads", "XDG_DOWNLOAD_DIR", "Downloads");
    },
    get desktop() {
      return getUserDir("Desktop", "Desktop", "XDG_DESKTOP_DIR", "Desktop");
    },
    get pictures() {
      return getUserDir("Pictures", "Pictures", "XDG_PICTURES_DIR", "Pictures");
    },
    get music() {
      return getUserDir("Music", "Music", "XDG_MUSIC_DIR", "Music");
    },
    get videos() {
      return getUserDir("Movies", "Videos", "XDG_VIDEOS_DIR", "Videos");
    },
    get userData() {
      const { identifier, channel } = getVersionInfo();
      return join(getAppDataDir(), identifier, channel);
    },
    get userCache() {
      const { identifier, channel } = getVersionInfo();
      return join(getCacheDir(), identifier, channel);
    },
    get userLogs() {
      const { identifier, channel } = getVersionInfo();
      return join(getLogsDir(), identifier, channel);
    }
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/Updater.ts
import { join as join2, dirname, resolve } from "path";
import { homedir as homedir2 } from "os";
import {
  renameSync,
  unlinkSync,
  mkdirSync,
  rmdirSync,
  statSync,
  readdirSync
} from "fs";
import { execSync } from "child_process";
function emitStatus(status, message, details) {
  const entry = {
    status,
    message,
    timestamp: Date.now(),
    details
  };
  statusHistory.push(entry);
  if (onStatusChangeCallback) {
    onStatusChangeCallback(entry);
  }
}
function getAppDataDir2() {
  switch (OS) {
    case "macos":
      return join2(homedir2(), "Library", "Application Support");
    case "win":
      return process.env["LOCALAPPDATA"] || join2(homedir2(), "AppData", "Local");
    case "linux":
      return process.env["XDG_DATA_HOME"] || join2(homedir2(), ".local", "share");
    default:
      return join2(homedir2(), ".config");
  }
}
function cleanupExtractionFolder(extractionFolder, keepTarHash) {
  const keepFile = `${keepTarHash}.tar`;
  try {
    const entries = readdirSync(extractionFolder);
    for (const entry of entries) {
      if (entry === keepFile)
        continue;
      const fullPath = join2(extractionFolder, entry);
      try {
        const s = statSync(fullPath);
        if (s.isDirectory()) {
          rmdirSync(fullPath, { recursive: true });
        } else {
          unlinkSync(fullPath);
        }
      } catch (e) {}
    }
  } catch (e) {}
}
var statusHistory, onStatusChangeCallback = null, localInfo, updateInfo, Updater;
var init_Updater = __esm(async () => {
  init_platform();
  await init_Utils();
  statusHistory = [];
  Updater = {
    updateInfo: () => {
      return updateInfo;
    },
    getStatusHistory: () => {
      return [...statusHistory];
    },
    clearStatusHistory: () => {
      statusHistory.length = 0;
    },
    onStatusChange: (callback) => {
      onStatusChangeCallback = callback;
    },
    checkForUpdate: async () => {
      emitStatus("checking", "Checking for updates...");
      const localInfo2 = await Updater.getLocallocalInfo();
      if (localInfo2.channel === "dev") {
        emitStatus("no-update", "Dev channel - updates disabled", {
          currentHash: localInfo2.hash
        });
        return {
          version: localInfo2.version,
          hash: localInfo2.hash,
          updateAvailable: false,
          updateReady: false,
          error: ""
        };
      }
      const cacheBuster = Math.random().toString(36).substring(7);
      const platformPrefix = getPlatformPrefix(localInfo2.channel, OS, ARCH);
      const updateInfoUrl = `${localInfo2.baseUrl.replace(/\/+$/, "")}/${platformPrefix}-update.json?${cacheBuster}`;
      try {
        const updateInfoResponse = await fetch(updateInfoUrl);
        if (updateInfoResponse.ok) {
          const responseText = await updateInfoResponse.text();
          try {
            updateInfo = JSON.parse(responseText);
          } catch {
            emitStatus("error", "Invalid update.json: failed to parse JSON", {
              url: updateInfoUrl
            });
            return {
              version: "",
              hash: "",
              updateAvailable: false,
              updateReady: false,
              error: `Invalid update.json: failed to parse JSON`
            };
          }
          if (!updateInfo.hash) {
            emitStatus("error", "Invalid update.json: missing hash", {
              url: updateInfoUrl
            });
            return {
              version: "",
              hash: "",
              updateAvailable: false,
              updateReady: false,
              error: `Invalid update.json: missing hash`
            };
          }
          if (updateInfo.hash !== localInfo2.hash) {
            updateInfo.updateAvailable = true;
            emitStatus("update-available", `Update available: ${localInfo2.hash.slice(0, 8)} \u2192 ${updateInfo.hash.slice(0, 8)}`, {
              currentHash: localInfo2.hash,
              latestHash: updateInfo.hash
            });
          } else {
            emitStatus("no-update", "Already on latest version", {
              currentHash: localInfo2.hash
            });
          }
        } else {
          emitStatus("error", `Failed to fetch update info (HTTP ${updateInfoResponse.status})`, { url: updateInfoUrl });
          return {
            version: "",
            hash: "",
            updateAvailable: false,
            updateReady: false,
            error: `Failed to fetch update info from ${updateInfoUrl}`
          };
        }
      } catch (error) {
        return {
          version: "",
          hash: "",
          updateAvailable: false,
          updateReady: false,
          error: `Failed to fetch update info from ${updateInfoUrl}`
        };
      }
      return updateInfo;
    },
    downloadUpdate: async () => {
      emitStatus("download-starting", "Starting update download...");
      const appDataFolder = await Updater.appDataFolder();
      await Updater.channelBucketUrl();
      const appFileName = localInfo.name;
      let currentHash = (await Updater.getLocallocalInfo()).hash;
      let latestHash = (await Updater.checkForUpdate()).hash;
      const extractionFolder = join2(appDataFolder, "self-extraction");
      if (!await Bun.file(extractionFolder).exists()) {
        mkdirSync(extractionFolder, { recursive: true });
      }
      let currentTarPath = join2(extractionFolder, `${currentHash}.tar`);
      const latestTarPath = join2(extractionFolder, `${latestHash}.tar`);
      const seenHashes = [];
      let patchesApplied = 0;
      let usedPatchPath = false;
      if (!await Bun.file(latestTarPath).exists()) {
        emitStatus("checking-local-tar", `Checking for local tar file: ${currentHash.slice(0, 8)}`, { currentHash });
        while (currentHash !== latestHash) {
          seenHashes.push(currentHash);
          const currentTar = Bun.file(currentTarPath);
          if (!await currentTar.exists()) {
            emitStatus("local-tar-missing", `Local tar not found for ${currentHash.slice(0, 8)}, will download full bundle`, { currentHash });
            break;
          }
          emitStatus("local-tar-found", `Found local tar for ${currentHash.slice(0, 8)}`, { currentHash });
          const platformPrefix = getPlatformPrefix(localInfo.channel, OS, ARCH);
          const patchUrl = `${localInfo.baseUrl.replace(/\/+$/, "")}/${platformPrefix}-${currentHash}.patch`;
          emitStatus("fetching-patch", `Checking for patch: ${currentHash.slice(0, 8)}`, { currentHash, url: patchUrl });
          const patchResponse = await fetch(patchUrl);
          if (!patchResponse.ok) {
            emitStatus("patch-not-found", `No patch available for ${currentHash.slice(0, 8)}, will download full bundle`, { currentHash });
            break;
          }
          emitStatus("patch-found", `Patch found for ${currentHash.slice(0, 8)}`, { currentHash });
          emitStatus("downloading-patch", `Downloading patch for ${currentHash.slice(0, 8)}...`, { currentHash });
          const patchFilePath = join2(appDataFolder, "self-extraction", `${currentHash}.patch`);
          await Bun.write(patchFilePath, await patchResponse.arrayBuffer());
          const tmpPatchedTarFilePath = join2(appDataFolder, "self-extraction", `from-${currentHash}.tar`);
          const bunBinDir = dirname(process.execPath);
          const bspatchBinName = OS === "win" ? "bspatch.exe" : "bspatch";
          const bspatchPath = join2(bunBinDir, bspatchBinName);
          emitStatus("applying-patch", `Applying patch ${patchesApplied + 1} for ${currentHash.slice(0, 8)}...`, {
            currentHash,
            patchNumber: patchesApplied + 1
          });
          if (!statSync(bspatchPath, { throwIfNoEntry: false })) {
            emitStatus("patch-failed", `bspatch binary not found at ${bspatchPath}`, {
              currentHash,
              errorMessage: `bspatch not found: ${bspatchPath}`
            });
            console.error("bspatch not found:", bspatchPath);
            break;
          }
          if (!statSync(currentTarPath, { throwIfNoEntry: false })) {
            emitStatus("patch-failed", `Old tar not found at ${currentTarPath}`, {
              currentHash,
              errorMessage: `old tar not found: ${currentTarPath}`
            });
            console.error("old tar not found:", currentTarPath);
            break;
          }
          if (!statSync(patchFilePath, { throwIfNoEntry: false })) {
            emitStatus("patch-failed", `Patch file not found at ${patchFilePath}`, {
              currentHash,
              errorMessage: `patch not found: ${patchFilePath}`
            });
            console.error("patch file not found:", patchFilePath);
            break;
          }
          try {
            const patchResult = Bun.spawnSync([
              bspatchPath,
              currentTarPath,
              tmpPatchedTarFilePath,
              patchFilePath
            ]);
            if (patchResult.exitCode !== 0 || patchResult.success === false) {
              const stderr = patchResult.stderr ? patchResult.stderr.toString() : "";
              const stdout = patchResult.stdout ? patchResult.stdout.toString() : "";
              if (updateInfo) {
                updateInfo.error = stderr || `bspatch failed with exit code ${patchResult.exitCode}`;
              }
              emitStatus("patch-failed", `Patch application failed: ${stderr || `exit code ${patchResult.exitCode}`}`, {
                currentHash,
                errorMessage: stderr || `exit code ${patchResult.exitCode}`
              });
              console.error("bspatch failed", {
                exitCode: patchResult.exitCode,
                stdout,
                stderr,
                bspatchPath,
                oldTar: currentTarPath,
                newTar: tmpPatchedTarFilePath,
                patch: patchFilePath
              });
              break;
            }
          } catch (error) {
            emitStatus("patch-failed", `Patch threw exception: ${error.message}`, {
              currentHash,
              errorMessage: error.message
            });
            console.error("bspatch threw", error, { bspatchPath });
            break;
          }
          patchesApplied++;
          emitStatus("patch-applied", `Patch ${patchesApplied} applied successfully`, {
            currentHash,
            patchNumber: patchesApplied
          });
          emitStatus("extracting-version", "Extracting version info from patched tar...", { currentHash });
          let hashFilePath = "";
          const resourcesDir = "Resources";
          const patchedTarBytes = await Bun.file(tmpPatchedTarFilePath).arrayBuffer();
          const patchedArchive = new Bun.Archive(patchedTarBytes);
          const patchedFiles = await patchedArchive.files();
          for (const [filePath] of patchedFiles) {
            if (filePath.endsWith(`${resourcesDir}/version.json`) || filePath.endsWith("metadata.json")) {
              hashFilePath = filePath;
              break;
            }
          }
          if (!hashFilePath) {
            emitStatus("error", "Could not find version/metadata file in patched tar", { currentHash });
            console.error("Neither Resources/version.json nor metadata.json found in patched tar:", tmpPatchedTarFilePath);
            break;
          }
          const hashFile = patchedFiles.get(hashFilePath);
          const hashFileJson = JSON.parse(await hashFile.text());
          const nextHash = hashFileJson.hash;
          if (seenHashes.includes(nextHash)) {
            emitStatus("error", "Cyclical update detected, falling back to full download", { currentHash: nextHash });
            console.log("Warning: cyclical update detected");
            break;
          }
          seenHashes.push(nextHash);
          if (!nextHash) {
            emitStatus("error", "Could not determine next hash from patched tar", { currentHash });
            break;
          }
          const updatedTarPath = join2(appDataFolder, "self-extraction", `${nextHash}.tar`);
          renameSync(tmpPatchedTarFilePath, updatedTarPath);
          unlinkSync(currentTarPath);
          unlinkSync(patchFilePath);
          currentHash = nextHash;
          currentTarPath = join2(appDataFolder, "self-extraction", `${currentHash}.tar`);
          emitStatus("patch-applied", `Patched to ${nextHash.slice(0, 8)}, checking for more patches...`, {
            currentHash: nextHash,
            toHash: latestHash,
            totalPatchesApplied: patchesApplied
          });
        }
        if (currentHash === latestHash && patchesApplied > 0) {
          usedPatchPath = true;
          emitStatus("patch-chain-complete", `Patch chain complete! Applied ${patchesApplied} patches`, {
            totalPatchesApplied: patchesApplied,
            currentHash: latestHash,
            usedPatchPath: true
          });
        }
        if (currentHash !== latestHash) {
          emitStatus("downloading-full-bundle", "Downloading full update bundle...", {
            currentHash,
            latestHash,
            usedPatchPath: false
          });
          const cacheBuster = Math.random().toString(36).substring(7);
          const platformPrefix = getPlatformPrefix(localInfo.channel, OS, ARCH);
          const tarballName = getTarballFileName(appFileName, OS);
          const urlToLatestTarball = `${localInfo.baseUrl.replace(/\/+$/, "")}/${platformPrefix}-${tarballName}`;
          const prevVersionCompressedTarballPath = join2(appDataFolder, "self-extraction", "latest.tar.zst");
          emitStatus("download-progress", `Fetching ${tarballName}...`, {
            url: urlToLatestTarball
          });
          const response = await fetch(urlToLatestTarball + `?${cacheBuster}`);
          if (response.ok && response.body) {
            const contentLength = response.headers.get("content-length");
            const totalBytes = contentLength ? parseInt(contentLength, 10) : undefined;
            let bytesDownloaded = 0;
            const reader = response.body.getReader();
            const writer = Bun.file(prevVersionCompressedTarballPath).writer();
            while (true) {
              const { done, value } = await reader.read();
              if (done)
                break;
              await writer.write(value);
              bytesDownloaded += value.length;
              if (bytesDownloaded % 500000 < value.length) {
                emitStatus("download-progress", `Downloading: ${(bytesDownloaded / 1024 / 1024).toFixed(1)} MB`, {
                  bytesDownloaded,
                  totalBytes,
                  progress: totalBytes ? Math.round(bytesDownloaded / totalBytes * 100) : undefined
                });
              }
            }
            await writer.flush();
            writer.end();
            emitStatus("download-progress", `Download complete: ${(bytesDownloaded / 1024 / 1024).toFixed(1)} MB`, {
              bytesDownloaded,
              totalBytes,
              progress: 100
            });
          } else {
            emitStatus("error", `Failed to download: ${urlToLatestTarball}`, {
              url: urlToLatestTarball
            });
            console.log("latest version not found at: ", urlToLatestTarball);
          }
          emitStatus("decompressing", "Decompressing update bundle...");
          const bunBinDir = dirname(process.execPath);
          const zstdBinName = OS === "win" ? "zig-zstd.exe" : "zig-zstd";
          const zstdPath = join2(bunBinDir, zstdBinName);
          if (!statSync(zstdPath, { throwIfNoEntry: false })) {
            updateInfo.error = `zig-zstd not found: ${zstdPath}`;
            emitStatus("error", updateInfo.error, { zstdPath });
            console.error("zig-zstd not found:", zstdPath);
          } else {
            const decompressResult = Bun.spawnSync([
              zstdPath,
              "decompress",
              "-i",
              prevVersionCompressedTarballPath,
              "-o",
              latestTarPath,
              "--no-timing"
            ], {
              cwd: extractionFolder,
              stdout: "inherit",
              stderr: "inherit"
            });
            if (!decompressResult.success) {
              updateInfo.error = `zig-zstd failed with exit code ${decompressResult.exitCode}`;
              emitStatus("error", updateInfo.error, {
                zstdPath,
                exitCode: decompressResult.exitCode
              });
              console.error("zig-zstd failed", {
                exitCode: decompressResult.exitCode,
                zstdPath
              });
            } else {
              emitStatus("decompressing", "Decompression complete");
            }
          }
          unlinkSync(prevVersionCompressedTarballPath);
        }
      }
      if (await Bun.file(latestTarPath).exists()) {
        updateInfo.updateReady = true;
        emitStatus("download-complete", `Update ready to install (used ${usedPatchPath ? "patch" : "full download"} path)`, {
          latestHash,
          usedPatchPath,
          totalPatchesApplied: patchesApplied
        });
      } else {
        updateInfo.error = "Failed to download latest version";
        emitStatus("error", "Failed to download latest version", { latestHash });
      }
      cleanupExtractionFolder(extractionFolder, latestHash);
    },
    applyUpdate: async () => {
      if (updateInfo?.updateReady) {
        emitStatus("applying", "Starting update installation...");
        const appDataFolder = await Updater.appDataFolder();
        const extractionFolder = join2(appDataFolder, "self-extraction");
        if (!await Bun.file(extractionFolder).exists()) {
          mkdirSync(extractionFolder, { recursive: true });
        }
        let latestHash = (await Updater.checkForUpdate()).hash;
        const latestTarPath = join2(extractionFolder, `${latestHash}.tar`);
        let appBundleSubpath = "";
        if (await Bun.file(latestTarPath).exists()) {
          emitStatus("extracting", `Extracting update to ${latestHash.slice(0, 8)}...`, { latestHash });
          const extractionDir = OS === "win" ? join2(extractionFolder, `temp-${latestHash}`) : extractionFolder;
          if (OS === "win") {
            mkdirSync(extractionDir, { recursive: true });
          }
          const latestTarBytes = await Bun.file(latestTarPath).arrayBuffer();
          const latestArchive = new Bun.Archive(latestTarBytes);
          await latestArchive.extract(extractionDir);
          if (OS === "macos") {
            const extractedFiles = readdirSync(extractionDir);
            for (const file of extractedFiles) {
              if (file.endsWith(".app")) {
                appBundleSubpath = file + "/";
                break;
              }
            }
          } else {
            appBundleSubpath = "./";
          }
          console.log(`Tar extraction completed. Found appBundleSubpath: ${appBundleSubpath}`);
          if (!appBundleSubpath) {
            console.error("Failed to find app in tarball");
            return;
          }
          const extractedAppPath = resolve(join2(extractionDir, appBundleSubpath));
          let newAppBundlePath;
          if (OS === "linux") {
            const extractedFiles = readdirSync(extractionDir);
            const appBundleDir = extractedFiles.find((file) => {
              const filePath = join2(extractionDir, file);
              return statSync(filePath).isDirectory() && !file.endsWith(".tar");
            });
            if (!appBundleDir) {
              console.error("Could not find app bundle directory in extraction");
              return;
            }
            newAppBundlePath = join2(extractionDir, appBundleDir);
            const bundleStats = statSync(newAppBundlePath, { throwIfNoEntry: false });
            if (!bundleStats || !bundleStats.isDirectory()) {
              console.error(`App bundle directory not found at: ${newAppBundlePath}`);
              console.log("Contents of extraction directory:");
              try {
                const files = readdirSync(extractionDir);
                for (const file of files) {
                  console.log(`  - ${file}`);
                  const subPath = join2(extractionDir, file);
                  if (statSync(subPath).isDirectory()) {
                    const subFiles = readdirSync(subPath);
                    for (const subFile of subFiles) {
                      console.log(`    - ${subFile}`);
                    }
                  }
                }
              } catch (e) {
                console.log("Could not list directory contents:", e);
              }
              return;
            }
          } else if (OS === "win") {
            const appBundleName = getAppFileName(localInfo.name, localInfo.channel);
            newAppBundlePath = join2(extractionDir, appBundleName);
            if (!statSync(newAppBundlePath, { throwIfNoEntry: false })) {
              console.error(`Extracted app not found at: ${newAppBundlePath}`);
              console.log("Contents of extraction directory:");
              try {
                const files = readdirSync(extractionDir);
                for (const file of files) {
                  console.log(`  - ${file}`);
                }
              } catch (e) {
                console.log("Could not list directory contents:", e);
              }
              return;
            }
          } else {
            newAppBundlePath = extractedAppPath;
          }
          let runningAppBundlePath;
          const appDataFolder2 = await Updater.appDataFolder();
          if (OS === "macos") {
            runningAppBundlePath = resolve(dirname(process.execPath), "..", "..");
          } else if (OS === "linux" || OS === "win") {
            runningAppBundlePath = join2(appDataFolder2, "app");
          } else {
            throw new Error(`Unsupported platform: ${OS}`);
          }
          try {
            emitStatus("replacing-app", "Removing old version...");
            if (OS === "macos") {
              if (statSync(runningAppBundlePath, { throwIfNoEntry: false })) {
                rmdirSync(runningAppBundlePath, { recursive: true });
              }
              emitStatus("replacing-app", "Installing new version...");
              renameSync(newAppBundlePath, runningAppBundlePath);
              try {
                execSync(`xattr -r -d com.apple.quarantine "${runningAppBundlePath}"`, { stdio: "ignore" });
              } catch (e) {}
            } else if (OS === "linux") {
              const appBundleDir = join2(appDataFolder2, "app");
              if (statSync(appBundleDir, { throwIfNoEntry: false })) {
                rmdirSync(appBundleDir, { recursive: true });
              }
              renameSync(newAppBundlePath, appBundleDir);
              const launcherPath = join2(appBundleDir, "bin", "launcher");
              if (statSync(launcherPath, { throwIfNoEntry: false })) {
                execSync(`chmod +x "${launcherPath}"`);
              }
              const bunPath = join2(appBundleDir, "bin", "bun");
              if (statSync(bunPath, { throwIfNoEntry: false })) {
                execSync(`chmod +x "${bunPath}"`);
              }
            }
            if (OS !== "win") {
              cleanupExtractionFolder(extractionFolder, latestHash);
            }
            if (OS === "win") {
              const parentDir = dirname(runningAppBundlePath);
              const updateScriptPath = join2(parentDir, "update.bat");
              const launcherPath = join2(runningAppBundlePath, "bin", "launcher.exe");
              const runningAppWin = runningAppBundlePath.replace(/\//g, "\\");
              const newAppWin = newAppBundlePath.replace(/\//g, "\\");
              const extractionDirWin = extractionDir.replace(/\//g, "\\");
              const launcherPathWin = launcherPath.replace(/\//g, "\\");
              const updateScript = `@echo off
setlocal

:: Wait for the app to fully exit (check if launcher.exe is still running)
:waitloop
tasklist /FI "IMAGENAME eq launcher.exe" 2>NUL | find /I /N "launcher.exe">NUL
if "%ERRORLEVEL%"=="0" (
    timeout /t 1 /nobreak >nul
    goto waitloop
)

:: Small extra delay to ensure all file handles are released
timeout /t 2 /nobreak >nul

:: Remove current app folder
if exist "${runningAppWin}" (
    rmdir /s /q "${runningAppWin}"
)

:: Move new app to current location
move "${newAppWin}" "${runningAppWin}"

:: Clean up extraction directory
rmdir /s /q "${extractionDirWin}" 2>nul

:: Launch the new app
start "" "${launcherPathWin}"

:: Clean up scheduled tasks starting with ElectrobunUpdate_
for /f "tokens=1" %%t in ('schtasks /query /fo list ^| findstr /i "ElectrobunUpdate_"') do (
    schtasks /delete /tn "%%t" /f >nul 2>&1
)

:: Delete this update script after a short delay
ping -n 2 127.0.0.1 >nul
del "%~f0"
`;
              await Bun.write(updateScriptPath, updateScript);
              const scriptPathWin = updateScriptPath.replace(/\//g, "\\");
              const taskName = `ElectrobunUpdate_${Date.now()}`;
              execSync(`schtasks /create /tn "${taskName}" /tr "cmd /c \\"${scriptPathWin}\\"" /sc once /st 00:00 /f`, { stdio: "ignore" });
              execSync(`schtasks /run /tn "${taskName}"`, { stdio: "ignore" });
              quit();
            }
          } catch (error) {
            emitStatus("error", `Failed to replace app: ${error.message}`, {
              errorMessage: error.message
            });
            console.error("Failed to replace app with new version", error);
            return;
          }
          emitStatus("launching-new-version", "Launching updated version...");
          if (OS === "macos") {
            const pid = process.pid;
            Bun.spawn([
              "sh",
              "-c",
              `while kill -0 ${pid} 2>/dev/null; do sleep 0.5; done; sleep 1; open "${runningAppBundlePath}"`
            ], {
              detached: true,
              stdio: ["ignore", "ignore", "ignore"]
            });
          } else if (OS === "linux") {
            const launcherPath = join2(runningAppBundlePath, "bin", "launcher");
            Bun.spawn(["sh", "-c", `"${launcherPath}" &`], {
              detached: true
            });
          }
          emitStatus("complete", "Update complete, restarting application...");
          quit();
        }
      }
    },
    channelBucketUrl: async () => {
      await Updater.getLocallocalInfo();
      return localInfo.baseUrl;
    },
    appDataFolder: async () => {
      await Updater.getLocallocalInfo();
      const appDataFolder = join2(getAppDataDir2(), localInfo.identifier, localInfo.channel);
      return appDataFolder;
    },
    localInfo: {
      version: async () => {
        return (await Updater.getLocallocalInfo()).version;
      },
      hash: async () => {
        return (await Updater.getLocallocalInfo()).hash;
      },
      channel: async () => {
        return (await Updater.getLocallocalInfo()).channel;
      },
      baseUrl: async () => {
        return (await Updater.getLocallocalInfo()).baseUrl;
      }
    },
    getLocallocalInfo: async () => {
      if (localInfo) {
        return localInfo;
      }
      try {
        const resourcesDir = "Resources";
        localInfo = await Bun.file(`../${resourcesDir}/version.json`).json();
        return localInfo;
      } catch (error) {
        console.error("Failed to read version.json", error);
        throw error;
      }
    }
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/BuildConfig.ts
var buildConfig = null, BuildConfig;
var init_BuildConfig = __esm(() => {
  BuildConfig = {
    get: async () => {
      if (buildConfig) {
        return buildConfig;
      }
      try {
        const resourcesDir = "Resources";
        buildConfig = await Bun.file(`../${resourcesDir}/build.json`).json();
        return buildConfig;
      } catch (error) {
        buildConfig = {
          defaultRenderer: "native",
          availableRenderers: ["native"]
        };
        return buildConfig;
      }
    },
    getCached: () => buildConfig
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/Socket.ts
var exports_Socket = {};
__export(exports_Socket, {
  socketMap: () => socketMap,
  sendMessageToWebviewViaSocket: () => sendMessageToWebviewViaSocket,
  rpcServer: () => rpcServer,
  rpcPort: () => rpcPort
});
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
function base64ToUint8Array(base64) {
  {
    return new Uint8Array(atob(base64).split("").map((char) => char.charCodeAt(0)));
  }
}
function encrypt(secretKey, text) {
  const iv = new Uint8Array(randomBytes(12));
  const cipher = createCipheriv("aes-256-gcm", secretKey, iv);
  const encrypted = Buffer.concat([
    new Uint8Array(cipher.update(text, "utf8")),
    new Uint8Array(cipher.final())
  ]).toString("base64");
  const tag = cipher.getAuthTag().toString("base64");
  return { encrypted, iv: Buffer.from(iv).toString("base64"), tag };
}
function decrypt(secretKey, encryptedData, iv, tag) {
  const decipher = createDecipheriv("aes-256-gcm", secretKey, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    new Uint8Array(decipher.update(encryptedData)),
    new Uint8Array(decipher.final())
  ]);
  return decrypted.toString("utf8");
}
var socketMap, startRPCServer = () => {
  const startPort = 50000;
  const endPort = 65535;
  const payloadLimit = 1024 * 1024 * 500;
  let port = startPort;
  let server = null;
  while (port <= endPort) {
    try {
      server = Bun.serve({
        port,
        fetch(req, server2) {
          const url = new URL(req.url);
          if (url.pathname === "/socket") {
            const webviewIdString = url.searchParams.get("webviewId");
            if (!webviewIdString) {
              return new Response("Missing webviewId", { status: 400 });
            }
            const webviewId = parseInt(webviewIdString, 10);
            const success = server2.upgrade(req, { data: { webviewId } });
            return success ? undefined : new Response("Upgrade failed", { status: 500 });
          }
          console.log("unhandled RPC Server request", req.url);
        },
        websocket: {
          idleTimeout: 960,
          maxPayloadLength: payloadLimit,
          backpressureLimit: payloadLimit * 2,
          open(ws) {
            if (!ws?.data) {
              return;
            }
            const { webviewId } = ws.data;
            if (!socketMap[webviewId]) {
              socketMap[webviewId] = { socket: ws, queue: [] };
            } else {
              socketMap[webviewId].socket = ws;
            }
          },
          close(ws, _code, _reason) {
            if (!ws?.data) {
              return;
            }
            const { webviewId } = ws.data;
            if (socketMap[webviewId]) {
              socketMap[webviewId].socket = null;
            }
          },
          message(ws, message) {
            if (!ws?.data) {
              return;
            }
            const { webviewId } = ws.data;
            const browserView = BrowserView.getById(webviewId);
            if (!browserView) {
              return;
            }
            if (browserView.rpcHandler) {
              if (typeof message === "string") {
                try {
                  const encryptedPacket = JSON.parse(message);
                  const decrypted = decrypt(browserView.secretKey, base64ToUint8Array(encryptedPacket.encryptedData), base64ToUint8Array(encryptedPacket.iv), base64ToUint8Array(encryptedPacket.tag));
                  browserView.rpcHandler(JSON.parse(decrypted));
                } catch (error) {
                  console.log("Error handling message:", error);
                }
              } else if (message instanceof ArrayBuffer) {
                console.log("TODO: Received ArrayBuffer message:", message);
              }
            }
          }
        }
      });
      break;
    } catch (error) {
      if (error.code === "EADDRINUSE") {
        console.log(`Port ${port} in use, trying next port...`);
        port++;
      } else {
        throw error;
      }
    }
  }
  return { rpcServer: server, rpcPort: port };
}, rpcServer, rpcPort, sendMessageToWebviewViaSocket = (webviewId, message) => {
  const rpc = socketMap[webviewId];
  const browserView = BrowserView.getById(webviewId);
  if (!browserView)
    return false;
  if (rpc?.socket?.readyState === WebSocket.OPEN) {
    try {
      const unencryptedString = JSON.stringify(message);
      const encrypted = encrypt(browserView.secretKey, unencryptedString);
      const encryptedPacket = {
        encryptedData: encrypted.encrypted,
        iv: encrypted.iv,
        tag: encrypted.tag
      };
      const encryptedPacketString = JSON.stringify(encryptedPacket);
      rpc.socket.send(encryptedPacketString);
      return true;
    } catch (error) {
      console.error("Error sending message to webview via socket:", error);
    }
  }
  return false;
};
var init_Socket = __esm(async () => {
  await init_BrowserView();
  socketMap = {};
  ({ rpcServer, rpcPort } = startRPCServer());
  console.log("Server started at", rpcServer?.url.origin);
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/BrowserView.ts
import { randomBytes as randomBytes2 } from "crypto";

class BrowserView {
  id = nextWebviewId++;
  ptr;
  hostWebviewId;
  windowId;
  renderer;
  url = null;
  html = null;
  preload = null;
  partition = null;
  autoResize = true;
  frame = {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  };
  pipePrefix;
  inStream;
  outStream;
  secretKey;
  rpc;
  rpcHandler;
  navigationRules = null;
  sandbox = false;
  startTransparent = false;
  startPassthrough = false;
  constructor(options = defaultOptions) {
    this.url = options.url || defaultOptions.url || null;
    this.html = options.html || defaultOptions.html || null;
    this.preload = options.preload || defaultOptions.preload || null;
    this.frame = {
      x: options.frame?.x ?? defaultOptions.frame.x,
      y: options.frame?.y ?? defaultOptions.frame.y,
      width: options.frame?.width ?? defaultOptions.frame.width,
      height: options.frame?.height ?? defaultOptions.frame.height
    };
    this.rpc = options.rpc;
    this.secretKey = new Uint8Array(randomBytes2(32));
    this.partition = options.partition || null;
    this.pipePrefix = `/private/tmp/electrobun_ipc_pipe_${hash}_${randomId}_${this.id}`;
    this.hostWebviewId = options.hostWebviewId;
    this.windowId = options.windowId ?? 0;
    this.autoResize = options.autoResize === false ? false : true;
    this.navigationRules = options.navigationRules || null;
    this.renderer = options.renderer ?? defaultOptions.renderer ?? "native";
    this.sandbox = options.sandbox ?? false;
    this.startTransparent = options.startTransparent ?? false;
    this.startPassthrough = options.startPassthrough ?? false;
    BrowserViewMap[this.id] = this;
    this.ptr = this.init();
    if (this.html) {
      console.log(`DEBUG: BrowserView constructor triggering loadHTML for webview ${this.id}`);
      setTimeout(() => {
        console.log(`DEBUG: BrowserView delayed loadHTML for webview ${this.id}`);
        this.loadHTML(this.html);
      }, 100);
    } else {
      console.log(`DEBUG: BrowserView constructor - no HTML provided for webview ${this.id}`);
    }
  }
  init() {
    this.createStreams();
    return ffi.request.createWebview({
      id: this.id,
      windowId: this.windowId,
      renderer: this.renderer,
      rpcPort,
      secretKey: this.secretKey.toString(),
      hostWebviewId: this.hostWebviewId || null,
      pipePrefix: this.pipePrefix,
      partition: this.partition,
      url: this.html ? null : this.url,
      html: this.html,
      preload: this.preload,
      frame: {
        width: this.frame.width,
        height: this.frame.height,
        x: this.frame.x,
        y: this.frame.y
      },
      autoResize: this.autoResize,
      navigationRules: this.navigationRules,
      sandbox: this.sandbox,
      startTransparent: this.startTransparent,
      startPassthrough: this.startPassthrough
    });
  }
  createStreams() {
    if (!this.rpc) {
      this.rpc = BrowserView.defineRPC({
        handlers: { requests: {}, messages: {} }
      });
    }
    this.rpc.setTransport(this.createTransport());
  }
  sendMessageToWebviewViaExecute(jsonMessage) {
    const stringifiedMessage = typeof jsonMessage === "string" ? jsonMessage : JSON.stringify(jsonMessage);
    const wrappedMessage = `window.__electrobun.receiveMessageFromBun(${stringifiedMessage})`;
    this.executeJavascript(wrappedMessage);
  }
  sendInternalMessageViaExecute(jsonMessage) {
    const stringifiedMessage = typeof jsonMessage === "string" ? jsonMessage : JSON.stringify(jsonMessage);
    const wrappedMessage = `window.__electrobun.receiveInternalMessageFromBun(${stringifiedMessage})`;
    this.executeJavascript(wrappedMessage);
  }
  executeJavascript(js) {
    ffi.request.evaluateJavascriptWithNoCompletion({ id: this.id, js });
  }
  loadURL(url) {
    console.log(`DEBUG: loadURL called for webview ${this.id}: ${url}`);
    this.url = url;
    native.symbols.loadURLInWebView(this.ptr, toCString(this.url));
  }
  loadHTML(html) {
    this.html = html;
    console.log(`DEBUG: Setting HTML content for webview ${this.id}:`, html.substring(0, 50) + "...");
    if (this.renderer === "cef") {
      native.symbols.setWebviewHTMLContent(this.id, toCString(html));
      this.loadURL("views://internal/index.html");
    } else {
      native.symbols.loadHTMLInWebView(this.ptr, toCString(html));
    }
  }
  setNavigationRules(rules) {
    this.navigationRules = JSON.stringify(rules);
    const rulesJson = JSON.stringify(rules);
    native.symbols.setWebviewNavigationRules(this.ptr, toCString(rulesJson));
  }
  findInPage(searchText, options) {
    const forward = options?.forward ?? true;
    const matchCase = options?.matchCase ?? false;
    native.symbols.webviewFindInPage(this.ptr, toCString(searchText), forward, matchCase);
  }
  stopFindInPage() {
    native.symbols.webviewStopFind(this.ptr);
  }
  openDevTools() {
    native.symbols.webviewOpenDevTools(this.ptr);
  }
  closeDevTools() {
    native.symbols.webviewCloseDevTools(this.ptr);
  }
  toggleDevTools() {
    native.symbols.webviewToggleDevTools(this.ptr);
  }
  on(name, handler) {
    const specificName = `${name}-${this.id}`;
    eventEmitter_default.on(specificName, handler);
  }
  createTransport = () => {
    const that = this;
    return {
      send(message) {
        const sentOverSocket = sendMessageToWebviewViaSocket(that.id, message);
        if (!sentOverSocket) {
          try {
            const messageString = JSON.stringify(message);
            that.sendMessageToWebviewViaExecute(messageString);
          } catch (error) {
            console.error("bun: failed to serialize message to webview", error);
          }
        }
      },
      registerHandler(handler) {
        that.rpcHandler = handler;
      }
    };
  };
  remove() {
    native.symbols.webviewRemove(this.ptr);
    delete BrowserViewMap[this.id];
  }
  static getById(id) {
    return BrowserViewMap[id];
  }
  static getAll() {
    return Object.values(BrowserViewMap);
  }
  static defineRPC(config) {
    return defineElectrobunRPC("bun", config);
  }
}
var BrowserViewMap, nextWebviewId = 1, hash, buildConfig2, defaultOptions, randomId;
var init_BrowserView = __esm(async () => {
  init_eventEmitter();
  init_BuildConfig();
  await __promiseAll([
    init_native(),
    init_Updater(),
    init_Socket()
  ]);
  BrowserViewMap = {};
  hash = await Updater.localInfo.hash();
  buildConfig2 = await BuildConfig.get();
  defaultOptions = {
    url: null,
    html: null,
    preload: null,
    renderer: buildConfig2.defaultRenderer,
    frame: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    }
  };
  randomId = Math.random().toString(36).substring(7);
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/Paths.ts
var exports_Paths = {};
__export(exports_Paths, {
  VIEWS_FOLDER: () => VIEWS_FOLDER
});
import { resolve as resolve2 } from "path";
var RESOURCES_FOLDER, VIEWS_FOLDER;
var init_Paths = __esm(() => {
  RESOURCES_FOLDER = resolve2("../Resources/");
  VIEWS_FOLDER = resolve2(RESOURCES_FOLDER, "app/views");
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/Tray.ts
import { join as join3 } from "path";

class Tray {
  id = nextTrayId++;
  ptr = null;
  constructor({
    title = "",
    image = "",
    template = true,
    width = 16,
    height = 16
  } = {}) {
    try {
      this.ptr = ffi.request.createTray({
        id: this.id,
        title,
        image: this.resolveImagePath(image),
        template,
        width,
        height
      });
    } catch (error) {
      console.warn("Tray creation failed:", error);
      console.warn("System tray functionality may not be available on this platform");
      this.ptr = null;
    }
    TrayMap[this.id] = this;
  }
  resolveImagePath(imgPath) {
    if (imgPath.startsWith("views://")) {
      return join3(VIEWS_FOLDER, imgPath.replace("views://", ""));
    } else {
      return imgPath;
    }
  }
  setTitle(title) {
    if (!this.ptr)
      return;
    ffi.request.setTrayTitle({ id: this.id, title });
  }
  setImage(imgPath) {
    if (!this.ptr)
      return;
    ffi.request.setTrayImage({
      id: this.id,
      image: this.resolveImagePath(imgPath)
    });
  }
  setMenu(menu) {
    if (!this.ptr)
      return;
    const menuWithDefaults = menuConfigWithDefaults(menu);
    ffi.request.setTrayMenu({
      id: this.id,
      menuConfig: JSON.stringify(menuWithDefaults)
    });
  }
  on(name, handler) {
    const specificName = `${name}-${this.id}`;
    eventEmitter_default.on(specificName, handler);
  }
  remove() {
    console.log("Tray.remove() called for id:", this.id);
    if (this.ptr) {
      ffi.request.removeTray({ id: this.id });
    }
    delete TrayMap[this.id];
    console.log("Tray removed from TrayMap");
  }
  static getById(id) {
    return TrayMap[id];
  }
  static getAll() {
    return Object.values(TrayMap);
  }
  static removeById(id) {
    const tray = TrayMap[id];
    if (tray) {
      tray.remove();
    }
  }
}
var nextTrayId = 1, TrayMap, menuConfigWithDefaults = (menu) => {
  return menu.map((item) => {
    if (item.type === "divider" || item.type === "separator") {
      return { type: "divider" };
    } else {
      const menuItem = item;
      const actionWithDataId = ffi.internal.serializeMenuAction(menuItem.action || "", menuItem.data);
      return {
        label: menuItem.label || "",
        type: menuItem.type || "normal",
        action: actionWithDataId,
        enabled: menuItem.enabled === false ? false : true,
        checked: Boolean(menuItem.checked),
        hidden: Boolean(menuItem.hidden),
        tooltip: menuItem.tooltip || undefined,
        ...menuItem.submenu ? { submenu: menuConfigWithDefaults(menuItem.submenu) } : {}
      };
    }
  });
};
var init_Tray = __esm(async () => {
  init_eventEmitter();
  init_Paths();
  await init_native();
  TrayMap = {};
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/preload/.generated/compiled.ts
var preloadScript = `(() => {
  // src/bun/preload/encryption.ts
  function base64ToUint8Array(base64) {
    return new Uint8Array(atob(base64).split("").map((char) => char.charCodeAt(0)));
  }
  function uint8ArrayToBase64(uint8Array) {
    let binary = "";
    for (let i = 0;i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
  async function generateKeyFromBytes(rawKey) {
    return await window.crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
  }
  async function initEncryption() {
    const secretKey = await generateKeyFromBytes(new Uint8Array(window.__electrobunSecretKeyBytes));
    const encryptString = async (plaintext) => {
      const encoder = new TextEncoder;
      const encodedText = encoder.encode(plaintext);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedBuffer = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, secretKey, encodedText);
      const encryptedData = new Uint8Array(encryptedBuffer.slice(0, -16));
      const tag = new Uint8Array(encryptedBuffer.slice(-16));
      return {
        encryptedData: uint8ArrayToBase64(encryptedData),
        iv: uint8ArrayToBase64(iv),
        tag: uint8ArrayToBase64(tag)
      };
    };
    const decryptString = async (encryptedDataB64, ivB64, tagB64) => {
      const encryptedData = base64ToUint8Array(encryptedDataB64);
      const iv = base64ToUint8Array(ivB64);
      const tag = base64ToUint8Array(tagB64);
      const combinedData = new Uint8Array(encryptedData.length + tag.length);
      combinedData.set(encryptedData);
      combinedData.set(tag, encryptedData.length);
      const decryptedBuffer = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, secretKey, combinedData);
      const decoder = new TextDecoder;
      return decoder.decode(decryptedBuffer);
    };
    window.__electrobun_encrypt = encryptString;
    window.__electrobun_decrypt = decryptString;
  }

  // src/bun/preload/internalRpc.ts
  var pendingRequests = {};
  var requestId = 0;
  var isProcessingQueue = false;
  var sendQueue = [];
  function processQueue() {
    if (isProcessingQueue) {
      setTimeout(processQueue);
      return;
    }
    if (sendQueue.length === 0)
      return;
    isProcessingQueue = true;
    const batch = JSON.stringify(sendQueue);
    sendQueue.length = 0;
    window.__electrobunInternalBridge?.postMessage(batch);
    setTimeout(() => {
      isProcessingQueue = false;
    }, 2);
  }
  function send(type, payload) {
    sendQueue.push(JSON.stringify({ type: "message", id: type, payload }));
    processQueue();
  }
  function request(type, payload) {
    return new Promise((resolve, reject) => {
      const id = \`req_\${++requestId}_\${Date.now()}\`;
      pendingRequests[id] = { resolve, reject };
      sendQueue.push(JSON.stringify({
        type: "request",
        method: type,
        id,
        params: payload,
        hostWebviewId: window.__electrobunWebviewId
      }));
      processQueue();
      setTimeout(() => {
        if (pendingRequests[id]) {
          delete pendingRequests[id];
          reject(new Error(\`Request timeout: \${type}\`));
        }
      }, 1e4);
    });
  }
  function handleResponse(msg) {
    if (msg && msg.type === "response" && msg.id) {
      const pending = pendingRequests[msg.id];
      if (pending) {
        delete pendingRequests[msg.id];
        if (msg.success)
          pending.resolve(msg.payload);
        else
          pending.reject(msg.payload);
      }
    }
  }

  // src/bun/preload/dragRegions.ts
  function isAppRegionDrag(e) {
    const target = e.target;
    if (!target || !target.closest)
      return false;
    const draggableByStyle = target.closest('[style*="app-region"][style*="drag"]');
    const draggableByClass = target.closest(".electrobun-webkit-app-region-drag");
    return !!(draggableByStyle || draggableByClass);
  }
  function initDragRegions() {
    document.addEventListener("mousedown", (e) => {
      if (isAppRegionDrag(e)) {
        send("startWindowMove", { id: window.__electrobunWindowId });
      }
    });
    document.addEventListener("mouseup", (e) => {
      if (isAppRegionDrag(e)) {
        send("stopWindowMove", { id: window.__electrobunWindowId });
      }
    });
  }

  // src/bun/preload/webviewTag.ts
  var webviewRegistry = {};

  class ElectrobunWebviewTag extends HTMLElement {
    webviewId = null;
    maskSelectors = new Set;
    lastRect = { x: 0, y: 0, width: 0, height: 0 };
    resizeObserver = null;
    positionCheckLoop = null;
    transparent = false;
    passthroughEnabled = false;
    hidden = false;
    sandboxed = false;
    _eventListeners = {};
    constructor() {
      super();
    }
    connectedCallback() {
      requestAnimationFrame(() => this.initWebview());
    }
    disconnectedCallback() {
      if (this.webviewId !== null) {
        send("webviewTagRemove", { id: this.webviewId });
        delete webviewRegistry[this.webviewId];
      }
      if (this.resizeObserver)
        this.resizeObserver.disconnect();
      if (this.positionCheckLoop)
        clearInterval(this.positionCheckLoop);
    }
    async initWebview() {
      const rect = this.getBoundingClientRect();
      this.lastRect = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
      const url = this.getAttribute("src");
      const html = this.getAttribute("html");
      const preload = this.getAttribute("preload");
      const partition = this.getAttribute("partition");
      const renderer = this.getAttribute("renderer") || "native";
      const masks = this.getAttribute("masks");
      const sandbox = this.hasAttribute("sandbox");
      this.sandboxed = sandbox;
      const transparent = this.hasAttribute("transparent");
      const passthrough = this.hasAttribute("passthrough");
      this.transparent = transparent;
      this.passthroughEnabled = passthrough;
      if (transparent)
        this.style.opacity = "0";
      if (passthrough)
        this.style.pointerEvents = "none";
      if (masks) {
        masks.split(",").forEach((s) => this.maskSelectors.add(s.trim()));
      }
      try {
        const webviewId = await request("webviewTagInit", {
          hostWebviewId: window.__electrobunWebviewId,
          windowId: window.__electrobunWindowId,
          renderer,
          url,
          html,
          preload,
          partition,
          frame: {
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
          },
          navigationRules: null,
          sandbox,
          transparent,
          passthrough
        });
        this.webviewId = webviewId;
        this.id = \`electrobun-webview-\${webviewId}\`;
        webviewRegistry[webviewId] = this;
        this.setupObservers();
        this.syncDimensions(true);
        requestAnimationFrame(() => {
          Object.values(webviewRegistry).forEach((webview) => {
            if (webview !== this && webview.webviewId !== null) {
              webview.syncDimensions(true);
            }
          });
        });
      } catch (err) {
        console.error("Failed to init webview:", err);
      }
    }
    setupObservers() {
      this.resizeObserver = new ResizeObserver(() => this.syncDimensions());
      this.resizeObserver.observe(this);
      this.positionCheckLoop = setInterval(() => this.syncDimensions(), 100);
    }
    syncDimensions(force = false) {
      if (this.webviewId === null)
        return;
      const rect = this.getBoundingClientRect();
      const newRect = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
      if (newRect.width === 0 && newRect.height === 0) {
        return;
      }
      if (!force && newRect.x === this.lastRect.x && newRect.y === this.lastRect.y && newRect.width === this.lastRect.width && newRect.height === this.lastRect.height) {
        return;
      }
      this.lastRect = newRect;
      const masks = [];
      this.maskSelectors.forEach((selector) => {
        try {
          document.querySelectorAll(selector).forEach((el) => {
            const mr = el.getBoundingClientRect();
            masks.push({
              x: mr.x - rect.x,
              y: mr.y - rect.y,
              width: mr.width,
              height: mr.height
            });
          });
        } catch (_e) {}
      });
      send("webviewTagResize", {
        id: this.webviewId,
        frame: newRect,
        masks: JSON.stringify(masks)
      });
    }
    loadURL(url) {
      if (this.webviewId === null)
        return;
      this.setAttribute("src", url);
      send("webviewTagUpdateSrc", { id: this.webviewId, url });
    }
    loadHTML(html) {
      if (this.webviewId === null)
        return;
      send("webviewTagUpdateHtml", { id: this.webviewId, html });
    }
    reload() {
      if (this.webviewId !== null)
        send("webviewTagReload", { id: this.webviewId });
    }
    goBack() {
      if (this.webviewId !== null)
        send("webviewTagGoBack", { id: this.webviewId });
    }
    goForward() {
      if (this.webviewId !== null)
        send("webviewTagGoForward", { id: this.webviewId });
    }
    async canGoBack() {
      if (this.webviewId === null)
        return false;
      return await request("webviewTagCanGoBack", {
        id: this.webviewId
      });
    }
    async canGoForward() {
      if (this.webviewId === null)
        return false;
      return await request("webviewTagCanGoForward", {
        id: this.webviewId
      });
    }
    toggleTransparent(value) {
      if (this.webviewId === null)
        return;
      this.transparent = value !== undefined ? value : !this.transparent;
      this.style.opacity = this.transparent ? "0" : "";
      send("webviewTagSetTransparent", {
        id: this.webviewId,
        transparent: this.transparent
      });
    }
    togglePassthrough(value) {
      if (this.webviewId === null)
        return;
      this.passthroughEnabled = value !== undefined ? value : !this.passthroughEnabled;
      this.style.pointerEvents = this.passthroughEnabled ? "none" : "";
      send("webviewTagSetPassthrough", {
        id: this.webviewId,
        enablePassthrough: this.passthroughEnabled
      });
    }
    toggleHidden(value) {
      if (this.webviewId === null)
        return;
      this.hidden = value !== undefined ? value : !this.hidden;
      send("webviewTagSetHidden", { id: this.webviewId, hidden: this.hidden });
    }
    addMaskSelector(selector) {
      this.maskSelectors.add(selector);
      this.syncDimensions(true);
    }
    removeMaskSelector(selector) {
      this.maskSelectors.delete(selector);
      this.syncDimensions(true);
    }
    setNavigationRules(rules) {
      if (this.webviewId !== null) {
        send("webviewTagSetNavigationRules", { id: this.webviewId, rules });
      }
    }
    findInPage(searchText, options) {
      if (this.webviewId === null)
        return;
      const forward = options?.forward !== false;
      const matchCase = options?.matchCase || false;
      send("webviewTagFindInPage", {
        id: this.webviewId,
        searchText,
        forward,
        matchCase
      });
    }
    stopFindInPage() {
      if (this.webviewId !== null)
        send("webviewTagStopFind", { id: this.webviewId });
    }
    openDevTools() {
      if (this.webviewId !== null)
        send("webviewTagOpenDevTools", { id: this.webviewId });
    }
    closeDevTools() {
      if (this.webviewId !== null)
        send("webviewTagCloseDevTools", { id: this.webviewId });
    }
    toggleDevTools() {
      if (this.webviewId !== null)
        send("webviewTagToggleDevTools", { id: this.webviewId });
    }
    on(event, listener) {
      if (!this._eventListeners[event])
        this._eventListeners[event] = [];
      this._eventListeners[event].push(listener);
    }
    off(event, listener) {
      if (!this._eventListeners[event])
        return;
      const idx = this._eventListeners[event].indexOf(listener);
      if (idx !== -1)
        this._eventListeners[event].splice(idx, 1);
    }
    emit(event, detail) {
      const listeners = this._eventListeners[event];
      if (listeners) {
        const customEvent = new CustomEvent(event, { detail });
        listeners.forEach((fn) => fn(customEvent));
      }
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
        if (this.webviewId !== null)
          this.loadURL(value);
      } else {
        this.removeAttribute("src");
      }
    }
    get html() {
      return this.getAttribute("html");
    }
    set html(value) {
      if (value) {
        this.setAttribute("html", value);
        if (this.webviewId !== null)
          this.loadHTML(value);
      } else {
        this.removeAttribute("html");
      }
    }
    get preload() {
      return this.getAttribute("preload");
    }
    set preload(value) {
      if (value)
        this.setAttribute("preload", value);
      else
        this.removeAttribute("preload");
    }
    get renderer() {
      return this.getAttribute("renderer") || "native";
    }
    set renderer(value) {
      this.setAttribute("renderer", value);
    }
    get sandbox() {
      return this.sandboxed;
    }
  }
  function initWebviewTag() {
    if (!customElements.get("electrobun-webview")) {
      customElements.define("electrobun-webview", ElectrobunWebviewTag);
    }
    const injectStyles = () => {
      const style = document.createElement("style");
      style.textContent = \`
electrobun-webview {
	display: block;
	width: 800px;
	height: 300px;
	background: #fff;
	background-repeat: no-repeat !important;
	overflow: hidden;
}
\`;
      if (document.head?.firstChild) {
        document.head.insertBefore(style, document.head.firstChild);
      } else if (document.head) {
        document.head.appendChild(style);
      }
    };
    if (document.head) {
      injectStyles();
    } else {
      document.addEventListener("DOMContentLoaded", injectStyles);
    }
  }

  // src/bun/preload/events.ts
  function emitWebviewEvent(eventName, detail) {
    setTimeout(() => {
      const bridge = window.__electrobunEventBridge || window.__electrobunInternalBridge;
      bridge?.postMessage(JSON.stringify({
        id: "webviewEvent",
        type: "message",
        payload: {
          id: window.__electrobunWebviewId,
          eventName,
          detail
        }
      }));
    });
  }
  function initLifecycleEvents() {
    window.addEventListener("load", () => {
      if (window === window.top) {
        emitWebviewEvent("dom-ready", document.location.href);
      }
    });
    window.addEventListener("popstate", () => {
      emitWebviewEvent("did-navigate-in-page", window.location.href);
    });
    window.addEventListener("hashchange", () => {
      emitWebviewEvent("did-navigate-in-page", window.location.href);
    });
  }
  var cmdKeyHeld = false;
  var cmdKeyTimestamp = 0;
  var CMD_KEY_THRESHOLD_MS = 500;
  function isCmdHeld() {
    if (cmdKeyHeld)
      return true;
    return Date.now() - cmdKeyTimestamp < CMD_KEY_THRESHOLD_MS && cmdKeyTimestamp > 0;
  }
  function initCmdClickHandling() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Meta" || event.metaKey) {
        cmdKeyHeld = true;
        cmdKeyTimestamp = Date.now();
      }
    }, true);
    window.addEventListener("keyup", (event) => {
      if (event.key === "Meta") {
        cmdKeyHeld = false;
        cmdKeyTimestamp = Date.now();
      }
    }, true);
    window.addEventListener("blur", () => {
      cmdKeyHeld = false;
    });
    window.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey) {
        const anchor = event.target?.closest?.("a");
        if (anchor && anchor.href) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          emitWebviewEvent("new-window-open", JSON.stringify({
            url: anchor.href,
            isCmdClick: true,
            isSPANavigation: false
          }));
        }
      }
    }, true);
  }
  function initSPANavigationInterception() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(state, title, url) {
      if (isCmdHeld() && url) {
        const resolvedUrl = new URL(String(url), window.location.href).href;
        emitWebviewEvent("new-window-open", JSON.stringify({
          url: resolvedUrl,
          isCmdClick: true,
          isSPANavigation: true
        }));
        return;
      }
      return originalPushState.apply(this, [state, title, url]);
    };
    history.replaceState = function(state, title, url) {
      if (isCmdHeld() && url) {
        const resolvedUrl = new URL(String(url), window.location.href).href;
        emitWebviewEvent("new-window-open", JSON.stringify({
          url: resolvedUrl,
          isCmdClick: true,
          isSPANavigation: true
        }));
        return;
      }
      return originalReplaceState.apply(this, [state, title, url]);
    };
  }
  function initOverscrollPrevention() {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.type = "text/css";
      style.appendChild(document.createTextNode("html, body { overscroll-behavior: none; }"));
      document.head.appendChild(style);
    });
  }

  // src/bun/preload/index.ts
  initEncryption().catch((err) => console.error("Failed to initialize encryption:", err));
  var internalMessageHandler = (msg) => {
    handleResponse(msg);
  };
  if (!window.__electrobun) {
    window.__electrobun = {
      receiveInternalMessageFromBun: internalMessageHandler,
      receiveMessageFromBun: (msg) => {
        console.log("receiveMessageFromBun (no handler):", msg);
      }
    };
  } else {
    window.__electrobun.receiveInternalMessageFromBun = internalMessageHandler;
    window.__electrobun.receiveMessageFromBun = (msg) => {
      console.log("receiveMessageFromBun (no handler):", msg);
    };
  }
  window.__electrobunSendToHost = (message) => {
    emitWebviewEvent("host-message", JSON.stringify(message));
  };
  initLifecycleEvents();
  initCmdClickHandling();
  initSPANavigationInterception();
  initOverscrollPrevention();
  initDragRegions();
  initWebviewTag();
})();
`, preloadScriptSandboxed = `(() => {
  // src/bun/preload/events.ts
  function emitWebviewEvent(eventName, detail) {
    setTimeout(() => {
      const bridge = window.__electrobunEventBridge || window.__electrobunInternalBridge;
      bridge?.postMessage(JSON.stringify({
        id: "webviewEvent",
        type: "message",
        payload: {
          id: window.__electrobunWebviewId,
          eventName,
          detail
        }
      }));
    });
  }
  function initLifecycleEvents() {
    window.addEventListener("load", () => {
      if (window === window.top) {
        emitWebviewEvent("dom-ready", document.location.href);
      }
    });
    window.addEventListener("popstate", () => {
      emitWebviewEvent("did-navigate-in-page", window.location.href);
    });
    window.addEventListener("hashchange", () => {
      emitWebviewEvent("did-navigate-in-page", window.location.href);
    });
  }
  var cmdKeyHeld = false;
  var cmdKeyTimestamp = 0;
  var CMD_KEY_THRESHOLD_MS = 500;
  function isCmdHeld() {
    if (cmdKeyHeld)
      return true;
    return Date.now() - cmdKeyTimestamp < CMD_KEY_THRESHOLD_MS && cmdKeyTimestamp > 0;
  }
  function initCmdClickHandling() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Meta" || event.metaKey) {
        cmdKeyHeld = true;
        cmdKeyTimestamp = Date.now();
      }
    }, true);
    window.addEventListener("keyup", (event) => {
      if (event.key === "Meta") {
        cmdKeyHeld = false;
        cmdKeyTimestamp = Date.now();
      }
    }, true);
    window.addEventListener("blur", () => {
      cmdKeyHeld = false;
    });
    window.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey) {
        const anchor = event.target?.closest?.("a");
        if (anchor && anchor.href) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          emitWebviewEvent("new-window-open", JSON.stringify({
            url: anchor.href,
            isCmdClick: true,
            isSPANavigation: false
          }));
        }
      }
    }, true);
  }
  function initSPANavigationInterception() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(state, title, url) {
      if (isCmdHeld() && url) {
        const resolvedUrl = new URL(String(url), window.location.href).href;
        emitWebviewEvent("new-window-open", JSON.stringify({
          url: resolvedUrl,
          isCmdClick: true,
          isSPANavigation: true
        }));
        return;
      }
      return originalPushState.apply(this, [state, title, url]);
    };
    history.replaceState = function(state, title, url) {
      if (isCmdHeld() && url) {
        const resolvedUrl = new URL(String(url), window.location.href).href;
        emitWebviewEvent("new-window-open", JSON.stringify({
          url: resolvedUrl,
          isCmdClick: true,
          isSPANavigation: true
        }));
        return;
      }
      return originalReplaceState.apply(this, [state, title, url]);
    };
  }
  function initOverscrollPrevention() {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.type = "text/css";
      style.appendChild(document.createTextNode("html, body { overscroll-behavior: none; }"));
      document.head.appendChild(style);
    });
  }

  // src/bun/preload/index-sandboxed.ts
  initLifecycleEvents();
  initCmdClickHandling();
  initSPANavigationInterception();
  initOverscrollPrevention();
})();
`;

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/proc/native.ts
import { join as join4 } from "path";
import {
  dlopen,
  suffix,
  JSCallback,
  CString,
  ptr,
  FFIType,
  toArrayBuffer
} from "bun:ffi";
function storeMenuData(data) {
  const id = `menuData_${++menuDataCounter}`;
  menuDataRegistry.set(id, data);
  return id;
}
function getMenuData(id) {
  return menuDataRegistry.get(id);
}
function clearMenuData(id) {
  menuDataRegistry.delete(id);
}
function serializeMenuAction(action, data) {
  const dataId = storeMenuData(data);
  return `${ELECTROBUN_DELIMITER}${dataId}|${action}`;
}
function deserializeMenuAction(encodedAction) {
  let actualAction = encodedAction;
  let data = undefined;
  if (encodedAction.startsWith(ELECTROBUN_DELIMITER)) {
    const parts = encodedAction.split("|");
    if (parts.length >= 4) {
      const dataId = parts[2];
      actualAction = parts.slice(3).join("|");
      data = getMenuData(dataId);
      clearMenuData(dataId);
    }
  }
  return { action: actualAction, data };
}

class SessionCookies {
  partitionId;
  constructor(partitionId) {
    this.partitionId = partitionId;
  }
  get(filter) {
    const filterJson = JSON.stringify(filter || {});
    const result = native.symbols.sessionGetCookies(toCString(this.partitionId), toCString(filterJson));
    if (!result)
      return [];
    try {
      return JSON.parse(result.toString());
    } catch {
      return [];
    }
  }
  set(cookie) {
    const cookieJson = JSON.stringify(cookie);
    return native.symbols.sessionSetCookie(toCString(this.partitionId), toCString(cookieJson));
  }
  remove(url, name) {
    return native.symbols.sessionRemoveCookie(toCString(this.partitionId), toCString(url), toCString(name));
  }
  clear() {
    native.symbols.sessionClearCookies(toCString(this.partitionId));
  }
}

class SessionInstance {
  partition;
  cookies;
  constructor(partition) {
    this.partition = partition;
    this.cookies = new SessionCookies(partition);
  }
  clearStorageData(types = "all") {
    const typesArray = types === "all" ? ["all"] : types;
    native.symbols.sessionClearStorageData(toCString(this.partition), toCString(JSON.stringify(typesArray)));
  }
}
function toCString(jsString, addNullTerminator = true) {
  let appendWith = "";
  if (addNullTerminator && !jsString.endsWith("\x00")) {
    appendWith = "\x00";
  }
  const buff = Buffer.from(jsString + appendWith, "utf8");
  return ptr(buff);
}
var menuDataRegistry, menuDataCounter = 0, ELECTROBUN_DELIMITER = "|EB|", native, ffi, windowCloseCallback, windowMoveCallback, windowResizeCallback, windowFocusCallback, getMimeType, getHTMLForWebviewSync, urlOpenCallback, quitRequestedCallback, globalShortcutHandlers, globalShortcutCallback, GlobalShortcut, Screen, sessionCache, Session, webviewDecideNavigation, webviewEventHandler = (id, eventName, detail) => {
  const webview = BrowserView.getById(id);
  if (!webview) {
    console.error("[webviewEventHandler] No webview found for id:", id);
    return;
  }
  if (webview.hostWebviewId) {
    const hostWebview = BrowserView.getById(webview.hostWebviewId);
    if (!hostWebview) {
      console.error("[webviewEventHandler] No webview found for id:", id);
      return;
    }
    let js;
    if (eventName === "new-window-open" || eventName === "host-message") {
      js = `document.querySelector('#electrobun-webview-${id}').emit(${JSON.stringify(eventName)}, ${detail});`;
    } else {
      js = `document.querySelector('#electrobun-webview-${id}').emit(${JSON.stringify(eventName)}, ${JSON.stringify(detail)});`;
    }
    native.symbols.evaluateJavaScriptWithNoCompletion(hostWebview.ptr, toCString(js));
  }
  const eventMap = {
    "will-navigate": "willNavigate",
    "did-navigate": "didNavigate",
    "did-navigate-in-page": "didNavigateInPage",
    "did-commit-navigation": "didCommitNavigation",
    "dom-ready": "domReady",
    "new-window-open": "newWindowOpen",
    "host-message": "hostMessage",
    "download-started": "downloadStarted",
    "download-progress": "downloadProgress",
    "download-completed": "downloadCompleted",
    "download-failed": "downloadFailed",
    "load-started": "loadStarted",
    "load-committed": "loadCommitted",
    "load-finished": "loadFinished"
  };
  const mappedName = eventMap[eventName];
  const handler = mappedName ? eventEmitter_default.events.webview[mappedName] : undefined;
  if (!handler) {
    return { success: false };
  }
  let parsedDetail = detail;
  if (eventName === "new-window-open" || eventName === "host-message" || eventName === "download-started" || eventName === "download-progress" || eventName === "download-completed" || eventName === "download-failed") {
    try {
      parsedDetail = JSON.parse(detail);
    } catch (e) {
      console.error("[webviewEventHandler] Failed to parse JSON:", e);
      parsedDetail = detail;
    }
  }
  const event = handler({
    detail: parsedDetail
  });
  eventEmitter_default.emitEvent(event);
  eventEmitter_default.emitEvent(event, id);
}, webviewEventJSCallback, bunBridgePostmessageHandler, eventBridgeHandler, internalBridgeHandler, trayItemHandler, applicationMenuHandler, contextMenuHandler, internalRpcHandlers;
var init_native = __esm(async () => {
  init_eventEmitter();
  await __promiseAll([
    init_BrowserView(),
    init_Tray(),
    init_BrowserWindow()
  ]);
  menuDataRegistry = new Map;
  native = (() => {
    try {
      const nativeWrapperPath = join4(process.cwd(), `libNativeWrapper.${suffix}`);
      return dlopen(nativeWrapperPath, {
        createWindowWithFrameAndStyleFromWorker: {
          args: [
            FFIType.u32,
            FFIType.f64,
            FFIType.f64,
            FFIType.f64,
            FFIType.f64,
            FFIType.u32,
            FFIType.cstring,
            FFIType.bool,
            FFIType.function,
            FFIType.function,
            FFIType.function,
            FFIType.function
          ],
          returns: FFIType.ptr
        },
        setWindowTitle: {
          args: [
            FFIType.ptr,
            FFIType.cstring
          ],
          returns: FFIType.void
        },
        showWindow: {
          args: [
            FFIType.ptr
          ],
          returns: FFIType.void
        },
        closeWindow: {
          args: [
            FFIType.ptr
          ],
          returns: FFIType.void
        },
        minimizeWindow: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        restoreWindow: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        isWindowMinimized: {
          args: [FFIType.ptr],
          returns: FFIType.bool
        },
        maximizeWindow: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        unmaximizeWindow: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        isWindowMaximized: {
          args: [FFIType.ptr],
          returns: FFIType.bool
        },
        setWindowFullScreen: {
          args: [FFIType.ptr, FFIType.bool],
          returns: FFIType.void
        },
        isWindowFullScreen: {
          args: [FFIType.ptr],
          returns: FFIType.bool
        },
        setWindowAlwaysOnTop: {
          args: [FFIType.ptr, FFIType.bool],
          returns: FFIType.void
        },
        isWindowAlwaysOnTop: {
          args: [FFIType.ptr],
          returns: FFIType.bool
        },
        setWindowPosition: {
          args: [FFIType.ptr, FFIType.f64, FFIType.f64],
          returns: FFIType.void
        },
        setWindowSize: {
          args: [FFIType.ptr, FFIType.f64, FFIType.f64],
          returns: FFIType.void
        },
        setWindowFrame: {
          args: [FFIType.ptr, FFIType.f64, FFIType.f64, FFIType.f64, FFIType.f64],
          returns: FFIType.void
        },
        getWindowFrame: {
          args: [FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr],
          returns: FFIType.void
        },
        initWebview: {
          args: [
            FFIType.u32,
            FFIType.ptr,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.f64,
            FFIType.f64,
            FFIType.f64,
            FFIType.f64,
            FFIType.bool,
            FFIType.cstring,
            FFIType.function,
            FFIType.function,
            FFIType.function,
            FFIType.function,
            FFIType.function,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.bool,
            FFIType.bool
          ],
          returns: FFIType.ptr
        },
        setNextWebviewFlags: {
          args: [
            FFIType.bool,
            FFIType.bool
          ],
          returns: FFIType.void
        },
        webviewCanGoBack: {
          args: [FFIType.ptr],
          returns: FFIType.bool
        },
        webviewCanGoForward: {
          args: [FFIType.ptr],
          returns: FFIType.bool
        },
        resizeWebview: {
          args: [
            FFIType.ptr,
            FFIType.f64,
            FFIType.f64,
            FFIType.f64,
            FFIType.f64,
            FFIType.cstring
          ],
          returns: FFIType.void
        },
        loadURLInWebView: {
          args: [FFIType.ptr, FFIType.cstring],
          returns: FFIType.void
        },
        loadHTMLInWebView: {
          args: [FFIType.ptr, FFIType.cstring],
          returns: FFIType.void
        },
        updatePreloadScriptToWebView: {
          args: [
            FFIType.ptr,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.bool
          ],
          returns: FFIType.void
        },
        webviewGoBack: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        webviewGoForward: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        webviewReload: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        webviewRemove: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        setWebviewHTMLContent: {
          args: [FFIType.u32, FFIType.cstring],
          returns: FFIType.void
        },
        startWindowMove: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        stopWindowMove: {
          args: [],
          returns: FFIType.void
        },
        webviewSetTransparent: {
          args: [FFIType.ptr, FFIType.bool],
          returns: FFIType.void
        },
        webviewSetPassthrough: {
          args: [FFIType.ptr, FFIType.bool],
          returns: FFIType.void
        },
        webviewSetHidden: {
          args: [FFIType.ptr, FFIType.bool],
          returns: FFIType.void
        },
        setWebviewNavigationRules: {
          args: [FFIType.ptr, FFIType.cstring],
          returns: FFIType.void
        },
        webviewFindInPage: {
          args: [FFIType.ptr, FFIType.cstring, FFIType.bool, FFIType.bool],
          returns: FFIType.void
        },
        webviewStopFind: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        evaluateJavaScriptWithNoCompletion: {
          args: [FFIType.ptr, FFIType.cstring],
          returns: FFIType.void
        },
        webviewOpenDevTools: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        webviewCloseDevTools: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        webviewToggleDevTools: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        createTray: {
          args: [
            FFIType.u32,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.bool,
            FFIType.u32,
            FFIType.u32,
            FFIType.function
          ],
          returns: FFIType.ptr
        },
        setTrayTitle: {
          args: [FFIType.ptr, FFIType.cstring],
          returns: FFIType.void
        },
        setTrayImage: {
          args: [FFIType.ptr, FFIType.cstring],
          returns: FFIType.void
        },
        setTrayMenu: {
          args: [FFIType.ptr, FFIType.cstring],
          returns: FFIType.void
        },
        removeTray: {
          args: [FFIType.ptr],
          returns: FFIType.void
        },
        setApplicationMenu: {
          args: [FFIType.cstring, FFIType.function],
          returns: FFIType.void
        },
        showContextMenu: {
          args: [FFIType.cstring, FFIType.function],
          returns: FFIType.void
        },
        moveToTrash: {
          args: [FFIType.cstring],
          returns: FFIType.bool
        },
        showItemInFolder: {
          args: [FFIType.cstring],
          returns: FFIType.void
        },
        openExternal: {
          args: [FFIType.cstring],
          returns: FFIType.bool
        },
        openPath: {
          args: [FFIType.cstring],
          returns: FFIType.bool
        },
        showNotification: {
          args: [
            FFIType.cstring,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.bool
          ],
          returns: FFIType.void
        },
        setGlobalShortcutCallback: {
          args: [FFIType.function],
          returns: FFIType.void
        },
        registerGlobalShortcut: {
          args: [FFIType.cstring],
          returns: FFIType.bool
        },
        unregisterGlobalShortcut: {
          args: [FFIType.cstring],
          returns: FFIType.bool
        },
        unregisterAllGlobalShortcuts: {
          args: [],
          returns: FFIType.void
        },
        isGlobalShortcutRegistered: {
          args: [FFIType.cstring],
          returns: FFIType.bool
        },
        getAllDisplays: {
          args: [],
          returns: FFIType.cstring
        },
        getPrimaryDisplay: {
          args: [],
          returns: FFIType.cstring
        },
        getCursorScreenPoint: {
          args: [],
          returns: FFIType.cstring
        },
        openFileDialog: {
          args: [
            FFIType.cstring,
            FFIType.cstring,
            FFIType.int,
            FFIType.int,
            FFIType.int
          ],
          returns: FFIType.cstring
        },
        showMessageBox: {
          args: [
            FFIType.cstring,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.cstring,
            FFIType.int,
            FFIType.int
          ],
          returns: FFIType.int
        },
        clipboardReadText: {
          args: [],
          returns: FFIType.cstring
        },
        clipboardWriteText: {
          args: [FFIType.cstring],
          returns: FFIType.void
        },
        clipboardReadImage: {
          args: [FFIType.ptr],
          returns: FFIType.ptr
        },
        clipboardWriteImage: {
          args: [FFIType.ptr, FFIType.u64],
          returns: FFIType.void
        },
        clipboardClear: {
          args: [],
          returns: FFIType.void
        },
        clipboardAvailableFormats: {
          args: [],
          returns: FFIType.cstring
        },
        sessionGetCookies: {
          args: [FFIType.cstring, FFIType.cstring],
          returns: FFIType.cstring
        },
        sessionSetCookie: {
          args: [FFIType.cstring, FFIType.cstring],
          returns: FFIType.bool
        },
        sessionRemoveCookie: {
          args: [FFIType.cstring, FFIType.cstring, FFIType.cstring],
          returns: FFIType.bool
        },
        sessionClearCookies: {
          args: [FFIType.cstring],
          returns: FFIType.void
        },
        sessionClearStorageData: {
          args: [FFIType.cstring, FFIType.cstring],
          returns: FFIType.void
        },
        setURLOpenHandler: {
          args: [FFIType.function],
          returns: FFIType.void
        },
        getWindowStyle: {
          args: [
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool,
            FFIType.bool
          ],
          returns: FFIType.u32
        },
        setJSUtils: {
          args: [
            FFIType.function,
            FFIType.function
          ],
          returns: FFIType.void
        },
        setWindowIcon: {
          args: [
            FFIType.ptr,
            FFIType.cstring
          ],
          returns: FFIType.void
        },
        killApp: {
          args: [],
          returns: FFIType.void
        },
        stopEventLoop: {
          args: [],
          returns: FFIType.void
        },
        waitForShutdownComplete: {
          args: [FFIType.i32],
          returns: FFIType.void
        },
        forceExit: {
          args: [FFIType.i32],
          returns: FFIType.void
        },
        setQuitRequestedHandler: {
          args: [FFIType.function],
          returns: FFIType.void
        },
        testFFI2: {
          args: [FFIType.function],
          returns: FFIType.void
        }
      });
    } catch (err) {
      console.log("FATAL Error opening native FFI:", err.message);
      console.log("This may be due to:");
      console.log("  - Missing libNativeWrapper.dll/so/dylib");
      console.log("  - Architecture mismatch (ARM64 vs x64)");
      console.log("  - Missing WebView2 or CEF dependencies");
      if (suffix === "so") {
        console.log("  - Missing system libraries (try: ldd ./libNativeWrapper.so)");
      }
      console.log("Check that the build process completed successfully for your architecture.");
      process.exit();
    }
  })();
  ffi = {
    request: {
      createWindow: (params) => {
        const {
          id,
          url: _url,
          title,
          frame: { x, y, width, height },
          styleMask: {
            Borderless,
            Titled,
            Closable,
            Miniaturizable,
            Resizable,
            UnifiedTitleAndToolbar,
            FullScreen,
            FullSizeContentView,
            UtilityWindow,
            DocModalWindow,
            NonactivatingPanel,
            HUDWindow
          },
          titleBarStyle,
          transparent
        } = params;
        const styleMask = native.symbols.getWindowStyle(Borderless, Titled, Closable, Miniaturizable, Resizable, UnifiedTitleAndToolbar, FullScreen, FullSizeContentView, UtilityWindow, DocModalWindow, NonactivatingPanel, HUDWindow);
        const windowPtr = native.symbols.createWindowWithFrameAndStyleFromWorker(id, x, y, width, height, styleMask, toCString(titleBarStyle), transparent, windowCloseCallback, windowMoveCallback, windowResizeCallback, windowFocusCallback);
        if (!windowPtr) {
          throw "Failed to create window";
        }
        native.symbols.setWindowTitle(windowPtr, toCString(title));
        native.symbols.showWindow(windowPtr);
        return windowPtr;
      },
      setTitle: (params) => {
        const { winId, title } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't add webview to window. window no longer exists`;
        }
        native.symbols.setWindowTitle(windowPtr, toCString(title));
      },
      closeWindow: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't close window. Window no longer exists`;
        }
        native.symbols.closeWindow(windowPtr);
      },
      focusWindow: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't focus window. Window no longer exists`;
        }
        native.symbols.showWindow(windowPtr);
      },
      minimizeWindow: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't minimize window. Window no longer exists`;
        }
        native.symbols.minimizeWindow(windowPtr);
      },
      restoreWindow: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't restore window. Window no longer exists`;
        }
        native.symbols.restoreWindow(windowPtr);
      },
      isWindowMinimized: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          return false;
        }
        return native.symbols.isWindowMinimized(windowPtr);
      },
      maximizeWindow: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't maximize window. Window no longer exists`;
        }
        native.symbols.maximizeWindow(windowPtr);
      },
      unmaximizeWindow: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't unmaximize window. Window no longer exists`;
        }
        native.symbols.unmaximizeWindow(windowPtr);
      },
      isWindowMaximized: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          return false;
        }
        return native.symbols.isWindowMaximized(windowPtr);
      },
      setWindowFullScreen: (params) => {
        const { winId, fullScreen } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't set fullscreen. Window no longer exists`;
        }
        native.symbols.setWindowFullScreen(windowPtr, fullScreen);
      },
      isWindowFullScreen: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          return false;
        }
        return native.symbols.isWindowFullScreen(windowPtr);
      },
      setWindowAlwaysOnTop: (params) => {
        const { winId, alwaysOnTop } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't set always on top. Window no longer exists`;
        }
        native.symbols.setWindowAlwaysOnTop(windowPtr, alwaysOnTop);
      },
      isWindowAlwaysOnTop: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          return false;
        }
        return native.symbols.isWindowAlwaysOnTop(windowPtr);
      },
      setWindowPosition: (params) => {
        const { winId, x, y } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't set window position. Window no longer exists`;
        }
        native.symbols.setWindowPosition(windowPtr, x, y);
      },
      setWindowSize: (params) => {
        const { winId, width, height } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't set window size. Window no longer exists`;
        }
        native.symbols.setWindowSize(windowPtr, width, height);
      },
      setWindowFrame: (params) => {
        const { winId, x, y, width, height } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          throw `Can't set window frame. Window no longer exists`;
        }
        native.symbols.setWindowFrame(windowPtr, x, y, width, height);
      },
      getWindowFrame: (params) => {
        const { winId } = params;
        const windowPtr = BrowserWindow.getById(winId)?.ptr;
        if (!windowPtr) {
          return { x: 0, y: 0, width: 0, height: 0 };
        }
        const xBuf = new Float64Array(1);
        const yBuf = new Float64Array(1);
        const widthBuf = new Float64Array(1);
        const heightBuf = new Float64Array(1);
        native.symbols.getWindowFrame(windowPtr, ptr(xBuf), ptr(yBuf), ptr(widthBuf), ptr(heightBuf));
        return {
          x: xBuf[0],
          y: yBuf[0],
          width: widthBuf[0],
          height: heightBuf[0]
        };
      },
      createWebview: (params) => {
        const {
          id,
          windowId,
          renderer,
          rpcPort: rpcPort2,
          secretKey,
          url,
          partition,
          preload,
          frame: { x, y, width, height },
          autoResize,
          sandbox,
          startTransparent,
          startPassthrough
        } = params;
        const parentWindow = BrowserWindow.getById(windowId);
        const windowPtr = parentWindow?.ptr;
        const transparent = parentWindow?.transparent ?? false;
        if (!windowPtr) {
          throw `Can't add webview to window. window no longer exists`;
        }
        let dynamicPreload;
        let selectedPreloadScript;
        if (sandbox) {
          dynamicPreload = `
window.__electrobunWebviewId = ${id};
window.__electrobunWindowId = ${windowId};
window.__electrobunEventBridge = window.__electrobunEventBridge || window.webkit?.messageHandlers?.eventBridge || window.eventBridge || window.chrome?.webview?.hostObjects?.eventBridge;
window.__electrobunInternalBridge = window.__electrobunInternalBridge || window.webkit?.messageHandlers?.internalBridge || window.internalBridge || window.chrome?.webview?.hostObjects?.internalBridge;
`;
          selectedPreloadScript = preloadScriptSandboxed;
        } else {
          dynamicPreload = `
window.__electrobunWebviewId = ${id};
window.__electrobunWindowId = ${windowId};
window.__electrobunRpcSocketPort = ${rpcPort2};
window.__electrobunSecretKeyBytes = [${secretKey}];
window.__electrobunEventBridge = window.__electrobunEventBridge || window.webkit?.messageHandlers?.eventBridge || window.eventBridge || window.chrome?.webview?.hostObjects?.eventBridge;
window.__electrobunInternalBridge = window.__electrobunInternalBridge || window.webkit?.messageHandlers?.internalBridge || window.internalBridge || window.chrome?.webview?.hostObjects?.internalBridge;
window.__electrobunBunBridge = window.__electrobunBunBridge || window.webkit?.messageHandlers?.bunBridge || window.bunBridge || window.chrome?.webview?.hostObjects?.bunBridge;
`;
          selectedPreloadScript = preloadScript;
        }
        const electrobunPreload = dynamicPreload + selectedPreloadScript;
        const customPreload = preload;
        native.symbols.setNextWebviewFlags(startTransparent, startPassthrough);
        const webviewPtr = native.symbols.initWebview(id, windowPtr, toCString(renderer), toCString(url || ""), x, y, width, height, autoResize, toCString(partition || "persist:default"), webviewDecideNavigation, webviewEventJSCallback, eventBridgeHandler, bunBridgePostmessageHandler, internalBridgeHandler, toCString(electrobunPreload), toCString(customPreload || ""), transparent, sandbox);
        if (!webviewPtr) {
          throw "Failed to create webview";
        }
        return webviewPtr;
      },
      evaluateJavascriptWithNoCompletion: (params) => {
        const { id, js } = params;
        const webview = BrowserView.getById(id);
        if (!webview?.ptr) {
          return;
        }
        native.symbols.evaluateJavaScriptWithNoCompletion(webview.ptr, toCString(js));
      },
      createTray: (params) => {
        const { id, title, image, template, width, height } = params;
        const trayPtr = native.symbols.createTray(id, toCString(title), toCString(image), template, width, height, trayItemHandler);
        if (!trayPtr) {
          throw "Failed to create tray";
        }
        return trayPtr;
      },
      setTrayTitle: (params) => {
        const { id, title } = params;
        const tray = Tray.getById(id);
        if (!tray)
          return;
        native.symbols.setTrayTitle(tray.ptr, toCString(title));
      },
      setTrayImage: (params) => {
        const { id, image } = params;
        const tray = Tray.getById(id);
        if (!tray)
          return;
        native.symbols.setTrayImage(tray.ptr, toCString(image));
      },
      setTrayMenu: (params) => {
        const { id, menuConfig } = params;
        const tray = Tray.getById(id);
        if (!tray)
          return;
        native.symbols.setTrayMenu(tray.ptr, toCString(menuConfig));
      },
      removeTray: (params) => {
        const { id } = params;
        const tray = Tray.getById(id);
        if (!tray) {
          throw `Can't remove tray. Tray no longer exists`;
        }
        native.symbols.removeTray(tray.ptr);
      },
      setApplicationMenu: (params) => {
        const { menuConfig } = params;
        native.symbols.setApplicationMenu(toCString(menuConfig), applicationMenuHandler);
      },
      showContextMenu: (params) => {
        const { menuConfig } = params;
        native.symbols.showContextMenu(toCString(menuConfig), contextMenuHandler);
      },
      moveToTrash: (params) => {
        const { path } = params;
        return native.symbols.moveToTrash(toCString(path));
      },
      showItemInFolder: (params) => {
        const { path } = params;
        native.symbols.showItemInFolder(toCString(path));
      },
      openExternal: (params) => {
        const { url } = params;
        return native.symbols.openExternal(toCString(url));
      },
      openPath: (params) => {
        const { path } = params;
        return native.symbols.openPath(toCString(path));
      },
      showNotification: (params) => {
        const { title, body = "", subtitle = "", silent = false } = params;
        native.symbols.showNotification(toCString(title), toCString(body), toCString(subtitle), silent);
      },
      openFileDialog: (params) => {
        const {
          startingFolder,
          allowedFileTypes,
          canChooseFiles,
          canChooseDirectory,
          allowsMultipleSelection
        } = params;
        const filePath = native.symbols.openFileDialog(toCString(startingFolder), toCString(allowedFileTypes), canChooseFiles ? 1 : 0, canChooseDirectory ? 1 : 0, allowsMultipleSelection ? 1 : 0);
        return filePath.toString();
      },
      showMessageBox: (params) => {
        const {
          type = "info",
          title = "",
          message = "",
          detail = "",
          buttons = ["OK"],
          defaultId = 0,
          cancelId = -1
        } = params;
        const buttonsStr = buttons.join(",");
        return native.symbols.showMessageBox(toCString(type), toCString(title), toCString(message), toCString(detail), toCString(buttonsStr), defaultId, cancelId);
      },
      clipboardReadText: () => {
        const result = native.symbols.clipboardReadText();
        if (!result)
          return null;
        return result.toString();
      },
      clipboardWriteText: (params) => {
        native.symbols.clipboardWriteText(toCString(params.text));
      },
      clipboardReadImage: () => {
        const sizeBuffer = new BigUint64Array(1);
        const dataPtr = native.symbols.clipboardReadImage(ptr(sizeBuffer));
        if (!dataPtr)
          return null;
        const size = Number(sizeBuffer[0]);
        if (size === 0)
          return null;
        const result = new Uint8Array(size);
        const sourceView = new Uint8Array(toArrayBuffer(dataPtr, 0, size));
        result.set(sourceView);
        return result;
      },
      clipboardWriteImage: (params) => {
        const { pngData } = params;
        native.symbols.clipboardWriteImage(ptr(pngData), BigInt(pngData.length));
      },
      clipboardClear: () => {
        native.symbols.clipboardClear();
      },
      clipboardAvailableFormats: () => {
        const result = native.symbols.clipboardAvailableFormats();
        if (!result)
          return [];
        const formatsStr = result.toString();
        if (!formatsStr)
          return [];
        return formatsStr.split(",").filter((f) => f.length > 0);
      }
    },
    internal: {
      storeMenuData,
      getMenuData,
      clearMenuData,
      serializeMenuAction,
      deserializeMenuAction
    }
  };
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception in worker:", err);
    native.symbols.stopEventLoop();
    native.symbols.waitForShutdownComplete(5000);
    native.symbols.forceExit(1);
  });
  process.on("unhandledRejection", (reason, _promise) => {
    console.error("Unhandled rejection in worker:", reason);
  });
  process.on("SIGINT", () => {
    console.log("[electrobun] Received SIGINT, running quit sequence...");
    const { quit: quit2 } = (init_Utils(), __toCommonJS(exports_Utils));
    quit2();
  });
  process.on("SIGTERM", () => {
    console.log("[electrobun] Received SIGTERM, running quit sequence...");
    const { quit: quit2 } = (init_Utils(), __toCommonJS(exports_Utils));
    quit2();
  });
  windowCloseCallback = new JSCallback((id) => {
    const handler = eventEmitter_default.events.window.close;
    const event = handler({
      id
    });
    eventEmitter_default.emitEvent(event, id);
    eventEmitter_default.emitEvent(event);
  }, {
    args: ["u32"],
    returns: "void",
    threadsafe: true
  });
  windowMoveCallback = new JSCallback((id, x, y) => {
    const handler = eventEmitter_default.events.window.move;
    const event = handler({
      id,
      x,
      y
    });
    eventEmitter_default.emitEvent(event);
    eventEmitter_default.emitEvent(event, id);
  }, {
    args: ["u32", "f64", "f64"],
    returns: "void",
    threadsafe: true
  });
  windowResizeCallback = new JSCallback((id, x, y, width, height) => {
    const handler = eventEmitter_default.events.window.resize;
    const event = handler({
      id,
      x,
      y,
      width,
      height
    });
    eventEmitter_default.emitEvent(event);
    eventEmitter_default.emitEvent(event, id);
  }, {
    args: ["u32", "f64", "f64", "f64", "f64"],
    returns: "void",
    threadsafe: true
  });
  windowFocusCallback = new JSCallback((id) => {
    const handler = eventEmitter_default.events.window.focus;
    const event = handler({
      id
    });
    eventEmitter_default.emitEvent(event);
    eventEmitter_default.emitEvent(event, id);
  }, {
    args: ["u32"],
    returns: "void",
    threadsafe: true
  });
  getMimeType = new JSCallback((filePath) => {
    const _filePath = new CString(filePath).toString();
    const mimeType = Bun.file(_filePath).type;
    return toCString(mimeType.split(";")[0]);
  }, {
    args: [FFIType.cstring],
    returns: FFIType.cstring
  });
  getHTMLForWebviewSync = new JSCallback((webviewId) => {
    const webview = BrowserView.getById(webviewId);
    return toCString(webview?.html || "");
  }, {
    args: [FFIType.u32],
    returns: FFIType.cstring
  });
  native.symbols.setJSUtils(getMimeType, getHTMLForWebviewSync);
  urlOpenCallback = new JSCallback((urlPtr) => {
    const url = new CString(urlPtr).toString();
    const handler = eventEmitter_default.events.app.openUrl;
    const event = handler({ url });
    eventEmitter_default.emitEvent(event);
  }, {
    args: [FFIType.cstring],
    returns: "void",
    threadsafe: true
  });
  if (process.platform === "darwin") {
    native.symbols.setURLOpenHandler(urlOpenCallback);
  }
  quitRequestedCallback = new JSCallback(() => {
    const { quit: quit2 } = (init_Utils(), __toCommonJS(exports_Utils));
    quit2();
  }, {
    args: [],
    returns: "void",
    threadsafe: true
  });
  native.symbols.setQuitRequestedHandler(quitRequestedCallback);
  globalShortcutHandlers = new Map;
  globalShortcutCallback = new JSCallback((acceleratorPtr) => {
    const accelerator = new CString(acceleratorPtr).toString();
    const handler = globalShortcutHandlers.get(accelerator);
    if (handler) {
      handler();
    }
  }, {
    args: [FFIType.cstring],
    returns: "void",
    threadsafe: true
  });
  native.symbols.setGlobalShortcutCallback(globalShortcutCallback);
  GlobalShortcut = {
    register: (accelerator, callback) => {
      if (globalShortcutHandlers.has(accelerator)) {
        return false;
      }
      const result = native.symbols.registerGlobalShortcut(toCString(accelerator));
      if (result) {
        globalShortcutHandlers.set(accelerator, callback);
      }
      return result;
    },
    unregister: (accelerator) => {
      const result = native.symbols.unregisterGlobalShortcut(toCString(accelerator));
      if (result) {
        globalShortcutHandlers.delete(accelerator);
      }
      return result;
    },
    unregisterAll: () => {
      native.symbols.unregisterAllGlobalShortcuts();
      globalShortcutHandlers.clear();
    },
    isRegistered: (accelerator) => {
      return native.symbols.isGlobalShortcutRegistered(toCString(accelerator));
    }
  };
  Screen = {
    getPrimaryDisplay: () => {
      const jsonStr = native.symbols.getPrimaryDisplay();
      if (!jsonStr) {
        return {
          id: 0,
          bounds: { x: 0, y: 0, width: 0, height: 0 },
          workArea: { x: 0, y: 0, width: 0, height: 0 },
          scaleFactor: 1,
          isPrimary: true
        };
      }
      try {
        return JSON.parse(jsonStr.toString());
      } catch {
        return {
          id: 0,
          bounds: { x: 0, y: 0, width: 0, height: 0 },
          workArea: { x: 0, y: 0, width: 0, height: 0 },
          scaleFactor: 1,
          isPrimary: true
        };
      }
    },
    getAllDisplays: () => {
      const jsonStr = native.symbols.getAllDisplays();
      if (!jsonStr) {
        return [];
      }
      try {
        return JSON.parse(jsonStr.toString());
      } catch {
        return [];
      }
    },
    getCursorScreenPoint: () => {
      const jsonStr = native.symbols.getCursorScreenPoint();
      if (!jsonStr) {
        return { x: 0, y: 0 };
      }
      try {
        return JSON.parse(jsonStr.toString());
      } catch {
        return { x: 0, y: 0 };
      }
    }
  };
  sessionCache = new Map;
  Session = {
    fromPartition: (partition) => {
      let session = sessionCache.get(partition);
      if (!session) {
        session = new SessionInstance(partition);
        sessionCache.set(partition, session);
      }
      return session;
    },
    get defaultSession() {
      return Session.fromPartition("persist:default");
    }
  };
  webviewDecideNavigation = new JSCallback((_webviewId, _url) => {
    return true;
  }, {
    args: [FFIType.u32, FFIType.cstring],
    returns: FFIType.u32,
    threadsafe: true
  });
  webviewEventJSCallback = new JSCallback((id, _eventName, _detail) => {
    let eventName = "";
    let detail = "";
    try {
      eventName = new CString(_eventName).toString();
      detail = new CString(_detail).toString();
    } catch (err) {
      console.error("[webviewEventJSCallback] Error converting strings:", err);
      console.error("[webviewEventJSCallback] Raw values:", {
        _eventName,
        _detail
      });
      return;
    }
    webviewEventHandler(id, eventName, detail);
  }, {
    args: [FFIType.u32, FFIType.cstring, FFIType.cstring],
    returns: FFIType.void,
    threadsafe: true
  });
  bunBridgePostmessageHandler = new JSCallback((id, msg) => {
    try {
      const msgStr = new CString(msg);
      if (!msgStr.length) {
        return;
      }
      const msgJson = JSON.parse(msgStr.toString());
      const webview = BrowserView.getById(id);
      if (!webview)
        return;
      webview.rpcHandler?.(msgJson);
    } catch (err) {
      console.error("error sending message to bun: ", err);
      console.error("msgString: ", new CString(msg));
    }
  }, {
    args: [FFIType.u32, FFIType.cstring],
    returns: FFIType.void,
    threadsafe: true
  });
  eventBridgeHandler = new JSCallback((_id, msg) => {
    try {
      const message = new CString(msg);
      const jsonMessage = JSON.parse(message.toString());
      if (jsonMessage.id === "webviewEvent") {
        const { payload } = jsonMessage;
        webviewEventHandler(payload.id, payload.eventName, payload.detail);
      }
    } catch (err) {
      console.error("error in eventBridgeHandler: ", err);
    }
  }, {
    args: [FFIType.u32, FFIType.cstring],
    returns: FFIType.void,
    threadsafe: true
  });
  internalBridgeHandler = new JSCallback((_id, msg) => {
    try {
      const batchMessage = new CString(msg);
      const jsonBatch = JSON.parse(batchMessage.toString());
      if (jsonBatch.id === "webviewEvent") {
        const { payload } = jsonBatch;
        webviewEventHandler(payload.id, payload.eventName, payload.detail);
        return;
      }
      jsonBatch.forEach((msgStr) => {
        const msgJson = JSON.parse(msgStr);
        if (msgJson.type === "message") {
          const handler = internalRpcHandlers.message[msgJson.id];
          handler?.(msgJson.payload);
        } else if (msgJson.type === "request") {
          const hostWebview = BrowserView.getById(msgJson.hostWebviewId);
          const handler = internalRpcHandlers.request[msgJson.method];
          const payload = handler?.(msgJson.params);
          const resultObj = {
            type: "response",
            id: msgJson.id,
            success: true,
            payload
          };
          if (!hostWebview) {
            console.log("--->>> internal request in bun: NO HOST WEBVIEW FOUND");
            return;
          }
          hostWebview.sendInternalMessageViaExecute(resultObj);
        }
      });
    } catch (err) {
      console.error("error in internalBridgeHandler: ", err);
    }
  }, {
    args: [FFIType.u32, FFIType.cstring],
    returns: FFIType.void,
    threadsafe: true
  });
  trayItemHandler = new JSCallback((id, action) => {
    const actionString = (new CString(action).toString() || "").trim();
    const { action: actualAction, data } = deserializeMenuAction(actionString);
    const event = eventEmitter_default.events.tray.trayClicked({
      id,
      action: actualAction,
      data
    });
    eventEmitter_default.emitEvent(event);
    eventEmitter_default.emitEvent(event, id);
  }, {
    args: [FFIType.u32, FFIType.cstring],
    returns: FFIType.void,
    threadsafe: true
  });
  applicationMenuHandler = new JSCallback((id, action) => {
    const actionString = new CString(action).toString();
    const { action: actualAction, data } = deserializeMenuAction(actionString);
    const event = eventEmitter_default.events.app.applicationMenuClicked({
      id,
      action: actualAction,
      data
    });
    eventEmitter_default.emitEvent(event);
  }, {
    args: [FFIType.u32, FFIType.cstring],
    returns: FFIType.void,
    threadsafe: true
  });
  contextMenuHandler = new JSCallback((_id, action) => {
    const actionString = new CString(action).toString();
    const { action: actualAction, data } = deserializeMenuAction(actionString);
    const event = eventEmitter_default.events.app.contextMenuClicked({
      action: actualAction,
      data
    });
    eventEmitter_default.emitEvent(event);
  }, {
    args: [FFIType.u32, FFIType.cstring],
    returns: FFIType.void,
    threadsafe: true
  });
  internalRpcHandlers = {
    request: {
      webviewTagInit: (params) => {
        const {
          hostWebviewId,
          windowId,
          renderer,
          html,
          preload,
          partition,
          frame,
          navigationRules,
          sandbox,
          transparent,
          passthrough
        } = params;
        const url = !params.url && !html ? "https://electrobun.dev" : params.url;
        const webviewForTag = new BrowserView({
          url,
          html,
          preload,
          partition,
          frame,
          hostWebviewId,
          autoResize: false,
          windowId,
          renderer,
          navigationRules,
          sandbox,
          startTransparent: transparent,
          startPassthrough: passthrough
        });
        return webviewForTag.id;
      },
      webviewTagCanGoBack: (params) => {
        const { id } = params;
        const webviewPtr = BrowserView.getById(id)?.ptr;
        if (!webviewPtr) {
          console.error("no webview ptr");
          return false;
        }
        return native.symbols.webviewCanGoBack(webviewPtr);
      },
      webviewTagCanGoForward: (params) => {
        const { id } = params;
        const webviewPtr = BrowserView.getById(id)?.ptr;
        if (!webviewPtr) {
          console.error("no webview ptr");
          return false;
        }
        return native.symbols.webviewCanGoForward(webviewPtr);
      }
    },
    message: {
      webviewTagResize: (params) => {
        const browserView = BrowserView.getById(params.id);
        const webviewPtr = browserView?.ptr;
        if (!webviewPtr) {
          console.log("[Bun] ERROR: webviewTagResize - no webview ptr found for id:", params.id);
          return;
        }
        const { x, y, width, height } = params.frame;
        native.symbols.resizeWebview(webviewPtr, x, y, width, height, toCString(params.masks));
      },
      webviewTagUpdateSrc: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagUpdateSrc: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.loadURLInWebView(webview.ptr, toCString(params.url));
      },
      webviewTagUpdateHtml: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagUpdateHtml: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.setWebviewHTMLContent(webview.id, toCString(params.html));
        webview.loadHTML(params.html);
        webview.html = params.html;
      },
      webviewTagUpdatePreload: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagUpdatePreload: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.updatePreloadScriptToWebView(webview.ptr, toCString("electrobun_custom_preload_script"), toCString(params.preload), true);
      },
      webviewTagGoBack: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagGoBack: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewGoBack(webview.ptr);
      },
      webviewTagGoForward: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagGoForward: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewGoForward(webview.ptr);
      },
      webviewTagReload: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagReload: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewReload(webview.ptr);
      },
      webviewTagRemove: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagRemove: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewRemove(webview.ptr);
      },
      startWindowMove: (params) => {
        const window = BrowserWindow.getById(params.id);
        if (!window)
          return;
        native.symbols.startWindowMove(window.ptr);
      },
      stopWindowMove: (_params) => {
        native.symbols.stopWindowMove();
      },
      webviewTagSetTransparent: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagSetTransparent: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewSetTransparent(webview.ptr, params.transparent);
      },
      webviewTagSetPassthrough: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagSetPassthrough: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewSetPassthrough(webview.ptr, params.enablePassthrough);
      },
      webviewTagSetHidden: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagSetHidden: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewSetHidden(webview.ptr, params.hidden);
      },
      webviewTagSetNavigationRules: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagSetNavigationRules: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        const rulesJson = JSON.stringify(params.rules);
        native.symbols.setWebviewNavigationRules(webview.ptr, toCString(rulesJson));
      },
      webviewTagFindInPage: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagFindInPage: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewFindInPage(webview.ptr, toCString(params.searchText), params.forward, params.matchCase);
      },
      webviewTagStopFind: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagStopFind: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewStopFind(webview.ptr);
      },
      webviewTagOpenDevTools: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagOpenDevTools: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewOpenDevTools(webview.ptr);
      },
      webviewTagCloseDevTools: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagCloseDevTools: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewCloseDevTools(webview.ptr);
      },
      webviewTagToggleDevTools: (params) => {
        const webview = BrowserView.getById(params.id);
        if (!webview || !webview.ptr) {
          console.error(`webviewTagToggleDevTools: BrowserView not found or has no ptr for id ${params.id}`);
          return;
        }
        native.symbols.webviewToggleDevTools(webview.ptr);
      },
      webviewEvent: (params) => {
        console.log("-----------------+webviewEvent", params);
      }
    }
  };
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/BrowserWindow.ts
class BrowserWindow {
  id = nextWindowId++;
  ptr;
  title = "Electrobun";
  state = "creating";
  url = null;
  html = null;
  preload = null;
  renderer = "native";
  transparent = false;
  navigationRules = null;
  sandbox = false;
  frame = {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  };
  webviewId;
  constructor(options = defaultOptions2) {
    this.title = options.title || "New Window";
    this.frame = options.frame ? { ...defaultOptions2.frame, ...options.frame } : { ...defaultOptions2.frame };
    this.url = options.url || null;
    this.html = options.html || null;
    this.preload = options.preload || null;
    this.renderer = options.renderer || defaultOptions2.renderer;
    this.transparent = options.transparent ?? false;
    this.navigationRules = options.navigationRules || null;
    this.sandbox = options.sandbox ?? false;
    this.init(options);
  }
  init({
    rpc,
    styleMask,
    titleBarStyle,
    transparent
  }) {
    this.ptr = ffi.request.createWindow({
      id: this.id,
      title: this.title,
      url: this.url || "",
      frame: {
        width: this.frame.width,
        height: this.frame.height,
        x: this.frame.x,
        y: this.frame.y
      },
      styleMask: {
        Borderless: false,
        Titled: true,
        Closable: true,
        Miniaturizable: true,
        Resizable: true,
        UnifiedTitleAndToolbar: false,
        FullScreen: false,
        FullSizeContentView: false,
        UtilityWindow: false,
        DocModalWindow: false,
        NonactivatingPanel: false,
        HUDWindow: false,
        ...styleMask || {},
        ...titleBarStyle === "hiddenInset" ? {
          Titled: true,
          FullSizeContentView: true
        } : {},
        ...titleBarStyle === "hidden" ? {
          Titled: false,
          FullSizeContentView: true
        } : {}
      },
      titleBarStyle: titleBarStyle || "default",
      transparent: transparent ?? false
    });
    BrowserWindowMap[this.id] = this;
    const webview = new BrowserView({
      url: this.url,
      html: this.html,
      preload: this.preload,
      renderer: this.renderer,
      frame: {
        x: 0,
        y: 0,
        width: this.frame.width,
        height: this.frame.height
      },
      rpc,
      windowId: this.id,
      navigationRules: this.navigationRules,
      sandbox: this.sandbox
    });
    console.log("setting webviewId: ", webview.id);
    this.webviewId = webview.id;
  }
  get webview() {
    return BrowserView.getById(this.webviewId);
  }
  static getById(id) {
    return BrowserWindowMap[id];
  }
  setTitle(title) {
    this.title = title;
    return ffi.request.setTitle({ winId: this.id, title });
  }
  close() {
    return ffi.request.closeWindow({ winId: this.id });
  }
  focus() {
    return ffi.request.focusWindow({ winId: this.id });
  }
  show() {
    return ffi.request.focusWindow({ winId: this.id });
  }
  minimize() {
    return ffi.request.minimizeWindow({ winId: this.id });
  }
  unminimize() {
    return ffi.request.restoreWindow({ winId: this.id });
  }
  isMinimized() {
    return ffi.request.isWindowMinimized({ winId: this.id });
  }
  maximize() {
    return ffi.request.maximizeWindow({ winId: this.id });
  }
  unmaximize() {
    return ffi.request.unmaximizeWindow({ winId: this.id });
  }
  isMaximized() {
    return ffi.request.isWindowMaximized({ winId: this.id });
  }
  setFullScreen(fullScreen) {
    return ffi.request.setWindowFullScreen({ winId: this.id, fullScreen });
  }
  isFullScreen() {
    return ffi.request.isWindowFullScreen({ winId: this.id });
  }
  setAlwaysOnTop(alwaysOnTop) {
    return ffi.request.setWindowAlwaysOnTop({ winId: this.id, alwaysOnTop });
  }
  isAlwaysOnTop() {
    return ffi.request.isWindowAlwaysOnTop({ winId: this.id });
  }
  setPosition(x, y) {
    this.frame.x = x;
    this.frame.y = y;
    return ffi.request.setWindowPosition({ winId: this.id, x, y });
  }
  setSize(width, height) {
    this.frame.width = width;
    this.frame.height = height;
    return ffi.request.setWindowSize({ winId: this.id, width, height });
  }
  setFrame(x, y, width, height) {
    this.frame = { x, y, width, height };
    return ffi.request.setWindowFrame({ winId: this.id, x, y, width, height });
  }
  getFrame() {
    const frame = ffi.request.getWindowFrame({ winId: this.id });
    this.frame = frame;
    return frame;
  }
  getPosition() {
    const frame = this.getFrame();
    return { x: frame.x, y: frame.y };
  }
  getSize() {
    const frame = this.getFrame();
    return { width: frame.width, height: frame.height };
  }
  on(name, handler) {
    const specificName = `${name}-${this.id}`;
    eventEmitter_default.on(specificName, handler);
  }
}
var buildConfig3, nextWindowId = 1, defaultOptions2, BrowserWindowMap;
var init_BrowserWindow = __esm(async () => {
  init_eventEmitter();
  init_BuildConfig();
  await __promiseAll([
    init_native(),
    init_BrowserView(),
    init_Utils()
  ]);
  buildConfig3 = await BuildConfig.get();
  defaultOptions2 = {
    title: "Electrobun",
    frame: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    },
    url: "https://electrobun.dev",
    html: null,
    preload: null,
    renderer: buildConfig3.defaultRenderer,
    titleBarStyle: "default",
    transparent: false,
    navigationRules: null,
    sandbox: false
  };
  BrowserWindowMap = {};
  eventEmitter_default.on("close", (event) => {
    const windowId = event.data.id;
    delete BrowserWindowMap[windowId];
    for (const view of BrowserView.getAll()) {
      if (view.windowId === windowId) {
        view.remove();
      }
    }
    const exitOnLastWindowClosed = buildConfig3.runtime?.exitOnLastWindowClosed ?? true;
    if (exitOnLastWindowClosed && Object.keys(BrowserWindowMap).length === 0) {
      quit();
    }
  });
});

// ../../node_modules/.pnpm/async-lock@1.4.1/node_modules/async-lock/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var AsyncLock = function(opts) {
    opts = opts || {};
    this.Promise = opts.Promise || Promise;
    this.queues = Object.create(null);
    this.domainReentrant = opts.domainReentrant || false;
    if (this.domainReentrant) {
      if (typeof process === "undefined" || typeof process.domain === "undefined") {
        throw new Error("Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, " + "use a NodeJS version that still implements Domain, or install a browser polyfill.");
      }
      this.domains = Object.create(null);
    }
    this.timeout = opts.timeout || AsyncLock.DEFAULT_TIMEOUT;
    this.maxOccupationTime = opts.maxOccupationTime || AsyncLock.DEFAULT_MAX_OCCUPATION_TIME;
    this.maxExecutionTime = opts.maxExecutionTime || AsyncLock.DEFAULT_MAX_EXECUTION_TIME;
    if (opts.maxPending === Infinity || Number.isInteger(opts.maxPending) && opts.maxPending >= 0) {
      this.maxPending = opts.maxPending;
    } else {
      this.maxPending = AsyncLock.DEFAULT_MAX_PENDING;
    }
  };
  AsyncLock.DEFAULT_TIMEOUT = 0;
  AsyncLock.DEFAULT_MAX_OCCUPATION_TIME = 0;
  AsyncLock.DEFAULT_MAX_EXECUTION_TIME = 0;
  AsyncLock.DEFAULT_MAX_PENDING = 1000;
  AsyncLock.prototype.acquire = function(key, fn, cb, opts) {
    if (Array.isArray(key)) {
      return this._acquireBatch(key, fn, cb, opts);
    }
    if (typeof fn !== "function") {
      throw new Error("You must pass a function to execute");
    }
    var deferredResolve = null;
    var deferredReject = null;
    var deferred = null;
    if (typeof cb !== "function") {
      opts = cb;
      cb = null;
      deferred = new this.Promise(function(resolve3, reject) {
        deferredResolve = resolve3;
        deferredReject = reject;
      });
    }
    opts = opts || {};
    var resolved = false;
    var timer = null;
    var occupationTimer = null;
    var executionTimer = null;
    var self = this;
    var done = function(locked, err, ret) {
      if (occupationTimer) {
        clearTimeout(occupationTimer);
        occupationTimer = null;
      }
      if (executionTimer) {
        clearTimeout(executionTimer);
        executionTimer = null;
      }
      if (locked) {
        if (!!self.queues[key] && self.queues[key].length === 0) {
          delete self.queues[key];
        }
        if (self.domainReentrant) {
          delete self.domains[key];
        }
      }
      if (!resolved) {
        if (!deferred) {
          if (typeof cb === "function") {
            cb(err, ret);
          }
        } else {
          if (err) {
            deferredReject(err);
          } else {
            deferredResolve(ret);
          }
        }
        resolved = true;
      }
      if (locked) {
        if (!!self.queues[key] && self.queues[key].length > 0) {
          self.queues[key].shift()();
        }
      }
    };
    var exec = function(locked) {
      if (resolved) {
        return done(locked);
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (self.domainReentrant && locked) {
        self.domains[key] = process.domain;
      }
      var maxExecutionTime = opts.maxExecutionTime || self.maxExecutionTime;
      if (maxExecutionTime) {
        executionTimer = setTimeout(function() {
          if (!!self.queues[key]) {
            done(locked, new Error("Maximum execution time is exceeded " + key));
          }
        }, maxExecutionTime);
      }
      if (fn.length === 1) {
        var called = false;
        try {
          fn(function(err, ret) {
            if (!called) {
              called = true;
              done(locked, err, ret);
            }
          });
        } catch (err) {
          if (!called) {
            called = true;
            done(locked, err);
          }
        }
      } else {
        self._promiseTry(function() {
          return fn();
        }).then(function(ret) {
          done(locked, undefined, ret);
        }, function(error) {
          done(locked, error);
        });
      }
    };
    if (self.domainReentrant && !!process.domain) {
      exec = process.domain.bind(exec);
    }
    var maxPending = opts.maxPending || self.maxPending;
    if (!self.queues[key]) {
      self.queues[key] = [];
      exec(true);
    } else if (self.domainReentrant && !!process.domain && process.domain === self.domains[key]) {
      exec(false);
    } else if (self.queues[key].length >= maxPending) {
      done(false, new Error("Too many pending tasks in queue " + key));
    } else {
      var taskFn = function() {
        exec(true);
      };
      if (opts.skipQueue) {
        self.queues[key].unshift(taskFn);
      } else {
        self.queues[key].push(taskFn);
      }
      var timeout = opts.timeout || self.timeout;
      if (timeout) {
        timer = setTimeout(function() {
          timer = null;
          done(false, new Error("async-lock timed out in queue " + key));
        }, timeout);
      }
    }
    var maxOccupationTime = opts.maxOccupationTime || self.maxOccupationTime;
    if (maxOccupationTime) {
      occupationTimer = setTimeout(function() {
        if (!!self.queues[key]) {
          done(false, new Error("Maximum occupation time is exceeded in queue " + key));
        }
      }, maxOccupationTime);
    }
    if (deferred) {
      return deferred;
    }
  };
  AsyncLock.prototype._acquireBatch = function(keys, fn, cb, opts) {
    if (typeof cb !== "function") {
      opts = cb;
      cb = null;
    }
    var self = this;
    var getFn = function(key, fn2) {
      return function(cb2) {
        self.acquire(key, fn2, cb2, opts);
      };
    };
    var fnx = keys.reduceRight(function(prev, key) {
      return getFn(key, prev);
    }, fn);
    if (typeof cb === "function") {
      fnx(cb);
    } else {
      return new this.Promise(function(resolve3, reject) {
        if (fnx.length === 1) {
          fnx(function(err, ret) {
            if (err) {
              reject(err);
            } else {
              resolve3(ret);
            }
          });
        } else {
          resolve3(fnx());
        }
      });
    }
  };
  AsyncLock.prototype.isBusy = function(key) {
    if (!key) {
      return Object.keys(this.queues).length > 0;
    } else {
      return !!this.queues[key];
    }
  };
  AsyncLock.prototype._promiseTry = function(fn) {
    try {
      return this.Promise.resolve(fn());
    } catch (e) {
      return this.Promise.reject(e);
    }
  };
  module.exports = AsyncLock;
});

// ../../node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS((exports, module) => {
  if (typeof Object.create === "function") {
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor;
        ctor.prototype.constructor = ctor;
      }
    };
  }
});

// ../../node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js
var require_inherits = __commonJS((exports, module) => {
  try {
    util = __require("util");
    if (typeof util.inherits !== "function")
      throw "";
    module.exports = util.inherits;
  } catch (e) {
    module.exports = require_inherits_browser();
  }
  var util;
});

// ../../node_modules/.pnpm/safe-buffer@5.2.1/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS((exports, module) => {
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var buffer = __require("buffer");
  var Buffer2 = buffer.Buffer;
  function copyProps(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  }
  if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer2(arg, encodingOrOffset, length);
  }
  SafeBuffer.prototype = Object.create(Buffer2.prototype);
  copyProps(Buffer2, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer2(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer2(size);
    if (fill !== undefined) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer2(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// ../../node_modules/.pnpm/isarray@2.0.5/node_modules/isarray/index.js
var require_isarray = __commonJS((exports, module) => {
  var toString = {}.toString;
  module.exports = Array.isArray || function(arr) {
    return toString.call(arr) == "[object Array]";
  };
});

// ../../node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/type.js
var require_type = __commonJS((exports, module) => {
  module.exports = TypeError;
});

// ../../node_modules/.pnpm/es-object-atoms@1.1.1/node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS((exports, module) => {
  module.exports = Object;
});

// ../../node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/index.js
var require_es_errors = __commonJS((exports, module) => {
  module.exports = Error;
});

// ../../node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/eval.js
var require_eval = __commonJS((exports, module) => {
  module.exports = EvalError;
});

// ../../node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/range.js
var require_range = __commonJS((exports, module) => {
  module.exports = RangeError;
});

// ../../node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/ref.js
var require_ref = __commonJS((exports, module) => {
  module.exports = ReferenceError;
});

// ../../node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/syntax.js
var require_syntax = __commonJS((exports, module) => {
  module.exports = SyntaxError;
});

// ../../node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/uri.js
var require_uri = __commonJS((exports, module) => {
  module.exports = URIError;
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/abs.js
var require_abs = __commonJS((exports, module) => {
  module.exports = Math.abs;
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/floor.js
var require_floor = __commonJS((exports, module) => {
  module.exports = Math.floor;
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/max.js
var require_max = __commonJS((exports, module) => {
  module.exports = Math.max;
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/min.js
var require_min = __commonJS((exports, module) => {
  module.exports = Math.min;
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/pow.js
var require_pow = __commonJS((exports, module) => {
  module.exports = Math.pow;
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/round.js
var require_round = __commonJS((exports, module) => {
  module.exports = Math.round;
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS((exports, module) => {
  module.exports = Number.isNaN || function isNaN2(a) {
    return a !== a;
  };
});

// ../../node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/sign.js
var require_sign = __commonJS((exports, module) => {
  var $isNaN = require_isNaN();
  module.exports = function sign(number) {
    if ($isNaN(number) || number === 0) {
      return number;
    }
    return number < 0 ? -1 : 1;
  };
});

// ../../node_modules/.pnpm/gopd@1.2.0/node_modules/gopd/gOPD.js
var require_gOPD = __commonJS((exports, module) => {
  module.exports = Object.getOwnPropertyDescriptor;
});

// ../../node_modules/.pnpm/gopd@1.2.0/node_modules/gopd/index.js
var require_gopd = __commonJS((exports, module) => {
  var $gOPD = require_gOPD();
  if ($gOPD) {
    try {
      $gOPD([], "length");
    } catch (e) {
      $gOPD = null;
    }
  }
  module.exports = $gOPD;
});

// ../../node_modules/.pnpm/es-define-property@1.0.1/node_modules/es-define-property/index.js
var require_es_define_property = __commonJS((exports, module) => {
  var $defineProperty = Object.defineProperty || false;
  if ($defineProperty) {
    try {
      $defineProperty({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty = false;
    }
  }
  module.exports = $defineProperty;
});

// ../../node_modules/.pnpm/has-symbols@1.1.0/node_modules/has-symbols/shams.js
var require_shams = __commonJS((exports, module) => {
  module.exports = function hasSymbols() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
      return false;
    }
    if (typeof Symbol.iterator === "symbol") {
      return true;
    }
    var obj = {};
    var sym = Symbol("test");
    var symObj = Object(sym);
    if (typeof sym === "string") {
      return false;
    }
    if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
      return false;
    }
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
      return false;
    }
    var symVal = 42;
    obj[sym] = symVal;
    for (var _ in obj) {
      return false;
    }
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
      return false;
    }
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
      return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
      if (descriptor.value !== symVal || descriptor.enumerable !== true) {
        return false;
      }
    }
    return true;
  };
});

// ../../node_modules/.pnpm/has-symbols@1.1.0/node_modules/has-symbols/index.js
var require_has_symbols = __commonJS((exports, module) => {
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  var hasSymbolSham = require_shams();
  module.exports = function hasNativeSymbols() {
    if (typeof origSymbol !== "function") {
      return false;
    }
    if (typeof Symbol !== "function") {
      return false;
    }
    if (typeof origSymbol("foo") !== "symbol") {
      return false;
    }
    if (typeof Symbol("bar") !== "symbol") {
      return false;
    }
    return hasSymbolSham();
  };
});

// ../../node_modules/.pnpm/get-proto@1.0.1/node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS((exports, module) => {
  module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
});

// ../../node_modules/.pnpm/get-proto@1.0.1/node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS((exports, module) => {
  var $Object = require_es_object_atoms();
  module.exports = $Object.getPrototypeOf || null;
});

// ../../node_modules/.pnpm/function-bind@1.1.2/node_modules/function-bind/implementation.js
var require_implementation = __commonJS((exports, module) => {
  var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
  var toStr = Object.prototype.toString;
  var max = Math.max;
  var funcType = "[object Function]";
  var concatty = function concatty2(a, b) {
    var arr = [];
    for (var i = 0;i < a.length; i += 1) {
      arr[i] = a[i];
    }
    for (var j = 0;j < b.length; j += 1) {
      arr[j + a.length] = b[j];
    }
    return arr;
  };
  var slicy = function slicy2(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0;i < arrLike.length; i += 1, j += 1) {
      arr[j] = arrLike[i];
    }
    return arr;
  };
  var joiny = function(arr, joiner) {
    var str = "";
    for (var i = 0;i < arr.length; i += 1) {
      str += arr[i];
      if (i + 1 < arr.length) {
        str += joiner;
      }
    }
    return str;
  };
  module.exports = function bind(that) {
    var target = this;
    if (typeof target !== "function" || toStr.apply(target) !== funcType) {
      throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);
    var bound;
    var binder = function() {
      if (this instanceof bound) {
        var result = target.apply(this, concatty(args, arguments));
        if (Object(result) === result) {
          return result;
        }
        return this;
      }
      return target.apply(that, concatty(args, arguments));
    };
    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0;i < boundLength; i++) {
      boundArgs[i] = "$" + i;
    }
    bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
    if (target.prototype) {
      var Empty = function Empty2() {};
      Empty.prototype = target.prototype;
      bound.prototype = new Empty;
      Empty.prototype = null;
    }
    return bound;
  };
});

// ../../node_modules/.pnpm/function-bind@1.1.2/node_modules/function-bind/index.js
var require_function_bind = __commonJS((exports, module) => {
  var implementation = require_implementation();
  module.exports = Function.prototype.bind || implementation;
});

// ../../node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS((exports, module) => {
  module.exports = Function.prototype.call;
});

// ../../node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS((exports, module) => {
  module.exports = Function.prototype.apply;
});

// ../../node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS((exports, module) => {
  module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
});

// ../../node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS((exports, module) => {
  var bind = require_function_bind();
  var $apply = require_functionApply();
  var $call = require_functionCall();
  var $reflectApply = require_reflectApply();
  module.exports = $reflectApply || bind.call($call, $apply);
});

// ../../node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS((exports, module) => {
  var bind = require_function_bind();
  var $TypeError = require_type();
  var $call = require_functionCall();
  var $actualApply = require_actualApply();
  module.exports = function callBindBasic(args) {
    if (args.length < 1 || typeof args[0] !== "function") {
      throw new $TypeError("a function is required");
    }
    return $actualApply(bind, $call, args);
  };
});

// ../../node_modules/.pnpm/dunder-proto@1.0.1/node_modules/dunder-proto/get.js
var require_get = __commonJS((exports, module) => {
  var callBind = require_call_bind_apply_helpers();
  var gOPD = require_gopd();
  var hasProtoAccessor;
  try {
    hasProtoAccessor = [].__proto__ === Array.prototype;
  } catch (e) {
    if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
      throw e;
    }
  }
  var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__");
  var $Object = Object;
  var $getPrototypeOf = $Object.getPrototypeOf;
  module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
    return $getPrototypeOf(value == null ? value : $Object(value));
  } : false;
});

// ../../node_modules/.pnpm/get-proto@1.0.1/node_modules/get-proto/index.js
var require_get_proto = __commonJS((exports, module) => {
  var reflectGetProto = require_Reflect_getPrototypeOf();
  var originalGetProto = require_Object_getPrototypeOf();
  var getDunderProto = require_get();
  module.exports = reflectGetProto ? function getProto(O) {
    return reflectGetProto(O);
  } : originalGetProto ? function getProto(O) {
    if (!O || typeof O !== "object" && typeof O !== "function") {
      throw new TypeError("getProto: not an object");
    }
    return originalGetProto(O);
  } : getDunderProto ? function getProto(O) {
    return getDunderProto(O);
  } : null;
});

// ../../node_modules/.pnpm/hasown@2.0.2/node_modules/hasown/index.js
var require_hasown = __commonJS((exports, module) => {
  var call = Function.prototype.call;
  var $hasOwn = Object.prototype.hasOwnProperty;
  var bind = require_function_bind();
  module.exports = bind.call(call, $hasOwn);
});

// ../../node_modules/.pnpm/get-intrinsic@1.3.0/node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS((exports, module) => {
  var undefined2;
  var $Object = require_es_object_atoms();
  var $Error = require_es_errors();
  var $EvalError = require_eval();
  var $RangeError = require_range();
  var $ReferenceError = require_ref();
  var $SyntaxError = require_syntax();
  var $TypeError = require_type();
  var $URIError = require_uri();
  var abs = require_abs();
  var floor = require_floor();
  var max = require_max();
  var min = require_min();
  var pow = require_pow();
  var round = require_round();
  var sign = require_sign();
  var $Function = Function;
  var getEvalledConstructor = function(expressionSyntax) {
    try {
      return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
    } catch (e) {}
  };
  var $gOPD = require_gopd();
  var $defineProperty = require_es_define_property();
  var throwTypeError = function() {
    throw new $TypeError;
  };
  var ThrowTypeError = $gOPD ? function() {
    try {
      arguments.callee;
      return throwTypeError;
    } catch (calleeThrows) {
      try {
        return $gOPD(arguments, "callee").get;
      } catch (gOPDthrows) {
        return throwTypeError;
      }
    }
  }() : throwTypeError;
  var hasSymbols = require_has_symbols()();
  var getProto = require_get_proto();
  var $ObjectGPO = require_Object_getPrototypeOf();
  var $ReflectGPO = require_Reflect_getPrototypeOf();
  var $apply = require_functionApply();
  var $call = require_functionCall();
  var needsEval = {};
  var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
  var INTRINSICS = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
    "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
    "%AsyncFromSyncIteratorPrototype%": undefined2,
    "%AsyncFunction%": needsEval,
    "%AsyncGenerator%": needsEval,
    "%AsyncGeneratorFunction%": needsEval,
    "%AsyncIteratorPrototype%": needsEval,
    "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
    "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
    "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": $Error,
    "%eval%": eval,
    "%EvalError%": $EvalError,
    "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
    "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
    "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
    "%Function%": $Function,
    "%GeneratorFunction%": needsEval,
    "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
    "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
    "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
    "%JSON%": typeof JSON === "object" ? JSON : undefined2,
    "%Map%": typeof Map === "undefined" ? undefined2 : Map,
    "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto(new Map()[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": $Object,
    "%Object.getOwnPropertyDescriptor%": $gOPD,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
    "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
    "%RangeError%": $RangeError,
    "%ReferenceError%": $ReferenceError,
    "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set === "undefined" ? undefined2 : Set,
    "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto(new Set()[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
    "%Symbol%": hasSymbols ? Symbol : undefined2,
    "%SyntaxError%": $SyntaxError,
    "%ThrowTypeError%": ThrowTypeError,
    "%TypedArray%": TypedArray,
    "%TypeError%": $TypeError,
    "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
    "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
    "%URIError%": $URIError,
    "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
    "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
    "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
    "%Function.prototype.call%": $call,
    "%Function.prototype.apply%": $apply,
    "%Object.defineProperty%": $defineProperty,
    "%Object.getPrototypeOf%": $ObjectGPO,
    "%Math.abs%": abs,
    "%Math.floor%": floor,
    "%Math.max%": max,
    "%Math.min%": min,
    "%Math.pow%": pow,
    "%Math.round%": round,
    "%Math.sign%": sign,
    "%Reflect.getPrototypeOf%": $ReflectGPO
  };
  if (getProto) {
    try {
      null.error;
    } catch (e) {
      errorProto = getProto(getProto(e));
      INTRINSICS["%Error.prototype%"] = errorProto;
    }
  }
  var errorProto;
  var doEval = function doEval2(name) {
    var value;
    if (name === "%AsyncFunction%") {
      value = getEvalledConstructor("async function () {}");
    } else if (name === "%GeneratorFunction%") {
      value = getEvalledConstructor("function* () {}");
    } else if (name === "%AsyncGeneratorFunction%") {
      value = getEvalledConstructor("async function* () {}");
    } else if (name === "%AsyncGenerator%") {
      var fn = doEval2("%AsyncGeneratorFunction%");
      if (fn) {
        value = fn.prototype;
      }
    } else if (name === "%AsyncIteratorPrototype%") {
      var gen = doEval2("%AsyncGenerator%");
      if (gen && getProto) {
        value = getProto(gen.prototype);
      }
    }
    INTRINSICS[name] = value;
    return value;
  };
  var LEGACY_ALIASES = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  };
  var bind = require_function_bind();
  var hasOwn = require_hasown();
  var $concat = bind.call($call, Array.prototype.concat);
  var $spliceApply = bind.call($apply, Array.prototype.splice);
  var $replace = bind.call($call, String.prototype.replace);
  var $strSlice = bind.call($call, String.prototype.slice);
  var $exec = bind.call($call, RegExp.prototype.exec);
  var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = function stringToPath2(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);
    if (first === "%" && last !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
    } else if (last === "%" && first !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
    }
    var result = [];
    $replace(string, rePropName, function(match, number, quote, subString) {
      result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
    });
    return result;
  };
  var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
    var intrinsicName = name;
    var alias;
    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
      alias = LEGACY_ALIASES[intrinsicName];
      intrinsicName = "%" + alias[0] + "%";
    }
    if (hasOwn(INTRINSICS, intrinsicName)) {
      var value = INTRINSICS[intrinsicName];
      if (value === needsEval) {
        value = doEval(intrinsicName);
      }
      if (typeof value === "undefined" && !allowMissing) {
        throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
      }
      return {
        alias,
        name: intrinsicName,
        value
      };
    }
    throw new $SyntaxError("intrinsic " + name + " does not exist!");
  };
  module.exports = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== "string" || name.length === 0) {
      throw new $TypeError("intrinsic name must be a non-empty string");
    }
    if (arguments.length > 1 && typeof allowMissing !== "boolean") {
      throw new $TypeError('"allowMissing" argument must be a boolean');
    }
    if ($exec(/^%?[^%]*%?$/, name) === null) {
      throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    }
    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
    var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
    var alias = intrinsic.alias;
    if (alias) {
      intrinsicBaseName = alias[0];
      $spliceApply(parts, $concat([0, 1], alias));
    }
    for (var i = 1, isOwn = true;i < parts.length; i += 1) {
      var part = parts[i];
      var first = $strSlice(part, 0, 1);
      var last = $strSlice(part, -1);
      if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
        throw new $SyntaxError("property names with quotes must have matching quotes");
      }
      if (part === "constructor" || !isOwn) {
        skipFurtherCaching = true;
      }
      intrinsicBaseName += "." + part;
      intrinsicRealName = "%" + intrinsicBaseName + "%";
      if (hasOwn(INTRINSICS, intrinsicRealName)) {
        value = INTRINSICS[intrinsicRealName];
      } else if (value != null) {
        if (!(part in value)) {
          if (!allowMissing) {
            throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
          }
          return;
        }
        if ($gOPD && i + 1 >= parts.length) {
          var desc = $gOPD(value, part);
          isOwn = !!desc;
          if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
            value = desc.get;
          } else {
            value = value[part];
          }
        } else {
          isOwn = hasOwn(value, part);
          value = value[part];
        }
        if (isOwn && !skipFurtherCaching) {
          INTRINSICS[intrinsicRealName] = value;
        }
      }
    }
    return value;
  };
});

// ../../node_modules/.pnpm/call-bound@1.0.4/node_modules/call-bound/index.js
var require_call_bound = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic();
  var callBindBasic = require_call_bind_apply_helpers();
  var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
  module.exports = function callBoundIntrinsic(name, allowMissing) {
    var intrinsic = GetIntrinsic(name, !!allowMissing);
    if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
      return callBindBasic([intrinsic]);
    }
    return intrinsic;
  };
});

// ../../node_modules/.pnpm/is-callable@1.2.7/node_modules/is-callable/index.js
var require_is_callable = __commonJS((exports, module) => {
  var fnToStr = Function.prototype.toString;
  var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
  var badArrayLike;
  var isCallableMarker;
  if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
    try {
      badArrayLike = Object.defineProperty({}, "length", {
        get: function() {
          throw isCallableMarker;
        }
      });
      isCallableMarker = {};
      reflectApply(function() {
        throw 42;
      }, null, badArrayLike);
    } catch (_) {
      if (_ !== isCallableMarker) {
        reflectApply = null;
      }
    }
  } else {
    reflectApply = null;
  }
  var constructorRegex = /^\s*class\b/;
  var isES6ClassFn = function isES6ClassFunction(value) {
    try {
      var fnStr = fnToStr.call(value);
      return constructorRegex.test(fnStr);
    } catch (e) {
      return false;
    }
  };
  var tryFunctionObject = function tryFunctionToStr(value) {
    try {
      if (isES6ClassFn(value)) {
        return false;
      }
      fnToStr.call(value);
      return true;
    } catch (e) {
      return false;
    }
  };
  var toStr = Object.prototype.toString;
  var objectClass = "[object Object]";
  var fnClass = "[object Function]";
  var genClass = "[object GeneratorFunction]";
  var ddaClass = "[object HTMLAllCollection]";
  var ddaClass2 = "[object HTML document.all class]";
  var ddaClass3 = "[object HTMLCollection]";
  var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
  var isIE68 = !(0 in [,]);
  var isDDA = function isDocumentDotAll() {
    return false;
  };
  if (typeof document === "object") {
    all = document.all;
    if (toStr.call(all) === toStr.call(document.all)) {
      isDDA = function isDocumentDotAll(value) {
        if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
          try {
            var str = toStr.call(value);
            return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
          } catch (e) {}
        }
        return false;
      };
    }
  }
  var all;
  module.exports = reflectApply ? function isCallable(value) {
    if (isDDA(value)) {
      return true;
    }
    if (!value) {
      return false;
    }
    if (typeof value !== "function" && typeof value !== "object") {
      return false;
    }
    try {
      reflectApply(value, null, badArrayLike);
    } catch (e) {
      if (e !== isCallableMarker) {
        return false;
      }
    }
    return !isES6ClassFn(value) && tryFunctionObject(value);
  } : function isCallable(value) {
    if (isDDA(value)) {
      return true;
    }
    if (!value) {
      return false;
    }
    if (typeof value !== "function" && typeof value !== "object") {
      return false;
    }
    if (hasToStringTag) {
      return tryFunctionObject(value);
    }
    if (isES6ClassFn(value)) {
      return false;
    }
    var strClass = toStr.call(value);
    if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
      return false;
    }
    return tryFunctionObject(value);
  };
});

// ../../node_modules/.pnpm/for-each@0.3.5/node_modules/for-each/index.js
var require_for_each = __commonJS((exports, module) => {
  var isCallable = require_is_callable();
  var toStr = Object.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var forEachArray = function forEachArray2(array, iterator, receiver) {
    for (var i = 0, len = array.length;i < len; i++) {
      if (hasOwnProperty.call(array, i)) {
        if (receiver == null) {
          iterator(array[i], i, array);
        } else {
          iterator.call(receiver, array[i], i, array);
        }
      }
    }
  };
  var forEachString = function forEachString2(string, iterator, receiver) {
    for (var i = 0, len = string.length;i < len; i++) {
      if (receiver == null) {
        iterator(string.charAt(i), i, string);
      } else {
        iterator.call(receiver, string.charAt(i), i, string);
      }
    }
  };
  var forEachObject = function forEachObject2(object, iterator, receiver) {
    for (var k in object) {
      if (hasOwnProperty.call(object, k)) {
        if (receiver == null) {
          iterator(object[k], k, object);
        } else {
          iterator.call(receiver, object[k], k, object);
        }
      }
    }
  };
  function isArray(x) {
    return toStr.call(x) === "[object Array]";
  }
  module.exports = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
      throw new TypeError("iterator must be a function");
    }
    var receiver;
    if (arguments.length >= 3) {
      receiver = thisArg;
    }
    if (isArray(list)) {
      forEachArray(list, iterator, receiver);
    } else if (typeof list === "string") {
      forEachString(list, iterator, receiver);
    } else {
      forEachObject(list, iterator, receiver);
    }
  };
});

// ../../node_modules/.pnpm/possible-typed-array-names@1.1.0/node_modules/possible-typed-array-names/index.js
var require_possible_typed_array_names = __commonJS((exports, module) => {
  module.exports = [
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array"
  ];
});

// ../../node_modules/.pnpm/available-typed-arrays@1.0.7/node_modules/available-typed-arrays/index.js
var require_available_typed_arrays = __commonJS((exports, module) => {
  var possibleNames = require_possible_typed_array_names();
  var g = typeof globalThis === "undefined" ? global : globalThis;
  module.exports = function availableTypedArrays() {
    var out = [];
    for (var i = 0;i < possibleNames.length; i++) {
      if (typeof g[possibleNames[i]] === "function") {
        out[out.length] = possibleNames[i];
      }
    }
    return out;
  };
});

// ../../node_modules/.pnpm/define-data-property@1.1.4/node_modules/define-data-property/index.js
var require_define_data_property = __commonJS((exports, module) => {
  var $defineProperty = require_es_define_property();
  var $SyntaxError = require_syntax();
  var $TypeError = require_type();
  var gopd = require_gopd();
  module.exports = function defineDataProperty(obj, property, value) {
    if (!obj || typeof obj !== "object" && typeof obj !== "function") {
      throw new $TypeError("`obj` must be an object or a function`");
    }
    if (typeof property !== "string" && typeof property !== "symbol") {
      throw new $TypeError("`property` must be a string or a symbol`");
    }
    if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
      throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
      throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
      throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
      throw new $TypeError("`loose`, if provided, must be a boolean");
    }
    var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
    var nonWritable = arguments.length > 4 ? arguments[4] : null;
    var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
    var loose = arguments.length > 6 ? arguments[6] : false;
    var desc = !!gopd && gopd(obj, property);
    if ($defineProperty) {
      $defineProperty(obj, property, {
        configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
        enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
        value,
        writable: nonWritable === null && desc ? desc.writable : !nonWritable
      });
    } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
      obj[property] = value;
    } else {
      throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
    }
  };
});

// ../../node_modules/.pnpm/has-property-descriptors@1.0.2/node_modules/has-property-descriptors/index.js
var require_has_property_descriptors = __commonJS((exports, module) => {
  var $defineProperty = require_es_define_property();
  var hasPropertyDescriptors = function hasPropertyDescriptors2() {
    return !!$defineProperty;
  };
  hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
    if (!$defineProperty) {
      return null;
    }
    try {
      return $defineProperty([], "length", { value: 1 }).length !== 1;
    } catch (e) {
      return true;
    }
  };
  module.exports = hasPropertyDescriptors;
});

// ../../node_modules/.pnpm/set-function-length@1.2.2/node_modules/set-function-length/index.js
var require_set_function_length = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic();
  var define2 = require_define_data_property();
  var hasDescriptors = require_has_property_descriptors()();
  var gOPD = require_gopd();
  var $TypeError = require_type();
  var $floor = GetIntrinsic("%Math.floor%");
  module.exports = function setFunctionLength(fn, length) {
    if (typeof fn !== "function") {
      throw new $TypeError("`fn` is not a function");
    }
    if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
      throw new $TypeError("`length` must be a positive 32-bit integer");
    }
    var loose = arguments.length > 2 && !!arguments[2];
    var functionLengthIsConfigurable = true;
    var functionLengthIsWritable = true;
    if ("length" in fn && gOPD) {
      var desc = gOPD(fn, "length");
      if (desc && !desc.configurable) {
        functionLengthIsConfigurable = false;
      }
      if (desc && !desc.writable) {
        functionLengthIsWritable = false;
      }
    }
    if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
      if (hasDescriptors) {
        define2(fn, "length", length, true, true);
      } else {
        define2(fn, "length", length);
      }
    }
    return fn;
  };
});

// ../../node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/applyBind.js
var require_applyBind = __commonJS((exports, module) => {
  var bind = require_function_bind();
  var $apply = require_functionApply();
  var actualApply = require_actualApply();
  module.exports = function applyBind() {
    return actualApply(bind, $apply, arguments);
  };
});

// ../../node_modules/.pnpm/call-bind@1.0.8/node_modules/call-bind/index.js
var require_call_bind = __commonJS((exports, module) => {
  var setFunctionLength = require_set_function_length();
  var $defineProperty = require_es_define_property();
  var callBindBasic = require_call_bind_apply_helpers();
  var applyBind = require_applyBind();
  module.exports = function callBind(originalFunction) {
    var func = callBindBasic(arguments);
    var adjustedLength = originalFunction.length - (arguments.length - 1);
    return setFunctionLength(func, 1 + (adjustedLength > 0 ? adjustedLength : 0), true);
  };
  if ($defineProperty) {
    $defineProperty(module.exports, "apply", { value: applyBind });
  } else {
    module.exports.apply = applyBind;
  }
});

// ../../node_modules/.pnpm/has-tostringtag@1.0.2/node_modules/has-tostringtag/shams.js
var require_shams2 = __commonJS((exports, module) => {
  var hasSymbols = require_shams();
  module.exports = function hasToStringTagShams() {
    return hasSymbols() && !!Symbol.toStringTag;
  };
});

// ../../node_modules/.pnpm/which-typed-array@1.1.20/node_modules/which-typed-array/index.js
var require_which_typed_array = __commonJS((exports, module) => {
  var forEach = require_for_each();
  var availableTypedArrays = require_available_typed_arrays();
  var callBind = require_call_bind();
  var callBound = require_call_bound();
  var gOPD = require_gopd();
  var getProto = require_get_proto();
  var $toString = callBound("Object.prototype.toString");
  var hasToStringTag = require_shams2()();
  var g = typeof globalThis === "undefined" ? global : globalThis;
  var typedArrays = availableTypedArrays();
  var $slice = callBound("String.prototype.slice");
  var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
    for (var i = 0;i < array.length; i += 1) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  };
  var cache = { __proto__: null };
  if (hasToStringTag && gOPD && getProto) {
    forEach(typedArrays, function(typedArray) {
      var arr = new g[typedArray];
      if (Symbol.toStringTag in arr && getProto) {
        var proto = getProto(arr);
        var descriptor = gOPD(proto, Symbol.toStringTag);
        if (!descriptor && proto) {
          var superProto = getProto(proto);
          descriptor = gOPD(superProto, Symbol.toStringTag);
        }
        if (descriptor && descriptor.get) {
          var bound = callBind(descriptor.get);
          cache["$" + typedArray] = bound;
        }
      }
    });
  } else {
    forEach(typedArrays, function(typedArray) {
      var arr = new g[typedArray];
      var fn = arr.slice || arr.set;
      if (fn) {
        var bound = callBind(fn);
        cache["$" + typedArray] = bound;
      }
    });
  }
  var tryTypedArrays = function tryAllTypedArrays(value) {
    var found = false;
    forEach(cache, function(getter, typedArray) {
      if (!found) {
        try {
          if ("$" + getter(value) === typedArray) {
            found = $slice(typedArray, 1);
          }
        } catch (e) {}
      }
    });
    return found;
  };
  var trySlices = function tryAllSlices(value) {
    var found = false;
    forEach(cache, function(getter, name) {
      if (!found) {
        try {
          getter(value);
          found = $slice(name, 1);
        } catch (e) {}
      }
    });
    return found;
  };
  module.exports = function whichTypedArray(value) {
    if (!value || typeof value !== "object") {
      return false;
    }
    if (!hasToStringTag) {
      var tag = $slice($toString(value), 8, -1);
      if ($indexOf(typedArrays, tag) > -1) {
        return tag;
      }
      if (tag !== "Object") {
        return false;
      }
      return trySlices(value);
    }
    if (!gOPD) {
      return null;
    }
    return tryTypedArrays(value);
  };
});

// ../../node_modules/.pnpm/is-typed-array@1.1.15/node_modules/is-typed-array/index.js
var require_is_typed_array = __commonJS((exports, module) => {
  var whichTypedArray = require_which_typed_array();
  module.exports = function isTypedArray(value) {
    return !!whichTypedArray(value);
  };
});

// ../../node_modules/.pnpm/typed-array-buffer@1.0.3/node_modules/typed-array-buffer/index.js
var require_typed_array_buffer = __commonJS((exports, module) => {
  var $TypeError = require_type();
  var callBound = require_call_bound();
  var $typedArrayBuffer = callBound("TypedArray.prototype.buffer", true);
  var isTypedArray = require_is_typed_array();
  module.exports = $typedArrayBuffer || function typedArrayBuffer(x) {
    if (!isTypedArray(x)) {
      throw new $TypeError("Not a Typed Array");
    }
    return x.buffer;
  };
});

// ../../node_modules/.pnpm/to-buffer@1.2.2/node_modules/to-buffer/index.js
var require_to_buffer = __commonJS((exports, module) => {
  var Buffer2 = require_safe_buffer().Buffer;
  var isArray = require_isarray();
  var typedArrayBuffer = require_typed_array_buffer();
  var isView = ArrayBuffer.isView || function isView2(obj) {
    try {
      typedArrayBuffer(obj);
      return true;
    } catch (e) {
      return false;
    }
  };
  var useUint8Array = typeof Uint8Array !== "undefined";
  var useArrayBuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
  var useFromArrayBuffer = useArrayBuffer && (Buffer2.prototype instanceof Uint8Array || Buffer2.TYPED_ARRAY_SUPPORT);
  module.exports = function toBuffer(data, encoding) {
    if (Buffer2.isBuffer(data)) {
      if (data.constructor && !("isBuffer" in data)) {
        return Buffer2.from(data);
      }
      return data;
    }
    if (typeof data === "string") {
      return Buffer2.from(data, encoding);
    }
    if (useArrayBuffer && isView(data)) {
      if (data.byteLength === 0) {
        return Buffer2.alloc(0);
      }
      if (useFromArrayBuffer) {
        var res = Buffer2.from(data.buffer, data.byteOffset, data.byteLength);
        if (res.byteLength === data.byteLength) {
          return res;
        }
      }
      var uint8 = data instanceof Uint8Array ? data : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      var result = Buffer2.from(uint8);
      if (result.length === data.byteLength) {
        return result;
      }
    }
    if (useUint8Array && data instanceof Uint8Array) {
      return Buffer2.from(data);
    }
    var isArr = isArray(data);
    if (isArr) {
      for (var i = 0;i < data.length; i += 1) {
        var x = data[i];
        if (typeof x !== "number" || x < 0 || x > 255 || ~~x !== x) {
          throw new RangeError("Array items must be numbers in the range 0-255.");
        }
      }
    }
    if (isArr || Buffer2.isBuffer(data) && data.constructor && typeof data.constructor.isBuffer === "function" && data.constructor.isBuffer(data)) {
      return Buffer2.from(data);
    }
    throw new TypeError('The "data" argument must be a string, an Array, a Buffer, a Uint8Array, or a DataView.');
  };
});

// ../../node_modules/.pnpm/sha.js@2.4.12/node_modules/sha.js/hash.js
var require_hash = __commonJS((exports, module) => {
  var Buffer2 = require_safe_buffer().Buffer;
  var toBuffer = require_to_buffer();
  function Hash(blockSize, finalSize) {
    this._block = Buffer2.alloc(blockSize);
    this._finalSize = finalSize;
    this._blockSize = blockSize;
    this._len = 0;
  }
  Hash.prototype.update = function(data, enc) {
    data = toBuffer(data, enc || "utf8");
    var block = this._block;
    var blockSize = this._blockSize;
    var length = data.length;
    var accum = this._len;
    for (var offset = 0;offset < length; ) {
      var assigned = accum % blockSize;
      var remainder = Math.min(length - offset, blockSize - assigned);
      for (var i = 0;i < remainder; i++) {
        block[assigned + i] = data[offset + i];
      }
      accum += remainder;
      offset += remainder;
      if (accum % blockSize === 0) {
        this._update(block);
      }
    }
    this._len += length;
    return this;
  };
  Hash.prototype.digest = function(enc) {
    var rem = this._len % this._blockSize;
    this._block[rem] = 128;
    this._block.fill(0, rem + 1);
    if (rem >= this._finalSize) {
      this._update(this._block);
      this._block.fill(0);
    }
    var bits = this._len * 8;
    if (bits <= 4294967295) {
      this._block.writeUInt32BE(bits, this._blockSize - 4);
    } else {
      var lowBits = (bits & 4294967295) >>> 0;
      var highBits = (bits - lowBits) / 4294967296;
      this._block.writeUInt32BE(highBits, this._blockSize - 8);
      this._block.writeUInt32BE(lowBits, this._blockSize - 4);
    }
    this._update(this._block);
    var hash2 = this._hash();
    return enc ? hash2.toString(enc) : hash2;
  };
  Hash.prototype._update = function() {
    throw new Error("_update must be implemented by subclass");
  };
  module.exports = Hash;
});

// ../../node_modules/.pnpm/sha.js@2.4.12/node_modules/sha.js/sha1.js
var require_sha1 = __commonJS((exports, module) => {
  var inherits = require_inherits();
  var Hash = require_hash();
  var Buffer2 = require_safe_buffer().Buffer;
  var K = [
    1518500249,
    1859775393,
    2400959708 | 0,
    3395469782 | 0
  ];
  var W = new Array(80);
  function Sha1() {
    this.init();
    this._w = W;
    Hash.call(this, 64, 56);
  }
  inherits(Sha1, Hash);
  Sha1.prototype.init = function() {
    this._a = 1732584193;
    this._b = 4023233417;
    this._c = 2562383102;
    this._d = 271733878;
    this._e = 3285377520;
    return this;
  };
  function rotl1(num) {
    return num << 1 | num >>> 31;
  }
  function rotl5(num) {
    return num << 5 | num >>> 27;
  }
  function rotl30(num) {
    return num << 30 | num >>> 2;
  }
  function ft(s, b, c, d) {
    if (s === 0) {
      return b & c | ~b & d;
    }
    if (s === 2) {
      return b & c | b & d | c & d;
    }
    return b ^ c ^ d;
  }
  Sha1.prototype._update = function(M) {
    var w = this._w;
    var a = this._a | 0;
    var b = this._b | 0;
    var c = this._c | 0;
    var d = this._d | 0;
    var e = this._e | 0;
    for (var i = 0;i < 16; ++i) {
      w[i] = M.readInt32BE(i * 4);
    }
    for (;i < 80; ++i) {
      w[i] = rotl1(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]);
    }
    for (var j = 0;j < 80; ++j) {
      var s = ~~(j / 20);
      var t = rotl5(a) + ft(s, b, c, d) + e + w[j] + K[s] | 0;
      e = d;
      d = c;
      c = rotl30(b);
      b = a;
      a = t;
    }
    this._a = a + this._a | 0;
    this._b = b + this._b | 0;
    this._c = c + this._c | 0;
    this._d = d + this._d | 0;
    this._e = e + this._e | 0;
  };
  Sha1.prototype._hash = function() {
    var H = Buffer2.allocUnsafe(20);
    H.writeInt32BE(this._a | 0, 0);
    H.writeInt32BE(this._b | 0, 4);
    H.writeInt32BE(this._c | 0, 8);
    H.writeInt32BE(this._d | 0, 12);
    H.writeInt32BE(this._e | 0, 16);
    return H;
  };
  module.exports = Sha1;
});

// ../../node_modules/.pnpm/crc-32@1.2.2/node_modules/crc-32/crc32.js
var require_crc32 = __commonJS((exports) => {
  /*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
  var CRC32;
  (function(factory) {
    if (typeof DO_NOT_EXPORT_CRC === "undefined") {
      if (typeof exports === "object") {
        factory(exports);
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          var module2 = {};
          factory(module2);
          return module2;
        });
      } else {
        factory(CRC32 = {});
      }
    } else {
      factory(CRC32 = {});
    }
  })(function(CRC322) {
    CRC322.version = "1.2.2";
    function signed_crc_table() {
      var c = 0, table = new Array(256);
      for (var n = 0;n != 256; ++n) {
        c = n;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
        table[n] = c;
      }
      return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
    }
    var T0 = signed_crc_table();
    function slice_by_16_tables(T) {
      var c = 0, v = 0, n = 0, table = typeof Int32Array !== "undefined" ? new Int32Array(4096) : new Array(4096);
      for (n = 0;n != 256; ++n)
        table[n] = T[n];
      for (n = 0;n != 256; ++n) {
        v = T[n];
        for (c = 256 + n;c < 4096; c += 256)
          v = table[c] = v >>> 8 ^ T[v & 255];
      }
      var out = [];
      for (n = 1;n != 16; ++n)
        out[n - 1] = typeof Int32Array !== "undefined" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
      return out;
    }
    var TT = slice_by_16_tables(T0);
    var T1 = TT[0], T2 = TT[1], T3 = TT[2], T4 = TT[3], T5 = TT[4];
    var T6 = TT[5], T7 = TT[6], T8 = TT[7], T9 = TT[8], Ta = TT[9];
    var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
    function crc32_bstr(bstr, seed) {
      var C = seed ^ -1;
      for (var i = 0, L = bstr.length;i < L; )
        C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 255];
      return ~C;
    }
    function crc32_buf(B, seed) {
      var C = seed ^ -1, L = B.length - 15, i = 0;
      for (;i < L; )
        C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
      L += 15;
      while (i < L)
        C = C >>> 8 ^ T0[(C ^ B[i++]) & 255];
      return ~C;
    }
    function crc32_str(str, seed) {
      var C = seed ^ -1;
      for (var i = 0, L = str.length, c = 0, d = 0;i < L; ) {
        c = str.charCodeAt(i++);
        if (c < 128) {
          C = C >>> 8 ^ T0[(C ^ c) & 255];
        } else if (c < 2048) {
          C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 255];
          C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
        } else if (c >= 55296 && c < 57344) {
          c = (c & 1023) + 64;
          d = str.charCodeAt(i++) & 1023;
          C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 255];
          C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 255];
          C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
          C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 255];
        } else {
          C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 255];
          C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 255];
          C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
        }
      }
      return ~C;
    }
    CRC322.table = T0;
    CRC322.bstr = crc32_bstr;
    CRC322.buf = crc32_buf;
    CRC322.str = crc32_str;
  });
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/common.js
var require_common = __commonJS((exports) => {
  var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
  function _has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  exports.assign = function(obj) {
    var sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      var source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (var p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };
  exports.shrinkBuf = function(buf, size) {
    if (buf.length === size) {
      return buf;
    }
    if (buf.subarray) {
      return buf.subarray(0, size);
    }
    buf.length = size;
    return buf;
  };
  var fnTyped = {
    arraySet: function(dest, src, src_offs, len, dest_offs) {
      if (src.subarray && dest.subarray) {
        dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
        return;
      }
      for (var i = 0;i < len; i++) {
        dest[dest_offs + i] = src[src_offs + i];
      }
    },
    flattenChunks: function(chunks) {
      var i, l, len, pos, chunk, result;
      len = 0;
      for (i = 0, l = chunks.length;i < l; i++) {
        len += chunks[i].length;
      }
      result = new Uint8Array(len);
      pos = 0;
      for (i = 0, l = chunks.length;i < l; i++) {
        chunk = chunks[i];
        result.set(chunk, pos);
        pos += chunk.length;
      }
      return result;
    }
  };
  var fnUntyped = {
    arraySet: function(dest, src, src_offs, len, dest_offs) {
      for (var i = 0;i < len; i++) {
        dest[dest_offs + i] = src[src_offs + i];
      }
    },
    flattenChunks: function(chunks) {
      return [].concat.apply([], chunks);
    }
  };
  exports.setTyped = function(on3) {
    if (on3) {
      exports.Buf8 = Uint8Array;
      exports.Buf16 = Uint16Array;
      exports.Buf32 = Int32Array;
      exports.assign(exports, fnTyped);
    } else {
      exports.Buf8 = Array;
      exports.Buf16 = Array;
      exports.Buf32 = Array;
      exports.assign(exports, fnUntyped);
    }
  };
  exports.setTyped(TYPED_OK);
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS((exports) => {
  var utils = require_common();
  var Z_FIXED = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN = 2;
  function zero(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  var extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
  var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array((L_CODES + 2) * 2);
  zero(static_ltree);
  var static_dtree = new Array(D_CODES * 2);
  zero(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero(_dist_code);
  var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
  zero(_length_code);
  var base_length = new Array(LENGTH_CODES);
  zero(base_length);
  var base_dist = new Array(D_CODES);
  zero(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  function d_code(dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  }
  function put_short(s, w) {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  }
  function send_bits(s, value, length) {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  }
  function send_code(s, c, tree) {
    send_bits(s, tree[c * 2], tree[c * 2 + 1]);
  }
  function bi_reverse(code, len) {
    var res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  }
  function bi_flush(s) {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  }
  function gen_bitlen(s, desc) {
    var tree = desc.dyn_tree;
    var max_code = desc.max_code;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var extra = desc.stat_desc.extra_bits;
    var base = desc.stat_desc.extra_base;
    var max_length = desc.stat_desc.max_length;
    var h;
    var n, m;
    var bits;
    var xbits;
    var f;
    var overflow = 0;
    for (bits = 0;bits <= MAX_BITS; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1;h < HEAP_SIZE; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length;bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  }
  function gen_codes(tree, max_code, bl_count) {
    var next_code = new Array(MAX_BITS + 1);
    var code = 0;
    var bits;
    var n;
    for (bits = 1;bits <= MAX_BITS; bits++) {
      next_code[bits] = code = code + bl_count[bits - 1] << 1;
    }
    for (n = 0;n <= max_code; n++) {
      var len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  }
  function tr_static_init() {
    var n;
    var bits;
    var length;
    var code;
    var dist;
    var bl_count = new Array(MAX_BITS + 1);
    length = 0;
    for (code = 0;code < LENGTH_CODES - 1; code++) {
      base_length[code] = length;
      for (n = 0;n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0;code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0;n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    dist >>= 7;
    for (;code < D_CODES; code++) {
      base_dist[code] = dist << 7;
      for (n = 0;n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    for (bits = 0;bits <= MAX_BITS; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES + 1, bl_count);
    for (n = 0;n < D_CODES; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
  }
  function init_block(s) {
    var n;
    for (n = 0;n < L_CODES; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0;n < D_CODES; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0;n < BL_CODES; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.last_lit = s.matches = 0;
  }
  function bi_windup(s) {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  }
  function copy_block(s, buf, len, header) {
    bi_windup(s);
    if (header) {
      put_short(s, len);
      put_short(s, ~len);
    }
    utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
    s.pending += len;
  }
  function smaller(tree, n, m, depth) {
    var _n2 = n * 2;
    var _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  }
  function pqdownheap(s, tree, k) {
    var v = s.heap[k];
    var j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  }
  function compress_block(s, ltree, dtree) {
    var dist;
    var lc;
    var lx = 0;
    var code;
    var extra;
    if (s.last_lit !== 0) {
      do {
        dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
        lc = s.pending_buf[s.l_buf + lx];
        lx++;
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code = _length_code[lc];
          send_code(s, code + LITERALS + 1, ltree);
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);
          }
          dist--;
          code = d_code(dist);
          send_code(s, code, dtree);
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);
          }
        }
      } while (lx < s.last_lit);
    }
    send_code(s, END_BLOCK, ltree);
  }
  function build_tree(s, desc) {
    var tree = desc.dyn_tree;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var elems = desc.stat_desc.elems;
    var n, m;
    var max_code = -1;
    var node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE;
    for (n = 0;n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1;n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[1];
      s.heap[1] = s.heap[s.heap_len--];
      pqdownheap(s, tree, 1);
      m = s.heap[1];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[1] = node++;
      pqdownheap(s, tree, 1);
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[1];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  }
  function scan_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0;n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }
  function send_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0;n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }
  function build_bl_tree(s) {
    var max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES - 1;max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  }
  function send_all_trees(s, lcodes, dcodes, blcodes) {
    var rank;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank = 0;rank < blcodes; rank++) {
      send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  }
  function detect_data_type(s) {
    var black_mask = 4093624447;
    var n;
    for (n = 0;n <= 31; n++, black_mask >>>= 1) {
      if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32;n < LITERALS; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  }
  var static_init_done = false;
  function _tr_init(s) {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  }
  function _tr_stored_block(s, buf, stored_len, last) {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    copy_block(s, buf, stored_len, true);
  }
  function _tr_align(s) {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  }
  function _tr_flush_block(s, buf, stored_len, last) {
    var opt_lenb, static_lenb;
    var max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  }
  function _tr_tally(s, dist, lc) {
    s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
    s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
    s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
    s.last_lit++;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.last_lit === s.lit_bufsize - 1;
  }
  exports._tr_init = _tr_init;
  exports._tr_stored_block = _tr_stored_block;
  exports._tr_flush_block = _tr_flush_block;
  exports._tr_tally = _tr_tally;
  exports._tr_align = _tr_align;
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS((exports, module) => {
  function adler32(adler, buf, len, pos) {
    var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2000 ? 2000 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  }
  module.exports = adler32;
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/crc32.js
var require_crc322 = __commonJS((exports, module) => {
  function makeTable() {
    var c, table = [];
    for (var n = 0;n < 256; n++) {
      c = n;
      for (var k = 0;k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  }
  var crcTable = makeTable();
  function crc32(crc, buf, len, pos) {
    var t = crcTable, end = pos + len;
    crc ^= -1;
    for (var i = pos;i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  }
  module.exports = crc32;
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS((exports, module) => {
  module.exports = {
    2: "need dictionary",
    1: "stream end",
    0: "",
    "-1": "file error",
    "-2": "stream error",
    "-3": "data error",
    "-4": "insufficient memory",
    "-5": "buffer error",
    "-6": "incompatible version"
  };
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS((exports) => {
  var utils = require_common();
  var trees = require_trees();
  var adler32 = require_adler32();
  var crc32 = require_crc322();
  var msg = require_messages();
  var Z_NO_FLUSH = 0;
  var Z_PARTIAL_FLUSH = 1;
  var Z_FULL_FLUSH = 3;
  var Z_FINISH = 4;
  var Z_BLOCK = 5;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_BUF_ERROR = -5;
  var Z_DEFAULT_COMPRESSION = -1;
  var Z_FILTERED = 1;
  var Z_HUFFMAN_ONLY = 2;
  var Z_RLE = 3;
  var Z_FIXED = 4;
  var Z_DEFAULT_STRATEGY = 0;
  var Z_UNKNOWN = 2;
  var Z_DEFLATED = 8;
  var MAX_MEM_LEVEL = 9;
  var MAX_WBITS = 15;
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  function err(strm, errorCode) {
    strm.msg = msg[errorCode];
    return errorCode;
  }
  function rank(f) {
    return (f << 1) - (f > 4 ? 9 : 0);
  }
  function zero(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  function flush_pending(strm) {
    var s = strm.state;
    var len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  }
  function flush_block_only(s, last) {
    trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  }
  function put_byte(s, b) {
    s.pending_buf[s.pending++] = b;
  }
  function putShortMSB(s, b) {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  }
  function read_buf(strm, buf, start, size) {
    var len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    utils.arraySet(buf, strm.input, strm.next_in, len, start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  }
  function longest_match(s, cur_match) {
    var chain_length = s.max_chain_length;
    var scan = s.strstart;
    var match;
    var len;
    var best_len = s.prev_length;
    var nice_match = s.nice_match;
    var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    var _win = s.window;
    var wmask = s.w_mask;
    var prev = s.prev;
    var strend = s.strstart + MAX_MATCH;
    var scan_end1 = _win[scan + best_len - 1];
    var scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {} while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  }
  function fill_window(s) {
    var _w_size = s.w_size;
    var p, n, m, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        n = s.hash_size;
        p = n;
        do {
          m = s.head[--p];
          s.head[p] = m >= _w_size ? m - _w_size : 0;
        } while (--n);
        n = _w_size;
        p = n;
        do {
          m = s.prev[--p];
          s.prev[p] = m >= _w_size ? m - _w_size : 0;
        } while (--n);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
        while (s.insert) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  }
  function deflate_stored(s, flush) {
    var max_block_size = 65535;
    if (max_block_size > s.pending_buf_size - 5) {
      max_block_size = s.pending_buf_size - 5;
    }
    for (;; ) {
      if (s.lookahead <= 1) {
        fill_window(s);
        if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.strstart += s.lookahead;
      s.lookahead = 0;
      var max_start = s.block_start + max_block_size;
      if (s.strstart === 0 || s.strstart >= max_start) {
        s.lookahead = s.strstart - max_start;
        s.strstart = max_start;
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.strstart > s.block_start) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_NEED_MORE;
  }
  function deflate_fast(s, flush) {
    var hash_head;
    var bflush;
    for (;; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
        }
      } else {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_slow(s, flush) {
    var hash_head;
    var bflush;
    var max_insert;
    for (;; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_rle(s, flush) {
    var bflush;
    var prev;
    var scan, strend;
    var _win = s.window;
    for (;; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {} while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_huff(s, flush) {
    var bflush;
    for (;; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  var configuration_table;
  configuration_table = [
    new Config(0, 0, 0, 0, deflate_stored),
    new Config(4, 4, 8, 4, deflate_fast),
    new Config(4, 5, 16, 8, deflate_fast),
    new Config(4, 6, 32, 32, deflate_fast),
    new Config(4, 4, 16, 16, deflate_slow),
    new Config(8, 16, 32, 32, deflate_slow),
    new Config(8, 16, 128, 128, deflate_slow),
    new Config(8, 32, 128, 256, deflate_slow),
    new Config(32, 128, 258, 1024, deflate_slow),
    new Config(32, 258, 258, 4096, deflate_slow)
  ];
  function lm_init(s) {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  }
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
    this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
    this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new utils.Buf16(MAX_BITS + 1);
    this.heap = new utils.Buf16(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new utils.Buf16(2 * L_CODES + 1);
    zero(this.depth);
    this.l_buf = 0;
    this.lit_bufsize = 0;
    this.last_lit = 0;
    this.d_buf = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  function deflateResetKeep(strm) {
    var s;
    if (!strm || !strm.state) {
      return err(strm, Z_STREAM_ERROR);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = s.wrap ? INIT_STATE : BUSY_STATE;
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = Z_NO_FLUSH;
    trees._tr_init(s);
    return Z_OK;
  }
  function deflateReset(strm) {
    var ret = deflateResetKeep(strm);
    if (ret === Z_OK) {
      lm_init(strm.state);
    }
    return ret;
  }
  function deflateSetHeader(strm, head) {
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    if (strm.state.wrap !== 2) {
      return Z_STREAM_ERROR;
    }
    strm.state.gzhead = head;
    return Z_OK;
  }
  function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
    if (!strm) {
      return Z_STREAM_ERROR;
    }
    var wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
      return err(strm, Z_STREAM_ERROR);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    var s = new DeflateState;
    strm.state = s;
    s.strm = strm;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new utils.Buf8(s.w_size * 2);
    s.head = new utils.Buf16(s.hash_size);
    s.prev = new utils.Buf16(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new utils.Buf8(s.pending_buf_size);
    s.d_buf = 1 * s.lit_bufsize;
    s.l_buf = (1 + 2) * s.lit_bufsize;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  }
  function deflateInit(strm, level) {
    return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
  }
  function deflate(strm, flush) {
    var old_flush, s;
    var beg, val;
    if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
    }
    s = strm.state;
    if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
    }
    s.strm = strm;
    old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.status === INIT_STATE) {
      if (s.wrap === 2) {
        strm.adler = 0;
        put_byte(s, 31);
        put_byte(s, 139);
        put_byte(s, 8);
        if (!s.gzhead) {
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, OS_CODE);
          s.status = BUSY_STATE;
        } else {
          put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
          put_byte(s, s.gzhead.time & 255);
          put_byte(s, s.gzhead.time >> 8 & 255);
          put_byte(s, s.gzhead.time >> 16 & 255);
          put_byte(s, s.gzhead.time >> 24 & 255);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, s.gzhead.os & 255);
          if (s.gzhead.extra && s.gzhead.extra.length) {
            put_byte(s, s.gzhead.extra.length & 255);
            put_byte(s, s.gzhead.extra.length >> 8 & 255);
          }
          if (s.gzhead.hcrc) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
          }
          s.gzindex = 0;
          s.status = EXTRA_STATE;
        }
      } else {
        var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
        var level_flags = -1;
        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }
        header |= level_flags << 6;
        if (s.strstart !== 0) {
          header |= PRESET_DICT;
        }
        header += 31 - header % 31;
        s.status = BUSY_STATE;
        putShortMSB(s, header);
        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 65535);
        }
        strm.adler = 1;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        beg = s.pending;
        while (s.gzindex < (s.gzhead.extra.length & 65535)) {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              break;
            }
          }
          put_byte(s, s.gzhead.extra[s.gzindex] & 255);
          s.gzindex++;
        }
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (s.gzindex === s.gzhead.extra.length) {
          s.gzindex = 0;
          s.status = NAME_STATE;
        }
      } else {
        s.status = NAME_STATE;
      }
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        beg = s.pending;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.gzindex = 0;
          s.status = COMMENT_STATE;
        }
      } else {
        s.status = COMMENT_STATE;
      }
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        beg = s.pending;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.status = HCRC_STATE;
        }
      } else {
        s.status = HCRC_STATE;
      }
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
        }
        if (s.pending + 2 <= s.pending_buf_size) {
          put_byte(s, strm.adler & 255);
          put_byte(s, strm.adler >> 8 & 255);
          strm.adler = 0;
          s.status = BUSY_STATE;
        }
      } else {
        s.status = BUSY_STATE;
      }
    }
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
      return err(strm, Z_BUF_ERROR);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR);
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
      var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          trees._tr_align(s);
        } else if (flush !== Z_BLOCK) {
          trees._tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      }
    }
    if (flush !== Z_FINISH) {
      return Z_OK;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK : Z_STREAM_END;
  }
  function deflateEnd(strm) {
    var status;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    status = strm.state.status;
    if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
      return err(strm, Z_STREAM_ERROR);
    }
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
  }
  function deflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    var s;
    var str, n;
    var wrap;
    var avail;
    var next;
    var input;
    var tmpDict;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    s = strm.state;
    wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR;
    }
    if (wrap === 1) {
      strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      tmpDict = new utils.Buf8(s.w_size);
      utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    avail = strm.avail_in;
    next = strm.next_in;
    input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      str = s.strstart;
      n = s.lookahead - (MIN_MATCH - 1);
      do {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK;
  }
  exports.deflateInit = deflateInit;
  exports.deflateInit2 = deflateInit2;
  exports.deflateReset = deflateReset;
  exports.deflateResetKeep = deflateResetKeep;
  exports.deflateSetHeader = deflateSetHeader;
  exports.deflate = deflate;
  exports.deflateEnd = deflateEnd;
  exports.deflateSetDictionary = deflateSetDictionary;
  exports.deflateInfo = "pako deflate (from Nodeca project)";
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS((exports) => {
  var utils = require_common();
  var STR_APPLY_OK = true;
  var STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, [0]);
  } catch (__) {
    STR_APPLY_OK = false;
  }
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  var _utf8len = new utils.Buf8(256);
  for (q = 0;q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  var q;
  _utf8len[254] = _utf8len[254] = 1;
  exports.string2buf = function(str) {
    var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0;m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new utils.Buf8(buf_len);
    for (i = 0, m_pos = 0;i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  };
  function buf2binstring(buf, len) {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
        return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
      }
    }
    var result = "";
    for (var i = 0;i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  }
  exports.buf2binstring = function(buf) {
    return buf2binstring(buf, buf.length);
  };
  exports.binstring2buf = function(str) {
    var buf = new utils.Buf8(str.length);
    for (var i = 0, len = buf.length;i < len; i++) {
      buf[i] = str.charCodeAt(i);
    }
    return buf;
  };
  exports.buf2string = function(buf, max) {
    var i, out, c, c_len;
    var len = max || buf.length;
    var utf16buf = new Array(len * 2);
    for (out = 0, i = 0;i < len; ) {
      c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  };
  exports.utf8border = function(buf, max) {
    var pos;
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS((exports, module) => {
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  module.exports = ZStream;
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS((exports) => {
  var zlib_deflate = require_deflate();
  var utils = require_common();
  var strings = require_strings();
  var msg = require_messages();
  var ZStream = require_zstream();
  var toString = Object.prototype.toString;
  var Z_NO_FLUSH = 0;
  var Z_FINISH = 4;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_SYNC_FLUSH = 2;
  var Z_DEFAULT_COMPRESSION = -1;
  var Z_DEFAULT_STRATEGY = 0;
  var Z_DEFLATED = 8;
  function Deflate(options) {
    if (!(this instanceof Deflate))
      return new Deflate(options);
    this.options = utils.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY,
      to: ""
    }, options || {});
    var opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new ZStream;
    this.strm.avail_out = 0;
    var status = zlib_deflate.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }
    if (opt.header) {
      zlib_deflate.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      var dict;
      if (typeof opt.dictionary === "string") {
        dict = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = zlib_deflate.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      this._dict_set = true;
    }
  }
  Deflate.prototype.push = function(data, mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var status, _mode;
    if (this.ended) {
      return false;
    }
    _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (typeof data === "string") {
      strm.input = strings.string2buf(data);
    } else if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    do {
      if (strm.avail_out === 0) {
        strm.output = new utils.Buf8(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = zlib_deflate.deflate(strm, _mode);
      if (status !== Z_STREAM_END && status !== Z_OK) {
        this.onEnd(status);
        this.ended = true;
        return false;
      }
      if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
        if (this.options.to === "string") {
          this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
        } else {
          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
        }
      }
    } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
    if (_mode === Z_FINISH) {
      status = zlib_deflate.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK;
    }
    if (_mode === Z_SYNC_FLUSH) {
      this.onEnd(Z_OK);
      strm.avail_out = 0;
      return true;
    }
    return true;
  };
  Deflate.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Deflate.prototype.onEnd = function(status) {
    if (status === Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = utils.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function deflate(input, options) {
    var deflator = new Deflate(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || msg[deflator.err];
    }
    return deflator.result;
  }
  function deflateRaw(input, options) {
    options = options || {};
    options.raw = true;
    return deflate(input, options);
  }
  function gzip(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate(input, options);
  }
  exports.Deflate = Deflate;
  exports.deflate = deflate;
  exports.deflateRaw = deflateRaw;
  exports.gzip = gzip;
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS((exports, module) => {
  var BAD = 30;
  var TYPE = 12;
  module.exports = function inflate_fast(strm, start) {
    var state;
    var _in;
    var last;
    var _out;
    var beg;
    var end;
    var dmax;
    var wsize;
    var whave;
    var wnext;
    var s_window;
    var hold;
    var bits;
    var lcode;
    var dcode;
    var lmask;
    var dmask;
    var here;
    var op;
    var len;
    var dist;
    var from;
    var from_source;
    var input, output;
    state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (;; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (;; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                      while (len > 2) {
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output[_out++] = from_source[from++];
                        if (len > 1) {
                          output[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output[_out++] = output[from++];
                        if (len > 1) {
                          output[_out++] = output[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state.mode = BAD;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state.mode = TYPE;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  };
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS((exports, module) => {
  var utils = require_common();
  var MAXBITS = 15;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var lbase = [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ];
  var lext = [
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ];
  var dbase = [
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ];
  var dext = [
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ];
  module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
    var bits = opts.bits;
    var len = 0;
    var sym = 0;
    var min = 0, max = 0;
    var root = 0;
    var curr = 0;
    var drop = 0;
    var left = 0;
    var used = 0;
    var huff = 0;
    var incr;
    var fill;
    var low;
    var mask;
    var next;
    var base = null;
    var base_index = 0;
    var end;
    var count = new utils.Buf16(MAXBITS + 1);
    var offs = new utils.Buf16(MAXBITS + 1);
    var extra = null;
    var extra_index = 0;
    var here_bits, here_op, here_val;
    for (len = 0;len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0;sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS;max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1;min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1;len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1;len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0;sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES) {
      base = extra = work;
      end = 19;
    } else if (type === LENS) {
      base = lbase;
      base_index -= 257;
      extra = lext;
      extra_index -= 257;
      end = 256;
    } else {
      base = dbase;
      extra = dext;
      end = -1;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
      return 1;
    }
    for (;; ) {
      here_bits = len - drop;
      if (work[sym] < end) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] > end) {
        here_op = extra[extra_index + work[sym]];
        here_val = base[base_index + work[sym]];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  };
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS((exports) => {
  var utils = require_common();
  var adler32 = require_adler32();
  var crc32 = require_crc322();
  var inflate_fast = require_inffast();
  var inflate_table = require_inftrees();
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var Z_FINISH = 4;
  var Z_BLOCK = 5;
  var Z_TREES = 6;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_NEED_DICT = 2;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_MEM_ERROR = -4;
  var Z_BUF_ERROR = -5;
  var Z_DEFLATED = 8;
  var HEAD = 1;
  var FLAGS = 2;
  var TIME = 3;
  var OS2 = 4;
  var EXLEN = 5;
  var EXTRA = 6;
  var NAME = 7;
  var COMMENT = 8;
  var HCRC = 9;
  var DICTID = 10;
  var DICT = 11;
  var TYPE = 12;
  var TYPEDO = 13;
  var STORED = 14;
  var COPY_ = 15;
  var COPY = 16;
  var TABLE = 17;
  var LENLENS = 18;
  var CODELENS = 19;
  var LEN_ = 20;
  var LEN = 21;
  var LENEXT = 22;
  var DIST = 23;
  var DISTEXT = 24;
  var MATCH = 25;
  var LIT = 26;
  var CHECK = 27;
  var LENGTH = 28;
  var DONE = 29;
  var BAD = 30;
  var MEM = 31;
  var SYNC = 32;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var MAX_WBITS = 15;
  var DEF_WBITS = MAX_WBITS;
  function zswap32(q) {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  }
  function InflateState() {
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new utils.Buf16(320);
    this.work = new utils.Buf16(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  function inflateResetKeep(strm) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
    state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return Z_OK;
  }
  function inflateReset(strm) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  }
  function inflateReset2(strm, windowBits) {
    var wrap;
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 1;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  }
  function inflateInit2(strm, windowBits) {
    var ret;
    var state;
    if (!strm) {
      return Z_STREAM_ERROR;
    }
    state = new InflateState;
    strm.state = state;
    state.window = null;
    ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK) {
      strm.state = null;
    }
    return ret;
  }
  function inflateInit(strm) {
    return inflateInit2(strm, DEF_WBITS);
  }
  var virgin = true;
  var lenfix;
  var distfix;
  function fixedtables(state) {
    if (virgin) {
      var sym;
      lenfix = new utils.Buf32(512);
      distfix = new utils.Buf32(32);
      sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  }
  function updatewindow(strm, src, end, copy) {
    var dist;
    var state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new utils.Buf8(state.wsize);
    }
    if (copy >= state.wsize) {
      utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      utils.arraySet(state.window, src, end - copy, dist, state.wnext);
      copy -= dist;
      if (copy) {
        utils.arraySet(state.window, src, end - copy, copy, 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  }
  function inflate(strm, flush) {
    var state;
    var input, output;
    var next;
    var put;
    var have, left;
    var hold;
    var bits;
    var _in, _out;
    var copy;
    var from;
    var from_source;
    var here = 0;
    var here_bits, here_op, here_val;
    var last_bits, last_op, last_val;
    var len;
    var ret;
    var hbuf = new utils.Buf8(4);
    var opts;
    var n;
    var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK;
    inf_leave:
      for (;; ) {
        switch (state.mode) {
          case HEAD:
            if (state.wrap === 0) {
              state.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 2 && hold === 35615) {
              state.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32(state.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state.mode = FLAGS;
              break;
            }
            state.flags = 0;
            if (state.head) {
              state.head.done = false;
            }
            if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state.mode = BAD;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state.wbits === 0) {
              state.wbits = len;
            } else if (len > state.wbits) {
              strm.msg = "invalid window size";
              state.mode = BAD;
              break;
            }
            state.dmax = 1 << len;
            strm.adler = state.check = 1;
            state.mode = hold & 512 ? DICTID : TYPE;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.flags = hold;
            if ((state.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            if (state.flags & 57344) {
              strm.msg = "unknown header flags set";
              state.mode = BAD;
              break;
            }
            if (state.head) {
              state.head.text = hold >> 8 & 1;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = TIME;
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.time = hold;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state.check = crc32(state.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = OS2;
          case OS2:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.xflags = hold & 255;
              state.head.os = hold >> 8;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = EXLEN;
          case EXLEN:
            if (state.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length = hold;
              if (state.head) {
                state.head.extra_len = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state.head) {
              state.head.extra = null;
            }
            state.mode = EXTRA;
          case EXTRA:
            if (state.flags & 1024) {
              copy = state.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state.head) {
                  len = state.head.extra_len - state.length;
                  if (!state.head.extra) {
                    state.head.extra = new Array(state.head.extra_len);
                  }
                  utils.arraySet(state.head.extra, input, next, copy, len);
                }
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state.length -= copy;
              }
              if (state.length) {
                break inf_leave;
              }
            }
            state.length = 0;
            state.mode = NAME;
          case NAME:
            if (state.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512) {
                state.check = crc32(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.name = null;
            }
            state.length = 0;
            state.mode = COMMENT;
          case COMMENT:
            if (state.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512) {
                state.check = crc32(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.comment = null;
            }
            state.mode = HCRC;
          case HCRC:
            if (state.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (hold !== (state.check & 65535)) {
                strm.msg = "header crc mismatch";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state.head) {
              state.head.hcrc = state.flags >> 9 & 1;
              state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = TYPE;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state.mode = DICT;
          case DICT:
            if (state.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              return Z_NEED_DICT;
            }
            strm.adler = state.check = 1;
            state.mode = TYPE;
          case TYPE:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          case TYPEDO:
            if (state.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state.mode = STORED;
                break;
              case 1:
                fixedtables(state);
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state.mode = BAD;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state.mode = BAD;
              break;
            }
            state.length = hold & 65535;
            hold = 0;
            bits = 0;
            state.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case COPY_:
            state.mode = COPY;
          case COPY:
            copy = state.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              utils.arraySet(output, input, next, copy, put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state.length -= copy;
              break;
            }
            state.mode = TYPE;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state.nlen > 286 || state.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = LENLENS;
          case LENLENS:
            while (state.have < state.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.lens[order[state.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state.have < 19) {
              state.lens[order[state.have++]] = 0;
            }
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = { bits: state.lenbits };
            ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = CODELENS;
          case CODELENS:
            while (state.have < state.nlen + state.ndist) {
              for (;; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state.lens[state.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  len = state.lens[state.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state.have + copy > state.nlen + state.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                while (copy--) {
                  state.lens[state.have++] = len;
                }
              }
            }
            if (state.mode === BAD) {
              break;
            }
            if (state.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state.mode = BAD;
              break;
            }
            state.lenbits = 9;
            opts = { bits: state.lenbits };
            ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state.mode = BAD;
              break;
            }
            state.distbits = 6;
            state.distcode = state.distdyn;
            opts = { bits: state.distbits };
            ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            state.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state.mode = BAD;
              break;
            }
            state.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case LEN_:
            state.mode = LEN;
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              inflate_fast(strm, _out);
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              if (state.mode === TYPE) {
                state.back = -1;
              }
              break;
            }
            state.back = 0;
            for (;; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (;; ) {
                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
              state.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state.back = -1;
              state.mode = TYPE;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break;
            }
            state.extra = here_op & 15;
            state.mode = LENEXT;
          case LENEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            state.was = state.length;
            state.mode = DIST;
          case DIST:
            for (;; ) {
              here = state.distcode[hold & (1 << state.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (;; ) {
                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state.mode = BAD;
              break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = DISTEXT;
          case DISTEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.offset += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            if (state.offset > state.dmax) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD;
              break;
            }
            state.mode = MATCH;
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state.offset > copy) {
              copy = state.offset - copy;
              if (copy > state.whave) {
                if (state.sane) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD;
                  break;
                }
              }
              if (copy > state.wnext) {
                copy -= state.wnext;
                from = state.wsize - copy;
              } else {
                from = state.wnext - copy;
              }
              if (copy > state.length) {
                copy = state.length;
              }
              from_source = state.window;
            } else {
              from_source = output;
              from = put - state.offset;
              copy = state.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state.length -= copy;
            do {
              output[put++] = from_source[from++];
            } while (--copy);
            if (state.length === 0) {
              state.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output[put++] = state.length;
            left--;
            state.mode = LEN;
            break;
          case CHECK:
            if (state.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state.total += _out;
              if (_out) {
                strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
              }
              _out = left;
              if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                strm.msg = "incorrect data check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = LENGTH;
          case LENGTH:
            if (state.wrap && state.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (hold !== (state.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = DONE;
          case DONE:
            ret = Z_STREAM_END;
            break inf_leave;
          case BAD:
            ret = Z_DATA_ERROR;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR;
          case SYNC:
          default:
            return Z_STREAM_ERROR;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap && _out) {
      strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  }
  function inflateEnd(strm) {
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    var state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK;
  }
  function inflateGetHeader(strm, head) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR;
    }
    state.head = head;
    head.done = false;
    return Z_OK;
  }
  function inflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    var state;
    var dictid;
    var ret;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR;
    }
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
    state.havedict = 1;
    return Z_OK;
  }
  exports.inflateReset = inflateReset;
  exports.inflateReset2 = inflateReset2;
  exports.inflateResetKeep = inflateResetKeep;
  exports.inflateInit = inflateInit;
  exports.inflateInit2 = inflateInit2;
  exports.inflate = inflate;
  exports.inflateEnd = inflateEnd;
  exports.inflateGetHeader = inflateGetHeader;
  exports.inflateSetDictionary = inflateSetDictionary;
  exports.inflateInfo = "pako inflate (from Nodeca project)";
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS((exports, module) => {
  module.exports = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_BUF_ERROR: -5,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_BINARY: 0,
    Z_TEXT: 1,
    Z_UNKNOWN: 2,
    Z_DEFLATED: 8
  };
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS((exports, module) => {
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  module.exports = GZheader;
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS((exports) => {
  var zlib_inflate = require_inflate();
  var utils = require_common();
  var strings = require_strings();
  var c = require_constants();
  var msg = require_messages();
  var ZStream = require_zstream();
  var GZheader = require_gzheader();
  var toString = Object.prototype.toString;
  function Inflate(options) {
    if (!(this instanceof Inflate))
      return new Inflate(options);
    this.options = utils.assign({
      chunkSize: 16384,
      windowBits: 0,
      to: ""
    }, options || {});
    var opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new ZStream;
    this.strm.avail_out = 0;
    var status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
    if (status !== c.Z_OK) {
      throw new Error(msg[status]);
    }
    this.header = new GZheader;
    zlib_inflate.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== c.Z_OK) {
          throw new Error(msg[status]);
        }
      }
    }
  }
  Inflate.prototype.push = function(data, mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var dictionary = this.options.dictionary;
    var status, _mode;
    var next_out_utf8, tail, utf8str;
    var allowBufError = false;
    if (this.ended) {
      return false;
    }
    _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
    if (typeof data === "string") {
      strm.input = strings.binstring2buf(data);
    } else if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    do {
      if (strm.avail_out === 0) {
        strm.output = new utils.Buf8(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
      if (status === c.Z_NEED_DICT && dictionary) {
        status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
      }
      if (status === c.Z_BUF_ERROR && allowBufError === true) {
        status = c.Z_OK;
        allowBufError = false;
      }
      if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
        this.onEnd(status);
        this.ended = true;
        return false;
      }
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {
          if (this.options.to === "string") {
            next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            tail = strm.next_out - next_out_utf8;
            utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) {
              utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
            }
            this.onData(utf8str);
          } else {
            this.onData(utils.shrinkBuf(strm.output, strm.next_out));
          }
        }
      }
      if (strm.avail_in === 0 && strm.avail_out === 0) {
        allowBufError = true;
      }
    } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
    if (status === c.Z_STREAM_END) {
      _mode = c.Z_FINISH;
    }
    if (_mode === c.Z_FINISH) {
      status = zlib_inflate.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === c.Z_OK;
    }
    if (_mode === c.Z_SYNC_FLUSH) {
      this.onEnd(c.Z_OK);
      strm.avail_out = 0;
      return true;
    }
    return true;
  };
  Inflate.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Inflate.prototype.onEnd = function(status) {
    if (status === c.Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = utils.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate(input, options) {
    var inflator = new Inflate(options);
    inflator.push(input, true);
    if (inflator.err) {
      throw inflator.msg || msg[inflator.err];
    }
    return inflator.result;
  }
  function inflateRaw(input, options) {
    options = options || {};
    options.raw = true;
    return inflate(input, options);
  }
  exports.Inflate = Inflate;
  exports.inflate = inflate;
  exports.inflateRaw = inflateRaw;
  exports.ungzip = inflate;
});

// ../../node_modules/.pnpm/pako@1.0.11/node_modules/pako/index.js
var require_pako = __commonJS((exports, module) => {
  var assign = require_common().assign;
  var deflate = require_deflate2();
  var inflate = require_inflate2();
  var constants = require_constants();
  var pako = {};
  assign(pako, deflate, inflate, constants);
  module.exports = pako;
});

// ../../node_modules/.pnpm/pify@4.0.1/node_modules/pify/index.js
var require_pify = __commonJS((exports, module) => {
  var processFn = (fn, options) => function(...args) {
    const P = options.promiseModule;
    return new P((resolve3, reject) => {
      if (options.multiArgs) {
        args.push((...result) => {
          if (options.errorFirst) {
            if (result[0]) {
              reject(result);
            } else {
              result.shift();
              resolve3(result);
            }
          } else {
            resolve3(result);
          }
        });
      } else if (options.errorFirst) {
        args.push((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve3(result);
          }
        });
      } else {
        args.push(resolve3);
      }
      fn.apply(this, args);
    });
  };
  module.exports = (input, options) => {
    options = Object.assign({
      exclude: [/.+(Sync|Stream)$/],
      errorFirst: true,
      promiseModule: Promise
    }, options);
    const objType = typeof input;
    if (!(input !== null && (objType === "object" || objType === "function"))) {
      throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? "null" : objType}\``);
    }
    const filter = (key) => {
      const match = (pattern) => typeof pattern === "string" ? key === pattern : pattern.test(key);
      return options.include ? options.include.some(match) : !options.exclude.some(match);
    };
    let ret;
    if (objType === "function") {
      ret = function(...args) {
        return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
      };
    } else {
      ret = Object.create(Object.getPrototypeOf(input));
    }
    for (const key in input) {
      const property = input[key];
      ret[key] = typeof property === "function" && filter(key) ? processFn(property, options) : property;
    }
    return ret;
  };
});

// ../../node_modules/.pnpm/ignore@5.3.2/node_modules/ignore/index.js
var require_ignore = __commonJS((exports, module) => {
  function makeArray(subject) {
    return Array.isArray(subject) ? subject : [subject];
  }
  var EMPTY = "";
  var SPACE = " ";
  var ESCAPE = "\\";
  var REGEX_TEST_BLANK_LINE = /^\s+$/;
  var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
  var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
  var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
  var REGEX_SPLITALL_CRLF = /\r?\n/g;
  var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
  var SLASH = "/";
  var TMP_KEY_IGNORE = "node-ignore";
  if (typeof Symbol !== "undefined") {
    TMP_KEY_IGNORE = Symbol.for("node-ignore");
  }
  var KEY_IGNORE = TMP_KEY_IGNORE;
  var define2 = (object, key, value) => Object.defineProperty(object, key, { value });
  var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
  var RETURN_FALSE = () => false;
  var sanitizeRange = (range) => range.replace(REGEX_REGEXP_RANGE, (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY);
  var cleanRangeBackSlash = (slashes) => {
    const { length } = slashes;
    return slashes.slice(0, length - length % 2);
  };
  var REPLACERS = [
    [
      /^\uFEFF/,
      () => EMPTY
    ],
    [
      /((?:\\\\)*?)(\\?\s+)$/,
      (_, m1, m2) => m1 + (m2.indexOf("\\") === 0 ? SPACE : EMPTY)
    ],
    [
      /(\\+?)\s/g,
      (_, m1) => {
        const { length } = m1;
        return m1.slice(0, length - length % 2) + SPACE;
      }
    ],
    [
      /[\\$.|*+(){^]/g,
      (match) => `\\${match}`
    ],
    [
      /(?!\\)\?/g,
      () => "[^/]"
    ],
    [
      /^\//,
      () => "^"
    ],
    [
      /\//g,
      () => "\\/"
    ],
    [
      /^\^*\\\*\\\*\\\//,
      () => "^(?:.*\\/)?"
    ],
    [
      /^(?=[^^])/,
      function startingReplacer() {
        return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
      }
    ],
    [
      /\\\/\\\*\\\*(?=\\\/|$)/g,
      (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
    ],
    [
      /(^|[^\\]+)(\\\*)+(?=.+)/g,
      (_, p1, p2) => {
        const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
        return p1 + unescaped;
      }
    ],
    [
      /\\\\\\(?=[$.|*+(){^])/g,
      () => ESCAPE
    ],
    [
      /\\\\/g,
      () => ESCAPE
    ],
    [
      /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
      (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
    ],
    [
      /(?:[^*])$/,
      (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
    ],
    [
      /(\^|\\\/)?\\\*$/,
      (_, p1) => {
        const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      }
    ]
  ];
  var regexCache = Object.create(null);
  var makeRegex = (pattern, ignoreCase) => {
    let source = regexCache[pattern];
    if (!source) {
      source = REPLACERS.reduce((prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)), pattern);
      regexCache[pattern] = source;
    }
    return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
  };
  var isString = (subject) => typeof subject === "string";
  var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
  var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);

  class IgnoreRule {
    constructor(origin, pattern, negative, regex) {
      this.origin = origin;
      this.pattern = pattern;
      this.negative = negative;
      this.regex = regex;
    }
  }
  var createRule = (pattern, ignoreCase) => {
    const origin = pattern;
    let negative = false;
    if (pattern.indexOf("!") === 0) {
      negative = true;
      pattern = pattern.substr(1);
    }
    pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
    const regex = makeRegex(pattern, ignoreCase);
    return new IgnoreRule(origin, pattern, negative, regex);
  };
  var throwError = (message, Ctor) => {
    throw new Ctor(message);
  };
  var checkPath = (path2, originalPath, doThrow) => {
    if (!isString(path2)) {
      return doThrow(`path must be a string, but got \`${originalPath}\``, TypeError);
    }
    if (!path2) {
      return doThrow(`path must not be empty`, TypeError);
    }
    if (checkPath.isNotRelative(path2)) {
      const r = "`path.relative()`d";
      return doThrow(`path should be a ${r} string, but got "${originalPath}"`, RangeError);
    }
    return true;
  };
  var isNotRelative = (path2) => REGEX_TEST_INVALID_PATH.test(path2);
  checkPath.isNotRelative = isNotRelative;
  checkPath.convert = (p) => p;

  class Ignore {
    constructor({
      ignorecase = true,
      ignoreCase = ignorecase,
      allowRelativePaths = false
    } = {}) {
      define2(this, KEY_IGNORE, true);
      this._rules = [];
      this._ignoreCase = ignoreCase;
      this._allowRelativePaths = allowRelativePaths;
      this._initCache();
    }
    _initCache() {
      this._ignoreCache = Object.create(null);
      this._testCache = Object.create(null);
    }
    _addPattern(pattern) {
      if (pattern && pattern[KEY_IGNORE]) {
        this._rules = this._rules.concat(pattern._rules);
        this._added = true;
        return;
      }
      if (checkPattern(pattern)) {
        const rule = createRule(pattern, this._ignoreCase);
        this._added = true;
        this._rules.push(rule);
      }
    }
    add(pattern) {
      this._added = false;
      makeArray(isString(pattern) ? splitPattern(pattern) : pattern).forEach(this._addPattern, this);
      if (this._added) {
        this._initCache();
      }
      return this;
    }
    addPattern(pattern) {
      return this.add(pattern);
    }
    _testOne(path2, checkUnignored) {
      let ignored = false;
      let unignored = false;
      this._rules.forEach((rule) => {
        const { negative } = rule;
        if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
          return;
        }
        const matched = rule.regex.test(path2);
        if (matched) {
          ignored = !negative;
          unignored = negative;
        }
      });
      return {
        ignored,
        unignored
      };
    }
    _test(originalPath, cache, checkUnignored, slices) {
      const path2 = originalPath && checkPath.convert(originalPath);
      checkPath(path2, originalPath, this._allowRelativePaths ? RETURN_FALSE : throwError);
      return this._t(path2, cache, checkUnignored, slices);
    }
    _t(path2, cache, checkUnignored, slices) {
      if (path2 in cache) {
        return cache[path2];
      }
      if (!slices) {
        slices = path2.split(SLASH);
      }
      slices.pop();
      if (!slices.length) {
        return cache[path2] = this._testOne(path2, checkUnignored);
      }
      const parent = this._t(slices.join(SLASH) + SLASH, cache, checkUnignored, slices);
      return cache[path2] = parent.ignored ? parent : this._testOne(path2, checkUnignored);
    }
    ignores(path2) {
      return this._test(path2, this._ignoreCache, false).ignored;
    }
    createFilter() {
      return (path2) => !this.ignores(path2);
    }
    filter(paths2) {
      return makeArray(paths2).filter(this.createFilter());
    }
    test(path2) {
      return this._test(path2, this._testCache, true);
    }
  }
  var factory = (options) => new Ignore(options);
  var isPathValid = (path2) => checkPath(path2 && checkPath.convert(path2), path2, RETURN_FALSE);
  factory.isPathValid = isPathValid;
  factory.default = factory;
  module.exports = factory;
  if (typeof process !== "undefined" && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === "win32")) {
    const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
    checkPath.convert = makePosix;
    const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
    checkPath.isNotRelative = (path2) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path2) || isNotRelative(path2);
  }
});

// ../../node_modules/.pnpm/clean-git-ref@2.0.1/node_modules/clean-git-ref/lib/index.js
var require_lib2 = __commonJS((exports, module) => {
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function replaceAll(str, search, replacement) {
    search = search instanceof RegExp ? search : new RegExp(escapeRegExp(search), "g");
    return str.replace(search, replacement);
  }
  var CleanGitRef = {
    clean: function clean(value) {
      if (typeof value !== "string") {
        throw new Error("Expected a string, received: " + value);
      }
      value = replaceAll(value, "./", "/");
      value = replaceAll(value, "..", ".");
      value = replaceAll(value, " ", "-");
      value = replaceAll(value, /^[~^:?*\\\-]/g, "");
      value = replaceAll(value, /[~^:?*\\]/g, "-");
      value = replaceAll(value, /[~^:?*\\\-]$/g, "");
      value = replaceAll(value, "@{", "-");
      value = replaceAll(value, /\.$/g, "");
      value = replaceAll(value, /\/$/g, "");
      value = replaceAll(value, /\.lock$/g, "");
      return value;
    }
  };
  module.exports = CleanGitRef;
});

// ../../node_modules/.pnpm/diff3@0.0.3/node_modules/diff3/onp.js
var require_onp = __commonJS((exports, module) => {
  module.exports = function(a_, b_) {
    var a = a_, b = b_, m = a.length, n = b.length, reverse = false, ed = null, offset = m + 1, path2 = [], pathposi = [], ses = [], lcs = "", SES_DELETE = -1, SES_COMMON = 0, SES_ADD = 1;
    var tmp1, tmp2;
    var init = function() {
      if (m >= n) {
        tmp1 = a;
        tmp2 = m;
        a = b;
        b = tmp1;
        m = n;
        n = tmp2;
        reverse = true;
        offset = m + 1;
      }
    };
    var P = function(x, y, k) {
      return {
        x,
        y,
        k
      };
    };
    var seselem = function(elem, t) {
      return {
        elem,
        t
      };
    };
    var snake = function(k, p, pp) {
      var r, x, y;
      if (p > pp) {
        r = path2[k - 1 + offset];
      } else {
        r = path2[k + 1 + offset];
      }
      y = Math.max(p, pp);
      x = y - k;
      while (x < m && y < n && a[x] === b[y]) {
        ++x;
        ++y;
      }
      path2[k + offset] = pathposi.length;
      pathposi[pathposi.length] = new P(x, y, r);
      return y;
    };
    var recordseq = function(epc) {
      var x_idx, y_idx, px_idx, py_idx, i;
      x_idx = y_idx = 1;
      px_idx = py_idx = 0;
      for (i = epc.length - 1;i >= 0; --i) {
        while (px_idx < epc[i].x || py_idx < epc[i].y) {
          if (epc[i].y - epc[i].x > py_idx - px_idx) {
            if (reverse) {
              ses[ses.length] = new seselem(b[py_idx], SES_DELETE);
            } else {
              ses[ses.length] = new seselem(b[py_idx], SES_ADD);
            }
            ++y_idx;
            ++py_idx;
          } else if (epc[i].y - epc[i].x < py_idx - px_idx) {
            if (reverse) {
              ses[ses.length] = new seselem(a[px_idx], SES_ADD);
            } else {
              ses[ses.length] = new seselem(a[px_idx], SES_DELETE);
            }
            ++x_idx;
            ++px_idx;
          } else {
            ses[ses.length] = new seselem(a[px_idx], SES_COMMON);
            lcs += a[px_idx];
            ++x_idx;
            ++y_idx;
            ++px_idx;
            ++py_idx;
          }
        }
      }
    };
    init();
    return {
      SES_DELETE: -1,
      SES_COMMON: 0,
      SES_ADD: 1,
      editdistance: function() {
        return ed;
      },
      getlcs: function() {
        return lcs;
      },
      getses: function() {
        return ses;
      },
      compose: function() {
        var delta, size, fp, p, r, epc, i, k;
        delta = n - m;
        size = m + n + 3;
        fp = {};
        for (i = 0;i < size; ++i) {
          fp[i] = -1;
          path2[i] = -1;
        }
        p = -1;
        do {
          ++p;
          for (k = -p;k <= delta - 1; ++k) {
            fp[k + offset] = snake(k, fp[k - 1 + offset] + 1, fp[k + 1 + offset]);
          }
          for (k = delta + p;k >= delta + 1; --k) {
            fp[k + offset] = snake(k, fp[k - 1 + offset] + 1, fp[k + 1 + offset]);
          }
          fp[delta + offset] = snake(delta, fp[delta - 1 + offset] + 1, fp[delta + 1 + offset]);
        } while (fp[delta + offset] !== n);
        ed = delta + 2 * p;
        r = path2[delta + offset];
        epc = [];
        while (r !== -1) {
          epc[epc.length] = new P(pathposi[r].x, pathposi[r].y, null);
          r = pathposi[r].k;
        }
        recordseq(epc);
      }
    };
  };
});

// ../../node_modules/.pnpm/diff3@0.0.3/node_modules/diff3/diff3.js
var require_diff3 = __commonJS((exports, module) => {
  var onp = require_onp();
  function longestCommonSubsequence(file1, file2) {
    var diff = new onp(file1, file2);
    diff.compose();
    var ses = diff.getses();
    var root;
    var prev;
    var file1RevIdx = file1.length - 1, file2RevIdx = file2.length - 1;
    for (var i = ses.length - 1;i >= 0; --i) {
      if (ses[i].t === diff.SES_COMMON) {
        if (prev) {
          prev.chain = {
            file1index: file1RevIdx,
            file2index: file2RevIdx,
            chain: null
          };
          prev = prev.chain;
        } else {
          root = {
            file1index: file1RevIdx,
            file2index: file2RevIdx,
            chain: null
          };
          prev = root;
        }
        file1RevIdx--;
        file2RevIdx--;
      } else if (ses[i].t === diff.SES_DELETE) {
        file1RevIdx--;
      } else if (ses[i].t === diff.SES_ADD) {
        file2RevIdx--;
      }
    }
    var tail = {
      file1index: -1,
      file2index: -1,
      chain: null
    };
    if (!prev) {
      return tail;
    }
    prev.chain = tail;
    return root;
  }
  function diffIndices(file1, file2) {
    var result = [];
    var tail1 = file1.length;
    var tail2 = file2.length;
    for (var candidate = longestCommonSubsequence(file1, file2);candidate !== null; candidate = candidate.chain) {
      var mismatchLength1 = tail1 - candidate.file1index - 1;
      var mismatchLength2 = tail2 - candidate.file2index - 1;
      tail1 = candidate.file1index;
      tail2 = candidate.file2index;
      if (mismatchLength1 || mismatchLength2) {
        result.push({
          file1: [tail1 + 1, mismatchLength1],
          file2: [tail2 + 1, mismatchLength2]
        });
      }
    }
    result.reverse();
    return result;
  }
  function diff3MergeIndices(a, o, b) {
    var i;
    var m1 = diffIndices(o, a);
    var m2 = diffIndices(o, b);
    var hunks = [];
    function addHunk(h, side2) {
      hunks.push([h.file1[0], side2, h.file1[1], h.file2[0], h.file2[1]]);
    }
    for (i = 0;i < m1.length; i++) {
      addHunk(m1[i], 0);
    }
    for (i = 0;i < m2.length; i++) {
      addHunk(m2[i], 2);
    }
    hunks.sort(function(x, y) {
      return x[0] - y[0];
    });
    var result = [];
    var commonOffset = 0;
    function copyCommon(targetOffset) {
      if (targetOffset > commonOffset) {
        result.push([1, commonOffset, targetOffset - commonOffset]);
        commonOffset = targetOffset;
      }
    }
    for (var hunkIndex = 0;hunkIndex < hunks.length; hunkIndex++) {
      var firstHunkIndex = hunkIndex;
      var hunk = hunks[hunkIndex];
      var regionLhs = hunk[0];
      var regionRhs = regionLhs + hunk[2];
      while (hunkIndex < hunks.length - 1) {
        var maybeOverlapping = hunks[hunkIndex + 1];
        var maybeLhs = maybeOverlapping[0];
        if (maybeLhs > regionRhs)
          break;
        regionRhs = Math.max(regionRhs, maybeLhs + maybeOverlapping[2]);
        hunkIndex++;
      }
      copyCommon(regionLhs);
      if (firstHunkIndex == hunkIndex) {
        if (hunk[4] > 0) {
          result.push([hunk[1], hunk[3], hunk[4]]);
        }
      } else {
        var regions = {
          0: [a.length, -1, o.length, -1],
          2: [b.length, -1, o.length, -1]
        };
        for (i = firstHunkIndex;i <= hunkIndex; i++) {
          hunk = hunks[i];
          var side = hunk[1];
          var r = regions[side];
          var oLhs = hunk[0];
          var oRhs = oLhs + hunk[2];
          var abLhs = hunk[3];
          var abRhs = abLhs + hunk[4];
          r[0] = Math.min(abLhs, r[0]);
          r[1] = Math.max(abRhs, r[1]);
          r[2] = Math.min(oLhs, r[2]);
          r[3] = Math.max(oRhs, r[3]);
        }
        var aLhs = regions[0][0] + (regionLhs - regions[0][2]);
        var aRhs = regions[0][1] + (regionRhs - regions[0][3]);
        var bLhs = regions[2][0] + (regionLhs - regions[2][2]);
        var bRhs = regions[2][1] + (regionRhs - regions[2][3]);
        result.push([
          -1,
          aLhs,
          aRhs - aLhs,
          regionLhs,
          regionRhs - regionLhs,
          bLhs,
          bRhs - bLhs
        ]);
      }
      commonOffset = regionRhs;
    }
    copyCommon(o.length);
    return result;
  }
  function diff3Merge(a, o, b) {
    var result = [];
    var files = [a, o, b];
    var indices = diff3MergeIndices(a, o, b);
    var okLines = [];
    function flushOk() {
      if (okLines.length) {
        result.push({
          ok: okLines
        });
      }
      okLines = [];
    }
    function pushOk(xs) {
      for (var j = 0;j < xs.length; j++) {
        okLines.push(xs[j]);
      }
    }
    function isTrueConflict(rec) {
      if (rec[2] != rec[6])
        return true;
      var aoff = rec[1];
      var boff = rec[5];
      for (var j = 0;j < rec[2]; j++) {
        if (a[j + aoff] != b[j + boff])
          return true;
      }
      return false;
    }
    for (var i = 0;i < indices.length; i++) {
      var x = indices[i];
      var side = x[0];
      if (side == -1) {
        if (!isTrueConflict(x)) {
          pushOk(files[0].slice(x[1], x[1] + x[2]));
        } else {
          flushOk();
          result.push({
            conflict: {
              a: a.slice(x[1], x[1] + x[2]),
              aIndex: x[1],
              o: o.slice(x[3], x[3] + x[4]),
              oIndex: x[3],
              b: b.slice(x[5], x[5] + x[6]),
              bIndex: x[5]
            }
          });
        }
      } else {
        pushOk(files[side].slice(x[1], x[1] + x[2]));
      }
    }
    flushOk();
    return result;
  }
  module.exports = diff3Merge;
});

// ../../node_modules/.pnpm/isomorphic-git@1.37.2/node_modules/isomorphic-git/index.cjs
var require_isomorphic_git = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var AsyncLock = _interopDefault(require_lib());
  var Hash = _interopDefault(require_sha1());
  var crc32 = _interopDefault(require_crc32());
  var pako = _interopDefault(require_pako());
  var pify = _interopDefault(require_pify());
  var ignore = _interopDefault(require_ignore());
  var cleanGitRef = _interopDefault(require_lib2());
  var diff3Merge = _interopDefault(require_diff3());

  class BaseError extends Error {
    constructor(message) {
      super(message);
      this.caller = "";
    }
    toJSON() {
      return {
        code: this.code,
        data: this.data,
        caller: this.caller,
        message: this.message,
        stack: this.stack
      };
    }
    fromJSON(json) {
      const e = new BaseError(json.message);
      e.code = json.code;
      e.data = json.data;
      e.caller = json.caller;
      e.stack = json.stack;
      return e;
    }
    get isIsomorphicGitError() {
      return true;
    }
  }

  class UnmergedPathsError extends BaseError {
    constructor(filepaths) {
      super(`Modifying the index is not possible because you have unmerged files: ${filepaths.toString}. Fix them up in the work tree, and then use 'git add/rm as appropriate to mark resolution and make a commit.`);
      this.code = this.name = UnmergedPathsError.code;
      this.data = { filepaths };
    }
  }
  UnmergedPathsError.code = "UnmergedPathsError";

  class InternalError extends BaseError {
    constructor(message) {
      super(`An internal error caused this command to fail.

If you're not a developer, report the bug to the developers of the application you're using. If this is a bug in isomorphic-git then you should create a proper bug yourselves. The bug should include a minimal reproduction and details about the version and environment.

Please file a bug report at https://github.com/isomorphic-git/isomorphic-git/issues with this error message: ${message}`);
      this.code = this.name = InternalError.code;
      this.data = { message };
    }
  }
  InternalError.code = "InternalError";

  class UnsafeFilepathError extends BaseError {
    constructor(filepath) {
      super(`The filepath "${filepath}" contains unsafe character sequences`);
      this.code = this.name = UnsafeFilepathError.code;
      this.data = { filepath };
    }
  }
  UnsafeFilepathError.code = "UnsafeFilepathError";

  class BufferCursor {
    constructor(buffer) {
      this.buffer = buffer;
      this._start = 0;
    }
    eof() {
      return this._start >= this.buffer.length;
    }
    tell() {
      return this._start;
    }
    seek(n) {
      this._start = n;
    }
    slice(n) {
      const r = this.buffer.slice(this._start, this._start + n);
      this._start += n;
      return r;
    }
    toString(enc, length) {
      const r = this.buffer.toString(enc, this._start, this._start + length);
      this._start += length;
      return r;
    }
    write(value, length, enc) {
      const r = this.buffer.write(value, this._start, length, enc);
      this._start += length;
      return r;
    }
    copy(source, start, end) {
      const r = source.copy(this.buffer, this._start, start, end);
      this._start += r;
      return r;
    }
    readUInt8() {
      const r = this.buffer.readUInt8(this._start);
      this._start += 1;
      return r;
    }
    writeUInt8(value) {
      const r = this.buffer.writeUInt8(value, this._start);
      this._start += 1;
      return r;
    }
    readUInt16BE() {
      const r = this.buffer.readUInt16BE(this._start);
      this._start += 2;
      return r;
    }
    writeUInt16BE(value) {
      const r = this.buffer.writeUInt16BE(value, this._start);
      this._start += 2;
      return r;
    }
    readUInt32BE() {
      const r = this.buffer.readUInt32BE(this._start);
      this._start += 4;
      return r;
    }
    writeUInt32BE(value) {
      const r = this.buffer.writeUInt32BE(value, this._start);
      this._start += 4;
      return r;
    }
  }
  function compareStrings(a, b) {
    return -(a < b) || +(a > b);
  }
  function comparePath(a, b) {
    return compareStrings(a.path, b.path);
  }
  function normalizeMode(mode) {
    let type = mode > 0 ? mode >> 12 : 0;
    if (type !== 4 && type !== 8 && type !== 10 && type !== 14) {
      type = 8;
    }
    let permissions = mode & 511;
    if (permissions & 73) {
      permissions = 493;
    } else {
      permissions = 420;
    }
    if (type !== 8)
      permissions = 0;
    return (type << 12) + permissions;
  }
  var MAX_UINT32 = 2 ** 32;
  function SecondsNanoseconds(givenSeconds, givenNanoseconds, milliseconds, date) {
    if (givenSeconds !== undefined && givenNanoseconds !== undefined) {
      return [givenSeconds, givenNanoseconds];
    }
    if (milliseconds === undefined) {
      milliseconds = date.valueOf();
    }
    const seconds = Math.floor(milliseconds / 1000);
    const nanoseconds = (milliseconds - seconds * 1000) * 1e6;
    return [seconds, nanoseconds];
  }
  function normalizeStats(e) {
    const [ctimeSeconds, ctimeNanoseconds] = SecondsNanoseconds(e.ctimeSeconds, e.ctimeNanoseconds, e.ctimeMs, e.ctime);
    const [mtimeSeconds, mtimeNanoseconds] = SecondsNanoseconds(e.mtimeSeconds, e.mtimeNanoseconds, e.mtimeMs, e.mtime);
    return {
      ctimeSeconds: ctimeSeconds % MAX_UINT32,
      ctimeNanoseconds: ctimeNanoseconds % MAX_UINT32,
      mtimeSeconds: mtimeSeconds % MAX_UINT32,
      mtimeNanoseconds: mtimeNanoseconds % MAX_UINT32,
      dev: e.dev % MAX_UINT32,
      ino: e.ino % MAX_UINT32,
      mode: normalizeMode(e.mode % MAX_UINT32),
      uid: e.uid % MAX_UINT32,
      gid: e.gid % MAX_UINT32,
      size: e.size > -1 ? e.size % MAX_UINT32 : 0
    };
  }
  function toHex(buffer) {
    let hex = "";
    for (const byte of new Uint8Array(buffer)) {
      if (byte < 16)
        hex += "0";
      hex += byte.toString(16);
    }
    return hex;
  }
  var supportsSubtleSHA1 = null;
  async function shasum(buffer) {
    if (supportsSubtleSHA1 === null) {
      supportsSubtleSHA1 = await testSubtleSHA1();
    }
    return supportsSubtleSHA1 ? subtleSHA1(buffer) : shasumSync(buffer);
  }
  function shasumSync(buffer) {
    return new Hash().update(buffer).digest("hex");
  }
  async function subtleSHA1(buffer) {
    const hash2 = await crypto.subtle.digest("SHA-1", buffer);
    return toHex(hash2);
  }
  async function testSubtleSHA1() {
    try {
      const hash2 = await subtleSHA1(new Uint8Array([]));
      return hash2 === "da39a3ee5e6b4b0d3255bfef95601890afd80709";
    } catch (_) {}
    return false;
  }
  function parseCacheEntryFlags(bits) {
    return {
      assumeValid: Boolean(bits & 32768),
      extended: Boolean(bits & 16384),
      stage: (bits & 12288) >> 12,
      nameLength: bits & 4095
    };
  }
  function renderCacheEntryFlags(entry) {
    const flags = entry.flags;
    flags.extended = false;
    flags.nameLength = Math.min(Buffer.from(entry.path).length, 4095);
    return (flags.assumeValid ? 32768 : 0) + (flags.extended ? 16384 : 0) + ((flags.stage & 3) << 12) + (flags.nameLength & 4095);
  }

  class GitIndex {
    constructor(entries, unmergedPaths) {
      this._dirty = false;
      this._unmergedPaths = unmergedPaths || new Set;
      this._entries = entries || new Map;
    }
    _addEntry(entry) {
      if (entry.flags.stage === 0) {
        entry.stages = [entry];
        this._entries.set(entry.path, entry);
        this._unmergedPaths.delete(entry.path);
      } else {
        let existingEntry = this._entries.get(entry.path);
        if (!existingEntry) {
          this._entries.set(entry.path, entry);
          existingEntry = entry;
        }
        existingEntry.stages[entry.flags.stage] = entry;
        this._unmergedPaths.add(entry.path);
      }
    }
    static async from(buffer) {
      if (Buffer.isBuffer(buffer)) {
        return GitIndex.fromBuffer(buffer);
      } else if (buffer === null) {
        return new GitIndex(null);
      } else {
        throw new InternalError("invalid type passed to GitIndex.from");
      }
    }
    static async fromBuffer(buffer) {
      if (buffer.length === 0) {
        throw new InternalError("Index file is empty (.git/index)");
      }
      const index2 = new GitIndex;
      const reader = new BufferCursor(buffer);
      const magic = reader.toString("utf8", 4);
      if (magic !== "DIRC") {
        throw new InternalError(`Invalid dircache magic file number: ${magic}`);
      }
      const shaComputed = await shasum(buffer.slice(0, -20));
      const shaClaimed = buffer.slice(-20).toString("hex");
      if (shaClaimed !== shaComputed) {
        throw new InternalError(`Invalid checksum in GitIndex buffer: expected ${shaClaimed} but saw ${shaComputed}`);
      }
      const version2 = reader.readUInt32BE();
      if (version2 !== 2) {
        throw new InternalError(`Unsupported dircache version: ${version2}`);
      }
      const numEntries = reader.readUInt32BE();
      let i = 0;
      while (!reader.eof() && i < numEntries) {
        const entry = {};
        entry.ctimeSeconds = reader.readUInt32BE();
        entry.ctimeNanoseconds = reader.readUInt32BE();
        entry.mtimeSeconds = reader.readUInt32BE();
        entry.mtimeNanoseconds = reader.readUInt32BE();
        entry.dev = reader.readUInt32BE();
        entry.ino = reader.readUInt32BE();
        entry.mode = reader.readUInt32BE();
        entry.uid = reader.readUInt32BE();
        entry.gid = reader.readUInt32BE();
        entry.size = reader.readUInt32BE();
        entry.oid = reader.slice(20).toString("hex");
        const flags = reader.readUInt16BE();
        entry.flags = parseCacheEntryFlags(flags);
        const pathlength = buffer.indexOf(0, reader.tell() + 1) - reader.tell();
        if (pathlength < 1) {
          throw new InternalError(`Got a path length of: ${pathlength}`);
        }
        entry.path = reader.toString("utf8", pathlength);
        if (entry.path.includes("..\\") || entry.path.includes("../")) {
          throw new UnsafeFilepathError(entry.path);
        }
        let padding = 8 - (reader.tell() - 12) % 8;
        if (padding === 0)
          padding = 8;
        while (padding--) {
          const tmp = reader.readUInt8();
          if (tmp !== 0) {
            throw new InternalError(`Expected 1-8 null characters but got '${tmp}' after ${entry.path}`);
          } else if (reader.eof()) {
            throw new InternalError("Unexpected end of file");
          }
        }
        entry.stages = [];
        index2._addEntry(entry);
        i++;
      }
      return index2;
    }
    get unmergedPaths() {
      return [...this._unmergedPaths];
    }
    get entries() {
      return [...this._entries.values()].sort(comparePath);
    }
    get entriesMap() {
      return this._entries;
    }
    get entriesFlat() {
      return [...this.entries].flatMap((entry) => {
        return entry.stages.length > 1 ? entry.stages.filter((x) => x) : entry;
      });
    }
    *[Symbol.iterator]() {
      for (const entry of this.entries) {
        yield entry;
      }
    }
    insert({ filepath, stats, oid, stage = 0 }) {
      if (!stats) {
        stats = {
          ctimeSeconds: 0,
          ctimeNanoseconds: 0,
          mtimeSeconds: 0,
          mtimeNanoseconds: 0,
          dev: 0,
          ino: 0,
          mode: 0,
          uid: 0,
          gid: 0,
          size: 0
        };
      }
      stats = normalizeStats(stats);
      const bfilepath = Buffer.from(filepath);
      const entry = {
        ctimeSeconds: stats.ctimeSeconds,
        ctimeNanoseconds: stats.ctimeNanoseconds,
        mtimeSeconds: stats.mtimeSeconds,
        mtimeNanoseconds: stats.mtimeNanoseconds,
        dev: stats.dev,
        ino: stats.ino,
        mode: stats.mode || 33188,
        uid: stats.uid,
        gid: stats.gid,
        size: stats.size,
        path: filepath,
        oid,
        flags: {
          assumeValid: false,
          extended: false,
          stage,
          nameLength: bfilepath.length < 4095 ? bfilepath.length : 4095
        },
        stages: []
      };
      this._addEntry(entry);
      this._dirty = true;
    }
    delete({ filepath }) {
      if (this._entries.has(filepath)) {
        this._entries.delete(filepath);
      } else {
        for (const key of this._entries.keys()) {
          if (key.startsWith(filepath + "/")) {
            this._entries.delete(key);
          }
        }
      }
      if (this._unmergedPaths.has(filepath)) {
        this._unmergedPaths.delete(filepath);
      }
      this._dirty = true;
    }
    clear() {
      this._entries.clear();
      this._dirty = true;
    }
    has({ filepath }) {
      return this._entries.has(filepath);
    }
    render() {
      return this.entries.map((entry) => `${entry.mode.toString(8)} ${entry.oid}    ${entry.path}`).join(`
`);
    }
    static async _entryToBuffer(entry) {
      const bpath = Buffer.from(entry.path);
      const length = Math.ceil((62 + bpath.length + 1) / 8) * 8;
      const written = Buffer.alloc(length);
      const writer = new BufferCursor(written);
      const stat = normalizeStats(entry);
      writer.writeUInt32BE(stat.ctimeSeconds);
      writer.writeUInt32BE(stat.ctimeNanoseconds);
      writer.writeUInt32BE(stat.mtimeSeconds);
      writer.writeUInt32BE(stat.mtimeNanoseconds);
      writer.writeUInt32BE(stat.dev);
      writer.writeUInt32BE(stat.ino);
      writer.writeUInt32BE(stat.mode);
      writer.writeUInt32BE(stat.uid);
      writer.writeUInt32BE(stat.gid);
      writer.writeUInt32BE(stat.size);
      writer.write(entry.oid, 20, "hex");
      writer.writeUInt16BE(renderCacheEntryFlags(entry));
      writer.write(entry.path, bpath.length, "utf8");
      return written;
    }
    async toObject() {
      const header = Buffer.alloc(12);
      const writer = new BufferCursor(header);
      writer.write("DIRC", 4, "utf8");
      writer.writeUInt32BE(2);
      writer.writeUInt32BE(this.entriesFlat.length);
      let entryBuffers = [];
      for (const entry of this.entries) {
        entryBuffers.push(GitIndex._entryToBuffer(entry));
        if (entry.stages.length > 1) {
          for (const stage of entry.stages) {
            if (stage && stage !== entry) {
              entryBuffers.push(GitIndex._entryToBuffer(stage));
            }
          }
        }
      }
      entryBuffers = await Promise.all(entryBuffers);
      const body = Buffer.concat(entryBuffers);
      const main = Buffer.concat([header, body]);
      const sum = await shasum(main);
      return Buffer.concat([main, Buffer.from(sum, "hex")]);
    }
  }
  function compareStats(entry, stats, filemode = true, trustino = true) {
    const e = normalizeStats(entry);
    const s = normalizeStats(stats);
    const staleness = filemode && e.mode !== s.mode || e.mtimeSeconds !== s.mtimeSeconds || e.ctimeSeconds !== s.ctimeSeconds || e.uid !== s.uid || e.gid !== s.gid || trustino && e.ino !== s.ino || e.size !== s.size;
    return staleness;
  }
  var lock = null;
  var IndexCache = Symbol("IndexCache");
  function createCache() {
    return {
      map: new Map,
      stats: new Map
    };
  }
  async function updateCachedIndexFile(fs, filepath, cache) {
    const [stat, rawIndexFile] = await Promise.all([
      fs.lstat(filepath),
      fs.read(filepath)
    ]);
    const index2 = await GitIndex.from(rawIndexFile);
    cache.map.set(filepath, index2);
    cache.stats.set(filepath, stat);
  }
  async function isIndexStale(fs, filepath, cache) {
    const savedStats = cache.stats.get(filepath);
    if (savedStats === undefined)
      return true;
    if (savedStats === null)
      return false;
    const currStats = await fs.lstat(filepath);
    if (currStats === null)
      return false;
    return compareStats(savedStats, currStats);
  }

  class GitIndexManager {
    static async acquire({ fs, gitdir, cache, allowUnmerged = true }, closure) {
      if (!cache[IndexCache]) {
        cache[IndexCache] = createCache();
      }
      const filepath = `${gitdir}/index`;
      if (lock === null)
        lock = new AsyncLock({ maxPending: Infinity });
      let result;
      let unmergedPaths = [];
      await lock.acquire(filepath, async () => {
        const theIndexCache = cache[IndexCache];
        if (await isIndexStale(fs, filepath, theIndexCache)) {
          await updateCachedIndexFile(fs, filepath, theIndexCache);
        }
        const index2 = theIndexCache.map.get(filepath);
        unmergedPaths = index2.unmergedPaths;
        if (unmergedPaths.length && !allowUnmerged)
          throw new UnmergedPathsError(unmergedPaths);
        result = await closure(index2);
        if (index2._dirty) {
          const buffer = await index2.toObject();
          await fs.write(filepath, buffer);
          theIndexCache.stats.set(filepath, await fs.lstat(filepath));
          index2._dirty = false;
        }
      });
      return result;
    }
  }
  function basename(path2) {
    const last = Math.max(path2.lastIndexOf("/"), path2.lastIndexOf("\\"));
    if (last > -1) {
      path2 = path2.slice(last + 1);
    }
    return path2;
  }
  function dirname2(path2) {
    const last = Math.max(path2.lastIndexOf("/"), path2.lastIndexOf("\\"));
    if (last === -1)
      return ".";
    if (last === 0)
      return "/";
    return path2.slice(0, last);
  }
  function flatFileListToDirectoryStructure(files) {
    const inodes = new Map;
    const mkdir2 = function(name) {
      if (!inodes.has(name)) {
        const dir = {
          type: "tree",
          fullpath: name,
          basename: basename(name),
          metadata: {},
          children: []
        };
        inodes.set(name, dir);
        dir.parent = mkdir2(dirname2(name));
        if (dir.parent && dir.parent !== dir)
          dir.parent.children.push(dir);
      }
      return inodes.get(name);
    };
    const mkfile = function(name, metadata) {
      if (!inodes.has(name)) {
        const file = {
          type: "blob",
          fullpath: name,
          basename: basename(name),
          metadata,
          parent: mkdir2(dirname2(name)),
          children: []
        };
        if (file.parent)
          file.parent.children.push(file);
        inodes.set(name, file);
      }
      return inodes.get(name);
    };
    mkdir2(".");
    for (const file of files) {
      mkfile(file.path, file);
    }
    return inodes;
  }
  function mode2type(mode) {
    switch (mode) {
      case 16384:
        return "tree";
      case 33188:
        return "blob";
      case 33261:
        return "blob";
      case 40960:
        return "blob";
      case 57344:
        return "commit";
    }
    throw new InternalError(`Unexpected GitTree entry mode: ${mode.toString(8)}`);
  }

  class GitWalkerIndex {
    constructor({ fs, gitdir, cache }) {
      this.treePromise = GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
        return flatFileListToDirectoryStructure(index2.entries);
      });
      const walker = this;
      this.ConstructEntry = class StageEntry {
        constructor(fullpath) {
          this._fullpath = fullpath;
          this._type = false;
          this._mode = false;
          this._stat = false;
          this._oid = false;
        }
        async type() {
          return walker.type(this);
        }
        async mode() {
          return walker.mode(this);
        }
        async stat() {
          return walker.stat(this);
        }
        async content() {
          return walker.content(this);
        }
        async oid() {
          return walker.oid(this);
        }
      };
    }
    async readdir(entry) {
      const filepath = entry._fullpath;
      const tree = await this.treePromise;
      const inode = tree.get(filepath);
      if (!inode)
        return null;
      if (inode.type === "blob")
        return null;
      if (inode.type !== "tree") {
        throw new Error(`ENOTDIR: not a directory, scandir '${filepath}'`);
      }
      const names = inode.children.map((inode2) => inode2.fullpath);
      names.sort(compareStrings);
      return names;
    }
    async type(entry) {
      if (entry._type === false) {
        await entry.stat();
      }
      return entry._type;
    }
    async mode(entry) {
      if (entry._mode === false) {
        await entry.stat();
      }
      return entry._mode;
    }
    async stat(entry) {
      if (entry._stat === false) {
        const tree = await this.treePromise;
        const inode = tree.get(entry._fullpath);
        if (!inode) {
          throw new Error(`ENOENT: no such file or directory, lstat '${entry._fullpath}'`);
        }
        const stats = inode.type === "tree" ? {} : normalizeStats(inode.metadata);
        entry._type = inode.type === "tree" ? "tree" : mode2type(stats.mode);
        entry._mode = stats.mode;
        if (inode.type === "tree") {
          entry._stat = undefined;
        } else {
          entry._stat = stats;
        }
      }
      return entry._stat;
    }
    async content(_entry) {}
    async oid(entry) {
      if (entry._oid === false) {
        const tree = await this.treePromise;
        const inode = tree.get(entry._fullpath);
        entry._oid = inode.metadata.oid;
      }
      return entry._oid;
    }
  }
  var GitWalkSymbol = Symbol("GitWalkSymbol");
  function STAGE() {
    const o = Object.create(null);
    Object.defineProperty(o, GitWalkSymbol, {
      value: function({ fs, gitdir, cache }) {
        return new GitWalkerIndex({ fs, gitdir, cache });
      }
    });
    Object.freeze(o);
    return o;
  }

  class NotFoundError extends BaseError {
    constructor(what) {
      super(`Could not find ${what}.`);
      this.code = this.name = NotFoundError.code;
      this.data = { what };
    }
  }
  NotFoundError.code = "NotFoundError";

  class ObjectTypeError extends BaseError {
    constructor(oid, actual, expected, filepath) {
      super(`Object ${oid} ${filepath ? `at ${filepath}` : ""}was anticipated to be a ${expected} but it is a ${actual}.`);
      this.code = this.name = ObjectTypeError.code;
      this.data = { oid, actual, expected, filepath };
    }
  }
  ObjectTypeError.code = "ObjectTypeError";

  class InvalidOidError extends BaseError {
    constructor(value) {
      super(`Expected a 40-char hex object id but saw "${value}".`);
      this.code = this.name = InvalidOidError.code;
      this.data = { value };
    }
  }
  InvalidOidError.code = "InvalidOidError";

  class NoRefspecError extends BaseError {
    constructor(remote) {
      super(`Could not find a fetch refspec for remote "${remote}". Make sure the config file has an entry like the following:
[remote "${remote}"]
	fetch = +refs/heads/*:refs/remotes/origin/*
`);
      this.code = this.name = NoRefspecError.code;
      this.data = { remote };
    }
  }
  NoRefspecError.code = "NoRefspecError";

  class GitPackedRefs {
    constructor(text) {
      this.refs = new Map;
      this.parsedConfig = [];
      if (text) {
        let key = null;
        this.parsedConfig = text.trim().split(`
`).map((line) => {
          if (/^\s*#/.test(line)) {
            return { line, comment: true };
          }
          const i = line.indexOf(" ");
          if (line.startsWith("^")) {
            const value = line.slice(1);
            this.refs.set(key + "^{}", value);
            return { line, ref: key, peeled: value };
          } else {
            const value = line.slice(0, i);
            key = line.slice(i + 1);
            this.refs.set(key, value);
            return { line, ref: key, oid: value };
          }
        });
      }
      return this;
    }
    static from(text) {
      return new GitPackedRefs(text);
    }
    delete(ref) {
      this.parsedConfig = this.parsedConfig.filter((entry) => entry.ref !== ref);
      this.refs.delete(ref);
    }
    toString() {
      return this.parsedConfig.map(({ line }) => line).join(`
`) + `
`;
    }
  }

  class GitRefSpec {
    constructor({ remotePath, localPath, force, matchPrefix }) {
      Object.assign(this, {
        remotePath,
        localPath,
        force,
        matchPrefix
      });
    }
    static from(refspec) {
      const [forceMatch, remotePath, remoteGlobMatch, localPath, localGlobMatch] = refspec.match(/^(\+?)(.*?)(\*?):(.*?)(\*?)$/).slice(1);
      const force = forceMatch === "+";
      const remoteIsGlob = remoteGlobMatch === "*";
      const localIsGlob = localGlobMatch === "*";
      if (remoteIsGlob !== localIsGlob) {
        throw new InternalError("Invalid refspec");
      }
      return new GitRefSpec({
        remotePath,
        localPath,
        force,
        matchPrefix: remoteIsGlob
      });
    }
    translate(remoteBranch) {
      if (this.matchPrefix) {
        if (remoteBranch.startsWith(this.remotePath)) {
          return this.localPath + remoteBranch.replace(this.remotePath, "");
        }
      } else {
        if (remoteBranch === this.remotePath)
          return this.localPath;
      }
      return null;
    }
    reverseTranslate(localBranch) {
      if (this.matchPrefix) {
        if (localBranch.startsWith(this.localPath)) {
          return this.remotePath + localBranch.replace(this.localPath, "");
        }
      } else {
        if (localBranch === this.localPath)
          return this.remotePath;
      }
      return null;
    }
  }

  class GitRefSpecSet {
    constructor(rules = []) {
      this.rules = rules;
    }
    static from(refspecs) {
      const rules = [];
      for (const refspec of refspecs) {
        rules.push(GitRefSpec.from(refspec));
      }
      return new GitRefSpecSet(rules);
    }
    add(refspec) {
      const rule = GitRefSpec.from(refspec);
      this.rules.push(rule);
    }
    translate(remoteRefs) {
      const result = [];
      for (const rule of this.rules) {
        for (const remoteRef of remoteRefs) {
          const localRef = rule.translate(remoteRef);
          if (localRef) {
            result.push([remoteRef, localRef]);
          }
        }
      }
      return result;
    }
    translateOne(remoteRef) {
      let result = null;
      for (const rule of this.rules) {
        const localRef = rule.translate(remoteRef);
        if (localRef) {
          result = localRef;
        }
      }
      return result;
    }
    localNamespaces() {
      return this.rules.filter((rule) => rule.matchPrefix).map((rule) => rule.localPath.replace(/\/$/, ""));
    }
  }
  function compareRefNames(a, b) {
    const _a = a.replace(/\^\{\}$/, "");
    const _b = b.replace(/\^\{\}$/, "");
    const tmp = -(_a < _b) || +(_a > _b);
    if (tmp === 0) {
      return a.endsWith("^{}") ? 1 : -1;
    }
    return tmp;
  }
  /*!
   * This code for `path.join` is directly copied from @zenfs/core/path for bundle size improvements.
   * SPDX-License-Identifier: LGPL-3.0-or-later
   * Copyright (c) James Prevett and other ZenFS contributors.
   */
  function normalizeString(path2, aar) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let char = "\x00";
    for (let i = 0;i <= path2.length; ++i) {
      if (i < path2.length)
        char = path2[i];
      else if (char === "/")
        break;
      else
        char = "/";
      if (char === "/") {
        if (lastSlash === i - 1 || dots === 1) {} else if (dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.at(-1) !== "." || res.at(-2) !== ".") {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf("/");
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            } else if (res.length !== 0) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (aar) {
            res += res.length > 0 ? "/.." : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0)
            res += "/" + path2.slice(lastSlash + 1, i);
          else
            res = path2.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (char === "." && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  function normalize(path2) {
    if (!path2.length)
      return ".";
    const isAbsolute = path2[0] === "/";
    const trailingSeparator = path2.at(-1) === "/";
    path2 = normalizeString(path2, !isAbsolute);
    if (!path2.length) {
      if (isAbsolute)
        return "/";
      return trailingSeparator ? "./" : ".";
    }
    if (trailingSeparator)
      path2 += "/";
    return isAbsolute ? `/${path2}` : path2;
  }
  function join5(...args) {
    if (args.length === 0)
      return ".";
    let joined;
    for (let i = 0;i < args.length; ++i) {
      const arg = args[i];
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += "/" + arg;
      }
    }
    if (joined === undefined)
      return ".";
    return normalize(joined);
  }
  var num = (val) => {
    if (typeof val === "number") {
      return val;
    }
    val = val.toLowerCase();
    let n = parseInt(val);
    if (val.endsWith("k"))
      n *= 1024;
    if (val.endsWith("m"))
      n *= 1024 * 1024;
    if (val.endsWith("g"))
      n *= 1024 * 1024 * 1024;
    return n;
  };
  var bool = (val) => {
    if (typeof val === "boolean") {
      return val;
    }
    val = val.trim().toLowerCase();
    if (val === "true" || val === "yes" || val === "on")
      return true;
    if (val === "false" || val === "no" || val === "off")
      return false;
    throw Error(`Expected 'true', 'false', 'yes', 'no', 'on', or 'off', but got ${val}`);
  };
  var schema = {
    core: {
      filemode: bool,
      bare: bool,
      logallrefupdates: bool,
      symlinks: bool,
      ignorecase: bool,
      bigFileThreshold: num
    }
  };
  var SECTION_LINE_REGEX = /^\[([A-Za-z0-9-.]+)(?: "(.*)")?\]$/;
  var SECTION_REGEX = /^[A-Za-z0-9-.]+$/;
  var VARIABLE_LINE_REGEX = /^([A-Za-z][A-Za-z-]*)(?: *= *(.*))?$/;
  var VARIABLE_NAME_REGEX = /^[A-Za-z][A-Za-z-]*$/;
  var VARIABLE_VALUE_COMMENT_REGEX = /^(.*?)( *[#;].*)$/;
  var extractSectionLine = (line) => {
    const matches = SECTION_LINE_REGEX.exec(line);
    if (matches != null) {
      const [section, subsection] = matches.slice(1);
      return [section, subsection];
    }
    return null;
  };
  var extractVariableLine = (line) => {
    const matches = VARIABLE_LINE_REGEX.exec(line);
    if (matches != null) {
      const [name, rawValue = "true"] = matches.slice(1);
      const valueWithoutComments = removeComments(rawValue);
      const valueWithoutQuotes = removeQuotes(valueWithoutComments);
      return [name, valueWithoutQuotes];
    }
    return null;
  };
  var removeComments = (rawValue) => {
    const commentMatches = VARIABLE_VALUE_COMMENT_REGEX.exec(rawValue);
    if (commentMatches == null) {
      return rawValue;
    }
    const [valueWithoutComment, comment] = commentMatches.slice(1);
    if (hasOddNumberOfQuotes(valueWithoutComment) && hasOddNumberOfQuotes(comment)) {
      return `${valueWithoutComment}${comment}`;
    }
    return valueWithoutComment;
  };
  var hasOddNumberOfQuotes = (text) => {
    const numberOfQuotes = (text.match(/(?:^|[^\\])"/g) || []).length;
    return numberOfQuotes % 2 !== 0;
  };
  var removeQuotes = (text) => {
    return text.split("").reduce((newText, c, idx, text2) => {
      const isQuote = c === '"' && text2[idx - 1] !== "\\";
      const isEscapeForQuote = c === "\\" && text2[idx + 1] === '"';
      if (isQuote || isEscapeForQuote) {
        return newText;
      }
      return newText + c;
    }, "");
  };
  var lower = (text) => {
    return text != null ? text.toLowerCase() : null;
  };
  var getPath = (section, subsection, name) => {
    return [lower(section), subsection, lower(name)].filter((a) => a != null).join(".");
  };
  var normalizePath = (path2) => {
    const pathSegments = path2.split(".");
    const section = pathSegments.shift();
    const name = pathSegments.pop();
    const subsection = pathSegments.length ? pathSegments.join(".") : undefined;
    return {
      section,
      subsection,
      name,
      path: getPath(section, subsection, name),
      sectionPath: getPath(section, subsection, null),
      isSection: !!section
    };
  };
  var findLastIndex = (array, callback) => {
    return array.reduce((lastIndex, item, index2) => {
      return callback(item) ? index2 : lastIndex;
    }, -1);
  };

  class GitConfig {
    constructor(text) {
      let section = null;
      let subsection = null;
      this.parsedConfig = text ? text.split(`
`).map((line) => {
        let name = null;
        let value = null;
        const trimmedLine = line.trim();
        const extractedSection = extractSectionLine(trimmedLine);
        const isSection = extractedSection != null;
        if (isSection) {
          [section, subsection] = extractedSection;
        } else {
          const extractedVariable = extractVariableLine(trimmedLine);
          const isVariable = extractedVariable != null;
          if (isVariable) {
            [name, value] = extractedVariable;
          }
        }
        const path2 = getPath(section, subsection, name);
        return { line, isSection, section, subsection, name, value, path: path2 };
      }) : [];
    }
    static from(text) {
      return new GitConfig(text);
    }
    async get(path2, getall = false) {
      const normalizedPath = normalizePath(path2).path;
      const allValues = this.parsedConfig.filter((config) => config.path === normalizedPath).map(({ section, name, value }) => {
        const fn = schema[section] && schema[section][name];
        return fn ? fn(value) : value;
      });
      return getall ? allValues : allValues.pop();
    }
    async getall(path2) {
      return this.get(path2, true);
    }
    async getSubsections(section) {
      return this.parsedConfig.filter((config) => config.isSection && config.section === section).map((config) => config.subsection);
    }
    async deleteSection(section, subsection) {
      this.parsedConfig = this.parsedConfig.filter((config) => !(config.section === section && config.subsection === subsection));
    }
    async append(path2, value) {
      return this.set(path2, value, true);
    }
    async set(path2, value, append = false) {
      const {
        section,
        subsection,
        name,
        path: normalizedPath,
        sectionPath,
        isSection
      } = normalizePath(path2);
      const configIndex = findLastIndex(this.parsedConfig, (config) => config.path === normalizedPath);
      if (value == null) {
        if (configIndex !== -1) {
          this.parsedConfig.splice(configIndex, 1);
        }
      } else {
        if (configIndex !== -1) {
          const config = this.parsedConfig[configIndex];
          const modifiedConfig = Object.assign({}, config, {
            name,
            value,
            modified: true
          });
          if (append) {
            this.parsedConfig.splice(configIndex + 1, 0, modifiedConfig);
          } else {
            this.parsedConfig[configIndex] = modifiedConfig;
          }
        } else {
          const sectionIndex = this.parsedConfig.findIndex((config) => config.path === sectionPath);
          const newConfig = {
            section,
            subsection,
            name,
            value,
            modified: true,
            path: normalizedPath
          };
          if (SECTION_REGEX.test(section) && VARIABLE_NAME_REGEX.test(name)) {
            if (sectionIndex >= 0) {
              this.parsedConfig.splice(sectionIndex + 1, 0, newConfig);
            } else {
              const newSection = {
                isSection,
                section,
                subsection,
                modified: true,
                path: sectionPath
              };
              this.parsedConfig.push(newSection, newConfig);
            }
          }
        }
      }
    }
    toString() {
      return this.parsedConfig.map(({ line, section, subsection, name, value, modified: modified2 = false }) => {
        if (!modified2) {
          return line;
        }
        if (name != null && value != null) {
          if (typeof value === "string" && /[#;]/.test(value)) {
            return `	${name} = "${value}"`;
          }
          return `	${name} = ${value}`;
        }
        if (subsection != null) {
          return `[${section} "${subsection}"]`;
        }
        return `[${section}]`;
      }).join(`
`);
    }
  }

  class GitConfigManager {
    static async get({ fs, gitdir }) {
      const text = await fs.read(`${gitdir}/config`, { encoding: "utf8" });
      return GitConfig.from(text);
    }
    static async save({ fs, gitdir, config }) {
      await fs.write(`${gitdir}/config`, config.toString(), {
        encoding: "utf8"
      });
    }
  }
  var refpaths = (ref) => [
    `${ref}`,
    `refs/${ref}`,
    `refs/tags/${ref}`,
    `refs/heads/${ref}`,
    `refs/remotes/${ref}`,
    `refs/remotes/${ref}/HEAD`
  ];
  var GIT_FILES = ["config", "description", "index", "shallow", "commondir"];
  var lock$1;
  async function acquireLock(ref, callback) {
    if (lock$1 === undefined)
      lock$1 = new AsyncLock;
    return lock$1.acquire(ref, callback);
  }

  class GitRefManager {
    static async updateRemoteRefs({
      fs,
      gitdir,
      remote,
      refs,
      symrefs,
      tags,
      refspecs = undefined,
      prune = false,
      pruneTags = false
    }) {
      for (const value of refs.values()) {
        if (!value.match(/[0-9a-f]{40}/)) {
          throw new InvalidOidError(value);
        }
      }
      const config = await GitConfigManager.get({ fs, gitdir });
      if (!refspecs) {
        refspecs = await config.getall(`remote.${remote}.fetch`);
        if (refspecs.length === 0) {
          throw new NoRefspecError(remote);
        }
        refspecs.unshift(`+HEAD:refs/remotes/${remote}/HEAD`);
      }
      const refspec = GitRefSpecSet.from(refspecs);
      const actualRefsToWrite = new Map;
      if (pruneTags) {
        const tags2 = await GitRefManager.listRefs({
          fs,
          gitdir,
          filepath: "refs/tags"
        });
        await GitRefManager.deleteRefs({
          fs,
          gitdir,
          refs: tags2.map((tag2) => `refs/tags/${tag2}`)
        });
      }
      if (tags) {
        for (const serverRef of refs.keys()) {
          if (serverRef.startsWith("refs/tags") && !serverRef.endsWith("^{}")) {
            if (!await GitRefManager.exists({ fs, gitdir, ref: serverRef })) {
              const oid = refs.get(serverRef);
              actualRefsToWrite.set(serverRef, oid);
            }
          }
        }
      }
      const refTranslations = refspec.translate([...refs.keys()]);
      for (const [serverRef, translatedRef] of refTranslations) {
        const value = refs.get(serverRef);
        actualRefsToWrite.set(translatedRef, value);
      }
      const symrefTranslations = refspec.translate([...symrefs.keys()]);
      for (const [serverRef, translatedRef] of symrefTranslations) {
        const value = symrefs.get(serverRef);
        const symtarget = refspec.translateOne(value);
        if (symtarget) {
          actualRefsToWrite.set(translatedRef, `ref: ${symtarget}`);
        }
      }
      const pruned = [];
      if (prune) {
        for (const filepath of refspec.localNamespaces()) {
          const refs2 = (await GitRefManager.listRefs({
            fs,
            gitdir,
            filepath
          })).map((file) => `${filepath}/${file}`);
          for (const ref of refs2) {
            if (!actualRefsToWrite.has(ref)) {
              pruned.push(ref);
            }
          }
        }
        if (pruned.length > 0) {
          await GitRefManager.deleteRefs({ fs, gitdir, refs: pruned });
        }
      }
      for (const [key, value] of actualRefsToWrite) {
        await acquireLock(key, async () => fs.write(join5(gitdir, key), `${value.trim()}
`, "utf8"));
      }
      return { pruned };
    }
    static async writeRef({ fs, gitdir, ref, value }) {
      if (!value.match(/[0-9a-f]{40}/)) {
        throw new InvalidOidError(value);
      }
      await acquireLock(ref, async () => fs.write(join5(gitdir, ref), `${value.trim()}
`, "utf8"));
    }
    static async writeSymbolicRef({ fs, gitdir, ref, value }) {
      await acquireLock(ref, async () => fs.write(join5(gitdir, ref), "ref: " + `${value.trim()}
`, "utf8"));
    }
    static async deleteRef({ fs, gitdir, ref }) {
      return GitRefManager.deleteRefs({ fs, gitdir, refs: [ref] });
    }
    static async deleteRefs({ fs, gitdir, refs }) {
      await Promise.all(refs.map((ref) => fs.rm(join5(gitdir, ref))));
      let text = await acquireLock("packed-refs", async () => fs.read(`${gitdir}/packed-refs`, { encoding: "utf8" }));
      const packed = GitPackedRefs.from(text);
      const beforeSize = packed.refs.size;
      for (const ref of refs) {
        if (packed.refs.has(ref)) {
          packed.delete(ref);
        }
      }
      if (packed.refs.size < beforeSize) {
        text = packed.toString();
        await acquireLock("packed-refs", async () => fs.write(`${gitdir}/packed-refs`, text, { encoding: "utf8" }));
      }
    }
    static async resolve({ fs, gitdir, ref, depth = undefined }) {
      if (depth !== undefined) {
        depth--;
        if (depth === -1) {
          return ref;
        }
      }
      if (ref.startsWith("ref: ")) {
        ref = ref.slice("ref: ".length);
        return GitRefManager.resolve({ fs, gitdir, ref, depth });
      }
      if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
        return ref;
      }
      const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
      const allpaths = refpaths(ref).filter((p) => !GIT_FILES.includes(p));
      for (const ref2 of allpaths) {
        const sha = await acquireLock(ref2, async () => await fs.read(`${gitdir}/${ref2}`, { encoding: "utf8" }) || packedMap.get(ref2));
        if (sha) {
          return GitRefManager.resolve({ fs, gitdir, ref: sha.trim(), depth });
        }
      }
      throw new NotFoundError(ref);
    }
    static async exists({ fs, gitdir, ref }) {
      try {
        await GitRefManager.expand({ fs, gitdir, ref });
        return true;
      } catch (err) {
        return false;
      }
    }
    static async expand({ fs, gitdir, ref }) {
      if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
        return ref;
      }
      const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
      const allpaths = refpaths(ref);
      for (const ref2 of allpaths) {
        const refExists = await acquireLock(ref2, async () => fs.exists(`${gitdir}/${ref2}`));
        if (refExists)
          return ref2;
        if (packedMap.has(ref2))
          return ref2;
      }
      throw new NotFoundError(ref);
    }
    static async expandAgainstMap({ ref, map }) {
      const allpaths = refpaths(ref);
      for (const ref2 of allpaths) {
        if (await map.has(ref2))
          return ref2;
      }
      throw new NotFoundError(ref);
    }
    static resolveAgainstMap({ ref, fullref = ref, depth = undefined, map }) {
      if (depth !== undefined) {
        depth--;
        if (depth === -1) {
          return { fullref, oid: ref };
        }
      }
      if (ref.startsWith("ref: ")) {
        ref = ref.slice("ref: ".length);
        return GitRefManager.resolveAgainstMap({ ref, fullref, depth, map });
      }
      if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
        return { fullref, oid: ref };
      }
      const allpaths = refpaths(ref);
      for (const ref2 of allpaths) {
        const sha = map.get(ref2);
        if (sha) {
          return GitRefManager.resolveAgainstMap({
            ref: sha.trim(),
            fullref: ref2,
            depth,
            map
          });
        }
      }
      throw new NotFoundError(ref);
    }
    static async packedRefs({ fs, gitdir }) {
      const text = await acquireLock("packed-refs", async () => fs.read(`${gitdir}/packed-refs`, { encoding: "utf8" }));
      const packed = GitPackedRefs.from(text);
      return packed.refs;
    }
    static async listRefs({ fs, gitdir, filepath }) {
      const packedMap = GitRefManager.packedRefs({ fs, gitdir });
      let files = null;
      try {
        files = await fs.readdirDeep(`${gitdir}/${filepath}`);
        files = files.map((x) => x.replace(`${gitdir}/${filepath}/`, ""));
      } catch (err) {
        files = [];
      }
      for (let key of (await packedMap).keys()) {
        if (key.startsWith(filepath)) {
          key = key.replace(filepath + "/", "");
          if (!files.includes(key)) {
            files.push(key);
          }
        }
      }
      files.sort(compareRefNames);
      return files;
    }
    static async listBranches({ fs, gitdir, remote }) {
      if (remote) {
        return GitRefManager.listRefs({
          fs,
          gitdir,
          filepath: `refs/remotes/${remote}`
        });
      } else {
        return GitRefManager.listRefs({ fs, gitdir, filepath: `refs/heads` });
      }
    }
    static async listTags({ fs, gitdir }) {
      const tags = await GitRefManager.listRefs({
        fs,
        gitdir,
        filepath: `refs/tags`
      });
      return tags.filter((x) => !x.endsWith("^{}"));
    }
  }
  function compareTreeEntryPath(a, b) {
    return compareStrings(appendSlashIfDir(a), appendSlashIfDir(b));
  }
  function appendSlashIfDir(entry) {
    return entry.mode === "040000" ? entry.path + "/" : entry.path;
  }
  function mode2type$1(mode) {
    switch (mode) {
      case "040000":
        return "tree";
      case "100644":
        return "blob";
      case "100755":
        return "blob";
      case "120000":
        return "blob";
      case "160000":
        return "commit";
    }
    throw new InternalError(`Unexpected GitTree entry mode: ${mode}`);
  }
  function parseBuffer(buffer) {
    const _entries = [];
    let cursor = 0;
    while (cursor < buffer.length) {
      const space = buffer.indexOf(32, cursor);
      if (space === -1) {
        throw new InternalError(`GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next space character.`);
      }
      const nullchar = buffer.indexOf(0, cursor);
      if (nullchar === -1) {
        throw new InternalError(`GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next null character.`);
      }
      let mode = buffer.slice(cursor, space).toString("utf8");
      if (mode === "40000")
        mode = "040000";
      const type = mode2type$1(mode);
      const path2 = buffer.slice(space + 1, nullchar).toString("utf8");
      if (path2.includes("\\") || path2.includes("/")) {
        throw new UnsafeFilepathError(path2);
      }
      const oid = buffer.slice(nullchar + 1, nullchar + 21).toString("hex");
      cursor = nullchar + 21;
      _entries.push({ mode, path: path2, oid, type });
    }
    return _entries;
  }
  function limitModeToAllowed(mode) {
    if (typeof mode === "number") {
      mode = mode.toString(8);
    }
    if (mode.match(/^0?4.*/))
      return "040000";
    if (mode.match(/^1006.*/))
      return "100644";
    if (mode.match(/^1007.*/))
      return "100755";
    if (mode.match(/^120.*/))
      return "120000";
    if (mode.match(/^160.*/))
      return "160000";
    throw new InternalError(`Could not understand file mode: ${mode}`);
  }
  function nudgeIntoShape(entry) {
    if (!entry.oid && entry.sha) {
      entry.oid = entry.sha;
    }
    entry.mode = limitModeToAllowed(entry.mode);
    if (!entry.type) {
      entry.type = mode2type$1(entry.mode);
    }
    return entry;
  }

  class GitTree {
    constructor(entries) {
      if (Buffer.isBuffer(entries)) {
        this._entries = parseBuffer(entries);
      } else if (Array.isArray(entries)) {
        this._entries = entries.map(nudgeIntoShape);
      } else {
        throw new InternalError("invalid type passed to GitTree constructor");
      }
      this._entries.sort(comparePath);
    }
    static from(tree) {
      return new GitTree(tree);
    }
    render() {
      return this._entries.map((entry) => `${entry.mode} ${entry.type} ${entry.oid}    ${entry.path}`).join(`
`);
    }
    toObject() {
      const entries = [...this._entries];
      entries.sort(compareTreeEntryPath);
      return Buffer.concat(entries.map((entry) => {
        const mode = Buffer.from(entry.mode.replace(/^0/, ""));
        const space = Buffer.from(" ");
        const path2 = Buffer.from(entry.path, "utf8");
        const nullchar = Buffer.from([0]);
        const oid = Buffer.from(entry.oid, "hex");
        return Buffer.concat([mode, space, path2, nullchar, oid]);
      }));
    }
    entries() {
      return this._entries;
    }
    *[Symbol.iterator]() {
      for (const entry of this._entries) {
        yield entry;
      }
    }
  }

  class GitObject {
    static wrap({ type, object }) {
      const header = `${type} ${object.length}\x00`;
      const headerLen = header.length;
      const totalLength = headerLen + object.length;
      const wrappedObject = new Uint8Array(totalLength);
      for (let i = 0;i < headerLen; i++) {
        wrappedObject[i] = header.charCodeAt(i);
      }
      wrappedObject.set(object, headerLen);
      return wrappedObject;
    }
    static unwrap(buffer) {
      const s = buffer.indexOf(32);
      const i = buffer.indexOf(0);
      const type = buffer.slice(0, s).toString("utf8");
      const length = buffer.slice(s + 1, i).toString("utf8");
      const actualLength = buffer.length - (i + 1);
      if (parseInt(length) !== actualLength) {
        throw new InternalError(`Length mismatch: expected ${length} bytes but got ${actualLength} instead.`);
      }
      return {
        type,
        object: Buffer.from(buffer.slice(i + 1))
      };
    }
  }
  async function readObjectLoose({ fs, gitdir, oid }) {
    const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
    const file = await fs.read(`${gitdir}/${source}`);
    if (!file) {
      return null;
    }
    return { object: file, format: "deflated", source };
  }
  function applyDelta(delta, source) {
    const reader = new BufferCursor(delta);
    const sourceSize = readVarIntLE(reader);
    if (sourceSize !== source.byteLength) {
      throw new InternalError(`applyDelta expected source buffer to be ${sourceSize} bytes but the provided buffer was ${source.length} bytes`);
    }
    const targetSize = readVarIntLE(reader);
    let target;
    const firstOp = readOp(reader, source);
    if (firstOp.byteLength === targetSize) {
      target = firstOp;
    } else {
      target = Buffer.alloc(targetSize);
      const writer = new BufferCursor(target);
      writer.copy(firstOp);
      while (!reader.eof()) {
        writer.copy(readOp(reader, source));
      }
      const tell = writer.tell();
      if (targetSize !== tell) {
        throw new InternalError(`applyDelta expected target buffer to be ${targetSize} bytes but the resulting buffer was ${tell} bytes`);
      }
    }
    return target;
  }
  function readVarIntLE(reader) {
    let result = 0;
    let shift = 0;
    let byte = null;
    do {
      byte = reader.readUInt8();
      result |= (byte & 127) << shift;
      shift += 7;
    } while (byte & 128);
    return result;
  }
  function readCompactLE(reader, flags, size) {
    let result = 0;
    let shift = 0;
    while (size--) {
      if (flags & 1) {
        result |= reader.readUInt8() << shift;
      }
      flags >>= 1;
      shift += 8;
    }
    return result;
  }
  function readOp(reader, source) {
    const byte = reader.readUInt8();
    const COPY = 128;
    const OFFS = 15;
    const SIZE = 112;
    if (byte & COPY) {
      const offset = readCompactLE(reader, byte & OFFS, 4);
      let size = readCompactLE(reader, (byte & SIZE) >> 4, 3);
      if (size === 0)
        size = 65536;
      return source.slice(offset, offset + size);
    } else {
      return reader.slice(byte);
    }
  }
  function fromValue(value) {
    let queue = [value];
    return {
      next() {
        return Promise.resolve({ done: queue.length === 0, value: queue.pop() });
      },
      return() {
        queue = [];
        return {};
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  function getIterator(iterable) {
    if (iterable[Symbol.asyncIterator]) {
      return iterable[Symbol.asyncIterator]();
    }
    if (iterable[Symbol.iterator]) {
      return iterable[Symbol.iterator]();
    }
    if (iterable.next) {
      return iterable;
    }
    return fromValue(iterable);
  }

  class StreamReader {
    constructor(stream) {
      if (typeof Buffer === "undefined") {
        throw new Error("Missing Buffer dependency");
      }
      this.stream = getIterator(stream);
      this.buffer = null;
      this.cursor = 0;
      this.undoCursor = 0;
      this.started = false;
      this._ended = false;
      this._discardedBytes = 0;
    }
    eof() {
      return this._ended && this.cursor === this.buffer.length;
    }
    tell() {
      return this._discardedBytes + this.cursor;
    }
    async byte() {
      if (this.eof())
        return;
      if (!this.started)
        await this._init();
      if (this.cursor === this.buffer.length) {
        await this._loadnext();
        if (this._ended)
          return;
      }
      this._moveCursor(1);
      return this.buffer[this.undoCursor];
    }
    async chunk() {
      if (this.eof())
        return;
      if (!this.started)
        await this._init();
      if (this.cursor === this.buffer.length) {
        await this._loadnext();
        if (this._ended)
          return;
      }
      this._moveCursor(this.buffer.length);
      return this.buffer.slice(this.undoCursor, this.cursor);
    }
    async read(n) {
      if (this.eof())
        return;
      if (!this.started)
        await this._init();
      if (this.cursor + n > this.buffer.length) {
        this._trim();
        await this._accumulate(n);
      }
      this._moveCursor(n);
      return this.buffer.slice(this.undoCursor, this.cursor);
    }
    async skip(n) {
      if (this.eof())
        return;
      if (!this.started)
        await this._init();
      if (this.cursor + n > this.buffer.length) {
        this._trim();
        await this._accumulate(n);
      }
      this._moveCursor(n);
    }
    async undo() {
      this.cursor = this.undoCursor;
    }
    async _next() {
      this.started = true;
      let { done, value } = await this.stream.next();
      if (done) {
        this._ended = true;
        if (!value)
          return Buffer.alloc(0);
      }
      if (value) {
        value = Buffer.from(value);
      }
      return value;
    }
    _trim() {
      this.buffer = this.buffer.slice(this.undoCursor);
      this.cursor -= this.undoCursor;
      this._discardedBytes += this.undoCursor;
      this.undoCursor = 0;
    }
    _moveCursor(n) {
      this.undoCursor = this.cursor;
      this.cursor += n;
      if (this.cursor > this.buffer.length) {
        this.cursor = this.buffer.length;
      }
    }
    async _accumulate(n) {
      if (this._ended)
        return;
      const buffers = [this.buffer];
      while (this.cursor + n > lengthBuffers(buffers)) {
        const nextbuffer = await this._next();
        if (this._ended)
          break;
        buffers.push(nextbuffer);
      }
      this.buffer = Buffer.concat(buffers);
    }
    async _loadnext() {
      this._discardedBytes += this.buffer.length;
      this.undoCursor = 0;
      this.cursor = 0;
      this.buffer = await this._next();
    }
    async _init() {
      this.buffer = await this._next();
    }
  }
  function lengthBuffers(buffers) {
    return buffers.reduce((acc, buffer) => acc + buffer.length, 0);
  }
  async function listpack(stream, onData) {
    const reader = new StreamReader(stream);
    let PACK = await reader.read(4);
    PACK = PACK.toString("utf8");
    if (PACK !== "PACK") {
      throw new InternalError(`Invalid PACK header '${PACK}'`);
    }
    let version2 = await reader.read(4);
    version2 = version2.readUInt32BE(0);
    if (version2 !== 2) {
      throw new InternalError(`Invalid packfile version: ${version2}`);
    }
    let numObjects = await reader.read(4);
    numObjects = numObjects.readUInt32BE(0);
    if (numObjects < 1)
      return;
    while (!reader.eof() && numObjects--) {
      const offset = reader.tell();
      const { type, length, ofs, reference } = await parseHeader(reader);
      const inflator = new pako.Inflate;
      while (!inflator.result) {
        const chunk = await reader.chunk();
        if (!chunk)
          break;
        inflator.push(chunk, false);
        if (inflator.err) {
          throw new InternalError(`Pako error: ${inflator.msg}`);
        }
        if (inflator.result) {
          if (inflator.result.length !== length) {
            throw new InternalError(`Inflated object size is different from that stated in packfile.`);
          }
          await reader.undo();
          await reader.read(chunk.length - inflator.strm.avail_in);
          const end = reader.tell();
          await onData({
            data: inflator.result,
            type,
            num: numObjects,
            offset,
            end,
            reference,
            ofs
          });
        }
      }
    }
  }
  async function parseHeader(reader) {
    let byte = await reader.byte();
    const type = byte >> 4 & 7;
    let length = byte & 15;
    if (byte & 128) {
      let shift = 4;
      do {
        byte = await reader.byte();
        length |= (byte & 127) << shift;
        shift += 7;
      } while (byte & 128);
    }
    let ofs;
    let reference;
    if (type === 6) {
      let shift = 0;
      ofs = 0;
      const bytes = [];
      do {
        byte = await reader.byte();
        ofs |= (byte & 127) << shift;
        shift += 7;
        bytes.push(byte);
      } while (byte & 128);
      reference = Buffer.from(bytes);
    }
    if (type === 7) {
      const buf = await reader.read(20);
      reference = buf;
    }
    return { type, length, ofs, reference };
  }
  var supportsDecompressionStream = false;
  async function inflate(buffer) {
    if (supportsDecompressionStream === null) {
      supportsDecompressionStream = testDecompressionStream();
    }
    return supportsDecompressionStream ? browserInflate(buffer) : pako.inflate(buffer);
  }
  async function browserInflate(buffer) {
    const ds = new DecompressionStream("deflate");
    const d = new Blob([buffer]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(d).arrayBuffer());
  }
  function testDecompressionStream() {
    try {
      const ds = new DecompressionStream("deflate");
      if (ds)
        return true;
    } catch (_) {}
    return false;
  }
  function decodeVarInt(reader) {
    const bytes = [];
    let byte = 0;
    let multibyte = 0;
    do {
      byte = reader.readUInt8();
      const lastSeven = byte & 127;
      bytes.push(lastSeven);
      multibyte = byte & 128;
    } while (multibyte);
    return bytes.reduce((a, b) => a + 1 << 7 | b, -1);
  }
  function otherVarIntDecode(reader, startWith) {
    let result = startWith;
    let shift = 4;
    let byte = null;
    do {
      byte = reader.readUInt8();
      result |= (byte & 127) << shift;
      shift += 7;
    } while (byte & 128);
    return result;
  }

  class GitPackIndex {
    constructor(stuff) {
      Object.assign(this, stuff);
      this.offsetCache = {};
    }
    static async fromIdx({ idx, getExternalRefDelta }) {
      const reader = new BufferCursor(idx);
      const magic = reader.slice(4).toString("hex");
      if (magic !== "ff744f63") {
        return;
      }
      const version2 = reader.readUInt32BE();
      if (version2 !== 2) {
        throw new InternalError(`Unable to read version ${version2} packfile IDX. (Only version 2 supported)`);
      }
      if (idx.byteLength > 2048 * 1024 * 1024) {
        throw new InternalError(`To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size.`);
      }
      reader.seek(reader.tell() + 4 * 255);
      const size = reader.readUInt32BE();
      const hashes = [];
      for (let i = 0;i < size; i++) {
        const hash2 = reader.slice(20).toString("hex");
        hashes[i] = hash2;
      }
      reader.seek(reader.tell() + 4 * size);
      const offsets = new Map;
      for (let i = 0;i < size; i++) {
        offsets.set(hashes[i], reader.readUInt32BE());
      }
      const packfileSha = reader.slice(20).toString("hex");
      return new GitPackIndex({
        hashes,
        crcs: {},
        offsets,
        packfileSha,
        getExternalRefDelta
      });
    }
    static async fromPack({ pack, getExternalRefDelta, onProgress }) {
      const listpackTypes = {
        1: "commit",
        2: "tree",
        3: "blob",
        4: "tag",
        6: "ofs-delta",
        7: "ref-delta"
      };
      const offsetToObject = {};
      const packfileSha = pack.slice(-20).toString("hex");
      const hashes = [];
      const crcs = {};
      const offsets = new Map;
      let totalObjectCount = null;
      let lastPercent = null;
      await listpack([pack], async ({ data, type, reference, offset, num: num2 }) => {
        if (totalObjectCount === null)
          totalObjectCount = num2;
        const percent = Math.floor((totalObjectCount - num2) * 100 / totalObjectCount);
        if (percent !== lastPercent) {
          if (onProgress) {
            await onProgress({
              phase: "Receiving objects",
              loaded: totalObjectCount - num2,
              total: totalObjectCount
            });
          }
        }
        lastPercent = percent;
        type = listpackTypes[type];
        if (["commit", "tree", "blob", "tag"].includes(type)) {
          offsetToObject[offset] = {
            type,
            offset
          };
        } else if (type === "ofs-delta") {
          offsetToObject[offset] = {
            type,
            offset
          };
        } else if (type === "ref-delta") {
          offsetToObject[offset] = {
            type,
            offset
          };
        }
      });
      const offsetArray = Object.keys(offsetToObject).map(Number);
      for (const [i, start] of offsetArray.entries()) {
        const end = i + 1 === offsetArray.length ? pack.byteLength - 20 : offsetArray[i + 1];
        const o = offsetToObject[start];
        const crc = crc32.buf(pack.slice(start, end)) >>> 0;
        o.end = end;
        o.crc = crc;
      }
      const p = new GitPackIndex({
        pack: Promise.resolve(pack),
        packfileSha,
        crcs,
        hashes,
        offsets,
        getExternalRefDelta
      });
      lastPercent = null;
      let count = 0;
      const objectsByDepth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let offset in offsetToObject) {
        offset = Number(offset);
        const percent = Math.floor(count * 100 / totalObjectCount);
        if (percent !== lastPercent) {
          if (onProgress) {
            await onProgress({
              phase: "Resolving deltas",
              loaded: count,
              total: totalObjectCount
            });
          }
        }
        count++;
        lastPercent = percent;
        const o = offsetToObject[offset];
        if (o.oid)
          continue;
        try {
          p.readDepth = 0;
          p.externalReadDepth = 0;
          const { type, object } = await p.readSlice({ start: offset });
          objectsByDepth[p.readDepth] += 1;
          const oid = await shasum(GitObject.wrap({ type, object }));
          o.oid = oid;
          hashes.push(oid);
          offsets.set(oid, offset);
          crcs[oid] = o.crc;
        } catch (err) {
          continue;
        }
      }
      hashes.sort();
      return p;
    }
    async toBuffer() {
      const buffers = [];
      const write = (str, encoding) => {
        buffers.push(Buffer.from(str, encoding));
      };
      write("ff744f63", "hex");
      write("00000002", "hex");
      const fanoutBuffer = new BufferCursor(Buffer.alloc(256 * 4));
      for (let i = 0;i < 256; i++) {
        let count = 0;
        for (const hash2 of this.hashes) {
          if (parseInt(hash2.slice(0, 2), 16) <= i)
            count++;
        }
        fanoutBuffer.writeUInt32BE(count);
      }
      buffers.push(fanoutBuffer.buffer);
      for (const hash2 of this.hashes) {
        write(hash2, "hex");
      }
      const crcsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
      for (const hash2 of this.hashes) {
        crcsBuffer.writeUInt32BE(this.crcs[hash2]);
      }
      buffers.push(crcsBuffer.buffer);
      const offsetsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
      for (const hash2 of this.hashes) {
        offsetsBuffer.writeUInt32BE(this.offsets.get(hash2));
      }
      buffers.push(offsetsBuffer.buffer);
      write(this.packfileSha, "hex");
      const totalBuffer = Buffer.concat(buffers);
      const sha = await shasum(totalBuffer);
      const shaBuffer = Buffer.alloc(20);
      shaBuffer.write(sha, "hex");
      return Buffer.concat([totalBuffer, shaBuffer]);
    }
    async load({ pack }) {
      this.pack = pack;
    }
    async unload() {
      this.pack = null;
    }
    async read({ oid }) {
      if (!this.offsets.get(oid)) {
        if (this.getExternalRefDelta) {
          this.externalReadDepth++;
          return this.getExternalRefDelta(oid);
        } else {
          throw new InternalError(`Could not read object ${oid} from packfile`);
        }
      }
      const start = this.offsets.get(oid);
      return this.readSlice({ start });
    }
    async readSlice({ start }) {
      if (this.offsetCache[start]) {
        return Object.assign({}, this.offsetCache[start]);
      }
      this.readDepth++;
      const types2 = {
        16: "commit",
        32: "tree",
        48: "blob",
        64: "tag",
        96: "ofs_delta",
        112: "ref_delta"
      };
      if (!this.pack) {
        throw new InternalError("Tried to read from a GitPackIndex with no packfile loaded into memory");
      }
      const raw = (await this.pack).slice(start);
      const reader = new BufferCursor(raw);
      const byte = reader.readUInt8();
      const btype = byte & 112;
      let type = types2[btype];
      if (type === undefined) {
        throw new InternalError("Unrecognized type: 0b" + btype.toString(2));
      }
      const lastFour = byte & 15;
      let length = lastFour;
      const multibyte = byte & 128;
      if (multibyte) {
        length = otherVarIntDecode(reader, lastFour);
      }
      let base = null;
      let object = null;
      if (type === "ofs_delta") {
        const offset = decodeVarInt(reader);
        const baseOffset = start - offset;
        ({ object: base, type } = await this.readSlice({ start: baseOffset }));
      }
      if (type === "ref_delta") {
        const oid = reader.slice(20).toString("hex");
        ({ object: base, type } = await this.read({ oid }));
      }
      const buffer = raw.slice(reader.tell());
      object = Buffer.from(await inflate(buffer));
      if (object.byteLength !== length) {
        throw new InternalError(`Packfile told us object would have length ${length} but it had length ${object.byteLength}`);
      }
      if (base) {
        object = Buffer.from(applyDelta(object, base));
      }
      if (this.readDepth > 3) {
        this.offsetCache[start] = { type, object };
      }
      return { type, format: "content", object };
    }
  }
  var PackfileCache = Symbol("PackfileCache");
  async function loadPackIndex({
    fs,
    filename,
    getExternalRefDelta,
    emitter,
    emitterPrefix
  }) {
    const idx = await fs.read(filename);
    return GitPackIndex.fromIdx({ idx, getExternalRefDelta });
  }
  function readPackIndex({
    fs,
    cache,
    filename,
    getExternalRefDelta,
    emitter,
    emitterPrefix
  }) {
    if (!cache[PackfileCache])
      cache[PackfileCache] = new Map;
    let p = cache[PackfileCache].get(filename);
    if (!p) {
      p = loadPackIndex({
        fs,
        filename,
        getExternalRefDelta,
        emitter,
        emitterPrefix
      });
      cache[PackfileCache].set(filename, p);
    }
    return p;
  }
  async function readObjectPacked({
    fs,
    cache,
    gitdir,
    oid,
    format = "content",
    getExternalRefDelta
  }) {
    let list = await fs.readdir(join5(gitdir, "objects/pack"));
    list = list.filter((x) => x.endsWith(".idx"));
    for (const filename of list) {
      const indexFile = `${gitdir}/objects/pack/${filename}`;
      const p = await readPackIndex({
        fs,
        cache,
        filename: indexFile,
        getExternalRefDelta
      });
      if (p.error)
        throw new InternalError(p.error);
      if (p.offsets.has(oid)) {
        if (!p.pack) {
          const packFile = indexFile.replace(/idx$/, "pack");
          p.pack = fs.read(packFile);
        }
        const pack = await p.pack;
        if (!p._checksumVerified) {
          const expectedShaFromIndex = p.packfileSha;
          const packTrailer = pack.subarray(-20);
          const packTrailerSha = Array.from(packTrailer).map((b) => b.toString(16).padStart(2, "0")).join("");
          if (packTrailerSha !== expectedShaFromIndex) {
            throw new InternalError(`Packfile trailer mismatch: expected ${expectedShaFromIndex}, got ${packTrailerSha}. The packfile may be corrupted.`);
          }
          const payload = pack.subarray(0, -20);
          const actualPayloadSha = await shasum(payload);
          if (actualPayloadSha !== expectedShaFromIndex) {
            throw new InternalError(`Packfile payload corrupted: calculated ${actualPayloadSha} but expected ${expectedShaFromIndex}. The packfile may have been tampered with.`);
          }
          p._checksumVerified = true;
        }
        const result = await p.read({ oid, getExternalRefDelta });
        result.format = "content";
        result.source = `objects/pack/${filename.replace(/idx$/, "pack")}`;
        return result;
      }
    }
    return null;
  }
  async function _readObject({
    fs,
    cache,
    gitdir,
    oid,
    format = "content"
  }) {
    const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
    let result;
    if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
      result = { format: "wrapped", object: Buffer.from(`tree 0\x00`) };
    }
    if (!result) {
      result = await readObjectLoose({ fs, gitdir, oid });
    }
    if (!result) {
      result = await readObjectPacked({
        fs,
        cache,
        gitdir,
        oid,
        getExternalRefDelta
      });
      if (!result) {
        throw new NotFoundError(oid);
      }
      return result;
    }
    if (format === "deflated") {
      return result;
    }
    if (result.format === "deflated") {
      result.object = Buffer.from(await inflate(result.object));
      result.format = "wrapped";
    }
    if (format === "wrapped") {
      return result;
    }
    const sha = await shasum(result.object);
    if (sha !== oid) {
      throw new InternalError(`SHA check failed! Expected ${oid}, computed ${sha}`);
    }
    const { object, type } = GitObject.unwrap(result.object);
    result.type = type;
    result.object = object;
    result.format = "content";
    if (format === "content") {
      return result;
    }
    throw new InternalError(`invalid requested format "${format}"`);
  }

  class AlreadyExistsError extends BaseError {
    constructor(noun, where, canForce = true) {
      super(`Failed to create ${noun} at ${where} because it already exists.${canForce ? ` (Hint: use 'force: true' parameter to overwrite existing ${noun}.)` : ""}`);
      this.code = this.name = AlreadyExistsError.code;
      this.data = { noun, where, canForce };
    }
  }
  AlreadyExistsError.code = "AlreadyExistsError";

  class AmbiguousError extends BaseError {
    constructor(nouns, short, matches) {
      super(`Found multiple ${nouns} matching "${short}" (${matches.join(", ")}). Use a longer abbreviation length to disambiguate them.`);
      this.code = this.name = AmbiguousError.code;
      this.data = { nouns, short, matches };
    }
  }
  AmbiguousError.code = "AmbiguousError";

  class CheckoutConflictError extends BaseError {
    constructor(filepaths) {
      super(`Your local changes to the following files would be overwritten by checkout: ${filepaths.join(", ")}`);
      this.code = this.name = CheckoutConflictError.code;
      this.data = { filepaths };
    }
  }
  CheckoutConflictError.code = "CheckoutConflictError";

  class CherryPickMergeCommitError extends BaseError {
    constructor(oid, parentCount) {
      super(`Cannot cherry-pick merge commit ${oid}. ` + `Merge commits have ${parentCount} parents and require specifying which parent to use as the base.`);
      this.code = this.name = CherryPickMergeCommitError.code;
      this.data = { oid, parentCount };
    }
  }
  CherryPickMergeCommitError.code = "CherryPickMergeCommitError";

  class CherryPickRootCommitError extends BaseError {
    constructor(oid) {
      super(`Cannot cherry-pick root commit ${oid}. Root commits have no parents.`);
      this.code = this.name = CherryPickRootCommitError.code;
      this.data = { oid };
    }
  }
  CherryPickRootCommitError.code = "CherryPickRootCommitError";

  class CommitNotFetchedError extends BaseError {
    constructor(ref, oid) {
      super(`Failed to checkout "${ref}" because commit ${oid} is not available locally. Do a git fetch to make the branch available locally.`);
      this.code = this.name = CommitNotFetchedError.code;
      this.data = { ref, oid };
    }
  }
  CommitNotFetchedError.code = "CommitNotFetchedError";

  class EmptyServerResponseError extends BaseError {
    constructor() {
      super(`Empty response from git server.`);
      this.code = this.name = EmptyServerResponseError.code;
      this.data = {};
    }
  }
  EmptyServerResponseError.code = "EmptyServerResponseError";

  class FastForwardError extends BaseError {
    constructor() {
      super(`A simple fast-forward merge was not possible.`);
      this.code = this.name = FastForwardError.code;
      this.data = {};
    }
  }
  FastForwardError.code = "FastForwardError";

  class GitPushError extends BaseError {
    constructor(prettyDetails, result) {
      super(`One or more branches were not updated: ${prettyDetails}`);
      this.code = this.name = GitPushError.code;
      this.data = { prettyDetails, result };
    }
  }
  GitPushError.code = "GitPushError";

  class HttpError extends BaseError {
    constructor(statusCode, statusMessage, response) {
      super(`HTTP Error: ${statusCode} ${statusMessage}`);
      this.code = this.name = HttpError.code;
      this.data = { statusCode, statusMessage, response };
    }
  }
  HttpError.code = "HttpError";

  class InvalidFilepathError extends BaseError {
    constructor(reason) {
      let message = "invalid filepath";
      if (reason === "leading-slash" || reason === "trailing-slash") {
        message = `"filepath" parameter should not include leading or trailing directory separators because these can cause problems on some platforms.`;
      } else if (reason === "directory") {
        message = `"filepath" should not be a directory.`;
      }
      super(message);
      this.code = this.name = InvalidFilepathError.code;
      this.data = { reason };
    }
  }
  InvalidFilepathError.code = "InvalidFilepathError";

  class InvalidRefNameError extends BaseError {
    constructor(ref, suggestion) {
      super(`"${ref}" would be an invalid git reference. (Hint: a valid alternative would be "${suggestion}".)`);
      this.code = this.name = InvalidRefNameError.code;
      this.data = { ref, suggestion };
    }
  }
  InvalidRefNameError.code = "InvalidRefNameError";

  class MaxDepthError extends BaseError {
    constructor(depth) {
      super(`Maximum search depth of ${depth} exceeded.`);
      this.code = this.name = MaxDepthError.code;
      this.data = { depth };
    }
  }
  MaxDepthError.code = "MaxDepthError";

  class MergeNotSupportedError extends BaseError {
    constructor() {
      super(`Merges with conflicts are not supported yet.`);
      this.code = this.name = MergeNotSupportedError.code;
      this.data = {};
    }
  }
  MergeNotSupportedError.code = "MergeNotSupportedError";

  class MergeConflictError extends BaseError {
    constructor(filepaths, bothModified, deleteByUs, deleteByTheirs) {
      super(`Automatic merge failed with one or more merge conflicts in the following files: ${filepaths.toString()}. Fix conflicts then commit the result.`);
      this.code = this.name = MergeConflictError.code;
      this.data = { filepaths, bothModified, deleteByUs, deleteByTheirs };
    }
  }
  MergeConflictError.code = "MergeConflictError";

  class MissingNameError extends BaseError {
    constructor(role) {
      super(`No name was provided for ${role} in the argument or in the .git/config file.`);
      this.code = this.name = MissingNameError.code;
      this.data = { role };
    }
  }
  MissingNameError.code = "MissingNameError";

  class MissingParameterError extends BaseError {
    constructor(parameter) {
      super(`The function requires a "${parameter}" parameter but none was provided.`);
      this.code = this.name = MissingParameterError.code;
      this.data = { parameter };
    }
  }
  MissingParameterError.code = "MissingParameterError";

  class MultipleGitError extends BaseError {
    constructor(errors) {
      super(`There are multiple errors that were thrown by the method. Please refer to the "errors" property to see more`);
      this.code = this.name = MultipleGitError.code;
      this.data = { errors };
      this.errors = errors;
    }
  }
  MultipleGitError.code = "MultipleGitError";

  class ParseError extends BaseError {
    constructor(expected, actual) {
      super(`Expected "${expected}" but received "${actual}".`);
      this.code = this.name = ParseError.code;
      this.data = { expected, actual };
    }
  }
  ParseError.code = "ParseError";

  class PushRejectedError extends BaseError {
    constructor(reason) {
      let message = "";
      if (reason === "not-fast-forward") {
        message = " because it was not a simple fast-forward";
      } else if (reason === "tag-exists") {
        message = " because tag already exists";
      }
      super(`Push rejected${message}. Use "force: true" to override.`);
      this.code = this.name = PushRejectedError.code;
      this.data = { reason };
    }
  }
  PushRejectedError.code = "PushRejectedError";

  class RemoteCapabilityError extends BaseError {
    constructor(capability, parameter) {
      super(`Remote does not support the "${capability}" so the "${parameter}" parameter cannot be used.`);
      this.code = this.name = RemoteCapabilityError.code;
      this.data = { capability, parameter };
    }
  }
  RemoteCapabilityError.code = "RemoteCapabilityError";

  class SmartHttpError extends BaseError {
    constructor(preview, response) {
      super(`Remote did not reply using the "smart" HTTP protocol. Expected "001e# service=git-upload-pack" but received: ${preview}`);
      this.code = this.name = SmartHttpError.code;
      this.data = { preview, response };
    }
  }
  SmartHttpError.code = "SmartHttpError";

  class UnknownTransportError extends BaseError {
    constructor(url, transport, suggestion) {
      super(`Git remote "${url}" uses an unrecognized transport protocol: "${transport}"`);
      this.code = this.name = UnknownTransportError.code;
      this.data = { url, transport, suggestion };
    }
  }
  UnknownTransportError.code = "UnknownTransportError";

  class UrlParseError extends BaseError {
    constructor(url) {
      super(`Cannot parse remote URL: "${url}"`);
      this.code = this.name = UrlParseError.code;
      this.data = { url };
    }
  }
  UrlParseError.code = "UrlParseError";

  class UserCanceledError extends BaseError {
    constructor() {
      super(`The operation was canceled.`);
      this.code = this.name = UserCanceledError.code;
      this.data = {};
    }
  }
  UserCanceledError.code = "UserCanceledError";

  class IndexResetError extends BaseError {
    constructor(filepath) {
      super(`Could not merge index: Entry for '${filepath}' is not up to date. Either reset the index entry to HEAD, or stage your unstaged changes.`);
      this.code = this.name = IndexResetError.code;
      this.data = { filepath };
    }
  }
  IndexResetError.code = "IndexResetError";

  class NoCommitError extends BaseError {
    constructor(ref) {
      super(`"${ref}" does not point to any commit. You're maybe working on a repository with no commits yet. `);
      this.code = this.name = NoCommitError.code;
      this.data = { ref };
    }
  }
  NoCommitError.code = "NoCommitError";
  var Errors = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    AlreadyExistsError,
    AmbiguousError,
    CheckoutConflictError,
    CherryPickMergeCommitError,
    CherryPickRootCommitError,
    CommitNotFetchedError,
    EmptyServerResponseError,
    FastForwardError,
    GitPushError,
    HttpError,
    InternalError,
    InvalidFilepathError,
    InvalidOidError,
    InvalidRefNameError,
    MaxDepthError,
    MergeNotSupportedError,
    MergeConflictError,
    MissingNameError,
    MissingParameterError,
    MultipleGitError,
    NoRefspecError,
    NotFoundError,
    ObjectTypeError,
    ParseError,
    PushRejectedError,
    RemoteCapabilityError,
    SmartHttpError,
    UnknownTransportError,
    UnsafeFilepathError,
    UrlParseError,
    UserCanceledError,
    UnmergedPathsError,
    IndexResetError,
    NoCommitError
  });
  function formatAuthor({ name, email, timestamp, timezoneOffset }) {
    timezoneOffset = formatTimezoneOffset(timezoneOffset);
    return `${name} <${email}> ${timestamp} ${timezoneOffset}`;
  }
  function formatTimezoneOffset(minutes) {
    const sign = simpleSign(negateExceptForZero(minutes));
    minutes = Math.abs(minutes);
    const hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
    let strHours = String(hours);
    let strMinutes = String(minutes);
    if (strHours.length < 2)
      strHours = "0" + strHours;
    if (strMinutes.length < 2)
      strMinutes = "0" + strMinutes;
    return (sign === -1 ? "-" : "+") + strHours + strMinutes;
  }
  function simpleSign(n) {
    return Math.sign(n) || (Object.is(n, -0) ? -1 : 1);
  }
  function negateExceptForZero(n) {
    return n === 0 ? n : -n;
  }
  function normalizeNewlines(str) {
    str = str.replace(/\r/g, "");
    str = str.replace(/^\n+/, "");
    str = str.replace(/\n+$/, "") + `
`;
    return str;
  }
  function parseAuthor(author) {
    const [, name, email, timestamp, offset] = author.match(/^(.*) <(.*)> (.*) (.*)$/);
    return {
      name,
      email,
      timestamp: Number(timestamp),
      timezoneOffset: parseTimezoneOffset(offset)
    };
  }
  function parseTimezoneOffset(offset) {
    let [, sign, hours, minutes] = offset.match(/(\+|-)(\d\d)(\d\d)/);
    minutes = (sign === "+" ? 1 : -1) * (Number(hours) * 60 + Number(minutes));
    return negateExceptForZero$1(minutes);
  }
  function negateExceptForZero$1(n) {
    return n === 0 ? n : -n;
  }

  class GitAnnotatedTag {
    constructor(tag2) {
      if (typeof tag2 === "string") {
        this._tag = tag2;
      } else if (Buffer.isBuffer(tag2)) {
        this._tag = tag2.toString("utf8");
      } else if (typeof tag2 === "object") {
        this._tag = GitAnnotatedTag.render(tag2);
      } else {
        throw new InternalError("invalid type passed to GitAnnotatedTag constructor");
      }
    }
    static from(tag2) {
      return new GitAnnotatedTag(tag2);
    }
    static render(obj) {
      return `object ${obj.object}
type ${obj.type}
tag ${obj.tag}
tagger ${formatAuthor(obj.tagger)}

${obj.message}
${obj.gpgsig ? obj.gpgsig : ""}`;
    }
    justHeaders() {
      return this._tag.slice(0, this._tag.indexOf(`

`));
    }
    message() {
      const tag2 = this.withoutSignature();
      return tag2.slice(tag2.indexOf(`

`) + 2);
    }
    parse() {
      return Object.assign(this.headers(), {
        message: this.message(),
        gpgsig: this.gpgsig()
      });
    }
    render() {
      return this._tag;
    }
    headers() {
      const headers = this.justHeaders().split(`
`);
      const hs = [];
      for (const h of headers) {
        if (h[0] === " ") {
          hs[hs.length - 1] += `
` + h.slice(1);
        } else {
          hs.push(h);
        }
      }
      const obj = {};
      for (const h of hs) {
        const key = h.slice(0, h.indexOf(" "));
        const value = h.slice(h.indexOf(" ") + 1);
        if (Array.isArray(obj[key])) {
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      }
      if (obj.tagger) {
        obj.tagger = parseAuthor(obj.tagger);
      }
      if (obj.committer) {
        obj.committer = parseAuthor(obj.committer);
      }
      return obj;
    }
    withoutSignature() {
      const tag2 = normalizeNewlines(this._tag);
      if (tag2.indexOf(`
-----BEGIN PGP SIGNATURE-----`) === -1)
        return tag2;
      return tag2.slice(0, tag2.lastIndexOf(`
-----BEGIN PGP SIGNATURE-----`));
    }
    gpgsig() {
      if (this._tag.indexOf(`
-----BEGIN PGP SIGNATURE-----`) === -1)
        return;
      const signature = this._tag.slice(this._tag.indexOf("-----BEGIN PGP SIGNATURE-----"), this._tag.indexOf("-----END PGP SIGNATURE-----") + "-----END PGP SIGNATURE-----".length);
      return normalizeNewlines(signature);
    }
    payload() {
      return this.withoutSignature() + `
`;
    }
    toObject() {
      return Buffer.from(this._tag, "utf8");
    }
    static async sign(tag2, sign, secretKey) {
      const payload = tag2.payload();
      let { signature } = await sign({ payload, secretKey });
      signature = normalizeNewlines(signature);
      const signedTag = payload + signature;
      return GitAnnotatedTag.from(signedTag);
    }
  }
  function indent(str) {
    return str.trim().split(`
`).map((x) => " " + x).join(`
`) + `
`;
  }
  function outdent(str) {
    return str.split(`
`).map((x) => x.replace(/^ /, "")).join(`
`);
  }

  class GitCommit {
    constructor(commit2) {
      if (typeof commit2 === "string") {
        this._commit = commit2;
      } else if (Buffer.isBuffer(commit2)) {
        this._commit = commit2.toString("utf8");
      } else if (typeof commit2 === "object") {
        this._commit = GitCommit.render(commit2);
      } else {
        throw new InternalError("invalid type passed to GitCommit constructor");
      }
    }
    static fromPayloadSignature({ payload, signature }) {
      const headers = GitCommit.justHeaders(payload);
      const message = GitCommit.justMessage(payload);
      const commit2 = normalizeNewlines(headers + `
gpgsig` + indent(signature) + `
` + message);
      return new GitCommit(commit2);
    }
    static from(commit2) {
      return new GitCommit(commit2);
    }
    toObject() {
      return Buffer.from(this._commit, "utf8");
    }
    headers() {
      return this.parseHeaders();
    }
    message() {
      return GitCommit.justMessage(this._commit);
    }
    parse() {
      return Object.assign({ message: this.message() }, this.headers());
    }
    static justMessage(commit2) {
      return normalizeNewlines(commit2.slice(commit2.indexOf(`

`) + 2));
    }
    static justHeaders(commit2) {
      return commit2.slice(0, commit2.indexOf(`

`));
    }
    parseHeaders() {
      const headers = GitCommit.justHeaders(this._commit).split(`
`);
      const hs = [];
      for (const h of headers) {
        if (h[0] === " ") {
          hs[hs.length - 1] += `
` + h.slice(1);
        } else {
          hs.push(h);
        }
      }
      const obj = {
        parent: []
      };
      for (const h of hs) {
        const key = h.slice(0, h.indexOf(" "));
        const value = h.slice(h.indexOf(" ") + 1);
        if (Array.isArray(obj[key])) {
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      }
      if (obj.author) {
        obj.author = parseAuthor(obj.author);
      }
      if (obj.committer) {
        obj.committer = parseAuthor(obj.committer);
      }
      return obj;
    }
    static renderHeaders(obj) {
      let headers = "";
      if (obj.tree) {
        headers += `tree ${obj.tree}
`;
      } else {
        headers += `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
`;
      }
      if (obj.parent) {
        if (obj.parent.length === undefined) {
          throw new InternalError(`commit 'parent' property should be an array`);
        }
        for (const p of obj.parent) {
          headers += `parent ${p}
`;
        }
      }
      const author = obj.author;
      headers += `author ${formatAuthor(author)}
`;
      const committer = obj.committer || obj.author;
      headers += `committer ${formatAuthor(committer)}
`;
      if (obj.gpgsig) {
        headers += "gpgsig" + indent(obj.gpgsig);
      }
      return headers;
    }
    static render(obj) {
      return GitCommit.renderHeaders(obj) + `
` + normalizeNewlines(obj.message);
    }
    render() {
      return this._commit;
    }
    withoutSignature() {
      const commit2 = normalizeNewlines(this._commit);
      if (commit2.indexOf(`
gpgsig`) === -1)
        return commit2;
      const headers = commit2.slice(0, commit2.indexOf(`
gpgsig`));
      const message = commit2.slice(commit2.indexOf(`-----END PGP SIGNATURE-----
`) + `-----END PGP SIGNATURE-----
`.length);
      return normalizeNewlines(headers + `
` + message);
    }
    isolateSignature() {
      const signature = this._commit.slice(this._commit.indexOf("-----BEGIN PGP SIGNATURE-----"), this._commit.indexOf("-----END PGP SIGNATURE-----") + "-----END PGP SIGNATURE-----".length);
      return outdent(signature);
    }
    static async sign(commit2, sign, secretKey) {
      const payload = commit2.withoutSignature();
      const message = GitCommit.justMessage(commit2._commit);
      let { signature } = await sign({ payload, secretKey });
      signature = normalizeNewlines(signature);
      const headers = GitCommit.justHeaders(commit2._commit);
      const signedCommit = headers + `
` + "gpgsig" + indent(signature) + `
` + message;
      return GitCommit.from(signedCommit);
    }
  }
  async function resolveTree({ fs, cache, gitdir, oid }) {
    if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
      return { tree: GitTree.from([]), oid };
    }
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type === "tag") {
      oid = GitAnnotatedTag.from(object).parse().object;
      return resolveTree({ fs, cache, gitdir, oid });
    }
    if (type === "commit") {
      oid = GitCommit.from(object).parse().tree;
      return resolveTree({ fs, cache, gitdir, oid });
    }
    if (type !== "tree") {
      throw new ObjectTypeError(oid, type, "tree");
    }
    return { tree: GitTree.from(object), oid };
  }

  class GitWalkerRepo {
    constructor({ fs, gitdir, ref, cache }) {
      this.fs = fs;
      this.cache = cache;
      this.gitdir = gitdir;
      this.mapPromise = (async () => {
        const map = new Map;
        let oid;
        try {
          oid = await GitRefManager.resolve({ fs, gitdir, ref });
        } catch (e) {
          if (e instanceof NotFoundError) {
            oid = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
          }
        }
        const tree = await resolveTree({ fs, cache: this.cache, gitdir, oid });
        tree.type = "tree";
        tree.mode = "40000";
        map.set(".", tree);
        return map;
      })();
      const walker = this;
      this.ConstructEntry = class TreeEntry {
        constructor(fullpath) {
          this._fullpath = fullpath;
          this._type = false;
          this._mode = false;
          this._stat = false;
          this._content = false;
          this._oid = false;
        }
        async type() {
          return walker.type(this);
        }
        async mode() {
          return walker.mode(this);
        }
        async stat() {
          return walker.stat(this);
        }
        async content() {
          return walker.content(this);
        }
        async oid() {
          return walker.oid(this);
        }
      };
    }
    async readdir(entry) {
      const filepath = entry._fullpath;
      const { fs, cache, gitdir } = this;
      const map = await this.mapPromise;
      const obj = map.get(filepath);
      if (!obj)
        throw new Error(`No obj for ${filepath}`);
      const oid = obj.oid;
      if (!oid)
        throw new Error(`No oid for obj ${JSON.stringify(obj)}`);
      if (obj.type !== "tree") {
        return null;
      }
      const { type, object } = await _readObject({ fs, cache, gitdir, oid });
      if (type !== obj.type) {
        throw new ObjectTypeError(oid, type, obj.type);
      }
      const tree = GitTree.from(object);
      for (const entry2 of tree) {
        map.set(join5(filepath, entry2.path), entry2);
      }
      return tree.entries().map((entry2) => join5(filepath, entry2.path));
    }
    async type(entry) {
      if (entry._type === false) {
        const map = await this.mapPromise;
        const { type } = map.get(entry._fullpath);
        entry._type = type;
      }
      return entry._type;
    }
    async mode(entry) {
      if (entry._mode === false) {
        const map = await this.mapPromise;
        const { mode } = map.get(entry._fullpath);
        entry._mode = normalizeMode(parseInt(mode, 8));
      }
      return entry._mode;
    }
    async stat(_entry) {}
    async content(entry) {
      if (entry._content === false) {
        const map = await this.mapPromise;
        const { fs, cache, gitdir } = this;
        const obj = map.get(entry._fullpath);
        const oid = obj.oid;
        const { type, object } = await _readObject({ fs, cache, gitdir, oid });
        if (type !== "blob") {
          entry._content = undefined;
        } else {
          entry._content = new Uint8Array(object);
        }
      }
      return entry._content;
    }
    async oid(entry) {
      if (entry._oid === false) {
        const map = await this.mapPromise;
        const obj = map.get(entry._fullpath);
        entry._oid = obj.oid;
      }
      return entry._oid;
    }
  }
  function TREE({ ref = "HEAD" } = {}) {
    const o = Object.create(null);
    Object.defineProperty(o, GitWalkSymbol, {
      value: function({ fs, gitdir, cache }) {
        return new GitWalkerRepo({ fs, gitdir, ref, cache });
      }
    });
    Object.freeze(o);
    return o;
  }

  class GitWalkerFs {
    constructor({ fs, dir, gitdir, cache }) {
      this.fs = fs;
      this.cache = cache;
      this.dir = dir;
      this.gitdir = gitdir;
      this.config = null;
      const walker = this;
      this.ConstructEntry = class WorkdirEntry {
        constructor(fullpath) {
          this._fullpath = fullpath;
          this._type = false;
          this._mode = false;
          this._stat = false;
          this._content = false;
          this._oid = false;
        }
        async type() {
          return walker.type(this);
        }
        async mode() {
          return walker.mode(this);
        }
        async stat() {
          return walker.stat(this);
        }
        async content() {
          return walker.content(this);
        }
        async oid() {
          return walker.oid(this);
        }
      };
    }
    async readdir(entry) {
      const filepath = entry._fullpath;
      const { fs, dir } = this;
      const names = await fs.readdir(join5(dir, filepath));
      if (names === null)
        return null;
      return names.map((name) => join5(filepath, name));
    }
    async type(entry) {
      if (entry._type === false) {
        await entry.stat();
      }
      return entry._type;
    }
    async mode(entry) {
      if (entry._mode === false) {
        await entry.stat();
      }
      return entry._mode;
    }
    async stat(entry) {
      if (entry._stat === false) {
        const { fs, dir } = this;
        let stat = await fs.lstat(`${dir}/${entry._fullpath}`);
        if (!stat) {
          throw new Error(`ENOENT: no such file or directory, lstat '${entry._fullpath}'`);
        }
        let type = stat.isDirectory() ? "tree" : "blob";
        if (type === "blob" && !stat.isFile() && !stat.isSymbolicLink()) {
          type = "special";
        }
        entry._type = type;
        stat = normalizeStats(stat);
        entry._mode = stat.mode;
        if (stat.size === -1 && entry._actualSize) {
          stat.size = entry._actualSize;
        }
        entry._stat = stat;
      }
      return entry._stat;
    }
    async content(entry) {
      if (entry._content === false) {
        const { fs, dir, gitdir } = this;
        if (await entry.type() === "tree") {
          entry._content = undefined;
        } else {
          let content;
          if (await entry.mode() >> 12 === 10) {
            content = await fs.readlink(`${dir}/${entry._fullpath}`);
          } else {
            const config = await this._getGitConfig(fs, gitdir);
            const autocrlf = await config.get("core.autocrlf");
            content = await fs.read(`${dir}/${entry._fullpath}`, { autocrlf });
          }
          entry._actualSize = content.length;
          if (entry._stat && entry._stat.size === -1) {
            entry._stat.size = entry._actualSize;
          }
          entry._content = new Uint8Array(content);
        }
      }
      return entry._content;
    }
    async oid(entry) {
      if (entry._oid === false) {
        const self = this;
        const { fs, gitdir, cache } = this;
        let oid;
        await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
          const stage = index2.entriesMap.get(entry._fullpath);
          const stats = await entry.stat();
          const config = await self._getGitConfig(fs, gitdir);
          const filemode = await config.get("core.filemode");
          const trustino = typeof process !== "undefined" ? !(process.platform === "win32") : true;
          if (!stage || compareStats(stats, stage, filemode, trustino)) {
            const content = await entry.content();
            if (content === undefined) {
              oid = undefined;
            } else {
              oid = await shasum(GitObject.wrap({ type: "blob", object: content }));
              if (stage && oid === stage.oid && (!filemode || stats.mode === stage.mode) && compareStats(stats, stage, filemode, trustino)) {
                index2.insert({
                  filepath: entry._fullpath,
                  stats,
                  oid
                });
              }
            }
          } else {
            oid = stage.oid;
          }
        });
        entry._oid = oid;
      }
      return entry._oid;
    }
    async _getGitConfig(fs, gitdir) {
      if (this.config) {
        return this.config;
      }
      this.config = await GitConfigManager.get({ fs, gitdir });
      return this.config;
    }
  }
  function WORKDIR() {
    const o = Object.create(null);
    Object.defineProperty(o, GitWalkSymbol, {
      value: function({ fs, dir, gitdir, cache }) {
        return new GitWalkerFs({ fs, dir, gitdir, cache });
      }
    });
    Object.freeze(o);
    return o;
  }
  function arrayRange(start, end) {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
  }
  var flat = typeof Array.prototype.flat === "undefined" ? (entries) => entries.reduce((acc, x) => acc.concat(x), []) : (entries) => entries.flat();

  class RunningMinimum {
    constructor() {
      this.value = null;
    }
    consider(value) {
      if (value === null || value === undefined)
        return;
      if (this.value === null) {
        this.value = value;
      } else if (value < this.value) {
        this.value = value;
      }
    }
    reset() {
      this.value = null;
    }
  }
  function* unionOfIterators(sets) {
    const min = new RunningMinimum;
    let minimum;
    const heads = [];
    const numsets = sets.length;
    for (let i = 0;i < numsets; i++) {
      heads[i] = sets[i].next().value;
      if (heads[i] !== undefined) {
        min.consider(heads[i]);
      }
    }
    if (min.value === null)
      return;
    while (true) {
      const result = [];
      minimum = min.value;
      min.reset();
      for (let i = 0;i < numsets; i++) {
        if (heads[i] !== undefined && heads[i] === minimum) {
          result[i] = heads[i];
          heads[i] = sets[i].next().value;
        } else {
          result[i] = null;
        }
        if (heads[i] !== undefined) {
          min.consider(heads[i]);
        }
      }
      yield result;
      if (min.value === null)
        return;
    }
  }
  async function _walk({
    fs,
    cache,
    dir,
    gitdir,
    trees,
    map = async (_, entry) => entry,
    reduce = async (parent, children) => {
      const flatten = flat(children);
      if (parent !== undefined)
        flatten.unshift(parent);
      return flatten;
    },
    iterate = (walk2, children) => Promise.all([...children].map(walk2))
  }) {
    const walkers = trees.map((proxy) => proxy[GitWalkSymbol]({ fs, dir, gitdir, cache }));
    const root = new Array(walkers.length).fill(".");
    const range = arrayRange(0, walkers.length);
    const unionWalkerFromReaddir = async (entries) => {
      range.forEach((i) => {
        const entry = entries[i];
        entries[i] = entry && new walkers[i].ConstructEntry(entry);
      });
      const subdirs = await Promise.all(range.map((i) => {
        const entry = entries[i];
        return entry ? walkers[i].readdir(entry) : [];
      }));
      const iterators = subdirs.map((array) => {
        return (array === null ? [] : array)[Symbol.iterator]();
      });
      return {
        entries,
        children: unionOfIterators(iterators)
      };
    };
    const walk2 = async (root2) => {
      const { entries, children } = await unionWalkerFromReaddir(root2);
      const fullpath = entries.find((entry) => entry && entry._fullpath)._fullpath;
      const parent = await map(fullpath, entries);
      if (parent !== null) {
        let walkedChildren = await iterate(walk2, children);
        walkedChildren = walkedChildren.filter((x) => x !== undefined);
        return reduce(parent, walkedChildren);
      }
    };
    return walk2(root);
  }
  async function rmRecursive(fs, filepath) {
    const entries = await fs.readdir(filepath);
    if (entries == null) {
      await fs.rm(filepath);
    } else if (entries.length) {
      await Promise.all(entries.map((entry) => {
        const subpath = join5(filepath, entry);
        return fs.lstat(subpath).then((stat) => {
          if (!stat)
            return;
          return stat.isDirectory() ? rmRecursive(fs, subpath) : fs.rm(subpath);
        });
      })).then(() => fs.rmdir(filepath));
    } else {
      await fs.rmdir(filepath);
    }
  }
  function isPromiseLike(obj) {
    return isObject(obj) && isFunction(obj.then) && isFunction(obj.catch);
  }
  function isObject(obj) {
    return obj && typeof obj === "object";
  }
  function isFunction(obj) {
    return typeof obj === "function";
  }
  function isPromiseFs(fs) {
    const test = (targetFs) => {
      try {
        return targetFs.readFile().catch((e) => e);
      } catch (e) {
        return e;
      }
    };
    return isPromiseLike(test(fs));
  }
  var commands = [
    "readFile",
    "writeFile",
    "mkdir",
    "rmdir",
    "unlink",
    "stat",
    "lstat",
    "readdir",
    "readlink",
    "symlink"
  ];
  function bindFs(target, fs) {
    if (isPromiseFs(fs)) {
      for (const command of commands) {
        target[`_${command}`] = fs[command].bind(fs);
      }
    } else {
      for (const command of commands) {
        target[`_${command}`] = pify(fs[command].bind(fs));
      }
    }
    if (isPromiseFs(fs)) {
      if (fs.cp)
        target._cp = fs.cp.bind(fs);
      if (fs.rm)
        target._rm = fs.rm.bind(fs);
      else if (fs.rmdir.length > 1)
        target._rm = fs.rmdir.bind(fs);
      else
        target._rm = rmRecursive.bind(null, target);
    } else {
      if (fs.cp)
        target._cp = pify(fs.cp.bind(fs));
      if (fs.rm)
        target._rm = pify(fs.rm.bind(fs));
      else if (fs.rmdir.length > 2)
        target._rm = pify(fs.rmdir.bind(fs));
      else
        target._rm = rmRecursive.bind(null, target);
    }
  }

  class FileSystem {
    constructor(fs) {
      if (typeof fs._original_unwrapped_fs !== "undefined")
        return fs;
      const promises = Object.getOwnPropertyDescriptor(fs, "promises");
      if (promises && promises.enumerable) {
        bindFs(this, fs.promises);
      } else {
        bindFs(this, fs);
      }
      this._original_unwrapped_fs = fs;
    }
    async exists(filepath, options = {}) {
      try {
        await this._stat(filepath);
        return true;
      } catch (err) {
        if (err.code === "ENOENT" || err.code === "ENOTDIR" || (err.code || "").includes("ENS")) {
          return false;
        } else {
          console.log('Unhandled error in "FileSystem.exists()" function', err);
          throw err;
        }
      }
    }
    async read(filepath, options = {}) {
      try {
        let buffer = await this._readFile(filepath, options);
        if (options.autocrlf === "true") {
          try {
            buffer = new TextDecoder("utf8", { fatal: true }).decode(buffer);
            buffer = buffer.replace(/\r\n/g, `
`);
            buffer = new TextEncoder().encode(buffer);
          } catch (error) {}
        }
        if (typeof buffer !== "string") {
          buffer = Buffer.from(buffer);
        }
        return buffer;
      } catch (err) {
        return null;
      }
    }
    async write(filepath, contents, options = {}) {
      try {
        await this._writeFile(filepath, contents, options);
      } catch (err) {
        await this.mkdir(dirname2(filepath));
        await this._writeFile(filepath, contents, options);
      }
    }
    async mkdir(filepath, _selfCall = false) {
      try {
        await this._mkdir(filepath);
      } catch (err) {
        if (err === null)
          return;
        if (err.code === "EEXIST")
          return;
        if (_selfCall)
          throw err;
        if (err.code === "ENOENT") {
          const parent = dirname2(filepath);
          if (parent === "." || parent === "/" || parent === filepath)
            throw err;
          await this.mkdir(parent);
          await this.mkdir(filepath, true);
        }
      }
    }
    async rm(filepath) {
      try {
        await this._unlink(filepath);
      } catch (err) {
        if (err.code !== "ENOENT")
          throw err;
      }
    }
    async rmdir(filepath, opts) {
      try {
        if (opts && opts.recursive) {
          await this._rm(filepath, opts);
        } else {
          await this._rmdir(filepath);
        }
      } catch (err) {
        if (err.code !== "ENOENT")
          throw err;
      }
    }
    async readdir(filepath) {
      try {
        const names = await this._readdir(filepath);
        names.sort(compareStrings);
        return names;
      } catch (err) {
        if (err.code === "ENOTDIR")
          return null;
        return [];
      }
    }
    async readdirDeep(dir) {
      const subdirs = await this._readdir(dir);
      const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = dir + "/" + subdir;
        return (await this._stat(res)).isDirectory() ? this.readdirDeep(res) : res;
      }));
      return files.reduce((a, f) => a.concat(f), []);
    }
    async lstat(filename) {
      try {
        const stats = await this._lstat(filename);
        return stats;
      } catch (err) {
        if (err.code === "ENOENT" || (err.code || "").includes("ENS")) {
          return null;
        }
        throw err;
      }
    }
    async readlink(filename, opts = { encoding: "buffer" }) {
      try {
        const link = await this._readlink(filename, opts);
        return Buffer.isBuffer(link) ? link : Buffer.from(link);
      } catch (err) {
        if (err.code === "ENOENT" || (err.code || "").includes("ENS")) {
          return null;
        }
        throw err;
      }
    }
    async writelink(filename, buffer) {
      return this._symlink(buffer.toString("utf8"), filename);
    }
  }
  function assertParameter(name, value) {
    if (value === undefined) {
      throw new MissingParameterError(name);
    }
  }
  async function discoverGitdir({ fsp, dotgit }) {
    assertParameter("fsp", fsp);
    assertParameter("dotgit", dotgit);
    const dotgitStat = await fsp._stat(dotgit).catch(() => ({ isFile: () => false, isDirectory: () => false }));
    if (dotgitStat.isDirectory()) {
      return dotgit;
    } else if (dotgitStat.isFile()) {
      return fsp._readFile(dotgit, "utf8").then((contents) => contents.trimRight().substr(8)).then((submoduleGitdir) => {
        const gitdir = join5(dirname2(dotgit), submoduleGitdir);
        return gitdir;
      });
    } else {
      return dotgit;
    }
  }
  async function modified(entry, base) {
    if (!entry && !base)
      return false;
    if (entry && !base)
      return true;
    if (!entry && base)
      return true;
    if (await entry.type() === "tree" && await base.type() === "tree") {
      return false;
    }
    if (await entry.type() === await base.type() && await entry.mode() === await base.mode() && await entry.oid() === await base.oid()) {
      return false;
    }
    return true;
  }
  async function abortMerge({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    commit: commit2 = "HEAD",
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("dir", dir);
      assertParameter("gitdir", gitdir);
      const fs = new FileSystem(_fs);
      const trees = [TREE({ ref: commit2 }), WORKDIR(), STAGE()];
      let unmergedPaths = [];
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      await GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async function(index2) {
        unmergedPaths = index2.unmergedPaths;
      });
      const results = await _walk({
        fs,
        cache,
        dir,
        gitdir: updatedGitdir,
        trees,
        map: async function(path2, [head, workdir, index2]) {
          const staged = !await modified(workdir, index2);
          const unmerged = unmergedPaths.includes(path2);
          const unmodified = !await modified(index2, head);
          if (staged || unmerged) {
            return head ? {
              path: path2,
              mode: await head.mode(),
              oid: await head.oid(),
              type: await head.type(),
              content: await head.content()
            } : undefined;
          }
          if (unmodified)
            return false;
          else
            throw new IndexResetError(path2);
        }
      });
      await GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async function(index2) {
        for (const entry of results) {
          if (entry === false)
            continue;
          if (!entry) {
            await fs.rmdir(`${dir}/${entry.path}`, { recursive: true });
            index2.delete({ filepath: entry.path });
            continue;
          }
          if (entry.type === "blob") {
            const content = new TextDecoder().decode(entry.content);
            await fs.write(`${dir}/${entry.path}`, content, {
              mode: entry.mode
            });
            index2.insert({
              filepath: entry.path,
              oid: entry.oid,
              stage: 0
            });
          }
        }
      });
    } catch (err) {
      err.caller = "git.abortMerge";
      throw err;
    }
  }

  class GitIgnoreManager {
    static async isIgnored({ fs, dir, gitdir = join5(dir, ".git"), filepath }) {
      if (basename(filepath) === ".git")
        return true;
      if (filepath === ".")
        return false;
      let excludes = "";
      const excludesFile = join5(gitdir, "info", "exclude");
      if (await fs.exists(excludesFile)) {
        excludes = await fs.read(excludesFile, "utf8");
      }
      const pairs = [
        {
          gitignore: join5(dir, ".gitignore"),
          filepath
        }
      ];
      const pieces = filepath.split("/").filter(Boolean);
      for (let i = 1;i < pieces.length; i++) {
        const folder = pieces.slice(0, i).join("/");
        const file = pieces.slice(i).join("/");
        pairs.push({
          gitignore: join5(dir, folder, ".gitignore"),
          filepath: file
        });
      }
      let ignoredStatus = false;
      for (const p of pairs) {
        let file;
        try {
          file = await fs.read(p.gitignore, "utf8");
        } catch (err) {
          if (err.code === "NOENT")
            continue;
        }
        const ign = ignore().add(excludes);
        ign.add(file);
        const parentdir = dirname2(p.filepath);
        if (parentdir !== "." && ign.ignores(parentdir))
          return true;
        if (ignoredStatus) {
          ignoredStatus = !ign.test(p.filepath).unignored;
        } else {
          ignoredStatus = ign.test(p.filepath).ignored;
        }
      }
      return ignoredStatus;
    }
  }
  async function writeObjectLoose({ fs, gitdir, object, format, oid }) {
    if (format !== "deflated") {
      throw new InternalError("GitObjectStoreLoose expects objects to write to be in deflated format");
    }
    const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
    const filepath = `${gitdir}/${source}`;
    if (!await fs.exists(filepath))
      await fs.write(filepath, object);
  }
  var supportsCompressionStream = null;
  async function deflate(buffer) {
    if (supportsCompressionStream === null) {
      supportsCompressionStream = testCompressionStream();
    }
    return supportsCompressionStream ? browserDeflate(buffer) : pako.deflate(buffer);
  }
  async function browserDeflate(buffer) {
    const cs = new CompressionStream("deflate");
    const c = new Blob([buffer]).stream().pipeThrough(cs);
    return new Uint8Array(await new Response(c).arrayBuffer());
  }
  function testCompressionStream() {
    try {
      const cs = new CompressionStream("deflate");
      cs.writable.close();
      const stream = new Blob([]).stream();
      stream.cancel();
      return true;
    } catch (_) {
      return false;
    }
  }
  async function _writeObject({
    fs,
    gitdir,
    type,
    object,
    format = "content",
    oid = undefined,
    dryRun = false
  }) {
    if (format !== "deflated") {
      if (format !== "wrapped") {
        object = GitObject.wrap({ type, object });
      }
      oid = await shasum(object);
      object = Buffer.from(await deflate(object));
    }
    if (!dryRun) {
      await writeObjectLoose({ fs, gitdir, object, format: "deflated", oid });
    }
    return oid;
  }
  function posixifyPathBuffer(buffer) {
    let idx;
    while (~(idx = buffer.indexOf(92)))
      buffer[idx] = 47;
    return buffer;
  }
  async function add({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    filepath,
    cache = {},
    force = false,
    parallel = true
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("dir", dir);
      assertParameter("gitdir", gitdir);
      assertParameter("filepath", filepath);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      await GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async (index2) => {
        const config = await GitConfigManager.get({ fs, gitdir: updatedGitdir });
        const autocrlf = await config.get("core.autocrlf");
        return addToIndex({
          dir,
          gitdir: updatedGitdir,
          fs,
          filepath,
          index: index2,
          force,
          parallel,
          autocrlf
        });
      });
    } catch (err) {
      err.caller = "git.add";
      throw err;
    }
  }
  async function addToIndex({
    dir,
    gitdir,
    fs,
    filepath,
    index: index2,
    force,
    parallel,
    autocrlf
  }) {
    filepath = Array.isArray(filepath) ? filepath : [filepath];
    const promises = filepath.map(async (currentFilepath) => {
      if (!force) {
        const ignored = await GitIgnoreManager.isIgnored({
          fs,
          dir,
          gitdir,
          filepath: currentFilepath
        });
        if (ignored)
          return;
      }
      const stats = await fs.lstat(join5(dir, currentFilepath));
      if (!stats)
        throw new NotFoundError(currentFilepath);
      if (stats.isDirectory()) {
        const children = await fs.readdir(join5(dir, currentFilepath));
        if (parallel) {
          const promises2 = children.map((child) => addToIndex({
            dir,
            gitdir,
            fs,
            filepath: [join5(currentFilepath, child)],
            index: index2,
            force,
            parallel,
            autocrlf
          }));
          await Promise.all(promises2);
        } else {
          for (const child of children) {
            await addToIndex({
              dir,
              gitdir,
              fs,
              filepath: [join5(currentFilepath, child)],
              index: index2,
              force,
              parallel,
              autocrlf
            });
          }
        }
      } else {
        const object = stats.isSymbolicLink() ? await fs.readlink(join5(dir, currentFilepath)).then(posixifyPathBuffer) : await fs.read(join5(dir, currentFilepath), { autocrlf });
        if (object === null)
          throw new NotFoundError(currentFilepath);
        const oid = await _writeObject({ fs, gitdir, type: "blob", object });
        index2.insert({ filepath: currentFilepath, stats, oid });
      }
    });
    const settledPromises = await Promise.allSettled(promises);
    const rejectedPromises = settledPromises.filter((settle) => settle.status === "rejected").map((settle) => settle.reason);
    if (rejectedPromises.length > 1) {
      throw new MultipleGitError(rejectedPromises);
    }
    if (rejectedPromises.length === 1) {
      throw rejectedPromises[0];
    }
    const fulfilledPromises = settledPromises.filter((settle) => settle.status === "fulfilled" && settle.value).map((settle) => settle.value);
    return fulfilledPromises;
  }
  async function _getConfig({ fs, gitdir, path: path2 }) {
    const config = await GitConfigManager.get({ fs, gitdir });
    return config.get(path2);
  }
  function assignDefined(target, ...sources) {
    for (const source of sources) {
      if (source) {
        for (const key of Object.keys(source)) {
          const val = source[key];
          if (val !== undefined) {
            target[key] = val;
          }
        }
      }
    }
    return target;
  }
  async function normalizeAuthorObject({ fs, gitdir, author, commit: commit2 }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const defaultAuthor = {
      name: await _getConfig({ fs, gitdir, path: "user.name" }),
      email: await _getConfig({ fs, gitdir, path: "user.email" }) || "",
      timestamp,
      timezoneOffset: new Date(timestamp * 1000).getTimezoneOffset()
    };
    const normalizedAuthor = assignDefined({}, defaultAuthor, commit2 ? commit2.author : undefined, author);
    if (normalizedAuthor.name === undefined) {
      return;
    }
    return normalizedAuthor;
  }
  async function normalizeCommitterObject({
    fs,
    gitdir,
    author,
    committer,
    commit: commit2
  }) {
    const timestamp = Math.floor(Date.now() / 1000);
    const defaultCommitter = {
      name: await _getConfig({ fs, gitdir, path: "user.name" }),
      email: await _getConfig({ fs, gitdir, path: "user.email" }) || "",
      timestamp,
      timezoneOffset: new Date(timestamp * 1000).getTimezoneOffset()
    };
    const normalizedCommitter = assignDefined({}, defaultCommitter, commit2 ? commit2.committer : undefined, author, committer);
    if (normalizedCommitter.name === undefined) {
      return;
    }
    return normalizedCommitter;
  }
  async function resolveCommit({ fs, cache, gitdir, oid }) {
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type === "tag") {
      oid = GitAnnotatedTag.from(object).parse().object;
      return resolveCommit({ fs, cache, gitdir, oid });
    }
    if (type !== "commit") {
      throw new ObjectTypeError(oid, type, "commit");
    }
    return { commit: GitCommit.from(object), oid };
  }
  async function _readCommit({ fs, cache, gitdir, oid }) {
    const { commit: commit2, oid: commitOid } = await resolveCommit({
      fs,
      cache,
      gitdir,
      oid
    });
    const result = {
      oid: commitOid,
      commit: commit2.parse(),
      payload: commit2.withoutSignature()
    };
    return result;
  }
  async function _commit({
    fs,
    cache,
    onSign,
    gitdir,
    message,
    author: _author,
    committer: _committer,
    signingKey,
    amend = false,
    dryRun = false,
    noUpdateBranch = false,
    ref,
    parent,
    tree
  }) {
    let initialCommit = false;
    let detachedHead = false;
    if (!ref) {
      const headContent = await fs.read(`${gitdir}/HEAD`, { encoding: "utf8" });
      detachedHead = !headContent.startsWith("ref:");
      ref = await GitRefManager.resolve({
        fs,
        gitdir,
        ref: "HEAD",
        depth: 2
      });
    }
    let refOid, refCommit;
    try {
      refOid = await GitRefManager.resolve({
        fs,
        gitdir,
        ref
      });
      refCommit = await _readCommit({ fs, gitdir, oid: refOid, cache: {} });
    } catch {
      initialCommit = true;
    }
    if (amend && initialCommit) {
      throw new NoCommitError(ref);
    }
    const author = !amend ? await normalizeAuthorObject({ fs, gitdir, author: _author }) : await normalizeAuthorObject({
      fs,
      gitdir,
      author: _author,
      commit: refCommit.commit
    });
    if (!author)
      throw new MissingNameError("author");
    const committer = !amend ? await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer
    }) : await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer,
      commit: refCommit.commit
    });
    if (!committer)
      throw new MissingNameError("committer");
    return GitIndexManager.acquire({ fs, gitdir, cache, allowUnmerged: false }, async function(index2) {
      const inodes = flatFileListToDirectoryStructure(index2.entries);
      const inode = inodes.get(".");
      if (!tree) {
        tree = await constructTree({ fs, gitdir, inode, dryRun });
      }
      if (!parent) {
        if (!amend) {
          parent = refOid ? [refOid] : [];
        } else {
          parent = refCommit.commit.parent;
        }
      } else {
        parent = await Promise.all(parent.map((p) => {
          return GitRefManager.resolve({ fs, gitdir, ref: p });
        }));
      }
      if (!message) {
        if (!amend) {
          throw new MissingParameterError("message");
        } else {
          message = refCommit.commit.message;
        }
      }
      let comm = GitCommit.from({
        tree,
        parent,
        author,
        committer,
        message
      });
      if (signingKey) {
        comm = await GitCommit.sign(comm, onSign, signingKey);
      }
      const oid = await _writeObject({
        fs,
        gitdir,
        type: "commit",
        object: comm.toObject(),
        dryRun
      });
      if (!noUpdateBranch && !dryRun) {
        await GitRefManager.writeRef({
          fs,
          gitdir,
          ref: detachedHead ? "HEAD" : ref,
          value: oid
        });
      }
      return oid;
    });
  }
  async function constructTree({ fs, gitdir, inode, dryRun }) {
    const children = inode.children;
    for (const inode2 of children) {
      if (inode2.type === "tree") {
        inode2.metadata.mode = "040000";
        inode2.metadata.oid = await constructTree({ fs, gitdir, inode: inode2, dryRun });
      }
    }
    const entries = children.map((inode2) => ({
      mode: inode2.metadata.mode,
      path: inode2.basename,
      oid: inode2.metadata.oid,
      type: inode2.type
    }));
    const tree = GitTree.from(entries);
    const oid = await _writeObject({
      fs,
      gitdir,
      type: "tree",
      object: tree.toObject(),
      dryRun
    });
    return oid;
  }
  async function resolveFilepath({ fs, cache, gitdir, oid, filepath }) {
    if (filepath.startsWith("/")) {
      throw new InvalidFilepathError("leading-slash");
    } else if (filepath.endsWith("/")) {
      throw new InvalidFilepathError("trailing-slash");
    }
    const _oid = oid;
    const result = await resolveTree({ fs, cache, gitdir, oid });
    const tree = result.tree;
    if (filepath === "") {
      oid = result.oid;
    } else {
      const pathArray = filepath.split("/");
      oid = await _resolveFilepath({
        fs,
        cache,
        gitdir,
        tree,
        pathArray,
        oid: _oid,
        filepath
      });
    }
    return oid;
  }
  async function _resolveFilepath({
    fs,
    cache,
    gitdir,
    tree,
    pathArray,
    oid,
    filepath
  }) {
    const name = pathArray.shift();
    for (const entry of tree) {
      if (entry.path === name) {
        if (pathArray.length === 0) {
          return entry.oid;
        } else {
          const { type, object } = await _readObject({
            fs,
            cache,
            gitdir,
            oid: entry.oid
          });
          if (type !== "tree") {
            throw new ObjectTypeError(oid, type, "tree", filepath);
          }
          tree = GitTree.from(object);
          return _resolveFilepath({
            fs,
            cache,
            gitdir,
            tree,
            pathArray,
            oid,
            filepath
          });
        }
      }
    }
    throw new NotFoundError(`file or directory found at "${oid}:${filepath}"`);
  }
  async function _readTree({
    fs,
    cache,
    gitdir,
    oid,
    filepath = undefined
  }) {
    if (filepath !== undefined) {
      oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
    }
    const { tree, oid: treeOid } = await resolveTree({ fs, cache, gitdir, oid });
    const result = {
      oid: treeOid,
      tree: tree.entries()
    };
    return result;
  }
  async function _writeTree({ fs, gitdir, tree }) {
    const object = GitTree.from(tree).toObject();
    const oid = await _writeObject({
      fs,
      gitdir,
      type: "tree",
      object,
      format: "content"
    });
    return oid;
  }
  async function _addNote({
    fs,
    cache,
    onSign,
    gitdir,
    ref,
    oid,
    note,
    force,
    author,
    committer,
    signingKey
  }) {
    let parent;
    try {
      parent = await GitRefManager.resolve({ gitdir, fs, ref });
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw err;
      }
    }
    const result = await _readTree({
      fs,
      cache,
      gitdir,
      oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
    });
    let tree = result.tree;
    if (force) {
      tree = tree.filter((entry) => entry.path !== oid);
    } else {
      for (const entry of tree) {
        if (entry.path === oid) {
          throw new AlreadyExistsError("note", oid);
        }
      }
    }
    if (typeof note === "string") {
      note = Buffer.from(note, "utf8");
    }
    const noteOid = await _writeObject({
      fs,
      gitdir,
      type: "blob",
      object: note,
      format: "content"
    });
    tree.push({ mode: "100644", path: oid, oid: noteOid, type: "blob" });
    const treeOid = await _writeTree({
      fs,
      gitdir,
      tree
    });
    const commitOid = await _commit({
      fs,
      cache,
      onSign,
      gitdir,
      ref,
      tree: treeOid,
      parent: parent && [parent],
      message: `Note added by 'isomorphic-git addNote'
`,
      author,
      committer,
      signingKey
    });
    return commitOid;
  }
  async function addNote({
    fs: _fs,
    onSign,
    dir,
    gitdir = join5(dir, ".git"),
    ref = "refs/notes/commits",
    oid,
    note,
    force,
    author: _author,
    committer: _committer,
    signingKey,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      assertParameter("note", note);
      if (signingKey) {
        assertParameter("onSign", onSign);
      }
      const fs = new FileSystem(_fs);
      const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
      if (!author)
        throw new MissingNameError("author");
      const committer = await normalizeCommitterObject({
        fs,
        gitdir,
        author,
        committer: _committer
      });
      if (!committer)
        throw new MissingNameError("committer");
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      return await _addNote({
        fs,
        cache,
        onSign,
        gitdir: updatedGitdir,
        ref,
        oid,
        note,
        force,
        author,
        committer,
        signingKey
      });
    } catch (err) {
      err.caller = "git.addNote";
      throw err;
    }
  }
  var bad = /(^|[/.])([/.]|$)|^@$|@{|[\x00-\x20\x7f~^:?*[\\]|\.lock(\/|$)/;
  function isValidRef(name, onelevel) {
    if (typeof name !== "string")
      throw new TypeError("Reference name must be a string");
    return !bad.test(name) && (!!onelevel || name.includes("/"));
  }
  async function _addRemote({ fs, gitdir, remote, url, force }) {
    if (!isValidRef(remote, true)) {
      throw new InvalidRefNameError(remote, cleanGitRef.clean(remote));
    }
    const config = await GitConfigManager.get({ fs, gitdir });
    if (!force) {
      const remoteNames = await config.getSubsections("remote");
      if (remoteNames.includes(remote)) {
        if (url !== await config.get(`remote.${remote}.url`)) {
          throw new AlreadyExistsError("remote", remote);
        }
      }
    }
    await config.set(`remote.${remote}.url`, url);
    await config.set(`remote.${remote}.fetch`, `+refs/heads/*:refs/remotes/${remote}/*`);
    await GitConfigManager.save({ fs, gitdir, config });
  }
  async function addRemote({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    remote,
    url,
    force = false
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("remote", remote);
      assertParameter("url", url);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _addRemote({
        fs: fsp,
        gitdir: updatedGitdir,
        remote,
        url,
        force
      });
    } catch (err) {
      err.caller = "git.addRemote";
      throw err;
    }
  }
  async function _annotatedTag({
    fs,
    cache,
    onSign,
    gitdir,
    ref,
    tagger,
    message = ref,
    gpgsig,
    object,
    signingKey,
    force = false
  }) {
    ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
    if (!force && await GitRefManager.exists({ fs, gitdir, ref })) {
      throw new AlreadyExistsError("tag", ref);
    }
    const oid = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: object || "HEAD"
    });
    const { type } = await _readObject({ fs, cache, gitdir, oid });
    let tagObject = GitAnnotatedTag.from({
      object: oid,
      type,
      tag: ref.replace("refs/tags/", ""),
      tagger,
      message,
      gpgsig
    });
    if (signingKey) {
      tagObject = await GitAnnotatedTag.sign(tagObject, onSign, signingKey);
    }
    const value = await _writeObject({
      fs,
      gitdir,
      type: "tag",
      object: tagObject.toObject()
    });
    await GitRefManager.writeRef({ fs, gitdir, ref, value });
  }
  async function annotatedTag({
    fs: _fs,
    onSign,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    tagger: _tagger,
    message = ref,
    gpgsig,
    object,
    signingKey,
    force = false,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      if (signingKey) {
        assertParameter("onSign", onSign);
      }
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const tagger = await normalizeAuthorObject({
        fs,
        gitdir: updatedGitdir,
        author: _tagger
      });
      if (!tagger)
        throw new MissingNameError("tagger");
      return await _annotatedTag({
        fs,
        cache,
        onSign,
        gitdir: updatedGitdir,
        ref,
        tagger,
        message,
        gpgsig,
        object,
        signingKey,
        force
      });
    } catch (err) {
      err.caller = "git.annotatedTag";
      throw err;
    }
  }
  async function _branch({
    fs,
    gitdir,
    ref,
    object,
    checkout: checkout2 = false,
    force = false
  }) {
    if (!isValidRef(ref, true)) {
      throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
    }
    const fullref = `refs/heads/${ref}`;
    if (!force) {
      const exist = await GitRefManager.exists({ fs, gitdir, ref: fullref });
      if (exist) {
        throw new AlreadyExistsError("branch", ref, false);
      }
    }
    let oid;
    try {
      oid = await GitRefManager.resolve({ fs, gitdir, ref: object || "HEAD" });
    } catch (e) {}
    if (oid) {
      await GitRefManager.writeRef({ fs, gitdir, ref: fullref, value: oid });
    }
    if (checkout2) {
      await GitRefManager.writeSymbolicRef({
        fs,
        gitdir,
        ref: "HEAD",
        value: fullref
      });
    }
  }
  async function branch({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    object,
    checkout: checkout2 = false,
    force = false
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _branch({
        fs: fsp,
        gitdir: updatedGitdir,
        ref,
        object,
        checkout: checkout2,
        force
      });
    } catch (err) {
      err.caller = "git.branch";
      throw err;
    }
  }
  var worthWalking = (filepath, root) => {
    if (filepath === "." || root == null || root.length === 0 || root === ".") {
      return true;
    }
    if (root.length >= filepath.length) {
      return root.startsWith(filepath);
    } else {
      return filepath.startsWith(root);
    }
  };
  async function _checkout({
    fs,
    cache,
    onProgress,
    onPostCheckout,
    dir,
    gitdir,
    remote,
    ref,
    filepaths,
    noCheckout,
    noUpdateHead,
    dryRun,
    force,
    track = true,
    nonBlocking = false,
    batchSize = 100
  }) {
    let oldOid;
    if (onPostCheckout) {
      try {
        oldOid = await GitRefManager.resolve({ fs, gitdir, ref: "HEAD" });
      } catch (err) {
        oldOid = "0000000000000000000000000000000000000000";
      }
    }
    let oid;
    try {
      oid = await GitRefManager.resolve({ fs, gitdir, ref });
    } catch (err) {
      if (ref === "HEAD")
        throw err;
      const remoteRef = `${remote}/${ref}`;
      oid = await GitRefManager.resolve({
        fs,
        gitdir,
        ref: remoteRef
      });
      if (track) {
        const config = await GitConfigManager.get({ fs, gitdir });
        await config.set(`branch.${ref}.remote`, remote);
        await config.set(`branch.${ref}.merge`, `refs/heads/${ref}`);
        await GitConfigManager.save({ fs, gitdir, config });
      }
      await GitRefManager.writeRef({
        fs,
        gitdir,
        ref: `refs/heads/${ref}`,
        value: oid
      });
    }
    if (!noCheckout) {
      let ops;
      try {
        ops = await analyze({
          fs,
          cache,
          onProgress,
          dir,
          gitdir,
          ref,
          force,
          filepaths
        });
      } catch (err) {
        if (err instanceof NotFoundError && err.data.what === oid) {
          throw new CommitNotFetchedError(ref, oid);
        } else {
          throw err;
        }
      }
      const conflicts = ops.filter(([method]) => method === "conflict").map(([method, fullpath]) => fullpath);
      if (conflicts.length > 0) {
        throw new CheckoutConflictError(conflicts);
      }
      const errors = ops.filter(([method]) => method === "error").map(([method, fullpath]) => fullpath);
      if (errors.length > 0) {
        throw new InternalError(errors.join(", "));
      }
      if (dryRun) {
        if (onPostCheckout) {
          await onPostCheckout({
            previousHead: oldOid,
            newHead: oid,
            type: filepaths != null && filepaths.length > 0 ? "file" : "branch"
          });
        }
        return;
      }
      let count = 0;
      const total = ops.length;
      await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
        await Promise.all(ops.filter(([method]) => method === "delete" || method === "delete-index").map(async function([method, fullpath]) {
          const filepath = `${dir}/${fullpath}`;
          if (method === "delete") {
            await fs.rm(filepath);
          }
          index2.delete({ filepath: fullpath });
          if (onProgress) {
            await onProgress({
              phase: "Updating workdir",
              loaded: ++count,
              total
            });
          }
        }));
      });
      await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
        for (const [method, fullpath] of ops) {
          if (method === "rmdir" || method === "rmdir-index") {
            const filepath = `${dir}/${fullpath}`;
            try {
              if (method === "rmdir") {
                await fs.rmdir(filepath);
              }
              index2.delete({ filepath: fullpath });
              if (onProgress) {
                await onProgress({
                  phase: "Updating workdir",
                  loaded: ++count,
                  total
                });
              }
            } catch (e) {
              if (e.code === "ENOTEMPTY") {
                console.log(`Did not delete ${fullpath} because directory is not empty`);
              } else {
                throw e;
              }
            }
          }
        }
      });
      await Promise.all(ops.filter(([method]) => method === "mkdir" || method === "mkdir-index").map(async function([_, fullpath]) {
        const filepath = `${dir}/${fullpath}`;
        await fs.mkdir(filepath);
        if (onProgress) {
          await onProgress({
            phase: "Updating workdir",
            loaded: ++count,
            total
          });
        }
      }));
      if (nonBlocking) {
        const eligibleOps = ops.filter(([method]) => method === "create" || method === "create-index" || method === "update" || method === "mkdir-index");
        const updateWorkingDirResults = await batchAllSettled("Update Working Dir", eligibleOps.map(([method, fullpath, oid2, mode, chmod]) => () => updateWorkingDir({ fs, cache, gitdir, dir }, [
          method,
          fullpath,
          oid2,
          mode,
          chmod
        ])), onProgress, batchSize);
        await GitIndexManager.acquire({ fs, gitdir, cache, allowUnmerged: true }, async function(index2) {
          await batchAllSettled("Update Index", updateWorkingDirResults.map(([fullpath, oid2, stats]) => () => updateIndex({ index: index2, fullpath, oid: oid2, stats })), onProgress, batchSize);
        });
      } else {
        await GitIndexManager.acquire({ fs, gitdir, cache, allowUnmerged: true }, async function(index2) {
          await Promise.all(ops.filter(([method]) => method === "create" || method === "create-index" || method === "update" || method === "mkdir-index").map(async function([method, fullpath, oid2, mode, chmod]) {
            const filepath = `${dir}/${fullpath}`;
            try {
              if (method !== "create-index" && method !== "mkdir-index") {
                const { object } = await _readObject({
                  fs,
                  cache,
                  gitdir,
                  oid: oid2
                });
                if (chmod) {
                  await fs.rm(filepath);
                }
                if (mode === 33188) {
                  await fs.write(filepath, object);
                } else if (mode === 33261) {
                  await fs.write(filepath, object, { mode: 511 });
                } else if (mode === 40960) {
                  await fs.writelink(filepath, object);
                } else {
                  throw new InternalError(`Invalid mode 0o${mode.toString(8)} detected in blob ${oid2}`);
                }
              }
              const stats = await fs.lstat(filepath);
              if (mode === 33261) {
                stats.mode = 493;
              }
              if (method === "mkdir-index") {
                stats.mode = 57344;
              }
              index2.insert({
                filepath: fullpath,
                stats,
                oid: oid2
              });
              if (onProgress) {
                await onProgress({
                  phase: "Updating workdir",
                  loaded: ++count,
                  total
                });
              }
            } catch (e) {
              console.log(e);
            }
          }));
        });
      }
      if (onPostCheckout) {
        await onPostCheckout({
          previousHead: oldOid,
          newHead: oid,
          type: filepaths != null && filepaths.length > 0 ? "file" : "branch"
        });
      }
    }
    if (!noUpdateHead) {
      const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
      if (fullRef.startsWith("refs/heads")) {
        await GitRefManager.writeSymbolicRef({
          fs,
          gitdir,
          ref: "HEAD",
          value: fullRef
        });
      } else {
        await GitRefManager.writeRef({ fs, gitdir, ref: "HEAD", value: oid });
      }
    }
  }
  async function analyze({
    fs,
    cache,
    onProgress,
    dir,
    gitdir,
    ref,
    force,
    filepaths
  }) {
    let count = 0;
    return _walk({
      fs,
      cache,
      dir,
      gitdir,
      trees: [TREE({ ref }), WORKDIR(), STAGE()],
      map: async function(fullpath, [commit2, workdir, stage]) {
        if (fullpath === ".")
          return;
        if (filepaths && !filepaths.some((base) => worthWalking(fullpath, base))) {
          return null;
        }
        if (onProgress) {
          await onProgress({ phase: "Analyzing workdir", loaded: ++count });
        }
        const key = [!!stage, !!commit2, !!workdir].map(Number).join("");
        switch (key) {
          case "000":
            return;
          case "001":
            if (force && filepaths && filepaths.includes(fullpath)) {
              return ["delete", fullpath];
            }
            return;
          case "010": {
            switch (await commit2.type()) {
              case "tree": {
                return ["mkdir", fullpath];
              }
              case "blob": {
                return [
                  "create",
                  fullpath,
                  await commit2.oid(),
                  await commit2.mode()
                ];
              }
              case "commit": {
                return [
                  "mkdir-index",
                  fullpath,
                  await commit2.oid(),
                  await commit2.mode()
                ];
              }
              default: {
                return [
                  "error",
                  `new entry Unhandled type ${await commit2.type()}`
                ];
              }
            }
          }
          case "011": {
            switch (`${await commit2.type()}-${await workdir.type()}`) {
              case "tree-tree": {
                return;
              }
              case "tree-blob":
              case "blob-tree": {
                return ["conflict", fullpath];
              }
              case "blob-blob": {
                if (await commit2.oid() !== await workdir.oid()) {
                  if (force) {
                    return [
                      "update",
                      fullpath,
                      await commit2.oid(),
                      await commit2.mode(),
                      await commit2.mode() !== await workdir.mode()
                    ];
                  } else {
                    return ["conflict", fullpath];
                  }
                } else {
                  if (await commit2.mode() !== await workdir.mode()) {
                    if (force) {
                      return [
                        "update",
                        fullpath,
                        await commit2.oid(),
                        await commit2.mode(),
                        true
                      ];
                    } else {
                      return ["conflict", fullpath];
                    }
                  } else {
                    return [
                      "create-index",
                      fullpath,
                      await commit2.oid(),
                      await commit2.mode()
                    ];
                  }
                }
              }
              case "commit-tree": {
                return;
              }
              case "commit-blob": {
                return ["conflict", fullpath];
              }
              default: {
                return ["error", `new entry Unhandled type ${commit2.type}`];
              }
            }
          }
          case "100": {
            return ["delete-index", fullpath];
          }
          case "101": {
            switch (await stage.type()) {
              case "tree": {
                return ["rmdir-index", fullpath];
              }
              case "blob": {
                if (await stage.oid() !== await workdir.oid()) {
                  if (force) {
                    return ["delete", fullpath];
                  } else {
                    return ["conflict", fullpath];
                  }
                } else {
                  return ["delete", fullpath];
                }
              }
              case "commit": {
                return ["rmdir-index", fullpath];
              }
              default: {
                return [
                  "error",
                  `delete entry Unhandled type ${await stage.type()}`
                ];
              }
            }
          }
          case "110":
          case "111": {
            switch (`${await stage.type()}-${await commit2.type()}`) {
              case "tree-tree": {
                return;
              }
              case "blob-blob": {
                if (await stage.oid() === await commit2.oid() && await stage.mode() === await commit2.mode() && !force) {
                  return;
                }
                if (workdir) {
                  if (await workdir.oid() !== await stage.oid() && await workdir.oid() !== await commit2.oid()) {
                    if (force) {
                      return [
                        "update",
                        fullpath,
                        await commit2.oid(),
                        await commit2.mode(),
                        await commit2.mode() !== await workdir.mode()
                      ];
                    } else {
                      return ["conflict", fullpath];
                    }
                  }
                } else if (force) {
                  return [
                    "update",
                    fullpath,
                    await commit2.oid(),
                    await commit2.mode(),
                    await commit2.mode() !== await stage.mode()
                  ];
                }
                if (await commit2.mode() !== await stage.mode()) {
                  return [
                    "update",
                    fullpath,
                    await commit2.oid(),
                    await commit2.mode(),
                    true
                  ];
                }
                if (await commit2.oid() !== await stage.oid()) {
                  return [
                    "update",
                    fullpath,
                    await commit2.oid(),
                    await commit2.mode(),
                    false
                  ];
                } else {
                  return;
                }
              }
              case "tree-blob": {
                return ["update-dir-to-blob", fullpath, await commit2.oid()];
              }
              case "blob-tree": {
                return ["update-blob-to-tree", fullpath];
              }
              case "commit-commit": {
                return [
                  "mkdir-index",
                  fullpath,
                  await commit2.oid(),
                  await commit2.mode()
                ];
              }
              default: {
                return [
                  "error",
                  `update entry Unhandled type ${await stage.type()}-${await commit2.type()}`
                ];
              }
            }
          }
        }
      },
      reduce: async function(parent, children) {
        children = flat(children);
        if (!parent) {
          return children;
        } else if (parent && parent[0] === "rmdir") {
          children.push(parent);
          return children;
        } else {
          children.unshift(parent);
          return children;
        }
      }
    });
  }
  async function updateIndex({ index: index2, fullpath, stats, oid }) {
    try {
      index2.insert({
        filepath: fullpath,
        stats,
        oid
      });
    } catch (e) {
      console.warn(`Error inserting ${fullpath} into index:`, e);
    }
  }
  async function updateWorkingDir({ fs, cache, gitdir, dir }, [method, fullpath, oid, mode, chmod]) {
    const filepath = `${dir}/${fullpath}`;
    if (method !== "create-index" && method !== "mkdir-index") {
      const { object } = await _readObject({ fs, cache, gitdir, oid });
      if (chmod) {
        await fs.rm(filepath);
      }
      if (mode === 33188) {
        await fs.write(filepath, object);
      } else if (mode === 33261) {
        await fs.write(filepath, object, { mode: 511 });
      } else if (mode === 40960) {
        await fs.writelink(filepath, object);
      } else {
        throw new InternalError(`Invalid mode 0o${mode.toString(8)} detected in blob ${oid}`);
      }
    }
    const stats = await fs.lstat(filepath);
    if (mode === 33261) {
      stats.mode = 493;
    }
    if (method === "mkdir-index") {
      stats.mode = 57344;
    }
    return [fullpath, oid, stats];
  }
  async function batchAllSettled(operationName, tasks, onProgress, batchSize) {
    const results = [];
    try {
      for (let i = 0;i < tasks.length; i += batchSize) {
        const batch = tasks.slice(i, i + batchSize).map((task) => task());
        const batchResults = await Promise.allSettled(batch);
        batchResults.forEach((result) => {
          if (result.status === "fulfilled")
            results.push(result.value);
        });
        if (onProgress) {
          await onProgress({
            phase: "Updating workdir",
            loaded: i + batch.length,
            total: tasks.length
          });
        }
      }
      return results;
    } catch (error) {
      console.error(`Error during ${operationName}: ${error}`);
    }
    return results;
  }
  async function checkout({
    fs,
    onProgress,
    onPostCheckout,
    dir,
    gitdir = join5(dir, ".git"),
    remote = "origin",
    ref: _ref,
    filepaths,
    noCheckout = false,
    noUpdateHead = _ref === undefined,
    dryRun = false,
    force = false,
    track = true,
    cache = {},
    nonBlocking = false,
    batchSize = 100
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("dir", dir);
      assertParameter("gitdir", gitdir);
      const ref = _ref || "HEAD";
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _checkout({
        fs: fsp,
        cache,
        onProgress,
        onPostCheckout,
        dir,
        gitdir: updatedGitdir,
        remote,
        ref,
        filepaths,
        noCheckout,
        noUpdateHead,
        dryRun,
        force,
        track,
        nonBlocking,
        batchSize
      });
    } catch (err) {
      err.caller = "git.checkout";
      throw err;
    }
  }
  var LINEBREAKS = /^.*(\r?\n|$)/gm;
  function mergeFile({ branches, contents }) {
    const ourName = branches[1];
    const theirName = branches[2];
    const baseContent = contents[0];
    const ourContent = contents[1];
    const theirContent = contents[2];
    const ours = ourContent.match(LINEBREAKS);
    const base = baseContent.match(LINEBREAKS);
    const theirs = theirContent.match(LINEBREAKS);
    const result = diff3Merge(ours, base, theirs);
    const markerSize = 7;
    let mergedText = "";
    let cleanMerge = true;
    for (const item of result) {
      if (item.ok) {
        mergedText += item.ok.join("");
      }
      if (item.conflict) {
        cleanMerge = false;
        mergedText += `${"<".repeat(markerSize)} ${ourName}
`;
        mergedText += item.conflict.a.join("");
        mergedText += `${"=".repeat(markerSize)}
`;
        mergedText += item.conflict.b.join("");
        mergedText += `${">".repeat(markerSize)} ${theirName}
`;
      }
    }
    return { cleanMerge, mergedText };
  }
  async function mergeTree({
    fs,
    cache,
    dir,
    gitdir = join5(dir, ".git"),
    index: index2,
    ourOid,
    baseOid,
    theirOid,
    ourName = "ours",
    baseName = "base",
    theirName = "theirs",
    dryRun = false,
    abortOnConflict = true,
    mergeDriver
  }) {
    const ourTree = TREE({ ref: ourOid });
    const baseTree = TREE({ ref: baseOid });
    const theirTree = TREE({ ref: theirOid });
    const unmergedFiles = [];
    const bothModified = [];
    const deleteByUs = [];
    const deleteByTheirs = [];
    const results = await _walk({
      fs,
      cache,
      dir,
      gitdir,
      trees: [ourTree, baseTree, theirTree],
      map: async function(filepath, [ours, base, theirs]) {
        const path2 = basename(filepath);
        const ourChange = await modified(ours, base);
        const theirChange = await modified(theirs, base);
        switch (`${ourChange}-${theirChange}`) {
          case "false-false": {
            return {
              mode: await base.mode(),
              path: path2,
              oid: await base.oid(),
              type: await base.type()
            };
          }
          case "false-true": {
            if (!theirs && await ours.type() === "tree") {
              return {
                mode: await ours.mode(),
                path: path2,
                oid: await ours.oid(),
                type: await ours.type()
              };
            }
            return theirs ? {
              mode: await theirs.mode(),
              path: path2,
              oid: await theirs.oid(),
              type: await theirs.type()
            } : undefined;
          }
          case "true-false": {
            if (!ours && await theirs.type() === "tree") {
              return {
                mode: await theirs.mode(),
                path: path2,
                oid: await theirs.oid(),
                type: await theirs.type()
              };
            }
            return ours ? {
              mode: await ours.mode(),
              path: path2,
              oid: await ours.oid(),
              type: await ours.type()
            } : undefined;
          }
          case "true-true": {
            if (ours && theirs && await ours.type() === "tree" && await theirs.type() === "tree") {
              return {
                mode: await ours.mode(),
                path: path2,
                oid: await ours.oid(),
                type: "tree"
              };
            }
            if (ours && theirs && await ours.type() === "blob" && await theirs.type() === "blob") {
              return mergeBlobs({
                fs,
                gitdir,
                path: path2,
                ours,
                base,
                theirs,
                ourName,
                baseName,
                theirName,
                mergeDriver
              }).then(async (r) => {
                if (!r.cleanMerge) {
                  unmergedFiles.push(filepath);
                  bothModified.push(filepath);
                  if (!abortOnConflict) {
                    let baseOid2 = "";
                    if (base && await base.type() === "blob") {
                      baseOid2 = await base.oid();
                    }
                    const ourOid2 = await ours.oid();
                    const theirOid2 = await theirs.oid();
                    index2.delete({ filepath });
                    if (baseOid2) {
                      index2.insert({ filepath, oid: baseOid2, stage: 1 });
                    }
                    index2.insert({ filepath, oid: ourOid2, stage: 2 });
                    index2.insert({ filepath, oid: theirOid2, stage: 3 });
                  }
                } else if (!abortOnConflict) {
                  index2.insert({ filepath, oid: r.mergeResult.oid, stage: 0 });
                }
                return r.mergeResult;
              });
            }
            if (base && !ours && theirs && await base.type() === "blob" && await theirs.type() === "blob") {
              unmergedFiles.push(filepath);
              deleteByUs.push(filepath);
              if (!abortOnConflict) {
                const baseOid2 = await base.oid();
                const theirOid2 = await theirs.oid();
                index2.delete({ filepath });
                index2.insert({ filepath, oid: baseOid2, stage: 1 });
                index2.insert({ filepath, oid: theirOid2, stage: 3 });
              }
              return {
                mode: await theirs.mode(),
                oid: await theirs.oid(),
                type: "blob",
                path: path2
              };
            }
            if (base && ours && !theirs && await base.type() === "blob" && await ours.type() === "blob") {
              unmergedFiles.push(filepath);
              deleteByTheirs.push(filepath);
              if (!abortOnConflict) {
                const baseOid2 = await base.oid();
                const ourOid2 = await ours.oid();
                index2.delete({ filepath });
                index2.insert({ filepath, oid: baseOid2, stage: 1 });
                index2.insert({ filepath, oid: ourOid2, stage: 2 });
              }
              return {
                mode: await ours.mode(),
                oid: await ours.oid(),
                type: "blob",
                path: path2
              };
            }
            if (base && !ours && !theirs && (await base.type() === "blob" || await base.type() === "tree")) {
              return;
            }
            throw new MergeNotSupportedError;
          }
        }
      },
      reduce: unmergedFiles.length !== 0 && (!dir || abortOnConflict) ? undefined : async (parent, children) => {
        const entries = children.filter(Boolean);
        if (!parent)
          return;
        if (parent && parent.type === "tree" && entries.length === 0 && parent.path !== ".")
          return;
        if (entries.length > 0 || parent.path === "." && entries.length === 0) {
          const tree = new GitTree(entries);
          const object = tree.toObject();
          const oid = await _writeObject({
            fs,
            gitdir,
            type: "tree",
            object,
            dryRun
          });
          parent.oid = oid;
        }
        return parent;
      }
    });
    if (unmergedFiles.length !== 0) {
      if (dir && !abortOnConflict) {
        await _walk({
          fs,
          cache,
          dir,
          gitdir,
          trees: [TREE({ ref: results.oid })],
          map: async function(filepath, [entry]) {
            const path2 = `${dir}/${filepath}`;
            if (await entry.type() === "blob") {
              const mode = await entry.mode();
              const content = new TextDecoder().decode(await entry.content());
              await fs.write(path2, content, { mode });
            }
            return true;
          }
        });
      }
      return new MergeConflictError(unmergedFiles, bothModified, deleteByUs, deleteByTheirs);
    }
    return results.oid;
  }
  async function mergeBlobs({
    fs,
    gitdir,
    path: path2,
    ours,
    base,
    theirs,
    ourName,
    theirName,
    baseName,
    dryRun,
    mergeDriver = mergeFile
  }) {
    const type = "blob";
    let baseMode = "100755";
    let baseOid = "";
    let baseContent = "";
    if (base && await base.type() === "blob") {
      baseMode = await base.mode();
      baseOid = await base.oid();
      baseContent = Buffer.from(await base.content()).toString("utf8");
    }
    const mode = baseMode === await ours.mode() ? await theirs.mode() : await ours.mode();
    if (await ours.oid() === await theirs.oid()) {
      return {
        cleanMerge: true,
        mergeResult: { mode, path: path2, oid: await ours.oid(), type }
      };
    }
    if (await ours.oid() === baseOid) {
      return {
        cleanMerge: true,
        mergeResult: { mode, path: path2, oid: await theirs.oid(), type }
      };
    }
    if (await theirs.oid() === baseOid) {
      return {
        cleanMerge: true,
        mergeResult: { mode, path: path2, oid: await ours.oid(), type }
      };
    }
    const ourContent = Buffer.from(await ours.content()).toString("utf8");
    const theirContent = Buffer.from(await theirs.content()).toString("utf8");
    const { mergedText, cleanMerge } = await mergeDriver({
      branches: [baseName, ourName, theirName],
      contents: [baseContent, ourContent, theirContent],
      path: path2
    });
    const oid = await _writeObject({
      fs,
      gitdir,
      type: "blob",
      object: Buffer.from(mergedText, "utf8"),
      dryRun
    });
    return { cleanMerge, mergeResult: { mode, path: path2, oid, type } };
  }
  var _TreeMap = {
    stage: STAGE,
    workdir: WORKDIR
  };
  var lock$2;
  async function acquireLock$1(ref, callback) {
    if (lock$2 === undefined)
      lock$2 = new AsyncLock;
    return lock$2.acquire(ref, callback);
  }
  async function checkAndWriteBlob(fs, gitdir, dir, filepath, oid = null) {
    const currentFilepath = join5(dir, filepath);
    const stats = await fs.lstat(currentFilepath);
    if (!stats)
      throw new NotFoundError(currentFilepath);
    if (stats.isDirectory())
      throw new InternalError(`${currentFilepath}: file expected, but found directory`);
    const objContent = oid ? await readObjectLoose({ fs, gitdir, oid }) : undefined;
    let retOid = objContent ? oid : undefined;
    if (!objContent) {
      await acquireLock$1({ fs, gitdir, currentFilepath }, async () => {
        const object = stats.isSymbolicLink() ? await fs.readlink(currentFilepath).then(posixifyPathBuffer) : await fs.read(currentFilepath);
        if (object === null)
          throw new NotFoundError(currentFilepath);
        retOid = await _writeObject({ fs, gitdir, type: "blob", object });
      });
    }
    return retOid;
  }
  async function processTreeEntries({ fs, dir, gitdir, entries }) {
    async function processTreeEntry(entry) {
      if (entry.type === "tree") {
        if (!entry.oid) {
          const children = await Promise.all(entry.children.map(processTreeEntry));
          entry.oid = await _writeTree({
            fs,
            gitdir,
            tree: children
          });
          entry.mode = 16384;
        }
      } else if (entry.type === "blob") {
        entry.oid = await checkAndWriteBlob(fs, gitdir, dir, entry.path, entry.oid);
        entry.mode = 33188;
      }
      entry.path = entry.path.split("/").pop();
      return entry;
    }
    return Promise.all(entries.map(processTreeEntry));
  }
  async function writeTreeChanges({
    fs,
    dir,
    gitdir,
    treePair
  }) {
    const isStage = treePair[1] === "stage";
    const trees = treePair.map((t) => typeof t === "string" ? _TreeMap[t]() : t);
    const changedEntries = [];
    const map = async (filepath, [head, stage]) => {
      if (filepath === "." || await GitIgnoreManager.isIgnored({ fs, dir, gitdir, filepath })) {
        return;
      }
      if (stage) {
        if (!head || await head.oid() !== await stage.oid() && await stage.oid() !== undefined) {
          changedEntries.push([head, stage]);
        }
        return {
          mode: await stage.mode(),
          path: filepath,
          oid: await stage.oid(),
          type: await stage.type()
        };
      }
    };
    const reduce = async (parent, children) => {
      children = children.filter(Boolean);
      if (!parent) {
        return children.length > 0 ? children : undefined;
      } else {
        parent.children = children;
        return parent;
      }
    };
    const iterate = async (walk2, children) => {
      const filtered = [];
      for (const child of children) {
        const [head, stage] = child;
        if (isStage) {
          if (stage) {
            if (await fs.exists(`${dir}/${stage.toString()}`)) {
              filtered.push(child);
            } else {
              changedEntries.push([null, stage]);
            }
          }
        } else if (head) {
          if (!stage) {
            changedEntries.push([head, null]);
          } else {
            filtered.push(child);
          }
        }
      }
      return filtered.length ? Promise.all(filtered.map(walk2)) : [];
    };
    const entries = await _walk({
      fs,
      cache: {},
      dir,
      gitdir,
      trees,
      map,
      reduce,
      iterate
    });
    if (changedEntries.length === 0 || entries.length === 0) {
      return null;
    }
    const processedEntries = await processTreeEntries({
      fs,
      dir,
      gitdir,
      entries
    });
    const treeEntries = processedEntries.filter(Boolean).map((entry) => ({
      mode: entry.mode,
      path: entry.path,
      oid: entry.oid,
      type: entry.type
    }));
    return _writeTree({ fs, gitdir, tree: treeEntries });
  }
  async function applyTreeChanges({
    fs,
    dir,
    gitdir,
    stashCommit,
    parentCommit,
    wasStaged
  }) {
    const dirRemoved = [];
    const stageUpdated = [];
    const ops = await _walk({
      fs,
      cache: {},
      dir,
      gitdir,
      trees: [TREE({ ref: parentCommit }), TREE({ ref: stashCommit })],
      map: async (filepath, [parent, stash2]) => {
        if (filepath === "." || await GitIgnoreManager.isIgnored({ fs, dir, gitdir, filepath })) {
          return;
        }
        const type = stash2 ? await stash2.type() : await parent.type();
        if (type !== "tree" && type !== "blob") {
          return;
        }
        if (!stash2 && parent) {
          const method = type === "tree" ? "rmdir" : "rm";
          if (type === "tree")
            dirRemoved.push(filepath);
          if (type === "blob" && wasStaged)
            stageUpdated.push({ filepath, oid: await parent.oid() });
          return { method, filepath };
        }
        const oid = await stash2.oid();
        if (!parent || await parent.oid() !== oid) {
          if (type === "tree") {
            return { method: "mkdir", filepath };
          } else {
            if (wasStaged)
              stageUpdated.push({
                filepath,
                oid,
                stats: await fs.lstat(join5(dir, filepath))
              });
            return {
              method: "write",
              filepath,
              oid
            };
          }
        }
      }
    });
    await acquireLock$1({ fs, gitdir, dirRemoved, ops }, async () => {
      for (const op of ops) {
        const currentFilepath = join5(dir, op.filepath);
        switch (op.method) {
          case "rmdir":
            await fs.rmdir(currentFilepath);
            break;
          case "mkdir":
            await fs.mkdir(currentFilepath);
            break;
          case "rm":
            await fs.rm(currentFilepath);
            break;
          case "write":
            if (!dirRemoved.some((removedDir) => currentFilepath.startsWith(removedDir))) {
              const { object } = await _readObject({
                fs,
                cache: {},
                gitdir,
                oid: op.oid
              });
              if (await fs.exists(currentFilepath)) {
                await fs.rm(currentFilepath);
              }
              await fs.write(currentFilepath, object);
            }
            break;
        }
      }
    });
    await GitIndexManager.acquire({ fs, gitdir, cache: {} }, async (index2) => {
      stageUpdated.forEach(({ filepath, stats, oid }) => {
        index2.insert({ filepath, stats, oid });
      });
    });
  }
  async function _cherryPick({
    fs,
    cache,
    dir,
    gitdir,
    oid,
    dryRun = false,
    noUpdateBranch = false,
    abortOnConflict = true,
    committer,
    mergeDriver
  }) {
    const { commit: cherryCommit, oid: cherryOid } = await _readCommit({
      fs,
      cache,
      gitdir,
      oid
    });
    if (cherryCommit.parent.length > 1) {
      throw new CherryPickMergeCommitError(cherryOid, cherryCommit.parent.length);
    }
    if (cherryCommit.parent.length === 0) {
      throw new CherryPickRootCommitError(cherryOid);
    }
    const currentOid = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: "HEAD"
    });
    const { commit: currentCommit } = await _readCommit({
      fs,
      cache,
      gitdir,
      oid: currentOid
    });
    const cherryParentOid = cherryCommit.parent[0];
    const { commit: cherryParent } = await _readCommit({
      fs,
      cache,
      gitdir,
      oid: cherryParentOid
    });
    const mergedTreeOid = await GitIndexManager.acquire({ fs, gitdir, cache, allowUnmerged: false }, async (index2) => {
      return mergeTree({
        fs,
        cache,
        dir,
        gitdir,
        index: index2,
        ourOid: currentCommit.tree,
        baseOid: cherryParent.tree,
        theirOid: cherryCommit.tree,
        ourName: "HEAD",
        baseName: `parent of ${cherryOid.slice(0, 7)}`,
        theirName: cherryOid.slice(0, 7),
        dryRun,
        abortOnConflict,
        mergeDriver
      });
    });
    if (mergedTreeOid instanceof MergeConflictError) {
      throw mergedTreeOid;
    }
    const newOid = await _commit({
      fs,
      cache,
      gitdir,
      message: cherryCommit.message,
      tree: mergedTreeOid,
      parent: [currentOid],
      author: cherryCommit.author,
      committer,
      dryRun,
      noUpdateBranch
    });
    if (dir && !dryRun && !noUpdateBranch) {
      await applyTreeChanges({
        fs,
        dir,
        gitdir,
        stashCommit: newOid,
        parentCommit: currentOid,
        wasStaged: true
      });
    }
    return newOid;
  }
  async function cherryPick({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    cache = {},
    committer,
    dryRun = false,
    noUpdateBranch = false,
    abortOnConflict = true,
    mergeDriver
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const { commit: cherryCommit } = await _readCommit({
        fs,
        cache,
        gitdir: updatedGitdir,
        oid
      });
      if (cherryCommit.parent && cherryCommit.parent.length > 1) {
        return await _cherryPick({
          fs,
          cache,
          dir,
          gitdir: updatedGitdir,
          oid,
          dryRun,
          noUpdateBranch,
          abortOnConflict,
          committer: undefined,
          mergeDriver
        });
      }
      const normalizedCommitter = await normalizeCommitterObject({
        fs,
        gitdir: updatedGitdir,
        committer
      });
      if (!normalizedCommitter) {
        throw new MissingNameError("committer");
      }
      return await _cherryPick({
        fs,
        cache,
        dir,
        gitdir: updatedGitdir,
        oid,
        dryRun,
        noUpdateBranch,
        abortOnConflict,
        committer: normalizedCommitter,
        mergeDriver
      });
    } catch (err) {
      err.caller = "git.cherryPick";
      throw err;
    }
  }
  var abbreviateRx = /^refs\/(heads\/|tags\/|remotes\/)?(.*)/;
  function abbreviateRef(ref) {
    const match = abbreviateRx.exec(ref);
    if (match) {
      if (match[1] === "remotes/" && ref.endsWith("/HEAD")) {
        return match[2].slice(0, -5);
      } else {
        return match[2];
      }
    }
    return ref;
  }
  async function _currentBranch({
    fs,
    gitdir,
    fullname = false,
    test = false
  }) {
    const ref = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: "HEAD",
      depth: 2
    });
    if (test) {
      try {
        await GitRefManager.resolve({ fs, gitdir, ref });
      } catch (_) {
        return;
      }
    }
    if (!ref.startsWith("refs/"))
      return;
    return fullname ? ref : abbreviateRef(ref);
  }
  function translateSSHtoHTTP(url) {
    url = url.replace(/^git@([^:]+):/, "https://$1/");
    url = url.replace(/^ssh:\/\//, "https://");
    return url;
  }
  function calculateBasicAuthHeader({ username = "", password = "" }) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }
  async function forAwait(iterable, cb) {
    const iter = getIterator(iterable);
    while (true) {
      const { value, done } = await iter.next();
      if (value)
        await cb(value);
      if (done)
        break;
    }
    if (iter.return)
      iter.return();
  }
  async function collect(iterable) {
    let size = 0;
    const buffers = [];
    await forAwait(iterable, (value) => {
      buffers.push(value);
      size += value.byteLength;
    });
    const result = new Uint8Array(size);
    let nextIndex = 0;
    for (const buffer of buffers) {
      result.set(buffer, nextIndex);
      nextIndex += buffer.byteLength;
    }
    return result;
  }
  function extractAuthFromUrl(url) {
    let userpass = url.match(/^https?:\/\/([^/]+)@/);
    if (userpass == null)
      return { url, auth: {} };
    userpass = userpass[1];
    const [username, password] = userpass.split(":");
    url = url.replace(`${userpass}@`, "");
    return { url, auth: { username, password } };
  }
  function padHex(b, n) {
    const s = n.toString(16);
    return "0".repeat(b - s.length) + s;
  }

  class GitPktLine {
    static flush() {
      return Buffer.from("0000", "utf8");
    }
    static delim() {
      return Buffer.from("0001", "utf8");
    }
    static encode(line) {
      if (typeof line === "string") {
        line = Buffer.from(line);
      }
      const length = line.length + 4;
      const hexlength = padHex(4, length);
      return Buffer.concat([Buffer.from(hexlength, "utf8"), line]);
    }
    static streamReader(stream) {
      const reader = new StreamReader(stream);
      return async function read() {
        try {
          let length = await reader.read(4);
          if (length == null)
            return true;
          length = parseInt(length.toString("utf8"), 16);
          if (length === 0)
            return null;
          if (length === 1)
            return null;
          const buffer = await reader.read(length - 4);
          if (buffer == null)
            return true;
          return buffer;
        } catch (err) {
          stream.error = err;
          return true;
        }
      };
    }
  }
  async function parseCapabilitiesV2(read) {
    const capabilities2 = {};
    let line;
    while (true) {
      line = await read();
      if (line === true)
        break;
      if (line === null)
        continue;
      line = line.toString("utf8").replace(/\n$/, "");
      const i = line.indexOf("=");
      if (i > -1) {
        const key = line.slice(0, i);
        const value = line.slice(i + 1);
        capabilities2[key] = value;
      } else {
        capabilities2[line] = true;
      }
    }
    return { protocolVersion: 2, capabilities2 };
  }
  async function parseRefsAdResponse(stream, { service }) {
    const capabilities = new Set;
    const refs = new Map;
    const symrefs = new Map;
    const read = GitPktLine.streamReader(stream);
    let lineOne = await read();
    while (lineOne === null)
      lineOne = await read();
    if (lineOne === true)
      throw new EmptyServerResponseError;
    if (lineOne.includes("version 2")) {
      return parseCapabilitiesV2(read);
    }
    if (lineOne.toString("utf8").replace(/\n$/, "") !== `# service=${service}`) {
      throw new ParseError(`# service=${service}\\n`, lineOne.toString("utf8"));
    }
    let lineTwo = await read();
    while (lineTwo === null)
      lineTwo = await read();
    if (lineTwo === true)
      return { capabilities, refs, symrefs };
    lineTwo = lineTwo.toString("utf8");
    if (lineTwo.includes("version 2")) {
      return parseCapabilitiesV2(read);
    }
    const [firstRef, capabilitiesLine] = splitAndAssert(lineTwo, "\x00", "\\x00");
    capabilitiesLine.split(" ").map((x) => capabilities.add(x));
    if (firstRef !== "0000000000000000000000000000000000000000 capabilities^{}") {
      const [ref, name] = splitAndAssert(firstRef, " ", " ");
      refs.set(name, ref);
      while (true) {
        const line = await read();
        if (line === true)
          break;
        if (line !== null) {
          const [ref2, name2] = splitAndAssert(line.toString("utf8"), " ", " ");
          refs.set(name2, ref2);
        }
      }
    }
    for (const cap of capabilities) {
      if (cap.startsWith("symref=")) {
        const m = cap.match(/symref=([^:]+):(.*)/);
        if (m.length === 3) {
          symrefs.set(m[1], m[2]);
        }
      }
    }
    return { protocolVersion: 1, capabilities, refs, symrefs };
  }
  function splitAndAssert(line, sep, expected) {
    const split = line.trim().split(sep);
    if (split.length !== 2) {
      throw new ParseError(`Two strings separated by '${expected}'`, line.toString("utf8"));
    }
    return split;
  }
  var corsProxify = (corsProxy, url) => corsProxy.endsWith("?") ? `${corsProxy}${url}` : `${corsProxy}/${url.replace(/^https?:\/\//, "")}`;
  var updateHeaders = (headers, auth) => {
    if (auth.username || auth.password) {
      headers.Authorization = calculateBasicAuthHeader(auth);
    }
    if (auth.headers) {
      Object.assign(headers, auth.headers);
    }
  };
  var stringifyBody = async (res) => {
    try {
      const data = Buffer.from(await collect(res.body));
      const response = data.toString("utf8");
      const preview = response.length < 256 ? response : response.slice(0, 256) + "...";
      return { preview, response, data };
    } catch (e) {
      return {};
    }
  };

  class GitRemoteHTTP {
    static async capabilities() {
      return ["discover", "connect"];
    }
    static async discover({
      http,
      onProgress,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service,
      url: _origUrl,
      headers,
      protocolVersion
    }) {
      let { url, auth } = extractAuthFromUrl(_origUrl);
      const proxifiedURL = corsProxy ? corsProxify(corsProxy, url) : url;
      if (auth.username || auth.password) {
        headers.Authorization = calculateBasicAuthHeader(auth);
      }
      if (protocolVersion === 2) {
        headers["Git-Protocol"] = "version=2";
      }
      let res;
      let tryAgain;
      let providedAuthBefore = false;
      do {
        res = await http.request({
          onProgress,
          method: "GET",
          url: `${proxifiedURL}/info/refs?service=${service}`,
          headers
        });
        tryAgain = false;
        if (res.statusCode === 401 || res.statusCode === 203) {
          const getAuth = providedAuthBefore ? onAuthFailure : onAuth;
          if (getAuth) {
            auth = await getAuth(url, {
              ...auth,
              headers: { ...headers }
            });
            if (auth && auth.cancel) {
              throw new UserCanceledError;
            } else if (auth) {
              updateHeaders(headers, auth);
              providedAuthBefore = true;
              tryAgain = true;
            }
          }
        } else if (res.statusCode === 200 && providedAuthBefore && onAuthSuccess) {
          await onAuthSuccess(url, auth);
        }
      } while (tryAgain);
      if (res.statusCode !== 200) {
        const { response } = await stringifyBody(res);
        throw new HttpError(res.statusCode, res.statusMessage, response);
      }
      if (res.headers["content-type"] === `application/x-${service}-advertisement`) {
        const remoteHTTP = await parseRefsAdResponse(res.body, { service });
        remoteHTTP.auth = auth;
        return remoteHTTP;
      } else {
        const { preview, response, data } = await stringifyBody(res);
        try {
          const remoteHTTP = await parseRefsAdResponse([data], { service });
          remoteHTTP.auth = auth;
          return remoteHTTP;
        } catch (e) {
          throw new SmartHttpError(preview, response);
        }
      }
    }
    static async connect({
      http,
      onProgress,
      corsProxy,
      service,
      url,
      auth,
      body,
      headers
    }) {
      const urlAuth = extractAuthFromUrl(url);
      if (urlAuth)
        url = urlAuth.url;
      if (corsProxy)
        url = corsProxify(corsProxy, url);
      headers["content-type"] = `application/x-${service}-request`;
      headers.accept = `application/x-${service}-result`;
      updateHeaders(headers, auth);
      const res = await http.request({
        onProgress,
        method: "POST",
        url: `${url}/${service}`,
        body,
        headers
      });
      if (res.statusCode !== 200) {
        const { response } = stringifyBody(res);
        throw new HttpError(res.statusCode, res.statusMessage, response);
      }
      return res;
    }
  }

  class GitRemoteManager {
    static getRemoteHelperFor({ url }) {
      const remoteHelpers = new Map;
      remoteHelpers.set("http", GitRemoteHTTP);
      remoteHelpers.set("https", GitRemoteHTTP);
      const parts = parseRemoteUrl({ url });
      if (!parts) {
        throw new UrlParseError(url);
      }
      if (remoteHelpers.has(parts.transport)) {
        return remoteHelpers.get(parts.transport);
      }
      throw new UnknownTransportError(url, parts.transport, parts.transport === "ssh" ? translateSSHtoHTTP(url) : undefined);
    }
  }
  function parseRemoteUrl({ url }) {
    if (url.startsWith("git@")) {
      return {
        transport: "ssh",
        address: url
      };
    }
    const matches = url.match(/(\w+)(:\/\/|::)(.*)/);
    if (matches === null)
      return;
    if (matches[2] === "://") {
      return {
        transport: matches[1],
        address: matches[0]
      };
    }
    if (matches[2] === "::") {
      return {
        transport: matches[1],
        address: matches[3]
      };
    }
  }
  var lock$3 = null;

  class GitShallowManager {
    static async read({ fs, gitdir }) {
      if (lock$3 === null)
        lock$3 = new AsyncLock;
      const filepath = join5(gitdir, "shallow");
      const oids = new Set;
      await lock$3.acquire(filepath, async function() {
        const text = await fs.read(filepath, { encoding: "utf8" });
        if (text === null)
          return oids;
        if (text.trim() === "")
          return oids;
        text.trim().split(`
`).map((oid) => oids.add(oid));
      });
      return oids;
    }
    static async write({ fs, gitdir, oids }) {
      if (lock$3 === null)
        lock$3 = new AsyncLock;
      const filepath = join5(gitdir, "shallow");
      if (oids.size > 0) {
        const text = [...oids].join(`
`) + `
`;
        await lock$3.acquire(filepath, async function() {
          await fs.write(filepath, text, {
            encoding: "utf8"
          });
        });
      } else {
        await lock$3.acquire(filepath, async function() {
          await fs.rm(filepath);
        });
      }
    }
  }
  async function hasObjectLoose({ fs, gitdir, oid }) {
    const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
    return fs.exists(`${gitdir}/${source}`);
  }
  async function hasObjectPacked({
    fs,
    cache,
    gitdir,
    oid,
    getExternalRefDelta
  }) {
    let list = await fs.readdir(join5(gitdir, "objects/pack"));
    list = list.filter((x) => x.endsWith(".idx"));
    for (const filename of list) {
      const indexFile = `${gitdir}/objects/pack/${filename}`;
      const p = await readPackIndex({
        fs,
        cache,
        filename: indexFile,
        getExternalRefDelta
      });
      if (p.error)
        throw new InternalError(p.error);
      if (p.offsets.has(oid)) {
        return true;
      }
    }
    return false;
  }
  async function hasObject({
    fs,
    cache,
    gitdir,
    oid,
    format = "content"
  }) {
    const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
    let result = await hasObjectLoose({ fs, gitdir, oid });
    if (!result) {
      result = await hasObjectPacked({
        fs,
        cache,
        gitdir,
        oid,
        getExternalRefDelta
      });
    }
    return result;
  }
  function emptyPackfile(pack) {
    const pheader = "5041434b";
    const version2 = "00000002";
    const obCount = "00000000";
    const header = pheader + version2 + obCount;
    return pack.slice(0, 12).toString("hex") === header;
  }
  function filterCapabilities(server, client) {
    const serverNames = server.map((cap) => cap.split("=", 1)[0]);
    return client.filter((cap) => {
      const name = cap.split("=", 1)[0];
      return serverNames.includes(name);
    });
  }
  var pkg = {
    name: "isomorphic-git",
    version: "1.37.2",
    agent: "git/isomorphic-git@1.37.2"
  };

  class FIFO {
    constructor() {
      this._queue = [];
    }
    write(chunk) {
      if (this._ended) {
        throw Error("You cannot write to a FIFO that has already been ended!");
      }
      if (this._waiting) {
        const resolve3 = this._waiting;
        this._waiting = null;
        resolve3({ value: chunk });
      } else {
        this._queue.push(chunk);
      }
    }
    end() {
      this._ended = true;
      if (this._waiting) {
        const resolve3 = this._waiting;
        this._waiting = null;
        resolve3({ done: true });
      }
    }
    destroy(err) {
      this.error = err;
      this.end();
    }
    async next() {
      if (this._queue.length > 0) {
        return { value: this._queue.shift() };
      }
      if (this._ended) {
        return { done: true };
      }
      if (this._waiting) {
        throw Error("You cannot call read until the previous call to read has returned!");
      }
      return new Promise((resolve3) => {
        this._waiting = resolve3;
      });
    }
  }
  function findSplit(str) {
    const r = str.indexOf("\r");
    const n = str.indexOf(`
`);
    if (r === -1 && n === -1)
      return -1;
    if (r === -1)
      return n + 1;
    if (n === -1)
      return r + 1;
    if (n === r + 1)
      return n + 1;
    return Math.min(r, n) + 1;
  }
  function splitLines(input) {
    const output = new FIFO;
    let tmp = "";
    (async () => {
      await forAwait(input, (chunk) => {
        chunk = chunk.toString("utf8");
        tmp += chunk;
        while (true) {
          const i = findSplit(tmp);
          if (i === -1)
            break;
          output.write(tmp.slice(0, i));
          tmp = tmp.slice(i);
        }
      });
      if (tmp.length > 0) {
        output.write(tmp);
      }
      output.end();
    })();
    return output;
  }

  class GitSideBand {
    static demux(input) {
      const read = GitPktLine.streamReader(input);
      const packetlines = new FIFO;
      const packfile = new FIFO;
      const progress = new FIFO;
      const nextBit = async function() {
        const line = await read();
        if (line === null)
          return nextBit();
        if (line === true) {
          packetlines.end();
          progress.end();
          input.error ? packfile.destroy(input.error) : packfile.end();
          return;
        }
        switch (line[0]) {
          case 1: {
            packfile.write(line.slice(1));
            break;
          }
          case 2: {
            progress.write(line.slice(1));
            break;
          }
          case 3: {
            const error = line.slice(1);
            progress.write(error);
            packetlines.end();
            progress.end();
            packfile.destroy(new Error(error.toString("utf8")));
            return;
          }
          default: {
            packetlines.write(line);
          }
        }
        nextBit();
      };
      nextBit();
      return {
        packetlines,
        packfile,
        progress
      };
    }
  }
  async function parseUploadPackResponse(stream) {
    const { packetlines, packfile, progress } = GitSideBand.demux(stream);
    const shallows = [];
    const unshallows = [];
    const acks = [];
    let nak = false;
    let done = false;
    return new Promise((resolve3, reject) => {
      forAwait(packetlines, (data) => {
        const line = data.toString("utf8").trim();
        if (line.startsWith("shallow")) {
          const oid = line.slice(-41).trim();
          if (oid.length !== 40) {
            reject(new InvalidOidError(oid));
          }
          shallows.push(oid);
        } else if (line.startsWith("unshallow")) {
          const oid = line.slice(-41).trim();
          if (oid.length !== 40) {
            reject(new InvalidOidError(oid));
          }
          unshallows.push(oid);
        } else if (line.startsWith("ACK")) {
          const [, oid, status2] = line.split(" ");
          acks.push({ oid, status: status2 });
          if (!status2)
            done = true;
        } else if (line.startsWith("NAK")) {
          nak = true;
          done = true;
        } else {
          done = true;
          nak = true;
        }
        if (done) {
          stream.error ? reject(stream.error) : resolve3({ shallows, unshallows, acks, nak, packfile, progress });
        }
      }).finally(() => {
        if (!done) {
          stream.error ? reject(stream.error) : resolve3({ shallows, unshallows, acks, nak, packfile, progress });
        }
      });
    });
  }
  function writeUploadPackRequest({
    capabilities = [],
    wants = [],
    haves = [],
    shallows = [],
    depth = null,
    since = null,
    exclude = []
  }) {
    const packstream = [];
    wants = [...new Set(wants)];
    let firstLineCapabilities = ` ${capabilities.join(" ")}`;
    for (const oid of wants) {
      packstream.push(GitPktLine.encode(`want ${oid}${firstLineCapabilities}
`));
      firstLineCapabilities = "";
    }
    for (const oid of shallows) {
      packstream.push(GitPktLine.encode(`shallow ${oid}
`));
    }
    if (depth !== null) {
      packstream.push(GitPktLine.encode(`deepen ${depth}
`));
    }
    if (since !== null) {
      packstream.push(GitPktLine.encode(`deepen-since ${Math.floor(since.valueOf() / 1000)}
`));
    }
    for (const oid of exclude) {
      packstream.push(GitPktLine.encode(`deepen-not ${oid}
`));
    }
    packstream.push(GitPktLine.flush());
    for (const oid of haves) {
      packstream.push(GitPktLine.encode(`have ${oid}
`));
    }
    packstream.push(GitPktLine.encode(`done
`));
    return packstream;
  }
  async function _fetch({
    fs,
    cache,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    gitdir,
    ref: _ref,
    remoteRef: _remoteRef,
    remote: _remote,
    url: _url,
    corsProxy,
    depth = null,
    since = null,
    exclude = [],
    relative = false,
    tags = false,
    singleBranch = false,
    headers = {},
    prune = false,
    pruneTags = false
  }) {
    const ref = _ref || await _currentBranch({ fs, gitdir, test: true });
    const config = await GitConfigManager.get({ fs, gitdir });
    const remote = _remote || ref && await config.get(`branch.${ref}.remote`) || "origin";
    const url = _url || await config.get(`remote.${remote}.url`);
    if (typeof url === "undefined") {
      throw new MissingParameterError("remote OR url");
    }
    const remoteRef = _remoteRef || ref && await config.get(`branch.${ref}.merge`) || _ref || "HEAD";
    if (corsProxy === undefined) {
      corsProxy = await config.get("http.corsProxy");
    }
    const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
    const remoteHTTP = await GitRemoteHTTP2.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: "git-upload-pack",
      url,
      headers,
      protocolVersion: 1
    });
    const auth = remoteHTTP.auth;
    const remoteRefs = remoteHTTP.refs;
    if (remoteRefs.size === 0) {
      return {
        defaultBranch: null,
        fetchHead: null,
        fetchHeadDescription: null
      };
    }
    if (depth !== null && !remoteHTTP.capabilities.has("shallow")) {
      throw new RemoteCapabilityError("shallow", "depth");
    }
    if (since !== null && !remoteHTTP.capabilities.has("deepen-since")) {
      throw new RemoteCapabilityError("deepen-since", "since");
    }
    if (exclude.length > 0 && !remoteHTTP.capabilities.has("deepen-not")) {
      throw new RemoteCapabilityError("deepen-not", "exclude");
    }
    if (relative === true && !remoteHTTP.capabilities.has("deepen-relative")) {
      throw new RemoteCapabilityError("deepen-relative", "relative");
    }
    const { oid, fullref } = GitRefManager.resolveAgainstMap({
      ref: remoteRef,
      map: remoteRefs
    });
    for (const remoteRef2 of remoteRefs.keys()) {
      if (remoteRef2 === fullref || remoteRef2 === "HEAD" || remoteRef2.startsWith("refs/heads/") || tags && remoteRef2.startsWith("refs/tags/")) {
        continue;
      }
      remoteRefs.delete(remoteRef2);
    }
    const capabilities = filterCapabilities([...remoteHTTP.capabilities], [
      "multi_ack_detailed",
      "no-done",
      "side-band-64k",
      "ofs-delta",
      `agent=${pkg.agent}`
    ]);
    if (relative)
      capabilities.push("deepen-relative");
    const wants = singleBranch ? [oid] : remoteRefs.values();
    const haveRefs = singleBranch ? [ref] : await GitRefManager.listRefs({
      fs,
      gitdir,
      filepath: `refs`
    });
    let haves = [];
    for (let ref2 of haveRefs) {
      try {
        ref2 = await GitRefManager.expand({ fs, gitdir, ref: ref2 });
        const oid2 = await GitRefManager.resolve({ fs, gitdir, ref: ref2 });
        if (await hasObject({ fs, cache, gitdir, oid: oid2 })) {
          haves.push(oid2);
        }
      } catch (err) {}
    }
    haves = [...new Set(haves)];
    const oids = await GitShallowManager.read({ fs, gitdir });
    const shallows = remoteHTTP.capabilities.has("shallow") ? [...oids] : [];
    const packstream = writeUploadPackRequest({
      capabilities,
      wants,
      haves,
      shallows,
      depth,
      since,
      exclude
    });
    const packbuffer = Buffer.from(await collect(packstream));
    const raw = await GitRemoteHTTP2.connect({
      http,
      onProgress,
      corsProxy,
      service: "git-upload-pack",
      url,
      auth,
      body: [packbuffer],
      headers
    });
    const response = await parseUploadPackResponse(raw.body);
    if (raw.headers) {
      response.headers = raw.headers;
    }
    for (const oid2 of response.shallows) {
      if (!oids.has(oid2)) {
        try {
          const { object } = await _readObject({ fs, cache, gitdir, oid: oid2 });
          const commit2 = new GitCommit(object);
          const hasParents = await Promise.all(commit2.headers().parent.map((oid3) => hasObject({ fs, cache, gitdir, oid: oid3 })));
          const haveAllParents = hasParents.length === 0 || hasParents.every((has) => has);
          if (!haveAllParents) {
            oids.add(oid2);
          }
        } catch (err) {
          oids.add(oid2);
        }
      }
    }
    for (const oid2 of response.unshallows) {
      oids.delete(oid2);
    }
    await GitShallowManager.write({ fs, gitdir, oids });
    if (singleBranch) {
      const refs = new Map([[fullref, oid]]);
      const symrefs = new Map;
      let bail = 10;
      let key = fullref;
      while (bail--) {
        const value = remoteHTTP.symrefs.get(key);
        if (value === undefined)
          break;
        symrefs.set(key, value);
        key = value;
      }
      const realRef = remoteRefs.get(key);
      if (realRef) {
        refs.set(key, realRef);
      }
      const { pruned } = await GitRefManager.updateRemoteRefs({
        fs,
        gitdir,
        remote,
        refs,
        symrefs,
        tags,
        prune
      });
      if (prune) {
        response.pruned = pruned;
      }
    } else {
      const { pruned } = await GitRefManager.updateRemoteRefs({
        fs,
        gitdir,
        remote,
        refs: remoteRefs,
        symrefs: remoteHTTP.symrefs,
        tags,
        prune,
        pruneTags
      });
      if (prune) {
        response.pruned = pruned;
      }
    }
    response.HEAD = remoteHTTP.symrefs.get("HEAD");
    if (response.HEAD === undefined) {
      const { oid: oid2 } = GitRefManager.resolveAgainstMap({
        ref: "HEAD",
        map: remoteRefs
      });
      for (const [key, value] of remoteRefs.entries()) {
        if (key !== "HEAD" && value === oid2) {
          response.HEAD = key;
          break;
        }
      }
    }
    const noun = fullref.startsWith("refs/tags") ? "tag" : "branch";
    response.FETCH_HEAD = {
      oid,
      description: `${noun} '${abbreviateRef(fullref)}' of ${url}`
    };
    if (onProgress || onMessage) {
      const lines = splitLines(response.progress);
      forAwait(lines, async (line) => {
        if (onMessage)
          await onMessage(line);
        if (onProgress) {
          const matches = line.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
          if (matches) {
            await onProgress({
              phase: matches[1].trim(),
              loaded: parseInt(matches[2], 10),
              total: parseInt(matches[3], 10)
            });
          }
        }
      });
    }
    const packfile = Buffer.from(await collect(response.packfile));
    if (raw.body.error)
      throw raw.body.error;
    const packfileSha = packfile.slice(-20).toString("hex");
    const res = {
      defaultBranch: response.HEAD,
      fetchHead: response.FETCH_HEAD.oid,
      fetchHeadDescription: response.FETCH_HEAD.description
    };
    if (response.headers) {
      res.headers = response.headers;
    }
    if (prune) {
      res.pruned = response.pruned;
    }
    if (packfileSha !== "" && !emptyPackfile(packfile)) {
      res.packfile = `objects/pack/pack-${packfileSha}.pack`;
      const fullpath = join5(gitdir, res.packfile);
      await fs.write(fullpath, packfile);
      const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
      const idx = await GitPackIndex.fromPack({
        pack: packfile,
        getExternalRefDelta,
        onProgress
      });
      await fs.write(fullpath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
    }
    return res;
  }
  async function _init({
    fs,
    bare = false,
    dir,
    gitdir = bare ? dir : join5(dir, ".git"),
    defaultBranch = "master"
  }) {
    if (await fs.exists(gitdir + "/config"))
      return;
    let folders = [
      "hooks",
      "info",
      "objects/info",
      "objects/pack",
      "refs/heads",
      "refs/tags"
    ];
    folders = folders.map((dir2) => gitdir + "/" + dir2);
    for (const folder of folders) {
      await fs.mkdir(folder);
    }
    await fs.write(gitdir + "/config", `[core]
` + `	repositoryformatversion = 0
` + `	filemode = false
` + `	bare = ${bare}
` + (bare ? "" : `	logallrefupdates = true
`) + `	symlinks = false
` + `	ignorecase = true
`);
    await fs.write(gitdir + "/HEAD", `ref: refs/heads/${defaultBranch}
`);
  }
  async function _clone({
    fs,
    cache,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    onPostCheckout,
    dir,
    gitdir,
    url,
    corsProxy,
    ref,
    remote,
    depth,
    since,
    exclude,
    relative,
    singleBranch,
    noCheckout,
    noTags,
    headers,
    nonBlocking,
    batchSize = 100
  }) {
    try {
      await _init({ fs, gitdir });
      await _addRemote({ fs, gitdir, remote, url, force: false });
      if (corsProxy) {
        const config = await GitConfigManager.get({ fs, gitdir });
        await config.set(`http.corsProxy`, corsProxy);
        await GitConfigManager.save({ fs, gitdir, config });
      }
      const { defaultBranch, fetchHead } = await _fetch({
        fs,
        cache,
        http,
        onProgress,
        onMessage,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        gitdir,
        ref,
        remote,
        corsProxy,
        depth,
        since,
        exclude,
        relative,
        singleBranch,
        headers,
        tags: !noTags
      });
      if (fetchHead === null)
        return;
      ref = ref || defaultBranch;
      ref = ref.replace("refs/heads/", "");
      await _checkout({
        fs,
        cache,
        onProgress,
        onPostCheckout,
        dir,
        gitdir,
        ref,
        remote,
        noCheckout,
        nonBlocking,
        batchSize
      });
    } catch (err) {
      await fs.rmdir(gitdir, { recursive: true, maxRetries: 10 }).catch(() => {
        return;
      });
      throw err;
    }
  }
  async function clone({
    fs,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    onPostCheckout,
    dir,
    gitdir = join5(dir, ".git"),
    url,
    corsProxy = undefined,
    ref = undefined,
    remote = "origin",
    depth = undefined,
    since = undefined,
    exclude = [],
    relative = false,
    singleBranch = false,
    noCheckout = false,
    noTags = false,
    headers = {},
    cache = {},
    nonBlocking = false,
    batchSize = 100
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("http", http);
      assertParameter("gitdir", gitdir);
      if (!noCheckout) {
        assertParameter("dir", dir);
      }
      assertParameter("url", url);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _clone({
        fs: fsp,
        cache,
        http,
        onProgress,
        onMessage,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        onPostCheckout,
        dir,
        gitdir: updatedGitdir,
        url,
        corsProxy,
        ref,
        remote,
        depth,
        since,
        exclude,
        relative,
        singleBranch,
        noCheckout,
        noTags,
        headers,
        nonBlocking,
        batchSize
      });
    } catch (err) {
      err.caller = "git.clone";
      throw err;
    }
  }
  async function commit({
    fs: _fs,
    onSign,
    dir,
    gitdir = join5(dir, ".git"),
    message,
    author,
    committer,
    signingKey,
    amend = false,
    dryRun = false,
    noUpdateBranch = false,
    ref,
    parent,
    tree,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      if (!amend) {
        assertParameter("message", message);
      }
      if (signingKey) {
        assertParameter("onSign", onSign);
      }
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      return await _commit({
        fs,
        cache,
        onSign,
        gitdir: updatedGitdir,
        message,
        author,
        committer,
        signingKey,
        amend,
        dryRun,
        noUpdateBranch,
        ref,
        parent,
        tree
      });
    } catch (err) {
      err.caller = "git.commit";
      throw err;
    }
  }
  async function currentBranch({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    fullname = false,
    test = false
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _currentBranch({
        fs: fsp,
        gitdir: updatedGitdir,
        fullname,
        test
      });
    } catch (err) {
      err.caller = "git.currentBranch";
      throw err;
    }
  }
  async function _deleteBranch({ fs, gitdir, ref }) {
    ref = ref.startsWith("refs/heads/") ? ref : `refs/heads/${ref}`;
    const exist = await GitRefManager.exists({ fs, gitdir, ref });
    if (!exist) {
      throw new NotFoundError(ref);
    }
    const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
    const currentRef = await _currentBranch({ fs, gitdir, fullname: true });
    if (fullRef === currentRef) {
      const value = await GitRefManager.resolve({ fs, gitdir, ref: fullRef });
      await GitRefManager.writeRef({ fs, gitdir, ref: "HEAD", value });
    }
    await GitRefManager.deleteRef({ fs, gitdir, ref: fullRef });
    const abbrevRef = abbreviateRef(ref);
    const config = await GitConfigManager.get({ fs, gitdir });
    await config.deleteSection("branch", abbrevRef);
    await GitConfigManager.save({ fs, gitdir, config });
  }
  async function deleteBranch({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _deleteBranch({
        fs: fsp,
        gitdir: updatedGitdir,
        ref
      });
    } catch (err) {
      err.caller = "git.deleteBranch";
      throw err;
    }
  }
  async function deleteRef({ fs, dir, gitdir = join5(dir, ".git"), ref }) {
    try {
      assertParameter("fs", fs);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      await GitRefManager.deleteRef({ fs: fsp, gitdir: updatedGitdir, ref });
    } catch (err) {
      err.caller = "git.deleteRef";
      throw err;
    }
  }
  async function _deleteRemote({ fs, gitdir, remote }) {
    const config = await GitConfigManager.get({ fs, gitdir });
    await config.deleteSection("remote", remote);
    await GitConfigManager.save({ fs, gitdir, config });
  }
  async function deleteRemote({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    remote
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("remote", remote);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _deleteRemote({
        fs: fsp,
        gitdir: updatedGitdir,
        remote
      });
    } catch (err) {
      err.caller = "git.deleteRemote";
      throw err;
    }
  }
  async function _deleteTag({ fs, gitdir, ref }) {
    ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
    await GitRefManager.deleteRef({ fs, gitdir, ref });
  }
  async function deleteTag({ fs, dir, gitdir = join5(dir, ".git"), ref }) {
    try {
      assertParameter("fs", fs);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _deleteTag({
        fs: fsp,
        gitdir: updatedGitdir,
        ref
      });
    } catch (err) {
      err.caller = "git.deleteTag";
      throw err;
    }
  }
  async function expandOidLoose({ fs, gitdir, oid: short }) {
    const prefix = short.slice(0, 2);
    const objectsSuffixes = await fs.readdir(`${gitdir}/objects/${prefix}`);
    return objectsSuffixes.map((suffix2) => `${prefix}${suffix2}`).filter((_oid) => _oid.startsWith(short));
  }
  async function expandOidPacked({
    fs,
    cache,
    gitdir,
    oid: short,
    getExternalRefDelta
  }) {
    const results = [];
    let list = await fs.readdir(join5(gitdir, "objects/pack"));
    list = list.filter((x) => x.endsWith(".idx"));
    for (const filename of list) {
      const indexFile = `${gitdir}/objects/pack/${filename}`;
      const p = await readPackIndex({
        fs,
        cache,
        filename: indexFile,
        getExternalRefDelta
      });
      if (p.error)
        throw new InternalError(p.error);
      for (const oid of p.offsets.keys()) {
        if (oid.startsWith(short))
          results.push(oid);
      }
    }
    return results;
  }
  async function _expandOid({ fs, cache, gitdir, oid: short }) {
    const getExternalRefDelta = (oid) => _readObject({ fs, cache, gitdir, oid });
    const results = await expandOidLoose({ fs, gitdir, oid: short });
    const packedOids = await expandOidPacked({
      fs,
      cache,
      gitdir,
      oid: short,
      getExternalRefDelta
    });
    for (const packedOid of packedOids) {
      if (results.indexOf(packedOid) === -1) {
        results.push(packedOid);
      }
    }
    if (results.length === 1) {
      return results[0];
    }
    if (results.length > 1) {
      throw new AmbiguousError("oids", short, results);
    }
    throw new NotFoundError(`an object matching "${short}"`);
  }
  async function expandOid({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _expandOid({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oid
      });
    } catch (err) {
      err.caller = "git.expandOid";
      throw err;
    }
  }
  async function expandRef({ fs, dir, gitdir = join5(dir, ".git"), ref }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await GitRefManager.expand({
        fs: fsp,
        gitdir: updatedGitdir,
        ref
      });
    } catch (err) {
      err.caller = "git.expandRef";
      throw err;
    }
  }
  async function _findMergeBase({ fs, cache, gitdir, oids }) {
    const visits = {};
    const passes = oids.length;
    let heads = oids.map((oid, index2) => ({ index: index2, oid }));
    while (heads.length) {
      const result = new Set;
      for (const { oid, index: index2 } of heads) {
        if (!visits[oid])
          visits[oid] = new Set;
        visits[oid].add(index2);
        if (visits[oid].size === passes) {
          result.add(oid);
        }
      }
      if (result.size > 0) {
        return [...result];
      }
      const newheads = new Map;
      for (const { oid, index: index2 } of heads) {
        try {
          const { object } = await _readObject({ fs, cache, gitdir, oid });
          const commit2 = GitCommit.from(object);
          const { parent } = commit2.parseHeaders();
          for (const oid2 of parent) {
            if (!visits[oid2] || !visits[oid2].has(index2)) {
              newheads.set(oid2 + ":" + index2, { oid: oid2, index: index2 });
            }
          }
        } catch (err) {}
      }
      heads = Array.from(newheads.values());
    }
    return [];
  }
  async function _merge({
    fs,
    cache,
    dir,
    gitdir,
    ours,
    theirs,
    fastForward: fastForward2 = true,
    fastForwardOnly = false,
    dryRun = false,
    noUpdateBranch = false,
    abortOnConflict = true,
    message,
    author,
    committer,
    signingKey,
    onSign,
    mergeDriver,
    allowUnrelatedHistories = false
  }) {
    if (ours === undefined) {
      ours = await _currentBranch({ fs, gitdir, fullname: true });
    }
    ours = await GitRefManager.expand({
      fs,
      gitdir,
      ref: ours
    });
    theirs = await GitRefManager.expand({
      fs,
      gitdir,
      ref: theirs
    });
    const ourOid = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: ours
    });
    const theirOid = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: theirs
    });
    const baseOids = await _findMergeBase({
      fs,
      cache,
      gitdir,
      oids: [ourOid, theirOid]
    });
    if (baseOids.length !== 1) {
      if (baseOids.length === 0 && allowUnrelatedHistories) {
        baseOids.push("4b825dc642cb6eb9a060e54bf8d69288fbee4904");
      } else {
        throw new MergeNotSupportedError;
      }
    }
    const baseOid = baseOids[0];
    if (baseOid === theirOid) {
      return {
        oid: ourOid,
        alreadyMerged: true
      };
    }
    if (fastForward2 && baseOid === ourOid) {
      if (!dryRun && !noUpdateBranch) {
        await GitRefManager.writeRef({ fs, gitdir, ref: ours, value: theirOid });
      }
      return {
        oid: theirOid,
        fastForward: true
      };
    } else {
      if (fastForwardOnly) {
        throw new FastForwardError;
      }
      const tree = await GitIndexManager.acquire({ fs, gitdir, cache, allowUnmerged: false }, async (index2) => {
        return mergeTree({
          fs,
          cache,
          dir,
          gitdir,
          index: index2,
          ourOid,
          theirOid,
          baseOid,
          ourName: abbreviateRef(ours),
          baseName: "base",
          theirName: abbreviateRef(theirs),
          dryRun,
          abortOnConflict,
          mergeDriver
        });
      });
      if (tree instanceof MergeConflictError)
        throw tree;
      if (!message) {
        message = `Merge branch '${abbreviateRef(theirs)}' into ${abbreviateRef(ours)}`;
      }
      const oid = await _commit({
        fs,
        cache,
        gitdir,
        message,
        ref: ours,
        tree,
        parent: [ourOid, theirOid],
        author,
        committer,
        signingKey,
        onSign,
        dryRun,
        noUpdateBranch
      });
      return {
        oid,
        tree,
        mergeCommit: true
      };
    }
  }
  async function _pull({
    fs,
    cache,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    dir,
    gitdir,
    ref,
    url,
    remote,
    remoteRef,
    prune,
    pruneTags,
    fastForward: fastForward2,
    fastForwardOnly,
    corsProxy,
    singleBranch,
    headers,
    author,
    committer,
    signingKey
  }) {
    try {
      if (!ref) {
        const head = await _currentBranch({ fs, gitdir });
        if (!head) {
          throw new MissingParameterError("ref");
        }
        ref = head;
      }
      const { fetchHead, fetchHeadDescription } = await _fetch({
        fs,
        cache,
        http,
        onProgress,
        onMessage,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        gitdir,
        corsProxy,
        ref,
        url,
        remote,
        remoteRef,
        singleBranch,
        headers,
        prune,
        pruneTags
      });
      await _merge({
        fs,
        cache,
        gitdir,
        ours: ref,
        theirs: fetchHead,
        fastForward: fastForward2,
        fastForwardOnly,
        message: `Merge ${fetchHeadDescription}`,
        author,
        committer,
        signingKey,
        dryRun: false,
        noUpdateBranch: false
      });
      await _checkout({
        fs,
        cache,
        onProgress,
        dir,
        gitdir,
        ref,
        remote,
        noCheckout: false
      });
    } catch (err) {
      err.caller = "git.pull";
      throw err;
    }
  }
  async function fastForward({
    fs,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    url,
    remote,
    remoteRef,
    corsProxy,
    singleBranch,
    headers = {},
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("http", http);
      assertParameter("gitdir", gitdir);
      const thisWillNotBeUsed = {
        name: "",
        email: "",
        timestamp: Date.now(),
        timezoneOffset: 0
      };
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _pull({
        fs: fsp,
        cache,
        http,
        onProgress,
        onMessage,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        dir,
        gitdir: updatedGitdir,
        ref,
        url,
        remote,
        remoteRef,
        fastForwardOnly: true,
        corsProxy,
        singleBranch,
        headers,
        author: thisWillNotBeUsed,
        committer: thisWillNotBeUsed
      });
    } catch (err) {
      err.caller = "git.fastForward";
      throw err;
    }
  }
  async function fetch2({
    fs,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    remote,
    remoteRef,
    url,
    corsProxy,
    depth = null,
    since = null,
    exclude = [],
    relative = false,
    tags = false,
    singleBranch = false,
    headers = {},
    prune = false,
    pruneTags = false,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("http", http);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _fetch({
        fs: fsp,
        cache,
        http,
        onProgress,
        onMessage,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        gitdir: updatedGitdir,
        ref,
        remote,
        remoteRef,
        url,
        corsProxy,
        depth,
        since,
        exclude,
        relative,
        tags,
        singleBranch,
        headers,
        prune,
        pruneTags
      });
    } catch (err) {
      err.caller = "git.fetch";
      throw err;
    }
  }
  async function findMergeBase({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oids,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oids", oids);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _findMergeBase({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oids
      });
    } catch (err) {
      err.caller = "git.findMergeBase";
      throw err;
    }
  }
  async function _findRoot({ fs, filepath }) {
    if (await fs.exists(join5(filepath, ".git"))) {
      return filepath;
    } else {
      const parent = dirname2(filepath);
      if (parent === filepath) {
        throw new NotFoundError(`git root for ${filepath}`);
      }
      return _findRoot({ fs, filepath: parent });
    }
  }
  async function findRoot({ fs, filepath }) {
    try {
      assertParameter("fs", fs);
      assertParameter("filepath", filepath);
      return await _findRoot({ fs: new FileSystem(fs), filepath });
    } catch (err) {
      err.caller = "git.findRoot";
      throw err;
    }
  }
  async function getConfig({ fs, dir, gitdir = join5(dir, ".git"), path: path2 }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("path", path2);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _getConfig({
        fs: fsp,
        gitdir: updatedGitdir,
        path: path2
      });
    } catch (err) {
      err.caller = "git.getConfig";
      throw err;
    }
  }
  async function _getConfigAll({ fs, gitdir, path: path2 }) {
    const config = await GitConfigManager.get({ fs, gitdir });
    return config.getall(path2);
  }
  async function getConfigAll({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    path: path2
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("path", path2);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _getConfigAll({
        fs: fsp,
        gitdir: updatedGitdir,
        path: path2
      });
    } catch (err) {
      err.caller = "git.getConfigAll";
      throw err;
    }
  }
  async function getRemoteInfo({
    http,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    corsProxy,
    url,
    headers = {},
    forPush = false
  }) {
    try {
      assertParameter("http", http);
      assertParameter("url", url);
      const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
      const remote = await GitRemoteHTTP2.discover({
        http,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        corsProxy,
        service: forPush ? "git-receive-pack" : "git-upload-pack",
        url,
        headers,
        protocolVersion: 1
      });
      const result = {
        capabilities: [...remote.capabilities]
      };
      for (const [ref, oid] of remote.refs) {
        const parts = ref.split("/");
        const last = parts.pop();
        let o = result;
        for (const part of parts) {
          o[part] = o[part] || {};
          o = o[part];
        }
        o[last] = oid;
      }
      for (const [symref, ref] of remote.symrefs) {
        const parts = symref.split("/");
        const last = parts.pop();
        let o = result;
        for (const part of parts) {
          o[part] = o[part] || {};
          o = o[part];
        }
        o[last] = ref;
      }
      return result;
    } catch (err) {
      err.caller = "git.getRemoteInfo";
      throw err;
    }
  }
  function formatInfoRefs(remote, prefix, symrefs, peelTags) {
    const refs = [];
    for (const [key, value] of remote.refs) {
      if (prefix && !key.startsWith(prefix))
        continue;
      if (key.endsWith("^{}")) {
        if (peelTags) {
          const _key = key.replace("^{}", "");
          const last = refs[refs.length - 1];
          const r = last.ref === _key ? last : refs.find((x) => x.ref === _key);
          if (r === undefined) {
            throw new Error("I did not expect this to happen");
          }
          r.peeled = value;
        }
        continue;
      }
      const ref = { ref: key, oid: value };
      if (symrefs) {
        if (remote.symrefs.has(key)) {
          ref.target = remote.symrefs.get(key);
        }
      }
      refs.push(ref);
    }
    return refs;
  }
  async function getRemoteInfo2({
    http,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    corsProxy,
    url,
    headers = {},
    forPush = false,
    protocolVersion = 2
  }) {
    try {
      assertParameter("http", http);
      assertParameter("url", url);
      const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
      const remote = await GitRemoteHTTP2.discover({
        http,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        corsProxy,
        service: forPush ? "git-receive-pack" : "git-upload-pack",
        url,
        headers,
        protocolVersion
      });
      if (remote.protocolVersion === 2) {
        return {
          protocolVersion: remote.protocolVersion,
          capabilities: remote.capabilities2
        };
      }
      const capabilities = {};
      for (const cap of remote.capabilities) {
        const [key, value] = cap.split("=");
        if (value) {
          capabilities[key] = value;
        } else {
          capabilities[key] = true;
        }
      }
      return {
        protocolVersion: 1,
        capabilities,
        refs: formatInfoRefs(remote, undefined, true, true)
      };
    } catch (err) {
      err.caller = "git.getRemoteInfo2";
      throw err;
    }
  }
  async function hashObject({
    type,
    object,
    format = "content",
    oid = undefined
  }) {
    if (format !== "deflated") {
      if (format !== "wrapped") {
        object = GitObject.wrap({ type, object });
      }
      oid = await shasum(object);
    }
    return { oid, object };
  }
  async function hashBlob({ object }) {
    try {
      assertParameter("object", object);
      if (typeof object === "string") {
        object = Buffer.from(object, "utf8");
      } else if (!(object instanceof Uint8Array)) {
        object = new Uint8Array(object);
      }
      const type = "blob";
      const { oid, object: _object } = await hashObject({
        type,
        format: "content",
        object
      });
      return { oid, type, object: _object, format: "wrapped" };
    } catch (err) {
      err.caller = "git.hashBlob";
      throw err;
    }
  }
  async function _indexPack({
    fs,
    cache,
    onProgress,
    dir,
    gitdir,
    filepath
  }) {
    try {
      filepath = join5(dir, filepath);
      const pack = await fs.read(filepath);
      const getExternalRefDelta = (oid) => _readObject({ fs, cache, gitdir, oid });
      const idx = await GitPackIndex.fromPack({
        pack,
        getExternalRefDelta,
        onProgress
      });
      await fs.write(filepath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
      return {
        oids: [...idx.hashes]
      };
    } catch (err) {
      err.caller = "git.indexPack";
      throw err;
    }
  }
  async function indexPack({
    fs,
    onProgress,
    dir,
    gitdir = join5(dir, ".git"),
    filepath,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("dir", dir);
      assertParameter("gitdir", dir);
      assertParameter("filepath", filepath);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _indexPack({
        fs: fsp,
        cache,
        onProgress,
        dir,
        gitdir: updatedGitdir,
        filepath
      });
    } catch (err) {
      err.caller = "git.indexPack";
      throw err;
    }
  }
  async function init({
    fs,
    bare = false,
    dir,
    gitdir = bare ? dir : join5(dir, ".git"),
    defaultBranch = "master"
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      if (!bare) {
        assertParameter("dir", dir);
      }
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _init({
        fs: fsp,
        bare,
        dir,
        gitdir: updatedGitdir,
        defaultBranch
      });
    } catch (err) {
      err.caller = "git.init";
      throw err;
    }
  }
  async function _isDescendent({
    fs,
    cache,
    gitdir,
    oid,
    ancestor,
    depth
  }) {
    const shallows = await GitShallowManager.read({ fs, gitdir });
    if (!oid) {
      throw new MissingParameterError("oid");
    }
    if (!ancestor) {
      throw new MissingParameterError("ancestor");
    }
    if (oid === ancestor)
      return false;
    const queue = [oid];
    const visited = new Set;
    let searchdepth = 0;
    while (queue.length) {
      if (searchdepth++ === depth) {
        throw new MaxDepthError(depth);
      }
      const oid2 = queue.shift();
      const { type, object } = await _readObject({
        fs,
        cache,
        gitdir,
        oid: oid2
      });
      if (type !== "commit") {
        throw new ObjectTypeError(oid2, type, "commit");
      }
      const commit2 = GitCommit.from(object).parse();
      for (const parent of commit2.parent) {
        if (parent === ancestor)
          return true;
      }
      if (!shallows.has(oid2)) {
        for (const parent of commit2.parent) {
          if (!visited.has(parent)) {
            queue.push(parent);
            visited.add(parent);
          }
        }
      }
    }
    return false;
  }
  async function isDescendent({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    ancestor,
    depth = -1,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      assertParameter("ancestor", ancestor);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _isDescendent({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oid,
        ancestor,
        depth
      });
    } catch (err) {
      err.caller = "git.isDescendent";
      throw err;
    }
  }
  async function isIgnored({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    filepath
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("dir", dir);
      assertParameter("gitdir", gitdir);
      assertParameter("filepath", filepath);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return GitIgnoreManager.isIgnored({
        fs: fsp,
        dir,
        gitdir: updatedGitdir,
        filepath
      });
    } catch (err) {
      err.caller = "git.isIgnored";
      throw err;
    }
  }
  async function listBranches({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    remote
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return GitRefManager.listBranches({
        fs: fsp,
        gitdir: updatedGitdir,
        remote
      });
    } catch (err) {
      err.caller = "git.listBranches";
      throw err;
    }
  }
  async function _listFiles({ fs, gitdir, ref, cache }) {
    if (ref) {
      const oid = await GitRefManager.resolve({ gitdir, fs, ref });
      const filenames = [];
      await accumulateFilesFromOid({
        fs,
        cache,
        gitdir,
        oid,
        filenames,
        prefix: ""
      });
      return filenames;
    } else {
      return GitIndexManager.acquire({ fs, gitdir, cache }, async function(index2) {
        return index2.entries.map((x) => x.path);
      });
    }
  }
  async function accumulateFilesFromOid({
    fs,
    cache,
    gitdir,
    oid,
    filenames,
    prefix
  }) {
    const { tree } = await _readTree({ fs, cache, gitdir, oid });
    for (const entry of tree) {
      if (entry.type === "tree") {
        await accumulateFilesFromOid({
          fs,
          cache,
          gitdir,
          oid: entry.oid,
          filenames,
          prefix: join5(prefix, entry.path)
        });
      } else {
        filenames.push(join5(prefix, entry.path));
      }
    }
  }
  async function listFiles({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _listFiles({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        ref
      });
    } catch (err) {
      err.caller = "git.listFiles";
      throw err;
    }
  }
  async function _listNotes({ fs, cache, gitdir, ref }) {
    let parent;
    try {
      parent = await GitRefManager.resolve({ gitdir, fs, ref });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return [];
      }
    }
    const result = await _readTree({
      fs,
      cache,
      gitdir,
      oid: parent
    });
    const notes = result.tree.map((entry) => ({
      target: entry.path,
      note: entry.oid
    }));
    return notes;
  }
  async function listNotes({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref = "refs/notes/commits",
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _listNotes({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        ref
      });
    } catch (err) {
      err.caller = "git.listNotes";
      throw err;
    }
  }
  async function listRefs({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    filepath
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return GitRefManager.listRefs({ fs: fsp, gitdir: updatedGitdir, filepath });
    } catch (err) {
      err.caller = "git.listRefs";
      throw err;
    }
  }
  async function _listRemotes({ fs, gitdir }) {
    const config = await GitConfigManager.get({ fs, gitdir });
    const remoteNames = await config.getSubsections("remote");
    const remotes = Promise.all(remoteNames.map(async (remote) => {
      const url = await config.get(`remote.${remote}.url`);
      return { remote, url };
    }));
    return remotes;
  }
  async function listRemotes({ fs, dir, gitdir = join5(dir, ".git") }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _listRemotes({
        fs: fsp,
        gitdir: updatedGitdir
      });
    } catch (err) {
      err.caller = "git.listRemotes";
      throw err;
    }
  }
  async function parseListRefsResponse(stream) {
    const read = GitPktLine.streamReader(stream);
    const refs = [];
    let line;
    while (true) {
      line = await read();
      if (line === true)
        break;
      if (line === null)
        continue;
      line = line.toString("utf8").replace(/\n$/, "");
      const [oid, ref, ...attrs] = line.split(" ");
      const r = { ref, oid };
      for (const attr of attrs) {
        const [name, value] = attr.split(":");
        if (name === "symref-target") {
          r.target = value;
        } else if (name === "peeled") {
          r.peeled = value;
        }
      }
      refs.push(r);
    }
    return refs;
  }
  async function writeListRefsRequest({ prefix, symrefs, peelTags }) {
    const packstream = [];
    packstream.push(GitPktLine.encode(`command=ls-refs
`));
    packstream.push(GitPktLine.encode(`agent=${pkg.agent}
`));
    if (peelTags || symrefs || prefix) {
      packstream.push(GitPktLine.delim());
    }
    if (peelTags)
      packstream.push(GitPktLine.encode("peel"));
    if (symrefs)
      packstream.push(GitPktLine.encode("symrefs"));
    if (prefix)
      packstream.push(GitPktLine.encode(`ref-prefix ${prefix}`));
    packstream.push(GitPktLine.flush());
    return packstream;
  }
  async function listServerRefs({
    http,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    corsProxy,
    url,
    headers = {},
    forPush = false,
    protocolVersion = 2,
    prefix,
    symrefs,
    peelTags
  }) {
    try {
      assertParameter("http", http);
      assertParameter("url", url);
      const remote = await GitRemoteHTTP.discover({
        http,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        corsProxy,
        service: forPush ? "git-receive-pack" : "git-upload-pack",
        url,
        headers,
        protocolVersion
      });
      if (remote.protocolVersion === 1) {
        return formatInfoRefs(remote, prefix, symrefs, peelTags);
      }
      const body = await writeListRefsRequest({ prefix, symrefs, peelTags });
      const res = await GitRemoteHTTP.connect({
        http,
        auth: remote.auth,
        headers,
        corsProxy,
        service: forPush ? "git-receive-pack" : "git-upload-pack",
        url,
        body
      });
      return parseListRefsResponse(res.body);
    } catch (err) {
      err.caller = "git.listServerRefs";
      throw err;
    }
  }
  async function listTags({ fs, dir, gitdir = join5(dir, ".git") }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return GitRefManager.listTags({ fs: fsp, gitdir: updatedGitdir });
    } catch (err) {
      err.caller = "git.listTags";
      throw err;
    }
  }
  function compareAge(a, b) {
    return a.committer.timestamp - b.committer.timestamp;
  }
  var EMPTY_OID = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391";
  async function resolveFileIdInTree({ fs, cache, gitdir, oid, fileId }) {
    if (fileId === EMPTY_OID)
      return;
    const _oid = oid;
    let filepath;
    const result = await resolveTree({ fs, cache, gitdir, oid });
    const tree = result.tree;
    if (fileId === result.oid) {
      filepath = result.path;
    } else {
      filepath = await _resolveFileId({
        fs,
        cache,
        gitdir,
        tree,
        fileId,
        oid: _oid
      });
      if (Array.isArray(filepath)) {
        if (filepath.length === 0)
          filepath = undefined;
        else if (filepath.length === 1)
          filepath = filepath[0];
      }
    }
    return filepath;
  }
  async function _resolveFileId({
    fs,
    cache,
    gitdir,
    tree,
    fileId,
    oid,
    filepaths = [],
    parentPath = ""
  }) {
    const walks = tree.entries().map(function(entry) {
      let result;
      if (entry.oid === fileId) {
        result = join5(parentPath, entry.path);
        filepaths.push(result);
      } else if (entry.type === "tree") {
        result = _readObject({
          fs,
          cache,
          gitdir,
          oid: entry.oid
        }).then(function({ object }) {
          return _resolveFileId({
            fs,
            cache,
            gitdir,
            tree: GitTree.from(object),
            fileId,
            oid,
            filepaths,
            parentPath: join5(parentPath, entry.path)
          });
        });
      }
      return result;
    });
    await Promise.all(walks);
    return filepaths;
  }
  async function _log({
    fs,
    cache,
    gitdir,
    filepath,
    ref,
    depth,
    since,
    force,
    follow
  }) {
    const sinceTimestamp = typeof since === "undefined" ? undefined : Math.floor(since.valueOf() / 1000);
    const commits = [];
    const shallowCommits = await GitShallowManager.read({ fs, gitdir });
    const oid = await GitRefManager.resolve({ fs, gitdir, ref });
    const tips = [await _readCommit({ fs, cache, gitdir, oid })];
    let lastFileOid;
    let lastCommit;
    let isOk;
    function endCommit(commit2) {
      if (isOk && filepath)
        commits.push(commit2);
    }
    while (tips.length > 0) {
      const commit2 = tips.pop();
      if (sinceTimestamp !== undefined && commit2.commit.committer.timestamp <= sinceTimestamp) {
        break;
      }
      if (filepath) {
        let vFileOid;
        try {
          vFileOid = await resolveFilepath({
            fs,
            cache,
            gitdir,
            oid: commit2.commit.tree,
            filepath
          });
          if (lastCommit && lastFileOid !== vFileOid) {
            commits.push(lastCommit);
          }
          lastFileOid = vFileOid;
          lastCommit = commit2;
          isOk = true;
        } catch (e) {
          if (e instanceof NotFoundError) {
            let found = follow && lastFileOid;
            if (found) {
              found = await resolveFileIdInTree({
                fs,
                cache,
                gitdir,
                oid: commit2.commit.tree,
                fileId: lastFileOid
              });
              if (found) {
                if (Array.isArray(found)) {
                  if (lastCommit) {
                    const lastFound = await resolveFileIdInTree({
                      fs,
                      cache,
                      gitdir,
                      oid: lastCommit.commit.tree,
                      fileId: lastFileOid
                    });
                    if (Array.isArray(lastFound)) {
                      found = found.filter((p) => lastFound.indexOf(p) === -1);
                      if (found.length === 1) {
                        found = found[0];
                        filepath = found;
                        if (lastCommit)
                          commits.push(lastCommit);
                      } else {
                        found = false;
                        if (lastCommit)
                          commits.push(lastCommit);
                        break;
                      }
                    }
                  }
                } else {
                  filepath = found;
                  if (lastCommit)
                    commits.push(lastCommit);
                }
              }
            }
            if (!found) {
              if (isOk && lastFileOid) {
                commits.push(lastCommit);
                if (!force)
                  break;
              }
              if (!force && !follow)
                throw e;
            }
            lastCommit = commit2;
            isOk = false;
          } else
            throw e;
        }
      } else {
        commits.push(commit2);
      }
      if (depth !== undefined && commits.length === depth) {
        endCommit(commit2);
        break;
      }
      if (!shallowCommits.has(commit2.oid)) {
        for (const oid2 of commit2.commit.parent) {
          const commit3 = await _readCommit({ fs, cache, gitdir, oid: oid2 });
          if (!tips.map((commit4) => commit4.oid).includes(commit3.oid)) {
            tips.push(commit3);
          }
        }
      }
      if (tips.length === 0) {
        endCommit(commit2);
      }
      tips.sort((a, b) => compareAge(a.commit, b.commit));
    }
    return commits;
  }
  async function log({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    filepath,
    ref = "HEAD",
    depth,
    since,
    force,
    follow,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _log({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        filepath,
        ref,
        depth,
        since,
        force,
        follow
      });
    } catch (err) {
      err.caller = "git.log";
      throw err;
    }
  }
  async function merge({
    fs: _fs,
    onSign,
    dir,
    gitdir = join5(dir, ".git"),
    ours,
    theirs,
    fastForward: fastForward2 = true,
    fastForwardOnly = false,
    dryRun = false,
    noUpdateBranch = false,
    abortOnConflict = true,
    message,
    author: _author,
    committer: _committer,
    signingKey,
    cache = {},
    mergeDriver,
    allowUnrelatedHistories = false
  }) {
    try {
      assertParameter("fs", _fs);
      if (signingKey) {
        assertParameter("onSign", onSign);
      }
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const author = await normalizeAuthorObject({
        fs,
        gitdir: updatedGitdir,
        author: _author
      });
      if (!author && (!fastForwardOnly || !fastForward2)) {
        throw new MissingNameError("author");
      }
      const committer = await normalizeCommitterObject({
        fs,
        gitdir: updatedGitdir,
        author,
        committer: _committer
      });
      if (!committer && (!fastForwardOnly || !fastForward2)) {
        throw new MissingNameError("committer");
      }
      return await _merge({
        fs,
        cache,
        dir,
        gitdir: updatedGitdir,
        ours,
        theirs,
        fastForward: fastForward2,
        fastForwardOnly,
        dryRun,
        noUpdateBranch,
        abortOnConflict,
        message,
        author,
        committer,
        signingKey,
        onSign,
        mergeDriver,
        allowUnrelatedHistories
      });
    } catch (err) {
      err.caller = "git.merge";
      throw err;
    }
  }
  var types = {
    commit: 16,
    tree: 32,
    blob: 48,
    tag: 64,
    ofs_delta: 96,
    ref_delta: 112
  };
  async function _pack({
    fs,
    cache,
    dir,
    gitdir = join5(dir, ".git"),
    oids
  }) {
    const hash2 = new Hash;
    const outputStream = [];
    function write(chunk, enc) {
      const buff = Buffer.from(chunk, enc);
      outputStream.push(buff);
      hash2.update(buff);
    }
    async function writeObject2({ stype, object }) {
      const type = types[stype];
      let length = object.length;
      let multibyte = length > 15 ? 128 : 0;
      const lastFour = length & 15;
      length = length >>> 4;
      let byte = (multibyte | type | lastFour).toString(16);
      write(byte, "hex");
      while (multibyte) {
        multibyte = length > 127 ? 128 : 0;
        byte = multibyte | length & 127;
        write(padHex(2, byte), "hex");
        length = length >>> 7;
      }
      write(Buffer.from(await deflate(object)));
    }
    write("PACK");
    write("00000002", "hex");
    write(padHex(8, oids.length), "hex");
    for (const oid of oids) {
      const { type, object } = await _readObject({ fs, cache, gitdir, oid });
      await writeObject2({ write, object, stype: type });
    }
    const digest = hash2.digest();
    outputStream.push(digest);
    return outputStream;
  }
  async function _packObjects({ fs, cache, gitdir, oids, write }) {
    const buffers = await _pack({ fs, cache, gitdir, oids });
    const packfile = Buffer.from(await collect(buffers));
    const packfileSha = packfile.slice(-20).toString("hex");
    const filename = `pack-${packfileSha}.pack`;
    if (write) {
      await fs.write(join5(gitdir, `objects/pack/${filename}`), packfile);
      return { filename };
    }
    return {
      filename,
      packfile: new Uint8Array(packfile)
    };
  }
  async function packObjects({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oids,
    write = false,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oids", oids);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _packObjects({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oids,
        write
      });
    } catch (err) {
      err.caller = "git.packObjects";
      throw err;
    }
  }
  async function pull({
    fs: _fs,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    url,
    remote,
    remoteRef,
    prune = false,
    pruneTags = false,
    fastForward: fastForward2 = true,
    fastForwardOnly = false,
    corsProxy,
    singleBranch,
    headers = {},
    author: _author,
    committer: _committer,
    signingKey,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const author = await normalizeAuthorObject({
        fs,
        gitdir: updatedGitdir,
        author: _author
      });
      if (!author)
        throw new MissingNameError("author");
      const committer = await normalizeCommitterObject({
        fs,
        gitdir: updatedGitdir,
        author,
        committer: _committer
      });
      if (!committer)
        throw new MissingNameError("committer");
      return await _pull({
        fs,
        cache,
        http,
        onProgress,
        onMessage,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        dir,
        gitdir: updatedGitdir,
        ref,
        url,
        remote,
        remoteRef,
        fastForward: fastForward2,
        fastForwardOnly,
        corsProxy,
        singleBranch,
        headers,
        author,
        committer,
        signingKey,
        prune,
        pruneTags
      });
    } catch (err) {
      err.caller = "git.pull";
      throw err;
    }
  }
  async function listCommitsAndTags({
    fs,
    cache,
    dir,
    gitdir = join5(dir, ".git"),
    start,
    finish
  }) {
    const shallows = await GitShallowManager.read({ fs, gitdir });
    const startingSet = new Set;
    const finishingSet = new Set;
    for (const ref of start) {
      startingSet.add(await GitRefManager.resolve({ fs, gitdir, ref }));
    }
    for (const ref of finish) {
      try {
        const oid = await GitRefManager.resolve({ fs, gitdir, ref });
        finishingSet.add(oid);
      } catch (err) {}
    }
    const visited = new Set;
    async function walk2(oid) {
      visited.add(oid);
      const { type, object } = await _readObject({ fs, cache, gitdir, oid });
      if (type === "tag") {
        const tag2 = GitAnnotatedTag.from(object);
        const commit2 = tag2.headers().object;
        return walk2(commit2);
      }
      if (type !== "commit") {
        throw new ObjectTypeError(oid, type, "commit");
      }
      if (!shallows.has(oid)) {
        const commit2 = GitCommit.from(object);
        const parents = commit2.headers().parent;
        for (oid of parents) {
          if (!finishingSet.has(oid) && !visited.has(oid)) {
            await walk2(oid);
          }
        }
      }
    }
    for (const oid of startingSet) {
      await walk2(oid);
    }
    return visited;
  }
  async function listObjects({
    fs,
    cache,
    dir,
    gitdir = join5(dir, ".git"),
    oids
  }) {
    const visited = new Set;
    async function walk2(oid) {
      if (visited.has(oid))
        return;
      visited.add(oid);
      const { type, object } = await _readObject({ fs, cache, gitdir, oid });
      if (type === "tag") {
        const tag2 = GitAnnotatedTag.from(object);
        const obj = tag2.headers().object;
        await walk2(obj);
      } else if (type === "commit") {
        const commit2 = GitCommit.from(object);
        const tree = commit2.headers().tree;
        await walk2(tree);
      } else if (type === "tree") {
        const tree = GitTree.from(object);
        for (const entry of tree) {
          if (entry.type === "blob") {
            visited.add(entry.oid);
          }
          if (entry.type === "tree") {
            await walk2(entry.oid);
          }
        }
      }
    }
    for (const oid of oids) {
      await walk2(oid);
    }
    return visited;
  }
  async function parseReceivePackResponse(packfile) {
    const result = {};
    let response = "";
    const read = GitPktLine.streamReader(packfile);
    let line = await read();
    while (line !== true) {
      if (line !== null)
        response += line.toString("utf8") + `
`;
      line = await read();
    }
    const lines = response.toString("utf8").split(`
`);
    line = lines.shift();
    if (!line.startsWith("unpack ")) {
      throw new ParseError('unpack ok" or "unpack [error message]', line);
    }
    result.ok = line === "unpack ok";
    if (!result.ok) {
      result.error = line.slice("unpack ".length);
    }
    result.refs = {};
    for (const line2 of lines) {
      if (line2.trim() === "")
        continue;
      const status2 = line2.slice(0, 2);
      const refAndMessage = line2.slice(3);
      let space = refAndMessage.indexOf(" ");
      if (space === -1)
        space = refAndMessage.length;
      const ref = refAndMessage.slice(0, space);
      const error = refAndMessage.slice(space + 1);
      result.refs[ref] = {
        ok: status2 === "ok",
        error
      };
    }
    return result;
  }
  async function writeReceivePackRequest({
    capabilities = [],
    triplets = []
  }) {
    const packstream = [];
    let capsFirstLine = `\x00 ${capabilities.join(" ")}`;
    for (const trip of triplets) {
      packstream.push(GitPktLine.encode(`${trip.oldoid} ${trip.oid} ${trip.fullRef}${capsFirstLine}
`));
      capsFirstLine = "";
    }
    packstream.push(GitPktLine.flush());
    return packstream;
  }
  async function _push({
    fs,
    cache,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    onPrePush,
    gitdir,
    ref: _ref,
    remoteRef: _remoteRef,
    remote,
    url: _url,
    force = false,
    delete: _delete = false,
    corsProxy,
    headers = {}
  }) {
    const ref = _ref || await _currentBranch({ fs, gitdir });
    if (typeof ref === "undefined") {
      throw new MissingParameterError("ref");
    }
    const config = await GitConfigManager.get({ fs, gitdir });
    remote = remote || await config.get(`branch.${ref}.pushRemote`) || await config.get("remote.pushDefault") || await config.get(`branch.${ref}.remote`) || "origin";
    const url = _url || await config.get(`remote.${remote}.pushurl`) || await config.get(`remote.${remote}.url`);
    if (typeof url === "undefined") {
      throw new MissingParameterError("remote OR url");
    }
    const remoteRef = _remoteRef || await config.get(`branch.${ref}.merge`);
    if (typeof url === "undefined") {
      throw new MissingParameterError("remoteRef");
    }
    if (corsProxy === undefined) {
      corsProxy = await config.get("http.corsProxy");
    }
    const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
    const oid = _delete ? "0000000000000000000000000000000000000000" : await GitRefManager.resolve({ fs, gitdir, ref: fullRef });
    const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
    const httpRemote = await GitRemoteHTTP2.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: "git-receive-pack",
      url,
      headers,
      protocolVersion: 1
    });
    const auth = httpRemote.auth;
    let fullRemoteRef;
    if (!remoteRef) {
      fullRemoteRef = fullRef;
    } else {
      try {
        fullRemoteRef = await GitRefManager.expandAgainstMap({
          ref: remoteRef,
          map: httpRemote.refs
        });
      } catch (err) {
        if (err instanceof NotFoundError) {
          fullRemoteRef = remoteRef.startsWith("refs/") ? remoteRef : `refs/heads/${remoteRef}`;
        } else {
          throw err;
        }
      }
    }
    const oldoid = httpRemote.refs.get(fullRemoteRef) || "0000000000000000000000000000000000000000";
    if (onPrePush) {
      const hookCancel = await onPrePush({
        remote,
        url,
        localRef: { ref: _delete ? "(delete)" : fullRef, oid },
        remoteRef: { ref: fullRemoteRef, oid: oldoid }
      });
      if (!hookCancel)
        throw new UserCanceledError;
    }
    const thinPack = !httpRemote.capabilities.has("no-thin");
    let objects = new Set;
    if (!_delete) {
      const finish = [...httpRemote.refs.values()];
      let skipObjects = new Set;
      if (oldoid !== "0000000000000000000000000000000000000000") {
        const mergebase = await _findMergeBase({
          fs,
          cache,
          gitdir,
          oids: [oid, oldoid]
        });
        for (const oid2 of mergebase)
          finish.push(oid2);
        if (thinPack) {
          skipObjects = await listObjects({ fs, cache, gitdir, oids: mergebase });
        }
      }
      if (!finish.includes(oid)) {
        const commits = await listCommitsAndTags({
          fs,
          cache,
          gitdir,
          start: [oid],
          finish
        });
        objects = await listObjects({ fs, cache, gitdir, oids: commits });
      }
      if (thinPack) {
        try {
          const ref2 = await GitRefManager.resolve({
            fs,
            gitdir,
            ref: `refs/remotes/${remote}/HEAD`,
            depth: 2
          });
          const { oid: oid2 } = await GitRefManager.resolveAgainstMap({
            ref: ref2.replace(`refs/remotes/${remote}/`, ""),
            fullref: ref2,
            map: httpRemote.refs
          });
          const oids = [oid2];
          for (const oid3 of await listObjects({ fs, cache, gitdir, oids })) {
            skipObjects.add(oid3);
          }
        } catch (e) {}
        for (const oid2 of skipObjects) {
          objects.delete(oid2);
        }
      }
      if (oid === oldoid)
        force = true;
      if (!force) {
        if (fullRef.startsWith("refs/tags") && oldoid !== "0000000000000000000000000000000000000000") {
          throw new PushRejectedError("tag-exists");
        }
        if (oid !== "0000000000000000000000000000000000000000" && oldoid !== "0000000000000000000000000000000000000000" && !await _isDescendent({
          fs,
          cache,
          gitdir,
          oid,
          ancestor: oldoid,
          depth: -1
        })) {
          throw new PushRejectedError("not-fast-forward");
        }
      }
    }
    const capabilities = filterCapabilities([...httpRemote.capabilities], ["report-status", "side-band-64k", `agent=${pkg.agent}`]);
    const packstream1 = await writeReceivePackRequest({
      capabilities,
      triplets: [{ oldoid, oid, fullRef: fullRemoteRef }]
    });
    const packstream2 = _delete ? [] : await _pack({
      fs,
      cache,
      gitdir,
      oids: [...objects]
    });
    const res = await GitRemoteHTTP2.connect({
      http,
      onProgress,
      corsProxy,
      service: "git-receive-pack",
      url,
      auth,
      headers,
      body: [...packstream1, ...packstream2]
    });
    const { packfile, progress } = await GitSideBand.demux(res.body);
    if (onMessage) {
      const lines = splitLines(progress);
      forAwait(lines, async (line) => {
        await onMessage(line);
      });
    }
    const result = await parseReceivePackResponse(packfile);
    if (res.headers) {
      result.headers = res.headers;
    }
    if (remote && result.ok && result.refs[fullRemoteRef].ok && !fullRef.startsWith("refs/tags")) {
      const ref2 = `refs/remotes/${remote}/${fullRemoteRef.replace("refs/heads", "")}`;
      if (_delete) {
        await GitRefManager.deleteRef({ fs, gitdir, ref: ref2 });
      } else {
        await GitRefManager.writeRef({ fs, gitdir, ref: ref2, value: oid });
      }
    }
    if (result.ok && Object.values(result.refs).every((result2) => result2.ok)) {
      return result;
    } else {
      const prettyDetails = Object.entries(result.refs).filter(([k, v]) => !v.ok).map(([k, v]) => `
  - ${k}: ${v.error}`).join("");
      throw new GitPushError(prettyDetails, result);
    }
  }
  async function push({
    fs,
    http,
    onProgress,
    onMessage,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    onPrePush,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    remoteRef,
    remote = "origin",
    url,
    force = false,
    delete: _delete = false,
    corsProxy,
    headers = {},
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("http", http);
      assertParameter("gitdir", gitdir);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _push({
        fs: fsp,
        cache,
        http,
        onProgress,
        onMessage,
        onAuth,
        onAuthSuccess,
        onAuthFailure,
        onPrePush,
        gitdir: updatedGitdir,
        ref,
        remoteRef,
        remote,
        url,
        force,
        delete: _delete,
        corsProxy,
        headers
      });
    } catch (err) {
      err.caller = "git.push";
      throw err;
    }
  }
  async function resolveBlob({ fs, cache, gitdir, oid }) {
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type === "tag") {
      oid = GitAnnotatedTag.from(object).parse().object;
      return resolveBlob({ fs, cache, gitdir, oid });
    }
    if (type !== "blob") {
      throw new ObjectTypeError(oid, type, "blob");
    }
    return { oid, blob: new Uint8Array(object) };
  }
  async function _readBlob({
    fs,
    cache,
    gitdir,
    oid,
    filepath = undefined
  }) {
    if (filepath !== undefined) {
      oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
    }
    const blob = await resolveBlob({
      fs,
      cache,
      gitdir,
      oid
    });
    return blob;
  }
  async function readBlob({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    filepath,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _readBlob({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oid,
        filepath
      });
    } catch (err) {
      err.caller = "git.readBlob";
      throw err;
    }
  }
  async function readCommit({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _readCommit({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oid
      });
    } catch (err) {
      err.caller = "git.readCommit";
      throw err;
    }
  }
  async function _readNote({
    fs,
    cache,
    gitdir,
    ref = "refs/notes/commits",
    oid
  }) {
    const parent = await GitRefManager.resolve({ gitdir, fs, ref });
    const { blob } = await _readBlob({
      fs,
      cache,
      gitdir,
      oid: parent,
      filepath: oid
    });
    return blob;
  }
  async function readNote({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref = "refs/notes/commits",
    oid,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      assertParameter("oid", oid);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _readNote({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        ref,
        oid
      });
    } catch (err) {
      err.caller = "git.readNote";
      throw err;
    }
  }
  async function readObject({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    format = "parsed",
    filepath = undefined,
    encoding = undefined,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      if (filepath !== undefined) {
        oid = await resolveFilepath({
          fs,
          cache,
          gitdir: updatedGitdir,
          oid,
          filepath
        });
      }
      const _format = format === "parsed" ? "content" : format;
      const result = await _readObject({
        fs,
        cache,
        gitdir: updatedGitdir,
        oid,
        format: _format
      });
      result.oid = oid;
      if (format === "parsed") {
        result.format = "parsed";
        switch (result.type) {
          case "commit":
            result.object = GitCommit.from(result.object).parse();
            break;
          case "tree":
            result.object = GitTree.from(result.object).entries();
            break;
          case "blob":
            if (encoding) {
              result.object = result.object.toString(encoding);
            } else {
              result.object = new Uint8Array(result.object);
              result.format = "content";
            }
            break;
          case "tag":
            result.object = GitAnnotatedTag.from(result.object).parse();
            break;
          default:
            throw new ObjectTypeError(result.oid, result.type, "blob|commit|tag|tree");
        }
      } else if (result.format === "deflated" || result.format === "wrapped") {
        result.type = result.format;
      }
      return result;
    } catch (err) {
      err.caller = "git.readObject";
      throw err;
    }
  }
  async function _readTag({ fs, cache, gitdir, oid }) {
    const { type, object } = await _readObject({
      fs,
      cache,
      gitdir,
      oid,
      format: "content"
    });
    if (type !== "tag") {
      throw new ObjectTypeError(oid, type, "tag");
    }
    const tag2 = GitAnnotatedTag.from(object);
    const result = {
      oid,
      tag: tag2.parse(),
      payload: tag2.payload()
    };
    return result;
  }
  async function readTag({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _readTag({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oid
      });
    } catch (err) {
      err.caller = "git.readTag";
      throw err;
    }
  }
  async function readTree({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    oid,
    filepath = undefined,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _readTree({
        fs: fsp,
        cache,
        gitdir: updatedGitdir,
        oid,
        filepath
      });
    } catch (err) {
      err.caller = "git.readTree";
      throw err;
    }
  }
  async function remove2({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    filepath,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("filepath", filepath);
      const fsp = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      await GitIndexManager.acquire({ fs: fsp, gitdir: updatedGitdir, cache }, async function(index2) {
        index2.delete({ filepath });
      });
    } catch (err) {
      err.caller = "git.remove";
      throw err;
    }
  }
  async function _removeNote({
    fs,
    cache,
    onSign,
    gitdir,
    ref = "refs/notes/commits",
    oid,
    author,
    committer,
    signingKey
  }) {
    let parent;
    try {
      parent = await GitRefManager.resolve({ gitdir, fs, ref });
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw err;
      }
    }
    const result = await _readTree({
      fs,
      cache,
      gitdir,
      oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
    });
    let tree = result.tree;
    tree = tree.filter((entry) => entry.path !== oid);
    const treeOid = await _writeTree({
      fs,
      gitdir,
      tree
    });
    const commitOid = await _commit({
      fs,
      cache,
      onSign,
      gitdir,
      ref,
      tree: treeOid,
      parent: parent && [parent],
      message: `Note removed by 'isomorphic-git removeNote'
`,
      author,
      committer,
      signingKey
    });
    return commitOid;
  }
  async function removeNote({
    fs: _fs,
    onSign,
    dir,
    gitdir = join5(dir, ".git"),
    ref = "refs/notes/commits",
    oid,
    author: _author,
    committer: _committer,
    signingKey,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("oid", oid);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const author = await normalizeAuthorObject({
        fs,
        gitdir: updatedGitdir,
        author: _author
      });
      if (!author)
        throw new MissingNameError("author");
      const committer = await normalizeCommitterObject({
        fs,
        gitdir: updatedGitdir,
        author,
        committer: _committer
      });
      if (!committer)
        throw new MissingNameError("committer");
      return await _removeNote({
        fs,
        cache,
        onSign,
        gitdir: updatedGitdir,
        ref,
        oid,
        author,
        committer,
        signingKey
      });
    } catch (err) {
      err.caller = "git.removeNote";
      throw err;
    }
  }
  async function _renameBranch({
    fs,
    gitdir,
    oldref,
    ref,
    checkout: checkout2 = false
  }) {
    if (!isValidRef(ref, true)) {
      throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
    }
    if (!isValidRef(oldref, true)) {
      throw new InvalidRefNameError(oldref, cleanGitRef.clean(oldref));
    }
    const fulloldref = `refs/heads/${oldref}`;
    const fullnewref = `refs/heads/${ref}`;
    const newexist = await GitRefManager.exists({ fs, gitdir, ref: fullnewref });
    if (newexist) {
      throw new AlreadyExistsError("branch", ref, false);
    }
    const value = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: fulloldref,
      depth: 1
    });
    await GitRefManager.writeRef({ fs, gitdir, ref: fullnewref, value });
    await GitRefManager.deleteRef({ fs, gitdir, ref: fulloldref });
    const fullCurrentBranchRef = await _currentBranch({
      fs,
      gitdir,
      fullname: true
    });
    const isCurrentBranch = fullCurrentBranchRef === fulloldref;
    if (checkout2 || isCurrentBranch) {
      await GitRefManager.writeSymbolicRef({
        fs,
        gitdir,
        ref: "HEAD",
        value: fullnewref
      });
    }
  }
  async function renameBranch({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    oldref,
    checkout: checkout2 = false
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      assertParameter("oldref", oldref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _renameBranch({
        fs: fsp,
        gitdir: updatedGitdir,
        ref,
        oldref,
        checkout: checkout2
      });
    } catch (err) {
      err.caller = "git.renameBranch";
      throw err;
    }
  }
  async function hashObject$1({ gitdir, type, object }) {
    return shasum(GitObject.wrap({ type, object }));
  }
  async function resetIndex({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    filepath,
    ref,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("filepath", filepath);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      let oid;
      let workdirOid;
      try {
        oid = await GitRefManager.resolve({
          fs,
          gitdir: updatedGitdir,
          ref: ref || "HEAD"
        });
      } catch (e) {
        if (ref) {
          throw e;
        }
      }
      if (oid) {
        try {
          oid = await resolveFilepath({
            fs,
            cache,
            gitdir: updatedGitdir,
            oid,
            filepath
          });
        } catch (e) {
          oid = null;
        }
      }
      let stats = {
        ctime: new Date(0),
        mtime: new Date(0),
        dev: 0,
        ino: 0,
        mode: 0,
        uid: 0,
        gid: 0,
        size: 0
      };
      const object = dir && await fs.read(join5(dir, filepath));
      if (object) {
        workdirOid = await hashObject$1({
          gitdir: updatedGitdir,
          type: "blob",
          object
        });
        if (oid === workdirOid) {
          stats = await fs.lstat(join5(dir, filepath));
        }
      }
      await GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async function(index2) {
        index2.delete({ filepath });
        if (oid) {
          index2.insert({ filepath, stats, oid });
        }
      });
    } catch (err) {
      err.caller = "git.reset";
      throw err;
    }
  }
  async function resolveRef({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    depth
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      const oid = await GitRefManager.resolve({
        fs: fsp,
        gitdir: updatedGitdir,
        ref,
        depth
      });
      return oid;
    } catch (err) {
      err.caller = "git.resolveRef";
      throw err;
    }
  }
  async function setConfig({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    path: path2,
    value,
    append = false
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("path", path2);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const config = await GitConfigManager.get({ fs, gitdir: updatedGitdir });
      if (append) {
        await config.append(path2, value);
      } else {
        await config.set(path2, value);
      }
      await GitConfigManager.save({ fs, gitdir: updatedGitdir, config });
    } catch (err) {
      err.caller = "git.setConfig";
      throw err;
    }
  }
  async function _writeCommit({ fs, gitdir, commit: commit2 }) {
    const object = GitCommit.from(commit2).toObject();
    const oid = await _writeObject({
      fs,
      gitdir,
      type: "commit",
      object,
      format: "content"
    });
    return oid;
  }

  class GitRefStash {
    static get timezoneOffsetForRefLogEntry() {
      const offsetMinutes = new Date().getTimezoneOffset();
      const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
      const offsetMinutesFormatted = Math.abs(offsetMinutes % 60).toString().padStart(2, "0");
      const sign = offsetMinutes > 0 ? "-" : "+";
      return `${sign}${offsetHours.toString().padStart(2, "0")}${offsetMinutesFormatted}`;
    }
    static createStashReflogEntry(author, stashCommit, message) {
      const nameNoSpace = author.name.replace(/\s/g, "");
      const z40 = "0000000000000000000000000000000000000000";
      const timestamp = Math.floor(Date.now() / 1000);
      const timezoneOffset = GitRefStash.timezoneOffsetForRefLogEntry;
      return `${z40} ${stashCommit} ${nameNoSpace} ${author.email} ${timestamp} ${timezoneOffset}	${message}
`;
    }
    static getStashReflogEntry(reflogString, parsed = false) {
      const reflogLines = reflogString.split(`
`);
      const entries = reflogLines.filter((l) => l).reverse().map((line, idx) => parsed ? `stash@{${idx}}: ${line.split("\t")[1]}` : line);
      return entries;
    }
  }

  class GitStashManager {
    constructor({ fs, dir, gitdir = join5(dir, ".git") }) {
      Object.assign(this, {
        fs,
        dir,
        gitdir,
        _author: null
      });
    }
    static get refStash() {
      return "refs/stash";
    }
    static get refLogsStash() {
      return "logs/refs/stash";
    }
    get refStashPath() {
      return join5(this.gitdir, GitStashManager.refStash);
    }
    get refLogsStashPath() {
      return join5(this.gitdir, GitStashManager.refLogsStash);
    }
    async getAuthor() {
      if (!this._author) {
        this._author = await normalizeAuthorObject({
          fs: this.fs,
          gitdir: this.gitdir,
          author: {}
        });
        if (!this._author)
          throw new MissingNameError("author");
      }
      return this._author;
    }
    async getStashSHA(refIdx, stashEntries) {
      if (!await this.fs.exists(this.refStashPath)) {
        return null;
      }
      const entries = stashEntries || await this.readStashReflogs({ parsed: false });
      return entries[refIdx].split(" ")[1];
    }
    async writeStashCommit({ message, tree, parent }) {
      return _writeCommit({
        fs: this.fs,
        gitdir: this.gitdir,
        commit: {
          message,
          tree,
          parent,
          author: await this.getAuthor(),
          committer: await this.getAuthor()
        }
      });
    }
    async readStashCommit(refIdx) {
      const stashEntries = await this.readStashReflogs({ parsed: false });
      if (refIdx !== 0) {
        if (refIdx < 0 || refIdx > stashEntries.length - 1) {
          throw new InvalidRefNameError(`stash@${refIdx}`, "number that is in range of [0, num of stash pushed]");
        }
      }
      const stashSHA = await this.getStashSHA(refIdx, stashEntries);
      if (!stashSHA) {
        return {};
      }
      return _readCommit({
        fs: this.fs,
        cache: {},
        gitdir: this.gitdir,
        oid: stashSHA
      });
    }
    async writeStashRef(stashCommit) {
      return GitRefManager.writeRef({
        fs: this.fs,
        gitdir: this.gitdir,
        ref: GitStashManager.refStash,
        value: stashCommit
      });
    }
    async writeStashReflogEntry({ stashCommit, message }) {
      const author = await this.getAuthor();
      const entry = GitRefStash.createStashReflogEntry(author, stashCommit, message);
      const filepath = this.refLogsStashPath;
      await acquireLock$1({ filepath, entry }, async () => {
        const appendTo = await this.fs.exists(filepath) ? await this.fs.read(filepath, "utf8") : "";
        await this.fs.write(filepath, appendTo + entry, "utf8");
      });
    }
    async readStashReflogs({ parsed = false }) {
      if (!await this.fs.exists(this.refLogsStashPath)) {
        return [];
      }
      const reflogString = await this.fs.read(this.refLogsStashPath, "utf8");
      return GitRefStash.getStashReflogEntry(reflogString, parsed);
    }
  }
  async function _createStashCommit({ fs, dir, gitdir, message = "" }) {
    const stashMgr = new GitStashManager({ fs, dir, gitdir });
    await stashMgr.getAuthor();
    const branch2 = await _currentBranch({
      fs,
      gitdir,
      fullname: false
    });
    const headCommit = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: "HEAD"
    });
    const headCommitObj = await readCommit({ fs, dir, gitdir, oid: headCommit });
    const headMsg = headCommitObj.commit.message;
    const stashCommitParents = [headCommit];
    let stashCommitTree = null;
    let workDirCompareBase = TREE({ ref: "HEAD" });
    const indexTree = await writeTreeChanges({
      fs,
      dir,
      gitdir,
      treePair: [TREE({ ref: "HEAD" }), "stage"]
    });
    if (indexTree) {
      const stashCommitOne = await stashMgr.writeStashCommit({
        message: `stash-Index: WIP on ${branch2} - ${new Date().toISOString()}`,
        tree: indexTree,
        parent: stashCommitParents
      });
      stashCommitParents.push(stashCommitOne);
      stashCommitTree = indexTree;
      workDirCompareBase = STAGE();
    }
    const workingTree = await writeTreeChanges({
      fs,
      dir,
      gitdir,
      treePair: [workDirCompareBase, "workdir"]
    });
    if (workingTree) {
      const workingHeadCommit = await stashMgr.writeStashCommit({
        message: `stash-WorkDir: WIP on ${branch2} - ${new Date().toISOString()}`,
        tree: workingTree,
        parent: [stashCommitParents[stashCommitParents.length - 1]]
      });
      stashCommitParents.push(workingHeadCommit);
      stashCommitTree = workingTree;
    }
    if (!stashCommitTree || !indexTree && !workingTree) {
      throw new NotFoundError("changes, nothing to stash");
    }
    const stashMsg = (message.trim() || `WIP on ${branch2}`) + `: ${headCommit.substring(0, 7)} ${headMsg}`;
    const stashCommit = await stashMgr.writeStashCommit({
      message: stashMsg,
      tree: stashCommitTree,
      parent: stashCommitParents
    });
    return { stashCommit, stashMsg, branch: branch2, stashMgr };
  }
  async function _stashPush({ fs, dir, gitdir, message = "" }) {
    const { stashCommit, stashMsg, branch: branch2, stashMgr } = await _createStashCommit({
      fs,
      dir,
      gitdir,
      message
    });
    await stashMgr.writeStashRef(stashCommit);
    await stashMgr.writeStashReflogEntry({
      stashCommit,
      message: stashMsg
    });
    await checkout({
      fs,
      dir,
      gitdir,
      ref: branch2,
      track: false,
      force: true
    });
    return stashCommit;
  }
  async function _stashCreate({ fs, dir, gitdir, message = "" }) {
    const { stashCommit } = await _createStashCommit({
      fs,
      dir,
      gitdir,
      message
    });
    return stashCommit;
  }
  async function _stashApply({ fs, dir, gitdir, refIdx = 0 }) {
    const stashMgr = new GitStashManager({ fs, dir, gitdir });
    const stashCommit = await stashMgr.readStashCommit(refIdx);
    const { parent: stashParents = null } = stashCommit.commit ? stashCommit.commit : {};
    if (!stashParents || !Array.isArray(stashParents)) {
      return;
    }
    for (let i = 0;i < stashParents.length - 1; i++) {
      const applyingCommit = await _readCommit({
        fs,
        cache: {},
        gitdir,
        oid: stashParents[i + 1]
      });
      const wasStaged = applyingCommit.commit.message.startsWith("stash-Index");
      await applyTreeChanges({
        fs,
        dir,
        gitdir,
        stashCommit: stashParents[i + 1],
        parentCommit: stashParents[i],
        wasStaged
      });
    }
  }
  async function _stashDrop({ fs, dir, gitdir, refIdx = 0 }) {
    const stashMgr = new GitStashManager({ fs, dir, gitdir });
    const stashCommit = await stashMgr.readStashCommit(refIdx);
    if (!stashCommit.commit) {
      return;
    }
    const stashRefPath = stashMgr.refStashPath;
    await acquireLock$1(stashRefPath, async () => {
      if (await fs.exists(stashRefPath)) {
        await fs.rm(stashRefPath);
      }
    });
    const reflogEntries = await stashMgr.readStashReflogs({ parsed: false });
    if (!reflogEntries.length) {
      return;
    }
    reflogEntries.splice(refIdx, 1);
    const stashReflogPath = stashMgr.refLogsStashPath;
    await acquireLock$1({ reflogEntries, stashReflogPath, stashMgr }, async () => {
      if (reflogEntries.length) {
        await fs.write(stashReflogPath, reflogEntries.reverse().join(`
`) + `
`, "utf8");
        const lastStashCommit = reflogEntries[reflogEntries.length - 1].split(" ")[1];
        await stashMgr.writeStashRef(lastStashCommit);
      } else {
        await fs.rm(stashReflogPath);
      }
    });
  }
  async function _stashList({ fs, dir, gitdir }) {
    const stashMgr = new GitStashManager({ fs, dir, gitdir });
    return stashMgr.readStashReflogs({ parsed: true });
  }
  async function _stashClear({ fs, dir, gitdir }) {
    const stashMgr = new GitStashManager({ fs, dir, gitdir });
    const stashRefPath = [stashMgr.refStashPath, stashMgr.refLogsStashPath];
    await acquireLock$1(stashRefPath, async () => {
      await Promise.all(stashRefPath.map(async (path2) => {
        if (await fs.exists(path2)) {
          return fs.rm(path2);
        }
      }));
    });
  }
  async function _stashPop({ fs, dir, gitdir, refIdx = 0 }) {
    await _stashApply({ fs, dir, gitdir, refIdx });
    await _stashDrop({ fs, dir, gitdir, refIdx });
  }
  async function stash({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    op = "push",
    message = "",
    refIdx = 0
  }) {
    assertParameter("fs", fs);
    assertParameter("dir", dir);
    assertParameter("gitdir", gitdir);
    assertParameter("op", op);
    const stashMap = {
      push: _stashPush,
      apply: _stashApply,
      drop: _stashDrop,
      list: _stashList,
      clear: _stashClear,
      pop: _stashPop,
      create: _stashCreate
    };
    const opsNeedRefIdx = ["apply", "drop", "pop"];
    try {
      const _fs = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp: _fs, dotgit: gitdir });
      const folders = ["refs", "logs", "logs/refs"];
      folders.map((f) => join5(updatedGitdir, f)).forEach(async (folder) => {
        if (!await _fs.exists(folder)) {
          await _fs.mkdir(folder);
        }
      });
      const opFunc = stashMap[op];
      if (opFunc) {
        if (opsNeedRefIdx.includes(op) && refIdx < 0) {
          throw new InvalidRefNameError(`stash@${refIdx}`, "number that is in range of [0, num of stash pushed]");
        }
        return await opFunc({
          fs: _fs,
          dir,
          gitdir: updatedGitdir,
          message,
          refIdx
        });
      }
      throw new Error(`To be implemented: ${op}`);
    } catch (err) {
      err.caller = "git.stash";
      throw err;
    }
  }
  async function status({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    filepath,
    cache = {}
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("filepath", filepath);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const ignored = await GitIgnoreManager.isIgnored({
        fs,
        gitdir: updatedGitdir,
        dir,
        filepath
      });
      if (ignored) {
        return "ignored";
      }
      const headTree = await getHeadTree({ fs, cache, gitdir: updatedGitdir });
      const treeOid = await getOidAtPath({
        fs,
        cache,
        gitdir: updatedGitdir,
        tree: headTree,
        path: filepath
      });
      const indexEntry = await GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async function(index2) {
        for (const entry of index2) {
          if (entry.path === filepath)
            return entry;
        }
        return null;
      });
      const stats = await fs.lstat(join5(dir, filepath));
      const H = treeOid !== null;
      const I = indexEntry !== null;
      const W = stats !== null;
      const getWorkdirOid = async () => {
        if (I && !compareStats(indexEntry, stats)) {
          return indexEntry.oid;
        } else {
          const object = await fs.read(join5(dir, filepath));
          const workdirOid = await hashObject$1({
            gitdir: updatedGitdir,
            type: "blob",
            object
          });
          if (I && indexEntry.oid === workdirOid) {
            if (stats.size !== -1) {
              GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async function(index2) {
                index2.insert({ filepath, stats, oid: workdirOid });
              });
            }
          }
          return workdirOid;
        }
      };
      if (!H && !W && !I)
        return "absent";
      if (!H && !W && I)
        return "*absent";
      if (!H && W && !I)
        return "*added";
      if (!H && W && I) {
        const workdirOid = await getWorkdirOid();
        return workdirOid === indexEntry.oid ? "added" : "*added";
      }
      if (H && !W && !I)
        return "deleted";
      if (H && !W && I) {
        return treeOid === indexEntry.oid ? "*deleted" : "*deleted";
      }
      if (H && W && !I) {
        const workdirOid = await getWorkdirOid();
        return workdirOid === treeOid ? "*undeleted" : "*undeletemodified";
      }
      if (H && W && I) {
        const workdirOid = await getWorkdirOid();
        if (workdirOid === treeOid) {
          return workdirOid === indexEntry.oid ? "unmodified" : "*unmodified";
        } else {
          return workdirOid === indexEntry.oid ? "modified" : "*modified";
        }
      }
    } catch (err) {
      err.caller = "git.status";
      throw err;
    }
  }
  async function getOidAtPath({ fs, cache, gitdir: updatedGitdir, tree, path: path2 }) {
    if (typeof path2 === "string")
      path2 = path2.split("/");
    const dirname3 = path2.shift();
    for (const entry of tree) {
      if (entry.path === dirname3) {
        if (path2.length === 0) {
          return entry.oid;
        }
        const { type, object } = await _readObject({
          fs,
          cache,
          gitdir: updatedGitdir,
          oid: entry.oid
        });
        if (type === "tree") {
          const tree2 = GitTree.from(object);
          return getOidAtPath({ fs, cache, gitdir: updatedGitdir, tree: tree2, path: path2 });
        }
        if (type === "blob") {
          throw new ObjectTypeError(entry.oid, type, "blob", path2.join("/"));
        }
      }
    }
    return null;
  }
  async function getHeadTree({ fs, cache, gitdir: updatedGitdir }) {
    let oid;
    try {
      oid = await GitRefManager.resolve({
        fs,
        gitdir: updatedGitdir,
        ref: "HEAD"
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return [];
      }
    }
    const { tree } = await _readTree({ fs, cache, gitdir: updatedGitdir, oid });
    return tree;
  }
  async function statusMatrix({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref = "HEAD",
    filepaths = ["."],
    filter,
    cache = {},
    ignored: shouldIgnore = false
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      return await _walk({
        fs,
        cache,
        dir,
        gitdir: updatedGitdir,
        trees: [TREE({ ref }), WORKDIR(), STAGE()],
        map: async function(filepath, [head, workdir, stage]) {
          if (!head && !stage && workdir) {
            if (!shouldIgnore) {
              const isIgnored2 = await GitIgnoreManager.isIgnored({
                fs,
                dir,
                filepath
              });
              if (isIgnored2) {
                return null;
              }
            }
          }
          if (!filepaths.some((base) => worthWalking(filepath, base))) {
            return null;
          }
          if (filter) {
            if (!filter(filepath))
              return;
          }
          const [headType, workdirType, stageType] = await Promise.all([
            head && head.type(),
            workdir && workdir.type(),
            stage && stage.type()
          ]);
          const isBlob = [headType, workdirType, stageType].includes("blob");
          if ((headType === "tree" || headType === "special") && !isBlob)
            return;
          if (headType === "commit")
            return null;
          if ((workdirType === "tree" || workdirType === "special") && !isBlob)
            return;
          if (stageType === "commit")
            return null;
          if ((stageType === "tree" || stageType === "special") && !isBlob)
            return;
          const headOid = headType === "blob" ? await head.oid() : undefined;
          const stageOid = stageType === "blob" ? await stage.oid() : undefined;
          let workdirOid;
          if (headType !== "blob" && workdirType === "blob" && stageType !== "blob") {
            workdirOid = "42";
          } else if (workdirType === "blob") {
            workdirOid = await workdir.oid();
          }
          const entry = [undefined, headOid, workdirOid, stageOid];
          const result = entry.map((value) => entry.indexOf(value));
          result.shift();
          return [filepath, ...result];
        }
      });
    } catch (err) {
      err.caller = "git.statusMatrix";
      throw err;
    }
  }
  async function tag({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    object,
    force = false
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      const fs = new FileSystem(_fs);
      if (ref === undefined) {
        throw new MissingParameterError("ref");
      }
      ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      const value = await GitRefManager.resolve({
        fs,
        gitdir: updatedGitdir,
        ref: object || "HEAD"
      });
      if (!force && await GitRefManager.exists({ fs, gitdir: updatedGitdir, ref })) {
        throw new AlreadyExistsError("tag", ref);
      }
      await GitRefManager.writeRef({ fs, gitdir: updatedGitdir, ref, value });
    } catch (err) {
      err.caller = "git.tag";
      throw err;
    }
  }
  async function updateIndex$1({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    cache = {},
    filepath,
    oid,
    mode,
    add: add2,
    remove: remove3,
    force
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("filepath", filepath);
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      if (remove3) {
        return await GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async function(index2) {
          if (!force) {
            const fileStats2 = await fs.lstat(join5(dir, filepath));
            if (fileStats2) {
              if (fileStats2.isDirectory()) {
                throw new InvalidFilepathError("directory");
              }
              return;
            }
          }
          if (index2.has({ filepath })) {
            index2.delete({
              filepath
            });
          }
        });
      }
      let fileStats;
      if (!oid) {
        fileStats = await fs.lstat(join5(dir, filepath));
        if (!fileStats) {
          throw new NotFoundError(`file at "${filepath}" on disk and "remove" not set`);
        }
        if (fileStats.isDirectory()) {
          throw new InvalidFilepathError("directory");
        }
      }
      return await GitIndexManager.acquire({ fs, gitdir: updatedGitdir, cache }, async function(index2) {
        if (!add2 && !index2.has({ filepath })) {
          throw new NotFoundError(`file at "${filepath}" in index and "add" not set`);
        }
        let stats;
        if (!oid) {
          stats = fileStats;
          const object = stats.isSymbolicLink() ? await fs.readlink(join5(dir, filepath)) : await fs.read(join5(dir, filepath));
          oid = await _writeObject({
            fs,
            gitdir: updatedGitdir,
            type: "blob",
            format: "content",
            object
          });
        } else {
          stats = {
            ctime: new Date(0),
            mtime: new Date(0),
            dev: 0,
            ino: 0,
            mode,
            uid: 0,
            gid: 0,
            size: 0
          };
        }
        index2.insert({
          filepath,
          oid,
          stats
        });
        return oid;
      });
    } catch (err) {
      err.caller = "git.updateIndex";
      throw err;
    }
  }
  function version() {
    try {
      return pkg.version;
    } catch (err) {
      err.caller = "git.version";
      throw err;
    }
  }
  async function walk({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    trees,
    map,
    reduce,
    iterate,
    cache = {}
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("trees", trees);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _walk({
        fs: fsp,
        cache,
        dir,
        gitdir: updatedGitdir,
        trees,
        map,
        reduce,
        iterate
      });
    } catch (err) {
      err.caller = "git.walk";
      throw err;
    }
  }
  async function writeBlob({ fs, dir, gitdir = join5(dir, ".git"), blob }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("blob", blob);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _writeObject({
        fs: fsp,
        gitdir: updatedGitdir,
        type: "blob",
        object: blob,
        format: "content"
      });
    } catch (err) {
      err.caller = "git.writeBlob";
      throw err;
    }
  }
  async function writeCommit({
    fs,
    dir,
    gitdir = join5(dir, ".git"),
    commit: commit2
  }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("commit", commit2);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _writeCommit({
        fs: fsp,
        gitdir: updatedGitdir,
        commit: commit2
      });
    } catch (err) {
      err.caller = "git.writeCommit";
      throw err;
    }
  }
  async function writeObject({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    type,
    object,
    format = "parsed",
    oid,
    encoding = undefined
  }) {
    try {
      const fs = new FileSystem(_fs);
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      if (format === "parsed") {
        switch (type) {
          case "commit":
            object = GitCommit.from(object).toObject();
            break;
          case "tree":
            object = GitTree.from(object).toObject();
            break;
          case "blob":
            object = Buffer.from(object, encoding);
            break;
          case "tag":
            object = GitAnnotatedTag.from(object).toObject();
            break;
          default:
            throw new ObjectTypeError(oid || "", type, "blob|commit|tag|tree");
        }
        format = "content";
      }
      oid = await _writeObject({
        fs,
        gitdir: updatedGitdir,
        type,
        object,
        oid,
        format
      });
      return oid;
    } catch (err) {
      err.caller = "git.writeObject";
      throw err;
    }
  }
  async function writeRef({
    fs: _fs,
    dir,
    gitdir = join5(dir, ".git"),
    ref,
    value,
    force = false,
    symbolic = false
  }) {
    try {
      assertParameter("fs", _fs);
      assertParameter("gitdir", gitdir);
      assertParameter("ref", ref);
      assertParameter("value", value);
      const fs = new FileSystem(_fs);
      if (!isValidRef(ref, true)) {
        throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
      }
      const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
      if (!force && await GitRefManager.exists({ fs, gitdir: updatedGitdir, ref })) {
        throw new AlreadyExistsError("ref", ref);
      }
      if (symbolic) {
        await GitRefManager.writeSymbolicRef({
          fs,
          gitdir: updatedGitdir,
          ref,
          value
        });
      } else {
        value = await GitRefManager.resolve({
          fs,
          gitdir: updatedGitdir,
          ref: value
        });
        await GitRefManager.writeRef({
          fs,
          gitdir: updatedGitdir,
          ref,
          value
        });
      }
    } catch (err) {
      err.caller = "git.writeRef";
      throw err;
    }
  }
  async function _writeTag({ fs, gitdir, tag: tag2 }) {
    const object = GitAnnotatedTag.from(tag2).toObject();
    const oid = await _writeObject({
      fs,
      gitdir,
      type: "tag",
      object,
      format: "content"
    });
    return oid;
  }
  async function writeTag({ fs, dir, gitdir = join5(dir, ".git"), tag: tag2 }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("tag", tag2);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _writeTag({
        fs: fsp,
        gitdir: updatedGitdir,
        tag: tag2
      });
    } catch (err) {
      err.caller = "git.writeTag";
      throw err;
    }
  }
  async function writeTree({ fs, dir, gitdir = join5(dir, ".git"), tree }) {
    try {
      assertParameter("fs", fs);
      assertParameter("gitdir", gitdir);
      assertParameter("tree", tree);
      const fsp = new FileSystem(fs);
      const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
      return await _writeTree({
        fs: fsp,
        gitdir: updatedGitdir,
        tree
      });
    } catch (err) {
      err.caller = "git.writeTree";
      throw err;
    }
  }
  var index = {
    Errors,
    STAGE,
    TREE,
    WORKDIR,
    add,
    abortMerge,
    addNote,
    addRemote,
    annotatedTag,
    branch,
    cherryPick,
    checkout,
    clone,
    commit,
    getConfig,
    getConfigAll,
    setConfig,
    currentBranch,
    deleteBranch,
    deleteRef,
    deleteRemote,
    deleteTag,
    expandOid,
    expandRef,
    fastForward,
    fetch: fetch2,
    findMergeBase,
    findRoot,
    getRemoteInfo,
    getRemoteInfo2,
    hashBlob,
    indexPack,
    init,
    isDescendent,
    isIgnored,
    listBranches,
    listFiles,
    listNotes,
    listRefs,
    listRemotes,
    listServerRefs,
    listTags,
    log,
    merge,
    packObjects,
    pull,
    push,
    readBlob,
    readCommit,
    readNote,
    readObject,
    readTag,
    readTree,
    remove: remove2,
    removeNote,
    renameBranch,
    resetIndex,
    updateIndex: updateIndex$1,
    resolveRef,
    status,
    statusMatrix,
    tag,
    version,
    walk,
    writeBlob,
    writeCommit,
    writeObject,
    writeRef,
    writeTag,
    writeTree,
    stash
  };
  exports.Errors = Errors;
  exports.STAGE = STAGE;
  exports.TREE = TREE;
  exports.WORKDIR = WORKDIR;
  exports.abortMerge = abortMerge;
  exports.add = add;
  exports.addNote = addNote;
  exports.addRemote = addRemote;
  exports.annotatedTag = annotatedTag;
  exports.branch = branch;
  exports.checkout = checkout;
  exports.cherryPick = cherryPick;
  exports.clone = clone;
  exports.commit = commit;
  exports.currentBranch = currentBranch;
  exports.default = index;
  exports.deleteBranch = deleteBranch;
  exports.deleteRef = deleteRef;
  exports.deleteRemote = deleteRemote;
  exports.deleteTag = deleteTag;
  exports.expandOid = expandOid;
  exports.expandRef = expandRef;
  exports.fastForward = fastForward;
  exports.fetch = fetch2;
  exports.findMergeBase = findMergeBase;
  exports.findRoot = findRoot;
  exports.getConfig = getConfig;
  exports.getConfigAll = getConfigAll;
  exports.getRemoteInfo = getRemoteInfo;
  exports.getRemoteInfo2 = getRemoteInfo2;
  exports.hashBlob = hashBlob;
  exports.indexPack = indexPack;
  exports.init = init;
  exports.isDescendent = isDescendent;
  exports.isIgnored = isIgnored;
  exports.listBranches = listBranches;
  exports.listFiles = listFiles;
  exports.listNotes = listNotes;
  exports.listRefs = listRefs;
  exports.listRemotes = listRemotes;
  exports.listServerRefs = listServerRefs;
  exports.listTags = listTags;
  exports.log = log;
  exports.merge = merge;
  exports.packObjects = packObjects;
  exports.pull = pull;
  exports.push = push;
  exports.readBlob = readBlob;
  exports.readCommit = readCommit;
  exports.readNote = readNote;
  exports.readObject = readObject;
  exports.readTag = readTag;
  exports.readTree = readTree;
  exports.remove = remove2;
  exports.removeNote = removeNote;
  exports.renameBranch = renameBranch;
  exports.resetIndex = resetIndex;
  exports.resolveRef = resolveRef;
  exports.setConfig = setConfig;
  exports.stash = stash;
  exports.status = status;
  exports.statusMatrix = statusMatrix;
  exports.tag = tag;
  exports.updateIndex = updateIndex$1;
  exports.version = version;
  exports.walk = walk;
  exports.writeBlob = writeBlob;
  exports.writeCommit = writeCommit;
  exports.writeObject = writeObject;
  exports.writeRef = writeRef;
  exports.writeTag = writeTag;
  exports.writeTree = writeTree;
});

// ../../node_modules/.pnpm/simple-concat@1.0.1/node_modules/simple-concat/index.js
var require_simple_concat = __commonJS((exports, module) => {
  /*! simple-concat. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  module.exports = function(stream, cb) {
    var chunks = [];
    stream.on("data", function(chunk) {
      chunks.push(chunk);
    });
    stream.once("end", function() {
      if (cb)
        cb(null, Buffer.concat(chunks));
      cb = null;
    });
    stream.once("error", function(err) {
      if (cb)
        cb(err);
      cb = null;
    });
  };
});

// ../../node_modules/.pnpm/mimic-response@3.1.0/node_modules/mimic-response/index.js
var require_mimic_response = __commonJS((exports, module) => {
  var knownProperties = [
    "aborted",
    "complete",
    "headers",
    "httpVersion",
    "httpVersionMinor",
    "httpVersionMajor",
    "method",
    "rawHeaders",
    "rawTrailers",
    "setTimeout",
    "socket",
    "statusCode",
    "statusMessage",
    "trailers",
    "url"
  ];
  module.exports = (fromStream, toStream) => {
    if (toStream._readableState.autoDestroy) {
      throw new Error("The second stream must have the `autoDestroy` option set to `false`");
    }
    const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));
    const properties = {};
    for (const property of fromProperties) {
      if (property in toStream) {
        continue;
      }
      properties[property] = {
        get() {
          const value = fromStream[property];
          const isFunction = typeof value === "function";
          return isFunction ? value.bind(fromStream) : value;
        },
        set(value) {
          fromStream[property] = value;
        },
        enumerable: true,
        configurable: false
      };
    }
    Object.defineProperties(toStream, properties);
    fromStream.once("aborted", () => {
      toStream.destroy();
      toStream.emit("aborted");
    });
    fromStream.once("close", () => {
      if (fromStream.complete) {
        if (toStream.readable) {
          toStream.once("end", () => {
            toStream.emit("close");
          });
        } else {
          toStream.emit("close");
        }
      } else {
        toStream.emit("close");
      }
    });
    return toStream;
  };
});

// ../../node_modules/.pnpm/decompress-response@6.0.0/node_modules/decompress-response/index.js
var require_decompress_response = __commonJS((exports, module) => {
  var { Transform, PassThrough } = __require("stream");
  var zlib = __require("zlib");
  var mimicResponse = require_mimic_response();
  module.exports = (response) => {
    const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
    if (!["gzip", "deflate", "br"].includes(contentEncoding)) {
      return response;
    }
    const isBrotli = contentEncoding === "br";
    if (isBrotli && typeof zlib.createBrotliDecompress !== "function") {
      response.destroy(new Error("Brotli is not supported on Node.js < 12"));
      return response;
    }
    let isEmpty = true;
    const checker = new Transform({
      transform(data, _encoding, callback) {
        isEmpty = false;
        callback(null, data);
      },
      flush(callback) {
        callback();
      }
    });
    const finalStream = new PassThrough({
      autoDestroy: false,
      destroy(error, callback) {
        response.destroy();
        callback(error);
      }
    });
    const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
    decompressStream.once("error", (error) => {
      if (isEmpty && !response.readable) {
        finalStream.end();
        return;
      }
      finalStream.destroy(error);
    });
    mimicResponse(response, finalStream);
    response.pipe(checker).pipe(decompressStream).pipe(finalStream);
    return finalStream;
  };
});

// ../../node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS((exports, module) => {
  module.exports = wrappy;
  function wrappy(fn, cb) {
    if (fn && cb)
      return wrappy(fn)(cb);
    if (typeof fn !== "function")
      throw new TypeError("need wrapper function");
    Object.keys(fn).forEach(function(k) {
      wrapper[k] = fn[k];
    });
    return wrapper;
    function wrapper() {
      var args = new Array(arguments.length);
      for (var i = 0;i < args.length; i++) {
        args[i] = arguments[i];
      }
      var ret = fn.apply(this, args);
      var cb2 = args[args.length - 1];
      if (typeof ret === "function" && ret !== cb2) {
        Object.keys(cb2).forEach(function(k) {
          ret[k] = cb2[k];
        });
      }
      return ret;
    }
  }
});

// ../../node_modules/.pnpm/once@1.4.0/node_modules/once/once.js
var require_once = __commonJS((exports, module) => {
  var wrappy = require_wrappy();
  module.exports = wrappy(once);
  module.exports.strict = wrappy(onceStrict);
  once.proto = once(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return once(this);
      },
      configurable: true
    });
    Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return onceStrict(this);
      },
      configurable: true
    });
  });
  function once(fn) {
    var f = function() {
      if (f.called)
        return f.value;
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    f.called = false;
    return f;
  }
  function onceStrict(fn) {
    var f = function() {
      if (f.called)
        throw new Error(f.onceError);
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    var name = fn.name || "Function wrapped with `once`";
    f.onceError = name + " shouldn't be called more than once";
    f.called = false;
    return f;
  }
});

// ../../node_modules/.pnpm/simple-get@4.0.1/node_modules/simple-get/index.js
var require_simple_get = __commonJS((exports, module) => {
  /*! simple-get. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  module.exports = simpleGet;
  var concat = require_simple_concat();
  var decompressResponse = require_decompress_response();
  var http = __require("http");
  var https = __require("https");
  var once = require_once();
  var querystring = __require("querystring");
  var url = __require("url");
  var isStream = (o) => o !== null && typeof o === "object" && typeof o.pipe === "function";
  function simpleGet(opts, cb) {
    opts = Object.assign({ maxRedirects: 10 }, typeof opts === "string" ? { url: opts } : opts);
    cb = once(cb);
    if (opts.url) {
      const { hostname, port, protocol: protocol2, auth, path: path2 } = url.parse(opts.url);
      delete opts.url;
      if (!hostname && !port && !protocol2 && !auth)
        opts.path = path2;
      else
        Object.assign(opts, { hostname, port, protocol: protocol2, auth, path: path2 });
    }
    const headers = { "accept-encoding": "gzip, deflate" };
    if (opts.headers)
      Object.keys(opts.headers).forEach((k) => headers[k.toLowerCase()] = opts.headers[k]);
    opts.headers = headers;
    let body;
    if (opts.body) {
      body = opts.json && !isStream(opts.body) ? JSON.stringify(opts.body) : opts.body;
    } else if (opts.form) {
      body = typeof opts.form === "string" ? opts.form : querystring.stringify(opts.form);
      opts.headers["content-type"] = "application/x-www-form-urlencoded";
    }
    if (body) {
      if (!opts.method)
        opts.method = "POST";
      if (!isStream(body))
        opts.headers["content-length"] = Buffer.byteLength(body);
      if (opts.json && !opts.form)
        opts.headers["content-type"] = "application/json";
    }
    delete opts.body;
    delete opts.form;
    if (opts.json)
      opts.headers.accept = "application/json";
    if (opts.method)
      opts.method = opts.method.toUpperCase();
    const originalHost = opts.hostname;
    const protocol = opts.protocol === "https:" ? https : http;
    const req = protocol.request(opts, (res) => {
      if (opts.followRedirects !== false && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        opts.url = res.headers.location;
        delete opts.headers.host;
        res.resume();
        const redirectHost = url.parse(opts.url).hostname;
        if (redirectHost !== null && redirectHost !== originalHost) {
          delete opts.headers.cookie;
          delete opts.headers.authorization;
        }
        if (opts.method === "POST" && [301, 302].includes(res.statusCode)) {
          opts.method = "GET";
          delete opts.headers["content-length"];
          delete opts.headers["content-type"];
        }
        if (opts.maxRedirects-- === 0)
          return cb(new Error("too many redirects"));
        else
          return simpleGet(opts, cb);
      }
      const tryUnzip = typeof decompressResponse === "function" && opts.method !== "HEAD";
      cb(null, tryUnzip ? decompressResponse(res) : res);
    });
    req.on("timeout", () => {
      req.abort();
      cb(new Error("Request timed out"));
    });
    req.on("error", cb);
    if (isStream(body))
      body.on("error", cb).pipe(req);
    else
      req.end(body);
    return req;
  }
  simpleGet.concat = (opts, cb) => {
    return simpleGet(opts, (err, res) => {
      if (err)
        return cb(err);
      concat(res, (err2, data) => {
        if (err2)
          return cb(err2);
        if (opts.json) {
          try {
            data = JSON.parse(data.toString());
          } catch (err3) {
            return cb(err3, res, data);
          }
        }
        cb(null, res, data);
      });
    });
  };
  ["get", "post", "put", "patch", "head", "delete"].forEach((method) => {
    simpleGet[method] = (opts, cb) => {
      if (typeof opts === "string")
        opts = { url: opts };
      return simpleGet(Object.assign({ method: method.toUpperCase() }, opts), cb);
    };
  });
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/ours/primordials.js
var require_primordials = __commonJS((exports, module) => {
  class AggregateError2 extends Error {
    constructor(errors) {
      if (!Array.isArray(errors)) {
        throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
      }
      let message = "";
      for (let i = 0;i < errors.length; i++) {
        message += `    ${errors[i].stack}
`;
      }
      super(message);
      this.name = "AggregateError";
      this.errors = errors;
    }
  }
  module.exports = {
    AggregateError: AggregateError2,
    ArrayIsArray(self) {
      return Array.isArray(self);
    },
    ArrayPrototypeIncludes(self, el) {
      return self.includes(el);
    },
    ArrayPrototypeIndexOf(self, el) {
      return self.indexOf(el);
    },
    ArrayPrototypeJoin(self, sep) {
      return self.join(sep);
    },
    ArrayPrototypeMap(self, fn) {
      return self.map(fn);
    },
    ArrayPrototypePop(self, el) {
      return self.pop(el);
    },
    ArrayPrototypePush(self, el) {
      return self.push(el);
    },
    ArrayPrototypeSlice(self, start, end) {
      return self.slice(start, end);
    },
    Error,
    FunctionPrototypeCall(fn, thisArgs, ...args) {
      return fn.call(thisArgs, ...args);
    },
    FunctionPrototypeSymbolHasInstance(self, instance) {
      return Function.prototype[Symbol.hasInstance].call(self, instance);
    },
    MathFloor: Math.floor,
    Number,
    NumberIsInteger: Number.isInteger,
    NumberIsNaN: Number.isNaN,
    NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
    NumberParseInt: Number.parseInt,
    ObjectDefineProperties(self, props) {
      return Object.defineProperties(self, props);
    },
    ObjectDefineProperty(self, name, prop) {
      return Object.defineProperty(self, name, prop);
    },
    ObjectGetOwnPropertyDescriptor(self, name) {
      return Object.getOwnPropertyDescriptor(self, name);
    },
    ObjectKeys(obj) {
      return Object.keys(obj);
    },
    ObjectSetPrototypeOf(target, proto) {
      return Object.setPrototypeOf(target, proto);
    },
    Promise,
    PromisePrototypeCatch(self, fn) {
      return self.catch(fn);
    },
    PromisePrototypeThen(self, thenFn, catchFn) {
      return self.then(thenFn, catchFn);
    },
    PromiseReject(err) {
      return Promise.reject(err);
    },
    PromiseResolve(val) {
      return Promise.resolve(val);
    },
    ReflectApply: Reflect.apply,
    RegExpPrototypeTest(self, value) {
      return self.test(value);
    },
    SafeSet: Set,
    String,
    StringPrototypeSlice(self, start, end) {
      return self.slice(start, end);
    },
    StringPrototypeToLowerCase(self) {
      return self.toLowerCase();
    },
    StringPrototypeToUpperCase(self) {
      return self.toUpperCase();
    },
    StringPrototypeTrim(self) {
      return self.trim();
    },
    Symbol,
    SymbolFor: Symbol.for,
    SymbolAsyncIterator: Symbol.asyncIterator,
    SymbolHasInstance: Symbol.hasInstance,
    SymbolIterator: Symbol.iterator,
    SymbolDispose: Symbol.dispose || Symbol("Symbol.dispose"),
    SymbolAsyncDispose: Symbol.asyncDispose || Symbol("Symbol.asyncDispose"),
    TypedArrayPrototypeSet(self, buf, len) {
      return self.set(buf, len);
    },
    Boolean,
    Uint8Array
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/ours/util/inspect.js
var require_inspect = __commonJS((exports, module) => {
  module.exports = {
    format(format, ...args) {
      return format.replace(/%([sdifj])/g, function(...[_unused, type]) {
        const replacement = args.shift();
        if (type === "f") {
          return replacement.toFixed(6);
        } else if (type === "j") {
          return JSON.stringify(replacement);
        } else if (type === "s" && typeof replacement === "object") {
          const ctor = replacement.constructor !== Object ? replacement.constructor.name : "";
          return `${ctor} {}`.trim();
        } else {
          return replacement.toString();
        }
      });
    },
    inspect(value) {
      switch (typeof value) {
        case "string":
          if (value.includes("'")) {
            if (!value.includes('"')) {
              return `"${value}"`;
            } else if (!value.includes("`") && !value.includes("${")) {
              return `\`${value}\``;
            }
          }
          return `'${value}'`;
        case "number":
          if (isNaN(value)) {
            return "NaN";
          } else if (Object.is(value, -0)) {
            return String(value);
          }
          return value;
        case "bigint":
          return `${String(value)}n`;
        case "boolean":
        case "undefined":
          return String(value);
        case "object":
          return "{}";
      }
    }
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/ours/errors.js
var require_errors = __commonJS((exports, module) => {
  var { format, inspect } = require_inspect();
  var { AggregateError: CustomAggregateError } = require_primordials();
  var AggregateError2 = globalThis.AggregateError || CustomAggregateError;
  var kIsNodeError = Symbol("kIsNodeError");
  var kTypes = [
    "string",
    "function",
    "number",
    "object",
    "Function",
    "Object",
    "boolean",
    "bigint",
    "symbol"
  ];
  var classRegExp = /^([A-Z][a-z0-9]*)+$/;
  var nodeInternalPrefix = "__node_internal_";
  var codes = {};
  function assert(value, message) {
    if (!value) {
      throw new codes.ERR_INTERNAL_ASSERTION(message);
    }
  }
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (;i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function getMessage(key, msg, args) {
    if (typeof msg === "function") {
      assert(msg.length <= args.length, `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`);
      return msg(...args);
    }
    const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
    assert(expectedLength === args.length, `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`);
    if (args.length === 0) {
      return msg;
    }
    return format(msg, ...args);
  }
  function E(code, message, Base) {
    if (!Base) {
      Base = Error;
    }

    class NodeError extends Base {
      constructor(...args) {
        super(getMessage(code, message, args));
      }
      toString() {
        return `${this.name} [${code}]: ${this.message}`;
      }
    }
    Object.defineProperties(NodeError.prototype, {
      name: {
        value: Base.name,
        writable: true,
        enumerable: false,
        configurable: true
      },
      toString: {
        value() {
          return `${this.name} [${code}]: ${this.message}`;
        },
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
    NodeError.prototype.code = code;
    NodeError.prototype[kIsNodeError] = true;
    codes[code] = NodeError;
  }
  function hideStackFrames(fn) {
    const hidden = nodeInternalPrefix + fn.name;
    Object.defineProperty(fn, "name", {
      value: hidden
    });
    return fn;
  }
  function aggregateTwoErrors(innerError, outerError) {
    if (innerError && outerError && innerError !== outerError) {
      if (Array.isArray(outerError.errors)) {
        outerError.errors.push(innerError);
        return outerError;
      }
      const err = new AggregateError2([outerError, innerError], outerError.message);
      err.code = outerError.code;
      return err;
    }
    return innerError || outerError;
  }

  class AbortError extends Error {
    constructor(message = "The operation was aborted", options = undefined) {
      if (options !== undefined && typeof options !== "object") {
        throw new codes.ERR_INVALID_ARG_TYPE("options", "Object", options);
      }
      super(message, options);
      this.code = "ABORT_ERR";
      this.name = "AbortError";
    }
  }
  E("ERR_ASSERTION", "%s", Error);
  E("ERR_INVALID_ARG_TYPE", (name, expected, actual) => {
    assert(typeof name === "string", "'name' must be a string");
    if (!Array.isArray(expected)) {
      expected = [expected];
    }
    let msg = "The ";
    if (name.endsWith(" argument")) {
      msg += `${name} `;
    } else {
      msg += `"${name}" ${name.includes(".") ? "property" : "argument"} `;
    }
    msg += "must be ";
    const types = [];
    const instances = [];
    const other = [];
    for (const value of expected) {
      assert(typeof value === "string", "All expected entries have to be of type string");
      if (kTypes.includes(value)) {
        types.push(value.toLowerCase());
      } else if (classRegExp.test(value)) {
        instances.push(value);
      } else {
        assert(value !== "object", 'The value "object" should be written as "Object"');
        other.push(value);
      }
    }
    if (instances.length > 0) {
      const pos = types.indexOf("object");
      if (pos !== -1) {
        types.splice(types, pos, 1);
        instances.push("Object");
      }
    }
    if (types.length > 0) {
      switch (types.length) {
        case 1:
          msg += `of type ${types[0]}`;
          break;
        case 2:
          msg += `one of type ${types[0]} or ${types[1]}`;
          break;
        default: {
          const last = types.pop();
          msg += `one of type ${types.join(", ")}, or ${last}`;
        }
      }
      if (instances.length > 0 || other.length > 0) {
        msg += " or ";
      }
    }
    if (instances.length > 0) {
      switch (instances.length) {
        case 1:
          msg += `an instance of ${instances[0]}`;
          break;
        case 2:
          msg += `an instance of ${instances[0]} or ${instances[1]}`;
          break;
        default: {
          const last = instances.pop();
          msg += `an instance of ${instances.join(", ")}, or ${last}`;
        }
      }
      if (other.length > 0) {
        msg += " or ";
      }
    }
    switch (other.length) {
      case 0:
        break;
      case 1:
        if (other[0].toLowerCase() !== other[0]) {
          msg += "an ";
        }
        msg += `${other[0]}`;
        break;
      case 2:
        msg += `one of ${other[0]} or ${other[1]}`;
        break;
      default: {
        const last = other.pop();
        msg += `one of ${other.join(", ")}, or ${last}`;
      }
    }
    if (actual == null) {
      msg += `. Received ${actual}`;
    } else if (typeof actual === "function" && actual.name) {
      msg += `. Received function ${actual.name}`;
    } else if (typeof actual === "object") {
      var _actual$constructor;
      if ((_actual$constructor = actual.constructor) !== null && _actual$constructor !== undefined && _actual$constructor.name) {
        msg += `. Received an instance of ${actual.constructor.name}`;
      } else {
        const inspected = inspect(actual, {
          depth: -1
        });
        msg += `. Received ${inspected}`;
      }
    } else {
      let inspected = inspect(actual, {
        colors: false
      });
      if (inspected.length > 25) {
        inspected = `${inspected.slice(0, 25)}...`;
      }
      msg += `. Received type ${typeof actual} (${inspected})`;
    }
    return msg;
  }, TypeError);
  E("ERR_INVALID_ARG_VALUE", (name, value, reason = "is invalid") => {
    let inspected = inspect(value);
    if (inspected.length > 128) {
      inspected = inspected.slice(0, 128) + "...";
    }
    const type = name.includes(".") ? "property" : "argument";
    return `The ${type} '${name}' ${reason}. Received ${inspected}`;
  }, TypeError);
  E("ERR_INVALID_RETURN_VALUE", (input, name, value) => {
    var _value$constructor;
    const type = value !== null && value !== undefined && (_value$constructor = value.constructor) !== null && _value$constructor !== undefined && _value$constructor.name ? `instance of ${value.constructor.name}` : `type ${typeof value}`;
    return `Expected ${input} to be returned from the "${name}"` + ` function but got ${type}.`;
  }, TypeError);
  E("ERR_MISSING_ARGS", (...args) => {
    assert(args.length > 0, "At least one arg needs to be specified");
    let msg;
    const len = args.length;
    args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(" or ");
    switch (len) {
      case 1:
        msg += `The ${args[0]} argument`;
        break;
      case 2:
        msg += `The ${args[0]} and ${args[1]} arguments`;
        break;
      default:
        {
          const last = args.pop();
          msg += `The ${args.join(", ")}, and ${last} arguments`;
        }
        break;
    }
    return `${msg} must be specified`;
  }, TypeError);
  E("ERR_OUT_OF_RANGE", (str, range, input) => {
    assert(range, 'Missing "range" argument');
    let received;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === "bigint") {
      received = String(input);
      const limit = BigInt(2) ** BigInt(32);
      if (input > limit || input < -limit) {
        received = addNumericalSeparator(received);
      }
      received += "n";
    } else {
      received = inspect(input);
    }
    return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`;
  }, RangeError);
  E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
  E("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
  E("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error);
  E("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
  E("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
  E("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
  E("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
  E("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
  E("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error);
  E("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
  E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);
  module.exports = {
    AbortError,
    aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
    hideStackFrames,
    codes
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/ours/util.js
var require_util = __commonJS((exports, module) => {
  var bufferModule = __require("buffer");
  var { format, inspect } = require_inspect();
  var {
    codes: { ERR_INVALID_ARG_TYPE }
  } = require_errors();
  var { kResistStopPropagation, AggregateError: AggregateError2, SymbolDispose } = require_primordials();
  var AbortSignal = globalThis.AbortSignal || __require("abort-controller").AbortSignal;
  var AbortController = globalThis.AbortController || __require("abort-controller").AbortController;
  var AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
  var Blob2 = globalThis.Blob || bufferModule.Blob;
  var isBlob = typeof Blob2 !== "undefined" ? function isBlob2(b) {
    return b instanceof Blob2;
  } : function isBlob2(b) {
    return false;
  };
  var validateAbortSignal = (signal, name) => {
    if (signal !== undefined && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
      throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
    }
  };
  var validateFunction = (value, name) => {
    if (typeof value !== "function") {
      throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
    }
  };
  module.exports = {
    AggregateError: AggregateError2,
    kEmptyObject: Object.freeze({}),
    once(callback) {
      let called = false;
      return function(...args) {
        if (called) {
          return;
        }
        called = true;
        callback.apply(this, args);
      };
    },
    createDeferredPromise: function() {
      let resolve3;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve3 = res;
        reject = rej;
      });
      return {
        promise,
        resolve: resolve3,
        reject
      };
    },
    promisify(fn) {
      return new Promise((resolve3, reject) => {
        fn((err, ...args) => {
          if (err) {
            return reject(err);
          }
          return resolve3(...args);
        });
      });
    },
    debuglog() {
      return function() {};
    },
    format,
    inspect,
    types: {
      isAsyncFunction(fn) {
        return fn instanceof AsyncFunction;
      },
      isArrayBufferView(arr) {
        return ArrayBuffer.isView(arr);
      }
    },
    isBlob,
    deprecate(fn, message) {
      return fn;
    },
    addAbortListener: __require("events").addAbortListener || function addAbortListener(signal, listener) {
      if (signal === undefined) {
        throw new ERR_INVALID_ARG_TYPE("signal", "AbortSignal", signal);
      }
      validateAbortSignal(signal, "signal");
      validateFunction(listener, "listener");
      let removeEventListener;
      if (signal.aborted) {
        queueMicrotask(() => listener());
      } else {
        signal.addEventListener("abort", listener, {
          __proto__: null,
          once: true,
          [kResistStopPropagation]: true
        });
        removeEventListener = () => {
          signal.removeEventListener("abort", listener);
        };
      }
      return {
        __proto__: null,
        [SymbolDispose]() {
          var _removeEventListener;
          (_removeEventListener = removeEventListener) === null || _removeEventListener === undefined || _removeEventListener();
        }
      };
    },
    AbortSignalAny: AbortSignal.any || function AbortSignalAny(signals) {
      if (signals.length === 1) {
        return signals[0];
      }
      const ac = new AbortController;
      const abort = () => ac.abort();
      signals.forEach((signal) => {
        validateAbortSignal(signal, "signals");
        signal.addEventListener("abort", abort, {
          once: true
        });
      });
      ac.signal.addEventListener("abort", () => {
        signals.forEach((signal) => signal.removeEventListener("abort", abort));
      }, {
        once: true
      });
      return ac.signal;
    }
  };
  module.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/validators.js
var require_validators = __commonJS((exports, module) => {
  var {
    ArrayIsArray,
    ArrayPrototypeIncludes,
    ArrayPrototypeJoin,
    ArrayPrototypeMap,
    NumberIsInteger,
    NumberIsNaN,
    NumberMAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER,
    NumberParseInt,
    ObjectPrototypeHasOwnProperty,
    RegExpPrototypeExec,
    String: String2,
    StringPrototypeToUpperCase,
    StringPrototypeTrim
  } = require_primordials();
  var {
    hideStackFrames,
    codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
  } = require_errors();
  var { normalizeEncoding } = require_util();
  var { isAsyncFunction, isArrayBufferView } = require_util().types;
  var signals = {};
  function isInt32(value) {
    return value === (value | 0);
  }
  function isUint32(value) {
    return value === value >>> 0;
  }
  var octalReg = /^[0-7]+$/;
  var modeDesc = "must be a 32-bit unsigned integer or an octal string";
  function parseFileMode(value, name, def) {
    if (typeof value === "undefined") {
      value = def;
    }
    if (typeof value === "string") {
      if (RegExpPrototypeExec(octalReg, value) === null) {
        throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc);
      }
      value = NumberParseInt(value, 8);
    }
    validateUint32(value, name);
    return value;
  }
  var validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
    if (typeof value !== "number")
      throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    if (!NumberIsInteger(value))
      throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    if (value < min || value > max)
      throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
  });
  var validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
    if (typeof value !== "number") {
      throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    }
    if (!NumberIsInteger(value)) {
      throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    }
    if (value < min || value > max) {
      throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    }
  });
  var validateUint32 = hideStackFrames((value, name, positive = false) => {
    if (typeof value !== "number") {
      throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    }
    if (!NumberIsInteger(value)) {
      throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    }
    const min = positive ? 1 : 0;
    const max = 4294967295;
    if (value < min || value > max) {
      throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    }
  });
  function validateString(value, name) {
    if (typeof value !== "string")
      throw new ERR_INVALID_ARG_TYPE(name, "string", value);
  }
  function validateNumber(value, name, min = undefined, max) {
    if (typeof value !== "number")
      throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    if (min != null && value < min || max != null && value > max || (min != null || max != null) && NumberIsNaN(value)) {
      throw new ERR_OUT_OF_RANGE(name, `${min != null ? `>= ${min}` : ""}${min != null && max != null ? " && " : ""}${max != null ? `<= ${max}` : ""}`, value);
    }
  }
  var validateOneOf = hideStackFrames((value, name, oneOf) => {
    if (!ArrayPrototypeIncludes(oneOf, value)) {
      const allowed = ArrayPrototypeJoin(ArrayPrototypeMap(oneOf, (v) => typeof v === "string" ? `'${v}'` : String2(v)), ", ");
      const reason = "must be one of: " + allowed;
      throw new ERR_INVALID_ARG_VALUE(name, value, reason);
    }
  });
  function validateBoolean(value, name) {
    if (typeof value !== "boolean")
      throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
  }
  function getOwnPropertyValueOrDefault(options, key, defaultValue) {
    return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key];
  }
  var validateObject = hideStackFrames((value, name, options = null) => {
    const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
    const allowFunction = getOwnPropertyValueOrDefault(options, "allowFunction", false);
    const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
    if (!nullable && value === null || !allowArray && ArrayIsArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
      throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
    }
  });
  var validateDictionary = hideStackFrames((value, name) => {
    if (value != null && typeof value !== "object" && typeof value !== "function") {
      throw new ERR_INVALID_ARG_TYPE(name, "a dictionary", value);
    }
  });
  var validateArray = hideStackFrames((value, name, minLength = 0) => {
    if (!ArrayIsArray(value)) {
      throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
    }
    if (value.length < minLength) {
      const reason = `must be longer than ${minLength}`;
      throw new ERR_INVALID_ARG_VALUE(name, value, reason);
    }
  });
  function validateStringArray(value, name) {
    validateArray(value, name);
    for (let i = 0;i < value.length; i++) {
      validateString(value[i], `${name}[${i}]`);
    }
  }
  function validateBooleanArray(value, name) {
    validateArray(value, name);
    for (let i = 0;i < value.length; i++) {
      validateBoolean(value[i], `${name}[${i}]`);
    }
  }
  function validateAbortSignalArray(value, name) {
    validateArray(value, name);
    for (let i = 0;i < value.length; i++) {
      const signal = value[i];
      const indexedName = `${name}[${i}]`;
      if (signal == null) {
        throw new ERR_INVALID_ARG_TYPE(indexedName, "AbortSignal", signal);
      }
      validateAbortSignal(signal, indexedName);
    }
  }
  function validateSignalName(signal, name = "signal") {
    validateString(signal, name);
    if (signals[signal] === undefined) {
      if (signals[StringPrototypeToUpperCase(signal)] !== undefined) {
        throw new ERR_UNKNOWN_SIGNAL(signal + " (signals must use all capital letters)");
      }
      throw new ERR_UNKNOWN_SIGNAL(signal);
    }
  }
  var validateBuffer = hideStackFrames((buffer, name = "buffer") => {
    if (!isArrayBufferView(buffer)) {
      throw new ERR_INVALID_ARG_TYPE(name, ["Buffer", "TypedArray", "DataView"], buffer);
    }
  });
  function validateEncoding(data, encoding) {
    const normalizedEncoding = normalizeEncoding(encoding);
    const length = data.length;
    if (normalizedEncoding === "hex" && length % 2 !== 0) {
      throw new ERR_INVALID_ARG_VALUE("encoding", encoding, `is invalid for data of length ${length}`);
    }
  }
  function validatePort(port, name = "Port", allowZero = true) {
    if (typeof port !== "number" && typeof port !== "string" || typeof port === "string" && StringPrototypeTrim(port).length === 0 || +port !== +port >>> 0 || port > 65535 || port === 0 && !allowZero) {
      throw new ERR_SOCKET_BAD_PORT(name, port, allowZero);
    }
    return port | 0;
  }
  var validateAbortSignal = hideStackFrames((signal, name) => {
    if (signal !== undefined && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
      throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
    }
  });
  var validateFunction = hideStackFrames((value, name) => {
    if (typeof value !== "function")
      throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
  });
  var validatePlainFunction = hideStackFrames((value, name) => {
    if (typeof value !== "function" || isAsyncFunction(value))
      throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
  });
  var validateUndefined = hideStackFrames((value, name) => {
    if (value !== undefined)
      throw new ERR_INVALID_ARG_TYPE(name, "undefined", value);
  });
  function validateUnion(value, name, union) {
    if (!ArrayPrototypeIncludes(union, value)) {
      throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, "|")}')`, value);
    }
  }
  var linkValueRegExp = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
  function validateLinkHeaderFormat(value, name) {
    if (typeof value === "undefined" || !RegExpPrototypeExec(linkValueRegExp, value)) {
      throw new ERR_INVALID_ARG_VALUE(name, value, 'must be an array or string of format "</styles.css>; rel=preload; as=style"');
    }
  }
  function validateLinkHeaderValue(hints) {
    if (typeof hints === "string") {
      validateLinkHeaderFormat(hints, "hints");
      return hints;
    } else if (ArrayIsArray(hints)) {
      const hintsLength = hints.length;
      let result = "";
      if (hintsLength === 0) {
        return result;
      }
      for (let i = 0;i < hintsLength; i++) {
        const link = hints[i];
        validateLinkHeaderFormat(link, "hints");
        result += link;
        if (i !== hintsLength - 1) {
          result += ", ";
        }
      }
      return result;
    }
    throw new ERR_INVALID_ARG_VALUE("hints", hints, 'must be an array or string of format "</styles.css>; rel=preload; as=style"');
  }
  module.exports = {
    isInt32,
    isUint32,
    parseFileMode,
    validateArray,
    validateStringArray,
    validateBooleanArray,
    validateAbortSignalArray,
    validateBoolean,
    validateBuffer,
    validateDictionary,
    validateEncoding,
    validateFunction,
    validateInt32,
    validateInteger,
    validateNumber,
    validateObject,
    validateOneOf,
    validatePlainFunction,
    validatePort,
    validateSignalName,
    validateString,
    validateUint32,
    validateUndefined,
    validateUnion,
    validateAbortSignal,
    validateLinkHeaderValue
  };
});

// ../../node_modules/.pnpm/process@0.11.10/node_modules/process/index.js
var require_process = __commonJS((exports, module) => {
  module.exports = global.process;
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/utils.js
var require_utils = __commonJS((exports, module) => {
  var { SymbolAsyncIterator, SymbolIterator, SymbolFor } = require_primordials();
  var kIsDestroyed = SymbolFor("nodejs.stream.destroyed");
  var kIsErrored = SymbolFor("nodejs.stream.errored");
  var kIsReadable = SymbolFor("nodejs.stream.readable");
  var kIsWritable = SymbolFor("nodejs.stream.writable");
  var kIsDisturbed = SymbolFor("nodejs.stream.disturbed");
  var kIsClosedPromise = SymbolFor("nodejs.webstream.isClosedPromise");
  var kControllerErrorFunction = SymbolFor("nodejs.webstream.controllerErrorFunction");
  function isReadableNodeStream(obj, strict = false) {
    var _obj$_readableState;
    return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!strict || typeof obj.pause === "function" && typeof obj.resume === "function") && (!obj._writableState || ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === undefined ? undefined : _obj$_readableState.readable) !== false) && (!obj._writableState || obj._readableState));
  }
  function isWritableNodeStream(obj) {
    var _obj$_writableState;
    return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === undefined ? undefined : _obj$_writableState.writable) !== false));
  }
  function isDuplexNodeStream(obj) {
    return !!(obj && typeof obj.pipe === "function" && obj._readableState && typeof obj.on === "function" && typeof obj.write === "function");
  }
  function isNodeStream(obj) {
    return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
  }
  function isReadableStream(obj) {
    return !!(obj && !isNodeStream(obj) && typeof obj.pipeThrough === "function" && typeof obj.getReader === "function" && typeof obj.cancel === "function");
  }
  function isWritableStream(obj) {
    return !!(obj && !isNodeStream(obj) && typeof obj.getWriter === "function" && typeof obj.abort === "function");
  }
  function isTransformStream(obj) {
    return !!(obj && !isNodeStream(obj) && typeof obj.readable === "object" && typeof obj.writable === "object");
  }
  function isWebStream(obj) {
    return isReadableStream(obj) || isWritableStream(obj) || isTransformStream(obj);
  }
  function isIterable(obj, isAsync) {
    if (obj == null)
      return false;
    if (isAsync === true)
      return typeof obj[SymbolAsyncIterator] === "function";
    if (isAsync === false)
      return typeof obj[SymbolIterator] === "function";
    return typeof obj[SymbolAsyncIterator] === "function" || typeof obj[SymbolIterator] === "function";
  }
  function isDestroyed(stream) {
    if (!isNodeStream(stream))
      return null;
    const wState = stream._writableState;
    const rState = stream._readableState;
    const state = wState || rState;
    return !!(stream.destroyed || stream[kIsDestroyed] || state !== null && state !== undefined && state.destroyed);
  }
  function isWritableEnded(stream) {
    if (!isWritableNodeStream(stream))
      return null;
    if (stream.writableEnded === true)
      return true;
    const wState = stream._writableState;
    if (wState !== null && wState !== undefined && wState.errored)
      return false;
    if (typeof (wState === null || wState === undefined ? undefined : wState.ended) !== "boolean")
      return null;
    return wState.ended;
  }
  function isWritableFinished(stream, strict) {
    if (!isWritableNodeStream(stream))
      return null;
    if (stream.writableFinished === true)
      return true;
    const wState = stream._writableState;
    if (wState !== null && wState !== undefined && wState.errored)
      return false;
    if (typeof (wState === null || wState === undefined ? undefined : wState.finished) !== "boolean")
      return null;
    return !!(wState.finished || strict === false && wState.ended === true && wState.length === 0);
  }
  function isReadableEnded(stream) {
    if (!isReadableNodeStream(stream))
      return null;
    if (stream.readableEnded === true)
      return true;
    const rState = stream._readableState;
    if (!rState || rState.errored)
      return false;
    if (typeof (rState === null || rState === undefined ? undefined : rState.ended) !== "boolean")
      return null;
    return rState.ended;
  }
  function isReadableFinished(stream, strict) {
    if (!isReadableNodeStream(stream))
      return null;
    const rState = stream._readableState;
    if (rState !== null && rState !== undefined && rState.errored)
      return false;
    if (typeof (rState === null || rState === undefined ? undefined : rState.endEmitted) !== "boolean")
      return null;
    return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
  }
  function isReadable(stream) {
    if (stream && stream[kIsReadable] != null)
      return stream[kIsReadable];
    if (typeof (stream === null || stream === undefined ? undefined : stream.readable) !== "boolean")
      return null;
    if (isDestroyed(stream))
      return false;
    return isReadableNodeStream(stream) && stream.readable && !isReadableFinished(stream);
  }
  function isWritable(stream) {
    if (stream && stream[kIsWritable] != null)
      return stream[kIsWritable];
    if (typeof (stream === null || stream === undefined ? undefined : stream.writable) !== "boolean")
      return null;
    if (isDestroyed(stream))
      return false;
    return isWritableNodeStream(stream) && stream.writable && !isWritableEnded(stream);
  }
  function isFinished(stream, opts) {
    if (!isNodeStream(stream)) {
      return null;
    }
    if (isDestroyed(stream)) {
      return true;
    }
    if ((opts === null || opts === undefined ? undefined : opts.readable) !== false && isReadable(stream)) {
      return false;
    }
    if ((opts === null || opts === undefined ? undefined : opts.writable) !== false && isWritable(stream)) {
      return false;
    }
    return true;
  }
  function isWritableErrored(stream) {
    var _stream$_writableStat, _stream$_writableStat2;
    if (!isNodeStream(stream)) {
      return null;
    }
    if (stream.writableErrored) {
      return stream.writableErrored;
    }
    return (_stream$_writableStat = (_stream$_writableStat2 = stream._writableState) === null || _stream$_writableStat2 === undefined ? undefined : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== undefined ? _stream$_writableStat : null;
  }
  function isReadableErrored(stream) {
    var _stream$_readableStat, _stream$_readableStat2;
    if (!isNodeStream(stream)) {
      return null;
    }
    if (stream.readableErrored) {
      return stream.readableErrored;
    }
    return (_stream$_readableStat = (_stream$_readableStat2 = stream._readableState) === null || _stream$_readableStat2 === undefined ? undefined : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== undefined ? _stream$_readableStat : null;
  }
  function isClosed(stream) {
    if (!isNodeStream(stream)) {
      return null;
    }
    if (typeof stream.closed === "boolean") {
      return stream.closed;
    }
    const wState = stream._writableState;
    const rState = stream._readableState;
    if (typeof (wState === null || wState === undefined ? undefined : wState.closed) === "boolean" || typeof (rState === null || rState === undefined ? undefined : rState.closed) === "boolean") {
      return (wState === null || wState === undefined ? undefined : wState.closed) || (rState === null || rState === undefined ? undefined : rState.closed);
    }
    if (typeof stream._closed === "boolean" && isOutgoingMessage(stream)) {
      return stream._closed;
    }
    return null;
  }
  function isOutgoingMessage(stream) {
    return typeof stream._closed === "boolean" && typeof stream._defaultKeepAlive === "boolean" && typeof stream._removedConnection === "boolean" && typeof stream._removedContLen === "boolean";
  }
  function isServerResponse(stream) {
    return typeof stream._sent100 === "boolean" && isOutgoingMessage(stream);
  }
  function isServerRequest(stream) {
    var _stream$req;
    return typeof stream._consuming === "boolean" && typeof stream._dumped === "boolean" && ((_stream$req = stream.req) === null || _stream$req === undefined ? undefined : _stream$req.upgradeOrConnect) === undefined;
  }
  function willEmitClose(stream) {
    if (!isNodeStream(stream))
      return null;
    const wState = stream._writableState;
    const rState = stream._readableState;
    const state = wState || rState;
    return !state && isServerResponse(stream) || !!(state && state.autoDestroy && state.emitClose && state.closed === false);
  }
  function isDisturbed(stream) {
    var _stream$kIsDisturbed;
    return !!(stream && ((_stream$kIsDisturbed = stream[kIsDisturbed]) !== null && _stream$kIsDisturbed !== undefined ? _stream$kIsDisturbed : stream.readableDidRead || stream.readableAborted));
  }
  function isErrored(stream) {
    var _ref, _ref2, _ref3, _ref4, _ref5, _stream$kIsErrored, _stream$_readableStat3, _stream$_writableStat3, _stream$_readableStat4, _stream$_writableStat4;
    return !!(stream && ((_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_stream$kIsErrored = stream[kIsErrored]) !== null && _stream$kIsErrored !== undefined ? _stream$kIsErrored : stream.readableErrored) !== null && _ref5 !== undefined ? _ref5 : stream.writableErrored) !== null && _ref4 !== undefined ? _ref4 : (_stream$_readableStat3 = stream._readableState) === null || _stream$_readableStat3 === undefined ? undefined : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== undefined ? _ref3 : (_stream$_writableStat3 = stream._writableState) === null || _stream$_writableStat3 === undefined ? undefined : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== undefined ? _ref2 : (_stream$_readableStat4 = stream._readableState) === null || _stream$_readableStat4 === undefined ? undefined : _stream$_readableStat4.errored) !== null && _ref !== undefined ? _ref : (_stream$_writableStat4 = stream._writableState) === null || _stream$_writableStat4 === undefined ? undefined : _stream$_writableStat4.errored));
  }
  module.exports = {
    isDestroyed,
    kIsDestroyed,
    isDisturbed,
    kIsDisturbed,
    isErrored,
    kIsErrored,
    isReadable,
    kIsReadable,
    kIsClosedPromise,
    kControllerErrorFunction,
    kIsWritable,
    isClosed,
    isDuplexNodeStream,
    isFinished,
    isIterable,
    isReadableNodeStream,
    isReadableStream,
    isReadableEnded,
    isReadableFinished,
    isReadableErrored,
    isNodeStream,
    isWebStream,
    isWritable,
    isWritableNodeStream,
    isWritableStream,
    isWritableEnded,
    isWritableFinished,
    isWritableErrored,
    isServerRequest,
    isServerResponse,
    willEmitClose,
    isTransformStream
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS((exports, module) => {
  var process2 = require_process();
  var { AbortError, codes } = require_errors();
  var { ERR_INVALID_ARG_TYPE, ERR_STREAM_PREMATURE_CLOSE } = codes;
  var { kEmptyObject, once } = require_util();
  var { validateAbortSignal, validateFunction, validateObject, validateBoolean } = require_validators();
  var { Promise: Promise2, PromisePrototypeThen, SymbolDispose } = require_primordials();
  var {
    isClosed,
    isReadable,
    isReadableNodeStream,
    isReadableStream,
    isReadableFinished,
    isReadableErrored,
    isWritable,
    isWritableNodeStream,
    isWritableStream,
    isWritableFinished,
    isWritableErrored,
    isNodeStream,
    willEmitClose: _willEmitClose,
    kIsClosedPromise
  } = require_utils();
  var addAbortListener;
  function isRequest(stream) {
    return stream.setHeader && typeof stream.abort === "function";
  }
  var nop = () => {};
  function eos(stream, options, callback) {
    var _options$readable, _options$writable;
    if (arguments.length === 2) {
      callback = options;
      options = kEmptyObject;
    } else if (options == null) {
      options = kEmptyObject;
    } else {
      validateObject(options, "options");
    }
    validateFunction(callback, "callback");
    validateAbortSignal(options.signal, "options.signal");
    callback = once(callback);
    if (isReadableStream(stream) || isWritableStream(stream)) {
      return eosWeb(stream, options, callback);
    }
    if (!isNodeStream(stream)) {
      throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream);
    }
    const readable = (_options$readable = options.readable) !== null && _options$readable !== undefined ? _options$readable : isReadableNodeStream(stream);
    const writable = (_options$writable = options.writable) !== null && _options$writable !== undefined ? _options$writable : isWritableNodeStream(stream);
    const wState = stream._writableState;
    const rState = stream._readableState;
    const onlegacyfinish = () => {
      if (!stream.writable) {
        onfinish();
      }
    };
    let willEmitClose = _willEmitClose(stream) && isReadableNodeStream(stream) === readable && isWritableNodeStream(stream) === writable;
    let writableFinished = isWritableFinished(stream, false);
    const onfinish = () => {
      writableFinished = true;
      if (stream.destroyed) {
        willEmitClose = false;
      }
      if (willEmitClose && (!stream.readable || readable)) {
        return;
      }
      if (!readable || readableFinished) {
        callback.call(stream);
      }
    };
    let readableFinished = isReadableFinished(stream, false);
    const onend = () => {
      readableFinished = true;
      if (stream.destroyed) {
        willEmitClose = false;
      }
      if (willEmitClose && (!stream.writable || writable)) {
        return;
      }
      if (!writable || writableFinished) {
        callback.call(stream);
      }
    };
    const onerror = (err) => {
      callback.call(stream, err);
    };
    let closed = isClosed(stream);
    const onclose = () => {
      closed = true;
      const errored = isWritableErrored(stream) || isReadableErrored(stream);
      if (errored && typeof errored !== "boolean") {
        return callback.call(stream, errored);
      }
      if (readable && !readableFinished && isReadableNodeStream(stream, true)) {
        if (!isReadableFinished(stream, false))
          return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE);
      }
      if (writable && !writableFinished) {
        if (!isWritableFinished(stream, false))
          return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE);
      }
      callback.call(stream);
    };
    const onclosed = () => {
      closed = true;
      const errored = isWritableErrored(stream) || isReadableErrored(stream);
      if (errored && typeof errored !== "boolean") {
        return callback.call(stream, errored);
      }
      callback.call(stream);
    };
    const onrequest = () => {
      stream.req.on("finish", onfinish);
    };
    if (isRequest(stream)) {
      stream.on("complete", onfinish);
      if (!willEmitClose) {
        stream.on("abort", onclose);
      }
      if (stream.req) {
        onrequest();
      } else {
        stream.on("request", onrequest);
      }
    } else if (writable && !wState) {
      stream.on("end", onlegacyfinish);
      stream.on("close", onlegacyfinish);
    }
    if (!willEmitClose && typeof stream.aborted === "boolean") {
      stream.on("aborted", onclose);
    }
    stream.on("end", onend);
    stream.on("finish", onfinish);
    if (options.error !== false) {
      stream.on("error", onerror);
    }
    stream.on("close", onclose);
    if (closed) {
      process2.nextTick(onclose);
    } else if (wState !== null && wState !== undefined && wState.errorEmitted || rState !== null && rState !== undefined && rState.errorEmitted) {
      if (!willEmitClose) {
        process2.nextTick(onclosed);
      }
    } else if (!readable && (!willEmitClose || isReadable(stream)) && (writableFinished || isWritable(stream) === false)) {
      process2.nextTick(onclosed);
    } else if (!writable && (!willEmitClose || isWritable(stream)) && (readableFinished || isReadable(stream) === false)) {
      process2.nextTick(onclosed);
    } else if (rState && stream.req && stream.aborted) {
      process2.nextTick(onclosed);
    }
    const cleanup = () => {
      callback = nop;
      stream.removeListener("aborted", onclose);
      stream.removeListener("complete", onfinish);
      stream.removeListener("abort", onclose);
      stream.removeListener("request", onrequest);
      if (stream.req)
        stream.req.removeListener("finish", onfinish);
      stream.removeListener("end", onlegacyfinish);
      stream.removeListener("close", onlegacyfinish);
      stream.removeListener("finish", onfinish);
      stream.removeListener("end", onend);
      stream.removeListener("error", onerror);
      stream.removeListener("close", onclose);
    };
    if (options.signal && !closed) {
      const abort = () => {
        const endCallback = callback;
        cleanup();
        endCallback.call(stream, new AbortError(undefined, {
          cause: options.signal.reason
        }));
      };
      if (options.signal.aborted) {
        process2.nextTick(abort);
      } else {
        addAbortListener = addAbortListener || require_util().addAbortListener;
        const disposable = addAbortListener(options.signal, abort);
        const originalCallback = callback;
        callback = once((...args) => {
          disposable[SymbolDispose]();
          originalCallback.apply(stream, args);
        });
      }
    }
    return cleanup;
  }
  function eosWeb(stream, options, callback) {
    let isAborted = false;
    let abort = nop;
    if (options.signal) {
      abort = () => {
        isAborted = true;
        callback.call(stream, new AbortError(undefined, {
          cause: options.signal.reason
        }));
      };
      if (options.signal.aborted) {
        process2.nextTick(abort);
      } else {
        addAbortListener = addAbortListener || require_util().addAbortListener;
        const disposable = addAbortListener(options.signal, abort);
        const originalCallback = callback;
        callback = once((...args) => {
          disposable[SymbolDispose]();
          originalCallback.apply(stream, args);
        });
      }
    }
    const resolverFn = (...args) => {
      if (!isAborted) {
        process2.nextTick(() => callback.apply(stream, args));
      }
    };
    PromisePrototypeThen(stream[kIsClosedPromise].promise, resolverFn, resolverFn);
    return nop;
  }
  function finished(stream, opts) {
    var _opts;
    let autoCleanup = false;
    if (opts === null) {
      opts = kEmptyObject;
    }
    if ((_opts = opts) !== null && _opts !== undefined && _opts.cleanup) {
      validateBoolean(opts.cleanup, "cleanup");
      autoCleanup = opts.cleanup;
    }
    return new Promise2((resolve3, reject) => {
      const cleanup = eos(stream, opts, (err) => {
        if (autoCleanup) {
          cleanup();
        }
        if (err) {
          reject(err);
        } else {
          resolve3();
        }
      });
    });
  }
  module.exports = eos;
  module.exports.finished = finished;
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS((exports, module) => {
  var process2 = require_process();
  var {
    aggregateTwoErrors,
    codes: { ERR_MULTIPLE_CALLBACK },
    AbortError
  } = require_errors();
  var { Symbol: Symbol2 } = require_primordials();
  var { kIsDestroyed, isDestroyed, isFinished, isServerRequest } = require_utils();
  var kDestroy = Symbol2("kDestroy");
  var kConstruct = Symbol2("kConstruct");
  function checkError(err, w, r) {
    if (err) {
      err.stack;
      if (w && !w.errored) {
        w.errored = err;
      }
      if (r && !r.errored) {
        r.errored = err;
      }
    }
  }
  function destroy(err, cb) {
    const r = this._readableState;
    const w = this._writableState;
    const s = w || r;
    if (w !== null && w !== undefined && w.destroyed || r !== null && r !== undefined && r.destroyed) {
      if (typeof cb === "function") {
        cb();
      }
      return this;
    }
    checkError(err, w, r);
    if (w) {
      w.destroyed = true;
    }
    if (r) {
      r.destroyed = true;
    }
    if (!s.constructed) {
      this.once(kDestroy, function(er) {
        _destroy(this, aggregateTwoErrors(er, err), cb);
      });
    } else {
      _destroy(this, err, cb);
    }
    return this;
  }
  function _destroy(self, err, cb) {
    let called = false;
    function onDestroy(err2) {
      if (called) {
        return;
      }
      called = true;
      const r = self._readableState;
      const w = self._writableState;
      checkError(err2, w, r);
      if (w) {
        w.closed = true;
      }
      if (r) {
        r.closed = true;
      }
      if (typeof cb === "function") {
        cb(err2);
      }
      if (err2) {
        process2.nextTick(emitErrorCloseNT, self, err2);
      } else {
        process2.nextTick(emitCloseNT, self);
      }
    }
    try {
      self._destroy(err || null, onDestroy);
    } catch (err2) {
      onDestroy(err2);
    }
  }
  function emitErrorCloseNT(self, err) {
    emitErrorNT(self, err);
    emitCloseNT(self);
  }
  function emitCloseNT(self) {
    const r = self._readableState;
    const w = self._writableState;
    if (w) {
      w.closeEmitted = true;
    }
    if (r) {
      r.closeEmitted = true;
    }
    if (w !== null && w !== undefined && w.emitClose || r !== null && r !== undefined && r.emitClose) {
      self.emit("close");
    }
  }
  function emitErrorNT(self, err) {
    const r = self._readableState;
    const w = self._writableState;
    if (w !== null && w !== undefined && w.errorEmitted || r !== null && r !== undefined && r.errorEmitted) {
      return;
    }
    if (w) {
      w.errorEmitted = true;
    }
    if (r) {
      r.errorEmitted = true;
    }
    self.emit("error", err);
  }
  function undestroy() {
    const r = this._readableState;
    const w = this._writableState;
    if (r) {
      r.constructed = true;
      r.closed = false;
      r.closeEmitted = false;
      r.destroyed = false;
      r.errored = null;
      r.errorEmitted = false;
      r.reading = false;
      r.ended = r.readable === false;
      r.endEmitted = r.readable === false;
    }
    if (w) {
      w.constructed = true;
      w.destroyed = false;
      w.closed = false;
      w.closeEmitted = false;
      w.errored = null;
      w.errorEmitted = false;
      w.finalCalled = false;
      w.prefinished = false;
      w.ended = w.writable === false;
      w.ending = w.writable === false;
      w.finished = w.writable === false;
    }
  }
  function errorOrDestroy(stream, err, sync) {
    const r = stream._readableState;
    const w = stream._writableState;
    if (w !== null && w !== undefined && w.destroyed || r !== null && r !== undefined && r.destroyed) {
      return this;
    }
    if (r !== null && r !== undefined && r.autoDestroy || w !== null && w !== undefined && w.autoDestroy)
      stream.destroy(err);
    else if (err) {
      err.stack;
      if (w && !w.errored) {
        w.errored = err;
      }
      if (r && !r.errored) {
        r.errored = err;
      }
      if (sync) {
        process2.nextTick(emitErrorNT, stream, err);
      } else {
        emitErrorNT(stream, err);
      }
    }
  }
  function construct(stream, cb) {
    if (typeof stream._construct !== "function") {
      return;
    }
    const r = stream._readableState;
    const w = stream._writableState;
    if (r) {
      r.constructed = false;
    }
    if (w) {
      w.constructed = false;
    }
    stream.once(kConstruct, cb);
    if (stream.listenerCount(kConstruct) > 1) {
      return;
    }
    process2.nextTick(constructNT, stream);
  }
  function constructNT(stream) {
    let called = false;
    function onConstruct(err) {
      if (called) {
        errorOrDestroy(stream, err !== null && err !== undefined ? err : new ERR_MULTIPLE_CALLBACK);
        return;
      }
      called = true;
      const r = stream._readableState;
      const w = stream._writableState;
      const s = w || r;
      if (r) {
        r.constructed = true;
      }
      if (w) {
        w.constructed = true;
      }
      if (s.destroyed) {
        stream.emit(kDestroy, err);
      } else if (err) {
        errorOrDestroy(stream, err, true);
      } else {
        process2.nextTick(emitConstructNT, stream);
      }
    }
    try {
      stream._construct((err) => {
        process2.nextTick(onConstruct, err);
      });
    } catch (err) {
      process2.nextTick(onConstruct, err);
    }
  }
  function emitConstructNT(stream) {
    stream.emit(kConstruct);
  }
  function isRequest(stream) {
    return (stream === null || stream === undefined ? undefined : stream.setHeader) && typeof stream.abort === "function";
  }
  function emitCloseLegacy(stream) {
    stream.emit("close");
  }
  function emitErrorCloseLegacy(stream, err) {
    stream.emit("error", err);
    process2.nextTick(emitCloseLegacy, stream);
  }
  function destroyer(stream, err) {
    if (!stream || isDestroyed(stream)) {
      return;
    }
    if (!err && !isFinished(stream)) {
      err = new AbortError;
    }
    if (isServerRequest(stream)) {
      stream.socket = null;
      stream.destroy(err);
    } else if (isRequest(stream)) {
      stream.abort();
    } else if (isRequest(stream.req)) {
      stream.req.abort();
    } else if (typeof stream.destroy === "function") {
      stream.destroy(err);
    } else if (typeof stream.close === "function") {
      stream.close();
    } else if (err) {
      process2.nextTick(emitErrorCloseLegacy, stream, err);
    } else {
      process2.nextTick(emitCloseLegacy, stream);
    }
    if (!stream.destroyed) {
      stream[kIsDestroyed] = true;
    }
  }
  module.exports = {
    construct,
    destroyer,
    destroy,
    undestroy,
    errorOrDestroy
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/legacy.js
var require_legacy = __commonJS((exports, module) => {
  var { ArrayIsArray, ObjectSetPrototypeOf } = require_primordials();
  var { EventEmitter: EE } = __require("events");
  function Stream(opts) {
    EE.call(this, opts);
  }
  ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
  ObjectSetPrototypeOf(Stream, EE);
  Stream.prototype.pipe = function(dest, options) {
    const source = this;
    function ondata(chunk) {
      if (dest.writable && dest.write(chunk) === false && source.pause) {
        source.pause();
      }
    }
    source.on("data", ondata);
    function ondrain() {
      if (source.readable && source.resume) {
        source.resume();
      }
    }
    dest.on("drain", ondrain);
    if (!dest._isStdio && (!options || options.end !== false)) {
      source.on("end", onend);
      source.on("close", onclose);
    }
    let didOnEnd = false;
    function onend() {
      if (didOnEnd)
        return;
      didOnEnd = true;
      dest.end();
    }
    function onclose() {
      if (didOnEnd)
        return;
      didOnEnd = true;
      if (typeof dest.destroy === "function")
        dest.destroy();
    }
    function onerror(er) {
      cleanup();
      if (EE.listenerCount(this, "error") === 0) {
        this.emit("error", er);
      }
    }
    prependListener(source, "error", onerror);
    prependListener(dest, "error", onerror);
    function cleanup() {
      source.removeListener("data", ondata);
      dest.removeListener("drain", ondrain);
      source.removeListener("end", onend);
      source.removeListener("close", onclose);
      source.removeListener("error", onerror);
      dest.removeListener("error", onerror);
      source.removeListener("end", cleanup);
      source.removeListener("close", cleanup);
      dest.removeListener("close", cleanup);
    }
    source.on("end", cleanup);
    source.on("close", cleanup);
    dest.on("close", cleanup);
    dest.emit("pipe", source);
    return dest;
  };
  function prependListener(emitter, event, fn) {
    if (typeof emitter.prependListener === "function")
      return emitter.prependListener(event, fn);
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (ArrayIsArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  }
  module.exports = {
    Stream,
    prependListener
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/add-abort-signal.js
var require_add_abort_signal = __commonJS((exports, module) => {
  var { SymbolDispose } = require_primordials();
  var { AbortError, codes } = require_errors();
  var { isNodeStream, isWebStream, kControllerErrorFunction } = require_utils();
  var eos = require_end_of_stream();
  var { ERR_INVALID_ARG_TYPE } = codes;
  var addAbortListener;
  var validateAbortSignal = (signal, name) => {
    if (typeof signal !== "object" || !("aborted" in signal)) {
      throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
    }
  };
  exports.addAbortSignal = function addAbortSignal(signal, stream) {
    validateAbortSignal(signal, "signal");
    if (!isNodeStream(stream) && !isWebStream(stream)) {
      throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream);
    }
    return exports.addAbortSignalNoValidate(signal, stream);
  };
  exports.addAbortSignalNoValidate = function(signal, stream) {
    if (typeof signal !== "object" || !("aborted" in signal)) {
      return stream;
    }
    const onAbort = isNodeStream(stream) ? () => {
      stream.destroy(new AbortError(undefined, {
        cause: signal.reason
      }));
    } : () => {
      stream[kControllerErrorFunction](new AbortError(undefined, {
        cause: signal.reason
      }));
    };
    if (signal.aborted) {
      onAbort();
    } else {
      addAbortListener = addAbortListener || require_util().addAbortListener;
      const disposable = addAbortListener(signal, onAbort);
      eos(stream, disposable[SymbolDispose]);
    }
    return stream;
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS((exports, module) => {
  var { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array: Uint8Array2 } = require_primordials();
  var { Buffer: Buffer2 } = __require("buffer");
  var { inspect } = require_util();
  module.exports = class BufferList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    push(v) {
      const entry = {
        data: v,
        next: null
      };
      if (this.length > 0)
        this.tail.next = entry;
      else
        this.head = entry;
      this.tail = entry;
      ++this.length;
    }
    unshift(v) {
      const entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0)
        this.tail = entry;
      this.head = entry;
      ++this.length;
    }
    shift() {
      if (this.length === 0)
        return;
      const ret = this.head.data;
      if (this.length === 1)
        this.head = this.tail = null;
      else
        this.head = this.head.next;
      --this.length;
      return ret;
    }
    clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
    join(s) {
      if (this.length === 0)
        return "";
      let p = this.head;
      let ret = "" + p.data;
      while ((p = p.next) !== null)
        ret += s + p.data;
      return ret;
    }
    concat(n) {
      if (this.length === 0)
        return Buffer2.alloc(0);
      const ret = Buffer2.allocUnsafe(n >>> 0);
      let p = this.head;
      let i = 0;
      while (p) {
        TypedArrayPrototypeSet(ret, p.data, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    }
    consume(n, hasStrings) {
      const data = this.head.data;
      if (n < data.length) {
        const slice = data.slice(0, n);
        this.head.data = data.slice(n);
        return slice;
      }
      if (n === data.length) {
        return this.shift();
      }
      return hasStrings ? this._getString(n) : this._getBuffer(n);
    }
    first() {
      return this.head.data;
    }
    *[SymbolIterator]() {
      for (let p = this.head;p; p = p.next) {
        yield p.data;
      }
    }
    _getString(n) {
      let ret = "";
      let p = this.head;
      let c = 0;
      do {
        const str = p.data;
        if (n > str.length) {
          ret += str;
          n -= str.length;
        } else {
          if (n === str.length) {
            ret += str;
            ++c;
            if (p.next)
              this.head = p.next;
            else
              this.head = this.tail = null;
          } else {
            ret += StringPrototypeSlice(str, 0, n);
            this.head = p;
            p.data = StringPrototypeSlice(str, n);
          }
          break;
        }
        ++c;
      } while ((p = p.next) !== null);
      this.length -= c;
      return ret;
    }
    _getBuffer(n) {
      const ret = Buffer2.allocUnsafe(n);
      const retLen = n;
      let p = this.head;
      let c = 0;
      do {
        const buf = p.data;
        if (n > buf.length) {
          TypedArrayPrototypeSet(ret, buf, retLen - n);
          n -= buf.length;
        } else {
          if (n === buf.length) {
            TypedArrayPrototypeSet(ret, buf, retLen - n);
            ++c;
            if (p.next)
              this.head = p.next;
            else
              this.head = this.tail = null;
          } else {
            TypedArrayPrototypeSet(ret, new Uint8Array2(buf.buffer, buf.byteOffset, n), retLen - n);
            this.head = p;
            p.data = buf.slice(n);
          }
          break;
        }
        ++c;
      } while ((p = p.next) !== null);
      this.length -= c;
      return ret;
    }
    [Symbol.for("nodejs.util.inspect.custom")](_, options) {
      return inspect(this, {
        ...options,
        depth: 0,
        customInspect: false
      });
    }
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS((exports, module) => {
  var { MathFloor, NumberIsInteger } = require_primordials();
  var { validateInteger } = require_validators();
  var { ERR_INVALID_ARG_VALUE } = require_errors().codes;
  var defaultHighWaterMarkBytes = 16 * 1024;
  var defaultHighWaterMarkObjectMode = 16;
  function highWaterMarkFrom(options, isDuplex, duplexKey) {
    return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
  }
  function getDefaultHighWaterMark(objectMode) {
    return objectMode ? defaultHighWaterMarkObjectMode : defaultHighWaterMarkBytes;
  }
  function setDefaultHighWaterMark(objectMode, value) {
    validateInteger(value, "value", 0);
    if (objectMode) {
      defaultHighWaterMarkObjectMode = value;
    } else {
      defaultHighWaterMarkBytes = value;
    }
  }
  function getHighWaterMark(state, options, duplexKey, isDuplex) {
    const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
    if (hwm != null) {
      if (!NumberIsInteger(hwm) || hwm < 0) {
        const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
        throw new ERR_INVALID_ARG_VALUE(name, hwm);
      }
      return MathFloor(hwm);
    }
    return getDefaultHighWaterMark(state.objectMode);
  }
  module.exports = {
    getHighWaterMark,
    getDefaultHighWaterMark,
    setDefaultHighWaterMark
  };
});

// ../../node_modules/.pnpm/string_decoder@1.3.0/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS((exports) => {
  var Buffer2 = require_safe_buffer().Buffer;
  var isEncoding = Buffer2.isEncoding || function(encoding) {
    encoding = "" + encoding;
    switch (encoding && encoding.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return true;
      default:
        return false;
    }
  };
  function _normalizeEncoding(enc) {
    if (!enc)
      return "utf8";
    var retried;
    while (true) {
      switch (enc) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return enc;
        default:
          if (retried)
            return;
          enc = ("" + enc).toLowerCase();
          retried = true;
      }
    }
  }
  function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
      throw new Error("Unknown encoding: " + enc);
    return nenc || enc;
  }
  exports.StringDecoder = StringDecoder;
  function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch (this.encoding) {
      case "utf16le":
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;
      case "utf8":
        this.fillLast = utf8FillLast;
        nb = 4;
        break;
      case "base64":
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;
      default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer2.allocUnsafe(nb);
  }
  StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0)
      return "";
    var r;
    var i;
    if (this.lastNeed) {
      r = this.fillLast(buf);
      if (r === undefined)
        return "";
      i = this.lastNeed;
      this.lastNeed = 0;
    } else {
      i = 0;
    }
    if (i < buf.length)
      return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || "";
  };
  StringDecoder.prototype.end = utf8End;
  StringDecoder.prototype.text = utf8Text;
  StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
  };
  function utf8CheckByte(byte) {
    if (byte <= 127)
      return 0;
    else if (byte >> 5 === 6)
      return 2;
    else if (byte >> 4 === 14)
      return 3;
    else if (byte >> 3 === 30)
      return 4;
    return byte >> 6 === 2 ? -1 : -2;
  }
  function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1;
    if (j < i)
      return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0)
        self.lastNeed = nb - 1;
      return nb;
    }
    if (--j < i || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0)
        self.lastNeed = nb - 2;
      return nb;
    }
    if (--j < i || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2)
          nb = 0;
        else
          self.lastNeed = nb - 3;
      }
      return nb;
    }
    return 0;
  }
  function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 192) !== 128) {
      self.lastNeed = 0;
      return "\uFFFD";
    }
    if (self.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 192) !== 128) {
        self.lastNeed = 1;
        return "\uFFFD";
      }
      if (self.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 192) !== 128) {
          self.lastNeed = 2;
          return "\uFFFD";
        }
      }
    }
  }
  function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined)
      return r;
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
  }
  function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed)
      return buf.toString("utf8", i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i, end);
  }
  function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + "\uFFFD";
    return r;
  }
  function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
      var r = buf.toString("utf16le", i);
      if (r) {
        var c = r.charCodeAt(r.length - 1);
        if (c >= 55296 && c <= 56319) {
          this.lastNeed = 2;
          this.lastTotal = 4;
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
          return r.slice(0, -1);
        }
      }
      return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString("utf16le", i, buf.length - 1);
  }
  function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed;
      return r + this.lastChar.toString("utf16le", 0, end);
    }
    return r;
  }
  function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0)
      return buf.toString("base64", i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1];
    } else {
      this.lastChar[0] = buf[buf.length - 2];
      this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i, buf.length - n);
  }
  function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    return r;
  }
  function simpleWrite(buf) {
    return buf.toString(this.encoding);
  }
  function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : "";
  }
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/from.js
var require_from = __commonJS((exports, module) => {
  var process2 = require_process();
  var { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = require_primordials();
  var { Buffer: Buffer2 } = __require("buffer");
  var { ERR_INVALID_ARG_TYPE, ERR_STREAM_NULL_VALUES } = require_errors().codes;
  function from(Readable, iterable, opts) {
    let iterator;
    if (typeof iterable === "string" || iterable instanceof Buffer2) {
      return new Readable({
        objectMode: true,
        ...opts,
        read() {
          this.push(iterable);
          this.push(null);
        }
      });
    }
    let isAsync;
    if (iterable && iterable[SymbolAsyncIterator]) {
      isAsync = true;
      iterator = iterable[SymbolAsyncIterator]();
    } else if (iterable && iterable[SymbolIterator]) {
      isAsync = false;
      iterator = iterable[SymbolIterator]();
    } else {
      throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
    }
    const readable = new Readable({
      objectMode: true,
      highWaterMark: 1,
      ...opts
    });
    let reading = false;
    readable._read = function() {
      if (!reading) {
        reading = true;
        next();
      }
    };
    readable._destroy = function(error, cb) {
      PromisePrototypeThen(close(error), () => process2.nextTick(cb, error), (e) => process2.nextTick(cb, e || error));
    };
    async function close(error) {
      const hadError = error !== undefined && error !== null;
      const hasThrow = typeof iterator.throw === "function";
      if (hadError && hasThrow) {
        const { value, done } = await iterator.throw(error);
        await value;
        if (done) {
          return;
        }
      }
      if (typeof iterator.return === "function") {
        const { value } = await iterator.return();
        await value;
      }
    }
    async function next() {
      for (;; ) {
        try {
          const { value, done } = isAsync ? await iterator.next() : iterator.next();
          if (done) {
            readable.push(null);
          } else {
            const res = value && typeof value.then === "function" ? await value : value;
            if (res === null) {
              reading = false;
              throw new ERR_STREAM_NULL_VALUES;
            } else if (readable.push(res)) {
              continue;
            } else {
              reading = false;
            }
          }
        } catch (err) {
          readable.destroy(err);
        }
        break;
      }
    }
    return readable;
  }
  module.exports = from;
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/readable.js
var require_readable = __commonJS((exports, module) => {
  var process2 = require_process();
  var {
    ArrayPrototypeIndexOf,
    NumberIsInteger,
    NumberIsNaN,
    NumberParseInt,
    ObjectDefineProperties,
    ObjectKeys,
    ObjectSetPrototypeOf,
    Promise: Promise2,
    SafeSet,
    SymbolAsyncDispose,
    SymbolAsyncIterator,
    Symbol: Symbol2
  } = require_primordials();
  module.exports = Readable;
  Readable.ReadableState = ReadableState;
  var { EventEmitter: EE } = __require("events");
  var { Stream, prependListener } = require_legacy();
  var { Buffer: Buffer2 } = __require("buffer");
  var { addAbortSignal } = require_add_abort_signal();
  var eos = require_end_of_stream();
  var debug = require_util().debuglog("stream", (fn) => {
    debug = fn;
  });
  var BufferList = require_buffer_list();
  var destroyImpl = require_destroy();
  var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
  var {
    aggregateTwoErrors,
    codes: {
      ERR_INVALID_ARG_TYPE,
      ERR_METHOD_NOT_IMPLEMENTED,
      ERR_OUT_OF_RANGE,
      ERR_STREAM_PUSH_AFTER_EOF,
      ERR_STREAM_UNSHIFT_AFTER_END_EVENT
    },
    AbortError
  } = require_errors();
  var { validateObject } = require_validators();
  var kPaused = Symbol2("kPaused");
  var { StringDecoder } = require_string_decoder();
  var from = require_from();
  ObjectSetPrototypeOf(Readable.prototype, Stream.prototype);
  ObjectSetPrototypeOf(Readable, Stream);
  var nop = () => {};
  var { errorOrDestroy } = destroyImpl;
  var kObjectMode = 1 << 0;
  var kEnded = 1 << 1;
  var kEndEmitted = 1 << 2;
  var kReading = 1 << 3;
  var kConstructed = 1 << 4;
  var kSync = 1 << 5;
  var kNeedReadable = 1 << 6;
  var kEmittedReadable = 1 << 7;
  var kReadableListening = 1 << 8;
  var kResumeScheduled = 1 << 9;
  var kErrorEmitted = 1 << 10;
  var kEmitClose = 1 << 11;
  var kAutoDestroy = 1 << 12;
  var kDestroyed = 1 << 13;
  var kClosed = 1 << 14;
  var kCloseEmitted = 1 << 15;
  var kMultiAwaitDrain = 1 << 16;
  var kReadingMore = 1 << 17;
  var kDataEmitted = 1 << 18;
  function makeBitMapDescriptor(bit) {
    return {
      enumerable: false,
      get() {
        return (this.state & bit) !== 0;
      },
      set(value) {
        if (value)
          this.state |= bit;
        else
          this.state &= ~bit;
      }
    };
  }
  ObjectDefineProperties(ReadableState.prototype, {
    objectMode: makeBitMapDescriptor(kObjectMode),
    ended: makeBitMapDescriptor(kEnded),
    endEmitted: makeBitMapDescriptor(kEndEmitted),
    reading: makeBitMapDescriptor(kReading),
    constructed: makeBitMapDescriptor(kConstructed),
    sync: makeBitMapDescriptor(kSync),
    needReadable: makeBitMapDescriptor(kNeedReadable),
    emittedReadable: makeBitMapDescriptor(kEmittedReadable),
    readableListening: makeBitMapDescriptor(kReadableListening),
    resumeScheduled: makeBitMapDescriptor(kResumeScheduled),
    errorEmitted: makeBitMapDescriptor(kErrorEmitted),
    emitClose: makeBitMapDescriptor(kEmitClose),
    autoDestroy: makeBitMapDescriptor(kAutoDestroy),
    destroyed: makeBitMapDescriptor(kDestroyed),
    closed: makeBitMapDescriptor(kClosed),
    closeEmitted: makeBitMapDescriptor(kCloseEmitted),
    multiAwaitDrain: makeBitMapDescriptor(kMultiAwaitDrain),
    readingMore: makeBitMapDescriptor(kReadingMore),
    dataEmitted: makeBitMapDescriptor(kDataEmitted)
  });
  function ReadableState(options, stream, isDuplex) {
    if (typeof isDuplex !== "boolean")
      isDuplex = stream instanceof require_duplex();
    this.state = kEmitClose | kAutoDestroy | kConstructed | kSync;
    if (options && options.objectMode)
      this.state |= kObjectMode;
    if (isDuplex && options && options.readableObjectMode)
      this.state |= kObjectMode;
    this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
    this.buffer = new BufferList;
    this.length = 0;
    this.pipes = [];
    this.flowing = null;
    this[kPaused] = null;
    if (options && options.emitClose === false)
      this.state &= ~kEmitClose;
    if (options && options.autoDestroy === false)
      this.state &= ~kAutoDestroy;
    this.errored = null;
    this.defaultEncoding = options && options.defaultEncoding || "utf8";
    this.awaitDrainWriters = null;
    this.decoder = null;
    this.encoding = null;
    if (options && options.encoding) {
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  function Readable(options) {
    if (!(this instanceof Readable))
      return new Readable(options);
    const isDuplex = this instanceof require_duplex();
    this._readableState = new ReadableState(options, this, isDuplex);
    if (options) {
      if (typeof options.read === "function")
        this._read = options.read;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
      if (typeof options.construct === "function")
        this._construct = options.construct;
      if (options.signal && !isDuplex)
        addAbortSignal(options.signal, this);
    }
    Stream.call(this, options);
    destroyImpl.construct(this, () => {
      if (this._readableState.needReadable) {
        maybeReadMore(this, this._readableState);
      }
    });
  }
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function(err, cb) {
    cb(err);
  };
  Readable.prototype[EE.captureRejectionSymbol] = function(err) {
    this.destroy(err);
  };
  Readable.prototype[SymbolAsyncDispose] = function() {
    let error;
    if (!this.destroyed) {
      error = this.readableEnded ? null : new AbortError;
      this.destroy(error);
    }
    return new Promise2((resolve3, reject) => eos(this, (err) => err && err !== error ? reject(err) : resolve3(null)));
  };
  Readable.prototype.push = function(chunk, encoding) {
    return readableAddChunk(this, chunk, encoding, false);
  };
  Readable.prototype.unshift = function(chunk, encoding) {
    return readableAddChunk(this, chunk, encoding, true);
  };
  function readableAddChunk(stream, chunk, encoding, addToFront) {
    debug("readableAddChunk", chunk);
    const state = stream._readableState;
    let err;
    if ((state.state & kObjectMode) === 0) {
      if (typeof chunk === "string") {
        encoding = encoding || state.defaultEncoding;
        if (state.encoding !== encoding) {
          if (addToFront && state.encoding) {
            chunk = Buffer2.from(chunk, encoding).toString(state.encoding);
          } else {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
        }
      } else if (chunk instanceof Buffer2) {
        encoding = "";
      } else if (Stream._isUint8Array(chunk)) {
        chunk = Stream._uint8ArrayToBuffer(chunk);
        encoding = "";
      } else if (chunk != null) {
        err = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
    }
    if (err) {
      errorOrDestroy(stream, err);
    } else if (chunk === null) {
      state.state &= ~kReading;
      onEofChunk(stream, state);
    } else if ((state.state & kObjectMode) !== 0 || chunk && chunk.length > 0) {
      if (addToFront) {
        if ((state.state & kEndEmitted) !== 0)
          errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT);
        else if (state.destroyed || state.errored)
          return false;
        else
          addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF);
      } else if (state.destroyed || state.errored) {
        return false;
      } else {
        state.state &= ~kReading;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0)
            addChunk(stream, state, chunk, false);
          else
            maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.state &= ~kReading;
      maybeReadMore(stream, state);
    }
    return !state.ended && (state.length < state.highWaterMark || state.length === 0);
  }
  function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount("data") > 0) {
      if ((state.state & kMultiAwaitDrain) !== 0) {
        state.awaitDrainWriters.clear();
      } else {
        state.awaitDrainWriters = null;
      }
      state.dataEmitted = true;
      stream.emit("data", chunk);
    } else {
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront)
        state.buffer.unshift(chunk);
      else
        state.buffer.push(chunk);
      if ((state.state & kNeedReadable) !== 0)
        emitReadable(stream);
    }
    maybeReadMore(stream, state);
  }
  Readable.prototype.isPaused = function() {
    const state = this._readableState;
    return state[kPaused] === true || state.flowing === false;
  };
  Readable.prototype.setEncoding = function(enc) {
    const decoder = new StringDecoder(enc);
    this._readableState.decoder = decoder;
    this._readableState.encoding = this._readableState.decoder.encoding;
    const buffer = this._readableState.buffer;
    let content = "";
    for (const data of buffer) {
      content += decoder.write(data);
    }
    buffer.clear();
    if (content !== "")
      buffer.push(content);
    this._readableState.length = content.length;
    return this;
  };
  var MAX_HWM = 1073741824;
  function computeNewHighWaterMark(n) {
    if (n > MAX_HWM) {
      throw new ERR_OUT_OF_RANGE("size", "<= 1GiB", n);
    } else {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  }
  function howMuchToRead(n, state) {
    if (n <= 0 || state.length === 0 && state.ended)
      return 0;
    if ((state.state & kObjectMode) !== 0)
      return 1;
    if (NumberIsNaN(n)) {
      if (state.flowing && state.length)
        return state.buffer.first().length;
      return state.length;
    }
    if (n <= state.length)
      return n;
    return state.ended ? state.length : 0;
  }
  Readable.prototype.read = function(n) {
    debug("read", n);
    if (n === undefined) {
      n = NaN;
    } else if (!NumberIsInteger(n)) {
      n = NumberParseInt(n, 10);
    }
    const state = this._readableState;
    const nOrig = n;
    if (n > state.highWaterMark)
      state.highWaterMark = computeNewHighWaterMark(n);
    if (n !== 0)
      state.state &= ~kEmittedReadable;
    if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
      debug("read: emitReadable", state.length, state.ended);
      if (state.length === 0 && state.ended)
        endReadable(this);
      else
        emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
      if (state.length === 0)
        endReadable(this);
      return null;
    }
    let doRead = (state.state & kNeedReadable) !== 0;
    debug("need readable", doRead);
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug("length less than watermark", doRead);
    }
    if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
      doRead = false;
      debug("reading, ended or constructing", doRead);
    } else if (doRead) {
      debug("do read");
      state.state |= kReading | kSync;
      if (state.length === 0)
        state.state |= kNeedReadable;
      try {
        this._read(state.highWaterMark);
      } catch (err) {
        errorOrDestroy(this, err);
      }
      state.state &= ~kSync;
      if (!state.reading)
        n = howMuchToRead(nOrig, state);
    }
    let ret;
    if (n > 0)
      ret = fromList(n, state);
    else
      ret = null;
    if (ret === null) {
      state.needReadable = state.length <= state.highWaterMark;
      n = 0;
    } else {
      state.length -= n;
      if (state.multiAwaitDrain) {
        state.awaitDrainWriters.clear();
      } else {
        state.awaitDrainWriters = null;
      }
    }
    if (state.length === 0) {
      if (!state.ended)
        state.needReadable = true;
      if (nOrig !== n && state.ended)
        endReadable(this);
    }
    if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
      state.dataEmitted = true;
      this.emit("data", ret);
    }
    return ret;
  };
  function onEofChunk(stream, state) {
    debug("onEofChunk");
    if (state.ended)
      return;
    if (state.decoder) {
      const chunk = state.decoder.end();
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
    state.ended = true;
    if (state.sync) {
      emitReadable(stream);
    } else {
      state.needReadable = false;
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
  function emitReadable(stream) {
    const state = stream._readableState;
    debug("emitReadable", state.needReadable, state.emittedReadable);
    state.needReadable = false;
    if (!state.emittedReadable) {
      debug("emitReadable", state.flowing);
      state.emittedReadable = true;
      process2.nextTick(emitReadable_, stream);
    }
  }
  function emitReadable_(stream) {
    const state = stream._readableState;
    debug("emitReadable_", state.destroyed, state.length, state.ended);
    if (!state.destroyed && !state.errored && (state.length || state.ended)) {
      stream.emit("readable");
      state.emittedReadable = false;
    }
    state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
    flow(stream);
  }
  function maybeReadMore(stream, state) {
    if (!state.readingMore && state.constructed) {
      state.readingMore = true;
      process2.nextTick(maybeReadMore_, stream, state);
    }
  }
  function maybeReadMore_(stream, state) {
    while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
      const len = state.length;
      debug("maybeReadMore read 0");
      stream.read(0);
      if (len === state.length)
        break;
    }
    state.readingMore = false;
  }
  Readable.prototype._read = function(n) {
    throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    const src = this;
    const state = this._readableState;
    if (state.pipes.length === 1) {
      if (!state.multiAwaitDrain) {
        state.multiAwaitDrain = true;
        state.awaitDrainWriters = new SafeSet(state.awaitDrainWriters ? [state.awaitDrainWriters] : []);
      }
    }
    state.pipes.push(dest);
    debug("pipe count=%d opts=%j", state.pipes.length, pipeOpts);
    const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process2.stdout && dest !== process2.stderr;
    const endFn = doEnd ? onend : unpipe;
    if (state.endEmitted)
      process2.nextTick(endFn);
    else
      src.once("end", endFn);
    dest.on("unpipe", onunpipe);
    function onunpipe(readable, unpipeInfo) {
      debug("onunpipe");
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
    function onend() {
      debug("onend");
      dest.end();
    }
    let ondrain;
    let cleanedUp = false;
    function cleanup() {
      debug("cleanup");
      dest.removeListener("close", onclose);
      dest.removeListener("finish", onfinish);
      if (ondrain) {
        dest.removeListener("drain", ondrain);
      }
      dest.removeListener("error", onerror);
      dest.removeListener("unpipe", onunpipe);
      src.removeListener("end", onend);
      src.removeListener("end", unpipe);
      src.removeListener("data", ondata);
      cleanedUp = true;
      if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain))
        ondrain();
    }
    function pause() {
      if (!cleanedUp) {
        if (state.pipes.length === 1 && state.pipes[0] === dest) {
          debug("false write response, pause", 0);
          state.awaitDrainWriters = dest;
          state.multiAwaitDrain = false;
        } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
          debug("false write response, pause", state.awaitDrainWriters.size);
          state.awaitDrainWriters.add(dest);
        }
        src.pause();
      }
      if (!ondrain) {
        ondrain = pipeOnDrain(src, dest);
        dest.on("drain", ondrain);
      }
    }
    src.on("data", ondata);
    function ondata(chunk) {
      debug("ondata");
      const ret = dest.write(chunk);
      debug("dest.write", ret);
      if (ret === false) {
        pause();
      }
    }
    function onerror(er) {
      debug("onerror", er);
      unpipe();
      dest.removeListener("error", onerror);
      if (dest.listenerCount("error") === 0) {
        const s = dest._writableState || dest._readableState;
        if (s && !s.errorEmitted) {
          errorOrDestroy(dest, er);
        } else {
          dest.emit("error", er);
        }
      }
    }
    prependListener(dest, "error", onerror);
    function onclose() {
      dest.removeListener("finish", onfinish);
      unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
      debug("onfinish");
      dest.removeListener("close", onclose);
      unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
      debug("unpipe");
      src.unpipe(dest);
    }
    dest.emit("pipe", src);
    if (dest.writableNeedDrain === true) {
      pause();
    } else if (!state.flowing) {
      debug("pipe resume");
      src.resume();
    }
    return dest;
  };
  function pipeOnDrain(src, dest) {
    return function pipeOnDrainFunctionResult() {
      const state = src._readableState;
      if (state.awaitDrainWriters === dest) {
        debug("pipeOnDrain", 1);
        state.awaitDrainWriters = null;
      } else if (state.multiAwaitDrain) {
        debug("pipeOnDrain", state.awaitDrainWriters.size);
        state.awaitDrainWriters.delete(dest);
      }
      if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && src.listenerCount("data")) {
        src.resume();
      }
    };
  }
  Readable.prototype.unpipe = function(dest) {
    const state = this._readableState;
    const unpipeInfo = {
      hasUnpiped: false
    };
    if (state.pipes.length === 0)
      return this;
    if (!dest) {
      const dests = state.pipes;
      state.pipes = [];
      this.pause();
      for (let i = 0;i < dests.length; i++)
        dests[i].emit("unpipe", this, {
          hasUnpiped: false
        });
      return this;
    }
    const index = ArrayPrototypeIndexOf(state.pipes, dest);
    if (index === -1)
      return this;
    state.pipes.splice(index, 1);
    if (state.pipes.length === 0)
      this.pause();
    dest.emit("unpipe", this, unpipeInfo);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    const res = Stream.prototype.on.call(this, ev, fn);
    const state = this._readableState;
    if (ev === "data") {
      state.readableListening = this.listenerCount("readable") > 0;
      if (state.flowing !== false)
        this.resume();
    } else if (ev === "readable") {
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.flowing = false;
        state.emittedReadable = false;
        debug("on readable", state.length, state.reading);
        if (state.length) {
          emitReadable(this);
        } else if (!state.reading) {
          process2.nextTick(nReadingNextTick, this);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  Readable.prototype.removeListener = function(ev, fn) {
    const res = Stream.prototype.removeListener.call(this, ev, fn);
    if (ev === "readable") {
      process2.nextTick(updateReadableListening, this);
    }
    return res;
  };
  Readable.prototype.off = Readable.prototype.removeListener;
  Readable.prototype.removeAllListeners = function(ev) {
    const res = Stream.prototype.removeAllListeners.apply(this, arguments);
    if (ev === "readable" || ev === undefined) {
      process2.nextTick(updateReadableListening, this);
    }
    return res;
  };
  function updateReadableListening(self) {
    const state = self._readableState;
    state.readableListening = self.listenerCount("readable") > 0;
    if (state.resumeScheduled && state[kPaused] === false) {
      state.flowing = true;
    } else if (self.listenerCount("data") > 0) {
      self.resume();
    } else if (!state.readableListening) {
      state.flowing = null;
    }
  }
  function nReadingNextTick(self) {
    debug("readable nexttick read 0");
    self.read(0);
  }
  Readable.prototype.resume = function() {
    const state = this._readableState;
    if (!state.flowing) {
      debug("resume");
      state.flowing = !state.readableListening;
      resume(this, state);
    }
    state[kPaused] = false;
    return this;
  };
  function resume(stream, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      process2.nextTick(resume_, stream, state);
    }
  }
  function resume_(stream, state) {
    debug("resume", state.reading);
    if (!state.reading) {
      stream.read(0);
    }
    state.resumeScheduled = false;
    stream.emit("resume");
    flow(stream);
    if (state.flowing && !state.reading)
      stream.read(0);
  }
  Readable.prototype.pause = function() {
    debug("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
      debug("pause");
      this._readableState.flowing = false;
      this.emit("pause");
    }
    this._readableState[kPaused] = true;
    return this;
  };
  function flow(stream) {
    const state = stream._readableState;
    debug("flow", state.flowing);
    while (state.flowing && stream.read() !== null)
      ;
  }
  Readable.prototype.wrap = function(stream) {
    let paused = false;
    stream.on("data", (chunk) => {
      if (!this.push(chunk) && stream.pause) {
        paused = true;
        stream.pause();
      }
    });
    stream.on("end", () => {
      this.push(null);
    });
    stream.on("error", (err) => {
      errorOrDestroy(this, err);
    });
    stream.on("close", () => {
      this.destroy();
    });
    stream.on("destroy", () => {
      this.destroy();
    });
    this._read = () => {
      if (paused && stream.resume) {
        paused = false;
        stream.resume();
      }
    };
    const streamKeys = ObjectKeys(stream);
    for (let j = 1;j < streamKeys.length; j++) {
      const i = streamKeys[j];
      if (this[i] === undefined && typeof stream[i] === "function") {
        this[i] = stream[i].bind(stream);
      }
    }
    return this;
  };
  Readable.prototype[SymbolAsyncIterator] = function() {
    return streamToAsyncIterator(this);
  };
  Readable.prototype.iterator = function(options) {
    if (options !== undefined) {
      validateObject(options, "options");
    }
    return streamToAsyncIterator(this, options);
  };
  function streamToAsyncIterator(stream, options) {
    if (typeof stream.read !== "function") {
      stream = Readable.wrap(stream, {
        objectMode: true
      });
    }
    const iter = createAsyncIterator(stream, options);
    iter.stream = stream;
    return iter;
  }
  async function* createAsyncIterator(stream, options) {
    let callback = nop;
    function next(resolve3) {
      if (this === stream) {
        callback();
        callback = nop;
      } else {
        callback = resolve3;
      }
    }
    stream.on("readable", next);
    let error;
    const cleanup = eos(stream, {
      writable: false
    }, (err) => {
      error = err ? aggregateTwoErrors(error, err) : null;
      callback();
      callback = nop;
    });
    try {
      while (true) {
        const chunk = stream.destroyed ? null : stream.read();
        if (chunk !== null) {
          yield chunk;
        } else if (error) {
          throw error;
        } else if (error === null) {
          return;
        } else {
          await new Promise2(next);
        }
      }
    } catch (err) {
      error = aggregateTwoErrors(error, err);
      throw error;
    } finally {
      if ((error || (options === null || options === undefined ? undefined : options.destroyOnReturn) !== false) && (error === undefined || stream._readableState.autoDestroy)) {
        destroyImpl.destroyer(stream, null);
      } else {
        stream.off("readable", next);
        cleanup();
      }
    }
  }
  ObjectDefineProperties(Readable.prototype, {
    readable: {
      __proto__: null,
      get() {
        const r = this._readableState;
        return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
      },
      set(val) {
        if (this._readableState) {
          this._readableState.readable = !!val;
        }
      }
    },
    readableDidRead: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState.dataEmitted;
      }
    },
    readableAborted: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return !!(this._readableState.readable !== false && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
      }
    },
    readableHighWaterMark: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    },
    readableBuffer: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState && this._readableState.buffer;
      }
    },
    readableFlowing: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState.flowing;
      },
      set: function(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    },
    readableLength: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState.length;
      }
    },
    readableObjectMode: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.objectMode : false;
      }
    },
    readableEncoding: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.encoding : null;
      }
    },
    errored: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.errored : null;
      }
    },
    closed: {
      __proto__: null,
      get() {
        return this._readableState ? this._readableState.closed : false;
      }
    },
    destroyed: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.destroyed : false;
      },
      set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    },
    readableEnded: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.endEmitted : false;
      }
    }
  });
  ObjectDefineProperties(ReadableState.prototype, {
    pipesCount: {
      __proto__: null,
      get() {
        return this.pipes.length;
      }
    },
    paused: {
      __proto__: null,
      get() {
        return this[kPaused] !== false;
      },
      set(value) {
        this[kPaused] = !!value;
      }
    }
  });
  Readable._fromList = fromList;
  function fromList(n, state) {
    if (state.length === 0)
      return null;
    let ret;
    if (state.objectMode)
      ret = state.buffer.shift();
    else if (!n || n >= state.length) {
      if (state.decoder)
        ret = state.buffer.join("");
      else if (state.buffer.length === 1)
        ret = state.buffer.first();
      else
        ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      ret = state.buffer.consume(n, state.decoder);
    }
    return ret;
  }
  function endReadable(stream) {
    const state = stream._readableState;
    debug("endReadable", state.endEmitted);
    if (!state.endEmitted) {
      state.ended = true;
      process2.nextTick(endReadableNT, state, stream);
    }
  }
  function endReadableNT(state, stream) {
    debug("endReadableNT", state.endEmitted, state.length);
    if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream.emit("end");
      if (stream.writable && stream.allowHalfOpen === false) {
        process2.nextTick(endWritableNT, stream);
      } else if (state.autoDestroy) {
        const wState = stream._writableState;
        const autoDestroy = !wState || wState.autoDestroy && (wState.finished || wState.writable === false);
        if (autoDestroy) {
          stream.destroy();
        }
      }
    }
  }
  function endWritableNT(stream) {
    const writable = stream.writable && !stream.writableEnded && !stream.destroyed;
    if (writable) {
      stream.end();
    }
  }
  Readable.from = function(iterable, opts) {
    return from(Readable, iterable, opts);
  };
  var webStreamsAdapters;
  function lazyWebStreams() {
    if (webStreamsAdapters === undefined)
      webStreamsAdapters = {};
    return webStreamsAdapters;
  }
  Readable.fromWeb = function(readableStream, options) {
    return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options);
  };
  Readable.toWeb = function(streamReadable, options) {
    return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options);
  };
  Readable.wrap = function(src, options) {
    var _ref, _src$readableObjectMo;
    return new Readable({
      objectMode: (_ref = (_src$readableObjectMo = src.readableObjectMode) !== null && _src$readableObjectMo !== undefined ? _src$readableObjectMo : src.objectMode) !== null && _ref !== undefined ? _ref : true,
      ...options,
      destroy(err, callback) {
        destroyImpl.destroyer(src, err);
        callback(err);
      }
    }).wrap(src);
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/writable.js
var require_writable = __commonJS((exports, module) => {
  var process2 = require_process();
  var {
    ArrayPrototypeSlice,
    Error: Error2,
    FunctionPrototypeSymbolHasInstance,
    ObjectDefineProperty,
    ObjectDefineProperties,
    ObjectSetPrototypeOf,
    StringPrototypeToLowerCase,
    Symbol: Symbol2,
    SymbolHasInstance
  } = require_primordials();
  module.exports = Writable;
  Writable.WritableState = WritableState;
  var { EventEmitter: EE } = __require("events");
  var Stream = require_legacy().Stream;
  var { Buffer: Buffer2 } = __require("buffer");
  var destroyImpl = require_destroy();
  var { addAbortSignal } = require_add_abort_signal();
  var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
  var {
    ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED,
    ERR_STREAM_ALREADY_FINISHED,
    ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING
  } = require_errors().codes;
  var { errorOrDestroy } = destroyImpl;
  ObjectSetPrototypeOf(Writable.prototype, Stream.prototype);
  ObjectSetPrototypeOf(Writable, Stream);
  function nop() {}
  var kOnFinished = Symbol2("kOnFinished");
  function WritableState(options, stream, isDuplex) {
    if (typeof isDuplex !== "boolean")
      isDuplex = stream instanceof require_duplex();
    this.objectMode = !!(options && options.objectMode);
    if (isDuplex)
      this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
    this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    const noDecode = !!(options && options.decodeStrings === false);
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options && options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = onwrite.bind(undefined, stream);
    this.writecb = null;
    this.writelen = 0;
    this.afterWriteTickInfo = null;
    resetBuffer(this);
    this.pendingcb = 0;
    this.constructed = true;
    this.prefinished = false;
    this.errorEmitted = false;
    this.emitClose = !options || options.emitClose !== false;
    this.autoDestroy = !options || options.autoDestroy !== false;
    this.errored = null;
    this.closed = false;
    this.closeEmitted = false;
    this[kOnFinished] = [];
  }
  function resetBuffer(state) {
    state.buffered = [];
    state.bufferedIndex = 0;
    state.allBuffers = true;
    state.allNoop = true;
  }
  WritableState.prototype.getBuffer = function getBuffer() {
    return ArrayPrototypeSlice(this.buffered, this.bufferedIndex);
  };
  ObjectDefineProperty(WritableState.prototype, "bufferedRequestCount", {
    __proto__: null,
    get() {
      return this.buffered.length - this.bufferedIndex;
    }
  });
  function Writable(options) {
    const isDuplex = this instanceof require_duplex();
    if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable, this))
      return new Writable(options);
    this._writableState = new WritableState(options, this, isDuplex);
    if (options) {
      if (typeof options.write === "function")
        this._write = options.write;
      if (typeof options.writev === "function")
        this._writev = options.writev;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
      if (typeof options.final === "function")
        this._final = options.final;
      if (typeof options.construct === "function")
        this._construct = options.construct;
      if (options.signal)
        addAbortSignal(options.signal, this);
    }
    Stream.call(this, options);
    destroyImpl.construct(this, () => {
      const state = this._writableState;
      if (!state.writing) {
        clearBuffer(this, state);
      }
      finishMaybe(this, state);
    });
  }
  ObjectDefineProperty(Writable, SymbolHasInstance, {
    __proto__: null,
    value: function(object) {
      if (FunctionPrototypeSymbolHasInstance(this, object))
        return true;
      if (this !== Writable)
        return false;
      return object && object._writableState instanceof WritableState;
    }
  });
  Writable.prototype.pipe = function() {
    errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE);
  };
  function _write(stream, chunk, encoding, cb) {
    const state = stream._writableState;
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = state.defaultEncoding;
    } else {
      if (!encoding)
        encoding = state.defaultEncoding;
      else if (encoding !== "buffer" && !Buffer2.isEncoding(encoding))
        throw new ERR_UNKNOWN_ENCODING(encoding);
      if (typeof cb !== "function")
        cb = nop;
    }
    if (chunk === null) {
      throw new ERR_STREAM_NULL_VALUES;
    } else if (!state.objectMode) {
      if (typeof chunk === "string") {
        if (state.decodeStrings !== false) {
          chunk = Buffer2.from(chunk, encoding);
          encoding = "buffer";
        }
      } else if (chunk instanceof Buffer2) {
        encoding = "buffer";
      } else if (Stream._isUint8Array(chunk)) {
        chunk = Stream._uint8ArrayToBuffer(chunk);
        encoding = "buffer";
      } else {
        throw new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
    }
    let err;
    if (state.ending) {
      err = new ERR_STREAM_WRITE_AFTER_END;
    } else if (state.destroyed) {
      err = new ERR_STREAM_DESTROYED("write");
    }
    if (err) {
      process2.nextTick(cb, err);
      errorOrDestroy(stream, err, true);
      return err;
    }
    state.pendingcb++;
    return writeOrBuffer(stream, state, chunk, encoding, cb);
  }
  Writable.prototype.write = function(chunk, encoding, cb) {
    return _write(this, chunk, encoding, cb) === true;
  };
  Writable.prototype.cork = function() {
    this._writableState.corked++;
  };
  Writable.prototype.uncork = function() {
    const state = this._writableState;
    if (state.corked) {
      state.corked--;
      if (!state.writing)
        clearBuffer(this, state);
    }
  };
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string")
      encoding = StringPrototypeToLowerCase(encoding);
    if (!Buffer2.isEncoding(encoding))
      throw new ERR_UNKNOWN_ENCODING(encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  function writeOrBuffer(stream, state, chunk, encoding, callback) {
    const len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    const ret = state.length < state.highWaterMark;
    if (!ret)
      state.needDrain = true;
    if (state.writing || state.corked || state.errored || !state.constructed) {
      state.buffered.push({
        chunk,
        encoding,
        callback
      });
      if (state.allBuffers && encoding !== "buffer") {
        state.allBuffers = false;
      }
      if (state.allNoop && callback !== nop) {
        state.allNoop = false;
      }
    } else {
      state.writelen = len;
      state.writecb = callback;
      state.writing = true;
      state.sync = true;
      stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    return ret && !state.errored && !state.destroyed;
  }
  function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (state.destroyed)
      state.onwrite(new ERR_STREAM_DESTROYED("write"));
    else if (writev)
      stream._writev(chunk, state.onwrite);
    else
      stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }
  function onwriteError(stream, state, er, cb) {
    --state.pendingcb;
    cb(er);
    errorBuffer(state);
    errorOrDestroy(stream, er);
  }
  function onwrite(stream, er) {
    const state = stream._writableState;
    const sync = state.sync;
    const cb = state.writecb;
    if (typeof cb !== "function") {
      errorOrDestroy(stream, new ERR_MULTIPLE_CALLBACK);
      return;
    }
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
    if (er) {
      er.stack;
      if (!state.errored) {
        state.errored = er;
      }
      if (stream._readableState && !stream._readableState.errored) {
        stream._readableState.errored = er;
      }
      if (sync) {
        process2.nextTick(onwriteError, stream, state, er, cb);
      } else {
        onwriteError(stream, state, er, cb);
      }
    } else {
      if (state.buffered.length > state.bufferedIndex) {
        clearBuffer(stream, state);
      }
      if (sync) {
        if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
          state.afterWriteTickInfo.count++;
        } else {
          state.afterWriteTickInfo = {
            count: 1,
            cb,
            stream,
            state
          };
          process2.nextTick(afterWriteTick, state.afterWriteTickInfo);
        }
      } else {
        afterWrite(stream, state, 1, cb);
      }
    }
  }
  function afterWriteTick({ stream, state, count, cb }) {
    state.afterWriteTickInfo = null;
    return afterWrite(stream, state, count, cb);
  }
  function afterWrite(stream, state, count, cb) {
    const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
    if (needDrain) {
      state.needDrain = false;
      stream.emit("drain");
    }
    while (count-- > 0) {
      state.pendingcb--;
      cb();
    }
    if (state.destroyed) {
      errorBuffer(state);
    }
    finishMaybe(stream, state);
  }
  function errorBuffer(state) {
    if (state.writing) {
      return;
    }
    for (let n = state.bufferedIndex;n < state.buffered.length; ++n) {
      var _state$errored;
      const { chunk, callback } = state.buffered[n];
      const len = state.objectMode ? 1 : chunk.length;
      state.length -= len;
      callback((_state$errored = state.errored) !== null && _state$errored !== undefined ? _state$errored : new ERR_STREAM_DESTROYED("write"));
    }
    const onfinishCallbacks = state[kOnFinished].splice(0);
    for (let i = 0;i < onfinishCallbacks.length; i++) {
      var _state$errored2;
      onfinishCallbacks[i]((_state$errored2 = state.errored) !== null && _state$errored2 !== undefined ? _state$errored2 : new ERR_STREAM_DESTROYED("end"));
    }
    resetBuffer(state);
  }
  function clearBuffer(stream, state) {
    if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
      return;
    }
    const { buffered, bufferedIndex, objectMode } = state;
    const bufferedLength = buffered.length - bufferedIndex;
    if (!bufferedLength) {
      return;
    }
    let i = bufferedIndex;
    state.bufferProcessing = true;
    if (bufferedLength > 1 && stream._writev) {
      state.pendingcb -= bufferedLength - 1;
      const callback = state.allNoop ? nop : (err) => {
        for (let n = i;n < buffered.length; ++n) {
          buffered[n].callback(err);
        }
      };
      const chunks = state.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i);
      chunks.allBuffers = state.allBuffers;
      doWrite(stream, state, true, state.length, chunks, "", callback);
      resetBuffer(state);
    } else {
      do {
        const { chunk, encoding, callback } = buffered[i];
        buffered[i++] = null;
        const len = objectMode ? 1 : chunk.length;
        doWrite(stream, state, false, len, chunk, encoding, callback);
      } while (i < buffered.length && !state.writing);
      if (i === buffered.length) {
        resetBuffer(state);
      } else if (i > 256) {
        buffered.splice(0, i);
        state.bufferedIndex = 0;
      } else {
        state.bufferedIndex = i;
      }
    }
    state.bufferProcessing = false;
  }
  Writable.prototype._write = function(chunk, encoding, cb) {
    if (this._writev) {
      this._writev([
        {
          chunk,
          encoding
        }
      ], cb);
    } else {
      throw new ERR_METHOD_NOT_IMPLEMENTED("_write()");
    }
  };
  Writable.prototype._writev = null;
  Writable.prototype.end = function(chunk, encoding, cb) {
    const state = this._writableState;
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    let err;
    if (chunk !== null && chunk !== undefined) {
      const ret = _write(this, chunk, encoding);
      if (ret instanceof Error2) {
        err = ret;
      }
    }
    if (state.corked) {
      state.corked = 1;
      this.uncork();
    }
    if (err) {} else if (!state.errored && !state.ending) {
      state.ending = true;
      finishMaybe(this, state, true);
      state.ended = true;
    } else if (state.finished) {
      err = new ERR_STREAM_ALREADY_FINISHED("end");
    } else if (state.destroyed) {
      err = new ERR_STREAM_DESTROYED("end");
    }
    if (typeof cb === "function") {
      if (err || state.finished) {
        process2.nextTick(cb, err);
      } else {
        state[kOnFinished].push(cb);
      }
    }
    return this;
  };
  function needFinish(state) {
    return state.ending && !state.destroyed && state.constructed && state.length === 0 && !state.errored && state.buffered.length === 0 && !state.finished && !state.writing && !state.errorEmitted && !state.closeEmitted;
  }
  function callFinal(stream, state) {
    let called = false;
    function onFinish(err) {
      if (called) {
        errorOrDestroy(stream, err !== null && err !== undefined ? err : ERR_MULTIPLE_CALLBACK());
        return;
      }
      called = true;
      state.pendingcb--;
      if (err) {
        const onfinishCallbacks = state[kOnFinished].splice(0);
        for (let i = 0;i < onfinishCallbacks.length; i++) {
          onfinishCallbacks[i](err);
        }
        errorOrDestroy(stream, err, state.sync);
      } else if (needFinish(state)) {
        state.prefinished = true;
        stream.emit("prefinish");
        state.pendingcb++;
        process2.nextTick(finish, stream, state);
      }
    }
    state.sync = true;
    state.pendingcb++;
    try {
      stream._final(onFinish);
    } catch (err) {
      onFinish(err);
    }
    state.sync = false;
  }
  function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream._final === "function" && !state.destroyed) {
        state.finalCalled = true;
        callFinal(stream, state);
      } else {
        state.prefinished = true;
        stream.emit("prefinish");
      }
    }
  }
  function finishMaybe(stream, state, sync) {
    if (needFinish(state)) {
      prefinish(stream, state);
      if (state.pendingcb === 0) {
        if (sync) {
          state.pendingcb++;
          process2.nextTick((stream2, state2) => {
            if (needFinish(state2)) {
              finish(stream2, state2);
            } else {
              state2.pendingcb--;
            }
          }, stream, state);
        } else if (needFinish(state)) {
          state.pendingcb++;
          finish(stream, state);
        }
      }
    }
  }
  function finish(stream, state) {
    state.pendingcb--;
    state.finished = true;
    const onfinishCallbacks = state[kOnFinished].splice(0);
    for (let i = 0;i < onfinishCallbacks.length; i++) {
      onfinishCallbacks[i]();
    }
    stream.emit("finish");
    if (state.autoDestroy) {
      const rState = stream._readableState;
      const autoDestroy = !rState || rState.autoDestroy && (rState.endEmitted || rState.readable === false);
      if (autoDestroy) {
        stream.destroy();
      }
    }
  }
  ObjectDefineProperties(Writable.prototype, {
    closed: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.closed : false;
      }
    },
    destroyed: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.destroyed : false;
      },
      set(value) {
        if (this._writableState) {
          this._writableState.destroyed = value;
        }
      }
    },
    writable: {
      __proto__: null,
      get() {
        const w = this._writableState;
        return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
      },
      set(val) {
        if (this._writableState) {
          this._writableState.writable = !!val;
        }
      }
    },
    writableFinished: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.finished : false;
      }
    },
    writableObjectMode: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.objectMode : false;
      }
    },
    writableBuffer: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.getBuffer();
      }
    },
    writableEnded: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.ending : false;
      }
    },
    writableNeedDrain: {
      __proto__: null,
      get() {
        const wState = this._writableState;
        if (!wState)
          return false;
        return !wState.destroyed && !wState.ending && wState.needDrain;
      }
    },
    writableHighWaterMark: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.highWaterMark;
      }
    },
    writableCorked: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.corked : 0;
      }
    },
    writableLength: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.length;
      }
    },
    errored: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._writableState ? this._writableState.errored : null;
      }
    },
    writableAborted: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return !!(this._writableState.writable !== false && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
      }
    }
  });
  var destroy = destroyImpl.destroy;
  Writable.prototype.destroy = function(err, cb) {
    const state = this._writableState;
    if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
      process2.nextTick(errorBuffer, state);
    }
    destroy.call(this, err, cb);
    return this;
  };
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function(err, cb) {
    cb(err);
  };
  Writable.prototype[EE.captureRejectionSymbol] = function(err) {
    this.destroy(err);
  };
  var webStreamsAdapters;
  function lazyWebStreams() {
    if (webStreamsAdapters === undefined)
      webStreamsAdapters = {};
    return webStreamsAdapters;
  }
  Writable.fromWeb = function(writableStream, options) {
    return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options);
  };
  Writable.toWeb = function(streamWritable) {
    return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable);
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/duplexify.js
var require_duplexify = __commonJS((exports, module) => {
  var process2 = require_process();
  var bufferModule = __require("buffer");
  var {
    isReadable,
    isWritable,
    isIterable,
    isNodeStream,
    isReadableNodeStream,
    isWritableNodeStream,
    isDuplexNodeStream,
    isReadableStream,
    isWritableStream
  } = require_utils();
  var eos = require_end_of_stream();
  var {
    AbortError,
    codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_RETURN_VALUE }
  } = require_errors();
  var { destroyer } = require_destroy();
  var Duplex = require_duplex();
  var Readable = require_readable();
  var Writable = require_writable();
  var { createDeferredPromise } = require_util();
  var from = require_from();
  var Blob2 = globalThis.Blob || bufferModule.Blob;
  var isBlob = typeof Blob2 !== "undefined" ? function isBlob2(b) {
    return b instanceof Blob2;
  } : function isBlob2(b) {
    return false;
  };
  var AbortController = globalThis.AbortController || __require("abort-controller").AbortController;
  var { FunctionPrototypeCall } = require_primordials();

  class Duplexify extends Duplex {
    constructor(options) {
      super(options);
      if ((options === null || options === undefined ? undefined : options.readable) === false) {
        this._readableState.readable = false;
        this._readableState.ended = true;
        this._readableState.endEmitted = true;
      }
      if ((options === null || options === undefined ? undefined : options.writable) === false) {
        this._writableState.writable = false;
        this._writableState.ending = true;
        this._writableState.ended = true;
        this._writableState.finished = true;
      }
    }
  }
  module.exports = function duplexify(body, name) {
    if (isDuplexNodeStream(body)) {
      return body;
    }
    if (isReadableNodeStream(body)) {
      return _duplexify({
        readable: body
      });
    }
    if (isWritableNodeStream(body)) {
      return _duplexify({
        writable: body
      });
    }
    if (isNodeStream(body)) {
      return _duplexify({
        writable: false,
        readable: false
      });
    }
    if (isReadableStream(body)) {
      return _duplexify({
        readable: Readable.fromWeb(body)
      });
    }
    if (isWritableStream(body)) {
      return _duplexify({
        writable: Writable.fromWeb(body)
      });
    }
    if (typeof body === "function") {
      const { value, write, final, destroy } = fromAsyncGen(body);
      if (isIterable(value)) {
        return from(Duplexify, value, {
          objectMode: true,
          write,
          final,
          destroy
        });
      }
      const then2 = value === null || value === undefined ? undefined : value.then;
      if (typeof then2 === "function") {
        let d;
        const promise = FunctionPrototypeCall(then2, value, (val) => {
          if (val != null) {
            throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
          }
        }, (err) => {
          destroyer(d, err);
        });
        return d = new Duplexify({
          objectMode: true,
          readable: false,
          write,
          final(cb) {
            final(async () => {
              try {
                await promise;
                process2.nextTick(cb, null);
              } catch (err) {
                process2.nextTick(cb, err);
              }
            });
          },
          destroy
        });
      }
      throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or AsyncFunction", name, value);
    }
    if (isBlob(body)) {
      return duplexify(body.arrayBuffer());
    }
    if (isIterable(body)) {
      return from(Duplexify, body, {
        objectMode: true,
        writable: false
      });
    }
    if (isReadableStream(body === null || body === undefined ? undefined : body.readable) && isWritableStream(body === null || body === undefined ? undefined : body.writable)) {
      return Duplexify.fromWeb(body);
    }
    if (typeof (body === null || body === undefined ? undefined : body.writable) === "object" || typeof (body === null || body === undefined ? undefined : body.readable) === "object") {
      const readable = body !== null && body !== undefined && body.readable ? isReadableNodeStream(body === null || body === undefined ? undefined : body.readable) ? body === null || body === undefined ? undefined : body.readable : duplexify(body.readable) : undefined;
      const writable = body !== null && body !== undefined && body.writable ? isWritableNodeStream(body === null || body === undefined ? undefined : body.writable) ? body === null || body === undefined ? undefined : body.writable : duplexify(body.writable) : undefined;
      return _duplexify({
        readable,
        writable
      });
    }
    const then = body === null || body === undefined ? undefined : body.then;
    if (typeof then === "function") {
      let d;
      FunctionPrototypeCall(then, body, (val) => {
        if (val != null) {
          d.push(val);
        }
        d.push(null);
      }, (err) => {
        destroyer(d, err);
      });
      return d = new Duplexify({
        objectMode: true,
        writable: false,
        read() {}
      });
    }
    throw new ERR_INVALID_ARG_TYPE(name, [
      "Blob",
      "ReadableStream",
      "WritableStream",
      "Stream",
      "Iterable",
      "AsyncIterable",
      "Function",
      "{ readable, writable } pair",
      "Promise"
    ], body);
  };
  function fromAsyncGen(fn) {
    let { promise, resolve: resolve3 } = createDeferredPromise();
    const ac = new AbortController;
    const signal = ac.signal;
    const value = fn(async function* () {
      while (true) {
        const _promise = promise;
        promise = null;
        const { chunk, done, cb } = await _promise;
        process2.nextTick(cb);
        if (done)
          return;
        if (signal.aborted)
          throw new AbortError(undefined, {
            cause: signal.reason
          });
        ({ promise, resolve: resolve3 } = createDeferredPromise());
        yield chunk;
      }
    }(), {
      signal
    });
    return {
      value,
      write(chunk, encoding, cb) {
        const _resolve = resolve3;
        resolve3 = null;
        _resolve({
          chunk,
          done: false,
          cb
        });
      },
      final(cb) {
        const _resolve = resolve3;
        resolve3 = null;
        _resolve({
          done: true,
          cb
        });
      },
      destroy(err, cb) {
        ac.abort();
        cb(err);
      }
    };
  }
  function _duplexify(pair) {
    const r = pair.readable && typeof pair.readable.read !== "function" ? Readable.wrap(pair.readable) : pair.readable;
    const w = pair.writable;
    let readable = !!isReadable(r);
    let writable = !!isWritable(w);
    let ondrain;
    let onfinish;
    let onreadable;
    let onclose;
    let d;
    function onfinished(err) {
      const cb = onclose;
      onclose = null;
      if (cb) {
        cb(err);
      } else if (err) {
        d.destroy(err);
      }
    }
    d = new Duplexify({
      readableObjectMode: !!(r !== null && r !== undefined && r.readableObjectMode),
      writableObjectMode: !!(w !== null && w !== undefined && w.writableObjectMode),
      readable,
      writable
    });
    if (writable) {
      eos(w, (err) => {
        writable = false;
        if (err) {
          destroyer(r, err);
        }
        onfinished(err);
      });
      d._write = function(chunk, encoding, callback) {
        if (w.write(chunk, encoding)) {
          callback();
        } else {
          ondrain = callback;
        }
      };
      d._final = function(callback) {
        w.end();
        onfinish = callback;
      };
      w.on("drain", function() {
        if (ondrain) {
          const cb = ondrain;
          ondrain = null;
          cb();
        }
      });
      w.on("finish", function() {
        if (onfinish) {
          const cb = onfinish;
          onfinish = null;
          cb();
        }
      });
    }
    if (readable) {
      eos(r, (err) => {
        readable = false;
        if (err) {
          destroyer(r, err);
        }
        onfinished(err);
      });
      r.on("readable", function() {
        if (onreadable) {
          const cb = onreadable;
          onreadable = null;
          cb();
        }
      });
      r.on("end", function() {
        d.push(null);
      });
      d._read = function() {
        while (true) {
          const buf = r.read();
          if (buf === null) {
            onreadable = d._read;
            return;
          }
          if (!d.push(buf)) {
            return;
          }
        }
      };
    }
    d._destroy = function(err, callback) {
      if (!err && onclose !== null) {
        err = new AbortError;
      }
      onreadable = null;
      ondrain = null;
      onfinish = null;
      if (onclose === null) {
        callback(err);
      } else {
        onclose = callback;
        destroyer(w, err);
        destroyer(r, err);
      }
    };
    return d;
  }
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/duplex.js
var require_duplex = __commonJS((exports, module) => {
  var {
    ObjectDefineProperties,
    ObjectGetOwnPropertyDescriptor,
    ObjectKeys,
    ObjectSetPrototypeOf
  } = require_primordials();
  module.exports = Duplex;
  var Readable = require_readable();
  var Writable = require_writable();
  ObjectSetPrototypeOf(Duplex.prototype, Readable.prototype);
  ObjectSetPrototypeOf(Duplex, Readable);
  {
    const keys = ObjectKeys(Writable.prototype);
    for (let i = 0;i < keys.length; i++) {
      const method = keys[i];
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  function Duplex(options) {
    if (!(this instanceof Duplex))
      return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options) {
      this.allowHalfOpen = options.allowHalfOpen !== false;
      if (options.readable === false) {
        this._readableState.readable = false;
        this._readableState.ended = true;
        this._readableState.endEmitted = true;
      }
      if (options.writable === false) {
        this._writableState.writable = false;
        this._writableState.ending = true;
        this._writableState.ended = true;
        this._writableState.finished = true;
      }
    } else {
      this.allowHalfOpen = true;
    }
  }
  ObjectDefineProperties(Duplex.prototype, {
    writable: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writable")
    },
    writableHighWaterMark: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableHighWaterMark")
    },
    writableObjectMode: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableObjectMode")
    },
    writableBuffer: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableBuffer")
    },
    writableLength: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableLength")
    },
    writableFinished: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableFinished")
    },
    writableCorked: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableCorked")
    },
    writableEnded: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableEnded")
    },
    writableNeedDrain: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableNeedDrain")
    },
    destroyed: {
      __proto__: null,
      get() {
        if (this._readableState === undefined || this._writableState === undefined) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set(value) {
        if (this._readableState && this._writableState) {
          this._readableState.destroyed = value;
          this._writableState.destroyed = value;
        }
      }
    }
  });
  var webStreamsAdapters;
  function lazyWebStreams() {
    if (webStreamsAdapters === undefined)
      webStreamsAdapters = {};
    return webStreamsAdapters;
  }
  Duplex.fromWeb = function(pair, options) {
    return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options);
  };
  Duplex.toWeb = function(duplex) {
    return lazyWebStreams().newReadableWritablePairFromDuplex(duplex);
  };
  var duplexify;
  Duplex.from = function(body) {
    if (!duplexify) {
      duplexify = require_duplexify();
    }
    return duplexify(body, "body");
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/transform.js
var require_transform = __commonJS((exports, module) => {
  var { ObjectSetPrototypeOf, Symbol: Symbol2 } = require_primordials();
  module.exports = Transform;
  var { ERR_METHOD_NOT_IMPLEMENTED } = require_errors().codes;
  var Duplex = require_duplex();
  var { getHighWaterMark } = require_state();
  ObjectSetPrototypeOf(Transform.prototype, Duplex.prototype);
  ObjectSetPrototypeOf(Transform, Duplex);
  var kCallback = Symbol2("kCallback");
  function Transform(options) {
    if (!(this instanceof Transform))
      return new Transform(options);
    const readableHighWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", true) : null;
    if (readableHighWaterMark === 0) {
      options = {
        ...options,
        highWaterMark: null,
        readableHighWaterMark,
        writableHighWaterMark: options.writableHighWaterMark || 0
      };
    }
    Duplex.call(this, options);
    this._readableState.sync = false;
    this[kCallback] = null;
    if (options) {
      if (typeof options.transform === "function")
        this._transform = options.transform;
      if (typeof options.flush === "function")
        this._flush = options.flush;
    }
    this.on("prefinish", prefinish);
  }
  function final(cb) {
    if (typeof this._flush === "function" && !this.destroyed) {
      this._flush((er, data) => {
        if (er) {
          if (cb) {
            cb(er);
          } else {
            this.destroy(er);
          }
          return;
        }
        if (data != null) {
          this.push(data);
        }
        this.push(null);
        if (cb) {
          cb();
        }
      });
    } else {
      this.push(null);
      if (cb) {
        cb();
      }
    }
  }
  function prefinish() {
    if (this._final !== final) {
      final.call(this);
    }
  }
  Transform.prototype._final = final;
  Transform.prototype._transform = function(chunk, encoding, callback) {
    throw new ERR_METHOD_NOT_IMPLEMENTED("_transform()");
  };
  Transform.prototype._write = function(chunk, encoding, callback) {
    const rState = this._readableState;
    const wState = this._writableState;
    const length = rState.length;
    this._transform(chunk, encoding, (err, val) => {
      if (err) {
        callback(err);
        return;
      }
      if (val != null) {
        this.push(val);
      }
      if (wState.ended || length === rState.length || rState.length < rState.highWaterMark) {
        callback();
      } else {
        this[kCallback] = callback;
      }
    });
  };
  Transform.prototype._read = function() {
    if (this[kCallback]) {
      const callback = this[kCallback];
      this[kCallback] = null;
      callback();
    }
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/passthrough.js
var require_passthrough = __commonJS((exports, module) => {
  var { ObjectSetPrototypeOf } = require_primordials();
  module.exports = PassThrough;
  var Transform = require_transform();
  ObjectSetPrototypeOf(PassThrough.prototype, Transform.prototype);
  ObjectSetPrototypeOf(PassThrough, Transform);
  function PassThrough(options) {
    if (!(this instanceof PassThrough))
      return new PassThrough(options);
    Transform.call(this, options);
  }
  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS((exports, module) => {
  var process2 = require_process();
  var { ArrayIsArray, Promise: Promise2, SymbolAsyncIterator, SymbolDispose } = require_primordials();
  var eos = require_end_of_stream();
  var { once } = require_util();
  var destroyImpl = require_destroy();
  var Duplex = require_duplex();
  var {
    aggregateTwoErrors,
    codes: {
      ERR_INVALID_ARG_TYPE,
      ERR_INVALID_RETURN_VALUE,
      ERR_MISSING_ARGS,
      ERR_STREAM_DESTROYED,
      ERR_STREAM_PREMATURE_CLOSE
    },
    AbortError
  } = require_errors();
  var { validateFunction, validateAbortSignal } = require_validators();
  var {
    isIterable,
    isReadable,
    isReadableNodeStream,
    isNodeStream,
    isTransformStream,
    isWebStream,
    isReadableStream,
    isReadableFinished
  } = require_utils();
  var AbortController = globalThis.AbortController || __require("abort-controller").AbortController;
  var PassThrough;
  var Readable;
  var addAbortListener;
  function destroyer(stream, reading, writing) {
    let finished = false;
    stream.on("close", () => {
      finished = true;
    });
    const cleanup = eos(stream, {
      readable: reading,
      writable: writing
    }, (err) => {
      finished = !err;
    });
    return {
      destroy: (err) => {
        if (finished)
          return;
        finished = true;
        destroyImpl.destroyer(stream, err || new ERR_STREAM_DESTROYED("pipe"));
      },
      cleanup
    };
  }
  function popCallback(streams) {
    validateFunction(streams[streams.length - 1], "streams[stream.length - 1]");
    return streams.pop();
  }
  function makeAsyncIterable(val) {
    if (isIterable(val)) {
      return val;
    } else if (isReadableNodeStream(val)) {
      return fromReadable(val);
    }
    throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable"], val);
  }
  async function* fromReadable(val) {
    if (!Readable) {
      Readable = require_readable();
    }
    yield* Readable.prototype[SymbolAsyncIterator].call(val);
  }
  async function pumpToNode(iterable, writable, finish, { end }) {
    let error;
    let onresolve = null;
    const resume = (err) => {
      if (err) {
        error = err;
      }
      if (onresolve) {
        const callback = onresolve;
        onresolve = null;
        callback();
      }
    };
    const wait = () => new Promise2((resolve3, reject) => {
      if (error) {
        reject(error);
      } else {
        onresolve = () => {
          if (error) {
            reject(error);
          } else {
            resolve3();
          }
        };
      }
    });
    writable.on("drain", resume);
    const cleanup = eos(writable, {
      readable: false
    }, resume);
    try {
      if (writable.writableNeedDrain) {
        await wait();
      }
      for await (const chunk of iterable) {
        if (!writable.write(chunk)) {
          await wait();
        }
      }
      if (end) {
        writable.end();
        await wait();
      }
      finish();
    } catch (err) {
      finish(error !== err ? aggregateTwoErrors(error, err) : err);
    } finally {
      cleanup();
      writable.off("drain", resume);
    }
  }
  async function pumpToWeb(readable, writable, finish, { end }) {
    if (isTransformStream(writable)) {
      writable = writable.writable;
    }
    const writer = writable.getWriter();
    try {
      for await (const chunk of readable) {
        await writer.ready;
        writer.write(chunk).catch(() => {});
      }
      await writer.ready;
      if (end) {
        await writer.close();
      }
      finish();
    } catch (err) {
      try {
        await writer.abort(err);
        finish(err);
      } catch (err2) {
        finish(err2);
      }
    }
  }
  function pipeline(...streams) {
    return pipelineImpl(streams, once(popCallback(streams)));
  }
  function pipelineImpl(streams, callback, opts) {
    if (streams.length === 1 && ArrayIsArray(streams[0])) {
      streams = streams[0];
    }
    if (streams.length < 2) {
      throw new ERR_MISSING_ARGS("streams");
    }
    const ac = new AbortController;
    const signal = ac.signal;
    const outerSignal = opts === null || opts === undefined ? undefined : opts.signal;
    const lastStreamCleanup = [];
    validateAbortSignal(outerSignal, "options.signal");
    function abort() {
      finishImpl(new AbortError);
    }
    addAbortListener = addAbortListener || require_util().addAbortListener;
    let disposable;
    if (outerSignal) {
      disposable = addAbortListener(outerSignal, abort);
    }
    let error;
    let value;
    const destroys = [];
    let finishCount = 0;
    function finish(err) {
      finishImpl(err, --finishCount === 0);
    }
    function finishImpl(err, final) {
      var _disposable;
      if (err && (!error || error.code === "ERR_STREAM_PREMATURE_CLOSE")) {
        error = err;
      }
      if (!error && !final) {
        return;
      }
      while (destroys.length) {
        destroys.shift()(error);
      }
      (_disposable = disposable) === null || _disposable === undefined || _disposable[SymbolDispose]();
      ac.abort();
      if (final) {
        if (!error) {
          lastStreamCleanup.forEach((fn) => fn());
        }
        process2.nextTick(callback, error, value);
      }
    }
    let ret;
    for (let i = 0;i < streams.length; i++) {
      const stream = streams[i];
      const reading = i < streams.length - 1;
      const writing = i > 0;
      const end = reading || (opts === null || opts === undefined ? undefined : opts.end) !== false;
      const isLastStream = i === streams.length - 1;
      if (isNodeStream(stream)) {
        let onError2 = function(err) {
          if (err && err.name !== "AbortError" && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
            finish(err);
          }
        };
        var onError = onError2;
        if (end) {
          const { destroy, cleanup } = destroyer(stream, reading, writing);
          destroys.push(destroy);
          if (isReadable(stream) && isLastStream) {
            lastStreamCleanup.push(cleanup);
          }
        }
        stream.on("error", onError2);
        if (isReadable(stream) && isLastStream) {
          lastStreamCleanup.push(() => {
            stream.removeListener("error", onError2);
          });
        }
      }
      if (i === 0) {
        if (typeof stream === "function") {
          ret = stream({
            signal
          });
          if (!isIterable(ret)) {
            throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or Stream", "source", ret);
          }
        } else if (isIterable(stream) || isReadableNodeStream(stream) || isTransformStream(stream)) {
          ret = stream;
        } else {
          ret = Duplex.from(stream);
        }
      } else if (typeof stream === "function") {
        if (isTransformStream(ret)) {
          var _ret;
          ret = makeAsyncIterable((_ret = ret) === null || _ret === undefined ? undefined : _ret.readable);
        } else {
          ret = makeAsyncIterable(ret);
        }
        ret = stream(ret, {
          signal
        });
        if (reading) {
          if (!isIterable(ret, true)) {
            throw new ERR_INVALID_RETURN_VALUE("AsyncIterable", `transform[${i - 1}]`, ret);
          }
        } else {
          var _ret2;
          if (!PassThrough) {
            PassThrough = require_passthrough();
          }
          const pt = new PassThrough({
            objectMode: true
          });
          const then = (_ret2 = ret) === null || _ret2 === undefined ? undefined : _ret2.then;
          if (typeof then === "function") {
            finishCount++;
            then.call(ret, (val) => {
              value = val;
              if (val != null) {
                pt.write(val);
              }
              if (end) {
                pt.end();
              }
              process2.nextTick(finish);
            }, (err) => {
              pt.destroy(err);
              process2.nextTick(finish, err);
            });
          } else if (isIterable(ret, true)) {
            finishCount++;
            pumpToNode(ret, pt, finish, {
              end
            });
          } else if (isReadableStream(ret) || isTransformStream(ret)) {
            const toRead = ret.readable || ret;
            finishCount++;
            pumpToNode(toRead, pt, finish, {
              end
            });
          } else {
            throw new ERR_INVALID_RETURN_VALUE("AsyncIterable or Promise", "destination", ret);
          }
          ret = pt;
          const { destroy, cleanup } = destroyer(ret, false, true);
          destroys.push(destroy);
          if (isLastStream) {
            lastStreamCleanup.push(cleanup);
          }
        }
      } else if (isNodeStream(stream)) {
        if (isReadableNodeStream(ret)) {
          finishCount += 2;
          const cleanup = pipe(ret, stream, finish, {
            end
          });
          if (isReadable(stream) && isLastStream) {
            lastStreamCleanup.push(cleanup);
          }
        } else if (isTransformStream(ret) || isReadableStream(ret)) {
          const toRead = ret.readable || ret;
          finishCount++;
          pumpToNode(toRead, stream, finish, {
            end
          });
        } else if (isIterable(ret)) {
          finishCount++;
          pumpToNode(ret, stream, finish, {
            end
          });
        } else {
          throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"], ret);
        }
        ret = stream;
      } else if (isWebStream(stream)) {
        if (isReadableNodeStream(ret)) {
          finishCount++;
          pumpToWeb(makeAsyncIterable(ret), stream, finish, {
            end
          });
        } else if (isReadableStream(ret) || isIterable(ret)) {
          finishCount++;
          pumpToWeb(ret, stream, finish, {
            end
          });
        } else if (isTransformStream(ret)) {
          finishCount++;
          pumpToWeb(ret.readable, stream, finish, {
            end
          });
        } else {
          throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"], ret);
        }
        ret = stream;
      } else {
        ret = Duplex.from(stream);
      }
    }
    if (signal !== null && signal !== undefined && signal.aborted || outerSignal !== null && outerSignal !== undefined && outerSignal.aborted) {
      process2.nextTick(abort);
    }
    return ret;
  }
  function pipe(src, dst, finish, { end }) {
    let ended = false;
    dst.on("close", () => {
      if (!ended) {
        finish(new ERR_STREAM_PREMATURE_CLOSE);
      }
    });
    src.pipe(dst, {
      end: false
    });
    if (end) {
      let endFn2 = function() {
        ended = true;
        dst.end();
      };
      var endFn = endFn2;
      if (isReadableFinished(src)) {
        process2.nextTick(endFn2);
      } else {
        src.once("end", endFn2);
      }
    } else {
      finish();
    }
    eos(src, {
      readable: true,
      writable: false
    }, (err) => {
      const rState = src._readableState;
      if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && rState && rState.ended && !rState.errored && !rState.errorEmitted) {
        src.once("end", finish).once("error", finish);
      } else {
        finish(err);
      }
    });
    return eos(dst, {
      readable: false,
      writable: true
    }, finish);
  }
  module.exports = {
    pipelineImpl,
    pipeline
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/compose.js
var require_compose = __commonJS((exports, module) => {
  var { pipeline } = require_pipeline();
  var Duplex = require_duplex();
  var { destroyer } = require_destroy();
  var {
    isNodeStream,
    isReadable,
    isWritable,
    isWebStream,
    isTransformStream,
    isWritableStream,
    isReadableStream
  } = require_utils();
  var {
    AbortError,
    codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
  } = require_errors();
  var eos = require_end_of_stream();
  module.exports = function compose(...streams) {
    if (streams.length === 0) {
      throw new ERR_MISSING_ARGS("streams");
    }
    if (streams.length === 1) {
      return Duplex.from(streams[0]);
    }
    const orgStreams = [...streams];
    if (typeof streams[0] === "function") {
      streams[0] = Duplex.from(streams[0]);
    }
    if (typeof streams[streams.length - 1] === "function") {
      const idx = streams.length - 1;
      streams[idx] = Duplex.from(streams[idx]);
    }
    for (let n = 0;n < streams.length; ++n) {
      if (!isNodeStream(streams[n]) && !isWebStream(streams[n])) {
        continue;
      }
      if (n < streams.length - 1 && !(isReadable(streams[n]) || isReadableStream(streams[n]) || isTransformStream(streams[n]))) {
        throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be readable");
      }
      if (n > 0 && !(isWritable(streams[n]) || isWritableStream(streams[n]) || isTransformStream(streams[n]))) {
        throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be writable");
      }
    }
    let ondrain;
    let onfinish;
    let onreadable;
    let onclose;
    let d;
    function onfinished(err) {
      const cb = onclose;
      onclose = null;
      if (cb) {
        cb(err);
      } else if (err) {
        d.destroy(err);
      } else if (!readable && !writable) {
        d.destroy();
      }
    }
    const head = streams[0];
    const tail = pipeline(streams, onfinished);
    const writable = !!(isWritable(head) || isWritableStream(head) || isTransformStream(head));
    const readable = !!(isReadable(tail) || isReadableStream(tail) || isTransformStream(tail));
    d = new Duplex({
      writableObjectMode: !!(head !== null && head !== undefined && head.writableObjectMode),
      readableObjectMode: !!(tail !== null && tail !== undefined && tail.readableObjectMode),
      writable,
      readable
    });
    if (writable) {
      if (isNodeStream(head)) {
        d._write = function(chunk, encoding, callback) {
          if (head.write(chunk, encoding)) {
            callback();
          } else {
            ondrain = callback;
          }
        };
        d._final = function(callback) {
          head.end();
          onfinish = callback;
        };
        head.on("drain", function() {
          if (ondrain) {
            const cb = ondrain;
            ondrain = null;
            cb();
          }
        });
      } else if (isWebStream(head)) {
        const writable2 = isTransformStream(head) ? head.writable : head;
        const writer = writable2.getWriter();
        d._write = async function(chunk, encoding, callback) {
          try {
            await writer.ready;
            writer.write(chunk).catch(() => {});
            callback();
          } catch (err) {
            callback(err);
          }
        };
        d._final = async function(callback) {
          try {
            await writer.ready;
            writer.close().catch(() => {});
            onfinish = callback;
          } catch (err) {
            callback(err);
          }
        };
      }
      const toRead = isTransformStream(tail) ? tail.readable : tail;
      eos(toRead, () => {
        if (onfinish) {
          const cb = onfinish;
          onfinish = null;
          cb();
        }
      });
    }
    if (readable) {
      if (isNodeStream(tail)) {
        tail.on("readable", function() {
          if (onreadable) {
            const cb = onreadable;
            onreadable = null;
            cb();
          }
        });
        tail.on("end", function() {
          d.push(null);
        });
        d._read = function() {
          while (true) {
            const buf = tail.read();
            if (buf === null) {
              onreadable = d._read;
              return;
            }
            if (!d.push(buf)) {
              return;
            }
          }
        };
      } else if (isWebStream(tail)) {
        const readable2 = isTransformStream(tail) ? tail.readable : tail;
        const reader = readable2.getReader();
        d._read = async function() {
          while (true) {
            try {
              const { value, done } = await reader.read();
              if (!d.push(value)) {
                return;
              }
              if (done) {
                d.push(null);
                return;
              }
            } catch {
              return;
            }
          }
        };
      }
    }
    d._destroy = function(err, callback) {
      if (!err && onclose !== null) {
        err = new AbortError;
      }
      onreadable = null;
      ondrain = null;
      onfinish = null;
      if (onclose === null) {
        callback(err);
      } else {
        onclose = callback;
        if (isNodeStream(tail)) {
          destroyer(tail, err);
        }
      }
    };
    return d;
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/internal/streams/operators.js
var require_operators = __commonJS((exports, module) => {
  var AbortController = globalThis.AbortController || __require("abort-controller").AbortController;
  var {
    codes: { ERR_INVALID_ARG_VALUE, ERR_INVALID_ARG_TYPE, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
    AbortError
  } = require_errors();
  var { validateAbortSignal, validateInteger, validateObject } = require_validators();
  var kWeakHandler = require_primordials().Symbol("kWeak");
  var kResistStopPropagation = require_primordials().Symbol("kResistStopPropagation");
  var { finished } = require_end_of_stream();
  var staticCompose = require_compose();
  var { addAbortSignalNoValidate } = require_add_abort_signal();
  var { isWritable, isNodeStream } = require_utils();
  var { deprecate } = require_util();
  var {
    ArrayPrototypePush,
    Boolean: Boolean2,
    MathFloor,
    Number: Number2,
    NumberIsNaN,
    Promise: Promise2,
    PromiseReject,
    PromiseResolve,
    PromisePrototypeThen,
    Symbol: Symbol2
  } = require_primordials();
  var kEmpty = Symbol2("kEmpty");
  var kEof = Symbol2("kEof");
  function compose(stream, options) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === undefined ? undefined : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    if (isNodeStream(stream) && !isWritable(stream)) {
      throw new ERR_INVALID_ARG_VALUE("stream", stream, "must be writable");
    }
    const composedStream = staticCompose(this, stream);
    if (options !== null && options !== undefined && options.signal) {
      addAbortSignalNoValidate(options.signal, composedStream);
    }
    return composedStream;
  }
  function map(fn, options) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === undefined ? undefined : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    let concurrency = 1;
    if ((options === null || options === undefined ? undefined : options.concurrency) != null) {
      concurrency = MathFloor(options.concurrency);
    }
    let highWaterMark = concurrency - 1;
    if ((options === null || options === undefined ? undefined : options.highWaterMark) != null) {
      highWaterMark = MathFloor(options.highWaterMark);
    }
    validateInteger(concurrency, "options.concurrency", 1);
    validateInteger(highWaterMark, "options.highWaterMark", 0);
    highWaterMark += concurrency;
    return async function* map2() {
      const signal = require_util().AbortSignalAny([options === null || options === undefined ? undefined : options.signal].filter(Boolean2));
      const stream = this;
      const queue = [];
      const signalOpt = {
        signal
      };
      let next;
      let resume;
      let done = false;
      let cnt = 0;
      function onCatch() {
        done = true;
        afterItemProcessed();
      }
      function afterItemProcessed() {
        cnt -= 1;
        maybeResume();
      }
      function maybeResume() {
        if (resume && !done && cnt < concurrency && queue.length < highWaterMark) {
          resume();
          resume = null;
        }
      }
      async function pump() {
        try {
          for await (let val of stream) {
            if (done) {
              return;
            }
            if (signal.aborted) {
              throw new AbortError;
            }
            try {
              val = fn(val, signalOpt);
              if (val === kEmpty) {
                continue;
              }
              val = PromiseResolve(val);
            } catch (err) {
              val = PromiseReject(err);
            }
            cnt += 1;
            PromisePrototypeThen(val, afterItemProcessed, onCatch);
            queue.push(val);
            if (next) {
              next();
              next = null;
            }
            if (!done && (queue.length >= highWaterMark || cnt >= concurrency)) {
              await new Promise2((resolve3) => {
                resume = resolve3;
              });
            }
          }
          queue.push(kEof);
        } catch (err) {
          const val = PromiseReject(err);
          PromisePrototypeThen(val, afterItemProcessed, onCatch);
          queue.push(val);
        } finally {
          done = true;
          if (next) {
            next();
            next = null;
          }
        }
      }
      pump();
      try {
        while (true) {
          while (queue.length > 0) {
            const val = await queue[0];
            if (val === kEof) {
              return;
            }
            if (signal.aborted) {
              throw new AbortError;
            }
            if (val !== kEmpty) {
              yield val;
            }
            queue.shift();
            maybeResume();
          }
          await new Promise2((resolve3) => {
            next = resolve3;
          });
        }
      } finally {
        done = true;
        if (resume) {
          resume();
          resume = null;
        }
      }
    }.call(this);
  }
  function asIndexedPairs(options = undefined) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === undefined ? undefined : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    return async function* asIndexedPairs2() {
      let index = 0;
      for await (const val of this) {
        var _options$signal;
        if (options !== null && options !== undefined && (_options$signal = options.signal) !== null && _options$signal !== undefined && _options$signal.aborted) {
          throw new AbortError({
            cause: options.signal.reason
          });
        }
        yield [index++, val];
      }
    }.call(this);
  }
  async function some(fn, options = undefined) {
    for await (const unused of filter.call(this, fn, options)) {
      return true;
    }
    return false;
  }
  async function every(fn, options = undefined) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    return !await some.call(this, async (...args) => {
      return !await fn(...args);
    }, options);
  }
  async function find(fn, options) {
    for await (const result of filter.call(this, fn, options)) {
      return result;
    }
    return;
  }
  async function forEach(fn, options) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    async function forEachFn(value, options2) {
      await fn(value, options2);
      return kEmpty;
    }
    for await (const unused of map.call(this, forEachFn, options))
      ;
  }
  function filter(fn, options) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    async function filterFn(value, options2) {
      if (await fn(value, options2)) {
        return value;
      }
      return kEmpty;
    }
    return map.call(this, filterFn, options);
  }

  class ReduceAwareErrMissingArgs extends ERR_MISSING_ARGS {
    constructor() {
      super("reduce");
      this.message = "Reduce of an empty stream requires an initial value";
    }
  }
  async function reduce(reducer, initialValue, options) {
    var _options$signal2;
    if (typeof reducer !== "function") {
      throw new ERR_INVALID_ARG_TYPE("reducer", ["Function", "AsyncFunction"], reducer);
    }
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === undefined ? undefined : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    let hasInitialValue = arguments.length > 1;
    if (options !== null && options !== undefined && (_options$signal2 = options.signal) !== null && _options$signal2 !== undefined && _options$signal2.aborted) {
      const err = new AbortError(undefined, {
        cause: options.signal.reason
      });
      this.once("error", () => {});
      await finished(this.destroy(err));
      throw err;
    }
    const ac = new AbortController;
    const signal = ac.signal;
    if (options !== null && options !== undefined && options.signal) {
      const opts = {
        once: true,
        [kWeakHandler]: this,
        [kResistStopPropagation]: true
      };
      options.signal.addEventListener("abort", () => ac.abort(), opts);
    }
    let gotAnyItemFromStream = false;
    try {
      for await (const value of this) {
        var _options$signal3;
        gotAnyItemFromStream = true;
        if (options !== null && options !== undefined && (_options$signal3 = options.signal) !== null && _options$signal3 !== undefined && _options$signal3.aborted) {
          throw new AbortError;
        }
        if (!hasInitialValue) {
          initialValue = value;
          hasInitialValue = true;
        } else {
          initialValue = await reducer(initialValue, value, {
            signal
          });
        }
      }
      if (!gotAnyItemFromStream && !hasInitialValue) {
        throw new ReduceAwareErrMissingArgs;
      }
    } finally {
      ac.abort();
    }
    return initialValue;
  }
  async function toArray(options) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === undefined ? undefined : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    const result = [];
    for await (const val of this) {
      var _options$signal4;
      if (options !== null && options !== undefined && (_options$signal4 = options.signal) !== null && _options$signal4 !== undefined && _options$signal4.aborted) {
        throw new AbortError(undefined, {
          cause: options.signal.reason
        });
      }
      ArrayPrototypePush(result, val);
    }
    return result;
  }
  function flatMap(fn, options) {
    const values = map.call(this, fn, options);
    return async function* flatMap2() {
      for await (const val of values) {
        yield* val;
      }
    }.call(this);
  }
  function toIntegerOrInfinity(number) {
    number = Number2(number);
    if (NumberIsNaN(number)) {
      return 0;
    }
    if (number < 0) {
      throw new ERR_OUT_OF_RANGE("number", ">= 0", number);
    }
    return number;
  }
  function drop(number, options = undefined) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === undefined ? undefined : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    number = toIntegerOrInfinity(number);
    return async function* drop2() {
      var _options$signal5;
      if (options !== null && options !== undefined && (_options$signal5 = options.signal) !== null && _options$signal5 !== undefined && _options$signal5.aborted) {
        throw new AbortError;
      }
      for await (const val of this) {
        var _options$signal6;
        if (options !== null && options !== undefined && (_options$signal6 = options.signal) !== null && _options$signal6 !== undefined && _options$signal6.aborted) {
          throw new AbortError;
        }
        if (number-- <= 0) {
          yield val;
        }
      }
    }.call(this);
  }
  function take(number, options = undefined) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === undefined ? undefined : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    number = toIntegerOrInfinity(number);
    return async function* take2() {
      var _options$signal7;
      if (options !== null && options !== undefined && (_options$signal7 = options.signal) !== null && _options$signal7 !== undefined && _options$signal7.aborted) {
        throw new AbortError;
      }
      for await (const val of this) {
        var _options$signal8;
        if (options !== null && options !== undefined && (_options$signal8 = options.signal) !== null && _options$signal8 !== undefined && _options$signal8.aborted) {
          throw new AbortError;
        }
        if (number-- > 0) {
          yield val;
        }
        if (number <= 0) {
          return;
        }
      }
    }.call(this);
  }
  exports.streamReturningOperators = {
    asIndexedPairs: deprecate(asIndexedPairs, "readable.asIndexedPairs will be removed in a future version."),
    drop,
    filter,
    flatMap,
    map,
    take,
    compose
  };
  exports.promiseReturningOperators = {
    every,
    forEach,
    reduce,
    toArray,
    some,
    find
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/stream/promises.js
var require_promises = __commonJS((exports, module) => {
  var { ArrayPrototypePop, Promise: Promise2 } = require_primordials();
  var { isIterable, isNodeStream, isWebStream } = require_utils();
  var { pipelineImpl: pl } = require_pipeline();
  var { finished } = require_end_of_stream();
  require_stream();
  function pipeline(...streams) {
    return new Promise2((resolve3, reject) => {
      let signal;
      let end;
      const lastArg = streams[streams.length - 1];
      if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg) && !isWebStream(lastArg)) {
        const options = ArrayPrototypePop(streams);
        signal = options.signal;
        end = options.end;
      }
      pl(streams, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve3(value);
        }
      }, {
        signal,
        end
      });
    });
  }
  module.exports = {
    finished,
    pipeline
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/stream.js
var require_stream = __commonJS((exports, module) => {
  var { Buffer: Buffer2 } = __require("buffer");
  var { ObjectDefineProperty, ObjectKeys, ReflectApply } = require_primordials();
  var {
    promisify: { custom: customPromisify }
  } = require_util();
  var { streamReturningOperators, promiseReturningOperators } = require_operators();
  var {
    codes: { ERR_ILLEGAL_CONSTRUCTOR }
  } = require_errors();
  var compose = require_compose();
  var { setDefaultHighWaterMark, getDefaultHighWaterMark } = require_state();
  var { pipeline } = require_pipeline();
  var { destroyer } = require_destroy();
  var eos = require_end_of_stream();
  var promises = require_promises();
  var utils = require_utils();
  var Stream = module.exports = require_legacy().Stream;
  Stream.isDestroyed = utils.isDestroyed;
  Stream.isDisturbed = utils.isDisturbed;
  Stream.isErrored = utils.isErrored;
  Stream.isReadable = utils.isReadable;
  Stream.isWritable = utils.isWritable;
  Stream.Readable = require_readable();
  for (const key of ObjectKeys(streamReturningOperators)) {
    let fn = function(...args) {
      if (new.target) {
        throw ERR_ILLEGAL_CONSTRUCTOR();
      }
      return Stream.Readable.from(ReflectApply(op, this, args));
    };
    const op = streamReturningOperators[key];
    ObjectDefineProperty(fn, "name", {
      __proto__: null,
      value: op.name
    });
    ObjectDefineProperty(fn, "length", {
      __proto__: null,
      value: op.length
    });
    ObjectDefineProperty(Stream.Readable.prototype, key, {
      __proto__: null,
      value: fn,
      enumerable: false,
      configurable: true,
      writable: true
    });
  }
  for (const key of ObjectKeys(promiseReturningOperators)) {
    let fn = function(...args) {
      if (new.target) {
        throw ERR_ILLEGAL_CONSTRUCTOR();
      }
      return ReflectApply(op, this, args);
    };
    const op = promiseReturningOperators[key];
    ObjectDefineProperty(fn, "name", {
      __proto__: null,
      value: op.name
    });
    ObjectDefineProperty(fn, "length", {
      __proto__: null,
      value: op.length
    });
    ObjectDefineProperty(Stream.Readable.prototype, key, {
      __proto__: null,
      value: fn,
      enumerable: false,
      configurable: true,
      writable: true
    });
  }
  Stream.Writable = require_writable();
  Stream.Duplex = require_duplex();
  Stream.Transform = require_transform();
  Stream.PassThrough = require_passthrough();
  Stream.pipeline = pipeline;
  var { addAbortSignal } = require_add_abort_signal();
  Stream.addAbortSignal = addAbortSignal;
  Stream.finished = eos;
  Stream.destroy = destroyer;
  Stream.compose = compose;
  Stream.setDefaultHighWaterMark = setDefaultHighWaterMark;
  Stream.getDefaultHighWaterMark = getDefaultHighWaterMark;
  ObjectDefineProperty(Stream, "promises", {
    __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return promises;
    }
  });
  ObjectDefineProperty(pipeline, customPromisify, {
    __proto__: null,
    enumerable: true,
    get() {
      return promises.pipeline;
    }
  });
  ObjectDefineProperty(eos, customPromisify, {
    __proto__: null,
    enumerable: true,
    get() {
      return promises.finished;
    }
  });
  Stream.Stream = Stream;
  Stream._isUint8Array = function isUint8Array(value) {
    return value instanceof Uint8Array;
  };
  Stream._uint8ArrayToBuffer = function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  };
});

// ../../node_modules/.pnpm/readable-stream@4.7.0/node_modules/readable-stream/lib/ours/index.js
var require_ours = __commonJS((exports, module) => {
  var Stream = __require("stream");
  if (Stream && process.env.READABLE_STREAM === "disable") {
    const promises = Stream.promises;
    module.exports._uint8ArrayToBuffer = Stream._uint8ArrayToBuffer;
    module.exports._isUint8Array = Stream._isUint8Array;
    module.exports.isDisturbed = Stream.isDisturbed;
    module.exports.isErrored = Stream.isErrored;
    module.exports.isReadable = Stream.isReadable;
    module.exports.Readable = Stream.Readable;
    module.exports.Writable = Stream.Writable;
    module.exports.Duplex = Stream.Duplex;
    module.exports.Transform = Stream.Transform;
    module.exports.PassThrough = Stream.PassThrough;
    module.exports.addAbortSignal = Stream.addAbortSignal;
    module.exports.finished = Stream.finished;
    module.exports.destroy = Stream.destroy;
    module.exports.pipeline = Stream.pipeline;
    module.exports.compose = Stream.compose;
    Object.defineProperty(Stream, "promises", {
      configurable: true,
      enumerable: true,
      get() {
        return promises;
      }
    });
    module.exports.Stream = Stream.Stream;
  } else {
    const CustomStream = require_stream();
    const promises = require_promises();
    const originalDestroy = CustomStream.Readable.destroy;
    module.exports = CustomStream.Readable;
    module.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer;
    module.exports._isUint8Array = CustomStream._isUint8Array;
    module.exports.isDisturbed = CustomStream.isDisturbed;
    module.exports.isErrored = CustomStream.isErrored;
    module.exports.isReadable = CustomStream.isReadable;
    module.exports.Readable = CustomStream.Readable;
    module.exports.Writable = CustomStream.Writable;
    module.exports.Duplex = CustomStream.Duplex;
    module.exports.Transform = CustomStream.Transform;
    module.exports.PassThrough = CustomStream.PassThrough;
    module.exports.addAbortSignal = CustomStream.addAbortSignal;
    module.exports.finished = CustomStream.finished;
    module.exports.destroy = CustomStream.destroy;
    module.exports.destroy = originalDestroy;
    module.exports.pipeline = CustomStream.pipeline;
    module.exports.compose = CustomStream.compose;
    Object.defineProperty(CustomStream, "promises", {
      configurable: true,
      enumerable: true,
      get() {
        return promises;
      }
    });
    module.exports.Stream = CustomStream.Stream;
  }
  module.exports.default = module.exports;
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/index.ts
init_eventEmitter();
await __promiseAll([
  init_BrowserWindow(),
  init_BrowserView(),
  init_Tray()
]);

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/ApplicationMenu.ts
init_eventEmitter();
await init_native();
var exports_ApplicationMenu = {};
__export(exports_ApplicationMenu, {
  setApplicationMenu: () => setApplicationMenu,
  on: () => on
});

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/menuRoles.ts
var roleLabelMap = {
  about: "About",
  quit: "Quit",
  hide: "Hide",
  hideOthers: "Hide Others",
  showAll: "Show All",
  minimize: "Minimize",
  zoom: "Zoom",
  close: "Close",
  bringAllToFront: "Bring All To Front",
  cycleThroughWindows: "Cycle Through Windows",
  enterFullScreen: "Enter Full Screen",
  exitFullScreen: "Exit Full Screen",
  toggleFullScreen: "Toggle Full Screen",
  undo: "Undo",
  redo: "Redo",
  cut: "Cut",
  copy: "Copy",
  paste: "Paste",
  pasteAndMatchStyle: "Paste and Match Style",
  delete: "Delete",
  selectAll: "Select All",
  startSpeaking: "Start Speaking",
  stopSpeaking: "Stop Speaking",
  showHelp: "Show Help",
  moveForward: "Move Forward",
  moveBackward: "Move Backward",
  moveLeft: "Move Left",
  moveRight: "Move Right",
  moveUp: "Move Up",
  moveDown: "Move Down",
  moveWordForward: "Move Word Forward",
  moveWordBackward: "Move Word Backward",
  moveWordLeft: "Move Word Left",
  moveWordRight: "Move Word Right",
  moveToBeginningOfLine: "Move to Beginning of Line",
  moveToEndOfLine: "Move to End of Line",
  moveToLeftEndOfLine: "Move to Left End of Line",
  moveToRightEndOfLine: "Move to Right End of Line",
  moveToBeginningOfParagraph: "Move to Beginning of Paragraph",
  moveToEndOfParagraph: "Move to End of Paragraph",
  moveParagraphForward: "Move Paragraph Forward",
  moveParagraphBackward: "Move Paragraph Backward",
  moveToBeginningOfDocument: "Move to Beginning of Document",
  moveToEndOfDocument: "Move to End of Document",
  moveForwardAndModifySelection: "Move Forward and Modify Selection",
  moveBackwardAndModifySelection: "Move Backward and Modify Selection",
  moveLeftAndModifySelection: "Move Left and Modify Selection",
  moveRightAndModifySelection: "Move Right and Modify Selection",
  moveUpAndModifySelection: "Move Up and Modify Selection",
  moveDownAndModifySelection: "Move Down and Modify Selection",
  moveWordForwardAndModifySelection: "Move Word Forward and Modify Selection",
  moveWordBackwardAndModifySelection: "Move Word Backward and Modify Selection",
  moveWordLeftAndModifySelection: "Move Word Left and Modify Selection",
  moveWordRightAndModifySelection: "Move Word Right and Modify Selection",
  moveToBeginningOfLineAndModifySelection: "Move to Beginning of Line and Modify Selection",
  moveToEndOfLineAndModifySelection: "Move to End of Line and Modify Selection",
  moveToLeftEndOfLineAndModifySelection: "Move to Left End of Line and Modify Selection",
  moveToRightEndOfLineAndModifySelection: "Move to Right End of Line and Modify Selection",
  moveToBeginningOfParagraphAndModifySelection: "Move to Beginning of Paragraph and Modify Selection",
  moveToEndOfParagraphAndModifySelection: "Move to End of Paragraph and Modify Selection",
  moveParagraphForwardAndModifySelection: "Move Paragraph Forward and Modify Selection",
  moveParagraphBackwardAndModifySelection: "Move Paragraph Backward and Modify Selection",
  moveToBeginningOfDocumentAndModifySelection: "Move to Beginning of Document and Modify Selection",
  moveToEndOfDocumentAndModifySelection: "Move to End of Document and Modify Selection",
  pageUp: "Page Up",
  pageDown: "Page Down",
  pageUpAndModifySelection: "Page Up and Modify Selection",
  pageDownAndModifySelection: "Page Down and Modify Selection",
  scrollLineUp: "Scroll Line Up",
  scrollLineDown: "Scroll Line Down",
  scrollPageUp: "Scroll Page Up",
  scrollPageDown: "Scroll Page Down",
  scrollToBeginningOfDocument: "Scroll to Beginning of Document",
  scrollToEndOfDocument: "Scroll to End of Document",
  centerSelectionInVisibleArea: "Center Selection in Visible Area",
  deleteBackward: "Delete Backward",
  deleteForward: "Delete Forward",
  deleteBackwardByDecomposingPreviousCharacter: "Delete Backward by Decomposing Previous Character",
  deleteWordBackward: "Delete Word Backward",
  deleteWordForward: "Delete Word Forward",
  deleteToBeginningOfLine: "Delete to Beginning of Line",
  deleteToEndOfLine: "Delete to End of Line",
  deleteToBeginningOfParagraph: "Delete to Beginning of Paragraph",
  deleteToEndOfParagraph: "Delete to End of Paragraph",
  selectWord: "Select Word",
  selectLine: "Select Line",
  selectParagraph: "Select Paragraph",
  selectToMark: "Select to Mark",
  setMark: "Set Mark",
  swapWithMark: "Swap with Mark",
  deleteToMark: "Delete to Mark",
  capitalizeWord: "Capitalize Word",
  uppercaseWord: "Uppercase Word",
  lowercaseWord: "Lowercase Word",
  transpose: "Transpose",
  transposeWords: "Transpose Words",
  insertNewline: "Insert Newline",
  insertLineBreak: "Insert Line Break",
  insertParagraphSeparator: "Insert Paragraph Separator",
  insertTab: "Insert Tab",
  insertBacktab: "Insert Backtab",
  insertTabIgnoringFieldEditor: "Insert Tab Ignoring Field Editor",
  insertNewlineIgnoringFieldEditor: "Insert Newline Ignoring Field Editor",
  yank: "Yank",
  yankAndSelect: "Yank and Select",
  complete: "Complete",
  cancelOperation: "Cancel Operation",
  indent: "Indent"
};

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/ApplicationMenu.ts
var setApplicationMenu = (menu) => {
  const menuWithDefaults = menuConfigWithDefaults2(menu);
  ffi.request.setApplicationMenu({
    menuConfig: JSON.stringify(menuWithDefaults)
  });
};
var on = (name, handler) => {
  const specificName = `${name}`;
  eventEmitter_default.on(specificName, handler);
};
var menuConfigWithDefaults2 = (menu) => {
  return menu.map((item) => {
    if (item.type === "divider" || item.type === "separator") {
      return { type: "divider" };
    } else {
      const menuItem = item;
      const actionWithDataId = ffi.internal.serializeMenuAction(menuItem.action || "", menuItem.data);
      return {
        label: menuItem.label || roleLabelMap[menuItem.role] || "",
        type: menuItem.type || "normal",
        ...menuItem.role ? { role: menuItem.role } : { action: actionWithDataId },
        enabled: menuItem.enabled === false ? false : true,
        checked: Boolean(menuItem.checked),
        hidden: Boolean(menuItem.hidden),
        tooltip: menuItem.tooltip || undefined,
        accelerator: menuItem.accelerator || undefined,
        ...menuItem.submenu ? { submenu: menuConfigWithDefaults2(menuItem.submenu) } : {}
      };
    }
  });
};

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/core/ContextMenu.ts
init_eventEmitter();
await init_native();
var exports_ContextMenu = {};
__export(exports_ContextMenu, {
  showContextMenu: () => showContextMenu,
  on: () => on2
});
var showContextMenu = (menu) => {
  const menuWithDefaults = menuConfigWithDefaults3(menu);
  ffi.request.showContextMenu({
    menuConfig: JSON.stringify(menuWithDefaults)
  });
};
var on2 = (name, handler) => {
  const specificName = `${name}`;
  eventEmitter_default.on(specificName, handler);
};
var menuConfigWithDefaults3 = (menu) => {
  return menu.map((item) => {
    if (item.type === "divider" || item.type === "separator") {
      return { type: "divider" };
    } else {
      const menuItem = item;
      const actionWithDataId = ffi.internal.serializeMenuAction(menuItem.action || "", menuItem.data);
      return {
        label: menuItem.label || roleLabelMap[menuItem.role] || "",
        type: menuItem.type || "normal",
        ...menuItem.role ? { role: menuItem.role } : { action: actionWithDataId },
        enabled: menuItem.enabled === false ? false : true,
        checked: Boolean(menuItem.checked),
        hidden: Boolean(menuItem.hidden),
        tooltip: menuItem.tooltip || undefined,
        ...menuItem.accelerator ? { accelerator: menuItem.accelerator } : {},
        ...menuItem.submenu ? { submenu: menuConfigWithDefaults3(menuItem.submenu) } : {}
      };
    }
  });
};

// ../../node_modules/.pnpm/electrobun@1.14.4/node_modules/electrobun/dist/api/bun/index.ts
init_Paths();
init_BuildConfig();
await __promiseAll([
  init_Updater(),
  init_Utils(),
  init_Socket(),
  init_native()
]);
var Electrobun = {
  BrowserWindow,
  BrowserView,
  Tray,
  Updater,
  Utils: exports_Utils,
  ApplicationMenu: exports_ApplicationMenu,
  ContextMenu: exports_ContextMenu,
  GlobalShortcut,
  Screen,
  Session,
  BuildConfig,
  events: eventEmitter_default,
  PATHS: exports_Paths,
  Socket: exports_Socket
};
var bun_default = Electrobun;

// src/platform/fs.ts
import path from "path";
var allowedRoot = null;
function validatePath(inputPath) {
  const resolved = path.resolve(inputPath);
  if (!allowedRoot) {
    throw new Error("No workspace root set. Open a folder first.");
  }
  if (resolved !== allowedRoot && !resolved.startsWith(allowedRoot + path.sep)) {
    throw new Error(`Access denied: path outside workspace \u2014 ${inputPath}`);
  }
  return resolved;
}
async function readFile(params) {
  const safePath = validatePath(params.path);
  const file = Bun.file(safePath);
  return await file.text();
}
async function writeFile(params) {
  const safePath = validatePath(params.path);
  await Bun.write(safePath, params.content);
}
async function readDir(params) {
  const safePath = validatePath(params.path);
  const fs = await import("fs/promises");
  const entries = await fs.readdir(safePath, { withFileTypes: true });
  return entries.map((entry) => ({
    name: entry.name,
    path: `${safePath}/${entry.name}`,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    isSymlink: entry.isSymbolicLink()
  }));
}
async function exists(params) {
  const safePath = validatePath(params.path);
  const file = Bun.file(safePath);
  return await file.exists();
}
async function mkdir(params) {
  const safePath = validatePath(params.path);
  const fs = await import("fs/promises");
  await fs.mkdir(safePath, { recursive: params.recursive ?? true });
}
async function fileStat(params) {
  const safePath = validatePath(params.path);
  const fs = await import("fs/promises");
  const s = await fs.stat(safePath);
  return {
    size: s.size,
    isDirectory: s.isDirectory(),
    isFile: s.isFile(),
    isSymlink: s.isSymbolicLink(),
    createdAt: s.birthtimeMs,
    modifiedAt: s.mtimeMs,
    accessedAt: s.atimeMs
  };
}
async function remove(params) {
  const safePath = validatePath(params.path);
  const fs = await import("fs/promises");
  await fs.rm(safePath, { recursive: params.recursive ?? false });
}
async function rename(params) {
  const safeOldPath = validatePath(params.oldPath);
  const safeNewPath = validatePath(params.newPath);
  const fs = await import("fs/promises");
  await fs.rename(safeOldPath, safeNewPath);
}
var activeWatchers = new Map;
async function watch(path2, callback) {
  const fs = await import("fs");
  const watcher = fs.watch(path2, { recursive: true }, (eventType, filename) => {
    if (!filename)
      return;
    const fullPath = `${path2}/${filename}`;
    const fsEvent = {
      type: eventType === "rename" ? "rename" : "modify",
      path: fullPath
    };
    callback(fsEvent);
  });
  const cleanup = () => {
    watcher.close();
    activeWatchers.delete(path2);
  };
  activeWatchers.set(path2, { close: cleanup });
  return cleanup;
}
function stopAllWatchers() {
  for (const [, watcher] of activeWatchers) {
    watcher.close();
  }
  activeWatchers.clear();
}

// src/platform/git.ts
var import_isomorphic_git = __toESM(require_isomorphic_git(), 1);
import * as fs from "fs";

// ../../node_modules/.pnpm/isomorphic-git@1.37.2/node_modules/isomorphic-git/http/node/index.js
var import_simple_get = __toESM(require_simple_get(), 1);
function fromValue(value) {
  let queue = [value];
  return {
    next() {
      return Promise.resolve({ done: queue.length === 0, value: queue.pop() });
    },
    return() {
      queue = [];
      return {};
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function getIterator(iterable) {
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]();
  }
  if (iterable[Symbol.iterator]) {
    return iterable[Symbol.iterator]();
  }
  if (iterable.next) {
    return iterable;
  }
  return fromValue(iterable);
}
async function forAwait(iterable, cb) {
  const iter = getIterator(iterable);
  while (true) {
    const { value, done } = await iter.next();
    if (value)
      await cb(value);
    if (done)
      break;
  }
  if (iter.return)
    iter.return();
}
function asyncIteratorToStream(iter) {
  const { PassThrough } = require_ours();
  const stream = new PassThrough;
  setTimeout(async () => {
    await forAwait(iter, (chunk) => stream.write(chunk));
    stream.end();
  }, 1);
  return stream;
}
async function collect(iterable) {
  let size = 0;
  const buffers = [];
  await forAwait(iterable, (value) => {
    buffers.push(value);
    size += value.byteLength;
  });
  const result = new Uint8Array(size);
  let nextIndex = 0;
  for (const buffer of buffers) {
    result.set(buffer, nextIndex);
    nextIndex += buffer.byteLength;
  }
  return result;
}
function fromNodeStream(stream) {
  const asyncIterator = Object.getOwnPropertyDescriptor(stream, Symbol.asyncIterator);
  if (asyncIterator && asyncIterator.enumerable) {
    return stream;
  }
  let ended = false;
  const queue = [];
  let defer = {};
  stream.on("data", (chunk) => {
    queue.push(chunk);
    if (defer.resolve) {
      defer.resolve({ value: queue.shift(), done: false });
      defer = {};
    }
  });
  stream.on("error", (err) => {
    if (defer.reject) {
      defer.reject(err);
      defer = {};
    }
  });
  stream.on("end", () => {
    ended = true;
    if (defer.resolve) {
      defer.resolve({ done: true });
      defer = {};
    }
  });
  return {
    next() {
      return new Promise((resolve3, reject) => {
        if (queue.length === 0 && ended) {
          return resolve3({ done: true });
        } else if (queue.length > 0) {
          return resolve3({ value: queue.shift(), done: false });
        } else if (queue.length === 0 && !ended) {
          defer = { resolve: resolve3, reject };
        }
      });
    },
    return() {
      stream.removeAllListeners();
      if (stream.destroy)
        stream.destroy();
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function request({
  onProgress,
  url,
  method = "GET",
  headers = {},
  agent,
  body
}) {
  if (body && Array.isArray(body)) {
    body = Buffer.from(await collect(body));
  } else if (body) {
    body = asyncIteratorToStream(body);
  }
  return new Promise((resolve3, reject) => {
    import_simple_get.default({
      url,
      method,
      headers,
      agent,
      body
    }, (err, res) => {
      if (err)
        return reject(err);
      try {
        const iter = fromNodeStream(res);
        resolve3({
          url: res.url,
          method: res.method,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body: iter,
          headers: res.headers
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}
var index = { request };
var node_default = index;

// src/platform/git.ts
async function isRepo(params) {
  try {
    await import_isomorphic_git.default.findRoot({ fs, filepath: params.dir });
    return true;
  } catch {
    return false;
  }
}
async function getStatus(params) {
  const matrix = await import_isomorphic_git.default.statusMatrix({ fs, dir: params.dir });
  return matrix.map(([filepath, head, workdir, stage]) => ({
    filepath,
    head,
    workdir,
    stage
  }));
}
async function currentBranch(params) {
  const branch = await import_isomorphic_git.default.currentBranch({
    fs,
    dir: params.dir,
    fullname: false
  });
  return branch ?? "HEAD";
}
async function branches(params) {
  return await import_isomorphic_git.default.listBranches({ fs, dir: params.dir });
}
async function log(params) {
  const commits = await import_isomorphic_git.default.log({
    fs,
    dir: params.dir,
    depth: params.depth ?? 50
  });
  return commits.map((entry) => ({
    oid: entry.oid,
    message: entry.commit.message,
    author: {
      name: entry.commit.author.name,
      email: entry.commit.author.email,
      timestamp: entry.commit.author.timestamp
    },
    parent: entry.commit.parent
  }));
}
async function stage(params) {
  await import_isomorphic_git.default.add({
    fs,
    dir: params.dir,
    filepath: params.filepath
  });
}
async function commit(params) {
  const oid = await import_isomorphic_git.default.commit({
    fs,
    dir: params.dir,
    message: params.message,
    author: {
      name: params.author.name,
      email: params.author.email
    }
  });
  return oid;
}
function makeAuth(auth) {
  return {
    onAuth: () => ({
      username: auth.username ?? (auth.token ? "oauth2" : ""),
      password: auth.password ?? auth.token ?? ""
    })
  };
}
async function push(params) {
  await import_isomorphic_git.default.push({
    fs,
    http: node_default,
    dir: params.dir,
    remote: params.remote,
    ref: params.branch,
    ...makeAuth(params.auth)
  });
}
async function pull(params) {
  await import_isomorphic_git.default.pull({
    fs,
    http: node_default,
    dir: params.dir,
    remote: params.remote,
    ref: params.branch,
    author: {
      name: "Mark9",
      email: "mark9@local"
    },
    ...makeAuth(params.auth)
  });
}

// src/bun/index.ts
var rpc = defineElectrobunRPC("bun", {
  maxRequestTime: 30000,
  handlers: {
    requests: {
      "fs:readFile": (params) => readFile(params),
      "fs:writeFile": (params) => writeFile(params),
      "fs:readDir": (params) => readDir(params),
      "fs:exists": (params) => exists(params),
      "fs:mkdir": (params) => mkdir(params),
      "fs:stat": (params) => fileStat(params),
      "fs:remove": (params) => remove(params),
      "fs:rename": (params) => rename(params),
      "git:isRepo": (params) => isRepo(params),
      "git:status": (params) => getStatus(params),
      "git:stage": (params) => stage(params),
      "git:commit": (params) => commit(params),
      "git:push": (params) => push(params),
      "git:pull": (params) => pull(params),
      "git:log": (params) => log(params),
      "git:branches": (params) => branches(params),
      "git:currentBranch": (params) => currentBranch(params),
      "dialog:openFile": async (_params) => {
        return null;
      },
      "dialog:saveFile": async (_params) => {
        return null;
      },
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
      }
    },
    messages: {
      "editor:contentChanged": (payload) => {
        const dirtyMarker = payload.isDirty ? " *" : "";
        mainWindow.setTitle(`Mark9${dirtyMarker}`);
      },
      "editor:ready": () => {
        console.log("[Mark9] Editor is ready");
      }
    }
  }
});
exports_ApplicationMenu.setApplicationMenu([
  {
    label: "Mark9",
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "showAll" },
      { type: "separator" },
      { role: "quit" }
    ]
  },
  {
    label: "File",
    submenu: [
      {
        label: "New File",
        accelerator: "CommandOrControl+N",
        action: "file:new"
      },
      {
        label: "Open File...",
        accelerator: "CommandOrControl+O",
        action: "file:open"
      },
      {
        label: "Open Folder...",
        accelerator: "CommandOrControl+Shift+O",
        action: "file:openFolder"
      },
      { type: "separator" },
      {
        label: "Save",
        accelerator: "CommandOrControl+S",
        action: "file:save"
      },
      {
        label: "Save As...",
        accelerator: "CommandOrControl+Shift+S",
        action: "file:saveAs"
      },
      { type: "separator" },
      { role: "close" }
    ]
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
        action: "edit:find"
      },
      {
        label: "Replace...",
        accelerator: "CommandOrControl+H",
        action: "edit:replace"
      }
    ]
  },
  {
    label: "View",
    submenu: [
      {
        label: "Toggle Sidebar",
        accelerator: "CommandOrControl+B",
        action: "view:toggleSidebar"
      },
      {
        label: "Toggle Source Mode",
        accelerator: "CommandOrControl+/",
        action: "view:toggleSource"
      },
      { type: "separator" },
      {
        label: "Zoom In",
        accelerator: "CommandOrControl+Plus",
        action: "view:zoomIn"
      },
      {
        label: "Zoom Out",
        accelerator: "CommandOrControl+Minus",
        action: "view:zoomOut"
      },
      {
        label: "Reset Zoom",
        accelerator: "CommandOrControl+0",
        action: "view:zoomReset"
      },
      { type: "separator" },
      { role: "toggleFullScreen" }
    ]
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Mark9 Documentation",
        action: "help:docs"
      },
      {
        label: "Report Issue",
        action: "help:reportIssue"
      },
      { type: "separator" },
      {
        label: "About Mark9",
        action: "help:about"
      }
    ]
  }
]);
exports_ApplicationMenu.on("application-menu-clicked", (event) => {
  const menuEvent = event;
  if (menuEvent?.data?.action) {
    rpc.send("menu:action", { action: menuEvent.data.action });
  }
});
var mainWindow = new BrowserWindow({
  title: "Mark9",
  frame: {
    x: 100,
    y: 100,
    width: 1200,
    height: 800
  },
  url: "views://main/index.html",
  titleBarStyle: "hiddenInset",
  transparent: false,
  sandbox: false,
  rpc
});
var stopWatcher = null;
async function watchWorkspace(dir) {
  if (stopWatcher) {
    stopWatcher();
    stopWatcher = null;
  }
  stopWatcher = await watch(dir, (event) => {
    rpc.send("fs:watch", event);
  });
}
bun_default.events.on("before-quit", () => {
  stopAllWatchers();
});
export {
  watchWorkspace,
  rpc,
  mainWindow
};
