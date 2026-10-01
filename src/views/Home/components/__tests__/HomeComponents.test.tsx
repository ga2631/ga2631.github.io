import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

import { LanguageProvider } from '@/i18n/LanguageContext';
import { PersonalInfo } from '@/types';
import {
  HeroSection,
  PrinciplesSection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
  EducationSection,
  ContactSection,
  FloatDownloadButton,
} from '../index';

describe('CV Home Components', () => {
  const dummyPersonalInfo: PersonalInfo = {
    fullName: 'Huỳnh Nhật Tân',
    jobTitle: 'Software Engineer',
    tagline: 'Viết code không chỉ để máy tính thực thi',
    bio: 'Tôi chuyên thiết kế và xây dựng các hệ thống Backend',
    email: 'hello@example.com',
    phone: '0901234567',
    location: 'TP. Hồ Chí Minh, VN',
    availability: 'Đang mở đón cơ hội mới',
    githubUrl: 'https://github.com/ga2631',
    linkedinUrl: 'https://linkedin.com/in/huynhnhattan',
    stats: [
      { label: 'Kinh Nghiệm Thực Chiến', value: '5 Năm' },
      { label: 'Tỷ Lệ Khớp Nối Dữ Liệu', value: '96%' },
      { label: 'Tăng Hiệu Năng Truy Vấn', value: '70%+' },
      { label: 'Users Đồng Thời Xử Lý', value: '1,000+' },
    ],
  };

  it('renders HeroSection correctly', () => {
    const { getByText } = render(
      <LanguageProvider>
        <HeroSection personalInfo={dummyPersonalInfo} />
      </LanguageProvider>
    );
    expect(getByText('Huỳnh Nhật Tân')).toBeDefined();
    expect(getByText('Software Engineer')).toBeDefined();
    expect(getByText('5 Năm')).toBeDefined();
  });

  it('renders PrinciplesSection correctly', () => {
    const { getByText } = render(
      <LanguageProvider>
        <PrinciplesSection />
      </LanguageProvider>
    );
    expect(getByText('Engineering excellence')).toBeDefined();
    expect(getByText('Kiến trúc bền vững')).toBeDefined();
  });

  it('renders ExperienceSection correctly', () => {
    const { getByText } = render(
      <LanguageProvider>
        <ExperienceSection />
      </LanguageProvider>
    );
    expect(getByText('Professional Experience')).toBeDefined();
    expect(getByText('Senior Data Engineer & Backend')).toBeDefined();
  });

  it('renders ProjectsSection with Enterprise (modal) and Public (GitHub link) projects correctly', async () => {
    const { getByText, getAllByText, container } = render(
      <LanguageProvider>
        <ProjectsSection
          enterpriseProjects={[
            {
              id: 'custom-enterprise',
              title: 'Custom Enterprise System',
              company: 'Tech Corp',
              category: 'Enterprise',
              projectType: 'enterprise',
              isPrivate: true,
              description: 'Enterprise backend system description',
              highlights: ['High throughput Kafka pipeline', 'Zero downtime deployment'],
              tags: ['Go', 'Kafka', 'PostgreSQL'],
            },
          ]}
          publicProjects={[
            {
              id: 'custom-public',
              title: 'Custom Public Tool',
              category: 'Public',
              projectType: 'public',
              isPrivate: false,
              description: 'Public open source tool description',
              tags: ['TypeScript', 'React'],
              githubUrl: 'https://github.com/ga2631/custom-public',
            },
          ]}
        />
      </LanguageProvider>
    );

    expect(getByText('Featured Projects')).toBeDefined();

    // Check Enterprise badge & project
    expect(getByText('Enterprise')).toBeDefined();
    expect(getAllByText('Custom Enterprise System').length).toBeGreaterThan(0);
    expect(getByText('Tech Corp')).toBeDefined();
    expect(getByText('Xem chi tiết')).toBeDefined();

    // Check Public badge & project
    expect(getByText('Public')).toBeDefined();
    expect(getByText('Custom Public Tool')).toBeDefined();
    const viewSourceLink = getByText('View Source').closest('a');
    expect(viewSourceLink).toBeDefined();
    expect(viewSourceLink?.getAttribute('href')).toBe('https://github.com/ga2631/custom-public');
    expect(viewSourceLink?.getAttribute('target')).toBe('_blank');

    // Click 'Xem chi tiết' to open Enterprise Modal
    const detailsButton = getByText('Xem chi tiết');
    fireEvent.click(detailsButton);

    // Check Modal content
    expect(getByText('Chi tiết Dự án Công ty')).toBeDefined();
    expect(getByText('High throughput Kafka pipeline')).toBeDefined();
    expect(getByText('Zero downtime deployment')).toBeDefined();
    expect(
      getByText(/Mã nguồn không được công khai \(Closed Source\) do thỏa thuận bảo mật NDA/)
    ).toBeDefined();
  });

  it('renders projects passed from Supabase cv_documents as Enterprise with modal trigger', () => {
    const supabaseMockProjects = [
      {
        id: 'proj-1',
        title: 'Hạ tầng Dữ liệu ERP & Medallion Data Warehouse',
        company: 'Viet Nam Gate Advertising JSC',
        category: 'Data / AI',
        description: 'Hạ tầng xử lý dữ liệu quy mô lớn.',
        highlights: ['Tăng tốc truy vấn 70%', 'Đồng bộ dữ liệu đa kênh'],
        tags: ['Python', 'DuckDB', 'PostgreSQL'],
        githubUrl: 'https://github.com/ga2631',
      },
    ];

    const { getByText, getAllByText } = render(
      <LanguageProvider>
        <ProjectsSection projects={supabaseMockProjects} />
      </LanguageProvider>
    );

    // Verify Enterprise pill
    expect(getByText('Enterprise')).toBeDefined();
    expect(getAllByText('Hạ tầng Dữ liệu ERP & Medallion Data Warehouse').length).toBeGreaterThan(0);
    expect(getByText('Viet Nam Gate Advertising JSC')).toBeDefined();
    
    // Verify Xem chi tiết button exists
    const detailBtn = getByText('Xem chi tiết');
    expect(detailBtn).toBeDefined();

    // Trigger modal
    fireEvent.click(detailBtn);
    expect(getByText('Chi tiết Dự án Công ty')).toBeDefined();
    expect(getByText('Tăng tốc truy vấn 70%')).toBeDefined();
  });

  it('renders SkillsSection correctly and maps levels 1-5 to respective color styles', () => {
    const mockCategories = [
      {
        title: 'Lập trình',
        description: 'Backend & Frontend',
        skills: [
          { name: 'HTML/CSS', level: 1 },
          { name: 'Rust', level: 2 },
          { name: 'Go', level: 3 },
          { name: 'Python', level: 4 },
          { name: 'TypeScript', level: 5 },
        ],
      },
    ];

    const { getByText } = render(
      <LanguageProvider>
        <SkillsSection skillCategories={mockCategories} />
      </LanguageProvider>
    );

    expect(getByText('Tech Stack & Tools')).toBeDefined();
    expect(getByText('Lập trình')).toBeDefined();

    // Level 1 => Basic => blue (bg-basic)
    const skill1 = getByText('HTML/CSS');
    expect(skill1.className).toContain('bg-basic');

    // Level 2 => Familiar => emerald (bg-familiar)
    const skill2 = getByText('Rust');
    expect(skill2.className).toContain('bg-familiar');

    // Level 3 => Proficient => amber (bg-proficient)
    const skill3 = getByText('Go');
    expect(skill3.className).toContain('bg-proficient');

    // Level 4 => Advanced => orange (bg-advanced)
    const skill4 = getByText('Python');
    expect(skill4.className).toContain('bg-advanced');

    // Level 5 => Expert => red (bg-expert)
    const skill5 = getByText('TypeScript');
    expect(skill5.className).toContain('bg-expert');
  });

  it('renders EducationSection correctly', () => {
    const { getByText } = render(
      <LanguageProvider>
        <EducationSection />
      </LanguageProvider>
    );
    expect(getByText('Education & Certifications')).toBeDefined();
    expect(getByText('Trường Đại học Sư phạm TP. HCM')).toBeDefined();
  });

  it('renders ContactSection correctly', () => {
    const { getByText } = render(
      <LanguageProvider>
        <ContactSection personalInfo={dummyPersonalInfo} />
      </LanguageProvider>
    );
    expect(getByText("Let's Connect")).toBeDefined();
    expect(getByText('hello@example.com')).toBeDefined();
  });

  it('renders FloatDownloadButton correctly', () => {
    const { container } = render(
      <LanguageProvider>
        <FloatDownloadButton />
      </LanguageProvider>
    );
    const link = container.querySelector('a');
    expect(link).toBeDefined();
  });
});
