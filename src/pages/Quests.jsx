import { useEffect, useState } from "react";
import {
  getQuests,
  completeQuest,
  createQuest,
  deleteQuest,
} from "../services/api";
import "./Quests.css";

function Quests() {
  const [quests, setQuests] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [newQuest, setNewQuest] = useState({
    title: "",
    description: "",
    category: "STUDY",
    type: "DAILY",
    difficulty: 1,
    xp: 20,
    gold: 10,
  });

  /* ---------------- LOAD QUESTS ---------------- */

  useEffect(() => {
    loadQuests();
  }, []);

  async function loadQuests() {
    try {
      setLoading(true);
      setError("");

      const data = await getQuests();
      setQuests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- COMPLETION CHECK ---------------- */

  function isQuestCompleted(quest) {
    if (!user?.id) return false;

    const today = new Date().toISOString().slice(0, 10);

    return (
      quest.completions?.some((completion) => {
        const sameUser =
          completion.user?.toString() === user.id?.toString();

        if (!sameUser) return false;

        /*
          DAILY quests only count as completed
          if completed today.
        */
        if (quest.type === "DAILY") {
          const completionDate = new Date(
            completion.completedAt
          )
            .toISOString()
            .slice(0, 10);

          return completionDate === today;
        }

        /*
          EPIC and SIDE quests remain completed
          once the user has completed them.
        */
        return true;
      }) || false
    );
  }

  /* ---------------- COMPLETE / UNDO ---------------- */

  async function handleComplete(quest) {
    if (!user?.id) {
      setError("Please login first.");
      return;
    }

    try {
      setActionLoading(quest._id);
      setError("");

      const data = await completeQuest(quest._id, user.id);

      /*
        Backend returns the updated user.
        Save it so Lobby, Ranked, etc. stay synced.
      */
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      await loadQuests();

    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  /* ---------------- CREATE QUEST ---------------- */

  async function handleCreateQuest(e) {
    e.preventDefault();

    if (!newQuest.title.trim()) {
      setError("Quest title is required.");
      return;
    }

    try {
      setError("");

      await createQuest({
        ...newQuest,
        difficulty: Number(newQuest.difficulty),
        xp: Number(newQuest.xp),
        gold: Number(newQuest.gold),
      });

      setNewQuest({
        title: "",
        description: "",
        category: "STUDY",
        type: "DAILY",
        difficulty: 1,
        xp: 20,
        gold: 10,
      });

      setShowModal(false);

      await loadQuests();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------------- DELETE QUEST ---------------- */

  async function handleDelete(questId) {
    const confirmed = window.confirm(
      "Delete this quest permanently?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteQuest(questId);

      setQuests((current) =>
        current.filter((quest) => quest._id !== questId)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------------- FILTER ---------------- */

  const filteredQuests =
    filter === "ALL"
      ? quests
      : quests.filter((quest) => quest.type === filter);

  const completedCount = quests.filter((quest) =>
    isQuestCompleted(quest)
  ).length;

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="quests-page">
        <div className="quests-loading">
          <div className="loading-icon">⚔️</div>
          <h2>LOADING QUESTS</h2>
          <p>Preparing your missions...</p>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="quests-page">

      {/* HEADER */}

      <header className="quests-header">
        <div>
          <p className="eyebrow">ASCEND // MISSIONS</p>

          <h1>QUEST BOARD</h1>

          <p className="quests-subtitle">
            Complete missions. Earn rewards. Rise through the ranks.
          </p>
        </div>

        <button
          className="create-quest-btn"
          onClick={() => setShowModal(true)}
        >
          + CREATE QUEST
        </button>
      </header>

      {/* ERROR */}

      {error && (
        <div className="quest-error">
          ⚠ {error}
        </div>
      )}

      {/* STATS */}

      <section className="quest-stats">

        <div className="quest-stat">
          <span className="stat-label">TOTAL QUESTS</span>
          <strong>{quests.length}</strong>
        </div>

        <div className="quest-stat">
          <span className="stat-label">COMPLETED</span>
          <strong>{completedCount}</strong>
        </div>

        <div className="quest-stat">
          <span className="stat-label">STREAK</span>
          <strong>{user?.streak || 0} 🔥</strong>
        </div>

        <div className="quest-stat">
          <span className="stat-label">RANK</span>
          <strong>{user?.rank || "BRONZE"}</strong>
        </div>

      </section>

      {/* FILTERS */}

      <div className="quest-filters">

        {["ALL", "DAILY", "EPIC", "SIDE"].map((type) => (
          <button
            key={type}
            className={`filter-btn ${
              filter === type ? "active" : ""
            }`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}

      </div>

      {/* QUEST LIST */}

      <main className="quest-list">

        {filteredQuests.length === 0 ? (
          <div className="empty-quests">
            <div className="empty-icon">📜</div>

            <h2>NO QUESTS FOUND</h2>

            <p>
              The board is empty. Create a mission and begin your run.
            </p>

            <button
              className="create-quest-btn"
              onClick={() => setShowModal(true)}
            >
              + CREATE QUEST
            </button>
          </div>
        ) : (
          filteredQuests.map((quest) => {
            const completed = isQuestCompleted(quest);
            const busy = actionLoading === quest._id;

            return (
              <article
                className={`quest-card ${
                  completed ? "completed" : ""
                }`}
                key={quest._id}
              >

                {/* QUEST TOP */}

                <div className="quest-card-top">

                  <div className="quest-type">
                    {quest.type}
                  </div>

                  <div className="quest-difficulty">
                    {"★".repeat(quest.difficulty)}
                    {"☆".repeat(5 - quest.difficulty)}
                  </div>

                </div>

                {/* TITLE */}

                <h2 className="quest-title">
                  {completed && "✓ "}
                  {quest.title}
                </h2>

                {/* DESCRIPTION */}

                <p className="quest-description">
                  {quest.description || "Complete this mission."}
                </p>

                {/* CATEGORY */}

                <div className="quest-category">
                  {quest.category}
                </div>

                {/* REWARDS */}

                <div className="quest-rewards">

                  <div className="reward xp">
                    <span>XP</span>
                    <strong>+{quest.xp}</strong>
                  </div>

                  <div className="reward gold">
                    <span>GOLD</span>
                    <strong>+{quest.gold}</strong>
                  </div>

                  <div className="reward rp">
                    <span>RP</span>
                    <strong>
                      +{Math.round(quest.xp / 4)}
                    </strong>
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="quest-actions">

                  <button
                    className={`complete-btn ${
                      completed ? "undo" : ""
                    }`}
                    onClick={() => handleComplete(quest)}
                    disabled={busy}
                  >
                    {busy
                      ? "UPDATING..."
                      : completed
                      ? "↩ UNDO"
                      : "✓ COMPLETE"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(quest._id)
                    }
                    disabled={busy}
                  >
                    DELETE
                  </button>

                </div>

              </article>
            );
          })
        )}

      </main>

      {/* CREATE MODAL */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="quest-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <p className="eyebrow">
                  NEW MISSION
                </p>

                <h2>CREATE QUEST</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleCreateQuest}>

              {/* TITLE */}

              <label>
                QUEST TITLE

                <input
                  type="text"
                  placeholder="e.g. Study React"
                  value={newQuest.title}
                  onChange={(e) =>
                    setNewQuest({
                      ...newQuest,
                      title: e.target.value,
                    })
                  }
                />
              </label>

              {/* DESCRIPTION */}

              <label>
                DESCRIPTION

                <textarea
                  placeholder="Describe the mission..."
                  value={newQuest.description}
                  onChange={(e) =>
                    setNewQuest({
                      ...newQuest,
                      description: e.target.value,
                    })
                  }
                />
              </label>

              {/* CATEGORY */}

              <label>
                CATEGORY

                <select
                  value={newQuest.category}
                  onChange={(e) =>
                    setNewQuest({
                      ...newQuest,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="STUDY">STUDY</option>
                  <option value="FITNESS">FITNESS</option>
                  <option value="PERSONAL">PERSONAL</option>
                  <option value="CAREER">CAREER</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </label>

              {/* TYPE */}

              <label>
                QUEST TYPE

                <select
                  value={newQuest.type}
                  onChange={(e) =>
                    setNewQuest({
                      ...newQuest,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="DAILY">DAILY</option>
                  <option value="SIDE">SIDE</option>
                  <option value="EPIC">EPIC</option>
                </select>
              </label>

              {/* DIFFICULTY */}

              <label>
                DIFFICULTY

                <select
                  value={newQuest.difficulty}
                  onChange={(e) =>
                    setNewQuest({
                      ...newQuest,
                      difficulty: e.target.value,
                    })
                  }
                >
                  <option value="1">★ EASY</option>
                  <option value="2">★★ NORMAL</option>
                  <option value="3">★★★ HARD</option>
                  <option value="4">★★★★ ELITE</option>
                  <option value="5">★★★★★ BOSS</option>
                </select>
              </label>

              {/* XP + GOLD */}

              <div className="reward-inputs">

                <label>
                  XP

                  <input
                    type="number"
                    min="1"
                    value={newQuest.xp}
                    onChange={(e) =>
                      setNewQuest({
                        ...newQuest,
                        xp: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  GOLD

                  <input
                    type="number"
                    min="0"
                    value={newQuest.gold}
                    onChange={(e) =>
                      setNewQuest({
                        ...newQuest,
                        gold: e.target.value,
                      })
                    }
                  />
                </label>

              </div>

              <button
                type="submit"
                className="modal-submit"
              >
                CREATE MISSION
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Quests;