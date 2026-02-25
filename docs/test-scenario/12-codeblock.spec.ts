import { test, expect } from "@playwright/test";

test.describe("12. Code Block Editing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ProseMirror", { timeout: 10_000 });
  });

  /**
   * Helper: 에디터 끝에 코드블럭을 생성한다.
   * ```java + Enter 입력으로 코드블럭 생성.
   */
  async function createCodeBlock(page: import("@playwright/test").Page, language = "java") {
    const editor = page.locator(".ProseMirror");
    // 에디터 끝으로 이동
    await editor.click();
    await page.keyboard.press("End");
    await page.keyboard.press("Control+End");

    // 빈 줄 추가 후 코드블럭 생성
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type(`\`\`\`${language}`, { delay: 30 });
    await page.keyboard.press("Enter");

    // 코드블럭이 생성될 때까지 대기
    await page.waitForTimeout(500);
  }

  test("코드블럭 내에서 Enter를 누르면 줄바꿈이 삽입된다 (내용 삭제 아님)", async ({ page }) => {
    await createCodeBlock(page, "java");

    // 코드블럭 내에서 텍스트 입력
    await page.keyboard.type("public class Main {", { delay: 20 });
    await page.keyboard.press("Enter");
    await page.keyboard.type("  // hello", { delay: 20 });

    // 잠시 대기
    await page.waitForTimeout(300);

    // 에디터 내부에서 코드블럭 텍스트 확인
    const codeContent = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    // Enter 이후에도 첫 번째 줄 "public class Main {" 이 남아있어야 한다
    expect(codeContent).toContain("public class Main {");
    expect(codeContent).toContain("// hello");
  });

  test("코드블럭 내에서 Enter를 눌러도 코드블럭 자체가 삭제되지 않는다", async ({ page }) => {
    await createCodeBlock(page, "javascript");

    // 코드 입력
    await page.keyboard.type("const x = 1;", { delay: 20 });

    // Enter 여러 번 입력
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("const y = 2;", { delay: 20 });

    await page.waitForTimeout(300);

    // 코드블럭이 여전히 존재하는지 확인
    const codeBlockExists = await page.evaluate(() => {
      const wrapper = document.querySelector(".codeblock-wrapper, .ProseMirror pre");
      return wrapper !== null;
    });
    expect(codeBlockExists).toBe(true);

    // 내용이 보존되어 있는지 확인
    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });
    expect(content).toContain("const x = 1;");
    expect(content).toContain("const y = 2;");
  });

  test("코드블럭에서 소괄호 () 자동완성이 동작한다", async ({ page }) => {
    await createCodeBlock(page, "java");

    await page.keyboard.type("System.out.println", { delay: 20 });
    // ( 입력 시 () 가 자동 완성되어야 함
    await page.keyboard.press("(");

    await page.waitForTimeout(200);

    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    // 소괄호 쌍이 자동완성 되어야 함
    expect(content).toContain("println()");
  });

  test("코드블럭에서 중괄호 {} 자동완성이 동작한다", async ({ page }) => {
    await createCodeBlock(page, "java");

    await page.keyboard.type("if (true) ", { delay: 20 });
    await page.keyboard.press("{");

    await page.waitForTimeout(200);

    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    expect(content).toContain("{}");
  });

  test("코드블럭에서 대괄호 [] 자동완성이 동작한다", async ({ page }) => {
    await createCodeBlock(page, "javascript");

    await page.keyboard.type("const arr = ", { delay: 20 });
    await page.keyboard.press("[");

    await page.waitForTimeout(200);

    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    expect(content).toContain("[]");
  });

  test("코드블럭에서 따옴표 자동완성이 동작한다", async ({ page }) => {
    await createCodeBlock(page, "javascript");

    await page.keyboard.type("const s = ", { delay: 20 });
    await page.keyboard.press('"');

    await page.waitForTimeout(200);

    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    // 쌍따옴표가 자동완성 되어야 함: s = ""
    expect(content).toContain('""');
  });

  test("코드블럭에서 닫는 괄호 입력 시 skip-over 된다", async ({ page }) => {
    await createCodeBlock(page, "java");

    // ( 입력 → () 자동완성 → ) 입력 시 커서만 이동
    await page.keyboard.type("test", { delay: 20 });
    await page.keyboard.press("(");
    await page.waitForTimeout(100);
    await page.keyboard.press(")");
    await page.waitForTimeout(100);

    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    // )) 가 아닌 test() 이어야 함
    expect(content).toContain("test()");
    expect(content).not.toContain("test())");
  });

  test("코드블럭에서 Tab 키가 2칸 스페이스로 변환된다", async ({ page }) => {
    await createCodeBlock(page, "python");

    await page.keyboard.type("def hello():", { delay: 20 });
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.type("pass", { delay: 20 });

    await page.waitForTimeout(200);

    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    // Tab이 2칸 스페이스로 변환되어야 함
    expect(content).toContain("  pass");
  });

  test("코드블럭에서 Backspace로 인접 괄호쌍이 동시 삭제된다", async ({ page }) => {
    await createCodeBlock(page, "java");

    await page.keyboard.type("foo", { delay: 20 });
    await page.keyboard.press("(");
    await page.waitForTimeout(100);

    // 커서는 () 사이에 있음 — Backspace 입력
    await page.keyboard.press("Backspace");
    await page.waitForTimeout(200);

    const content = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll(".ProseMirror code");
      const lastBlock = codeBlocks[codeBlocks.length - 1];
      return lastBlock?.textContent ?? "";
    });

    // () 쌍이 모두 삭제되어 "foo" 만 남아야 함
    expect(content).toBe("foo");
  });
});
