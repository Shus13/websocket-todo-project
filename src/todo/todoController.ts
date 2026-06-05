import type { Socket } from "socket.io";
import { getSocketIo } from "../../server.js";
import todoModel from "./todoModel.js";
import { Status, type IToDo } from "./todoTypes.js";

function parseData(data: any) {
  return typeof data === "string" ? JSON.parse(data) : data;
}

class Todo {
  init() {
    const io = getSocketIo();

    io.on("connection", (socket: Socket) => {
      console.log("New client connected");

      socket.on("addTodo", (data) =>this.handleAddTodo(socket, data));
      socket.on("deleteTodo", (data) =>this.handleDeleteTodo(socket, data));
      socket.on("updateTodoStatus", (data) =>this.handleUpdateTodoStatus(socket, data));
    });
  }

  private async handleAddTodo(socket: Socket, data: IToDo) {
    try {
      const parsedData = parseData(data);
      const { task, deadline, status } = parsedData;

      const todo = await todoModel.create({
        task,
        deadline,
        status,
      });

      const todos = await todoModel.find({
        status: Status.Pending,
      });

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

  private async handleDeleteTodo(
    socket: Socket,
    data: { id: string }
  ) {
    try {
      const parsedData = parseData(data);
      const { id } = parsedData;

      const deletedTodo =
        await todoModel.findByIdAndDelete(id);

      if (!deletedTodo) {
        socket.emit("todo_response", {
          status: "error",
          message: "Todo not found",
        });
        return;
      }

      const todos = await todoModel.find({
        status: Status.Pending,
      });

      socket.emit("todos_updated", {
        status: "success",
        data: todos,
      });
    } catch (error) {
      socket.emit("todo_response", {
        status: "error",
        message: "Failed to delete todo",
      });
    }
  }

  private async handleUpdateTodoStatus(
    socket: Socket,
    data: { id: string; status: Status }
  ) {
    try {
      const parsedData = parseData(data);
      const { id, status } = parsedData;

      const todo =
        await todoModel.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

      if (!todo) {
        socket.emit("todo_response", {
          status: "error",
          message: "Todo not found",
        });
        return;
      }

      const todos = await todoModel.find({
        status: Status.Pending,
      });

      socket.emit("todo_updated", {
        status: "success",
        data: todos,
      });
    } catch (error) {
      socket.emit("todo_response", {
        status: "error",
        message: "Error updating todo",
      });
    }
  }
}

export default new Todo();