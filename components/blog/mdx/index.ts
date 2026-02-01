import type { MDXComponents } from 'mdx/types';
import { MDXImage } from './mdx-image';
import { MDXLink } from './mdx-link';
import { CodeBlock, PreBlock } from './mdx-code';
import { H1, H2, H3, Blockquote, Paragraph, HorizontalRule, Strong } from './mdx-typography';
import { Table, TableHeader, TableCell } from './mdx-table';
import { UnorderedList, OrderedList, ListItem } from './mdx-list';

export const mdxComponents: MDXComponents = {
  // Media
  img: MDXImage as React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>,
  // Links
  a: MDXLink as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>,
  // Code
  code: CodeBlock as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
  pre: PreBlock,
  // Typography
  h1: H1,
  h2: H2,
  h3: H3,
  blockquote: Blockquote,
  p: Paragraph,
  hr: HorizontalRule,
  strong: Strong,
  // Tables
  table: Table,
  th: TableHeader,
  td: TableCell,
  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
};

// Re-export individual components for direct use
export { MDXImage } from './mdx-image';
export { MDXLink } from './mdx-link';
export { CodeBlock, PreBlock } from './mdx-code';
export { H1, H2, H3, Blockquote, Paragraph, HorizontalRule, Strong } from './mdx-typography';
export { Table, TableHeader, TableCell } from './mdx-table';
export { UnorderedList, OrderedList, ListItem } from './mdx-list';
