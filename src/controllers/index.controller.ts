import { Request, Response } from "express";
import path from "path";

export async function indexRoute(req: Request, res: Response) {
  return res.sendFile(path.join(__dirname + "/.." + "/public/build/index.html"));
}
