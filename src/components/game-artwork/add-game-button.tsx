"use client";

import { type FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { PlusIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

interface AddGameButtonProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "className"> {
  id: number;
  isGameSaved: boolean;
}

export const AddGameButton: FC<AddGameButtonProps> = ({
  id,
  isGameSaved,
  className,
}) => {
  const addGameToUserMutation = api.games.addGameToUser.useMutation();
  const deleteGameFromUserMutation = api.games.deleteGameFromUser.useMutation();
  const router = useRouter();

  const handleOnClick = useCallback(() => {
    addGameToUserMutation.mutate(
      { gameId: id },
      handleMutationSuccess("Game added to your library.", router, () =>
        deleteGameFromUserMutation.mutate(
          { gameId: id },
          {
            onSuccess: () => router.refresh(), // TODO: is there a better way to update in real-time? ISR?
          },
        ),
      ),
    );
  }, [id, addGameToUserMutation, deleteGameFromUserMutation, router]);

  const isLoading =
    addGameToUserMutation.isLoading || deleteGameFromUserMutation.isLoading;

  return (
    <Button
      onClick={handleOnClick}
      variant="secondary"
      size="icon"
      className={cn("h-6 w-6", isGameSaved && "bg-yellow-900", className)}
    >
      {isLoading ? (
        <Loader2Icon className="h-3 w-3 animate-spin opacity-60" />
      ) : (
        <PlusIcon className="h-3 w-3" />
      )}
    </Button>
  );
};

export const handleMutationSuccess = (
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
