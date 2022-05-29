import { FieldPacket, RowDataPacket } from "mysql2";
import ClsBDConexion from "./ClsBDConexion";

interface IRango {
  id: number;
  name: string;
  index: number;
}
class ClsRango {
  async getRangos(): Promise<any[]> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_RANGO`()");
    return data[0][0];
  }
}

export default new ClsRango();
