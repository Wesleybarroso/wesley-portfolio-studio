/**
 * DESIGN — Arquitetura de Luz: painéis de vidro fumê, azul Sinal Altitude,
 * composição assimétrica e motion preciso para uma presença de engenharia premium.
 */
import { Button } from "@/components/ui/button";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  Check,
  Code2,
  Database,
  FolderOpen,
  Globe2,
  Github,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Network,
  X,
  Zap,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiCss,
  SiFramer,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiSass,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import {
  getProjectCatalogMeta,
  technologyLabels,
  type ProjectTechnology,
} from "@/lib/projectCatalogMeta";
import { getPreviewLoadingStrategy, type PreviewVariant } from "@/lib/previewLoading";
import {
  getPortfolioCopy,
  isLocaleCode,
  LOCALE_STORAGE_KEY,
  supportedLocales,
  type LocaleCode,
  type PortfolioCopy,
} from "@/lib/siteLocale";

const portrait = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663921700779/irQMWEfLLujrOPUg.png";
const mark = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663921700779/JdZtjGQLUaaINXmZ.png";
const heroAtmosphere = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663921700779/FIpEfEjoVTIeePhU.jpg";
const systemsOrbit = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663921700779/myyUuXgYuGSDECZT.jpg";
const caseStudySurface = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663921700779/POHjIfuBqiYavNxX.jpg";
const depthField = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663921700779/EzvnheckxEFRDoEM.jpg";

const navItems = [
  ["Início", "#inicio"],
  ["Visão", "#visao"],
  ["Projeto", "#projeto"],
  ["Stack", "#stack"],
  ["Contato", "#contato"],
] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type LiveProject = {
  id: string;
  name: string;
  url: string;
  updatedAt: number;
  previewUrl?: string;
  preview?: {
    embeddable: boolean;
  };
};

type ProjectsPayload = {
  latest: LiveProject | null;
  projects: LiveProject[];
};

const technologyIcons: Record<ProjectTechnology, IconType> = {
  react: SiReact,
  typescript: SiTypescript,
  vite: SiVite,
  tailwind: SiTailwindcss,
  javascript: SiJavascript,
  framer: SiFramer,
  next: SiNextdotjs,
  html: SiHtml5,
  css: SiCss,
  sass: SiSass,
  vercel: SiVercel,
};

function ProjectTechnologyIcons({ technologies }: { technologies: ProjectTechnology[] }) {
  return (
    <ul className="project-tech-list" aria-label="Tecnologias utilizadas">
      {technologies.map((technology) => {
        const Icon = technologyIcons[technology];
        const label = technologyLabels[technology];
        return <li key={technology} title={label} aria-label={label}><Icon aria-hidden="true" /><span className="sr-only">{label}</span></li>;
      })}
    </ul>
  );
}

