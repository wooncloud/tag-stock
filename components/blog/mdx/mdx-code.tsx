interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  // Detect if this is inside a <pre> (block code) vs inline code
  // Block code inside <pre> gets the className like "language-xxx"
  const isBlockCode = className?.startsWith('language-');
  const language = className?.replace('language-', '') || '';

  if (isBlockCode) {
    return (
      <div className="relative">
        {language && (
          <span className="absolute top-0 right-0 rounded-bl-md bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
            {language}
          </span>
        )}
        <code className={`block text-sm leading-relaxed ${className || ''}`}>{children}</code>
      </div>
    );
  }

  // Inline code
  return (
    <code className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-sm font-medium text-primary">
      {children}
    </code>
  );
}

export function PreBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-border bg-[hsl(240,10%,6%)] p-5 font-mono text-sm leading-relaxed text-gray-300 shadow-lg dark:bg-[hsl(240,10%,6%)]"
      {...props}
    >
      {children}
    </pre>
  );
}
