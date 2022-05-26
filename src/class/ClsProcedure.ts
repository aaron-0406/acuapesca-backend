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
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_PROCEDURE_BY_ID`(?)", [id]);
    const procedure = data[0][0][0];

    if (!procedure) return undefined;

    const newProcedure: IProcedure = {
      id: procedure.id,
      process_id: procedure.process_id,
      title: procedure.title,
      code: procedure.code,
    };
    return newProcedure;
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
    await ClsBDConexion.conn.query("CALL `SP_UPDATE_PROCEDURE`(?,?,?,?)", [id,title, code, process_id]);
    const procedure: IProcedure = {
      code,
      process_id,
      title,
      id,
    };
    return procedure;
  }
  async deleteProcedure(id: number): Promise<void> {}
}

export default new ClsProcedure();
