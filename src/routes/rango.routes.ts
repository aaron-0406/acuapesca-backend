import { Router } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { getRangos } from "../controllers/rango.controller";

const router = Router();

router.get("/", JWTAuth, checkRoles("Administrador"), getRangos);

export default router;
