import { Request, Response } from "express";
import ClsChat from "../class/ClsChat";
import { Server } from "socket.io";

// API REST
export const getContacts = async (req: Request, res: Response) => {
  try {
    // Getting users in database
    const users = await ClsChat.getContacts(parseInt(`${req.user?.id}`));
    return res.json({ users, success: "Datos obtenidos" }).status(200);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Ocurrió un error, intentelo más tarde" }).status(500);
  }
};

export default (io: Server) => {
  const sendMessage = function (payload: any) {
    const socket = io;

    // ...
  };
};
