//Interfaces
import IValidation from "../interface/IValidation";

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
  validarNombre = (valor: string): IValidation => {
    if (this.nombre.test(valor)) return { message: "Coindide", validation: true };
    return { message: "El nombre solo debe tener letras y espacios", validation: false };
  };
  validarRut = (valor: string): IValidation => {
    if (this.rut.test(valor)) return { message: "Coindide", validation: true };
    return { message: "El DNI o RUC debe ser entre 8 y 10 digitos", validation: false };
  };
  validarPassword = (valor: string): IValidation => {
    if (this.password.test(valor)) return { message: "Coindide", validation: true };
    return { message: "La contraseña debe ser mayor o igual a 4 caracteres", validation: false };
  };
  validarCorreo = (valor: string): IValidation => {
    if (this.correo.test(valor)) return { message: "Coindide", validation: true };
    return { message: "No coincide al formato de correo, ejemplo: name@example.com", validation: false };
  };
  validarTelefono = (valor: string): IValidation => {
    if (this.telefono.test(valor)) return { message: "Coindide", validation: true };
    return { message: "El teléfono solo debe tener números de 9 a 14 digitos", validation: false };
  };
  validarPrecio = (valor: string): IValidation => {
    if (this.precio.test(valor)) return { message: "Coindide", validation: true };
    return { message: "El precio solo debe tener números y .", validation: false };
  };
  validarUrl = (valor: string): IValidation => {
    if (this.url.test(valor)) return { message: "Coindide", validation: true };
    return { message: "No coincide al formato de URL", validation: false };
  };
  validarDigitos = (valor: string): IValidation => {
    if (this.digitos.test(valor)) return { message: "Coindide", validation: true };
    return { message: "Solo números", validation: false };
  };
  validarRequired = (valor: string): IValidation => {
    if (valor.length === 0) return { message: "Coincide", validation: true };
    return { message: "Campo Requerido", validation: false };
  };
}
export default new ClsExpR();
