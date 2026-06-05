import mongoose from "mongoose";
import { type IToDo, Status } from "./todoTypes.js";

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

export default mongoose.model("Todo", todoSchema);
