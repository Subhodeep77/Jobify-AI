import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },

  
  type: {
    type: String,
    enum: ["chat", "jobs"],
    default: "chat",
  },

  
  content: {
    type: String,
    default: null,
  },

  
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const memorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  messages: [messageSchema],
});

export default mongoose.model("Memory", memorySchema);