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
    ])).toBe("https://altixdev.com.br");
  });

  it("mantém a URL do deployment quando não há alias utilizável", () => {
    expect(getPreferredPreviewUrl(project, [
      { projectId: "project-1", alias: "old.example.com", redirect: "new.example.com" },
    ])).toBe(project.url);
  });
});
