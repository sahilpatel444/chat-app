const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  transports: ["websocket", "polling"], // Ensure compatibility with Vercel
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.error("Token is missing in handshake");
    return next(new Error("Authentication error: Token is required"));
  }

  try {
    const user = await getUserDetailsFromToken(token);
    if (!user) {
      console.error("Invalid token");
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = user; // Attach user info to socket
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);
  console.log("User authenticated:", socket.user?._id);

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

module.exports = { app, server };
