import { createPool } from "mysql2/promise";
import { config } from './config/config'

export async function connect() {
  const connection = await createPool({
    host: config.host,
    user: config.user,
    // password:process.env.BD_PASSWORD,
    database: config.database,
    port: config.port,
    connectionLimit: 10,
    multipleStatements: true
  });
  return connection;
}
export const database = {
  host: config.host,
  user: config.user,
  // password:process.env.BD_PASSWORD,
  database: config.database,
  port: config.port,
  connectionLimit: 10,
  multipleStatements: true
}
