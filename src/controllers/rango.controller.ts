import { Request, Response } from "express";
import ClsRango from "../class/ClsRango";

export const getRangos = async (req: Request, res: Response) => {
  try {
    const rangos = await ClsRango.getRangos();
    return res.json({ success: "Datos obtenidos", rols:rangos });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
