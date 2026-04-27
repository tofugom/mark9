/**
 * ProseMirror plugin that auto-completes Markdown delimiter pairs while
 * leaving Milkdown's existing input rules intact.
 *
 * Triggers:
 *   - typing `*` immediately after another `*`  → insert closing `**`
 *   - typing `_` immediately after another `_`  → insert closing `__`
 *   - typing `~` immediately after another `~`  → insert closing `~~`
 *   - typing a single `` ` ``                   → insert closing `` ` ``
 *
 * In every case the cursor is left between the new pair so the user can keep
 * typing the styled content. The pair is *raw text* — Milkdown's commonmark
 * input rules will still see `**foo**` / `__foo__` / etc. and convert them to
 * the appropriate mark when the pattern completes.
 *
 * To avoid double-pairing, we skip if the next character already matches the
 * delimiter (mirrors VS Code / CodeMirror's autoCloseBrackets logic).
 */
import { $prose } from "@milkdown/kit/utils";
import { Plugin, PluginKey, TextSelection } from "@milkdown/kit/prose/state";

const KEY = new PluginKey("mark9-auto-pair");

interface DoublePair {
  readonly char: string;
  readonly close: string;
}

const DOUBLE_PAIRS: DoublePair[] = [
  { char: "*", close: "**" },
  { char: "_", close: "__" },
  { char: "~", close: "~~" },
];

const SINGLE_PAIRS: Record<string, string> = {
  "`": "`",
};

export const autoPairPlugin = $prose(() =>
  new Plugin({
    key: KEY,
    props: {
      handleTextInput(view, from, to, text) {
        if (text.length !== 1) return false;
        const { state } = view;
        const { selection, doc } = state;
        if (!selection.empty) return false;

        // Skip inside code blocks — they get their own handling and the
        // delimiters have no markdown meaning there.
        const $from = doc.resolve(from);
        const parent = $from.parent;
        if (parent.type.name === "code_block" || parent.type.name === "fence") {
          return false;
        }

        const charBefore = from > 0 ? doc.textBetween(from - 1, from, "\n") : "";
        const charAfter = to < doc.content.size ? doc.textBetween(to, to + 1, "\n") : "";

        // Don't double-pair: typing the closing half of an existing pair
        // should just step over it.
        if (charAfter === text) {
          const tr = state.tr.setSelection(
            TextSelection.create(state.doc, to + 1),
          );
          view.dispatch(tr);
          return true;
        }

        // Single-char pair (e.g. backtick).
        const singleClose = SINGLE_PAIRS[text];
        if (singleClose) {
          // Avoid pairing right after the same character — looks like the user
          // is escaping or building a triple-backtick code fence.
          if (charBefore === text) return false;
          const tr = state.tr
            .insertText(text + singleClose, from, to)
            .setSelection(TextSelection.create(state.doc, from + 1));
          view.dispatch(tr);
          return true;
        }

        // Double-char pair: trigger only when the character before is the same.
        const dbl = DOUBLE_PAIRS.find((p) => p.char === text);
        if (dbl && charBefore === dbl.char) {
          // The user just turned `*` into `**`. Insert closing `**` and place
          // cursor between the two pairs.
          const tr = state.tr
            .insertText(text + dbl.close, from, to)
            .setSelection(
              TextSelection.create(state.doc, from + 1),
            );
          view.dispatch(tr);
          return true;
        }

        return false;
      },
    },
  }),
);
