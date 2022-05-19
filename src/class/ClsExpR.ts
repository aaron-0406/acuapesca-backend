//Interfaces
import IValidacion from "../interface/IValidacion";

class ClsExpR {
  private nombre: RegExp = /^[a-zA-ZÀ-ÿ.\s]{1,50}$/; // Letras y espacios, pueden llevar acentos.
  private password: RegExp = /^.{4,12}$/; // 4 a 12 digitos.
  private correo: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; // name@example.com
  private telefono: RegExp = /^[0-9-+\s]{9,14}$/; // 9 a 14 numeros.
  private rut: RegExp = /^[0-9-]{8,10}$/;
  private precio: RegExp = /^[0-9.]+$/;
  private digitos: RegExp = /^[0-9]+$/;
  private url: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;
  constructor() {}
  validarNombre = (valor: string): IValidacion => {
    if (this.nombre.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "El nombre solo debe tener letras y espacios", validacion: false };
  };
  validarRut = (valor: string): IValidacion => {
    if (this.rut.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "El DNI o RUC debe ser entre 8 y 10 digitos", validacion: false };
  };
  validarPassword = (valor: string): IValidacion => {
    if (this.password.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "La contraseña debe ser mayor o igual a 4 caracteres", validacion: false };
  };
  validarCorreo = (valor: string): IValidacion => {
    if (this.correo.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "No coincide al formato de correo, ejemplo: name@example.com", validacion: false };
  };
  validarTelefono = (valor: string): IValidacion => {
    if (this.telefono.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "El teléfono solo debe tener números de 9 a 14 digitos", validacion: false };
  };
  validarPrecio = (valor: string): IValidacion => {
    if (this.precio.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "El precio solo debe tener números y .", validacion: false };
  };
  validarUrl = (valor: string): IValidacion => {
    if (this.url.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "No coincide al formato de URL", validacion: false };
  };
  validarDigitos = (valor: string): IValidacion => {
    if (this.digitos.test(valor)) return { mensaje: "Coindide", validacion: true };
    return { mensaje: "Solo números", validacion: false };
  };
  validarRequired = (valor: string): IValidacion => {
    if (valor.length === 0) return { mensaje: "Coincide", validacion: true };
    return { mensaje: "Campo Requerido", validacion: false };
  };
}
export default new ClsExpR();
