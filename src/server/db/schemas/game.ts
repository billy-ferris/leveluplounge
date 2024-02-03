import { boolean, date, int, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

import { users, usersGames } from "~/server/db/schemas/user";
import { mysqlTable } from "~/server/db/utils";

export const games = mysqlTable("game", {
  id: int("id").notNull().primaryKey().autoincrement(),
  externalId: int("external_id").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  releaseDate: date("release_date", { mode: "date" }),
  toBeAnnounced: boolean("to_be_announced").notNull().default(false),
  cover: varchar("cover", { length: 255 }).notNull(),
  metacriticRating: int("metacritic_rating"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const gamesRelations = relations(games, ({ many }) => ({
  // platforms: many(platforms),
  // parentPlatforms: many(parentPlatforms),
  usersGames: many(usersGames),
}));

export const usersToGamesRelations = relations(usersGames, ({ one }) => ({
  game: one(games, {
    fields: [usersGames.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [usersGames.userId],
    references: [users.id],
  }),
}));

// export const platforms = mysqlTable("platform", {
//   id: int("id").notNull().primaryKey().autoincrement(),
//   name: varchar("name", { length: 255 }).notNull(),
//   slug: varchar("slug", { length: 255 }).notNull(),
//
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
// });
//
// export const parentPlatforms = mysqlTable("parent_platform", {
//   id: int("id").notNull().primaryKey().autoincrement(),
//   name: varchar("name", { length: 255 }).notNull(),
//   slug: varchar("slug", { length: 255 }).notNull(),
//
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
// });
//
// export const parentPlatformsRelations = relations(
//   parentPlatforms,
//   ({ many }) => ({
//     platforms: many(platforms),
//   }),
// );
