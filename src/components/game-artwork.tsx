import Image from "next/image";
import Link from "next/link";

import {
  PlaystationIcon,
  WindowsIcon,
  XboxIcon,
} from "~/components/icons/platforms";
import { parentPlatformNameEnum } from "~/schemas/games";
import { getServerAuthSession } from "~/server/auth";
import type { gameStatuses } from "~/server/db/schema";
import { ExpandIcon, GiftIcon, PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { GameArtworkActions } from "~/components/game-artwork-actions";

type GameStatus = (typeof gameStatuses)[number];

interface GameArtworkProps {
  id: number;
  name: string;
  usersGames?:
    | {
        gameId: number;
        userId: string;
        status: GameStatus | null;
      }[]
    | [];
  artworkUrl: string;
  releaseDate: string;
}
export const GameArtwork = async ({
  id,
  usersGames,
  name,
  artworkUrl,
}: GameArtworkProps) => {
  const session = await getServerAuthSession();
  // const parentPlatforms = game.parent_platforms.map(
  //   ({ platform }) => platform.name,
  // );

  return (
    <div className="rounded-md border">
      <div
        className={`group relative h-[180px] w-[300px] overflow-hidden rounded-t-md`}
      >
        {/*<PlatformsList platforms={parentPlatforms} />*/}
        <Image
          src={artworkUrl}
          alt={name}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="h-auto w-auto object-cover transition-all duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex max-w-[300px] flex-col gap-y-1 p-3 text-sm">
        <h3 className="... truncate text-ellipsis font-medium leading-5">
          {name}
        </h3>
        {usersGames && (
          <GameArtworkActions
            id={id}
            usersGames={usersGames}
            session={session}
          />
        )}
      </div>
    </div>
  );
};

const PlatformsList = ({ platforms }: { platforms: string[] }) => {
  return (
    <div className="absolute bottom-0 right-0 z-10 inline-flex items-center gap-x-2 rounded-tl-md border border-transparent bg-black px-2.5 py-1 opacity-60 transition hover:opacity-75">
      {platforms.includes(parentPlatformNameEnum.enum.PC) && (
        <WindowsIcon height={12} width={12} fill="#FFF" />
      )}
      {platforms.includes(parentPlatformNameEnum.enum.Xbox) && (
        <XboxIcon height={14} width={14} fill="#FFF" />
      )}
      {platforms.includes(parentPlatformNameEnum.enum.Playstation) && (
        <PlaystationIcon height={18} width={18} fill="#FFF" />
      )}
    </div>
  );
};
