import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { mysqlTableCreator } from "drizzle-orm/mysql-core";

import { env } from "~/env";
import * as schema from "./schema";

export const mysqlTable = mysqlTableCreator((name) => `leveluplounge_${name}`);

export const db = drizzle(
  new Client({
    url: `mysql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}/${env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
  }).connection(),
  { schema },
);
