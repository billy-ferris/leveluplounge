import type { Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: ["./src/server/db/schemas"],
  out: "./src/server/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: `postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}/${env.DATABASE_NAME}?sslmode=require`,
  },
  schemaFilter: ["public"],
} satisfies Config;
