import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MyGamesContent } from "~/components/my-games";
import { userGameStatus } from "~/schemas/games";
import { GameSearchButton } from "~/components/game-search-button";
import { UpdateDbButton } from "~/components/db-button";

const myGamesContentStatuses = userGameStatus.options;

const Page = async () => (
  <ScrollArea className="h-screen">
    <div className=" h-full px-4 py-6 lg:px-8">
      <Tabs
        defaultValue={userGameStatus.enum.Wishlist.toLowerCase()}
        className="h-full space-y-6"
      >
        <div className="space-between flex items-center">
          <TabsList>
            {myGamesContentStatuses.map((status, idx) => (
              <TabsTrigger
                key={idx}
                value={status.toLowerCase()}
                className="relative"
              >
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto mr-4 space-x-4">
            <UpdateDbButton />
            <GameSearchButton />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Library</h1>
          </div>
        </div>
        {myGamesContentStatuses.map((status, idx) => (
          <TabsContent key={idx} value={status.toLowerCase()}>
            <MyGamesContent status={status} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  </ScrollArea>
);

export default Page;
