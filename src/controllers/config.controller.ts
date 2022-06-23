import { Request, Response } from "express";
import { deleteFile } from "../lib/helpers";
import ClsConfig from "../class/ClsConfig";

export const changePhotoProcess = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.json({ error: "No ha subido una foto" });
    const fotoOld = await ClsConfig.getPhotoProcess();
    await deleteFile("../public/process_photo", fotoOld);
    const foto = await ClsConfig.changePhotoProcess(req.file.filename);
    console.log(foto);
    return res.json({ sucess: "Foto actualizada", photo: foto });
  } catch (error: any) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
export const getPhotoProcess = async (req: Request, res: Response) => {
  try {
    const foto = await ClsConfig.getPhotoProcess();
    console.log(foto);
    return res.json({ sucess: "Foto obtenida", photo: foto });
  } catch (error: any) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" });
  }
};
