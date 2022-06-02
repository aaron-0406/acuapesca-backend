import { NextFunction, Router, Request, Response } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createUser, editUser, getUsers } from "../controllers/user.controller";
import { fotosPerfil } from "..//lib/multer";
import fs from "fs-extra";
import path from "path";
import ClsUser from "../class/ClsUser";
import ClsExpR from "../class/ClsExpR";
import { deleteFile } from "../lib/helpers";
const router = Router();

// Validate Request Body Create
const validateDataCreate = async (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateUserData(req, "Create");
  if (!validate.validation) {
    if (req.file) await deleteFile("../public/user_photos", `${req.file?.filename}`);
    return res.json({ error: `${validate.message}` }).status(400);
  }
  next();
};
// Validate Request Body Edit
const validateDataEdit = async (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateUserData(req, "Edit");
  if (!validate.validation) {
    if (req.file) await deleteFile("../public/user_photos", `${req.file?.filename}`);
    return res.json({ error: `${validate.message}` }).status(400);
  }
  next();
};

// Photo middleware
const multerFotoCreate = (req: Request, res: Response, next: NextFunction) => {
  fotosPerfil.single("photo")(req, res, (err) => {
    if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
    req.body.photo = req.file?.filename;
    next();
  });
};
const multerFotoEdit = (req: Request, res: Response, next: NextFunction) => {
  fotosPerfil.single("photo")(req, res, (err) => {
    if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
    next();
  });
};

const isUserStored = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    if (req.file) await deleteFile("../public/user_photos", `${req.file?.filename}`);
    return res.json({ error: "No ha enviado una id como parámetro" }).status(500);
  }

  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) {
    if (req.file) await deleteFile("../public/user_photos", `${req.file?.filename}`);
    return res.json({ error: `La id enviada no es válida` }).status(500);
  }
  const idUser = parseInt(id);

  const user = await ClsUser.getUserById(idUser);
  if (!user) {
    if (req.file) await deleteFile("../public/user_photos", `${req.file?.filename}`);
    return res.json({ error: "No hay un usuario registrado con ese id" }).status(500);
  }

  req.body.editUser = user;
  next();
};

// Get Users Route
router.get("/", JWTAuth, checkRoles("Administrador"), getUsers);

// Create User Route
router.post("/", JWTAuth, checkRoles("Administrador"), multerFotoCreate, validateDataCreate, createUser);

// Edit User Route
router.put("/:id", JWTAuth, checkRoles("Administrador"), multerFotoEdit, validateDataEdit, isUserStored, editUser);

export default router;
