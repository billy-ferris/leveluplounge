import { Client } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "~/env";
import * as gameSchema from "./schemas/game";
import * as userSchema from "./schemas/user";

const neonClient = new Client({
  connectionString: `postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}/${env.DATABASE_NAME}?sslmode=require`,
});
await neonClient.connect();
export const db = drizzle(neonClient, {
  schema: { ...gameSchema, ...userSchema },
});
