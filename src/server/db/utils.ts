import { type AnyColumn, sql, type SQLWrapper } from "drizzle-orm";

export const asc = (column: SQLWrapper | AnyColumn, nullsLast = true) => {
  if (nullsLast) return sql`${column} ASC NULLS LAST`;

  return sql`${column} asc`;
};

export const desc = (column: SQLWrapper | AnyColumn, nullsLast = true) => {
  if (nullsLast) return sql`${column} DESC NULLS LAST`;

  return sql`${column} desc`;
};
