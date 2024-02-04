import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

import { env } from "~/env";
import * as gameSchema from "./schemas/game";
import * as userSchema from "./schemas/user";

export const db = drizzle(
  new Client({
    url: `mysql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}/${env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
  }).connection(),
  { schema: { ...userSchema, ...gameSchema } },
);
