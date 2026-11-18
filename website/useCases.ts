import type { HookName } from "./catalog";

export const useCases = {
  useBoolean: {
    overview:
      "集中管理布尔状态与稳定的开关操作，适合通知开关、密码可见性、确认状态和局部内容显示。",
    scenarios: [
      {
        title: "密码显示开关",
        description:
          "切换输入框类型，观察同一布尔状态如何同时控制按钮文案和密码可见性。",
      },
      {
        title: "显式设置与函数更新",
        description:
          "使用 setTrue、setFalse 与 setValue，重复启用不会反转状态。",
      },
    ],
  },
  useToggle: {
    overview:
      "在两个业务值之间切换，值可以是字符串、数字或稳定的对象引用；适合布局模式、计费周期和预览配置。",
    scenarios: [
      {
        title: "数字缩放档位",
        description:
          "在 100% 和 150% 两个数字值之间切换，也可以直接指定一个档位。",
      },
      {
        title: "对象预设与自定义值",
        description:
          "对象按引用比较；手动设置第三个值后再次切换会回到第一个预设。",
      },
    ],
  },
  useSetState: {
    overview:
      "对对象状态进行顶层合并，适合局部表单、筛选器和多个相关字段；嵌套对象需要显式保留其余属性。",
    scenarios: [
      {
        title: "多字段筛选条件",
        description: "修改一个字段会保留其他字段，支持一次提交多个字段。",
      },
      {
        title: "嵌套对象与连续更新",
        description: "显式复制嵌套结构；连续两次函数更新会基于前一次结果累计。",
      },
    ],
  },
  useControllableState: {
    overview:
      "让同一个组件同时支持外部受控值和内部默认值，适合封装选择器、计数器和可复用表单控件。",
    scenarios: [
      {
        title: "父级控制的评分",
        description:
          "子级提出新值，由父级 onChange 写回；父级也可以直接重置值。",
      },
      {
        title: "受控值需要回写",
        description:
          "切换是否接受子组件的变更，观察回调通知和实际受控值的区别。",
      },
    ],
  },
  useLatest: {
    overview:
      "保存最新值的稳定引用，让延时回调或长期订阅在触发时读取最近的数据；修改引用本身不会触发渲染。",
    scenarios: [
      {
        title: "长期订阅读取最新草稿",
        description: "事件监听只安装一次，修改输入后触发事件仍能读到最新内容。",
      },
      {
        title: "引用更新不主动渲染",
        description: "在事件中暂存 ref 值并读取；下一次渲染会再次同步传入值。",
      },
    ],
  },
  useMemoizedFn: {
    overview:
      "保持函数引用稳定，同时执行最新的回调逻辑，适合订阅处理器、传给子组件的回调和需要最新参数的操作。",
    scenarios: [
      {
        title: "参数与返回值透传",
        description: "改变倍率后，稳定函数会使用最新倍率计算并返回结果。",
      },
      {
        title: "订阅无需重新绑定",
        description:
          "局部事件源只绑定一次，改变前缀后事件处理函数仍使用最新文案。",
      },
    ],
  },
  useDebounce: {
    overview:
      "延后发布频繁变化的值，适合搜索联想、筛选条件和实时预览；界面输入保持即时，昂贵计算使用稳定后的值。",
    scenarios: [
      {
        title: "可调整等待时间",
        description: "修改等待时间并连续输入，比较即时值与防抖值。",
      },
      {
        title: "对象条件合并查询",
        description: "多个条件组成同一个对象，停止修改后一起成为查询快照。",
      },
    ],
  },
  useDebounceFn: {
    overview:
      "合并短时间内多次函数调用，只执行最后一次参数；适合自动保存、输入验证和按钮触发的延迟操作。",
    scenarios: [
      {
        title: "草稿自动保存",
        description:
          "输入持续重启等待，手动保存调用 flush，撤销待保存调用 cancel。",
      },
      {
        title: "只保留最后一组参数",
        description:
          "依次传入 A、B、C；等待结束或立即执行只会处理最后一次参数。",
      },
    ],
  },
  useThrottleFn: {
    overview:
      "控制高频操作的执行节奏，保留尾沿调用，适合滚动位置处理、拖动预览和持续点击操作。",
    scenarios: [
      {
        title: "拖动数值预览",
        description:
          "滑块立即更新，节流处理值最多按固定间隔发布，并保留最后的数值。",
      },
      {
        title: "取消与重新开始",
        description: "连续提交会保留尾沿；cancel 清除尾沿并重置执行窗口。",
      },
    ],
  },
  useInterval: {
    overview:
      "声明式管理重复定时任务，通过 null 暂停，适合轮询、计时和定期刷新；卸载时自动清理计时器。",
    scenarios: [
      {
        title: "调整节奏与暂停",
        description: "在运行时改变间隔，暂停后保留计数，恢复后按新间隔继续。",
      },
      {
        title: "启用时立即执行",
        description:
          "immediate 为 true 时，启用定时器立即执行一次，然后按间隔运行。",
      },
    ],
  },
  useDisclosure: {
    overview:
      "统一打开、关闭和切换局部界面，适合折叠面板、帮助提示和抽屉；焦点与对话框语义由界面组件处理。",
    scenarios: [
      {
        title: "默认展开的帮助面板",
        description: "通过初始状态控制首次展示，重复打开保持展开。",
      },
      {
        title: "互斥的详情面板",
        description: "组合两个独立实例，在打开一个时关闭另一个。",
      },
    ],
  },
  useEditor: {
    overview:
      "组织新增和编辑流程，携带当前记录与编辑模式，适合列表编辑器、侧边详情面板和弹窗表单。",
    scenarios: [
      {
        title: "从列表切换编辑对象",
        description:
          "连续选择不同记录，面板显示最新记录；关闭不会删除原始数据。",
      },
      {
        title: "新建清空旧记录",
        description: "先编辑，再进入新建模式，观察 record 变为 null。",
      },
    ],
  },
  useAsyncAction: {
    overview:
      "管理一次异步操作的加载与错误，合并进行中的重复调用，适合保存、提交和防止重复点击；服务端仍需保证幂等。",
    scenarios: [
      {
        title: "错误后重新提交",
        description:
          "第一次主动模拟失败，下一次传入成功参数，观察错误状态清空。",
      },
      {
        title: "并发调用共享结果",
        description:
          "同一事件中连续调用两次，观察 Promise 引用相同且只执行一个任务。",
      },
    ],
  },
  useDirty: {
    overview:
      "比较当前数据与已保存基准，适合草稿提醒、启用保存按钮和离开确认；保存成功后用 reset 更新基准。",
    scenarios: [
      {
        title: "嵌套表单快照",
        description: "默认深比较对象内容；恢复原始字段后会重新变为未修改状态。",
      },
      {
        title: "自定义比较规则",
        description: "忽略首尾空格与大小写，只在有意义的内容变化时提示。",
      },
    ],
  },
  usePermission: {
    overview:
      "根据权限集合决定界面入口、按钮和提示是否可用，支持单项、全部和任一权限判断；不替代服务端鉴权。",
    scenarios: [
      {
        title: "全部权限与任一权限",
        description: "切换角色，分别观察需要全部权限和任一权限的功能。",
      },
      {
        title: "动态授权与撤销",
        description: "替换权限集合后，按钮状态立即更新。",
      },
    ],
  },
  useUndoRedo: {
    overview:
      "维护不可变状态快照的撤销与重做，适合编辑器、画布配置和表单历史；可限制历史长度或替换当前快照。",
    scenarios: [
      {
        title: "有限历史与分支丢弃",
        description: "最多保留两步；撤销后写入新值会清除重做分支。",
      },
      {
        title: "替换快照与清除历史",
        description: "replace 不新增撤销步骤；clear 保留当前值并清空历史。",
      },
    ],
  },
  useFocusWithin: {
    overview:
      "跟踪整个区域及其子元素是否拥有焦点，适合复合输入框、工具栏和聚焦时才显示的提示。",
    scenarios: [
      {
        title: "聚焦提示与外部控件",
        description:
          "在组内多个输入之间切换焦点不会退出区域，聚焦外部按钮会隐藏提示。",
      },
      {
        title: "两个独立焦点区域",
        description: "每个区域独立追踪；从一个区域切换到另一个不会互相混淆。",
      },
    ],
  },
  useLongPress: {
    overview:
      "识别按住一段时间的指针操作，适合触屏快捷操作和上下文工具；位移、松开或禁用会取消，需提供键盘等价操作。",
    scenarios: [
      {
        title: "自定义时长与禁用",
        description: "改变识别时长或禁用长按；键盘按钮调用同一个业务动作。",
      },
      {
        title: "移动阈值与主动取消",
        description: "按住后移动超过 4px 会取消；取消按钮也可结束等待。",
      },
    ],
  },
  useLeaveConfirm: {
    overview:
      "在未保存修改时保护离开操作，页面关闭使用浏览器提示，应用内导航通过 guard 接入自定义同步或异步确认。",
    scenarios: [
      {
        title: "自定义确认与取消",
        description: "以页内选择代替浏览器弹窗，分别体验允许离开和继续编辑。",
      },
      {
        title: "保存后无需确认",
        description:
          "dirty 为 false 时跳过确认；修改后恢复保护，异步确认完成才执行导航。",
      },
    ],
  },
  useEventListener: {
    overview:
      "把 DOM 事件订阅与组件生命周期绑定，适合局部区域交互、原生事件集成和可动态禁用的监听。",
    scenarios: [
      {
        title: "动态启停元素监听",
        description: "传入 null 暂停绑定，恢复后继续监听按钮的原生 click。",
      },
      {
        title: "捕获与冒泡顺序",
        description: "父元素捕获监听与子元素原生监听共同记录事件传播顺序。",
      },
    ],
  },
  useMediaQuery: {
    overview:
      "订阅浏览器媒体查询，适合响应式布局、输入设备能力判断和系统偏好；支持指定服务端初始匹配值。",
    scenarios: [
      {
        title: "动态响应式断点",
        description: "修改断点输入，媒体查询随配置变化重新订阅。",
      },
      {
        title: "切换设备能力查询",
        description:
          "选择悬停能力、精细指针或系统深色模式，读取真实浏览器状态。",
      },
    ],
  },
  useWindowSize: {
    overview:
      "跟踪浏览器视口尺寸，适合窗口级布局计算、全屏面板和视口比例预览；元素自身尺寸应使用 useElementSize。",
    scenarios: [
      {
        title: "按可用宽度计算列数",
        description: "改变卡片最小宽度，结合真实窗口宽度计算建议列数。",
      },
      {
        title: "视口比例与尺寸快照",
        description: "记录当前视口后调整窗口，比较实时值与操作时的快照。",
      },
    ],
  },
  useElementSize: {
    overview:
      "通过 ResizeObserver 追踪目标元素的大小，适合容器响应式卡片、图表和随内容变化的区域。",
    scenarios: [
      {
        title: "通过控件改变容器宽度",
        description:
          "滑块修改容器 CSS 宽度，观察 ResizeObserver 发布的实际尺寸。",
      },
      {
        title: "内容驱动高度变化",
        description:
          "添加和移除段落，观察同一元素高度变化，无需监听窗口 resize。",
      },
    ],
  },
  useIntersectionObserver: {
    overview:
      "观察元素与视口或滚动容器的交集，适合曝光统计、延迟加载和滚动触发；可设置阈值和预加载边距。",
    scenarios: [
      {
        title: "指定滚动根容器",
        description:
          "目标只相对内部滚动容器计算可见比例，滚动或按钮定位均可触发。",
      },
      {
        title: "预加载边距",
        description:
          "使用 100px rootMargin 提前感知目标，不代表目标已经实际进入可见区域。",
      },
    ],
  },
  useScroll: {
    overview:
      "读取窗口或指定容器的横纵滚动位置，适合阅读进度、返回顶部按钮和横向内容导航。",
    scenarios: [
      {
        title: "横向滚动位置",
        description: "横向容器使用 x 值；按钮和手动滚动共用同一真实滚动状态。",
      },
      {
        title: "阅读进度与回到顶部",
        description:
          "依据容器 scrollHeight 计算阅读进度，滚动一段后显示返回按钮。",
      },
    ],
  },
  useClickOutside: {
    overview:
      "检测目标区域外部的指针按下，适合菜单、弹出面板和选项列表；可通过 enabled 临时暂停关闭行为。",
    scenarios: [
      {
        title: "暂停外部关闭",
        description: "关闭监听后点击外部区域不再关闭面板。",
      },
      {
        title: "记录外部点击来源",
        description: "读取原生 PointerEvent，区分目标内部和外部触发。",
      },
    ],
  },
  useKeyPress: {
    overview:
      "声明快捷键组合及作用域，适合编辑器命令、搜索入口和局部键盘操作；支持优先级、输入框策略与暂停绑定。",
    scenarios: [
      {
        title: "动态启用局部快捷键",
        description: "聚焦区域按钮后按 Enter；暂停绑定时不触发。",
      },
      {
        title: "输入框中的多组合键",
        description:
          "允许在输入框内使用 Alt+J / Alt+L，禁止默认动作并忽略长按重复。",
      },
    ],
  },
  useLocalStorageState: {
    overview:
      "本地持久化状态与 React 同步，适合偏好设置、草稿和临时进度；值需可 JSON 序列化，存储失败由 error 暴露。",
    scenarios: [
      {
        title: "对象状态与函数更新",
        description:
          "将对象保存到独立演示键，累计更新后可清除，刷新页面观察持久化。",
      },
      {
        title: "同页两个实例同步",
        description:
          "两个 Hook 使用同一个独立键，任一实例写入后另一个也会更新。",
      },
    ],
  },
  useSessionStorageState: {
    overview:
      "当前标签页会话状态与 React 同步，适合偏好设置、草稿和临时进度；值需可 JSON 序列化，存储失败由 error 暴露。",
    scenarios: [
      {
        title: "对象状态与函数更新",
        description:
          "将对象保存到独立演示键，累计更新后可清除，刷新页面观察持久化。",
      },
      {
        title: "同页两个实例同步",
        description:
          "两个 Hook 使用同一个独立键，任一实例写入后另一个也会更新。",
      },
    ],
  },
  useClipboard: {
    overview:
      "在用户操作中复制文本并反馈结果，适合复制链接、代码和业务编号；需处理浏览器权限或能力限制。",
    scenarios: [
      {
        title: "复制用户编辑的文本",
        description: "复制当前输入，失败时保留文本供手动选择。",
      },
      {
        title: "复制结构化数据",
        description: "先序列化业务对象，再复制可读的 JSON 文本。",
      },
    ],
  },
  useOnline: {
    overview:
      "订阅浏览器在线状态，适合离线提示、暂停网络操作和缓存回退；在线只表示网络接口状态，不保证服务可达。",
    scenarios: [
      {
        title: "离线草稿与提交入口",
        description:
          "输入始终可用，离线时保留草稿并禁用模拟提交；可用浏览器开发工具切换 Offline。",
      },
      {
        title: "缓存回退策略",
        description:
          "点击读取时根据真实网络状态选择演示数据源，不发送外部请求。",
      },
    ],
  },
  usePageVisibility: {
    overview:
      "跟踪页面可见或隐藏状态，适合暂停后台轮询、计时和记录用户返回；隐藏页面中的浏览器定时器本身也可能被节流。",
    scenarios: [
      {
        title: "仅在可见时轮询",
        description: "手动启动后切换标签页，页面隐藏时传入 null 暂停定时任务。",
      },
      {
        title: "记录页面返回次数",
        description:
          "切换到其他标签页再返回，记录从 hidden 到 visible 的真实变化。",
      },
    ],
  },
  useCountdown: {
    overview:
      "根据目标时间计算剩余时长，适合验证码冷却、活动截止和限时操作；目标为 null 时停止，可通过 onEnd 响应结束。",
    scenarios: [
      {
        title: "截止回调与重新启动",
        description: "设置三秒目标，结束后记录回调次数；可提前取消或重新计时。",
      },
      {
        title: "过期目标与延长截止",
        description: "传入过去时间立即得到零；新目标会重新计算剩余时间。",
      },
    ],
  },
  useUrlState: {
    overview:
      "将字符串状态与 URL 查询参数同步，适合可分享的筛选、页签和轻量搜索；支持替换或新增历史记录，null 用于删除参数。",
    scenarios: [
      {
        title: "多条件同步与删除",
        description:
          "使用独立演示参数，批量写入并单独删除，保留其他查询参数与 hash 路由。",
      },
      {
        title: "浏览器前进与后退",
        description:
          "push 为每次选择新增历史，可用浏览器后退恢复上一次 URL 状态。",
      },
    ],
  },
  useRafLoop: {
    overview:
      "管理 requestAnimationFrame 循环并提供帧间隔，适合动画、进度模拟和逐帧采样；停止后可重新启动，不应用于精确定时。",
    scenarios: [
      {
        title: "基于 delta 的速度控制",
        description:
          "改变每秒速率后，进度仍按真实帧间隔推进，开始和停止均可重复调用。",
      },
      {
        title: "帧间隔采样",
        description:
          "实时采样 delta 并展示近似帧率；停止后保持最后一次采样结果。",
      },
    ],
  },
  useAnimate: {
    overview:
      "封装 Web Animations API 的播放控制，适合元素进场、状态反馈和可暂停动画；默认尊重系统减少动态效果设置。",
    scenarios: [
      {
        title: "淡入反馈与完成状态",
        description:
          "播放短暂淡入动画，完成后状态变为 finished，取消可恢复初始样式。",
      },
      {
        title: "往返动画与重播",
        description:
          "使用 alternate 和有限 iterations；运行中重播会取消上一段动画。",
      },
    ],
  },
  useReducedMotion: {
    overview:
      "读取系统减少动态效果偏好，为动画提供更克制的替代方式，适合页面过渡、提示反馈和装饰性动效。",
    scenarios: [
      {
        title: "按系统偏好切换过渡",
        description:
          "展开面板时，系统要求减少动画则立即切换；可在系统设置或浏览器媒体模拟中改变偏好。",
      },
      {
        title: "交互触发的动画替代",
        description:
          "完整模式移动位置，减少动态模式仅改变文字和颜色，不强制开启运动。",
      },
    ],
  },
  useDrag: {
    overview:
      "将字符串或序列化业务数据写入原生拖放数据，适合卡片移动和跨区域传递；触屏与键盘应提供等价操作。",
    scenarios: [
      {
        title: "自定义 MIME 数据",
        description:
          "拖放双方约定同一个数据类型，传递 JSON 文本并解析；按钮提供等价业务动作。",
      },
      {
        title: "只读时禁用拖动",
        description:
          "切换 disabled 后 draggable 状态变化，目标区域继续支持正常接收。",
      },
    ],
  },
  useDrop: {
    overview:
      "接收浏览器拖放的文本或文件，并跟踪拖入状态，适合文件收集区和内容投放区；文件选择可作为键盘替代。",
    scenarios: [
      {
        title: "禁用接收区域",
        description:
          "禁用后不接受拖放；启用后拖入文字或使用按钮完成同一业务动作。",
      },
      {
        title: "文件元信息与业务校验",
        description:
          "接收到文件后展示名称、大小和类型；此示例只接受小于 1MB 的文件，不上传。",
      },
    ],
  },
  useMutationObserver: {
    overview:
      "观察第三方库或浏览器直接修改的 DOM，适合集成编辑器和外部控件；不要把 React 自己的状态同步建立在 DOM 变更上。",
    scenarios: [
      {
        title: "观察指定属性",
        description: "仅关注 data-status 的变化，其他属性变化不会计数。",
      },
      {
        title: "观察子树与删除节点",
        description:
          "添加嵌套节点或清空宿主，观察 childList 和 subtree 的记录。",
      },
    ],
  },
  useTextSelection: {
    overview:
      "读取文档或指定区域内的文本选区，适合引用、批注和选中文字后的操作；可主动清除选区。",
    scenarios: [
      {
        title: "按钮创建段落选区",
        description:
          "使用浏览器 Selection API 选中段落，Hook 读取真实选区，清除按钮移除选中。",
      },
      {
        title: "限制到指定区域",
        description: "分别选中两个段落，只有受跟踪区域内的选区才会返回文本。",
      },
    ],
  },
  useFullscreen: {
    overview:
      "管理某个元素的浏览器全屏状态，适合图表、阅读器和媒体面板；进入全屏需要用户操作，并应处理不支持或被拒绝的情况。",
    scenarios: [
      {
        title: "显式进入与退出",
        description:
          "把内容面板设为全屏目标，独立调用 enter 与 exit，并展示错误。",
      },
      {
        title: "阅读时切换字号",
        description: "全屏状态控制内容字号，退出后恢复普通阅读样式。",
      },
    ],
  },
  useImage: {
    overview:
      "预加载图片并暴露加载状态、尺寸和错误，适合头像、画廊和备用图策略；src 为 null 时暂停加载。",
    scenarios: [
      {
        title: "按需启动图片加载",
        description:
          "最初传入 null，点击后加载本地生成的 SVG，不访问外部图片服务。",
      },
      {
        title: "错误状态与切换恢复",
        description:
          "不设置备用图时，损坏图片进入 error；切换正确地址后可恢复。",
      },
    ],
  },
  useBroadcastChannel: {
    overview:
      "在同源页面或标签页之间广播消息，适合偏好同步和跨页面通知；接收端需要验证消息结构，发送端不会收到自身消息。",
    scenarios: [
      {
        title: "结构化消息与解析",
        description: "双连接演示对象消息，接收时验证字段后显示业务内容。",
      },
      {
        title: "不同频道互相隔离",
        description:
          "发送方和接收方可使用不同频道，切换到同频道后再次发送才会收到。",
      },
    ],
  },
  usePagination: {
    overview:
      "管理页码、每页数量与总页数，适合列表分页和前后页导航；已知总数会限制越界页码，未知总数保留继续翻页能力。",
    scenarios: [
      {
        title: "未知总数分页",
        description:
          "不传 total，页数为未知，由服务或调用者决定是否还有下一页。",
      },
      {
        title: "总数减少与越界修正",
        description: "先跳到最后一页，再减少总数或清空数据，观察页码限制。",
      },
    ],
  },
  useSearch: {
    overview:
      "分离正在编辑和已经提交的筛选条件，适合搜索表单；重复提交也会更新 revision，便于重新请求相同条件。",
    scenarios: [
      {
        title: "组合筛选与提交快照",
        description: "编辑分类不会立即改变已提交条件，点击提交后一起生效。",
      },
      {
        title: "同条件刷新与恢复默认",
        description:
          "重复提交增加 revision；reset 恢复初始条件并产生一次新的查询版本。",
      },
    ],
  },
  useSelection: {
    overview:
      "管理一组稳定标识的选择状态，适合多选列表、批量操作和跨页选择；可随查询条件变化清空选择。",
    scenarios: [
      {
        title: "半选与全选状态",
        description:
          "选择一项进入半选，全选和清空使用不同操作，空列表不会被视为全选。",
      },
      {
        title: "切换查询时重置",
        description:
          "preserve 保留跨页选择，但 resetKey 变化会清空旧查询的选择。",
      },
    ],
  },
  useRequest: {
    overview:
      "管理异步数据请求及取消、错误和刷新状态，适合详情加载、搜索和后台轮询；支持重试与超时，实例之间不共享缓存。",
    scenarios: [
      {
        title: "自动请求与轮询控制",
        description:
          "展开时按默认参数请求，启动轮询后定期刷新，停止会取消本轮并暂停后续轮询。",
      },
      {
        title: "竞争请求与本地修改",
        description:
          "慢请求和快请求连续发出时只保留最新结果，mutate 可直接更新当前展示数据。",
      },
    ],
  },
  useInfiniteScroll: {
    overview:
      "按游标累计加载列表，适合信息流、聊天历史和加载更多；支持去重、查询重置、触底观察及取消。",
    scenarios: [
      {
        title: "字符串游标与手动加载",
        description:
          "使用字符串令牌作为 Cursor，手动逐页加载，null 表示已到末尾。",
      },
      {
        title: "前插历史与重复项去重",
        description: "每页含一个重复记录，按 id 去重，并把旧消息插入前方。",
      },
    ],
  },
  useAsyncQueue: {
    overview:
      "按并发上限调度异步任务，适合批量处理、资源准备和上传调度；支持暂停、取消与保留任务结果。",
    scenarios: [
      {
        title: "动态并发与运行计数",
        description:
          "新增四个任务，改变并发上限后观察等待任务的调度；降低上限不终止已运行任务。",
      },
      {
        title: "单任务失败不阻断后续",
        description:
          "失败任务记录 error，后续任务继续运行，结束后可以清理历史。",
      },
    ],
  },
  useUpload: {
    overview:
      "在队列基础上管理文件传输与进度，适合批量上传和可重试传输；实际协议由 transport 注入，演示不会上传到外部服务。",
    scenarios: [
      {
        title: "上传前校验与批量加入",
        description:
          "在调用 add 前检查文件大小；按钮创建小型本地示例文件，传输完全在内存模拟。",
      },
      {
        title: "暂停排队与恢复传输",
        description:
          "暂停只阻止新任务启动，正在进行的任务继续；可取消全部并清除已结束任务。",
      },
    ],
  },
  useDownload: {
    overview:
      "从 Blob 或 URL 发起文件下载并管理状态，适合报表导出、文本保存和远程附件；URL 请求可取消，Blob URL 会自动回收。",
    scenarios: [
      {
        title: "本地生成 CSV 报表",
        description: "修改数量后下载本地 CSV，演示数据不经过服务器。",
      },
      {
        title: "URL 下载与立即取消",
        description:
          "使用本地 data URL 演示 fetch 路径；立即取消会阻止保存，无需请求外部服务器。",
      },
    ],
  },
  useEventSource: {
    overview:
      "管理 SSE 单向事件流，适合通知、日志和流式内容；支持自定义事件名、消息解析、关闭及重新连接。",
    scenarios: [
      {
        title: "自定义事件与 JSON 解析",
        description:
          "本地事件源模拟命名事件，发送正确或错误 JSON，观察解析结果与错误恢复。",
      },
      {
        title: "按需连接与重新连接",
        description:
          "url 为 null 时不连接，启用后可以主动关闭和重连；事件源仅在本地运行。",
      },
    ],
  },
  useForm: {
    overview:
      "管理表单值、字段校验、提交和重置，适合登录、资料编辑和复杂业务表单；支持嵌套路径、异步校验与字段依赖。",
    scenarios: [
      {
        title: "嵌套字段与局部校验",
        description:
          "通过点号路径注册嵌套值，只校验指定字段，并显示 touched 与错误。",
      },
      {
        title: "提交失败与服务端字段错误",
        description:
          "模拟提交失败后展示 submitError，也可把业务错误绑定到字段；重置会清理状态。",
      },
    ],
  },
  useFieldArray: {
    overview:
      "对表单中的数组字段进行增删、移动和替换，为每一行提供稳定标识，适合联系人、订单明细和动态标签。",
    scenarios: [
      {
        title: "基本类型数组",
        description:
          "数组项也可以是字符串，添加后通过字段路径编辑，删除后剩余项路径自动对应。",
      },
      {
        title: "批量替换与稳定标识",
        description:
          "移动保留行 ID，replace 为新数据生成新 ID；表单 reset 恢复初始数组。",
      },
    ],
  },
  useFormField: {
    overview:
      "订阅单个表单路径的值、错误和触碰状态，适合自定义字段控件和大型表单的局部渲染；control 可传给独立字段组件。",
    scenarios: [
      {
        title: "自定义数值字段",
        description: "直接使用 setValue 接入数字控件，失焦时触发该字段校验。",
      },
      {
        title: "嵌套路径与外部重置",
        description: "订阅嵌套字段，父表单直接写入或重置后订阅者同步更新。",
      },
    ],
  },
  useSortable: {
    overview:
      "为受控列表提供原生拖放、键盘排序和程序化移动，适合任务优先级、字段顺序和导航配置；通过稳定 key 跟踪项目。",
    scenarios: [
      {
        title: "禁用排序与受控数据",
        description:
          "锁定后拖放、键盘和 move 都不会改动列表；解锁后再尝试移动。",
      },
      {
        title: "键盘取消与边界移动",
        description:
          "聚焦项目后按空格拾取、方向键移动、Esc 恢复原顺序；越界 move 返回 false。",
      },
    ],
  },
  useVirtualList: {
    overview:
      "只渲染可见窗口附近的记录，适合大量列表与日志；支持固定或动态行高、定位、边界回调和尺寸缓存。",
    scenarios: [
      {
        title: "固定行高与定位方式",
        description: "在两百条数据中跳转到指定索引，可选择居中或末尾对齐。",
      },
      {
        title: "空列表与追加数据",
        description:
          "从空列表开始添加数据，清空后占位高度归零，避免保留旧滚动范围。",
      },
    ],
  },
  useTable: {
    overview:
      "组合请求、筛选、排序和分页状态，适合数据表格与内容目录；可映射不同接口响应，并保存列设置和常用筛选。",
    scenarios: [
      {
        title: "适配不同服务响应",
        description:
          "select 把 records/count 转为 list/total；分页变化会重新调用本地模拟服务。",
      },
      {
        title: "请求失败与刷新恢复",
        description:
          "演示服务失败后保留页面控制，关闭失败模拟后 refresh 重新获取当前查询。",
      },
    ],
  },
} satisfies Record<
  HookName,
  { overview: string; scenarios: { title: string; description: string }[] }
>;
