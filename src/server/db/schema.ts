import {
  boolean,
  date,
  index,
  int,
  primaryKey,
  text,
  timestamp,
  varchar,
  mysqlTableCreator,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { type AdapterAccount } from "next-auth/adapters";

export const mysqlTable = mysqlTableCreator((name) => `leveluplounge_${name}`);

// User
export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  usersGames: many(usersToGames),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const gameStatuses = [
  "Wishlist",
  "Backlog",
  "Playing",
  "Paused",
  "Beaten",
  "Quit",
] as const;

export const usersToGames = mysqlTable(
  "users_games",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    gameId: int("game_id")
      .notNull()
      .references(() => games.id),
    status: varchar("status", {
      length: 255,
      enum: gameStatuses,
    }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.gameId] }),
  }),
);

// Game
export const games = mysqlTable("game", {
  id: int("id").notNull().primaryKey().autoincrement(),
  externalId: int("external_id").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  releaseDate: date("release_date", { mode: "date" }).notNull(), // possibly null for unreleased?
  toBeAnnounced: boolean("to_be_announced").notNull().default(false), // look into a bit more
  cover: varchar("cover", { length: 255 }).notNull(), // create default artwork image
  metacriticRating: int("metacritic_rating"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const gamesRelations = relations(games, ({ many }) => ({
  // platforms: many(platforms),
  // parentPlatforms: many(parentPlatforms),
  usersGames: many(usersToGames),
}));

export const usersToGamesRelations = relations(usersToGames, ({ one }) => ({
  game: one(games, {
    fields: [usersToGames.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [usersToGames.userId],
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
