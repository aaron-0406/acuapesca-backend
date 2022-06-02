import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Middleware files for user photos
const storageFotosPerfil = multer.diskStorage({
  destination: path.join(__dirname, "../public/user_photos"),
  filename: (req, file, cb) => {
    const fecha = new Date();
    cb(null, `${uuidv4()}${file.originalname}`);
  },
});

// Filter photos
const filterFotos = async (req: any, file: any, cb: any) => {
  const filetypes = /JPG|JPEG|jpg|jpeg|png|PNG/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname));
  // if (!req.user) return cb('Necesita una cuenta para esto');
  if (mimetype && extname) return cb(null, true);
  cb("Archivo debe ser una foto.");
};

// Middleware for files
const storageArchivos = multer.diskStorage({
  destination: path.join(__dirname, "../public/docs"),
  filename: (req, file, cb) => {
    const fecha = new Date();
    cb(null, `${uuidv4()}${file.originalname}`);
  },
});

export const fotosPerfil = multer({ storage: storageFotosPerfil, fileFilter: filterFotos });
export const archivos = multer({ storage: storageArchivos });
