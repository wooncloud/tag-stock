import Link from 'next/link';

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
