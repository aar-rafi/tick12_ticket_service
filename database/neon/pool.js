// npm i @neondatabase/serverless
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async () => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    console.log("Server connected to database");
    console.log(version);
  } catch (e) {
    console.log(e.message);
  }
};

export { sql, requestHandler };
