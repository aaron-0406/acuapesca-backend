import { Request, Response } from "express";
import IProceso from "src/interface/IProceso";
import ClsProceso from "../class/ClsProceso";

// Get Process Controller
export const getProcess = async (req: Request, res: Response) => {
  try {
    const procesos = await ClsProceso.getProcess(`${req.user?.rango}`);

    procesos.map((proceso) => {
      proceso.status = proceso.status == 1;
      return proceso;
    });

    return res.json({ success: "Datos obtenidos", procesos });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Get Process By Id Controller
export const getProcessById = async (req: Request, res: Response) => {
  try {
    const { process } = req.body;
    return res.json({ success: "Proceso encontrado", process });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Create Process Controller
export const createProcess = async (req: Request, res: Response) => {
  try {
    const { process } = req.body;
    const newProcess = await ClsProceso.createProcess(process);
    return res.json({ success: "Proceso creado", process: newProcess });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Edit Process Controller
export const editProcess = async (req: Request, res: Response) => {
  try {
    const { name, code, status, process } = req.body;
    const proceso = await ClsProceso.editProcess(process.id, name, code, status);
    return res.json({ success: "Proceso editado", proceso });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Change Status Process Controller
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { process, status } = req.body;
    if (status === undefined) return res.json({ error: "No ha enviado el campo 'status'" });
    await ClsProceso.changeStatus(process.id, status);
    return res.json({ success: `Proceso ${status ? "Habilitado" : "Inhabilitado"}` });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
