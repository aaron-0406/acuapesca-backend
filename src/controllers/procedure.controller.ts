import { Request, Response } from "express";
import ClsExpR from "../class/ClsExpR";
import ClsProcedure from "../class/ClsProcedure";

export const createProcedure = async (req: Request, res: Response) => {
  try {
    const { process_id, code, title } = req.body;
    const procedure = await ClsProcedure.createProcedure(title, code, parseInt(process_id));
    return res.json({ success: "Procedimiento Creado", procedure });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const getProcedures = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idProcess = parseInt(id);

    const procedures = await ClsProcedure.getProcedures(idProcess);
    return res.json({ success: "Datos obtenidos", procedures });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const getProcedureById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idProcedure = parseInt(id);

    const procedure = await ClsProcedure.getProcedureById(idProcedure);
    if (!procedure) return res.json({ error: "No existe un proceso con esa id" }).status(400);

    return res.json({ success: "Procedimiento Encontrado", procedure });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const editProcedure = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { process_id, code, title } = req.body;

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idProcedure = parseInt(id);

    const procedure = await ClsProcedure.editProcedure(idProcedure, title, code, parseInt(process_id));
    return res.json({ success: "Procedimiento Creado", procedure });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const deleteProcedure = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idProcedure = parseInt(id);

    await ClsProcedure.deleteProcedure(idProcedure);
    return res.json({ success: "Procedimiento elimiado" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
