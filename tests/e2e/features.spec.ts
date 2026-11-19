import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, hook: string, title: string) {
  await page.goto(`#/hooks/${hook}`);
  const region = page.getByRole("region", { name: title, exact: true });
  await region.getByRole("button", { name: "展开演示", exact: true }).click();
  // Scope to the running demo so the source viewer and description are excluded.
  return region.locator(".demo-stack");
}

test("preEnter mounts with start styles before entering", async ({ page }) => {
  const panel = await open(
    page,
    "useTransitionState",
    "preEnter 让 CSS transition 生效",
  );
  const phases: string[] = [];
  await page.exposeFunction("recordPhase", (phase: string) =>
    phases.push(phase),
  );
  await panel.evaluate((node) => {
    const outputs = node.querySelectorAll("output");
    const target = outputs[1]!;
    new MutationObserver(() =>
      (window as unknown as { recordPhase(p: string): void }).recordPhase(
        target.textContent ?? "",
      ),
    ).observe(target, { childList: true, characterData: true, subtree: true });
  });
  await panel.getByRole("button", { name: "显示两个面板" }).click();
  await expect(panel.locator("output").nth(1)).toHaveText("entered");
  await expect(panel.locator("output").nth(0)).toHaveText("entered");
  expect(phases).toContain("preEnter");
  expect(phases.indexOf("preEnter")).toBeLessThan(phases.indexOf("entering"));
});

test("form registers radio, checkbox groups, multi-select and files; blur validates one field", async ({
  page,
}) => {
  let panel = await open(page, "useForm", "单选组、复选框组、多选与文件");
  await panel.getByLabel("专业版").check();
  await panel.getByLabel("短信").check();
  await panel.getByLabel("邮件").uncheck();
  await panel.getByLabel(/服务区域/).selectOption(["north", "south"]);
  await panel.getByLabel(/附件/).setInputFiles({
    name: "report.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("x"),
  });
  const json = JSON.parse((await panel.locator("pre").textContent())!);
  expect(json).toEqual({
    plan: "pro",
    channels: ["sms"],
    regions: ["north", "south"],
    attachments: ["report.txt"],
  });
  panel = await open(page, "useForm", "失焦只校验当前字段");
  await panel.getByLabel("姓名").focus();
  await panel.getByLabel("邮箱").focus();
  await expect(panel.locator("output")).toHaveText(
    '当前错误：{"name":"请填写姓名"}',
  );
});

test("queue retries a timed-out attempt and ignores its late result", async ({
  page,
}) => {
  const panel = await open(page, "useAsyncQueue", "超时重试与迟到结果");
  await panel.getByRole("button", { name: "添加首次会超时的任务" }).click();
  await expect(panel.locator("li")).toContainText("success · 已执行 2 次");
  await expect(panel.locator("output")).toContainText("第 2 次尝试成功");
  await expect(panel.locator("output")).toContainText("迟到结果已忽略");
  await expect(panel.locator("output")).not.toContainText("第 1 次尝试成功");
  await panel.getByRole("button", { name: "移除此记录" }).click();
  await expect(panel.locator("li")).toHaveCount(0);
});

test("upload enforces capacity and retries in place", async ({ page }) => {
  const panel = await open(page, "useUpload", "容量上限与重试替换");
  await panel.getByRole("button", { name: /一次加入 3 个文件/ }).click();
  await expect(panel.locator("output")).toHaveText(
    "接受 2 个，因容量上限拒绝 1 个",
  );
  await expect(panel.locator("li")).toHaveCount(2);
  const retry = panel.getByRole("button", { name: "重试（替换此行）" });
  await expect(retry).toBeVisible();
  await retry.click();
  await expect(panel.locator("li")).toHaveCount(2);
  await expect(panel.locator("li").filter({ hasText: "flaky" })).toContainText(
    "success · 100%",
  );
});

test("sortable uses custom messages and cancels when focus leaves", async ({
  page,
}) => {
  const panel = await open(page, "useSortable", "自定义播报文案与失焦取消");
  const first = panel.locator("li").first();
  await expect(first).toHaveAttribute("aria-roledescription", "sortable item");
  await first.focus();
  await page.keyboard.press("Space");
  await expect(panel.getByRole("status")).toContainText("Picked up item 1");
  await page.keyboard.press("ArrowDown");
  await expect(panel.locator("li").nth(1)).toHaveText("Design");
  await panel
    .getByRole("button", { name: "Focus target outside the list" })
    .focus();
  await expect(panel.getByRole("status")).toHaveText("Reordering cancelled.");
  await expect(panel.locator("li").first()).toHaveText("Design");
});

test("long press suppresses the trailing click and keeps currentTarget", async ({
  page,
}) => {
  const panel = await open(page, "useLongPress", "长按后不触发点击");
  const button = panel.getByRole("button", { name: /短按计数/ });
  await button.click();
  await expect(panel.locator("output")).toContainText("点击 1 次");
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + 10, box.y + 10);
  await page.mouse.down();
  await page.waitForTimeout(800);
  await page.mouse.up();
  await expect(panel.locator("output")).toHaveText("点击 1 次 · 长按 删除按钮");
});

