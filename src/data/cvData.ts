import { CVData, PersonalInfo } from '../types/index.ts';
import { getSecureEmail, getSecurePhone, getSecureZaloUrl, decodeBase64Safe } from '../utils/obfuscation.tsx';

import enUi from './locales/en/ui.json';
import enCv from './locales/en/cv.json';
import viUi from './locales/vi/ui.json';
import viCv from './locales/vi/cv.json';

export interface UITranslation {
  common: {
    more: string;
    resetFilters: string;
    shareLink: string;
    copiedLink: string;
    scrollToTop: string;
    exportPdf: string;
    articlesBadge: string;
    overview: string;
    tableOfContents: string;
    teamSize: string;
    featuredProject: string;
    currentPosition: string;
    credentialId: string;
    article: string;
    showingArticles: string;
  };
  drawer: {
    navigation: string;
    preferences: string;
    language: string;
    theme: string;
    switchToLight: string;
    switchToDark: string;
    footerNote: string;
  };
  nav: {
    about: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    blog: string;
    contact: string;
    saveCv: string;
  };
  hero: {
    greeting: string;
    viewProjects: string;
    getInTouch: string;
    saveCv: string;
    workingTreeClean: string;
    focusPrompt: string;
  };
  about: {
    badge: string;
    title: string;
    principles: { title: string; description: string }[];
  };
  experience: {
    badge: string;
    title: string;
    subtitle: string;
    technologies: string;
    currentPosition: string;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    allWorks: string;
    caseStudies: string;
    githubRepos: string;
    viewArchitecture: string;
    sourceCode: string;
    demo: string;
    publicRepo: string;
    enterpriseSystem: string;
    featuredProject: string;
    team: string;
    objective: string;
    challenges: string;
    fullStack: string;
    closeModal: string;
    noProjects: string;
    resetFilters: string;
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    expert: string;
    advanced: string;
    proficient: string;
  };
  education: {
    badge: string;
    title: string;
    subtitle: string;
    academicBg: string;
    certificationsTitle: string;
    viewCredential: string;
    credentialId: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
    readArticle: string;
    closeArticle: string;
    backToHome: string;
    searchPlaceholder: string;
    allTopics: string;
    noArticlesFound: string;
    article: string;
    showingArticles: string;
    resetFilters: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailHint: string;
    phoneLabel: string;
    phoneHint: string;
    locationLabel: string;
    locationHint: string;
    locationCta: string;
    linkedinLabel: string;
    linkedinHint: string;
    copied: string;
    copyEmail: string;
    compose: string;
    call: string;
    zalo: string;
    callZalo: string;
    viewProfile: string;
  };
  footer: {
    hostedOn: string;
    allRightsReserved: string;
  };
  printCv: {
    summaryHeading: string;
    summaryExtension: string;
    skillsHeading: string;
    experienceHeading: string;
    technologies: string;
    projectsHeading: string;
    keyTechnologies: string;
    educationHeading: string;
    academicBackground: string;
    academicDetails: string;
    certificationsAndBadges: string;
  };
}

export const uiTranslations: Record<'en' | 'vi', UITranslation> = {
  en: enUi as UITranslation,
  vi: viUi as UITranslation,
};

const createSecuredPersonalInfo = (rawPersonalInfo: PersonalInfo): PersonalInfo => ({
  ...rawPersonalInfo,
  email: rawPersonalInfo.email ? decodeBase64Safe(rawPersonalInfo.email) : getSecureEmail(),
  phone: rawPersonalInfo.phone ? decodeBase64Safe(rawPersonalInfo.phone) : getSecurePhone(),
  zaloUrl: rawPersonalInfo.zaloUrl ? decodeBase64Safe(rawPersonalInfo.zaloUrl) : getSecureZaloUrl(),
});

export const cvDataEn: CVData = {
  ...(enCv as unknown as CVData),
  personalInfo: createSecuredPersonalInfo(enCv.personalInfo as PersonalInfo),
};

export const cvDataVi: CVData = {
  ...(viCv as unknown as CVData),
  personalInfo: createSecuredPersonalInfo(viCv.personalInfo as PersonalInfo),
};

export const cvData = cvDataEn;
