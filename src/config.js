import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV.trim()}.env`),
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE: process.env.DATABASE,
  SERVER: process.env.SERVER,
  SERVER_USER: process.env.SERVER_USER,
  SERVER_PW: process.env.SERVER_PW,
  INSTANCE: process.env.INSTANCE,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  USER: process.env.USER,
  DATABASE_URL: process.env.DATABASE_URL,
  PASSWORD: process.env.PASSWORD,
  EMAIL_ACCOUNT: process.env.EMAIL_ACCOUNT,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
