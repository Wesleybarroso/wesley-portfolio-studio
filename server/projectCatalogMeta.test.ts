import { describe, expect, it } from "vitest";
import { getProjectCatalogMeta, technologyLabels } from "../client/src/lib/projectCatalogMeta";

describe("metadados do catálogo de projetos", () => {
  it("fornece descrição e tecnologias para os projetos publicados conhecidos", () => {
    ["wesley-portfolio-studio", "altixdev", "portifolio", "espacoglamour", "projetoverdeacao"].forEach((projectName) => {
      const meta = getProjectCatalogMeta(projectName);
      expect(meta.description.length).toBeGreaterThan(30);
      expect(meta.technologies.length).toBeGreaterThan(0);
      meta.technologies.forEach((technology) => expect(technologyLabels[technology]).toBeTruthy());
    });
  });

  it("mantém o nome editorial correto do Portfólio Wesley", () => {
    expect(getProjectCatalogMeta("portifolio").title).toBe("Portfólio Wesley");
  });

  it("mantém um cartão informativo para novos projetos descobertos automaticamente", () => {
    const meta = getProjectCatalogMeta("novo-projeto");
    expect(meta.title).toBe("novo-projeto");
    expect(meta.technologies).toEqual(["vercel"]);
  });
});
