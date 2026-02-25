/**
 * Enhanced code block NodeView plugin for Milkdown.
 *
 * Typora-style UX:
 * - Default (cursor outside): syntax-highlighted, beautified view
 * - Cursor inside: plain editable code with language label + copy button
 * - Language label (bottom-right): shows & allows changing with autocomplete
 * - Copy button (top-right): copies code content to clipboard
 * - Enter for newlines, auto-closing brackets
 */
import type { NodeView, ViewMutationRecord } from "@milkdown/kit/prose/view";
import type { EditorView } from "@milkdown/kit/prose/view";
import type { Node as ProsemirrorNode } from "@milkdown/kit/prose/model";
import { TextSelection } from "@milkdown/kit/prose/state";
import hljs from "highlight.js/lib/core";

// Register common languages
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import c from "highlight.js/lib/languages/c";
import csharp from "highlight.js/lib/languages/csharp";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import ruby from "highlight.js/lib/languages/ruby";
import php from "highlight.js/lib/languages/php";
import swift from "highlight.js/lib/languages/swift";
import kotlin from "highlight.js/lib/languages/kotlin";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import scss from "highlight.js/lib/languages/scss";
import markdownLang from "highlight.js/lib/languages/markdown";
import yaml from "highlight.js/lib/languages/yaml";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import plaintext from "highlight.js/lib/languages/plaintext";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c", c);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("cs", csharp);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("rs", rust);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("rb", ruby);
hljs.registerLanguage("php", php);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("kt", kotlin);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("markdown", markdownLang);
hljs.registerLanguage("md", markdownLang);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("text", plaintext);

/** All supported language names for autocomplete */
const SUPPORTED_LANGUAGES = [
  "javascript", "js", "typescript", "ts", "python", "py",
  "java", "cpp", "c", "csharp", "cs", "go", "rust", "rs",
  "ruby", "rb", "php", "swift", "kotlin", "kt", "sql",
  "bash", "sh", "shell", "json", "xml", "html", "css", "scss",
  "markdown", "md", "yaml", "yml", "dockerfile", "plaintext", "text",
];

/** Bracket pairs for auto-closing */
const BRACKET_PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
};

/** Registry of active CodeBlockNodeView instances for cursor tracking */
const codeBlockViews = new Set<CodeBlockNodeView>();

export { codeBlockViews };

/**
 * Handle keydown events inside code blocks.
 * Returns true if the event was handled (should be consumed).
 */
