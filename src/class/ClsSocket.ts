import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import chalk from "chalk";
import jwt from "jsonwebtoken";
import IMessage from "src/interface/IMessage";
import ClsChat from "./ClsChat";

const log = console.log;

interface IUserSocket {
  socket_id: string;
  socket: Socket;
  name: string;
  id: number;
}

class ClsSocket {
  io: Server;
  static usersOnline: IUserSocket[] = [];
  socket: Socket;
  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;
    try {
      let token = socket.handshake.headers.authorization;
      token = token?.replace("Bearer ", "");
      const user: any = jwt.decode(`${token}`);

      log(chalk.bgBlack.green.bold(`Un usuario conectado ${user.name} ${user.id} ${socket.id}`));

      ClsSocket.usersOnline.push({ id: user.id, name: user.name, socket_id: socket.id, socket: socket });
      socket.on("client:sendMessage", async (message: IMessage) => {
        const { id_receptor } = message;
        console.log(message);
        const newMessage = await ClsChat.createMessage(message);
        const socketId = this.getSocketById(id_receptor);
        socket.to(socketId).emit("server:sendMessage", newMessage);
      });
      socket.on("disconnect", () => this.disconnect(socket, user));
    } catch (error) {}
  }

  disconnect(socket: Socket, user: any) {
    this.removeFromArray(socket.id);
    log(chalk.bgBlack.red.bold(`${user.name} ${socket.id} disconnected`));
  }
  getSocketById = (id: number): string => {
    for (let i = 0; i < ClsSocket.usersOnline.length; i++) {
      const element = ClsSocket.usersOnline[i];
      if (element.id === id) return element.socket_id;
    }
    return "";
  };
  removeFromArray = (socketId: string) => {
    const newUsers: any[] = [];
    ClsSocket.usersOnline = ClsSocket.usersOnline.map((user: any) => {
      if (user.socket_id === socketId) return user;
      newUsers.push(user);
      return user;
    });
    ClsSocket.usersOnline = newUsers;
  };
}
function chat(io: Server) {
  io.on("connection", (socket: Socket) => {
    new ClsSocket(io, socket);
  });
}
export default chat;
