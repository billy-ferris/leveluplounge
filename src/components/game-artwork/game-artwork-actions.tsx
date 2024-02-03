import { type FC } from "react";

import type { Session } from "next-auth";
import { ExpandIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import type { gameStatuses } from "~/server/db/schema";
import { AddGameButton, WishlistGameButton } from "~/components/game-artwork";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

type GameStatus = (typeof gameStatuses)[number];

interface GameArtworkActionsProps {
  id: number;
  usersGames:
    | {
        gameId: number;
        userId: string;
        status: GameStatus | null;
      }[]
    | [];
  session: Session | null;
}

export const GameArtworkActions: FC<GameArtworkActionsProps> = ({
  id,
  usersGames,
  session,
}) => {
  const isGameSaved = isUserGame(usersGames, session?.user.id);
  const isGameWishlisted = isUserGameWishlisted(usersGames, session?.user.id);

  return (
    <div className="flex justify-between text-xs text-muted-foreground">
      <div className="flex gap-x-1">
        <AddGameButton id={id} isGameSaved={isGameSaved} />
        <WishlistGameButton id={id} isGameWishlisted={isGameWishlisted} />
      </div>
      <Button variant="outline" size="icon" className="h-6 w-6">
        <ExpandIcon className="h-3 w-3" />
      </Button>
    </div>
  );
};

const isUserGame = (
  usersGames: GameArtworkActionsProps["usersGames"],
  userId: string | undefined,
): boolean =>
  userId
    ? usersGames.some(
        (userGame) =>
          userGame.userId === userId && userGame.status !== "Wishlist",
      )
    : true;

const isUserGameWishlisted = (
  usersGames: GameArtworkActionsProps["usersGames"],
  userId: string | undefined,
): boolean =>
  !!userId &&
  usersGames.some(
    (userGame) => userGame.userId === userId && userGame.status === "Wishlist",
  );
