"use client";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Search } from "~/components/ui/search";
import { useState } from "react";
import debounce from "debounce";
import { api } from "~/trpc/react";

export const GameSearchButton = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    data: gamesResult,
    isLoading,
    isError,
  } = api.games.getAllGames.useQuery({
    params: { search: searchTerm },
  });

  console.log({ gamesResult, searchTerm });

  const handleSearchInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    300,
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
        <div className="p-4">
          {isError && <div>Error fetching data</div>}
          {isLoading && <div>Loading...</div>}
          {gamesResult && (
            <div className="p-4">
              {gamesResult.map((game) => (
                <div key={game.id}>{game.name}</div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
