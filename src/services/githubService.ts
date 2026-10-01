import { ProjectItem } from '@/types';
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
 * High quality fallback public projects from GitHub (ga2631)
 */
export const FALLBACK_PUBLIC_PROJECTS: ProjectItem[] = [
  {
    id: 'omni-recon',
    title: 'Omni-Recon Platform',
    category: 'Public',
    projectType: 'public',
    isPrivate: false,
    description:
      'Hệ thống đối soát tài chính đa kênh. Áp dụng kiến trúc Medallion xử lý dữ liệu với tốc độ cao, đảm bảo tính toàn vẹn và dễ dàng cài đặt.',
    tags: ['Rust', 'DuckDB', 'Vue 3'],
    githubUrl: 'https://github.com/ga2631',
  },
  {
    id: 'portfolio-gen',
    title: 'Portfolio Generator',
    category: 'Public',
    projectType: 'public',
    isPrivate: false,
    description:
      'Hệ thống tạo SSG Blog từ file Markdown, kết hợp CI/CD Github Actions và Tracking Analytics chuẩn xác. Hiện đang được dùng cho chính trang web này.',
    tags: ['Next.js', 'GA4', 'GTM'],
    githubUrl: 'https://github.com/ga2631/ga2631.github.io',
  },
  {
    id: 'word-solver',
    title: 'Wordle Solver Microservice',
    category: 'Public',
    projectType: 'public',
    isPrivate: false,
    description:
      'Production-ready full-stack Wordle solver microservice and dashboard built with Python (FastAPI), React (Vite), and Docker. Features optimal entropy-based puzzle resolution in 3–5 guesses.',
    tags: ['Python', 'FastAPI', 'React', 'Docker'],
    githubUrl: 'https://github.com/ga2631/word-solver',
  },
  {
    id: 'bigquery-importer',
    title: 'BigQuery Avro Importer',
    category: 'Public',
    projectType: 'public',
    isPrivate: false,
    description:
      'High-performance importer for BigQuery Avro data into PostgreSQL via DuckDB, with automatic schema detection and nested JSON casting.',
    tags: ['Python', 'DuckDB', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/ga2631/bigquery-importer',
  },
];

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
 * Applies RequestClient caching and handles rate limits gracefully.
 */
export async function getPublicGithubProjects(
  username: string = 'ga2631',
  limit: number = 6
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
            `[githubService] GitHub API responded with status ${response.status}. Using fallback.`
          );
          return FALLBACK_PUBLIC_PROJECTS;
        }

        const repos: GitHubRepo[] = await response.json();
        if (!Array.isArray(repos) || repos.length === 0) {
          return FALLBACK_PUBLIC_PROJECTS;
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

        return projects.length > 0 ? projects : FALLBACK_PUBLIC_PROJECTS;
      },
      'GET'
    );
  } catch (error) {
    console.warn('[githubService] Failed to fetch public repos, falling back:', error);
    return FALLBACK_PUBLIC_PROJECTS;
  }
}
