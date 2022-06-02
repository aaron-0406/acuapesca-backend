import { Request, Response } from "express";

// Classes
import ClsProceso from "../class/ClsProceso";
import ClsExpR from "../class/ClsExpR";
import ClsProcedure from "../class/ClsProcedure";

// Get Procedures Controller
export const getProcedures = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.json({ error: "No existe un proceso con esa id" }).status(400);

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);
    const idProcess = parseInt(id);

    const process = await ClsProceso.getProccessById(idProcess);

    if (!process) return res.json({ error: "No existe un proceso con esa id" }).status(400);

    const procedures = await ClsProcedure.getProcedures(idProcess, `${req.user?.rango}`);
    procedures.map((procedure) => {
      procedure.status = procedure.status == 1;
      return procedure;
    });
    return res.json({ success: "Datos obtenidos", procedures });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Get Procedure Controller By Id
export const getProcedureById = async (req: Request, res: Response) => {
  try {
    const { procedure } = req.body;
    return res.json({ success: "Procedimiento Encontrado", procedure });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Create Procedure Controller
export const createProcedure = async (req: Request, res: Response) => {
  try {
    const { code, title, status, process } = req.body;
    const procedure = await ClsProcedure.createProcedure(title, code, process.id, status);
    return res.json({ success: "Procedimiento Creado", procedure });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Edit Procedure Controller
export const editProcedure = async (req: Request, res: Response) => {
  try {
    const { code, title, status, process, procedure } = req.body;
    const procedureEdit = await ClsProcedure.editProcedure(procedure.id, title, code, process.id, status);
    return res.json({ success: "Procedimiento Creado", procedureEdit });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

// Delete Procedure Controller
export const deleteProcedure = async (req: Request, res: Response) => {
  try {
    const { procedure } = req.body;
    await ClsProcedure.deleteProcedure(procedure.id);
    return res.json({ success: "Procedimiento elimiado" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
