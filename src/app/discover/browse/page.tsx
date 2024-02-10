import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { GameArtwork } from "~/components/game-artwork";
import { api } from "~/trpc/server";

const Page = async () => {
  const allGames = await api.games.getAllGames.query();

  return (
    <ScrollArea className="h-screen">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {allGames.map(
              ({
                id,
                name,
                coverImage,
                userGames,
                parentPlatforms,
                metacriticRating,
              }) => (
                <div key={id} className="flex flex-col">
                  <GameArtwork
                    id={id}
                    userGames={userGames}
                    parentPlatforms={parentPlatforms}
                    name={name}
                    artworkUrl={coverImage ?? ""}
                    metacriticRating={metacriticRating}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Page;
