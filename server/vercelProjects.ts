import { ENV } from "./_core/env";

export type VercelProject = {
  id: string;
  name: string;
  url: string;
  updatedAt: number;
};

type VercelDeployment = {
  projectId?: string;
  name?: string;
  url?: string | null;
  state?: string;
  target?: string | null;
  ready?: number;
  created?: number;
};

export function createDeploymentsUrl(teamScope: string) {
  const params = new URLSearchParams({
    limit: "100",
    state: "READY",
    target: "production",
  });

  if (teamScope.startsWith("team_")) {
    params.set("teamId", teamScope);
  } else {
    params.set("slug", teamScope);
  }

  return `https://api.vercel.com/v7/deployments?${params.toString()}`;
}

export function createActiveProjects(deployments: VercelDeployment[]): VercelProject[] {
  const newestByProject = new Map<string, VercelProject>();

  for (const deployment of deployments) {
    if (deployment.state !== "READY" || deployment.target !== "production") continue;
    if (!deployment.projectId || !deployment.name || !deployment.url) continue;

    const candidate: VercelProject = {
      id: deployment.projectId,
      name: deployment.name,
      url: `https://${deployment.url}`,
      updatedAt: deployment.ready ?? deployment.created ?? 0,
    };
    const current = newestByProject.get(candidate.id);

    if (!current || candidate.updatedAt > current.updatedAt) {
      newestByProject.set(candidate.id, candidate);
    }
  }

  return Array.from(newestByProject.values()).sort((first, second) => second.updatedAt - first.updatedAt);
}

export async function listActiveVercelProjects(fetcher: typeof fetch = fetch): Promise<VercelProject[]> {
  if (!ENV.vercelToken || !ENV.vercelTeamId) {
    throw new Error("A integração com o Vercel ainda não está configurada.");
  }

  const response = await fetcher(createDeploymentsUrl(ENV.vercelTeamId), {
    headers: {
      Authorization: `Bearer ${ENV.vercelToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Não foi possível consultar os projetos Vercel (HTTP ${response.status}).`);
  }

  const payload = (await response.json()) as { deployments?: VercelDeployment[] };
  return createActiveProjects(payload.deployments ?? []);
}
