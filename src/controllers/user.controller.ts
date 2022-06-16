import { Request, Response } from "express";

// Helpers
import { deleteFile, encryptPassword } from "../lib/helpers";
import { signToken } from "../lib/jwt";

// User Class
import ClsUser from "../class/ClsUser";

import { config } from "../config/config";

// Get Users Controller
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Getting page and filter
    const { filtro, pagina } = req.query;

    // Getting users in database
    const { users, quantity } = await ClsUser.getUsers(`${req.user?.rango}`, pagina?.toString(), filtro?.toString());
    users.map((user) => {
      user.status = user.status == 1;
      user.fullname = `${user.name} ${user.lastname}`;
      return user;
    });
    return res.json({ users, success: "Datos obtenidos", quantity }).status(200);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};

// Get User By Id Controller
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { editUser } = req.body;
    editUser.fullname = `${editUser.name} ${editUser.lastname}`;
    // Getting users in database
    return res.json({ user: editUser, success: "Datos obtenidos" }).status(200);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};

// Create User Controller
export const createUser = async (req: Request, res: Response) => {
  try {
    // Request body
    const { name, lastname, email, dni, id_rango, password, address, status } = req.body;

    // Encrypting password
    const newPassword = await encryptPassword(password);

    // Saving in database
    const user = await ClsUser.createUser(status, email, newPassword, dni, name, lastname, address, id_rango);   
    // Answer
    return res.json({ success: "Usuario creado", user }).status(201);
  } catch (error: any) {
    console.log(error);
    // In case there is a email stored
    if (error.code === "ER_DUP_ENTRY") return res.json({ error: "El correo ya está registrado" });
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};


// Edit User Controller
export const editUser = async (req: Request, res: Response) => {
  try {
    let { name, lastname, email, dni, id_rango, password, address, status, editUser } = req.body;
    let { id } = editUser;
    //In case the password is in request body
    let newPassword = "";
    if (password !== undefined) {
      if (password.length !== 0) newPassword = await encryptPassword(password);
    }

    // Update User
    const user = await ClsUser.editUser(id, status, email, newPassword, dni, name, lastname, address, id_rango, editUser.photo);
    console.log(user);
    return res.json({ success: "Usuario editado correctamente", user });
  } catch (error: any) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") return res.json({ error: "El correo ya está registrado" });
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};

// Edit User Photo Controller
export const editUserPhoto = async (req: Request, res: Response) => {
  try {
    let { file } = req.body;

    const id = req.user?.id;
    const idUser = parseInt(`${id}`);
    const user = await ClsUser.getUserById(idUser);
    if (!user) return res.json({ error: "No existe un usuario con esa id" });

    const photo = req.user?.photo;
    if (`${photo}` !== "defaultPhotoProfile.png") await deleteFile("../public/user_photos", `${photo}`);

    // // Update User
    const photoUser = await ClsUser.editUserPhoto(parseInt(`${id}`), file);
    user.photo = `${photoUser}`;
    const token = signToken(user, `${config.jwtSecret}`);
    return res.json({ success: "Foto modificada correctamente", photo: photoUser, token });
  } catch (error: any) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") return res.json({ error: "El correo ya está registrado" });
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};

export const editUserStatus = async (req: Request, res: Response) => {
  try {
    const { editUser, status } = req.body;
    if (status === undefined) return res.json({ error: "No ha enviado el campo 'status'" });
    await ClsUser.changeStatus(editUser.id, status);
    return res.json({ success: `Usuario ${status ? "Habilitado" : "Inhabilitado"}` });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
