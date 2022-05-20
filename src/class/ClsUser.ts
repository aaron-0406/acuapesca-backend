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
  validateUserData(req: Request, mode: string): IValidation {
    const { name, lastname, email, dni, id_rango, address, status, password } = req.body;
    if (!name) return { message: "Falta el campo 'name'", validation: false };
    if (!lastname) return { message: "Falta el campo 'lastname'", validation: false };
    if (!email) return { message: "Falta el campo 'email'", validation: false };
    if (!dni) return { message: "Falta el campo 'dni'", validation: false };
    if (!id_rango) return { message: "Falta el campo 'id_rango'", validation: false };
    if (!address) return { message: "Falta el campo 'address'", validation: false };
    if (!status) return { message: "Falta el campo 'status'", validation: false };
    if (mode === "Create") {
      if (!password) return { message: "Falta el campo 'password'", validation: false };
    }

    const validationEmail = ClsExpR.validarCorreo(email);
    const validationName = ClsExpR.validarNombre(name);
    const validationLastname = ClsExpR.validarNombre(lastname);
    const validationDni = ClsExpR.validarLength(dni, 8);
    let validationPassword = { message: "Ok", validation: true };
    if (mode === "Create") validationPassword = ClsExpR.validarRequired(password);
    if (!validationEmail.validation) return { message: `${validationEmail.message} (email)`, validation: false };
    if (!validationName.validation) return { message: `${validationEmail.message} (name)`, validation: false };
    if (!validationLastname.validation) return { message: `${validationEmail.message} (lastname)`, validation: false };
    if (!validationDni.validation) return { message: `${validationDni.message} (dni)`, validation: false };
    if (!validationPassword.validation) return { message: `${validationPassword.message} (password)`, validation: false };
    return { message: "Ok", validation: true };
  }

  /*
    Description: This method validate Data Structure of Reset PWD Request
  */
  validateResetPWDData(req: Request): IValidation {
    const { oldPassword, newPassword, repeatPassword } = req.body;
    if (!oldPassword) return { message: "Falta el campo 'oldPassword'", validation: false };
    if (!newPassword) return { message: "Falta el campo 'newPassword'", validation: false };
    if (!repeatPassword) return { message: "Falta el campo 'repeatPassword'", validation: false };

    const validationOldPassword = ClsExpR.validarRequired(oldPassword);
    const validationNewPassword = ClsExpR.validarRequired(newPassword);
    const validationRepeatPassword = ClsExpR.validarRequired(repeatPassword);

    if (!validationOldPassword.validation) return { message: `${validationOldPassword.message} (oldPassword)`, validation: false };
    if (!validationNewPassword.validation) return { message: `${validationNewPassword.message} (newPassword)`, validation: false };
    if (!validationRepeatPassword.validation) return { message: `${validationRepeatPassword.message} (repeatPassword)`, validation: false };
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

  /*
      Description: This method get an user by email
  */
  async getUserByEmail(email: string): Promise<IUser> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_USER_BY_EMAIL`(?)", [email]);
    const user = data[0][0][0];
    const newUser: IUser = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      status: user.status === 1,
      id_rango: user.id_rango,
      rango: user.rango,
      dni: user.dni,
      address: user.address,
      photo: user.photo,
    };
    return newUser;
  }
  /*
      Description: This method get an user by id
  */
  async getUserById(id: string): Promise<IUser> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_USER_BY_ID`(?)", [id]);
    const user = data[0][0][0];
    const newUser: IUser = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      status: user.status === 1,
      id_rango: user.id_rango,
      rango: user.rango,
      dni: user.dni,
      address: user.address,
      photo: user.photo,
    };
    return newUser;
  }

  async editUser(id: number, status: boolean, email: string, password: string, dni: string, name: string, lastname: string, address: string, id_rango: number, photo: string): Promise<IUser> {
    await ClsBDConexion.conn.query("CALL `SP_UPDATE_USER`(?,?,?,?,?,?,?,?,?,?)", [id, name, lastname, email, password, status ? 1 : 0, id_rango, dni, address, photo]);
    const resRango: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_RANGO_BY_ID`(?)", [id_rango]);
    const rangoNombre = resRango[0][0][0];
    const newUser: IUser = {
      id,
      name,
      lastname,
      email,
      status,
      id_rango,
      rango: rangoNombre.Rango,
      dni: dni,
      address,
      photo,
    };
    return newUser;
  }

  /*
      Description: This method get users
  */
  async getUsers(pagina?: string, filtro?: string): Promise<{ users: RowDataPacket[]; quantity: number }> {
    pagina = pagina === undefined || pagina === "" ? "-1" : pagina;
    filtro = filtro === undefined ? "-1" : filtro;
    let quantity: number = 0;
    const cantidadDatos = 20;
    const page = (parseInt(pagina) - 1) * cantidadDatos;
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_USERS`(?,?)", [cantidadDatos * parseInt(pagina), filtro]);
    quantity = data[0][1][0].Cantidad;
    if (pagina === "-1") return { users: data[0][0], quantity }; //Todo el resultado
    const users = data[0][0].splice(page, cantidadDatos); //Separado por paginas
    return { users, quantity };
  }

  async getPhotoByUserId(id: number) {
    const data: [any[]] = await ClsBDConexion.conn.query("SELECT Dato_Alfanum as 'photo' FROM Dato WHERE Campo_Id = 7 AND Persona_Id = ?", [id]);
    return data[0][0].photo;
  }
}
export default new ClsUsuario();