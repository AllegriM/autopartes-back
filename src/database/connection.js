import mysql from "mysql2/promise";
import CONFIG from "../config.js";

const pool = mysql.createPool({
  uri: CONFIG.DATABASE_URL || process.env.DATABASE_URL,
  host: CONFIG.HOST || process.env.HOST,
  user: CONFIG.USER || process.env.USER,
  password: CONFIG.PASSWORD || process.env.PASSWORD,
  database: CONFIG.DATABASE || process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export async function getConnection() {
  return pool;
}

export { mysql };
