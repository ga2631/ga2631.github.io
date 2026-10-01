'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { getCvData } from '@/services/cvService';
import { CVData } from '@/types';
import { trackProjectModalOpen, trackContactCopy } from '@/utils/analytics';

export function HomeView({ initialCvData }: { initialCvData?: CVData | null }) {
  const { dict, currentLang, getLocalizedHref } = useLanguage();
  const [cv, setCv] = useState<CVData | null>(initialCvData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCvData);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadCv() {
      setIsLoading(true);
      try {
        const data = await getCvData(currentLang);
        if (isMounted) setCv(data);
      } catch (err) {
        console.warn('[HomeView] Could not load CV from Supabase, fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCv();
    return () => {
      isMounted = false;
    };
  }, [currentLang]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    trackContactCopy('email');
    setCopyStatus(dict.common.copied);
    setTimeout(() => setCopyStatus(''), 2000);
  };

  if (isLoading && !cv) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent animate-spin mb-4" />
        <p className="text-gray-400 text-sm">{dict.common.loading}</p>
      </div>
    );
  }

  const personal = cv?.personalInfo || {
    fullName: 'Huỳnh Nhật Tân',
    jobTitle: 'Software Architect & Lead Fullstack Engineer',
    tagline: 'Designing resilient distributed architectures, data warehouses, and high-performance applications.',
    bio: 'Experienced Technical Architect with over 7 years in building scalable enterprise systems, real-time analytics, and developer tools.',
    email: 'tanhn.dev@gmail.com',
    location: 'Ho Chi Minh City, Vietnam',
    availability: 'Available for Advisory & Key Roles',
    githubUrl: 'https://github.com/ga2631',
    stats: [
      { label: 'Experience', value: '7+ Years', subtext: 'Full Lifecycle' },
      { label: 'Architecture', value: '1000+ CCU', subtext: 'High Concurrency' },
      { label: 'Data Warehouse', value: 'Medallion', subtext: 'Bronze-Silver-Gold' },
      { label: 'Deployment', value: 'Zero-Downtime', subtext: 'Automated CI/CD' },
    ],
  };

  const experiences = cv?.experiences || [];
  const projects = cv?.projects || [];
  const skillCategories = cv?.skillCategories || [];
  const principles = cv?.principles || [];
  const educations = cv?.educations || [];
  const certifications = cv?.certifications || [];

  return (
    <div className="space-y-20">
      {/* 1. HERO SECTION */}
      <section id="about" className="pt-6 pb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{personal.availability}</span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3">
                {personal.fullName}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-gradient-red">
                {personal.jobTitle}
              </p>
            </div>

            <p className="text-base text-gray-300 leading-relaxed max-w-3xl">
              {personal.tagline}
            </p>

            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
              {personal.bio}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105"
              >
                {dict.cv.contactMe}
              </a>
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold text-sm border border-gray-700 transition-colors"
              >
                {dict.cv.viewProjects}
              </a>
              <Link
                href={getLocalizedHref('blog')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 border border-indigo-500/30 font-semibold text-sm transition-all"
              >
                {dict.cv.viewBlog}
              </Link>
            </div>
          </div>

          {/* Metric Highlights Grid */}
          <div className="w-full lg:w-96 grid grid-cols-2 gap-3.5">
            {personal.stats.map((st, i) => (
              <div
                key={i}
                className="glass-panel p-4 rounded-2xl border border-gray-800 hover:border-red-500/40 transition-all"
              >
                <div className="text-2xl font-black text-white">{st.value}</div>
                <div className="text-xs font-semibold text-red-400 mt-1">{st.label}</div>
                {st.subtext && <div className="text-[11px] text-gray-400 mt-0.5">{st.subtext}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CORE ARCHITECTURAL PRINCIPLES */}
      {principles.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-lg">✦</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {dict.cv.principlesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles.map((pr, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="font-bold text-base text-gray-100 mb-2">{pr.title}</div>
                <p className="text-xs text-gray-400 leading-relaxed">{pr.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. PROFESSIONAL EXPERIENCE */}
      <section id="experience" className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-red-500 text-lg">✦</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {dict.cv.experienceTitle}
          </h2>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="glass-panel p-6 rounded-2xl border border-gray-800 hover:border-gray-700/80 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <div className="text-sm font-semibold text-red-400">
                    {exp.company} {exp.companySubtitle && `— ${exp.companySubtitle}`}
                  </div>
                </div>
                <div className="text-xs font-mono text-gray-400 px-3 py-1 bg-gray-900 rounded-lg border border-gray-800 w-fit">
                  {exp.period}
                </div>
              </div>

              <p className="text-xs text-gray-300 mb-4">{exp.summary}</p>

              {exp.achievements && exp.achievements.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {dict.cv.keyAchievements}:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                    {exp.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {exp.technologies && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-800/80">
                  {exp.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-gray-900 text-gray-300 text-[11px] font-mono border border-gray-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROJECTS & CASE STUDIES */}
      <section id="projects" className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-red-500 text-lg">✦</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {dict.cv.projectsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-panel p-6 rounded-2xl border border-gray-800 hover:border-red-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-semibold border border-red-500/20">
                    {proj.category}
                  </span>
                  {proj.company && (
                    <span className="text-xs text-gray-400 font-medium">{proj.company}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                  {proj.shortDescription || proj.description}
                </p>

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="space-y-1 mb-4 text-xs text-gray-400">
                    {proj.highlights.slice(0, 3).map((hl: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tags.map((tg: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-gray-900 text-gray-400 text-[11px] font-mono border border-gray-800"
                    >
                      {tg}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => {
                      setSelectedProject(proj);
                      trackProjectModalOpen(proj);
                    }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    {dict.cv.caseStudy} →
                  </button>

                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {dict.cv.liveDemo}
                    </a>
                  )}

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {dict.cv.sourceCode}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SKILLS MATRIX */}
      <section id="skills" className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-red-500 text-lg">✦</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {dict.cv.skillsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
            >
              <h3 className="text-base font-bold text-white mb-1">{cat.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{cat.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((sk, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1 rounded-lg bg-gray-900/90 text-gray-200 text-xs font-medium border border-gray-800 flex items-center gap-1.5"
                  >
                    <span>{sk.name}</span>
                    <span className="text-[10px] text-red-400 font-mono">
                      {typeof sk.level === 'number' ? `${sk.level}%` : sk.level}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EDUCATION & CERTIFICATIONS */}
      {(educations.length > 0 || certifications.length > 0) && (
        <section id="education" className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-lg">✦</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {dict.cv.educationTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educations.map((edu) => (
              <div key={edu.id} className="glass-panel p-5 rounded-2xl border border-gray-800">
                <div className="text-base font-bold text-white">{edu.degree}</div>
                <div className="text-xs text-red-400 font-medium mt-1">{edu.institution}</div>
                <div className="text-xs text-gray-400 font-mono mt-1">{edu.period}</div>
                {edu.gpaOrHonors && (
                  <div className="text-xs text-gray-300 mt-2 font-medium">
                    GPA/Honors: {edu.gpaOrHonors}
                  </div>
                )}
              </div>
            ))}

            {certifications.map((cert) => (
              <div key={cert.id} className="glass-panel p-5 rounded-2xl border border-gray-800">
                <div className="text-base font-bold text-white">{cert.name}</div>
                <div className="text-xs text-indigo-400 font-medium mt-1">{cert.issuer}</div>
                <div className="text-xs text-gray-400 font-mono mt-1">{cert.issueDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CONTACT & CONNECTIVITY */}
      <section id="contact" className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-red-500 text-lg">✦</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {dict.cv.contactTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
            <div className="text-xs font-semibold text-gray-400 mb-1">Email</div>
            <div className="text-sm font-mono text-white select-all">{personal.email}</div>
            <button
              onClick={() => handleCopyEmail(personal.email)}
              className="mt-2 text-xs text-red-400 hover:text-red-300 font-medium"
            >
              {copyStatus || dict.common.copy}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
            <div className="text-xs font-semibold text-gray-400 mb-1">Location</div>
            <div className="text-sm text-white">{personal.location}</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
            <div className="text-xs font-semibold text-gray-400 mb-1">GitHub</div>
            <a
              href={personal.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-red-400 hover:underline"
            >
              github.com/ga2631
            </a>
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-red-400">{selectedProject.category}</span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{selectedProject.description}</p>

            {selectedProject.challengesSolutions && selectedProject.challengesSolutions.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-200 uppercase">Thách thức & Giải pháp:</div>
                {selectedProject.challengesSolutions.map((cs: any, i: number) => (
                  <div key={i} className="bg-gray-950 p-3 rounded-xl border border-gray-800 text-xs">
                    <div className="text-amber-400 font-semibold mb-1">⚠️ {cs.challenge}</div>
                    <div className="text-emerald-400">✅ {cs.solution}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
              >
                {dict.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
