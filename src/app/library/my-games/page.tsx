import { PlusCircleIcon } from "lucide-react";

import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MyGamesContent } from "~/components/my-games";
import { userGameStatus } from "~/schemas/games";

const myGamesContentStatuses = userGameStatus.options.filter(
  (option) => option !== userGameStatus.enum.Wishlist,
);

const Page = async () => (
  <ScrollArea className="h-screen">
    <div className=" h-full px-4 py-6 lg:px-8">
      <Tabs defaultValue="backlog" className="h-full space-y-6">
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
          <div className="ml-auto mr-4">
            <Button>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add game
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              My Games Library
            </h2>
          </div>
        </div>
        <Separator className="my-4" />
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
