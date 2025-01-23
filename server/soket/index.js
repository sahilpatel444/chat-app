const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const { ConversationModel, MessageModel } = require("../models/ConversationModel");
const getConversation = require("../helpers/getConversation");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  transports: ["websocket", "polling"], // Support WebSocket and Polling
});

const onlineUser = new Set();

// Middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.error("Token missing in handshake");
    return next(new Error("Authentication error: Token is required"));
  }

  try {
    const user = await getUserDetailsFromToken(token);
    if (!user) throw new Error("Invalid token");
    socket.user = user; // Attach user data to socket
    next();
  } catch (err) {
    console.error(err.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  const user = socket.user;

  // Add user to online list
  socket.join(user._id.toString());
  onlineUser.add(user._id.toString());
  io.emit("onlineUser", Array.from(onlineUser));

  // Handle "message-page"
  socket.on("message-page", async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user._id, receiver: userId },
        { sender: userId, receiver: user._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  // Handle "new message"
  socket.on("new message", async (data) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender },
      ],
    });

    if (!conversation) {
      conversation = await new ConversationModel({
        sender: data.sender,
        receiver: data.receiver,
      }).save();
    }

    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data.msgByUserId,
    });

    const savedMessage = await message.save();

    await ConversationModel.updateOne(
      { _id: conversation._id },
      { $push: { messages: savedMessage._id } }
    );

    const updatedMessages = await ConversationModel.findOne({
      $or: [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data.sender).emit("message", updatedMessages?.messages || []);
    io.to(data.receiver).emit("message", updatedMessages?.messages || []);
  });

  // Handle "disconnect"
  socket.on("disconnect", () => {
    onlineUser.delete(user._id.toString());
    io.emit("onlineUser", Array.from(onlineUser));
    console.log("User disconnected:", socket.id);
  });
});

module.exports = { app, server };
