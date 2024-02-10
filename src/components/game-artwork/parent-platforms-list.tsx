import { type ReactElement } from "react";

import {
  NintendoIcon,
  PlaystationIcon,
  XboxIcon,
} from "~/components/icons/platforms";
import { type parentPlatformGames } from "~/server/db/schemas";

type ParentPlatformGame = typeof parentPlatformGames.$inferSelect;

const platformIconMapping: Record<string, ReactElement> = {
  1: <XboxIcon className="h-3 w-3 fill-primary" />,
  2: <PlaystationIcon className="h-4 w-4 fill-primary" />,
  3: <NintendoIcon className="h-4 w-4 fill-primary" />,
};

export const ParentPlatformsList = ({
  platforms,
}: {
  platforms: ParentPlatformGame[];
}) => {
  return (
    <div className="inline-flex items-center gap-x-1.5">
      {platforms.map(({ platformId }) => platformIconMapping[platformId])}
    </div>
  );
};
