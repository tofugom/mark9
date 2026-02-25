/**
 * Local type declarations for Electrobun.
 *
 * Electrobun ships raw .ts source files rather than compiled .d.ts,
 * and some of its internal code has type errors under strict TypeScript
 * settings. This declaration file provides the subset of Electrobun's
 * API types that @mark9/desktop uses, allowing `tsc --noEmit` to pass
 * without importing Electrobun's full source tree.
 *
 * When Electrobun ships proper .d.ts declarations, this file can be
 * removed and replaced with direct imports from "electrobun".
 */

declare module "electrobun" {
  // ─── RPC types ───────────────────────────────────────────────────

  export interface ElectrobunRPCSchema {
    bun: RPCSchema;
    webview: RPCSchema;
  }

  export interface RPCSchema<I extends { requests?: unknown; messages?: unknown } | void = void> {
    requests: I extends { requests: infer R } ? R : Record<never, unknown>;
    messages: I extends { messages: infer M } ? M : Record<never, unknown>;
  }

  export interface RPCTransport {
    send?: (data: unknown) => void;
    registerHandler?: (handler: (msg: unknown) => void) => void;
    unregisterHandler?: () => void;
  }

  export interface RPCWithTransport {
    setTransport: (transport: RPCTransport) => void;
  }

  type RPCRequestsProxy<RS> = {
    [K in keyof RS]: (
      ...args: "params" extends keyof RS[K]
        ? undefined extends RS[K]["params"]
          ? [params?: RS[K]["params"]]
          : [params: RS[K]["params"]]
        : []
    ) => Promise<"response" extends keyof RS[K] ? RS[K]["response"] : void>;
  };

  type RPCMessagesProxy<MS> = {
    [K in keyof MS]-?: (
      ...args: void extends MS[K]
        ? []
        : undefined extends MS[K]
          ? [payload?: MS[K]]
          : [payload: MS[K]]
    ) => void;
  };

  type RPCMessageHandlerFn<MS, N extends keyof MS> = (payload: MS[N]) => void;

  type WildcardRPCMessageHandlerFn<MS> = (
    messageName: keyof MS,
    payload: unknown,
  ) => void;

  type RPCRequestHandler<RS> =
    | ((method: keyof RS, params: unknown) => unknown | Promise<unknown>)
    | {
        [M in keyof RS]?: (
          ...args: "params" extends keyof RS[M]
            ? undefined extends RS[M]["params"]
              ? [params?: RS[M]["params"]]
              : [params: RS[M]["params"]]
            : []
        ) => unknown | Promise<unknown>;
      };

  export type ElectrobunRPCConfig<
    Schema extends ElectrobunRPCSchema,
    Side extends "bun" | "webview",
  > = {
    maxRequestTime?: number;
    handlers: {
      requests?: RPCRequestHandler<Schema[Side]["requests"]>;
      messages?: {
        [K in keyof Schema[Side]["messages"]]?: RPCMessageHandlerFn<
          Schema[Side]["messages"],
          K
        >;
      } & {
        "*"?: WildcardRPCMessageHandlerFn<Schema[Side]["messages"]>;
      };
    };
  };

  type OtherSide<S extends "bun" | "webview"> = S extends "bun" ? "webview" : "bun";

  type SendFn<MS> = {
    <M extends keyof MS>(
      message: M,
      ...args: void extends MS[M]
        ? []
        : undefined extends MS[M]
          ? [payload?: MS[M]]
          : [payload: MS[M]]
    ): void;
  } & RPCMessagesProxy<MS>;

  type RequestFn<RS> = {
    <M extends keyof RS>(
      method: M,
      ...args: "params" extends keyof RS[M]
        ? undefined extends RS[M]["params"]
          ? [params?: RS[M]["params"]]
          : [params: RS[M]["params"]]
        : []
    ): Promise<"response" extends keyof RS[M] ? RS[M]["response"] : void>;
  } & RPCRequestsProxy<RS>;

  interface RPCInstance<
    Schema extends ElectrobunRPCSchema,
    Side extends "bun" | "webview",
  > extends RPCWithTransport {
    request: RequestFn<Schema[OtherSide<Side>]["requests"]>;
    requestProxy: RPCRequestsProxy<Schema[OtherSide<Side>]["requests"]>;
    send: SendFn<Schema[OtherSide<Side>]["messages"]>;
    sendProxy: RPCMessagesProxy<Schema[OtherSide<Side>]["messages"]>;
    addMessageListener: <M extends keyof Schema[Side]["messages"]>(
      message: M,
      listener: RPCMessageHandlerFn<Schema[Side]["messages"], M>,
    ) => void;
    removeMessageListener: <M extends keyof Schema[Side]["messages"]>(
      message: M,
      listener: RPCMessageHandlerFn<Schema[Side]["messages"], M>,
    ) => void;
    proxy: {
      send: RPCMessagesProxy<Schema[OtherSide<Side>]["messages"]>;
      request: RPCRequestsProxy<Schema[OtherSide<Side>]["requests"]>;
    };
  }

