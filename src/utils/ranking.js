import ranks from "../data/ranks";

export function getRank(rp) {
  const rank = ranks.find(
    (item) => rp >= item.min && rp <= item.max
  );

  return rank || ranks[0];
}

export function getNextRank(rp) {
  const current = getRank(rp);

  const index = ranks.findIndex(
    (rank) => rank.name === current.name
  );

  return ranks[index + 1] || null;
}

export function getRankProgress(rp) {
  const current = getRank(rp);
  const next = getNextRank(rp);

  if (!next) {
    return 100;
  }

  return (
    ((rp - current.min) /
      (next.min - current.min)) *
    100
  );
}