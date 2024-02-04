import {
  boolean,
  date,
  integer,
  primaryKey,
  timestamp,
  varchar,
  pgTable,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "~/server/db/schemas/user";

export const games = pgTable("game", {
  id: serial("id").primaryKey(),
  externalId: integer("external_id").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  releaseDate: date("release_date", { mode: "date" }),
  toBeAnnounced: boolean("to_be_announced").notNull().default(false),
  coverImage: varchar("cover_image", { length: 255 }),
  metacriticRating: integer("metacritic_rating"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gamesRelations = relations(games, ({ many }) => ({
  userGames: many(userGames),
  parentPlatformGames: many(parentPlatformGames),
  // TODO: platforms
  // TODO: screenshots
  // TODO: game series
  // TODO: movies/clips
  // TODO: developers
  // TODO: genres
  // TODO: publishers
  // TODO: ESRB Rating
}));

export const userGameStatusEnum = pgEnum("user_game_status", [
  "Wishlist",
  "Backlog",
  "Playing",
  "Paused",
  "Beaten",
  "Quit",
]);

export const userGames = pgTable(
  "user_game",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    status: userGameStatusEnum("status"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.gameId] }),
  }),
);

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

export const parentPlatforms = pgTable("parent_platform", {
  id: serial("id").primaryKey(),
  externalId: integer("external_id").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const parentPlatformsRelations = relations(games, ({ many }) => ({
  games: many(parentPlatformGames),
}));

export const parentPlatformGames = pgTable(
  "parent_platform_game",
  {
    platformId: integer("parent_platform_id")
      .notNull()
      .references(() => parentPlatforms.id, { onDelete: "cascade" }),
    gameId: integer("game_id")
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
