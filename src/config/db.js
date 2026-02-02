import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

export const pool = mysql.createPool(process.env.DATABASE_URL);
