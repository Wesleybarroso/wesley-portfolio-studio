import { useState } from "react";
import { Check, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { COOKIE_CONSENT_KEY, createCookieConsent, parseCookieConsent, type CookieConsent } from "@/lib/cookieConsent";
import type { PortfolioCopy } from "@/lib/siteLocale";

function getStoredConsent(): CookieConsent | null {
  return parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY));
}

export default function CookieConsentBanner({ copy }: { copy: PortfolioCopy["cookies"] }) {
  const [consent, setConsent] = useState<CookieConsent | null>(getStoredConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  function saveConsent(analytics: boolean) {
    const nextConsent = createCookieConsent(analytics);
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(nextConsent));
    setConsent(nextConsent);
  }

  if (consent) return null;

  return (
    <section className="cookie-consent" aria-label={copy.dialogLabel} role="dialog" aria-modal="false">
      <div className="cookie-consent__icon"><Cookie size={20} aria-hidden="true" /></div>
      <div className="cookie-consent__body">
        <div className="cookie-consent__title"><ShieldCheck size={15} aria-hidden="true" /> {copy.heading}</div>
        <p>{copy.intro}</p>
        {settingsOpen && (
          <div className="cookie-consent__settings">
            <div><strong>{copy.essential}</strong><span>{copy.essentialDetail}</span><Check size={16} aria-label={copy.alwaysActive} /></div>
            <label>
              <span><strong>{copy.measurement}</strong><small>{copy.measurementDetail}</small></span>
              <input type="checkbox" checked={analyticsEnabled} onChange={(event) => setAnalyticsEnabled(event.target.checked)} />
            </label>
          </div>
        )}
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__settings-button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
          {settingsOpen ? <X size={15} /> : <Settings2 size={15} />} {settingsOpen ? copy.close : copy.preferences}
        </button>
        {settingsOpen ? (
          <button type="button" className="cookie-consent__accept" onClick={() => saveConsent(analyticsEnabled)}>{copy.save}</button>
        ) : (
          <>
            <button type="button" className="cookie-consent__essential" onClick={() => saveConsent(false)}>{copy.essentialOnly}</button>
            <button type="button" className="cookie-consent__accept" onClick={() => saveConsent(true)}>{copy.acceptAll}</button>
          </>
        )}
      </div>
    </section>
  );
}
