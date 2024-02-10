import { type AnyColumn, sql, type SQLWrapper } from "drizzle-orm";

export const asc = (column: SQLWrapper | AnyColumn, nullsLast = true) => {
  if (nullsLast) return sql`${column} asc nulls last`;

  return sql`${column} asc`;
};

export const desc = (column: SQLWrapper | AnyColumn, nullsLast = true) => {
  if (nullsLast) return sql`${column} desc nulls last`;

  return sql`${column} desc`;
};
