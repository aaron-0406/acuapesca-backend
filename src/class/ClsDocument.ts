import { FieldPacket, RowDataPacket } from "mysql2";
import ClsBDConexion from "./ClsBDConexion";
import IDocument from "../interface/IDocument";

class ClsDocument {
  async getDocuments(idProcedure: number): Promise<any[]> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_DOCUMENTS`(?)", [idProcedure]);
    return data[0][0];
  }
  async getDocumentById(id: number): Promise<IDocument | undefined> {
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_DOCUMENT_BY_ID`(?)", [id]);
    const document = data[0][0][0];

    if (!document) return undefined;

    const newDocument: IDocument = {
      id: document.id,
      code: document.code,
      version: document.version,
      effective_date: document.effective_date,
      approval_date: document.approval_date,
      title: document.title,
      name: document.name,
      nro_pages: document.nro_pages,
      procedure_id: document.procedure_id,
      file: document.file,
    };
    return newDocument;
  }
  async createDocument(): Promise<IDocument> {
    const newDocument: IDocument = {
      approval_date: "",
      code: "",
      effective_date: "",
      name: "",
      nro_pages: 0,
      procedure_id: 1,
      title: "",
      file: "",
      version: 1,
      id: 1,
    };
    return newDocument;
  }
  async editDocument(id: number): Promise<IDocument> {
    const newDocument: IDocument = {
      approval_date: "",
      code: "",
      effective_date: "",
      name: "",
      nro_pages: 0,
      procedure_id: 1,
      title: "",
      file: "",
      version: 1,
      id: 1,
    };
    return newDocument;
  }
  async deleteDocument(id: number): Promise<any> {}
}

export default new ClsDocument();
