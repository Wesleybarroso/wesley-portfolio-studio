import { describe, expect, it } from "vitest";
import { createCookieConsent, parseCookieConsent } from "../client/src/lib/cookieConsent";

describe("consentimento de cookies", () => {
  it("cria uma preferência com cookies essenciais sempre ativos", () => {
    const consent = createCookieConsent(true);
    expect(consent.essential).toBe(true);
    expect(consent.analytics).toBe(true);
    expect(Number.isNaN(Date.parse(consent.updatedAt))).toBe(false);
  });

  it("aceita somente preferências persistidas em formato válido", () => {
    const consent = { essential: true, analytics: false, updatedAt: "2026-08-27T00:00:00.000Z" };
    expect(parseCookieConsent(JSON.stringify(consent))).toEqual(consent);
    expect(parseCookieConsent("{invalid")).toBeNull();
    expect(parseCookieConsent(JSON.stringify({ essential: false, analytics: false }))).toBeNull();
  });
});
