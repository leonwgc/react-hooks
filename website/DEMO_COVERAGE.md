# 交互演示覆盖

每个 Hook 保留原有基础演示，并提供至少两组可独立展开、收起和重新开始的补充场景。复杂 Hook 的原有演示还包含高级组合。收起会卸载场景并清理 Hook 管理的资源。

| Hook                    | 补充场景一             | 补充场景二               |
| ----------------------- | ---------------------- | ------------------------ |
| useAnimate              | 淡入反馈与完成状态     | 往返动画与重播           |
| useAsyncAction          | 错误后重新提交         | 并发调用共享结果         |
| useAsyncQueue           | 动态并发与运行计数     | 单任务失败不阻断后续     |
| useBoolean              | 密码显示开关           | 显式设置与函数更新       |
| useBroadcastChannel     | 结构化消息与解析       | 不同频道互相隔离         |
| useClickOutside         | 暂停外部关闭           | 记录外部点击来源         |
| useClipboard            | 复制用户编辑的文本     | 复制结构化数据           |
| useControllableState    | 父级控制的评分         | 受控值需要回写           |
| useCountdown            | 截止回调与重新启动     | 过期目标与延长截止       |
| useDebounce             | 可调整等待时间         | 对象条件合并查询         |
| useDebounceFn           | 草稿自动保存           | 只保留最后一组参数       |
| useDirty                | 嵌套表单快照           | 自定义比较规则           |
| useDisclosure           | 默认展开的帮助面板     | 互斥的详情面板           |
| useDownload             | 本地生成 CSV 报表      | URL 下载与立即取消       |
| useDrag                 | 自定义 MIME 数据       | 只读时禁用拖动           |
| useDrop                 | 禁用接收区域           | 文件元信息与业务校验     |
| useEditor               | 从列表切换编辑对象     | 新建清空旧记录           |
| useElementSize          | 通过控件改变容器宽度   | 内容驱动高度变化         |
| useEventListener        | 动态启停元素监听       | 捕获与冒泡顺序           |
| useEventSource          | 自定义事件与 JSON 解析 | 按需连接与重新连接       |
| useFieldArray           | 基本类型数组           | 批量替换与稳定标识       |
| useFocusWithin          | 聚焦提示与外部控件     | 两个独立焦点区域         |
| useForm                 | 嵌套字段与局部校验     | 提交失败与服务端字段错误 |
| useFormField            | 自定义数值字段         | 嵌套路径与外部重置       |
| useFullscreen           | 显式进入与退出         | 阅读时切换字号           |
| useImage                | 按需启动图片加载       | 错误状态与切换恢复       |
| useInfiniteScroll       | 字符串游标与手动加载   | 前插历史与重复项去重     |
| useIntersectionObserver | 指定滚动根容器         | 预加载边距               |
| useInterval             | 调整节奏与暂停         | 启用时立即执行           |
| useKeyPress             | 动态启用局部快捷键     | 输入框中的多组合键       |
| useLatest               | 长期订阅读取最新草稿   | 引用更新不主动渲染       |
| useLeaveConfirm         | 自定义确认与取消       | 保存后无需确认           |
| useLocalStorageState    | 对象状态与函数更新     | 同页两个实例同步         |
| useLongPress            | 自定义时长与禁用       | 移动阈值与主动取消       |
| useMediaQuery           | 动态响应式断点         | 切换设备能力查询         |
| useMemoizedFn           | 参数与返回值透传       | 订阅无需重新绑定         |
| useMutationObserver     | 观察指定属性           | 观察子树与删除节点       |
| useOnline               | 离线草稿与提交入口     | 缓存回退策略             |
| usePageVisibility       | 仅在可见时轮询         | 记录页面返回次数         |
| usePagination           | 未知总数分页           | 总数减少与越界修正       |
| usePermission           | 全部权限与任一权限     | 动态授权与撤销           |
| useRafLoop              | 基于 delta 的速度控制  | 帧间隔采样               |
| useReducedMotion        | 按系统偏好切换过渡     | 交互触发的动画替代       |
| useRequest              | 自动请求与轮询控制     | 竞争请求与本地修改       |
| useScroll               | 横向滚动位置           | 阅读进度与回到顶部       |
| useSearch               | 组合筛选与提交快照     | 同条件刷新与恢复默认     |
| useSelection            | 半选与全选状态         | 切换查询时重置           |
| useSessionStorageState  | 对象状态与函数更新     | 同页两个实例同步         |
| useSetState             | 多字段筛选条件         | 嵌套对象与连续更新       |
| useSortable             | 禁用排序与受控数据     | 键盘取消与边界移动       |
| useTable                | 适配不同服务响应       | 请求失败与刷新恢复       |
| useTextSelection        | 按钮创建段落选区       | 限制到指定区域           |
| useThrottleFn           | 拖动数值预览           | 取消与重新开始           |
| useToggle               | 数字缩放档位           | 对象预设与自定义值       |
| useUndoRedo             | 有限历史与分支丢弃     | 替换快照与清除历史       |
| useUpload               | 上传前校验与批量加入   | 暂停排队与恢复传输       |
| useUrlState             | 多条件同步与删除       | 浏览器前进与后退         |
| useVirtualList          | 固定行高与定位方式     | 空列表与追加数据         |
| useWindowSize           | 按可用宽度计算列数     | 视口比例与尺寸快照       |
| useQuery                | 缓存键切换与复用       | 手动查询与错误恢复       |
| useSteps                | 异步校验与取消         | 步骤数量与跳转边界       |
| useDocumentTitle        | 未读消息标题           | 临时标题与卸载恢复       |
| useObjectURL            | 选择本地图片预览       | 替换 Blob 与显式释放     |
| useTextareaAutoSize     | 行数上限与内容收缩     | 禁用与手动重新测量       |
| useSpring               | 调整阻尼观察回弹       | 暂停、继续与立即到达     |
| useTransitionState      | 不同进入和退出时长     | 快速反向切换             |
| useGesture              | 受限拖动轴与取消       | 禁用手势与业务等价按钮   |

浏览器能力演示读取真实环境；媒体偏好、离线、页面可见性等变化需通过系统或浏览器操作。上传和 SSE 使用明确标注的本地模拟；下载和复制仅在用户点击后执行。

## v0.5.0 增强场景

以下 16 组追加到原有场景，合计 150 组补充演示。各示例沿页面纵向排列，不再置于同一个外层演示卡片中。

| Hook               | 补充场景三             | 补充场景四             |
| ------------------ | ---------------------- | ---------------------- |
| useRequest         | 就绪条件与依赖刷新     | 延迟加载与生命周期     |
| useQuery           | 结构键与分页保留       | 选择数据与隔离订阅     |
| useForm            | 单字段重置与错误聚焦   | 条件字段卸载策略       |
| useFieldArray      | 插入交换与元数据跟随   | 更新保留身份与数组重置 |
| useSelection       | Shift 范围与禁用项     | 选择上限与动态裁剪     |
| useAsyncQueue      | 优先级与队列容量       | 失败重试与超时取消     |
| useUndoRedo        | 连续输入合并与标签     | 事务提交与回滚         |
| useTransitionState | 动画结束与生命周期回调 | 缺失结束事件的兜底     |
