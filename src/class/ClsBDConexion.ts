import { Pool } from "mysql2/promise";
import { connect } from "../database";

class ClsBDConexion {
  public conn: any;
  async connectBD() {
    this.conn = await connect();
    console.log("Database connected");
  }
  async endConnection() {
    if (this.conn) await this.conn.end();
  }
}

export default new ClsBDConexion();
