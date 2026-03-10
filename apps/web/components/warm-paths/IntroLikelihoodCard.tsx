type IntroLikelihoodCardProps = {
  score: number;
};

export function IntroLikelihoodCard({ score }: IntroLikelihoodCardProps) {
  return (
    <article className="card">
      <h3 style={{ marginTop: 0 }}>Intro Likelihood</h3>
      <p className="hero-score" style={{ margin: "6px 0 10px" }}>{score}%</p>
      <div className="meter"><span style={{ width: `${score}%` }} /></div>
      <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>
        Based on relationship strength, freshness of last touch, and role alignment.
      </p>
    </article>
  );
}
