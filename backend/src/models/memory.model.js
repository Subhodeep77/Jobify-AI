import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "system"] },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const memorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  messages: [messageSchema],

  preferences: {
    roles: [String],
    location: String,
    remote: Boolean
  }
});

export default mongoose.model("Memory", memorySchema);