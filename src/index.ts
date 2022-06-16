import { App } from "./app";
import { Server as WebSocketServer } from "socket.io";
import chat from "./class/ClsSocket";

async function main() {
  const app = new App(4000);
  const server = await app.listen();
  const io = new WebSocketServer(server, {
    cors: {
      origin: process.env.API,
    },
  });
  chat(io);
  // Sockets(io);
}

main();
