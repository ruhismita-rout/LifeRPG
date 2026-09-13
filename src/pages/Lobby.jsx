import { useNavigate } from "react-router-dom";
import hero from "../assets/characters/flame.png";
import "./Lobby.css";

function Lobby() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");
  const user = savedUser
    ? JSON.parse(savedUser)
    : {
        username: "PLAYER",
        level: 1,
        xp: 0,
        gold: 100,
        rank: "BRONZE",
        rp: 0,
      };

  const xpNeeded = user.level * 100;
  const xpPercent = Math.min(
    (user.xp / xpNeeded) * 100,
    100
  );

  return (
    <div className="lobby">

      {/* TOP HUD */}
      <header className="lobby-header">

        <div className="lobby-logo">
          <span>ASCEND</span>
          <small>PLAYER LOBBY</small>
        </div>

        <div className="player-stats">

          <div className="stat">
            <span>LVL</span>
            <strong>{user.level}</strong>
          </div>

          <div className="stat">
            <span>XP</span>
            <strong>{user.xp}/{xpNeeded}</strong>
          </div>

          <div className="stat gold-stat">
            <span>◆</span>
            <strong>{user.gold}</strong>
          </div>

          <div className="player-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>

        </div>

      </header>


      {/* MAIN GAME AREA */}
      <main className="lobby-main">

        {/* LEFT PANEL */}
        <section className="lobby-left">

          <div className="welcome-text">
            <span className="eyebrow">
              WELCOME BACK, PLAYER
            </span>

            <h1>
              {user.username?.toUpperCase()}
            </h1>

            <p>
              Your next level is waiting.
            </p>
          </div>


          {/* RANK CARD */}
          <div className="rank-panel">

            <div className="panel-label">
              CURRENT RANK
            </div>

            <div className="rank-main">
              <div className="rank-icon">
                ◆
              </div>

              <div>
                <h2>{user.rank || "BRONZE"}</h2>

                <p>
                  {user.rp || 0} RP
                </p>
              </div>
            </div>

            <div className="rank-progress">
              <div
                style={{
                  width: `${Math.min(
                    ((user.rp || 0) / 100) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <small>
              Keep completing quests to rank up.
            </small>

          </div>


          {/* XP CARD */}
          <div className="xp-panel">

            <div className="xp-header">
              <span>LEVEL {user.level}</span>
              <span>
                {user.xp}/{xpNeeded} XP
              </span>
            </div>

            <div className="xp-bar">
              <div
                style={{
                  width: `${xpPercent}%`,
                }}
              />
            </div>

            <p>
              {xpNeeded - user.xp} XP until next level
            </p>

          </div>

        </section>


        {/* CHARACTER */}
        <section className="character-zone">

          <div className="character-rings">
            <div className="ring ring-one" />
            <div className="ring ring-two" />
            <div className="ring ring-three" />
          </div>

          <div className="character-glow" />

          <img
            src={hero}
            alt="ASCEND character"
            className="lobby-character"
          />

          <div className="character-platform">
            <span />
          </div>

          <div className="character-name">
            <span>PLAYER CHARACTER</span>
            <strong>{user.username}</strong>
          </div>

        </section>


        {/* RIGHT PANEL */}
        <section className="lobby-right">

          <div className="mission-card">

            <div className="card-top">
              <span>DAILY RUN</span>
              <strong>01</strong>
            </div>

            <h2>
              BUILD YOUR STREAK
            </h2>

            <p>
              Complete today's quests and
              keep your progression alive.
            </p>

            <button
              onClick={() => navigate("/quests")}
            >
              VIEW QUESTS
              <span>→</span>
            </button>

          </div>


          <div className="quick-menu">

            <button onClick={() => navigate("/quests")}>
              <span>⚔</span>
              <div>
                <strong>QUESTS</strong>
                <small>Complete missions</small>
              </div>
            </button>

            <button onClick={() => navigate("/ranked")}>
              <span>◆</span>
              <div>
                <strong>RANKED</strong>
                <small>Climb the ladder</small>
              </div>
            </button>

            <button onClick={() => navigate("/leaderboard")}>
              <span>♜</span>
              <div>
                <strong>LEADERBOARD</strong>
                <small>Compare your progress</small>
              </div>
            </button>

          </div>

        </section>

      </main>


      {/* BOTTOM NAV */}
      <nav className="lobby-nav">

        <button className="active">
          <span>⌂</span>
          LOBBY
        </button>

        <button onClick={() => navigate("/quests")}>
          <span>⚔</span>
          QUESTS
        </button>

        <button onClick={() => navigate("/ranked")}>
          <span>◆</span>
          RANKED
        </button>

        <button onClick={() => navigate("/leaderboard")}>
          <span>♜</span>
          LEADERBOARD
        </button>

      </nav>

    </div>
  );
}

export default Lobby;