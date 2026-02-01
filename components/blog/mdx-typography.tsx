import type { ComponentPropsWithoutRef } from 'react';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;
type HrProps = ComponentPropsWithoutRef<'hr'>;
type TableProps = ComponentPropsWithoutRef<'table'>;
type ThProps = ComponentPropsWithoutRef<'th'>;
type TdProps = ComponentPropsWithoutRef<'td'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type StrongProps = ComponentPropsWithoutRef<'strong'>;

export function H1({ children, ...props }: HeadingProps) {
  return (
    <h1
      className="mb-4 mt-10 text-3xl font-bold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, ...props }: HeadingProps) {
  return (
    <h2
      className="mb-4 mt-8 text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, ...props }: HeadingProps) {
  return (
    <h3
      className="mb-3 mt-6 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h3>
  );
}

export function Paragraph({ children, ...props }: ParagraphProps) {
  return (
    <p className="my-4 leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  );
}

export function Blockquote({ children, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className="mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function Hr(props: HrProps) {
  return <hr className="my-8 border-border" {...props} />;
}

export function Table({ children, ...props }: TableProps) {
  return (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, ...props }: ThProps) {
  return (
    <th
      className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ children, ...props }: TdProps) {
  return (
    <td className="border border-border px-4 py-2 text-muted-foreground" {...props}>
      {children}
    </td>
  );
}

export function UnorderedList({ children, ...props }: ListProps) {
  return (
    <ul className="my-4 ml-6 list-disc text-muted-foreground" {...props}>
      {children}
    </ul>
  );
}

export function OrderedList({ children, ...props }: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol className="my-4 ml-6 list-decimal text-muted-foreground" {...props}>
      {children}
    </ol>
  );
}

export function ListItem({ children, ...props }: ListItemProps) {
  return (
    <li className="mt-2" {...props}>
      {children}
    </li>
  );
}

export function Strong({ children, ...props }: StrongProps) {
  return (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  );
}
