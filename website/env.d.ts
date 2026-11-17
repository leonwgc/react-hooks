declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXProps } from "mdx/types";
  const Component: ComponentType<MDXProps>;
  export default Component;
}
