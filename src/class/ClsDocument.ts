import { FieldPacket, RowDataPacket } from "mysql2";
import ClsBDConexion from "./ClsBDConexion";
import { Request } from "express";
import IDocument from "../interface/IDocument";
import IValidation from "../interface/IValidation";
import IUser from "../interface/IUser";
import ClsExpR from "./ClsExpR";

interface IDoc {
  code: string;
  docs: IDocument[];
}

class ClsDocument {
  validateData(req: Request, mode: "Create" | "Edit"): IValidation {
    const { code, version, effective_date, approval_date, title, name, nro_pages, permisos, status, procedure_id } = req.body;
    if (!title) return { message: "Falta el campo 'title'", validation: false };
    if (!version) return { message: "Falta el campo 'version'", validation: false };
    if (!code) return { message: "Falta el campo 'code'", validation: false };
    if (!effective_date) return { message: "Falta el campo 'effective_date'", validation: false };
    if (!approval_date) return { message: "Falta el campo 'approval_date'", validation: false };
    if (!nro_pages) return { message: "Falta el campo 'nro_pages'", validation: false };
    if (!permisos) return { message: "Falta el campo 'permisos'", validation: false };
    if (!procedure_id) return { message: "Falta el campo 'procedure_id'", validation: false };
    if (status === undefined) return { message: "Falta el campo 'status'", validation: false };
    if (mode === "Create") {
      if (!req.file) return { message: "Falta el campo 'file'", validation: false };
    } else {
      if (!req.body.file) return { message: "Falta el campo 'file'", validation: false };
    }
    const validationTitle = ClsExpR.validarRequired(title);
    const validationVersion = ClsExpR.validarDigitos(version);
    const validationCode = ClsExpR.validarRequired(code);
    const validationEffectiveDate = ClsExpR.validarRequired(effective_date);
    const validationApprovalDate = ClsExpR.validarRequired(approval_date);
    const validationNroPages = ClsExpR.validarDigitos(nro_pages);
    const validationProcedureId = ClsExpR.validarDigitos(procedure_id);

    if (!validationTitle.validation) return { message: `${validationTitle.message} (title)`, validation: false };
    if (!validationVersion.validation) return { message: `${validationTitle.message} (version)`, validation: false };
    if (!validationCode.validation) return { message: `${validationTitle.message} (code)`, validation: false };
    if (!validationEffectiveDate.validation) return { message: `${validationTitle.message} (effective_date)`, validation: false };
    if (!validationApprovalDate.validation) return { message: `${validationTitle.message} (approval_date)`, validation: false };
    if (!validationNroPages.validation) return { message: `${validationTitle.message} (nro_pages)`, validation: false };
    if (!validationProcedureId.validation) return { message: `El id del proceso es inválido (process_id)`, validation: false };
    req.body.permisos = JSON.parse(req.body.permisos);
    return { message: "Ok", validation: true };
  }

  async getDocuments(idProcedure: number, rango: string, idUser: number): Promise<IDoc[]> {
    const sql = "CALL `SP_GET_DOCUMENTS`(?,?,?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [idProcedure, rango, idUser]);
    const documentos: IDocument[] = data[0][0] as IDocument[];

    documentos.map((document) => {
      document.status = document.status === 1;
      return document;
    });

    const codes: IDoc[] = [];

    // Creatings codes object
    for (let i = 0; i < documentos.length; i++) {
      const even = (codes: IDoc) => codes.code === documentos[i].code;
      if (!codes.some(even)) codes.push({ code: documentos[i].code, docs: documentos.filter((document) => document.code === documentos[i].code) });
    }

    // if (rango === "Administrador") return codes;

    for (let i = 0; i < codes.length; i++) codes[i].docs = [codes[i].docs[codes[i].docs.length - 1]];

    return codes;
  }

