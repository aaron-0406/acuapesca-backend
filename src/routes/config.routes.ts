import { Router, Request, Response, NextFunction } from "express";
import { fotoProcess } from "../lib/multer";
import { changePhotoProcess, getPhotoProcess } from "../controllers/config.controller";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
const router = Router();
// Photo middleware
const multerFile = (req: Request, res: Response, next: NextFunction) => {
  fotoProcess.single("photo_process")(req, res, (err) => {
    if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
    next();
  });
};
router.post("/photoProcess", JWTAuth, checkRoles("Administrador"), multerFile, changePhotoProcess);
router.get("/photoProcess", getPhotoProcess);

export default router;
