import{D as e}from"./index-C6jdXK2z.js";var t=(e,t,n,r)=>({name:e,type:t,defaultValue:n,description:r}),n=(e,t,n)=>({name:e,type:t,description:n}),r=(e=`object`,n=!1)=>t(`options`,e,n?`必填`:`{}`,`配置对象，字段见下表。`),i=(e=`Element`,n=!1,r=`window`)=>t(`target`,`Target<${e}>`,n?r:`必填`,`DOM 节点、ref、返回节点的函数或 null；null 表示暂不绑定。`),a=`// 库内部通用目标类型，未从包入口导出。
// 调用时直接传 DOM 元素、useRef 的结果或获取函数。
type Target<T> = T | { readonly current: T | null }
  | (() => T | null) | null;`,o=`src/state/index.ts`,s=`src/effects/index.ts`,c=`src/interaction/index.ts`,l=`src/animation/index.ts`,u=e=>`(next: ${e} | ((previous: ${e}) => ${e})) => void`,d=[t(`fn`,`(...args: Args) => Result`,`必填`,`执行时读取最新回调；Args 为参数元组，Result 为回调返回类型。`),t(`wait`,`number`,`300`,`等待毫秒数，负数按 0 处理。变化时取消待执行调用。`)],f={useBoolean:{source:o,signature:`useBoolean(initial?: boolean)`,parameters:[t(`initial`,`boolean`,`false`,`首次渲染的开关状态，后续变化不重置。`)],returns:[n(`value`,`boolean`,`当前状态。`)],methods:[n(`setValue`,u(`boolean`),`直接赋值或函数式更新。`),n(`toggle`,`() => void`,`反转当前状态。`),n(`setTrue`,`() => void`,`设为 true。`),n(`setFalse`,`() => void`,`设为 false。`)]},useToggle:{source:o,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`两个切换值及当前状态的类型。`}],signature:`useToggle<T>(first: T, second: T)`,parameters:[t(`first`,`T`,`必填`,`初始值，同时作为切换的第一个值。`),t(`second`,`T`,`必填`,`切换的第二个值。`)],returns:[n(`value`,`T`,`当前值，初始为 first。`)],methods:[n(`setValue`,u(`T`),`允许直接设置任意 T 值。`),n(`toggle`,`() => void`,`当前值与 first 按 Object.is 相等时切到 second，否则切到 first；使用最新参数。`)]},useSetState:{source:o,generics:[{name:`T`,type:`object`,defaultValue:`无默认类型`,description:`状态对象结构；更新参数为 Partial<T>，只合并顶层字段。`}],signature:`useSetState<T extends object>(initial: T | (() => T))`,parameters:[t(`initial`,`T | (() => T)`,`必填`,`初始对象，或仅初始化时调用的函数。`)],returns:[n(`[0] state`,`T`,`元组第一项：当前对象。`)],methods:[n(`[1] setState`,`(patch: Partial<T> | ((previous: T) => Partial<T>)) => void`,`元组第二项：将 patch 浅合并到旧对象；嵌套对象需自行复制。`)]},useControllableState:{source:o,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`受控值、默认值及变更回调共用的值类型。`}],signature:`useControllableState<T>(
  options: ControllableOptions<T>,
)`,parameters:[r(`ControllableOptions<T>`,!0)],sections:[{title:`options`,rows:[t(`value`,`T`,`undefined`,`非 undefined 时使用受控模式；undefined 不能作为受控值。`),t(`defaultValue`,`T`,`必填`,`仅作为非受控初始值。`),t(`onChange`,`(value: T) => void`,`undefined`,`新旧值按 Object.is 不同时通知；受控模式需由父级更新 value。`)]}],returns:[n(`[0] value`,`T`,`元组第一项：当前受控或内部值。`)],methods:[n(`[1] setValue`,u(`T`),`元组第二项：计算新值并通知 onChange；非受控时同时更新内部值。`)]},useLatest:{source:o,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`ref.current 保存的值类型。`}],signature:`useLatest<T>(value: T)`,parameters:[t(`value`,`T`,`必填`,`每次渲染写入 ref.current 的值。`)],returns:[n(`current`,`T`,`返回 ref 对象中的 current 属性，始终对应最近一次渲染值。修改 current 不会引发渲染。`)]},useMemoizedFn:{source:o,generics:[{name:`Args`,type:`unknown[]`,defaultValue:`无默认类型`,description:`函数参数元组，例如 [id: string, page: number]；调用时按元组顺序传参。`},{name:`Result`,type:`unknown`,defaultValue:`无默认类型`,description:`原始回调的返回类型；异步回调可为 Promise<R>，具体方法的返回值见下表。`}],signature:`useMemoizedFn<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
)`,parameters:[d[0]],returns:[n(`callback`,`(...args: Args) => Result`,`稳定引用；调用时执行最新 fn，并透传参数、返回值及异常，不改变同步/异步语义。`)]},useDebounce:{source:s,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`输入值与防抖结果共用的类型。`}],signature:`useDebounce<T>(value: T, wait?: number)`,parameters:[t(`value`,`T`,`必填`,`需要延迟更新的值；初始返回此值。`),d[1]],returns:[n(`debounced`,`T`,`连续 wait 毫秒没有变化后更新的值；等待期间保留上一次值。`)]},useDebounceFn:{source:s,generics:[{name:`Args`,type:`unknown[]`,defaultValue:`无默认类型`,description:`函数参数元组，例如 [id: string, page: number]；调用时按元组顺序传参。`},{name:`Result`,type:`unknown`,defaultValue:`无默认类型`,description:`原始回调的返回类型；异步回调可为 Promise<R>，具体方法的返回值见下表。`}],signature:`useDebounceFn<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  wait?: number,
)`,parameters:d,returns:[],methods:[n(`run`,`(...args: Args) => void`,`重启尾沿计时，最终只使用最近一次参数；不返回回调结果。`),n(`cancel`,`() => void`,`清除定时器和待执行参数。`),n(`flush`,`() => Result | undefined`,`立即执行待处理调用并返回结果；没有待处理调用时返回 undefined。`)]},useThrottleFn:{source:s,generics:[{name:`Args`,type:`unknown[]`,defaultValue:`无默认类型`,description:`函数参数元组，例如 [id: string, page: number]；调用时按元组顺序传参。`},{name:`Result`,type:`unknown`,defaultValue:`无默认类型`,description:`原始回调的返回类型；异步回调可为 Promise<R>，具体方法的返回值见下表。`}],signature:`useThrottleFn<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  wait?: number,
)`,parameters:d,returns:[],methods:[n(`run`,`(...args: Args) => Result | undefined`,`首次立即执行并返回结果；窗口内只保留最后参数供尾沿执行，此时返回 undefined。`),n(`cancel`,`() => void`,`清除尾沿任务并重置窗口，下一次 run 可立即执行。`),n(`flush`,`() => Result | undefined`,`有尾沿任务时立即执行并更新窗口起点；无任务返回 undefined。`)]},useInterval:{source:s,signature:`useInterval(
  callback: () => void,
  delay: number | null,
  immediate?: boolean,
)`,parameters:[t(`callback`,`() => void`,`必填`,`每轮执行的最新回调；异步工作不会被等待，应自行处理重叠与异常。`),t(`delay`,`number | null`,`必填`,`毫秒间隔，最小 1；null 暂停并清除定时器。`),t(`immediate`,`boolean`,`false`,`启用或重新设置间隔时先执行一次；delay 为 null 时不执行。`)],returns:[n(`返回值`,`void`,`只管理定时器，不返回控制对象。通过 delay 暂停/恢复。`)]},useDisclosure:{source:c,signature:`useDisclosure(initial?: boolean)`,parameters:[t(`initial`,`boolean`,`false`,`首次渲染是否打开。`)],returns:[n(`isOpen`,`boolean`,`当前是否打开。`)],methods:[n(`open`,`() => void`,`打开。`),n(`close`,`() => void`,`关闭。`),n(`toggle`,`() => void`,`反转开关。`)]},useEditor:{source:c,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`编辑对象的类型；此 Hook 无入参，建议显式指定，如 useEditor<Article>()。打开编辑器时传入该类型的数据。`}],signature:`useEditor<T>()`,parameters:[],returns:[n(`isOpen`,`boolean`,`面板开关，初始 false。`),n(`mode`,`'create' | 'edit'`,`当前操作模式，初始 'create'。`),n(`record`,`T | null`,`编辑对象，初始 null；仅保存引用，不复制数据。`)],methods:[n(`create`,`() => void`,`打开新建面板，清空 record。`),n(`edit`,`(record: T) => void`,`保存记录并打开编辑面板。`),n(`close`,`() => void`,`关闭面板，保留 mode 和 record。`)]},useAsyncAction:{source:c,generics:[{name:`Args`,type:`unknown[]`,defaultValue:`无默认类型`,description:`函数参数元组，例如 [id: string, page: number]；调用时按元组顺序传参。`},{name:`Result`,type:`unknown`,defaultValue:`无默认类型`,description:`异步操作成功后的结果类型；action 与 run 的返回值均为 Promise<Result>。`}],signature:`useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
)`,parameters:[t(`action`,`(...args: Args) => Promise<Result>`,`必填`,`异步操作；同步抛出的异常也会转换为 Promise 拒绝。`)],returns:[n(`loading`,`boolean`,`操作是否进行中，初始 false。`),n(`error`,`unknown`,`最近一次失败；新操作开始时清空为 undefined。`)],methods:[n(`run`,`(...args: Args) => Promise<Result>`,`进行中重复调用返回同一个 Promise，忽略新参数；失败会拒绝，调用方需 catch。`)]},useDirty:{source:c,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`当前值与基准快照共用的类型。`}],signature:`useDirty<T>(
  value: T,
  options?: {
    initialValue?: T;
    isEqual?: (a: T, b: T) => boolean;
  },
)`,parameters:[t(`value`,`T`,`必填`,`当前不可变数据。`),r(`{
    initialValue?: T;
    isEqual?: (a: T, b: T) => boolean;
}`,!1)],sections:[{title:`options`,rows:[t(`initialValue`,`T`,`首次 value`,`初始比较基准；后续变化不自动更新基准。`),t(`isEqual`,`(a: T, b: T) => boolean`,`内置 equal`,`比较基准与当前值；相等返回 true。默认支持普通对象、数组、Date 和基本类型。`)]}],returns:[n(`isDirty`,`boolean`,`当前值与基准不相等。`),n(`baseline`,`T`,`当前基准引用。`)],methods:[n(`reset`,`(next?: T) => void`,`更新基准，省略 next 时使用当前 value；不修改 value。`)]},usePermission:{source:c,signature:`usePermission(permissions: Iterable<string>)`,parameters:[t(`permissions`,`Iterable<string>`,`必填`,`当前权限集合；每次渲染重新读取，精确匹配字符串。`)],returns:[],methods:[n(`has`,`(permission: string) => boolean`,`是否包含指定权限。`),n(`hasAll`,`(required: readonly string[]) => boolean`,`是否拥有全部权限；空数组为 true。`),n(`hasAny`,`(required: readonly string[]) => boolean`,`是否拥有至少一个权限；空数组为 false。`)]},useReducedMotion:{source:l,signature:`useReducedMotion()`,parameters:[],returns:[n(`reduced`,`boolean`,`系统是否匹配 prefers-reduced-motion: reduce；SSR 初始 false。`)]},useRafLoop:{source:l,signature:`useRafLoop(
  callback: (frame: { time: number; delta: number }) => void,
  autoStart?: boolean,
)`,parameters:[t(`callback`,`(frame: {
    time: number;
    delta: number;
}) => void`,`必填`,`time 为 RAF 时间戳；delta 为距离上一帧的毫秒数，启动后的第一帧为 0。`),t(`autoStart`,`boolean`,`true`,`挂载自动启动；改为 false 时停止。`)],returns:[n(`running`,`boolean`,`当前循环是否启用；初始 false，挂载后根据 autoStart 更新。`)],methods:[n(`start`,`() => void`,`开始循环；已运行或没有 RAF 时无操作。`),n(`stop`,`() => void`,`取消下一帧，清除时间基准，running 变为 false。`)]},useAnimate:{source:l,signature:`useAnimate(
  target: Target<Element>,
  options?: {
    respectReducedMotion?: boolean;
  },
)`,parameters:[i(),r(`{
    respectReducedMotion?: boolean;
}`,!1)],sections:[{title:`options`,rows:[t(`respectReducedMotion`,`boolean`,`true`,`遵循减少动态效果偏好，将时长与延迟归零、次数设为 1。`)]}],returns:[n(`status`,`'idle' | 'running' | 'paused' | 'finished'`,`动画状态，初始 'idle'。`)],methods:[n(`play`,`(keyframes: Keyframe[] | PropertyIndexedKeyframes, timing?: number | KeyframeAnimationOptions) => Animation | null`,`取消旧动画后播放；timing 默认 300ms。目标不存在或不支持 animate 返回 null；原生参数异常直接抛出。`),n(`pause`,`() => void`,`暂停当前动画，没有动画时无操作。`),n(`resume`,`() => void`,`继续当前动画。`),n(`reverse`,`() => void`,`反向播放当前动画。`),n(`cancel`,`() => void`,`取消并移除动画效果，恢复 idle。`)],types:a}},p=`src/browser/index.ts`,m=[n(`width`,`number`,`宽度，单位 CSS px；初始 0。`),n(`height`,`number`,`高度，单位 CSS px；初始 0。`)],h={source:p,parameters:[t(`key`,`string`,`必填`,`存储键；变化时切换监听并读取新键。`),t(`initial`,`T`,`必填`,`键不存在或读取失败时的值，同时是 SSR 初始值。需可 JSON 序列化。`)],returns:[n(`value`,`T`,`当前值，挂载后从存储同步。解析 JSON 不等于验证业务类型。`),n(`error`,`unknown`,`最近一次读取、解析或写入错误；成功时清空为 undefined。`)],methods:[n(`setValue`,`(next: T | ((previous: T) => T)) => void`,`写入 JSON，函数更新读取存储中的最新值。失败仅记录 error，不抛出。`),n(`remove`,`() => void`,`删除键并恢复最新 initial 值，通知当前文档中的同类 Hook 实例。`)]},g={useEventListener:{source:p,generics:[{name:`E`,type:`Event`,defaultValue:`Event`,description:`DOM 事件类型，例如 MouseEvent 或 KeyboardEvent；需要与事件名称对应。`}],signature:`useEventListener<E extends Event = Event>(
  type: string,
  listener: (event: E) => void,
  target?: Target<EventTarget>,
  options?: AddEventListenerOptions,
)`,parameters:[t(`type`,`string`,`必填`,`原生 DOM 事件名称，不带 on 前缀。`),t(`listener`,`(event: E) => void`,`必填`,`使用最新回调；E 仅提供静态类型约束，请与事件名称匹配。`),i(`EventTarget`,!0),r(`AddEventListenerOptions`,!1)],sections:[{title:`options · 原生事件选项`,rows:[t(`capture`,`boolean`,`false`,`捕获阶段监听。`),t(`once`,`boolean`,`false`,`原生监听器触发一次后移除；组件重新提交会重新绑定。`),t(`passive`,`boolean`,`浏览器默认`,`显式为 true 时不可使用 preventDefault。`),t(`signal`,`AbortSignal`,`undefined`,`外部取消信号；abort 时浏览器移除监听器。`)]}],returns:[n(`返回值`,`void`,`随 React 提交绑定和清理监听器，无额外控制方法。`)],types:a},useMediaQuery:{source:p,signature:`useMediaQuery(query: string, serverValue?: boolean)`,parameters:[t(`query`,`string`,`必填`,`传给 matchMedia 的媒体查询，例如 (min-width: 768px)。`),t(`serverValue`,`boolean`,`false`,`SSR、hydration 初值以及没有 matchMedia 时的回退值。`)],returns:[n(`matches`,`boolean`,`当前是否匹配，随媒体查询 change 事件更新。`)]},useWindowSize:{source:p,signature:`useWindowSize()`,parameters:[],returns:m,notes:[`读取 window.innerWidth / innerHeight；监听 resize。`]},useElementSize:{source:p,signature:`useElementSize(target: Target<Element>)`,parameters:[i()],returns:m,types:a,notes:[`从 getBoundingClientRect 读取包含边框的尺寸；没有 ResizeObserver 时仅在 window.resize 重新测量。`]},useIntersectionObserver:{source:p,signature:`useIntersectionObserver(
  target: Target<Element>,
  options?: IntersectionObserverInit,
)`,parameters:[i(),r(`IntersectionObserverInit`,!1)],sections:[{title:`options`,rows:[t(`root`,`Element | Document | null`,`null`,`交叉计算的根容器；null 使用视口。`),t(`rootMargin`,`string`,`'0px'`,`根容器边界偏移，使用原生 CSS margin 格式。`),t(`threshold`,`number | number[]`,`0`,`交叉比例阈值，范围 0–1。非法原生配置可能抛错。`)]}],returns:[n(`entry`,`IntersectionObserverEntry | null`,`最近一次观察结果；初始或 API 不可用为 null。可读取 isIntersecting、intersectionRatio、boundingClientRect 等原生字段。`)],types:a},useScroll:{source:p,signature:`useScroll(target?: Target<Element>)`,parameters:[i(`Element`,!0)],returns:[n(`x`,`number`,`水平滚动偏移，CSS px；初始 0。`),n(`y`,`number`,`垂直滚动偏移，CSS px；初始 0。`)],types:a},useClickOutside:{source:p,signature:`useClickOutside(
  target: Target<Element>,
  callback: (event: PointerEvent) => void,
  enabled?: boolean,
)`,parameters:[i(),t(`callback`,`(event: PointerEvent) => void`,`必填`,`document 的 pointerdown 路径不包含目标节点时触发；不是 click 事件。`),t(`enabled`,`boolean`,`true`,`false 时保留绑定但不触发回调；目标为空也不触发。`)],returns:[n(`返回值`,`void`,`无返回对象，卸载自动清理。`)],types:a},useKeyPress:{source:p,signature:`useKeyPress(
  keys: string | readonly string[],
  callback: (event: KeyboardEvent) => void,
  options?: KeyPressOptions,
)`,parameters:[t(`keys`,`string | readonly string[]`,`必填`,`单键或组合键；数组中任一匹配即可。支持 mod+s、ctrl+shift+plus、space、esc 和字面量 +。`),t(`callback`,`(event: KeyboardEvent) => void`,`必填`,`匹配 keydown 时触发，使用最新回调；输入法组合期间忽略。`),r(`KeyPressOptions`,!1)],sections:[{title:`options`,rows:[t(`enabled`,`boolean`,`true`,`是否启用当前绑定。`),t(`allowInInput`,`boolean`,`false`,`是否允许在 input、textarea、select、contenteditable 内触发。`),t(`target`,`Target<EventTarget>`,`window`,`监听目标；null 不监听。`),t(`scope`,`Target<HTMLElement>`,`undefined`,`仅事件目标位于该容器内时匹配；省略表示不限制范围。`),t(`priority`,`number`,`0`,`同一监听目标下数值高者优先，同优先级后注册优先。`),t(`preventDefault`,`boolean`,`false`,`匹配后阻止默认行为并停止后续 Hook 绑定执行。`),t(`stopPropagation`,`boolean`,`false`,`匹配后停止事件冒泡并停止后续 Hook 绑定执行。`),t(`repeat`,`boolean`,`true`,`是否接受长按重复 keydown。`),t(`platform`,`'mac' | 'windows'`,`自动检测`,`决定 mod 映射为 meta 或 ctrl；可覆盖平台判断。`)]}],returns:[n(`返回值`,`void`,`只注册快捷键。`)],types:a,notes:[`组合键严格匹配全部修饰键；单键只比较 event.key，忽略附带修饰键。cmd/control/option 分别是 meta/ctrl/alt 的别名。独占只协调同一目标上的本库绑定，不阻止其他独立监听器。`]},useClipboard:{source:p,signature:`useClipboard()`,parameters:[],returns:[n(`copied`,`boolean`,`最近一次已生效的复制是否成功；初始 false，不自动倒计时复位。`),n(`error`,`unknown`,`最近复制错误；初始 undefined，成功或 reset 时清空。`)],methods:[n(`copy`,`(text: string) => Promise<boolean>`,`写入剪贴板；成功 true，失败 false 并记录 error。需安全上下文与浏览器授权。`),n(`reset`,`() => void`,`复位状态并使未完成复制的状态更新失效；不清除系统剪贴板。`)]},useOnline:{source:p,signature:`useOnline()`,parameters:[],returns:[n(`online`,`boolean`,`navigator.onLine 的当前值，SSR 为 true；只反映浏览器联网判断，不保证某个接口可达。`)]},usePageVisibility:{source:p,signature:`usePageVisibility()`,parameters:[],returns:[n(`visibility`,`DocumentVisibilityState`,`'visible' 或 'hidden'；SSR 为 'visible'。监听 visibilitychange。这个状态不等同于窗口焦点。 `)]},useCountdown:{source:p,signature:`useCountdown(
  target: number | null,
  options?: {
    interval?: number;
    onEnd?: () => void;
  },
)`,parameters:[t(`target`,`number | null`,`必填`,`结束时间的 Unix 毫秒时间戳；例如 Date.now() + 60000。null 停止。`),r(`{
    interval?: number;
    onEnd?: () => void;
}`,!1)],sections:[{title:`options`,rows:[t(`interval`,`number`,`1000`,`刷新间隔毫秒，最小 16；临近结束时缩短到剩余时长。`),t(`onEnd`,`() => void`,`undefined`,`到达结束时间时触发，同一个已结束时间戳不重复通知；先设 null 可重置记录。`)]}],returns:[n(`remaining`,`number`,`剩余毫秒，最小 0，初始 0；每次从目标时间重新计算，非累计减法。`),n(`seconds`,`number`,`Math.ceil(remaining / 1000)，向上取整。`),n(`finished`,`boolean`,`target 非 null 且 remaining 为 0；挂载前 remaining 为 0，因此不要以初始 finished 替代 onEnd。`)]},useLocalStorageState:{...h,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`存储值的类型，由 initial 推断；读取 JSON 后仍需业务校验。`}],signature:`useLocalStorageState<T>(key: string, initial: T)`,notes:[`使用 localStorage；同步本标签页的 Hook 写入和同源其他文档的 storage 事件。直接 localStorage.setItem 不会向当前文档发送 storage 事件。`]},useSessionStorageState:{...h,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`存储值的类型，由 initial 推断；读取 JSON 后仍需业务校验。`}],signature:`useSessionStorageState<T>(key: string, initial: T)`,notes:[`使用 sessionStorage；按浏览器会话隔离，不提供跨标签页同步。当前文档的同类 Hook 实例会同步。`]},useUrlState:{source:p,signature:`useUrlState(
  initial?: Record<string, string>,
  mode?: "replace" | "push",
)`,parameters:[t(`initial`,`Record<string, string>`,`{}`,`缺少对应 URL 参数时的默认值，同时作为 SSR 初始值。`),t(`mode`,`"replace" | "push"`,`'replace'`,`replace 替换当前历史条目；push 增加可后退条目。`)],returns:[n(`[0] state`,`Record<string, string>`,`默认值与全部查询参数合并，URL 优先；重复键使用最后一个值，所有值均为字符串。`)],methods:[n(`[1] setState`,`(patch: Record<string, string | null>) => void`,`合并写入查询参数；null 删除键，删除后读取可能回退到 initial。保留其他参数、hash 与 history.state；不接收函数更新。`)],notes:[`监听 popstate 和本库 URL 更新事件。第三方直接 pushState/replaceState 不会自动通知；接入路由器时使用其官方状态接口。`]}},_=`src/data/index.ts`,v=[n(`data`,`T | undefined`,`最近一次成功数据，初始为 initialData；重跑、失败或取消不会清空已有数据。`),n(`error`,`unknown`,`最近一次终止请求的错误；初始 undefined，新请求开始时清空，AbortError 不作为失败展示。`),n(`loading`,`boolean`,`请求周期中的加载状态；初始 false。`),n(`fetching`,`boolean`,`实际请求及重试等待状态；初始 false。`),n(`retryCount`,`number`,`本轮已安排的重试次数，初始及新一轮开始时为 0；首次请求不计入。`)],y=[n(`run`,`(...args: Args) => void`,`开始新一轮请求并取消旧一轮；拒绝被内部处理，通过 error 读取失败。`),n(`runAsync`,`(...args: Args) => Promise<T>`,`与 run 相同，但返回成功数据；最终失败、超时或取消会拒绝，需要 catch。`),n(`refresh`,`() => void`,`使用最近 run 参数或 defaultParams 重跑；无参数记录时不发请求。`),n(`refreshAsync`,`() => Promise<T>`,`返回刷新结果；没有可用参数时拒绝 Error("No previous request parameters.")。`),n(`cancel`,`() => void`,`取消当前 signal、重试等待和轮询，停止自动刷新并将 loading 置 false；之后 run/refresh 可重新启动。`),n(`mutate`,`(next: T | ((previous: T | undefined) => T)) => void`,`只更新本地 data，不发请求；若有进行中的请求会将其中止，避免旧响应覆盖手动数据（不会停止轮询）。`)],b={useRequest:{source:`src/data/index.ts`,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`服务成功返回的数据类型；service 返回 Promise<T>。`},{name:`Args`,type:`unknown[]`,defaultValue:`[]`,description:`函数参数元组，例如 [id: string, page: number]；调用时按元组顺序传参。`}],signature:`useRequest<T, Args extends unknown[] = []>(
  service: RequestService<T, Args>,
  options?: RequestOptions<T, Args>,
)`,parameters:[{name:`service`,type:`RequestService<T, Args>`,defaultValue:`必填`,description:`服务函数；接收取消信号和 run 传入的参数。T 为成功数据，Args 为参数元组，例如 [id: string]。`},{name:`options`,type:`RequestOptions<T, Args>`,defaultValue:`{}`,description:`配置对象，字段见下表。`}],sections:[{title:`options · 执行与数据`,rows:[{name:`manual`,type:`boolean`,defaultValue:`true`,description:`false 时挂载自动执行；必须同时传 defaultParams，即使无参数也传 []。`},{name:`defaultParams`,type:`Args`,defaultValue:`undefined`,description:`自动请求初始参数，也可供首次 refresh 和事件刷新使用；后续变化不会自动重跑。`},{name:`initialData`,type:`T`,defaultValue:`undefined`,description:`首次 data 值，后续变化不自动覆盖 data。`},{name:`onSuccess`,type:`(data: T, args: Args) => void`,defaultValue:`undefined`,description:`当前有效请求成功后调用一次；不针对每次尝试单独触发。`},{name:`onError`,type:`(error: unknown, args: Args) => void`,defaultValue:`undefined`,description:`重试结束后的最终失败触发；取消或过期请求不触发。`},{name:`ready`,type:`boolean`,defaultValue:`true`,description:`false 阻止手动与自动请求，并取消当前请求；runAsync 以 RequestNotReadyError 拒绝。恢复 true 时仅 manual: false 自动执行。`},{name:`refreshDeps`,type:`React.DependencyList`,defaultValue:`[]`,description:`逐项 Object.is 比较；变化时仅 manual: false 自动重跑，使用最新 defaultParams。请避免每次创建新对象作为依赖。`},{name:`loadingDelay`,type:`number`,defaultValue:`0`,description:`延迟展示 loading 的毫秒数；快速完成时不闪烁。fetching 始终立即反映请求生命周期；负值或非有限值按 0。`},{name:`onBefore`,type:`(args: Args) => void`,defaultValue:`undefined`,description:`有效请求开始时调用一次，重试不重复调用。ready: false 不触发。`},{name:`onFinally`,type:`(data: T | undefined, error: unknown, args: Args) => void`,defaultValue:`undefined`,description:`当前有效请求成功或最终失败后调用一次；成功时 error 为 undefined，失败时 data 为 undefined。取消、被替换、卸载不触发。`}]},{title:`options · 重试与超时`,rows:[{name:`retry`,type:`number`,defaultValue:`0`,description:`首次失败后最多额外尝试次数；有限非负整数，向下取整。默认不重试。`},{name:`retryDelay`,type:`number | ((retryNumber: number, error: unknown) => number)`,defaultValue:`指数退避`,description:`等待毫秒；retryNumber 从 1 起。默认 1000 × 2^(n−1)，最大 30000。自定义负值按 0，非有限值回退 1000。`},{name:`shouldRetry`,type:`(error: unknown, retryNumber: number, args: Args) => boolean`,defaultValue:`undefined`,description:`在次数额度内判断是否继续；返回 false 结束。AbortError 始终不重试。`},{name:`timeout`,type:`number`,defaultValue:`undefined`,description:`每次尝试的超时毫秒，> 0 启用；不包含退避等待。超时以 RequestTimeoutError 拒绝，并取消该次 signal。`}]},{title:`options · 轮询与自动刷新`,rows:[{name:`pollingInterval`,type:`number`,defaultValue:`undefined`,description:`> 0 开启轮询；每轮完成后等待该毫秒数再刷新，不与该轮请求重叠。`},{name:`pollingWhenHidden`,type:`boolean`,defaultValue:`true`,description:`false 时页面隐藏后暂停后续轮询；不取消已经运行的请求。`},{name:`refreshOnFocus`,type:`boolean`,defaultValue:`false`,description:`窗口获得焦点或文档恢复可见时刷新。`},{name:`refreshOnReconnect`,type:`boolean`,defaultValue:`false`,description:`收到 window.online 时刷新；不代表服务已恢复可用。`},{name:`refreshThrottleInterval`,type:`number`,defaultValue:`1000`,description:`聚焦/网络刷新共用的最小间隔毫秒；不节流手动 run/refresh 或轮询。`}]}],returns:[{name:`data`,type:`T | undefined`,description:`最近一次成功数据，初始为 initialData；重跑、失败或取消不会清空已有数据。`},{name:`error`,type:`unknown`,description:`最近一次终止请求的错误；初始 undefined，新请求开始时清空，AbortError 不作为失败展示。`},{name:`loading`,type:`boolean`,description:`loadingDelay 到期后显示加载状态；请求完成或取消立即恢复 false，初始 false。`},{name:`retryCount`,type:`number`,description:`本轮已安排的重试次数，初始及新一轮开始时为 0；首次请求不计入。`},{name:`fetching`,type:`boolean`,description:`包含执行及重试等待的真实请求状态；不受 loadingDelay 影响，初始 false。`}],methods:[{name:`run`,type:`(...args: Args) => void`,description:`开始新一轮请求并取消旧一轮；拒绝被内部处理，通过 error 读取失败。`},{name:`runAsync`,type:`(...args: Args) => Promise<T>`,description:`与 run 相同，但返回成功数据；最终失败、超时或取消会拒绝，需要 catch。`},{name:`refresh`,type:`() => void`,description:`使用最近 run 参数或 defaultParams 重跑；无参数记录时不发请求。`},{name:`refreshAsync`,type:`() => Promise<T>`,description:`返回刷新结果；没有可用参数时拒绝 Error("No previous request parameters.")。`},{name:`cancel`,type:`() => void`,description:`取消当前 signal、重试等待和轮询，停止自动刷新并将 loading 置 false；之后 run/refresh 可重新启动。`},{name:`mutate`,type:`(next: T | ((previous: T | undefined) => T)) => void`,description:`只更新本地 data，不发请求；若有进行中的请求会将其中止，避免旧响应覆盖手动数据（不会停止轮询）。`}],types:`interface RequestContext { signal: AbortSignal }
type RequestService<T, Args extends unknown[]> =
  (context: RequestContext, ...args: Args) => Promise<T>;

// manual: false 必须同时提供 defaultParams: Args。
// 可从包入口导入 RequestOptions、RequestService、RequestContext。
declare class RequestTimeoutError extends Error {
  constructor(timeout: number);
  timeout: number; // 本次尝试的超时毫秒
}

declare class RequestNotReadyError extends Error {
  constructor(); // name 为 "NotReadyError"
}`,notes:[`默认手动执行；manual: false 的挂载请求在 React Strict Mode 开发环境可能启动两轮，前一轮会取消。写操作由用户事件触发，并按业务保证幂等性。`,`新调用、cancel 和卸载使旧请求失效，旧结果不会覆盖新状态。服务应透传 signal 到 fetch；Hook 不能回滚已经发生的服务端写入。`,`自动刷新需要可用参数，且跳过进行中、页面隐藏或已 cancel 的状态；manual: true 配合 defaultParams 也可以被已启用的事件刷新触发。`,`轮询在成功和最终失败后都可能继续；onSuccess/onError 请自行处理其内部异常。这里只做实例内请求管理，不提供共享缓存、请求合并或乐观更新。`,`ready 关闭会终止当前周期。refreshDeps 不改变手动模式；ready 和依赖同时变化只按最终配置自动执行。生命周期回调应自行处理内部异常；onBefore 抛错会作为本轮失败处理。`]},usePagination:{source:_,signature:`usePagination(options?: PaginationOptions)`,parameters:[r(`PaginationOptions`,!1)],sections:[{title:`options`,rows:[t(`initialPage`,`number`,`1`,`初始页码，从 1 开始；后续参数变化不重置内部页码。`),t(`initialPageSize`,`number`,`10`,`初始每页条数，有限正整数。`),t(`total`,`number`,`undefined`,`总记录数；省略时不限制最大页码。不执行分页请求或切分数组。`)]}],returns:[n(`page`,`number`,`当前页码；total 已知时限制在有效页范围。`),n(`pageSize`,`number`,`当前每页条数。`),n(`total`,`number | undefined`,`当前总数，负值按 0。`),n(`pageCount`,`number | undefined`,`已知 total 时向上取整，最小 1；未知时 undefined。`)],methods:[n(`setPage`,`(page: number) => void`,`向下取整并限制范围；非有限值回退 1。`),n(`setPageSize`,`(size: number) => void`,`设置每页条数并回到第 1 页；非有限值回退 10。`),n(`next`,`() => void`,`前进一页，到末页时不越界。`),n(`previous`,`() => void`,`后退一页，不小于 1。`),n(`reset`,`() => void`,`回到第 1 页，保留 pageSize。`)]},useSearch:{source:_,generics:[{name:`T`,type:`object`,defaultValue:`无默认类型`,description:`筛选条件对象的结构。`}],signature:`useSearch<T extends object>(initial: T)`,parameters:[t(`initial`,`T`,`必填`,`初始筛选对象与 reset 基准；后续变化不重置。`)],returns:[n(`draft`,`T`,`正在编辑的筛选条件。`),n(`submitted`,`T`,`上一次提交的条件。`),n(`revision`,`number`,`初始 0，每次 submit/reset 加 1；相同条件也能触发重新查询。`)],methods:[n(`setDraft`,`(patch: Partial<T>) => void`,`浅合并草稿，不影响 submitted。`),n(`replaceDraft`,`(next: T) => void`,`整体替换草稿（不合并旧字段），不影响 submitted。`),n(`submit`,`() => void`,`将当前草稿提交，并递增 revision。`),n(`reset`,`() => void`,`草稿与已提交条件同时恢复 initial，并递增 revision。`)]},useSelection:{source:`src/data/index.ts`,generics:[{name:`Key`,type:`string | number`,defaultValue:`无默认类型`,description:`选择项唯一标识的类型，仅允许 string 或 number。`}],signature:`useSelection<Key extends string | number>(keys: readonly Key[], options?: SelectionOptions<Key>)`,parameters:[{name:`keys`,type:`readonly Key[]`,defaultValue:`必填`,description:`当前页可选项的唯一稳定 ID，Key 为 string 或 number。`},{name:`options`,type:`SelectionOptions<Key>`,defaultValue:`{}`,description:`配置对象，字段见下表。`}],sections:[{title:`options`,rows:[{name:`preserve`,type:`boolean`,defaultValue:`false`,description:`false 时只保留当前 keys 中的选中项；true 时保留跨页选中。`},{name:`resetKey`,type:`unknown`,defaultValue:`undefined`,description:`按内置深比较变化时清空全部选择；适合使用已提交的筛选条件。`},{name:`disabledKeys`,type:`readonly Key[]`,defaultValue:`[]`,description:`禁止选中的 ID；已有选择会被移除，范围选中与全选跳过这些项。`},{name:`maxSelected`,type:`number`,defaultValue:`Infinity`,description:`全部选中项（包括跨页保留）上限；有限值向下取整且最少 0，非有限值视为无限。超限按已有插入顺序截断。`}]}],returns:[{name:`selected`,type:`Set<Key>`,description:`当前选中集合的快照，请勿直接修改。`},{name:`selectedKeys`,type:`Key[]`,description:`选中 ID 数组，含 preserve 保留的其他页 ID。`},{name:`allSelected`,type:`boolean`,description:`当前未禁用 keys 非空且全部已选中，或已选到 maxSelected 上限；禁用项不影响全选判断。`},{name:`partiallySelected`,type:`boolean`,description:`当前页有选中但未全选，可绑定原生 checkbox.indeterminate。`},{name:`isAtLimit`,type:`boolean`,description:`是否达到选择上限；上限为 0 时为 true。`}],methods:[{name:`isSelected`,type:`(key: Key) => boolean`,description:`查询某个 ID 是否选中。`},{name:`toggle`,type:`(key: Key, options?: { range?: boolean }) => void`,description:`单选切换并记录范围锚点；range: true 从上次普通 toggle 的锚点到当前 key，按目标项当前状态选中或取消整个范围。禁用项不处理；preserve: true 时允许切换非当前页 ID。`},{name:`selectAll`,type:`() => void`,description:`按 keys 顺序加入未禁用项，保留跨页选择并遵守上限。`},{name:`toggleAll`,type:`() => void`,description:`当前页已全选（或已达 maxSelected 上限）则移除本页选择，否则选中本页。`},{name:`clear`,type:`() => void`,description:`清空所有页选择。`},{name:`isDisabled`,type:`(key: Key) => boolean`,description:`查询 ID 是否在 disabledKeys 中。`},{name:`selectRange`,type:`(from: Key, to: Key, checked?: boolean) => void`,description:`按当前 keys 顺序处理含两端的区间；checked 默认 true，false 取消范围。跳过禁用项，选中时遵守上限；端点不存在则无操作。`}],types:`interface SelectionOptions<Key> {
  preserve?: boolean;
  resetKey?: unknown;
  disabledKeys?: readonly Key[];
  maxSelected?: number;
}`,notes:[`Shift 交互需显式传 toggle(key, { range: event.shiftKey })，Hook 不全局监听键盘。clear 或 resetKey 变化清除范围锚点。`,`selected 是不可变使用的 Set 快照。上限变小、禁用项变化会裁剪已有选择；不提供超限回调。`]},useTable:{source:_,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`转换后的每一行记录类型；列表、选择与行编辑使用该类型。`},{name:`Filters`,type:`object`,defaultValue:`无默认类型`,description:`筛选条件对象结构；与 TableQuery.filters 对应。`},{name:`Response`,type:`unknown`,defaultValue:`PageResult<T>`,description:`服务原始响应类型；与 T 不同的结构可通过 select 转换。`}],signature:`useTable<T, Filters extends object, Response = PageResult<T>>(
  service: RequestService<Response, [TableQuery<Filters>]>,
  options: {
    initialFilters: Filters;
    pageSize?: number;
    select: (response: Response) => PageResult<T>;
    urlState?: {
      key: string;
      mode?: "replace" | "push";
      parseFilters: (value: unknown) => Filters;
    };
    columns?: readonly string[];
    columnsStorageKey?: string;
    filterPresets?: Record<string, Filters>;
  },
)`,parameters:[t(`service`,`RequestService<Response, [TableQuery<Filters>]>`,`必填`,`接收 signal、页码、每页条数、已提交筛选与排序；挂载及查询变化时自动执行。`),r(`{
    initialFilters: Filters;
    pageSize?: number;
    select: (response: Response) => PageResult<T>;
    urlState?: {
        key: string;
        mode?: "replace" | "push";
        parseFilters: (value: unknown) => Filters;
    };
    columns?: readonly string[];
    columnsStorageKey?: string;
    filterPresets?: Record<string, Filters>;
}`,!0)],sections:[{title:`options`,rows:[t(`initialFilters`,`Filters`,`必填`,`初始筛选与 search.reset 基准。`),t(`select`,`(response: Response) => PageResult<T>`,`必填`,`将响应转换为 { list, total }，即使服务已返回相同结构也需提供。list 必须为数组，total 必须为有限非负数。`),t(`pageSize`,`number`,`10`,`初始每页条数。`),t(`urlState`,`{ key: string; mode?: "replace" | "push"; parseFilters: (value: unknown) => Filters }`,`undefined`,`开启 URL 查询同步，详见下表。`),t(`columns`,`readonly string[]`,`[]`,`允许展示的列 key；需稳定且唯一，初始全部显示。`),t(`columnsStorageKey`,`string`,`undefined`,`列顺序与显隐的 localStorage 键；省略时不持久化。`),t(`filterPresets`,`Record<string, Filters>`,`{}`,`初始命名筛选预设，只保留在当前实例内。`)]},{title:`options.urlState`,rows:[t(`key`,`string`,`必填`,`保存整个查询 JSON 的单个 URL 参数名。`),t(`mode`,`'replace' | 'push'`,`'replace'`,`写入时替换或新增历史条目。`),t(`parseFilters`,`(value: unknown) => Filters`,`必填`,`解析并验证 URL 中的 filters，不能直接信任输入；抛错记入 stateError。`)]}],returns:[...v.map(e=>e.name===`data`?n(`data`,`PageResult<T> | undefined`,`最近成功的标准化分页结果，初始 undefined。`):e),n(`list`,`T[]`,`当前结果列表，首次加载前为 []。`),n(`total`,`number`,`当前结果总数，首次加载前为 0。`),n(`page`,`number`,`当前页码，从 1 开始。`),n(`pageSize`,`number`,`当前每页条数。`),n(`sort`,`TableQuery<Filters>["sort"]`,`当前排序，初始 null。`),n(`stateError`,`unknown`,`URL 解析/序列化或列配置存储错误，与请求 error 分开。`),n(`search.draft`,`Filters`,`筛选草稿。`),n(`search.submitted`,`Filters`,`已提交筛选。`),n(`search.revision`,`number`,`每次提交或重置递增。`),n(`columns.order`,`string[]`,`规范化后的全部列顺序；去除未知 key，补齐遗漏 key。`),n(`columns.hidden`,`string[]`,`隐藏列 key。`),n(`columns.visible`,`string[]`,`按 order 排序的可见列 key。`),n(`presets`,`Record<string, Filters>`,`当前实例的筛选预设。`)],methods:[...y.map(e=>e.name===`run`?n(`run`,`(query: TableQuery<Filters>) => void`,`低层请求入口；不会同步 UI 查询状态。通常使用 setPage、search.submit 或 refresh。`):e.name===`runAsync`?n(`runAsync`,`(query: TableQuery<Filters>) => Promise<PageResult<T>>`,`低层异步请求入口，不同步 UI 查询状态；失败需 catch。`):e.name===`refreshAsync`?n(`refreshAsync`,`() => Promise<PageResult<T>>`,`重跑最近请求，返回标准化结果，失败需 catch。`):e.name===`mutate`?n(`mutate`,`(next: PageResult<T> | ((previous: PageResult<T> | undefined) => PageResult<T>)) => void`,`本地修改分页结果，不请求服务。`):e),n(`setPage`,`(page: number) => void`,`切页并自动请求；已知总数时限制最大页。`),n(`setPageSize`,`(size: number) => void`,`更新每页条数，回到第 1 页并请求。`),n(`setSort`,`(sort: TableQuery<Filters>["sort"]) => void`,`设置排序或传 null 清除，回到第 1 页并请求。`),n(`search.setDraft`,`(patch: Partial<Filters>) => void`,`浅合并草稿，不立即请求。`),n(`search.submit`,`() => void`,`提交草稿，回到第 1 页并请求。`),n(`search.reset`,`() => void`,`恢复初始筛选、清除排序并回到第 1 页，保留当前 pageSize。`),n(`columns.setOrder`,`(keys: readonly string[]) => void`,`规范化列顺序并按配置持久化。`),n(`columns.setVisible`,`(key: string, visible: boolean) => void`,`设置列显隐并按配置持久化，忽略未知 key。`),n(`savePreset`,`(name: string) => void`,`保存当前 draft，覆盖同名预设；空白名称无操作。`),n(`applyPreset`,`(name: string) => boolean`,`用预设整体替换筛选条件（不与当前草稿合并）并查询第 1 页；名称不存在返回 false。`),n(`deletePreset`,`(name: string) => void`,`删除本实例预设。`)],types:`interface TableQuery<Filters> {
  page: number;
  pageSize: number;
  filters: Filters;
  sort: { field: string; order: "asc" | "desc" } | null;
}
interface PageResult<T> { list: T[]; total: number }`,notes:[`返回 useRequest 的请求状态和方法，但 options 不透传重试、轮询或超时配置；retryCount 在本实现中通常为 0。`,`URL 恢复先于首次请求，支持 popstate。列配置不改变服务请求，需用 columns.visible 渲染列；预设不自动写入存储。`]}},x={useForm:{source:`src/form/index.ts`,generics:[{name:`T`,type:`object`,defaultValue:`无默认类型`,description:`整个表单值的对象结构，决定字段路径和各字段值的类型。`}],signature:`useForm<T extends object>(options: FormOptions<T>)`,parameters:[{name:`options`,type:`FormOptions<T>`,defaultValue:`必填`,description:`配置对象，字段见下表。`}],sections:[{title:`options · 值与校验规则`,rows:[{name:`initialValues`,type:`T`,defaultValue:`必填`,description:`初始值和 dirty 基准，不随参数变化自动回填；使用 reset(record) 加载其他记录。`},{name:`validators`,type:`FormValidators<T>`,defaultValue:`{}`,description:`按字段路径配置 (value, values) => string | undefined | Promise<string | undefined>；字符串为错误，undefined 为通过。`},{name:`schema`,type:`(values: T) => FormErrors<T> | Promise<FormErrors<T>>`,defaultValue:`undefined`,description:`整表校验适配函数；返回路径到错误文案的映射。与 validators 合并，同路径字段错误优先。`}]},{title:`options · 校验策略`,rows:[{name:`mode`,type:`'onSubmit' | 'onBlur' | 'onChange'`,defaultValue:`'onSubmit'`,description:`首次提交之前的自动校验时机；onBlur/onChange 只校验触发的字段及其 dependencies 中声明的依赖字段，不会让未交互字段提前报错。`},{name:`revalidateMode`,type:`'onBlur' | 'onChange'`,defaultValue:`'onChange'`,description:`首次提交之后的自动重验时机，优先于 mode。`},{name:`validateDebounce`,type:`number`,defaultValue:`0`,description:`自动校验延迟毫秒；<= 0 立即执行。多个变化字段在同一等待窗口中合并。`},{name:`dependencies`,type:`Partial<Record<FieldPath<T>, readonly FieldPath<T>[]>>`,defaultValue:`undefined`,description:`键为依赖字段，数组为源字段。例如 confirm: ["password"]。配置后按受影响路径和传递依赖校验；省略则自动整表校验。`}]},{title:`options · 字段生命周期与焦点`,rows:[{name:`shouldUnregister`,type:`boolean`,defaultValue:`false`,description:`使用 register.ref / getFieldRef 的控件真实卸载后移除值、错误、touched，并跳过该字段校验。默认保留；CSS 隐藏不等于卸载。条件字段应声明为可选属性。`},{name:`shouldFocusError`,type:`boolean`,defaultValue:`false`,description:`提交校验失败时聚焦 DOM 顺序中的第一个可聚焦错误字段；需正确绑定 ref，禁用或隐藏节点会跳过。`}]}],returns:[{name:`values`,type:`T`,description:`当前表单值，请保持不可变更新。`},{name:`errors`,type:`FormErrors<T>`,description:`字段错误，初始 {}。`},{name:`touched`,type:`Partial<Record<FieldPath<T>, boolean>>`,description:`已失焦/手动标记的字段，初始 {}。`},{name:`isDirty`,type:`boolean`,description:`values 与当前 reset 基准深比较是否不同。`},{name:`isSubmitting`,type:`boolean`,description:`从提交开始到校验和提交回调结束的状态，初始 false。`},{name:`isValidating`,type:`boolean`,description:`校验任务是否进行中；防抖等待期间尚未开始校验。`},{name:`submitError`,type:`unknown`,description:`schema 或提交回调异常；字段校验器异常转为字段错误。修改值、reset 或再次提交会清空。`},{name:`resetCount`,type:`number`,description:`每次 reset 递增，用于重建动态数组字段身份。`},{name:`control`,type:`FormControl<T>`,description:`稳定字段订阅接口，传给 useFormField；不直接修改内部状态。`}],methods:[{name:`setFieldValue`,type:`<P extends FieldPath<T>>(path: P, value: FieldValue<T, P>) => void`,description:`不可变更新指定路径，并按当前策略触发校验；不自动标记 touched。`},{name:`setValues`,type:`(next: T | ((previous: T) => T)) => void`,description:`替换整个值对象，不做浅合并；按策略校验。`},{name:`setFieldTouched`,type:`(path: FieldPath<T>, touched?: boolean) => void`,description:`标记 touched，默认 true；不单独触发校验。`},{name:`setFieldError`,type:`(path: FieldPath<T>, message: string | undefined) => void`,description:`手动设置错误，空字符串或 undefined 清除此错误。`},{name:`register`,type:`<P extends FieldPath<T>>(path: P, options?: RegisterOptions) => RegisterBinding`,description:`返回原生 input/textarea/select 所需绑定，结构见下方。options.value 用于 radio 组和复选框组（数组字段增删该值）；options.type 为 'file' 时值为 File[]；数组字段配合 <select multiple> 使用。`},{name:`validate`,type:`(paths?: readonly FieldPath<T>[]) => Promise<boolean>`,description:`立即校验，不受防抖影响；省略 paths 校验全表。路径包含子字段和传递依赖；有 schema 时仍执行整个 schema，但只采纳所选路径的错误。返回本轮选中校验是否通过，不表示未选字段一定无错。`},{name:`handleSubmit`,type:`(callback: (values: T) => void | Promise<void>) => (event?: { preventDefault(): void }) => Promise<boolean>`,description:`生成提交处理器，先立即整表校验再调用 callback。校验期间值发生变化时会用最新值重新校验，不会静默失败。成功 true，校验失败、reset 或回调异常 false；进行中重复提交共用 Promise。`},{name:`reset`,type:`(next?: T) => void`,description:`默认恢复当前基准；传 next 时将其设为新值和新基准。清空 errors/touched/提交错误，取消待校验并使旧结果失效。`},{name:`resetField`,type:`<P extends FieldPath<T>>(path: P, options?: { defaultValue?: FieldValue<T, P>; keepError?: boolean; keepTouched?: boolean }) => void`,description:`恢复单个字段及子路径的基准值，默认清除其错误和 touched。传 defaultValue 同时更新该字段 dirty 基准；keepError/keepTouched 默认 false。取消待校验并使旧结果失效，不自动重验。`},{name:`unregister`,type:`(path: FieldPath<T>, options?: { keepValue?: boolean }) => void`,description:`显式移除字段/子路径的元数据并停用其校验；默认删除值，keepValue: true 保留值。重新绑定 ref 后恢复校验。数组删行请用 useFieldArray.remove。`},{name:`getFieldRef`,type:`(path: FieldPath<T>) => (node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => void`,description:`获取稳定原生控件 ref 回调，供自定义绑定配合字段生命周期和聚焦。`},{name:`focusField`,type:`(path: FieldPath<T>) => boolean`,description:`聚焦已挂载、可见且未禁用的原生控件；未找到或无法聚焦返回 false。`},{name:`focusFirstError`,type:`() => boolean`,description:`按 DOM 顺序尝试聚焦错误字段；成功返回 true。`}],types:`// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。
// 例如 "profile.name"、"contacts.0.email"。
// FieldValue<T, P>：路径 P 对应的值类型。
type FormErrors<T> = Partial<Record<FieldPath<T>, string>>;
type FormApi<T extends object> = ReturnType<typeof useForm<T>>;

// register 的返回结构（按原生输入控件绑定）
interface RegisterOptions {
  value?: string; // radio / 复选框组的选项值
  type?: "file"; // 文件输入，值为 File[]
}
interface RegisterBinding {
  name: string;
  ref(node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null): void;
  value: string | number | readonly string[] | undefined; // 文件输入为 undefined
  checked: boolean | undefined;
  "aria-invalid": boolean;
  onChange(event: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >): void;
  onBlur(): void;
}`,notes:[`checkbox 根据 checked 写布尔值。当前字段为 number 时转换输入文本，空值写 NaN。对象值不是原生文本输入值；第三方控件使用 setFieldValue 或 useFormField。`,`异步旧结果不会覆盖更新后的值；过期 validate 返回 false。schema 抛错写 submitError 并阻止提交，不伪装成字段通过。reset 不会取消已进入业务回调的服务端操作。`,`register.onBlur 同时标记 touched 并按策略校验。setFieldTouched 只修改标记，不等价于 onBlur。`,`shouldUnregister 需要保留 register 返回的 ref。schema 仍接收整表值，条件字段须在 schema 中建模为可选；已注销路径的 schema 错误会被过滤。reset 会恢复整表基准并重新启用字段校验。`]},useFieldArray:{source:`src/form/index.ts`,generics:[{name:`T`,type:`object`,defaultValue:`无默认类型`,description:`整个表单值的对象结构，不是单个数组项的类型。`},{name:`P`,type:`FieldPath<T>`,defaultValue:`无默认类型`,description:`合法字段路径，受 FieldPath<T> 约束；字段值由 FieldValue<T, P> 推导。 此 Hook 进一步限制为值类型是数组的路径。`}],signature:`useFieldArray<T extends object, P extends FieldPath<T>>(
  form: FormApi<T>,
  name: P & (FieldValue<T, P> extends readonly unknown[] ? P : never),
)`,parameters:[{name:`form`,type:`FormApi<T>`,defaultValue:`必填`,description:`同一表单 useForm 的返回对象。`},{name:`name`,type:`P & (FieldValue<T, P> extends readonly unknown[] ? P : never)`,defaultValue:`必填`,description:`数组路径，例如 contacts 或 profile.addresses；Item 为对应数组元素类型。`}],returns:[{name:`fields`,type:`{ id: string; value: Item }[]`,description:`用于渲染的行，使用 id 作为 React key；value 为当前行值。`}],methods:[{name:`append`,type:`(item: Item) => void`,description:`末尾追加一行，分配新 id。`},{name:`remove`,type:`(index: number) => void`,description:`按从 0 开始的索引删除，非整数或越界无操作。`},{name:`move`,type:`(from: number, to: number) => void`,description:`移动一行并保留其 id；索引越界或相同无操作。`},{name:`replace`,type:`(items: Item[]) => void`,description:`替换整个数组，为所有行重新生成 id。`},{name:`prepend`,type:`(item: Item) => void`,description:`在开头插入一行并分配新 ID，等价于 insert(0, item)。`},{name:`insert`,type:`(index: number, item: Item) => void`,description:`在索引位置插入；允许 0 到当前长度。非整数、负值或越界无操作。后续行的 ID 与元数据随记录移动。`},{name:`swap`,type:`(a: number, b: number) => void`,description:`交换两行及其 ID、errors、touched；越界/同索引无操作。`},{name:`update`,type:`(index: number, item: Item) => void`,description:`替换一行的值，保留其 ID、errors、touched；按表单策略重验。越界无操作。`}],types:`// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。
// 例如 "profile.name"、"contacts.0.email"。
// FieldValue<T, P>：路径 P 对应的值类型。
type FormErrors<T> = Partial<Record<FieldPath<T>, string>>;
type FormApi<T extends object> = ReturnType<typeof useForm<T>>;

// 下列 Item 是本文用于简化字段数组签名的说明性别名，不是包导出类型。
// 例如 T = { contacts: { email: string }[] }、P = 'contacts' 时，
// Item<T, P> = { email: string }。
type Item<T extends object, P extends FieldPath<T>> =
  FieldValue<T, P> extends readonly (infer I)[] ? I : never;`,notes:[`insert/prepend/remove/move/swap 使 errors、touched 随原记录重新映射；删除仅移除被删行的元数据，update 保留该行 ID 和元数据。数组根路径的手工错误不自动清空。`,`replace 为所有行重建 ID 并清除子路径元数据；form.reset 或 resetField(数组/父路径) 也会重建相关 ID。请用 fields[].id 作为 React key，避免直接 setValues 改变数组结构。`]},useFormField:{source:`src/form/index.ts`,generics:[{name:`T`,type:`object`,defaultValue:`无默认类型`,description:`整个表单值的对象结构；具体字段值通过 FieldValue<T, P> 得到。`},{name:`P`,type:`FieldPath<T>`,defaultValue:`无默认类型`,description:`合法字段路径，受 FieldPath<T> 约束；字段值由 FieldValue<T, P> 推导。`}],signature:`useFormField<T extends object, P extends FieldPath<T>>(
  control: FormControl<T>,
  path: P,
)`,parameters:[t(`control`,`FormControl<T>`,`必填`,`来自 useForm 的稳定 control；与 React.memo 一起传给字段组件。`),t(`path`,`P`,`必填`,`要订阅的字段路径。`)],returns:[n(`value`,`FieldValue<T, P>`,`当前路径值，类型随路径推导。`),n(`error`,`string | undefined`,`当前字段错误，初始 undefined。`),n(`touched`,`boolean`,`当前字段触碰状态，初始 false。`)],methods:[n(`setValue`,`(value: FieldValue<T, P>) => void`,`设置此字段并遵循表单校验策略，不接收函数更新。`),n(`onBlur`,`() => void`,`标记此字段 touched，并按表单策略触发失焦校验。`)],types:`// FieldPath<T>：T 的点号字段路径，含数组索引，最多递归 6 层。
// 例如 "profile.name"、"contacts.0.email"。
// FieldValue<T, P>：路径 P 对应的值类型。
type FormErrors<T> = Partial<Record<FieldPath<T>, string>>;
type FormApi<T extends object> = ReturnType<typeof useForm<T>>;

interface FormControl<T extends object> {
  subscribe(listener: () => void): () => void;
  read(path: FieldPath<T>): {
    value: unknown; error: string | undefined; touched: boolean;
  };
  setValue<P extends FieldPath<T>>(path: P, value: FieldValue<T, P>): void;
  blur(path: FieldPath<T>): void;
}`,notes:[`订阅缓存按 Object.is 比较 value，错误和 touched 分别比较；请使用不可变值。useForm 的宿主仍随整表状态渲染，React.memo 才能隔离父级带来的无关字段渲染。`]}},S=`src/web/list.ts`,C={useInfiniteScroll:{source:S,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`每一条列表记录的类型，与 InfinitePage.items 和返回的 items 对应。`},{name:`Cursor`,type:`unknown`,defaultValue:`无默认类型`,description:`分页游标的类型，由 initialCursor 和 service 的参数共同推断，也可显式指定。页码可用 number（如 1），令牌可用 string（如 'page-2'），也可使用后端要求的对象结构。nextCursor: Cursor | null 中的 null 专门表示结束；initialCursor 可以是 null（例如首页不带游标）。`}],typeExample:`import { useInfiniteScroll, type InfinitePage } from "@leonwgc/react-hooks";

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
// 并将 initialCursor 和 nextCursor 改为对应字符串（结束时仍返回 null）。`,signature:`useInfiniteScroll<T, Cursor>(
  service: (context: {
    signal: AbortSignal;
    cursor: Cursor;
  }) => Promise<InfinitePage<T, Cursor>>,
  options: {
    initialCursor: Cursor;
    manual?: boolean;
    direction?: "append" | "prepend";
    resetKey?: unknown;
    getKey?: (item: T) => React.Key;
    sentinel?: Target<Element>;
  },
)`,parameters:[t(`service`,`(context: {
    signal: AbortSignal;
    cursor: Cursor;
}) => Promise<InfinitePage<T, Cursor>>`,`必填`,`按当前游标取一页；将 signal 传给实际请求。`),r(`{
    initialCursor: Cursor;
    manual?: boolean;
    direction?: "append" | "prepend";
    resetKey?: unknown;
    getKey?: (item: T) => React.Key;
    sentinel?: Target<Element>;
}`,!0)],sections:[{title:`options`,rows:[t(`initialCursor`,`Cursor`,`必填`,`首次/重置游标；null 被保留为结束标记，不作为有效游标使用。变化时按深比较重置。`),t(`manual`,`boolean`,`false`,`true 时挂载/reset 不自动请求；不会禁用 sentinel 触发。`),t(`direction`,`'append' | 'prepend'`,`'append'`,`追加到尾部或插入头部，每页内部顺序保留。`),t(`resetKey`,`unknown`,`undefined`,`深比较变化时取消旧请求并清空列表。`),t(`getKey`,`(item: T) => React.Key`,`undefined`,`提供时去重，保留合并后数组中第一个相同 key 的记录；prepend 时新页在前。`),t(`sentinel`,`Target<Element>`,`undefined`,`观察触底/触顶标记元素，可见时自动加载；无 IntersectionObserver 时需手动加载。`)]}],returns:[n(`items`,`T[]`,`累计结果，初始 []。`),n(`loading`,`boolean`,`当前是否加载，初始 false。`),n(`error`,`unknown`,`最近一页错误，初始 undefined；开始加载和 reset 时清空。`),n(`hasMore`,`boolean`,`是否还有下一页，初始 true；成功后由 nextCursor !== null 决定。`)],methods:[n(`loadMore`,`() => Promise<void>`,`加载当前游标；重复调用共用 Promise，无更多数据时直接完成。失败拒绝；若 await，需要 catch。`),n(`retry`,`() => Promise<void>`,`loadMore 的同一函数引用；失败时游标未前进，因此重试同一页。`),n(`reset`,`() => void`,`取消旧请求，清空数据和错误、恢复 initialCursor；manual 为 false 时立即重新加载。`),n(`cancel`,`() => void`,`取消并隔离当前请求，保留已有数据和游标；不永久禁用 sentinel。`)],types:`interface InfinitePage<T, Cursor> {
  items: T[];
  nextCursor: Cursor | null; // null 表示没有下一页
}

`+a,notes:[`自动观察遇到 error 后暂停触发；手动 loadMore/retry 可恢复。cancel 通过 signal 通知服务，忽略 signal 的底层 Promise 可能仍要等待服务结束，但旧结果不会写入。`]},useVirtualList:{source:S,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`每条原始列表记录的类型，与 VirtualItem.item 对应。`}],signature:`useVirtualList<T>(
  items: readonly T[],
  options: VirtualListOptions<T>,
)`,parameters:[t(`items`,`readonly T[]`,`必填`,`全部记录，使用不可变数组更新。`),r(`VirtualListOptions<T>`,!0)],sections:[{title:`options`,rows:[t(`itemHeight`,`number`,`必填`,`固定模式行高，或动态模式未测量行的估算高度，单位 px，最小按 1 计算。`),t(`height`,`number`,`必填`,`滚动容器高度 px，应大于 0。`),t(`getKey`,`(item: T, index: number) => React.Key`,`必填`,`唯一稳定 key；用于尺寸缓存与阅读锚点，插入/排序时不要使用索引作为 key。`),t(`overscan`,`number`,`3`,`可见区域前后各额外渲染的行数，向下取整且不小于 0。`),t(`dynamic`,`boolean`,`false`,`启用动态测量；将 measureRef 绑定到行，并避免固定 height。`),t(`onStartReached`,`() => void`,`undefined`,`进入顶部阈值区域或区域内列表尺寸变化时触发，空列表也可能触发。`),t(`onEndReached`,`() => void`,`undefined`,`进入底部阈值区域或区域内列表尺寸变化时触发。`),t(`threshold`,`number`,`40`,`边界触发距离 px，负值按 0。`)]}],returns:[n(`containerRef`,`React.RefObject<HTMLDivElement | null>`,`绑定到实际滚动 div。`),n(`containerStyle`,`React.CSSProperties`,`容器 height、overflow:auto、position:relative、overflowAnchor:none，展开到同一元素。`),n(`totalHeight`,`number`,`全部记录估算/测量总高度；用于内部占位层高度。`),n(`virtualItems`,`VirtualItem<T>[]`,`只包含可见范围及 overscan 行，字段见下方。`)],methods:[n(`onScroll`,`() => void`,`绑定到滚动容器的 onScroll，同步可见范围和锚点。`),n(`scrollTo`,`(index: number, align?: 'start' | 'center' | 'end') => void`,`按从 0 开始的索引定位，align 默认 start；索引取整并限制到有效范围，无容器/空列表时无操作。`),n(`resetMeasurements`,`() => void`,`清除不可见行的缓存，并立即重新测量当前已挂载行。`)],types:`// 以下 VirtualItem 是文档中的结构说明名称，不是包导出类型。
interface VirtualItem<T> {
  item: T;
  index: number; // 在完整 items 中的索引
  key: React.Key;
  style: React.CSSProperties; // 绝对定位 top / width / height
  measureRef(node: HTMLElement | null): void;
}`,notes:[`容器绑定 ref/style/onScroll，内部设置 height: totalHeight 的占位层；每行使用 key、style 和动态模式的 measureRef。缺少占位层会导致滚动范围不正确。`,`动态行首次挂载测量，后续变化依赖 ResizeObserver。scrollTo 对未测量行使用估算值；上方插入或高度变化时按稳定 key 保留当前可见锚点。回调不内置加载锁，搭配 useInfiniteScroll 处理去重。`]}},w={useAsyncQueue:{source:`src/web/queue.ts`,generics:[{name:`T`,type:`unknown`,defaultValue:`unknown`,description:`任务成功结果的类型；所有任务共用该结果类型。options 不包含结果信息，应显式传入，如 useAsyncQueue<string>()；省略时为 unknown。`}],signature:`useAsyncQueue<T = unknown>(options?: AsyncQueueOptions)`,parameters:[{name:`options`,type:`AsyncQueueOptions`,defaultValue:`{}`,description:`配置对象，字段见下表。`}],sections:[{title:`options`,rows:[{name:`concurrency`,type:`number`,defaultValue:`3`,description:`同时执行上限；有限值取整且至少 1，非有限值回退 3。降低上限不取消已启动任务。`},{name:`capacity`,type:`number`,defaultValue:`Infinity`,description:`queued（含退避等待）与 running 的合计容量；有限值取整且最少 0。超限 add 返回拒绝的 Promise，错误为 QueueCapacityError，不新增 tasks 记录。`},{name:`priority`,type:`number`,defaultValue:`0`,description:`数值越大越先启动，同优先级按添加顺序；仅影响等待任务，不抢占运行任务。非有限值按 0。`},{name:`retry`,type:`number`,defaultValue:`0`,description:`普通失败后额外重试次数；有限非负整数。取消不重试；超时仅在 retryOnTimeout 为 true 时重试。`},{name:`retryDelay`,type:`number`,defaultValue:`0`,description:`每次重试前等待毫秒；等待时释放已结束传输的并发槽。负值/非有限值按 0。`},{name:`timeout`,type:`number`,defaultValue:`undefined`,description:`每次实际执行的超时毫秒，有限且 > 0 启用；到期取消 signal，默认以 QueueTimeoutError 拒绝（终态）。`},{name:`retryOnTimeout`,type:`boolean`,defaultValue:`false`,description:`为 true 时超时也计入 retry 重试；被超时的旧尝试即使稍后返回，其结果也会被忽略。`}]},{title:`add 第三个参数 · taskOptions`,rows:[{name:`priority`,type:`number`,defaultValue:`继承 options.priority`,description:`数值越大越先启动，同优先级按添加顺序；仅影响等待任务，不抢占运行任务。非有限值按 0。 在添加时快照，可覆盖队列默认值。`},{name:`retry`,type:`number`,defaultValue:`继承 options.retry`,description:`普通失败后额外重试次数；有限非负整数。取消不重试；超时仅在 retryOnTimeout 为 true 时重试。 在添加时快照，可覆盖队列默认值。`},{name:`retryDelay`,type:`number`,defaultValue:`继承 options.retryDelay`,description:`每次重试前等待毫秒；等待时释放已结束传输的并发槽。负值/非有限值按 0。 在添加时快照，可覆盖队列默认值。`},{name:`timeout`,type:`number`,defaultValue:`继承 options.timeout`,description:`每次实际执行的超时毫秒，有限且 > 0 启用；到期取消 signal，默认以 QueueTimeoutError 拒绝（终态）。 在添加时快照，可覆盖队列默认值。`},{name:`retryOnTimeout`,type:`boolean`,defaultValue:`继承 options.retryOnTimeout`,description:`为 true 时超时也计入 retry 重试。 在添加时快照，可覆盖队列默认值。`}]}],returns:[{name:`tasks`,type:`QueueTask<T>[]`,description:`按添加顺序排列的状态快照，初始 []。`},{name:`running`,type:`number`,description:`状态为 running 的任务数。取消后可能仍有未实际结束的任务占用并发槽，不计入此数。`},{name:`pending`,type:`number`,description:`状态为 queued 的任务数。`},{name:`paused`,type:`boolean`,description:`调度是否暂停，初始 false。`}],methods:[{name:`add`,type:`(run: (signal: AbortSignal) => Promise<T>, label?: string, taskOptions?: QueueTaskOptions) => TaskHandle<T>`,description:`添加并调度任务；label 默认空字符串。返回 ID、结果 Promise 与 accepted（超出 capacity 或已卸载时为 false）；重试共享同一 ID/Promise，失败需 catch。`},{name:`cancel`,type:`(id: string) => void`,description:`取消指定 queued/running 任务；未知或已结束 ID 无操作。任务 Promise 以 AbortError 拒绝。`},{name:`cancelAll`,type:`() => void`,description:`取消全部等待与运行任务。`},{name:`pause`,type:`() => void`,description:`停止启动等待任务，不暂停正在执行的传输。`},{name:`resume`,type:`() => void`,description:`恢复调度；高优先级优先，同优先级按添加顺序。`},{name:`remove`,type:`(id: string) => boolean`,description:`删除单条已结束（success/error/cancelled）记录并返回 true；queued/running 或未知 ID 返回 false。`},{name:`clear`,type:`() => string[]`,description:`删除 success/error/cancelled 记录，保留 queued/running；返回被删除的任务 ID。`}],types:`interface QueueTask<T> {
  id: string;
  label: string;
  status: "queued" | "running" | "success" | "error" | "cancelled";
  result?: T;
  error?: unknown;
  priority?: number; // 当前调度优先级
  attempts?: number; // 已启动次数，首次为 1
  retryCount?: number; // 已安排重试次数
}
// 以下 TaskHandle 是文档中的结构说明名称，不是包导出类型。
interface TaskHandle<T> { id: string; promise: Promise<T>; accepted: boolean }
interface QueueTaskOptions {
  priority?: number; retry?: number; retryDelay?: number; timeout?: number;
  retryOnTimeout?: boolean;
}
interface AsyncQueueOptions extends QueueTaskOptions {
  concurrency?: number; capacity?: number;
}
declare class QueueCapacityError extends Error { constructor(); }
declare class QueueTimeoutError extends Error { constructor(timeout: number); timeout: number; }`,notes:[`取消/超时立即拒绝对外 Promise，但不响应 signal 的底层任务在实际结束前仍占并发槽，避免重叠请求。running 仅统计状态为 running 的任务，不含这些已逻辑结束的传输。`,`普通失败且配置 retry 时自动重试，退避期间 pending 包含该任务；暂停不取消退避计时，但阻止新尝试启动。卸载、cancelAll 会清理重试和超时计时器。`,`options 中 concurrency 可动态改变，其他默认值在 add 时快照；任务已入队后不随配置变化。重试可能重复写入，写操作需由调用方保证幂等性。`]},useUpload:{source:`src/web/queue.ts`,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`上传成功后服务返回的数据类型。`}],signature:`useUpload<T>(options: {
  transport: (context: UploadContext) => Promise<T>;
} & AsyncQueueOptions)`,parameters:[{name:`options`,type:`{ transport: (context: UploadContext) => Promise<T> } & AsyncQueueOptions`,defaultValue:`必填`,description:`配置对象，字段见下表。`}],sections:[{title:`options`,rows:[{name:`transport`,type:`(context: UploadContext) => Promise<T>`,defaultValue:`必填`,description:`自定义上传实现；接收原 File、AbortSignal 和进度上报函数。`},{name:`concurrency`,type:`number`,defaultValue:`3`,description:`并发上限，规则与 useAsyncQueue 一致。`},{name:`capacity / priority / retry / retryDelay / timeout / retryOnTimeout`,type:`AsyncQueueOptions`,defaultValue:`同 useAsyncQueue`,description:`原样传给内部队列；被 capacity 拒绝的文件不会出现在 uploads 中（handle.accepted 为 false）。`}]},{title:`createXHRUploadTransport(options) · 辅助函数`,rows:[{name:`url`,type:`string`,defaultValue:`必填`,description:`上传接口 URL。`},{name:`fieldName`,type:`string`,defaultValue:`'file'`,description:`FormData 文件字段名。`},{name:`headers`,type:`Record<string, string>`,defaultValue:`{}`,description:`额外请求头；不要手动设置 multipart Content-Type。`},{name:`withCredentials`,type:`boolean`,defaultValue:`false`,description:`设置 xhr.withCredentials。`},{name:`method`,type:`string`,defaultValue:`'POST'`,description:`HTTP 请求方法。`}]}],returns:[{name:`uploads`,type:`(QueueTask<T> & { file: File; progress: number })[]`,description:`每个任务含原文件与进度；progress 为 0–100，成功时 100，不代表业务处理百分比。进度事件按帧合并后更新，任务结束时立即同步最终进度。`},{name:`paused`,type:`boolean`,description:`是否暂停启动新上传，初始 false。`},{name:`running`,type:`number`,description:`当前 running 上传数，语义同 useAsyncQueue。`}],methods:[{name:`add`,type:`(files: Iterable<File>) => TaskHandle<T>[]`,description:`添加文件集合，返回各任务 ID/Promise；同一个 File 多次添加不会自动去重。`},{name:`retry`,type:`(id: string) => TaskHandle<T> | undefined`,description:`仅对失败/取消记录用原 File 创建新任务，并移除旧记录（列表中不会出现重复项）。未知或其他状态返回 undefined。`},{name:`cancel`,type:`(id: string) => void`,description:`取消指定 queued/running 任务；未知或已结束 ID 无操作。任务 Promise 以 AbortError 拒绝。`},{name:`cancelAll`,type:`() => void`,description:`取消全部等待与运行任务。`},{name:`pause`,type:`() => void`,description:`停止启动等待任务，不暂停正在执行的传输。`},{name:`resume`,type:`() => void`,description:`恢复调度；高优先级优先，同优先级按添加顺序。`},{name:`clear`,type:`() => void`,description:`删除已结束上传及其文件引用、进度记录，保留运行和等待任务。`}],types:`interface QueueTask<T> {
  id: string;
  label: string;
  status: "queued" | "running" | "success" | "error" | "cancelled";
  result?: T;
  error?: unknown;
  priority?: number;
  attempts?: number;
  retryCount?: number;
}
// 以下 TaskHandle 是文档中的结构说明名称，不是包导出类型。
interface TaskHandle<T> { id: string; promise: Promise<T>; accepted: boolean }

interface UploadContext {
  file: File;
  signal: AbortSignal;
  onProgress(loaded: number, total: number): void;
}
// loaded/total 使用同一单位（通常字节）；total > 0 才更新百分比。
// 工厂返回可直接传入 transport 的函数：
// (context: UploadContext) => Promise<string>`,notes:[`createXHRUploadTransport 使用 XHR/FormData，2xx 返回原始 responseText，不自动解析 JSON；网络错误、非 2xx、取消都会拒绝。需 JSON 时包一层传输适配器。`,`上传没有文件类型/大小筛选、断点续传或总进度汇总；调用 add 前按业务校验。浏览器上传进度可能触发 CORS 预检。演示使用本地模拟传输。`]}},T=`src/web/browser.ts`,E={useImage:{source:T,signature:`useImage(
  src: string | null,
  options?: {
    fallback?: string;
    crossOrigin?: "anonymous" | "use-credentials";
  },
)`,parameters:[t(`src`,`string | null`,`必填`,`原图 URL；null 或空字符串恢复 idle。`),r(`{
    fallback?: string;
    crossOrigin?: "anonymous" | "use-credentials";
}`,!1)],sections:[{title:`options`,rows:[t(`fallback`,`string`,`undefined`,`原图失败后尝试一次的备用 URL；与原图相同时不重复请求。`),t(`crossOrigin`,`'anonymous' | 'use-credentials'`,`undefined`,`创建 Image 后、赋值 src 前设置跨域模式。`)]}],returns:[n(`src`,`string | null`,`当前尝试的地址，可能是备用图；初始 null。`),n(`status`,`'idle' | 'loading' | 'loaded' | 'error'`,`初始 idle；挂载后开始预加载，最终结果为 loaded 或 error。`),n(`error`,`Error | null`,`最终加载失败错误；初始和新一轮加载时为 null。`),n(`width`,`number`,`成功图片的 naturalWidth，其他状态为 0。`),n(`height`,`number`,`成功图片的 naturalHeight，其他状态为 0。`)],notes:[`这是预加载与状态管理 Hook；实际展示仍需使用 <img src={image.src}>。没有控制浏览器图片缓存或保证底层下载取消。`]},useFullscreen:{source:T,signature:`useFullscreen(target: Target<Element>)`,parameters:[i()],returns:[n(`supported`,`boolean`,`挂载后检测标准 Fullscreen API 与 fullscreenEnabled；SSR 初始 false。`),n(`active`,`boolean`,`document.fullscreenElement 是否为当前目标，初始 false。`),n(`error`,`unknown`,`最近操作错误，初始 undefined；成功时清空。`)],methods:[n(`enter`,`() => Promise<boolean>`,`请求目标全屏；目标为空、不支持或被浏览器拒绝时返回 false 并记录 error。`),n(`exit`,`() => Promise<boolean>`,`仅目标当前处于全屏时退出；其他目标的全屏不会主动退出。成功/无需退出返回 true。`),n(`toggle`,`() => Promise<boolean>`,`根据当前实际全屏元素选择进入或退出。`)],types:a,notes:[`通过用户手势调用；active 也随 Esc 或其他外部 fullscreenchange 更新。卸载只解除监听，不自动退出全屏。`,`标准 API 不可用时回退到 webkit 前缀实现（webkitRequestFullscreen / webkitExitFullscreen / webkitfullscreenchange），以支持旧版 Safari。`]},useBroadcastChannel:{source:T,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`发送和接收的消息类型；parse 负责运行时解析与校验。`}],signature:`useBroadcastChannel<T>(
  name: string | null,
  parse: (value: unknown) => T,
)`,parameters:[t(`name`,`string | null`,`必填`,`同源频道名称；null 不连接，名称变化关闭旧连接。`),t(`parse`,`(value: unknown) => T`,`必填`,`验证/转换接收到的结构化消息；异常写入 error，不覆盖上一条有效消息。`)],returns:[n(`supported`,`boolean`,`挂载后检测 API；初始 false。`),n(`message`,`T | undefined`,`最近一次成功解析的消息；初始 undefined，频道变化清空。`),n(`error`,`unknown`,`连接、发送或解析错误；初始 undefined，成功操作时清空。`)],methods:[n(`postMessage`,`(value: T) => boolean`,`向频道发送可结构化克隆的数据；成功 true，未连接/克隆失败时 false 并记录 error。发送实例不会接收自己的消息。`)]},useEventSource:{source:T,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`解析后的消息类型；由 parse 的返回值决定。`}],signature:`useEventSource<T>(
  url: string | null,
  options: {
    parse: (data: string) => T;
    event?: string;
    withCredentials?: boolean;
    factory?: (url: string, options: EventSourceInit) => EventSourceConnection;
  },
)`,parameters:[t(`url`,`string | null`,`必填`,`SSE 地址；null 或空字符串关闭连接。`),r(`{
    parse: (data: string) => T;
    event?: string;
    withCredentials?: boolean;
    factory?: (url: string, options: EventSourceInit) => EventSourceConnection;
}`,!0)],sections:[{title:`options`,rows:[t(`parse`,`(data: string) => T`,`必填`,`将 event.data 字符串解析/验证成业务数据；抛错写入 error。`),t(`event`,`string`,`'message'`,`要订阅的数据事件名称。`),t(`withCredentials`,`boolean`,`false（原生默认）`,`是否携带跨域凭据。`),t(`factory`,`(url: string, init: EventSourceInit) => EventSourceConnection`,`原生 EventSource`,`自定义连接工厂，可用于传输适配或测试；返回 EventTarget 兼容对象。仅改变 factory 引用不会立即重连，调用 reconnect 生效。`)]}],returns:[n(`supported`,`boolean`,`有自定义 factory 或原生 EventSource 时为 true；挂载前 false。`),n(`data`,`T | undefined`,`最近一次解析成功的数据；连接重建/关闭效果执行时清空。`),n(`status`,`'closed' | 'connecting' | 'open'`,`初始 closed；断线按连接 readyState 进入 closed 或 connecting。`),n(`error`,`unknown`,`构造、连接或解析错误；打开/接收成功后清空。`)],methods:[n(`close`,`() => void`,`关闭连接并禁用自动建立；之后即使 URL 改变也需 reconnect 恢复。`),n(`reconnect`,`() => void`,`重新启用并重建当前 URL 的连接。`)],types:`interface EventSourceConnection extends EventTarget {
  readonly readyState: number; // 0 connecting, 1 open, 2 closed
  close(): void;
}`,notes:[`原生断线重连由 EventSource 自身处理，不由 Hook 实现退避。原生接口不支持任意请求头；示例使用本地模拟源，真实接入需 SSE 服务和相应 CORS 配置。`]},useTextSelection:{source:T,signature:`useTextSelection(target?: Target<Element>)`,parameters:[i(`Element`,!0,`整个文档`)],returns:[n(`text`,`string`,`当前选中文字，无有效选区时为空字符串。`),n(`rect`,`{ x: number; y: number; width: number; height: number } | null`,`选区包围盒，单位 CSS px、相对视口；无选区为 null。`)],methods:[n(`clear`,`() => void`,`清除整个文档的原生选区并复位本 Hook 状态。`)],types:a,notes:[`指定目标时，选区锚点和焦点都必须位于容器内；target 为 null 时没有有效选区。input/textarea 的 selectionStart/selectionEnd 不在此 API 范围内。`]},useDownload:{source:T,signature:`useDownload()`,parameters:[],returns:[n(`loading`,`boolean`,`请求和触发浏览器保存是否进行中，初始 false；不是磁盘下载进度。`),n(`error`,`unknown`,`当前有效下载的失败，初始 undefined，新下载开始清空。`)],methods:[n(`download`,`(input: string | Blob, filename: string, init?: Omit<RequestInit, "signal">) => Promise<Blob>`,`URL 使用 fetch，Blob 直接触发保存；filename 为建议文件名，init 为可选 fetch 配置。返回 Blob，非 2xx、网络错误或过期结果会拒绝。`),n(`cancel`,`() => void`,`中止当前请求并阻止过期结果保存，保留原 error；已交给浏览器的保存不能撤回。`)],notes:[`每次 download 先取消上一轮，只保存最新结果。由 Hook 管理 signal；URL 需满足 CORS，Blob URL 约 1 秒后释放，卸载清理所有 URL。调用方 await 时必须处理拒绝；完成仅表示触发保存，不保证磁盘写入完成。`]}},D=`src/web/interaction.ts`,O={useUndoRedo:{source:`src/web/interaction.ts`,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`每一份历史快照的值类型。`}],signature:`useUndoRedo<T>(initial: T, options?: UndoRedoOptions)`,parameters:[{name:`initial`,type:`T`,defaultValue:`必填`,description:`初始不可变快照；后续参数变化不重置历史。`},{name:`options`,type:`UndoRedoOptions`,defaultValue:`{}`,description:`配置对象，字段见下表。`}],sections:[{title:`options`,rows:[{name:`limit`,type:`number`,defaultValue:`100`,description:`新写入时保留的撤销快照上限，取整且至少 1；请传有限正数。`},{name:`mergeWindow`,type:`number`,defaultValue:`0`,description:`同 group 且距上次写入不超过此毫秒数时合并为一次撤销；0 禁用。未指定 group 的连续写入也属于同一组。undo/redo/replace/事务会打断合并。`}]},{title:`set 第二个参数 · options`,rows:[{name:`replace`,type:`boolean`,defaultValue:`false`,description:`替换当前值，不新增历史；清空未来分支并打断输入合并。`},{name:`group`,type:`string`,defaultValue:`undefined`,description:`合并分组；例如 title 和 body 分开，避免不同字段共用一个撤销步骤。`},{name:`label`,type:`string`,defaultValue:`undefined`,description:`本次历史操作的描述，供 undoLabel / redoLabel 与历史列表展示。合并时采用最近提供的 label。`}]}],returns:[{name:`value`,type:`T`,description:`当前快照引用。`},{name:`canUndo`,type:`boolean`,description:`是否存在过去快照，初始 false。`},{name:`canRedo`,type:`boolean`,description:`是否存在未来快照，初始 false。`},{name:`past`,type:`HistoryEntry<T>[]`,description:`过去的快照，从最早到最近；只读使用。每项 label 描述从该快照执行的修改。`},{name:`future`,type:`HistoryEntry<T>[]`,description:`可重做快照，下一项在索引 0；只读使用。`},{name:`undoLabel`,type:`string | undefined`,description:`下一次撤销的操作说明，无记录或未提供标签时 undefined。`},{name:`redoLabel`,type:`string | undefined`,description:`下一次重做的操作说明。`},{name:`inTransaction`,type:`boolean`,description:`当前是否有未提交事务，初始 false。`}],methods:[{name:`set`,type:`(next: T | ((previous: T) => T), options?: HistoryUpdateOptions) => void`,description:`不可变更新；Object.is 相同则跳过。事务内只更新当前值，提交时作为一个撤销步骤；事务外按 replace/group/mergeWindow 处理。`},{name:`undo`,type:`() => void`,description:`回到上一快照；没有历史时无操作。`},{name:`redo`,type:`() => void`,description:`恢复下一快照；没有未来记录时无操作。`},{name:`reset`,type:`(value: T) => void`,description:`用给定值重新开始并清空两侧历史；value 必填。`},{name:`clear`,type:`() => void`,description:`保留当前值，只清空撤销和重做历史。`},{name:`beginTransaction`,type:`(label?: string) => boolean`,description:`记录事务基点；已有事务时返回 false，不嵌套。事务内禁止 undo/redo。`},{name:`commitTransaction`,type:`() => boolean`,description:`提交所有事务修改为一个撤销步骤；与基点 Object.is 相同则保留原历史。无事务返回 false。`},{name:`rollbackTransaction`,type:`() => boolean`,description:`恢复事务开始前的值及完整历史（含 redo）；无事务返回 false。`}],notes:[`保存引用，不做深拷贝。对象或数组必须不可变更新，原地修改会破坏历史快照。`,`事务进行中 canUndo/canRedo 均为 false；clear/reset 会丢弃事务，保留规则按对应方法。合并基于相邻写入间隔，持续输入可能形成较长的一条记录。`],types:`interface HistoryEntry<T> { value: T; label?: string }
interface UndoRedoOptions { limit?: number; mergeWindow?: number }
interface HistoryUpdateOptions { replace?: boolean; group?: string; label?: string }`},useLeaveConfirm:{source:D,signature:`useLeaveConfirm(
  dirty: boolean,
  options?: {
    confirm?: () => boolean | Promise<boolean>;
    message?: string;
  },
)`,parameters:[t(`dirty`,`boolean`,`必填`,`是否有未保存内容；为 true 时注册 beforeunload。`),r(`{
    confirm?: () => boolean | Promise<boolean>;
    message?: string;
}`,!1)],sections:[{title:`options`,rows:[t(`confirm`,`() => boolean | Promise<boolean>`,`window.confirm`,`SPA 主动离开时的确认函数；true 允许，false 拒绝，抛错/拒绝继续向调用方传播。`),t(`message`,`string`,`'有未保存的修改，确定离开吗？'`,`仅用于默认 window.confirm；不改变浏览器 beforeunload 文案。`)]}],returns:[],methods:[n(`confirmLeave`,`() => Promise<boolean>`,`dirty 为 false 直接允许；dirty 时执行确认，进行中的重复确认共用 Promise。`),n(`guard`,`(navigate: () => void) => Promise<boolean>`,`允许时调用 navigate 并返回 true；拒绝时不调用且返回 false。navigate 的同步异常会使 Promise 拒绝。`)],notes:[`不会自动拦截 SPA 链接、history 或浏览器后退；必须由路由调用方接入 guard/confirmLeave。beforeunload 是否弹窗取决于浏览器与用户交互条件。`]},useFocusWithin:{source:D,signature:`useFocusWithin()`,parameters:[],returns:[n(`focused`,`boolean`,`焦点位于绑定容器或后代内，初始 false。`),n(`bind`,`{ onFocus: () => void; onBlur: (event: React.FocusEvent<HTMLElement>) => void }`,`展开到容器；内部后代之间移动焦点不会置 false。`)],notes:[`这是 React 冒泡焦点事件的状态封装；不限制焦点，也不将 DOM 焦点主动移动到某处。`]},useLongPress:{source:D,signature:`useLongPress(
  onLongPress: (event: React.PointerEvent<HTMLElement>) => void,
  options?: {
    delay?: number;
    threshold?: number;
    disabled?: boolean;
  },
)`,parameters:[t(`onLongPress`,`(event: React.PointerEvent<HTMLElement>) => void`,`必填`,`达到延迟后调用一次，传入最初按下事件；其 currentTarget 仍指向按下的元素。`),r(`{
    delay?: number;
    threshold?: number;
    disabled?: boolean;
}`,!1)],sections:[{title:`options`,rows:[t(`delay`,`number`,`500`,`长按等待毫秒，负值按 0。`),t(`threshold`,`number`,`10`,`从按下位置移动的欧氏距离阈值 px，超过时取消；请传非负数。`),t(`disabled`,`boolean`,`false`,`禁用新长按，并取消当前等待。`)]}],returns:[n(`pressing`,`boolean`,`有效按压是否仍持续；回调触发后保持 true，直到松开/取消。初始 false。`),n(`bind`,`PointerBindings`,`展开到交互元素，包含下方指针处理器和 onClickCapture（长按触发后拦截随后的一次 click）。`)],methods:[n(`cancel`,`() => void`,`清除等待与当前指针状态，pressing 设 false。`)],types:`// PointerBindings 为文档结构名，不是包导出类型。
interface PointerBindings {
  onPointerDown(event: React.PointerEvent<HTMLElement>): void;
  onPointerMove(event: React.PointerEvent<HTMLElement>): void;
  onPointerUp(event: React.PointerEvent<HTMLElement>): void;
  onPointerCancel(event: React.PointerEvent<HTMLElement>): void;
  onLostPointerCapture(event: React.PointerEvent<HTMLElement>): void;
  onClickCapture(event: React.MouseEvent<HTMLElement>): void;
}`,notes:[`仅响应主按钮（button === 0），同一时刻只跟踪一个指针。移动超阈值、取消、松开、失去捕获、窗口失焦或卸载会清理；自行提供键盘等价按钮。`]},useDrag:{source:D,signature:`useDrag(
  data: string,
  options?: {
    type?: string;
    effectAllowed?: DataTransfer["effectAllowed"];
    disabled?: boolean;
  },
)`,parameters:[t(`data`,`string`,`必填`,`写入 DataTransfer 的字符串；对象需自行序列化。`),r(`{
    type?: string;
    effectAllowed?: DataTransfer["effectAllowed"];
    disabled?: boolean;
}`,!1)],sections:[{title:`options`,rows:[t(`type`,`string`,`'text/plain'`,`写入的 MIME 类型，需与接收方匹配。`),t(`effectAllowed`,`DataTransfer["effectAllowed"]`,`'copyMove'`,`允许的原生拖放操作。`),t(`disabled`,`boolean`,`false`,`设为 true 时 draggable 为 false，并阻止 dragstart。`)]}],returns:[n(`dragging`,`boolean`,`dragstart 后 true，dragend 后 false；初始 false。`),n(`bind`,`{ draggable: boolean; onDragStart: (event: React.DragEvent<HTMLElement>) => void; onDragEnd: () => void }`,`展开到拖动源；事件处理器和 draggable 必须一起绑定。`)]},useDrop:{source:D,signature:`useDrop(
  onDrop: (
    payload: {
      text: string;
      files: File[];
    },
    event: React.DragEvent<HTMLElement>,
  ) => void,
  options?: {
    type?: string;
    disabled?: boolean;
    dropEffect?: DataTransfer["dropEffect"];
  },
)`,parameters:[t(`onDrop`,`(payload: {
    text: string;
    files: File[];
}, event: React.DragEvent<HTMLElement>) => void`,`必填`,`匹配类型或文件放下时调用；text 按 options.type 读取，files 为原始文件数组。`),r(`{
    type?: string;
    disabled?: boolean;
    dropEffect?: DataTransfer["dropEffect"];
}`,!1)],sections:[{title:`options`,rows:[t(`type`,`string`,`'text/plain'`,`接受的文本 MIME 类型；始终同时接受 Files，不做文件扩展名过滤。`),t(`dropEffect`,`DataTransfer["dropEffect"]`,`'copy'`,`匹配拖入时设置的光标操作提示。`),t(`disabled`,`boolean`,`false`,`禁用接收并复位 over。`)]}],returns:[n(`over`,`boolean`,`匹配的拖动是否位于区域内，初始 false；对子节点进入/离开做深度计数。`),n(`bind`,`DropBindings`,`展开到放置区域；只为匹配拖放阻止默认行为。`)],types:`// DropBindings 为文档结构名，不是包导出类型。
interface DropBindings {
  onDragEnter(event: React.DragEvent<HTMLElement>): void;
  onDragOver(event: React.DragEvent<HTMLElement>): void;
  onDragLeave(): void;
  onDrop(event: React.DragEvent<HTMLElement>): void;
}`,notes:[`接收数据不可信，调用方负责 JSON/文件校验；不会自动读取文件内容或上传。原生拖放依赖浏览器，触屏交互需提供等价选择文件等操作。`]},useMutationObserver:{source:D,signature:`useMutationObserver(
  target: Target<Node>,
  callback: MutationCallback,
  options?: MutationObserverInit,
)`,parameters:[i(`Node`),t(`callback`,`MutationCallback`,`必填`,`使用最新回调处理变更批次；回调异常不由 Hook 捕获。`),t(`options`,`MutationObserverInit`,`{ childList: true, subtree: true }`,`原生观察配置；传入对象会完整替换默认对象，不做合并。`)],sections:[{title:`options · 原生观察配置`,rows:[t(`childList`,`boolean`,`true（省略 options 时）`,`观察子节点增加/移除。`),t(`subtree`,`boolean`,`true（省略 options 时）`,`观察后代节点；传入 options 但省略此项时原生默认 false。`),t(`attributes`,`boolean`,`原生规则`,`观察属性；attributeOldValue 或 attributeFilter 存在时通常隐式启用。`),t(`attributeFilter`,`string[]`,`undefined`,`只观察指定属性名称。`),t(`attributeOldValue`,`boolean`,`false`,`记录变更前的属性值。`),t(`characterData`,`boolean`,`原生规则`,`观察文本节点内容；设置 characterDataOldValue 时通常隐式启用。`),t(`characterDataOldValue`,`boolean`,`false`,`记录变更前文本值。`)]}],returns:[n(`supported`,`boolean`,`挂载后检测 MutationObserver，初始 false。`),n(`error`,`unknown`,`构造/observe 配置错误，初始 undefined；非法组合会记录错误而不观察。`)],methods:[n(`disconnect`,`() => void`,`停止当前观察；目标或配置变化才会重新建立观察。`),n(`takeRecords`,`() => MutationRecord[]`,`提取并清空当前待投递记录；没有观察器时返回 []。`)],types:a,notes:[`配置按深比较判断变化，目标节点替换也会重建。childList/attributes/characterData 至少有一个有效启用，否则原生 API 拒绝观察。`]},useSortable:{source:`src/web/sortable.ts`,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`每个可排序列表项的类型。`}],signature:`useSortable<T>(
  items: readonly T[],
  options: {
    getKey: (item: T) => React.Key;
    onChange: (items: T[]) => void;
    disabled?: boolean;
    messages?: SortableMessages;
  },
)`,parameters:[t(`items`,`readonly T[]`,`必填`,`受控列表；调用方收到 onChange 后更新状态。`),r(`{
    getKey: (item: T) => React.Key;
    onChange: (items: T[]) => void;
    disabled?: boolean;
    messages?: SortableMessages;
}`,!0)],sections:[{title:`options`,rows:[t(`getKey`,`(item: T) => React.Key`,`必填`,`返回唯一稳定 key，不使用随顺序变化的索引。`),t(`onChange`,`(items: T[]) => void`,`必填`,`收到新顺序；拖放在 drop 时调用，键盘每次移动即时调用。`),t(`disabled`,`boolean`,`false`,`禁止拖放/移动，行 tabIndex 设 -1；进行中的键盘排序会取消并恢复顺序。`),t(`messages`,`SortableMessages`,`简体中文文案`,`自定义读屏播报与 aria-roledescription：roleDescription、picked(position)、moved(position, total)、finished、cancelled。`)]}],returns:[n(`activeKey`,`React.Key | null`,`正在拖动/键盘拾取的 key，初始 null。`),n(`announcement`,`string`,`排序状态文案，初始空字符串；绑定到 role="status" 供读屏播报。`)],methods:[n(`getItemProps`,`(item: T) => SortableItemProps`,`展开到行，返回原生拖放、键盘与可访问属性，结构见下方。`),n(`move`,`(from: number, to: number) => boolean`,`索引从 0 开始，合法且有变化时调用 onChange 并返回 true；禁用、越界或相同索引返回 false。`),n(`cancel`,`() => void`,`键盘排序恢复拾取时的顺序并保留当前数据内容及新增项；拖放取消只清理活动状态。`)],types:`// SortableItemProps 为文档结构名，不是包导出类型。
interface SortableItemProps {
  draggable: boolean;
  tabIndex: number;
  "aria-roledescription": string;
  "aria-keyshortcuts": string;
  "data-sorting": boolean | undefined;
  onKeyDown(event: React.KeyboardEvent<HTMLElement>): void;
  onDragStart(event: React.DragEvent<HTMLElement>): void;
  onDragOver(event: React.DragEvent<HTMLElement>): void;
  onDrop(event: React.DragEvent<HTMLElement>): void;
  onDragEnd(): void;
  onBlur(event: React.FocusEvent<HTMLElement>): void; // 键盘排序中焦点离开即取消
}
interface SortableMessages {
  roleDescription?: string;
  picked?: (position: number) => string;
  moved?: (position: number, total: number) => string;
  finished?: string;
  cancelled?: string;
}`,notes:[`空格拾取；上下键/Home/End 调整；Enter/空格完成；Esc 取消。键盘只处理行自身获得焦点的事件，忽略内部按钮或输入法组合。`,`只接收当前实例的原生拖放；未提供跨列表排序、触摸排序引擎或焦点锁。为触屏保留上移/下移按钮。`]}},k={useQuery:{source:`src/data/query.ts`,signature:`useQuery<T, Key extends QueryKey, Selected = T>(
  store: QueryStore<T, Key>, key: Key | null, options?: QueryOptions<T, Selected>
)`,typeExample:`import { createQueryStore, useQuery, type QueryKey } from "@leonwgc/react-hooks";
type Page = { rows: { id: number; title: string }[]; total: number };
type ArticleKey = readonly ["articles", { page: number }];
const store = createQueryStore<Page, ArticleKey>(async ({ signal }, [, params]) => {
  const response = await fetch(\`/api/articles?page=\${params.page}\`, { signal });
  if (!response.ok) throw new Error("查询失败");
  return response.json();
});
function ArticleCount({ page }: { page: number }) {
  const query = useQuery(store, ["articles", { page }], {
    select: data => data.total, keepPreviousData: true,
  }); // data: number | undefined
  return <button onClick={() => store.invalidate(["articles"], { exact: false })}>
    {query.isPreviousData ? "更新中：" : "共："}{query.data ?? 0}
  </button>;
}`,generics:[{name:`T`,type:`unknown`,defaultValue:`无默认类型`,description:`同一个 store 内每个查询结果的数据类型。`},{name:`Key`,type:`QueryKey`,defaultValue:`无默认类型`,description:`字符串或 JSON 值组成的只读数组；对象键排序后比较，数组顺序有意义。createQueryStore 的 Key 默认 string，结构键请显式指定。`},{name:`Selected`,type:`unknown`,defaultValue:`T`,description:`select 转换后的展示数据类型，从回调返回值推导；不会改变共享缓存中的原始 T。`}],parameters:[{name:`store`,type:`QueryStore<T, Key>`,defaultValue:`必填`,description:`由 createQueryStore(service, options?) 创建；保持引用稳定。`},{name:`key`,type:`Key | null`,defaultValue:`必填`,description:`相同 store 和键共享结果；null 不订阅、不自动请求。`},{name:`options`,type:`QueryOptions<T, Selected>`,defaultValue:`{}`,description:`enabled 默认 true；false 仍订阅缓存，但不自动获取或响应失效刷新。`}],sections:[{title:`options`,rows:[{name:`enabled`,type:`boolean`,defaultValue:`true`,description:`false 仍订阅缓存，但不自动获取或响应失效刷新；手动 refetch 可用。`},{name:`select`,type:`(data: T) => Selected`,defaultValue:`undefined`,description:`每个订阅者的数据转换；不修改共享缓存，纯函数且应避免抛错。`},{name:`isEqual`,type:`(previous: Selected | undefined, next: Selected | undefined) => boolean`,defaultValue:`Object.is`,description:`比较选中数据，返回 true 保留旧快照引用；其他订阅字段仍独立比较。`},{name:`notifyOnChangeProps`,type:`readonly (keyof QueryState<Selected>)[]`,defaultValue:`全部状态字段`,description:`仅这些字段变化才发布新快照；例如 ["data"] 隔离后台刷新状态。未订阅字段可能保持旧值，请勿依赖其及时更新。`},{name:`keepPreviousData`,type:`boolean`,defaultValue:`false`,description:`同 store 切换键且新键暂无数据时保留上次已提交数据，通过 isPreviousData 区分；不跨 store 或 null 订阅传递。`}]},{title:`createQueryStore 参数`,rows:[{name:`service`,type:`(context: { signal: AbortSignal }, key: Key) => Promise<T>`,defaultValue:`必填`,description:`键变化时对应不同缓存项，实际请求应透传 signal。`}]},{title:`createQueryStore options`,rows:[{name:`staleTime`,type:`number`,defaultValue:`30000`,description:`新订阅在此毫秒内复用成功数据；到期本身不触发定时刷新；Infinity 表示不过期。`},{name:`cacheTime`,type:`number`,defaultValue:`300000`,description:`无人订阅时保留缓存的毫秒数；到期取消请求并回收。Infinity 禁止自动回收。`}]},{title:`store.invalidate(key?, options?)`,rows:[{name:`key`,type:`QueryKey`,defaultValue:`undefined`,description:`省略时失效所有已有键；结构键按值匹配，不需要同一对象引用。`},{name:`options.exact`,type:`boolean`,defaultValue:`true`,description:`false 启用前缀匹配：数组按完整元素前缀匹配；字符串按单词边界匹配（"user" 匹配 "user"、"user:1"、"user/1" 和首元素为 "user" 的数组键，不匹配 "users"）；不做对象部分字段匹配。启用订阅者会重新请求。`}]}],returns:[{name:`data`,type:`Selected | undefined`,description:`当前订阅的 select 结果，或 keepPreviousData 保留的前键结果；共享缓存仍为 T。`},{name:`error`,type:`unknown`,description:`最近一次请求失败；新请求或 setData 清空。`},{name:`status`,type:`'idle' | 'pending' | 'success' | 'error'`,description:`当前缓存状态；刷新已有数据时状态不强制变为 pending。`},{name:`isFetching`,type:`boolean`,description:`当前键是否正在获取或刷新。`},{name:`updatedAt`,type:`number`,description:`最后成功写入时间戳（毫秒），初始为 0。`},{name:`isPreviousData`,type:`boolean`,description:`正在展示上一个键的数据时为 true；新键有数据、key 为 null 或更换 store 时为 false。`}],methods:[{name:`refetch`,type:`() => Promise<T>`,description:`强制刷新；同键进行中的请求仍共享 Promise。失败需 catch，null 键时拒绝。`},{name:`invalidate`,type:`() => void`,description:`标记当前键过期并取消旧请求；存在启用的订阅者时立即重取。`},{name:`setData`,type:`(value: T | ((previous: T | undefined) => T)) => void`,description:`取消当前键请求并同步更新所有订阅者；不自动提交服务器。`},{name:`cancel`,type:`() => void`,description:`取消共享键的请求，保留已有数据；会影响同键的其他订阅者。`}],types:`type QueryKeyPart = string | number | boolean | null
  | readonly QueryKeyPart[] | { readonly [key: string]: QueryKeyPart };
type QueryKey = string | readonly QueryKeyPart[];
interface QueryOptions<T, Selected = T> {
  enabled?: boolean;
  select?: (data: T) => Selected;
  isEqual?: (previous: Selected | undefined, next: Selected | undefined) => boolean;
  notifyOnChangeProps?: readonly (keyof QueryState<Selected>)[];
  keepPreviousData?: boolean;
}

// QueryStore、QueryState 和 createQueryStore 均从包入口导出。
interface QueryStore<T, Key extends QueryKey = string> {
  fetch(key: Key, force?: boolean): Promise<T>;
  invalidate(key?: QueryKey, options?: { exact?: boolean }): void; // 不传 key 时失效全部已有键
  setData(key: Key, value: T | ((previous: T | undefined) => T)): void;
  cancel(key: Key): void;
  clear(): void; // 清空缓存，不主动重新请求
  subscribe(key: Key, listener: () => void, enabled?: boolean): () => void;
  getSnapshot(key: Key): QueryState<T>;
  getServerSnapshot(): QueryState<T>;
}
interface QueryState<T> {
  data: T | undefined;
  error: unknown;
  status: 'idle' | 'pending' | 'success' | 'error';
  isFetching: boolean;
  updatedAt: number;
}`,notes:[`同键须代表同一组服务参数。createQueryStore 的 service 在创建时确定；不要让它捕获会变化但未编码进 key 的组件状态。`,`卸载一个订阅者不会取消其他组件共用的请求；无人订阅后仍可完成并写缓存，最终按 cacheTime 回收。`,`SSR 不会自动请求；每个服务端请求创建自己的 store，禁止把用户缓存放在共享服务端单例。本版不含持久化、脱水注水、焦点刷新或重试；这些能力不隐式继承 useRequest。`,`结构键只接受有限数字、字符串、布尔、null、数组和普通对象；不接受 undefined、函数、Date、循环引用。不要修改已经交给 store 的键。`,`select 仅影响订阅展示；refetch 仍返回 Promise<T>，setData 接收原始 T。keepPreviousData 不改写新键缓存，展示前键数据期间应禁用依赖新结果的分页操作。`]},useSteps:{source:`src/form/steps.ts`,signature:`useSteps(options: StepsOptions)`,parameters:[{name:`options`,type:`StepsOptions`,defaultValue:`必填`,description:`步骤流配置。`}],sections:[{title:`options`,rows:[{name:`count`,type:`number`,defaultValue:`必填`,description:`总步数，有限值向下取整且最少为 1。`},{name:`initialStep`,type:`number`,defaultValue:`0`,description:`从 0 开始的初始步骤；超出范围会截断。`},{name:`validate`,type:`(context: { from: number; to: number; signal: AbortSignal }) => boolean | Promise<boolean>`,defaultValue:`undefined`,description:`只校验向前移动的当前步骤；true 才切换，false 保持原步骤，异常写入 error。跨步跳转不会逐步校验中间步骤。`}]}],returns:[{name:`step`,type:`number`,description:`当前步骤索引。`},{name:`count`,type:`number`,description:`规范化后的总步数。`},{name:`completed`,type:`number[]`,description:`成功向前离开的步骤，去重并升序排列。`},{name:`isFirst`,type:`boolean`,description:`是否位于第一步。`},{name:`isLast`,type:`boolean`,description:`是否位于最后一步。`},{name:`validating`,type:`boolean`,description:`是否等待当前向前移动的校验。`},{name:`error`,type:`unknown`,description:`当前有效校验的异常；新操作或 reset 清空。`}],methods:[{name:`goTo`,type:`(target: number) => Promise<boolean>`,description:`跳到目标步骤；成功移动返回 true，校验失败、原地操作或过期操作返回 false。`},{name:`next`,type:`() => Promise<boolean>`,description:`前进一步并按需校验。`},{name:`previous`,type:`() => Promise<boolean>`,description:`后退一步，不触发前进校验。`},{name:`reset`,type:`(target?: number) => void`,description:`取消校验，清空完成记录和错误，返回 initialStep 或指定步骤。`},{name:`cancel`,type:`() => void`,description:`取消等待中的校验，保留当前步骤和完成记录。`}],notes:[`后发操作、reset、count 变化或卸载使旧校验失效。validate 应响应 signal；忽略 signal 的 Promise 仍可能继续执行，但不会修改步骤。`,`步骤文案和字段归属由调用方管理；返回的是导航状态，不自动提交表单。`]},useDocumentTitle:{source:`src/browser/document.ts`,signature:`useDocumentTitle(title: string, options?: { restoreOnUnmount?: boolean })`,parameters:[{name:`title`,type:`string`,defaultValue:`必填`,description:`要显示在浏览器标签上的标题，变化后同步更新。`},{name:`options`,type:`{ restoreOnUnmount?: boolean }`,defaultValue:`{}`,description:`卸载恢复策略。`}],sections:[{title:`options`,rows:[{name:`restoreOnUnmount`,type:`boolean`,defaultValue:`true`,description:`最后一个标题拥有者卸载时恢复最初标题；false 保留最终标题。`}]}],returns:[{name:`返回值`,type:`void`,description:`直接同步 document.title，没有返回值。`}],notes:[`多个实例按副作用注册顺序由最后注册者控制；卸载后恢复仍存在的拥有者。更新较早实例的标题不会抢占较晚实例。`,`如果其他代码直接更改了标题，清理时不会覆盖该外部修改。SSR 不访问 document，也不替代框架的服务端 head 管理。`]},useObjectURL:{source:`src/browser/document.ts`,signature:`useObjectURL(input: Blob | null)`,parameters:[{name:`input`,type:`Blob | null`,defaultValue:`必填`,description:`File 也是 Blob；null 清空预览。保持同一 Blob 引用可复用 URL。`}],returns:[{name:`url`,type:`string | null`,description:`创建成功后的对象 URL；更换 input 时立即隐藏旧 URL，挂载后创建。`},{name:`error`,type:`unknown`,description:`创建 URL 时的异常，无错误时为 undefined。`},{name:`supported`,type:`boolean`,description:`当前环境是否同时支持创建与回收对象 URL；SSR 为 false。`}],notes:[`更换 Blob、传入 null 或卸载时自动 revokeObjectURL。不要将 URL 持久化，也不要在 Hook 已卸载后继续使用。`,`Blob URL 只代表本地资源地址，不会自动上传文件或下载文件。`]},useTextareaAutoSize:{source:`src/browser/document.ts`,signature:`useTextareaAutoSize(target: Target<HTMLTextAreaElement>, value: string, options?: { minRows?: number; maxRows?: number; enabled?: boolean })`,parameters:[{name:`target`,type:`Target<HTMLTextAreaElement>`,defaultValue:`必填`,description:`textarea 节点、ref、返回节点的函数或 null。`},{name:`value`,type:`string`,defaultValue:`必填`,description:`文本域当前值；受控输入更新后重新测量，实际高度来自元素 scrollHeight。`},{name:`options`,type:`{ minRows?: number; maxRows?: number; enabled?: boolean }`,defaultValue:`{}`,description:`行数边界与启停。`}],sections:[{title:`options`,rows:[{name:`minRows`,type:`number`,defaultValue:`1`,description:`最少行数，不小于 1。`},{name:`maxRows`,type:`number`,defaultValue:`Infinity`,description:`最多行数，不小于 minRows；超出时启用内部滚动。`},{name:`enabled`,type:`boolean`,defaultValue:`true`,description:`false 时解除监听并恢复原内联样式。`}]}],returns:[{name:`height`,type:`number`,description:`最近测量后应用的 CSS 高度 px；未绑定或禁用时为 0。`}],methods:[{name:`resize`,type:`() => void`,description:`手动重测，适合字体加载或外部样式变化。`}],types:a,notes:[`监听输入、窗口 resize 和元素宽度变化，支持 content-box 和 border-box；卸载或换节点时恢复原 height/overflowY。`,`应让 CSS line-height 为明确数值；normal 使用 font-size × 1.2 估算。隐藏元素的几何值可能为 0，显示后请调用 resize。`]},useSpring:{source:`src/animation/motion.ts`,signature:`useSpring(target: number, options?: SpringOptions)`,parameters:[{name:`target`,type:`number`,defaultValue:`必填`,description:`有限目标值；NaN 或 Infinity 抛出 RangeError。`},{name:`options`,type:`SpringOptions`,defaultValue:`{}`,description:`弹簧物理参数和初值。`}],sections:[{title:`options`,rows:[{name:`initialValue`,type:`number`,defaultValue:`target`,description:`仅首次初始化使用；提供不同值可触发首次动画。`},{name:`stiffness`,type:`number`,defaultValue:`170`,description:`正数刚度，越大响应越快。`},{name:`damping`,type:`number`,defaultValue:`26`,description:`正数阻尼，影响回弹与收敛。`},{name:`mass`,type:`number`,defaultValue:`1`,description:`正数质量。`},{name:`precision`,type:`number`,defaultValue:`0.01`,description:`位移误差与速度都低于阈值时精确吸附目标。`},{name:`respectReducedMotion`,type:`boolean`,defaultValue:`true`,description:`默认按系统减少动态效果设置直接吸附。`}]}],returns:[{name:`value`,type:`number`,description:`当前插值，可用于样式或数字展示。`},{name:`velocity`,type:`number`,description:`当前速度，单位为值/秒。`},{name:`animating`,type:`boolean`,description:`是否仍在进行逐帧计算。`}],methods:[{name:`stop`,type:`() => void`,description:`暂停在当前位置并将速度清零。`},{name:`finish`,type:`() => void`,description:`立即到达最新 target。`},{name:`restart`,type:`() => void`,description:`从当前位置重新向最新 target 运动。`}],notes:[`采用阻尼弹簧解析解，帧间隔最多按 64ms 推进；后台恢复时不会按全部离开时间跳跃。`,`目标改变时沿用当前值和速度，参数改变会重新调度。无 RAF 时直接到达目标，卸载取消待执行帧。正数参数无效时使用默认值。`]},useTransitionState:{source:`src/animation/motion.ts`,signature:`useTransitionState(open: boolean, options?: TransitionStateOptions)`,parameters:[{name:`open`,type:`boolean`,defaultValue:`必填`,description:`期望的展开状态。`},{name:`options`,type:`TransitionStateOptions`,defaultValue:`{}`,description:`进入、退出时长与首次进入策略。`}],sections:[{title:`options`,rows:[{name:`enterDuration`,type:`number`,defaultValue:`200`,description:`进入阶段兜底等待 ms；绑定的匹配结束事件可提前完成。负数按 0。`},{name:`exitDuration`,type:`number`,defaultValue:`200`,description:`退出阶段兜底等待 ms；绑定的匹配结束事件可提前卸载。负数按 0。`},{name:`appear`,type:`boolean`,defaultValue:`false`,description:`首次 open 为 true 时是否也经历 entering。`},{name:`preEnter`,type:`boolean`,defaultValue:`false`,description:`从 unmounted 进入时先经过 preEnter 阶段（已挂载、应用起始样式）两帧，再切到 entering，使新挂载元素上的 CSS transition 能真正播放。使用 @keyframes 动画时无需开启。`},{name:`endEvent`,type:`'transitionend' | 'animationend'`,defaultValue:`'transitionend'`,description:`将 bind 展开到实际动画元素上，匹配事件可提前结束阶段；只处理元素自身事件，忽略子节点冒泡。`},{name:`propertyName`,type:`string`,defaultValue:`undefined`,description:`仅接收匹配 CSS 属性的 transitionend，例如 opacity；省略接受任意属性。`},{name:`animationName`,type:`string`,defaultValue:`undefined`,description:`仅接收匹配 keyframes 名称的 animationend；省略接受任意动画名称。`},{name:`onEnter`,type:`() => void`,defaultValue:`undefined`,description:`进入阶段开始一次。反向切换不会触发被取消阶段的完成回调。`},{name:`onEntered`,type:`() => void`,defaultValue:`undefined`,description:`进入阶段完成一次。反向切换不会触发被取消阶段的完成回调。`},{name:`onExit`,type:`() => void`,defaultValue:`undefined`,description:`退出阶段开始一次。反向切换不会触发被取消阶段的完成回调。`},{name:`onExited`,type:`() => void`,defaultValue:`undefined`,description:`退出完成并卸载一次。反向切换不会触发被取消阶段的完成回调。`}]}],returns:[{name:`phase`,type:`TransitionPhase`,description:`生命周期阶段；快速反向切换会清除旧计时器。`},{name:`mounted`,type:`boolean`,description:`除 unmounted 外均为 true；用此值决定是否渲染内容。`},{name:`visible`,type:`boolean`,description:`与期望 open 一致，退出阶段为 false。`},{name:`bind`,type:`{ onTransitionEnd: React.TransitionEventHandler<HTMLElement>; onAnimationEnd: React.AnimationEventHandler<HTMLElement> }`,description:`展开到实际动画元素上；不自动添加 CSS。事件与兜底计时器只会完成当前阶段一次。`}],types:`type TransitionPhase = 'unmounted' | 'preEnter' | 'entering' | 'entered' | 'exiting';
interface TransitionStateOptions {
  enterDuration?: number; exitDuration?: number; appear?: boolean;
  preEnter?: boolean; // 仅开启时出现 'preEnter' 阶段
  endEvent?: "transitionend" | "animationend";
  propertyName?: string; animationName?: string;
  onEnter?: () => void; onEntered?: () => void;
  onExit?: () => void; onExited?: () => void;
}`,notes:[`本 Hook 管理挂载时序，不自动添加 CSS 动画。将 phase 映射到类名或样式，并让 CSS 时长与配置一致。`,`系统要求减少动态效果时立即完成阶段切换。修改时长会重新计时；卸载清理所有计时器。`,`兜底时长应不短于 CSS 动画时长；未绑定 bind 或浏览器不派发结束事件时仍能完成卸载。首次 open: true 且 appear: false 不触发进入回调。`]},useGesture:{source:`src/web/gesture.ts`,signature:`useGesture(options?: GestureOptions)`,parameters:[{name:`options`,type:`GestureOptions`,defaultValue:`{}`,description:`单指针手势配置与生命周期回调。`}],sections:[{title:`options`,rows:[{name:`axis`,type:`'both' | 'x' | 'y'`,defaultValue:`'both'`,description:`限制输出位移轴；bind.style 按方向设置 touchAction。`},{name:`threshold`,type:`number`,defaultValue:`8`,description:`进入拖动态的累计距离 px。`},{name:`swipeDistance`,type:`number`,defaultValue:`40`,description:`结束时识别滑动方向的最小累计距离 px，不小于 threshold。`},{name:`disabled`,type:`boolean`,defaultValue:`false`,description:`禁用新手势并取消正在进行的手势。`},{name:`onStart`,type:`(state: GestureState) => void`,defaultValue:`undefined`,description:`主指针按下时调用。`},{name:`onMove`,type:`(state: GestureState) => void`,defaultValue:`undefined`,description:`有效指针移动时调用。`},{name:`onEnd`,type:`(state: GestureState) => void`,defaultValue:`undefined`,description:`正常松开时调用，可读取 swipe。`},{name:`onCancel`,type:`(state: GestureState) => void`,defaultValue:`undefined`,description:`pointercancel、失去捕获、窗口失焦、禁用或 cancel 时调用。`}]}],returns:[{name:`active`,type:`boolean`,description:`是否按下有效主指针。`},{name:`dragging`,type:`boolean`,description:`按住且已超过 threshold；结束后为 false。`},{name:`offset`,type:`{ x: number; y: number }`,description:`自按下位置开始的累计位移 px。`},{name:`velocity`,type:`{ x: number; y: number }`,description:`最近采样速度 px/ms；停止移动超过 80ms 后结束采样会归零。`},{name:`direction`,type:`GestureDirection | null`,description:`累计位移的主方向。`},{name:`swipe`,type:`GestureDirection | null`,description:`正常松开且达到距离阈值时的方向；按下或取消时清空。`},{name:`bind`,type:`GestureBindings`,description:`展开到 HTMLElement；保留返回的 style.touchAction 以协调原生滚动。`}],methods:[{name:`cancel`,type:`() => void`,description:`取消当前手势并释放捕获，保留最后位移。`},{name:`reset`,type:`() => void`,description:`取消后恢复全部初始状态。`}],types:`type GestureDirection = 'left' | 'right' | 'up' | 'down';
interface GestureState {
  active: boolean; dragging: boolean;
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  direction: GestureDirection | null;
  swipe: GestureDirection | null;
}
// GestureBindings 为本文结构说明名称，不是包导出类型。
interface GestureBindings {
  onPointerDown(event: React.PointerEvent<HTMLElement>): void;
  onPointerMove(event: React.PointerEvent<HTMLElement>): void;
  onPointerUp(event: React.PointerEvent<HTMLElement>): void;
  onPointerCancel(event: React.PointerEvent<HTMLElement>): void;
  onLostPointerCapture(event: React.PointerEvent<HTMLElement>): void;
  style: React.CSSProperties;
}`,notes:[`只接收主指针及鼠标左键；额外指针被忽略，不包含双指缩放。卸载释放指针捕获。`,`bind 不提供键盘拖动或排序，业务操作应提供按钮等键盘等价入口。useDrag/useDrop 对应 HTML 数据拖放，本 Hook 对应指针位移。`]},...f,...g,...b,...x,...C,...w,...E,...O},A={useQuery:`object`,useSteps:`object`,useDocumentTitle:`void`,useObjectURL:`object`,useTextareaAutoSize:`object`,useSpring:`object`,useTransitionState:`object`,useGesture:`object`,useAnimate:`object`,useAsyncAction:`object`,useAsyncQueue:`object`,useBoolean:`object`,useBroadcastChannel:`object`,useClickOutside:`void`,useClipboard:`object`,useControllableState:`tuple`,useCountdown:`object`,useDebounce:`value`,useDebounceFn:`object`,useDirty:`object`,useDisclosure:`object`,useDownload:`object`,useDrag:`object`,useDrop:`object`,useEditor:`object`,useElementSize:`object`,useEventListener:`void`,useEventSource:`object`,useFieldArray:`object`,useFocusWithin:`object`,useForm:`object`,useFormField:`object`,useFullscreen:`object`,useImage:`object`,useInfiniteScroll:`object`,useIntersectionObserver:`value`,useInterval:`void`,useKeyPress:`void`,useLatest:`object`,useLeaveConfirm:`object`,useLocalStorageState:`object`,useLongPress:`object`,useMediaQuery:`value`,useMemoizedFn:`function`,useMutationObserver:`object`,useOnline:`value`,usePageVisibility:`value`,usePagination:`object`,usePermission:`object`,useRafLoop:`object`,useReducedMotion:`value`,useRequest:`object`,useScroll:`object`,useSearch:`object`,useSelection:`object`,useSessionStorageState:`object`,useSetState:`tuple`,useSortable:`object`,useTable:`object`,useTextSelection:`object`,useThrottleFn:`object`,useToggle:`object`,useUndoRedo:`object`,useUpload:`object`,useUrlState:`tuple`,useVirtualList:`object`,useWindowSize:`object`};function j(e,t){let n=A[e],r=[...t.returns,...t.methods??[]],i=t.generics?.length?`<${t.generics.map(e=>`${e.name}${e.type===`unknown`?``:` extends ${e.type}`}${e.defaultValue===`无默认类型`?``:` = ${e.defaultValue}`}`).join(`, `)}>`:``,a=t=>e===`useFieldArray`?t.replace(/\bItem\b/g,`(FieldValue<T, P> extends readonly (infer I)[] ? I : never)`):t,o;if(n===`object`){let e=new Map,t=[];for(let n of r){let[r,i]=n.name.split(`.`);if(i){let t=e.get(r)??[];t.push({name:i,type:a(n.type)}),e.set(r,t)}else t.push(`  ${n.name}: ${a(n.type)};`)}for(let[n,r]of e)t.push(`  ${n}: {\n${r.map(e=>`    ${e.name}: ${e.type};`).join(`
`)}\n  };`);o=`{\n${t.join(`
`)}\n}`}else o=n===`tuple`?`readonly [\n${r.map(e=>`  ${e.name.replace(/^\[\d+\]\s*/,``)}: ${e.type},`).join(`
`)}\n]`:t.returns[0].type;return{kind:n,description:n===`object`?e===`useLatest`?`返回一个引用稳定的 ref 对象。current 是该对象的属性，修改它不会触发渲染。`:`返回一个对象。下面的属性和方法均属于同一个返回对象，可以通过 result.属性 / result.方法() 访问，也可以解构使用。`:n===`tuple`?`返回一个只读元组，按位置解构为状态值和更新函数。下面列出元组元素，函数是元组中的一项。`:n===`function`?`直接返回一个可调用函数。下方名称只是示例变量名，不是对象属性；通过该函数传入参数并接收结果。`:n===`void`?`没有返回值（void）。此 Hook 执行副作用，并按其清理策略在卸载时解除订阅或恢复状态。`:`直接返回下列类型的值。表中的名称是接收结果的示例变量名，不是返回对象的属性。`,type:`type ${e[0].toUpperCase()+e.slice(1)}Result${i} = ${o};`}}var M=e();function N({id:e,title:t,rows:n,parameters:r=!1,generics:i=[],genericDefinitions:a=!1,nested:o=!1,nameLabel:s=`名称`}){return(0,M.jsxs)(`div`,{className:`api-group`,id:e,children:[(0,M.jsx)(o?`h4`:`h3`,{id:`${e}-heading`,children:t}),(0,M.jsx)(`div`,{className:`table-wrap`,children:(0,M.jsxs)(`table`,{className:`api-table api-detail-table${r?` api-parameter-table`:``}`,"aria-labelledby":`${e}-heading`,children:[(0,M.jsx)(`thead`,{children:(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`th`,{scope:`col`,children:s}),(0,M.jsx)(`th`,{scope:`col`,children:a?`类型约束`:`类型 / 签名`}),r&&(0,M.jsx)(`th`,{scope:`col`,children:a?`默认类型`:`默认值 / 必填`}),(0,M.jsx)(`th`,{scope:`col`,children:`说明`})]})}),(0,M.jsx)(`tbody`,{children:n.map(e=>(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`th`,{scope:`row`,children:(0,M.jsx)(`code`,{children:e.name})}),(0,M.jsxs)(`td`,{"data-label":a?`类型约束`:`类型 / 签名`,children:[(0,M.jsx)(`code`,{children:a&&e.type===`unknown`?`无约束`:e.type}),i.filter(t=>e.type.split(/\W+/).includes(t.name)).map(e=>(0,M.jsxs)(`details`,{className:`api-type-help`,children:[(0,M.jsxs)(`summary`,{children:[e.name,` 类型说明`]}),(0,M.jsx)(`p`,{children:e.description}),(0,M.jsxs)(`p`,{children:[`约束：`,(0,M.jsx)(`code`,{children:e.type===`unknown`?`无约束`:e.type}),`；默认类型：`,(0,M.jsx)(`code`,{children:e.defaultValue}),`。`]})]},e.name))]}),r&&(0,M.jsx)(`td`,{"data-label":a?`默认类型`:`默认值 / 必填`,children:(0,M.jsx)(`code`,{children:`defaultValue`in e?e.defaultValue:`—`})}),(0,M.jsx)(`td`,{"data-label":`说明`,children:e.description})]},e.name))})]})})]})}function P({name:e,CodeBlock:t}){let n=k[e],r=j(e,n),i=[...n.generics?.length?[{id:`api-generics`,title:`泛型说明`}]:[],{id:`api-parameters`,title:`调用参数`},...(n.sections??[]).map((e,t)=>({id:`api-options-${t}`,title:e.title})),{id:`api-result`,title:`返回值`},...n.types?[{id:`api-types`,title:`关联类型`}]:[]];return(0,M.jsxs)(`div`,{className:`api-reference`,children:[(0,M.jsxs)(`p`,{className:`api-intro`,children:[`调用签名列出 TypeScript 参数类型；返回结构及其成员见下表。? 表示可省略，参数表中的“必填”表示不可省略，其余为省略时的默认值。泛型由传入值推断，也可显式指定；类型列中的说明可展开查看。`,(0,M.jsx)(`a`,{href:`https://github.com/leonwgc/react-hooks/blob/master/${n.source}`,target:`_blank`,rel:`noreferrer`,children:`查看实现 ↗`})]}),(0,M.jsx)(t,{code:n.signature}),(0,M.jsx)(`nav`,{className:`api-jump-links`,"aria-label":`${e} API 目录`,children:i.map(e=>(0,M.jsx)(`button`,{type:`button`,onClick:()=>document.getElementById(e.id)?.scrollIntoView({block:`start`,behavior:window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?`instant`:`smooth`}),children:e.title},e.id))}),!!n.generics?.length&&(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(N,{id:`api-generics`,title:`泛型说明`,rows:n.generics,parameters:!0,genericDefinitions:!0}),n.typeExample&&(0,M.jsx)(t,{code:n.typeExample})]}),n.parameters.length?(0,M.jsx)(N,{id:`api-parameters`,title:`调用参数`,rows:n.parameters,parameters:!0,generics:n.generics}):(0,M.jsxs)(`div`,{className:`api-group`,id:`api-parameters`,children:[(0,M.jsx)(`h3`,{children:`调用参数`}),(0,M.jsx)(`p`,{children:`无需传入参数。`})]}),n.sections?.map((e,t)=>(0,M.jsx)(N,{id:`api-options-${t}`,title:e.title,rows:e.rows,parameters:!0,generics:n.generics},e.title)),(0,M.jsxs)(`section`,{id:`api-result`,className:`api-group api-result`,"aria-labelledby":`api-result-heading`,children:[(0,M.jsx)(`h3`,{id:`api-result-heading`,children:`返回值`}),(0,M.jsx)(`p`,{children:r.description}),(0,M.jsxs)(`details`,{className:`return-structure`,children:[(0,M.jsx)(`summary`,{children:`查看完整返回类型`}),(0,M.jsx)(t,{code:r.type})]}),n.returns.length||r.kind===`tuple`?(0,M.jsx)(N,{id:`api-returns`,title:r.kind===`object`?`对象属性`:r.kind===`tuple`?`元组元素`:r.kind===`function`?`返回的函数`:`返回值说明`,nameLabel:r.kind===`object`?`属性`:r.kind===`tuple`?`位置 / 示例变量`:r.kind===`void`?`返回类型`:`示例变量`,rows:r.kind===`tuple`?[...n.returns,...n.methods??[]]:n.returns,generics:n.generics,nested:!0}):(0,M.jsx)(`div`,{className:`api-group`,id:`api-returns`,children:(0,M.jsx)(`p`,{children:`此返回对象只包含下列方法，无额外状态属性。`})}),r.kind===`object`&&!!n.methods?.length&&(0,M.jsx)(N,{id:`api-methods`,title:`对象方法`,nameLabel:`方法`,rows:n.methods,generics:n.generics,nested:!0})]}),n.types&&(0,M.jsxs)(`div`,{className:`api-group`,id:`api-types`,children:[(0,M.jsx)(`h3`,{children:`关联类型`}),(0,M.jsx)(t,{code:n.types})]}),!!n.notes?.length&&(0,M.jsxs)(`div`,{className:`api-group api-notes`,children:[(0,M.jsx)(`h3`,{children:`使用约定`}),(0,M.jsx)(`ul`,{children:n.notes.map(e=>(0,M.jsx)(`li`,{children:e},e))})]})]})}export{P as default};