export { Mark9Viewer, type Mark9ViewerProps } from "./Mark9Viewer.js";
export { Mark9ViewerApp, type Mark9ViewerAppProps } from "./Mark9ViewerApp.js";
export { CommentMargin, type CommentMarginProps } from "./components/CommentMargin.js";

export {
  FetchLoader,
  MemoryLoader,
  type DocumentLoader,
  type FetchLoaderOptions,
} from "./adapters/fetch-loader.js";

export { useTextSelection, type TextSelection } from "./hooks/useTextSelection.js";
export { useCommentHighlights } from "./hooks/useCommentHighlights.js";
