import { expect, test } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { catalog } from "../../website/catalog";

test("home, theme and guide work", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "少写重复逻辑",
  );
  await page.getByRole("button", { name: "切换通知" }).click();
  await expect(page.getByText("通知已开启", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "切换深色主题" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { name: "快速开始" }).click();
  await expect(
    page.getByRole("heading", { name: "从一个 Hook 开始" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "本项目由 AI（OpenAI Codex）在开发者指导下设计、编码、编写文档并执行验证。",
      { exact: true },
    ),
  ).toBeVisible();
});

test("all hook routes render their own demo and source without page errors", async ({
  page,
}) => {
  test.setTimeout(150000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const hook of catalog) {
    await page.goto(`#/hooks/${hook.name}`);
    await expect(
      page.getByRole("heading", { name: hook.name, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".demo-content")).not.toContainText(
      "正在加载示例",
    );
    await expect(page.locator(".demo-content")).not.toContainText(
      "示例暂时无法运行",
    );
    await page.locator(".source-details summary").click();
    await expect(page.locator(".source-details code")).toContainText(hook.name);
    await expect(
      page.getByRole("heading", { name: "行为与边界", exact: true }),
    ).toBeVisible();
    await expect(page.locator("#api-parameters")).toBeAttached();
    await expect(page.locator("#api-returns")).toBeAttached();
    await expect(page.locator("#api .api-detail-table").first()).toBeAttached();
    await expect(page.locator("#api .api-intro a")).toHaveAttribute(
      "href",
      /^https:\/\/github\.com\/leonwgc\/react-hooks\/blob\/master\/src\//,
    );
  }
  expect(errors).toEqual([]);
});

test("hook search filters navigation", async ({ page }) => {
  await page.goto("#/hooks/useBoolean");
  await page.getByRole("textbox", { name: "搜索 Hooks" }).fill("useForm");
  await expect(page.locator(".nav-group a")).toHaveCount(2);
  await page
    .locator(".nav-group")
    .getByRole("link", { name: "useForm", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "useForm", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "搜索 Hooks" })
    .fill("nothing-matches");
  await expect(
    page.getByText("没有匹配的 Hooks", { exact: true }),
  ).toBeVisible();
});

test("requests show failure, retry and cancellation", async ({ page }) => {
  await page.goto("#/hooks/useRequest");
  await page.getByLabel("模拟请求失败").check();
  await page.getByRole("button", { name: "获取文章" }).click();
  await expect(page.getByRole("alert")).toContainText("模拟服务暂时不可用");
  await page.getByLabel("模拟请求失败").uncheck();
  await page.getByRole("button", { name: "重试", exact: true }).click();
  await expect(
    page.locator(".demo-content").getByText("请求成功", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "获取文章" }).click();
  await page.getByRole("button", { name: "取消", exact: true }).click();
  await expect(page.getByText("正在获取数据…", { exact: true })).toHaveCount(0);
});

test("list supports search, pagination, cross-page selection, editing, empty and errors", async ({
  page,
}) => {
  await page.goto("#/hooks/useTable");
  await expect(
    page.getByText("共 26 篇文章 · 第 1 页", { exact: true }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: "选择文章 1", exact: true }).check();
  await page.getByRole("button", { name: "下一页", exact: true }).click();
  await expect(
    page.getByText("共 26 篇文章 · 第 2 页", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("已选 1 项", { exact: true })).toBeVisible();
  await page.getByLabel("文章搜索").fill("React");
  await page.getByRole("button", { name: "查询", exact: true }).click();
  await expect(
    page.getByText("共 7 篇文章 · 第 1 页", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("已选 0 项", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "编辑", exact: true }).first().click();
  await page.getByRole("dialog").getByLabel("文章标题").fill("React 全新标题");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "保存", exact: true })
    .click();
  await expect(
    page.getByRole("cell", { name: "React 全新标题", exact: true }),
  ).toBeVisible();
  await page.getByLabel("文章搜索").fill("不存在的文章");
  await page.getByRole("button", { name: "查询", exact: true }).click();
  await expect(
    page.getByText("没有匹配的文章，试试其他关键词。", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("模拟失败").check();
  await page.getByRole("button", { name: "查询", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("加载失败");
  await page.getByLabel("模拟失败").uncheck();
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await expect(
    page.getByText("共 26 篇文章 · 第 1 页", { exact: true }),
  ).toBeVisible();
});

test("forms validate async availability and cross-field rules before submitting", async ({
  page,
}) => {
  await page.goto("#/hooks/useForm");
  await page.getByRole("button", { name: "创建演示账户" }).click();
  await expect(
    page.getByText("用户名至少需要 3 个字符", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("用户名", { exact: true }).fill("admin");
  await expect(
    page.getByText("该用户名已被使用", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("用户名", { exact: true }).fill("visitor");
  await page.getByLabel("密码", { exact: true }).fill("secret123");
  await page.getByLabel("确认密码", { exact: true }).fill("wrong");
  await expect(
    page.getByText("两次输入的密码不一致", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("确认密码", { exact: true }).fill("secret123");
  await page.getByRole("button", { name: "创建演示账户" }).click();
  await expect(
    page.getByText("visitor，演示注册成功！未发送或保存你的密码。", {
      exact: true,
    }),
  ).toBeVisible();
});

test("dynamic fields preserve values through add, move and remove", async ({
  page,
}) => {
  await page.goto("#/hooks/useFieldArray");
  await page.getByRole("button", { name: "添加联系人" }).click();
  await page.getByLabel("联系人 2", { exact: true }).fill("第二位");
  await page.getByRole("button", { name: "上移联系人 2" }).click();
  await expect(page.getByLabel("联系人 1", { exact: true })).toHaveValue(
    "第二位",
  );
  await page.getByRole("button", { name: "删除联系人 1" }).click();
  await expect(page.getByLabel("联系人 1", { exact: true })).toHaveValue(
    "林一",
  );
});

test("animation supports reduced motion and dialog closes with Escape", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("#/hooks/useAnimate");
  await page.getByRole("button", { name: "播放动画" }).click();
  await expect(page.getByText("状态：finished", { exact: true })).toBeVisible();
  await page.goto("#/hooks/useDisclosure");
  await page.getByRole("button", { name: "打开对话框" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("mobile pages fit viewport and navigation remains accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole("button", { name: "添加联系人" })).toBeVisible();
  await expect(page.getByRole("button", { name: "播放动画" })).toBeVisible();
  await expect(page.getByRole("button", { name: "切换通知" })).toBeVisible();
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.goto("#/hooks/useTable");
  await page.getByRole("button", { name: "目录", exact: true }).click();
  await page.getByRole("textbox", { name: "搜索 Hooks" }).fill("useForm");
  await page
    .locator(".nav-group")
    .getByRole("link", { name: "useForm", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "useForm", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".sidebar")).not.toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("desktop screenshots cover homepage and documentation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("");
  await expect(page.getByRole("button", { name: "切换通知" })).toBeVisible();
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.goto("#/hooks/useTable");
  await expect(
    page.getByText("共 26 篇文章 · 第 1 页", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/docs-desktop.png",
    fullPage: true,
  });
});

test("source and guide code highlight keywords without changing copy text", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("#/guide");
  const guideCode = page
    .locator(".guide-content pre code.language-tsx")
    .first();
  await expect(guideCode.locator(".code-token--keyword").first()).toHaveText(
    "import",
  );
  const light = await guideCode
    .locator(".code-token--keyword")
    .first()
    .evaluate((el) => getComputedStyle(el).color);
  await page.getByRole("button", { name: "切换深色主题" }).click();
  const dark = await guideCode
    .locator(".code-token--keyword")
    .first()
    .evaluate((el) => getComputedStyle(el).color);
  expect(dark).not.toBe(light);
  await page.goto("#/hooks/useForm");
  await page.locator(".source-details summary").click();
  const source = page.locator(".source-details code");
  await expect(source.locator(".code-token--keyword").first()).toHaveText(
    "import",
  );
  await page
    .locator(".source-details")
    .getByRole("button", { name: "复制代码" })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    await source.textContent(),
  );
});

test("phase two virtual list, history and queue interactions", async ({
  page,
}) => {
  await page.goto("#/hooks/useVirtualList");
  await page.getByRole("button", { name: "定位第 5000 项" }).click();
  await expect(
    page
      .getByRole("list", { name: "虚拟记录列表" })
      .getByRole("listitem")
      .filter({ hasText: /^记录 5000$/ }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("list", { name: "虚拟记录列表" })
      .getByRole("listitem")
      .count(),
  ).toBeLessThan(20);
  await page.goto("#/hooks/useUndoRedo");
  await page.getByLabel("编辑文案").fill("new draft");
  await page.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(page.getByLabel("编辑文案")).toHaveValue("开始编辑这段文案");
  await page.getByRole("button", { name: "重做", exact: true }).click();
  await expect(page.getByLabel("编辑文案")).toHaveValue("new draft");
  await page.goto("#/hooks/useAsyncQueue");
  await page.getByRole("button", { name: "暂停队列" }).click();
  await page.getByRole("button", { name: "加入 5 个任务" }).click();
  await expect(page.locator(".demo-content output")).toContainText(
    "运行 0 / 等待 5",
  );
  await page.getByRole("button", { name: "全部取消" }).click();
  await expect(
    page.locator(".demo-content li").filter({ hasText: "cancelled" }),
  ).toHaveCount(5);
});

test("upload failure retries using the original file", async ({ page }) => {
  await page.goto("#/hooks/useUpload");
  await page.getByLabel("模拟上传失败").check();
  await page.getByLabel("选择文件").setInputFiles({
    name: "draft.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("draft"),
  });
  await expect(page.locator(".demo-content li")).toContainText("error");
  await page.getByLabel("模拟上传失败").uncheck();
  await page.getByRole("button", { name: "重试上传" }).click();
  await expect(page.locator(".demo-content li").last()).toContainText(
    "success",
  );
  await expect(page.getByRole("progressbar").last()).toHaveAttribute(
    "value",
    "100",
  );
});

test("broadcast, external DOM observation and local file download work", async ({
  page,
}) => {
  await page.goto("#/hooks/useBroadcastChannel");
  await page.getByLabel("消息", { exact: true }).fill("hello from browser");
  await page.getByRole("button", { name: "广播消息" }).click();
  await expect(page.locator(".demo-content output")).toContainText(
    "hello from browser",
  );
  await page.goto("#/hooks/useMutationObserver");
  await page.getByRole("button", { name: "模拟第三方插入 DOM" }).click();
  await expect(page.locator(".demo-content output")).toHaveText(
    "观察到 1 条变更",
  );
  await page.goto("#/hooks/useDownload");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载示例文本" }).click();
  expect((await downloaded).suggestedFilename()).toBe("web-hooks-demo.txt");
});

test("leave guard respects confirmation and long press cancels short presses", async ({
  page,
}) => {
  await page.goto("#/hooks/useLeaveConfirm");
  await page.getByLabel("草稿", { exact: true }).fill("unsaved");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "模拟离开编辑页" }).click();
  await expect(page.locator(".demo-content output")).toHaveText("有未保存修改");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "模拟离开编辑页" }).click();
  await expect(page.locator(".demo-content output")).toHaveText("已确认离开");
  await page.getByRole("button", { name: "保存草稿" }).click();
  await page.goto("#/hooks/useLongPress");
  await page.getByRole("button", { name: /长按 600ms/ }).click();
  await expect(page.locator(".demo-content output")).toHaveText("已触发 0 次");
  await page.getByRole("button", { name: /长按 600ms/ }).click({ delay: 700 });
  await expect(page.locator(".demo-content output")).toHaveText("已触发 1 次");
});

test("infinite virtual feed resets query and restores form snapshots", async ({
  page,
}) => {
  await page.goto("#/hooks/useInfiniteScroll");
  await expect(page.locator(".demo-content output")).toContainText(
    /已加载 (5|10) 项/,
  );
  await page.getByLabel("内容分类").selectOption("教程");
  await expect(page.getByRole("listitem").first()).toContainText("教程 1");
  await expect(
    page.getByRole("listitem").filter({ hasText: "文章" }),
  ).toHaveCount(0);
  await page.goto("#/hooks/useUndoRedo");
  await page.getByLabel("表单标题").fill("第二个快照");
  await page.getByRole("button", { name: "保存表单快照" }).click();
  await page.getByRole("button", { name: "选择上一快照" }).click();
  await page.getByRole("button", { name: "恢复所选快照" }).click();
  await expect(page.getByLabel("表单标题")).toHaveValue("初始标题");
});

test("advanced request retries and field subscriptions are interactive", async ({
  page,
}) => {
  await page.goto("#/hooks/useRequest");
  await page.getByRole("button", { name: "运行高级请求" }).click();
  await expect(page.locator(".demo-content output")).toContainText(
    "第 3 次尝试成功",
  );
  await expect(page.locator(".demo-content output")).toContainText(
    "重试次数：2",
  );
  await page.goto("#/hooks/useFormField");
  const before = await page
    .getByLabel("订阅备注", { exact: false })
    .locator("..")
    .textContent();
  await page.getByLabel("订阅名称", { exact: false }).fill("新的名称");
  await expect(
    page.getByLabel("订阅备注", { exact: false }).locator(".."),
  ).toHaveText(before!);
});

test("table restores URL and column preferences after reload", async ({
  page,
}) => {
  await page.goto("#/hooks/useTable");
  await page.getByRole("button", { name: "预设：React", exact: true }).click();
  await expect(page.getByLabel("文章搜索")).toHaveValue("React");
  await page.getByLabel("显示分类列").uncheck();
  await expect(
    page
      .locator(".demo-content")
      .getByRole("columnheader", { name: "分类", exact: true }),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(
            new URLSearchParams(location.search).get("articles") ?? "{}",
          ).filters?.keyword,
      ),
    )
    .toBe("React");
  await page.reload();
  await expect(page.getByLabel("文章搜索")).toHaveValue("React");
  await expect(page.getByLabel("显示分类列")).not.toBeChecked();
});

test("sortable supports keyboard commit, cancel and native drag", async ({
  page,
}) => {
  await page.goto("#/hooks/useSortable");
  const items = page.locator(".sortable-demo li");
  const first = page.getByRole("listitem", { name: "需求分析", exact: true });
  await first.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(items.nth(1)).toContainText("需求分析");
  await first.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("End");
  await page.keyboard.press("Escape");
  await expect(items.nth(1)).toContainText("需求分析");
  await page
    .getByRole("listitem", { name: "开发实现", exact: true })
    .dragTo(page.getByRole("listitem", { name: "交互设计", exact: true }));
  await expect(items.first()).toContainText("开发实现");
});

test("dynamic list preserves anchor when adding earlier messages", async ({
  page,
}) => {
  await page.goto("#/hooks/useVirtualList");
  const list = page.getByRole("list", { name: "动态消息列表" });
  await expect(
    list.getByRole("listitem").filter({ hasText: /消息 0：/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "加载更早消息" }),
  ).toBeEnabled();
  const anchor = list.getByRole("listitem").filter({ hasText: /^消息 0：/ });
  await expect(
    page.getByText(/当前 30 条消息/, { exact: false }),
  ).toBeVisible();
  const before = await anchor.boundingBox();
  const containerBefore = await list.boundingBox();
  await page.getByRole("button", { name: "加载更早消息" }).click();
  await expect(
    page.getByText(/当前 40 条消息/, { exact: false }),
  ).toBeVisible();
  const after = await anchor.boundingBox();
  const containerAfter = await list.boundingBox();
  expect(
    Math.abs(after!.y - containerAfter!.y - (before!.y - containerBefore!.y)),
  ).toBeLessThan(2);
});

test("API reference separates configuration, result types and methods at desktop and mobile sizes", async ({
  page,
}) => {
  const row = (name: string, section = "#api") =>
    page
      .locator(section)
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader", { name, exact: true }) });
  for (const width of [1280, 894, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("#/hooks/useRequest");
    const retry = row("retry");
    await expect(retry).toContainText("0");
    await expect(row("defaultParams")).toContainText("undefined");
    await expect(row("runAsync", "#api-methods")).toContainText("Promise<T>");
    await expect(row("loading", "#api-returns")).toContainText("boolean");
    await page
      .getByRole("button", { name: "options · 重试与超时", exact: true })
      .click();
    await expect(retry).toBeInViewport();
    if (width === 390) {
      await expect(retry).toHaveCSS("display", "block");
      const nameBox = await row("retryDelay")
        .getByRole("rowheader")
        .boundingBox();
      expect(nameBox!.width).toBeGreaterThan(250);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
  await page.goto("#/hooks/useForm");
  await expect(row("setFieldTouched", "#api-methods")).toContainText("boolean");
  await expect(row("setFieldError", "#api-methods")).toContainText("undefined");
  await expect(row("control", "#api-returns")).toContainText("FormControl<T>");
});

const checkboxDemos = readdirSync(join(process.cwd(), "website/demos"))
  .filter(
    (file) =>
      file.endsWith(".tsx") &&
      /type="checkbox"/.test(
        readFileSync(join(process.cwd(), "website/demos", file), "utf8"),
      ),
  )
  .map((file) => file.replace(".tsx", ""));

test("every checkbox demo keeps labels aligned and supports label clicks and keyboard toggles", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const width of [894, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.goto("");
      // Use the actual theme control so this check is independent of storage naming.
      const toggle = page.getByRole("button", {
        name: theme === "dark" ? "切换深色主题" : "切换浅色主题",
      });
      if (await toggle.count()) await toggle.click();
      for (const name of checkboxDemos) {
        await page.goto(`#/hooks/${name}`);
        if (name === "useTable")
          await expect(
            page.getByRole("checkbox", { name: "选择文章 1", exact: true }),
          ).toBeVisible();
        const checkboxes = page.locator('.demo-content input[type="checkbox"]');
        await expect(checkboxes.first()).toBeVisible();
        const count = await checkboxes.count();
        for (let i = 0; i < count; i++) {
          const checkbox = checkboxes.nth(i);
          const label = checkbox.locator("xpath=ancestor::label[1]");
          const before = await checkbox.isChecked();
          const box = await checkbox.boundingBox();
          expect(box?.width, `${name} checkbox width`).toBe(16);
          expect(box?.height, `${name} checkbox height`).toBe(16);
          if (await label.count()) {
            await expect(label).toHaveCSS("flex-direction", "row");
            await expect(label).toHaveCSS("align-items", "center");
            // Click the text end of the label, outside the checkbox itself.
            const bounds = await label.boundingBox();
            await label.click({
              position: { x: bounds!.width - 2, y: bounds!.height / 2 },
            });
          } else {
            await expect(checkbox).toHaveAttribute("aria-label", /.+/);
            await checkbox.click();
          }
          await expect(checkbox).toBeChecked({ checked: !before });
          await page.keyboard.press("Tab");
          await checkbox.focus();
          await expect(checkbox).toBeFocused();
          await expect(checkbox).toHaveCSS("outline-style", "solid");
          await checkbox.press("Space");
          await expect(checkbox).toBeChecked({ checked: before });
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      }
    }
  }
});