export function handleCodeBlockKeyDown(
  view: EditorView,
  event: KeyboardEvent,
): boolean {
  const { $from } = view.state.selection;

  // Check if cursor is inside a code_block
  let inCodeBlock = false;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === "code_block") {
      inCodeBlock = true;
      break;
    }
  }
  if (!inCodeBlock) return false;

  // Enter → insert newline
  if (event.key === "Enter" && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
    view.dispatch(view.state.tr.insertText("\n").scrollIntoView());
    return true;
  }

  // Tab → insert 2 spaces
  if (event.key === "Tab" && !event.shiftKey) {
    view.dispatch(view.state.tr.insertText("  ").scrollIntoView());
    return true;
  }

  // Auto-closing brackets: (, [, {
  const closingBracket = BRACKET_PAIRS[event.key];
  if (closingBracket && !event.metaKey && !event.ctrlKey) {
    const { from, to } = view.state.selection;
    if (from === to) {
      // No selection: insert pair and place cursor between
      view.dispatch(
        view.state.tr
          .insertText(event.key + closingBracket)
          .setSelection(TextSelection.create(view.state.doc, from + 1))
          .scrollIntoView(),
      );
    } else {
      // Selection: wrap selection with brackets
      const selectedText = view.state.doc.textBetween(from, to);
      view.dispatch(
        view.state.tr
          .replaceWith(from, to, view.state.schema.text(event.key + selectedText + closingBracket))
          .setSelection(TextSelection.create(view.state.doc, from + 1, from + 1 + selectedText.length))
          .scrollIntoView(),
      );
    }
    return true;
  }

  // Auto-closing quotes: ", '
  if ((event.key === '"' || event.key === "'") && !event.metaKey && !event.ctrlKey) {
    const { from, to } = view.state.selection;
    const q = event.key;
    if (from === to) {
      // Check if next char is already the same quote (skip over it)
      const after = view.state.doc.textBetween(from, Math.min(from + 1, view.state.doc.content.size));
      if (after === q) {
        // Skip over existing closing quote
        view.dispatch(
          view.state.tr
            .setSelection(TextSelection.create(view.state.doc, from + 1))
            .scrollIntoView(),
        );
        return true;
      }
      view.dispatch(
        view.state.tr
          .insertText(q + q)
          .setSelection(TextSelection.create(view.state.doc, from + 1))
          .scrollIntoView(),
      );
    } else {
      const selectedText = view.state.doc.textBetween(from, to);
      view.dispatch(
        view.state.tr
          .replaceWith(from, to, view.state.schema.text(q + selectedText + q))
          .setSelection(TextSelection.create(view.state.doc, from + 1, from + 1 + selectedText.length))
          .scrollIntoView(),
      );
    }
    return true;
  }

  // Skip over closing bracket if typing it and it's already there
  if ([")", "]", "}"].includes(event.key) && !event.metaKey && !event.ctrlKey) {
    const { from } = view.state.selection;
    const after = view.state.doc.textBetween(from, Math.min(from + 1, view.state.doc.content.size));
    if (after === event.key) {
      view.dispatch(
        view.state.tr
          .setSelection(TextSelection.create(view.state.doc, from + 1))
          .scrollIntoView(),
      );
      return true;
    }
  }

  // Backspace: delete matching bracket pair if both are adjacent
  if (event.key === "Backspace" && !event.metaKey && !event.ctrlKey) {
    const { from, to } = view.state.selection;
    if (from === to && from > 0) {
      const before = view.state.doc.textBetween(from - 1, from);
      const after = view.state.doc.textBetween(from, Math.min(from + 1, view.state.doc.content.size));
      if (BRACKET_PAIRS[before] === after || (before === '"' && after === '"') || (before === "'" && after === "'")) {
        view.dispatch(
          view.state.tr
            .delete(from - 1, from + 1)
            .scrollIntoView(),
        );
        return true;
      }
    }
  }

  return false;
}

/**
 * Enhanced code block NodeView with syntax highlighting, language label, and copy button.
 */
