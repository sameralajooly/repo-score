import { describe, it, expect } from "vitest";
import { calculatePopularityScore } from "../../../src/services/github.service";

const NOW = new Date("2025-01-01T00:00:00Z");

describe("calculatePopularityScore", () => {
  it("returns a finite non-negative number", () => {
    const s = calculatePopularityScore(100, 50, "2024-12-01T00:00:00Z", NOW);
    expect(Number.isFinite(s)).toBe(true);
    expect(s).toBeGreaterThanOrEqual(0);
  });

  it("increases score with stars", () => {
    const a = calculatePopularityScore(10, 10, "2024-12-01T00:00:00Z", NOW);
    const b = calculatePopularityScore(20, 10, "2024-12-01T00:00:00Z", NOW);
    expect(b).toBeGreaterThan(a);
  });

  it("increases score with forks", () => {
    const a = calculatePopularityScore(10, 5, "2024-12-01T00:00:00Z", NOW);
    const b = calculatePopularityScore(10, 50, "2024-12-01T00:00:00Z", NOW);
    expect(b).toBeGreaterThan(a);
  });

  it("increases score with recency", () => {
    const older = calculatePopularityScore(
      100,
      100,
      "2024-01-01T00:00:00Z",
      NOW
    );
    const newer = calculatePopularityScore(
      100,
      100,
      "2024-12-15T00:00:00Z",
      NOW
    );
    expect(newer).toBeGreaterThan(older);
  });

  it("handles zeros and very old timestamps", () => {
    const zeroes = calculatePopularityScore(0, 0, "2000-01-01T00:00:00Z", NOW);
    expect(zeroes).toBeGreaterThanOrEqual(0);
    const small = calculatePopularityScore(0, 0, "1900-01-01T00:00:00Z", NOW);
    expect(small).toBeLessThanOrEqual(zeroes);
  });

  it("handle future dates", () => {
    const future = calculatePopularityScore(
      10,
      10,
      "2030-01-01T00:00:00Z",
      NOW
    );
    expect(Number.isFinite(future)).toBe(true);
  });

  it("halfLife affects recency weight", () => {
    const shortHalfLife = calculatePopularityScore(
      0,
      0,
      "2024-06-01T00:00:00Z",
      NOW,
      15
    );
    const longHalfLife = calculatePopularityScore(
      0,
      0,
      "2024-06-01T00:00:00Z",
      NOW,
      120
    );
    expect(longHalfLife).toBeGreaterThan(shortHalfLife);
  });
});
