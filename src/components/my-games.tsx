import { type FC } from "react";

import { type z } from "zod";

import { GameArtwork } from "~/components/game-artwork";
import { api } from "~/trpc/server";
import { type userGameStatus } from "~/schemas/games";

interface MyGamesContentProps {
  status: z.infer<typeof userGameStatus>;
}

export const MyGamesContent: FC<MyGamesContentProps> = async ({ status }) => {
  const games = await api.games.getUserGamesByStatus.query(status);

  // TODO: empty state
  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {games.map(({ id, name, coverImage, userGames }) => (
          <div key={id} className="flex flex-col">
            <GameArtwork
              id={id}
              name={name}
              artworkUrl={coverImage ?? ""}
              userGames={userGames}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
