import { migrate } from "drizzle-orm/planetscale-serverless/migrator";
import { db } from "./";

await migrate(db, { migrationsFolder: "./src/server/db/migrations" });
