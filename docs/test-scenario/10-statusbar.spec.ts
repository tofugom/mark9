import { test, expect } from "@playwright/test";

test.describe("10. StatusBar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  test("StatusBar에 UTF-8이 표시된다", async ({ page }) => {
    await expect(page.getByText("UTF-8")).toBeVisible();
  });

  test("StatusBar에 현재 모드(WYSIWYG)가 표시된다", async ({ page }) => {
    // The mode is shown with CSS uppercase, actual text is lowercase
    const modeSpan = page.locator(".uppercase").last();
    await expect(modeSpan).toHaveText("wysiwyg");
  });

  test("StatusBar에 GFM 라벨이 표시된다", async ({ page }) => {
    await expect(page.getByText("GFM")).toBeVisible();
  });

  test("StatusBar에 커서 위치(Ln/Col)가 표시된다", async ({ page }) => {
    const lnCol = page.getByText(/Ln \d+/).first();
    await expect(lnCol).toBeVisible();
  });

  test("에디터 모드 전환 시 StatusBar 모드가 업데이트된다", async ({ page }) => {
    const modeSpan = page.locator(".uppercase").last();
    await expect(modeSpan).toHaveText("wysiwyg");

    await page.keyboard.press("Control+/");
    await page.waitForTimeout(300);

    await expect(modeSpan).toHaveText("source");
  });
});
