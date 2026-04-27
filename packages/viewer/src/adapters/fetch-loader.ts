/**
 * Loader that resolves a document path to markdown content.
 * The host app picks an implementation that fits its routing model.
 */
export interface DocumentLoader {
  load(path: string): Promise<string>;
}

export interface FetchLoaderOptions {
  /** Optional prefix prepended to the path. e.g. `/static/docs`. */
  baseUrl?: string;
  /** Custom fetch (testing, auth headers, …). Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch;
}

/** Loads markdown by `fetch()` — suitable for static hosting and SPAs. */
export class FetchLoader implements DocumentLoader {
  constructor(private readonly options: FetchLoaderOptions = {}) {}

  async load(path: string): Promise<string> {
    const url = (this.options.baseUrl ?? "") + path;
    const f = this.options.fetch ?? fetch;
    const res = await f(url);
    if (!res.ok) {
      throw new Error(`[mark9/viewer] failed to load ${url}: ${res.status}`);
    }
    return res.text();
  }
}

/** Loader backed by an in-memory map. Useful for demos and tests. */
export class MemoryLoader implements DocumentLoader {
  constructor(private readonly files: Record<string, string>) {}

  async load(path: string): Promise<string> {
    const content = this.files[path];
    if (typeof content !== "string") {
      throw new Error(`[mark9/viewer] not found: ${path}`);
    }
    return content;
  }
}
