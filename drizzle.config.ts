import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: ["./src/server/db/schemas"],
  out: "./src/server/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: `mysql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}/${env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
  },
} satisfies Config;
