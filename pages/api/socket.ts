// pages/api/socket.ts
import { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";

// Khai báo lại kiểu để thêm `.io` vào server
type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket || !res.socket.server) {
    res.status(500).end("Socket not available");
    return;
  }

  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new IOServer(res.socket.server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {

    socket.on("select_seat", ({ seatId, showtimeId }) => {
      socket.broadcast.emit("seat_selected", { seatId, showtimeId });
    });

    socket.on("unselect_seat", ({ seatId, showtimeId }) => {
      socket.broadcast.emit("seat_unselected", { seatId, showtimeId });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  res.end();
}
