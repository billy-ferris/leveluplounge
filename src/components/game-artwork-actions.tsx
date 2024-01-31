"use client";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";

interface GameArtworkActionsProps {
  session: Session | null;
  gameId: number;
  usersGames:
    | {
        gameId: number;
        userId: string;
        status:
          | "Wishlist"
          | "Backlog"
          | "Playing"
          | "Paused"
          | "Beaten"
          | "Quit"
          | null;
      }[]
    | [];
}

export const GameArtworkActions = ({
  session,
  gameId,
  usersGames,
}: GameArtworkActionsProps) => {
  const addGameToUserMutation = api.games.addGameToUser.useMutation();
  const router = useRouter();

  return (
    <>
      <Button
        onClick={() =>
          addGameToUserMutation.mutate(
            { gameId },
            {
              onSuccess: () => {
                toast.success("Game added to your library.", {
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                });
                router.refresh();
              },
            },
          )
        }
        disabled={isUserGame(usersGames, session?.user.id)}
        variant="link"
        className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform opacity-0 transition-all duration-200 hover:scale-105 disabled:opacity-0 group-hover:opacity-100 disabled:group-hover:opacity-40"
      >
        <PlusCircle className="h-10 w-10 text-white opacity-60 transition-all hover:opacity-100" />
      </Button>
      <div className="absolute inset-0 z-40 bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-60"></div>
    </>
  );
};

const isUserGame = (
  usersGames: GameArtworkActionsProps["usersGames"],
  userId: string | undefined,
): boolean => {
  return userId
    ? usersGames.some((userGame) => userGame.userId === userId)
    : true;
};
