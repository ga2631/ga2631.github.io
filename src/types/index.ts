export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  birthday?: string;
  availability: string;
  avatarUrl?: string;
  githubUrl: string;
  linkedinUrl?: string;
  zaloUrl?: string;
  resumePdfUrl?: string;
  stats: {
    label: string;
    value: string;
    subtext?: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companySubtitle?: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  achievements: string[];
  technologies: string[];
}
export type ProjectCategory = 'Enterprise' | 'Public';

export interface ProjectChallengeSolution {
  challenge: string;
  solution: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category?: ProjectCategory | string;
  company?: string;
  role?: string;
  teamSize?: string;
  period?: string;
  featured?: boolean;
  description: string;
  shortDescription?: string;
  highlights?: string[];
  achievements?: string[];
  responsibilities?: string[];
  keyImpacts?: string[];
  challengesSolutions?: ProjectChallengeSolution[];
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  stars?: number;
  forks?: number;
  isPrivate?: boolean;
  projectType?: 'enterprise' | 'public';
}
export interface SkillItem {
  name: string;
  level: string | number;
  iconName?: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpaOrHonors?: string;
  details?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  badgeCode?: string;
  status?: string;
  isCompleted?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  date?: string;
  readTime: string;
  tags: string[];
  author: string;
  category?: string;
  categoryName?: string;
  categoryColor?: string;
  sections?: Record<string, string>;
  contentHtml: string;
  content?: string;
}

export interface BlogCategoryItem {
  id: string;
  dayCode: string;
  scheduleDay: string;
  scheduleFull: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface PrincipleItem {
  title: string;
  description: string;
}

export interface PrintCvData {
  summaryExtension?: string;
  academicDetails?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  principles: PrincipleItem[];
  printCv?: PrintCvData;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  blogPosts?: BlogPost[];
}
