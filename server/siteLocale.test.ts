import { describe, expect, it } from "vitest";
import {
  getPortfolioCopy,
  isLocaleCode,
  localeChrome,
  pageDescriptions,
  pageTitles,
  portraitStatusLabels,
  supportedLocales,
} from "../client/src/lib/siteLocale";

describe("localização do portfólio", () => {
  it("disponibiliza os nove idiomas solicitados", () => {
    expect(supportedLocales.map((locale) => locale.label)).toEqual([
      "Português (Brasil)",
      "English",
      "Français",
      "Italiano",
      "Español",
      "Deutsch",
      "Русский",
      "Dansk",
      "Norsk",
    ]);
  });

  it("mantém cópia de navegação, projeto e cookies para cada idioma", () => {
    supportedLocales.forEach(({ code }) => {
      const copy = getPortfolioCopy(code);
      expect(copy.navigation).toHaveLength(5);
      expect(copy.projects.viewAll.length).toBeGreaterThan(2);
      expect(copy.cookies.acceptAll.length).toBeGreaterThan(2);
      expect(localeChrome[code].livePreview.length).toBeGreaterThan(2);
      expect(portraitStatusLabels[code].length).toBeGreaterThan(2);
      expect(pageTitles[code]).toContain("Wesley Barroso");
      expect(pageDescriptions[code].length).toBeGreaterThan(20);
    });
  });

  it("aceita apenas códigos de idioma cadastrados", () => {
    expect(isLocaleCode("pt-BR")).toBe(true);
    expect(isLocaleCode("en")).toBe(true);
    expect(isLocaleCode("pt")).toBe(false);
  });
});
