import { NextFunction, Router, Request, Response } from "express";
import ClsExpR from "../class/ClsExpR";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createProcedure, deleteProcedure, editProcedure, getProcedures, getProcedureById } from "../controllers/procedure.controller";
import ClsProcedure from "../class/ClsProcedure";
import ClsProceso from "../class/ClsProceso";
const router = Router();

const validateData = (req: Request, res: Response, next: NextFunction) => {
  const { title, code, process_id } = req.body;
  if (!title) return res.json({ error: "Falta el campo 'title'" }).status(400);
  if (!process_id) return res.json({ error: "Falta el campo 'process_id'" }).status(400);
  if (!code) return res.json({ error: "Falta el campo 'code'" }).status(400);

  const validationTitle = ClsExpR.validarRequired(title);
  const validationCode = ClsExpR.validarRequired(code);
  const validationProcessId = ClsExpR.validarDigitos(process_id);

  if (!validationTitle.validation) return res.json({ error: `${validationTitle.message} (title)` }).status(400);
  if (!validationCode.validation) return res.json({ error: `${validationCode.message} (code)` }).status(400);
  if (!validationProcessId.validation) return res.json({ error: `El id del proceso es inválido (process_id)` }).status(400);

  next();
};

const isStoredProcedure = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
  const idProcedure = parseInt(id);

  const procedure = await ClsProcedure.getProcedureById(idProcedure);
  if (!procedure) return res.json({ error: "No existe un procedimiento con esa id" }).status(400);
  next();
};

const isStoredProcess = async (req: Request, res: Response, next: NextFunction) => {
  const { process_id } = req.body;

  const validationId = ClsExpR.validarDigitos(process_id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
  const idProcess = parseInt(process_id);

  const process = await ClsProceso.getProccessById(idProcess);
  if (!process) return res.json({ error: "No existe un proceso con esa id" }).status(400);
  next();
};

router.get("/:id", JWTAuth, checkRoles("Administrador"), getProcedures);
router.get("/single/:id", JWTAuth, checkRoles("Administrador"), getProcedureById);
router.post("/", JWTAuth, checkRoles("Administrador"), validateData, isStoredProcess, createProcedure);
router.put("/:id", JWTAuth, checkRoles("Administrador"), validateData, isStoredProcess, isStoredProcedure, editProcedure);
router.delete("/:id", JWTAuth, checkRoles("Administrador"), isStoredProcedure, deleteProcedure);

export default router;
