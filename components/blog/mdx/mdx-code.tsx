interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <code
      className={`bg-muted text-primary rounded-md px-1.5 py-0.5 font-mono text-sm ${className || ''}`}
    >
      {children}
    </code>
  );
}

export function PreBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className="border-border bg-muted overflow-x-auto rounded-lg border p-4 font-mono text-sm"
      {...props}
    >
      {children}
    </pre>
  );
}
