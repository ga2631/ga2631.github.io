import { ProjectItem } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { requestClient } from './requestClient';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
}

/**
 * Loads public projects dynamically from Supabase cv_documents table when external GitHub API is unreachable.
 * Avoids hardcoded static project constants in source code.
 */
async function getPublicProjectsFromSupabase(lang: string = 'vi'): Promise<ProjectItem[]> {
  try {
    if (!isSupabaseConfigured()) return [];
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('cv_documents')
      .select('projects')
      .eq('lang_code', lang)
      .maybeSingle();

    if (error || !data || !Array.isArray(data.projects)) return [];

    return data.projects
      .filter((p: ProjectItem) => p.projectType === 'public' || p.isPrivate === false)
      .map((p: ProjectItem) => ({
        ...p,
        category: 'Public',
        projectType: 'public' as const,
        isPrivate: false,
      }));
  } catch {
    return [];
  }
}

/**
 * Format repository name to human-readable title
 */
function formatRepoTitle(name: string): string {
  if (name === 'ga2631.github.io') return 'Portfolio & Technical Blog';
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Fetches public GitHub repositories for a given username, formatted as ProjectItems.
 * Applies RequestClient caching and falls back dynamically to Supabase database.
 */
export async function getPublicGithubProjects(
  username: string = 'ga2631',
  limit: number = 6,
  lang: string = 'vi'
): Promise<ProjectItem[]> {
  try {
    return await requestClient.executeWithRetry<ProjectItem[]>(
      `github_repos_${username}`,
      async () => {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
            next: { revalidate: 3600 },
          }
        );

        if (!response.ok) {
          console.warn(
            `[githubService] GitHub API responded with status ${response.status}. Loading public projects from Supabase.`
          );
          return await getPublicProjectsFromSupabase(lang);
        }

        const repos: GitHubRepo[] = await response.json();
        if (!Array.isArray(repos) || repos.length === 0) {
          return await getPublicProjectsFromSupabase(lang);
        }

        // Map GitHub repos to ProjectItem interface
        const projects: ProjectItem[] = repos
          .filter((repo) => !repo.fork) // prioritize original repositories
          .map((repo) => {
            const tags: string[] = [];
            if (repo.language) tags.push(repo.language);
            if (Array.isArray(repo.topics)) {
              repo.topics.forEach((t) => {
                const formattedTopic = t.charAt(0).toUpperCase() + t.slice(1);
                if (!tags.includes(formattedTopic)) tags.push(formattedTopic);
              });
            }

            return {
              id: `gh-${repo.name}`,
              title: formatRepoTitle(repo.name),
              category: 'Public',
              projectType: 'public',
              isPrivate: false,
              description:
                repo.description ||
                'Open-source project hosted on GitHub repository.',
              tags: tags.length > 0 ? tags.slice(0, 4) : ['Open Source', 'GitHub'],
              githubUrl: repo.html_url,
              demoUrl: repo.homepage || undefined,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
            };
          });

        return projects.length > 0 ? projects : await getPublicProjectsFromSupabase(lang);
      },
      'GET'
    );
  } catch (error) {
    console.warn('[githubService] Failed to fetch public repos, loading from Supabase:', error);
    return await getPublicProjectsFromSupabase(lang);
  }
}
