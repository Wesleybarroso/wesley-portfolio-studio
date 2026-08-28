import { describe, expect, it } from "vitest";
import { createActiveProjects, createDeploymentsUrl, createPublicProject } from "./vercelProjects";

describe("Vercel projects feed", () => {
  it("uses a team slug or team ID without exposing credentials", () => {
    expect(createDeploymentsUrl("wesleys-projects-c7635016")).toContain("slug=wesleys-projects-c7635016");
    expect(createDeploymentsUrl("team_123")).toContain("teamId=team_123");
  });

  it("keeps one ready production deployment per project in newest-first order", () => {
    const projects = createActiveProjects([
      { projectId: "green", name: "projetoverdeacao", url: "green.vercel.app", state: "READY", target: "production", ready: 100 },
      { projectId: "old", name: "legacy", url: "legacy.vercel.app", state: "READY", target: "production", ready: 90 },
      { projectId: "green", name: "projetoverdeacao", url: "green-old.vercel.app", state: "READY", target: "production", ready: 80 },
      { projectId: "preview", name: "preview", url: "preview.vercel.app", state: "READY", target: null, ready: 110 },
      { projectId: "failed", name: "failed", url: "failed.vercel.app", state: "ERROR", target: "production", ready: 120 },
    ]);

    expect(projects).toEqual([
      { id: "green", name: "projetoverdeacao", url: "https://green.vercel.app", updatedAt: 100 },
      { id: "old", name: "legacy", url: "https://legacy.vercel.app", updatedAt: 90 },
    ]);
  });

  it("returns an empty catalog when there are no ready production deployments", () => {
    expect(createActiveProjects([{ state: "BUILDING", target: "production" }])).toEqual([]);
  });

  it("exposes a stable public alias instead of the deployment URL", () => {
    const project = createPublicProject(
      {
        id: "clinic",
        name: "clinica_monique",
        url: "clinic-deployment.vercel.app",
        updatedAt: 100,
      },
      [{ alias: "clinicamonique.vercel.app", redirect: null }],
      true,
      "team_123",
    );

    expect(project.previewUrl).toBe("https://clinicamonique.vercel.app");
    expect(project.preview).toEqual({ embeddable: true });
    expect(project).not.toHaveProperty("url");
  });
});
