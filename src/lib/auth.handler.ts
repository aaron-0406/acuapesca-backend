import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import passport from "passport";

// Middleware for roles
export const checkRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.json({ error: "JWT Missing" });
    if (roles.includes(user.rango)) return next();
    return res.json({ error: "No tienes permisos para realizar esta petición" });
  };
};

// Authenticate by JWT
export const JWTAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err, user, info: TokenExpiredError) => {
    if (err || !user) return res.json({ error: info.message });
    req.user = user;
    return next();
  })(req, res, next);
};
