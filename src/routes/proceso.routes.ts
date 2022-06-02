import { NextFunction, Router, Request, Response } from "express";

// Libs
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createProcess, deleteProcess, editProcess, getProcessById, getProcess } from "../controllers/proceso.controller";

// Class
import ClsExpR from "../class/ClsExpR";
import ClsProceso from "../class/ClsProceso";

const router = Router();

const validateData = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsProceso.validateData(req);
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);
  next();
};

const isStored = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) return res.json({ error: "No ha enviado una id" }).status(400);

  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);
  const idProcess = parseInt(id);

  const process = await ClsProceso.getProccessById(idProcess);
  if (!process) return res.json({ error: "No existe un proceso con esa id" }).status(400);
  req.body.process = process;
  next();
};

router.get("/", JWTAuth, checkRoles("Administrador", "Gestor"), getProcess);
router.get("/:id", JWTAuth, checkRoles("Administrador"), isStored, getProcessById);
router.post("/", JWTAuth, checkRoles("Administrador"), validateData, createProcess);
router.put("/:id", JWTAuth, checkRoles("Administrador"), validateData, isStored, editProcess);
router.delete("/:id", JWTAuth, checkRoles("Administrador"), isStored, deleteProcess);

export default router;
