//Interfaces
import IEstudiante from "../interface/IEstudiante";
import IPersona from "../interface/IPersona";
import IUsuario from "../interface/IUsuario";

//Database
import { FieldPacket, RowDataPacket } from "mysql2";
import { connect } from "../database";

class ClsEstudiante {
    private foto: string
    private documento: string = "";
    private name: string = "";
    private lastname: string = "";
    private profesion: string = "";
    private telefono: string = "";
    private rango: number;
    constructor() {
        this.foto = "/FotoEstudiantes/defaultProfile.PNG";
        this.rango = 7;
    }
    asignarValores(documento: string, profesion: string, telefono: string, name: string, lastname: string) {
        this.documento = documento;
        this.profesion = profesion;
        this.telefono = telefono;
        this.name = name;
        this.lastname = lastname;
    }
    async guardarDatos(persona: IPersona): Promise<IEstudiante> {
        const conn = await connect();
        const sql = `CALL SP_CREATE_STUDENT(?,?,?,?,?,?,?,?);`;
        await conn.query(sql, [this.documento, this.profesion, this.telefono, this.foto, this.rango, this.name, this.lastname, persona.Persona_Id]);
        const estudiante: IEstudiante = {
            Persona: persona,
            documento: this.documento,
            profesion: this.profesion,
            telefono: this.telefono,
            rango: this.rango,
            foto: this.foto,
            nombre: this.name,
            apellido: this.lastname
        }
        await conn.end();
        return estudiante;
    }
    async getEstudiante(id: string): Promise<IUsuario> {
        const conn = await connect();
        const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_STUDENT`(?)", [id]);
        const usuario = data[0][0][0];
        const newUsuario: IUsuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            profesion: usuario.profesion,
            correo: usuario.correo,
            documento: usuario.documento,
            estado: usuario.estado === 1,
            foto: usuario.foto,
            rango: usuario.rango,
            telefono: usuario.telefono,

            foto_pais_nacimiento: usuario.foto_pais_nacimiento,
            id_pais_nacimiento: usuario.id_pais_nacimiento,
            nombre_pais_nacimiento: usuario.nombre_pais_nacimiento,

            foto_pais_residencia: usuario.foto_pais_residencia,
            id_pais_residencia: usuario.id_pais_residencia,
            nombre_pais_residencia: usuario.nombre_pais_residencia,
        }
        await conn.end();
        return newUsuario;
    }

    async editarEstudiante(id: number, correo: string, id_pais_residencia: number, id_pais_nacimiento: number) {
        const conn = await connect();
        await conn.query("CALL `SP_UPDATE_STUDENT`(?,?,?,?,?,?,?,?,?)", [this.name, this.lastname, correo, id_pais_residencia, id_pais_nacimiento, this.documento, this.profesion, this.telefono, id]);
        await conn.end();
    }

    async getEstudiantes(pagina?: string, filtro?: string) {
        const conn = await connect();
        pagina = (pagina === undefined || pagina === "" ? "-1" : pagina);
        filtro = (filtro === undefined ? "-1" : filtro);
        let cantidad: number = 0;
        const cantidadDatos = 12;
        const page = (parseInt(pagina) - 1) * cantidadDatos;
        const data: [RowDataPacket[][], FieldPacket[]] = await conn.query("CALL `SP_GET_STUDENTS`(?,?)", [cantidadDatos * parseInt(pagina), filtro]);
        await conn.end();
        cantidad = data[0][1][0].Cantidad;
        if (pagina === "-1") return { estudiantes: data[0][0], cantidad };//Todo el resultado
        const estudiantes = data[0][0].splice(page, cantidadDatos);//Separado por paginas
        return { estudiantes, cantidad };
    }
}
export default new ClsEstudiante();