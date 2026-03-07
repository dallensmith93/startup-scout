import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "./server.js";
import { resetStorage } from "./db/storage.js";

const app = createApp();

test.beforeEach(() => {
  resetStorage();
});

test("GET /api/health returns ok", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test("POST /api/ingest/run returns summary counts", async () => {
  const res = await request(app).post("/api/ingest/run");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(typeof res.body.total, "number");
  assert.equal(typeof res.body.approved, "number");
  assert.equal(typeof res.body.review, "number");
  assert.equal(typeof res.body.rejected, "number");
  assert.equal(typeof res.body.expired, "number");
});

test("GET /api/startups returns approved and review arrays", async () => {
  await request(app).post("/api/ingest/run");
  const res = await request(app).get("/api/startups");
  assert.equal(res.status, 200);
  assert.equal(Array.isArray(res.body.approved), true);
  assert.equal(Array.isArray(res.body.review), true);
});

test("review approve/reject updates review records", async () => {
  await request(app).post("/api/ingest/run");
  const list = await request(app).get("/api/startups");
  const reviewId = list.body.review[0]?.id;
  assert.ok(reviewId);

  const approve = await request(app).post(`/api/review/${reviewId}/approve`);
  assert.equal(approve.status, 200);
  assert.equal(approve.body.ok, true);

  await request(app).post("/api/ingest/run");
  const list2 = await request(app).get("/api/startups");
  const reviewId2 = list2.body.review[0]?.id;
  if (reviewId2) {
    const reject = await request(app).post(`/api/review/${reviewId2}/reject`);
    assert.equal(reject.status, 200);
    assert.equal(reject.body.ok, true);
  }
});

test("prune expired removes expired records from active results", async () => {
  await request(app).post("/api/ingest/run");
  const prune = await request(app).post("/api/prune/expired");
  assert.equal(prune.status, 200);
  assert.equal(prune.body.ok, true);
  assert.equal(typeof prune.body.prunedCount, "number");

  const list = await request(app).get("/api/startups");
  const hasExpired = [...list.body.approved, ...list.body.review].some((x) => x.status === "expired");
  assert.equal(hasExpired, false);
});
