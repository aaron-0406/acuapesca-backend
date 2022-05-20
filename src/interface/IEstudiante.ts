import IPerson from "./IPerson";

export default interface IEstudiante {
    Persona: IPerson;
    foto: string;
    documento: string;
    profesion: string;
    telefono: string;
    rango: number;
    nombre: string;
    apellido: string;
}