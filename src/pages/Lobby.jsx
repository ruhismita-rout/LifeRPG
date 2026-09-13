import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateCharacter } from "../services/api";
import "./Lobby.css";

import blue from "../assets/characters/blue.png";
import demon from "../assets/characters/demon.png";
import dragon from "../assets/characters/dragon.png";
import fire from "../assets/characters/fire.png";
import flame from "../assets/characters/flame.png";
import forest from "../assets/characters/forest.png";
import fox from "../assets/characters/fox.png";
import owl from "../assets/characters/owl.png";
import shadow from "../assets/characters/shadow.png";
import spider from "../assets/characters/spider.png";
import tech from "../assets/characters/tech.png";
import violet from "../assets/characters/violet.png";

const characters = [
  { name: "Blue", id: "blue", image: blue },
  { name: "Demon", id: "demon", image: demon },
  { name: "Dragon", id: "dragon", image: dragon },
  { name: "Fire", id: "fire", image: fire },
  { name: "Flame", id: "flame", image: flame },
  { name: "Forest", id: "forest", image: forest },
  { name: "Fox", id: "fox", image: fox },
  { name: "Owl", id: "owl", image: owl },
  { name: "Shadow", id: "shadow", image: shadow },
  { name: "Spider", id: "spider", image: spider },
  { name: "Tech", id: "tech", image: tech },
  { name: "Violet", id: "violet", image: violet },
];

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
        character: "flame",
      };

  const [showCharacters, setShowCharacters] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState(
    user.character || "flame"
  );

  const [savingCharacter, setSavingCharacter] = useState(false);

  const currentCharacter =
    characters.find(
      (character) => character.id === selectedCharacter
    ) ||
    characters.find(
      (character) => character.id === "flame"
    );

  const xpNeeded = user.level * 100;

  const xpPercent = Math.min(
    (user.xp / xpNeeded) * 100,
    100
  );

  async function handleCharacterChange(characterId) {
    setSelectedCharacter(characterId);

    if (!user.id) {
      const updatedUser = {
        ...user,
        character: characterId,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setShowCharacters(false);

      return;
    }

    try {
      setSavingCharacter(true);

      const data = await updateCharacter(
        user.id,
        characterId
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setSelectedCharacter(data.user.character);

      setShowCharacters(false);

    } catch (error) {
      console.error(
        "CHARACTER CHANGE ERROR:",
        error
      );

      alert(
        error.message ||
          "Could not change character."
      );
    } finally {
      setSavingCharacter(false);
    }
  }

  return (
    <div className="lobby">

      {/* ================= TOP HUD ================= */}

      <header className="lobby-header">

        <div className="lobby-logo">
          <span>DONEZO</span>
          <small>PLAYER LOBBY</small>
        </div>

        <div className="player-stats">

          <div className="stat">
            <span>LVL</span>
            <strong>{user.level}</strong>
          </div>

          <div className="stat">
            <span>XP</span>
            <strong>
              {user.xp}/{xpNeeded}
            </strong>
          </div>

          <div className="stat gold-stat">
            <span>◆</span>
            <strong>{user.gold}</strong>
          </div>

          <div className="player-avatar">
            {user.username
              ?.charAt(0)
              .toUpperCase()}
          </div>

        </div>

      </header>


      {/* ================= MAIN GAME AREA ================= */}

      <main className="lobby-main">

        {/* ================= LEFT PANEL ================= */}

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

                <h2>
                  {user.rank || "BRONZE"}
                </h2>

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

              <span>
                LEVEL {user.level}
              </span>

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
              {Math.max(
                xpNeeded - user.xp,
                0
              )}{" "}
              XP until next level
            </p>

          </div>

        </section>


        {/* ================= CHARACTER ================= */}

        <section className="character-zone">

          <div className="character-rings">

            <div className="ring ring-one" />
            <div className="ring ring-two" />
            <div className="ring ring-three" />

          </div>

          <div className="character-glow" />

          <img
            src={currentCharacter.image}
            alt={`${currentCharacter.name} character`}
            className="lobby-character"
          />

          <div className="character-platform">
            <span />
          </div>

          <div className="character-name">

            <span>
              PLAYER CHARACTER
            </span>

            <strong>
              {currentCharacter.name.toUpperCase()}
            </strong>

          </div>

        </section>


        {/* ================= RIGHT PANEL ================= */}

        <section className="lobby-right">

          {/* DAILY RUN */}

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
              onClick={() =>
                navigate("/quests")
              }
            >
              VIEW QUESTS
              <span>→</span>
            </button>

          </div>


          {/* QUICK MENU */}

          <div className="quick-menu">

            {/* QUESTS */}

            <button
              onClick={() =>
                navigate("/quests")
              }
            >
              <span>⚔</span>

              <div>
                <strong>QUESTS</strong>
                <small>
                  Complete missions
                </small>
              </div>

            </button>


            {/* RANKED */}

            <button
              onClick={() =>
                navigate("/ranked")
              }
            >
              <span>◆</span>

              <div>
                <strong>RANKED</strong>
                <small>
                  Climb the ladder
                </small>
              </div>

            </button>


            {/* LEADERBOARD */}

            <button
              onClick={() =>
                navigate("/leaderboard")
              }
            >
              <span>♜</span>

              <div>
                <strong>
                  LEADERBOARD
                </strong>

                <small>
                  Compare your progress
                </small>
              </div>

            </button>


            {/* CHANGE CHARACTER */}

            <button
              className="change-character-btn"
              onClick={() =>
                setShowCharacters(true)
              }
            >
              <span>✦</span>

              <div>
                <strong>
                  CHANGE CHARACTER
                </strong>

                <small>
                  Choose your hero
                </small>
              </div>

            </button>

          </div>

        </section>

      </main>


      {/* ================= CHARACTER SELECTOR ================= */}

      {showCharacters && (

        <div
          className="character-overlay"
          onClick={() =>
            setShowCharacters(false)
          }
        >

          <div
            className="character-selector"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="selector-header">

              <div>

                <span>
                  DONEZO ARMORY
                </span>

                <h2>
                  CHOOSE YOUR CHARACTER
                </h2>

              </div>

              <button
                className="close-selector"
                onClick={() =>
                  setShowCharacters(false)
                }
              >
                ×
              </button>

            </div>


            {/* CHARACTER GRID */}

            <div className="character-grid">

              {characters.map(
                (character) => (

                  <button
                    key={character.id}
                    className={`character-option ${
                      selectedCharacter ===
                      character.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleCharacterChange(
                        character.id
                      )
                    }
                    disabled={savingCharacter}
                  >

                    <div className="character-option-image">

                      <img
                        src={character.image}
                        alt={character.name}
                      />

                    </div>

                    <span>
                      {character.name.toUpperCase()}
                    </span>

                    {selectedCharacter ===
                      character.id && (

                      <small>
                        ✓ SELECTED
                      </small>

                    )}

                  </button>

                )
              )}

            </div>

          </div>

        </div>

      )}


      {/* ================= BOTTOM NAV ================= */}

      <nav className="lobby-nav">

        <button className="active">
          <span>⌂</span>
          LOBBY
        </button>

        <button
          onClick={() =>
            navigate("/quests")
          }
        >
          <span>⚔</span>
          QUESTS
        </button>

        <button
          onClick={() =>
            navigate("/ranked")
          }
        >
          <span>◆</span>
          RANKED
        </button>

        <button
          onClick={() =>
            navigate("/leaderboard")
          }
        >
          <span>♜</span>
          LEADERBOARD
        </button>

      </nav>

    </div>
  );
}

export default Lobby;