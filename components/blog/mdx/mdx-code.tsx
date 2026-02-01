interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <code
      className={`rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-primary ${className || ''}`}
    >
      {children}
    </code>
  );
}

export function PreBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className="overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm"
      {...props}
    >
      {children}
    </pre>
  );
}
