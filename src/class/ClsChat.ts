import { FieldPacket, RowDataPacket } from "mysql2";
import ClsBDConexion from "./ClsBDConexion";

class ClsChat {
  constructor() {}

  async getContacts() {
    const sql = "CALL `SP_GET_CONTACTS`()";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql);
    const users = data[0][0];
    return users;
  }
}

export default new ClsChat();
