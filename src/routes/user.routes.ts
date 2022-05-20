import { NextFunction, Router, Request, Response } from "express";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import { createUser, getUsers } from "../controllers/user.controller";
import { fotosPerfil } from "..//lib/multer";
import fs from "fs-extra";
import path from "path";
import ClsUser from "../class/ClsUser";
const router = Router();

// Validate Request Body Create and Edit
const validateData = (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateUserData(req);
  if (!validate.validation) {
    try {
      fs.unlink(path.join(__dirname, "../public/user_photos", req.body.photo));
    } catch (error) {
    } finally {
      return res.json({ error: `${validate.message}` }).status(400);
    }
  }
  next();
};

// Photo middleware
const multerFoto = (req: Request, res: Response, next: NextFunction) => {
  fotosPerfil.single("photo")(req, res, (err) => {
    if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
    req.body.photo = req.file?.filename;
    next();
  });
};

// Create User Route
router.post("/", JWTAuth, checkRoles("Administrador"), multerFoto, validateData, createUser);
router.get("/", JWTAuth, checkRoles("Administrador"), getUsers);

export default router;
