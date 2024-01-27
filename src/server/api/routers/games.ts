import { type z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import type { gamesResponseSchema } from "~/schemas/games";

type GamesApiResponse = z.infer<typeof gamesResponseSchema>;

export const gamesRouter = createTRPCRouter({
  getGames: publicProcedure.query<GamesApiResponse>(async () => {
    const res = await fetch(
      `https://api.rawg.io/api/games?page=1&page_size=1&key=${env.RAWG_API_KEY}`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch games data");
    }

    return res.json();
  }),
});
