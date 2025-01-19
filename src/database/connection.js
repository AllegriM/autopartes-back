import mysql from "mysql2/promise";
import CONFIG from "../config.js";

const connectionSettings = {
  uri: CONFIG.DATABASE_URL || process.env.DATABASE_URL,
  host: CONFIG.HOST || process.env.HOST,
  user: CONFIG.USER || process.env.USER,
  password: CONFIG.PASSWORD || process.env.PASSWORD,
  database: CONFIG.DATABASE || process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export async function getConnection() {
  try {
    const pool = mysql.createPool(connectionSettings);
    return pool;
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw new Error("Database connection failed");
  }
}

export { mysql };
