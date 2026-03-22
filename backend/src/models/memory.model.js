import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  userId: String,
  messages: Array,
  preferences: Object
});

export default mongoose.model("Memory", memorySchema);