import React from 'react';
import { CVData } from '../types/index.ts';

interface PrintCVProps {
  data: CVData;
  lang: 'vi' | 'en';
}

export const PrintCV: React.FC<PrintCVProps> = ({ data, lang }) => {
  const { personalInfo, experiences, projects, skillCategories, educations, certifications } = data;
  const isVi = lang === 'vi';

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
          <h2 className="print-section-heading">
            {isVi ? 'TÓM TẮT NĂNG LỰC CHUYÊN MÔN' : 'PROFESSIONAL SUMMARY'}
          </h2>
          <p className="print-summary-text">
            {personalInfo.bio}{' '}
            {isVi
              ? 'Có bề dày kinh nghiệm thiết kế hệ thống microservices chịu tải cao, điều phối luồng xử lý CDC đảm bảo zero data loss và tối ưu hóa thời gian thực thi truy vấn phân tích dữ liệu hơn 70%. Đảm nhiệm vai trò Technical Lead dẫn dắt đội ngũ kỹ sư hiện thực hóa các yêu cầu kinh doanh phức tạp thành hệ thống phân tán hiệu năng cao, chuẩn mực chất lượng mã nguồn và tự động hóa quy trình CI/CD.'
              : 'Proven track record of architecting scalable microservices, orchestrating CDC pipelines with zero data loss, and reducing analytical query execution times by over 70%. Experienced Technical Team Lead capable of bridging business specifications into high-performance distributed systems with rigorous code quality and automated CI/CD deployment workflows.'}
          </p>
        </section>

        {/* Core Technical Competencies */}
        <section className="print-section">
          <h2 className="print-section-heading">
            {isVi ? 'KỸ NĂNG CHUYÊN MÔN CỐT LÕI' : 'CORE TECHNICAL SKILLS'}
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
            {isVi ? 'KINH NGHIỆM LÀM VIỆC' : 'PROFESSIONAL EXPERIENCE'}
          </h2>
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
                  <strong>{isVi ? 'Công nghệ:' : 'Technologies:'}</strong> {exp.technologies.join(', ')}
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
            {isVi
              ? 'DỰ ÁN KIẾN TRÚC DOANH NGHIỆP TIÊU BIỂU'
              : 'FEATURED ENGINEERING ARCHITECTURE CASE STUDIES'}
          </h2>
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
                  <strong>{isVi ? 'Công nghệ chính:' : 'Key Technologies:'}</strong> {proj.tags.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="print-section">
          <h2 className="print-section-heading">
            {isVi ? 'HỌC VẤN & CHỨNG CHỈ CHUYÊN MÔN' : 'EDUCATION & CERTIFICATIONS'}
          </h2>

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
                <strong>{isVi ? 'Nền tảng học vấn:' : 'Academic Background:'}</strong> {edu.gpaOrHonors}.{' '}
                {isVi
                  ? 'Hoàn thành chương trình nền tảng Khoa học máy tính toàn diện (Cấu trúc dữ liệu & Giải thuật, OOP, Cơ sở dữ liệu quan hệ, Mạng máy tính, Hệ điều hành, Công nghệ phần mềm). Tham gia phát triển phần mềm chuyên nghiệp từ sớm với hơn 5 năm kinh nghiệm thực chiến.'
                  : 'Completed comprehensive CS foundation curriculum (Data Structures & Algorithms, OOP, Relational Databases, Computer Networks, Operating Systems, Software Engineering). Early transition into professional software development with 5+ years of verified production engineering.'}
              </div>
            </div>
          ))}

          <div className="print-cert-row" style={{ marginTop: '6px' }}>
            <strong>
              {isVi
                ? 'Chứng chỉ chuyên môn & Huy hiệu:'
                : 'Professional Certifications & Badges:'}
            </strong>{' '}
            {certifications.map((c) => `${c.name} (${c.issuer} - ${c.issueDate})`).join(' • ')}
          </div>
        </section>
      </div>
    </div>
  );
};
