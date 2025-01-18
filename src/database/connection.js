import mysql from "mysql2/promise";
import CONFIG from "../config.js";

const connectionSettings = {
  host: CONFIG.HOST,
  user: CONFIG.USER,
  password: CONFIG.PASSWORD,
  database: CONFIG.DATABASE,
  port: CONFIG.PORT,
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
