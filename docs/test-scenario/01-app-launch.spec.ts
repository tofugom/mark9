import { test, expect } from "@playwright/test";

test.describe("01. App Launch & Initial Render", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("페이지 타이틀이 Mark9이다", async ({ page }) => {
    await expect(page).toHaveTitle("Mark9");
  });

  test("TitleBar가 렌더링된다", async ({ page }) => {
    const titleBar = page.locator("[class*='titlebar'], [class*='title-bar']").first();
    // Fallback: look for the app title text
    const appTitle = page.getByText("Mark9").first();
    await expect(appTitle).toBeVisible();
  });

  test("Sidebar가 기본으로 열려있다", async ({ page }) => {
    // Sidebar should show file explorer with mock files
    const sidebar = page.locator("aside, [class*='sidebar']").first();
    await expect(sidebar).toBeVisible();
  });

  test("EditorToolbar가 렌더링된다", async ({ page }) => {
    const previewBtn = page.locator('button[title="WYSIWYG mode"]');
    await expect(previewBtn).toBeVisible();
  });

  test("StatusBar가 렌더링된다", async ({ page }) => {
    const statusBar = page.getByText("UTF-8").first();
    await expect(statusBar).toBeVisible();
  });

  test("Mock 파일 트리가 로드된다", async ({ page }) => {
    await expect(page.getByText("README.md").first()).toBeVisible();
  });

  test("에디터 영역에 콘텐츠가 표시된다", async ({ page }) => {
    // The default file (README.md) should show content in the editor
    const editor = page.locator(".milkdown, .ProseMirror, [class*='editor']").first();
    await expect(editor).toBeVisible();
  });
});
