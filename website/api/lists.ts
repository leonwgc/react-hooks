import { p, v, options, targetType, type ApiDoc } from "./types";
const source = "src/web/list.ts";
export const listDocs = {
  useInfiniteScroll: {
    source,
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description:
          "每一条列表记录的类型，与 InfinitePage.items 和返回的 items 对应。",
      },
      {
        name: "Cursor",
        type: "unknown",
        defaultValue: "无默认类型",
        description:
          "分页游标的类型，由 initialCursor 和 service 的参数共同推断，也可显式指定。页码可用 number（如 1），令牌可用 string（如 'page-2'），也可使用后端要求的对象结构。nextCursor: Cursor | null 中的 null 专门表示结束，不应作为 initialCursor。",
      },
    ],
    typeExample: `import { useInfiniteScroll, type InfinitePage } from "@leonwgc/react-hooks";

interface Article { id: number; title: string }

// T = Article，Cursor = number：从第 1 页开始。
export function useArticleFeed() {
  const list = useInfiniteScroll<Article, number>(
    async ({ cursor, signal }): Promise<InfinitePage<Article, number>> => {
      const response = await fetch('/api/articles?page=' + cursor, { signal });
      if (!response.ok) throw new Error('加载失败');
      const page: InfinitePage<Article, number> = await response.json();
      // 服务端结构：{ items: Article[], nextCursor: number | null }
      // TypeScript 注解不校验 JSON；实际项目应校验服务端响应。
      return page;
    },
    { initialCursor: 1 },
  );
  // list.items 的类型是 Article[]。
  return list;
}
// 若服务端返回字符串令牌，使用 <Article, string>，
// 并将 initialCursor 和 nextCursor 改为对应字符串（结束时仍返回 null）。`,
    signature:
      'useInfiniteScroll<T, Cursor>(\n  service: (context: {\n    signal: AbortSignal;\n    cursor: Cursor;\n  }) => Promise<InfinitePage<T, Cursor>>,\n  options: {\n    initialCursor: Cursor;\n    manual?: boolean;\n    direction?: "append" | "prepend";\n    resetKey?: unknown;\n    getKey?: (item: T) => React.Key;\n    sentinel?: Target<Element>;\n  },\n)',
    parameters: [
      p(
        "service",
        "(context: {\n    signal: AbortSignal;\n    cursor: Cursor;\n}) => Promise<InfinitePage<T, Cursor>>",
        "必填",
        "按当前游标取一页；将 signal 传给实际请求。",
      ),
      options(
        '{\n    initialCursor: Cursor;\n    manual?: boolean;\n    direction?: "append" | "prepend";\n    resetKey?: unknown;\n    getKey?: (item: T) => React.Key;\n    sentinel?: Target<Element>;\n}',
        true,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "initialCursor",
            "Cursor",
            "必填",
            "首次/重置游标；null 被保留为结束标记，不作为有效游标使用。变化时按深比较重置。",
          ),
          p(
            "manual",
            "boolean",
            "false",
            "true 时挂载/reset 不自动请求；不会禁用 sentinel 触发。",
          ),
          p(
            "direction",
            "'append' | 'prepend'",
            "'append'",
            "追加到尾部或插入头部，每页内部顺序保留。",
          ),
          p(
            "resetKey",
            "unknown",
            "undefined",
            "深比较变化时取消旧请求并清空列表。",
          ),
          p(
            "getKey",
            "(item: T) => React.Key",
            "undefined",
            "提供时去重，保留合并后数组中第一个相同 key 的记录；prepend 时新页在前。",
          ),
          p(
            "sentinel",
            "Target<Element>",
            "undefined",
            "观察触底/触顶标记元素，可见时自动加载；无 IntersectionObserver 时需手动加载。",
          ),
        ],
      },
    ],
    returns: [
      v("items", "T[]", "累计结果，初始 []。"),
      v("loading", "boolean", "当前是否加载，初始 false。"),
      v(
        "error",
        "unknown",
        "最近一页错误，初始 undefined；开始加载和 reset 时清空。",
      ),
      v(
        "hasMore",
        "boolean",
        "是否还有下一页，初始 true；成功后由 nextCursor !== null 决定。",
      ),
    ],
    methods: [
      v(
        "loadMore",
        "() => Promise<void>",
        "加载当前游标；重复调用共用 Promise，无更多数据时直接完成。失败拒绝；若 await，需要 catch。",
      ),
      v(
        "retry",
        "() => Promise<void>",
        "loadMore 的同一函数引用；失败时游标未前进，因此重试同一页。",
      ),
      v(
        "reset",
        "() => void",
        "取消旧请求，清空数据和错误、恢复 initialCursor；manual 为 false 时立即重新加载。",
      ),
      v(
        "cancel",
        "() => void",
        "取消并隔离当前请求，保留已有数据和游标；不永久禁用 sentinel。",
      ),
    ],
    types:
      "interface InfinitePage<T, Cursor> {\n  items: T[];\n  nextCursor: Cursor | null; // null 表示没有下一页\n}\n\n" +
      targetType,
    notes: [
      "自动观察遇到 error 后暂停触发；手动 loadMore/retry 可恢复。cancel 通过 signal 通知服务，忽略 signal 的底层 Promise 可能仍要等待服务结束，但旧结果不会写入。",
    ],
  },
  useVirtualList: {
    source,
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "每条原始列表记录的类型，与 VirtualItem.item 对应。",
      },
    ],
    signature:
      "useVirtualList<T>(\n  items: readonly T[],\n  options: VirtualListOptions<T>,\n)",
    parameters: [
      p("items", "readonly T[]", "必填", "全部记录，使用不可变数组更新。"),
      options("VirtualListOptions<T>", true),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "itemHeight",
            "number",
            "必填",
            "固定模式行高，或动态模式未测量行的估算高度，单位 px，最小按 1 计算。",
          ),
          p("height", "number", "必填", "滚动容器高度 px，应大于 0。"),
          p(
            "getKey",
            "(item: T, index: number) => React.Key",
            "必填",
            "唯一稳定 key；用于尺寸缓存与阅读锚点，插入/排序时不要使用索引作为 key。",
          ),
          p(
            "overscan",
            "number",
            "3",
            "可见区域前后各额外渲染的行数，向下取整且不小于 0。",
          ),
          p(
            "dynamic",
            "boolean",
            "false",
            "启用动态测量；将 measureRef 绑定到行，并避免固定 height。",
          ),
          p(
            "onStartReached",
            "() => void",
            "undefined",
            "进入顶部阈值区域或区域内列表尺寸变化时触发，空列表也可能触发。",
          ),
          p(
            "onEndReached",
            "() => void",
            "undefined",
            "进入底部阈值区域或区域内列表尺寸变化时触发。",
          ),
          p("threshold", "number", "40", "边界触发距离 px，负值按 0。"),
        ],
      },
    ],
    returns: [
      v(
        "containerRef",
        "React.RefObject<HTMLDivElement | null>",
        "绑定到实际滚动 div。",
      ),
      v(
        "containerStyle",
        "React.CSSProperties",
        "容器 height、overflow:auto、position:relative、overflowAnchor:none，展开到同一元素。",
      ),
      v(
        "totalHeight",
        "number",
        "全部记录估算/测量总高度；用于内部占位层高度。",
      ),
      v(
        "virtualItems",
        "VirtualItem<T>[]",
        "只包含可见范围及 overscan 行，字段见下方。",
      ),
    ],
    methods: [
      v(
        "onScroll",
        "() => void",
        "绑定到滚动容器的 onScroll，同步可见范围和锚点。",
      ),
      v(
        "scrollTo",
        "(index: number, align?: 'start' | 'center' | 'end') => void",
        "按从 0 开始的索引定位，align 默认 start；索引取整并限制到有效范围，无容器/空列表时无操作。",
      ),
      v(
        "resetMeasurements",
        "() => void",
        "清除不可见行的缓存，并立即重新测量当前已挂载行。",
      ),
    ],
    types:
      "// 以下 VirtualItem 是文档中的结构说明名称，不是包导出类型。\ninterface VirtualItem<T> {\n  item: T;\n  index: number; // 在完整 items 中的索引\n  key: React.Key;\n  style: React.CSSProperties; // 绝对定位 top / width / height\n  measureRef(node: HTMLElement | null): void;\n}",
    notes: [
      "容器绑定 ref/style/onScroll，内部设置 height: totalHeight 的占位层；每行使用 key、style 和动态模式的 measureRef。缺少占位层会导致滚动范围不正确。",
      "动态行首次挂载测量，后续变化依赖 ResizeObserver。scrollTo 对未测量行使用估算值；上方插入或高度变化时按稳定 key 保留当前可见锚点。回调不内置加载锁，搭配 useInfiniteScroll 处理去重。",
    ],
  },
} satisfies Record<string, ApiDoc>;
