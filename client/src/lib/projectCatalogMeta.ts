export type ProjectTechnology =
  | "react"
  | "typescript"
  | "vite"
  | "tailwind"
  | "javascript"
  | "framer"
  | "next"
  | "html"
  | "css"
  | "sass"
  | "vercel";

export type ProjectCatalogMeta = {
  title: string;
  description: string;
  technologies: ProjectTechnology[];
};

export const technologyLabels: Record<ProjectTechnology, string> = {
  react: "React",
  typescript: "TypeScript",
  vite: "Vite",
  tailwind: "Tailwind CSS",
  javascript: "JavaScript",
  framer: "Framer Motion",
  next: "Next.js",
  html: "HTML5",
  css: "CSS3",
  sass: "Sass",
  vercel: "Vercel",
};

const catalogMeta: Record<string, ProjectCatalogMeta> = {
  "wesley-portfolio-studio": {
    title: "Wesley Portfolio Studio",
    description: "Portfólio de engenharia com vitrine dinâmica de projetos e experiências visuais de profundidade.",
    technologies: ["react", "typescript", "vite"],
  },
  altixdev: {
    title: "Altixdev",
    description: "Site institucional da Altixdev para apresentar software sob medida, automações e produtos digitais.",
    technologies: ["react", "typescript", "tailwind", "vite"],
  },
  portifolio: {
    title: "Portfólio Wesley",
    description: "Portfólio anterior com apresentação profissional, projetos e serviços de engenharia full stack.",
    technologies: ["react", "javascript", "framer", "vite"],
  },
  espacoglamour: {
    title: "Espaço Glamour",
    description: "Experiência digital para salão de beleza com serviços, localização e canais de contato.",
    technologies: ["next", "react", "typescript", "tailwind", "framer"],
  },
  projetoverdeacao: {
    title: "Verde Ação",
    description: "Plataforma de mobilização ambiental para voluntariado, campanhas e transformação coletiva.",
    technologies: ["html", "css", "sass"],
  },
};

const defaultMeta: ProjectCatalogMeta = {
  title: "Projeto em produção",
  description: "Projeto ativo publicado em produção e atualizado a partir da conta Vercel.",
  technologies: ["vercel"],
};

export function getProjectCatalogMeta(projectName: string): ProjectCatalogMeta {
  return catalogMeta[projectName.toLowerCase()] ?? {
    ...defaultMeta,
    title: projectName,
  };
}
