import mongoose, { mongo } from "mongoose";
import { envConfig } from "./config.js";

async function connectDB() {
    try{
        mongoose.connection.on("connected", ()=>{
            console.log("Database connected successfully")
        })
        await mongoose.connect(envConfig.mongoConnectionString as string)
    } catch(error){
        console.log(error)
        process.exit(1)
    }
}

export default connectDB