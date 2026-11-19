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
        title: "options · 值来源",
        rows: [
          p(
            "initialValues",
            "T",
            "必填",
            "初始值和 dirty 基准；变化不会自动回填，需要同步外部数据时使用 values 或 reset(record)。",
          ),
          p(
            "values",
            "T",
            "undefined",
            "外部受控数据；深比较发生变化时自动 reset 到新值。配合 resetOptions.keepDirtyValues 保留用户已改的字段。",
          ),
          p(
            "resetOptions",
            "{ keepDirtyValues?: boolean }",
            "{}",
            "values 变化时的重置策略；keepDirtyValues 为 true 时保留已修改字段的值、错误和 touched，且不打断进行中的提交。",
          ),
          p(
            "loadValues",
            "(context: { signal: AbortSignal }) => Promise<T>",
            "undefined",
            "异步加载初始数据（编辑页）；加载期间 isLoading 为 true，成功后作为新基准 reset，失败写入 loadError。卸载或 reloadValues 会中止旧请求。",
          ),
          p(
            "persist",
            "PersistOptions",
            "undefined",
            "草稿持久化：挂载时恢复、修改后防抖保存（默认 300ms）、卸载时立即写入未保存的修改，提交成功后默认清除。exclude 排除文件、密码等路径。",
          ),
        ],
      },
      {
        title: "options · 校验规则",
        rows: [
          p(
            "validators",
            "FormValidators<T>",
            "{}",
            "按字段路径配置 (value, values, { signal, path }) => ValidationResult；支持 rows.*.name 通配路径。返回字符串、false 或 { type, message } 表示失败。",
          ),
          p(
            "schema",
            "(values: T, context: { paths?: string[]; signal: AbortSignal }) => SchemaErrors | Promise<SchemaErrors>",
            "undefined",
            "整表 schema 适配；context.paths 为本次要校验的路径（整表时为 undefined），可只计算相关部分。可直接使用 standardSchema(zod/valibot/arktype) 或 yupSchema(yup)。同路径字段校验器优先。",
          ),
          p(
            "criteriaMode",
            "'firstError' | 'all'",
            "'firstError'",
            "'all' 时收集一个字段所有失败的规则，写入 errorDetails[path].types。",
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
            "首次提交之前的自动校验时机；onBlur/onChange 只校验触发的字段及其 dependencies 中声明的依赖字段，不会让未交互字段提前报错。",
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
            '键为依赖字段，数组为源字段，例如 confirm: ["password"]。源字段变化会重验并中止依赖字段的进行中校验。',
          ),
        ],
      },
      {
        title: "options · 字段生命周期与焦点",
        rows: [
          p(
            "shouldUnregister",
            "boolean",
            "false",
            "使用 register.ref / getFieldRef 的控件真实卸载后移除值、错误、touched，并跳过该字段校验。默认保留；CSS 隐藏不等于卸载。条件字段应声明为可选属性。",
          ),
          p(
            "shouldFocusError",
            "boolean",
            "false",
            "提交校验失败时聚焦 DOM 顺序中的第一个可聚焦错误字段；需正确绑定 ref，禁用或隐藏节点会跳过。",
          ),
        ],
      },
    ],
    returns: [
      v("values", "T", "当前表单值，请保持不可变更新。"),
      v("errors", "FormErrors<T>", "字段错误文案（每个字段一条），初始 {}。"),
      v(
        "errorDetails",
        "FormErrorDetails<T>",
        "字段错误详情 { type, message, types? }；type 为 required、pattern、validate、schema、server、manual 等。",
      ),
      v(
        "touched",
        "Partial<Record<FieldPath<T>, boolean>>",
        "已失焦/手动标记的字段，初始 {}。",
      ),
      v(
        "dirtyFields",
        "Partial<Record<FieldPath<T>, true>>",
        "与基准不同的叶子路径；按修改路径增量计算，不做整表深比较。",
      ),
      v("isDirty", "boolean", "dirtyFields 是否非空。"),
      v(
        "validatingFields",
        "Partial<Record<FieldPath<T>, true>>",
        "正在执行异步校验的字段，可用于单个字段的 loading 提示。",
      ),
      v(
        "isValidating",
        "boolean",
        "是否有字段或 schema 校验进行中；防抖等待期间尚未开始校验。",
      ),
      v(
        "isSubmitting",
        "boolean",
        "从提交开始到校验和提交回调结束的状态，初始 false。",
      ),
      v("submitCount", "number", "提交尝试次数（含校验失败），reset 后归零。"),
      v(
        "isSubmitSuccessful",
        "boolean",
        "最近一次提交是否成功完成回调；再次提交或 reset 时变为 false。",
      ),
      v(
        "submitError",
        "unknown",
        "schema 或提交回调异常；字段校验器异常转为字段错误。修改值、reset 或再次提交会清空。",
      ),
      v("isLoading", "boolean", "loadValues 是否加载中；未配置时为 false。"),
      v("loadError", "unknown", "loadValues 失败原因。"),
      v(
        "resetCount",
        "number",
        "每次完整 reset 递增，用于重建动态数组字段身份。",
      ),
      v(
        "control",
        "FormControl<T>",
        "稳定字段订阅接口，传给 useFormField / useWatch / 字段组件。",
      ),
    ],
    methods: [
      v(
        "setFieldValue",
        "<P extends FieldPath<T>>(path: P, value: FieldValue<T, P>, options?: SetValueOptions) => void",
        "不可变更新指定路径。options.shouldValidate：true 立即校验、false 不校验、省略按策略；shouldTouch 同时标记 touched；shouldDirty: false 把新值作为基准（程序化赋值保持未修改）。",
      ),
      v(
        "setValues",
        "(next: T | ((previous: T) => T), options?: SetValueOptions) => void",
        "替换整个值对象，不做浅合并；选项同 setFieldValue。",
      ),
      v(
        "setFieldTouched",
        "(path: FieldPath<T>, touched?: boolean) => void",
        "标记 touched，默认 true；不单独触发校验。",
      ),
      v(
        "setFieldError",
        "(path: FieldPath<T>, error: string | FieldError | undefined) => void",
        "手动设置单个错误（type 默认 manual），空字符串或 undefined 清除。",
      ),
      v(
        "setErrors",
        "(errors: Partial<Record<FieldPath<T>, string | FieldError | undefined>>, options?: { replace?: boolean }) => void",
        "批量写入错误，适合回填服务端字段错误（type 默认 server）；replace: true 先清空其他错误。",
      ),
      v(
        "register",
        "<P extends FieldPath<T>>(path: P, options?: RegisterOptions) => RegisterBinding",
        "返回原生控件绑定（含 id 和 aria 属性），结构见下方。options 可声明 required/min/max/minLength/maxLength/pattern/validate 规则，以及 value（radio/复选框组）、type: 'file'、valueAsNumber、setValueAs。",
      ),
      v(
        "getErrorProps",
        "(path: FieldPath<T>) => { id: string; 'aria-live': 'polite' }",
        "展开到错误提示元素；其 id 与 register 生成的 aria-describedby / aria-errormessage 对应，读屏会读出错误。",
      ),
      v(
        "getFieldId",
        "(path: FieldPath<T>, value?: string) => string",
        "register 生成的控件 id，用于 <label htmlFor>；radio/复选框组传入选项值。",
      ),
      v(
        "isFieldDirty",
        "(path: FieldPath<T>) => boolean",
        "该路径或其子路径是否已修改。",
      ),
      v(
        "validate",
        "(paths?: readonly FieldPath<T>[]) => Promise<boolean>",
        "立即校验，不受防抖影响；省略 paths 校验全表。每个字段独立运行并可被中止；返回本轮选中校验是否通过，过期返回 false。",
      ),
      v(
        "handleSubmit",
        "<R = T>(onValid: (values: R) => void | Promise<void>, onInvalid?: ((errors, details) => void) | { onInvalid?; transform?: (values: T) => R | Promise<R> }) => (event?) => Promise<boolean>",
        "先整表校验再调用 onValid；校验期间值变化会用最新值重验。失败时调用 onInvalid(errors, details)；transform 在提交前转换数据。成功 true，校验失败、reset 或回调异常 false；进行中重复提交共用 Promise。",
      ),
      v(
        "reset",
        "(next?: T, options?: ResetOptions) => void",
        "默认恢复当前基准；传 next 时将其设为新值和新基准。清空 errors/touched/提交状态并中止进行中的校验。options：keepDirtyValues、keepErrors、keepTouched、keepSubmitCount。",
      ),
      v(
        "resetField",
        "<P extends FieldPath<T>>(path: P, options?: { defaultValue?: FieldValue<T, P>; keepError?: boolean; keepTouched?: boolean }) => void",
        "恢复单个字段及子路径的基准值，默认清除其错误和 touched；传 defaultValue 同时更新基准。中止该字段的进行中校验，不自动重验。",
      ),
      v(
        "unregister",
        "(path: FieldPath<T>, options?: { keepValue?: boolean }) => void",
        "显式移除字段/子路径的元数据和规则并停用其校验；默认删除值，keepValue: true 保留值。重新绑定 ref 后恢复校验。",
      ),
      v(
        "getFieldRef",
        "(path: FieldPath<T>) => (node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => void",
        "获取稳定原生控件 ref 回调，供自定义绑定配合字段生命周期和聚焦。",
      ),
      v(
        "focusField",
        "(path: FieldPath<T>) => boolean",
        "聚焦已挂载、可见且未禁用的原生控件；未找到或无法聚焦返回 false。",
      ),
      v(
        "focusFirstError",
        "() => boolean",
        "按 DOM 顺序尝试聚焦错误字段；成功返回 true。",
      ),
      v("reloadValues", "() => void", "重新执行 loadValues。"),
      v(
        "clearPersisted",
        "() => void",
        "删除 persist 保存的草稿并取消待保存任务。",
      ),
    ],
    types:
      '// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。\n// 例如 "profile.name"、"contacts.0.email"。\n// FieldValue<T, P>：路径 P 对应的值类型。\ntype FormErrors<T> = Partial<Record<FieldPath<T>, string>>;\ninterface FieldError { type: string; message: string; types?: Record<string, string> }\ntype FormErrorDetails<T> = Partial<Record<FieldPath<T>, FieldError>>;\ntype ValidationResult = string | FieldError | boolean | null | undefined\n  | Promise<string | FieldError | boolean | null | undefined>;\ntype Validator<V, T> = (value: V, values: T, context: { signal: AbortSignal; path: string }) => ValidationResult;\ntype FormApi<T extends object> = ReturnType<typeof useForm<T>>;\n\ntype RuleValue<V> = V | { value: V; message: string };\ninterface RegisterOptions {\n  required?: boolean | string;\n  min?: RuleValue<number>; max?: RuleValue<number>;\n  minLength?: RuleValue<number>; maxLength?: RuleValue<number>; // 字符串长度或数组项数\n  pattern?: RuleValue<RegExp>;\n  validate?: Validator<V, T> | Record<string, Validator<V, T>>;\n  value?: string; // radio / 复选框组的选项值\n  type?: "file"; // 文件输入，值为 File[]\n  valueAsNumber?: boolean; // 空输入写 undefined\n  setValueAs?: (raw: string) => unknown;\n}\ninterface RegisterBinding {\n  id: string;\n  name: string;\n  ref(node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null): void;\n  value: string | number | readonly string[] | undefined; // 文件输入为 undefined\n  checked: boolean | undefined;\n  "aria-invalid": boolean;\n  "aria-describedby": string | undefined; // 有错误时指向 getErrorProps(path).id\n  "aria-errormessage": string | undefined;\n  "aria-required": true | undefined;\n  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void;\n  onBlur(): void;\n}\ninterface SetValueOptions { shouldValidate?: boolean; shouldTouch?: boolean; shouldDirty?: boolean }\ninterface ResetOptions { keepDirtyValues?: boolean; keepErrors?: boolean; keepTouched?: boolean; keepSubmitCount?: boolean }\ninterface PersistOptions {\n  key: string;\n  storage?: "local" | "session" | Pick<Storage, "getItem" | "setItem" | "removeItem">;\n  debounce?: number; // 默认 300\n  exclude?: readonly string[];\n  clearOnSubmit?: boolean; // 默认 true\n}\n// 适配器（结构化类型，无需额外依赖）\ndeclare function standardSchema<T>(schema: StandardSchemaLike): FormSchema<T>; // Zod ≥3.24、Valibot ≥1、ArkType ≥2\ndeclare function yupSchema<T>(schema: YupSchemaLike): FormSchema<T>;',
    notes: [
      "渲染按需订阅：values、errors 等返回值是 getter，组件只在读取过的状态变化时重渲染；register(path) 只订阅该路径。把字段交给 useFormField / useWatch 渲染时，修改字段不会重渲染整个表单。",
      "每个字段的异步校验独立运行：字段值变化、reset、resetField 或新一轮校验会中止旧任务（context.signal），旧结果不会覆盖新值；多个字段可以同时校验。",
      "checkbox 根据 checked 写布尔值。字段当前为 number 且未设置 valueAsNumber 时，空值写 NaN。第三方控件使用 setFieldValue、useFormField 或 useWatch。",
      "schema 抛错写 submitError 并阻止提交，不伪装成字段通过。reset 不会取消已进入业务回调的服务端操作。",
      "register.onBlur 同时标记 touched 并按策略校验。setFieldTouched 只修改标记，不等价于 onBlur。",
      "persist 使用 JSON 序列化，File/Blob 等无法序列化的值请放入 exclude。同时配置 loadValues 时，未提交的本地草稿优先于加载的数据。",
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
      "useFieldArray<T extends object, P extends FieldPath<T>>(\n  form: FormApi<T>,\n  name: P & (FieldValue<T, P> extends readonly unknown[] ? P : never),\n  options?: FieldArrayOptions<Item>,\n)",
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
      options("FieldArrayOptions<Item>"),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "getKey",
            "(item: Item, index: number) => string | number",
            "undefined",
            "使用记录自带的稳定标识作为 fields[].id；外部用 setValues 重排数组时 key 仍跟随记录。",
          ),
          p(
            "rules",
            "{ required?; minLength?; maxLength?; validate? }",
            "undefined",
            "数组级规则：required 要求非空，minLength/maxLength 限制行数，validate 自定义；错误写在数组路径上。",
          ),
        ],
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
      "replace 为所有行重建 ID 并清除子路径元数据；form.reset 或 resetField(数组/父路径) 也会重建相关 ID。请用 fields[].id 作为 React key；需要直接 setValues 改变数组结构时，传入 getKey。",
      "行级字段规则可用 validators 的通配路径（如 rows.*.name）统一声明；删除行时该行通过 register 声明的规则会一并移除。",
      "此 Hook 只订阅数组路径本身，行内字段变化不会让使用它的组件重渲染。",
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
      v("dirty", "boolean", "该字段或其子路径是否已修改。"),
      v("validating", "boolean", "该字段是否正在异步校验。"),
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
      "订阅缓存按 Object.is 比较 value，其余字段分别比较；请使用不可变值。宿主组件不读取 values/errors 时，修改该字段不会重渲染表单根组件；配合 React.memo 可隔离父级渲染。",
    ],
  },
  useWatch: {
    source,
    generics: [
      {
        name: "T",
        type: "object",
        defaultValue: "无默认类型",
        description: "整个表单值的对象结构。",
      },
      {
        name: "P",
        type: "FieldPath<T>",
        defaultValue: "省略时订阅整个表单",
        description: "要订阅的字段路径；返回类型由 FieldValue<T, P> 推导。",
      },
    ],
    signature:
      "useWatch<T extends object>(control: FormControl<T>): T\nuseWatch<T extends object, P extends FieldPath<T>>(control: FormControl<T>, path: P): FieldValue<T, P>",
    parameters: [
      p("control", "FormControl<T>", "必填", "来自 useForm 的 control。"),
      p("path", "P", "undefined", "字段路径；省略时返回整个 values。"),
    ],
    returns: [
      v(
        "返回值",
        "FieldValue<T, P> | T",
        "该路径的当前值；只有该值（按 Object.is）变化时才重渲染调用组件。",
      ),
    ],
    types:
      pathTypes +
      "\n\n// 只读订阅：修改值请使用 form.setFieldValue 或 useFormField().setValue。",
    notes: [
      "适合汇总、预览、条件显示等只读场景：放在子组件中使用时，其他字段变化不会让它重渲染，也不会让表单根组件重渲染。",
      "订阅整个表单（省略 path）时，任意字段变化都会重渲染调用组件。",
    ],
  },
} satisfies Record<string, ApiDoc>;
