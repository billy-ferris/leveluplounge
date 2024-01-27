import { helloRouter } from "~/server/api/routers/hello";
import { createTRPCRouter } from "~/server/api/trpc";
import { gamesRouter } from "~/server/api/routers/games";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  test: helloRouter,
  games: gamesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
