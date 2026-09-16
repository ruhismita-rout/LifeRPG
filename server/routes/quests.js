import express from "express";
import Quest from "../models/Quest.js";
import User from "../models/User.js";

const router = express.Router();

/* ---------------- HELPERS ---------------- */

function getDateKey(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

function calculateRank(rp) {
  if (rp >= 4000) return "HEROIC";
  if (rp >= 3000) return "ASCENDANT";
  if (rp >= 2200) return "DIAMOND";
  if (rp >= 1500) return "PLATINUM";
  if (rp >= 1000) return "GOLD";
  if (rp >= 500) return "SILVER";

  return "BRONZE";
}

/*
  Check and unlock achievements.
  Returns an array containing only newly unlocked achievements.
*/
async function checkAchievements(user) {
  const unlocked = [];

  // Make sure old users have the field
  if (!Array.isArray(user.achievements)) {
    user.achievements = [];
  }

  // Count every quest completion belonging to this user
  const quests = await Quest.find()
    .select("completions");

  let completedQuestCount = 0;

  for (const quest of quests) {
    for (const completion of quest.completions || []) {
      if (
        completion.user.toString() ===
        user._id.toString()
      ) {
        completedQuestCount++;
      }
    }
  }

  /* ---------- FIRST QUEST ---------- */

  if (
    completedQuestCount >= 1 &&
    !user.achievements.includes("FIRST_QUEST")
  ) {
    user.achievements.push("FIRST_QUEST");
    user.gold += 50;
    unlocked.push({
      id: "FIRST_QUEST",
      name: "FIRST QUEST",
      reward: 50,
    });
  }

  /* ---------- QUEST WARRIOR ---------- */

  if (
    completedQuestCount >= 10 &&
    !user.achievements.includes("QUEST_WARRIOR")
  ) {
    user.achievements.push("QUEST_WARRIOR");
    user.gold += 100;
    unlocked.push({
      id: "QUEST_WARRIOR",
      name: "QUEST WARRIOR",
      reward: 100,
    });
  }

  /* ---------- QUEST MASTER ---------- */

  if (
    completedQuestCount >= 50 &&
    !user.achievements.includes("QUEST_MASTER")
  ) {
    user.achievements.push("QUEST_MASTER");
    user.gold += 250;
    unlocked.push({
      id: "QUEST_MASTER",
      name: "QUEST MASTER",
      reward: 250,
    });
  }

  /* ---------- 3 DAY STREAK ---------- */

  if (
    user.streak >= 3 &&
    !user.achievements.includes("ON_FIRE")
  ) {
    user.achievements.push("ON_FIRE");
    user.gold += 75;
    unlocked.push({
      id: "ON_FIRE",
      name: "ON FIRE",
      reward: 75,
    });
  }

  /* ---------- 7 DAY STREAK ---------- */

  if (
    user.streak >= 7 &&
    !user.achievements.includes("UNSTOPPABLE")
  ) {
    user.achievements.push("UNSTOPPABLE");
    user.gold += 150;
    unlocked.push({
      id: "UNSTOPPABLE",
      name: "UNSTOPPABLE",
      reward: 150,
    });
  }

  /* ---------- DIAMOND ---------- */

  if (
    user.rank === "DIAMOND" ||
    user.rank === "ASCENDANT" ||
    user.rank === "HEROIC"
  ) {
    if (!user.achievements.includes("DIAMOND_HANDS")) {
      user.achievements.push("DIAMOND_HANDS");
      user.gold += 300;
      unlocked.push({
        id: "DIAMOND_HANDS",
        name: "DIAMOND HANDS",
        reward: 300,
      });
    }
  }

  /* ---------- HEROIC ---------- */

  if (
    user.rank === "HEROIC" &&
    !user.achievements.includes("LEGEND")
  ) {
    user.achievements.push("LEGEND");
    user.gold += 500;
    unlocked.push({
      id: "LEGEND",
      name: "LEGEND",
      reward: 500,
    });
  }

  /* ---------- GOLD HOARDER ---------- */

  if (
    user.gold >= 1000 &&
    !user.achievements.includes("GOLD_HOARDER")
  ) {
    user.achievements.push("GOLD_HOARDER");
    user.gold += 200;
    unlocked.push({
      id: "GOLD_HOARDER",
      name: "GOLD HOARDER",
      reward: 200,
    });
  }

  return unlocked;
}

/*
  Recalculate the user's daily streak from actual
  daily quest completion history.
*/
async function recalculateStreak(user) {
  const dailyQuests = await Quest.find({ type: "DAILY" })
    .select("completions");

  const completedDays = new Set();

  for (const quest of dailyQuests) {
    for (const completion of quest.completions || []) {
      if (
        completion.user.toString() ===
        user._id.toString()
      ) {
        completedDays.add(
          getDateKey(completion.completedAt)
        );
      }
    }
  }

  if (completedDays.size === 0) {
    user.streak = 0;
    user.lastQuestDate = null;
    return;
  }

  const today = new Date();
  const todayKey = getDateKey(today);

  const yesterday = new Date(today);
  yesterday.setUTCDate(
    yesterday.getUTCDate() - 1
  );

  const yesterdayKey = getDateKey(yesterday);

  /*
    If the user hasn't completed anything today,
    their active streak can still continue from yesterday.
  */
  let currentDate;

  if (completedDays.has(todayKey)) {
    currentDate = today;
  } else if (completedDays.has(yesterdayKey)) {
    currentDate = yesterday;
  } else {
    user.streak = 0;

    const dates = [...completedDays]
      .sort()
      .reverse();

    user.lastQuestDate = new Date(
      `${dates[0]}T00:00:00.000Z`
    );

    return;
  }

  let streak = 0;

  while (
    completedDays.has(
      getDateKey(currentDate)
    )
  ) {
    streak++;

    const previousDay = new Date(currentDate);

    previousDay.setUTCDate(
      previousDay.getUTCDate() - 1
    );

    currentDate = previousDay;
  }

  user.streak = streak;

  const latestDate = [...completedDays]
    .sort()
    .reverse()[0];

  user.lastQuestDate = new Date(
    `${latestDate}T00:00:00.000Z`
  );
}

/* ---------------- GET ALL QUESTS ---------------- */

router.get("/", async (req, res) => {
  try {
    const quests = await Quest.find()
      .sort({ createdAt: -1 });

    res.json(quests);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not load quests",
    });
  }
});

