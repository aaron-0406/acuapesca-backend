//Interfaces
import IValidation from "../interface/IValidation";

class ClsExpR {
  // @this.nombre: RegExp for just letters and spaces
  private nombre: RegExp = /^[a-zA-ZÀ-ÿ.\s]{1,255}$/; // Letras y espacios, pueden llevar acentos.

  // @this.password: RegExp for 4 a 12 digits.
  private password: RegExp = /^.{4,12}$/;

  // @this.email: RegExp for email fields name@example.com
  private email: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  // @this.phone: RegExp for phone fields // 9 to 14 numbers.
  private phone: RegExp = /^[0-9-+\s]{9,14}$/;

  // @this.rut: RegExp for dni fields // 8 to 10 numbers.
  private rut: RegExp = /^[0-9-]{8}$/;

  // @this.price: RegExp for price fields // 23.5
  private price: RegExp = /^[0-9.]+$/;

  // @this.digitos: RegExp for numbers
  private digitos: RegExp = /^[0-9]+$/;

  // @this.url: RegExp for url fields
  private url: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;

  validarNombre = (valor: string): IValidation => {
    if (this.nombre.test(valor)) return { message: "Coindide", validation: true };
    return { message: "El nombre solo debe tener letras y espacios", validation: false };
  };

  validarRut = (valor: string): IValidation => {
    if (this.rut.test(valor)) return { message: "Coindide", validation: true };
    return { message: "El DNI debe de 8 digitos", validation: false };
  };

  validarPassword = (valor: string): IValidation => {
    if (this.password.test(valor)) return { message: "Coindide", validation: true };
    return { message: "La contraseña debe ser mayor o igual a 4 caracteres", validation: false };
  };

  validarCorreo = (valor: string): IValidation => {
    if (this.email.test(valor)) return { message: "Coindide", validation: true };
    return { message: "No coincide al formato de correo, ejemplo: name@example.com", validation: false };
  };

  validarTelefono = (valor: string): IValidation => {
    if (this.phone.test(valor)) return { message: "Coindide", validation: true };
    return { message: "El teléfono solo debe tener números de 9 a 14 digitos", validation: false };
  };

  validarPrecio = (valor: string): IValidation => {
    if (this.price.test(valor)) return { message: "Coindide", validation: true };
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
    if (valor.trim().length !== 0) return { message: "Coincide", validation: true };
    return { message: "Campo Requerido", validation: false };
  };

  validarLength = (valor: string, length: number): IValidation => {
    if (valor.trim().length === length) return { message: `Coincide`, validation: true };
    return { message: `Tamaño requerido ${length}`, validation: false };
  };
}
export default new ClsExpR();
