type Deployment = {
  projectId?: string;
  name?: string;
  url?: string | null;
  state?: string;
  target?: string | null;
  ready?: number;
  created?: number;
};

type Project = {
  id: string;
  name: string;
  url: string;
  updatedAt: number;
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
    const response = await fetch(buildDeploymentsUrl(teamScope), {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`A API Vercel respondeu com HTTP ${response.status}.`);
    }

    const payload = (await response.json()) as { deployments?: Deployment[] };
    const projects = normalizeProjects(payload.deployments ?? []);

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ latest: projects[0] ?? null, projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível consultar os projetos Vercel.";
    return res.status(502).json({ error: message, latest: null, projects: [] });
  }
}
