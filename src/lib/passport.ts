import passport from "passport";
import { Strategy } from "passport-local";
import { ExtractJwt, Strategy as StrategyJWT } from "passport-jwt";

import { config } from "../config/config";

// Classes
import ClsPersona from "../class/ClsPersona";
import ClsUsuario from "../class/ClsUsuario";
import ClsExpR from "../class/ClsExpR";

//Interfaces
import IUsuario from "../interface/IUsuario";
import IValidacion from "../interface/IValidacion";

//LOGIN
passport.use(
  "local.signin",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const validacion = VerificarDatosLogin(req.body);
        if (!validacion.validacion) return done(validacion.mensaje, false, { message: validacion.mensaje });
        const verificacion = await ClsPersona.VerificarLogin(email, password);
        if (!verificacion.validacion) return done(verificacion.mensaje, false, { message: verificacion.mensaje });
        const newUsuario: IUsuario = await ClsUsuario.getUser(email);
        done(null, newUsuario);
      } catch (error) {
        console.log(error);
        return done(error, false, { message: "Ocurrió un error" });
      }
    }
  )
);

//REGISTER
passport.use(
  "local.signup",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const validacion = VerificarDatosRegister(req.body);
        if (!validacion.validacion) return done(validacion.mensaje, false, { message: validacion.mensaje });
        const { name, lastname, dni, address, id_rango } = req.body;

        await ClsPersona.asignarValores(email, password); //Tabla Persona

        const newPersona = await ClsPersona.registrarPersona(); //Tabla Persona Persona_Id
        
        ClsUsuario.asignarValores(dni, address, name, lastname, id_rango);

        const newEstudiante = await ClsUsuario.guardarDatos(newPersona); //Tabla Estudiante

        const newUsuario: IUsuario = await ClsUsuario.getUser(newEstudiante.email);
        return done(null, newUsuario);
      } catch (error: any) {
        console.log(error);
        if (error.code === "ER_DUP_ENTRY") return done("Ese correo ya está en uso", false, { message: "Ese correo ya está en uso" });
        return done("Ocurrió un error", false, { message: "Ocurrió un error" });
      }
    }
  )
);

//Passport con JWT
passport.use(
  "jwt",
  new StrategyJWT(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    },
    async (payload, done) => {
      try {
        return done(null, payload);
      } catch (error) {
        console.log(error);
        return done(error, payload);
      }
    }
  )
);

const VerificarDatosRegister = (cuerpo: any): IValidacion => {
  const { email, nombre, apellido, dni, password, repeatPassword } = cuerpo;
  //   if (password !== repeatPassword) return { mensaje: "Contraseñas diferentes", validacion: false };
  if (!ClsExpR.validarCorreo(email).validacion) return ClsExpR.validarCorreo(email);
  if (!ClsExpR.validarNombre(nombre).validacion) return ClsExpR.validarNombre(nombre);
  if (!ClsExpR.validarNombre(apellido).validacion) return ClsExpR.validarNombre(apellido);
  if (!ClsExpR.validarNombre(dni).validacion) return ClsExpR.validarDigitos(dni);
  return { mensaje: "Validado", validacion: true };
};

const VerificarDatosLogin = (cuerpo: any): IValidacion => {
  const { email } = cuerpo;
  const validacionCorreo = ClsExpR.validarCorreo(email);
  if (!validacionCorreo.validacion) return validacionCorreo;
  return { mensaje: "Validado", validacion: true };
};
