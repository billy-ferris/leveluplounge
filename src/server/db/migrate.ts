import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { db } from "~/server/db";

// TODO: get migrations working
await migrate(db, { migrationsFolder: "./src/server/db/migrations" });
