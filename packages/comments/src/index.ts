export type {
  AnchorResolution,
  BlockSelector,
  CommentAnchor,
  CommentMessage,
  CommentStatus,
  CommentThread,
  CommentsAdapter,
  Selector,
  SelectorType,
  TextPositionSelector,
  TextQuoteSelector,
} from "./types.js";

export { computeAnchor, getQuotedText } from "./anchor/compute.js";
export { resolveAnchor } from "./anchor/resolve.js";

export {
  JsonSidecarAdapter,
  InMemorySidecarStorage,
  type JsonSidecarAdapterOptions,
  type SidecarStorage,
} from "./adapters/json-sidecar.js";

export {
  useCommentsStore,
  type ResolvedThread,
} from "./stores/comments-store.js";

export type {
  CommentHighlight,
  SelectionToAnchor,
} from "./prosemirror/comment-decorations.js";

export { CommentBubble, type CommentBubbleProps } from "./components/CommentBubble.js";
export {
  CommentThreadView,
  type CommentThreadViewProps,
} from "./components/CommentThreadView.js";
export {
  CommentSidePanel,
  type CommentSidePanelProps,
} from "./components/CommentSidePanel.js";
