import { Router, Request, Response, NextFunction } from "express";
import { JWTAuth } from "../lib/auth.handler";
import { createLog, getLogByUserId } from "../controllers/log.controller";
import ClsExpR from "../class/ClsExpR";
import ClsDocument from "../class/ClsDocument";
import ClsUser from "../class/ClsUser";
const router = Router();

// Verifying if there is a user stored with that id
const isDocumentStored = async (req: Request, res: Response, next: NextFunction) => {
  const { documento_id } = req.body;

  // In case they didn't send the id
  if (!documento_id) return res.json({ error: "No ha enviado el campo id" }).status(400);

  // In case is not a number
  const validationId = ClsExpR.validarDigitos(documento_id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);

  // Getting user in database
  const idDocument = parseInt(documento_id);
  const document = await ClsDocument.getDocumentByIdAdmin(idDocument);
  // If there is not a user stored
  if (!document) return res.json({ error: "No hay un document registrado con ese id" }).status(400);

  // We put the user data in request body for the next function
  req.body.document = document;
  next();
};
// Verifying if there is a user stored with that id
const isUserStored = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // In case they didn't send the id
  if (!id) return res.json({ error: "No ha enviado una id como parámetro" }).status(400);

  // In case is not a number
  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);

  // Getting user in database
  const idUser = parseInt(id);
  const user = await ClsUser.getUserById(idUser);
  // If there is not a user stored
  if (!user) return res.json({ error: "No hay un usuario registrado con ese id" }).status(400);

  // We put the user data in request body for the next function
  req.body.editUser = user;
  next();
};

router.get("/:id", JWTAuth, isUserStored, getLogByUserId);
router.post("/", JWTAuth, isDocumentStored, createLog);

export default router;
