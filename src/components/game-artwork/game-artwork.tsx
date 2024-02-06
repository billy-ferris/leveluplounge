import { type FC } from "react";

import Image from "next/image";
import { type z } from "zod";

import { getServerAuthSession } from "~/server/auth";
import { GameArtworkActions } from "~/components/game-artwork";
import {
  NintendoIcon,
  PlaystationIcon,
  XboxIcon,
} from "~/components/icons/platforms";
import { type userGameStatus } from "~/schemas/games";

type GameStatus = z.infer<typeof userGameStatus>;

interface GameArtworkProps {
  id: number;
  name: string;
  userGames: {
    gameId: number;
    userId: string;
    status: GameStatus | null;
  }[];
  artworkUrl: string;
}
export const GameArtwork: FC<GameArtworkProps> = async ({
  id,
  userGames,
  name,
  artworkUrl,
}) => {
  const session = await getServerAuthSession();
  // const parentPlatforms = game.parent_platforms.map(
  //   ({ platform }) => platform.name,
  // );

  return (
    <div className="rounded-md border">
      <div className={`group relative h-[180px] overflow-hidden rounded-t-md`}>
        <Image
          src={artworkUrl}
          alt={name}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="h-auto w-auto object-cover transition-all duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-y-1 p-3 text-sm">
        <PlatformsList />
        <h3 className="... truncate text-ellipsis font-medium leading-5">
          {name}
        </h3>
        <GameArtworkActions id={id} usersGames={userGames} session={session} />
      </div>
    </div>
  );
};

const PlatformsList = ({ platforms }: { platforms?: string[] }) => {
  return (
    // <div className="absolute right-0 top-0 z-10 inline-flex items-center gap-x-1.5 rounded-bl-md border border-t-0 bg-black px-2.5 py-1">
    <div className="inline-flex items-center gap-x-1.5">
      {/*{platforms.includes(parentPlatformNameEnum.enum.PC) && (*/}
      <XboxIcon className="h-3 w-3 fill-primary" />
      {/*)}*/}
      {/*{platforms.includes(parentPlatformNameEnum.enum.Xbox) && (*/}
      <PlaystationIcon className="h-4 w-4 fill-primary" />
      {/*)}*/}
      {/*{platforms.includes(parentPlatformNameEnum.enum.Playstation) && (*/}
      <NintendoIcon className="h-4 w-4 fill-primary" />
      {/*)}*/}
    </div>
  );
};
