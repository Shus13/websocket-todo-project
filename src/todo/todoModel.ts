import mongoose, { mongo } from "mongoose";
import type { IToDo } from "./todoTypes.js";
import { Status } from "./todoTypes.js";
import { Server } from "socket.io";

const Schema = mongoose.Schema;

const todoSchema = new Schema<IToDo>({
  task: String,
  deadline: String,
  status: {
    type: String,
    enum: [Status.Completed, Status.Pending],
    default: Status.Pending,
  },
});

export default mongoose.model("todo", todoSchema);
