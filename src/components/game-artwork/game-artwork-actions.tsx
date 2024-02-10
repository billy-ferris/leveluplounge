import { type FC } from "react";

import { type z } from "zod";
import { type Session } from "next-auth";

import { userGameStatus } from "~/schemas/games";
import { AddGameButton } from "~/components/game-artwork/add-game-button";
import { WishlistGameButton } from "~/components/game-artwork/wishlist-game-button";

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
    <div className="flex gap-x-1">
      <AddGameButton
        id={id}
        isGameSaved={isGameSaved}
        status={gameStatus?.status}
      />
      <WishlistGameButton id={id} isGameWishlisted={isGameWishlisted} />
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
    : false;

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
