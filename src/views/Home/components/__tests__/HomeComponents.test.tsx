import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

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

  it('renders ProjectsSection correctly', () => {
    const { getByText, getAllByText } = render(
      <LanguageProvider>
        <ProjectsSection />
      </LanguageProvider>
    );
    expect(getByText('Featured Projects')).toBeDefined();
    expect(getAllByText('Enterprise Data Hub').length).toBeGreaterThan(0);
  });

  it('renders SkillsSection correctly', () => {
    const { getByText } = render(
      <LanguageProvider>
        <SkillsSection />
      </LanguageProvider>
    );
    expect(getByText('Tech Stack & Tools')).toBeDefined();
    expect(getByText('Lập trình & Cốt lõi')).toBeDefined();
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
