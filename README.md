# Web Hooks

面向各类 Web 站点的 **68 个 React Hooks**，覆盖状态管理、浏览器交互、请求与列表、动画和表单。独立使用、自由组合，不绑定 UI 组件库。

[文档与在线演示](https://leonwgc.github.io/react-hooks/) · [全部源码](https://github.com/leonwgc/react-hooks/tree/master/src) · [反馈问题](https://github.com/leonwgc/react-hooks/issues)

> **AI 开发说明：本项目由 AI（OpenAI Codex）在开发者指导下设计、编写代码和文档，并执行自动化验证。功能范围与关键设计决策由开发者确认。** 欢迎通过 Issue 和 Pull Request 提出改进；使用前请结合自身业务阅读行为说明和边界约定。

## 特性

- **React 18 / 19**，TypeScript 严格模式、类型声明、ESM / CommonJS、tree-shaking。
- **零第三方运行时依赖**，React 通过 peer dependency 由使用方提供。
- 浏览器 API 挂载后访问，支持 SSR 安全导入与 hydration。
- 请求取消、竞态隔离、轮询；搜索、分页、排序与跨页选择。
- 原生 Web Animations API、逐帧循环和减少动态效果偏好。
- 表单字段、嵌套路径、声明式规则、可中止的字段级异步校验、Schema 适配、按字段订阅渲染、草稿持久化与动态字段数组。
- 中文文档、68 个基础演示与 176 组补充交互场景、示例源码与完整列表编辑场景。
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
npm install /path/to/leonwgc-react-hooks-0.5.0.tgz
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

| 分类               | Hooks                                                                                                                                                                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 数据与列表（9）    | `useInfiniteScroll`、`useVirtualList`、`useUpload`、`useRequest`、`usePagination`、`useSearch`、`useTable`、`useSelection`、`useQuery`                                                                                                                                        |
| 状态管理（7）      | `useUndoRedo`、`useBoolean`、`useToggle`、`useSetState`、`useControllableState`、`useLatest`、`useMemoizedFn`                                                                                                                                                                 |
| 应用交互（6）      | `useLeaveConfirm`、`useDisclosure`、`useEditor`、`useAsyncAction`、`useDirty`、`usePermission`                                                                                                                                                                                |
| 副作用与性能（5）  | `useAsyncQueue`、`useDebounce`、`useDebounceFn`、`useThrottleFn`、`useInterval`                                                                                                                                                                                               |
| 交互与存储（15）   | `useDrag`、`useDrop`、`useBroadcastChannel`、`useFocusWithin`、`useLongPress`、`useClickOutside`、`useKeyPress`、`useClipboard`、`useLocalStorageState`、`useSessionStorageState`、`useUrlState`、`useCountdown`、`useSortable`、`useObjectURL`、`useGesture`                 |
| 浏览器与视口（15） | `useFullscreen`、`useEventSource`、`useDownload`、`useImage`、`useTextSelection`、`useMutationObserver`、`useEventListener`、`useMediaQuery`、`useWindowSize`、`useElementSize`、`useIntersectionObserver`、`useScroll`、`useOnline`、`usePageVisibility`、`useDocumentTitle` |
| 动画（5）          | `useAnimate`、`useRafLoop`、`useReducedMotion`、`useSpring`、`useTransitionState`                                                                                                                                                                                             |
| 表单（6）          | `useForm`、`useFieldArray`、`useFormField`、`useWatch`、`useSteps`、`useTextareaAutoSize`                                                                                                                                                                                     |

每个 Hook 的 TypeScript 调用签名、泛型含义与约束、逐项配置与默认值、返回状态、方法签名、关联类型和行为边界均可在[文档站](https://leonwgc.github.io/react-hooks/)查看。参数类型列支持就地展开泛型说明，例如 `Cursor` 的推断方式、可选类型及分页结束标记。

每个 Hook 提供功能描述、使用场景、基础演示和至少两组独立交互场景。合计 176 组补充演示，可分别展开、收起和重新开始，每个示例正下方提供对应源码、高亮和复制，包含独立运行所需的辅助函数。返回值章节按真实的对象、元组、函数、单值或 `void` 组织，明确区分返回对象的属性和方法。覆盖列表见 [website/DEMO_COVERAGE.md](./website/DEMO_COVERAGE.md)。

## 重要约定

- **请求**：默认手动；自动请求传入 `manual: false` 和 `defaultParams`。`run` 通过状态呈现错误；`runAsync` / `refreshAsync` 需要处理 Promise 拒绝。旧请求会拒绝为 `AbortError`，不会覆盖新结果。服务函数应使用 `signal` 来中止实际网络任务。
- **列表**：页码从 1 开始；提交搜索、排序或修改 pageSize 回到第一页。响应由 `select` 映射为 `{ list, total }`。默认选中状态限当前页；跨页选择显式设置 `preserve`，查询条件通过 `resetKey` 关联清空。
- **表单**：默认提交校验，首次提交后变化重验；失焦/输入校验只针对触发字段。每个字段的异步校验独立运行，并通过 `signal` 中止过期任务。嵌套路径使用点号，数组项规则可用 `rows.*.name` 通配。`initialValues` 后续变化不自动回填；同步外部数据用 `values`（可 `keepDirtyValues`），异步加载用 `loadValues`。数组增删排序使用 `useFieldArray`，以 `field.id` 为 key。数字输入建议 `valueAsNumber`（空值为 `undefined`），否则空值为 `NaN`。组件只订阅读取过的表单状态，字段可交给 `useFormField` / `useWatch` 渲染以避免整表重渲染。
- **存储**：只保存 JSON 可序列化值，解析或写入失败通过 `error` 呈现。默认比较器处理普通对象、数组、Date 和基本类型，不处理循环引用；复杂对象需自定义比较器。
- **URL**：`useUrlState` 管理浏览器查询参数，保留 hash 和 history.state；其他路由器应使用其官方适配能力。不要把敏感信息写入 URL。
- **SSR**：浏览器数据挂载后更新；尺寸初始为 0，存储初始为默认值。Next.js 中在客户端组件调用。Strict Mode 可能重复触发自动请求，第一轮会取消；写操作应由明确的用户动作触发。
- **动画**：`useAnimate` 默认遵循系统减少动态效果偏好；`useRafLoop` 需要调用方自行结合该偏好。useSpring 提供数值弹簧，useTransitionState 管理进入/退出时序；不提供复杂时间线或布局动画。
- **职责**：权限 Hook 只控制 UI，接口权限由服务端验证。弹窗 Hook 不代替焦点管理；字段 Hook 不代替业务校验。useRequest 管理实例内请求；useQuery 通过显式 store 提供跨组件缓存，不包含自动乐观回滚。

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
  catalog.ts            # 文档目录与行为边界
  api/                  # 68 个 Hooks 的逐字段 API 文档及返回结构
  examples/             # 176 个独立 TSX 示例模块、场景编排与对应源码
  useCases.ts           # 每个 Hook 的功能描述与使用场景
  DEMO_COVERAGE.md       # 演示场景覆盖清单
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

## 第四阶段（v0.4.0）

新增 8 个 Hooks，总数达到 67：

- `useQuery` + `createQueryStore`：共享缓存、同键请求去重、失效刷新与取消；store 应保持稳定，服务端按请求隔离。
- `useSteps`：分步导航、同步/异步前进校验、取消与完成记录。
- `useDocumentTitle`、`useObjectURL`、`useTextareaAutoSize`：标题恢复、本地预览 URL 回收、文本域自增高。
- `useSpring`、`useTransitionState`、`useGesture`：数值弹簧、延迟卸载、单指针拖动与滑动。

每个新增 Hook 都包含完整 TypeScript API、使用场景、基础示例和两组补充演示。查询演示使用本地模拟服务；过渡 Hook 只管理时序，CSS 动画由调用方提供；手势操作提供按钮作为键盘等价入口。

## 第五阶段（v0.5.0）

增强既有 8 个 Hooks，保持总数 67；新增配置默认保持原有调用方式。每个增强 Hook 新增两组交互演示，站点现有 67 个基础演示和 150 组补充场景，全部按纵向独立示例展示。

| Hook               | 增强能力                                                           |
| ------------------ | ------------------------------------------------------------------ |
| useRequest         | ready、refreshDeps、loadingDelay、fetching、onBefore/onFinally     |
| useQuery           | 结构化查询键、前缀失效、select/isEqual、选择订阅、keepPreviousData |
| useForm            | resetField、unregister、卸载保留策略、错误聚焦与原生 ref 绑定      |
| useFieldArray      | insert/prepend/swap/update，错误与 touched 随记录移动              |
| useSelection       | Shift 范围选择、禁用项、跨页选择数量上限                           |
| useAsyncQueue      | 优先级、容量、失败重试、超时终止与真实并发槽保护                   |
| useUndoRedo        | 输入分组合并、历史标签、事务提交与回滚                             |
| useTransitionState | 四阶段回调、真实结束事件、属性/动画名过滤与超时兜底                |

注意：队列超时不会自动重试；尚未真正结束的底层任务继续占用并发槽。查询选择器不改变缓存原始类型。条件表单字段应声明为可选，并保留 register 的 ref。字段数组元数据现在随记录移动；需要清空时可显式 resetField 或 replace。

## 表单增强

`useForm` 改为按需订阅的外部 store，新增 `useWatch`，总数 68。现有调用方式保持兼容。

| 方向         | 能力                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 性能         | 组件只在读取过的状态变化时重渲染；`useFormField` / `useWatch` / `useFieldArray` 按路径订阅；`dirtyFields` 增量计算               |
| 校验         | 字段级异步校验与 `signal` 中止、`validatingFields`、`rows.*.name` 通配、`register` 声明式规则、数组级规则、`criteriaMode: "all"` |
| 错误         | `errorDetails`（`type` / `message` / `types`）、`setErrors` 批量回填服务端错误                                                   |
| 值与生命周期 | `values` + `keepDirtyValues`、`loadValues` / `isLoading` / `reloadValues`、`valueAsNumber` / `setValueAs`、`setFieldValue` 选项  |
| 提交         | `submitCount`、`isSubmitSuccessful`、`handleSubmit(onValid, onInvalid)` 与 `transform`                                           |
| 可访问性     | `register` 生成 `id`、`aria-describedby`、`aria-errormessage`、`aria-required`；`getErrorProps`                                  |
| 生态         | `standardSchema`（Zod / Valibot / ArkType）与 `yupSchema` 适配器；`useFieldArray` 的 `getKey`；`persist` 草稿持久化              |

注意：`register` 现在会输出 `id`，同一路径注册多个非选项控件时请自行传入不同 `id`。每个字段的异步结果只会被该字段自身、其祖先/子路径或 `dependencies` 中声明的源字段变化作废；跨字段依赖请在 `dependencies` 中声明。

## 参考与许可证

参考 [ahooks](https://github.com/alibaba/hooks) 与 [react-use](https://github.com/streamich/react-use) 的常用能力及 API 设计经验，采用自主实现；两者不作为运行时依赖。

[MIT](./LICENSE) © 2026 leonwgc
