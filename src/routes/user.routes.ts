import { NextFunction, Router, Request, Response } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createUser, editUser, getUsers } from "../controllers/user.controller";
import { fotosPerfil } from "..//lib/multer";
import fs from "fs-extra";
import path from "path";
import ClsUser from "../class/ClsUser";
const router = Router();

// Validate Request Body Create
const validateDataCreate = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateUserData(req, "Create");
  if (!validate.validation) {
    try {
      if (req.file) fs.unlink(path.join(__dirname, "../public/user_photos", req.file.filename));
    } catch (error) {
      return res.json({ error: `${validate.message}` }).status(400);
    }
  }
  next();
};
// Validate Request Body Edit
const validateDataEdit = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateUserData(req, "Edit");
  if (!validate.validation) {
    try {
      if (req.file) fs.unlink(path.join(__dirname, "../public/user_photos", req.file.filename));
    } catch (error) {
      return res.json({ error: `${validate.message}` }).status(400);
    }
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

// Get Users Route
router.get("/", JWTAuth, checkRoles("Administrador"), getUsers);

// Create User Route
router.post("/", JWTAuth, checkRoles("Administrador"), multerFotoCreate, validateDataCreate, createUser);

// Edit User Route
router.put("/:id", JWTAuth, checkRoles("Administrador"), multerFotoEdit, validateDataEdit, editUser);

export default router;
