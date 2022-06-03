import { Request, Response } from "express";
import ClsExpR from "../class/ClsExpR";
import ClsProcedure from "../class/ClsProcedure";
import ClsDocument from "../class/ClsDocument";
import { deleteFile } from "../lib/helpers";

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idProcedure = parseInt(id);

    const procedure = await ClsProcedure.getProcedureById(idProcedure);

    if (!procedure) return res.json({ error: "No existe un procedimiento con esa id" }).status(400);
    const documents = await ClsDocument.getDocuments(idProcedure, `${req.user?.rango}`, parseInt(`${req.user?.id}`));
    documents.map((document) => {
      document.status = document.status === 1;
      return document;
    });
    return res.json({ success: "Datos obtenidos", documents });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idDocument = parseInt(id);

    const document = await ClsDocument.getDocumentById(idDocument, `${req.user?.rango}`, parseInt(`${req.user?.id}`));
    if (!document) return res.json({ error: "No existe un documento con esa id" }).status(400);

    return res.json({ success: "Documento Encontrado", document });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { code, version, effective_date, approval_date, title, name, nro_pages, status, procedure_id, users } = req.body;
    const document = await ClsDocument.createDocument(title, version, code, effective_date, approval_date, name, nro_pages, procedure_id, status === "true", `${req.file?.filename}`, users);
    return res.json({ success: "Documento Creado", document });
  } catch (error) {
    console.log(error);
    await deleteFile("../public/docs", `${req.file?.filename}`);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const editDocument = async (req: Request, res: Response) => {
  try {
    let { document, procedure, file, users, title, version, code, effective_date, approval_date, name, nro_pages, status } = req.body;
    if (req.file) {
      await deleteFile("../public/docs", `${document.file}`);
      file = req.file.filename;
    }
    const documentEdited = await ClsDocument.editDocument(document.id, title, version, code, effective_date, approval_date, name, nro_pages, procedure.id, status === "true", file, users);
    return res.json({ success: "Documento Editado", document: documentEdited });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const deleteDocument = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
