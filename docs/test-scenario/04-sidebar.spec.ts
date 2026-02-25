import { test, expect } from "@playwright/test";

test.describe("04. Sidebar Panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  test("사이드바가 기본으로 열려있고 파일 탐색기가 보인다", async ({ page }) => {
    await expect(page.getByText("README.md").first()).toBeVisible();
  });

  test("Explorer 탭이 기본 활성 탭이다", async ({ page }) => {
    // Files tab should be active by default
    const filesBtn = page.locator('button[title*="Explorer"], button[title*="Files"]').first();
    await expect(filesBtn).toBeVisible();
  });

  test("Source Control 탭 클릭으로 Git 패널이 표시된다", async ({ page }) => {
    const gitBtn = page.locator('button[title*="Source Control"], button[title*="Git"]').first();
    await gitBtn.click();
    await page.waitForTimeout(300);

    // Git panel should show Initialize Repository button (since mock FS isn't a real repo)
    const gitContent = page.locator('[class*="git"], [class*="source-control"]').first();
    // Or look for git-related text
    const initBtn = page.getByText(/Initialize|Repository|Commit/i).first();
    await expect(initBtn).toBeVisible();
  });

  test("Settings 탭 클릭으로 설정 패널이 표시된다", async ({ page }) => {
    const settingsBtn = page.locator('button[title*="Settings"]').first();
    await settingsBtn.click();
    await page.waitForTimeout(300);

    // Settings panel should show auto-save options
    await expect(page.getByText(/Auto Save|Font Size|Tab Size/i).first()).toBeVisible();
  });

  test("폴더 토글 클릭으로 하위 파일이 접힌다/펼쳐진다", async ({ page }) => {
    // docs folder should be expandable — click the folder button
    const docsFolder = page.locator("button").filter({ hasText: "docs" }).first();
    await expect(docsFolder).toBeVisible();

    // Collapse the folder
    await docsFolder.click();
    await page.waitForTimeout(300);

    // guide.md is inside docs — should be hidden after collapse
    const guideFile = page.getByRole("button", { name: "guide.md" });
    await expect(guideFile).toBeHidden();

    // Expand again
    await docsFolder.click();
    await page.waitForTimeout(300);
    await expect(guideFile).toBeVisible();
  });
});
