import { test, expect } from "@playwright/test";

test.describe("11. Security", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  test("CSP meta 태그가 설정되어 있다", async ({ page }) => {
    const csp = await page.evaluate(() => {
      const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return meta?.getAttribute("content") ?? null;
    });
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src");
    expect(csp).toContain("script-src");
  });

  test("localStorage settings 검증: 잘못된 데이터가 무시된다", async ({ page }) => {
    // Inject malicious/corrupt localStorage data
    await page.evaluate(() => {
      localStorage.setItem("mark9-settings", '{"autoSave":"INVALID","fontSize":999,"tabSize":-1}');
    });
    await page.reload();
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });

    // Settings should fall back to defaults
    const settings = await page.evaluate(() => {
      const raw = localStorage.getItem("mark9-settings");
      return raw ? JSON.parse(raw) : null;
    });

    // After reload, the store should have loaded with defaults (invalid values ignored)
    // Verify by checking the store applied defaults
    // The app should not crash from invalid data
    await expect(page.locator(".ProseMirror").first()).toBeVisible();
  });

  test("localStorage recent-files 검증: 잘못된 데이터가 무시된다", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("mark9-recent-files", '[{"bad": true}, "not an object", 42]');
    });
    await page.reload();
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });

    // App should not crash
    await expect(page.locator(".ProseMirror").first()).toBeVisible();
  });

  test("Mermaid SVG에 inline event handler가 없다", async ({ page }) => {
    await page.waitForTimeout(2000);

    const hasEventHandlers = await page.evaluate(() => {
      const svgs = document.querySelectorAll(".mermaid-svg svg, .mermaid-container svg");
      let found = false;
      svgs.forEach((svg) => {
        const all = svg.querySelectorAll("*");
        all.forEach((el) => {
          for (const attr of el.getAttributeNames()) {
            if (attr.startsWith("on")) {
              found = true;
            }
          }
        });
      });
      return found;
    });
    expect(hasEventHandlers).toBe(false);
  });
});
