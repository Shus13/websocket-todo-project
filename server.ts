import { Server } from "socket.io";
import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import todoController from "./src/todo/todoController.js";

let io: Server | undefined;

export function getSocketIo() {
  if (!io) {
    throw new Error("Socket initialize vako xaina");
  }

  return io;
}

async function startServer() {
  try {
    await connectDB();

    const port = envConfig.port || 4000;

    const server = app.listen(port, () => {
      console.log(`Server started at port [${port}]`);
    });

    io = new Server(server);

    todoController.init();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();