/* ---------------- CREATE QUEST ---------------- */

router.post("/", async (req, res) => {
  try {
    console.log("CREATE QUEST BODY:", req.body);

    const {
      title,
      description,
      category,
      type,
      difficulty,
      xp,
      gold,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Quest title is required",
      });
    }

    const quest = await Quest.create({
      title,
      description: description || "",
      category: category || "GENERAL",
      type: type || "DAILY",
      difficulty: Number(difficulty) || 1,
      xp: Number(xp) || 20,
      gold: Number(gold) || 10,
    });

    console.log("QUEST CREATED:", quest._id);

    res.status(201).json(quest);
  } catch (error) {
    console.error("CREATE QUEST ERROR:", error);

    res.status(500).json({
      message: error.message || "Could not create quest",
      error: error.name || "UnknownError",
    });
  }
});



/* ---------------- DELETE QUEST ---------------- */

router.delete("/:questId", async (req, res) => {
  try {
    const quest = await Quest.findById(
      req.params.questId
    );

    if (!quest) {
      return res.status(404).json({
        message: "Quest not found",
      });
    }

    await Quest.findByIdAndDelete(
      req.params.questId
    );

    res.json({
      message: "Quest deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not delete quest",
    });
  }
});

/* ---------------- COMPLETE / UNDO ---------------- */

