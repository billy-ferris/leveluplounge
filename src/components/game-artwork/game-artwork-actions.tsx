import { type FC } from "react";

import type { Session } from "next-auth";
import { ExpandIcon } from "lucide-react";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import { AddGameButton, WishlistGameButton } from "~/components/game-artwork";
import { userGameStatus } from "~/schemas/games";

type UsersGameStatus = z.infer<typeof userGameStatus>;

interface GameArtworkActionsProps {
  id: number;
  usersGames:
    | {
        gameId: number;
        userId: string;
        status: UsersGameStatus | null;
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
  const gameStatus = getUserGameStatus(usersGames, session?.user.id);

  return (
    <div className="flex justify-between text-xs text-muted-foreground">
      <div className="flex gap-x-1">
        <AddGameButton
          id={id}
          isGameSaved={isGameSaved}
          status={gameStatus?.status}
        />
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
          userGame.userId === userId &&
          userGame.status !== userGameStatus.enum.Wishlist,
      )
    : true;

const isUserGameWishlisted = (
  usersGames: GameArtworkActionsProps["usersGames"],
  userId: string | undefined,
): boolean =>
  !!userId &&
  usersGames.some(
    (userGame) =>
      userGame.userId === userId &&
      userGame.status === userGameStatus.enum.Wishlist,
  );

const getUserGameStatus = (
  usersGames: GameArtworkActionsProps["usersGames"],
  userId: string | undefined,
) => usersGames.find((userGame) => userGame.userId === userId);
