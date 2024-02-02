"use client";

import { Button } from "~/components/ui/button";
import { ExpandIcon, GiftIcon, PlusIcon } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { gameStatuses } from "~/server/db/schema";
import type { Session } from "next-auth";
import { cn } from "~/lib/utils";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

export const GameArtworkActions = ({
  id,
  usersGames,
  session,
}: GameArtworkActionsProps) => {
  const addGameToUserMutation = api.games.addGameToUser.useMutation();
  const deleteGameFromUserMutation = api.games.deleteGameFromUser.useMutation();
  const router = useRouter();

  const isGameSaved = isUserGame(usersGames, session?.user.id);
  const isGameWishlisted = isUserGameWishlisted(usersGames, session?.user.id);

  const handleAddGameClick = () => {
    addGameToUserMutation.mutate(
      { gameId: id },
      handleMutationSuccess("Game added to your library.", router, () =>
        deleteGameFromUserMutation.mutate(
          { gameId: id },
          {
            onSuccess: () => router.refresh(),
          },
        ),
      ),
    );
  };

  const handleWishlistClick = () => {
    const status = isGameWishlisted ? null : "Wishlist";
    isGameWishlisted
      ? deleteGameFromUserMutation.mutate(
          { gameId: id },
          handleMutationSuccess(
            `Game ${status ? "added to" : "removed from"} your wishlist.`,
            router,
            () =>
              addGameToUserMutation.mutate(
                { gameId: id, status: "Wishlist" },
                {
                  onSuccess: () => router.refresh(),
                },
              ),
          ),
        )
      : addGameToUserMutation.mutate(
          { gameId: id, status },
          handleMutationSuccess(
            `Game ${status ? "added to" : "removed from"} your wishlist.`,
            router,
            () =>
              deleteGameFromUserMutation.mutate(
                { gameId: id },
                {
                  onSuccess: () => router.refresh(),
                },
              ),
          ),
        );
  };

  const handleExpandClick = () => {
    // Handle expand button click
  };

  return (
    <div className="flex justify-between text-xs text-muted-foreground">
      <div className="flex gap-x-1">
        <Button
          onClick={handleAddGameClick}
          variant="secondary"
          size="icon"
          className={cn("h-6 w-6", isGameSaved && "bg-yellow-900")}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
        <Button
          onClick={handleWishlistClick}
          variant="secondary"
          size="icon"
          className={cn("h-6 w-6", isGameWishlisted && "bg-green-900")}
        >
          <GiftIcon className="h-3 w-3" />
        </Button>
      </div>
      <Button
        onClick={handleExpandClick}
        variant="outline"
        size="icon"
        className="h-6 w-6"
      >
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

const handleMutationSuccess = (
  successMessage: string,
  router: AppRouterInstance,
  undoAction: () => void,
) => ({
  onSuccess: () => {
    toast.success(successMessage, {
      action: {
        label: "Undo",
        onClick: undoAction,
      },
    });

    router.refresh();
  },
});
