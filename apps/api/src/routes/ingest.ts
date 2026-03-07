import { Router } from "express";
import { fetchProductHuntCandidates } from "../connectors/producthunt.js";
import { fetchYcCandidates } from "../connectors/yc.js";
import { fetchJobCandidates } from "../connectors/jobs.js";
import { getAllRecords, saveBatch } from "../db/storage.js";
import { scoreHiringUrgency } from "../services/hiring.js";
import { deriveStatus, normalizeCandidate } from "../services/scoring.js";

const router = Router();

router.post("/ingest/run", async (_req, res) => {
  const [ph, yc, jobs] = await Promise.all([
    fetchProductHuntCandidates(),
    fetchYcCandidates(),
    fetchJobCandidates()
  ]);

  const all = [...ph, ...yc, ...jobs];
  const normalized = all.map((candidate) => {
    const base = normalizeCandidate(candidate);
    const text = `${base.description} ${(candidate.tags ?? []).join(" ")} ${candidate.text ?? ""}`;
    const hiringUrgencyScore = scoreHiringUrgency(text, candidate.openRoles);
    const status = deriveStatus({
      freshnessHours: base.freshnessHours,
      usaConfidence: base.usaConfidence,
      scamScore: base.scamScore,
      aiRelevanceScore: base.aiRelevanceScore,
      hiringUrgencyScore
    });

    return {
      ...base,
      hiringUrgencyScore,
      status,
      openRoles: candidate.openRoles ?? base.openRoles,
      applyUrl: candidate.applyUrl ?? base.applyUrl,
      careersUrl: candidate.careersUrl ?? base.careersUrl
    };
  });

  saveBatch(normalized);

  const allRecords = getAllRecords();
  const summary = {
    ok: true,
    total: allRecords.length,
    approved: allRecords.filter((r) => r.status === "approved").length,
    review: allRecords.filter((r) => r.status === "review").length,
    rejected: allRecords.filter((r) => r.status === "rejected").length,
    expired: allRecords.filter((r) => r.status === "expired").length
  };

  res.json(summary);
});

export default router;
