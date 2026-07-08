import dotenv from "dotenv";
import path from "path";
import { env } from "process";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  node_env: env.NODE_ENV,

  port: env.PORT,
  app_url: env.APP_URL,

  database_url: env.DATABASE_URL,

  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS || 12,
  jwt_access_secret: env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN || "7d",
  stripe_secret_key: env.STRIPE_SECRET_KEY,
};

export default config;
