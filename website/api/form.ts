import { p, v, options, type ApiDoc } from "./types";
const source = "src/form/index.ts";
const pathTypes =
  '// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。\n// 例如 "profile.name"、"contacts.0.email"。\n// FieldValue<T, P>：路径 P 对应的值类型。\ntype FormErrors<T> = Partial<Record<FieldPath<T>, string>>;\ntype FormApi<T extends object> = ReturnType<typeof useForm<T>>;';
export const formDocs = {
  useForm: {
    source,
    signature: "useForm<T extends object>(options: FormOptions<T>)",
    parameters: [options("FormOptions<T>", true)],
    sections: [
      {
        title: "options · 值与校验规则",
        rows: [
          p(
            "initialValues",
            "T",
            "必填",
            "初始值和 dirty 基准，不随参数变化自动回填；使用 reset(record) 加载其他记录。",
          ),
          p(
            "validators",
            "FormValidators<T>",
            "{}",
            "按字段路径配置 (value, values) => string | undefined | Promise<string | undefined>；字符串为错误，undefined 为通过。",
          ),
          p(
            "schema",
            "(values: T) => FormErrors<T> | Promise<FormErrors<T>>",
            "undefined",
            "整表校验适配函数；返回路径到错误文案的映射。与 validators 合并，同路径字段错误优先。",
          ),
        ],
      },
      {
        title: "options · 校验策略",
        rows: [
          p(
            "mode",
            "'onSubmit' | 'onBlur' | 'onChange'",
            "'onSubmit'",
            "首次提交之前的自动校验时机。",
          ),
          p(
            "revalidateMode",
            "'onBlur' | 'onChange'",
            "'onChange'",
            "首次提交之后的自动重验时机，优先于 mode。",
          ),
          p(
            "validateDebounce",
            "number",
            "0",
            "自动校验延迟毫秒；<= 0 立即执行。多个变化字段在同一等待窗口中合并。",
          ),
          p(
            "dependencies",
            "Partial<Record<FieldPath<T>, readonly FieldPath<T>[]>>",
            "undefined",
            '键为依赖字段，数组为源字段。例如 confirm: ["password"]。配置后按受影响路径和传递依赖校验；省略则自动整表校验。',
          ),
        ],
      },
    ],
    returns: [
      v("values", "T", "当前表单值，请保持不可变更新。"),
      v("errors", "FormErrors<T>", "字段错误，初始 {}。"),
      v(
        "touched",
        "Partial<Record<FieldPath<T>, boolean>>",
        "已失焦/手动标记的字段，初始 {}。",
      ),
      v("isDirty", "boolean", "values 与当前 reset 基准深比较是否不同。"),
      v(
        "isSubmitting",
        "boolean",
        "从提交开始到校验和提交回调结束的状态，初始 false。",
      ),
      v(
        "isValidating",
        "boolean",
        "校验任务是否进行中；防抖等待期间尚未开始校验。",
      ),
      v(
        "submitError",
        "unknown",
        "schema 或提交回调异常；字段校验器异常转为字段错误。修改值、reset 或再次提交会清空。",
      ),
      v("resetCount", "number", "每次 reset 递增，用于重建动态数组字段身份。"),
      v(
        "control",
        "FormControl<T>",
        "稳定字段订阅接口，传给 useFormField；不直接修改内部状态。",
      ),
    ],
    methods: [
      v(
        "setFieldValue",
        "<P extends FieldPath<T>>(path: P, value: FieldValue<T, P>) => void",
        "不可变更新指定路径，并按当前策略触发校验；不自动标记 touched。",
      ),
      v(
        "setValues",
        "(next: T | ((previous: T) => T)) => void",
        "替换整个值对象，不做浅合并；按策略校验。",
      ),
      v(
        "setFieldTouched",
        "(path: FieldPath<T>, touched?: boolean) => void",
        "标记 touched，默认 true；不单独触发校验。",
      ),
      v(
        "setFieldError",
        "(path: FieldPath<T>, message: string | undefined) => void",
        "手动设置错误，空字符串或 undefined 清除此错误。",
      ),
      v(
        "register",
        "<P extends FieldPath<T>>(path: P) => RegisterBinding",
        "返回原生 input/textarea/select 所需绑定，结构见下方。",
      ),
      v(
        "validate",
        "(paths?: readonly FieldPath<T>[]) => Promise<boolean>",
        "立即校验，不受防抖影响；省略 paths 校验全表。路径包含子字段和传递依赖；有 schema 时始终全表。返回本轮选中校验是否通过，不表示未选字段一定无错。",
      ),
      v(
        "handleSubmit",
        "(callback: (values: T) => void | Promise<void>) => (event?: { preventDefault(): void }) => Promise<boolean>",
        "生成提交处理器，先立即整表校验再调用 callback。成功 true，校验失败、失效或回调异常 false；进行中重复提交共用 Promise。",
      ),
      v(
        "reset",
        "(next?: T) => void",
        "默认恢复当前基准；传 next 时将其设为新值和新基准。清空 errors/touched/提交错误，取消待校验并使旧结果失效。",
      ),
    ],
    types:
      pathTypes +
      '\n\n// register 的返回结构（按原生输入控件绑定）\ninterface RegisterBinding {\n  name: string;\n  value: string | number;\n  checked: boolean | undefined;\n  "aria-invalid": boolean;\n  onChange(event: React.ChangeEvent<\n    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement\n  >): void;\n  onBlur(): void;\n}',
    notes: [
      "checkbox 根据 checked 写布尔值。当前字段为 number 时转换输入文本，空值写 NaN。对象值不是原生文本输入值；第三方控件使用 setFieldValue 或 useFormField。",
      "异步旧结果不会覆盖更新后的值；过期 validate 返回 false。schema 抛错写 submitError 并阻止提交，不伪装成字段通过。reset 不会取消已进入业务回调的服务端操作。",
      "register.onBlur 同时标记 touched 并按策略校验。setFieldTouched 只修改标记，不等价于 onBlur。",
    ],
  },
  useFieldArray: {
    source,
    signature:
      "useFieldArray<T extends object, P extends FieldPath<T>>(form: FormApi<T>, name: P)",
    parameters: [
      p("form", "FormApi<T>", "必填", "同一表单 useForm 的返回对象。"),
      p(
        "name",
        "P（值必须为数组的 FieldPath<T>）",
        "必填",
        "数组路径，例如 contacts 或 profile.addresses；Item 为对应数组元素类型。",
      ),
    ],
    returns: [
      v(
        "fields",
        "{ id: string; value: Item }[]",
        "用于渲染的行，使用 id 作为 React key；value 为当前行值。",
      ),
    ],
    methods: [
      v("append", "(item: Item) => void", "末尾追加一行，分配新 id。"),
      v(
        "remove",
        "(index: number) => void",
        "按从 0 开始的索引删除，非整数或越界无操作。",
      ),
      v(
        "move",
        "(from: number, to: number) => void",
        "移动一行并保留其 id；索引越界或相同无操作。",
      ),
      v(
        "replace",
        "(items: Item[]) => void",
        "替换整个数组，为所有行重新生成 id。",
      ),
    ],
    types: pathTypes,
    notes: [
      "结构操作清除数组子路径的 errors/touched，再按表单策略重验；不自动清除数组根路径手工错误。form.reset 会重建所有行 id。避免绕过本 Hook 直接改变数组结构。",
    ],
  },
  useFormField: {
    source,
    signature:
      "useFormField<T extends object, P extends FieldPath<T>>(control: FormControl<T>, path: P)",
    parameters: [
      p(
        "control",
        "FormControl<T>",
        "必填",
        "来自 useForm 的稳定 control；与 React.memo 一起传给字段组件。",
      ),
      p("path", "P extends FieldPath<T>", "必填", "要订阅的字段路径。"),
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
