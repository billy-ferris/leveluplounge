import * as React from "react";

import { SearchIcon } from "lucide-react";

import { cn } from "~/lib/utils";

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          {...props}
          className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          type="search"
          ref={ref}
        />
      </div>
    );
  },
);

Search.displayName = "Search";

export { Search };
