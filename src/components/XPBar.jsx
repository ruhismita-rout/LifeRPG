function XPBar({ current = 1720, required = 2000 }) {
  const percentage = Math.min((current / required) * 100, 100);

  return (
    <div>
      <div className="progress">
        <div style={{ width: `${percentage}%` }}></div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#8e969f",
          fontSize: "11px",
          marginTop: "7px"
        }}
      >
        <span>{current.toLocaleString()} XP</span>
        <span>{required.toLocaleString()} XP</span>
      </div>
    </div>
  );
}

export default XPBar;