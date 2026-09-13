import { Link } from "react-router-dom";
import hero from "../assets/characters/flame.png";

export default function Landing() {
  return (
    <div className="ascend">

      {/* ================= TOP BAR ================= */}

      <header className="topbar">

        <Link to="/" className="logo">
          <span>✦</span>
          ASCEND
        </Link>

        <nav className="top-nav">
          <Link className="active" to="/">HOME</Link>
          <Link to="/quests">QUESTS</Link>
          <Link to="/ranked">RANKED</Link>
          <Link to="/leaderboard">LEADERBOARD</Link>
          <Link to="/lobby">CHARACTER</Link>
        </nav>

        {/* ================= LOGIN / SIGN UP ================= */}

        <div className="auth-buttons">
          <Link to="/login" className="login-btn">
            LOGIN
          </Link>

          <Link to="/signup" className="signup-btn">
            SIGN UP
          </Link>
        </div>

      </header>


      {/* ================= GAME WORLD ================= */}

      <main className="game-world">

        {/* Background decoration */}

        <div className="sun" />

        <div className="mountains mountain-back" />
        <div className="mountains mountain-front" />

        <div className="forest forest-left" />
        <div className="forest forest-right" />

        <div className="leaf leaf-one">✦</div>
        <div className="leaf leaf-two">✦</div>
        <div className="leaf leaf-three">◆</div>

        <div className="bird bird-one">⌁</div>
        <div className="bird bird-two">⌁</div>


        {/* ================= LEFT HUD ================= */}

        <aside className="left-hud">

          {/* Season */}

          <section className="game-card season-card">

            <div className="season-top">

              <div>
                <span>SEASON 01</span>
                <h1>THE RISE</h1>
              </div>

              <div className="season-badge">
                ✦
              </div>

            </div>

            <div className="progress-title">
              <span>SEASON PROGRESS</span>
              <b>68%</b>
            </div>

            <div className="bar">
              <div className="bar-gold season-progress" />
            </div>

          </section>


          {/* Streak / Energy */}

          <div className="stat-grid">

            <section className="game-card stat-card streak">
              <span className="stat-icon">🔥</span>
              <small>STREAK</small>
              <strong>9 DAYS</strong>
            </section>

            <section className="game-card stat-card">
              <span className="stat-icon">⚡</span>
              <small>ENERGY</small>
              <strong>82%</strong>
            </section>

          </div>


          {/* Attributes */}

          <section className="game-card attributes">

            <h3>CHARACTER ATTRIBUTES</h3>

            <Attribute
              name="DISCIPLINE"
              value={82}
            />

            <Attribute
              name="FOCUS"
              value={74}
            />

            <Attribute
              name="ENERGY"
              value={91}
            />

          </section>

        </aside>


        {/* ================= CENTER CHARACTER ================= */}

        <section className="hero-area">

          <div className="hero-sun" />

          <div className="hero-ring ring-one" />
          <div className="hero-ring ring-two" />

          <div className="character-glow" />

          <img
            src={hero}
            alt="Ascend character"
            className="hero-character"
          />

          <div className="hero-platform">
            <span />
            <span />
            <span />
          </div>

          <div className="character-label">

            <span>✦ EPIC CHARACTER</span>

            <h2>FLAME WARDEN</h2>

            <p>THE RISING ONE</p>

          </div>

        </section>


        {/* ================= RIGHT HUD ================= */}

        <aside className="right-hud">

          {/* Rank */}

          <section className="game-card rank-card">

            <div className="panel-heading">
              <span>CURRENT RANK</span>
              <b>RANKED</b>
            </div>

            <div className="rank-content">

              <div className="rank-badge">
                <span>✦</span>
              </div>

              <div>
                <h2>DIAMOND III</h2>
                <strong>2348 RP</strong>
              </div>

            </div>

            <div className="progress-title">
              <span>DIAMOND II</span>
              <b>52 RP</b>
            </div>

            <div className="bar">
              <div className="rank-progress" />
            </div>

          </section>


          {/* Missions */}

          <section className="game-card missions">

            <div className="mission-heading">

              <h2>DAILY MISSIONS</h2>

              <span>2 / 3</span>

            </div>


            <Mission
              completed
              title="Morning Workout"
              description="Completed"
              reward="+60 XP"
            />

            <Mission
              title="Study React"
              description="Not completed"
              reward="+80 XP"
            />

            <Mission
              title="Read 20 Pages"
              description="Not completed"
              reward="+45 XP"
            />


            <Link
              to="/quests"
              className="quest-button"
            >
              OPEN QUEST BOARD →
            </Link>

          </section>

        </aside>


        {/* ================= MAIN CTA ================= */}

        <Link
          to="/quests"
          className="daily-run"
        >

          <span className="play-icon">
            ▶
          </span>

          <strong>
            START DAILY RUN
          </strong>

          <b>
            +125 XP
          </b>

        </Link>


        <div className="quote">
          DISCIPLINE BUILDS FREEDOM
        </div>

      </main>


      {/* ================= BOTTOM NAV ================= */}

      <footer className="bottom-nav">

        <NavItem
          to="/"
          icon="⌂"
          label="HOME"
          active
        />

        <NavItem
          to="/quests"
          icon="⚔"
          label="QUESTS"
        />

        <NavItem
          to="/ranked"
          icon="◆"
          label="RANKED"
        />

        <NavItem
          to="/leaderboard"
          icon="♛"
          label="LEADERBOARD"
        />

        <NavItem
          to="/lobby"
          icon="◉"
          label="CHARACTER"
        />

      </footer>

    </div>
  );
}


/* ================= ATTRIBUTE ================= */

function Attribute({ name, value }) {
  return (
    <div className="attribute">

      <div className="attribute-heading">
        <span>{name}</span>
        <b>{value}</b>
      </div>

      <div className="attribute-bar">
        <div
          style={{ width: `${value}%` }}
        />
      </div>

    </div>
  );
}


/* ================= MISSION ================= */

function Mission({
  title,
  description,
  reward,
  completed
}) {
  return (
    <div className="mission">

      <div
        className={`mission-check ${
          completed ? "completed" : ""
        }`}
      >
        {completed ? "✓" : "+"}
      </div>

      <div className="mission-info">

        <strong>{title}</strong>

        <small>{description}</small>

      </div>

      <b className="mission-reward">
        {reward}
      </b>

    </div>
  );
}


/* ================= NAV ITEM ================= */

function NavItem({
  to,
  icon,
  label,
  active
}) {
  return (
    <Link
      to={to}
      className={`nav-item ${
        active ? "active" : ""
      }`}
    >

      <span>{icon}</span>

      <small>{label}</small>

    </Link>
  );
}