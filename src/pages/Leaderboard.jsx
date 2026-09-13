import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";
import "./Leaderboard.css";

import bronzeMedal from "../assets/medals/bronze.png";
import silverMedal from "../assets/medals/silver.png";
import goldMedal from "../assets/medals/gold.png";
import platinumMedal from "../assets/medals/platinum.png";
import diamondMedal from "../assets/medals/diamond.png";
import ascendantMedal from "../assets/medals/ascendant.png";
import heroicMedal from "../assets/medals/heroic.png";

const medalImages = {
  BRONZE: bronzeMedal,
  SILVER: silverMedal,
  GOLD: goldMedal,
  PLATINUM: platinumMedal,
  DIAMOND: diamondMedal,
  ASCENDANT: ascendantMedal,
  HEROIC: heroicMedal,
};

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser =
    JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getLeaderboard();
      setPlayers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="leaderboard-page">

      {/* NAV */}

      <header className="leaderboard-nav">

        <a href="/lobby" className="lb-logo">
          DONEZO<span>✦</span>
        </a>

        <nav>
          <a href="/lobby">LOBBY</a>
          <a href="/quests">QUESTS</a>
          <a href="/ranked">RANKED</a>
          <a href="/leaderboard" className="active">
            LEADERBOARD
          </a>
        </nav>

        <div className="lb-player">
          <strong>
            {currentUser?.username || "PLAYER"}
          </strong>

          <small>
            Lv. {currentUser?.level || 1}
          </small>
        </div>

      </header>

      <main className="leaderboard-content">

        {/* HEADING */}

        <div className="lb-heading">
          <p>SEASON 01 // GLOBAL RANKINGS</p>

          <h1>LEADERBOARD</h1>

          <span>
            The strongest players climb to the top.
          </span>
        </div>

        {/* ERROR */}

        {error && (
          <div className="lb-error">
            ⚠ {error}
          </div>
        )}

        {/* TOP THREE */}

        {!loading && players.length >= 3 && (
          <section className="podium">

            {/* SECOND */}

            <div className="podium-player second">

              <div className="podium-medal">
                <img
                  src={medalImages[players[1].rank]}
                  alt=""
                />
              </div>

              <span className="podium-position">
                #2
              </span>

              <h2>{players[1].username}</h2>

              <p>{players[1].rank}</p>

              <strong>
                {players[1].rp} RP
              </strong>

            </div>

            {/* FIRST */}

            <div className="podium-player first">

              <div className="crown">♛</div>

              <div className="podium-medal large">
                <img
                  src={medalImages[players[0].rank]}
                  alt=""
                />
              </div>

              <span className="podium-position">
                #1
              </span>

              <h2>{players[0].username}</h2>

              <p>{players[0].rank}</p>

              <strong>
                {players[0].rp} RP
              </strong>

            </div>

            {/* THIRD */}

            <div className="podium-player third">

              <div className="podium-medal">
                <img
                  src={medalImages[players[2].rank]}
                  alt=""
                />
              </div>

              <span className="podium-position">
                #3
              </span>

              <h2>{players[2].username}</h2>

              <p>{players[2].rank}</p>

              <strong>
                {players[2].rp} RP
              </strong>

            </div>

          </section>
        )}

        {/* TABLE */}

        <section className="leaderboard-card">

          <div className="lb-table-header">
            <span>RANK</span>
            <span>PLAYER</span>
            <span>LEVEL</span>
            <span>RANK</span>
            <span>RP</span>
          </div>

          {loading ? (
            <div className="lb-loading">
              <div>⚔️</div>
              <h2>LOADING RANKINGS</h2>
              <p>Finding the strongest players...</p>
            </div>
          ) : players.length === 0 ? (
            <div className="lb-loading">
              <div>🏆</div>
              <h2>NO PLAYERS YET</h2>
              <p>Complete quests to enter the rankings.</p>
            </div>
          ) : (
            players.map((player) => {

              const isMe =
                player.id?.toString() ===
                currentUser?.id?.toString();

              return (
                <div
                  className={`lb-row ${
                    isMe ? "current-player" : ""
                  }`}
                  key={player.id}
                >

                  <div className="position">
                    {player.position <= 3
                      ? ["🥇", "🥈", "🥉"][
                          player.position - 1
                        ]
                      : `#${player.position}`}
                  </div>

                  <div className="player-cell">

                    <div className="table-medal">
                      <img
                        src={medalImages[player.rank]}
                        alt=""
                      />
                    </div>

                    <div>
                      <strong>
                        {player.username}
                        {isMe && (
                          <span className="you-tag">
                            YOU
                          </span>
                        )}
                      </strong>

                      <small>
                        {player.character || "flame"} warrior
                      </small>
                    </div>

                  </div>

                  <div className="level">
                    LV. {player.level}
                  </div>

                  <div className="rank-cell">
                    {player.rank}
                  </div>

                  <div className="rp-cell">
                    {player.rp}
                    <small> RP</small>
                  </div>

                </div>
              );
            })
          )}

        </section>

      </main>

    </div>
  );
}

export default Leaderboard;