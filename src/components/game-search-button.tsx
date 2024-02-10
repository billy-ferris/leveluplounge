"use client";

import { useState } from "react";
import Image from "next/image";

import { useSession } from "next-auth/react";
import debounce from "debounce";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Search } from "~/components/ui/search";
import { api } from "~/trpc/react";
import { ParentPlatformsList } from "~/components/game-artwork/parent-platforms-list";
import { GameArtworkActions } from "~/components/game-artwork/game-artwork-actions";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";

export const GameSearchButton = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: session } = useSession();
  const {
    data: gamesResult,
    isLoading,
    isError,
  } = api.games.getAllGames.useQuery({
    params: { search: searchTerm, pageSize: 4 },
  });

  const handleSearchInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    500,
  );

  return (
    <Dialog onOpenChange={debounce(() => setSearchTerm(""), 300)}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add game
        </Button>
      </DialogTrigger>
      <DialogContent className="block p-0">
        <Search
          onChange={handleSearchInputChange}
          placeholder="Search games..."
          className="h-12 rounded-b-none border-0 border-b py-3"
        />
        <ScrollArea>
          <div className="relative max-h-[432px] p-1">
            <Scrollbar />
            {isError && (
              <div className="p-4 text-center text-red-500">
                Error fetching data
              </div>
            )}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && !isError && (
              <>
                {gamesResult.length > 0 ? (
                  gamesResult.map(
                    ({
                      id,
                      userGames,
                      coverImage,
                      slug,
                      name,
                      parentPlatforms,
                    }) => (
                      <div
                        key={slug}
                        className={cn(
                          "hover:text-accent-background flex w-full cursor-pointer items-center gap-x-4 rounded-md px-4 py-3 ring-offset-background transition-colors hover:bg-accent/50",
                        )}
                      >
                        <div
                          className={`group relative h-[82px] w-1/5 overflow-hidden rounded-md`}
                        >
                          <Image
                            src={coverImage ?? ""}
                            alt={name}
                            fill
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                            className="h-auto w-auto object-cover transition-all duration-200 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col gap-y-1 text-sm">
                          <ParentPlatformsList platforms={parentPlatforms} />
                          <h3 className="... truncate text-ellipsis font-medium leading-5">
                            {name}
                          </h3>
                          <GameArtworkActions
                            id={id}
                            usersGames={userGames}
                            session={session}
                          />
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    No results found.
                  </p>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
