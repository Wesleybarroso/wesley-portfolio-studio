import { getPreferredPreviewUrl, isFrameEmbeddingBlocked } from "../api/projects";
import { ENV } from "./_core/env";

export type VercelProject = {
  id: string;
  name: string;
  url: string;
  updatedAt: number;
  deploymentId?: string;
  previewUrl?: string;
  preview?: {
    embeddable: boolean;
  };
};

type VercelDeployment = {
  uid?: string;
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
  redirect?: string | null;
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

function createDeploymentAliasesUrl(deploymentId: string, teamScope: string) {
  const params = new URLSearchParams();
  params.set(teamScope.startsWith("team_") ? "teamId" : "slug", teamScope);
  return `https://api.vercel.com/v2/deployments/${encodeURIComponent(deploymentId)}/aliases?${params.toString()}`;
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
      ...(deployment.uid ? { deploymentId: deployment.uid } : {}),
    };
    const current = newestByProject.get(candidate.id);

    if (!current || candidate.updatedAt > current.updatedAt) {
      newestByProject.set(candidate.id, candidate);
    }
  }

  return Array.from(newestByProject.values()).sort((first, second) => second.updatedAt - first.updatedAt);
}

export function createPublicProject(
  project: VercelProject,
  aliases: VercelAlias[],
  embeddable: boolean,
  teamScope = ENV.vercelTeamId,
): Omit<VercelProject, "url"> {
  const previewUrl = getPreferredPreviewUrl(project, aliases, teamScope);
  const { url: _deploymentUrl, ...publicProject } = project;
  return {
    ...publicProject,
    ...(previewUrl ? { previewUrl } : {}),
    preview: { embeddable: Boolean(previewUrl) && embeddable },
  };
}

async function getAliasesForDeployment(deploymentId: string | undefined, teamScope: string, headers: Record<string, string>) {
  if (!deploymentId) return [];

  try {
    const response = await fetch(createDeploymentAliasesUrl(deploymentId, teamScope), { headers });
    if (!response.ok) return [];
    const payload = (await response.json()) as { aliases?: VercelAlias[] };
    return payload.aliases ?? [];
  } catch {
    return [];
  }
}

async function getPreviewCapability(projectUrl: string | undefined) {
  if (!projectUrl) return false;

  try {
    const response = await fetch(projectUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(4500),
    });
    return response.ok && !isFrameEmbeddingBlocked(
      response.headers.get("x-frame-options"),
      response.headers.get("content-security-policy"),
    );
  } catch {
    return false;
  }
}

export async function listActiveVercelProjects(fetcher: typeof fetch = fetch): Promise<Array<Omit<VercelProject, "url">>> {
  if (!ENV.vercelToken || !ENV.vercelTeamId) {
    throw new Error("A integração com o Vercel ainda não está configurada.");
  }

  const headers = {
    Authorization: `Bearer ${ENV.vercelToken}`,
    "Content-Type": "application/json",
  };
  const response = await fetcher(createDeploymentsUrl(ENV.vercelTeamId), { headers });

  if (!response.ok) {
    throw new Error(`Não foi possível consultar os projetos Vercel (HTTP ${response.status}).`);
  }

  const payload = (await response.json()) as { deployments?: VercelDeployment[] };
  const projects = createActiveProjects(payload.deployments ?? []);

  return Promise.all(projects.map(async (project) => {
    const aliases = await getAliasesForDeployment(project.deploymentId, ENV.vercelTeamId, headers);
    const previewUrl = getPreferredPreviewUrl(project, aliases, ENV.vercelTeamId);
    const embeddable = await getPreviewCapability(previewUrl);
    return createPublicProject(project, aliases, embeddable);
  }));
}
