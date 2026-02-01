import Image from 'next/image';
import Link from 'next/link';

interface MDXImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function MDXImage({ src, alt, width, height }: MDXImageProps) {
  if (!src) return null;

  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border border-border">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ''}
            className="mx-auto h-auto w-full"
            loading="lazy"
          />
        ) : (
          <Image
            src={src}
            alt={alt || ''}
            width={width || 800}
            height={height || 450}
            className="mx-auto h-auto w-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            loading="lazy"
          />
        )}
      </div>
      {alt && (
        <figcaption className="mt-3 text-center text-sm italic text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

interface MDXLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export function MDXLink({ href, children }: MDXLinkProps) {
  if (!href) return <>{children}</>;

  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="text-primary hover:underline">
      {children}
    </Link>
  );
}

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
