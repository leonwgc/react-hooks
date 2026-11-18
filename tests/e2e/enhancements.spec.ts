import { expect, test, type Page } from "@playwright/test";
async function open(page: Page, hook: string, title: string) {
  await page.goto(`#/hooks/${hook}`);
  const panel = page.getByRole("region", { name: title, exact: true });
  await panel.getByRole("button", { name: "展开演示", exact: true }).click();
  return panel;
}
test("examples are vertically aligned peers without an enclosing card", async ({
  page,
}) => {
  for (const width of [390, 879, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("#/hooks/useDocumentTitle");
    await expect(page.locator(".demo-scenario")).toHaveCount(2);
    await expect(page.locator("#demo .demo-shell")).toHaveCount(0);
    await expect(page.locator(".basic-demo > .source-details")).toHaveCount(1);
    await expect(
      page.locator(".demo-scenario > .scenario-source-details"),
    ).toHaveCount(2);
    const cards = await page
      .locator("#demo .basic-demo, #demo .demo-scenario")
      .evaluateAll((nodes) =>
        nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        }),
      );
    expect(cards).toHaveLength(3);
    cards.slice(1).forEach((card, index) => {
      expect(card.top).toBeGreaterThan(cards[index].bottom);
      expect(Math.abs(card.left - cards[0].left)).toBeLessThan(2);
      expect(Math.abs(card.right - cards[0].right)).toBeLessThan(2);
    });
  }
});
test("ready and dependency changes gate real requests; delayed loading settles", async ({
  page,
}) => {
  let panel = await open(page, "useRequest", "就绪条件与依赖刷新");
  await expect(panel.locator("output")).toContainText("等待就绪");
  await panel.getByRole("button", { name: "下一页条件" }).click();
  await expect(panel.locator("output")).toHaveText("页码 2 · 等待就绪");
  await panel.getByLabel("允许请求").check();
  await expect(panel.locator("output")).toHaveText("页码 2 · 第 2 页");
  await panel.getByRole("button", { name: "下一页条件" }).click();
  await expect(panel.locator("output")).toHaveText("页码 3 · 第 3 页");
  panel = await open(page, "useRequest", "延迟加载与生命周期");
  await panel.getByRole("button", { name: "慢速请求 900ms" }).click();
  await expect(panel.locator("output")).toContainText(
    "fetching: true · loading: false",
  );
  await expect(panel.locator("output")).toContainText(
    "fetching: true · loading: true",
  );
  await expect(panel.locator("output")).toContainText(
    "fetching: false · loading: false · 900ms 请求完成",
  );
  await expect(panel).toContainText("开始 → 完成");
});
test("query keeps previous pages and selectors ignore unrelated updates", async ({
  page,
}) => {
  let panel = await open(page, "useQuery", "结构键与分页保留");
  await expect(panel.locator("output")).toHaveText("第 1 页数据 · 当前页");
  await panel.getByRole("button", { name: "查询下一页" }).click();
  await expect(panel.locator("output")).toHaveText("第 1 页数据 · 保留前页");
  await expect(panel.locator("output")).toHaveText("第 2 页数据 · 当前页");
  await panel.getByRole("button", { name: "刷新文章前缀" }).click();
  await expect(panel.locator("output")).toHaveText("第 2 页数据 · 刷新中");
  await expect(panel.locator("output")).toHaveText("第 2 页数据 · 当前页");
  panel = await open(page, "useQuery", "选择数据与隔离订阅");
  const before = await panel.locator("output").textContent();
  await panel.getByRole("button", { name: "仅修改备注" }).click();
  await expect(panel.locator("output")).toHaveText(before!);
  await panel.getByRole("button", { name: "增加订阅计数" }).click();
  await expect(panel.locator("output")).toContainText("计数 1");
});
test("form focuses the first invalid field and unregisters detached fields", async ({
  page,
}) => {
  let panel = await open(page, "useForm", "单字段重置与错误聚焦");
  await panel.getByRole("button", { name: "校验并定位错误" }).click();
  await expect(panel.getByLabel("聚焦姓名")).toBeFocused();
  await panel.getByLabel("聚焦姓名").fill("测试用户");
  await panel.getByLabel("聚焦邮箱").fill("user@example.com");
  await panel.getByRole("button", { name: "只重置姓名" }).click();
  await expect(panel.getByLabel("聚焦姓名")).toHaveValue("");
  await expect(panel.getByLabel("聚焦邮箱")).toHaveValue("user@example.com");
  panel = await open(page, "useForm", "条件字段卸载策略");
  await panel.getByLabel("卸载时移除字段").check();
  await panel.getByRole("button", { name: "切换附加字段" }).click();
  await panel.getByRole("button", { name: "校验条件字段" }).click();
  await expect(panel.locator("output")).toHaveText("值 {} · 错误 {}");
});
test("field array errors and identities move with records", async ({
  page,
}) => {
  const panel = await open(page, "useFieldArray", "插入交换与元数据跟随");
  await panel.getByRole("button", { name: "标记第一行错误" }).click();
  const original = await panel.locator("li").first().textContent();
  await panel.getByRole("button", { name: "交换前两行" }).click();
  await expect(panel.locator("li").nth(1)).toHaveText(original!);
  await panel.getByRole("button", { name: "中间插入一行" }).click();
  await expect(panel.locator("li").nth(2)).toHaveText(original!);
  await expect(panel.locator("li").nth(1)).toContainText("新行");
});
test("shift range skips disabled items and selection obeys a changing limit", async ({
  page,
}) => {
  let panel = await open(page, "useSelection", "Shift 范围与禁用项");
  await panel.getByRole("button", { name: "A", exact: true }).click();
  await panel
    .getByRole("button", { name: "E", exact: true })
    .click({ modifiers: ["Shift"] });
  await expect(panel.locator("output")).toHaveText("已选 A,B,D,E");
  await expect(
    panel.getByRole("button", { name: "C", exact: true }),
  ).toBeDisabled();
  panel = await open(page, "useSelection", "选择上限与动态裁剪");
  await panel.getByRole("button", { name: "按上限全选" }).click();
  await expect(panel.locator("output")).toHaveText("A,B · 已到上限");
  await panel.getByLabel("最多选择").selectOption("1");
  await expect(panel.locator("output")).toHaveText("A · 已到上限");
});
test("queue executes priority order, retries failures and terminates timeouts", async ({
  page,
}) => {
  let panel = await open(page, "useAsyncQueue", "优先级与队列容量");
  await panel.getByRole("button", { name: "准备优先级队列" }).click();
  await expect(panel.getByRole("alert")).toContainText("QueueCapacityError");
  await panel.getByRole("button", { name: "恢复优先级调度" }).click();
  await expect(panel.locator("output")).toHaveText("高优先级 → 普通任务");
  panel = await open(page, "useAsyncQueue", "失败重试与超时取消");
  await panel.getByRole("button", { name: "加入可恢复任务" }).click();
  await expect(panel.locator("li")).toContainText(
    "success · 尝试 3 · 第三次成功",
  );
  await panel.getByRole("button", { name: "加入超时任务" }).click();
  await expect(panel.locator("li").last()).toContainText(
    "error · 尝试 1 · TimeoutError",
  );
});
test("undo coalesces keyboard input and commits a multi-update transaction once", async ({
  page,
}) => {
  let panel = await open(page, "useUndoRedo", "连续输入合并与标签");
  await panel.getByLabel("合并输入").pressSequentially("hello", { delay: 20 });
  await expect(panel.locator("output")).toContainText("历史 1");
  await panel.getByRole("button", { name: "撤销连续输入" }).click();
  await expect(panel.getByLabel("合并输入")).toHaveValue("");
  await panel.getByRole("button", { name: "重做连续输入" }).click();
  await expect(panel.getByLabel("合并输入")).toHaveValue("hello");
  panel = await open(page, "useUndoRedo", "事务提交与回滚");
  await panel.getByRole("button", { name: "开始编辑事务" }).click();
  await panel.getByRole("button", { name: "修改标题和字号" }).click();
  await panel.getByRole("button", { name: "提交编辑事务" }).click();
  await expect(panel.locator("output")).toContainText(
    "新版标题 · 14px · 已提交 · 历史 1",
  );
  await panel.getByRole("button", { name: "撤销整个事务" }).click();
  await expect(panel.locator("output")).toContainText("原始标题 · 12px");
});
test("actual animation ends phases and missing events use timeout fallback", async ({
  page,
}) => {
  let panel = await open(page, "useTransitionState", "动画结束与生命周期回调");
  await panel.getByRole("button", { name: "切换事件驱动动画" }).click();
  await expect(panel.locator("output")).toHaveText("entered", {
    timeout: 1200,
  });
  await panel.getByRole("button", { name: "切换事件驱动动画" }).click();
  await expect(panel.locator("output")).toHaveText("unmounted", {
    timeout: 1200,
  });
  await expect(panel).toContainText(
    "开始进入 → 进入完成 → 开始退出 → 退出完成",
  );
  panel = await open(page, "useTransitionState", "缺失结束事件的兜底");
  await panel.getByRole("button", { name: "切换无动画内容" }).click();
  await expect(panel.locator("output")).toHaveText("entered · 已挂载");
  await panel.getByRole("button", { name: "切换无动画内容" }).click();
  await expect(panel.locator("output")).toHaveText("exiting · 已挂载");
  await expect(panel.locator("output")).toHaveText("unmounted · 已卸载");
});

test("each source panel contains and copies only its own example", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("#/hooks/useLatest");
  const basic = page.locator(".basic-demo > .source-details");
  await basic.locator("summary").click();
  await expect(basic.locator("code")).toContainText("useLatest");
  await expect(basic.locator("code")).not.toContainText("最新草稿");
  const first = page.getByRole("region", {
    name: "长期订阅读取最新草稿",
    exact: true,
  });
  const source = first.locator(".scenario-source-details");
  await source.locator("summary").click();
  await expect(source.locator("code")).toContainText("最新草稿");
  await expect(source.locator("code")).not.toContainText("传入值");
  const text = await source.locator("code").textContent();
  await source.getByRole("button", { name: "复制代码", exact: true }).click();
  await expect(source.getByRole("button", { name: "已复制 ✓" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(text);
  const second = page
    .getByRole("region", { name: "引用更新不主动渲染", exact: true })
    .locator(".scenario-source-details");
  await second.locator("summary").click();
  await expect(second.locator("code")).toContainText("传入值");
  await expect(second.locator("code")).not.toContainText("最新草稿");
});
