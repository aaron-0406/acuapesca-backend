export default interface IDocument {
  id?: number;
  process_id?: number;
  code: string;
  version: number;
  effective_date: string;
  approval_date: string;
  title: string;
  nro_pages: number;
  procedure_id: number;
  file: string;
  status: boolean | number;
  permisos: number[];
}
