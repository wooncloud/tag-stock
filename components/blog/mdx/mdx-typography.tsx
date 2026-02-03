import type { HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;
type BlockquoteProps = HTMLAttributes<HTMLQuoteElement>;
type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;
type HRProps = HTMLAttributes<HTMLHRElement>;

export function H1({ children, ...props }: HeadingProps) {
  return (
    <h1 className="text-foreground mt-10 mb-4 text-3xl font-bold tracking-tight" {...props}>
      {children}
    </h1>
  );
}

export function H2({ children, ...props }: HeadingProps) {
  return (
    <h2 className="text-foreground mt-8 mb-4 text-2xl font-semibold tracking-tight" {...props}>
      {children}
    </h2>
  );
}

export function H3({ children, ...props }: HeadingProps) {
  return (
    <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  );
}

export function Blockquote({ children, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className="border-primary text-muted-foreground mt-6 border-l-4 pl-4 italic"
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function Paragraph({ children, ...props }: ParagraphProps) {
  return (
    <p className="text-muted-foreground my-4 leading-7" {...props}>
      {children}
    </p>
  );
}

export function HorizontalRule(props: HRProps) {
  return <hr className="border-border my-8" {...props} />;
}

export function Strong({ children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <strong className="text-foreground font-semibold" {...props}>
      {children}
    </strong>
  );
}
