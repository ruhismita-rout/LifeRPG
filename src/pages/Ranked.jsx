import { useEffect, useState } from "react";
import RankBadge from "../components/RankBadge";
import ranks from "../data/ranks";
import "./Ranked.css";

import bronzeMedal from "../assets/medals/bronze.png";
import silverMedal from "../assets/medals/silver.png";
import goldMedal from "../assets/medals/gold.png";
import platinumMedal from "../assets/medals/platinum.png";
import diamondMedal from "../assets/medals/diamond.png";
import ascendantMedal from "../assets/medals/ascendant.png";
import heroicMedal from "../assets/medals/heroic.png";

import goldReward from "../assets/rewards/gold_reward.png";
import diamondFrame from "../assets/rewards/diamond_frame.png";
import heroicCrown from "../assets/rewards/heroic_crown.png";

const medalImages = {
  Bronze: bronzeMedal,
  Silver: silverMedal,
  Gold: goldMedal,
  Platinum: platinumMedal,
  Diamond: diamondMedal,
  Ascendant: ascendantMedal,
  Heroic: heroicMedal,
};
function Ranked() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const rp = user?.rp || 0;

  const currentRank = getCurrentRank(rp);
  const nextRank = getNextRank(rp);

  const progress = nextRank
    ? Math.min(
        100,
        ((rp - currentRank.min) /
          (nextRank.min - currentRank.min)) *
          100
      )
    : 100;

  const rpNeeded = nextRank
    ? Math.max(0, nextRank.min - rp)
    : 0;

  return (
    <div className="game-page">

      <GameNav user={user} />

      <main className="game-content">

        <div className="page-heading">
          <div>
            <p>SEASON 01</p>
            <h1>Ranked</h1>
          </div>
        </div>

        {/* CURRENT RANK */}

        <div className="game-panel rank-panel">

          <div className="big-rank">

            <RankBadge />

            <h2>
              {currentRank.name.toUpperCase()}
            </h2>

            <div className="rp">
              {rp} RP
            </div>

            <div
              style={{
                maxWidth: 500,
                margin: "20px auto",
              }}
            >
              <div className="progress">
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="rank-distance">
              {nextRank
                ? `${rpNeeded} RP TO ${nextRank.name.toUpperCase()}`
                : "MAX RANK ACHIEVED"}
            </div>

          </div>

        </div>

        {/* RANK ROAD */}

        <div className="rank-road">

          {ranks.map((rank) => (
            <div
              key={rank.name}
              className={`rank-node ${
                rank.name.toLowerCase() ===
                currentRank.name.toLowerCase()
                  ? "current"
                  : ""
              } ${
                rp >= rank.min
                  ? "unlocked"
                  : ""
              }`}
            >

<div className="mini-badge">
  <img
    src={medalImages[rank.name]}
    alt={`${rank.name} medal`}
  />
</div>

              <strong>
                {rank.name}
              </strong>

              <small
                style={{
                  display: "block",
                  color: "#8e969f",
                  marginTop: 8,
                }}
              >
                {rank.min === 0
                  ? "0+ RP"
                  : `${rank.min}+ RP`}
              </small>

            </div>
          ))}

        </div>

        {/* SEASON */}

        <div className="season-card">

          <p>SEASON 01</p>

          <h2>THE RISE</h2>

          <p style={{ color: "#8e969f" }}>
            Climb the ranked ladder before the
            season ends and unlock exclusive rewards.
          </p>

         <div className="reward-list">

  <Reward
    rank="GOLD"
    reward="350 GOLD"
    image={goldReward}
  />

  <Reward
    rank="DIAMOND"
    reward="DIAMOND FRAME"
    image={diamondFrame}
  />

  <Reward
    rank="HEROIC"
    reward="LEGENDARY TITLE"
    image={heroicCrown}
  />

</div>

        </div>

      </main>

    </div>
  );
}

/* ---------------- RANK HELPERS ---------------- */

function getCurrentRank(rp) {
  let current = ranks[0];

  for (const rank of ranks) {
    if (rp >= rank.min) {
      current = rank;
    }
  }

  return current;
}

function getNextRank(rp) {
  for (const rank of ranks) {
    if (rp < rank.min) {
      return rank;
    }
  }

  return null;
}

/* ---------------- REWARD ---------------- */

function Reward({ rank, reward, image }) {
  return (
    <div className="reward-card">

      <div className="reward-image">
        <img
          src={image}
          alt={reward}
        />
      </div>

      <h3>{rank}</h3>

      <p>{reward}</p>

    </div>
  );
}


/* ---------------- NAV ---------------- */

function GameNav({ user }) {
  return (
    <header className="game-nav">

      <a href="/lobby" className="logo">
        DONEZO<span>✦</span>
      </a>

      <nav className="game-nav-links">

        <a href="/lobby">
          LOBBY
        </a>

        <a href="/quests">
          QUESTS
        </a>

        <a
          href="/ranked"
          className="active"
        >
          RANKED
        </a>

        <a href="/leaderboard">
          LEADERBOARD
        </a>

      </nav>

      <div className="player-mini">

        <div className="player-avatar">
          🧙
        </div>

        <div>
          <strong>
            {user?.username || "PLAYER"}
          </strong>

          <small>
            Lv. {user?.level || 1}
          </small>
        </div>

      </div>

    </header>
  );
}

export default Ranked;