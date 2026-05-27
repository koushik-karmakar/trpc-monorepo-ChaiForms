import { db, eq } from "./packages/database";
import { usersTable } from "./packages/database/schema";

async function run() {
  try {
    const users = await db.select().from(usersTable).limit(1);
    console.log("DB connected successfully, users:", users.length);
  } catch (e) {
    console.error("DB connection/query failed:", e);
  }
}
run();
