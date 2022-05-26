import passport from "passport";
import { Strategy } from "passport-local";
import { ExtractJwt, Strategy as StrategyJWT } from "passport-jwt";

import { config } from "../config/config";

// Classes
import ClsPerson from "../class/ClsPerson";
import ClsUsuario from "../class/ClsUser";
import ClsExpR from "../class/ClsExpR";

//Interfaces
import IUser from "../interface/IUser";
import IValidation from "../interface/IValidation";


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

      try {
        const verification = await ClsPerson.verifyLogin(email, password);

        if (!verification.validation) done(verification.message, false);

        if (verification.validation) {
          const newUser: IUser = await ClsUsuario.getUserByEmail(email);
          done(null, newUser);
        }
      } catch (error) {
        console.log(error);
        return done(error, false);
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
