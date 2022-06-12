import { Request, Response } from "express";
import ClsChat from "../class/ClsChat";

export const getContacts = async (req: Request, res: Response) => {
  try {
    // Getting users in database
    const users = await ClsChat.getContacts();
    return res.json({ users, success: "Datos obtenidos" }).status(200);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};
