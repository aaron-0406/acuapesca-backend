import multer from 'multer';
import path from 'path';

const storageFotosPerfil = multer.diskStorage({
    destination: path.join(__dirname, "../public/FotoEstudiantes"),
    filename: (req, file, cb) => {
        const fecha = new Date();
        cb(null, `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}-${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}${file.originalname}`)
    }
});

const storageFotosCursos = multer.diskStorage({
    destination: path.join(__dirname, "../public/FotoCursos"),
    filename: (req, file, cb) => {
        const fecha = new Date();
        cb(null, `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}-${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}${file.originalname}`);
    }
});

const storageFotosProfesores = multer.diskStorage({
    destination: path.join(__dirname, "../public/FotoProfesores"),
    filename: (req, file, cb) => {
        const fecha = new Date();
        cb(null, `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}-${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}${file.originalname}`);
    }
});

const storageFotosComprobantes = multer.diskStorage({
    destination: path.join(__dirname, "../public/FotoComprobantes"),
    filename: (req, file, cb) => {
        const fecha = new Date();
        cb(null, `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}-${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}${file.originalname}`);
    }
});

const filterFotos = async (req: any, file: any, cb: any) => {
    const filetypes = /JPG|JPEG|jpg|jpeg|png|PNG/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    // if (!req.user) return cb('Necesita una cuenta para esto');
    if (mimetype && extname) return cb(null, true);
    cb("Archivo debe ser una foto.");
};

const storageArchivos = multer.diskStorage({
    destination: path.join(__dirname, "../public/material"),
    filename: (req, file, cb) => {
        const fecha = new Date();
        cb(null, `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}-${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}${file.originalname}`);
    }
});
const storageTareas = multer.diskStorage({
    destination: path.join(__dirname, "../public/tareas"),
    filename: (req, file, cb) => {
        const fecha = new Date();
        cb(null, `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}-${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}${file.originalname}`);
    }
});

export const fotosPerfil = multer({ storage: storageFotosPerfil, fileFilter: filterFotos })
export const fotosCursos = multer({ storage: storageFotosCursos, fileFilter: filterFotos })
export const fotosProfesores = multer({ storage: storageFotosProfesores, fileFilter: filterFotos })
export const fotosComprobantes = multer({ storage: storageFotosComprobantes, fileFilter: filterFotos })
export const archivos = multer({ storage: storageArchivos })
export const tareas = multer({ storage: storageTareas })