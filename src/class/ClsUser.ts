import { Request } from "express";

//Interfaces
import IEstudiante from "../interface/IEstudiante";
import IPersona from "../interface/IPerson";
import IUser from "../interface/IUser";
import IValidation from "../interface/IValidation";

//mysql2 types
import { FieldPacket, RowDataPacket } from "mysql2";

// Clases
import ClsExpR from "./ClsExpR";
import ClsBDConexion from "./ClsBDConexion";

class ClsUsuario {
  /*
    Description: This method validate Data Structure of User
    @param req: request body
    @param mode: Create or Edit
  */
  validateUserData(req: Request, mode: "Create" | "Edit"): IValidation {
    // Request body data
    const { name, lastname, email, dni, id_rango, address, status, password } = req.body;
    if (!name) return { message: "Falta el campo 'name'", validation: false };
    if (!lastname) return { message: "Falta el campo 'lastname'", validation: false };
    if (!email) return { message: "Falta el campo 'email'", validation: false };
    if (!dni) return { message: "Falta el campo 'dni'", validation: false };
    if (!id_rango) return { message: "Falta el campo 'id_rango'", validation: false };
    if (!address) return { message: "Falta el campo 'address'", validation: false };
    if (status === undefined) return { message: "Falta el campo 'status'", validation: false };
    if (mode === "Create") {
      if (!password) return { message: "Falta el campo 'password'", validation: false };
    }

    // RegEx validation
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
    @param req: request body
  */
  validateResetPWDData(req: Request): IValidation {
    // Request body data
    const { oldPassword, newPassword, repeatPassword } = req.body;
    if (!oldPassword) return { message: "Falta el campo 'oldPassword'", validation: false };
    if (!newPassword) return { message: "Falta el campo 'newPassword'", validation: false };
    if (!repeatPassword) return { message: "Falta el campo 'repeatPassword'", validation: false };

    // RegEx validation
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
    @param status: user's status
    @param email: user's email
    @param password: user's password
    @param dni: user's dni
    @param name: user's name
    @param lastname: user's lastname
    @param address: user's address
    @param id_rango: user's id_rango
    @param photo: user's photo
  */
  async createUser(status: boolean, email: string, password: string, dni: string, name: string, lastname: string, address: string, id_rango: number): Promise<IUser> {
    const sqlCreateUser = `CALL SP_CREATE_USER(?,?,?,?,?,?,?,?,?); SELECT @id as Person_Id; `;

    const photo = `defaultPhotoProfile.png`;
    const resCreateUser: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sqlCreateUser, [status ? 1 : 0, email, password, dni, id_rango, name, lastname, address, photo]);
    const id = resCreateUser[0][1][0].Person_Id;

    const sqlGetRango = "CALL `SP_GET_RANGO_BY_ID`(?)";
    const resRango: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sqlGetRango, [id_rango]);
    const rangoNombre = resRango[0][0][0];

    // New User
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
    @param email: user's email
  */
  async getUserByEmail(email: string): Promise<IUser> {
    const sql = "CALL `SP_GET_USER_BY_EMAIL`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [email]);

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
      tag: user.tag,
      tag_id: user.tag_id,
    };
    return newUser;
  }

  /*
    Description: This method get an user by id
    @param id: id's email
  */
  async getUserById(id: number): Promise<IUser | undefined> {
    const sql = "CALL `SP_GET_USER_BY_ID`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);

    const user = data[0][0][0];

    if (!user) return undefined;

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
      tag: user.tag,
      tag_id: user.tag_id,
    };
    return newUser;
  }

  /*
    Description: This method edit a user
    @param id: id's status
    @param status: user's status
    @param email: user's email
    @param password: user's password
    @param dni: user's dni
    @param name: user's name
    @param lastname: user's lastname
    @param address: user's address
    @param id_rango: user's id_rango
    @param photo: user's photo
  */

  async getUsersByArrayId(ids: number[]) {
    if (ids.length === 0) return [];
    let usersId = "";
    ids.map((id) => {
      usersId += `${id},`;
    });
    usersId = usersId.slice(0, usersId.length - 1);
    const sql = `SELECT name,lastname,rango,photo,id_rango,id,email FROM vwusers WHERE id IN (${usersId})`;
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql);
    const users = data[0];
    return users;
  }

  async editUser(id: number, status: boolean, email: string, password: string, dni: string, name: string, lastname: string, address: string, id_rango: number, photo: string): Promise<IUser> {
    const sqlUpdateUser = "CALL `SP_UPDATE_USER`(?,?,?,?,?,?,?,?,?,?)";
    await ClsBDConexion.conn.query(sqlUpdateUser, [id, name, lastname, email, password, status ? 1 : 0, id_rango, dni, address, photo]);

    const sqlGetRango = "CALL `SP_GET_RANGO_BY_ID`(?)";
    const resRango: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sqlGetRango, [id_rango]);

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
  async editUserPhoto(id: number, photo: string): Promise<string> {
    const sqlUpdateUser = "UPDATE Dato SET Dato_Alfanum = ? WHERE Persona_Id = ? AND Campo_Id = 7";
    await ClsBDConexion.conn.query(sqlUpdateUser, [photo, id]);
    return photo;
  }

  /*
    Description: This method get users
     @param pagina : page
     @param filtro : filter
  */
  async getUsers(rango: string, pagina?: string, filtro?: string): Promise<{ users: RowDataPacket[]; quantity: number }> {
    //In case there are not these querys
    pagina = pagina === undefined || pagina === "" ? "-1" : pagina;
    filtro = filtro === undefined ? "-1" : filtro;
    let quantity: number = 0;

    const limit = 20;

    const page = (parseInt(pagina) - 1) * limit;

    const sql = "CALL `SP_GET_USERS`(?,?,?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [limit * parseInt(pagina), filtro, rango]);
    quantity = data[0][1][0].Cantidad;

    if (pagina === "-1") return { users: data[0][0], quantity }; //Todo el resultado

    const users = data[0][0].splice(page, limit); //Separado por paginas

    return { users, quantity };
  }

  /*
    Description: This method get photo's user
    @param id : user's id
  */
  async getPhotoByUserId(id: number) {
    const sql = "SELECT Dato_Alfanum as 'photo' FROM Dato WHERE Campo_Id = 7 AND Persona_Id = ?";
    const data: [any[]] = await ClsBDConexion.conn.query(sql, [id]);
    return data[0][0].photo;
  }
}
export default new ClsUsuario();
