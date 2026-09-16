import { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";
import "./Achievements.css";

const achievementsList = [
  {
    id: "FIRST_QUEST",
    icon: "⚔️",
    name: "FIRST QUEST",
    description: "Complete your first quest.",
    reward: 50,
  },
  {
    id: "QUEST_WARRIOR",
    icon: "🗡️",
    name: "QUEST WARRIOR",
    description: "Complete 10 quests.",
    reward: 100,
  },
  {
    id: "QUEST_MASTER",
    icon: "👑",
    name: "QUEST MASTER",
    description: "Complete 50 quests.",
    reward: 250,
  },
  {
    id: "ON_FIRE",
    icon: "🔥",
    name: "ON FIRE",
    description: "Maintain a 3-day streak.",
    reward: 75,
  },
  {
    id: "UNSTOPPABLE",
    icon: "🔥",
    name: "UNSTOPPABLE",
    description: "Maintain a 7-day streak.",
    reward: 150,
  },
  {
    id: "DIAMOND_HANDS",
    icon: "💎",
    name: "DIAMOND HANDS",
    description: "Reach Diamond rank.",
    reward: 300,
  },
  {
    id: "LEGEND",
    icon: "🏆",
    name: "LEGEND",
    description: "Reach Heroic rank.",
    reward: 500,
  },
  {
    id: "GOLD_HOARDER",
    icon: "🪙",
    name: "GOLD HOARDER",
    description: "Collect 1,000 gold.",
    reward: 200,
  },
];

function Achievements() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const savedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (!savedUser?.id) {
          setLoading(false);
          return;
        }

        const data = await getUserProfile(
          savedUser.id
        );

        setUser(data);
      } catch (error) {
        console.error(
          "ACHIEVEMENTS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="achievements-page">
        <div className="achievement-loading">
          LOADING ACHIEVEMENTS...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="achievements-page">
        <div className="achievement-empty">
          <h1>PLAYER NOT FOUND</h1>
          <p>
            Log in to view your achievements.
          </p>
        </div>
      </div>
    );
  }

  const unlocked =
    user.achievements || [];

  const unlockedCount =
    achievementsList.filter((achievement) =>
      unlocked.includes(achievement.id)
    ).length;

  return (
    <div className="achievements-page">
      <header className="achievements-header">
        <div>
          <p className="achievement-eyebrow">
            DONEZO // ACHIEVEMENTS
          </p>

          <h1>YOUR LEGACY</h1>

          <p className="achievement-subtitle">
            Complete quests. Unlock milestones.
            Build your legend.
          </p>
        </div>

        <div className="achievement-counter">
          <strong>
            {unlockedCount} / {achievementsList.length}
          </strong>

          <span>UNLOCKED</span>
        </div>
      </header>

      <div className="achievement-grid">
        {achievementsList.map(
          (achievement) => {
            const isUnlocked =
              unlocked.includes(
                achievement.id
              );

            return (
              <div
                key={achievement.id}
                className={`achievement-card ${
                  isUnlocked
                    ? "unlocked"
                    : "locked"
                }`}
              >
                <div className="achievement-icon">
                  {isUnlocked
                    ? achievement.icon
                    : "🔒"}
                </div>

                <div className="achievement-info">
                  <span className="achievement-status">
                    {isUnlocked
                      ? "✓ UNLOCKED"
                      : "LOCKED"}
                  </span>

                  <h2>
                    {achievement.name}
                  </h2>

                  <p>
                    {achievement.description}
                  </p>

                  <div className="achievement-reward">
                    🪙 +{achievement.reward} GOLD
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default Achievements;