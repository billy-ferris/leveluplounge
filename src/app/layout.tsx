import "~/app/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className="h-full">
    <body
      className={cn("relative h-full font-sans antialiased", inter.variable)}
    >
      <main className="relative flex min-h-screen flex-col">
        <TRPCReactProvider>
          <div className="flex-1 flex-grow">{children}</div>
        </TRPCReactProvider>
      </main>
    </body>
  </html>
);

export default RootLayout;