  async getDocumentByCode(code: string, rango: string, idUser: number): Promise<any | undefined> {
    const sql = "CALL `SP_GET_DOCUMENT_BY_CODE`(?,?,?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [code, rango, idUser]);
    const document: any[] = data[0][0] as any[];
    const users: any[] = data[0][1] as any[];
    if (!document) return undefined;

    for (let i = 0; i < document.length; i++) {
      const element = document[i];
      element.permisos = users.filter((item) => item.documento_id === element.id);
      const newIds: number[] = [];
      for (let j = 0; j < element.permisos.length; j++) newIds.push(element.permisos[j].id);
      element.permisos = newIds;
    }
    return document;
  }
  async getDocumentByIdAdmin(id: number): Promise<IDocument | undefined> {
    const sql = "CALL SP_GET_DOCUMENT_BY_ID_ADMIN(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);
    const document = data[0][0][0];
    if (!document) return undefined;

    const newDocument: IDocument = {
      id: document.id,
      code: document.code,
      version: document.version,
      effective_date: document.effective_date,
      approval_date: document.approval_date,
      title: document.title,
      nro_pages: document.nro_pages,
      procedure_id: document.procedure_id,
      file: document.file,
      status: document.status == 1,
      permisos: [],
    };
    return newDocument;
  }

  async createDocument(
    title: string,
    version: number,
    code: string,
    effective_date: string,
    approval_date: string,
    nro_pages: number,
    procedure_id: number,
    status: boolean,
    file: string,
    permisos: number[]
  ): Promise<IDocument> {
    const sqlCount = `SELECT COUNT(*) AS 'cantidad' FROM Documento WHERE Documento_Codigo = '${code}'`;
    const dataCount = await ClsBDConexion.conn.query(sqlCount);
    const cantidadDocs = dataCount[0][0].cantidad;
    if (cantidadDocs > 1) {
      const sqlMin = `SELECT MIN(Documento_Id) AS 'id' FROM Documento WHERE Documento_Codigo = '${code}'`;
      const dataMin = await ClsBDConexion.conn.query(sqlMin);
      const idDelete = dataMin[0][0].id;
      console.log(idDelete);
      const sqlDelete = `DELETE FROM Documento WHERE Documento_Id = '${idDelete}'`;
      await ClsBDConexion.conn.query(sqlDelete);
    }
    // Store the document
    const sql = "CALL `SP_INSERT_DOCUMENT`(?,?,?,?,?,?,?,?,?); SELECT @id AS 'document_id'";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [title, version, code, effective_date, approval_date, nro_pages, procedure_id, status ? 1 : 0, file]);

    const newDocument: IDocument = {
      approval_date,
      code,
      effective_date,
      nro_pages,
      procedure_id,
      title,
      file,
      version,
      status,
      id: data[0][1][0].document_id,
      permisos: [],
    };

    // Store the permissions
    if (permisos.length !== 0) {
      let sqlPermisos = `INSERT INTO Permiso (Usuario_Id,Documento_Id) VALUES `;

      let values = "";

      permisos.map((userId) => (values += `(${userId},${newDocument.id}),`));
      values = values.slice(0, values.length - 1);
      sqlPermisos += values;
      await ClsBDConexion.conn.query(sqlPermisos);
      newDocument.permisos = permisos;
    }
    return newDocument;
  }
  async editDocument(
    id: number,
    title: string,
    version: number,
    code: string,
    effective_date: string,
    approval_date: string,
    nro_pages: number,
    procedure_id: number,
    status: boolean,
    file: string,
    permisos: number[]
  ): Promise<IDocument> {
    const sqlUpdateDocument = "CALL `SP_UPDATE_DOCUMENT`(?,?,?,?,?,?,?,?,?,?);";
    await ClsBDConexion.conn.query(sqlUpdateDocument, [id, title, version, code, effective_date, approval_date, nro_pages, procedure_id, status ? 1 : 0, file]);
    const newDocument: IDocument = {
      approval_date,
      code,
      effective_date,
      nro_pages,
      procedure_id,
      title,
      file,
      version,
      status,
      id,
      permisos,
    };

    if (permisos.length !== 0) {
      let sqlPermisos = `INSERT INTO Permiso (Usuario_Id,Documento_Id) VALUES `;

      let values = "";

      permisos.map((permiso) => (values += `(${permiso},${newDocument.id}),`));
      values = values.slice(0, values.length - 1);
      sqlPermisos += values;
      await ClsBDConexion.conn.query(sqlPermisos);
      newDocument.permisos = permisos;
    }

    return newDocument;
  }
  async deleteDocument(id: number): Promise<any> {}
}

export default new ClsDocument();
