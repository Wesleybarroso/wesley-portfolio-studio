type Deployment = {
  projectId?: string;
  name?: string;
  url?: string | null;
  state?: string;
  target?: string | null;
  ready?: number;
  created?: number;
};

type VercelAlias = {
  alias?: string;
  projectId?: string | null;
  redirect?: string | null;
};

type Project = {
  id: string;
  name: string;
  url: string;
  updatedAt: number;
  previewUrl?: string;
  preview?: {
    embeddable: boolean;
  };
};

type RequestLike = {
  method?: string;
};

type ResponseLike = {
  setHeader: (name: string, value: string) => void;
  status: (statusCode: number) => ResponseLike;
  json: (payload: unknown) => void;
  end: () => void;
};

function buildDeploymentsUrl(teamScope: string) {
  const parameters = new URLSearchParams({ limit: "100", state: "READY", target: "production" });
  parameters.set(teamScope.startsWith("team_") ? "teamId" : "slug", teamScope);
  return `https://api.vercel.com/v7/deployments?${parameters.toString()}`;
}

function buildAliasesUrl(teamScope: string) {
  const parameters = new URLSearchParams({ limit: "100" });
  parameters.set(teamScope.startsWith("team_") ? "teamId" : "slug", teamScope);
  return `https://api.vercel.com/v4/aliases?${parameters.toString()}`;
}

function normalizeProjects(deployments: Deployment[]): Project[] {
  const newestByProject: Record<string, Project> = {};

  deployments.forEach((deployment) => {
    if (deployment.state !== "READY" || deployment.target !== "production") return;
    if (!deployment.projectId || !deployment.name || !deployment.url) return;

    const project = {
      id: deployment.projectId,
      name: deployment.name,
      url: `https://${deployment.url}`,
      updatedAt: deployment.ready ?? deployment.created ?? 0,
    };

    if (!newestByProject[project.id] || project.updatedAt > newestByProject[project.id].updatedAt) {
      newestByProject[project.id] = project;
    }
  });

  return Object.keys(newestByProject)
    .map((key) => newestByProject[key])
    .sort((first, second) => second.updatedAt - first.updatedAt);
}

export function isFrameEmbeddingBlocked(xFrameOptions: string | null, contentSecurityPolicy: string | null) {
  const frameOptions = xFrameOptions?.toLowerCase() ?? "";
  const policy = contentSecurityPolicy?.toLowerCase() ?? "";

  return frameOptions.includes("deny")
    || frameOptions.includes("sameorigin")
    || /frame-ancestors\s+[^;]*(?:'none'|'self')/.test(policy);
}

export function getPreferredPreviewUrl(project: Project, aliases: VercelAlias[]) {
  const candidates = aliases
    .filter((alias) => alias.projectId === project.id && alias.alias && !alias.redirect)
    .map((alias) => alias.alias as string);
  const customDomain = candidates.find((alias) => !alias.endsWith(".vercel.app"));
  const stableVercelDomain = candidates.find((alias) => alias.startsWith(`${project.name}.`));
  const selectedAlias = customDomain ?? stableVercelDomain ?? candidates[0];

  return selectedAlias ? `https://${selectedAlias}` : project.url;
}

async function getPreviewCapability(projectUrl: string) {
  try {
    const response = await fetch(projectUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(4500),
    });

    return {
      embeddable: response.ok && !isFrameEmbeddingBlocked(
        response.headers.get("x-frame-options"),
        response.headers.get("content-security-policy"),
      ),
    };
  } catch {
    return { embeddable: false };
  }
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const token = process.env.VERCEL_TOKEN;
  const teamScope = process.env.VERCEL_TEAM_ID;

  if (!token || !teamScope) {
    return res.status(503).json({ error: "A integração Vercel ainda não está configurada.", latest: null, projects: [] });
  }

  try {
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const [response, aliasesResponse] = await Promise.all([
      fetch(buildDeploymentsUrl(teamScope), { headers }),
      fetch(buildAliasesUrl(teamScope), { headers }).catch(() => null),
    ]);

    if (!response.ok) {
      throw new Error(`A API Vercel respondeu com HTTP ${response.status}.`);
    }

    const payload = (await response.json()) as { deployments?: Deployment[] };
    const aliasesPayload = aliasesResponse?.ok
      ? (await aliasesResponse.json()) as { aliases?: VercelAlias[] }
      : { aliases: [] };
    const activeProjects = normalizeProjects(payload.deployments ?? []);
    const projects = await Promise.all(
      activeProjects.map(async (project) => {
        const previewUrl = getPreferredPreviewUrl(project, aliasesPayload.aliases ?? []);
        return {
          ...project,
          previewUrl,
          preview: await getPreviewCapability(previewUrl),
        };
      }),
    );

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ latest: projects[0] ?? null, projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível consultar os projetos Vercel.";
    return res.status(502).json({ error: message, latest: null, projects: [] });
  }
}
