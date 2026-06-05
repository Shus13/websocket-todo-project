import type { Socket } from "socket.io";
import { getSocketIo } from "../../server.js";
import todoModel from "./todoModel.js";
import type { IToDo } from "./todoTypes.js";

class Todo {
  init() {
    const io = getSocketIo();

    io.on("connection", (socket: Socket) => {
      console.log("New client connected");
      socket.on("addTodo", (data) => this.handleAddTodo(socket, data));
      socket.on("deleteTodo", (data) => this.handleDeleteTodo(socket, data));
    });
  }

  private async handleAddTodo(socket: Socket, data: IToDo) {
    try {
      const { task, deadline, status } = data;

      await todoModel.create({
        task,
        deadline,
        status,
      });
      const todos = await todoModel.find();
      socket.emit("todos_updated", {
        status: "Success",
        data: todos,
      });
    } catch (error) {
      socket.emit("todo_response", {
        status: "Error",
        message: "Failed to create todo",
      });
    }
  }

  private async handleDeleteTodo(socket: Socket, data: { id: String }) {
    try {
      const { id } = data;
      const deleteTodo = await todoModel.findByIdAndDelete(id);
      if (!deleteTodo) {
        socket.emit("todo_response", {
          status: "error",
          message: "Todo not found",
        });
        return;
      }
      const todos = await todoModel.find();
      socket.emit("todos_updated", {
        status: "success",
        data: todos,
      });
    } catch (error) {
      socket.emit("todo_response", {
        status: "error",
        message: "Failed to create todo",
      });
    }
  }
}

export default new Todo();
