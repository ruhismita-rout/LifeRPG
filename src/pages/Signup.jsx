import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const data = await registerUser(form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/lobby");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="signup-label">
          ASCEND // PLAYER REGISTRATION
        </div>

        <h1>CREATE YOUR CHARACTER</h1>

        <p>Begin your ASCEND journey.</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="USERNAME"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "CREATING..." : "CREATE CHARACTER"}
          </button>

        </form>

        <button
          type="button"
          className="login-link"
          onClick={() => navigate("/login")}
        >
          Already have an account? LOGIN
        </button>

      </div>
    </div>
  );
}

export default Signup;