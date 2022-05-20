import { Request, Response } from "express";
import { encryptPassword } from "../lib/helpers";
import ClsUser from "../class/ClsUser";
import fs from "fs-extra";
import path from "path";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, lastname, email, dni, id_rango, password, address, status, photo } = req.body;
    const newPassword = await encryptPassword(password);
    const user = await ClsUser.createUser(status, email, newPassword, dni, name, lastname, address, id_rango, photo);
    return res.json({ success: "Usuario creado", user }).status(201);
  } catch (error: any) {
    console.log(error);
    try {
      fs.unlink(path.join(__dirname, "../public/user_photos", req.body.photo));
    } catch (error) {}
    if (error.code === "ER_DUP_ENTRY") return res.json({ error: "El correo ya está registrado" });
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.json({ error: "No ha enviado el id como parámetro" }).status(500);

    let { name, lastname, email, dni, id_rango, password, address, status, photo } = req.body;

    let newPassword = "";
    if (password.length !== 0) newPassword = await encryptPassword(password);

    const photoUser = await ClsUser.getPhotoByUserId(parseInt(id));

    // don't modify if there is not a file, "" means 'not modify in store procedure'
    if (!req.file) photo = "";

    // If there is a file, we delete the old photo
    if (req.file) {
      photo = req.file.filename;
      try {
        if (photoUser !== "defaultPhotoProfile.png") await fs.unlink(path.join(__dirname, "../public/user_photos", photoUser));
      } catch (error) {}
    }

    // Update User
    const user = await ClsUser.editUser(parseInt(id), status, email, newPassword, dni, name, lastname, address, id_rango, photo);

    if (!req.file) user.photo = photoUser;

    return res.json({ success: "Usuario editado correctamente", user });
  } catch (error: any) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") return res.json({ error: "El correo ya está registrado" });
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { filtro, pagina } = req.query;
    const { users, quantity } = await ClsUser.getUsers(pagina?.toString(), filtro?.toString());
    return res.json({ users, success: "Datos obtenidos", quantity }).status(200);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};
export const changeStateUser = async (req: Request, res: Response) => {};
export const deleteUser = async (req: Request, res: Response) => {};
