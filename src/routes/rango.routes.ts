import { Router, Request, Response, NextFunction } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { getRol, createRol, getRolById, updateRol } from "../controllers/rango.controller";
import ClsExpR from "../class/ClsExpR";
import ClsRango from "../class/ClsRango";

const router = Router();

const idRolStored = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) return res.json({ error: "No ha enviado una id" }).status(400);

  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);
  const idRol = parseInt(id);

  const rol = await ClsRango.getRolByID(idRol);
  if (!rol) return res.json({ error: "No existe un rol con esa id" }).status(400);
  req.body.rol = rol;
  next();
};

const validateData = async (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsRango.validateData(req);
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);
  next();
};

const isTagStored = async (req: Request, res: Response, next: NextFunction) => {
  const { tag_id } = req.body;

  if (!tag_id) return res.json({ error: "No ha enviado una id" }).status(400);

  const validationId = ClsExpR.validarDigitos(tag_id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);
  const idTag = parseInt(tag_id);

  const tag = await ClsRango.getTagById(idTag);
  if (!tag) return res.json({ error: "No existe un tag con esa id" }).status(400);
  req.body.tag = tag;
  next();
};

router.get("/", JWTAuth, checkRoles("Administrador"), getRol);
router.get("/:id", JWTAuth, checkRoles("Administrador"), idRolStored, getRolById);
router.post("/", JWTAuth, checkRoles("Administrador"), validateData, isTagStored, createRol);
router.put("/:id", JWTAuth, checkRoles("Administrador"), idRolStored,isTagStored, updateRol);

export default router;
