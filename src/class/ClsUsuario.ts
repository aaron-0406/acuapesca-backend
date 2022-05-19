//Interfaces
import IEstudiante from "../interface/IEstudiante";
import IPersona from "../interface/IPersona";
import IUsuario from "../interface/IUsuario";

//Database
import { FieldPacket, RowDataPacket } from "mysql2";
import { connect } from "../database";

class ClsUsuario {
  // private foto: string;
  private dni: string = "";
  private name: string = "";
  private lastname: string = "";
  private rango: string;
  private address: string = "";
  private id_rango: number;
  constructor() {
    // this.foto = "/FotoEstudiantes/defaultProfile.PNG";
    this.rango = "";
    this.id_rango = 7;
  }
  asignarValores(dni: string, address: string, nombre: string, lastname: string, id_rango: number) {
    this.dni = dni;
    this.lastname = lastname;
    this.name = nombre;
    this.address = address;
    this.id_rango = id_rango;
  }
  async guardarDatos(persona: IPersona): Promise<IUsuario> {
    const conn = await connect();
    const sql = `CALL SP_CREATE_USUARIO(?,?,?,?,?,?);`;
    await conn.query(sql, [this.dni, this.id_rango, this.name, this.lastname, this.address, persona.Persona_Id]);
    const estudiante: IUsuario = {
      id: persona.Persona_Id,
      email: persona.Persona_Correo,
      status: persona.Persona_Estado,
      address: this.address,
      dni: this.dni,
      id_rango: this.id_rango,
      rango: this.rango,
      // foto: this.foto,
      name: this.name,
      lastname: this.lastname,
    };
    await conn.end();
    return estudiante;
  }
  async getUser(correo: string): Promise<IUsuario> {
    const conn = await connect();
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_USER`(?)", [correo]);
    const usuario = data[0][0][0];
    const newUsuario: IUsuario = {
      id: usuario.id,
      name: usuario.name,
      lastname: usuario.lastname,
      email: usuario.email,
      status: usuario.status === 1,
      id_rango: usuario.id_rango,
      rango: usuario.rango,
      dni: usuario.dni,
      address: usuario.address,
    };
    await conn.end();
    return newUsuario;
  }

  async editarEstudiante(id: number, correo: string) {
    const conn = await connect();
    await conn.query("CALL `SP_UPDATE_STUDENT`(?,?,?,?,?,?,?,?,?)", [this.name, this.lastname, correo, this.dni, id]);
    await conn.end();
  }

  async getEstudiantes(pagina?: string, filtro?: string) {
    const conn = await connect();
    pagina = pagina === undefined || pagina === "" ? "-1" : pagina;
    filtro = filtro === undefined ? "-1" : filtro;
    let cantidad: number = 0;
    const cantidadDatos = 12;
    const page = (parseInt(pagina) - 1) * cantidadDatos;
    const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_STUDENTS`(?,?)", [cantidadDatos * parseInt(pagina), filtro]);
    await conn.end();
    cantidad = data[0][1][0].Cantidad;
    if (pagina === "-1") return { estudiantes: data[0][0], cantidad }; //Todo el resultado
    const estudiantes = data[0][0].splice(page, cantidadDatos); //Separado por paginas
    return { estudiantes, cantidad };
  }
}
export default new ClsUsuario();
