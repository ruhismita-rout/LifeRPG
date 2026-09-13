import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("username level xp gold rank rp character")
      .sort({
        rp: -1,
        level: -1,
        xp: -1,
      })
      .limit(100);

    const leaderboard = users.map((user, index) => ({
      position: index + 1,
      id: user._id,
      username: user.username,
      level: user.level,
      xp: user.xp,
      gold: user.gold,
      rank: user.rank,
      rp: user.rp,
      character: user.character,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not load leaderboard",
    });
  }
});

export default router;