/**
 * ProseMirror plumbing for highlighting resolved comment ranges and capturing
 * selections. Wired up in `@mark9/viewer`, where the editor instance lives.
 *
 * For now this module exposes shared types so the viewer and comments
 * packages agree on the contract; the actual plugin lives next to the viewer.
 */

export interface CommentHighlight {
  threadId: string;
  start: number;
  end: number;
  /** True when the host wants this thread visually emphasized (e.g. clicked). */
  active?: boolean;
}

/** A function the viewer calls when the user selects text and clicks "Add comment". */
export type SelectionToAnchor = (selection: {
  text: string;
  start: number;
  end: number;
}) => void;
