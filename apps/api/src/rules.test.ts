import test from "node:test";
import assert from "node:assert/strict";
import { deriveStatus, pickApplyLink } from "./services/scoring.js";

test("freshness > 48 => expired", () => {
  const status = deriveStatus({
    freshnessHours: 49,
    usaConfidence: 1,
    scamScore: 0,
    aiRelevanceScore: 100,
    hiringUrgencyScore: 100
  });
  assert.equal(status, "expired");
});

test("USA confidence < 0.7 => rejected", () => {
  const status = deriveStatus({
    freshnessHours: 2,
    usaConfidence: 0.69,
    scamScore: 10,
    aiRelevanceScore: 90,
    hiringUrgencyScore: 90
  });
  assert.equal(status, "rejected");
});

test("scam score > 44 => rejected", () => {
  const status = deriveStatus({
    freshnessHours: 2,
    usaConfidence: 0.9,
    scamScore: 45,
    aiRelevanceScore: 90,
    hiringUrgencyScore: 90
  });
  assert.equal(status, "rejected");
});

test("weak AI relevance does not pass", () => {
  const status = deriveStatus({
    freshnessHours: 2,
    usaConfidence: 0.9,
    scamScore: 10,
    aiRelevanceScore: 40,
    hiringUrgencyScore: 90
  });
  assert.equal(status, "rejected");
});

test("weak hiring urgency does not pass", () => {
  const status = deriveStatus({
    freshnessHours: 2,
    usaConfidence: 0.9,
    scamScore: 10,
    aiRelevanceScore: 90,
    hiringUrgencyScore: 30
  });
  assert.equal(status, "rejected");
});

test("apply fallback order applyUrl -> careersUrl -> website", () => {
  const one = pickApplyLink({ applyUrl: "https://a.com/apply", careersUrl: "https://a.com/careers", website: "https://a.com" });
  const two = pickApplyLink({ applyUrl: "", careersUrl: "https://a.com/careers", website: "https://a.com" });
  const three = pickApplyLink({ applyUrl: "", careersUrl: "", website: "https://a.com" });
  assert.equal(one, "https://a.com/apply");
  assert.equal(two, "https://a.com/careers");
  assert.equal(three, "https://a.com");
});
