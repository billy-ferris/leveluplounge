import { z } from "zod";
import { and, eq, ne } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { env } from "~/env";
import type { gamesResponseSchema } from "~/schemas/games";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { games, parentPlatformGames, userGames } from "~/server/db/schemas";
import { userGameStatus } from "~/schemas/games";

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
    console.log("Updating database started...");

    let nextLink: string | null =
      `https://rawg.io/api/games?parent_platforms=2,3,7&dates=2020-01-01%2C2020-12-31&page=1&page_size=40&key=${env.RAWG_API_KEY}`;

    await ctx.db.transaction(async (tx) => {
      while (nextLink) {
        console.log(`Fetching data from: ${nextLink}`);
        const res = await fetch(nextLink);
        const json = (await res.json()) as GamesApiResponse;

        console.log(`Fetched ${json.results.length} games from API.`);

        const dbInserts = json.results.map((game) => ({
          externalId: game.id,
          name: game.name,
          slug: game.slug,
          toBeAnnounced: game.tba,
          releaseDate: new Date(game.released),
          coverImage: game.background_image,
          metacriticRating: game.metacritic,
          parentPlatformIds: game.parent_platforms.map(
            (platforms) => platforms.platform.id,
          ),
        }));

        console.log(`Inserting ${dbInserts.length} games into the database.`);

        let insertedGamesCount = 0;

        for (const { parentPlatformIds, ...insert } of dbInserts) {
          const [result] = await ctx.db
            .insert(games)
            .values(insert)
            .returning();

          if (result?.id) {
            for (const id of parentPlatformIds) {
              switch (id) {
                case 3:
                  await tx
                    .insert(parentPlatformGames)
                    .values({ gameId: result.id, platformId: 1 })
                    .onConflictDoNothing();
                  break;
                case 2:
                  await tx
                    .insert(parentPlatformGames)
                    .values({ gameId: result.id, platformId: 2 })
                    .onConflictDoNothing();
                  break;
                case 7:
                  await tx
                    .insert(parentPlatformGames)
                    .values({ gameId: result.id, platformId: 3 })
                    .onConflictDoNothing();
                  break;
              }
            }

            insertedGamesCount++;
          }
        }

        console.log(
          `Inserted a total of ${insertedGamesCount} games for this page.`,
        );

        nextLink = json.next;
      }
    });

    console.log("Database update completed.");
  }),

  allGames: publicProcedure
    .input(
      z
        .object({
          params: z.object({
            page: z.number().positive().optional(),
            pageSize: z.number().positive().optional(),
          }),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const pageSize = input?.params?.pageSize ?? 12;
      const page = input?.params?.page ?? 1;

      // TODO: prepared query
      const result = await ctx.db
        .select()
        .from(games)
        .limit(pageSize)
        .offset(page * pageSize)
        .leftJoin(userGames, eq(userGames.gameId, games.id));

      return result.map(({ game, user_game }) => ({
        ...game,
        userGames: user_game ? [user_game] : [],
      }));
    }),

  getUserGames: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;

    const result = await ctx.db
      .select()
      .from(games)
      .leftJoin(userGames, eq(userGames.gameId, games.id))
      .where(
        and(
          eq(userGames.userId, user.id),
          ne(userGames.status, userGameStatus.enum.Wishlist),
        ),
      );

    return result.map(({ game, user_game }) => ({
      ...game,
      userGames: user_game ? [user_game] : [],
    }));
  }),

  getUserGamesByStatus: protectedProcedure
    .input(userGameStatus)
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;

      const result = await ctx.db
        .select()
        .from(games)
        .leftJoin(userGames, eq(userGames.gameId, games.id))
        .where(and(eq(userGames.userId, user.id), eq(userGames.status, input)));

      return result.map(({ game, user_game }) => ({
        ...game,
        userGames: user_game ? [user_game] : [],
      }));
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
