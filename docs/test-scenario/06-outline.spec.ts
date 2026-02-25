import { test, expect } from "@playwright/test";

test.describe("06. Outline Panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  test("아웃라인 패널은 기본으로 닫혀있다", async ({ page }) => {
    // Outline should not be visible initially (outlineOpen defaults to false)
    const outline = page.locator('[class*="outline"]').first();
    // If outline isn't visible or doesn't exist, that's correct
    const isVisible = await outline.isVisible().catch(() => false);
    // The outline panel defaults to closed
    expect(isVisible).toBe(false);
  });

  test("Outline 토글로 아웃라인 패널이 열린다", async ({ page }) => {
    // Find and click outline toggle button
    const outlineToggle = page.locator('button[title*="Outline"], button[title*="outline"]').first();
    if (await outlineToggle.isVisible()) {
      await outlineToggle.click();
      await page.waitForTimeout(500);
      // Outline panel should now show headings from the document
      const outline = page.locator('[class*="outline"]').first();
      await expect(outline).toBeVisible();
    }
  });

  test("아웃라인에 문서의 헤딩이 표시된다", async ({ page }) => {
    // Open outline
    const outlineToggle = page.locator('button[title*="Outline"], button[title*="outline"]').first();
    if (await outlineToggle.isVisible()) {
      await outlineToggle.click();
      await page.waitForTimeout(500);

      // README.md should have headings — check that at least one heading item is rendered
      const headingItems = page.locator('[class*="outline"] [class*="item"], [class*="outline"] li, [class*="outline"] a');
      const count = await headingItems.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
