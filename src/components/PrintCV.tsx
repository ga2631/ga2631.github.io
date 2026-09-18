import React from 'react';
import { CVData } from '../types/index.ts';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GithubIcon,
  LinkedinIcon,
  GlobeIcon,
} from './Icons.tsx';
import { SecureEmail, SecurePhone } from '../utils/obfuscation.tsx';
import { UITranslation } from '../data/cvData.ts';

interface PrintCVProps {
  data: CVData;
  t: UITranslation['printCv'];
}

export const PrintCV: React.FC<PrintCVProps> = ({ data, t }) => {
  const { personalInfo, experiences, projects, skillCategories, educations, certifications } = data;

  return (
    <div className="print-cv-document">
      {/* ================= PAGE 1 ================= */}
      <div className="print-page-1">
        {/* Header / Contact Bar */}
        <header className="print-header">
          <h1 className="print-name">{personalInfo.fullName.toUpperCase()}</h1>
          <div className="print-title">{personalInfo.jobTitle.toUpperCase()}</div>

          <div className="print-contact-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <MailIcon size={10} /> <SecureEmail />
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <PhoneIcon size={10} /> <SecurePhone />
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <MapPinIcon size={10} /> {personalInfo.location}
            </span>
          </div>

          <div className="print-contact-row print-contact-links">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <GithubIcon size={10} /> github.com/ga2631
            </span>
            {personalInfo.linkedinUrl && (
              <>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <LinkedinIcon size={10} /> {personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </span>
              </>
            )}
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <GlobeIcon size={10} /> ga2631.github.io
            </span>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="print-section">
          <h2 className="print-section-heading">
            {t.summaryHeading}
          </h2>
          <p className="print-summary-text">
            {personalInfo.bio} {data.printCv?.summaryExtension ? ` ${data.printCv.summaryExtension}` : ''}
          </p>
        </section>

        {/* Core Technical Competencies */}
        <section className="print-section">
          <h2 className="print-section-heading">
            {t.skillsHeading}
          </h2>
          <div className="print-skills-table">
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="print-skill-row">
                <strong className="print-skill-category">{cat.title}:</strong>
                <span className="print-skill-list">
                  {cat.skills.map((s) => s.name).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="print-section">
          <h2 className="print-section-heading">
            {t.experienceHeading}
          </h2>
          <div className="print-experience-list">
            {experiences.map((exp) => (
              <div key={exp.id} className="print-exp-item">
                <div className="print-exp-header">
                  <div className="print-exp-title-group">
                    <span className="print-exp-role">{exp.role}</span>
                    <span className="print-exp-company"> | {exp.company}</span>
                  </div>
                  <div className="print-exp-meta">
                    <span>{exp.period}</span> • <span>{exp.location}</span>
                  </div>
                </div>

                <ul className="print-exp-bullets">
                  {exp.achievements.map((item, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>

                <div className="print-tech-stack">
                  <strong>{t.technologies}</strong> {exp.technologies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="print-page-2">
        {/* Key Enterprise Projects & Architecture Case Studies */}
        <section className="print-section">
          <h2 className="print-section-heading">
            {t.projectsHeading}
          </h2>
          <div className="print-projects-list">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="print-proj-item">
                <div className="print-proj-header">
                  <span className="print-proj-title">{proj.title}</span>
                </div>

                {(proj.role || proj.company) && (
                  <div className="print-proj-sub">
                    {proj.role && <span className="print-proj-role">{proj.role}</span>}
                    {proj.role && proj.company && <span className="print-proj-separator"> | </span>}
                    {proj.company && <span className="print-proj-company">{proj.company}</span>}
                  </div>
                )}

                <p className="print-proj-desc">{proj.shortDescription || proj.description}</p>

                <ul className="print-proj-highlights">
                  {(proj.achievements || proj.highlights).slice(0, 3).map((hl, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: hl }} />
                  ))}
                </ul>

                <div className="print-tech-stack">
                  <strong>{t.keyTechnologies}</strong> {proj.tags.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="print-section">
          <h2 className="print-section-heading">
            {t.educationHeading}
          </h2>

          {educations.map((edu) => (
            <div key={edu.id} className="print-edu-item">
              <div className="print-edu-header">
                <div className="print-edu-title-group">
                  <strong className="print-edu-degree">{edu.degree}</strong>
                  <span className="print-edu-inst"> | {edu.institution}</span>
                </div>
                <div className="print-edu-period">{edu.period}</div>
              </div>

              {edu.gpaOrHonors && (
                <div className="print-edu-gpa">
                  <strong>{t.academicBackground}</strong> {edu.gpaOrHonors}
                </div>
              )}

              {edu.details && (
                <ul className="print-edu-bullets">
                  {edu.details.map((detail, idx) => {
                    const [title, ...rest] = detail.split(': ');
                    return (
                      <li key={idx}>
                        <strong>{title}:</strong> {rest.join(': ')}
                      </li>
                    );
                  })}
                </ul>
              )}

              {!edu.details && data.printCv?.academicDetails && (
                <div className="print-edu-highlight">
                  {data.printCv.academicDetails}
                </div>
              )}
            </div>
          ))}

          {certifications.map((cert) => (
            <div key={cert.id} className="print-cert-item">
              <div className="print-edu-header">
                <div className="print-edu-title-group">
                  <strong className="print-edu-degree">{cert.name}</strong>
                  <span className="print-edu-inst"> | {cert.issuer}</span>
                </div>
                <div className="print-edu-period">{cert.issueDate}</div>
              </div>
              {cert.status && (
                <div className="print-edu-gpa">
                  <strong>{t.certificationsAndBadges}</strong> {cert.status}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

