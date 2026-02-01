import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ children, ...props }: TableProps) {
  return (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="border border-border px-4 py-2 text-muted-foreground" {...props}>
      {children}
    </td>
  );
}
