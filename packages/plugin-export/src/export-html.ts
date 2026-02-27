/**
 * Export markdown to standalone HTML.
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

/**
 * Convert markdown to a styled HTML string.
 */
export async function exportToHtml(
  markdown: string,
  title = "Untitled",
): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);

  const bodyHtml = String(result);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
  <style>
    body {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      color: #24292f;
    }
    h1 { font-size: 2rem; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3rem; }
    h2 { font-size: 1.5rem; border-bottom: 1px solid #eaeef2; padding-bottom: 0.25rem; }
    h3 { font-size: 1.25rem; }
    code {
      background: rgba(175, 184, 193, 0.2);
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }
    pre {
      background: #f6f8fa;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
    pre code { background: transparent; padding: 0; }
    blockquote {
      border-left: 4px solid #d0d7de;
      padding: 0.5rem 1rem;
      margin: 1rem 0;
      color: #57606a;
    }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { border: 1px solid #d0d7de; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f6f8fa; font-weight: 600; }
    hr { border: none; border-top: 2px solid #d0d7de; margin: 1.5rem 0; }
    a { color: #0969da; }
    img { max-width: 100%; }
    del { text-decoration: line-through; color: #8b949e; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
