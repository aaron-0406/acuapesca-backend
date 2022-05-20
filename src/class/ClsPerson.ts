import { FieldPacket, RowDataPacket } from "mysql2";

//Lib
import { encryptPassword, matchPassword } from "../lib/helpers";

//Database
import { connect } from "../database";

// Interfaces
import IPersona from "../interface/IPerson";
import IValidation from "../interface/IValidation";
import ClsBDConexion from "./ClsBDConexion";

class ClsPerson {
  /*
    Description: The porpuse of this method is for to validate Login requirements
    @param conn : Connection to database
    @param email : User's email
    @param password : User's password 
  */
  async verifyLogin(email: string, password: string): Promise<IValidation> {
    // Store Procedure
    const sql = `CALL SP_GET_PERSON(?);`;
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [email]);

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
    //Verfiying if the password is equal to repeatPassword
    if (newPassword !== repeatPassword) return { error: "La nueva contraseña no coincide con la repetida" };

    // GET USER PWD
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_PERSON`(?)", [email]);

    const user = data[0][0][0];

    // Matching passwords
    if (!(await matchPassword(oldPassword, user.Person_PWD))) return { error: "La antigua contraseña no es correcta" };

    // Encrypting new password
    newPassword = await encryptPassword(newPassword);

    // Updating password
    await ClsBDConexion.conn.query(`CALL SP_UPDATE_PASSWORD(?,?);`, [email, newPassword]);

    return { success: "Contraseña modificada correctamente" };
  }
  async editarEstado(id: number, estado: number) {
    const conn = await connect();
    await conn.query("CALL `SP_UPDATE_STATUS_PERSON`(?,?)", [id, estado]);
    await conn.end();
    return { success: `user ${estado === 1 ? "Habilitado" : "Inhabilitado"}` };
  }
  async getFoto(id: number) {
    const conn = await connect();
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_FOTO`(?)", [id]);
    const foto_url = data[0][0][0];
    await conn.end();
    return foto_url.Dato_Alfanum;
  }
}
export default new ClsPerson();