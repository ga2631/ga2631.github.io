'use client';

import React, { useState, useEffect } from 'react';
import { CVData, PersonalInfo } from '@/types';
import { getCvData, saveCvData } from '@/services/cvService';
import { getActiveLanguages, Language } from '@/services/languageService';

interface AdminCvEditorProps {
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminCvEditor: React.FC<AdminCvEditorProps> = ({ onShowToast }) => {
  const [languages, setLanguages] = useState<Language[]>([
    { code: 'vi', name: 'Tiếng Việt', is_active: true },
    { code: 'en', name: 'English', is_active: true },
  ]);
  const [currentLang, setCurrentLang] = useState<string>('vi');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [rawJson, setRawJson] = useState<string>('');
  const [isJsonMode, setIsJsonMode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'info' | 'principles' | 'experiences' | 'projects' | 'skills' | 'education'>('info');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load languages and CV data
  useEffect(() => {
    async function init() {
      try {
        const langs = await getActiveLanguages();
        if (langs.length > 0) {
          setLanguages(langs);
        }
      } catch (err) {
        console.error('Failed to load active languages:', err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getCvData(currentLang);
        setCvData(data);
        setRawJson(JSON.stringify(data, null, 2));
      } catch (err: any) {
        console.error(`Failed to load CV for ${currentLang}:`, err);
        onShowToast(`Lỗi nạp CV [${currentLang.toUpperCase()}]: ${err.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [currentLang]);

  // Handle Save
  const handleSave = async () => {
    let payloadToSave: CVData;

    if (isJsonMode) {
      try {
        payloadToSave = JSON.parse(rawJson);
        setCvData(payloadToSave);
      } catch (err: any) {
        onShowToast(`Lỗi định dạng JSON: ${err.message}`, 'error');
        return;
      }
    } else {
      if (!cvData) return;
      payloadToSave = cvData;
    }

    setIsSaving(true);
    try {
      const result = await saveCvData(currentLang, payloadToSave);
      if (result.success) {
        onShowToast(`Đã lưu thành công hồ sơ CV [${currentLang.toUpperCase()}] lên Supabase!`, 'success');
        setRawJson(JSON.stringify(payloadToSave, null, 2));
      } else {
        onShowToast(`Lưu thất bại: ${result.error}`, 'error');
      }
    } catch (err: any) {
      onShowToast(`Lỗi khi lưu: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: any) => {
    if (!cvData) return;
    const updated = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    };
    setCvData(updated);
    setRawJson(JSON.stringify(updated, null, 2));
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p>Đang nạp dữ liệu CV từ Supabase...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Top Controls: Language Switcher & Save Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Ngôn ngữ hồ sơ:</span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setCurrentLang(l.code)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '0.4rem',
                  border: '1px solid',
                  borderColor: currentLang === l.code ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                  background: currentLang === l.code ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  color: currentLang === l.code ? '#38bdf8' : '#cbd5e1',
                  fontWeight: currentLang === l.code ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {l.name} ({l.code.toUpperCase()})
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsJsonMode(!isJsonMode)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '0.4rem',
              border: '1px solid rgba(255,255,255,0.15)',
              background: isJsonMode ? '#6366f1' : 'transparent',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {isJsonMode ? 'Chuyển sang Form Visual' : 'Chế độ JSON Raw'}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.4rem',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            {isSaving ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>Lưu CV ({currentLang.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isJsonMode ? (
        /* JSON Mode */
        <div className="admin-card">
          <div className="card-header">
            <h3>JSON Editor (Toàn bộ Schema CV [{currentLang.toUpperCase()}])</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Chỉnh sửa trực tiếp object JSON</span>
          </div>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            style={{
              width: '100%',
              minHeight: '650px',
              background: '#040711',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '0.88rem',
              padding: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              lineHeight: 1.5,
            }}
          />
        </div>
      ) : (
        /* Form Visual Editor Mode */
        <div>
          {/* Section Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            {[
              { id: 'info', label: '👤 Thông tin cá nhân' },
              { id: 'principles', label: '⚡ Triết lý kỹ thuật' },
              { id: 'experiences', label: '💼 Kinh nghiệm' },
              { id: 'projects', label: '🚀 Dự án kiến trúc' },
              { id: 'skills', label: '🛠️ Kỹ năng' },
              { id: 'education', label: '🎓 Học vấn & Chứng chỉ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid',
                  borderColor: activeSection === tab.id ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                  background: activeSection === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: activeSection === tab.id ? '#38bdf8' : '#94a3b8',
                  fontWeight: activeSection === tab.id ? 600 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Section 1: Personal Info */}
          {activeSection === 'info' && cvData && (
            <div className="admin-card">
              <div className="card-header">
                <h3>Thông tin Cá nhân & Liên hệ</h3>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.fullName || ''}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Chức danh / Vị trí chuyên môn</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.jobTitle || ''}
                    onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Khẩu hiệu kỹ thuật (Tagline)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={cvData.personalInfo.tagline || ''}
                  onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Tóm tắt năng lực (Bio)</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={cvData.personalInfo.bio || ''}
                  onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                />
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label>Email (Base64 hoặc Plain)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Số điện thoại (Base64 hoặc Plain)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Zalo URL (Base64 hoặc Plain)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.zaloUrl || ''}
                    onChange={(e) => updatePersonalInfo('zaloUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label>Địa điểm</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>GitHub URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.githubUrl || ''}
                    onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cvData.personalInfo.linkedinUrl || ''}
                    onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Principles */}
          {activeSection === 'principles' && cvData && (
            <div className="admin-card">
              <div className="card-header">
                <h3>Triết lý Kỹ thuật ({cvData.principles?.length || 0} mục)</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(cvData.principles || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                    }}
                  >
                    <div className="admin-form-group">
                      <label>Tiêu đề triết lý #{idx + 1}</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.title || ''}
                        onChange={(e) => {
                          const updated = [...cvData.principles];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setCvData({ ...cvData, principles: updated });
                        }}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Mô tả chi tiết</label>
                      <textarea
                        className="admin-textarea"
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => {
                          const updated = [...cvData.principles];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setCvData({ ...cvData, principles: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Experiences */}
          {activeSection === 'experiences' && cvData && (
            <div className="admin-card">
              <div className="card-header">
                <h3>Kinh nghiệm Làm việc ({cvData.experiences?.length || 0} công ty/vị trí)</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(cvData.experiences || []).map((exp, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '0.6rem',
                      padding: '1.25rem',
                    }}
                  >
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label>Vị trí đảm nhiệm</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={exp.role || ''}
                          onChange={(e) => {
                            const updated = [...cvData.experiences];
                            updated[idx] = { ...updated[idx], role: e.target.value };
                            setCvData({ ...cvData, experiences: updated });
                          }}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Công ty / Doanh nghiệp</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={exp.company || ''}
                          onChange={(e) => {
                            const updated = [...cvData.experiences];
                            updated[idx] = { ...updated[idx], company: e.target.value };
                            setCvData({ ...cvData, experiences: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label>Thời gian (Period)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={exp.period || ''}
                          onChange={(e) => {
                            const updated = [...cvData.experiences];
                            updated[idx] = { ...updated[idx], period: e.target.value };
                            setCvData({ ...cvData, experiences: updated });
                          }}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Công nghệ sử dụng (phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={(exp.techStack || []).join(', ')}
                          onChange={(e) => {
                            const updated = [...cvData.experiences];
                            updated[idx] = {
                              ...updated[idx],
                              techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            };
                            setCvData({ ...cvData, experiences: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Projects */}
          {activeSection === 'projects' && cvData && (
            <div className="admin-card">
              <div className="card-header">
                <h3>Dự án Kiến trúc Tiêu biểu ({cvData.projects?.length || 0} dự án)</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(cvData.projects || []).map((proj, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '0.6rem',
                      padding: '1.25rem',
                    }}
                  >
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label>Tên dự án</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={proj.title || ''}
                          onChange={(e) => {
                            const updated = [...cvData.projects];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setCvData({ ...cvData, projects: updated });
                          }}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Subtitle / Quy mô</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={proj.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...cvData.projects];
                            updated[idx] = { ...updated[idx], subtitle: e.target.value };
                            setCvData({ ...cvData, projects: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Mô tả ngắn</label>
                      <textarea
                        className="admin-textarea"
                        rows={2}
                        value={proj.description || ''}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setCvData({ ...cvData, projects: updated });
                        }}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Tech Stack (phân cách bằng dấu phẩy)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(proj.techStack || []).join(', ')}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx] = {
                            ...updated[idx],
                            techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          };
                          setCvData({ ...cvData, projects: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Skills */}
          {activeSection === 'skills' && cvData && (
            <div className="admin-card">
              <div className="card-header">
                <h3>Ma trận Kỹ năng ({cvData.skillCategories?.length || 0} danh mục)</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(cvData.skillCategories || []).map((cat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                    }}
                  >
                    <div className="admin-form-group">
                      <label>Tên danh mục kỹ năng #{idx + 1}</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={cat.title || ''}
                        onChange={(e) => {
                          const updated = [...cvData.skillCategories];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setCvData({ ...cvData, skillCategories: updated });
                        }}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Danh sách kỹ năng (Ví dụ: Golang, Java, PostgreSQL, Redis)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(cat.skills || []).map((s) => s.name).join(', ')}
                        onChange={(e) => {
                          const names = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          const updated = [...cvData.skillCategories];
                          updated[idx] = {
                            ...updated[idx],
                            skills: names.map((name) => ({ name, level: 4 })),
                          };
                          setCvData({ ...cvData, skillCategories: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Education & Certifications */}
          {activeSection === 'education' && cvData && (
            <div className="admin-card">
              <div className="card-header">
                <h3>Học vấn & Chứng chỉ Chuyên môn</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h4 style={{ color: '#38bdf8', marginBottom: '0.75rem' }}>🎓 Học vấn</h4>
                  {(cvData.educations || []).map((edu, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label>Bằng cấp / Ngành học</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={edu.degree || ''}
                            onChange={(e) => {
                              const updated = [...cvData.educations];
                              updated[idx] = { ...updated[idx], degree: e.target.value };
                              setCvData({ ...cvData, educations: updated });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Trường / Cơ sở đào tạo</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={edu.school || ''}
                            onChange={(e) => {
                              const updated = [...cvData.educations];
                              updated[idx] = { ...updated[idx], school: e.target.value };
                              setCvData({ ...cvData, educations: updated });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 style={{ color: '#38bdf8', marginBottom: '0.75rem' }}>🏆 Chứng chỉ & Huy hiệu</h4>
                  {(cvData.certifications || []).map((cert, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label>Tên chứng chỉ</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={cert.title || ''}
                            onChange={(e) => {
                              const updated = [...cvData.certifications];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setCvData({ ...cvData, certifications: updated });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Tổ chức cấp (Issuer)</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={cert.issuer || ''}
                            onChange={(e) => {
                              const updated = [...cvData.certifications];
                              updated[idx] = { ...updated[idx], issuer: e.target.value };
                              setCvData({ ...cvData, certifications: updated });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCvEditor;
