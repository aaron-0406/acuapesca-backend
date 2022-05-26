import { FieldPacket, RowDataPacket } from "mysql2";
import ClsBDConexion from "./ClsBDConexion";
import IProcedure from "../interface/IProcedure";

class ClsProcedure {
  constructor() {}

  async getProcedures(id: number): Promise<any[]> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_PROCEDURES`(?)", [id]);
    return data[0][0];
  }
  async getProcedureById(id: number): Promise<IProcedure | undefined> {
    return undefined;
  }
  async createProcedure(title: string, code: string, process_id: number): Promise<IProcedure> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_INSERT_PROCEDURE`(?,?,?); SELECT @id AS 'procedure_id'", [title, code, process_id]);
    const procedure: IProcedure = {
      code,
      process_id,
      title,
      id: data[0][1][0].procedure_id,
    };
    return procedure;
  }
  async editProcedure(id: number, title: string, code: string, process_id: number): Promise<IProcedure> {
    const procedure: IProcedure = {
      code: "",
      process_id: 2,
      title: "",
      id: 1,
    };
    return procedure;
  }
  async deleteProcedure(id: number): Promise<void> {}
}

export default new ClsProcedure();
