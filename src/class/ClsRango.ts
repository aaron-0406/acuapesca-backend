// mysql2 types
import { FieldPacket, RowDataPacket } from "mysql2";

// Connection to DataBase
import ClsBDConexion from "./ClsBDConexion";

/*
  Description: This class is for manage Rango's data
*/
class ClsRango {
  /*
  Description: This method get all Rangos
  */
  async getRangos(): Promise<any[]> {
    const sql = "CALL `SP_GET_RANGO`()";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql);
    return data[0][0];
  }
}

export default new ClsRango();
