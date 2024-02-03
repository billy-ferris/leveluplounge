"use client";

import { type PropsWithChildren } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export const SessionProvider = ({ children }: PropsWithChildren) => (
  <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
);
