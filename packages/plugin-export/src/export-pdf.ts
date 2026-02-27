/**
 * Export markdown to PDF using the browser's print API.
 *
 * Opens the HTML in a hidden iframe and triggers window.print().
 * This approach works in all browsers without extra dependencies.
 */
import { exportToHtml } from "./export-html.js";

/**
 * Export markdown as PDF by opening a print dialog.
 */
export async function exportToPdf(
  markdown: string,
  title = "Untitled",
): Promise<void> {
  const html = await exportToHtml(markdown, title);

  // Create a hidden iframe for printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error("Failed to create print iframe");
  }

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // Wait for content (including KaTeX CSS) to load
  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    // Fallback timeout in case onload doesn't fire
    setTimeout(resolve, 2000);
  });

  iframe.contentWindow?.print();

  // Clean up after a delay to let print dialog finish
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}
