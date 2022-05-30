// mysql2 types
import { FieldPacket, RowDataPacket } from "mysql2";

// Connection to DataBase
import ClsBDConexion from "./ClsBDConexion";

// Interface
import IProcedure from "../interface/IProcedure";

/*
  Description: This class is for manage Procedure's data
*/
class ClsProcedure {
  /*
    Description: This method get all procedures by process's id
    @param id: process's id
  */
  async getProcedures(id: number): Promise<any[]> {
    const sql = "CALL `SP_GET_PROCEDURES`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);
    return data[0][0];
  }

  /*
    Description: This method get all procedures by procedure's id
    @param id: procedure's id
  */
  async getProcedureById(id: number): Promise<IProcedure | undefined> {
    const sql = "CALL `SP_GET_PROCEDURE_BY_ID`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);
    const procedure = data[0][0][0];

    // if there is not a procedure with that id
    if (!procedure) return undefined;

    // procedure with that id
    const newProcedure: IProcedure = {
      id: procedure.id,
      process_id: procedure.process_id,
      title: procedure.title,
      code: procedure.code,
    };

    return newProcedure;
  }

  /*
    Description: This method creates a new procedure
    @title : procedure's title
    @code : procedure's code
    @process_id : process's id
  */
  async createProcedure(title: string, code: string, process_id: number): Promise<IProcedure> {
    const sql = "CALL `SP_INSERT_PROCEDURE`(?,?,?); SELECT @id AS 'procedure_id'";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [title, code, process_id]);

    // new procedure
    const procedure: IProcedure = {
      code,
      process_id,
      title,
      id: data[0][1][0].procedure_id,
    };

    return procedure;
  }

  /*
    Description: This method edits a procedure stored
    @id : procedure's id
    @title : procedure's title
    @code : procedure's code
    @process_id : process's id
  */
  async editProcedure(id: number, title: string, code: string, process_id: number): Promise<IProcedure> {
    const sql = "CALL `SP_UPDATE_PROCEDURE`(?,?,?,?)";
    await ClsBDConexion.conn.query(sql, [id, title, code, process_id]);

    // procedure edited
    const procedure: IProcedure = {
      code,
      process_id,
      title,
      id,
    };

    return procedure;
  }

  /*
    Description: This method deletes a procedure stored
    @id : procedure's id
  */
  async deleteProcedure(id: number): Promise<void> {
    const sql = "CALL `SP_DELETE_PROCEDURE`(?)";
    await ClsBDConexion.conn.query(sql, [id]);
  }
}

export default new ClsProcedure();
