import { Request, Response } from "express";
import ClsRango from "../class/ClsRango";

export const getRol = async (req: Request, res: Response) => {
  try {
    const rangos = await ClsRango.getRol();
    return res.json({ success: "Datos obtenidos", rols: rangos });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const getRolById = async (req: Request, res: Response) => {
  try {
    const { rol } = req.body;
    return res.json({ success: "Rol encontrado", rol });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const createRol = async (req: Request, res: Response) => {
  try {
    const { name, code, tag } = req.body;
    const rol = await ClsRango.createRol(name, code, tag.id, tag.name);
    return res.json({ success: "Rol creado", rol });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const updateRol = async (req: Request, res: Response) => {
  try {
    const { name, code, tag, rol } = req.body;
    const newRol = await ClsRango.updateRol(rol.id, name, code, tag.id, tag.name);
    return res.json({ success: "Rol actualizado", rol: newRol });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
