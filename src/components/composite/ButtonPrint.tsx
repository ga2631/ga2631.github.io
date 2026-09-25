import React from 'react';
import { Button, ButtonVariant, ButtonSize } from '../common/Button';
import { ButtonFloating } from '../ui/ButtonFloating';
import {
  DownloadIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GithubIcon,
  LinkedinIcon,
  GlobeIcon,
} from '../Icons.tsx';
import { SecureEmail, SecurePhone } from '../../utils/obfuscation.tsx';
import { CVData } from '../../types/index.ts';
import { UITranslation } from '../../data/cvData.ts';
import { trackPrintCV } from '../../utils/analytics';

export interface ButtonPrintProps {
  data?: CVData;
  tPrintCv?: UITranslation['printCv'];
  onPrint?: () => void;
  variant?: 'floating' | 'default';
  buttonVariant?: ButtonVariant;
  size?: ButtonSize;
  label?: React.ReactNode;
  title?: string;
  className?: string;
  id?: string;
  iconSize?: number;
  tCommon?: UITranslation['common'];
  children?: React.ReactNode;
}

export const ButtonPrint: React.FC<ButtonPrintProps> = ({
  data,
  tPrintCv,
  onPrint,
  variant = 'default',
  buttonVariant = 'primary',
  size = 'md',
  label,
  title,
  className = '',
  id,
  iconSize,
  tCommon,
  children,
  ...restProps
}) => {
  const handlePrint = () => {
    trackPrintCV('trigger_print');
    if (onPrint) {
      onPrint();
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const displayLabel = label || children || tCommon?.exportPdf || 'Download CV';
  const displayTitle = title || tCommon?.exportPdf || 'Export PDF';

  const buttonElement =
    variant === 'floating' ? (
      <ButtonFloating
        id={id || 'floating-save-cv-btn'}
        floatingVariant="primary"
        onClick={handlePrint}
        title={displayTitle}
        aria-label={typeof displayLabel === 'string' ? displayLabel : displayTitle}
        icon={<DownloadIcon size={iconSize || 18} />}
        label={displayLabel}
        className={className}
        {...restProps}
      />
    ) : (
      <Button
        id={id}
        variant={buttonVariant}
        size={size}
        onClick={handlePrint}
        title={displayTitle}
        aria-label={typeof displayLabel === 'string' ? displayLabel : displayTitle}
        icon={<DownloadIcon size={iconSize || 16} />}
        className={className}
        {...restProps}
      >
        <span>{displayLabel}</span>
      </Button>
    );

  if (!data || !tPrintCv) {
    return buttonElement;
  }

  const { personalInfo, experiences, projects, skillCategories, educations, certifications } = data;

  return (
    <>
      {buttonElement}

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
              {tPrintCv.summaryHeading}
            </h2>
            <p className="print-summary-text">
              {personalInfo.bio} {data.printCv?.summaryExtension ? ` ${data.printCv.summaryExtension}` : ''}
            </p>
          </section>

          {/* Core Technical Competencies */}
          <section className="print-section">
            <h2 className="print-section-heading">
              {tPrintCv.skillsHeading}
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
              {tPrintCv.experienceHeading}
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
                    <strong>{tPrintCv.technologies}</strong> {exp.technologies.join(', ')}
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
              {tPrintCv.projectsHeading}
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
                    <strong>{tPrintCv.keyTechnologies}</strong> {proj.tags.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Certifications */}
          <section className="print-section">
            <h2 className="print-section-heading">
              {tPrintCv.educationHeading}
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
                    <strong>{tPrintCv.academicBackground}</strong> {edu.gpaOrHonors}
                  </div>
                )}

                {edu.details && (
                  <ul className="print-edu-bullets">
                    {edu.details.map((detail, idx) => {
                      const [detailTitle, ...rest] = detail.split(': ');
                      return (
                        <li key={idx}>
                          <strong>{detailTitle}:</strong> {rest.join(': ')}
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
                    <strong>{tPrintCv.certificationsAndBadges}</strong> {cert.status}
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
};

ButtonPrint.displayName = 'ButtonPrint';
