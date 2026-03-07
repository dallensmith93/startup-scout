import { Router } from "express";
import { pruneExpiredInStorage, updateStatus } from "../db/storage.js";

const router = Router();

router.post("/review/:id/approve", (req, res) => {
  const updated = updateStatus(req.params.id, "approved");
  if (!updated) {
    res.status(404).json({ ok: false, error: "Review record not found" });
    return;
  }
  res.json({ ok: true, startup: updated });
});

router.post("/review/:id/reject", (req, res) => {
  const updated = updateStatus(req.params.id, "rejected");
  if (!updated) {
    res.status(404).json({ ok: false, error: "Review record not found" });
    return;
  }
  res.json({ ok: true, startup: updated });
});

router.post("/prune/expired", (_req, res) => {
  const prunedCount = pruneExpiredInStorage();
  res.json({ ok: true, prunedCount });
});

export default router;
