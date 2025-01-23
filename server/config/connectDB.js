const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("connect to Database");
    });

    connection.on("error", (error) => {
      console.log("Something is wrong in mongodb");
    });
  } catch (error) {
    console.log("Something is wrong ", error);
  }
}

module.exports = connectDB;
