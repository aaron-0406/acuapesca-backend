import { RowDataPacket, FieldPacket } from "mysql2";
import ClsBDConexion from "./ClsBDConexion";

class ClsConfig {
  async changePhotoProcess(filename: string) {
    const sql = "CALL SP_INSERT_PHOTO_PROCESS(?)";
    await ClsBDConexion.conn.query(sql, [filename]);
    return filename;
  }
  async getPhotoProcess() {
    const sql = "CALL SP_GET_PHOTO_PROCESS()";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql);
    return data[0][0][0].Valor;
  }
}

export default new ClsConfig();
