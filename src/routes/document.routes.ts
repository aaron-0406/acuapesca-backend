import { NextFunction, Router, Request, Response } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createDocument, deleteDocument, editDocument, getDocumentById, getDocuments } from "../controllers/document.controller";
import ClsExpR from "../class/ClsExpR";
import ClsProcedure from "../class/ClsProcedure";
import ClsDocument from "../class/ClsDocument";
const router = Router();

const validateData = (req: Request, res: Response, next: NextFunction) => {
  const { code, version, effective_date, approval_date, title, name, nro_pages, procedure_id } = req.body;
  if (!title) return res.json({ error: "Falta el campo 'title'" }).status(400);
  if (!version) return res.json({ error: "Falta el campo 'version'" }).status(400);
  if (!code) return res.json({ error: "Falta el campo 'code'" }).status(400);
  if (!effective_date) return res.json({ error: "Falta el campo 'effective_date'" }).status(400);
  if (!approval_date) return res.json({ error: "Falta el campo 'approval_date'" }).status(400);
  if (!name) return res.json({ error: "Falta el campo 'name'" }).status(400);
  if (!nro_pages) return res.json({ error: "Falta el campo 'nro_pages'" }).status(400);
  if (!procedure_id) return res.json({ error: "Falta el campo 'procedure_id'" }).status(400);

  const validationTitle = ClsExpR.validarRequired(title);
  const validationVersion = ClsExpR.validarDigitos(version);
  const validationCode = ClsExpR.validarRequired(code);
  const validationEffectiveDate = ClsExpR.validarRequired(effective_date);
  const validationApprovalDate = ClsExpR.validarRequired(approval_date);
  const validationName = ClsExpR.validarRequired(name);
  const validationNroPages = ClsExpR.validarDigitos(nro_pages);
  const validationProcedureId = ClsExpR.validarDigitos(procedure_id);

  if (!validationTitle.validation) return res.json({ error: `${validationTitle.message} (title)` }).status(400);
  if (!validationVersion.validation) return res.json({ error: `${validationTitle.message} (version)` }).status(400);
  if (!validationCode.validation) return res.json({ error: `${validationTitle.message} (code)` }).status(400);
  if (!validationEffectiveDate.validation) return res.json({ error: `${validationTitle.message} (effective_date)` }).status(400);
  if (!validationApprovalDate.validation) return res.json({ error: `${validationTitle.message} (approval_date)` }).status(400);
  if (!validationName.validation) return res.json({ error: `${validationTitle.message} (name)` }).status(400);
  if (!validationNroPages.validation) return res.json({ error: `${validationTitle.message} (nro_pages)` }).status(400);
  if (!validationProcedureId.validation) return res.json({ error: `El id del proceso es inválido (process_id)` }).status(400);

  next();
};
const isStoredDocument = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
  const idDocument = parseInt(id);

  const document = await ClsDocument.getDocumentById(idDocument);
  if (!document) return res.json({ error: "No existe un documento con esa id" }).status(400);
  next();
};
const isStoredProcedure = async (req: Request, res: Response, next: NextFunction) => {
  const { procedure_id } = req.body;

  const validationId = ClsExpR.validarDigitos(procedure_id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
  const idProcedure = parseInt(procedure_id);

  const procedure = await ClsProcedure.getProcedureById(idProcedure);
  if (!procedure) return res.json({ error: "No existe un procedimiento con esa id" }).status(400);
  next();
};

router.get("/:id", JWTAuth, checkRoles("Administrador"), getDocuments);
router.get("/single/:id", JWTAuth, checkRoles("Administrador"), getDocumentById);
router.post("/", JWTAuth, checkRoles("Administrador"), validateData, isStoredProcedure, createDocument);
router.put("/:id", JWTAuth, checkRoles("Administrador"), validateData, isStoredDocument, isStoredProcedure, editDocument);
router.delete("/:id", JWTAuth, checkRoles("Administrador"), isStoredDocument, deleteDocument);

export default router;
