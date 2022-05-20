import { FieldPacket, RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";

//Lib
import { encryptPassword, matchPassword } from "../lib/helpers";

//Database
import { connect } from "../database";

// Interfaces
import IPersona from "../interface/IPerson";
import IValidation from "../interface/IValidation";

class ClsPersona {
  private Person_Id: number;
  private Person_Status: boolean;
  private Person_Email: string = "";
  private Person_PWD: string = "";

  constructor() {
    this.Person_Status = true;
    this.Person_Id = -1;
  }
  async asignarValores(correo: string, password: string) {
    this.Person_Email = correo;
    this.Person_PWD = await encryptPassword(password);
    this.Person_Status = true;
  }
  async registrarPersona(): Promise<IPersona> {
    const conn = await connect();
    const sql = `CALL SP_CREATE_PERSON(?,?,?); SELECT @id as Persona_Id;`;
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query(sql, [this.Person_Status, this.Person_Email, this.Person_PWD]);
    this.Person_Id = data[0][1][0].Person_Id;
    const newPersona: IPersona = {
      Person_Id: this.Person_Id,
      Person_Email: this.Person_Email,
      Person_Status: this.Person_Status,
    };
    await conn.end();
    return newPersona;
  }

  /*
    Description: The porpuse of this method is for to validate Login requirements
    @param conn : Connection to database
    @param email : User's email
    @param password : User's password 
  */
  async verifyLogin(conn: Pool, email: string, password: string): Promise<IValidation> {
    // Store Procedure
    const sql = `CALL SP_GET_PERSON(?);`;
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query(sql, [email]);

    // Data from database
    const persona = data[0][0][0];

    // exist?
    if (!persona) return { message: "El correo no está registrado", validation: false };

    // Enaled or disabled?
    if (persona.Person_Status === 0) return { message: "Estás deshabilitado", validation: false };

    // Password match?
    if (!(await matchPassword(password, persona.Person_PWD))) return { message: "Contraseña incorrecta", validation: false };

    // All ok
    return { message: "Verificado", validation: true };
  }

  async changePassword(oldPassword: string, newPassword: string, repeatPassword: string, email?: string) {
    if (newPassword !== repeatPassword) return { error: "La nueva contraseña no coincide con la repetida" };
    const conn = await connect();
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_PERSON`(?)", [email]);
    const usuario = data[0][0][0];
    if (!(await matchPassword(oldPassword, usuario.Persona_PWD))) {
      await conn.end();
      return { error: "La antigua contraseña no es correcta" };
    }
    newPassword = await encryptPassword(newPassword);
    await conn.query(`CALL SP_UPDATE_PASSWORD(?,?);`, [email, newPassword]);
    conn.end();
    return { success: "Contraseña modificada correctamente" };
  }
  async editarEstado(id: number, estado: number) {
    const conn = await connect();
    await conn.query("CALL `SP_UPDATE_STATUS_PERSON`(?,?)", [id, estado]);
    await conn.end();
    return { success: `Usuario ${estado === 1 ? "Habilitado" : "Inhabilitado"}` };
  }
  async getFoto(id: number) {
    const conn = await connect();
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_FOTO`(?)", [id]);
    const foto_url = data[0][0][0];
    await conn.end();
    return foto_url.Dato_Alfanum;
  }
}
export default new ClsPersona();
