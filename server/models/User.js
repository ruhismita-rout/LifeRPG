import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    level: {
      type: Number,
      default: 1,
    },

    xp: {
      type: Number,
      default: 0,
    },

    gold: {
      type: Number,
      default: 100,
    },

    rp: {
      type: Number,
      default: 0,
    },

    rank: {
      type: String,
      default: "BRONZE",
    },

    streak: {
      type: Number,
      default: 0,
    },

    lastQuestDate: {
      type: Date,
      default: null,
    },

    character: {
      type: String,
      default: "flame",
    },

    achievements: {
      type: [String],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);