/**
 * DESIGN — Arquitetura de Luz: painéis de vidro fumê, azul Sinal Altitude,
 * composição assimétrica e motion preciso para uma presença de engenharia premium.
 */
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  Code2,
  Database,
  FolderOpen,
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
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

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

function ProjectLivePreview({
  project,
  variant,
  forceFallback = false,
}: {
  project: LiveProject;
  variant: "featured" | "catalog";
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
        <span>{previewState === "loading" ? "CARREGANDO PRÉVIA" : "PRÉVIA INDISPONÍVEL"}</span>
        <strong>{project.name}</strong>
        <small>{previewState === "loading" ? "Preparando a visualização ao vivo." : "Use “Visitar projeto” para abrir a versão publicada."}</small>
      </div>
      {shouldRenderPreview && (
        <iframe
          src={addPortfolioPreviewParameter(project.previewUrl ?? project.url)}
          title={`Prévia do projeto ${project.name}`}
          tabIndex={-1}
          loading="lazy"
          onLoad={() => setPreviewState("ready")}
          onError={() => setPreviewState("fallback")}
        />
      )}
      <span className={labelClassName}>
        {previewState === "ready" ? "LIVE / PREVIEW" : previewState === "loading" ? "CARREGANDO" : "LINK DIRETO"}
      </span>
    </div>
  );
}

