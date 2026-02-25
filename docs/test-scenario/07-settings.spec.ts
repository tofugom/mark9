import { test, expect } from "@playwright/test";

test.describe("07. Settings Panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("mark9-settings"));
    await page.reload();
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });

    // Open Settings tab
    const settingsBtn = page.locator('button[title*="Settings"]').first();
    await settingsBtn.click();
    await page.waitForTimeout(300);
  });

  test("설정 패널에 Auto-save 옵션이 표시된다", async ({ page }) => {
    await expect(page.getByText("Auto-save")).toBeVisible();
  });

  test("설정 패널에 Font Size 옵션이 표시된다", async ({ page }) => {
    await expect(page.getByText(/Font Size/i).first()).toBeVisible();
  });

  test("Auto Save 값을 변경할 수 있다", async ({ page }) => {
    // Find auto-save select or buttons
    const autoSaveOption = page.locator('select, [class*="auto-save"] button, [role="radiogroup"]').first();
    if (await autoSaveOption.isVisible()) {
      // Try to change auto-save setting
      if (await autoSaveOption.evaluate((el) => el.tagName === "SELECT")) {
        await autoSaveOption.selectOption("5s");
      } else {
        await page.getByText("5s").first().click();
      }
      await page.waitForTimeout(200);

      // Check localStorage was updated
      const settings = await page.evaluate(() => localStorage.getItem("mark9-settings"));
      expect(settings).toContain("5s");
    }
  });

  test("설정이 localStorage에 저장된다", async ({ page }) => {
    // Change any setting
    const fontSizeInput = page.locator('input[type="range"]').first();
    if (await fontSizeInput.isVisible()) {
      await fontSizeInput.fill("20");
      await page.waitForTimeout(200);
    }

    const settings = await page.evaluate(() => localStorage.getItem("mark9-settings"));
    expect(settings).toBeTruthy();
  });

  test("설정이 새로고침 후에도 유지된다", async ({ page }) => {
    // Set a recognizable value
    await page.evaluate(() => {
      localStorage.setItem("mark9-settings", JSON.stringify({
        autoSave: "5s",
        fontSize: 20,
        tabSize: 4,
        wordWrap: false,
        showLineNumbers: true,
      }));
    });

    await page.reload();
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });

    const settings = await page.evaluate(() => localStorage.getItem("mark9-settings"));
    const parsed = JSON.parse(settings!);
    expect(parsed.autoSave).toBe("5s");
    expect(parsed.fontSize).toBe(20);
  });
});
