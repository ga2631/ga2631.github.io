import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CmsCvEditor } from '../components/CmsCvEditor';
import { CVData } from '@/types';
import * as cvService from '@/services/cvService';

vi.mock('@/services/cvService', () => ({
  getCvData: vi.fn().mockImplementation((lang) =>
    Promise.resolve({
      personalInfo: {
        fullName: lang === 'en' ? 'John Doe' : 'Nguyễn Văn A',
        jobTitle: lang === 'en' ? 'Software Architect' : 'Kiến Trúc Sư Phần Mềm',
        tagline: 'High performance systems',
        bio: 'Bio text content',
        email: 'test@example.com',
        phone: '+8499999999',
        location: 'Hà Nội',
        availability: 'Available',
        stats: [{ label: 'Năm kinh nghiệm', value: '5+', subtext: 'Distributed' }],
      },
      principles: [{ title: 'Simplicity', description: 'Keep it simple and robust' }],
      experiences: [
        {
          id: 'exp-1',
          role: 'Principal Engineer',
          company: 'Tech Corp',
          companySubtitle: 'Fintech Enterprise',
          location: 'Hà Nội',
          period: '2022 - Hiện tại',
          current: true,
          summary: 'Tech Lead for core systems',
          achievements: ['Optimized throughput by 300%'],
          technologies: ['Go', 'Kubernetes'],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Core Banking Gateway',
          role: 'Lead Architect',
          company: 'Bank A',
          teamSize: '10',
          period: '2023',
          category: 'Enterprise',
          projectType: 'enterprise',
          featured: true,
          isPrivate: true,
          shortDescription: 'High-throughput payment gateway',
          description: 'Designed event-driven architecture',
          highlights: ['100k TPS'],
          tags: ['Go', 'Kafka'],
        },
      ],
      skillCategories: [
        {
          title: 'Backend & Cloud',
          description: 'Distributed systems',
          skills: [{ name: 'Go', level: 'Senior', iconName: 'fa-brands fa-golang' }],
        },
      ],
      educations: [
        {
          id: 'edu-1',
          degree: 'Kỹ Sư CNTT',
          institution: 'Đại Học Bách Khoa',
          location: 'Hà Nội',
          period: '2015 - 2020',
          gpaOrHonors: 'Giỏi',
          details: ['Khoa học máy tính'],
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'GCP Professional Cloud Architect',
          issuer: 'Google Cloud',
          issueDate: '2024',
          credentialUrl: 'https://credly.com/...',
          status: 'Active',
          isCompleted: true,
        },
      ],
    })
  ),
  saveCvData: vi.fn().mockResolvedValue({ success: true }),
}));

