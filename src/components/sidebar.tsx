"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { Gamepad2, LayoutGrid } from "lucide-react";

import { Button, buttonVariants } from "~/components/ui/button";
import { cn, useActivePath } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Collection } from "~/data";
import { UpdateDbButton } from "~/components/db-button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Collection[];
}

export const Sidebar = ({ className, playlists }: SidebarProps) => {
  const { data: session } = useSession();
  const isActivePath = useActivePath();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start",
                isActivePath("/discover/browse") && "active bg-accent",
              )}
              href="/discover/browse"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Browse
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start",
                isActivePath("/library/my-games") && "active bg-accent",
              )}
              href="/library/my-games"
            >
              <Gamepad2 className="mr-2 h-4 w-4" />
              My Games
            </Link>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Collections
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 15V6" />
                    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M12 12H3" />
                    <path d="M16 6H3" />
                    <path d="M12 18H3" />
                  </svg>
                  {playlist}
                </Button>
              ))}
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className={buttonVariants()}
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
              <UpdateDbButton />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