  export function defineElectrobunRPC<
    Schema extends ElectrobunRPCSchema,
  >(
    side: "bun",
    config: ElectrobunRPCConfig<Schema, "bun"> & {
      extraRequestHandlers?: Record<string, Function>;
    },
  ): RPCInstance<Schema, "bun">;

  export function defineElectrobunRPC<
    Schema extends ElectrobunRPCSchema,
  >(
    side: "webview",
    config: ElectrobunRPCConfig<Schema, "webview"> & {
      extraRequestHandlers?: Record<string, Function>;
    },
  ): RPCInstance<Schema, "webview">;

  export function createRPC<
    Schema extends RPCSchema,
    RemoteSchema extends RPCSchema,
  >(options?: unknown): unknown;

  // ─── BrowserWindow ───────────────────────────────────────────────

  export type WindowOptionsType<T = undefined> = {
    title: string;
    frame: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    url: string | null;
    html: string | null;
    preload: string | null;
    renderer: "native" | "cef";
    rpc?: T;
    styleMask?: Record<string, boolean>;
    titleBarStyle: "hidden" | "hiddenInset" | "default";
    transparent: boolean;
    navigationRules: string | null;
    sandbox: boolean;
  };

  export class BrowserWindow<T extends RPCWithTransport = RPCWithTransport> {
    id: number;
    title: string;
    url: string | null;
    frame: { x: number; y: number; width: number; height: number };

    constructor(options?: Partial<WindowOptionsType<T>>);

    setTitle(title: string): void;
    close(): void;
    focus(): void;
    show(): void;
    minimize(): void;
    unminimize(): void;
    isMinimized(): boolean;
    maximize(): void;
    unmaximize(): void;
    isMaximized(): boolean;
    setFullScreen(fullScreen: boolean): void;
    isFullScreen(): boolean;
    setAlwaysOnTop(alwaysOnTop: boolean): void;
    isAlwaysOnTop(): boolean;
    setPosition(x: number, y: number): void;
    setSize(width: number, height: number): void;
    setFrame(x: number, y: number, width: number, height: number): void;
    getFrame(): { x: number; y: number; width: number; height: number };
    getPosition(): { x: number; y: number };
    getSize(): { width: number; height: number };
    on(name: string, handler: (event: unknown) => void): void;
  }

  // ─── ApplicationMenu ────────────────────────────────────────────

  export interface ApplicationMenuItemConfig {
    label?: string;
    type?: "normal" | "separator" | "divider";
    action?: string;
    role?: string;
    submenu?: ApplicationMenuItemConfig[];
    enabled?: boolean;
    checked?: boolean;
    hidden?: boolean;
    accelerator?: string;
    tooltip?: string;
    data?: unknown;
  }

  export namespace ApplicationMenu {
    function setApplicationMenu(menu: ApplicationMenuItemConfig[]): void;
    function on(
      name: "application-menu-clicked",
      handler: (event: unknown) => void,
    ): void;
  }

  // ─── Electrobun default export ───────────────────────────────────

  interface ElectrobunEvents {
    on(name: string, handler: (event: unknown) => void): void;
  }

  const Electrobun: {
    BrowserWindow: typeof BrowserWindow;
    ApplicationMenu: typeof ApplicationMenu;
    events: ElectrobunEvents;
  };

  export default Electrobun;
}

declare module "electrobun/bun" {
  export {
    BrowserWindow,
    ApplicationMenu,
    Updater,
    defineElectrobunRPC,
  } from "electrobun";
  export type {
    RPCSchema,
    ElectrobunRPCSchema,
    ElectrobunRPCConfig,
    WindowOptionsType,
    ApplicationMenuItemConfig,
  } from "electrobun";
  import Electrobun from "electrobun";
  export default Electrobun;
}

declare module "electrobun/view" {
  import type { ElectrobunRPCSchema, ElectrobunRPCConfig, RPCWithTransport } from "electrobun";

  export class Electroview<T extends RPCWithTransport> {
    static defineRPC<Schema extends ElectrobunRPCSchema>(
      config: ElectrobunRPCConfig<Schema, "webview">,
    ): T;
  }

  export default { Electroview };
}
