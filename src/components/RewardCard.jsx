function RewardCard({ reward, onBuy }) {
  return (
    <div className="reward-card">
      <div className="reward-image">
        {reward.icon}
      </div>

      <h3>{reward.name}</h3>

      <p>{reward.description}</p>

      <button
        className="reward-buy"
        onClick={() => onBuy(reward)}
      >
        🪙 {reward.price} GOLD
      </button>
    </div>
  );
}

export default RewardCard;