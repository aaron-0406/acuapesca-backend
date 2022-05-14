import IPersona from "./IPersona";

export default interface IEstudiante {
    Persona: IPersona;
    foto: string;
    documento: string;
    profesion: string;
    telefono: string;
    rango: number;
    nombre: string;
    apellido: string;
}