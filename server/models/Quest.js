import mongoose from "mongoose";

const completionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const questSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "GENERAL",
    },

    type: {
      type: String,
      enum: ["DAILY", "EPIC", "SIDE"],
      default: "DAILY",
    },

    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },

    xp: {
      type: Number,
      default: 20,
    },

    gold: {
      type: Number,
      default: 10,
    },

    completions: [completionSchema],
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Quest", questSchema);