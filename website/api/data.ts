import { p, v, options, type ApiDoc } from "./types";
const source = "src/data/index.ts";
export const requestValues = [
  v(
    "data",
    "T | undefined",
    "最近一次成功数据，初始为 initialData；重跑、失败或取消不会清空已有数据。",
  ),
  v(
    "error",
    "unknown",
    "最近一次终止请求的错误；初始 undefined，新请求开始时清空，AbortError 不作为失败展示。",
  ),
  v("loading", "boolean", "请求周期中的加载状态；初始 false。"),
  v("fetching", "boolean", "实际请求及重试等待状态；初始 false。"),
  v(
    "retryCount",
    "number",
    "本轮已安排的重试次数，初始及新一轮开始时为 0；首次请求不计入。",
  ),
];
export const requestMethods = [
  v(
    "run",
    "(...args: Args) => void",
    "开始新一轮请求并取消旧一轮；拒绝被内部处理，通过 error 读取失败。",
  ),
  v(
    "runAsync",
    "(...args: Args) => Promise<T>",
    "与 run 相同，但返回成功数据；最终失败、超时或取消会拒绝，需要 catch。",
  ),
  v(
    "refresh",
    "() => void",
    "使用最近 run 参数或 defaultParams 重跑；无参数记录时不发请求。",
  ),
  v(
    "refreshAsync",
    "() => Promise<T>",
    '返回刷新结果；没有可用参数时拒绝 Error("No previous request parameters.")。',
  ),
  v(
    "cancel",
    "() => void",
    "取消当前 signal、重试等待和轮询，停止自动刷新并将 loading 置 false；之后 run/refresh 可重新启动。",
  ),
  v(
    "mutate",
    "(next: T | ((previous: T | undefined) => T)) => void",
    "只更新本地 data，不发请求，不取消进行中的请求；后续成功响应仍可覆盖。",
  ),
];
export const dataDocs = {
  useRequest: {
    source: "src/data/index.ts",
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "服务成功返回的数据类型；service 返回 Promise<T>。",
      },
      {
        name: "Args",
        type: "unknown[]",
        defaultValue: "[]",
        description:
          "函数参数元组，例如 [id: string, page: number]；调用时按元组顺序传参。",
      },
    ],
    signature:
      "useRequest<T, Args extends unknown[] = []>(\n  service: RequestService<T, Args>,\n  options?: RequestOptions<T, Args>,\n)",
    parameters: [
      {
        name: "service",
        type: "RequestService<T, Args>",
        defaultValue: "必填",
        description:
          "服务函数；接收取消信号和 run 传入的参数。T 为成功数据，Args 为参数元组，例如 [id: string]。",
      },
      {
        name: "options",
        type: "RequestOptions<T, Args>",
        defaultValue: "{}",
        description: "配置对象，字段见下表。",
      },
    ],
    sections: [
      {
        title: "options · 执行与数据",
        rows: [
          {
            name: "manual",
            type: "boolean",
            defaultValue: "true",
            description:
              "false 时挂载自动执行；必须同时传 defaultParams，即使无参数也传 []。",
          },
          {
            name: "defaultParams",
            type: "Args",
            defaultValue: "undefined",
            description:
              "自动请求初始参数，也可供首次 refresh 和事件刷新使用；后续变化不会自动重跑。",
          },
          {
            name: "initialData",
            type: "T",
            defaultValue: "undefined",
            description: "首次 data 值，后续变化不自动覆盖 data。",
          },
          {
            name: "onSuccess",
            type: "(data: T, args: Args) => void",
            defaultValue: "undefined",
            description: "当前有效请求成功后调用一次；不针对每次尝试单独触发。",
          },
          {
            name: "onError",
            type: "(error: unknown, args: Args) => void",
            defaultValue: "undefined",
            description: "重试结束后的最终失败触发；取消或过期请求不触发。",
          },
          {
            name: "ready",
            type: "boolean",
            defaultValue: "true",
            description:
              "false 阻止手动与自动请求，并取消当前请求；runAsync 以 RequestNotReadyError 拒绝。恢复 true 时仅 manual: false 自动执行。",
          },
          {
            name: "refreshDeps",
            type: "React.DependencyList",
            defaultValue: "[]",
            description:
              "逐项 Object.is 比较；变化时仅 manual: false 自动重跑，使用最新 defaultParams。请避免每次创建新对象作为依赖。",
          },
          {
            name: "loadingDelay",
            type: "number",
            defaultValue: "0",
            description:
              "延迟展示 loading 的毫秒数；快速完成时不闪烁。fetching 始终立即反映请求生命周期；负值或非有限值按 0。",
          },
          {
            name: "onBefore",
            type: "(args: Args) => void",
            defaultValue: "undefined",
            description:
              "有效请求开始时调用一次，重试不重复调用。ready: false 不触发。",
          },
          {
            name: "onFinally",
            type: "(data: T | undefined, error: unknown, args: Args) => void",
            defaultValue: "undefined",
            description:
              "当前有效请求成功或最终失败后调用一次；成功时 error 为 undefined，失败时 data 为 undefined。取消、被替换、卸载不触发。",
          },
        ],
      },
      {
        title: "options · 重试与超时",
        rows: [
          {
            name: "retry",
            type: "number",
            defaultValue: "0",
            description:
              "首次失败后最多额外尝试次数；有限非负整数，向下取整。默认不重试。",
          },
          {
            name: "retryDelay",
            type: "number | ((retryNumber: number, error: unknown) => number)",
            defaultValue: "指数退避",
            description:
              "等待毫秒；retryNumber 从 1 起。默认 1000 × 2^(n−1)，最大 30000。自定义负值按 0，非有限值回退 1000。",
          },
          {
            name: "shouldRetry",
            type: "(error: unknown, retryNumber: number, args: Args) => boolean",
            defaultValue: "undefined",
            description:
              "在次数额度内判断是否继续；返回 false 结束。AbortError 始终不重试。",
          },
          {
            name: "timeout",
            type: "number",
            defaultValue: "undefined",
            description:
              "每次尝试的超时毫秒，> 0 启用；不包含退避等待。超时以 RequestTimeoutError 拒绝，并取消该次 signal。",
          },
        ],
      },
      {
        title: "options · 轮询与自动刷新",
        rows: [
          {
            name: "pollingInterval",
            type: "number",
            defaultValue: "undefined",
            description:
              "> 0 开启轮询；每轮完成后等待该毫秒数再刷新，不与该轮请求重叠。",
          },
          {
            name: "pollingWhenHidden",
            type: "boolean",
            defaultValue: "true",
            description:
              "false 时页面隐藏后暂停后续轮询；不取消已经运行的请求。",
          },
          {
            name: "refreshOnFocus",
            type: "boolean",
            defaultValue: "false",
            description: "窗口获得焦点或文档恢复可见时刷新。",
          },
          {
            name: "refreshOnReconnect",
            type: "boolean",
            defaultValue: "false",
            description: "收到 window.online 时刷新；不代表服务已恢复可用。",
          },
          {
            name: "refreshThrottleInterval",
            type: "number",
            defaultValue: "1000",
            description:
              "聚焦/网络刷新共用的最小间隔毫秒；不节流手动 run/refresh 或轮询。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "data",
        type: "T | undefined",
        description:
          "最近一次成功数据，初始为 initialData；重跑、失败或取消不会清空已有数据。",
      },
      {
        name: "error",
        type: "unknown",
        description:
          "最近一次终止请求的错误；初始 undefined，新请求开始时清空，AbortError 不作为失败展示。",
      },
      {
        name: "loading",
        type: "boolean",
        description:
          "loadingDelay 到期后显示加载状态；请求完成或取消立即恢复 false，初始 false。",
      },
      {
        name: "retryCount",
        type: "number",
        description:
          "本轮已安排的重试次数，初始及新一轮开始时为 0；首次请求不计入。",
      },
      {
        name: "fetching",
        type: "boolean",
        description:
          "包含执行及重试等待的真实请求状态；不受 loadingDelay 影响，初始 false。",
      },
    ],
    methods: [
      {
        name: "run",
        type: "(...args: Args) => void",
        description:
          "开始新一轮请求并取消旧一轮；拒绝被内部处理，通过 error 读取失败。",
      },
      {
        name: "runAsync",
        type: "(...args: Args) => Promise<T>",
        description:
          "与 run 相同，但返回成功数据；最终失败、超时或取消会拒绝，需要 catch。",
      },
      {
        name: "refresh",
        type: "() => void",
        description:
          "使用最近 run 参数或 defaultParams 重跑；无参数记录时不发请求。",
      },
      {
        name: "refreshAsync",
        type: "() => Promise<T>",
        description:
          '返回刷新结果；没有可用参数时拒绝 Error("No previous request parameters.")。',
      },
      {
        name: "cancel",
        type: "() => void",
        description:
          "取消当前 signal、重试等待和轮询，停止自动刷新并将 loading 置 false；之后 run/refresh 可重新启动。",
      },
      {
        name: "mutate",
        type: "(next: T | ((previous: T | undefined) => T)) => void",
        description:
          "只更新本地 data，不发请求，不取消进行中的请求；后续成功响应仍可覆盖。",
      },
    ],
    types:
      'interface RequestContext { signal: AbortSignal }\ntype RequestService<T, Args extends unknown[]> =\n  (context: RequestContext, ...args: Args) => Promise<T>;\n\n// manual: false 必须同时提供 defaultParams: Args。\n// 可从包入口导入 RequestOptions、RequestService、RequestContext。\ndeclare class RequestTimeoutError extends Error {\n  constructor(timeout: number);\n  timeout: number; // 本次尝试的超时毫秒\n}\n\ndeclare class RequestNotReadyError extends Error {\n  constructor(); // name 为 "NotReadyError"\n}',
    notes: [
      "默认手动执行；manual: false 的挂载请求在 React Strict Mode 开发环境可能启动两轮，前一轮会取消。写操作由用户事件触发，并按业务保证幂等性。",
      "新调用、cancel 和卸载使旧请求失效，旧结果不会覆盖新状态。服务应透传 signal 到 fetch；Hook 不能回滚已经发生的服务端写入。",
      "自动刷新需要可用参数，且跳过进行中、页面隐藏或已 cancel 的状态；manual: true 配合 defaultParams 也可以被已启用的事件刷新触发。",
      "轮询在成功和最终失败后都可能继续；onSuccess/onError 请自行处理其内部异常。这里只做实例内请求管理，不提供共享缓存、请求合并或乐观更新。",
      "ready 关闭会终止当前周期。refreshDeps 不改变手动模式；ready 和依赖同时变化只按最终配置自动执行。生命周期回调应自行处理内部异常；onBefore 抛错会作为本轮失败处理。",
    ],
  },
  usePagination: {
    source,
    signature: "usePagination(options?: PaginationOptions)",
    parameters: [options("PaginationOptions", false)],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "initialPage",
            "number",
            "1",
            "初始页码，从 1 开始；后续参数变化不重置内部页码。",
          ),
          p("initialPageSize", "number", "10", "初始每页条数，有限正整数。"),
          p(
            "total",
            "number",
            "undefined",
            "总记录数；省略时不限制最大页码。不执行分页请求或切分数组。",
          ),
        ],
      },
    ],
    returns: [
      v("page", "number", "当前页码；total 已知时限制在有效页范围。"),
      v("pageSize", "number", "当前每页条数。"),
      v("total", "number | undefined", "当前总数，负值按 0。"),
      v(
        "pageCount",
        "number | undefined",
        "已知 total 时向上取整，最小 1；未知时 undefined。",
      ),
    ],
    methods: [
      v(
        "setPage",
        "(page: number) => void",
        "向下取整并限制范围；非有限值回退 1。",
      ),
      v(
        "setPageSize",
        "(size: number) => void",
        "设置每页条数并回到第 1 页；非有限值回退 10。",
      ),
      v("next", "() => void", "前进一页，到末页时不越界。"),
      v("previous", "() => void", "后退一页，不小于 1。"),
      v("reset", "() => void", "回到第 1 页，保留 pageSize。"),
    ],
  },
  useSearch: {
    source,
    generics: [
      {
        name: "T",
        type: "object",
        defaultValue: "无默认类型",
        description: "筛选条件对象的结构。",
      },
    ],
    signature: "useSearch<T extends object>(initial: T)",
    parameters: [
      p("initial", "T", "必填", "初始筛选对象与 reset 基准；后续变化不重置。"),
    ],
    returns: [
      v("draft", "T", "正在编辑的筛选条件。"),
      v("submitted", "T", "上一次提交的条件。"),
      v(
        "revision",
        "number",
        "初始 0，每次 submit/reset 加 1；相同条件也能触发重新查询。",
      ),
    ],
    methods: [
      v(
        "setDraft",
        "(patch: Partial<T>) => void",
        "浅合并草稿，不影响 submitted。",
      ),
      v("submit", "() => void", "将当前草稿提交，并递增 revision。"),
      v(
        "reset",
        "() => void",
        "草稿与已提交条件同时恢复 initial，并递增 revision。",
      ),
    ],
  },
  useSelection: {
    source: "src/data/index.ts",
    generics: [
      {
        name: "Key",
        type: "string | number",
        defaultValue: "无默认类型",
        description: "选择项唯一标识的类型，仅允许 string 或 number。",
      },
    ],
    signature:
      "useSelection<Key extends string | number>(keys: readonly Key[], options?: SelectionOptions<Key>)",
    parameters: [
      {
        name: "keys",
        type: "readonly Key[]",
        defaultValue: "必填",
        description: "当前页可选项的唯一稳定 ID，Key 为 string 或 number。",
      },
      {
        name: "options",
        type: "SelectionOptions<Key>",
        defaultValue: "{}",
        description: "配置对象，字段见下表。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "preserve",
            type: "boolean",
            defaultValue: "false",
            description:
              "false 时只保留当前 keys 中的选中项；true 时保留跨页选中。",
          },
          {
            name: "resetKey",
            type: "unknown",
            defaultValue: "undefined",
            description:
              "按内置深比较变化时清空全部选择；适合使用已提交的筛选条件。",
          },
          {
            name: "disabledKeys",
            type: "readonly Key[]",
            defaultValue: "[]",
            description:
              "禁止选中的 ID；已有选择会被移除，范围选中与全选跳过这些项。",
          },
          {
            name: "maxSelected",
            type: "number",
            defaultValue: "Infinity",
            description:
              "全部选中项（包括跨页保留）上限；有限值向下取整且最少 0，非有限值视为无限。超限按已有插入顺序截断。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "selected",
        type: "Set<Key>",
        description: "当前选中集合的快照，请勿直接修改。",
      },
      {
        name: "selectedKeys",
        type: "Key[]",
        description: "选中 ID 数组，含 preserve 保留的其他页 ID。",
      },
      {
        name: "allSelected",
        type: "boolean",
        description: "当前未禁用 keys 非空且全部已选中；禁用项不影响全选判断。",
      },
      {
        name: "partiallySelected",
        type: "boolean",
        description:
          "当前页有选中但未全选，可绑定原生 checkbox.indeterminate。",
      },
      {
        name: "isAtLimit",
        type: "boolean",
        description: "是否达到选择上限；上限为 0 时为 true。",
      },
    ],
    methods: [
      {
        name: "isSelected",
        type: "(key: Key) => boolean",
        description: "查询某个 ID 是否选中。",
      },
      {
        name: "toggle",
        type: "(key: Key, options?: { range?: boolean }) => void",
        description:
          "单选切换并记录范围锚点；range: true 从上次普通 toggle 的锚点到当前 key，按目标项当前状态选中或取消整个范围。禁用项不处理；preserve: true 时允许切换非当前页 ID。",
      },
      {
        name: "selectAll",
        type: "() => void",
        description: "按 keys 顺序加入未禁用项，保留跨页选择并遵守上限。",
      },
      {
        name: "toggleAll",
        type: "() => void",
        description: "当前页已全选则移除本页选择，否则选中本页。",
      },
      {
        name: "clear",
        type: "() => void",
        description: "清空所有页选择。",
      },
      {
        name: "isDisabled",
        type: "(key: Key) => boolean",
        description: "查询 ID 是否在 disabledKeys 中。",
      },
      {
        name: "selectRange",
        type: "(from: Key, to: Key, checked?: boolean) => void",
        description:
          "按当前 keys 顺序处理含两端的区间；checked 默认 true，false 取消范围。跳过禁用项，选中时遵守上限；端点不存在则无操作。",
      },
    ],
    types:
      "interface SelectionOptions<Key> {\n  preserve?: boolean;\n  resetKey?: unknown;\n  disabledKeys?: readonly Key[];\n  maxSelected?: number;\n}",
    notes: [
      "Shift 交互需显式传 toggle(key, { range: event.shiftKey })，Hook 不全局监听键盘。clear 或 resetKey 变化清除范围锚点。",
      "selected 是不可变使用的 Set 快照。上限变小、禁用项变化会裁剪已有选择；不提供超限回调。",
    ],
  },
  useTable: {
    source,
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "转换后的每一行记录类型；列表、选择与行编辑使用该类型。",
      },
      {
        name: "Filters",
        type: "object",
        defaultValue: "无默认类型",
        description: "筛选条件对象结构；与 TableQuery.filters 对应。",
      },
      {
        name: "Response",
        type: "unknown",
        defaultValue: "PageResult<T>",
        description: "服务原始响应类型；与 T 不同的结构可通过 select 转换。",
      },
    ],
    signature:
      'useTable<T, Filters extends object, Response = PageResult<T>>(\n  service: RequestService<Response, [TableQuery<Filters>]>,\n  options: {\n    initialFilters: Filters;\n    pageSize?: number;\n    select: (response: Response) => PageResult<T>;\n    urlState?: {\n      key: string;\n      mode?: "replace" | "push";\n      parseFilters: (value: unknown) => Filters;\n    };\n    columns?: readonly string[];\n    columnsStorageKey?: string;\n    filterPresets?: Record<string, Filters>;\n  },\n)',
    parameters: [
      p(
        "service",
        "RequestService<Response, [TableQuery<Filters>]>",
        "必填",
        "接收 signal、页码、每页条数、已提交筛选与排序；挂载及查询变化时自动执行。",
      ),
      options(
        '{\n    initialFilters: Filters;\n    pageSize?: number;\n    select: (response: Response) => PageResult<T>;\n    urlState?: {\n        key: string;\n        mode?: "replace" | "push";\n        parseFilters: (value: unknown) => Filters;\n    };\n    columns?: readonly string[];\n    columnsStorageKey?: string;\n    filterPresets?: Record<string, Filters>;\n}',
        true,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "initialFilters",
            "Filters",
            "必填",
            "初始筛选与 search.reset 基准。",
          ),
          p(
            "select",
            "(response: Response) => PageResult<T>",
            "必填",
            "将响应转换为 { list, total }，即使服务已返回相同结构也需提供。list 必须为数组，total 必须为有限非负数。",
          ),
          p("pageSize", "number", "10", "初始每页条数。"),
          p(
            "urlState",
            '{ key: string; mode?: "replace" | "push"; parseFilters: (value: unknown) => Filters }',
            "undefined",
            "开启 URL 查询同步，详见下表。",
          ),
          p(
            "columns",
            "readonly string[]",
            "[]",
            "允许展示的列 key；需稳定且唯一，初始全部显示。",
          ),
          p(
            "columnsStorageKey",
            "string",
            "undefined",
            "列顺序与显隐的 localStorage 键；省略时不持久化。",
          ),
          p(
            "filterPresets",
            "Record<string, Filters>",
            "{}",
            "初始命名筛选预设，只保留在当前实例内。",
          ),
        ],
      },
      {
        title: "options.urlState",
        rows: [
          p("key", "string", "必填", "保存整个查询 JSON 的单个 URL 参数名。"),
          p(
            "mode",
            "'replace' | 'push'",
            "'replace'",
            "写入时替换或新增历史条目。",
          ),
          p(
            "parseFilters",
            "(value: unknown) => Filters",
            "必填",
            "解析并验证 URL 中的 filters，不能直接信任输入；抛错记入 stateError。",
          ),
        ],
      },
    ],
    returns: [
      ...requestValues.map((row) =>
        row.name === "data"
          ? v(
              "data",
              "PageResult<T> | undefined",
              "最近成功的标准化分页结果，初始 undefined。",
            )
          : row,
      ),
      v("list", "T[]", "当前结果列表，首次加载前为 []。"),
      v("total", "number", "当前结果总数，首次加载前为 0。"),
      v("page", "number", "当前页码，从 1 开始。"),
      v("pageSize", "number", "当前每页条数。"),
      v("sort", 'TableQuery<Filters>["sort"]', "当前排序，初始 null。"),
      v(
        "stateError",
        "unknown",
        "URL 解析/序列化或列配置存储错误，与请求 error 分开。",
      ),
      v("search.draft", "Filters", "筛选草稿。"),
      v("search.submitted", "Filters", "已提交筛选。"),
      v("search.revision", "number", "每次提交或重置递增。"),
      v(
        "columns.order",
        "string[]",
        "规范化后的全部列顺序；去除未知 key，补齐遗漏 key。",
      ),
      v("columns.hidden", "string[]", "隐藏列 key。"),
      v("columns.visible", "string[]", "按 order 排序的可见列 key。"),
      v("presets", "Record<string, Filters>", "当前实例的筛选预设。"),
    ],
    methods: [
      ...requestMethods.map((row) =>
        row.name === "run"
          ? v(
              "run",
              "(query: TableQuery<Filters>) => void",
              "低层请求入口；不会同步 UI 查询状态。通常使用 setPage、search.submit 或 refresh。",
            )
          : row.name === "runAsync"
            ? v(
                "runAsync",
                "(query: TableQuery<Filters>) => Promise<PageResult<T>>",
                "低层异步请求入口，不同步 UI 查询状态；失败需 catch。",
              )
            : row.name === "refreshAsync"
              ? v(
                  "refreshAsync",
                  "() => Promise<PageResult<T>>",
                  "重跑最近请求，返回标准化结果，失败需 catch。",
                )
              : row.name === "mutate"
                ? v(
                    "mutate",
                    "(next: PageResult<T> | ((previous: PageResult<T> | undefined) => PageResult<T>)) => void",
                    "本地修改分页结果，不请求服务。",
                  )
                : row,
      ),
      v(
        "setPage",
        "(page: number) => void",
        "切页并自动请求；已知总数时限制最大页。",
      ),
      v(
        "setPageSize",
        "(size: number) => void",
        "更新每页条数，回到第 1 页并请求。",
      ),
      v(
        "setSort",
        '(sort: TableQuery<Filters>["sort"]) => void',
        "设置排序或传 null 清除，回到第 1 页并请求。",
      ),
      v(
        "search.setDraft",
        "(patch: Partial<Filters>) => void",
        "浅合并草稿，不立即请求。",
      ),
      v("search.submit", "() => void", "提交草稿，回到第 1 页并请求。"),
      v(
        "search.reset",
        "() => void",
        "恢复初始筛选、清除排序并回到第 1 页，保留当前 pageSize。",
      ),
      v(
        "columns.setOrder",
        "(keys: readonly string[]) => void",
        "规范化列顺序并按配置持久化。",
      ),
      v(
        "columns.setVisible",
        "(key: string, visible: boolean) => void",
        "设置列显隐并按配置持久化，忽略未知 key。",
      ),
      v(
        "savePreset",
        "(name: string) => void",
        "保存当前 draft，覆盖同名预设；空白名称无操作。",
      ),
      v(
        "applyPreset",
        "(name: string) => boolean",
        "应用预设并查询第 1 页；名称不存在返回 false。",
      ),
      v("deletePreset", "(name: string) => void", "删除本实例预设。"),
    ],
    types:
      'interface TableQuery<Filters> {\n  page: number;\n  pageSize: number;\n  filters: Filters;\n  sort: { field: string; order: "asc" | "desc" } | null;\n}\ninterface PageResult<T> { list: T[]; total: number }',
    notes: [
      "返回 useRequest 的请求状态和方法，但 options 不透传重试、轮询或超时配置；retryCount 在本实现中通常为 0。",
      "URL 恢复先于首次请求，支持 popstate。列配置不改变服务请求，需用 columns.visible 渲染列；预设不自动写入存储。",
    ],
  },
} satisfies Record<string, ApiDoc>;
