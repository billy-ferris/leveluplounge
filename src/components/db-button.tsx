"use client";

import { type FC } from "react";

import { Loader2Icon, DatabaseIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

export const UpdateDbButton: FC = () => {
  const updateDbMutation = api.games.updateDb.useMutation();

  return (
    <Button
      onClick={() =>
        updateDbMutation.mutate(undefined, {
          onSuccess: () => {
            toast.success("Database inserts successful");
          },
          onError: () => {
            toast.error("Database inserts failed");
          },
        })
      }
      variant="secondary"
      size="icon"
      className={cn("h-6 w-6")}
    >
      {updateDbMutation.isLoading ? (
        <Loader2Icon className="h-3 w-3 animate-spin" />
      ) : (
        <DatabaseIcon className="h-3 w-3" />
      )}
    </Button>
  );
};
