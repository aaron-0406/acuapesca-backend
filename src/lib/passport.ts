import passport from 'passport';
import { Strategy } from 'passport-local';
import { ExtractJwt, Strategy as StrategyJWT } from 'passport-jwt';

import { config } from '../config/config';

// Classes
import ClsPersona from '../class/ClsPersona';
import ClsEstudiante from '../class/ClsEstudiante';
import ClsExpR from '../class/ClsExpR';

//Interfaces
import IUsuario from '../interface/IUsuario';
import IValidacion from '../interface/IValidacion';

//LOGIN
passport.use('local.signin', new Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const validacion = VerificarDatosLogin(req.body);
        if (!validacion.validacion) return done(validacion.mensaje, false, { message: validacion.mensaje });
        const verificacion = await ClsPersona.VerificarLogin(email, password);
        if (!verificacion.validacion) return done(verificacion.mensaje, false, { message: verificacion.mensaje });
        const newUsuario: IUsuario = await ClsEstudiante.getEstudiante(email);
        done(null, newUsuario);
    } catch (error) {
        console.log(error);
        return done(error, false, { message: "Ocurrió un error" });
    }
}));

//REGISTER
passport.use('local.signup', new Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const validacion = VerificarDatosRegister(req.body);
        if (!validacion.validacion) return done(validacion.mensaje, false, { message: validacion.mensaje });
        const { Pais_Nacimiento, Pais_Residencia, name, lastname, profesion, documento, telefono, password, repeatPassword } = req.body;

        await ClsPersona.asignarValores(email, password, Pais_Nacimiento, Pais_Residencia);//Tabla Persona

        const newPersona = await ClsPersona.registrarPersona();//Tabla Persona Persona_Id

        ClsEstudiante.asignarValores(documento, profesion, telefono, name, lastname);

        const newEstudiante = await ClsEstudiante.guardarDatos(newPersona);//Tabla Estudiante

        const newUsuario: IUsuario = await ClsEstudiante.getEstudiante(newEstudiante.Persona.Persona_Correo);

        return done(null, newUsuario);
    } catch (error: any) {
        console.log(error);
        if (error.code === "ER_DUP_ENTRY") return done("Ese correo ya está en uso", false, { message: "Ese correo ya está en uso" });
        return done("Ocurrió un error", false, { message: "Ocurrió un error" });
    }
}));

//Passport con JWT
passport.use('jwt', new StrategyJWT({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}, async (payload, done) => {
    try {
        return done(null, payload);
    } catch (error) {
        console.log(error);
        return done(error, payload);
    }
}));

const VerificarDatosRegister = (cuerpo: any): IValidacion => {
    const { email, name, lastname, profesion, documento, telefono, password, repeatPassword } = cuerpo;
    if (password !== repeatPassword) return { mensaje: "Contraseñas diferentes", validacion: false };
    if (!ClsExpR.validarCorreo(email).validacion) return ClsExpR.validarCorreo(email);
    if (!ClsExpR.validarNombre(name).validacion) return ClsExpR.validarNombre(name);
    if (!ClsExpR.validarNombre(lastname).validacion) return ClsExpR.validarNombre(lastname);
    if (!ClsExpR.validarNombre(profesion).validacion) return ClsExpR.validarNombre(profesion);
    if (!ClsExpR.validarRut(documento).validacion) return ClsExpR.validarRut(documento);
    if (!ClsExpR.validarTelefono(telefono).validacion) return ClsExpR.validarRut(telefono);
    return { mensaje: "Validado", validacion: true };
}

const VerificarDatosLogin = (cuerpo: any): IValidacion => {
    const { email } = cuerpo;
    if (!ClsExpR.validarCorreo(email).validacion) return ClsExpR.validarCorreo(email);
    return { mensaje: "Validado", validacion: true };
}