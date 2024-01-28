import type { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import type { gamesResponseSchema } from "~/schemas/games";

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
});