test("infinite scroll starts from a null cursor", async ({ page }) => {
  const panel = await open(page, "useInfiniteScroll", "以 null 作为首页游标");
  await expect(panel.locator("li")).toHaveCount(2);
  await panel.getByRole("button", { name: "加载下一页" }).click();
  await expect(panel.locator("li")).toHaveCount(4);
  await panel.getByRole("button", { name: "加载下一页" }).click();
  await expect(
    panel.getByRole("button", { name: "已全部加载" }),
  ).toBeDisabled();
  // Development StrictMode remounts once, so only assert the final sequence.
  await expect(panel.locator("output")).toHaveText(
    /请求游标：(null → )+token-a → token-b$/,
  );
});

test("search replaceDraft replaces while setDraft merges", async ({ page }) => {
  const panel = await open(page, "useSearch", "合并与整体替换草稿");
  const draft = panel.locator("output").first();
  await panel.getByRole("button", { name: "添加状态和负责人条件" }).click();
  await panel.getByRole("button", { name: "setDraft 合并预设" }).click();
  await expect(draft).toHaveText(
    '草稿：{"keyword":"发布","status":"open","owner":"我"}',
  );
  await panel.getByRole("button", { name: "replaceDraft 整体替换" }).click();
  await expect(draft).toHaveText('草稿：{"keyword":"发布"}');
});

test("selection limit counts as all selected and toggles off", async ({
  page,
}) => {
  const panel = await open(page, "useSelection", "上限选择与一键清除");
  await panel.getByRole("button", { name: "全选（最多 3 项）" }).click();
  await expect(panel.locator("output")).toContainText(
    "已选 A、B、C · allSelected：true",
  );
  await panel.getByRole("button", { name: "取消全部选择" }).click();
  await expect(panel.locator("output")).toContainText("已选 无");
});

test("mutate aborts the in-flight request", async ({ page }) => {
  const panel = await open(page, "useRequest", "本地修改中止旧请求");
  await panel.getByRole("button", { name: "发起慢请求" }).click();
  await expect(panel.locator("output")).toContainText("fetching：true");
  await panel.getByRole("button", { name: "立即本地修改" }).click();
  await expect(panel.locator("output")).toHaveText(
    "data：本地：已重命名 · fetching：false",
  );
  await page.waitForTimeout(1800);
  await expect(panel.locator("output")).toContainText("本地：已重命名");
  await expect(panel.locator("p")).not.toContainText("请求完成并写入");
});

test("query invalidation respects word boundaries", async ({ page }) => {
  const panel = await open(page, "useQuery", "按单词边界批量失效");
  const items = panel.locator("li");
  await expect(items.nth(2)).toContainText("第 1 次请求");
  await panel.getByRole("button", { name: /invalidate/ }).click();
  await expect(items.nth(0)).toContainText("第 2 次请求");
  await expect(items.nth(1)).toContainText("第 2 次请求");
  await expect(items.nth(2)).toContainText("第 1 次请求");
});

test("pagination steps three pages in one event and stops at the end", async ({
  page,
}) => {
  const panel = await open(page, "usePagination", "连续翻页不丢步");
  const step = panel.getByRole("button", { name: /连续调用 next 三次/ });
  await step.click();
  await expect(panel.locator("output")).toHaveText("第 4 / 10 页");
  for (let i = 0; i < 3; i++) await step.click();
  await expect(panel.locator("output")).toHaveText("第 10 / 10 页");
});

test("drag state recovers after the source unmounts", async ({ page }) => {
  const panel = await open(page, "useDrag", "拖拽源中途卸载后复位");
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await panel.getByText(/拖动我/).dispatchEvent("dragstart", { dataTransfer });
  await expect(panel.locator("output")).toHaveText("dragging：true");
  // The source is removed mid-drag, so its own dragend can never fire.
  await expect(panel.getByText("拖拽源已卸载")).toBeVisible();
  await expect(panel.locator("output")).toHaveText("dragging：true");
  await page.mouse.move(5, 5);
  await page.mouse.down();
  await page.mouse.up();
  await expect(panel.locator("output")).toHaveText("dragging：false");
});

test("image never reports the previous result for a new src", async ({
  page,
}) => {
  const panel = await open(page, "useImage", "切换图片不闪现旧结果");
  await expect(panel.locator("output")).toContainText("第 1 张 · loaded");
  await panel.getByRole("button", { name: "切换到下一张图片" }).click();
  await expect(panel.locator("output")).toContainText("第 2 张 · loaded");
  await panel.getByRole("button", { name: "切换到下一张图片" }).click();
  await expect(panel.locator("output")).toContainText("第 3 张 · error");
  await expect(panel.locator("output")).toContainText("与请求一致");
  await expect(panel.locator("p")).not.toContainText("2:loaded → 3:loaded");
});
