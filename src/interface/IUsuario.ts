export default interface IUsuario {
	id: number;
	nombre: string;
	apellido: string;
	profesion: string;
	correo: string;
	documento: string;
	estado: boolean;
	foto:string;
	rango:string;
	telefono:string;

	foto_pais_nacimiento: string;
	id_pais_nacimiento: number;
	nombre_pais_nacimiento: string;

	foto_pais_residencia: string;
	nombre_pais_residencia: string;
	id_pais_residencia: number;
}

