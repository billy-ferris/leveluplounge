import { type FC } from "react";

import Image from "next/image";
import { type z } from "zod";
import { ExpandIcon } from "lucide-react";

import { type userGameStatus } from "~/schemas/games";
import { getServerAuthSession } from "~/server/auth";
import { ParentPlatformsList } from "~/components/game-artwork/parent-platforms-list";
import { GameArtworkActions } from "~/components/game-artwork/game-artwork-actions";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type parentPlatformGames } from "~/server/db/schemas";

type GameStatus = z.infer<typeof userGameStatus>;
type ParentPlatformGame = typeof parentPlatformGames.$inferSelect;

interface GameArtworkProps {
  id: number;
  name: string;
  userGames: {
    gameId: number;
    userId: string;
    status: GameStatus | null;
  }[];
  parentPlatforms: ParentPlatformGame[];
  artworkUrl: string;
  metacriticRating: number | null;
}

export const GameArtwork: FC<GameArtworkProps> = async ({
  id,
  userGames,
  parentPlatforms,
  name,
  artworkUrl,
  metacriticRating,
}) => {
  const session = await getServerAuthSession();

  return (
    <div className="rounded-md border">
      <div className={`group relative h-[180px] overflow-hidden rounded-t-md`}>
        {metacriticRating && (
          <div
            className={cn(
              "absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-white",
              getBackgroundByRating(metacriticRating),
            )}
          >
            {metacriticRating}
          </div>
        )}
        <Image
          src={artworkUrl}
          alt={name}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="h-auto w-auto object-cover transition-all duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-y-1 p-3 text-sm">
        <ParentPlatformsList platforms={parentPlatforms} />
        <h3 className="... truncate text-ellipsis font-medium leading-5">
          {name}
        </h3>
        <div className="flex justify-between text-xs text-muted-foreground">
          <GameArtworkActions
            id={id}
            usersGames={userGames}
            session={session}
          />
          <Button variant="outline" size="icon" className="h-6 w-6">
            <ExpandIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const getBackgroundByRating = (rating: number) => {
  if (rating >= 80) {
    return "bg-green-800";
  } else if (rating <= 60) {
    return "bg-red-800";
  } else {
    return "bg-yellow-800";
  }
};