export class CodeBlockNodeView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement;

  node: ProsemirrorNode;
  private view: EditorView;
  getPos: () => number | undefined;
  isEditing = false;

  private wrapper: HTMLElement;
  private editContainer: HTMLElement;
  private highlightContainer: HTMLElement;
  private languageLabel: HTMLElement;
  private langInput: HTMLInputElement;
  private langDropdown: HTMLElement;
  private copyBtn: HTMLElement;
  private copyFeedback: HTMLElement;
  private isLangEditing = false;

  constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    codeBlockViews.add(this);

    const language = (node.attrs.language as string) || "";

    // ── Outer wrapper ──
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("codeblock-wrapper");
    this.dom = this.wrapper;

    // ── Copy button (top-right) ──
    this.copyBtn = document.createElement("button");
    this.copyBtn.classList.add("codeblock-copy-btn");
    this.copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    this.copyBtn.title = "Copy code";
    this.copyBtn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.copyCode();
    });
    this.wrapper.appendChild(this.copyBtn);

    // ── Copy feedback ──
    this.copyFeedback = document.createElement("span");
    this.copyFeedback.classList.add("codeblock-copy-feedback");
    this.copyFeedback.textContent = "Copied!";
    this.wrapper.appendChild(this.copyFeedback);

    // ── Highlighted view (visible when NOT editing) ──
    this.highlightContainer = document.createElement("pre");
    this.highlightContainer.classList.add("codeblock-highlight");
    this.wrapper.appendChild(this.highlightContainer);

    this.highlightContainer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.startEditing();
    });

    // ── Editable code area (visible when editing) ──
    this.editContainer = document.createElement("pre");
    this.editContainer.classList.add("codeblock-edit");
    const codeEl = document.createElement("code");
    this.editContainer.appendChild(codeEl);
    this.contentDOM = codeEl;
    this.wrapper.appendChild(this.editContainer);

    // ── Language label + autocomplete (bottom-right) ──
    const langContainer = document.createElement("div");
    langContainer.classList.add("codeblock-lang-container");

    this.languageLabel = document.createElement("div");
    this.languageLabel.classList.add("codeblock-lang-label");
    this.languageLabel.textContent = language || "plain";
    this.languageLabel.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showLangInput();
    });
    langContainer.appendChild(this.languageLabel);

    this.langInput = document.createElement("input");
    this.langInput.classList.add("codeblock-lang-input");
    this.langInput.type = "text";
    this.langInput.placeholder = "language";
    this.langInput.style.display = "none";
    this.langInput.addEventListener("input", () => this.onLangInput());
    this.langInput.addEventListener("keydown", (e) => this.onLangKeyDown(e));
    this.langInput.addEventListener("blur", () => {
      setTimeout(() => this.hideLangInput(), 150);
    });
    langContainer.appendChild(this.langInput);

    this.langDropdown = document.createElement("div");
    this.langDropdown.classList.add("codeblock-lang-dropdown");
    this.langDropdown.style.display = "none";
    langContainer.appendChild(this.langDropdown);

    this.wrapper.appendChild(langContainer);

    // Start in editing mode if code block is empty (just created)
    const isEmpty = !node.textContent.trim();
    if (isEmpty) {
      this.isEditing = true;
    }

    this.renderHighlight();
    this.updateVisibility();
  }

  update(node: ProsemirrorNode): boolean {
    if (node.type.name !== "code_block") return false;
    if (node.attrs.language === "mermaid") return false;
    this.node = node;

    const language = (node.attrs.language as string) || "";
    this.languageLabel.textContent = language || "plain";

    if (this.isEditing) {
      this.renderHighlight();
    }
    return true;
  }

  ignoreMutation(mutation: ViewMutationRecord): boolean {
    if (mutation.type === "selection") return true;
    if (
      this.contentDOM &&
      (this.contentDOM === mutation.target ||
        this.contentDOM.contains(mutation.target))
    ) {
      return false;
    }
    return true;
  }

  stopEvent(event: Event): boolean {
    // Let language input handle its own events
    if (this.isLangEditing) {
      const target = event.target as HTMLElement;
      if (
        target === this.langInput ||
        this.langDropdown.contains(target)
      ) {
        return true;
      }
    }
    return false;
  }

  destroy(): void {
    codeBlockViews.delete(this);
  }

  setEditing(editing: boolean): void {
    if (this.isEditing === editing) return;
    this.isEditing = editing;
    if (!editing) {
      this.renderHighlight();
    }
    this.updateVisibility();
  }

  private startEditing(): void {
    if (this.isEditing) return;
    this.isEditing = true;
    this.updateVisibility();

    const pos = this.getPos();
    if (pos !== undefined) {
      try {
        const resolvedPos = this.view.state.doc.resolve(pos + 1);
        this.view.dispatch(
          this.view.state.tr.setSelection(
            TextSelection.create(this.view.state.doc, resolvedPos.pos),
          ),
        );
        this.view.focus();
      } catch {
        // ignore
      }
    }
  }

  private updateVisibility(): void {
    if (this.isEditing) {
      this.editContainer.style.display = "";
      this.highlightContainer.style.display = "none";
      this.wrapper.classList.add("codeblock-editing");
    } else {
      this.editContainer.style.display = "none";
      this.highlightContainer.style.display = "";
      this.wrapper.classList.remove("codeblock-editing");
    }
  }

  private renderHighlight(): void {
    const code = this.node.textContent;
    const language = (this.node.attrs.language as string) || "";

    if (!code.trim()) {
      this.highlightContainer.innerHTML = `<code class="codeblock-placeholder">Click to add code...</code>`;
      return;
    }

    try {
      let highlighted: string;
      if (language && hljs.getLanguage(language)) {
        highlighted = hljs.highlight(code, { language }).value;
      } else {
        highlighted = hljs.highlightAuto(code).value;
      }
      this.highlightContainer.innerHTML = `<code class="hljs">${highlighted}</code>`;
    } catch {
      const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      this.highlightContainer.innerHTML = `<code>${escaped}</code>`;
    }
  }

  private copyCode(): void {
    const code = this.node.textContent;
    navigator.clipboard.writeText(code).then(() => {
      this.copyFeedback.classList.add("visible");
      this.copyBtn.classList.add("copied");
      setTimeout(() => {
        this.copyFeedback.classList.remove("visible");
        this.copyBtn.classList.remove("copied");
      }, 1500);
    });
  }

  // ── Language autocomplete ──

  private showLangInput(): void {
    this.isLangEditing = true;
    const current = (this.node.attrs.language as string) || "";
    this.langInput.value = current;
    this.languageLabel.style.display = "none";
    this.langInput.style.display = "";
    this.langInput.focus();
    this.langInput.select();
    if (current.length >= 1) {
      this.showSuggestions(current);
    }
  }

  private hideLangInput(): void {
    this.isLangEditing = false;
    this.langInput.style.display = "none";
    this.langDropdown.style.display = "none";
    this.languageLabel.style.display = "";
  }

  private applyLanguage(lang: string): void {
    const pos = this.getPos();
    if (pos === undefined) return;

    this.view.dispatch(
      this.view.state.tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        language: lang,
      }),
    );
    this.hideLangInput();
    this.view.focus();
  }

  private onLangInput(): void {
    const val = this.langInput.value.trim().toLowerCase();
    if (val.length >= 1) {
      this.showSuggestions(val);
    } else {
      this.langDropdown.style.display = "none";
    }
  }

  private onLangKeyDown(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault();
      const active = this.langDropdown.querySelector(".active") as HTMLElement;
      if (active) {
        this.applyLanguage(active.dataset.lang || this.langInput.value);
      } else {
        this.applyLanguage(this.langInput.value.trim());
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.hideLangInput();
      this.view.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      this.navigateSuggestions(e.key === "ArrowDown" ? 1 : -1);
    }
  }

  private showSuggestions(query: string): void {
    const matches = SUPPORTED_LANGUAGES.filter((l) => l.startsWith(query));
    if (matches.length === 0 || (matches.length === 1 && matches[0] === query)) {
      this.langDropdown.style.display = "none";
      return;
    }

    this.langDropdown.innerHTML = "";
    matches.slice(0, 8).forEach((lang, i) => {
      const item = document.createElement("div");
      item.classList.add("codeblock-lang-suggestion");
      if (i === 0) item.classList.add("active");
      item.dataset.lang = lang;
      item.textContent = lang;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.applyLanguage(lang);
      });
      this.langDropdown.appendChild(item);
    });
    this.langDropdown.style.display = "";
  }

  private navigateSuggestions(dir: number): void {
    const items = Array.from(
      this.langDropdown.querySelectorAll(".codeblock-lang-suggestion"),
    ) as HTMLElement[];
    if (items.length === 0) return;

    const activeIdx = items.findIndex((el) => el.classList.contains("active"));
    items.forEach((el) => el.classList.remove("active"));
    let next = activeIdx + dir;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    items[next].classList.add("active");
    this.langInput.value = items[next].dataset.lang || "";
  }
}
