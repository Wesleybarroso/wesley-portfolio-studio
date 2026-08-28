import { describe, expect, it } from "vitest";
import { getPreferredPreviewUrl, isFrameEmbeddingBlocked } from "../api/projects";

describe("isFrameEmbeddingBlocked", () => {
  it("identifica cabeçalhos que proíbem a incorporação", () => {
    expect(isFrameEmbeddingBlocked("DENY", null)).toBe(true);
    expect(isFrameEmbeddingBlocked("SAMEORIGIN", null)).toBe(true);
    expect(isFrameEmbeddingBlocked(null, "default-src 'self'; frame-ancestors 'none'")).toBe(true);
    expect(isFrameEmbeddingBlocked(null, "default-src 'self'; frame-ancestors 'self'")).toBe(true);
  });

  it("permite prévia quando não há política de bloqueio declarada", () => {
    expect(isFrameEmbeddingBlocked(null, null)).toBe(false);
    expect(isFrameEmbeddingBlocked(null, "default-src 'self'; frame-ancestors https:")).toBe(false);
  });
});

describe("getPreferredPreviewUrl", () => {
  const project = {
    id: "project-1",
    name: "altixdev",
    url: "https://altixdev-hash.vercel.app",
    updatedAt: 1,
  };

  it("prioriza o domínio público estável do projeto para a prévia", () => {
    expect(getPreferredPreviewUrl(project, [
      { projectId: "project-1", alias: "altixdev-hash.vercel.app" },
      { projectId: "project-1", alias: "altixdev.com.br" },
      { projectId: "project-1", alias: "altixdev-chi.vercel.app" },
    ], "wesleys-projects-c7635016")).toBe("https://altixdev-chi.vercel.app");
  });

  it("usa o alias público direto quando o nome técnico do projeto contém sublinhado", () => {
    const projectWithUnderscore = {
      ...project,
      name: "clinica_monique",
      url: "https://clinicamonique-deployment-hash.vercel.app",
    };

    expect(getPreferredPreviewUrl(projectWithUnderscore, [
      { alias: "clinicamonique-wesleys-projects-c7635016.vercel.app" },
      { alias: "clinicamonique-git-main-wesleys-projects-c7635016.vercel.app" },
      { alias: "clinicamonique.vercel.app" },
    ], "team_a5LWYS48dlRSAUqy60H2Vg4O")).toBe("https://clinicamonique.vercel.app");
  });

  it("não expõe a URL temporária do deployment quando não há alias utilizável", () => {
    expect(getPreferredPreviewUrl(project, [
      { projectId: "project-1", alias: "old.example.com", redirect: "new.example.com" },
    ], "wesleys-projects-c7635016")).toBeUndefined();
  });
});
