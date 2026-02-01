import Image from 'next/image';

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
