import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "~/env";
import * as schema from "./schema";

export const db = drizzle(
  new Client({
    url: `mysql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}/${env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
  }).connection(),
  { schema },
);
