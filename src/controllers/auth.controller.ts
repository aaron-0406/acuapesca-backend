import { NextFunction, Request, Response } from "express";
import passport from "passport";
import boom from "@hapi/boom";

//Libs
import { signToken } from "../lib/jwt";

// Classes
import ClsPersona from "../class/ClsPerson";

// This controller is for signin route
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate("local.signin", { session: false }, (err, user, info) => {
      if (info) return res.json({ error: `Faltan campos (email,password)` }).status(400);
      if (err) return res.json({ error: err }).status(401);
      if (!user) return res.json({ error: "Contraseña o Correo inválidos" }).status(401);

      // Singing token with the user
      const token = signToken(user, `${process.env.JWT_SECRET}`);

      return res.json({ success: "Sesión Iniciada", user, token });
    })(req, res, next);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Algo salió mal, intentelo más tarde" });
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate("local.signup", { session: false }, (err, user, info) => {
      if (err) return res.json(boom.badRequest(err));
      if (!user) return res.json(boom.badData());
      const token = signToken(user, process.env.JWT_SECRET + "");
      return res.json({ success: "Sesión Iniciada", user, token });
    })(req, res, next);
  } catch (error: any) {
    console.log(error);
    return res.json(boom.internal(`Algo mal sucedió, intentelo más tarde: ${error.message}`));
  }
};

export const publico = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publicoPayLoad = { rango: "Publico" };
    const token = signToken(publicoPayLoad, process.env.JWT_SECRET + "");
    return res.json({ success: "Sesión Iniciada", token, user: { rango: "Publico" } });
  } catch (error: any) {
    console.log(error);
    return res.json(boom.internal(`Algo mal sucedió, intentelo más tarde: ${error.message}`));
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, repeatPassword, oldPassword } = req.body;
    return res.json(await ClsPersona.changePassword(oldPassword, newPassword, repeatPassword, req.user?.correo));
  } catch (error: any) {
    console.log(error);
    return res.json(boom.internal(`Algo mal sucedió, intentelo más tarde: ${error.message}`));
  }
};

export const logout = (req: Request, res: Response) => {
  return res.json({ success: "Desconectado" });
};

export const recoveryPassword = async (req: Request, res: Response) => {};
