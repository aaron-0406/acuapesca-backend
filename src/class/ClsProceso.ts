import { FieldPacket, RowDataPacket } from "mysql2";
import IProceso from "../interface/IProceso";
import ClsBDConexion from "./ClsBDConexion";

class ClsProceso {
  constructor() {}

  async getProcess(): Promise<any[]> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_PROCESS`()");
    return data[0][0];
  }

  async createProcess(name: string, code: string): Promise<IProceso> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_INSERT_PROCESS`(?,?); SELECT @id as 'id_process';", [name, code]);
    const newProcess: IProceso = {
      id: data[0][1][0].id_process,
      name,
      code,
    };
    return newProcess;
  }

  async editProcess(id: number, name: string, code: string) {
    await ClsBDConexion.conn.query("CALL `SP_UPDATE_PROCESS`(?,?,?);", [id,name, code]);
    const newProcess: IProceso = {
      id,
      name,
      code,
    };
    return newProcess;
  }
  async deleteProcess(id: number): Promise<void> {
    await ClsBDConexion.conn.query("CALL `SP_DELETE_PROCESS`(?);", [id]);
  }

  async getProccessById(id: number): Promise<IProceso | undefined> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_PROCESS_BY_ID`(?)", [id]);
    const proceso = data[0][0][0];

    if (!proceso) return undefined;

    const newProcess: IProceso = {
      id: proceso.id,
      name: proceso.name,
      code: proceso.code,
    };
    return newProcess;
  }
}

export default new ClsProceso();
