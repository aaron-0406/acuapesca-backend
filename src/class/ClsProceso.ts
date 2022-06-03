// mysql2 types
import { FieldPacket, RowDataPacket } from "mysql2";

import { Request } from "express";

// Connection to DataBase
import ClsBDConexion from "./ClsBDConexion";

// Interfaces
import IProceso from "../interface/IProceso";
import IValidation from "../interface/IValidation";

import ClsExpR from "./ClsExpR";

/*
  Description: This class is for manage Process's data
*/
class ClsProceso {
  /*
    Description: This method validate request body
  */
  validateData(req: Request): IValidation {
    const { name, code, status } = req.body;
    if (!name) return { message: "Falta el campo 'name'", validation: false };
    if (!code) return { message: "Falta el campo 'code'", validation: false };
    const validationName = ClsExpR.validarRequired(name);
    const validationCode = ClsExpR.validarRequired(code);

    if (!validationName.validation) return { message: `${validationName.message} (name)`, validation: false };
    if (!validationCode.validation) return { message: `${validationCode.message} (code)`, validation: false };
    return { message: "Ok", validation: true };
  }

  /*
    Description: This method get all process
  */
  async getProcess(rango: string): Promise<any[]> {
    const sql = "CALL `SP_GET_PROCESS`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [rango]);
    return data[0][0];
  }

  /*
    Description: This method create a new process
    @param id: process's id
  */
  async getProccessById(id: number): Promise<IProceso | undefined> {
    const sql = "CALL `SP_GET_PROCESS_BY_ID`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);
    const proceso = data[0][0][0];

    // In case there is not a process stored
    if (!proceso) return undefined;

    // process from databse
    const newProcess: IProceso = {
      id: proceso.id,
      name: proceso.name,
      code: proceso.code,
      status: proceso.status == 1,
    };
    return newProcess;
  }

  /*
    Description: This method create a new process
    @param name: process's name
    @param code: process's code
  */
  async createProcess(name: string, code: string, status: boolean): Promise<IProceso> {
    const sql = "CALL `SP_INSERT_PROCESS`(?,?,?); SELECT @id as 'id_process';";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [name, code, status ? 1 : 0]);

    //New Process
    const newProcess: IProceso = {
      id: data[0][1][0].id_process,
      name,
      code,
      status,
    };
    return newProcess;
  }

  /*
    Description: This method create a new process
    @param id: process's id
    @param name: process's name
    @param code: process's code
  */
  async editProcess(id: number, name: string, code: string, status: boolean) {
    const sql = "CALL `SP_UPDATE_PROCESS`(?,?,?,?);";
    await ClsBDConexion.conn.query(sql, [id, name, code, status ? 1 : 0]);

    // Process edited
    const newProcess: IProceso = {
      id,
      name,
      code,
      status,
    };
    return newProcess;
  }

  /*
    Description: This method create a new process
    @param id: process's id
    @status id: process's status
  */
  async changeStatus(id: number, status: boolean): Promise<void> {
    const sql = "CALL `SP_CHANGE_PROCESS_STATUS`(?,?);";
    await ClsBDConexion.conn.query(sql, [id, status ? 1 : 0]);
  }
}

export default new ClsProceso();