router.post(
  "/:questId/complete",
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      const quest = await Quest.findById(
        req.params.questId
      );

      const user = await User.findById(userId);

      if (!quest) {
        return res.status(404).json({
          message: "Quest not found",
        });
      }

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const todayKey = getDateKey();

      /* ---------- DAILY QUEST ---------- */

      if (quest.type === "DAILY") {
        const completionIndex =
          quest.completions.findIndex(
            (completion) =>
              completion.user.toString() ===
                user._id.toString() &&
              getDateKey(
                completion.completedAt
              ) === todayKey
          );

        /* ----- UNDO TODAY'S DAILY QUEST ----- */

        if (completionIndex !== -1) {
          quest.completions.splice(
            completionIndex,
            1
          );

          await quest.save();

          user.xp -= quest.xp;
          user.gold -= quest.gold;
          user.rp -= Math.round(
            quest.xp / 4
          );

          user.gold = Math.max(
            0,
            user.gold
          );

          user.rp = Math.max(
            0,
            user.rp
          );

          while (
            user.xp < 0 &&
            user.level > 1
          ) {
            user.level -= 1;
            user.xp += user.level * 100;
          }

          user.xp = Math.max(
            0,
            user.xp
          );

          user.rank = calculateRank(
            user.rp
          );

          await recalculateStreak(user);

          await user.save();

          return res.json({
            message:
              "Daily quest completion undone",

            undone: true,

            user: {
              id: user._id,
              username: user.username,
              level: user.level,
              xp: user.xp,
              gold: user.gold,
              rp: user.rp,
              rank: user.rank,
              streak: user.streak,
              lastQuestDate:
                user.lastQuestDate,
              achievements:
                user.achievements || [],
            },
          });
        }

        /* ----- COMPLETE DAILY QUEST ----- */

        quest.completions.push({
          user: user._id,
          completedAt: new Date(),
        });

        await quest.save();

        const rpReward = Math.round(
          quest.xp / 4
        );

        user.xp += quest.xp;
        user.gold += quest.gold;
        user.rp += rpReward;

        let levelUps = 0;

        while (
          user.xp >= user.level * 100
        ) {
          user.xp -= user.level * 100;
          user.level += 1;
          levelUps++;
        }

        user.rank = calculateRank(
          user.rp
        );

        await recalculateStreak(user);

        const newAchievements =
          await checkAchievements(user);

        await user.save();

        return res.json({
          message:
            "Daily quest completed!",

          undone: false,

          rewards: {
            xp: quest.xp,
            gold: quest.gold,
            rp: rpReward,
          },

          achievements:
            newAchievements,

          levelUps,

          user: {
            id: user._id,
            username: user.username,
            level: user.level,
            xp: user.xp,
            gold: user.gold,
            rp: user.rp,
            rank: user.rank,
            streak: user.streak,
            lastQuestDate:
              user.lastQuestDate,
            achievements:
              user.achievements || [],
          },
        });
      }

      /* ---------- EPIC / SIDE QUEST ---------- */

      const completionIndex =
        quest.completions.findIndex(
          (completion) =>
            completion.user.toString() ===
            user._id.toString()
        );

      /* ----- UNDO EPIC / SIDE ----- */

      if (completionIndex !== -1) {
        quest.completions.splice(
          completionIndex,
          1
        );

        await quest.save();

        user.xp -= quest.xp;
        user.gold -= quest.gold;
        user.rp -= Math.round(
          quest.xp / 4
        );

        user.gold = Math.max(
          0,
          user.gold
        );

        user.rp = Math.max(
          0,
          user.rp
        );

        while (
          user.xp < 0 &&
          user.level > 1
        ) {
          user.level -= 1;
          user.xp += user.level * 100;
        }

        user.xp = Math.max(
          0,
          user.xp
        );

        user.rank = calculateRank(
          user.rp
        );

        await user.save();

        return res.json({
          message:
            "Quest completion undone",

          undone: true,

          user: {
            id: user._id,
            username: user.username,
            level: user.level,
            xp: user.xp,
            gold: user.gold,
            rp: user.rp,
            rank: user.rank,
            streak: user.streak,
            lastQuestDate:
              user.lastQuestDate,
            achievements:
              user.achievements || [],
          },
        });
      }

      /* ----- COMPLETE EPIC / SIDE ----- */

      quest.completions.push({
        user: user._id,
        completedAt: new Date(),
      });

      await quest.save();

      const rpReward = Math.round(
        quest.xp / 4
      );

      user.xp += quest.xp;
      user.gold += quest.gold;
      user.rp += rpReward;

      let levelUps = 0;

      while (
        user.xp >= user.level * 100
      ) {
        user.xp -= user.level * 100;
        user.level += 1;
        levelUps++;
      }

      user.rank = calculateRank(
        user.rp
      );

      const newAchievements =
        await checkAchievements(user);

      await user.save();

      return res.json({
        message: "Quest completed!",

        undone: false,

        rewards: {
          xp: quest.xp,
          gold: quest.gold,
          rp: rpReward,
        },

        achievements:
          newAchievements,

        levelUps,

        user: {
          id: user._id,
          username: user.username,
          level: user.level,
          xp: user.xp,
          gold: user.gold,
          rp: user.rp,
          rank: user.rank,
          streak: user.streak,
          lastQuestDate:
            user.lastQuestDate,
          achievements:
            user.achievements || [],
        },
      });
    } catch (error) {
      console.error("COMPLETE QUEST ERROR:", error);

      res.status(500).json({
        message: error.message || "Could not update quest",
      });
    }
  }
);

export default router;