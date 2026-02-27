/**
 * Milkdown plugin that renders KaTeX math expressions inline.
 *
 * - Inline math: `$...$` — rendered inline with surrounding text
 * - Block math: `$$...$$` — rendered as centered block display
 *
 * Uses ProseMirror Decorations to overlay KaTeX-rendered HTML
 * on top of the raw `$...$` text in the document.
 *
 * Typora-style UX: shows rendered math normally, reveals raw source
 * when the cursor is inside the expression.
 */
import { $prose } from "@milkdown/kit/utils";
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { Decoration, DecorationSet } from "@milkdown/kit/prose/view";
import type { EditorView } from "@milkdown/kit/prose/view";
import type { Node as PMNode } from "@milkdown/kit/prose/model";
import katex from "katex";

const mathPluginKey = new PluginKey("katex-math");

interface MathMatch {
  from: number;
  to: number;
  formula: string;
  displayMode: boolean;
}

/**
 * Scan a text node for math delimiters ($...$ and $$...$$).
 */
function findMathInText(
  text: string,
  baseOffset: number,
): MathMatch[] {
  const matches: MathMatch[] = [];

  // Match $$...$$ (block) first, then $...$ (inline)
  // Use a single pass regex that handles both
  const regex = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    const isBlock = m[1] !== undefined;
    const formula = isBlock ? m[1] : m[2];
    if (!formula || !formula.trim()) continue;

    matches.push({
      from: baseOffset + m.index,
      to: baseOffset + m.index + m[0].length,
      formula: formula.trim(),
      displayMode: isBlock,
    });
  }

  return matches;
}

/**
 * Scan the entire document for math expressions.
 */
function findAllMath(doc: PMNode): MathMatch[] {
  const matches: MathMatch[] = [];

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    const found = findMathInText(node.text, pos);
    matches.push(...found);
  });

  return matches;
}

/**
 * Render a KaTeX formula to HTML string.
 */
function renderKatex(formula: string, displayMode: boolean): string | null {
  try {
    return katex.renderToString(formula, {
      displayMode,
      throwOnError: false,
      trust: false,
      strict: false,
    });
  } catch {
    return null;
  }
}

/**
 * Build decorations for all math expressions not under the cursor.
 */
function buildDecorations(
  doc: PMNode,
  cursorPos: number,
): DecorationSet {
  const allMath = findAllMath(doc);
  const decorations: Decoration[] = [];

  for (const match of allMath) {
    // If cursor is inside this math expression, show raw source
    if (cursorPos >= match.from && cursorPos <= match.to) {
      // Add a subtle highlight class to the raw source
      decorations.push(
        Decoration.inline(match.from, match.to, {
          class: "math-source-editing",
        }),
      );
      continue;
    }

    const html = renderKatex(match.formula, match.displayMode);
    if (!html) continue;

    // Replace the raw text with rendered KaTeX
    decorations.push(
      Decoration.widget(match.from, () => {
        const wrapper = document.createElement(
          match.displayMode ? "div" : "span",
        );
        wrapper.className = match.displayMode
          ? "math-block-rendered"
          : "math-inline-rendered";
        wrapper.innerHTML = html;
        return wrapper;
      }),
    );

    // Hide the raw source text
    decorations.push(
      Decoration.inline(match.from, match.to, {
        class: "math-source-hidden",
      }),
    );
  }

  return DecorationSet.create(doc, decorations);
}

/**
 * Milkdown plugin for KaTeX math rendering.
 */
export const mathPlugin = $prose(
  () =>
    new Plugin({
      key: mathPluginKey,
      state: {
        init(_, { doc }) {
          return buildDecorations(doc, -1);
        },
        apply(tr, decorations) {
          if (tr.docChanged || tr.selectionSet) {
            const cursorPos = tr.selection.$from.pos;
            return buildDecorations(tr.doc, cursorPos);
          }
          return decorations.map(tr.mapping, tr.doc);
        },
      },
      props: {
        decorations(state) {
          return mathPluginKey.getState(state) as DecorationSet | undefined;
        },
        // Click on rendered math → place cursor inside to edit
        handleClickOn(
          view: EditorView,
          _pos: number,
          _node: PMNode,
          _nodePos: number,
          event: MouseEvent,
        ): boolean {
          const target = event.target as HTMLElement;
          const rendered = target.closest(
            ".math-inline-rendered, .math-block-rendered",
          );
          if (!rendered) return false;

          // Find which decoration this belongs to by scanning math in doc
          const allMath = findAllMath(view.state.doc);
          for (const match of allMath) {
            const dom = view.domAtPos(match.from);
            if (
              dom.node &&
              (rendered === dom.node ||
                (dom.node as HTMLElement).contains?.(rendered))
            ) {
              // Place cursor at the start of the math expression
              const tr = view.state.tr.setSelection(
                view.state.selection.constructor
                  // @ts-expect-error — TextSelection.create
                  .create(view.state.doc, match.from + 1),
              );
              view.dispatch(tr);
              return true;
            }
          }

          return false;
        },
      },
    }),
);
