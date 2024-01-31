import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";
import type { gamesResponseSchema } from "~/schemas/games";
import { db } from "~/server/db";
import { games, usersToGames } from "~/server/db/schema";
import { sql } from "drizzle-orm";

type GamesApiResponse = z.infer<typeof gamesResponseSchema>;

// TODO: add support for all or most parent platforms - need icons
export const gamesRouter = createTRPCRouter({
  getTrendingGames: publicProcedure.query<GamesApiResponse>(async () => {
    const res = await fetch(
      `https://api.rawg.io/api/games/lists/main?discover=true&key=${env.RAWG_API_KEY}&parent_platforms=3&ordering=-relevance&page=1&page_size=10`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch trending games data");
    }

    return res.json();
  }),
  getRecentGames: publicProcedure.query<GamesApiResponse>(async () => {
    const res = await fetch(
      `https://rawg.io/api/games/lists/recent-games-past?discover=true&key=${env.RAWG_API_KEY}&parent_platforms=3&ordering=-released&page=1&page_size=10`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch trending games data");
    }

    return res.json();
  }),
  updateDb: publicProcedure.query(async () => {
    const res = await fetch(
      `https://api.rawg.io/api/games/lists/main?discover=true&key=${env.RAWG_API_KEY}&parent_platforms=3&ordering=-relevance&page=1&page_size=10`,
    );
    const json = (await res.json()) as GamesApiResponse;

    const dbInserts = json.results.map(
      ({ id, name, slug, tba, released, background_image, metacritic }) => ({
        externalId: id,
        name,
        slug,
        toBeAnnounced: tba,
        releaseDate: new Date(released),
        cover: background_image,
        metacritic,
      }),
    );

    return db
      .insert(games)
      .values(dbInserts)
      .onDuplicateKeyUpdate({ set: { id: sql`id` } });
  }),
  allGames: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.games.findMany({
      with: {
        usersGames: true,
      },
    });
  }),
  usersGames: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;

    const usersGames = await ctx.db.query.usersToGames.findMany({
      where: (usersToGames, { eq }) => eq(usersToGames.userId, user.id),
      with: {
        game: true,
      },
    });
    return usersGames.map((item) => item.game);
  }),
  addGameToUser: protectedProcedure
    .input(
      z.object({
        gameId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      return ctx.db
        .insert(usersToGames)
        .values({ userId: user.id, gameId: input.gameId })
        .onDuplicateKeyUpdate({
          set: { userId: sql`user_id`, gameId: sql`game_id` },
        });
    }),
});
