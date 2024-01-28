import "~/app/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Sidebar } from "~/components/sidebar";
import { collections } from "~/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className="h-full">
    <TRPCReactProvider>
      <body
        className={cn(
          "relative grid h-full min-h-screen overflow-hidden font-sans antialiased lg:grid-cols-6",
          inter.variable,
        )}
      >
        <Sidebar playlists={collections} className="hidden lg:block" />
        <main className="relative col-span-4 flex min-h-screen flex-col lg:col-span-5 lg:border-l">
          <div className="flex-1 flex-grow">{children}</div>
        </main>
      </body>
    </TRPCReactProvider>
  </html>
);

export default RootLayout;
