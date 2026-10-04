'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CVData,
  PersonalInfo,
  ExperienceItem,
  ProjectItem,
  SkillCategory,
  SkillItem,
  EducationItem,
  CertificationItem,
  PrincipleItem,
} from '@/types';
import { getCvData } from '@/services/cvService';

interface CmsCvEditorProps {
  cvData: CVData | null;
  isLoading: boolean;
  currentLang: string;
  onSave: (targetLang: string, updatedData: CVData) => Promise<void>;
  onReload?: () => Promise<void>;
}

type CvSubTab = 'personal' | 'experiences' | 'projects' | 'skills' | 'education' | 'principles';

const createEmptyCvData = (): CVData => ({
  personalInfo: {
    fullName: '',
    jobTitle: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    availability: 'Sẵn sàng nhận dự án',
    birthday: '',
    avatarUrl: '',
    githubUrl: 'https://github.com/ga2631',
    linkedinUrl: '',
    zaloUrl: '',
    resumePdfUrl: '',
    stats: [
      { label: 'Năm kinh nghiệm', value: '5+', subtext: 'Kiến trúc & Hệ thống' },
      { label: 'Dự án hoàn thành', value: '20+', subtext: 'Doanh nghiệp & Đám mây' },
      { label: 'Tỉ lệ hài lòng', value: '99%', subtext: 'Cam kết chất lượng' },
    ],
  },
  principles: [],
  experiences: [],
  projects: [],
  skillCategories: [],
  educations: [],
  certifications: [],
});

