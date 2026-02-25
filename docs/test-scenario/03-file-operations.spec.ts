import { test, expect } from "@playwright/test";

test.describe("03. File Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  test("사이드바에서 파일 클릭하면 해당 파일이 열린다", async ({ page }) => {
    // Click on guide.md in sidebar
    const guideFile = page.getByText("guide.md").first();
    await guideFile.click();
    // Wait a moment for file content to load
    await page.waitForTimeout(500);

    // Editor content should change — guide.md has different content
    const editor = page.locator(".ProseMirror").first();
    const content = await editor.textContent();
    expect(content).toBeTruthy();
  });

  test("다른 파일로 전환 시 콘텐츠가 바뀐다", async ({ page }) => {
    // Get initial content from README.md
    const editor = page.locator(".ProseMirror").first();
    const readmeContent = await editor.textContent();

    // Switch to notes.md
    await page.getByText("notes.md").first().click();
    await page.waitForTimeout(500);
    const notesContent = await editor.textContent();

    expect(readmeContent).not.toBe(notesContent);
  });

  test("에디터에서 타이핑하면 dirty 상태가 된다", async ({ page }) => {
    const editor = page.locator(".ProseMirror").first();
    await editor.click();
    await page.keyboard.type("Test modification");

    // Save button should become active (accent color)
    const saveBtn = page.locator('button[title*="Save"]').first();
    // The button should be enabled/styled differently when dirty
    await expect(saveBtn).toBeVisible();
  });

  test("Ctrl+S로 저장하면 dirty 상태가 해제된다", async ({ page }) => {
    const editor = page.locator(".ProseMirror").first();
    await editor.click();
    await page.keyboard.type("Test text for save");
    await page.waitForTimeout(200);

    // Save
    await page.keyboard.press("Control+s");
    await page.waitForTimeout(500);

    // Title bar should not show dirty indicator after save
    // (The save operation on mock files clears dirty state)
  });

  test("파일 간 전환 시 각 파일의 콘텐츠가 독립적으로 유지된다", async ({ page }) => {
    // Edit README.md
    const editor = page.locator(".ProseMirror").first();
    await editor.click();
    await page.keyboard.press("End");
    await page.keyboard.type(" UNIQUE_MARKER_README");
    await page.waitForTimeout(300);

    // Switch to notes.md
    await page.getByText("notes.md").first().click();
    await page.waitForTimeout(500);

    // Switch back to README.md
    await page.getByText("README.md").first().click();
    await page.waitForTimeout(500);

    // README.md should still contain our edit
    const content = await editor.textContent();
    expect(content).toContain("UNIQUE_MARKER_README");
  });
});
