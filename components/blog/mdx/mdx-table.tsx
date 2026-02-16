import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ children, ...props }: TableProps) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-lg">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props}>{children}</tbody>;
}

export function TableRow({ children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className="transition-colors hover:bg-muted/40"
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeader({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground"
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="px-4 py-3 text-muted-foreground" {...props}>
      {children}
    </td>
  );
}
