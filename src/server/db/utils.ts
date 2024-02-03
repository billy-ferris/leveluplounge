import { mysqlTableCreator } from "drizzle-orm/mysql-core";

export const mysqlTable = mysqlTableCreator((name) => `leveluplounge_${name}`);

export const gameStatuses = [
  "Wishlist",
  "Backlog",
  "Playing",
  "Paused",
  "Beaten",
  "Quit",
] as const;
