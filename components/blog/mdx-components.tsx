import type { MDXComponents } from 'mdx/types';
import { MDXImage, MDXLink, CodeBlock, PreBlock } from './mdx-elements';
import {
  H1,
  H2,
  H3,
  Paragraph,
  Blockquote,
  Hr,
  Table,
  Th,
  Td,
  UnorderedList,
  OrderedList,
  ListItem,
  Strong,
} from './mdx-typography';

export const mdxComponents: MDXComponents = {
  // Elements
  img: MDXImage as React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>,
  a: MDXLink as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>,
  code: CodeBlock as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
  pre: PreBlock,
  // Typography
  h1: H1,
  h2: H2,
  h3: H3,
  p: Paragraph,
  blockquote: Blockquote,
  hr: Hr,
  // Table
  table: Table,
  th: Th,
  td: Td,
  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  // Inline
  strong: Strong,
};
