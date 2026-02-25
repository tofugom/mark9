import { test, expect } from "@playwright/test";

test.describe("02. Editor Mode Toggle (WYSIWYG ↔ Source)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for editor to initialize
    await page.waitForSelector(".milkdown, .ProseMirror, .cm-editor", { timeout: 10_000 });
  });

  test("기본 모드는 WYSIWYG이다", async ({ page }) => {
    const prosemirror = page.locator(".ProseMirror").first();
    await expect(prosemirror).toBeVisible();
  });

  test("Source 버튼 클릭으로 소스 모드로 전환된다", async ({ page }) => {
    const sourceBtn = page.locator('button[title="Source code mode (Ctrl+/)"]');
    await sourceBtn.click();
    // CodeMirror editor should appear
    const cmEditor = page.locator(".cm-editor").first();
    await expect(cmEditor).toBeVisible();
  });

  test("Preview 버튼 클릭으로 WYSIWYG 모드로 돌아온다", async ({ page }) => {
    // Switch to source first
    const sourceBtn = page.locator('button[title="Source code mode (Ctrl+/)"]');
    await sourceBtn.click();
    await page.locator(".cm-editor").first().waitFor({ state: "visible" });

    // Switch back to preview
    const previewBtn = page.locator('button[title="WYSIWYG mode"]');
    await previewBtn.click();
    const prosemirror = page.locator(".ProseMirror").first();
    await expect(prosemirror).toBeVisible();
  });

  test("Ctrl+/ 단축키로 모드가 전환된다", async ({ page }) => {
    await page.keyboard.press("Control+/");
    const cmEditor = page.locator(".cm-editor").first();
    await expect(cmEditor).toBeVisible();

    await page.keyboard.press("Control+/");
    const prosemirror = page.locator(".ProseMirror").first();
    await expect(prosemirror).toBeVisible();
  });

  test("StatusBar에 현재 모드가 표시된다", async ({ page }) => {
    // WYSIWYG mode shown in status bar (span.uppercase renders "wysiwyg" as uppercase)
    const modeSpan = page.locator(".uppercase").last();
    await expect(modeSpan).toHaveText("wysiwyg");

    // Switch to source
    await page.keyboard.press("Control+/");
    await expect(modeSpan).toHaveText("source");
  });
});
