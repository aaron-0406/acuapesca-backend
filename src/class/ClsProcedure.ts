// mysql2 types
import { FieldPacket, RowDataPacket } from "mysql2";

import { Request } from "express";

// Connection to DataBase
import ClsBDConexion from "./ClsBDConexion";

// Interface
import IProcedure from "../interface/IProcedure";
import IValidation from "../interface/IValidation";
import ClsExpR from "./ClsExpR";

/*
  Description: This class is for manage Procedure's data
*/
class ClsProcedure {
  /*
    Description: This method validate request body
  */
  validateData(req: Request): IValidation {
    const { title, code, process_id, status } = req.body;
    if (!title) return { message: "Falta el campo 'title'", validation: false };
    if (!process_id) return { message: "Falta el campo 'process_id'", validation: false };
    if (!code) return { message: "Falta el campo 'code'", validation: false };
    if (status === undefined) return { message: "Falta el campo 'status'", validation: false };
    const validationName = ClsExpR.validarRequired(title);
    const validationCode = ClsExpR.validarRequired(code);
    const validationProcessId = ClsExpR.validarDigitos(process_id);

    if (!validationName.validation) return { message: `${validationName.message} (name)`, validation: false };
    if (!validationCode.validation) return { message: `${validationCode.message} (code)`, validation: false };
    if (!validationProcessId.validation) return { message: "El id del proceso es inválido (process_id)", validation: false };
    return { message: "Ok", validation: true };
  }
  /*
    Description: This method get all procedures by process's id
    @param id: process's id
  */
  async getProcedures(id: number, rango: string): Promise<any[]> {
    const sql = "CALL `SP_GET_PROCEDURES`(?,?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id, rango]);
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
      status: procedure.status == 1,
      process_id: procedure.process_id,
      title: procedure.title,
      code: procedure.code,
    };

    return newProcedure;
  }

  /*
    Description: This method creates a new procedure
    @procedure : IProcedure
  */
  async createProcedure(procedure: IProcedure): Promise<IProcedure> {
    const { title, code, process_id, status } = procedure;
    const sql = "CALL `SP_INSERT_PROCEDURE`(?,?,?,?); SELECT @id AS 'procedure_id'";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [title, code, process_id, status ? 1 : 0]);
    procedure.id = data[0][1][0].procedure_id;
    return procedure;
  }

  /*
    Description: This method edits a procedure stored
    @id : procedure's id
    @title : procedure's title
    @code : procedure's code
    @process_id : process's id
    @status : procedure's status
  */
  async editProcedure(id: number, title: string, code: string, process_id: number, status: boolean): Promise<IProcedure> {
    const sql = "CALL `SP_UPDATE_PROCEDURE`(?,?,?,?,?)";
    await ClsBDConexion.conn.query(sql, [id, title, code, process_id, status ? 1 : 0]);

    // procedure edited
    const procedure: IProcedure = {
      code,
      status,
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
