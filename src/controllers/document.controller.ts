import { Request, Response } from "express";
import ClsExpR from "../class/ClsExpR";
import ClsProcedure from "../class/ClsProcedure";
import ClsDocument from "../class/ClsDocument";

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationId = ClsExpR.validarDigitos(id);
    if (!validationId.validation) return res.json({ error: `La id enviada no es válida` });
    const idProcedure = parseInt(id);

    const procedure = await ClsProcedure.getProcedureById(idProcedure);

    if (!procedure) return res.json({ error: "No existe un procedimiento con esa id" }).status(400);
    const documents = await ClsDocument.getDocuments(idProcedure);
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

    const document = await ClsDocument.getDocumentById(idDocument);
    if (!document) return res.json({ error: "No existe un documento con esa id" }).status(400);

    return res.json({ success: "Documento Encontrado", document });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const editDocument = async (req: Request, res: Response) => {
  try {
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
