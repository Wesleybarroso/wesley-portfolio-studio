import { useState } from "react";
import { Check, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { COOKIE_CONSENT_KEY, createCookieConsent, parseCookieConsent, type CookieConsent } from "@/lib/cookieConsent";

function getStoredConsent(): CookieConsent | null {
  return parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY));
}

export default function CookieConsentBanner() {
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
    <section className="cookie-consent" aria-label="Preferências de cookies" role="dialog" aria-modal="false">
      <div className="cookie-consent__icon"><Cookie size={20} aria-hidden="true" /></div>
      <div className="cookie-consent__body">
        <div className="cookie-consent__title"><ShieldCheck size={15} aria-hidden="true" /> PRIVACIDADE E COOKIES</div>
        <p>Usamos cookies essenciais para lembrar sua preferência. Tecnologias opcionais só serão autorizadas com o seu consentimento.</p>
        {settingsOpen && (
          <div className="cookie-consent__settings">
            <div><strong>Essenciais</strong><span>Sempre ativos para manter suas preferências.</span><Check size={16} aria-label="Sempre ativo" /></div>
            <label>
              <span><strong>Medição de experiência</strong><small>Ajuda a entender como o portfólio é utilizado.</small></span>
              <input type="checkbox" checked={analyticsEnabled} onChange={(event) => setAnalyticsEnabled(event.target.checked)} />
            </label>
          </div>
        )}
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__settings-button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
          {settingsOpen ? <X size={15} /> : <Settings2 size={15} />} {settingsOpen ? "Fechar" : "Preferências"}
        </button>
        {settingsOpen ? (
          <button type="button" className="cookie-consent__accept" onClick={() => saveConsent(analyticsEnabled)}>Salvar preferências</button>
        ) : (
          <>
            <button type="button" className="cookie-consent__essential" onClick={() => saveConsent(false)}>Somente essenciais</button>
            <button type="button" className="cookie-consent__accept" onClick={() => saveConsent(true)}>Aceitar todos</button>
          </>
        )}
      </div>
    </section>
  );
}
