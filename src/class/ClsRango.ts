// mysql2 types
import { FieldPacket, RowDataPacket } from "mysql2";
import { IRol } from "../interface/IRol";
import { Request } from "express";
// Connection to DataBase
import ClsBDConexion from "./ClsBDConexion";
import IValidation from "../interface/IValidation";
import ClsExpR from "./ClsExpR";
type ITag = {
  id: number;
  name: string;
};
/*
  Description: This class is for manage Rango's data
*/
class ClsRango {
  validateData(req: Request): IValidation {
    const { name, code } = req.body;
    if (!name) return { message: "Falta el campo 'name'", validation: false };
    if (!code) return { message: "Falta el campo 'code'", validation: false };
    const validationName = ClsExpR.validarRequired(name);
    const validationCode = ClsExpR.validarRequired(code);

    if (!validationName.validation) return { message: `${validationName.message} (name)`, validation: false };
    if (!validationCode.validation) return { message: `${validationCode.message} (code)`, validation: false };
    return { message: "Ok", validation: true };
  }
  async getTagById(id: number): Promise<ITag | undefined> {
    const sql = `SELECT Funcion_Id AS 'id', Funcion_Nombre AS 'name' FROM Funcion WHERE Funcion_Id = ${id}`;
    const data = await ClsBDConexion.conn.query(sql);
    const tag = data[0][0];
    console.log(tag);
    if (!tag) return undefined;

    const newTag: ITag = {
      id: tag.id,
      name: tag.name,
    };
    return newTag;
  }
  /*
  Description: This method get all Rangos
  */
  async getRol(): Promise<any[]> {
    const sql = "CALL `SP_GET_RANGO`()";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql);
    return data[0][0];
  }
  async getRolByID(id: number): Promise<IRol | undefined> {
    const sql = "CALL `SP_GET_RANGO_BY_ID`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);
    const rol = data[0][0][0];

    if (!rol) return undefined;

    const newRol: IRol = {
      id: rol.id,
      name: rol.name,
      code: rol.code,
      tag: rol.tag,
      tag_id: rol.tag_id,
    };
    return newRol;
  }
  async createRol(name: string, code: string, tag_id: number, tag_name: string): Promise<IRol> {
    const sql = "CALL `SP_INSERT_RANGO`(?,?,?); SELECT @id as 'id_rol';";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [name, code, tag_id]);

    const newRol: IRol = {
      code,
      id: data[0][1][0].id_rol,
      name,
      tag_id,
      tag: tag_name,
    };
    return newRol;
  }

  async updateRol(id: number, name: string, code: string, tag_id: number, tag_name: string): Promise<IRol> {
    const sql = "CALL `SP_UPDATE_RANGO`(?,?,?,?);";
    await ClsBDConexion.conn.query(sql, [id, name, code, tag_id]);
    const newRol: IRol = {
      code,
      id,
      name,
      tag_id,
      tag: tag_name,
    };
    return newRol;
  }
}

export default new ClsRango();
