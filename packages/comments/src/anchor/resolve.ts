import type {
  AnchorResolution,
  CommentAnchor,
  TextPositionSelector,
  TextQuoteSelector,
} from "../types.js";

/**
 * Try to resolve a comment anchor against the current text of a document.
 *
 * Strategy:
 *   1. TextQuote exact + prefix/suffix match → "exact" confidence
 *   2. TextQuote exact match alone → "exact"
 *   3. TextQuote fuzzy match around the original TextPosition → "fuzzy"
 *   4. Position-only fallback → "approximate"
 *
 * Returns `null` if nothing matched (caller should mark thread as orphaned).
 */
export function resolveAnchor(
  text: string,
  anchor: CommentAnchor,
): AnchorResolution | null {
  const quote = anchor.selectors.find(
    (s): s is TextQuoteSelector => s.type === "TextQuote",
  );
  const position = anchor.selectors.find(
    (s): s is TextPositionSelector => s.type === "TextPosition",
  );

  if (quote && quote.exact.length > 0) {
    const contextual = findWithContext(text, quote);
    if (contextual !== null) {
      return {
        range: contextual,
        confidence: "exact",
        matchedSelector: "TextQuote",
      };
    }

    const exactOnly = findExact(text, quote.exact, position?.start);
    if (exactOnly !== null) {
      return {
        range: exactOnly,
        confidence: "exact",
        matchedSelector: "TextQuote",
      };
    }

    const fuzzy = findFuzzy(text, quote, position);
    if (fuzzy !== null) {
      return {
        range: fuzzy,
        confidence: "fuzzy",
        matchedSelector: "TextQuote",
      };
    }
  }

  if (position && position.start <= text.length && position.end <= text.length) {
    return {
      range: { start: position.start, end: position.end },
      confidence: "approximate",
      matchedSelector: "TextPosition",
    };
  }

  return null;
}

function findWithContext(
  text: string,
  quote: TextQuoteSelector,
): { start: number; end: number } | null {
  const { exact, prefix = "", suffix = "" } = quote;
  if (!prefix && !suffix) return null;

  const needle = prefix + exact + suffix;
  const idx = text.indexOf(needle);
  if (idx === -1) return null;
  const start = idx + prefix.length;
  return { start, end: start + exact.length };
}

function findExact(
  text: string,
  exact: string,
  hintStart: number | undefined,
): { start: number; end: number } | null {
  if (typeof hintStart === "number") {
    // Prefer the occurrence closest to the original position.
    const indices: number[] = [];
    let from = 0;
    while (from <= text.length) {
      const i = text.indexOf(exact, from);
      if (i === -1) break;
      indices.push(i);
      from = i + 1;
    }
    if (indices.length === 0) return null;
    let best = indices[0]!;
    let bestDist = Math.abs(best - hintStart);
    for (const i of indices) {
      const d = Math.abs(i - hintStart);
      if (d < bestDist) {
        best = i;
        bestDist = d;
      }
    }
    return { start: best, end: best + exact.length };
  }
  const idx = text.indexOf(exact);
  if (idx === -1) return null;
  return { start: idx, end: idx + exact.length };
}

/**
 * Fuzzy match: scan a window around the original position and pick the
 * substring with the smallest Levenshtein distance to `exact`. Threshold scales
 * with quote length so short quotes stay strict, long quotes tolerate small
 * edits.
 */
function findFuzzy(
  text: string,
  quote: TextQuoteSelector,
  position: TextPositionSelector | undefined,
): { start: number; end: number } | null {
  const { exact } = quote;
  const N = exact.length;
  if (N === 0) return null;

  const windowRadius = Math.max(200, N * 4);
  const center = position?.start ?? Math.floor(text.length / 2);
  const winStart = Math.max(0, center - windowRadius);
  const winEnd = Math.min(text.length, center + windowRadius + N);

  const threshold = Math.max(2, Math.floor(N * 0.25));
  let best: { start: number; distance: number } | null = null;

  for (let i = winStart; i + N <= winEnd; i++) {
    const candidate = text.slice(i, i + N);
    const d = levenshtein(candidate, exact, threshold + 1);
    if (d <= threshold && (best === null || d < best.distance)) {
      best = { start: i, distance: d };
      if (d === 0) break;
    }
  }

  if (best === null) return null;
  return { start: best.start, end: best.start + N };
}

/**
 * Levenshtein distance with an early-exit cap so long-quote misses don't burn
 * O(N²) work. Returns `cap` if the distance is at least `cap`.
 */
function levenshtein(a: string, b: string, cap: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) >= cap) return cap;

  const m = a.length;
  const n = b.length;
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j]! + 1,
        curr[j - 1]! + 1,
        prev[j - 1]! + cost,
      );
      if (curr[j]! < rowMin) rowMin = curr[j]!;
    }
    if (rowMin >= cap) return cap;
    [prev, curr] = [curr, prev];
  }
  return prev[n]!;
}