export function CmsCvEditor({
  cvData,
  isLoading,
  currentLang,
  onSave,
  onReload,
}: CmsCvEditorProps) {
  const [activeTab, setActiveTab] = useState<CvSubTab>('personal');
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>(
    (currentLang === 'en' ? 'en' : 'vi') as 'vi' | 'en'
  );
  const [isFetchingLang, setIsFetchingLang] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CVData>(() => cvData || createEmptyCvData());
  const [initialData, setInitialData] = useState<CVData>(() => cvData || createEmptyCvData());

  // Search & Filter within tabs
  const [projectSearch, setProjectSearch] = useState('');
  const [experienceSearch, setExperienceSearch] = useState('');

  // JSON Advanced Modal
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Sync when prop cvData changes (if matching current activeLang)
  useEffect(() => {
    if (cvData && activeLang === currentLang) {
      setFormData(cvData);
      setInitialData(cvData);
    }
  }, [cvData, currentLang]);

  // Load target language data when user switches language tab inside CV editor
  const handleSwitchLanguage = async (targetLang: 'vi' | 'en') => {
    if (targetLang === activeLang) return;
    setActiveLang(targetLang);
    setSaveSuccessMsg(null);

    setIsFetchingLang(true);
    try {
      const data = await getCvData(targetLang);
      setFormData(data);
      setInitialData(data);
    } catch {
      // If document doesn't exist yet for this language, initialize empty
      const empty = createEmptyCvData();
      setFormData(empty);
      setInitialData(empty);
    } finally {
      setIsFetchingLang(false);
    }
  };

  // Check if form has unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMsg(null);
    try {
      await onSave(activeLang, formData);
      setInitialData(formData);
      setSaveSuccessMsg(`Đã lưu thành công hồ sơ CV (${activeLang.toUpperCase()})!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err: any) {
      alert(`Lỗi khi lưu: ${err.message || 'Không thể lưu hồ sơ'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Revert changes
  const handleRevert = () => {
    if (confirm('Bạn có chắc muốn hủy bỏ các thay đổi chưa lưu và khôi phục dữ liệu ban đầu?')) {
      setFormData(initialData);
    }
  };

  // -------------------------------------------------------------
  // PERSONAL INFO HANDLERS
  // -------------------------------------------------------------
  const updatePersonalInfo = (field: keyof PersonalInfo, value: any) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleAddStat = () => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        stats: [...(prev.personalInfo.stats || []), { label: '', value: '', subtext: '' }],
      },
    }));
  };

  const handleUpdateStat = (index: number, field: 'label' | 'value' | 'subtext', value: string) => {
    setFormData((prev) => {
      const stats = [...(prev.personalInfo.stats || [])];
      stats[index] = { ...stats[index], [field]: value };
      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          stats,
        },
      };
    });
  };

  const handleRemoveStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        stats: (prev.personalInfo.stats || []).filter((_, i) => i !== index),
      },
    }));
  };

  // -------------------------------------------------------------
  // EXPERIENCES HANDLERS
  // -------------------------------------------------------------
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Kỹ Sư Phần Mềm',
      company: 'Tên Công Ty',
      companySubtitle: 'Lĩnh vực công nghệ',
      location: 'Hà Nội, Việt Nam',
      period: `${new Date().getFullYear()} - Hiện tại`,
      current: true,
      summary: 'Mô tả tóm tắt về trọng trách và đóng góp chính.',
      achievements: ['Tối ưu hóa hiệu năng hệ thống', 'Dẫn dắt đội ngũ kỹ thuật'],
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
    };
    setFormData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  };

  const handleUpdateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    }));
  };

  const handleDeleteExperience = (id: string, company: string) => {
    if (confirm(`Bạn có chắc muốn xóa kinh nghiệm tại "${company}"?`)) {
      setFormData((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((exp) => exp.id !== id),
      }));
    }
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const list = [...prev.experiences];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, experiences: list };
    });
  };

  const handleAddExpAchievement = (expId: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === expId ? { ...exp, achievements: [...exp.achievements, 'Thành tựu hoặc trách nhiệm mới'] } : exp
      ),
    }));
  };

  const handleUpdateExpAchievement = (expId: string, achIndex: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const achievements = [...exp.achievements];
        achievements[achIndex] = text;
        return { ...exp, achievements };
      }),
    }));
  };

  const handleRemoveExpAchievement = (expId: string, achIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          achievements: exp.achievements.filter((_, i) => i !== achIndex),
        };
      }),
    }));
  };

  const handleAddExpTech = (expId: string, tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        if (exp.technologies.includes(trimmed)) return exp;
        return { ...exp, technologies: [...exp.technologies, trimmed] };
      }),
    }));
  };

  const handleRemoveExpTech = (expId: string, tech: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        return { ...exp, technologies: exp.technologies.filter((t) => t !== tech) };
      }),
    }));
  };

  // -------------------------------------------------------------
  // PROJECTS HANDLERS
  // -------------------------------------------------------------
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Tên Dự Án Mới',
      role: 'Lead Architect / Fullstack',
      company: 'Tên Khách Hàng / Đối Tác',
      teamSize: '5 thành viên',
      period: `${new Date().getFullYear()}`,
      category: 'Enterprise',
      projectType: 'enterprise',
      featured: true,
      isPrivate: false,
      shortDescription: 'Mô tả ngắn gọn về bài toán và giải pháp của dự án.',
      description: 'Mô tả chuyên sâu về kiến trúc, luồng xử lý và kết quả kinh doanh.',
      highlights: ['Xử lý 10,000+ yêu cầu mỗi giây với độ trễ thấp'],
      tags: ['React', 'Next.js', 'Go', 'Kubernetes'],
      githubUrl: '',
      demoUrl: '',
    };
    setFormData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const handleUpdateProject = (id: string, updates: Partial<ProjectItem>) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa dự án "${title}"?`)) {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }));
    }
  };

  const handleAddProjHighlight = (projId: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projId ? { ...p, highlights: [...(p.highlights || []), 'Điểm nhấn kỹ thuật / Thành tựu mới'] } : p
      ),
    }));
  };

  const handleUpdateProjHighlight = (projId: string, index: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projId) return p;
        const highlights = [...(p.highlights || [])];
        highlights[index] = text;
        return { ...p, highlights };
      }),
    }));
  };

  const handleRemoveProjHighlight = (projId: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projId) return p;
        return { ...p, highlights: (p.highlights || []).filter((_, i) => i !== index) };
      }),
    }));
  };

  const handleAddProjTag = (projId: string, tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projId) return p;
        if (p.tags.includes(trimmed)) return p;
        return { ...p, tags: [...p.tags, trimmed] };
      }),
    }));
  };

  const handleRemoveProjTag = (projId: string, tag: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projId) return p;
        return { ...p, tags: p.tags.filter((t) => t !== tag) };
      }),
    }));
  };

  // -------------------------------------------------------------
  // SKILLS HANDLERS
  // -------------------------------------------------------------
  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      title: 'Nhóm Kỹ Năng Mới',
      description: 'Mô tả phạm vi chuyên môn của nhóm kỹ năng này.',
      skills: [
        { name: 'Kỹ Năng 1', level: 'Chuyên sâu', iconName: 'fa-solid fa-code' },
        { name: 'Kỹ Năng 2', level: 'Thành thạo', iconName: 'fa-solid fa-server' },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCat],
    }));
  };

  const handleUpdateSkillCategory = (catIndex: number, updates: Partial<SkillCategory>) => {
    setFormData((prev) => {
      const cats = [...prev.skillCategories];
      cats[catIndex] = { ...cats[catIndex], ...updates };
      return { ...prev, skillCategories: cats };
    });
  };

  const handleDeleteSkillCategory = (catIndex: number, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa nhóm kỹ năng "${title}"?`)) {
      setFormData((prev) => ({
        ...prev,
        skillCategories: prev.skillCategories.filter((_, i) => i !== catIndex),
      }));
    }
  };

  const handleAddSkillItem = (catIndex: number) => {
    setFormData((prev) => {
      const cats = [...prev.skillCategories];
      const category = cats[catIndex];
      const newSkill: SkillItem = {
        name: 'Công Nghệ Mới',
        level: 'Thành thạo',
        iconName: 'fa-solid fa-layer-group',
      };
      cats[catIndex] = { ...category, skills: [...category.skills, newSkill] };
      return { ...prev, skillCategories: cats };
    });
  };

  const handleUpdateSkillItem = (
    catIndex: number,
    skillIndex: number,
    field: keyof SkillItem,
    value: string
  ) => {
    setFormData((prev) => {
      const cats = [...prev.skillCategories];
      const category = cats[catIndex];
      const skills = [...category.skills];
      skills[skillIndex] = { ...skills[skillIndex], [field]: value };
      cats[catIndex] = { ...category, skills };
      return { ...prev, skillCategories: cats };
    });
  };

  const handleRemoveSkillItem = (catIndex: number, skillIndex: number) => {
    setFormData((prev) => {
      const cats = [...prev.skillCategories];
      const category = cats[catIndex];
      cats[catIndex] = {
        ...category,
        skills: category.skills.filter((_, i) => i !== skillIndex),
      };
      return { ...prev, skillCategories: cats };
    });
  };

  // -------------------------------------------------------------
  // EDUCATION & CERTIFICATIONS HANDLERS
  // -------------------------------------------------------------
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: 'Cử Nhân / Kỹ Sư Công Nghệ Thông Tin',
      institution: 'Đại Học Quốc Gia',
      location: 'Hà Nội, Việt Nam',
      period: '2016 - 2020',
      gpaOrHonors: 'Loại Giỏi (GPA 3.6/4.0)',
      details: ['Chuyên ngành Kỹ thuật Phần mềm & Mạng máy tính'],
    };
    setFormData((prev) => ({
      ...prev,
      educations: [...prev.educations, newEdu],
    }));
  };

  const handleUpdateEducation = (id: string, updates: Partial<EducationItem>) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    }));
  };

  const handleDeleteEducation = (id: string, institution: string) => {
    if (confirm(`Bạn có chắc muốn xóa học vấn tại "${institution}"?`)) {
      setFormData((prev) => ({
        ...prev,
        educations: prev.educations.filter((edu) => edu.id !== id),
      }));
    }
  };

  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Chứng Chỉ Chuyên Nghiệp',
      issuer: 'Tổ Chức / Nhà Cung Cấp',
      issueDate: '2024',
      credentialUrl: '',
      badgeCode: '',
      status: 'Đã hoàn thành',
      isCompleted: true,
    };
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  };

  const handleUpdateCertification = (id: string, updates: Partial<CertificationItem>) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const handleDeleteCertification = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa chứng chỉ "${name}"?`)) {
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c.id !== id),
      }));
    }
  };

  // -------------------------------------------------------------
  // PRINCIPLES HANDLERS
  // -------------------------------------------------------------
  const handleAddPrinciple = () => {
    const newP: PrincipleItem = {
      title: 'Nguyên Tắc / Triết Lý Mới',
      description: 'Mô tả chi tiết cách tiếp cận giải quyết bài toán và kỷ luật chuyên môn.',
    };
    setFormData((prev) => ({
      ...prev,
      principles: [...prev.principles, newP],
    }));
  };

  const handleUpdatePrinciple = (index: number, field: 'title' | 'description', value: string) => {
    setFormData((prev) => {
      const list = [...prev.principles];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, principles: list };
    });
  };

  const handleDeletePrinciple = (index: number, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa triết lý "${title}"?`)) {
      setFormData((prev) => ({
        ...prev,
        principles: prev.principles.filter((_, i) => i !== index),
      }));
    }
  };

  // -------------------------------------------------------------
  // JSON MODAL ACTIONS
  // -------------------------------------------------------------
  const handleOpenJsonModal = () => {
    setJsonText(JSON.stringify(formData, null, 2));
    setJsonError(null);
    setShowJsonModal(true);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setFormData(parsed);
      setShowJsonModal(false);
      alert('Đã nạp dữ liệu từ JSON thành công vào giao diện!');
    } catch (err: any) {
      setJsonError(`Cú pháp JSON không hợp lệ: ${err.message}`);
    }
  };

  // Filtered lists
  const filteredExperiences = useMemo(() => {
    if (!experienceSearch.trim()) return formData.experiences;
    const q = experienceSearch.toLowerCase();
    return formData.experiences.filter(
      (e) =>
        e.role.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.technologies.some((t) => t.toLowerCase().includes(q))
    );
  }, [formData.experiences, experienceSearch]);

  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return formData.projects;
    const q = projectSearch.toLowerCase();
    return formData.projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.company && p.company.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [formData.projects, projectSearch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Header Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <i className="fa-solid fa-id-card text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 tracking-tight">Hồ Sơ Năng Lực & CV</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                  {activeLang}
                </span>
                {isDirty && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    Chưa lưu
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Chỉnh sửa thông tin chuyên gia, lịch sử kinh nghiệm, dự án thực tế và kỹ năng trực tiếp lên cơ sở dữ liệu.
              </p>
            </div>
          </div>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Language Switcher Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => handleSwitchLanguage('vi')}
              disabled={isFetchingLang}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLang === 'vi'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Tiếng Việt</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-red-100 text-red-700 font-mono">VI</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLanguage('en')}
              disabled={isFetchingLang}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLang === 'en'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>English</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">EN</span>
            </button>
          </div>

          {/* JSON Modal Button */}
          <button
            type="button"
            onClick={handleOpenJsonModal}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Xem và chỉnh sửa trực tiếp mã JSON"
          >
            <i className="fa-solid fa-code text-xs text-gray-500"></i>
            <span className="hidden sm:inline">Mã JSON</span>
          </button>

          {/* Revert Button */}
          {isDirty && (
            <button
              type="button"
              onClick={handleRevert}
              disabled={isSaving}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Khôi phục trạng thái ban đầu"
            >
              <i className="fa-solid fa-rotate-left text-xs"></i>
              <span className="hidden sm:inline">Hoàn tác</span>
            </button>
          )}

          {/* Primary Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isFetchingLang}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
              isDirty
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/25 ring-2 ring-red-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk text-xs"></i>
                <span>Lưu Hồ Sơ ({activeLang.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <i className="fa-solid fa-user text-xs"></i>
          <span>Thông Tin Cá Nhân</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('experiences')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'experiences'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <i className="fa-solid fa-briefcase text-xs"></i>
          <span>Kinh Nghiệm</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'experiences' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {formData.experiences.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <i className="fa-solid fa-rocket text-xs"></i>
          <span>Dự Án Thực Chiến</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {formData.projects.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <i className="fa-solid fa-code text-xs"></i>
          <span>Kỹ Năng</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'skills' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {formData.skillCategories.length} nhóm
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'education'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <i className="fa-solid fa-graduation-cap text-xs"></i>
          <span>Học Vấn & Chứng Chỉ</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'education' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {formData.educations.length + formData.certifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('principles')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'principles'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <i className="fa-solid fa-compass text-xs"></i>
          <span>Triết Lý Nghề Nghiệp</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'principles' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {formData.principles.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. PERSONAL INFO TAB */}
      {/* ========================================================= */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <i className="fa-solid fa-user-tie text-red-600"></i>
                <span>Thông Tin Cơ Bản</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.fullName || ''}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Chức danh chuyên môn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.jobTitle || ''}
                    onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                    placeholder="Senior Software Architect / Tech Lead"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Khẩu hiệu nghề nghiệp (Tagline)
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.tagline || ''}
                    onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                    placeholder="Chuyên gia xây dựng hệ thống phân tán chịu tải cao và kiến trúc đám mây"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Giới thiệu bản thân (Bio)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.personalInfo.bio || ''}
                    onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                    placeholder="Tóm tắt quá trình làm việc, định hướng công nghệ và thế mạnh cốt lõi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <i className="fa-solid fa-address-book text-red-600"></i>
                <span>Liên Hệ & Địa Điểm</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+84 987 654 321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Địa điểm sinh sống & làm việc
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="Hà Nội / TP. Hồ Chí Minh, Việt Nam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Trạng thái công việc (Availability)
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.availability || ''}
                    onChange={(e) => updatePersonalInfo('availability', e.target.value)}
                    placeholder="Sẵn sàng nhận dự án tư vấn / Fulltime"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ngày sinh (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.birthday || ''}
                    onChange={(e) => updatePersonalInfo('birthday', e.target.value)}
                    placeholder="1995"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Link tải file PDF CV
                  </label>
                  <input
                    type="url"
                    value={formData.personalInfo.resumePdfUrl || ''}
                    onChange={(e) => updatePersonalInfo('resumePdfUrl', e.target.value)}
                    placeholder="https://.../cv.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <i className="fa-solid fa-share-nodes text-red-600"></i>
                <span>Mạng Xã Hội & Kênh Liên Kết</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-github text-gray-900"></i>
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.personalInfo.githubUrl || ''}
                    onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <i className="fa-brands fa-linkedin text-blue-600"></i>
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.personalInfo.linkedinUrl || ''}
                    onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <i className="fa-solid fa-comment-dots text-blue-500"></i>
                    <span>Zalo URL / Số Zalo</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.zaloUrl || ''}
                    onChange={(e) => updatePersonalInfo('zaloUrl', e.target.value)}
                    placeholder="https://zalo.me/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Avatar Preview & Highlight Stats */}
          <div className="space-y-6">
            {/* Avatar Preview Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 text-left">
                Ảnh Đại Diện
              </h2>

              <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden border-4 border-gray-100 shadow-md relative group bg-gray-50 flex items-center justify-center">
                {formData.personalInfo.avatarUrl ? (
                  <img
                    src={formData.personalInfo.avatarUrl}
                    alt={formData.personalInfo.fullName || 'Avatar'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                ) : (
                  <i className="fa-solid fa-user text-4xl text-gray-300"></i>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 text-left">
                  Đường dẫn ảnh đại diện (URL)
                </label>
                <input
                  type="url"
                  value={formData.personalInfo.avatarUrl || ''}
                  onChange={(e) => updatePersonalInfo('avatarUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-left font-mono"
                />
              </div>
            </div>

            {/* Highlight Stats Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <i className="fa-solid fa-chart-simple text-red-600"></i>
                  <span>Chỉ Số Nổi Bật</span>
                </h2>
                <button
                  type="button"
                  onClick={handleAddStat}
                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  + Thêm
                </button>
              </div>

              <div className="space-y-3">
                {(formData.personalInfo.stats || []).map((st, idx) => (
                  <div
                    key={`stat-${idx}`}
                    className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xs cursor-pointer"
                      title="Xóa chỉ số"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold">Giá trị</span>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                          placeholder="5+"
                          className="w-full px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold">Tiêu đề</span>
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                          placeholder="Năm kinh nghiệm"
                          className="w-full px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-xs text-gray-800"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Chú thích phụ</span>
                      <input
                        type="text"
                        value={st.subtext || ''}
                        onChange={(e) => handleUpdateStat(idx, 'subtext', e.target.value)}
                        placeholder="Hệ thống phân tán & Cloud"
                        className="w-full px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-xs text-gray-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EXPERIENCES TAB */}
      {/* ========================================================= */}
      {activeTab === 'experiences' && (
        <div className="space-y-5">
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div className="relative w-full sm:w-80">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-gray-400 text-xs"></i>
              <input
                type="text"
                value={experienceSearch}
                onChange={(e) => setExperienceSearch(e.target.value)}
                placeholder="Tìm kiếm công ty, vị trí, công nghệ..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddExperience}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Thêm Kinh Nghiệm Mới</span>
            </button>
          </div>

          {/* Experience Cards */}
          <div className="space-y-4">
            {filteredExperiences.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
                <i className="fa-solid fa-briefcase text-4xl text-gray-300 mb-3"></i>
                <p className="text-sm font-semibold text-gray-600">Chưa có kinh nghiệm làm việc nào.</p>
                <p className="text-xs text-gray-400 mt-1">Nhấn nút bên trên để thêm quá trình làm việc mới.</p>
              </div>
            ) : (
              filteredExperiences.map((exp, idx) => (
                <div
                  key={exp.id || `exp-${idx}`}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-red-600 space-y-4 transition-all hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                            placeholder="Chức danh"
                            className="text-base font-black text-gray-900 border-b border-dashed border-gray-300 focus:border-red-600 focus:outline-none"
                          />
                          <span className="text-gray-400 font-bold">@</span>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                            placeholder="Tên công ty"
                            className="text-base font-bold text-red-600 border-b border-dashed border-gray-300 focus:border-red-600 focus:outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          value={exp.companySubtitle || ''}
                          onChange={(e) => handleUpdateExperience(exp.id, { companySubtitle: e.target.value })}
                          placeholder="Mô tả công ty (vd: Tập đoàn Tài chính & Ngân hàng)"
                          className="text-xs text-gray-500 border-b border-dashed border-gray-200 focus:border-red-600 focus:outline-none mt-1 w-full max-w-md"
                        />
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <i className="fa-solid fa-arrow-up text-xs"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(idx, 'down')}
                        disabled={idx === formData.experiences.length - 1}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <i className="fa-solid fa-arrow-down text-xs"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id, exp.company)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Xóa kinh nghiệm này"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>

                  {/* Period, Location, and Current Checkbox */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">Thời gian làm việc</span>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleUpdateExperience(exp.id, { period: e.target.value })}
                        placeholder="2022 - Hiện tại"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">Địa điểm</span>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleUpdateExperience(exp.id, { location: e.target.value })}
                        placeholder="Hà Nội, Việt Nam"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exp.current || false}
                          onChange={(e) => handleUpdateExperience(exp.id, { current: e.target.checked })}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span>Hiện tại đang làm việc tại đây</span>
                      </label>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <span className="block text-[11px] font-semibold text-gray-600 mb-1">Tóm tắt vai trò</span>
                    <textarea
                      rows={2}
                      value={exp.summary || ''}
                      onChange={(e) => handleUpdateExperience(exp.id, { summary: e.target.value })}
                      placeholder="Mô tả khái quát về nhiệm vụ chính, phạm vi ảnh hưởng và quy mô hệ thống..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>

                  {/* Achievements List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Thành Tích & Trách Nhiệm Chính
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddExpAchievement(exp.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i>
                        <span>Thêm gạch đầu dòng</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.achievements.map((ach, achIdx) => (
                        <div key={`ach-${achIdx}`} className="flex items-center gap-2">
                          <i className="fa-solid fa-circle-check text-emerald-500 text-xs shrink-0"></i>
                          <input
                            type="text"
                            value={ach}
                            onChange={(e) => handleUpdateExpAchievement(exp.id, achIdx, e.target.value)}
                            placeholder="Nhập thành tích hoặc kết quả cụ thể..."
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExpAchievement(exp.id, achIdx)}
                            className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                            title="Xóa mục này"
                          >
                            <i className="fa-solid fa-xmark text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Tags */}
                  <div className="space-y-2 pt-2">
                    <span className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                      Công Nghệ Sử Dụng
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {exp.technologies.map((tech, techIdx) => (
                        <span
                          key={`tech-${techIdx}`}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExpTech(exp.id, tech)}
                            className="text-gray-400 hover:text-red-600 cursor-pointer"
                          >
                            <i className="fa-solid fa-xmark text-[10px]"></i>
                          </button>
                        </span>
                      ))}

                      {/* Add Tech Input */}
                      <input
                        type="text"
                        placeholder="+ Gõ công nghệ & Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddExpTech(exp.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg border border-dashed border-gray-300 text-xs placeholder:text-gray-400 focus:border-red-500 focus:outline-none w-44"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PROJECTS TAB */}
      {/* ========================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-5">
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div className="relative w-full sm:w-80">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-gray-400 text-xs"></i>
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Tìm dự án, công nghệ, khách hàng..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddProject}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Thêm Dự Án Mới</span>
            </button>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
                <i className="fa-solid fa-rocket text-4xl text-gray-300 mb-3"></i>
                <p className="text-sm font-semibold text-gray-600">Chưa có dự án nào.</p>
                <p className="text-xs text-gray-400 mt-1">Nhấn nút bên trên để tạo dự án thực chiến mới.</p>
              </div>
            ) : (
              filteredProjects.map((proj, idx) => (
                <div
                  key={proj.id || `proj-${idx}`}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 transition-all hover:shadow-md"
                >
                  {/* Card Header & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
                        <i className="fa-solid fa-cubes"></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleUpdateProject(proj.id, { title: e.target.value })}
                            placeholder="Tên dự án"
                            className="text-base font-black text-gray-900 border-b border-dashed border-gray-300 focus:border-red-600 focus:outline-none"
                          />

                          {/* Category Badge Switcher */}
                          <select
                            value={proj.category || 'Enterprise'}
                            onChange={(e) =>
                              handleUpdateProject(proj.id, {
                                category: e.target.value as any,
                                projectType: e.target.value.toLowerCase() as any,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-700 cursor-pointer"
                          >
                            <option value="Enterprise">Doanh Nghiệp (Enterprise)</option>
                            <option value="Public">Cộng Đồng (Public)</option>
                          </select>

                          {/* Featured Toggle */}
                          <button
                            type="button"
                            onClick={() => handleUpdateProject(proj.id, { featured: !proj.featured })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                              proj.featured
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}
                          >
                            <i className="fa-solid fa-star text-[9px]"></i>
                            <span>{proj.featured ? 'Nổi bật' : 'Bình thường'}</span>
                          </button>

                          {/* Private Toggle */}
                          <button
                            type="button"
                            onClick={() => handleUpdateProject(proj.id, { isPrivate: !proj.isPrivate })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                              proj.isPrivate
                                ? 'bg-purple-50 text-purple-700 border-purple-300'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            }`}
                          >
                            <i className={`fa-solid ${proj.isPrivate ? 'fa-lock' : 'fa-globe'} text-[9px]`}></i>
                            <span>{proj.isPrivate ? 'Bảo mật / Nội bộ' : 'Công khai'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <input
                            type="text"
                            value={proj.role || ''}
                            onChange={(e) => handleUpdateProject(proj.id, { role: e.target.value })}
                            placeholder="Vai trò (vd: Lead Architect)"
                            className="border-b border-dashed border-gray-200 focus:border-red-600 focus:outline-none"
                          />
                          <span>•</span>
                          <input
                            type="text"
                            value={proj.company || ''}
                            onChange={(e) => handleUpdateProject(proj.id, { company: e.target.value })}
                            placeholder="Khách hàng / Đơn vị thực hiện"
                            className="border-b border-dashed border-gray-200 focus:border-red-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delete Project */}
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id, proj.title)}
                      className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 self-end sm:self-center cursor-pointer transition-colors"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                      <span>Xóa dự án</span>
                    </button>
                  </div>

                  {/* Metadata Row: Period & Team Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">Thời gian thực hiện</span>
                      <input
                        type="text"
                        value={proj.period || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { period: e.target.value })}
                        placeholder="2023 - 2024"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">Quy mô nhóm (Team Size)</span>
                      <input
                        type="text"
                        value={proj.teamSize || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { teamSize: e.target.value })}
                        placeholder="8 thành viên"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">Mô tả ngắn gọn</span>
                      <input
                        type="text"
                        value={proj.shortDescription || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { shortDescription: e.target.value })}
                        placeholder="Tóm tắt ngắn về giải pháp cho trang chủ / danh mục..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">Mô tả chi tiết</span>
                      <textarea
                        rows={3}
                        value={proj.description || ''}
                        onChange={(e) => handleUpdateProject(proj.id, { description: e.target.value })}
                        placeholder="Mô tả bài toán, kiến trúc hệ thống và giá trị chuyển giao..."
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Highlights / Key Impacts */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Điểm Nhấn Kỹ Thuật & Kết Quả
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddProjHighlight(proj.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i>
                        <span>Thêm điểm nhấn</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(proj.highlights || []).map((hl, hlIdx) => (
                        <div key={`hl-${hlIdx}`} className="flex items-center gap-2">
                          <i className="fa-solid fa-bolt text-amber-500 text-xs shrink-0"></i>
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => handleUpdateProjHighlight(proj.id, hlIdx, e.target.value)}
                            placeholder="Nhập kết quả, chỉ số đo lường hoặc công nghệ đột phá..."
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveProjHighlight(proj.id, hlIdx)}
                            className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                          >
                            <i className="fa-solid fa-xmark text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags and URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <span className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Thẻ Công Nghệ (Tags)
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {proj.tags.map((tag, tagIdx) => (
                          <span
                            key={`ptag-${tagIdx}`}
                            className="px-2.5 py-0.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProjTag(proj.id, tag)}
                              className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <i className="fa-solid fa-xmark text-[10px]"></i>
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="+ Gõ tag & Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddProjTag(proj.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          className="px-2.5 py-0.5 rounded-lg border border-dashed border-gray-300 text-xs placeholder:text-gray-400 focus:border-red-500 focus:outline-none w-36"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Đường Dẫn Liên Kết
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="url"
                          value={proj.githubUrl || ''}
                          onChange={(e) => handleUpdateProject(proj.id, { githubUrl: e.target.value })}
                          placeholder="GitHub Repository URL"
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none font-mono"
                        />
                        <input
                          type="url"
                          value={proj.demoUrl || ''}
                          onChange={(e) => handleUpdateProject(proj.id, { demoUrl: e.target.value })}
                          placeholder="Live Demo / Product URL"
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-red-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SKILLS TAB */}
      {/* ========================================================= */}
      {activeTab === 'skills' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Danh Mục Kỹ Năng Chuyên Môn</h2>
              <p className="text-xs text-gray-500">Phân loại kỹ năng theo các nhóm domain (Backend, Frontend, DevOps, v.v.).</p>
            </div>
            <button
              type="button"
              onClick={handleAddSkillCategory}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/20 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Thêm Nhóm Kỹ Năng</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formData.skillCategories.length === 0 ? (
              <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
                <i className="fa-solid fa-code text-4xl text-gray-300 mb-3"></i>
                <p className="text-sm font-semibold text-gray-600">Chưa có nhóm kỹ năng nào.</p>
                <p className="text-xs text-gray-400 mt-1">Nhấn nút bên trên để tạo nhóm kỹ năng mới.</p>
              </div>
            ) : (
              formData.skillCategories.map((cat, catIdx) => (
                <div
                  key={`cat-${catIdx}`}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => handleUpdateSkillCategory(catIdx, { title: e.target.value })}
                        placeholder="Tên nhóm kỹ năng (vd: Cloud & DevOps)"
                        className="text-sm font-black text-gray-900 border-b border-dashed border-gray-300 focus:border-red-600 focus:outline-none w-full mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSkillCategory(catIdx, cat.title)}
                        className="text-gray-400 hover:text-red-600 cursor-pointer p-1"
                        title="Xóa nhóm kỹ năng này"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={cat.description || ''}
                      onChange={(e) => handleUpdateSkillCategory(catIdx, { description: e.target.value })}
                      placeholder="Mô tả phạm vi kỹ năng..."
                      className="text-xs text-gray-500 border-b border-dashed border-gray-200 focus:border-red-600 focus:outline-none w-full"
                    />

                    {/* Skill Items List */}
                    <div className="space-y-2 pt-2">
                      {cat.skills.map((skill, sIdx) => (
                        <div
                          key={`s-${sIdx}`}
                          className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200/70"
                        >
                          <i className={`${skill.iconName || 'fa-solid fa-code'} text-red-600 text-xs w-4 text-center shrink-0`}></i>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => handleUpdateSkillItem(catIdx, sIdx, 'name', e.target.value)}
                            placeholder="Tên kỹ năng"
                            className="w-1/3 px-2 py-1 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-800 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={skill.level}
                            onChange={(e) => handleUpdateSkillItem(catIdx, sIdx, 'level', e.target.value)}
                            placeholder="Mức độ (vd: 90% hoặc Chuyên sâu)"
                            className="w-1/3 px-2 py-1 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={skill.iconName || ''}
                            onChange={(e) => handleUpdateSkillItem(catIdx, sIdx, 'iconName', e.target.value)}
                            placeholder="fa-brands fa-golang"
                            className="w-1/3 px-2 py-1 rounded-lg border border-gray-200 bg-white text-[11px] font-mono text-gray-600 focus:outline-none"
                            title="Tên class icon FontAwesome"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillItem(catIdx, sIdx)}
                            className="text-gray-400 hover:text-red-600 cursor-pointer p-1"
                          >
                            <i className="fa-solid fa-xmark text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSkillItem(catIdx)}
                    className="w-full py-2 rounded-xl border border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-plus text-[10px]"></i>
                    <span>Thêm kỹ năng vào nhóm</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EDUCATION & CERTIFICATIONS TAB */}
      {/* ========================================================= */}
      {activeTab === 'education' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-red-600"></i>
                <span>Học Vấn & Bằng Cấp</span>
              </h2>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Thêm Học Vấn
              </button>
            </div>

            <div className="space-y-4">
              {formData.educations.map((edu, idx) => (
                <div
                  key={edu.id || `edu-${idx}`}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Bằng cấp / Ngành học"
                      className="text-sm font-black text-gray-900 border-b border-dashed border-gray-300 focus:border-red-600 focus:outline-none w-full mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(edu.id, edu.institution)}
                      className="text-gray-400 hover:text-red-600 cursor-pointer p-1"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Trường đào tạo</span>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                        placeholder="Tên trường đại học / viện"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Niên khóa</span>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => handleUpdateEducation(edu.id, { period: e.target.value })}
                        placeholder="2016 - 2020"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Địa điểm</span>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleUpdateEducation(edu.id, { location: e.target.value })}
                        placeholder="Hà Nội, Việt Nam"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Xếp loại / GPA</span>
                      <input
                        type="text"
                        value={edu.gpaOrHonors || ''}
                        onChange={(e) => handleUpdateEducation(edu.id, { gpaOrHonors: e.target.value })}
                        placeholder="Loại Xuất sắc / GPA 3.8"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-award text-amber-500"></i>
                <span>Chứng Chỉ Chuyên Nghiệp</span>
              </h2>
              <button
                type="button"
                onClick={handleAddCertification}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + Thêm Chứng Chỉ
              </button>
            </div>

            <div className="space-y-4">
              {formData.certifications.map((cert, idx) => (
                <div
                  key={cert.id || `cert-${idx}`}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleUpdateCertification(cert.id, { name: e.target.value })}
                      placeholder="Tên chứng chỉ (vd: AWS Solutions Architect)"
                      className="text-sm font-black text-gray-900 border-b border-dashed border-gray-300 focus:border-amber-600 focus:outline-none w-full mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteCertification(cert.id, cert.name)}
                      className="text-gray-400 hover:text-red-600 cursor-pointer p-1"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Tổ chức cấp</span>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleUpdateCertification(cert.id, { issuer: e.target.value })}
                        placeholder="Google Cloud / AWS"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Ngày cấp</span>
                      <input
                        type="text"
                        value={cert.issueDate}
                        onChange={(e) => handleUpdateCertification(cert.id, { issueDate: e.target.value })}
                        placeholder="10/2024"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
                      />
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-gray-500 font-semibold">Link chứng nhận xác thực</span>
                      <input
                        type="url"
                        value={cert.credentialUrl || ''}
                        onChange={(e) => handleUpdateCertification(cert.id, { credentialUrl: e.target.value })}
                        placeholder="https://www.credly.com/badges/..."
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. PRINCIPLES TAB */}
      {/* ========================================================= */}
      {activeTab === 'principles' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Triết Lý Nghề Nghiệp & Kim Chỉ Nam Kỹ Thuật</h2>
              <p className="text-xs text-gray-500">Các nguyên lý nền tảng giúp bạn định hình tư duy thiết kế hệ thống và chất lượng code.</p>
            </div>
            <button
              type="button"
              onClick={handleAddPrinciple}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/20 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Thêm Triết Lý Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formData.principles.length === 0 ? (
              <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
                <i className="fa-solid fa-compass text-4xl text-gray-300 mb-3"></i>
                <p className="text-sm font-semibold text-gray-600">Chưa có triết lý nào.</p>
                <p className="text-xs text-gray-400 mt-1">Nhấn nút bên trên để thêm nguyên tắc kỹ thuật mới.</p>
              </div>
            ) : (
              formData.principles.map((pr, pIdx) => (
                <div
                  key={`pr-${pIdx}`}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <input
                      type="text"
                      value={pr.title}
                      onChange={(e) => handleUpdatePrinciple(pIdx, 'title', e.target.value)}
                      placeholder="Tiêu đề nguyên tắc (vd: Simplicity & Reliability)"
                      className="text-sm font-black text-gray-900 border-b border-dashed border-gray-300 focus:border-red-600 focus:outline-none w-full mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePrinciple(pIdx, pr.title)}
                      className="text-gray-400 hover:text-red-600 cursor-pointer p-1"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={pr.description}
                    onChange={(e) => handleUpdatePrinciple(pIdx, 'description', e.target.value)}
                    placeholder="Mô tả chi tiết về nguyên lý này..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* JSON EXPERT VIEW MODAL */}
      {/* ========================================================= */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-code text-red-600 text-base"></i>
                <h3 className="text-base font-black text-gray-900">Mã Nguồn JSON Hồ Sơ CV</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono font-bold">
                  {activeLang.toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            {jsonError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {jsonError}
              </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col">
              <p className="text-xs text-gray-500 mb-2">
                Bạn có thể sao chép dữ liệu JSON ra ngoài để sao lưu, hoặc dán dữ liệu JSON mới vào đây rồi nhấn &ldquo;Áp dụng vào Form&rdquo;.
              </p>
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                rows={18}
                className="w-full flex-1 p-3.5 rounded-2xl bg-gray-950 text-emerald-400 font-mono text-xs border border-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(jsonText);
                  alert('Đã sao chép toàn bộ mã JSON vào bộ nhớ tạm!');
                }}
                className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-copy text-xs"></i>
                <span>Sao chép JSON</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleApplyJson}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/20 cursor-pointer"
                >
                  Áp dụng vào Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
