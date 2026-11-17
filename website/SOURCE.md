# 代码高亮参考

- 仓库：https://github.com/leonwgc/atelier-ui
- 参考快照：`b911a69c70bf42c8d4086057ffe511ae45205dad`
- 参考文件：`demo/shared.tsx` 的 `highlightCode` / token 分类；`demo/styles.css` 的 `.code-token--*` 明暗主题样式。
- 本地实现：`SyntaxCode.tsx`、`styles.scss`。依据上游的轻量正则分类策略独立实现，未直接复制上游函数或样式。
- 差异：以 React 文本节点和 span 渲染，避免拼接 HTML；增加 Shell 命令、TypeScript 关键字；MDX 与示例共用实现；配色适配本站主题变量。复杂模板字符串作为整体高亮，不声称完整语法解析。
- 上游该快照未找到 LICENSE / NOTICE，package.json 也没有 license 字段；不推定其许可证，不迁入上游源码。本地实现使用本项目根目录 LICENSE。
- 无额外依赖，不影响 Hooks 库产物。
