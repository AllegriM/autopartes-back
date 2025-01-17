import mysql from "mysql2/promise";
import CONFIG from "../config.js";

// const connectionSettingsMSSQL = {
//   server: CONFIG.SERVER + "\\" + CONFIG.INSTANCE,
//   database: CONFIG.DATABASE,
//   user: CONFIG.SERVER_USER,
//   password: CONFIG.SERVER_PW,
//   options: {
//     encrypt: false,
//     enableArithAbort: true,
//     trustServerCertificate: true,
//   },
//   port: CONFIG.PORT,
// };

const connectionSettings = {
  host: CONFIG.HOST,
  user: CONFIG.USER,
  password: CONFIG.PASSWORD,
  database: CONFIG.DATABASE,
  // port: CONFIG.PORT,
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
