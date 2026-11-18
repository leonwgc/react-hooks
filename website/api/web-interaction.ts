import { p, v, options, target, targetType, type ApiDoc } from "./types";
const source = "src/web/interaction.ts";
export const webInteractionDocs = {
  useUndoRedo: {
    source,
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "每一份历史快照的值类型。",
      },
    ],
    signature:
      "useUndoRedo<T>(\n  initial: T,\n  options?: {\n    limit?: number;\n  },\n)",
    parameters: [
      p("initial", "T", "必填", "初始不可变快照；后续参数变化不重置历史。"),
      options("{\n    limit?: number;\n}", false),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "limit",
            "number",
            "100",
            "新写入时保留的撤销快照上限，取整且至少 1；请传有限正数。",
          ),
        ],
      },
    ],
    returns: [
      v("value", "T", "当前快照引用。"),
      v("canUndo", "boolean", "是否存在过去快照，初始 false。"),
      v("canRedo", "boolean", "是否存在未来快照，初始 false。"),
    ],
    methods: [
      v(
        "set",
        "(next: T | ((previous: T) => T), options?: { replace?: boolean }) => void",
        "写入新快照。replace 默认 false；true 时替换当前快照而不新增撤销项。Object.is 相同时无操作；有效写入清空重做分支。",
      ),
      v("undo", "() => void", "回到上一快照；没有历史时无操作。"),
      v("redo", "() => void", "恢复下一快照；没有未来记录时无操作。"),
      v(
        "reset",
        "(value: T) => void",
        "用给定值重新开始并清空两侧历史；value 必填。",
      ),
      v("clear", "() => void", "保留当前值，只清空撤销和重做历史。"),
    ],
    notes: [
      "保存引用，不做深拷贝。对象或数组必须不可变更新，原地修改会破坏历史快照。",
    ],
  },
  useLeaveConfirm: {
    source,
    signature:
      "useLeaveConfirm(\n  dirty: boolean,\n  options?: {\n    confirm?: () => boolean | Promise<boolean>;\n    message?: string;\n  },\n)",
    parameters: [
      p(
        "dirty",
        "boolean",
        "必填",
        "是否有未保存内容；为 true 时注册 beforeunload。",
      ),
      options(
        "{\n    confirm?: () => boolean | Promise<boolean>;\n    message?: string;\n}",
        false,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "confirm",
            "() => boolean | Promise<boolean>",
            "window.confirm",
            "SPA 主动离开时的确认函数；true 允许，false 拒绝，抛错/拒绝继续向调用方传播。",
          ),
          p(
            "message",
            "string",
            "'有未保存的修改，确定离开吗？'",
            "仅用于默认 window.confirm；不改变浏览器 beforeunload 文案。",
          ),
        ],
      },
    ],
    returns: [],
    methods: [
      v(
        "confirmLeave",
        "() => Promise<boolean>",
        "dirty 为 false 直接允许；dirty 时执行确认，进行中的重复确认共用 Promise。",
      ),
      v(
        "guard",
        "(navigate: () => void) => Promise<boolean>",
        "允许时调用 navigate 并返回 true；拒绝时不调用且返回 false。navigate 的同步异常会使 Promise 拒绝。",
      ),
    ],
    notes: [
      "不会自动拦截 SPA 链接、history 或浏览器后退；必须由路由调用方接入 guard/confirmLeave。beforeunload 是否弹窗取决于浏览器与用户交互条件。",
    ],
  },
  useFocusWithin: {
    source,
    signature: "useFocusWithin()",
    parameters: [],
    returns: [
      v("focused", "boolean", "焦点位于绑定容器或后代内，初始 false。"),
      v(
        "bind",
        "{ onFocus: () => void; onBlur: (event: React.FocusEvent<HTMLElement>) => void }",
        "展开到容器；内部后代之间移动焦点不会置 false。",
      ),
    ],
    notes: [
      "这是 React 冒泡焦点事件的状态封装；不限制焦点，也不将 DOM 焦点主动移动到某处。",
    ],
  },
  useLongPress: {
    source,
    signature:
      "useLongPress(\n  onLongPress: (event: React.PointerEvent<HTMLElement>) => void,\n  options?: {\n    delay?: number;\n    threshold?: number;\n    disabled?: boolean;\n  },\n)",
    parameters: [
      p(
        "onLongPress",
        "(event: React.PointerEvent<HTMLElement>) => void",
        "必填",
        "达到延迟后调用一次，传入最初按下事件；异步时不要依赖 currentTarget。",
      ),
      options(
        "{\n    delay?: number;\n    threshold?: number;\n    disabled?: boolean;\n}",
        false,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p("delay", "number", "500", "长按等待毫秒，负值按 0。"),
          p(
            "threshold",
            "number",
            "10",
            "从按下位置移动的欧氏距离阈值 px，超过时取消；请传非负数。",
          ),
          p("disabled", "boolean", "false", "禁用新长按，并取消当前等待。"),
        ],
      },
    ],
    returns: [
      v(
        "pressing",
        "boolean",
        "有效按压是否仍持续；回调触发后保持 true，直到松开/取消。初始 false。",
      ),
      v("bind", "PointerBindings", "展开到交互元素，包含下方五个指针处理器。"),
    ],
    methods: [
      v("cancel", "() => void", "清除等待与当前指针状态，pressing 设 false。"),
    ],
    types:
      "// PointerBindings 为文档结构名，不是包导出类型。\ninterface PointerBindings {\n  onPointerDown(event: React.PointerEvent<HTMLElement>): void;\n  onPointerMove(event: React.PointerEvent<HTMLElement>): void;\n  onPointerUp(event: React.PointerEvent<HTMLElement>): void;\n  onPointerCancel(event: React.PointerEvent<HTMLElement>): void;\n  onLostPointerCapture(event: React.PointerEvent<HTMLElement>): void;\n}",
    notes: [
      "仅响应主按钮（button === 0），同一时刻只跟踪一个指针。移动超阈值、取消、松开、失去捕获、窗口失焦或卸载会清理；自行提供键盘等价按钮。",
    ],
  },
  useDrag: {
    source,
    signature:
      'useDrag(\n  data: string,\n  options?: {\n    type?: string;\n    effectAllowed?: DataTransfer["effectAllowed"];\n    disabled?: boolean;\n  },\n)',
    parameters: [
      p(
        "data",
        "string",
        "必填",
        "写入 DataTransfer 的字符串；对象需自行序列化。",
      ),
      options(
        '{\n    type?: string;\n    effectAllowed?: DataTransfer["effectAllowed"];\n    disabled?: boolean;\n}',
        false,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "type",
            "string",
            "'text/plain'",
            "写入的 MIME 类型，需与接收方匹配。",
          ),
          p(
            "effectAllowed",
            'DataTransfer["effectAllowed"]',
            "'copyMove'",
            "允许的原生拖放操作。",
          ),
          p(
            "disabled",
            "boolean",
            "false",
            "设为 true 时 draggable 为 false，并阻止 dragstart。",
          ),
        ],
      },
    ],
    returns: [
      v(
        "dragging",
        "boolean",
        "dragstart 后 true，dragend 后 false；初始 false。",
      ),
      v(
        "bind",
        "{ draggable: boolean; onDragStart: (event: React.DragEvent<HTMLElement>) => void; onDragEnd: () => void }",
        "展开到拖动源；事件处理器和 draggable 必须一起绑定。",
      ),
    ],
  },
  useDrop: {
    source,
    signature:
      'useDrop(\n  onDrop: (\n    payload: {\n      text: string;\n      files: File[];\n    },\n    event: React.DragEvent<HTMLElement>,\n  ) => void,\n  options?: {\n    type?: string;\n    disabled?: boolean;\n    dropEffect?: DataTransfer["dropEffect"];\n  },\n)',
    parameters: [
      p(
        "onDrop",
        "(payload: {\n    text: string;\n    files: File[];\n}, event: React.DragEvent<HTMLElement>) => void",
        "必填",
        "匹配类型或文件放下时调用；text 按 options.type 读取，files 为原始文件数组。",
      ),
      options(
        '{\n    type?: string;\n    disabled?: boolean;\n    dropEffect?: DataTransfer["dropEffect"];\n}',
        false,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "type",
            "string",
            "'text/plain'",
            "接受的文本 MIME 类型；始终同时接受 Files，不做文件扩展名过滤。",
          ),
          p(
            "dropEffect",
            'DataTransfer["dropEffect"]',
            "'copy'",
            "匹配拖入时设置的光标操作提示。",
          ),
          p("disabled", "boolean", "false", "禁用接收并复位 over。"),
        ],
      },
    ],
    returns: [
      v(
        "over",
        "boolean",
        "匹配的拖动是否位于区域内，初始 false；对子节点进入/离开做深度计数。",
      ),
      v("bind", "DropBindings", "展开到放置区域；只为匹配拖放阻止默认行为。"),
    ],
    types:
      "// DropBindings 为文档结构名，不是包导出类型。\ninterface DropBindings {\n  onDragEnter(event: React.DragEvent<HTMLElement>): void;\n  onDragOver(event: React.DragEvent<HTMLElement>): void;\n  onDragLeave(): void;\n  onDrop(event: React.DragEvent<HTMLElement>): void;\n}",
    notes: [
      "接收数据不可信，调用方负责 JSON/文件校验；不会自动读取文件内容或上传。原生拖放依赖浏览器，触屏交互需提供等价选择文件等操作。",
    ],
  },
  useMutationObserver: {
    source,
    signature:
      "useMutationObserver(\n  target: Target<Node>,\n  callback: MutationCallback,\n  options?: MutationObserverInit,\n)",
    parameters: [
      target("Node"),
      p(
        "callback",
        "MutationCallback",
        "必填",
        "使用最新回调处理变更批次；回调异常不由 Hook 捕获。",
      ),
      p(
        "options",
        "MutationObserverInit",
        "{ childList: true, subtree: true }",
        "原生观察配置；传入对象会完整替换默认对象，不做合并。",
      ),
    ],
    sections: [
      {
        title: "options · 原生观察配置",
        rows: [
          p(
            "childList",
            "boolean",
            "true（省略 options 时）",
            "观察子节点增加/移除。",
          ),
          p(
            "subtree",
            "boolean",
            "true（省略 options 时）",
            "观察后代节点；传入 options 但省略此项时原生默认 false。",
          ),
          p(
            "attributes",
            "boolean",
            "原生规则",
            "观察属性；attributeOldValue 或 attributeFilter 存在时通常隐式启用。",
          ),
          p("attributeFilter", "string[]", "undefined", "只观察指定属性名称。"),
          p("attributeOldValue", "boolean", "false", "记录变更前的属性值。"),
          p(
            "characterData",
            "boolean",
            "原生规则",
            "观察文本节点内容；设置 characterDataOldValue 时通常隐式启用。",
          ),
          p("characterDataOldValue", "boolean", "false", "记录变更前文本值。"),
        ],
      },
    ],
    returns: [
      v("supported", "boolean", "挂载后检测 MutationObserver，初始 false。"),
      v(
        "error",
        "unknown",
        "构造/observe 配置错误，初始 undefined；非法组合会记录错误而不观察。",
      ),
    ],
    methods: [
      v(
        "disconnect",
        "() => void",
        "停止当前观察；目标或配置变化才会重新建立观察。",
      ),
      v(
        "takeRecords",
        "() => MutationRecord[]",
        "提取并清空当前待投递记录；没有观察器时返回 []。",
      ),
    ],
    types: targetType,
    notes: [
      "配置按深比较判断变化，目标节点替换也会重建。childList/attributes/characterData 至少有一个有效启用，否则原生 API 拒绝观察。",
    ],
  },
  useSortable: {
    source: "src/web/sortable.ts",
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "每个可排序列表项的类型。",
      },
    ],
    signature:
      "useSortable<T>(\n  items: readonly T[],\n  options: {\n    getKey: (item: T) => React.Key;\n    onChange: (items: T[]) => void;\n    disabled?: boolean;\n  },\n)",
    parameters: [
      p(
        "items",
        "readonly T[]",
        "必填",
        "受控列表；调用方收到 onChange 后更新状态。",
      ),
      options(
        "{\n    getKey: (item: T) => React.Key;\n    onChange: (items: T[]) => void;\n    disabled?: boolean;\n}",
        true,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "getKey",
            "(item: T) => React.Key",
            "必填",
            "返回唯一稳定 key，不使用随顺序变化的索引。",
          ),
          p(
            "onChange",
            "(items: T[]) => void",
            "必填",
            "收到新顺序；拖放在 drop 时调用，键盘每次移动即时调用。",
          ),
          p(
            "disabled",
            "boolean",
            "false",
            "禁止拖放/移动，行 tabIndex 设 -1；进行中的键盘排序会取消并恢复顺序。",
          ),
        ],
      },
    ],
    returns: [
      v(
        "activeKey",
        "React.Key | null",
        "正在拖动/键盘拾取的 key，初始 null。",
      ),
      v(
        "announcement",
        "string",
        '排序状态文案，初始空字符串；绑定到 role="status" 供读屏播报。',
      ),
    ],
    methods: [
      v(
        "getItemProps",
        "(item: T) => SortableItemProps",
        "展开到行，返回原生拖放、键盘与可访问属性，结构见下方。",
      ),
      v(
        "move",
        "(from: number, to: number) => boolean",
        "索引从 0 开始，合法且有变化时调用 onChange 并返回 true；禁用、越界或相同索引返回 false。",
      ),
      v(
        "cancel",
        "() => void",
        "键盘排序恢复拾取时的顺序并保留当前数据内容及新增项；拖放取消只清理活动状态。",
      ),
    ],
    types:
      '// SortableItemProps 为文档结构名，不是包导出类型。\ninterface SortableItemProps {\n  draggable: boolean;\n  tabIndex: number;\n  "aria-roledescription": string;\n  "aria-keyshortcuts": string;\n  "data-sorting": boolean | undefined;\n  onKeyDown(event: React.KeyboardEvent<HTMLElement>): void;\n  onDragStart(event: React.DragEvent<HTMLElement>): void;\n  onDragOver(event: React.DragEvent<HTMLElement>): void;\n  onDrop(event: React.DragEvent<HTMLElement>): void;\n  onDragEnd(): void;\n}',
    notes: [
      "空格拾取；上下键/Home/End 调整；Enter/空格完成；Esc 取消。键盘只处理行自身获得焦点的事件，忽略内部按钮或输入法组合。",
      "只接收当前实例的原生拖放；未提供跨列表排序、触摸排序引擎或焦点锁。为触屏保留上移/下移按钮。",
    ],
  },
} satisfies Record<string, ApiDoc>;
