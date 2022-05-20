import { NextFunction, Request, Response } from "express";
import passport from "passport";

//Libs
import { signToken } from "../lib/jwt";

// Classes
import ClsPerson from "../class/ClsPerson";

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

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, repeatPassword, oldPassword } = req.body;
    return res.json(await ClsPerson.changePassword(oldPassword, newPassword, repeatPassword, req.user?.email));
  } catch (error: any) {
    console.log(error);
    return res.json({ error: "Algo salió mal, intentelo más tarde" });
  }
};
