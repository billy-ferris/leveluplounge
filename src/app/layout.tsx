import "~/app/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Sidebar } from "~/components/sidebar";
import { collections } from "~/data";
import { ThemeProvider } from "~/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className="h-full">
    <body
      className={cn(
        "relative grid h-full min-h-screen overflow-hidden font-sans antialiased lg:grid-cols-6",
        inter.variable,
      )}
    >
      <TRPCReactProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Sidebar playlists={collections} className="hidden lg:block" />
          <main className="relative col-span-4 flex min-h-screen flex-col lg:col-span-5 lg:border-l">
            <div className="flex-1 flex-grow">{children}</div>
          </main>
          <Toaster />
        </ThemeProvider>
      </TRPCReactProvider>
    </body>
  </html>
);

export default RootLayout;
