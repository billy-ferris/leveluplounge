import Image from "next/image";
import Link from "next/link";

import {
  PlaystationIcon,
  WindowsIcon,
  XboxIcon,
} from "~/components/icons/platforms";
import { parentPlatformNameEnum } from "~/schemas/games";
import { GameArtworkActions } from "~/components/game-artwork-actions";
import { getServerAuthSession } from "~/server/auth";

interface GameArtworkProps {
  id: number;
  name: string;
  usersGames?:
    | {
        gameId: number;
        userId: string;
        status:
          | "Wishlist"
          | "Backlog"
          | "Playing"
          | "Paused"
          | "Beaten"
          | "Quit"
          | null;
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
  releaseDate,
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
        {usersGames && (
          <GameArtworkActions
            session={session}
            usersGames={usersGames}
            gameId={id}
          />
        )}
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
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/developer" className="underline hover:no-underline">
            Developer
          </Link>
          <p>
            {new Date(releaseDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
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
