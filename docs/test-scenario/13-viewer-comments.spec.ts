import { test, expect } from "@playwright/test";

test.describe("Mark9 Viewer + Comments demo", () => {
  test("renders preview and shows file picker in full app mode", async ({ page }) => {
    await page.goto("/");
    // File tree from the Mark9ViewerApp
    await expect(page.getByRole("button", { name: "README.md" })).toBeVisible();
    // Preview content (rendered Markdown)
    await expect(
      page.getByRole("heading", { name: "Welcome to Mark9 Viewer" }),
    ).toBeVisible();
  });

  test("toggling to embed mode renders the standalone <Mark9Viewer>", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Embedded component" }).click();
    // Embed demo has its own list of paths as text labels.
    await expect(page.getByRole("button", { name: "/docs/README.md" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Welcome to Mark9 Viewer" }),
    ).toBeVisible();
  });

  test("selecting text shows the comment bubble; submitting adds a thread", async ({ page }) => {
    await page.goto("/");

    // Select text inside the preview by triple-clicking a paragraph.
    const paragraph = page
      .getByText("This is a read-only Markdown preview", { exact: false })
      .first();
    await paragraph.click({ clickCount: 3 });

    // Bubble appears with "Add comment".
    const addCommentBtn = page.getByRole("button", { name: "Add comment" });
    await expect(addCommentBtn).toBeVisible();
    await addCommentBtn.click();

    // Type and submit.
    const textarea = page.getByPlaceholder("Write a comment…");
    await textarea.fill("first reply from the e2e test");
    await page.getByRole("button", { name: "Comment", exact: true }).click();

    // Side panel shows the thread (quoted source + body).
    const sidePanel = page.locator("text=Comments (1)");
    await expect(sidePanel).toBeVisible();
    await expect(
      page.getByText("first reply from the e2e test"),
    ).toBeVisible();
  });
});
