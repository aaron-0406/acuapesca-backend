import { Router } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { getRangos } from "../controllers/rango.controller";

const router = Router();

router.get("/", JWTAuth, checkRoles("Administrador"), getRangos);
router.get("/:id", JWTAuth, checkRoles("Administrador"), getRangos);
router.post("/", JWTAuth, checkRoles("Administrador"), getRangos);
router.put("/", JWTAuth, checkRoles("Administrador"), getRangos);

export default router;