async function requestLiveProjects(): Promise<ProjectsPayload> {
  const response = await fetch("/api/projects", { headers: { Accept: "application/json" } });
  const payload = (await response.json()) as ProjectsPayload & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Não foi possível atualizar os projetos.");
  }

  return payload;
}

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.62, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PortraitPortal() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 140, damping: 18, mass: 0.34 });
  const springY = useSpring(pointerY, { stiffness: 140, damping: 18, mass: 0.34 });
  const portraitX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const portraitY = useTransform(springY, [-0.5, 0.5], [-10, 10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const ringX = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const ringY = useTransform(springY, [-0.5, 0.5], [16, -16]);

  function trackPointer(event: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      className="portrait-stage"
      aria-label="Retrato de Wesley Barroso"
      onMouseMove={trackPointer}
      onMouseLeave={resetPointer}
    >
      <motion.div className="portrait-orbit portrait-orbit--outer" style={{ x: ringX, y: ringY }} />
      <motion.div className="portrait-orbit portrait-orbit--inner" style={{ x: portraitX, y: portraitY }} />
      <motion.div
        className="portrait-portal"
        style={reduceMotion ? undefined : { x: portraitX, y: portraitY, rotateX, rotateY }}
      >
        <div className="portrait-glow" />
        <img src={portrait} alt="Wesley Barroso, engenheiro de software" className="portrait-image" />
        <div className="portrait-shine" />
      </motion.div>
      <div className="portrait-tag portrait-tag--top">WB / 01</div>
      <div className="portrait-tag portrait-tag--bottom"><span /> DISPONÍVEL</div>
    </div>
  );
}

function TiltCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal className={className} delay={delay}>
      <motion.div
        className="tilt-card"
        whileHover={reduceMotion ? undefined : { y: -8, rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="card-sheen" />
        {children}
      </motion.div>
    </Reveal>
  );
}

function addPortfolioPreviewParameter(projectUrl: string) {
  const separator = projectUrl.includes("?") ? "&" : "?";
  return `${projectUrl}${separator}portfolio-preview=1`;
}

function LanguageSelector({
  locale,
  copy,
  onChange,
}: {
  locale: LocaleCode;
  copy: PortfolioCopy;
  onChange: (locale: LocaleCode) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedLocale = supportedLocales.find((item) => item.code === locale) ?? supportedLocales[0];

  function selectLocale(nextLocale: LocaleCode) {
    onChange(nextLocale);
    setOpen(false);
  }

  return (
    <div className="language-selector">
      <button
        type="button"
        className="language-selector__trigger"
        aria-label={copy.languageMenuLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Globe2 size={16} aria-hidden="true" />
        <span>{selectedLocale.shortLabel}</span>
      </button>
      {open && (
        <div className="language-selector__menu" role="listbox" aria-label={copy.languageMenuLabel}>
          {supportedLocales.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={locale === item.code}
              className={locale === item.code ? "is-selected" : ""}
              onClick={() => selectLocale(item.code)}
            >
              <span>{item.label}</span>
              {locale === item.code && <Check size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getLocalizedProjectDescription(projectName: string, copy: PortfolioCopy) {
  return copy.projects.descriptions[projectName.toLowerCase()] ?? copy.projects.defaultDescription;
}

function ProjectLivePreview({
  project,
  variant,
  copy,
  forceFallback = false,
}: {
  project: LiveProject;
  variant: PreviewVariant;
  copy: PortfolioCopy;
  forceFallback?: boolean;
}) {
  const [previewState, setPreviewState] = useState<"loading" | "ready" | "fallback">("loading");
  const className = variant === "featured" ? "case-preview" : "project-live-preview";
  const fallbackClassName = variant === "featured" ? "case-preview__fallback" : "project-live-preview__fallback";
  const labelClassName = variant === "featured" ? "case-preview__label" : "project-live-preview__label";
  const previewIsAllowed = project.preview?.embeddable !== false && !forceFallback;
  const shouldRenderPreview = previewIsAllowed && previewState !== "fallback";

  useEffect(() => {
    if (!previewIsAllowed) {
      setPreviewState("fallback");
      return;
    }

    setPreviewState("loading");
    const fallbackTimeout = window.setTimeout(() => {
      setPreviewState((state) => state === "loading" ? "fallback" : state);
    }, 7000);

    return () => window.clearTimeout(fallbackTimeout);
  }, [project.previewUrl, project.url, previewIsAllowed]);

  return (
    <div className={className} data-state={previewState} aria-hidden="true">
      <div className={fallbackClassName}>
        <span>{previewState === "loading" ? copy.projects.previewLoading : copy.projects.previewUnavailable}</span>
        <strong>{getProjectCatalogMeta(project.name).title}</strong>
        <small>{previewState === "loading" ? copy.projects.previewLoadingDetail : copy.projects.previewUnavailableDetail}</small>
      </div>
      {shouldRenderPreview && (
        <iframe
          src={addPortfolioPreviewParameter(project.previewUrl ?? project.url)}
          title={`Prévia do projeto ${project.name}`}
          tabIndex={-1}
          loading={getPreviewLoadingStrategy(variant)}
          onLoad={() => setPreviewState("ready")}
          onError={() => setPreviewState("fallback")}
        />
      )}
      <span className={labelClassName}>
        {previewState === "ready" ? "LIVE / PREVIEW" : previewState === "loading" ? copy.projects.previewLoading : copy.projects.directLink}
      </span>
    </div>
  );
}

export default function PortfolioExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locale, setLocale] = useState<LocaleCode>(() => {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocaleCode(storedLocale) ? storedLocale : "pt-BR";
  });
  const [activeSection, setActiveSection] = useState("inicio");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [latestProject, setLatestProject] = useState<LiveProject | null>(null);
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.2 });
  const copy = getPortfolioCopy(locale);
  const latestProjectName = latestProject
    ? getProjectCatalogMeta(latestProject.name).title
    : (latestLoading ? copy.projects.loading : copy.projects.noProject);
  const isEmbeddedPreview = new URLSearchParams(window.location.search).has("portfolio-preview");
  const forcePreviewFallback = new URLSearchParams(window.location.search).has("preview-fallback");

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const sections = navItems
      .map(([, href]) => document.querySelector(href))
      .filter((section): section is Element => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current?.target.id) setActiveSection(current.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.04, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isCurrent = true;

    void requestLiveProjects()
      .then((payload) => {
        if (!isCurrent) return;
        setLatestProject(payload.latest);
      })
      .catch(() => {
        if (isCurrent) setProjectsError(true);
      })
      .finally(() => {
        if (isCurrent) setLatestLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function changeLocale(nextLocale: LocaleCode) {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    setLocale(nextLocale);
  }

  function navigateToSection(event: MouseEvent<HTMLAnchorElement>, hash: string) {
    event.preventDefault();
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    setActiveSection(hash.slice(1));
  }

  function openProjects() {
    setProjectsOpen(true);
    setProjectsLoading(true);
    setProjectsError(false);
    void requestLiveProjects()
      .then((payload) => {
        setLatestProject(payload.latest);
        setProjects(payload.projects);
      })
      .catch(() => setProjectsError(true))
      .finally(() => setProjectsLoading(false));
  }

  return (
    <div className="portfolio-shell">
      <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />

      <aside className="command-rail" aria-label={copy.navigation.join(", ")}>
        <a href="#inicio" className="brand-lockup" aria-label={copy.navigation[0]} onClick={(event) => navigateToSection(event, "#inicio")}>
          <img src={mark} alt="Símbolo WB" className="brand-mark" />
          <span>WESLEY<br />BARROSO</span>
          <b className="brand-code">WB/</b>
        </a>

        <nav className="rail-nav">
          {navItems.map(([, href], index) => (
            <a href={href} key={href} onClick={(event) => navigateToSection(event, href)} className={`rail-link ${activeSection === href.slice(1) ? "is-active" : ""}`}>
              <small>0{index + 1}</small><span>{copy.navigation[index]}</span>
            </a>
          ))}
        </nav>

        <LanguageSelector locale={locale} copy={copy} onChange={changeLocale} />

        <div className="rail-footer">
          <span className="availability-dot" />
          <p>{copy.availability[0]}<br />{copy.availability[1]}</p>
        </div>
      </aside>

      <header className="mobile-command-bar">
        <a href="#inicio" className="brand-lockup" aria-label={copy.navigation[0]} onClick={(event) => navigateToSection(event, "#inicio")}>
          <img src={mark} alt="Símbolo WB" className="brand-mark" />
          <span>WESLEY<br />BARROSO</span>
          <b className="brand-code">WB/</b>
        </a>
        <LanguageSelector locale={locale} copy={copy} onChange={changeLocale} />
        <button
          className="menu-toggle"
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={21} />}
        </button>
        {menuOpen && (
          <nav className="mobile-menu">
            {navItems.map(([, href], index) => (
              <a href={href} key={href} onClick={(event) => { navigateToSection(event, href); closeMenu(); }} className={activeSection === href.slice(1) ? "is-active" : ""}>
                <small>0{index + 1}</small>{copy.navigation[index]}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="portfolio-main">
        <section id="inicio" className="hero-section">
          <div className="hero-atmosphere" style={{ backgroundImage: `url(${heroAtmosphere})` }} />
          <div className="grid-signal" aria-hidden="true" />
          <div className="hero-layout">
            <Reveal className="hero-copy">
              <div className="hero-brand-stamp"><img src={mark} alt="" /><span>WESLEY.BARROSO<br /><small>ENGINEERING SYSTEMS</small></span></div>
              <div className="eyebrow"><span className="signal-dot" /> {copy.eyebrow}</div>
              <h1>{copy.heroTitle[0]}<br />{copy.heroTitle[1].startsWith("a ") ? "a " : ""}<em>{copy.heroTitle[1].replace(/^a\s/, "")}</em></h1>
              <p className="hero-intro">{copy.heroIntro}</p>
              <div className="hero-actions">
                <Button asChild className="signal-button">
                  <a href="#projeto" onClick={(event) => navigateToSection(event, "#projeto")}>{copy.heroActions[0]} <ArrowDown size={16} /></a>
                </Button>
                <Button asChild variant="outline" className="quiet-button">
                  <a href="#contato" onClick={(event) => navigateToSection(event, "#contato")}>{copy.heroActions[1]} <ArrowUpRight size={16} /></a>
                </Button>
              </div>
              <div className="hero-metrics" aria-label={copy.eyebrow}>
                <div><strong>01</strong><span>{copy.metrics[0]}</span></div>
                <div><strong>02</strong><span>{copy.metrics[1]}</span></div>
                <div><strong>03</strong><span>{copy.metrics[2]}</span></div>
              </div>
            </Reveal>

            <Reveal className="hero-portrait-wrap" delay={0.12}>
              <PortraitPortal />
            </Reveal>
          </div>
          <a href="#visao" onClick={(event) => navigateToSection(event, "#visao")} className="scroll-cue" aria-label={copy.explore}><span>{copy.explore}</span><ArrowDown size={16} /></a>
        </section>

        <section id="visao" className="section section--vision" data-code="SYSTEM / 01">
          <Reveal className="section-heading">
            <p className="section-index">{copy.vision.index}</p>
            <h2>{copy.vision.title[0]}<br /><em>{copy.vision.title[1]}</em></h2>
          </Reveal>

          <div className="vision-grid">
            <Reveal className="vision-manifesto" delay={0.1}>
              <p>{copy.vision.intro}</p>
              <a href="#contato" onClick={(event) => navigateToSection(event, "#contato")} className="text-link">{copy.vision.action} <ArrowUpRight size={17} /></a>
            </Reveal>

            <div className="capability-stack">
              <TiltCard delay={0.04}>
                <div className="capability-icon"><Network size={20} /></div>
                <span>01</span>
                <h3>{copy.vision.cards[0].title}</h3>
                <p>{copy.vision.cards[0].description}</p>
              </TiltCard>
              <TiltCard delay={0.1}>
                <div className="capability-icon"><Zap size={20} /></div>
                <span>02</span>
                <h3>{copy.vision.cards[1].title}</h3>
                <p>{copy.vision.cards[1].description}</p>
              </TiltCard>
              <TiltCard delay={0.16}>
                <div className="capability-icon"><Layers3 size={20} /></div>
                <span>03</span>
                <h3>{copy.vision.cards[2].title}</h3>
                <p>{copy.vision.cards[2].description}</p>
              </TiltCard>
            </div>
          </div>
        </section>

        <section className="section section--method" data-code="METHOD / 02">
          <div className="method-art" style={{ backgroundImage: `url(${systemsOrbit})` }} aria-hidden="true" />
          <Reveal className="method-statement">
            <p className="section-index">{copy.method.index}</p>
            <h2>{copy.method.title[0]}<br /><span className="heading-plain">{copy.method.title[1]}</span></h2>
          </Reveal>
          <Reveal className="method-steps" delay={0.14}>
            <div><span>01</span><strong>{copy.method.steps[0].title}</strong><p>{copy.method.steps[0].description}</p></div>
            <div><span>02</span><strong>{copy.method.steps[1].title}</strong><p>{copy.method.steps[1].description}</p></div>
            <div><span>03</span><strong>{copy.method.steps[2].title}</strong><p>{copy.method.steps[2].description}</p></div>
          </Reveal>
        </section>

        <section id="projeto" className="section section--case" data-code="CASE / 03">
          <Reveal className="section-heading section-heading--case">
            <p className="section-index">{copy.projects.index}</p>
            <h2>{copy.projects.title[0]}<br /><em>{copy.projects.title[1]}</em></h2>
          </Reveal>

          <Reveal className="case-card" delay={0.12}>
            <div className="case-art" style={{ backgroundImage: `url(${caseStudySurface})` }} />
            {latestProject && !isEmbeddedPreview && <ProjectLivePreview project={latestProject} variant="featured" copy={copy} forceFallback={forcePreviewFallback} />}
            <div className="case-number">LATEST / 01</div>
            <div className="case-content">
              <div><p className="case-kicker">{latestLoading ? copy.projects.loading : copy.projects.latest}</p></div>
              <div className="case-details">
                <h3 className="case-title--reading">{latestProjectName}</h3>
                <p>{projectsError ? copy.projects.error : copy.projects.description}</p>
                <ul className="case-tags" aria-label={copy.projects.tags.join(", ")}>
                  <li>{copy.projects.tags[0]}</li><li>{copy.projects.tags[1]}</li>{latestProject?.updatedAt ? <li>{copy.projects.tags[2]}</li> : null}
                </ul>
                <div className="case-actions">
                  {latestProject ? (
                    <a href={latestProject.previewUrl ?? latestProject.url} target="_blank" rel="noreferrer" className="case-link">{copy.projects.visit} <ArrowUpRight size={18} /></a>
                  ) : (
                    <span className="case-link case-link--disabled">{copy.projects.noProject} <ArrowUpRight size={18} /></span>
                  )}
                  <button type="button" className="case-link case-link--button" onClick={openProjects}>
                    {copy.projects.viewAll} <FolderOpen size={17} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <AnimatePresence initial={false}>
            {projectsOpen && (
              <motion.div
                className="projects-catalog"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                aria-live="polite"
              >
                <div className="projects-catalog__heading">
                  <div><span>{copy.projects.catalogLabel}</span><h3>{copy.projects.catalogTitle}</h3></div>
                  <button type="button" onClick={() => setProjectsOpen(false)} aria-label={copy.projects.closeCatalog}><X size={18} /></button>
                </div>
                {projectsLoading && <p className="projects-status">{copy.projects.loadingCatalog}</p>}
                {projectsError && <p className="projects-status">{copy.projects.catalogError}</p>}
                {!projectsLoading && !projectsError && projects.length === 0 && <p className="projects-status">{copy.projects.emptyCatalog}</p>}
                <div className="projects-grid">
                  {projects.map((project) => {
                    const projectMeta = getProjectCatalogMeta(project.name);
                    return (
                      <a className="project-entry" href={project.previewUrl ?? project.url} target="_blank" rel="noreferrer" key={project.id}>
                        <div className="project-entry__visual">
                          <ProjectLivePreview project={project} variant="catalog" copy={copy} forceFallback={forcePreviewFallback} />
                        </div>
                        <div className="project-entry__content">
                          <strong>{projectMeta.title}</strong>
                          <ProjectTechnologyIcons technologies={projectMeta.technologies} />
                        </div>
                        <p className="project-entry__description">{getLocalizedProjectDescription(project.name, copy)}</p>
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section id="stack" className="section section--stack" data-code="STACK / 04">
          <Reveal className="section-heading">
            <p className="section-index">{copy.stack.index}</p>
            <h2>{copy.stack.title[0]}<br /><span className="heading-copper">{copy.stack.title[1]}</span></h2>
          </Reveal>
          <div className="stack-layout">
            <Reveal className="stack-note" delay={0.06}>
              <Code2 size={23} />
              <p>{copy.stack.intro}</p>
            </Reveal>
            <div className="stack-groups">
              <TiltCard delay={0.04}><span className="stack-icon"><Code2 size={20} /></span><h3>{copy.stack.groups[0].title}</h3><p>{copy.stack.groups[0].description}</p></TiltCard>
              <TiltCard delay={0.1}><span className="stack-icon"><Boxes size={20} /></span><h3>{copy.stack.groups[1].title}</h3><p>{copy.stack.groups[1].description}</p></TiltCard>
              <TiltCard delay={0.16}><span className="stack-icon"><Database size={20} /></span><h3>{copy.stack.groups[2].title}</h3><p>{copy.stack.groups[2].description}</p></TiltCard>
            </div>
          </div>
        </section>

        <section id="contato" className="contact-section" style={{ backgroundImage: `url(${depthField})` }}>
          <div className="contact-overlay" />
          <Reveal className="contact-content">
            <p className="section-index">{copy.contact.index}</p>
            <h2>{copy.contact.title[0]}<br />{copy.contact.title[1].startsWith("com uma ") ? "com uma " : ""}<em>{copy.contact.title[1].replace(/^com uma\s/, "")}</em></h2>
            <p>{copy.contact.intro}</p>
            <div className="contact-actions">
              <Button asChild className="signal-button"><a href="mailto:contato@wesleybarroso.com">{copy.contact.email} <Mail size={17} /></a></Button>
              <Button asChild variant="outline" className="quiet-button"><a href="https://wa.me/5591993087692" target="_blank" rel="noreferrer">{copy.contact.whatsapp} <ArrowUpRight size={17} /></a></Button>
            </div>
          </Reveal>
        </section>

        <footer className="site-footer">
          <span>© 2026 WESLEY BARROSO</span>
          <div>
            <a href="https://github.com/Wesleybarroso" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
            <a href="https://www.linkedin.com/in/wesleybleite" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
            <a href="mailto:contato@wesleybarroso.com" aria-label="E-mail"><Mail size={19} /></a>
          </div>
          <a href="#inicio" onClick={(event) => navigateToSection(event, "#inicio")} className="back-to-top">{copy.footer.backToTop} <ArrowUpRight size={15} /></a>
        </footer>
      </main>
      <CookieConsentBanner copy={copy.cookies} />
    </div>
  );
}
