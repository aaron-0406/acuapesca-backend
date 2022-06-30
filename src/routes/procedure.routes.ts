import { NextFunction, Router, Request, Response } from "express";
import ClsExpR from "../class/ClsExpR";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createProcedure, deleteProcedure, editProcedure, getProcedures, getProcedureById } from "../controllers/procedure.controller";
import ClsProcedure from "../class/ClsProcedure";
import ClsProceso from "../class/ClsProceso";
const router = Router();

const validateData = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsProcedure.validateData(req);
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);

  next();
};

const isStoredProcedure = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) return res.json({ error: "No ha enviado una id" }).status(400);

  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
  const idProcedure = parseInt(id);

  const procedure = await ClsProcedure.getProcedureById(idProcedure,`${req.user?.rango}`);
  if (!procedure) return res.json({ error: "No existe un procedimiento con esa id" }).status(400);
  req.body.procedure = procedure;
  next();
};

const isStoredProcess = async (req: Request, res: Response, next: NextFunction) => {
  const { process_id } = req.body;

  const validationId = ClsExpR.validarDigitos(process_id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
  const idProcess = parseInt(process_id);

  const process = await ClsProceso.getProccessById(idProcess, `${req.user?.rango}`);
  if (!process) return res.json({ error: "No existe un proceso con esa id" }).status(400);
  req.body.process = process;
  next();
};

router.get("/:id", JWTAuth, getProcedures);
router.get("/single/:id", JWTAuth, checkRoles("Administrador"), isStoredProcedure, getProcedureById);
router.post("/", JWTAuth, checkRoles("Administrador"), validateData, isStoredProcess, createProcedure);
router.put("/:id", JWTAuth, checkRoles("Administrador"), validateData, isStoredProcess, isStoredProcedure, editProcedure);
// router.delete("/:id", JWTAuth, checkRoles("Administrador"), isStoredProcedure, deleteProcedure);

export default router;
