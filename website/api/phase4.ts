import { targetType, type ApiDoc } from "./types";
export const phase4Docs = {
  useQuery: {
    source: "src/data/query.ts",
    signature:
      "useQuery<T, Key extends QueryKey, Selected = T>(\n  store: QueryStore<T, Key>, key: Key | null, options?: QueryOptions<T, Selected>\n)",
    typeExample:
      'import { createQueryStore, useQuery, type QueryKey } from "@leonwgc/react-hooks";\ntype Page = { rows: { id: number; title: string }[]; total: number };\ntype ArticleKey = readonly ["articles", { page: number }];\nconst store = createQueryStore<Page, ArticleKey>(async ({ signal }, [, params]) => {\n  const response = await fetch(`/api/articles?page=${params.page}`, { signal });\n  if (!response.ok) throw new Error("查询失败");\n  return response.json();\n});\nfunction ArticleCount({ page }: { page: number }) {\n  const query = useQuery(store, ["articles", { page }], {\n    select: data => data.total, keepPreviousData: true,\n  }); // data: number | undefined\n  return <button onClick={() => store.invalidate(["articles"], { exact: false })}>\n    {query.isPreviousData ? "更新中：" : "共："}{query.data ?? 0}\n  </button>;\n}',
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "同一个 store 内每个查询结果的数据类型。",
      },
      {
        name: "Key",
        type: "QueryKey",
        defaultValue: "无默认类型",
        description:
          "字符串或 JSON 值组成的只读数组；对象键排序后比较，数组顺序有意义。createQueryStore 的 Key 默认 string，结构键请显式指定。",
      },
      {
        name: "Selected",
        type: "unknown",
        defaultValue: "T",
        description:
          "select 转换后的展示数据类型，从回调返回值推导；不会改变共享缓存中的原始 T。",
      },
    ],
    parameters: [
      {
        name: "store",
        type: "QueryStore<T, Key>",
        defaultValue: "必填",
        description:
          "由 createQueryStore(service, options?) 创建；保持引用稳定。",
      },
      {
        name: "key",
        type: "Key | null",
        defaultValue: "必填",
        description: "相同 store 和键共享结果；null 不订阅、不自动请求。",
      },
      {
        name: "options",
        type: "QueryOptions<T, Selected>",
        defaultValue: "{}",
        description:
          "enabled 默认 true；false 仍订阅缓存，但不自动获取或响应失效刷新。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "enabled",
            type: "boolean",
            defaultValue: "true",
            description:
              "false 仍订阅缓存，但不自动获取或响应失效刷新；手动 refetch 可用。",
          },
          {
            name: "select",
            type: "(data: T) => Selected",
            defaultValue: "undefined",
            description:
              "每个订阅者的数据转换；不修改共享缓存，纯函数且应避免抛错。",
          },
          {
            name: "isEqual",
            type: "(previous: Selected | undefined, next: Selected | undefined) => boolean",
            defaultValue: "Object.is",
            description:
              "比较选中数据，返回 true 保留旧快照引用；其他订阅字段仍独立比较。",
          },
          {
            name: "notifyOnChangeProps",
            type: "readonly (keyof QueryState<Selected>)[]",
            defaultValue: "全部状态字段",
            description:
              '仅这些字段变化才发布新快照；例如 ["data"] 隔离后台刷新状态。未订阅字段可能保持旧值，请勿依赖其及时更新。',
          },
          {
            name: "keepPreviousData",
            type: "boolean",
            defaultValue: "false",
            description:
              "同 store 切换键且新键暂无数据时保留上次已提交数据，通过 isPreviousData 区分；不跨 store 或 null 订阅传递。",
          },
        ],
      },
      {
        title: "createQueryStore 参数",
        rows: [
          {
            name: "service",
            type: "(context: { signal: AbortSignal }, key: Key) => Promise<T>",
            defaultValue: "必填",
            description: "键变化时对应不同缓存项，实际请求应透传 signal。",
          },
        ],
      },
      {
        title: "createQueryStore options",
        rows: [
          {
            name: "staleTime",
            type: "number",
            defaultValue: "30000",
            description:
              "新订阅在此毫秒内复用成功数据；到期本身不触发定时刷新；Infinity 表示不过期。",
          },
          {
            name: "cacheTime",
            type: "number",
            defaultValue: "300000",
            description:
              "无人订阅时保留缓存的毫秒数；到期取消请求并回收。Infinity 禁止自动回收。",
          },
        ],
      },
      {
        title: "store.invalidate(key?, options?)",
        rows: [
          {
            name: "key",
            type: "QueryKey",
            defaultValue: "undefined",
            description:
              "省略时失效所有已有键；结构键按值匹配，不需要同一对象引用。",
          },
          {
            name: "options.exact",
            type: "boolean",
            defaultValue: "true",
            description:
              'false 启用前缀匹配：数组按完整元素前缀匹配；字符串按单词边界匹配（"user" 匹配 "user"、"user:1"、"user/1" 和首元素为 "user" 的数组键，不匹配 "users"）；不做对象部分字段匹配。启用订阅者会重新请求。',
          },
        ],
      },
    ],
    returns: [
      {
        name: "data",
        type: "Selected | undefined",
        description:
          "当前订阅的 select 结果，或 keepPreviousData 保留的前键结果；共享缓存仍为 T。",
      },
      {
        name: "error",
        type: "unknown",
        description: "最近一次请求失败；新请求或 setData 清空。",
      },
      {
        name: "status",
        type: "'idle' | 'pending' | 'success' | 'error'",
        description: "当前缓存状态；刷新已有数据时状态不强制变为 pending。",
      },
      {
        name: "isFetching",
        type: "boolean",
        description: "当前键是否正在获取或刷新。",
      },
      {
        name: "updatedAt",
        type: "number",
        description: "最后成功写入时间戳（毫秒），初始为 0。",
      },
      {
        name: "isPreviousData",
        type: "boolean",
        description:
          "正在展示上一个键的数据时为 true；新键有数据、key 为 null 或更换 store 时为 false。",
      },
    ],
    methods: [
      {
        name: "refetch",
        type: "() => Promise<T>",
        description:
          "强制刷新；同键进行中的请求仍共享 Promise。失败需 catch，null 键时拒绝。",
      },
      {
        name: "invalidate",
        type: "() => void",
        description: "标记当前键过期并取消旧请求；存在启用的订阅者时立即重取。",
      },
      {
        name: "setData",
        type: "(value: T | ((previous: T | undefined) => T)) => void",
        description: "取消当前键请求并同步更新所有订阅者；不自动提交服务器。",
      },
      {
        name: "cancel",
        type: "() => void",
        description: "取消共享键的请求，保留已有数据；会影响同键的其他订阅者。",
      },
    ],
    types:
      "type QueryKeyPart = string | number | boolean | null\n  | readonly QueryKeyPart[] | { readonly [key: string]: QueryKeyPart };\ntype QueryKey = string | readonly QueryKeyPart[];\ninterface QueryOptions<T, Selected = T> {\n  enabled?: boolean;\n  select?: (data: T) => Selected;\n  isEqual?: (previous: Selected | undefined, next: Selected | undefined) => boolean;\n  notifyOnChangeProps?: readonly (keyof QueryState<Selected>)[];\n  keepPreviousData?: boolean;\n}\n\n// QueryStore、QueryState 和 createQueryStore 均从包入口导出。\ninterface QueryStore<T, Key extends QueryKey = string> {\n  fetch(key: Key, force?: boolean): Promise<T>;\n  invalidate(key?: QueryKey, options?: { exact?: boolean }): void; // 不传 key 时失效全部已有键\n  setData(key: Key, value: T | ((previous: T | undefined) => T)): void;\n  cancel(key: Key): void;\n  clear(): void; // 清空缓存，不主动重新请求\n  subscribe(key: Key, listener: () => void, enabled?: boolean): () => void;\n  getSnapshot(key: Key): QueryState<T>;\n  getServerSnapshot(): QueryState<T>;\n}\ninterface QueryState<T> {\n  data: T | undefined;\n  error: unknown;\n  status: 'idle' | 'pending' | 'success' | 'error';\n  isFetching: boolean;\n  updatedAt: number;\n}",
    notes: [
      "同键须代表同一组服务参数。createQueryStore 的 service 在创建时确定；不要让它捕获会变化但未编码进 key 的组件状态。",
      "卸载一个订阅者不会取消其他组件共用的请求；无人订阅后仍可完成并写缓存，最终按 cacheTime 回收。",
      "SSR 不会自动请求；每个服务端请求创建自己的 store，禁止把用户缓存放在共享服务端单例。本版不含持久化、脱水注水、焦点刷新或重试；这些能力不隐式继承 useRequest。",
      "结构键只接受有限数字、字符串、布尔、null、数组和普通对象；不接受 undefined、函数、Date、循环引用。不要修改已经交给 store 的键。",
      "select 仅影响订阅展示；refetch 仍返回 Promise<T>，setData 接收原始 T。keepPreviousData 不改写新键缓存，展示前键数据期间应禁用依赖新结果的分页操作。",
    ],
  },
  useSteps: {
    source: "src/form/steps.ts",
    signature: "useSteps(options: StepsOptions)",
    parameters: [
      {
        name: "options",
        type: "StepsOptions",
        defaultValue: "必填",
        description: "步骤流配置。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "count",
            type: "number",
            defaultValue: "必填",
            description: "总步数，有限值向下取整且最少为 1。",
          },
          {
            name: "initialStep",
            type: "number",
            defaultValue: "0",
            description: "从 0 开始的初始步骤；超出范围会截断。",
          },
          {
            name: "validate",
            type: "(context: { from: number; to: number; signal: AbortSignal }) => boolean | Promise<boolean>",
            defaultValue: "undefined",
            description:
              "只校验向前移动的当前步骤；true 才切换，false 保持原步骤，异常写入 error。跨步跳转不会逐步校验中间步骤。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "step",
        type: "number",
        description: "当前步骤索引。",
      },
      {
        name: "count",
        type: "number",
        description: "规范化后的总步数。",
      },
      {
        name: "completed",
        type: "number[]",
        description: "成功向前离开的步骤，去重并升序排列。",
      },
      {
        name: "isFirst",
        type: "boolean",
        description: "是否位于第一步。",
      },
      {
        name: "isLast",
        type: "boolean",
        description: "是否位于最后一步。",
      },
      {
        name: "validating",
        type: "boolean",
        description: "是否等待当前向前移动的校验。",
      },
      {
        name: "error",
        type: "unknown",
        description: "当前有效校验的异常；新操作或 reset 清空。",
      },
    ],
    methods: [
      {
        name: "goTo",
        type: "(target: number) => Promise<boolean>",
        description:
          "跳到目标步骤；成功移动返回 true，校验失败、原地操作或过期操作返回 false。",
      },
      {
        name: "next",
        type: "() => Promise<boolean>",
        description: "前进一步并按需校验。",
      },
      {
        name: "previous",
        type: "() => Promise<boolean>",
        description: "后退一步，不触发前进校验。",
      },
      {
        name: "reset",
        type: "(target?: number) => void",
        description:
          "取消校验，清空完成记录和错误，返回 initialStep 或指定步骤。",
      },
      {
        name: "cancel",
        type: "() => void",
        description: "取消等待中的校验，保留当前步骤和完成记录。",
      },
    ],
    notes: [
      "后发操作、reset、count 变化或卸载使旧校验失效。validate 应响应 signal；忽略 signal 的 Promise 仍可能继续执行，但不会修改步骤。",
      "步骤文案和字段归属由调用方管理；返回的是导航状态，不自动提交表单。",
    ],
  },
  useDocumentTitle: {
    source: "src/browser/document.ts",
    signature:
      "useDocumentTitle(title: string, options?: { restoreOnUnmount?: boolean })",
    parameters: [
      {
        name: "title",
        type: "string",
        defaultValue: "必填",
        description: "要显示在浏览器标签上的标题，变化后同步更新。",
      },
      {
        name: "options",
        type: "{ restoreOnUnmount?: boolean }",
        defaultValue: "{}",
        description: "卸载恢复策略。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "restoreOnUnmount",
            type: "boolean",
            defaultValue: "true",
            description:
              "最后一个标题拥有者卸载时恢复最初标题；false 保留最终标题。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "返回值",
        type: "void",
        description: "直接同步 document.title，没有返回值。",
      },
    ],
    notes: [
      "多个实例按副作用注册顺序由最后注册者控制；卸载后恢复仍存在的拥有者。更新较早实例的标题不会抢占较晚实例。",
      "如果其他代码直接更改了标题，清理时不会覆盖该外部修改。SSR 不访问 document，也不替代框架的服务端 head 管理。",
    ],
  },
  useObjectURL: {
    source: "src/browser/document.ts",
    signature: "useObjectURL(input: Blob | null)",
    parameters: [
      {
        name: "input",
        type: "Blob | null",
        defaultValue: "必填",
        description:
          "File 也是 Blob；null 清空预览。保持同一 Blob 引用可复用 URL。",
      },
    ],
    returns: [
      {
        name: "url",
        type: "string | null",
        description:
          "创建成功后的对象 URL；更换 input 时立即隐藏旧 URL，挂载后创建。",
      },
      {
        name: "error",
        type: "unknown",
        description: "创建 URL 时的异常，无错误时为 undefined。",
      },
      {
        name: "supported",
        type: "boolean",
        description: "当前环境是否同时支持创建与回收对象 URL；SSR 为 false。",
      },
    ],
    notes: [
      "更换 Blob、传入 null 或卸载时自动 revokeObjectURL。不要将 URL 持久化，也不要在 Hook 已卸载后继续使用。",
      "Blob URL 只代表本地资源地址，不会自动上传文件或下载文件。",
    ],
  },
  useTextareaAutoSize: {
    source: "src/browser/document.ts",
    signature:
      "useTextareaAutoSize(target: Target<HTMLTextAreaElement>, value: string, options?: { minRows?: number; maxRows?: number; enabled?: boolean })",
    parameters: [
      {
        name: "target",
        type: "Target<HTMLTextAreaElement>",
        defaultValue: "必填",
        description: "textarea 节点、ref、返回节点的函数或 null。",
      },
      {
        name: "value",
        type: "string",
        defaultValue: "必填",
        description:
          "文本域当前值；受控输入更新后重新测量，实际高度来自元素 scrollHeight。",
      },
      {
        name: "options",
        type: "{ minRows?: number; maxRows?: number; enabled?: boolean }",
        defaultValue: "{}",
        description: "行数边界与启停。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "minRows",
            type: "number",
            defaultValue: "1",
            description: "最少行数，不小于 1。",
          },
          {
            name: "maxRows",
            type: "number",
            defaultValue: "Infinity",
            description: "最多行数，不小于 minRows；超出时启用内部滚动。",
          },
          {
            name: "enabled",
            type: "boolean",
            defaultValue: "true",
            description: "false 时解除监听并恢复原内联样式。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "height",
        type: "number",
        description: "最近测量后应用的 CSS 高度 px；未绑定或禁用时为 0。",
      },
    ],
    methods: [
      {
        name: "resize",
        type: "() => void",
        description: "手动重测，适合字体加载或外部样式变化。",
      },
    ],
    types: targetType,
    notes: [
      "监听输入、窗口 resize 和元素宽度变化，支持 content-box 和 border-box；卸载或换节点时恢复原 height/overflowY。",
      "应让 CSS line-height 为明确数值；normal 使用 font-size × 1.2 估算。隐藏元素的几何值可能为 0，显示后请调用 resize。",
    ],
  },
  useSpring: {
    source: "src/animation/motion.ts",
    signature: "useSpring(target: number, options?: SpringOptions)",
    parameters: [
      {
        name: "target",
        type: "number",
        defaultValue: "必填",
        description: "有限目标值；NaN 或 Infinity 抛出 RangeError。",
      },
      {
        name: "options",
        type: "SpringOptions",
        defaultValue: "{}",
        description: "弹簧物理参数和初值。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "initialValue",
            type: "number",
            defaultValue: "target",
            description: "仅首次初始化使用；提供不同值可触发首次动画。",
          },
          {
            name: "stiffness",
            type: "number",
            defaultValue: "170",
            description: "正数刚度，越大响应越快。",
          },
          {
            name: "damping",
            type: "number",
            defaultValue: "26",
            description: "正数阻尼，影响回弹与收敛。",
          },
          {
            name: "mass",
            type: "number",
            defaultValue: "1",
            description: "正数质量。",
          },
          {
            name: "precision",
            type: "number",
            defaultValue: "0.01",
            description: "位移误差与速度都低于阈值时精确吸附目标。",
          },
          {
            name: "respectReducedMotion",
            type: "boolean",
            defaultValue: "true",
            description: "默认按系统减少动态效果设置直接吸附。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "value",
        type: "number",
        description: "当前插值，可用于样式或数字展示。",
      },
      {
        name: "velocity",
        type: "number",
        description: "当前速度，单位为值/秒。",
      },
      {
        name: "animating",
        type: "boolean",
        description: "是否仍在进行逐帧计算。",
      },
    ],
    methods: [
      {
        name: "stop",
        type: "() => void",
        description: "暂停在当前位置并将速度清零。",
      },
      {
        name: "finish",
        type: "() => void",
        description: "立即到达最新 target。",
      },
      {
        name: "restart",
        type: "() => void",
        description: "从当前位置重新向最新 target 运动。",
      },
    ],
    notes: [
      "采用阻尼弹簧解析解，帧间隔最多按 64ms 推进；后台恢复时不会按全部离开时间跳跃。",
      "目标改变时沿用当前值和速度，参数改变会重新调度。无 RAF 时直接到达目标，卸载取消待执行帧。正数参数无效时使用默认值。",
    ],
  },
  useTransitionState: {
    source: "src/animation/motion.ts",
    signature:
      "useTransitionState(open: boolean, options?: TransitionStateOptions)",
    parameters: [
      {
        name: "open",
        type: "boolean",
        defaultValue: "必填",
        description: "期望的展开状态。",
      },
      {
        name: "options",
        type: "TransitionStateOptions",
        defaultValue: "{}",
        description: "进入、退出时长与首次进入策略。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "enterDuration",
            type: "number",
            defaultValue: "200",
            description:
              "进入阶段兜底等待 ms；绑定的匹配结束事件可提前完成。负数按 0。",
          },
          {
            name: "exitDuration",
            type: "number",
            defaultValue: "200",
            description:
              "退出阶段兜底等待 ms；绑定的匹配结束事件可提前卸载。负数按 0。",
          },
          {
            name: "appear",
            type: "boolean",
            defaultValue: "false",
            description: "首次 open 为 true 时是否也经历 entering。",
          },
          {
            name: "preEnter",
            type: "boolean",
            defaultValue: "false",
            description:
              "从 unmounted 进入时先经过 preEnter 阶段（已挂载、应用起始样式）两帧，再切到 entering，使新挂载元素上的 CSS transition 能真正播放。使用 @keyframes 动画时无需开启。",
          },
          {
            name: "endEvent",
            type: "'transitionend' | 'animationend'",
            defaultValue: "'transitionend'",
            description:
              "将 bind 展开到实际动画元素上，匹配事件可提前结束阶段；只处理元素自身事件，忽略子节点冒泡。",
          },
          {
            name: "propertyName",
            type: "string",
            defaultValue: "undefined",
            description:
              "仅接收匹配 CSS 属性的 transitionend，例如 opacity；省略接受任意属性。",
          },
          {
            name: "animationName",
            type: "string",
            defaultValue: "undefined",
            description:
              "仅接收匹配 keyframes 名称的 animationend；省略接受任意动画名称。",
          },
          {
            name: "onEnter",
            type: "() => void",
            defaultValue: "undefined",
            description:
              "进入阶段开始一次。反向切换不会触发被取消阶段的完成回调。",
          },
          {
            name: "onEntered",
            type: "() => void",
            defaultValue: "undefined",
            description:
              "进入阶段完成一次。反向切换不会触发被取消阶段的完成回调。",
          },
          {
            name: "onExit",
            type: "() => void",
            defaultValue: "undefined",
            description:
              "退出阶段开始一次。反向切换不会触发被取消阶段的完成回调。",
          },
          {
            name: "onExited",
            type: "() => void",
            defaultValue: "undefined",
            description:
              "退出完成并卸载一次。反向切换不会触发被取消阶段的完成回调。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "phase",
        type: "TransitionPhase",
        description: "生命周期阶段；快速反向切换会清除旧计时器。",
      },
      {
        name: "mounted",
        type: "boolean",
        description: "除 unmounted 外均为 true；用此值决定是否渲染内容。",
      },
      {
        name: "visible",
        type: "boolean",
        description: "与期望 open 一致，退出阶段为 false。",
      },
      {
        name: "bind",
        type: "{ onTransitionEnd: React.TransitionEventHandler<HTMLElement>; onAnimationEnd: React.AnimationEventHandler<HTMLElement> }",
        description:
          "展开到实际动画元素上；不自动添加 CSS。事件与兜底计时器只会完成当前阶段一次。",
      },
    ],
    types:
      "type TransitionPhase = 'unmounted' | 'preEnter' | 'entering' | 'entered' | 'exiting';\ninterface TransitionStateOptions {\n  enterDuration?: number; exitDuration?: number; appear?: boolean;\n  preEnter?: boolean; // 仅开启时出现 'preEnter' 阶段\n  endEvent?: \"transitionend\" | \"animationend\";\n  propertyName?: string; animationName?: string;\n  onEnter?: () => void; onEntered?: () => void;\n  onExit?: () => void; onExited?: () => void;\n}",
    notes: [
      "本 Hook 管理挂载时序，不自动添加 CSS 动画。将 phase 映射到类名或样式，并让 CSS 时长与配置一致。",
      "系统要求减少动态效果时立即完成阶段切换。修改时长会重新计时；卸载清理所有计时器。",
      "兜底时长应不短于 CSS 动画时长；未绑定 bind 或浏览器不派发结束事件时仍能完成卸载。首次 open: true 且 appear: false 不触发进入回调。",
    ],
  },
  useGesture: {
    source: "src/web/gesture.ts",
    signature: "useGesture(options?: GestureOptions)",
    parameters: [
      {
        name: "options",
        type: "GestureOptions",
        defaultValue: "{}",
        description: "单指针手势配置与生命周期回调。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "axis",
            type: "'both' | 'x' | 'y'",
            defaultValue: "'both'",
            description: "限制输出位移轴；bind.style 按方向设置 touchAction。",
          },
          {
            name: "threshold",
            type: "number",
            defaultValue: "8",
            description: "进入拖动态的累计距离 px。",
          },
          {
            name: "swipeDistance",
            type: "number",
            defaultValue: "40",
            description:
              "结束时识别滑动方向的最小累计距离 px，不小于 threshold。",
          },
          {
            name: "disabled",
            type: "boolean",
            defaultValue: "false",
            description: "禁用新手势并取消正在进行的手势。",
          },
          {
            name: "onStart",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description: "主指针按下时调用。",
          },
          {
            name: "onMove",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description: "有效指针移动时调用。",
          },
          {
            name: "onEnd",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description: "正常松开时调用，可读取 swipe。",
          },
          {
            name: "onCancel",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description:
              "pointercancel、失去捕获、窗口失焦、禁用或 cancel 时调用。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "active",
        type: "boolean",
        description: "是否按下有效主指针。",
      },
      {
        name: "dragging",
        type: "boolean",
        description: "按住且已超过 threshold；结束后为 false。",
      },
      {
        name: "offset",
        type: "{ x: number; y: number }",
        description: "自按下位置开始的累计位移 px。",
      },
      {
        name: "velocity",
        type: "{ x: number; y: number }",
        description: "最近采样速度 px/ms；停止移动超过 80ms 后结束采样会归零。",
      },
      {
        name: "direction",
        type: "GestureDirection | null",
        description: "累计位移的主方向。",
      },
      {
        name: "swipe",
        type: "GestureDirection | null",
        description: "正常松开且达到距离阈值时的方向；按下或取消时清空。",
      },
      {
        name: "bind",
        type: "GestureBindings",
        description:
          "展开到 HTMLElement；保留返回的 style.touchAction 以协调原生滚动。",
      },
    ],
    methods: [
      {
        name: "cancel",
        type: "() => void",
        description: "取消当前手势并释放捕获，保留最后位移。",
      },
      {
        name: "reset",
        type: "() => void",
        description: "取消后恢复全部初始状态。",
      },
    ],
    types:
      "type GestureDirection = 'left' | 'right' | 'up' | 'down';\ninterface GestureState {\n  active: boolean; dragging: boolean;\n  offset: { x: number; y: number };\n  velocity: { x: number; y: number };\n  direction: GestureDirection | null;\n  swipe: GestureDirection | null;\n}\n// GestureBindings 为本文结构说明名称，不是包导出类型。\ninterface GestureBindings {\n  onPointerDown(event: React.PointerEvent<HTMLElement>): void;\n  onPointerMove(event: React.PointerEvent<HTMLElement>): void;\n  onPointerUp(event: React.PointerEvent<HTMLElement>): void;\n  onPointerCancel(event: React.PointerEvent<HTMLElement>): void;\n  onLostPointerCapture(event: React.PointerEvent<HTMLElement>): void;\n  style: React.CSSProperties;\n}",
    notes: [
      "只接收主指针及鼠标左键；额外指针被忽略，不包含双指缩放。卸载释放指针捕获。",
      "bind 不提供键盘拖动或排序，业务操作应提供按钮等键盘等价入口。useDrag/useDrop 对应 HTML 数据拖放，本 Hook 对应指针位移。",
    ],
  },
} satisfies Record<string, ApiDoc>;
