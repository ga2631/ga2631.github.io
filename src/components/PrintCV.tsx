import React from 'react';
import { CVData } from '../types/index.ts';

interface PrintCVProps {
  data: CVData;
}

export const PrintCV: React.FC<PrintCVProps> = ({ data }) => {
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
            <span>📧 {personalInfo.email}</span>
            <span>•</span>
            <span>📞 {personalInfo.phone}</span>
            <span>•</span>
            <span>📍 {personalInfo.location}</span>
            <span>•</span>
            <span>🐙 github.com/ga2631</span>
            <span>•</span>
            <span>🌐 ga2631.github.io</span>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="print-section">
          <h2 className="print-section-heading">PROFESSIONAL SUMMARY</h2>
          <p className="print-summary-text">
            {personalInfo.bio} Proven track record of architecting scalable microservices, orchestrating CDC pipelines with zero data loss, and reducing analytical query execution times by over 70%. Experienced Technical Team Lead capable of bridging business specifications (PRDs) into high-performance distributed systems with rigorous code quality and automated CI/CD deployment workflows.
          </p>
        </section>

        {/* Core Technical Competencies */}
        <section className="print-section">
          <h2 className="print-section-heading">CORE TECHNICAL SKILLS</h2>
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
          <h2 className="print-section-heading">PROFESSIONAL EXPERIENCE</h2>
          <div className="print-experience-list">
            {experiences.map((exp) => (
              <div key={exp.id} className="print-exp-item">
                <div className="print-exp-header">
                  <div>
                    <span className="print-exp-role">{exp.role}</span>
                    <span className="print-exp-company"> | {exp.company}</span>
                  </div>
                  <div className="print-exp-meta">
                    <span>{exp.period}</span> • <span>{exp.location}</span>
                  </div>
                </div>

                <ul className="print-exp-bullets">
                  {exp.achievements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <div className="print-tech-stack">
                  <strong>Technologies:</strong> {exp.technologies.join(', ')}
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
          <h2 className="print-section-heading">FEATURED ENGINEERING ARCHITECTURE CASE STUDIES</h2>
          <div className="print-projects-list">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="print-proj-item">
                <div className="print-proj-header">
                  <span className="print-proj-title">{proj.title}</span>
                  <span className="print-proj-role">
                    {proj.role} {proj.company ? `(${proj.company})` : ''}
                  </span>
                </div>

                <p className="print-proj-desc">{proj.shortDescription || proj.description}</p>

                <ul className="print-proj-highlights">
                  {proj.highlights.slice(0, 3).map((hl, idx) => (
                    <li key={idx}>{hl}</li>
                  ))}
                </ul>

                <div className="print-tech-stack">
                  <strong>Key Technologies:</strong> {proj.tags.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="print-section">
          <h2 className="print-section-heading">EDUCATION & CERTIFICATIONS</h2>
          
          {educations.map((edu) => (
            <div key={edu.id} className="print-edu-item">
              <div className="print-edu-header">
                <div>
                  <strong className="print-edu-degree">{edu.degree}</strong>
                  <div className="print-edu-inst">{edu.institution}</div>
                </div>
                <div className="print-edu-period">{edu.period}</div>
              </div>
              <div className="print-edu-highlight">
                <strong>Academic Background:</strong> {edu.gpaOrHonors}. Completed comprehensive CS foundation curriculum (Data Structures & Algorithms, OOP, Relational Databases, Computer Networks, Operating Systems, Software Engineering). Early transition into professional software development with 5+ years of verified production engineering.
              </div>
            </div>
          ))}

          <div className="print-cert-row" style={{ marginTop: '6px' }}>
            <strong>Professional Certifications & Badges:</strong>{' '}
            {certifications.map((c) => `${c.name} (${c.issuer} - ${c.issueDate})`).join(' • ')}
          </div>
        </section>
      </div>
    </div>
  );
};
