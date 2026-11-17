# Web Hooks

面向各类 Web 站点的 **59 个 React Hooks**，覆盖状态管理、浏览器交互、请求与列表、动画和表单。独立使用、自由组合，不绑定 UI 组件库。

[文档与在线演示](https://leonwgc.github.io/react-hooks/) · [全部源码](https://github.com/leonwgc/react-hooks/tree/master/src) · [反馈问题](https://github.com/leonwgc/react-hooks/issues)

> **AI 开发说明：本项目由 AI（OpenAI Codex）在开发者指导下设计、编写代码和文档，并执行自动化验证。功能范围与关键设计决策由开发者确认。** 欢迎通过 Issue 和 Pull Request 提出改进；使用前请结合自身业务阅读行为说明和边界约定。

## 特性

- **React 18 / 19**，TypeScript 严格模式、类型声明、ESM / CommonJS、tree-shaking。
- **零第三方运行时依赖**，React 通过 peer dependency 由使用方提供。
- 浏览器 API 挂载后访问，支持 SSR 安全导入与 hydration。
- 请求取消、竞态隔离、轮询；搜索、分页、排序与跨页选择。
- 原生 Web Animations API、逐帧循环和减少动态效果偏好。
- 表单字段、嵌套路径、同步/异步/跨字段校验、动态字段数组。
- 中文文档、59 个可交互示例、示例源码与完整列表编辑场景。
- 单个 npm 项目，直接使用目录组织；**不使用 workspaces**。库与站点都由 **Vite 8+** 构建。

## 安装

当前尚未发布到 npm registry，可直接安装 GitHub 源码。安装时 `prepare` 会自动构建，需要 Node.js **22.12+**、npm 和 Git；消费项目需安装 React 18 或 19。TypeScript 使用方建议 5.4+。

```bash
npm install git+https://github.com/leonwgc/react-hooks.git
```

也可本地打包后安装：

```bash
git clone https://github.com/leonwgc/react-hooks.git
cd react-hooks
npm install
npm pack
# 在消费项目中运行，替换为真实路径
npm install /path/to/leonwgc-react-hooks-0.3.0.tgz
```

## 使用

```tsx
import { useBoolean, useRequest } from "@leonwgc/react-hooks";

type Article = { id: number; title: string };

export function Articles() {
  const details = useBoolean(false);
  const articles = useRequest<Article[], []>(async ({ signal }) => {
    const response = await fetch("/api/articles", { signal });
    if (!response.ok) throw new Error("文章加载失败");
    return response.json();
  });

  return (
    <section>
      <button onClick={() => articles.run()} disabled={articles.loading}>
        {articles.loading ? "加载中…" : "加载文章"}
      </button>
      {articles.error ? <p role="alert">加载失败，请重试</p> : null}
      <button onClick={details.toggle}>切换详情</button>
      {details.value &&
        articles.data?.map((article) => (
          <p key={article.id}>{article.title}</p>
        ))}
    </section>
  );
}
```

```tsx
import { useForm } from "@leonwgc/react-hooks";

export function LoginForm() {
  const form = useForm({
    initialValues: { email: "" },
    validators: {
      email: (value) => (value.includes("@") ? undefined : "请输入有效邮箱"),
    },
  });
  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        // 调用你的 API，异常将存入 form.submitError。
        await saveEmail(values.email);
      })}
    >
      <label>
        邮箱
        <input {...form.register("email")} />
      </label>
      <p role="alert">{form.errors.email}</p>
      {form.submitError ? <p role="alert">保存失败，请重试</p> : null}
      <button disabled={form.isSubmitting}>保存</button>
    </form>
  );
}
// 示例接口，请替换为项目中的实际保存函数。
async function saveEmail(email: string) {
  void email;
}
```

## Hooks 清单

| 分类              | Hooks                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 状态管理（6）     | `useBoolean`、`useToggle`、`useSetState`、`useControllableState`、`useLatest`、`useMemoizedFn`                                                   |
| 副作用与性能（4） | `useDebounce`、`useDebounceFn`、`useThrottleFn`、`useInterval`                                                                                   |
| 浏览器与视口（8） | `useEventListener`、`useMediaQuery`、`useWindowSize`、`useElementSize`、`useIntersectionObserver`、`useScroll`、`useOnline`、`usePageVisibility` |
| 交互与存储（7）   | `useClickOutside`、`useKeyPress`、`useClipboard`、`useLocalStorageState`、`useSessionStorageState`、`useUrlState`、`useCountdown`                |
| 数据与列表（5）   | `useRequest`、`usePagination`、`useSearch`、`useTable`、`useSelection`                                                                           |
| 应用交互（5）     | `useDisclosure`、`useEditor`、`useAsyncAction`、`useDirty`、`usePermission`                                                                      |
| 动画（3）         | `useAnimate`、`useRafLoop`、`useReducedMotion`                                                                                                   |
| 表单（2）         | `useForm`、`useFieldArray`                                                                                                                       |

每个 Hook 的参数、返回值、交互演示与行为边界均可在[文档站](https://leonwgc.github.io/react-hooks/)查看。

## 重要约定

- **请求**：默认手动；自动请求传入 `manual: false` 和 `defaultParams`。`run` 通过状态呈现错误；`runAsync` / `refreshAsync` 需要处理 Promise 拒绝。旧请求会拒绝为 `AbortError`，不会覆盖新结果。服务函数应使用 `signal` 来中止实际网络任务。
- **列表**：页码从 1 开始；提交搜索、排序或修改 pageSize 回到第一页。响应由 `select` 映射为 `{ list, total }`。默认选中状态限当前页；跨页选择显式设置 `preserve`，查询条件通过 `resetKey` 关联清空。
- **表单**：默认提交校验，首次提交后变化重验；异步校验有竞态保护。嵌套路径使用点号。`initialValues` 后续变化不自动回填，使用 `reset(record)`。数组增删排序使用 `useFieldArray`，以 `field.id` 为 key。字段结构改变会清除对应数组的校验元数据。数字输入空值为 `NaN`，需用 `Number.isFinite` 验证。
- **存储**：只保存 JSON 可序列化值，解析或写入失败通过 `error` 呈现。默认比较器处理普通对象、数组、Date 和基本类型，不处理循环引用；复杂对象需自定义比较器。
- **URL**：`useUrlState` 管理浏览器查询参数，保留 hash 和 history.state；其他路由器应使用其官方适配能力。不要把敏感信息写入 URL。
- **SSR**：浏览器数据挂载后更新；尺寸初始为 0，存储初始为默认值。Next.js 中在客户端组件调用。Strict Mode 可能重复触发自动请求，第一轮会取消；写操作应由明确的用户动作触发。
- **动画**：`useAnimate` 默认遵循系统减少动态效果偏好；`useRafLoop` 需要调用方自行结合该偏好。首版不提供弹簧引擎、复杂时间线或布局动画。
- **职责**：权限 Hook 只控制 UI，接口权限由服务端验证。弹窗 Hook 不代替焦点管理；字段 Hook 不代替业务校验。请求层不包含跨组件缓存或乐观更新。

## 本地开发

```bash
npm install
npm run dev             # http://127.0.0.1:5173/react-hooks/
npm run typecheck       # 源码、示例和测试的类型检查
npm test                # Hooks 行为与 SSR 测试
npx playwright install chromium
npm run test:e2e        # 文档浏览器交互测试
npm run build           # dist/：ESM、CJS、类型声明、source maps
npm run docs:build      # docs/：提交到 master 的静态站点
npm run docs:preview    # 预览生产构建
npm run check           # 类型检查、单元测试、库构建、站点构建
npm run format          # 格式化
```

```text
src/                    # 按职责分组的 Hooks 与内部工具
website/                # 文档站源码
  content/              # MDX 使用指南
  demos/                # 每个 Hook 的独立可运行示例
  catalog.ts            # 文档目录、API 与边界说明
docs/                   # Vite 生成的 GitHub Pages 发布产物
tests/                  # 行为测试、SSR、类型约束及浏览器测试
.github/workflows/      # React 18/19 与文档站验证
vite.config.ts          # Vite 库模式
vite.docs.config.ts     # 文档站构建，base 为 /react-hooks/
package.json            # 唯一依赖与命令入口
package-lock.json       # npm 锁文件
```

## 验证与部署

GitHub Actions 对 React 18、19 分别运行类型与行为检查，构建库和文档站，并在 Chromium 中验证关键交互。每个阶段先在本地完成检查，再运行 `npm run docs:build`，将 `docs/` 产物与源码一起提交并推送到 `master`。分支发布由 GitHub Pages 独立触发，不等待验证工作流。Pull Request 不更新发布分支。

Pages 设置选择 **Deploy from a branch → master → /docs**。`website/` 保存可编辑源码，`docs/` 仅保存构建产物与 `.nojekyll`，请勿手动编辑构建产物。站点地址为 <https://leonwgc.github.io/react-hooks/>，使用 hash 路由，因此直接刷新 Hook 页面也能正常加载。更换仓库名时同步修改 `vite.docs.config.ts` 的 `base` 和本文链接。

文档源码高亮参考 Atelier UI 的 token 分类策略，采用本地轻量实现并支持明暗主题；来源与适配说明见 [website/SOURCE.md](./website/SOURCE.md)。

工作流不会发布 npm 包。需要发布时，应先审阅版本与产物，执行 `npm pack --dry-run`，再由有 scope 权限的维护者显式发布。

## 第二阶段

已选定无限滚动、虚拟列表、上传、撤销重做、离开提醒、SSE、拖放、全屏、跨标签页通信和下载，以及异步队列、图片加载、区域焦点、长按、文本选区和 DOM 观察，共 16 组能力、17 个 Hooks，**已在 v0.2.0 实现**。API 与交互演示见文档站，阶段范围见 [ROADMAP.md](./ROADMAP.md)。

第二阶段新增：`useInfiniteScroll`、`useVirtualList`、`useUpload`、`useUndoRedo`、`useLeaveConfirm`、`useEventSource`、`useDrag`、`useDrop`、`useFullscreen`、`useBroadcastChannel`、`useDownload`、`useAsyncQueue`、`useImage`、`useFocusWithin`、`useLongPress`、`useTextSelection`、`useMutationObserver`。

上传示例不会发送文件到外部服务，SSE 示例使用本地模拟事件源。真实项目通过传输适配器接入后端；`createXHRUploadTransport` 提供浏览器 XHR/FormData 实现。

## 第三阶段（v0.3.0）

- 请求：显式重试、指数退避、单次超时、聚焦/重连刷新和隐藏页面轮询控制。
- 表单：校验时机、异步防抖、字段依赖、schema 适配函数，以及新增 `useFormField` 字段订阅。
- 表格：URL 查询状态恢复、列顺序/显隐持久化和命名筛选预设。
- 虚拟列表：动态高度缓存、滚动锚点和双向加载组合。
- 快捷键：修饰键组合、作用域、优先级及事件独占。
- 新增 `useSortable`：原生拖放、键盘排序与可访问状态播报。

详见站点各 Hook 的参数、边界说明和可交互示例。

## 参考与许可证

参考 [ahooks](https://github.com/alibaba/hooks) 与 [react-use](https://github.com/streamich/react-use) 的常用能力及 API 设计经验，采用自主实现；两者不作为运行时依赖。

[MIT](./LICENSE) © 2026 leonwgc
