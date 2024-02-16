import "~/app/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { SessionProvider, ThemeProvider } from "~/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className="h-full">
    <body
      className={cn(
        "relative h-full min-h-screen overflow-hidden font-sans antialiased",
        inter.variable,
      )}
    >
      <TRPCReactProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SessionProvider>
            <main className="relative mx-auto min-h-screen max-w-screen-xl">
              <div className="flex-1 flex-grow">{children}</div>
            </main>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </TRPCReactProvider>
    </body>
  </html>
);

export default RootLayout;
