const mongoose = require("mongoose");
const { schema } = require("./UserModel");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      // type: mongoose.Schema.ObjectId,
     type: mongoose.Schema.Types.ObjectId,
     // type : String,
      require: true,
      ref: "User",
      validate: {
        validator: (value) => mongoose.Types.ObjectId.isValid(value),
        message: "Invalid sender ObjectId",
      },
     
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
     // type : String,
      require: true,
      ref: "User",
      validate: {
        validator: (value) => mongoose.Types.ObjectId.isValid(value),
        message: "Invalid receiver ObjectId",
      },
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", messageSchema);
const ConversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = {
  MessageModel,
  ConversationModel,
};
