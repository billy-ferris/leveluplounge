import Image from "next/image";
import type { z } from "zod";

import {
  PlaystationIcon,
  WindowsIcon,
  XboxIcon,
} from "~/components/icons/platforms";
import { cn } from "~/lib/utils";
import type { gameSchema } from "~/schemas/games";
import { parentPlatformNameEnum } from "~/schemas/games";

type Game = z.infer<typeof gameSchema>;

interface GameArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  game: Game;
  width: number;
  height: number;
}

export const GameArtwork = ({
  game,
  width,
  height,
  className,
  ...props
}: GameArtworkProps) => {
  const parentPlatforms = game.parent_platforms.map(
    ({ platform }) => platform.name,
  );
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div
        className={`relative h-[${height}px] w-[${width}px] overflow-hidden rounded-md`}
      >
        <PlatformsList platforms={parentPlatforms} />
        <Image
          src={game.background_image}
          alt={game.name}
          layout="fill"
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="h-auto w-auto object-cover transition-all hover:scale-105"
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-5">{game.name}</h3>
        <p className="text-xs text-muted-foreground">{game.released}</p>
      </div>
    </div>
  );
};

const PlatformsList = ({ platforms }: { platforms: string[] }) => {
  return (
    <div className="absolute bottom-0 right-0 z-10 inline-flex items-center gap-x-3 rounded-br-md rounded-tl-md border border-transparent bg-black px-2.5 py-1 opacity-60">
      {platforms.includes(parentPlatformNameEnum.enum.PC) && (
        <WindowsIcon height={14} width={14} fill="#FFF" />
      )}
      {platforms.includes(parentPlatformNameEnum.enum.Xbox) && (
        <XboxIcon height={16} width={16} fill="#FFF" />
      )}
      {platforms.includes(parentPlatformNameEnum.enum.Playstation) && (
        <PlaystationIcon height={20} width={20} fill="#FFF" />
      )}
    </div>
  );
};
