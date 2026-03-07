const HIRING_KEYWORDS: Array<{ term: string; weight: number }> = [
  { term: "founding engineer", weight: 35 },
  { term: "first engineer", weight: 32 },
  { term: "urgent hire", weight: 30 },
  { term: "immediate hire", weight: 30 },
  { term: "early team", weight: 22 },
  { term: "build with founders", weight: 24 },
  { term: "seed", weight: 12 },
  { term: "pre-seed", weight: 12 },
  { term: "hiring", weight: 14 },
  { term: "multiple engineering openings", weight: 26 }
];

export function scoreHiringUrgency(text: string, openRoles?: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;

  for (const item of HIRING_KEYWORDS) {
    if (lower.includes(item.term)) {
      score += item.weight;
    }
  }

  const roleCount = openRoles?.length ?? 0;
  if (roleCount >= 3) score += 20;
  else if (roleCount >= 1) score += 10;

  return Math.min(100, Math.max(0, score));
}
