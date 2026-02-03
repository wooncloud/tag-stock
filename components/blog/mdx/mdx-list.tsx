import type { HTMLAttributes, LiHTMLAttributes } from 'react';

export function UnorderedList({ children, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="text-muted-foreground my-4 ml-6 list-disc" {...props}>
      {children}
    </ul>
  );
}

export function OrderedList({ children, ...props }: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol className="text-muted-foreground my-4 ml-6 list-decimal" {...props}>
      {children}
    </ol>
  );
}

export function ListItem({ children, ...props }: LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className="mt-2" {...props}>
      {children}
    </li>
  );
}
