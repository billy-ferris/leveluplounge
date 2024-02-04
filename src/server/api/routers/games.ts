import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { env } from "~/env";
import type { gamesResponseSchema } from "~/schemas/games";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { games, parentPlatforms, userGames } from "~/server/db/schemas/game";

type GamesApiResponse = z.infer<typeof gamesResponseSchema>;

const insertUserGameSchema = createInsertSchema(userGames);

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
  updateDb: publicProcedure.mutation(async ({ ctx }) => {
    let nextLink: string | null =
      `https://api.rawg.io/api/games?page=1&page_size=40&ordering=created&parent_platforms=2,3,7&key=${env.RAWG_API_KEY}`;

    await ctx.db.insert(parentPlatforms).values([
      { id: 1, externalId: 3, name: "Xbox", slug: "xbox" },
      { id: 2, externalId: 2, name: "Playstation", slug: "playstation" },
      { id: 3, externalId: 7, name: "Nintendo", slug: "nintendo" },
    ]);

    while (nextLink) {
      const res = await fetch(nextLink);
      const json = (await res.json()) as GamesApiResponse;

      const dbInserts = json.results.map((game) => ({
        externalId: game.id,
        name: game.name,
        slug: game.slug,
        toBeAnnounced: game.tba,
        releaseDate: new Date(game.released),
        coverImage: game.background_image,
        metacriticRating: game.metacritic,
      }));

      await ctx.db.insert(games).values(dbInserts);

      nextLink = json.next;
    }
  }),
  allGames: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.games.findMany({
      with: {
        userGames: true,
      },
    });
  }),
  userGames: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;

    const userGames = await ctx.db.query.userGames.findMany({
      where: (userGame, { eq }) => eq(userGame.userId, user.id),
      with: {
        game: true,
      },
    });
    return userGames.map((item) => item.game);
  }),
  addGameToUser: protectedProcedure
    .input(insertUserGameSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      return ctx.db
        .insert(userGames)
        .values({
          userId: user.id,
          gameId: input.gameId,
          status: input.status,
        })
        .onConflictDoUpdate({
          target: [userGames.userId, userGames.gameId],
          set: { status: input.status },
        });
    }),
  deleteGameFromUser: protectedProcedure
    .input(
      z.object({
        gameId: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      return ctx.db
        .delete(userGames)
        .where(
          and(
            eq(userGames.gameId, input.gameId),
            eq(userGames.userId, user.id),
          ),
        );
    }),
});
