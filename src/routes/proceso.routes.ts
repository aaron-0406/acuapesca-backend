import { NextFunction, Router, Request, Response } from "express";

import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createProcess, deleteProcess, editProcess, getProcessById, getProcess } from "../controllers/proceso.controller";

import ClsExpR from "../class/ClsExpR";
import ClsProceso from "../class/ClsProceso";

const router = Router();

const validateData = (req: Request, res: Response, next: NextFunction) => {
  const { name, code } = req.body;
  if (!name) return res.json({ error: "Falta el campo 'name'" }).status(400);
  if (!code) return res.json({ error: "Falta el campo 'code'" }).status(400);

  const validationName = ClsExpR.validarRequired(name);
  const validationCode = ClsExpR.validarRequired(code);

  if (!validationName.validation) return res.json({ error: `${validationName.message} (name)` }).status(400);
  if (!validationCode.validation) return res.json({ error: `${validationCode.message} (code)` }).status(400);

  next();
};

const isStored = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
  const idProcess = parseInt(id);
  const process = await ClsProceso.getProccessById(idProcess);
  if (!process) return res.json({ error: "No existe un proceso con esa id" }).status(400);
  next();
};

router.get("/", JWTAuth, checkRoles("Administrador"), getProcess);
router.get("/:id", JWTAuth, checkRoles("Administrador"), getProcessById);
router.post("/", JWTAuth, checkRoles("Administrador"), validateData, createProcess);
router.put("/:id", JWTAuth, checkRoles("Administrador"), validateData, isStored, editProcess);
router.delete("/:id", JWTAuth, checkRoles("Administrador"), isStored, deleteProcess);

export default router;
