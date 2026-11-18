import { expect, test } from "@playwright/test";
import { catalog } from "../../website/catalog";
import { useCases } from "../../website/useCases";
import { returnKinds } from "../../website/api/returnStructure";

for (const hook of catalog) {
  test(`${hook.name}: usage, return shape and independent interactive scenarios`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("dialog", (dialog) => void dialog.dismiss());
    await page.goto(`#/hooks/${hook.name}`);
    await expect(page.locator("#usage")).toContainText(
      useCases[hook.name].overview,
    );
    await expect(page.locator(".demo-scenario")).toHaveCount(
      useCases[hook.name].scenarios.length,
    );
    await expect(page.locator("#api-result")).toBeAttached();
    const kind = returnKinds[hook.name];
    if (kind === "object") {
      await expect(page.locator("#api-result")).toContainText(
        hook.name === "useLatest" ? "ref 对象" : "返回一个对象",
      );
      await expect(page.locator("#api-result #api-returns")).toBeAttached();
    } else if (kind === "tuple") {
      await expect(page.locator("#api-result")).toContainText("只读元组");
      await expect(page.locator("#api-methods")).toHaveCount(0);
    } else if (kind === "void") {
      await expect(page.locator("#api-result")).toContainText("没有返回值");
    } else {
      await expect(page.locator("#api-result")).toContainText("不是");
    }
    await page.locator(".return-structure summary").click();
    await expect(page.locator(".return-structure code")).toContainText(
      `type ${hook.name[0].toUpperCase()}${hook.name.slice(1)}Result`,
    );
    for (const scenario of useCases[hook.name].scenarios) {
      const panel = page.getByRole("region", {
        name: scenario.title,
        exact: true,
      });
      await panel
        .getByRole("button", { name: "展开演示", exact: true })
        .click();
      await expect(
        panel.getByRole("button", { name: "收起演示", exact: true }),
      ).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toContainText(scenario.description);
      const contentBox = await page.locator(".demo-content").boundingBox();
      const panelBox = await panel.boundingBox();
      expect(panelBox!.width).toBeGreaterThan(contentBox!.width * 0.75);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(390);
      const firstAction = panel
        .locator(
          ".demo-stack > button:enabled, .demo-stack > .demo-row > button:enabled, .demo-stack > form > button:enabled",
        )
        .first();
      if (await firstAction.count()) await firstAction.click();
      await expect(page.locator(".demo-content")).not.toContainText(
        "示例暂时无法运行",
      );
      await panel
        .getByRole("button", { name: "重新开始此演示", exact: true })
        .click();
      await panel
        .getByRole("button", { name: "收起演示", exact: true })
        .click();
      await expect(
        panel.getByRole("button", { name: "重新开始此演示", exact: true }),
      ).toHaveCount(0);
    }
    await page.locator(".additional-source-details summary").click();
    await expect(page.locator(".additional-source-details code")).toContainText(
      hook.name,
    );
    await expect(page.locator(".additional-source-details code")).toContainText(
      "@leonwgc/react-hooks",
    );
    expect(errors).toEqual([]);
  });
}

test("new scenarios show real state, requests, queue outcomes and form errors", async ({
  page,
}) => {
  const open = async (hook: string, title: string) => {
    await page.goto(`#/hooks/${hook}`);
    const panel = page.getByRole("region", { name: title, exact: true });
    await panel.getByRole("button", { name: "展开演示" }).click();
    return panel;
  };
  let panel = await open("useToggle", "对象预设与自定义值");
  await panel.getByRole("button", { name: "设置自定义预设" }).click();
  await expect(panel.locator("output")).toContainText("自定义 · 2 列");
  await panel.getByRole("button", { name: "切换预设" }).click();
  await expect(panel.locator("output")).toContainText("简洁 · 1 列");
  await panel.getByRole("button", { name: "切换预设" }).click();
  await panel.getByRole("button", { name: "重新开始此演示" }).click();
  await expect(panel.locator("output")).toContainText("简洁 · 1 列");
  panel = await open("useSelection", "切换查询时重置");
  await panel.getByRole("button", { name: "切换选择 A" }).click();
  await expect(panel.locator("output")).toContainText("已选 A");
  await panel.getByRole("button", { name: "切换查询范围" }).click();
  await expect(panel.locator("output")).toContainText("已选 无");
  panel = await open("useRequest", "竞争请求与本地修改");
  await panel.getByRole("button", { name: "发送慢请求" }).click();
  await panel.getByRole("button", { name: "发送快请求" }).click();
  await expect(panel.locator("output")).toHaveText("较快新结果");
  await panel.getByRole("button", { name: "本地更新结果" }).click();
  await expect(panel.locator("output")).toHaveText("本地修订结果");
  panel = await open("useInfiniteScroll", "字符串游标与手动加载");
  await panel.getByRole("button", { name: "加载字符串游标下一页" }).click();
  await expect(panel.locator("output")).toContainText("第一页内容");
  await panel.getByRole("button", { name: "加载字符串游标下一页" }).click();
  await expect(panel.locator("output")).toContainText("第二页内容 · 已到末尾");
  panel = await open("useAsyncQueue", "单任务失败不阻断后续");
  await panel.getByRole("button", { name: "加入失败和成功任务" }).click();
  await expect(panel.locator("li").first()).toContainText("error");
  await expect(panel.locator("li").last()).toContainText("success 成功结果");
  panel = await open("useUpload", "上传前校验与批量加入");
  await panel.getByRole("button", { name: "加入大小不同的示例文件" }).click();
  await expect(panel.locator("output")).toContainText("接受 1 / 2");
  await expect(panel.locator("li")).toContainText("small.txt：success");
  panel = await open("useForm", "嵌套字段与局部校验");
  await panel.getByRole("button", { name: "只校验邮箱" }).click();
  await expect(panel.locator("output")).toContainText("请输入有效邮箱");
  await panel.getByRole("button", { name: "载入已有资料" }).click();
  await expect(panel.getByLabel("嵌套邮箱")).toHaveValue("demo@example.com");
  panel = await open("useEventSource", "自定义事件与 JSON 解析");
  await expect(panel.locator("output")).toContainText("open");
  await panel.getByRole("button", { name: "发送错误 JSON" }).click();
  await expect(panel.getByRole("alert")).toBeVisible();
  await panel.getByRole("button", { name: "发送有效通知" }).click();
  await expect(panel.locator("output")).toContainText("新通知");
  await expect(panel.getByRole("alert")).toHaveCount(0);
});

test("scenario cards fit mobile and support keyboard expansion in both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const theme of ["light", "dark"]) {
    await page.goto("#/hooks/useRafLoop");
    const toggle = page.getByRole("button", {
      name: theme === "dark" ? "切换深色主题" : "切换浅色主题",
    });
    if (await toggle.count()) await toggle.click();
    const panel = page.getByRole("region", { name: "基于 delta 的速度控制" });
    const trigger = panel.getByRole("button", { name: "展开演示" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await panel.getByRole("button", { name: "开始按速度推进" }).click();
    await expect(panel.locator("output")).toContainText("运行中");
    await panel.getByRole("button", { name: "停止推进" }).click();
    await expect(panel.locator("output")).toContainText("已停止");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
    await panel.getByRole("button", { name: "收起演示" }).click();
  }
});
