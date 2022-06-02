// Passport libraries
import passport from "passport";
import { Strategy } from "passport-local";
import { ExtractJwt, Strategy as StrategyJWT } from "passport-jwt";

import { config } from "../config/config";

// Classes
import ClsPerson from "../class/ClsPerson";
import ClsUsuario from "../class/ClsUser";

//Interfaces
import IUser from "../interface/IUser";

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
        const verification = await ClsPerson.verifyLogin(email, password);

        if (!verification.validation) return done(verification.message, false);

        const newUser: IUser = await ClsUsuario.getUserByEmail(email);
        done(null, newUser);
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
