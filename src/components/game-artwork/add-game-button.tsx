"use client";

import { type FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { PlusIcon, Loader2Icon, CheckIcon, SquarePenIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { userGameStatusEnum } from "~/server/db/schemas";

type UsersGameStatus = (typeof userGameStatusEnum.enumValues)[number];

interface AddGameButtonProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "className"> {
  id: number;
  isGameSaved: boolean;
  status?: UsersGameStatus | null;
}

export const AddGameButton: FC<AddGameButtonProps> = ({
  id,
  isGameSaved,
  status: currentStatus,
  className,
}) => {
  const addGameToUserMutation = api.games.addGameToUser.useMutation();
  const deleteGameFromUserMutation = api.games.deleteGameFromUser.useMutation();
  const router = useRouter();

  const handleOnClick = useCallback(
    (status: UsersGameStatus) => {
      addGameToUserMutation.mutate(
        { gameId: id, status },
        handleMutationSuccess("Game added to your library.", router, () => {
          if (!currentStatus) {
            return deleteGameFromUserMutation.mutate(
              { gameId: id },
              {
                onSuccess: () => router.refresh(),
              },
            );
          }

          return addGameToUserMutation.mutate(
            { gameId: id, status: currentStatus },
            {
              onSuccess: () => router.refresh(),
            },
          );
        }),
      );
    },
    [
      id,
      currentStatus,
      addGameToUserMutation,
      deleteGameFromUserMutation,
      router,
    ],
  );

  const isLoading =
    addGameToUserMutation.isLoading || deleteGameFromUserMutation.isLoading;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          // onClick={handleOnClick}
          variant="secondary"
          size="icon"
          className={cn(
            "h-6 w-6",
            isGameSaved && "bg-green-800 hover:bg-green-900",
            className,
          )}
        >
          {isLoading ? (
            <Loader2Icon className="h-3 w-3 animate-spin opacity-60" />
          ) : isGameSaved ? (
            <SquarePenIcon className="h-3 w-3" />
          ) : (
            <PlusIcon className="h-3 w-3" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[140px] overflow-hidden p-1 text-foreground">
        {userGameStatusEnum.enumValues
          .filter((option) => option !== "Wishlist")
          .map((option) => {
            const isSelected = currentStatus === option;

            return (
              <Button
                key={option}
                onClick={() => handleOnClick(option)}
                variant="ghost"
                size="sm"
                className="h-8 w-full justify-between px-2 py-1.5"
              >
                {option}
                {isSelected && <CheckIcon className="h-3 w-3" />}
              </Button>
            );
          })}
      </PopoverContent>
    </Popover>
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
