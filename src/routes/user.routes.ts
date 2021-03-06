import { NextFunction, Router, Request, Response } from "express";

// Controllers
import { createUser, editUser, editUserPhoto, editUserStatus, getUserById, getUsers } from "../controllers/user.controller";

// Classes
import ClsUser from "../class/ClsUser";
import ClsExpR from "../class/ClsExpR";

// Helpers
import { fotosPerfil } from "..//lib/multer";
import { checkRoles, JWTAuth } from "../lib/auth.handler";
import ClsDocument from "../class/ClsDocument";

const router = Router();

// Validate Request Body Create
const validateDataCreate = async (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateUserData(req, "Create");
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);
  next();
};

// Validate Request Body Edit
const validateDataEdit = async (req: Request, res: Response, next: NextFunction) => {
  const validate = ClsUser.validateUserData(req, "Edit");
  if (!validate.validation) return res.json({ error: `${validate.message}` }).status(400);
  next();
};

// Verifying if there is a user stored with that id
const isUserStored = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // In case they didn't send the id
  if (!id) return res.json({ error: "No ha enviado una id como parámetro" }).status(400);

  // In case is not a number
  const validationId = ClsExpR.validarDigitos(id);
  if (!validationId.validation) return res.json({ error: `La id enviada no es válida` }).status(400);

  // Getting user in database
  const idUser = parseInt(id);
  const user = await ClsUser.getUserById(idUser);
  // If there is not a user stored
  if (!user) return res.json({ error: "No hay un usuario registrado con ese id" }).status(400);

  // We put the user data in request body for the next function
  req.body.editUser = user;
  next();
};


// Photo middleware
const multerFile = (req: Request, res: Response, next: NextFunction) => {
  fotosPerfil.single("photo")(req, res, (err) => {
    if (err) return res.json({ error: err }); // A Multer error occurred when uploading.
    if (!req.file) return res.json({ error: "Falta el campo 'photo'" });
    req.body.file = req.file.filename;
    next();
  });
};

// Get Users Route
router.get("/", JWTAuth, checkRoles("Administrador", "Gestor"), getUsers);

// Get User By Id Route
router.get("/:id", JWTAuth, checkRoles("Administrador"), isUserStored, getUserById);

// Create User Route
router.post("/", JWTAuth, checkRoles("Administrador"), validateDataCreate, createUser);

// Edit User Route
router.put("/:id", JWTAuth, checkRoles("Administrador"), validateDataEdit, isUserStored, editUser);

// Edit User's Photo Route
router.patch("/photo", JWTAuth, multerFile, editUserPhoto);

// Edit User's Status Route
router.patch("/status/:id", JWTAuth, checkRoles("Administrador"), isUserStored, editUserStatus);

export default router;
