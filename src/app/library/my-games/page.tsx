import { Separator } from "~/components/ui/separator";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { GameArtwork } from "~/components/game-artwork/game-artwork";
import { api } from "~/trpc/server";

const Page = async () => {
  const games = await api.games.userGames.query();

  return (
    <div className=" h-full px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            My Games Library
          </h2>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {games.map(({ id, name, coverImage }) => (
              <div key={id} className="flex flex-col">
                <GameArtwork id={id} name={name} artworkUrl={coverImage} />
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
