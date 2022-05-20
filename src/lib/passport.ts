import passport from "passport";
import { Strategy } from "passport-local";
import { ExtractJwt, Strategy as StrategyJWT } from "passport-jwt";

import { config } from "../config/config";

// Classes
import ClsPerson from "../class/ClsPerson";
import ClsUsuario from "../class/ClsUsuario";
import ClsExpR from "../class/ClsExpR";

//Interfaces
import IUser from "../interface/IUser";
import IValidation from "../interface/IValidation";

import { connect } from "../database";

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
      // Validation email RegEx
      const validation = verifyLoginData(req.body);
      if (!validation.validation) return done(validation.message, false);

      // Initialization of connection to database
      const conn = await connect();

      try {
        const verification = await ClsPerson.verifyLogin(conn, email, password);

        if (!verification.validation) done(verification.message, false);

        if (verification.validation) {
          const newUsuario: IUser = await ClsUsuario.getUser(email);
          done(null, newUsuario);
        }
      } catch (error) {
        console.log(error);
        return done(error, false);
      } finally {
        conn.end();
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

        if (!validacion.validation) return done(validacion.message, false, { message: validacion.message });

        const { name, lastname, dni, address, id_rango } = req.body;

        await ClsPerson.asignarValores(email, password); //Tabla Persona

        const newPersona = await ClsPerson.registrarPersona(); //Tabla Persona Persona_Id

        ClsUsuario.asignarValores(dni, address, name, lastname, id_rango);

        const newEstudiante = await ClsUsuario.guardarDatos(newPersona); //Tabla Estudiante

        const newUsuario: IUser = await ClsUsuario.getUser(newEstudiante.email);
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

const VerificarDatosRegister = (cuerpo: any): IValidation => {
  const { email, nombre, apellido, dni, password, repeatPassword } = cuerpo;
  //   if (password !== repeatPassword) return { message: "Contraseñas diferentes", validacion: false };
  if (!ClsExpR.validarCorreo(email).validation) return ClsExpR.validarCorreo(email);
  if (!ClsExpR.validarNombre(nombre).validation) return ClsExpR.validarNombre(nombre);
  if (!ClsExpR.validarNombre(apellido).validation) return ClsExpR.validarNombre(apellido);
  if (!ClsExpR.validarNombre(dni).validation) return ClsExpR.validarDigitos(dni);
  return { message: "Validado", validation: true };
};

const verifyLoginData = (cuerpo: any): IValidation => {
  const { email, password } = cuerpo;

  // Are there this fields?
  if (!email) return { message: "Falta el campo 'email'", validation: false };
  if (!password) return { message: "Falta el campo 'password'", validation: false };

  // RegEx for email
  const validacionCorreo = ClsExpR.validarCorreo(email);
  if (!validacionCorreo.validation) return validacionCorreo;

  // All ok
  return { message: "Validado", validation: true };
};
