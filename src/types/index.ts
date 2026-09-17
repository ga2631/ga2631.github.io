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
  companyUrl?: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  achievements: string[];
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  company?: string;
  role?: string;
  teamSize?: string;
  shortDescription?: string;
  description: string;
  category: 'Fullstack' | 'Frontend' | 'Backend / Cloud' | 'Data / AI' | 'All';
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: string[];
  keyImpacts?: string[];
  highlights: string[];
  featured?: boolean;
}

export interface SkillItem {
  name: string;
  level: 'Expert' | 'Advanced' | 'Proficient';
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
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  author: string;
  contentHtml: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  blogPosts?: BlogPost[];
}
