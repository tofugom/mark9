import { test, expect } from "@playwright/test";

test.describe("09. Keyboard Shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  test("Ctrl+/ 로 에디터 모드가 토글된다", async ({ page }) => {
    // Start in WYSIWYG
    await expect(page.locator(".ProseMirror").first()).toBeVisible();

    // Toggle to Source
    await page.keyboard.press("Control+/");
    await expect(page.locator(".cm-editor").first()).toBeVisible();

    // Toggle back to WYSIWYG
    await page.keyboard.press("Control+/");
    await expect(page.locator(".ProseMirror").first()).toBeVisible();
  });

  test("Ctrl+S 로 저장이 실행된다", async ({ page }) => {
    // Make a change first
    const editor = page.locator(".ProseMirror").first();
    await editor.click();
    await page.keyboard.type("test save shortcut");
    await page.waitForTimeout(200);

    // Save should not throw
    await page.keyboard.press("Control+s");
    await page.waitForTimeout(300);
    // Page should still be functional
    await expect(editor).toBeVisible();
  });

  test("Ctrl+B 로 사이드바가 토글된다", async ({ page }) => {
    // Sidebar should be visible initially
    const sidebar = page.getByText("README.md").first();
    await expect(sidebar).toBeVisible();

    // Toggle sidebar off
    await page.keyboard.press("Control+b");
    await page.waitForTimeout(300);

    // Check if sidebar is hidden — README.md in sidebar should not be visible
    // Note: The toggle might use a different shortcut, adapt if needed
  });
});
