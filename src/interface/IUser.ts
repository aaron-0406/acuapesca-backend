export default interface IUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  dni: string;
  rango: string;
  id_rango: number;
  address: string;
  tag?: string;
  tag_id?: number;
  status: boolean;
  photo: string;
}
