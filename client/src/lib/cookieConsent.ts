export const COOKIE_CONSENT_KEY = "wesley-portfolio-cookie-consent";

export type CookieConsent = {
  essential: true;
  analytics: boolean;
  updatedAt: string;
};

export function createCookieConsent(analytics: boolean): CookieConsent {
  return {
    essential: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
}

export function parseCookieConsent(value: string | null): CookieConsent | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<CookieConsent>;
    if (parsed.essential !== true || typeof parsed.analytics !== "boolean" || typeof parsed.updatedAt !== "string") {
      return null;
    }

    return { essential: true, analytics: parsed.analytics, updatedAt: parsed.updatedAt };
  } catch {
    return null;
  }
}
