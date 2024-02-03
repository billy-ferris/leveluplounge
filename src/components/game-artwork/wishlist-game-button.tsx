"use client";

import { type FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Loader2Icon, GiftIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

interface WishlistGameButtonProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "className"> {
  id: number;
  isGameWishlisted: boolean;
}

export const WishlistGameButton: FC<WishlistGameButtonProps> = ({
  id,
  isGameWishlisted,
  className,
}) => {
  const addGameToUserMutation = api.games.addGameToUser.useMutation();
  const deleteGameFromUserMutation = api.games.deleteGameFromUser.useMutation();
  const router = useRouter();

  const handleOnClick = useCallback(() => {
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
  }, [
    id,
    isGameWishlisted,
    addGameToUserMutation,
    deleteGameFromUserMutation,
    router,
  ]);

  const isLoading =
    addGameToUserMutation.isLoading || deleteGameFromUserMutation.isLoading;

  return (
    <Button
      onClick={handleOnClick}
      variant="secondary"
      size="icon"
      className={cn(
        "h-6 w-6",
        isGameWishlisted && "bg-green-800 hover:bg-green-900",
        className,
      )}
    >
      {isLoading ? (
        <Loader2Icon className="h-3 w-3 animate-spin opacity-60" />
      ) : (
        <GiftIcon className="h-3 w-3" />
      )}
    </Button>
  );
};

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
