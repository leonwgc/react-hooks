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
  v("loading", "boolean", "包含服务执行和重试等待的完整请求周期；初始 false。"),
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
    source,
    signature:
      "useRequest<T, Args extends unknown[] = []>(\n  service: RequestService<T, Args>,\n  options?: RequestOptions<T, Args>,\n)",
    parameters: [
      p(
        "service",
        "({ signal }: RequestContext, ...args: Args) => Promise<T>",
        "必填",
        "服务函数；接收取消信号和 run 传入的参数。T 为成功数据，Args 为参数元组，例如 [id: string]。",
      ),
      options("RequestOptions<T, Args>"),
    ],
    sections: [
      {
        title: "options · 执行与数据",
        rows: [
          p(
            "manual",
            "boolean",
            "true",
            "false 时挂载自动执行；必须同时传 defaultParams，即使无参数也传 []。",
          ),
          p(
            "defaultParams",
            "Args",
            "undefined",
            "自动请求初始参数，也可供首次 refresh 和事件刷新使用；后续变化不会自动重跑。",
          ),
          p(
            "initialData",
            "T",
            "undefined",
            "首次 data 值，后续变化不自动覆盖 data。",
          ),
          p(
            "onSuccess",
            "(data: T, args: Args) => void",
            "undefined",
            "当前有效请求成功后调用一次；不针对每次尝试单独触发。",
          ),
          p(
            "onError",
            "(error: unknown, args: Args) => void",
            "undefined",
            "重试结束后的最终失败触发；取消或过期请求不触发。",
          ),
        ],
      },
      {
        title: "options · 重试与超时",
        rows: [
          p(
            "retry",
            "number",
            "0",
            "首次失败后最多额外尝试次数；有限非负整数，向下取整。默认不重试。",
          ),
          p(
            "retryDelay",
            "number | ((retryNumber: number, error: unknown) => number)",
            "指数退避",
            "等待毫秒；retryNumber 从 1 起。默认 1000 × 2^(n−1)，最大 30000。自定义负值按 0，非有限值回退 1000。",
          ),
          p(
            "shouldRetry",
            "(error: unknown, retryNumber: number, args: Args) => boolean",
            "undefined",
            "在次数额度内判断是否继续；返回 false 结束。AbortError 始终不重试。",
          ),
          p(
            "timeout",
            "number",
            "undefined",
            "每次尝试的超时毫秒，> 0 启用；不包含退避等待。超时以 RequestTimeoutError 拒绝，并取消该次 signal。",
          ),
        ],
      },
      {
        title: "options · 轮询与自动刷新",
        rows: [
          p(
            "pollingInterval",
            "number",
            "undefined",
            "> 0 开启轮询；每轮完成后等待该毫秒数再刷新，不与该轮请求重叠。",
          ),
          p(
            "pollingWhenHidden",
            "boolean",
            "true",
            "false 时页面隐藏后暂停后续轮询；不取消已经运行的请求。",
          ),
          p(
            "refreshOnFocus",
            "boolean",
            "false",
            "窗口获得焦点或文档恢复可见时刷新。",
          ),
          p(
            "refreshOnReconnect",
            "boolean",
            "false",
            "收到 window.online 时刷新；不代表服务已恢复可用。",
          ),
          p(
            "refreshThrottleInterval",
            "number",
            "1000",
            "聚焦/网络刷新共用的最小间隔毫秒；不节流手动 run/refresh 或轮询。",
          ),
        ],
      },
    ],
    returns: requestValues,
    methods: requestMethods,
    types:
      "interface RequestContext { signal: AbortSignal }\ntype RequestService<T, Args extends unknown[]> =\n  (context: RequestContext, ...args: Args) => Promise<T>;\n\n// manual: false 必须同时提供 defaultParams: Args。\n// 可从包入口导入 RequestOptions、RequestService、RequestContext。\ndeclare class RequestTimeoutError extends Error {\n  constructor(timeout: number);\n  timeout: number; // 本次尝试的超时毫秒\n}",
    notes: [
      "默认手动执行；manual: false 的挂载请求在 React Strict Mode 开发环境可能启动两轮，前一轮会取消。写操作由用户事件触发，并按业务保证幂等性。",
      "新调用、cancel 和卸载使旧请求失效，旧结果不会覆盖新状态。服务应透传 signal 到 fetch；Hook 不能回滚已经发生的服务端写入。",
      "自动刷新需要可用参数，且跳过进行中、页面隐藏或已 cancel 的状态；manual: true 配合 defaultParams 也可以被已启用的事件刷新触发。",
      "轮询在成功和最终失败后都可能继续；onSuccess/onError 请自行处理其内部异常。这里只做实例内请求管理，不提供共享缓存、请求合并或乐观更新。",
    ],
  },
  usePagination: {
    source,
    signature: "usePagination(options?: PaginationOptions)",
    parameters: [options("PaginationOptions")],
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
    source,
    signature:
      "useSelection<Key extends string | number>(keys: readonly Key[], options?)",
    parameters: [
      p(
        "keys",
        "readonly Key[]",
        "必填",
        "当前页可选项的唯一稳定 ID，Key 为 string 或 number。",
      ),
      options(),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "preserve",
            "boolean",
            "false",
            "false 时只保留当前 keys 中的选中项；true 时保留跨页选中。",
          ),
          p(
            "resetKey",
            "unknown",
            "undefined",
            "按内置深比较变化时清空全部选择；适合使用已提交的筛选条件。",
          ),
        ],
      },
    ],
    returns: [
      v("selected", "Set<Key>", "当前选中集合的快照，请勿直接修改。"),
      v("selectedKeys", "Key[]", "选中 ID 数组，含 preserve 保留的其他页 ID。"),
      v("allSelected", "boolean", "当前 keys 非空且全部已选中。"),
      v(
        "partiallySelected",
        "boolean",
        "当前页有选中但未全选，可绑定原生 checkbox.indeterminate。",
      ),
    ],
    methods: [
      v("isSelected", "(key: Key) => boolean", "查询某个 ID 是否选中。"),
      v("toggle", "(key: Key) => void", "切换单个 ID。"),
      v("selectAll", "() => void", "将当前 keys 加入选择，保留其他已选项。"),
      v(
        "toggleAll",
        "() => void",
        "当前页已全选则移除本页选择，否则选中本页。",
      ),
      v("clear", "() => void", "清空所有页选择。"),
    ],
  },
  useTable: {
    source,
    signature:
      "useTable<T, Filters extends object, Response = PageResult<T>>(\n  service: RequestService<Response, [TableQuery<Filters>]>,\n  options,\n)",
    parameters: [
      p(
        "service",
        "(context: RequestContext, query: TableQuery<Filters>) => Promise<Response>",
        "必填",
        "接收 signal、页码、每页条数、已提交筛选与排序；挂载及查询变化时自动执行。",
      ),
      options("object", true),
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
