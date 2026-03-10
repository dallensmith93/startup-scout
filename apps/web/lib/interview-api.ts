export type InterviewInput = {
  company: string;
  role: string;
  interviewerName: string;
  jobDescription: string;
  resumeHighlights: string;
};

export type InterviewPrepResult = {
  source: "api" | "fallback";
  thirtySecondPitch: string;
  talkingPoints: string[];
  likelyQuestions: string[];
  questionsForThem: string[];
};

function fallback(input: InterviewInput): InterviewPrepResult {
  return {
    source: "fallback",
    thirtySecondPitch: `I am excited about ${input.company} because this ${input.role} role matches my track record of shipping measurable outcomes in ambiguous environments. I can bring fast execution, clear communication, and practical systems thinking from day one.`,
    talkingPoints: [
      "Open with one quantified result relevant to the role's core priority.",
      "Describe how you align cross-functional stakeholders under tight timelines.",
      "Explain a tradeoff where you improved speed without compromising quality."
    ],
    likelyQuestions: [
      "Tell me about a time you turned ambiguity into delivery.",
      "How do you prioritize competing stakeholder requests?",
      "Which metric do you monitor to validate impact?"
    ],
    questionsForThem: [
      "What would strong success look like after 60 days?",
      "Where is the team currently blocked the most?",
      "How do interviewers evaluate execution quality for this role?"
    ]
  };
}

export async function generateInterviewPrep(input: InterviewInput): Promise<InterviewPrepResult> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const appId = input.company.toLowerCase().includes("vertex") ? "app_vertex_data" : "app_nimbus_ai";

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/interview-prep/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: appId,
        resumeText: input.resumeHighlights,
        focusAreas: ["system design", "leadership"]
      }),
      cache: "no-store"
    });

    if (res.ok) {
      const data = (await res.json()) as {
        talkingPoints: string[];
        likelyQuestions: string[];
        questionsToAskEmployer: string[];
      };

      return {
        source: "api",
        thirtySecondPitch: `I am excited about ${input.company}'s mission, and this ${input.role} role is a direct fit for my shipped outcomes in ${input.jobDescription
          .split(" ")
          .slice(0, 6)
          .join(" ")}...`,
        talkingPoints: data.talkingPoints,
        likelyQuestions: data.likelyQuestions,
        questionsForThem: data.questionsToAskEmployer
      };
    }
  } catch {
    // fallback below
  }

  return fallback(input);
}
