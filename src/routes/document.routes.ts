import { NextFunction, Router, Request, Response } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createDocument, deleteDocument, editDocument, getDocumentById, getDocuments } from "../controllers/document.controller";
import ClsExpR from "../class/ClsExpR";
import ClsProcedure from "../class/ClsProcedure";
import ClsDocument from "../class/ClsDocument";
import { archivos } from "../lib/multer";
import { deleteFile } from "../lib/helpers";
import ClsUser from "../class/ClsUser";
const router = Router();

const validateDataCreate = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsDocument.validateData(req, "Create");
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);
  next();
};

const validateDataEdit = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsDocument.validateData(req, "Edit");
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);
  next();
};

const isStoredDocument = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) return res.json({ error: "No ha enviado una id" }).status(400);

  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);
  const idDocument = parseInt(id);

  const document = await ClsDocument.getDocumentById(idDocument);
  if (!document) {
    await deleteFile("../public/docs", `${req.file?.filename}`);
    return res.json({ error: "No existe un documento con esa id" }).status(400);
  }
  req.body.document = document;
  next();
};

const isStoredProcedure = async (req: Request, res: Response, next: NextFunction) => {
  const { procedure_id } = req.body;

  const validationId = ClsExpR.validarDigitos(procedure_id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);
  const idProcedure = parseInt(procedure_id);

  const procedure = await ClsProcedure.getProcedureById(idProcedure);
  if (!procedure) {
    await deleteFile("../public/docs", `${req.file?.filename}`);
    return res.json({ error: "No existe un procedimiento con esa id" }).status(400);
  }
  req.body.procedure = procedure;
  next();
};

const isStoredUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { permisos } = req.body;
  const users = await ClsUser.getUsersByArrayId(permisos);
  req.body.users = users;
  next();
};

// Photo middleware
const multerFile = (req: Request, res: Response, next: NextFunction) => {
  archivos.single("file")(req, res, (err) => {
    if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
    next();
  });
};

router.get("/:id", JWTAuth, checkRoles("Administrador", "Gestor"), getDocuments);
router.get("/single/:id", JWTAuth, checkRoles("Administrador"), getDocumentById);
router.post("/", JWTAuth, checkRoles("Administrador"), multerFile, validateDataCreate, isStoredProcedure, isStoredUsers, createDocument);
router.put("/:id", JWTAuth, checkRoles("Administrador"), multerFile, validateDataEdit, isStoredDocument, isStoredProcedure, isStoredUsers, editDocument);
router.delete("/:id", JWTAuth, checkRoles("Administrador"), isStoredDocument, deleteDocument);

export default router;
