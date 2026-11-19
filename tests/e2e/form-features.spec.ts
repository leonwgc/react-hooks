import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, hook: string, title: string) {
  await page.goto(`#/hooks/${hook}`);
  const region = page.getByRole("region", { name: title, exact: true });
  await region.getByRole("button", { name: "展开演示", exact: true }).click();
  return region.locator(".demo-stack");
}
const count = async (text: string | null) =>
  Number(/(\d+) 次/.exec(text ?? "")?.[1]);

test("useWatch renders conditionally without re-rendering on unrelated fields", async ({
  page,
}) => {
  const panel = await open(page, "useWatch", "条件显示与渲染计数");
  const renders = panel.locator("output");
  await expect(panel.getByLabel("收货地址")).toHaveCount(0);
  await panel.getByRole("button", { name: "切换为快递配送" }).click();
  await expect(panel.getByLabel("收货地址")).toBeVisible();
  const before = await count(await renders.textContent());
  await panel.getByLabel(/备注/).fill("放门口");
  await expect(renders).toHaveText(`条件区域渲染 ${before} 次`);
});

test("useWatch previews the whole form while the root stays still", async ({
  page,
}) => {
  const panel = await open(page, "useWatch", "订阅整个表单生成预览");
  const root = panel.locator("output");
  const before = await count(await root.textContent());
  await panel.getByLabel("收件人").fill("Ada");
  await panel.getByRole("button", { name: "添加礼品包装" }).click();
  await expect(panel.locator("pre")).toContainText("收件人：Ada");
  await expect(panel.locator("pre")).toContainText("礼品包装：是");
  await expect(root).toHaveText(`表单根组件渲染 ${before} 次`);
});

test("declarative rules list every failure and wire aria-describedby", async ({
  page,
}) => {
  const panel = await open(page, "useForm", "声明式规则与无障碍错误");
  await panel.getByLabel(/用户名/).fill("A!");
  await panel.getByRole("button", { name: "提交并显示全部规则错误" }).click();
  const input = panel.getByLabel(/用户名/);
  await expect(input).toHaveAttribute("aria-invalid", "true");
  const describedBy = await input.getAttribute("aria-describedby");
  const message = panel.locator(`[id="${describedBy}"]`);
  await expect(message).toHaveText("至少 3 位；只能包含小写字母和数字");
  await expect(panel.getByText("不能小于 18")).toBeVisible();
  await panel.getByLabel(/个人主页/).fill("http://a.com");
  await panel.getByRole("button", { name: "提交并显示全部规则错误" }).click();
  await expect(panel.getByText("请使用 https 链接")).toBeVisible();
});

test("async validation aborts outdated checks and shows per-field loading", async ({
  page,
}) => {
  const panel = await open(page, "useForm", "异步查重的中止与字段级 loading");
  const username = panel.getByLabel("用户名（试试 admin、root）");
  await username.pressSequentially("adm", { delay: 50 });
  await expect(panel.getByText("查重中…")).toBeVisible();
  await username.pressSequentially("in", { delay: 50 });
  await panel.getByLabel(/邮箱/).fill("bad");
  await expect(panel.getByText("校验中…")).toBeVisible();
  await expect(panel.getByText("用户名已被占用")).toBeVisible({
    timeout: 5000,
  });
  await expect(panel.getByText("邮箱格式不正确")).toBeVisible();
  await expect(panel.locator("output")).toContainText("已中止");
});

test("loadValues loads, tracks dirty fields and reloads", async ({ page }) => {
  const panel = await open(page, "useForm", "异步加载编辑数据");
  await expect(panel.getByText("加载中…")).toBeVisible();
  const nickname = panel.getByLabel("昵称");
  await expect(nickname).toHaveValue(/服务端昵称 v\d+/);
  await panel.getByLabel("简介").fill("我的简介");
  await expect(panel.locator("output")).toHaveText(
    "isDirty：true · 已修改：bio",
  );
  const loaded = await nickname.inputValue();
  await panel.getByRole("button", { name: "重新加载服务端数据" }).click();
  await expect(nickname).not.toHaveValue(loaded);
  await expect(panel.locator("output")).toHaveText(
    "isDirty：false · 已修改：无",
  );
});

test("external values refresh keeps the user's edits", async ({ page }) => {
  const panel = await open(page, "useForm", "外部数据刷新保留用户修改");
  await panel.getByLabel(/标题/).fill("我的标题");
  await panel.getByRole("button", { name: "模拟服务端推送新数据" }).click();
  await expect(panel.getByLabel(/标题/)).toHaveValue("我的标题");
  await expect(panel.getByLabel("状态")).toHaveValue("已审核");
  await expect(panel.locator("output")).toContainText(
    "服务端：周报 v2 / 已审核",
  );
  await expect(panel.locator("output")).toContainText("本地已修改：title");
});

