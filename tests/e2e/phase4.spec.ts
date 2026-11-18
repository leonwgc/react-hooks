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

test("textarea preserves direct input while growing and shrinking", async ({
  page,
}) => {
  await page.goto("#/hooks/useTextareaAutoSize");
  const input = page.getByLabel("自增高留言");
  const initial = await input.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  const text = "第一行\n第二行\n第三行\n第四行";
  await input.fill(text);
  await expect(input).toHaveValue(text);
  await expect
    .poll(() => input.evaluate((node) => node.getBoundingClientRect().height))
    .toBeGreaterThan(initial);
  await input.press("End");
  await input.press("Enter");
  await input.pressSequentially("fifth line");
  await expect(input).toHaveValue(text + "\nfifth line");
  await input.fill("简短内容");
  await expect(input).toHaveValue("简短内容");
  await expect
    .poll(() => input.evaluate((node) => node.getBoundingClientRect().height))
    .toBe(initial);
});

for (const width of [390, 879]) {
  test(`textarea keeps pasted wrapped text and respects row limits at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 703 });
    await page.goto("#/hooks/useTextareaAutoSize");
    const input = page.getByLabel("自增高留言");
    const initial = await input.evaluate(
      (node) => node.getBoundingClientRect().height,
    );
    const text =
      "行数上限与内容收缩：输入或填入长内容，观察最大行数限制；清空后恢复最少行数。".repeat(
        8,
      );
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.evaluate((text) => navigator.clipboard.writeText(text), text);
    await input.focus();
    await input.press("ControlOrMeta+V");
    await expect(input).toHaveValue(text);
    await expect(input).toHaveCSS("overflow-y", "auto");
    expect(
      (await input.evaluate((node) => node.getBoundingClientRect().height)) -
        initial,
    ).toBeCloseTo(66, 0);
    await input.fill("");
    await expect(input).toHaveValue("");
    await expect
      .poll(() => input.evaluate((node) => node.getBoundingClientRect().height))
      .toBe(initial);

    const panel = page.getByRole("region", { name: "禁用与手动重新测量" });
    await panel.getByRole("button", { name: "展开演示" }).click();
    const unlimited = panel.getByLabel("可暂停自增高");
    const lines = Array.from({ length: 8 }, (_, i) => "第 " + i + " 行").join(
      "\n",
    );
    await unlimited.fill(lines);
    await expect(unlimited).toHaveValue(lines);
    await expect
      .poll(() =>
        unlimited.evaluate((node) => node.getBoundingClientRect().height),
      )
      .toBeGreaterThan(130);
    await panel.getByRole("button", { name: "停用自增高" }).click();
    await expect(unlimited).toHaveCSS("height", "100px");
    await expect(unlimited).toHaveValue(lines);
  });
}

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
