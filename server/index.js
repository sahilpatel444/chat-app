const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const { app, server } = require("./soket/index");
const path = require("path");

// const app = express()
app.use(
  cors({
    origin: process.env.FRONTEND_URL ,
    // methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = 8080;

app.get("/", (request, response) => {
  response.json({
    message: "server running at " + PORT,
  });
});

//api endpoints
app.use("/api", router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running at " + PORT);
  });
});
