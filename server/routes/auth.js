import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Character created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        rank: user.rank,
        rp: user.rp,
        character: user.character,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        rank: user.rank,
        rp: user.rp,
        character: user.character,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});


// CHANGE CHARACTER
router.put("/character", async (req, res) => {
  try {
    const { userId, character } = req.body;

    if (!userId || !character) {
      return res.status(400).json({
        message: "User ID and character are required",
      });
    }

    const allowedCharacters = [
      "blue",
      "demon",
      "dragon",
      "fire",
      "flame",
      "forest",
      "fox",
      "owl",
      "shadow",
      "spider",
      "tech",
      "violet",
    ];

    if (!allowedCharacters.includes(character)) {
      return res.status(400).json({
        message: "Invalid character",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { character },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Character updated successfully",
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        rank: user.rank,
        rp: user.rp,
        character: user.character,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not update character",
    });
  }
});

/* ---------------- GET USER PROFILE ---------------- */

router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "username level xp gold rp rank streak character achievements"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      id: user._id,
      username: user.username,
      level: user.level,
      xp: user.xp,
      gold: user.gold,
      rp: user.rp,
      rank: user.rank,
      streak: user.streak,
      character: user.character,
      achievements: user.achievements || [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not load user",
    });
  }
});
/* ---------------- GET USER PROFILE ---------------- */

router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "username level xp gold rp rank streak character achievements"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      id: user._id,
      username: user.username,
      level: user.level,
      xp: user.xp,
      gold: user.gold,
      rp: user.rp,
      rank: user.rank,
      streak: user.streak,
      character: user.character,
      achievements: user.achievements || [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not load user",
    });
  }
});

export default router;