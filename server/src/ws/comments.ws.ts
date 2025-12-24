import { WebSocketServer, WebSocket } from "ws";
import { Comment } from "../models/comments";
import { Task } from "../models/tasks";
import { Team } from "../models/team";
import jwt from "jsonwebtoken";
import url from "url";
import { Notification } from "../models/notification";

interface CommentRoom {
  [taskId: string]: WebSocket[];
}

const rooms: CommentRoom = {};

// WebSocket server
export const initCommentWS = () => {
  const wss = new WebSocketServer({ port: 3001 });

  wss.on("connection", async (socket: WebSocket, req) => {
    try {
      const query = url.parse(req.url!, true).query;
      const token = query.token as string;

      if (!token) return socket.close();

      const decoded: any = jwt.verify(token, process.env.AUTH_SECRET!);
      (socket as any).userId = decoded.id;
    } catch (err) {
      socket.close();
      return;
    }

    socket.on("message", async (rawMessage) => {
      try {
        // @ts-ignore
        const msg = JSON.parse(rawMessage.toLocaleString());

        // joining the room
        if (msg.type === "join") {
          const taskId = msg.payload.taskId;
          if (!taskId) return;

          if (!rooms[taskId]) rooms[taskId] = [];

          if (!rooms[taskId].includes(socket)) {
            rooms[taskId].push(socket);
          }

          // attach room to socket
          (socket as any).room = taskId;
          return;
        }

        // chating
        if (msg.type === "chat") {
          const userId = (socket as any).userId;
          const roomId = msg.payload.taskId || (socket as any).room;
          const message = msg.payload.message;

          if (!roomId || !message) {
            console.log("Missing roomId or message");
            return;
          }

          const task = await Task.findById(roomId);
          if (!task || !task.teamId) {
            console.log("Task not found or no teamId:", roomId);
            return;
          }

          const team = await Team.findById(task.teamId);
          if (!team) {
            console.log("Team not found:", task.teamId);
            return;
          }

          const isMember = team.members.some((m) => m.toString() === userId);

          if (!isMember) {
            console.log("User is not a team member");
            return;
          }

          const savedComment = await Comment.create({
            taskId: roomId,
            userId,
            message,
          });

          const populatedComment = await savedComment.populate(
            "userId",
            "name email"
          );

          for (const member of team.members) {
            // separating sender and receiver
            if (member.toString() === userId.toString()) continue;

            await Notification.create({
              userId: member,
              fromId: userId,
              commentId: savedComment._id,
              taskId: roomId,
              type: "comment",
              isRead: false,
            });
          }

          const chatPayload = JSON.stringify({
            type: "receive-message",
            payload: {
              _id: populatedComment._id,
              taskId: roomId,
              userId: populatedComment.userId,
              message: populatedComment.message,
              createdAt: populatedComment.createdAt,
            },
          });

          if (!rooms[roomId]) {
            return;
          }

          rooms[roomId].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(chatPayload);
            }
          });
        }
      } catch (err) {
        console.log("WS Error:", err);
      }
    });

    socket.on("close", () => {
      for (const taskId in rooms) {
        if (!rooms[taskId]) return;

        rooms[taskId] = rooms[taskId].filter((s) => s !== socket);
        if (rooms[taskId].length === 0) delete rooms[taskId];
      }
    });
  });
};
