import { Request, Response } from "express";
import ClsLog from "../class/ClsLog";

export const getLogByUserId = async (req: Request, res: Response) => {
  try {
    const { editUser } = req.body;
    const log = await ClsLog.getLogByUserId(editUser.id);
    return res.json({ success: "Datos obtenidos", log });
  } catch (error: any) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};
export const createLog = async (req: Request, res: Response) => {
  // Create User Controller
  try {
    // Request body
    const { document } = req.body;
    await ClsLog.registerLog(document.id, parseInt(`${req.user?.id}`), document.title);
    // Answer
    return res.json({ success: "Acción registrada" }).status(201);
  } catch (error: any) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};
