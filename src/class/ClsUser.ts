//Interfaces
import IEstudiante from "../interface/IEstudiante";
import IPersona from "../interface/IPerson";
import IUser from "../interface/IUser";
import { Request } from "express";

//Database
import { FieldPacket, RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { connect } from "../database";
import IValidation from "../interface/IValidation";
import ClsExpR from "./ClsExpR";
import ClsBDConexion from "./ClsBDConexion";

class ClsUsuario {
  /*
    Description: This method validate Data Structure of User
  */
  validateUserData(req: Request): IValidation {
    const { name, lastname, email, dni, id_rango, address, status, password } = req.body;
    if (!name) return { message: "Falta el campo 'name'", validation: false };
    if (!lastname) return { message: "Falta el campo 'lastname'", validation: false };
    if (!email) return { message: "Falta el campo 'email'", validation: false };
    if (!dni) return { message: "Falta el campo 'dni'", validation: false };
    if (!id_rango) return { message: "Falta el campo 'id_rango'", validation: false };
    if (!address) return { message: "Falta el campo 'address'", validation: false };
    if (!status) return { message: "Falta el campo 'status'", validation: false };
    if (!password) return { message: "Falta el campo 'password'", validation: false };

    const validationEmail = ClsExpR.validarCorreo(email);
    const validationName = ClsExpR.validarNombre(name);
    const validationLastname = ClsExpR.validarNombre(lastname);
    const validationDni = ClsExpR.validarLength(dni, 8);
    const validationPassword = ClsExpR.validarRequired(password);

    if (!validationEmail.validation) return { message: `${validationEmail.message} (email)`, validation: false };
    if (!validationName.validation) return { message: `${validationEmail.message} (name)`, validation: false };
    if (!validationLastname.validation) return { message: `${validationEmail.message} (lastname)`, validation: false };
    if (!validationDni.validation) return { message: `${validationDni.message} (dni)`, validation: false };
    if (!validationPassword.validation) return { message: `${validationPassword.message} (password)`, validation: false };
    return { message: "Ok", validation: true };
  }

  /*
      Description: This method create a new user
  */
  async createUser(status: boolean, email: string, password: string, dni: string, name: string, lastname: string, address: string, id_rango: number, photo: string): Promise<IUser> {
    const sqlCreateUser = `CALL SP_CREATE_USER(?,?,?,?,?,?,?,?,?); SELECT @id as Person_Id; `;
    photo = photo ? `${photo}` : `defaultPhotoProfile.png`;
    const resCreateUser: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sqlCreateUser, [status ? 1 : 0, email, password, dni, id_rango, name, lastname, address, photo]);
    const id = resCreateUser[0][1][0].Person_Id;
    const resRango: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_RANGO_BY_ID`(?)", [id_rango]);
    const rangoNombre = resRango[0][0][0];
    const usuario: IUser = {
      id,
      address,
      dni,
      email,
      lastname,
      id_rango,
      name,
      photo,
      rango: rangoNombre.Rango,
      status,
    };
    return usuario;
  }

  async getUser(correo: string): Promise<IUser> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_USER`(?)", [correo]);
    const usuario = data[0][0][0];
    const newUsuario: IUser = {
      id: usuario.id,
      name: usuario.name,
      lastname: usuario.lastname,
      email: usuario.email,
      status: usuario.status === 1,
      id_rango: usuario.id_rango,
      rango: usuario.rango,
      dni: usuario.dni,
      address: usuario.address,
      photo: usuario.photo,
    };
    return newUsuario;
  }

  // async editarEstudiante(id: number, correo: string) {
  //   const conn = await connect();
  //   await conn.query("CALL `SP_UPDATE_STUDENT`(?,?,?,?,?,?,?,?,?)", [this.name, this.lastname, correo, this.dni, id]);
  //   await conn.end();
  // }

  async getEstudiantes(pagina?: string, filtro?: string) {
    const conn = await connect();
    pagina = pagina === undefined || pagina === "" ? "-1" : pagina;
    filtro = filtro === undefined ? "-1" : filtro;
    let cantidad: number = 0;
    const cantidadDatos = 12;
    const page = (parseInt(pagina) - 1) * cantidadDatos;
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_STUDENTS`(?,?)", [cantidadDatos * parseInt(pagina), filtro]);
    await conn.end();
    cantidad = data[0][1][0].Cantidad;
    if (pagina === "-1") return { estudiantes: data[0][0], cantidad }; //Todo el resultado
    const estudiantes = data[0][0].splice(page, cantidadDatos); //Separado por paginas
    return { estudiantes, cantidad };
  }
}
export default new ClsUsuario();
