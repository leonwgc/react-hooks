import { expect, test } from "@playwright/test";

test("shared query updates both subscribers and refreshes invalid data", async ({
  page,
}) => {
  await page.goto("#/hooks/useQuery");
  const demo = page.locator(".basic-demo");
  await expect(demo.locator("output")).toHaveText("A：1 / B：1");
  await demo.getByRole("button", { name: "从 B 更新共享缓存" }).click();
  await expect(demo.locator("output")).toHaveText("A：99 / B：99");
  await demo.getByRole("button", { name: "失效并重新查询" }).click();
  await expect(demo.locator("output")).toHaveText("A：2 / B：2");
  await demo.getByRole("button", { name: "从 A 刷新共享查询" }).click();
  await expect(demo.locator("output")).toHaveText("A：3 / B：3");
});

test("step validation blocks empty input and reset clears progress", async ({
  page,
}) => {
  await page.goto("#/hooks/useSteps");
  const demo = page.locator(".basic-demo");
  await demo.getByRole("button", { name: "下一步", exact: true }).click();
  await expect(demo.locator("output")).toContainText("1 / 3");
  await demo.getByLabel("步骤姓名").fill("测试用户");
  await demo.getByRole("button", { name: "下一步", exact: true }).click();
  await expect(demo).toContainText("确认姓名：测试用户");
  await demo.getByRole("button", { name: "下一步", exact: true }).click();
  await expect(demo).toContainText("流程已完成");
  await demo.getByRole("button", { name: "重置步骤" }).click();
  await expect(demo.locator("output")).toContainText("1 / 3");
  await expect(demo).toContainText("已完成索引：无");
});

test("title restores on navigation and object URLs are revoked", async ({
  page,
}) => {
  await page.goto("#/guide");
  const original = await page.title();
  await page.goto("#/hooks/useDocumentTitle");
  await page.getByLabel("浏览器标题", { exact: true }).fill("新的测试标题");
  await expect(page).toHaveTitle("新的测试标题");
  await page.goto("#/guide");
  await expect(page).toHaveTitle(original);
  await page.goto("#/hooks/useObjectURL");
  const demo = page.locator(".basic-demo");
  await demo.getByRole("button", { name: "生成 Blob 地址" }).click();
  const url = await demo
    .getByRole("link", { name: "打开本地文本" })
    .getAttribute("href");
  expect(url).toMatch(/^blob:/);
  expect(
    await page.evaluate(async (url) => (await fetch(url!)).text(), url),
  ).toBe("本地文本预览");
  await demo.getByRole("button", { name: "释放 Blob 地址" }).click();
  await expect(demo.locator("output")).toHaveText("未创建地址");
  expect(
    await page.evaluate(async (url) => {
      try {
        await fetch(url!);
        return false;
      } catch {
        return true;
      }
    }, url),
  ).toBe(true);
});

test("textarea grows to its row limit and shrinks after clearing", async ({
  page,
}) => {
  await page.goto("#/hooks/useTextareaAutoSize");
  const demo = page.locator(".basic-demo"),
    input = demo.getByLabel("自增高留言");
  const initial = await input.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  await demo.getByRole("button", { name: "填入八行文本" }).click();
  await expect(input).toHaveCSS("overflow-y", "auto");
  const expanded = await input.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  expect(expanded).toBeGreaterThan(initial);
  expect(expanded - initial).toBeCloseTo(66, 0);
  await demo.getByRole("button", { name: "清空留言" }).click();
  await expect(input).toHaveCSS("overflow-y", "hidden");
  expect(
    await input.evaluate((node) => node.getBoundingClientRect().height),
  ).toBe(initial);
});

test("spring respects reduced motion and transitions keep exiting content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("#/hooks/useSpring");
  let demo = page.locator(".basic-demo");
  await demo.getByRole("button", { name: "切换弹簧目标" }).click();
  await expect(demo.locator("output")).toHaveText("100.0 · 静止");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("#/hooks/useTransitionState");
  demo = page.getByRole("region", { name: "快速反向切换" });
  await demo.getByRole("button", { name: "展开演示" }).click();
  await expect(demo.locator("output")).toHaveText("entered · 仍挂载");
  await demo.getByRole("button", { name: "请求退出内容" }).click();
  await expect(demo.locator("output")).toHaveText("exiting · 仍挂载");
  await expect(demo.locator(".transition-demo")).toBeAttached();
  await demo.getByRole("button", { name: "重新进入内容" }).click();
  await expect(demo.locator("output")).toHaveText("entered · 仍挂载");
  await page.waitForTimeout(850);
  await expect(demo.locator(".transition-demo")).toBeAttached();
  await demo.getByRole("button", { name: "请求退出内容" }).click();
  await expect(demo.locator(".transition-demo")).toHaveCount(0);
});

test("pointer swipe changes pages and keyboard buttons provide the same action", async ({
  page,
}) => {
  await page.goto("#/hooks/useGesture");
  const demo = page.locator(".basic-demo"),
    pad = demo.getByLabel("滑动翻页区域");
  await pad.scrollIntoViewIfNeeded();
  const rect = (await pad.boundingBox())!;
  await page.mouse.move(rect.x + rect.width * 0.75, rect.y + 20);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width * 0.25, rect.y + 20, { steps: 8 });
  await page.mouse.up();
  await expect(pad).toContainText("第 2 / 5 页");
  await expect(demo).toContainText("滑动 left");
  await demo.getByRole("button", { name: "上一张" }).focus();
  await page.keyboard.press("Enter");
  await expect(pad).toContainText("第 1 / 5 页");
  await demo.getByRole("button", { name: "重置手势状态" }).click();
  await expect(demo).toContainText("位移 0px · 滑动 无");
});
