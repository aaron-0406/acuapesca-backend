// mysql2 types
import { FieldPacket, RowDataPacket } from "mysql2";

// Connection to DataBase
import ClsBDConexion from "./ClsBDConexion";

// Interfaces
import IProceso from "../interface/IProceso";

/*
  Description: This class is for manage Process's data
*/
class ClsProceso {
  /*
    Description: This method get all process
  */
  async getProcess(): Promise<any[]> {
    const sql = "CALL `SP_GET_PROCESS`()";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql);
    return data[0][0];
  }

  /*
    Description: This method create a new process
    @param name: process's name
    @param code: process's code
  */
  async createProcess(name: string, code: string): Promise<IProceso> {
    const sql = "CALL `SP_INSERT_PROCESS`(?,?); SELECT @id as 'id_process';";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [name, code]);

    //New Process
    const newProcess: IProceso = {
      id: data[0][1][0].id_process,
      name,
      code,
    };
    return newProcess;
  }

  /*
    Description: This method create a new process
    @param id: process's id
    @param name: process's name
    @param code: process's code
  */
  async editProcess(id: number, name: string, code: string) {
    const sql = "CALL `SP_UPDATE_PROCESS`(?,?,?);";
    await ClsBDConexion.conn.query(sql, [id, name, code]);

    // Process edited
    const newProcess: IProceso = {
      id,
      name,
      code,
    };
    return newProcess;
  }

  /*
    Description: This method create a new process
    @param id: process's id
  */
  async deleteProcess(id: number): Promise<void> {
    const sql = "CALL `SP_DELETE_PROCESS`(?);";
    await ClsBDConexion.conn.query(sql, [id]);
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
    };
    return newProcess;
  }
}

export default new ClsProceso();
