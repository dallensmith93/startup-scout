import { Router } from "express";
import { listByStatus } from "../db/storage.js";

const router = Router();

router.get("/startups", (_req, res) => {
  res.json(listByStatus());
});

export default router;
