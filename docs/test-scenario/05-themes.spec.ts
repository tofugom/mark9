import { test, expect } from "@playwright/test";

test.describe("05. Theme System", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to reset theme and set light explicitly
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("mark9-theme", "light"));
    await page.reload();
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  test("StatusBar에 테마 순환 버튼이 있다", async ({ page }) => {
    const themeBtn = page.locator('button[title*="theme"], button[title*="Theme"]').first();
    await expect(themeBtn).toBeVisible();
  });

  test("테마 순환: Light → Dark → Sepia → Light", async ({ page }) => {
    const html = page.locator("html");
    const themeBtn = page.locator('button[title*="theme"], button[title*="Theme"]').first();

    // Check initial theme attribute
    const initialTheme = await html.getAttribute("data-theme");

    // Click to cycle
    await themeBtn.click();
    await page.waitForTimeout(200);
    const secondTheme = await html.getAttribute("data-theme");

    await themeBtn.click();
    await page.waitForTimeout(200);
    const thirdTheme = await html.getAttribute("data-theme");

    // All three themes should be different
    const themes = [initialTheme, secondTheme, thirdTheme];
    expect(new Set(themes).size).toBe(3);
  });

  test("테마가 localStorage에 저장된다", async ({ page }) => {
    const themeBtn = page.locator('button[title*="theme"], button[title*="Theme"]').first();
    await themeBtn.click();
    await page.waitForTimeout(200);

    const savedTheme = await page.evaluate(() => localStorage.getItem("mark9-theme"));
    expect(savedTheme).toBeTruthy();
  });

  test("페이지 새로고침 후 테마가 유지된다", async ({ page }) => {
    const themeBtn = page.locator('button[title*="theme"], button[title*="Theme"]').first();
    await themeBtn.click();
    await page.waitForTimeout(200);

    const themeBeforeReload = await page.locator("html").getAttribute("data-theme");

    await page.reload();
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });

    const themeAfterReload = await page.locator("html").getAttribute("data-theme");
    expect(themeAfterReload).toBe(themeBeforeReload);
  });

  test("Dark 테마에서 data-theme 속성이 dark이다", async ({ page }) => {
    // Theme store saves bare string (not JSON) to localStorage
    await page.evaluate(() => localStorage.setItem("mark9-theme", "dark"));
    await page.reload();
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });

    const dataTheme = await page.locator("html").getAttribute("data-theme");
    expect(dataTheme).toBe("dark");
  });
});
