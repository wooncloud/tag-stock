import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

interface MDXImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

function MDXImage({ src, alt, width, height }: MDXImageProps) {
  if (!src) return null;

  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border border-border">
        {isExternal ? (
          // External images - use regular img with styling
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ''}
            className="mx-auto h-auto w-full"
            loading="lazy"
          />
        ) : (
          // Internal images - use Next.js Image for optimization
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
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
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

function MDXLink({ href, children }: MDXLinkProps) {
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

function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <code
      className={`rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-primary ${className || ''}`}
    >
      {children}
    </code>
  );
}

function PreBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className="overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm"
      {...props}
    >
      {children}
    </pre>
  );
}

export const mdxComponents: MDXComponents = {
  // Override default image rendering
  img: MDXImage as React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>,
  // Override default link rendering
  a: MDXLink as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>,
  // Override code blocks
  code: CodeBlock as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
  pre: PreBlock,
  // Custom heading styles with anchor links
  h1: ({ children, ...props }) => (
    <h1 className="mt-10 mb-4 text-3xl font-bold tracking-tight text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold tracking-tight text-foreground" {...props}>
      {children}
    </h3>
  ),
  // Custom blockquote
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  // Custom horizontal rule
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  // Custom table
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-4 py-2 text-muted-foreground" {...props}>
      {children}
    </td>
  ),
  // Custom lists
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="mt-2" {...props}>
      {children}
    </li>
  ),
  // Paragraph
  p: ({ children, ...props }) => (
    <p className="my-4 leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  // Strong/bold text
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
};
