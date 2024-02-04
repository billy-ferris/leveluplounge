import { Separator } from "~/components/ui/separator";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { GameArtwork } from "~/components/game-artwork";
import { api } from "~/trpc/server";

const Page = async () => {
  const allGames = await api.games.allGames.query();

  return (
    <div className=" h-full px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">All Games</h2>
          <p className="text-sm text-muted-foreground">
            All games. Updated daily.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {allGames.map(({ id, name, coverImage, userGames }) => (
              <div key={id} className="flex flex-col">
                <GameArtwork
                  id={id}
                  usersGames={userGames}
                  name={name}
                  artworkUrl={coverImage ?? ""}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Page;
