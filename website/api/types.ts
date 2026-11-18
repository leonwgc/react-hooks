export interface ApiValue {
  name: string;
  type: string;
  description: string;
}
export interface ApiParameter extends ApiValue {
  defaultValue: string;
}
export interface ApiDoc {
  source: string;
  signature: string;
  parameters: ApiParameter[];
  sections?: { title: string; rows: ApiParameter[] }[];
  returns: ApiValue[];
  methods?: ApiValue[];
  types?: string;
  notes?: string[];
}
export const p = (
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): ApiParameter => ({ name, type, defaultValue, description });
export const v = (
  name: string,
  type: string,
  description: string,
): ApiValue => ({ name, type, description });
export const options = (type = "object", required = false) =>
  p("options", type, required ? "必填" : "{}", "配置对象，字段见下表。");
export const target = (
  type = "Element",
  optional = false,
  fallback = "window",
) =>
  p(
    "target",
    `Target<${type}>`,
    optional ? fallback : "必填",
    "DOM 节点、ref、返回节点的函数或 null；null 表示暂不绑定。",
  );
export const targetType =
  "// 库内部通用目标类型，未从包入口导出。\n// 调用时直接传 DOM 元素、useRef 的结果或获取函数。\ntype Target<T> = T | { readonly current: T | null }\n  | (() => T | null) | null;";
