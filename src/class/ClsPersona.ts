import { FieldPacket, RowDataPacket } from "mysql2";

//Lib
import { encryptPassword, matchPassword } from "../lib/helpers";

//Database
import { connect } from "../database";

// Interfaces
import IPersona from "../interface/IPersona";
import IValidacion from "../interface/IValidacion";

class ClsPersona {
  private Persona_Id: number;
  private Persona_Estado: boolean;
  private Persona_Correo: string = "";
  private Persona_Password: string = "";

  constructor() {
    this.Persona_Estado = true;
    this.Persona_Id = -1;
  }
  async asignarValores(correo: string, password: string) {
    this.Persona_Correo = correo;
    this.Persona_Password = await encryptPassword(password);
    this.Persona_Estado = true;
  }
  async registrarPersona(): Promise<IPersona> {
    const conn = await connect();
    const sql = `CALL SP_CREATE_PERSON(?,?,?); SELECT @id as Persona_Id;`;
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query(sql, [this.Persona_Estado, this.Persona_Correo, this.Persona_Password]);
    this.Persona_Id = data[0][1][0].Persona_Id;
    const newPersona: IPersona = {
      Persona_Id: this.Persona_Id,
      Persona_Correo: this.Persona_Correo,
      Persona_Estado: this.Persona_Estado,
    };
    await conn.end();
    return newPersona;
  }
  async VerificarLogin(correo: string, password: string): Promise<IValidacion> {
    const conn = await connect();
    const sql = `CALL SP_GET_PERSON(?);`;
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query(sql, [correo]);
    const persona = data[0][0][0];
    await conn.end();
    if (!persona) return { mensaje: "El correo no está registrado", validacion: false };
    if (persona.Persona_Estado === 0) return { mensaje: "Estás deshabilitado", validacion: false };
    if (!(await matchPassword(password, persona.Persona_PWD))) return { mensaje: "Contraseña incorrecta", validacion: false };
    return { mensaje: "Verificado", validacion: true };
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
