declare module '@theme-original/MDXComponents' {
  import type { ComponentType } from 'react';

  const MDXComponents: Record<string, ComponentType<unknown> | string>;
  export default MDXComponents;
}
