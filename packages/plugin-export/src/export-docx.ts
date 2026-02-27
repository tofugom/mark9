/**
 * Export markdown to DOCX.
 *
 * Uses the `docx` package to build a Word document from markdown content.
 * Parses markdown with unified/remark and converts the AST to docx elements.
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { Root, RootContent, PhrasingContent } from "mdast";

/**
 * Export markdown to a DOCX Blob.
 */
export async function exportToDocx(
  markdown: string,
  title = "Untitled",
): Promise<Blob> {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown) as Root;

  const children = convertNodes(tree.children);

  const doc = new Document({
    title,
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

const HEADING_MAP: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

function convertNodes(nodes: RootContent[]): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case "heading": {
        paragraphs.push(
          new Paragraph({
            heading: HEADING_MAP[node.depth] || HeadingLevel.HEADING_1,
            children: convertInline(node.children),
          }),
        );
        break;
      }
      case "paragraph": {
        paragraphs.push(
          new Paragraph({
            children: convertInline(node.children),
          }),
        );
        break;
      }
      case "blockquote": {
        // Flatten blockquote children
        const inner = node.children.flatMap((child) => {
          if (child.type === "paragraph") {
            return [
              new Paragraph({
                children: convertInline(child.children),
                indent: { left: 720 }, // 0.5 inch
                border: {
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: "999999",
                    space: 8,
                  },
                },
              }),
            ];
          }
          return [];
        });
        paragraphs.push(...inner);
        break;
      }
      case "code": {
        // Code block as a monospaced paragraph
        const lines = node.value.split("\n");
        for (const line of lines) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line || " ",
                  font: "Courier New",
                  size: 20,
                }),
              ],
              shading: { fill: "F6F8FA" },
            }),
          );
        }
        break;
      }
      case "list": {
        for (const item of node.children) {
          if (item.type === "listItem") {
            const itemContent = item.children.flatMap((child) => {
              if (child.type === "paragraph") {
                return convertInline(child.children);
              }
              return [new TextRun({ text: "" })];
            });
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: node.ordered
                      ? `${(node.children.indexOf(item) + (node.start ?? 1))}. `
                      : "• ",
                  }),
                  ...itemContent,
                ],
                indent: { left: 360 },
              }),
            );
          }
        }
        break;
      }
      case "thematicBreak": {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "───────────────────────────" })],
            alignment: AlignmentType.CENTER,
          }),
        );
        break;
      }
      case "table": {
        // Simplified: render table as tab-separated rows
        for (const row of node.children) {
          if (row.type === "tableRow") {
            const cellTexts = row.children.map((cell) => {
              if (cell.type === "tableCell") {
                return cell.children
                  .map((c) =>
                    "value" in c ? (c as { value: string }).value : "",
                  )
                  .join("");
              }
              return "";
            });
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellTexts.join("\t|\t"),
                    font: "Courier New",
                    size: 20,
                  }),
                ],
              }),
            );
          }
        }
        break;
      }
      default:
        // Skip unsupported node types
        break;
    }
  }

  return paragraphs;
}

function convertInline(nodes: PhrasingContent[]): TextRun[] {
  const runs: TextRun[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case "text":
        runs.push(new TextRun({ text: node.value }));
        break;
      case "strong":
        runs.push(
          ...node.children.map(
            (child) =>
              new TextRun({
                text: "value" in child ? (child.value as string) : "",
                bold: true,
              }),
          ),
        );
        break;
      case "emphasis":
        runs.push(
          ...node.children.map(
            (child) =>
              new TextRun({
                text: "value" in child ? (child.value as string) : "",
                italics: true,
              }),
          ),
        );
        break;
      case "delete":
        runs.push(
          ...node.children.map(
            (child) =>
              new TextRun({
                text: "value" in child ? (child.value as string) : "",
                strike: true,
              }),
          ),
        );
        break;
      case "inlineCode":
        runs.push(
          new TextRun({
            text: node.value,
            font: "Courier New",
            size: 20,
            shading: { fill: "F6F8FA" },
          }),
        );
        break;
      case "link":
        runs.push(
          new TextRun({
            text:
              node.children
                .map((c) => ("value" in c ? c.value : ""))
                .join("") || node.url,
            color: "0969DA",
            underline: {},
          }),
        );
        break;
      default:
        break;
    }
  }

  return runs;
}
