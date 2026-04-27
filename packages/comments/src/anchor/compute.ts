import type {
  CommentAnchor,
  TextQuoteSelector,
  TextPositionSelector,
} from "../types.js";

const CONTEXT_LENGTH = 32;

/**
 * Build a `CommentAnchor` from a selection over a plain-text projection of the
 * document. The PM-block selector can be added later by viewer code that has
 * access to the ProseMirror state; this function intentionally stays
 * dependency-free.
 */
export function computeAnchor(
  text: string,
  start: number,
  end: number,
): CommentAnchor {
  const safeStart = Math.max(0, Math.min(start, text.length));
  const safeEnd = Math.max(safeStart, Math.min(end, text.length));

  const exact = text.slice(safeStart, safeEnd);
  const prefix = text.slice(Math.max(0, safeStart - CONTEXT_LENGTH), safeStart);
  const suffix = text.slice(safeEnd, Math.min(text.length, safeEnd + CONTEXT_LENGTH));

  const quote: TextQuoteSelector = {
    type: "TextQuote",
    exact,
    prefix,
    suffix,
  };
  const position: TextPositionSelector = {
    type: "TextPosition",
    start: safeStart,
    end: safeEnd,
  };

  return {
    // TextQuote first — it's the most resilient under edits. Position is the
    // tie-breaker and a fast happy path when nothing has changed.
    selectors: [quote, position],
  };
}

export function getQuotedText(anchor: CommentAnchor): string {
  const quote = anchor.selectors.find(
    (s): s is TextQuoteSelector => s.type === "TextQuote",
  );
  return quote?.exact ?? "";
}
