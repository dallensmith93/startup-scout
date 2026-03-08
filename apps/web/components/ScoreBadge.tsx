export default function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 80 ? "high" : score >= 65 ? "mid" : "low";
  return <span className={`score-badge ${tone}`}>{score}</span>;
}
