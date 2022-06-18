import { Server, Socket } from "socket.io";
import chalk from "chalk";
import jwt from "jsonwebtoken";
import IMessage from "src/interface/IMessage";
import ClsChat from "./ClsChat";

const log = console.log;

interface IUserSocket {
  socket_id: string;
  name: string;
  id: number;
  status: string;
}

class ClsSocket {
  io: Server;
  socket: Socket;
  static usersOnline: IUserSocket[] = [];

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    try {
      // Here is the user's token
      let token = socket.handshake.headers.authorization;
      token = token?.replace("Bearer ", "");
      const user: any = jwt.decode(`${token}`);

      log(chalk.bgBlack.green.bold(`Un usuario conectado ${user.name} ${user.id} ${socket.id}`));

      // We add the user connected in this array
      ClsSocket.usersOnline.push({ id: user.id, name: user.name, socket_id: socket.id, status: "En línea" });

      // When a user send a message
      socket.on("client:sendMessage", async (message: IMessage) => {
        const { id_receptor, id_emisor } = message;
        const newMessage = await ClsChat.createMessage(message);
        const socketId = this.getSocketById(id_receptor);
        const socketId2 = this.getSocketById(id_emisor);
        io.to(socketId2).emit("server:sendMessage", newMessage);
        socket.to(socketId).emit("server:sendMessage", newMessage);
      });

      socket.on("client:typing", (contact: any) => {
        const { id } = contact;
        const socketId = this.getSocketById(id);
        socket.to(socketId).emit("server:typing", user.id);
      });

      socket.on("server:receivedMessage", async (message: IMessage) => {
        const socketId = this.getSocketById(message.id_emisor);
        if (message.id_emisor !== user.id) {
          const newMessage = await ClsChat.updateMessage(message, 2);
          socket.to(socketId).emit("client:receivedMessage", newMessage);
          return;
        }
        socket.to(socketId).emit("client:receivedMessage", message);
      });

      // When the user disconnect
      socket.on("disconnect", () => this.disconnect(socket, user, io));
      io.emit("server:sendUsers", ClsSocket.usersOnline);
    } catch (error) {}
  }

  disconnect(socket: Socket, user: any, io: Server) {
    this.removeFromArray(socket.id);
    log(chalk.bgBlack.red.bold(`${user.name} ${socket.id} disconnected`));
    io.emit("server:disconnectUser", ClsSocket.usersOnline);
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
  io.on("connection", (socket: Socket) => new ClsSocket(io, socket));
}
export default chat;
