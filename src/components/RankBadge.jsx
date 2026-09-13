function RankBadge({ rank = "Diamond III", size = "normal" }) {
  return (
    <div className={size === "small" ? "mini-badge" : "rank-symbol"}>
      ◆
    </div>
  );
}

export default RankBadge;