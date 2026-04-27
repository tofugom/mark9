/**
 * @mark9/comments — type definitions
 *
 * The anchor model is intentionally close to the W3C Web Annotation Data Model
 * (https://www.w3.org/TR/annotation-model/) so each thread carries multiple
 * selectors. Resolution tries them in priority order and falls back gracefully
 * when the document body has been edited.
 */

export type SelectorType = "TextQuote" | "TextPosition" | "Block";

/**
 * Hypothes.is-style fuzzy text anchor.
 * `prefix`/`suffix` are 32 characters of context before/after the selection,
 * which lets resolution disambiguate when the same `exact` text appears multiple
 * times and survives small surrounding edits.
 */
export interface TextQuoteSelector {
  type: "TextQuote";
  exact: string;
  prefix?: string;
  suffix?: string;
}

/** Character offset into the plain-text projection of the document. */
export interface TextPositionSelector {
  type: "TextPosition";
  start: number;
  end: number;
}

/**
 * ProseMirror block-level selector. `blockId` is the stable id assigned to a
 * block node (see anchor/compute.ts). Most resilient under in-place edits;
 * dies only when the block itself is deleted.
 */
export interface BlockSelector {
  type: "Block";
  blockId: string;
  /** Optional text range *within* the block (offsets into the block's plain text). */
  startOffset?: number;
  endOffset?: number;
}

export type Selector = TextQuoteSelector | TextPositionSelector | BlockSelector;

export interface CommentAnchor {
  /** Selectors in priority order. Resolution tries them top-to-bottom. */
  selectors: Selector[];
}

export interface CommentMessage {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  editedAt?: string;
}

export type CommentStatus = "open" | "resolved" | "orphaned";

export interface CommentThread {
  id: string;
  documentPath: string;
  anchor: CommentAnchor;
  /** The originally-selected text — shown as the quoted block in the side panel. */
  quotedText: string;
  messages: CommentMessage[];
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Result of resolving an anchor against the current document. `range` is the
 * matched plain-text range; `confidence` reports which selector strategy
 * actually succeeded.
 */
export interface AnchorResolution {
  range: { start: number; end: number };
  confidence: "exact" | "fuzzy" | "block" | "approximate";
  matchedSelector: SelectorType;
}

export interface CommentsAdapter {
  list(documentPath: string): Promise<CommentThread[]>;
  create(
    documentPath: string,
    thread: Omit<CommentThread, "id" | "createdAt" | "updatedAt">,
  ): Promise<CommentThread>;
  update(
    threadId: string,
    patch: Partial<Pick<CommentThread, "messages" | "status" | "anchor" | "quotedText">>,
  ): Promise<CommentThread>;
  delete(threadId: string): Promise<void>;
}
