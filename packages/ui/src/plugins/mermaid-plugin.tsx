/**
 * Milkdown plugin that renders Mermaid diagrams inline and
 * enhanced code blocks with syntax highlighting.
 *
 * Typora-style UX for both mermaid and regular code blocks.
 */
import type { NodeView, ViewMutationRecord } from "@milkdown/kit/prose/view";
import type { EditorView } from "@milkdown/kit/prose/view";
import type { Node as ProsemirrorNode } from "@milkdown/kit/prose/model";
import { TextSelection } from "@milkdown/kit/prose/state";
import { $prose } from "@milkdown/kit/utils";
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { mermaid, MERMAID_MAX_SIZE } from "../utils/mermaid-init.js";
import DOMPurify from "dompurify";
import { CodeBlockNodeView, codeBlockViews, handleCodeBlockKeyDown } from "./codeblock-plugin.js";

/** Sanitize SVG output from mermaid to prevent XSS */
function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ["foreignObject"],
  });
}

let mermaidNodeCounter = 0;

const mermaidPluginKey = new PluginKey("mermaid-diagram");

/** Registry of active MermaidNodeView instances for cursor tracking */
const mermaidViews = new Set<MermaidNodeView>();

/**
 * ProseMirror NodeView that renders mermaid code blocks as diagrams.
 */
class MermaidNodeView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement | undefined;

  private svgContainer: HTMLElement;
  private codeContainer: HTMLElement;
  private errorContainer: HTMLElement;
  node: ProsemirrorNode;
  private view: EditorView;
  getPos: () => number | undefined;
  private id: string;
  private lastValidSvg = "";
  isEditing = false;
  private renderTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.id = `mermaid-nv-${++mermaidNodeCounter}`;

    mermaidViews.add(this);

    this.dom = document.createElement("div");
    this.dom.classList.add("mermaid-container");
    this.dom.setAttribute("data-mermaid", "true");

    // Code editing area — on TOP
    this.codeContainer = document.createElement("pre");
    this.codeContainer.classList.add("mermaid-code");
    const codeEl = document.createElement("code");
    this.codeContainer.appendChild(codeEl);
    this.contentDOM = codeEl;
    this.dom.appendChild(this.codeContainer);

    // Error display
    this.errorContainer = document.createElement("div");
    this.errorContainer.classList.add("mermaid-error");
    this.errorContainer.style.display = "none";
    this.dom.appendChild(this.errorContainer);

    // SVG rendering area — on BOTTOM
    this.svgContainer = document.createElement("div");
    this.svgContainer.classList.add("mermaid-svg");
    this.dom.appendChild(this.svgContainer);

    this.svgContainer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.startEditing();
    });

    this.svgContainer.title = "Click to edit mermaid code";

    this.scheduleRender();
    this.updateVisibility();
  }

  update(node: ProsemirrorNode): boolean {
    if (node.type.name !== "code_block") return false;
    if (node.attrs.language !== "mermaid") return false;
    this.node = node;
    this.scheduleRender();
    return true;
  }

  selectNode(): void {
    this.dom.classList.add("mermaid-selected");
    this.startEditing();
  }

  deselectNode(): void {
    this.dom.classList.remove("mermaid-selected");
    this.setEditing(false);
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

  stopEvent(): boolean {
    return false;
  }

  destroy(): void {
    mermaidViews.delete(this);
    if (this.renderTimeout) clearTimeout(this.renderTimeout);
    const stale = document.getElementById(this.id);
    if (stale) stale.remove();
  }

  startEditing(): void {
    if (this.isEditing) return;
    this.isEditing = true;
    this.updateVisibility();

    const pos = this.getPos();
    if (pos !== undefined) {
      try {
        const resolvedPos = this.view.state.doc.resolve(pos + 1);
        this.view.dispatch(
          this.view.state.tr.setSelection(TextSelection.create(this.view.state.doc, resolvedPos.pos)),
        );
        this.view.focus();
      } catch {
        // ignore
      }
    }
  }

  setEditing(editing: boolean): void {
    if (this.isEditing === editing) return;
    this.isEditing = editing;
    if (!editing) this.scheduleRender();
    this.updateVisibility();
  }

  scheduleRender(): void {
    if (this.renderTimeout) clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(() => {
      void this.renderDiagram();
    }, 300);
  }

  private async renderDiagram(): Promise<void> {
    const code = this.node.textContent.trim();
    if (!code) {
      this.svgContainer.innerHTML = "";
      this.errorContainer.style.display = "none";
      this.lastValidSvg = "";
      return;
    }

    if (code.length > MERMAID_MAX_SIZE) {
      this.errorContainer.textContent = `Diagram too large (${code.length} chars, max ${MERMAID_MAX_SIZE})`;
      this.errorContainer.style.display = "block";
      return;
    }

    try {
      await mermaid.parse(code);
      const renderId = `${this.id}-${Date.now()}`;
      const { svg } = await mermaid.render(renderId, code);
      const cleanSvg = sanitizeSvg(svg);
      this.lastValidSvg = cleanSvg;
      this.svgContainer.innerHTML = cleanSvg;
      this.errorContainer.style.display = "none";
    } catch (err: unknown) {
      if (this.lastValidSvg) {
        this.svgContainer.innerHTML = this.lastValidSvg;
      }
      const message = err instanceof Error ? err.message : "Invalid mermaid syntax";
      this.errorContainer.textContent = message;
      this.errorContainer.style.display = "block";

      const stale = document.getElementById(this.id);
      if (stale) stale.remove();
    }
  }

  updateVisibility(): void {
    if (this.isEditing) {
      this.codeContainer.style.display = "";
      this.svgContainer.style.display = "";
      this.dom.classList.add("mermaid-editing");
    } else {
      this.codeContainer.style.display = "none";
      this.svgContainer.style.display = "";
      this.dom.classList.remove("mermaid-editing");
    }
  }
}

/**
 * Combined plugin: mermaid diagrams + enhanced code blocks.
 */
export const mermaidPlugin = $prose(
  () =>
    new Plugin({
      key: mermaidPluginKey,
      props: {
        nodeViews: {
          code_block: (
            node: ProsemirrorNode,
            view: EditorView,
            getPos: () => number | undefined,
          ): NodeView => {
            if (node.attrs.language === "mermaid") {
              return new MermaidNodeView(node, view, getPos);
            }
            return new CodeBlockNodeView(node, view, getPos);
          },
        },
        // Use handleDOMEvents instead of handleKeyDown to fire BEFORE
        // Milkdown's built-in keymaps (commonmark/gfm) which would
        // otherwise intercept Enter and other keys first.
        handleDOMEvents: {
          keydown(view: EditorView, event: KeyboardEvent) {
            return handleCodeBlockKeyDown(view, event);
          },
        },
      },
      view() {
        return {
          update(view: EditorView) {
            const { $from } = view.state.selection;
            const cursorPos = $from.pos;

            // Track mermaid blocks
            for (const mv of mermaidViews) {
              const pos = mv.getPos();
              if (pos === undefined) continue;
              const nodeEnd = pos + mv.node.nodeSize;
              mv.setEditing(cursorPos >= pos && cursorPos <= nodeEnd);
            }

            // Track regular code blocks
            for (const cb of codeBlockViews) {
              const pos = cb.getPos();
              if (pos === undefined) continue;
              const nodeEnd = pos + cb.node.nodeSize;
              cb.setEditing(cursorPos >= pos && cursorPos <= nodeEnd);
            }
          },
        };
      },
    }),
);
