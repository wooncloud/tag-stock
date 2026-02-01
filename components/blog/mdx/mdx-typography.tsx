import type { HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;
type BlockquoteProps = HTMLAttributes<HTMLQuoteElement>;
type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;
type HRProps = HTMLAttributes<HTMLHRElement>;

export function H1({ children, ...props }: HeadingProps) {
  return (
    <h1 className="mb-4 mt-10 text-3xl font-bold tracking-tight text-foreground" {...props}>
      {children}
    </h1>
  );
}

export function H2({ children, ...props }: HeadingProps) {
  return (
    <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight text-foreground" {...props}>
      {children}
    </h2>
  );
}

export function H3({ children, ...props }: HeadingProps) {
  return (
    <h3 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-foreground" {...props}>
      {children}
    </h3>
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

export function Paragraph({ children, ...props }: ParagraphProps) {
  return (
    <p className="my-4 leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  );
}

export function HorizontalRule(props: HRProps) {
  return <hr className="my-8 border-border" {...props} />;
}

export function Strong({ children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  );
}
