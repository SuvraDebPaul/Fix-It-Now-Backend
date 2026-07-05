import dotenv from "dotenv";
import path from "path";
import { env } from "process";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: env.PORT,
  app_url: env.APP_URL,
  database_url: env.DATABASE_URL,
  node_env: env.NODE_ENV,
};

export default config;
