import { FieldPacket, RowDataPacket } from "mysql2";
import ClsBDConexion from "./ClsBDConexion";

class ClsLog {
  async getLogByUserId(idUser: number) {
    const sql = "CALL `SP_GET_LOG_BY_USER_ID`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [idUser]);
    return data[0][0];
  }

  async registerLog(idDocument: number, idUser: number, title: string) {
    const sql = "CALL `SP_CREATE_LOG`(?,?,?)";
    await ClsBDConexion.conn.query(sql, [idUser, idDocument, title]);
  }
}

export default new ClsLog();
