import mongoose from "mongoose";

const resumeSummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    summary: {
      description: {
        type: String,
        default: "", // 🔥 high-level profile of candidate
      },

      skills: {
        type: [String],
        default: [],
      },

      projects: {
        type: String,
        default: "",
      },

      experience: {
        type: String,
        default: "",
      },

      education: {
        type: String,
        default: "",
      },

      achievements: {
        type: String,
        default: "",
      },

      certifications: {
        type: String,
        default: "",
      },
    },

    rawTextHash: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔒 One summary per user (overwrite on new upload)
resumeSummarySchema.index({ userId: 1 }, { unique: true });

const ResumeSummary = mongoose.model("ResumeSummary", resumeSummarySchema);

export default ResumeSummary;