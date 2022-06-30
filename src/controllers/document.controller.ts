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

    const procedure = await ClsProcedure.getProcedureById(idProcedure, `${req.user?.rango}`);

    if (!procedure) return res.json({ error: "No existe un procedimiento con esa id" }).status(400);
    const documents = await ClsDocument.getDocuments(idProcedure, `${req.user?.rango}`, parseInt(`${req.user?.id}`));

    return res.json({ success: "Datos obtenidos", documents });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { code, id } = req.params;

    const validationCode = ClsExpR.validarRequired(code);
    if (!validationCode.validation) return res.json({ error: `El codigo es requerido` });

    const document = await ClsDocument.getDocumentByCode(code, `${req.user?.rango}`, parseInt(`${req.user?.id}`), parseInt(`${id}`));
    if (!document) return res.json({ error: "No existe un documento con esa id" }).status(400);

    return res.json({ success: "Documento Encontrado", document });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const getOnlyDocumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationCode = ClsExpR.validarRequired(id);
    if (!validationCode.validation) return res.json({ error: `El id es requerido` });

    const document = await ClsDocument.getDocumentByIdAdmin(parseInt(id));
    if (!document) return res.json({ error: "No existe un documento con esa id" }).status(400);
    if (!document.permisos.includes(parseInt(`${req.user?.id}`))) return res.json({ error: "No tienes permisos de ver ese documento" }).status(400);
    return res.json({ success: "Documento Encontrado", document });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { code, version, effective_date, approval_date, title, nro_pages, status, procedure_id, permisos } = req.body;
    const document = await ClsDocument.createDocument(
      title,
      parseInt(version),
      code,
      effective_date,
      approval_date,
      parseInt(nro_pages),
      procedure_id,
      status === "true",
      `${req.file?.filename}`,
      permisos
    );
    return res.json({ success: "Documento Creado", document });
  } catch (error) {
    console.log(error);
    await deleteFile("../public/docs", `${req.file?.filename}`);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const editDocument = async (req: Request, res: Response) => {
  try {
    let { document, procedure, file, permisos, title, version, code, effective_date, approval_date, nro_pages, status } = req.body;
    if (req.file) {
      await deleteFile("../public/docs", `${document.file}`);
      file = req.file.filename;
    }
    const documentEdited = await ClsDocument.editDocument(document.id, title, version, code, effective_date, approval_date, nro_pages, procedure.id, status === "true", file, permisos);
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
