import {
  NintendoIcon,
  PlaystationIcon,
  XboxIcon,
} from "~/components/icons/platforms";

export const PlatformsList = ({ platforms }: { platforms?: string[] }) => {
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
