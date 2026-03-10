import { applicationsApi } from "./applications-api";

export type TailorTone = "impact" | "concise";

export type TailorInput = {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeText: string;
  tone: TailorTone;
  introPrompt: string;
};

export type KeywordGap = {
  keyword: string;
  present: boolean;
  suggestion: string;
};

export type BulletSuggestion = {
  before: string;
  after: string;
  rationale: string;
};

export type ResumeDiffSection = {
  section: string;
  original: string;
  tailored: string;
};

export type TailorResult = {
  source: "api" | "fallback";
  summary: string;
  intro: string;
  keywordGaps: KeywordGap[];
  bullets: BulletSuggestion[];
  diffs: ResumeDiffSection[];
};

function extractKeywords(text: string): string[] {
  return Array.from(new Set(text.toLowerCase().match(/[a-zA-Z][a-zA-Z\-]{2,}/g) ?? [])).slice(0, 12);
}

function buildFallback(input: TailorInput): TailorResult {
  const jobKeywords = extractKeywords(input.jobDescription).slice(0, 6);
  const resume = input.resumeText.toLowerCase();
  const keywordGaps: KeywordGap[] = jobKeywords.map((keyword) => ({
    keyword,
    present: resume.includes(keyword),
    suggestion: resume.includes(keyword)
      ? "Already represented. Keep one quantified example."
      : `Add one metric-backed line proving experience with ${keyword}.`
  }));

  const originalLines = input.resumeText
    .split(/[\n\.]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 3);

  const bullets: BulletSuggestion[] = (originalLines.length ? originalLines : ["Built cross-functional projects with measurable impact."]).map(
    (line, idx) => {
      const target = jobKeywords[idx] ?? "high-ownership delivery";
      return {
        before: line,
        after: `${line.replace(/\.$/, "")}; aligned directly to ${target} outcomes and improved team velocity with measurable impact.`,
        rationale: `Emphasizes role-relevant signal: ${target}.`
      };
    }
  );

  const intro =
    input.tone === "impact"
      ? `I am excited to apply for the ${input.jobTitle} role at ${input.company}. My recent work maps directly to your priorities in ${jobKeywords.slice(0, 3).join(", ")}, and I consistently deliver measurable outcomes in high-accountability teams.`
      : `Applying for ${input.jobTitle} at ${input.company}: I bring direct experience in ${jobKeywords.slice(0, 3).join(", ")} and can contribute quickly with practical, measurable execution.`;

  return {
    source: "fallback",
    summary: "Deterministic tailoring generated from job-description keyword overlap and resume evidence.",
    intro,
    keywordGaps,
    bullets,
    diffs: [
      {
        section: "Professional Summary",
        original: input.resumeText.slice(0, 280),
        tailored: intro
      },
      {
        section: "Experience Bullets",
        original: originalLines.join("\n"),
        tailored: bullets.map((b) => `- ${b.after}`).join("\n")
      }
    ]
  };
}

export async function tailorResume(input: TailorInput): Promise<TailorResult> {
  const apps = await applicationsApi.list();
  const candidate = apps.find((a) => a.roleTitle.toLowerCase().includes(input.jobTitle.toLowerCase().split(" ")[0])) ?? apps[0];

  if (candidate) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const res = await fetch(`${base.replace(/\/$/, "")}/tailoring/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: candidate.id,
          jobDescription: input.jobDescription,
          resumeText: input.resumeText,
          keySkills: extractKeywords(input.jobDescription).slice(0, 4),
          currentBullets: input.resumeText.split(/[\n\.]/).map((x) => x.trim()).filter(Boolean).slice(0, 3)
        }),
        cache: "no-store"
      });

      if (res.ok) {
        const data = (await res.json()) as {
          tailoredIntroParagraph: string;
          suggestedBullets: string[];
          resumeDiffSummary: string[];
          keywordAnalysis: string[];
        };

        const fallback = buildFallback(input);
        return {
          source: "api",
          summary: "Live tailoring response generated from application copilot service.",
          intro: data.tailoredIntroParagraph,
          keywordGaps: data.keywordAnalysis.map((line) => {
            const normalized = line.replace(/^Matched:\s*/i, "").replace(/^Missing:\s*/i, "").trim();
            const present = line.toLowerCase().startsWith("matched:");
            return {
              keyword: normalized,
              present,
              suggestion: present ? "Already represented. Keep one quantified proof point." : `Add concrete proof for ${normalized}.`
            };
          }),
          bullets: data.suggestedBullets.map((after, idx) => ({
            before: fallback.bullets[idx]?.before ?? "",
            after,
            rationale: "Generated from keyword overlap and role signal weighting."
          })),
          diffs: data.resumeDiffSummary.length
            ? data.resumeDiffSummary.map((line, idx) => ({
                section: `Section ${idx + 1}`,
                original: fallback.diffs[1]?.original ?? "",
                tailored: line
              }))
            : fallback.diffs
        };
      }
    } catch {
      // fallback below
    }
  }

  return buildFallback(input);
}
