import { api } from "~/trpc/server";
import { GameArtwork } from "~/components/game-artwork/game-artwork";
import { Separator } from "~/components/ui/separator";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

const Page = async () => {
  const trendingGames = await api.games.getTrendingGames.query();
  const recentGames = await api.games.getRecentGames.query();
  // const test = await api.games.updateDb.query();

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Top Trending
          </h2>
          <p className="text-sm text-muted-foreground">
            Based on player counts and release date. Updated daily.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {trendingGames.results.map(
              ({ id, name, released, background_image }) => (
                <GameArtwork
                  id={id}
                  key={id}
                  name={name}
                  releaseDate={released}
                  artworkUrl={background_image}
                />
              ),
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            New Releases
          </h2>
          <p className="text-sm text-muted-foreground">
            Recently released games on all platforms. Updated daily.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {recentGames.results.map(
              ({ id, name, released, background_image }) => (
                <GameArtwork
                  key={id}
                  id={id}
                  name={name}
                  releaseDate={released}
                  artworkUrl={background_image}
                />
              ),
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Page;
