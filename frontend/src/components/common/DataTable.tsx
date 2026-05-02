import { type ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], row: T) => ReactNode;
};

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
} as const;

type DataTableProps<T> = {
  columns: Array<Column<T>>;
  rows: T[];
};

export default function DataTable<T extends Record<string, ReactNode>>({ columns, rows }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-surfaceAlt/40 bg-white/80">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface/70 text-xs uppercase tracking-[0.2em] text-content/60">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 font-semibold ${alignClass[column.align || "left"]}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-surfaceAlt/30">
              {columns.map((column) => {
                const value = row[column.key];
                return (
                  <td
                    key={String(column.key)}
                    className={`px-4 py-3 ${alignClass[column.align || "left"]}`}
                  >
                    {column.render ? column.render(value, row) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
