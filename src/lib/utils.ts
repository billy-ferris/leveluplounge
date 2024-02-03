import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const useActivePath = (): ((path: string) => boolean) => {
  const pathname = usePathname();

  return (path: string) => {
    return path === pathname;
  };
};
