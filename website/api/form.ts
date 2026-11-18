import { p, v, options, type ApiDoc } from "./types";
const source = "src/form/index.ts";
const pathTypes =
  '// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。\n// 例如 "profile.name"、"contacts.0.email"。\n// FieldValue<T, P>：路径 P 对应的值类型。\ntype FormErrors<T> = Partial<Record<FieldPath<T>, string>>;\ntype FormApi<T extends object> = ReturnType<typeof useForm<T>>;';
export const formDocs = {
  useForm: {
    source: "src/form/index.ts",
    generics: [
      {
        name: "T",
        type: "object",
        defaultValue: "无默认类型",
        description: "整个表单值的对象结构，决定字段路径和各字段值的类型。",
      },
    ],
    signature: "useForm<T extends object>(options: FormOptions<T>)",
    parameters: [
      {
        name: "options",
        type: "FormOptions<T>",
        defaultValue: "必填",
        description: "配置对象，字段见下表。",
      },
    ],
    sections: [
      {
        title: "options · 值与校验规则",
        rows: [
          {
            name: "initialValues",
            type: "T",
            defaultValue: "必填",
            description:
              "初始值和 dirty 基准，不随参数变化自动回填；使用 reset(record) 加载其他记录。",
          },
          {
            name: "validators",
            type: "FormValidators<T>",
            defaultValue: "{}",
            description:
              "按字段路径配置 (value, values) => string | undefined | Promise<string | undefined>；字符串为错误，undefined 为通过。",
          },
          {
            name: "schema",
            type: "(values: T) => FormErrors<T> | Promise<FormErrors<T>>",
            defaultValue: "undefined",
            description:
              "整表校验适配函数；返回路径到错误文案的映射。与 validators 合并，同路径字段错误优先。",
          },
        ],
      },
      {
        title: "options · 校验策略",
        rows: [
          {
            name: "mode",
            type: "'onSubmit' | 'onBlur' | 'onChange'",
            defaultValue: "'onSubmit'",
            description: "首次提交之前的自动校验时机。",
          },
          {
            name: "revalidateMode",
            type: "'onBlur' | 'onChange'",
            defaultValue: "'onChange'",
            description: "首次提交之后的自动重验时机，优先于 mode。",
          },
          {
            name: "validateDebounce",
            type: "number",
            defaultValue: "0",
            description:
              "自动校验延迟毫秒；<= 0 立即执行。多个变化字段在同一等待窗口中合并。",
          },
          {
            name: "dependencies",
            type: "Partial<Record<FieldPath<T>, readonly FieldPath<T>[]>>",
            defaultValue: "undefined",
            description:
              '键为依赖字段，数组为源字段。例如 confirm: ["password"]。配置后按受影响路径和传递依赖校验；省略则自动整表校验。',
          },
        ],
      },
      {
        title: "options · 字段生命周期与焦点",
        rows: [
          {
            name: "shouldUnregister",
            type: "boolean",
            defaultValue: "false",
            description:
              "使用 register.ref / getFieldRef 的控件真实卸载后移除值、错误、touched，并跳过该字段校验。默认保留；CSS 隐藏不等于卸载。条件字段应声明为可选属性。",
          },
          {
            name: "shouldFocusError",
            type: "boolean",
            defaultValue: "false",
            description:
              "提交校验失败时聚焦 DOM 顺序中的第一个可聚焦错误字段；需正确绑定 ref，禁用或隐藏节点会跳过。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "values",
        type: "T",
        description: "当前表单值，请保持不可变更新。",
      },
      {
        name: "errors",
        type: "FormErrors<T>",
        description: "字段错误，初始 {}。",
      },
      {
        name: "touched",
        type: "Partial<Record<FieldPath<T>, boolean>>",
        description: "已失焦/手动标记的字段，初始 {}。",
      },
      {
        name: "isDirty",
        type: "boolean",
        description: "values 与当前 reset 基准深比较是否不同。",
      },
      {
        name: "isSubmitting",
        type: "boolean",
        description: "从提交开始到校验和提交回调结束的状态，初始 false。",
      },
      {
        name: "isValidating",
        type: "boolean",
        description: "校验任务是否进行中；防抖等待期间尚未开始校验。",
      },
      {
        name: "submitError",
        type: "unknown",
        description:
          "schema 或提交回调异常；字段校验器异常转为字段错误。修改值、reset 或再次提交会清空。",
      },
      {
        name: "resetCount",
        type: "number",
        description: "每次 reset 递增，用于重建动态数组字段身份。",
      },
      {
        name: "control",
        type: "FormControl<T>",
        description:
          "稳定字段订阅接口，传给 useFormField；不直接修改内部状态。",
      },
    ],
    methods: [
      {
        name: "setFieldValue",
        type: "<P extends FieldPath<T>>(path: P, value: FieldValue<T, P>) => void",
        description:
          "不可变更新指定路径，并按当前策略触发校验；不自动标记 touched。",
      },
      {
        name: "setValues",
        type: "(next: T | ((previous: T) => T)) => void",
        description: "替换整个值对象，不做浅合并；按策略校验。",
      },
      {
        name: "setFieldTouched",
        type: "(path: FieldPath<T>, touched?: boolean) => void",
        description: "标记 touched，默认 true；不单独触发校验。",
      },
      {
        name: "setFieldError",
        type: "(path: FieldPath<T>, message: string | undefined) => void",
        description: "手动设置错误，空字符串或 undefined 清除此错误。",
      },
      {
        name: "register",
        type: "<P extends FieldPath<T>>(path: P) => RegisterBinding",
        description: "返回原生 input/textarea/select 所需绑定，结构见下方。",
      },
      {
        name: "validate",
        type: "(paths?: readonly FieldPath<T>[]) => Promise<boolean>",
        description:
          "立即校验，不受防抖影响；省略 paths 校验全表。路径包含子字段和传递依赖；有 schema 时始终全表。返回本轮选中校验是否通过，不表示未选字段一定无错。",
      },
      {
        name: "handleSubmit",
        type: "(callback: (values: T) => void | Promise<void>) => (event?: { preventDefault(): void }) => Promise<boolean>",
        description:
          "生成提交处理器，先立即整表校验再调用 callback。成功 true，校验失败、失效或回调异常 false；进行中重复提交共用 Promise。",
      },
      {
        name: "reset",
        type: "(next?: T) => void",
        description:
          "默认恢复当前基准；传 next 时将其设为新值和新基准。清空 errors/touched/提交错误，取消待校验并使旧结果失效。",
      },
      {
        name: "resetField",
        type: "<P extends FieldPath<T>>(path: P, options?: { defaultValue?: FieldValue<T, P>; keepError?: boolean; keepTouched?: boolean }) => void",
        description:
          "恢复单个字段及子路径的基准值，默认清除其错误和 touched。传 defaultValue 同时更新该字段 dirty 基准；keepError/keepTouched 默认 false。取消待校验并使旧结果失效，不自动重验。",
      },
      {
        name: "unregister",
        type: "(path: FieldPath<T>, options?: { keepValue?: boolean }) => void",
        description:
          "显式移除字段/子路径的元数据并停用其校验；默认删除值，keepValue: true 保留值。重新绑定 ref 后恢复校验。数组删行请用 useFieldArray.remove。",
      },
      {
        name: "getFieldRef",
        type: "(path: FieldPath<T>) => (node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => void",
        description:
          "获取稳定原生控件 ref 回调，供自定义绑定配合字段生命周期和聚焦。",
      },
      {
        name: "focusField",
        type: "(path: FieldPath<T>) => boolean",
        description:
          "聚焦已挂载、可见且未禁用的原生控件；未找到或无法聚焦返回 false。",
      },
      {
        name: "focusFirstError",
        type: "() => boolean",
        description: "按 DOM 顺序尝试聚焦错误字段；成功返回 true。",
      },
    ],
    types:
      '// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。\n// 例如 "profile.name"、"contacts.0.email"。\n// FieldValue<T, P>：路径 P 对应的值类型。\ntype FormErrors<T> = Partial<Record<FieldPath<T>, string>>;\ntype FormApi<T extends object> = ReturnType<typeof useForm<T>>;\n\n// register 的返回结构（按原生输入控件绑定）\ninterface RegisterBinding {\n  name: string;\n  ref(node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null): void;\n  value: string | number;\n  checked: boolean | undefined;\n  "aria-invalid": boolean;\n  onChange(event: React.ChangeEvent<\n    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement\n  >): void;\n  onBlur(): void;\n}',
    notes: [
      "checkbox 根据 checked 写布尔值。当前字段为 number 时转换输入文本，空值写 NaN。对象值不是原生文本输入值；第三方控件使用 setFieldValue 或 useFormField。",
      "异步旧结果不会覆盖更新后的值；过期 validate 返回 false。schema 抛错写 submitError 并阻止提交，不伪装成字段通过。reset 不会取消已进入业务回调的服务端操作。",
      "register.onBlur 同时标记 touched 并按策略校验。setFieldTouched 只修改标记，不等价于 onBlur。",
      "shouldUnregister 需要保留 register 返回的 ref。schema 仍接收整表值，条件字段须在 schema 中建模为可选；已注销路径的 schema 错误会被过滤。reset 会恢复整表基准并重新启用字段校验。",
    ],
  },
  useFieldArray: {
    source: "src/form/index.ts",
    generics: [
      {
        name: "T",
        type: "object",
        defaultValue: "无默认类型",
        description: "整个表单值的对象结构，不是单个数组项的类型。",
      },
      {
        name: "P",
        type: "FieldPath<T>",
        defaultValue: "无默认类型",
        description:
          "合法字段路径，受 FieldPath<T> 约束；字段值由 FieldValue<T, P> 推导。 此 Hook 进一步限制为值类型是数组的路径。",
      },
    ],
    signature:
      "useFieldArray<T extends object, P extends FieldPath<T>>(\n  form: FormApi<T>,\n  name: P & (FieldValue<T, P> extends readonly unknown[] ? P : never),\n)",
    parameters: [
      {
        name: "form",
        type: "FormApi<T>",
        defaultValue: "必填",
        description: "同一表单 useForm 的返回对象。",
      },
      {
        name: "name",
        type: "P & (FieldValue<T, P> extends readonly unknown[] ? P : never)",
        defaultValue: "必填",
        description:
          "数组路径，例如 contacts 或 profile.addresses；Item 为对应数组元素类型。",
      },
    ],
    returns: [
      {
        name: "fields",
        type: "{ id: string; value: Item }[]",
        description: "用于渲染的行，使用 id 作为 React key；value 为当前行值。",
      },
    ],
    methods: [
      {
        name: "append",
        type: "(item: Item) => void",
        description: "末尾追加一行，分配新 id。",
      },
      {
        name: "remove",
        type: "(index: number) => void",
        description: "按从 0 开始的索引删除，非整数或越界无操作。",
      },
      {
        name: "move",
        type: "(from: number, to: number) => void",
        description: "移动一行并保留其 id；索引越界或相同无操作。",
      },
      {
        name: "replace",
        type: "(items: Item[]) => void",
        description: "替换整个数组，为所有行重新生成 id。",
      },
      {
        name: "prepend",
        type: "(item: Item) => void",
        description: "在开头插入一行并分配新 ID，等价于 insert(0, item)。",
      },
      {
        name: "insert",
        type: "(index: number, item: Item) => void",
        description:
          "在索引位置插入；允许 0 到当前长度。非整数、负值或越界无操作。后续行的 ID 与元数据随记录移动。",
      },
      {
        name: "swap",
        type: "(a: number, b: number) => void",
        description: "交换两行及其 ID、errors、touched；越界/同索引无操作。",
      },
      {
        name: "update",
        type: "(index: number, item: Item) => void",
        description:
          "替换一行的值，保留其 ID、errors、touched；按表单策略重验。越界无操作。",
      },
    ],
    types:
      '// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。\n// 例如 "profile.name"、"contacts.0.email"。\n// FieldValue<T, P>：路径 P 对应的值类型。\ntype FormErrors<T> = Partial<Record<FieldPath<T>, string>>;\ntype FormApi<T extends object> = ReturnType<typeof useForm<T>>;\n\n// 下列 Item 是本文用于简化字段数组签名的说明性别名，不是包导出类型。\n// 例如 T = { contacts: { email: string }[] }、P = \'contacts\' 时，\n// Item<T, P> = { email: string }。\ntype Item<T extends object, P extends FieldPath<T>> =\n  FieldValue<T, P> extends readonly (infer I)[] ? I : never;',
    notes: [
      "insert/prepend/remove/move/swap 使 errors、touched 随原记录重新映射；删除仅移除被删行的元数据，update 保留该行 ID 和元数据。数组根路径的手工错误不自动清空。",
      "replace 为所有行重建 ID 并清除子路径元数据；form.reset 或 resetField(数组/父路径) 也会重建相关 ID。请用 fields[].id 作为 React key，避免直接 setValues 改变数组结构。",
    ],
  },
  useFormField: {
    source,
    generics: [
      {
        name: "T",
        type: "object",
        defaultValue: "无默认类型",
        description:
          "整个表单值的对象结构；具体字段值通过 FieldValue<T, P> 得到。",
      },
      {
        name: "P",
        type: "FieldPath<T>",
        defaultValue: "无默认类型",
        description:
          "合法字段路径，受 FieldPath<T> 约束；字段值由 FieldValue<T, P> 推导。",
      },
    ],
    signature:
      "useFormField<T extends object, P extends FieldPath<T>>(\n  control: FormControl<T>,\n  path: P,\n)",
    parameters: [
      p(
        "control",
        "FormControl<T>",
        "必填",
        "来自 useForm 的稳定 control；与 React.memo 一起传给字段组件。",
      ),
      p("path", "P", "必填", "要订阅的字段路径。"),
    ],
    returns: [
      v("value", "FieldValue<T, P>", "当前路径值，类型随路径推导。"),
      v("error", "string | undefined", "当前字段错误，初始 undefined。"),
      v("touched", "boolean", "当前字段触碰状态，初始 false。"),
    ],
    methods: [
      v(
        "setValue",
        "(value: FieldValue<T, P>) => void",
        "设置此字段并遵循表单校验策略，不接收函数更新。",
      ),
      v(
        "onBlur",
        "() => void",
        "标记此字段 touched，并按表单策略触发失焦校验。",
      ),
    ],
    types:
      pathTypes +
      "\n\ninterface FormControl<T extends object> {\n  subscribe(listener: () => void): () => void;\n  read(path: FieldPath<T>): {\n    value: unknown; error: string | undefined; touched: boolean;\n  };\n  setValue<P extends FieldPath<T>>(path: P, value: FieldValue<T, P>): void;\n  blur(path: FieldPath<T>): void;\n}",
    notes: [
      "订阅缓存按 Object.is 比较 value，错误和 touched 分别比较；请使用不可变值。useForm 的宿主仍随整表状态渲染，React.memo 才能隔离父级带来的无关字段渲染。",
    ],
  },
} satisfies Record<string, ApiDoc>;
