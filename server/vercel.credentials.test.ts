import { describe, expect, it } from "vitest";

describe("Vercel credentials", () => {
  it("lists projects for the configured team", async () => {
    const token = process.env.VERCEL_TOKEN;
    const teamId = process.env.VERCEL_TEAM_ID;

    expect(token, "VERCEL_TOKEN must be configured").toBeTruthy();
    expect(teamId, "VERCEL_TEAM_ID must be a team ID or slug").toMatch(/^(team_[A-Za-z0-9]+|[a-z0-9-]+)$/);

    const response = await fetch(
      `https://api.vercel.com/v9/projects?teamId=${encodeURIComponent(teamId!)}&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    expect(response.status, "Vercel projects API must accept the configured credentials").toBe(200);
  }, 15_000);
});