test("submit transform, onInvalid and server errors", async ({ page }) => {
  const panel = await open(page, "useForm", "提交转换、失败回调与服务端错误");
  await panel.getByRole("button", { name: "提交" }).click();
  await expect(panel.locator("p")).toHaveText("校验失败：email");
  await panel.getByLabel(/邮箱/).fill("taken@example.com");
  await panel.getByRole("button", { name: "提交" }).click();
  await expect(panel.getByText("该邮箱已注册（服务端返回）")).toBeVisible();
  await expect(panel.locator("output")).toHaveText(
    "submitCount：2 · isSubmitSuccessful：false",
  );
  await panel.getByLabel(/邮箱/).fill("  Ada@Example.com ");
  await panel.getByLabel(/标签/).fill("a, b,,c");
  await panel.getByRole("button", { name: "提交" }).click();
  await expect(panel.locator("p")).toHaveText(
    '提交成功：{"email":"ada@example.com","tags":["a","b","c"]}',
  );
  await expect(panel.locator("output")).toHaveText(
    "submitCount：3 · isSubmitSuccessful：true",
  );
});

test("persisted drafts restore after reopening, excluding secrets", async ({
  page,
}) => {
  const panel = await open(page, "useForm", "草稿自动保存与恢复");
  await panel.getByLabel("标题").fill("未发布的文章");
  await panel.getByLabel(/发布密码/).fill("secret");
  await page.waitForTimeout(400);
  await panel.getByRole("button", { name: /关闭编辑器/ }).click();
  await panel.getByRole("button", { name: "重新打开编辑器" }).click();
  await expect(panel.getByLabel("标题")).toHaveValue("未发布的文章");
  await expect(panel.getByLabel(/发布密码/)).toHaveValue("");
  await panel.getByRole("button", { name: /发布/ }).click();
  await panel.getByRole("button", { name: /关闭编辑器/ }).click();
  await panel.getByRole("button", { name: "重新打开编辑器" }).click();
  await expect(panel.getByLabel("标题")).toHaveValue("");
});

test("standard schema errors are scoped to the blurred field", async ({
  page,
}) => {
  const panel = await open(page, "useForm", "Standard Schema 适配");
  await panel.getByLabel("邮箱").focus();
  await panel.getByLabel("密码", { exact: true }).focus();
  await expect(panel.locator("output")).toHaveText(
    '失焦只采纳当前字段的 schema 错误：{"email":"邮箱格式不正确"}',
  );
  await panel.getByRole("button", { name: "提交整表校验" }).click();
  await expect(
    panel.locator("small", { hasText: "密码至少 8 位" }),
  ).toBeVisible();
});

test("field-level subscriptions keep the form root still", async ({ page }) => {
  const panel = await open(page, "useForm", "按字段渲染与程序化赋值");
  const root = panel.locator("small");
  const before = await count(await root.textContent());
  await panel.getByLabel(/^名/).fill("小明");
  await expect(panel.locator("output")).toHaveText("预览：小明");
  await expect(root).toContainText(`渲染 ${before} 次`);
  await panel.getByRole("button", { name: /程序化填入姓氏/ }).click();
  await expect(panel.locator("output")).toHaveText("预览：王小明");
  await expect(panel.getByText(/^姓（渲染/)).not.toContainText("已修改");
  await expect(panel.getByText(/^名（渲染/)).toContainText("已修改");
});

test("field array wildcard validators, array rules and record keys", async ({
  page,
}) => {
  const panel = await open(
    page,
    "useFieldArray",
    "通配校验、数组规则与记录 key",
  );
  await panel.getByRole("button", { name: "校验全部成员" }).click();
  await expect(panel.getByText("请填写姓名")).toHaveCount(1);
  await expect(panel.getByText("邮箱格式不正确")).toHaveCount(1);
  await panel.getByRole("button", { name: "删除" }).nth(1).click();
  await panel.getByRole("button", { name: "校验全部成员" }).click();
  await expect(panel.getByText("至少保留 2 名成员")).toBeVisible();
  await panel.getByRole("button", { name: "添加成员" }).click();
  await panel.getByRole("button", { name: /外部 setValues/ }).click();
  await expect(panel.locator("legend").first()).toContainText("key m3");
});
