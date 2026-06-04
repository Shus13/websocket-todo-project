import { Server } from "socket.io";
import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

async function startServer() {
    await connectDB();

    const port = envConfig.port || 4000;

    const server = app.listen(port, () => {
      console.log(`Server started at port [${port}]`);
    });
  
    const io = new Server(server)
    io.on("connection", (socket)=> {
      socket.on("event_name", (data)=>{
        console.log(data)
        socket.emit("response", {
          message: "Data received"
        })
      })
      console.log("Someone connected(client)")
    })


  

}

startServer();