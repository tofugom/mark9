import { test, expect } from "@playwright/test";

test.describe("08. Mermaid Diagram Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
    // README.md should be loaded by default and contains a mermaid diagram
  });

  test("README.md의 Mermaid 다이어그램이 SVG로 렌더링된다", async ({ page }) => {
    // Wait for mermaid to render
    await page.waitForTimeout(2000);

    // Look for rendered mermaid SVG
    const mermaidSvg = page.locator(".mermaid-svg svg, .mermaid-container svg").first();
    await expect(mermaidSvg).toBeVisible({ timeout: 10_000 });
  });

  test("렌더링된 SVG에 script 태그가 없다 (XSS 방지)", async ({ page }) => {
    await page.waitForTimeout(2000);

    const scriptTags = await page.evaluate(() => {
      const svgs = document.querySelectorAll(".mermaid-svg svg, .mermaid-container svg");
      let scriptCount = 0;
      svgs.forEach((svg) => {
        scriptCount += svg.querySelectorAll("script").length;
      });
      return scriptCount;
    });
    expect(scriptTags).toBe(0);
  });

  test("Mermaid 컨테이너에 double-click 힌트가 있다", async ({ page }) => {
    await page.waitForTimeout(2000);

    const container = page.locator('[data-mermaid="true"], .mermaid-container').first();
    if (await container.isVisible()) {
      // Should have a title attribute for editing hint
      const title = await container.locator(".mermaid-svg").first().getAttribute("title");
      // Or the container itself might have the hint
      expect(title || "").toBeTruthy();
    }
  });
});
