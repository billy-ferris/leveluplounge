import {
  boolean,
  date,
  int,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

import { users, userGames } from "~/server/db/schemas/user";
import { mysqlTable } from "~/server/db/utils";

export const games = mysqlTable("game", {
  id: int("id").primaryKey().autoincrement(),
  externalId: int("external_id").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  releaseDate: date("release_date", { mode: "date" }),
  toBeAnnounced: boolean("to_be_announced").notNull().default(false),
  coverImage: varchar("cover_image", { length: 255 }), // may need default image
  metacriticRating: int("metacritic_rating"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const gamesRelations = relations(games, ({ many }) => ({
  userGames: many(userGames),
  parentPlatformGames: many(parentPlatformGames),
  // TODO: platforms
  // platforms: many(platforms),
  // TODO: screenshots
  // TODO: game series
  // TODO: movies/clips
  // TODO: developers
  // TODO: genres
  // TODO: publishers
  // TODO: ESRB Rating
}));

export const userGamesRelations = relations(userGames, ({ one }) => ({
  game: one(games, {
    fields: [userGames.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [userGames.userId],
    references: [users.id],
  }),
}));

export const parentPlatforms = mysqlTable("parent_platform", {
  id: int("id").primaryKey().autoincrement(),
  externalId: int("external_id").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const parentPlatformsRelations = relations(games, ({ many }) => ({
  games: many(parentPlatformGames),
}));

export const parentPlatformGames = mysqlTable(
  "parent_platform_game",
  {
    platformId: int("parent_platform_id")
      .notNull()
      .references(() => parentPlatforms.id, { onDelete: "cascade" }),
    gameId: int("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.platformId, t.gameId] }),
  }),
);

export const parentPlatformGameRelations = relations(
  parentPlatformGames,
  ({ one }) => ({
    parentPlatform: one(parentPlatforms, {
      fields: [parentPlatformGames.platformId],
      references: [parentPlatforms.id],
    }),
    game: one(games, {
      fields: [parentPlatformGames.gameId],
      references: [games.id],
    }),
  }),
);
