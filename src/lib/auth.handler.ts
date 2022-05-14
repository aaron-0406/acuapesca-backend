import { NextFunction, Request, Response } from "express";
import boom from '@hapi/boom';

export const checkRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) return res.json(boom.unauthorized("No tienes permisos para realizar esta petición"))
        if (roles.includes(user.rango)) return next();
        return res.json(boom.unauthorized("No tienes permisos para realizar esta petición"))
    }
}