export default function PortfolioExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [latestProject, setLatestProject] = useState<LiveProject | null>(null);
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.2 });
  const latestProjectName = latestProject?.name
    ?? (latestLoading ? "Consultando Vercel" : "Aguardando projeto ativo");
  const isEmbeddedPreview = new URLSearchParams(window.location.search).has("portfolio-preview");
  const forcePreviewFallback = new URLSearchParams(window.location.search).has("preview-fallback");

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
  }, []);

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

      <aside className="command-rail" aria-label="Navegação principal">
        <a href="#inicio" className="brand-lockup" aria-label="Ir para o início" onClick={(event) => navigateToSection(event, "#inicio")}>
          <img src={mark} alt="Símbolo WB" className="brand-mark" />
          <span>WESLEY<br />BARROSO</span>
          <b className="brand-code">WB/</b>
        </a>

        <nav className="rail-nav">
          {navItems.map(([label, href], index) => (
            <a href={href} key={href} onClick={(event) => navigateToSection(event, href)} className={`rail-link ${activeSection === href.slice(1) ? "is-active" : ""}`}>
              <small>0{index + 1}</small><span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="rail-footer">
          <span className="availability-dot" />
          <p>Aberto a projetos<br />e parcerias.</p>
        </div>
      </aside>

      <header className="mobile-command-bar">
        <a href="#inicio" className="brand-lockup" aria-label="Ir para o início" onClick={(event) => navigateToSection(event, "#inicio")}>
          <img src={mark} alt="Símbolo WB" className="brand-mark" />
          <span>WESLEY<br />BARROSO</span>
          <b className="brand-code">WB/</b>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fechar navegação" : "Abrir navegação"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={21} />}
        </button>
        {menuOpen && (
          <nav className="mobile-menu">
            {navItems.map(([label, href], index) => (
              <a href={href} key={href} onClick={(event) => { navigateToSection(event, href); closeMenu(); }} className={activeSection === href.slice(1) ? "is-active" : ""}>
                <small>0{index + 1}</small>{label}
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
              <div className="eyebrow"><span className="signal-dot" /> ENGENHEIRO DE SOFTWARE / FULL STACK</div>
              <h1>Da operação complexa<br />a <em>sistemas claros.</em></h1>
              <p className="hero-intro">Sou <strong>Wesley Barroso</strong>. Projeto aplicações, integrações e automações que dão escala ao que realmente move o seu negócio.</p>
              <div className="hero-actions">
                <Button asChild className="signal-button">
                  <a href="#projeto" onClick={(event) => navigateToSection(event, "#projeto")}>Ver trabalho selecionado <ArrowDown size={16} /></a>
                </Button>
                <Button asChild variant="outline" className="quiet-button">
                  <a href="#contato" onClick={(event) => navigateToSection(event, "#contato")}>Iniciar uma conversa <ArrowUpRight size={16} /></a>
                </Button>
              </div>
              <div className="hero-metrics" aria-label="Especialidades">
                <div><strong>01</strong><span>Produtos digitais</span></div>
                <div><strong>02</strong><span>Automações úteis</span></div>
                <div><strong>03</strong><span>Arquitetura escalável</span></div>
              </div>
            </Reveal>

            <Reveal className="hero-portrait-wrap" delay={0.12}>
              <PortraitPortal />
            </Reveal>
          </div>
          <a href="#visao" onClick={(event) => navigateToSection(event, "#visao")} className="scroll-cue" aria-label="Explorar a próxima seção"><span>EXPLORE</span><ArrowDown size={16} /></a>
        </section>

        <section id="visao" className="section section--vision" data-code="SYSTEM / 01">
          <Reveal className="section-heading">
            <p className="section-index">01 / VISÃO DE ENTREGA</p>
            <h2>Engenharia que se<br /><em>enxerga no resultado.</em></h2>
          </Reveal>

          <div className="vision-grid">
            <Reveal className="vision-manifesto" delay={0.1}>
              <p>Trabalho entre o detalhe técnico e a necessidade de negócio. Isso significa ouvir o processo, desenhar a arquitetura certa e entregar experiências que não criam mais fricção.</p>
              <a href="#contato" onClick={(event) => navigateToSection(event, "#contato")} className="text-link">Vamos mapear a sua operação <ArrowUpRight size={17} /></a>
            </Reveal>

            <div className="capability-stack">
              <TiltCard delay={0.04}>
                <div className="capability-icon"><Network size={20} /></div>
                <span>01</span>
                <h3>Sistemas conectados</h3>
                <p>APIs e integrações para transformar ferramentas isoladas em fluxos consistentes.</p>
              </TiltCard>
              <TiltCard delay={0.1}>
                <div className="capability-icon"><Zap size={20} /></div>
                <span>02</span>
                <h3>Automação com intenção</h3>
                <p>Processos que reduzem tarefas repetitivas e deixam a equipe focada no que exige decisão.</p>
              </TiltCard>
              <TiltCard delay={0.16}>
                <div className="capability-icon"><Layers3 size={20} /></div>
                <span>03</span>
                <h3>Produtos que evoluem</h3>
                <p>Interfaces e estruturas pensadas para manter performance quando o negócio cresce.</p>
              </TiltCard>
            </div>
          </div>
        </section>

        <section className="section section--method" data-code="METHOD / 02">
          <div className="method-art" style={{ backgroundImage: `url(${systemsOrbit})` }} aria-hidden="true" />
          <Reveal className="method-statement">
            <p className="section-index">02 / MÉTODO</p>
            <h2>Clareza para decidir.<br /><span className="heading-plain">Rigor para construir.</span></h2>
          </Reveal>
          <Reveal className="method-steps" delay={0.14}>
            <div><span>01</span><strong>Descobrir</strong><p>Entender a rotina, os limites e o objetivo da operação.</p></div>
            <div><span>02</span><strong>Estruturar</strong><p>Definir experiência, dados, integrações e caminho de escala.</p></div>
            <div><span>03</span><strong>Entregar</strong><p>Construir, validar e evoluir a solução em ciclos objetivos.</p></div>
          </Reveal>
        </section>

        <section id="projeto" className="section section--case" data-code="CASE / 03">
          <Reveal className="section-heading section-heading--case">
            <p className="section-index">03 / VITRINE VERCEL</p>
            <h2>Seu trabalho mais recente,<br /><em>sempre em produção.</em></h2>
          </Reveal>

          <Reveal className="case-card" delay={0.12}>
            <div className="case-art" style={{ backgroundImage: `url(${caseStudySurface})` }} />
            {latestProject && !isEmbeddedPreview && <ProjectLivePreview project={latestProject} variant="featured" forceFallback={forcePreviewFallback} />}
            <div className="case-number">LATEST / 01</div>
            <div className="case-content">
              <div>
                <p className="case-kicker">{latestLoading ? "ATUALIZANDO PROJETO" : "PROJETO MAIS RECENTE NO VERCEL"}</p>
                <h3>{latestProjectName}</h3>
              </div>
              <div className="case-details">
                <p>{projectsError ? "A integração Vercel precisa ser concluída para exibir o projeto mais recente." : "Este card é atualizado pela sua conta Vercel e sempre mostra o último projeto com deployment ativo em produção."}</p>
                <ul className="case-tags" aria-label="Tecnologias do projeto">
                  <li>Vercel</li><li>Produção</li>{latestProject?.updatedAt ? <li>Atualizado recentemente</li> : null}
                </ul>
                <div className="case-actions">
                  {latestProject ? (
                    <a href={latestProject.url} target="_blank" rel="noreferrer" className="case-link">Visitar projeto <ArrowUpRight size={18} /></a>
                  ) : (
                    <span className="case-link case-link--disabled">Aguardando projeto <ArrowUpRight size={18} /></span>
                  )}
                  <button type="button" className="case-link case-link--button" onClick={openProjects}>
                    Ver meus projetos <FolderOpen size={17} />
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
                  <div><span>CATÁLOGO / VERCEL</span><h3>Projetos ativos</h3></div>
                  <button type="button" onClick={() => setProjectsOpen(false)} aria-label="Fechar lista de projetos"><X size={18} /></button>
                </div>
                {projectsLoading && <p className="projects-status">Carregando os projetos ativos da sua conta Vercel.</p>}
                {projectsError && <p className="projects-status">Não foi possível atualizar a lista agora. Tente novamente em alguns instantes.</p>}
                {!projectsLoading && !projectsError && projects.length === 0 && <p className="projects-status">Nenhum projeto ativo foi encontrado nesta conta Vercel.</p>}
                <div className="projects-grid">
                  {projects.map((project, index) => (
                    <a className="project-entry" href={project.url} target="_blank" rel="noreferrer" key={project.id}>
                      <ProjectLivePreview project={project} variant="catalog" forceFallback={forcePreviewFallback} />
                      <span>0{index + 1} / PRODUÇÃO</span>
                      <strong>{project.name}</strong>
                      <ArrowUpRight size={18} />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section id="stack" className="section section--stack" data-code="STACK / 04">
          <Reveal className="section-heading">
            <p className="section-index">04 / FERRAMENTAS, NÃO ENFEITES</p>
            <h2>Decisões técnicas para<br /><span className="heading-copper">sistemas que duram.</span></h2>
          </Reveal>
          <div className="stack-layout">
            <Reveal className="stack-note" delay={0.06}>
              <Code2 size={23} />
              <p>A stack não é uma coleção de logos. É um conjunto de decisões para cada contexto, equipe e velocidade de evolução.</p>
            </Reveal>
            <div className="stack-groups">
              <TiltCard delay={0.04}><span className="stack-icon"><Code2 size={20} /></span><h3>Interfaces</h3><p>React · TypeScript · JavaScript · SCSS</p></TiltCard>
              <TiltCard delay={0.1}><span className="stack-icon"><Boxes size={20} /></span><h3>Serviços</h3><p>Node.js · APIs REST · Express · Supabase</p></TiltCard>
              <TiltCard delay={0.16}><span className="stack-icon"><Database size={20} /></span><h3>Dados & entrega</h3><p>PostgreSQL · MongoDB · Docker · Linux</p></TiltCard>
            </div>
          </div>
        </section>

        <section id="contato" className="contact-section" style={{ backgroundImage: `url(${depthField})` }}>
          <div className="contact-overlay" />
          <Reveal className="contact-content">
            <p className="section-index">05 / PRÓXIMO PASSO</p>
            <h2>Uma boa solução começa<br />com uma <em>conversa clara.</em></h2>
            <p>Se você tem um processo para melhorar, uma ideia para validar ou um produto para estruturar, podemos desenhar o próximo passo juntos.</p>
            <div className="contact-actions">
              <Button asChild className="signal-button"><a href="mailto:contato@wesleybarroso.com">Escrever um e-mail <Mail size={17} /></a></Button>
              <Button asChild variant="outline" className="quiet-button"><a href="https://wa.me/5591993087692" target="_blank" rel="noreferrer">Falar no WhatsApp <ArrowUpRight size={17} /></a></Button>
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
          <a href="#inicio" onClick={(event) => navigateToSection(event, "#inicio")} className="back-to-top">VOLTAR AO TOPO <ArrowUpRight size={15} /></a>
        </footer>
      </main>
    </div>
  );
}
