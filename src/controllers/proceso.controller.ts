import { Request, Response } from "express";
import ClsExpR from "../class/ClsExpR";
import ClsProceso from "../class/ClsProceso";

export const getProcess = async (req: Request, res: Response) => {
  try {
    const procesos = await ClsProceso.getProcess();
    console.log(procesos);
    return res.json({ success: "Datos obtenidos", procesos });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const getProcessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idProcess = parseInt(id);
    const process = await ClsProceso.getProccessById(idProcess);
    if (!process) return res.json({ error: "No existe un proceso con esa id" }).status(400);
    return res.json({ success: "Proceso encontrado", process });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const createProcess = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;
    const proceso = await ClsProceso.createProcess(name, code);
    return res.json({ success: "Proceso creado", proceso });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const editProcess = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const deleteProcess = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