describe('CmsCvEditor Component', () => {
  const mockInitialCv: CVData = {
    personalInfo: {
      fullName: 'Nguyễn Văn A',
      jobTitle: 'Kiến Trúc Sư Phần Mềm',
      tagline: 'High performance systems',
      bio: 'Bio text content',
      email: 'test@example.com',
      phone: '+8499999999',
      location: 'Hà Nội',
      availability: 'Available',
      githubUrl: 'https://github.com/ga2631',
      stats: [{ label: 'Năm kinh nghiệm', value: '5+', subtext: 'Distributed' }],
    },
    principles: [{ title: 'Simplicity', description: 'Keep it simple and robust' }],
    experiences: [
      {
        id: 'exp-1',
        role: 'Principal Engineer',
        company: 'Tech Corp',
        companySubtitle: 'Fintech Enterprise',
        location: 'Hà Nội',
        period: '2022 - Hiện tại',
        current: true,
        summary: 'Tech Lead for core systems',
        achievements: ['Optimized throughput by 300%'],
        technologies: ['Go', 'Kubernetes'],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Core Banking Gateway',
        role: 'Lead Architect',
        company: 'Bank A',
        teamSize: '10',
        period: '2023',
        category: 'Enterprise',
        projectType: 'enterprise',
        featured: true,
        isPrivate: true,
        shortDescription: 'High-throughput payment gateway',
        description: 'Designed event-driven architecture',
        highlights: ['100k TPS'],
        tags: ['Go', 'Kafka'],
      },
    ],
    skillCategories: [
      {
        title: 'Backend & Cloud',
        description: 'Distributed systems',
        skills: [{ name: 'Go', level: 'Senior', iconName: 'fa-brands fa-golang' }],
      },
    ],
    educations: [
      {
        id: 'edu-1',
        degree: 'Kỹ Sư CNTT',
        institution: 'Đại Học Bách Khoa',
        location: 'Hà Nội',
        period: '2015 - 2020',
        gpaOrHonors: 'Giỏi',
        details: ['Khoa học máy tính'],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'GCP Professional Cloud Architect',
        issuer: 'Google Cloud',
        issueDate: '2024',
        credentialUrl: 'https://credly.com/...',
        status: 'Active',
        isCompleted: true,
      },
    ],
  };

  it('renders header, language tabs, sub-tabs and personal info fields', () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    // Verify Header
    expect(screen.getByText('Hồ Sơ Năng Lực & CV')).toBeDefined();
    expect(screen.getByRole('button', { name: /Lưu Hồ Sơ/i })).toBeDefined();

    // Verify Sub Tabs
    expect(screen.getByRole('button', { name: /Thông Tin Cá Nhân/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Kinh Nghiệm/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Dự Án Thực Chiến/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Kỹ Năng/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Học Vấn & Chứng Chỉ/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Triết Lý Nghề Nghiệp/i })).toBeDefined();

    // Verify Personal Info values
    expect(screen.getByDisplayValue('Nguyễn Văn A')).toBeDefined();
    expect(screen.getByDisplayValue('Kiến Trúc Sư Phần Mềm')).toBeDefined();
  });

  it('navigates to Experiences tab and displays existing experience items', () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    const expTab = screen.getByRole('button', { name: /Kinh Nghiệm/i });
    fireEvent.click(expTab);

    expect(screen.getByDisplayValue('Principal Engineer')).toBeDefined();
    expect(screen.getByDisplayValue('Tech Corp')).toBeDefined();
    expect(screen.getByDisplayValue('2022 - Hiện tại')).toBeDefined();
    expect(screen.getByText('Thêm Kinh Nghiệm Mới')).toBeDefined();
  });

  it('navigates to Projects tab and displays existing projects', () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    const projTab = screen.getByRole('button', { name: /Dự Án Thực Chiến/i });
    fireEvent.click(projTab);

    expect(screen.getByDisplayValue('Core Banking Gateway')).toBeDefined();
    expect(screen.getByDisplayValue('Bank A')).toBeDefined();
    expect(screen.getByText('Thêm Dự Án Mới')).toBeDefined();
  });

  it('navigates to Skills tab and displays skill categories', () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    const skillTab = screen.getByRole('button', { name: /Kỹ Năng/i });
    fireEvent.click(skillTab);

    expect(screen.getByDisplayValue('Backend & Cloud')).toBeDefined();
    expect(screen.getByDisplayValue('Go')).toBeDefined();
    expect(screen.getByText('Thêm Nhóm Kỹ Năng')).toBeDefined();
  });

  it('navigates to Education & Certifications tab', () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    const eduTab = screen.getByRole('button', { name: /Học Vấn & Chứng Chỉ/i });
    fireEvent.click(eduTab);

    expect(screen.getByDisplayValue('Kỹ Sư CNTT')).toBeDefined();
    expect(screen.getByDisplayValue('Đại Học Bách Khoa')).toBeDefined();
    expect(screen.getByDisplayValue('GCP Professional Cloud Architect')).toBeDefined();
  });

  it('navigates to Principles tab', () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    const prTab = screen.getByRole('button', { name: /Triết Lý Nghề Nghiệp/i });
    fireEvent.click(prTab);

    expect(screen.getByDisplayValue('Simplicity')).toBeDefined();
    expect(screen.getByDisplayValue('Keep it simple and robust')).toBeDefined();
  });

  it('allows switching editing language to English and fetches English CV data', async () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    const enTab = screen.getByRole('button', { name: /English/i });
    fireEvent.click(enTab);

    await waitFor(() => {
      expect(cvService.getCvData).toHaveBeenCalledWith('en');
      expect(screen.getByDisplayValue('John Doe')).toBeDefined();
    });
  });

  it('opens and closes JSON modal for advanced users', () => {
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={vi.fn()}
      />
    );

    const jsonBtn = screen.getByRole('button', { name: /Mã JSON/i });
    fireEvent.click(jsonBtn);

    expect(screen.getByText('Mã Nguồn JSON Hồ Sơ CV')).toBeDefined();
    expect(screen.getByRole('button', { name: /Sao chép JSON/i })).toBeDefined();

    const closeBtn = screen.getByRole('button', { name: 'Đóng' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Mã Nguồn JSON Hồ Sơ CV')).toBeNull();
  });

  it('triggers onSave callback when clicking save button', async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(
      <CmsCvEditor
        cvData={mockInitialCv}
        isLoading={false}
        currentLang="vi"
        onSave={handleSave}
      />
    );

    const saveBtn = screen.getByRole('button', { name: /Lưu Hồ Sơ/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith('vi', expect.objectContaining({
        personalInfo: expect.objectContaining({
          fullName: 'Nguyễn Văn A',
        }),
      }));
    });
  });
});
