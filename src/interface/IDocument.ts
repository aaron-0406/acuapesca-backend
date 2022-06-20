import IUser from "./IUser";
export default interface IDocument {
  id?: number;
  code: string;
  version: number;
  effective_date: string;
  approval_date: string;
  title: string;
  name: string;
  nro_pages: number;
  procedure_id: number;
  file: string;
  status: boolean | number;
  users: IUser[];
}
