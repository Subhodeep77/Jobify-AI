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
        default: "", 
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


resumeSummarySchema.index({ userId: 1 }, { unique: true });

const ResumeSummary = mongoose.model("ResumeSummary", resumeSummarySchema);

export default ResumeSummary;