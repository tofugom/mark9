import { chromium } from "playwright";
import path from "path";

const BASE = "http://localhost:5173";
const OUT = path.resolve("docs/test-evidences");

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // 1. Light theme (default) - README with mermaid
  await page.goto(BASE);
  await page.waitForTimeout(3000); // Wait for mermaid rendering
  await page.screenshot({ path: path.join(OUT, "p2-01-light-theme-mermaid.png") });
  console.log("✓ p2-01 Light theme + Mermaid diagram");

  // 2. Switch to Dark theme via StatusBar button
  const themeBtn = page.locator('button[title*="Theme"]');
  await themeBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "p2-02-dark-theme.png") });
  console.log("✓ p2-02 Dark theme");

  // 3. Switch to Sepia theme
  await themeBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "p2-03-sepia-theme.png") });
  console.log("✓ p2-03 Sepia theme");

  // 4. Back to Light
  await themeBtn.click();
  await page.waitForTimeout(500);

  // 5. Open Source view to see mermaid code
  const sourceBtn = page.locator('button[title="Source code mode (Ctrl+/)"]');
  await sourceBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "p2-04-source-view-mermaid.png") });
  console.log("✓ p2-04 Source view with mermaid code");

  // 6. Switch back to WYSIWYG
  const previewBtn = page.locator('button[title="WYSIWYG mode"]');
  await previewBtn.click();
  await page.waitForTimeout(1000);

  // 7. Open Outline panel (Ctrl+Shift+O)
  await page.keyboard.press("Control+Shift+O");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "p2-05-outline-panel.png") });
  console.log("✓ p2-05 Outline panel");

  // 8. Click on notes.md to test file switching
  const notesFile = page.locator('text=notes.md').first();
  await notesFile.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, "p2-06-notes-with-outline.png") });
  console.log("✓ p2-06 Notes.md with outline");

  // 9. Dark theme with different file
  await themeBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "p2-07-dark-theme-notes.png") });
  console.log("✓ p2-07 Dark theme with notes");

  await browser.close();
  console.log("\nAll Phase 2 screenshots saved!");
}

main().catch(console.error);
