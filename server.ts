import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

async function startServer() {
  try {
    await connectDB();

    const port = envConfig.port || 4000;

    app.listen(port, () => {
      console.log(`Server started at port [${port}]`);
    });
  } catch (error) {
    console.log("Server failed to start:", error);
  }
}

startServer();