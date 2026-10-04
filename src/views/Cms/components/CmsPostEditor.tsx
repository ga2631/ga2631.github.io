'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AdminPost, AdminCategory, AdminTag } from '@/services/blogAdminService';
import {
  renderMarkdownToHtml,
  calculateReadingTime,
  analyzePostSeo,
  SeoAnalysisResult,
  ReadingTimeResult,
} from '@/utils/markdownRenderer';
import { getCategoryColorClasses } from '@/utils/categoryColors';
import 'katex/dist/katex.min.css';

interface CmsPostEditorProps {
  post: AdminPost;
  categories: AdminCategory[];
  tags: AdminTag[];
  onSave: (post: AdminPost) => Promise<void>;
  onCancel: () => void;
  currentLang: string;
  initialLang?: 'vi' | 'en';
}

const MERMAID_SAMPLE = `\`\`\`mermaid
flowchart TD
  Client[Web Browser / Mobile App] --> Gateway[API Gateway - Nginx]
  Gateway --> Auth[Auth & Session Service]
  Gateway --> Core[Core Business Service]
  Core --> Cache[(Redis Cluster)]
  Core --> DB[(PostgreSQL Primary)]
\`\`\``;

const LATEX_SAMPLE = `$$
\\mathcal{O}(n \\log n) \\quad \\text{và} \\quad E = mc^2 \\quad \\sum_{i=1}^{n} \\frac{1}{i} \\approx \\ln(n) + \\gamma
$$`;

const TABLE_SAMPLE = `| Tiêu chí so sánh | Kiến trúc Đơn khối (Monolith) | Kiến trúc Vi dịch vụ (Microservices) |
| --- | --- | --- |
| Độ phức tạp triển khai | Thấp | Cao (K8s, Service Mesh) |
| Khả năng mở rộng quy mô | Giới hạn theo máy chủ | Mở rộng độc lập từng dịch vụ |
| Thời gian đưa ra thị trường | Nhanh ở giai đoạn đầu | Tối ưu cho đội ngũ nhiều nhóm |`;

function getNextWeekdayDate(daySchedule: number): string {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  let diff = daySchedule - currentDay;
  if (diff <= 0) {
    diff += 7; // Next week's weekday
  }
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  return targetDate.toISOString().substring(0, 10);
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function CmsPostEditor({
  post,
  categories,
  tags,
  onSave,
  onCancel,
  currentLang,
  initialLang = 'vi',
}: CmsPostEditorProps) {
  const [editingPost, setEditingPost] = useState<AdminPost>(() => ({
    ...post,
    translations: {
      vi: {
        lang_code: 'vi',
        slug: post.translations?.vi?.slug || post.slug || '',
        title: post.translations?.vi?.title || '',
        summary: post.translations?.vi?.summary || '',
        content_md: post.translations?.vi?.content_md || '',
        content_html: post.translations?.vi?.content_html || null,
      },
      en: {
        lang_code: 'en',
        slug: post.translations?.en?.slug || '',
        title: post.translations?.en?.title || '',
        summary: post.translations?.en?.summary || '',
        content_md: post.translations?.en?.content_md || '',
        content_html: post.translations?.en?.content_html || null,
      },
    },
  }));

  const [activeLang, setActiveLang] = useState<'vi' | 'en'>(initialLang || 'vi');
  const [showViReference, setShowViReference] = useState(false);
  const [editorMode, setEditorMode] = useState<'write' | 'split' | 'preview'>('split');
  const [isSaving, setIsSaving] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [showSeoDrawer, setShowSeoDrawer] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAutoReadTime, setIsAutoReadTime] = useState(true);
  const [showReadingCalcDetails, setShowReadingCalcDetails] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active translation fields
  const currentTrans = editingPost.translations[activeLang] || {
    lang_code: activeLang,
    title: '',
    summary: '',
    content_md: '',
    content_html: null,
  };

  // Word count & Read time for both languages
  const viReadingStats = useMemo<ReadingTimeResult>(() => {
    return calculateReadingTime(editingPost.translations.vi?.content_md || '');
  }, [editingPost.translations.vi?.content_md]);

  const enReadingStats = useMemo<ReadingTimeResult>(() => {
    return calculateReadingTime(editingPost.translations.en?.content_md || '');
  }, [editingPost.translations.en?.content_md]);

  const readingStats = activeLang === 'vi' ? viReadingStats : enReadingStats;

  // Auto recommended read time: based on active language or primary VI content
  const autoCalculatedMinutes = useMemo(() => {
    if (activeLang === 'vi') {
      return viReadingStats.minutes || 1;
    }
    return enReadingStats.words > 0 ? enReadingStats.minutes : (viReadingStats.minutes || 1);
  }, [activeLang, viReadingStats, enReadingStats]);

  // Sync auto calculated reading time into post automatically when in auto mode
  useEffect(() => {
    if (isAutoReadTime && autoCalculatedMinutes && editingPost.read_time !== autoCalculatedMinutes) {
      setEditingPost((prev) => ({ ...prev, read_time: autoCalculatedMinutes }));
    }
  }, [isAutoReadTime, autoCalculatedMinutes, editingPost.read_time]);

  const handleRecalculateReadingTime = () => {
    setIsAutoReadTime(true);
    setEditingPost((prev) => ({ ...prev, read_time: autoCalculatedMinutes }));
  };

  // Lock body and html scroll while editor is active to strictly ensure 1 single view with zero page drift
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const currentSlug = currentTrans.slug || (activeLang === 'vi' ? editingPost.slug : '');

  // SEO Analysis
  const seoResult: SeoAnalysisResult = useMemo(() => {
    return analyzePostSeo(
      currentTrans.title,
      currentTrans.summary || '',
      currentTrans.content_md,
      currentSlug
    );
  }, [currentTrans.title, currentTrans.summary, currentTrans.content_md, currentSlug]);

  // Selected and unselected tags for clean select dropdown
  const selectedTags = useMemo(() => {
    const ids = new Set(editingPost.tag_ids || []);
    return tags.filter((t) => (t.id && ids.has(t.id)) || (t.slug && ids.has(t.slug)));
  }, [tags, editingPost.tag_ids]);

  const unselectedTags = useMemo(() => {
    const ids = new Set(editingPost.tag_ids || []);
    return tags.filter((t) => !(t.id && ids.has(t.id)) && !(t.slug && ids.has(t.slug)));
  }, [tags, editingPost.tag_ids]);

  const handleAddTag = (tagId: string) => {
    if (!tagId) return;
    const currentIds = editingPost.tag_ids || [];
    if (!currentIds.includes(tagId)) {
      const tagObj = tags.find((t) => t.id === tagId || t.slug === tagId);
      const nextTags = tagObj ? [...(editingPost.tags || []), tagObj.slug] : (editingPost.tags || []);
      setEditingPost((prev) => ({
        ...prev,
        tag_ids: [...currentIds, tagId],
        tags: nextTags,
      }));
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const currentIds = editingPost.tag_ids || [];
    const tagObj = tags.find((t) => t.id === tagId || t.slug === tagId);
    setEditingPost((prev) => ({
      ...prev,
      tag_ids: currentIds.filter((id) => id !== tagId),
      tags: (prev.tags || []).filter((name) => name !== tagObj?.slug),
    }));
  };

  // Render HTML preview
  const previewHtml = useMemo(() => {
    return renderMarkdownToHtml(currentTrans.content_md || '');
  }, [currentTrans.content_md]);

  // Render Mermaid diagrams on the client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (editorMode === 'write') return;

    let isMounted = true;
    import('mermaid')
      .then((m) => {
        if (!isMounted) return;
        m.default.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Roboto, sans-serif',
        });

        const containers = document.querySelectorAll('.mermaid-diagram');
        containers.forEach(async (el, idx) => {
          const rawCode = decodeURIComponent(el.getAttribute('data-mermaid') || '');
          if (rawCode) {
            try {
              const uniqueId = `mermaid-svg-${idx}-${Date.now()}`;
              const { svg } = await m.default.render(uniqueId, rawCode);
              el.innerHTML = svg;
            } catch {
              // keep fallback pre
            }
          }
        });
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, [previewHtml, editorMode]);

  // Handler: Update translation fields
  const updateTransField = (field: 'title' | 'summary' | 'content_md' | 'slug', value: string) => {
    setEditingPost((prev) => {
      const trans = { ...prev.translations };
      const current = trans[activeLang] || { lang_code: activeLang, title: '', summary: '', content_md: '' };
      trans[activeLang] = {
        ...current,
        [field]: value,
      };

      // Auto update slug if it's empty or auto-generated
      let nextBaseSlug = prev.slug;
      if (field === 'title') {
        const auto = generateSlug(value);
        if (auto && (!trans[activeLang].slug || trans[activeLang].slug.startsWith('post-') || trans[activeLang].slug.startsWith('new-post-'))) {
          trans[activeLang] = {
            ...trans[activeLang],
            slug: auto,
          };
        }
        if (activeLang === 'vi' && auto && (!prev.slug || prev.slug.startsWith('post-') || prev.slug.startsWith('new-post-'))) {
          nextBaseSlug = auto;
        }
      } else if (field === 'slug' && activeLang === 'vi') {
        nextBaseSlug = value;
      }

      return { ...prev, slug: nextBaseSlug, translations: trans };
    });
  };

  // Helper: Copy structure and content from Vietnamese to English translation
  const handleCopyFromVietnamese = () => {
    const vi = editingPost.translations?.vi;
    if (!vi || !vi.content_md) {
      alert('Bản Tiếng Việt chưa có nội dung để sao chép.');
      return;
    }
    if (
      editingPost.translations?.en?.content_md &&
      !confirm('Bản Tiếng Anh hiện đã có nội dung. Bạn có chắc muốn sao chép đè sườn từ bản Tiếng Việt không?')
    ) {
      return;
    }
    setEditingPost((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        en: {
          lang_code: 'en',
          title: prev.translations?.en?.title || (vi.title ? `[EN] ${vi.title}` : ''),
          summary: prev.translations?.en?.summary || vi.summary || '',
          content_md: vi.content_md || '',
          content_html: null,
        },
      },
    }));
  };

  // Handler: Smart Schedule date recommendation
  const handleRecommendDate = () => {
    const matchedCategory = categories.find((c) => c.id === editingPost.category_id);
    const scheduleDay = matchedCategory?.post_schedule ?? 1;
    const nextDate = getNextWeekdayDate(scheduleDay);
    setEditingPost((prev) => ({
      ...prev,
      published_at: nextDate,
    }));
  };

  // Insert markdown snippet at cursor
  const insertTextAtCursor = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentTrans.content_md || '';
    const selected = text.substring(start, end) || defaultText;

    const newContent = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    updateTransField('content_md', newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Slash commands list
  const slashCommands = [
    { label: 'Tiêu đề H1', desc: 'Đầu mục chính bài viết', iconClass: 'fa-solid fa-heading', action: () => insertTextAtCursor('# ', '', 'Tiêu đề lớn') },
    { label: 'Tiêu đề H2', desc: 'Phân đoạn nội dung chính', iconClass: 'fa-solid fa-heading text-xs', action: () => insertTextAtCursor('## ', '', 'Đầu mục đoạn') },
    { label: 'Tiêu đề H3', desc: 'Mục con chi tiết', iconClass: 'fa-solid fa-heading text-[10px]', action: () => insertTextAtCursor('### ', '', 'Tiêu đề con') },
    { label: 'Danh sách chấm', desc: 'Gạch đầu dòng danh sách', iconClass: 'fa-solid fa-list-ul', action: () => insertTextAtCursor('- ', '', 'Ý chính') },
    { label: 'Danh sách số', desc: 'Thứ tự các bước thực hiện', iconClass: 'fa-solid fa-list-ol', action: () => insertTextAtCursor('1. ', '', 'Bước 1') },
    { label: 'Trích dẫn / Quote', desc: 'Trích dẫn khối nội dung', iconClass: 'fa-solid fa-quote-left', action: () => insertTextAtCursor('> ', '', 'Nội dung trích dẫn') },
    { label: 'Khối mã Code', desc: 'Code highlight cú pháp', iconClass: 'fa-solid fa-code', action: () => insertTextAtCursor('```typescript\n', '\n```', '// Mã nguồn TypeScript') },
    { label: 'Kiến trúc Mermaid', desc: 'Biểu đồ luồng / Flowchart trực quan (2.3.4.1)', iconClass: 'fa-solid fa-diagram-project', action: () => insertTextAtCursor('\n' + MERMAID_SAMPLE + '\n') },
    { label: 'Công thức Toán LaTeX', desc: 'KaTeX Math Formula (2.3.4.2)', iconClass: 'fa-solid fa-square-root-variable', action: () => insertTextAtCursor('\n' + LATEX_SAMPLE + '\n') },
    { label: 'Bảng dữ liệu Table', desc: 'Bảng so sánh markdown', iconClass: 'fa-solid fa-table', action: () => insertTextAtCursor('\n' + TABLE_SAMPLE + '\n') },
    { label: 'Hộp Ghi chú (Callout)', desc: 'Ghi chú kỹ thuật nổi bật', iconClass: 'fa-solid fa-circle-info', action: () => insertTextAtCursor('> [!NOTE]\n> ', '', 'Lưu ý kiến trúc quan trọng cho hệ thống chịu tải.') },
    { label: 'Đường phân cách (HR)', desc: 'Ngăn cách các phân đoạn', iconClass: 'fa-solid fa-minus', action: () => insertTextAtCursor('\n---\n') },
  ];

  const filteredCommands = useMemo(() => {
    if (!slashQuery.trim()) return slashCommands;
    const q = slashQuery.toLowerCase();
    return slashCommands.filter((c) => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  }, [slashQuery]);

  // Handler: Save
  const handleSavePost = async () => {
    const titleVi = editingPost.translations?.vi?.title?.trim();
    const titleEn = editingPost.translations?.en?.title?.trim();
    if (!titleVi && !titleEn) {
      alert('Vui lòng nhập tiêu đề bài viết (Tiếng Việt hoặc Tiếng Anh).');
      return;
    }

    const viSlug = editingPost.translations?.vi?.slug?.trim() || editingPost.slug.trim() || generateSlug(titleVi || '');
    const enSlug = editingPost.translations?.en?.slug?.trim() || generateSlug(titleEn || '') || viSlug;

    if (!viSlug && !enSlug) {
      alert('Slug URL không được để trống.');
      return;
    }

    setIsSaving(true);
    try {
      // Also generate rendered HTML for storage
      const postWithHtml: AdminPost = {
        ...editingPost,
        slug: viSlug || enSlug || editingPost.slug,
        translations: {
          vi: {
            ...editingPost.translations.vi,
            slug: viSlug,
            content_html: renderMarkdownToHtml(editingPost.translations.vi.content_md || ''),
          },
          en: {
            ...editingPost.translations.en,
            slug: enSlug,
            content_html: renderMarkdownToHtml(editingPost.translations.en.content_md || ''),
          },
        },
      };

      await onSave(postWithHtml);
    } catch (err: any) {
      alert('Lỗi khi lưu bài viết: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Lock body scroll so page never drifts/scrolls while editor is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-16 z-30 bg-[#fafafa] flex flex-col overflow-hidden h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] px-3 sm:px-6 py-2 max-w-7xl mx-auto w-full"
      role="region"
      aria-label="Notion Post Editor"
    >
      {/* 1. Editor Top Action Bar (Docked, shrink-0) */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl p-2 px-4 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Back button & Slug/Status info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Quay lại danh sách"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="text-xs sm:text-sm font-black text-gray-900 font-mono truncate max-w-[130px] sm:max-w-[200px]"
              title={`Slug (${activeLang.toUpperCase()}): /${activeLang}/blog/${currentSlug || 'url-slug'}`}
            >
              /{currentSlug || 'url-slug'}
            </span>
            {/* Publication Status Pill */}
            {!editingPost.published_at ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Bản Nháp
              </span>
            ) : editingPost.published_at.substring(0, 10) > new Date().toISOString().substring(0, 10) ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Lên Lịch ({editingPost.published_at.substring(0, 10)})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đã Xuất Bản
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Quick Reading Time Calculator Badge / Button */}
          <button
            type="button"
            onClick={() => setShowReadingCalcDetails((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl border border-indigo-200/90 bg-indigo-50/70 hover:bg-indigo-100 text-xs font-bold text-indigo-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Thời gian đọc được tính tự động từ nội dung bài viết. Bấm để xem chi tiết tính toán"
          >
            <i className="fa-solid fa-clock text-xs text-indigo-600"></i>
            <span>{editingPost.read_time || autoCalculatedMinutes} phút</span>
            <span className="text-[10px] text-indigo-600/80 font-mono hidden xl:inline">({readingStats.words} từ)</span>
          </button>

          {/* SEO Score Button */}
          <button
            type="button"
            onClick={() => setShowSeoDrawer(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${seoResult.status === 'excellent'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100/60'
              : seoResult.status === 'good'
                ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100/60'
                : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100/60'
              }`}
            title="Mở bảng phân tích SEO & xem trước Google Search"
          >
            <i className="fa-solid fa-bullseye text-xs"></i>
            <span>SEO {seoResult.score}%</span>
          </button>

          {/* Editor Mode Toggles */}
          <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setEditorMode('write')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${editorMode === 'write' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500'
                }`}
            >
              Viết
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('split')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${editorMode === 'split' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500'
                }`}
            >
              Chia đôi
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${editorMode === 'preview' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500'
                }`}
            >
              Xem trước
            </button>
          </div>

          {/* Bilingual Switcher (VI / EN) */}
          <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-bold border border-gray-200/60">
            <button
              type="button"
              aria-label="VI"
              onClick={() => setActiveLang('vi')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeLang === 'vi' ? 'bg-red-600 text-white shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900'
                }`}
              title="Bản Tiếng Việt (Mặc định)"
            >
              <span>VI</span>
              <span className="hidden sm:inline text-[10px] opacity-80">(Mặc định)</span>
            </button>
            <button
              type="button"
              aria-label="EN"
              onClick={() => setActiveLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${activeLang === 'en' ? 'bg-blue-600 text-white shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900'
                }`}
              title="Bản Tiếng Anh (Khi chọn)"
            >
              <span>EN</span>
              <span className="hidden sm:inline text-[10px] opacity-80">(Khi chọn)</span>
              {editingPost.translations?.en?.title ? (
                <span className={`w-1.5 h-1.5 rounded-full ${activeLang === 'en' ? 'bg-white' : 'bg-blue-500'}`} />
              ) : null}
            </button>
          </div>

          {/* Toggle Right Sidebar */}
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${showSidebar ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            title="Ẩn / Hiện cài đặt bài viết bên phải"
          >
            <i className="fa-solid fa-gear text-xs"></i>
            <span className="hidden xl:inline">{showSidebar ? 'Ẩn Cài đặt' : 'Cài đặt'}</span>
          </button>

          {/* Save Post Button */}
          <button
            type="button"
            onClick={handleSavePost}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-95"
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                <span>Lưu...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk text-xs"></i>
                <span>Lưu Bài Viết</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Fills remaining height, overflow-hidden) */}
      <div className="flex-1 min-h-0 flex flex-row items-stretch gap-3 sm:gap-4 pt-2 overflow-hidden">
        {/* LEFT COLUMN: Main Writing Canvas */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden space-y-2">
          {/* Active Language Mode Status Bar */}
          {activeLang === 'en' ? (
            <div className="shrink-0 bg-blue-50/90 border border-blue-200 rounded-2xl p-2.5 px-3 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-blue-900">
                    Bản Tiếng Anh (English Translation)
                  </span>
                  {!editingPost.translations?.en?.title && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Chưa có nội dung
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyFromVietnamese}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-100/60 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors text-[11px]"
                  title="Sao chép tiêu đề, tóm tắt và nội dung từ bản Tiếng Việt để dịch nhanh"
                >
                  <i className="fa-solid fa-clone text-xs"></i>
                  <span>Sao chép sườn từ bản Tiếng Việt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowViReference(!showViReference)}
                  className={`px-2.5 py-1 rounded-xl font-bold border flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors text-[11px] ${showViReference
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white hover:bg-blue-100/60 text-blue-700 border-blue-200'
                    }`}
                  title="Mở bảng đối chiếu nội dung Tiếng Việt gốc"
                >
                  <i className="fa-solid fa-columns text-xs"></i>
                  <span>{showViReference ? 'Ẩn đối chiếu VI' : 'Đối chiếu bản Tiếng Việt'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="shrink-0 bg-white/80 border border-gray-200/80 rounded-2xl p-2 px-3 flex items-center justify-between text-xs text-gray-600 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="font-bold text-gray-900">Bản Tiếng Việt</span>
                <span className="text-[11px] text-gray-400 font-medium">(Mặc định hiển thị)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-gray-500 hidden sm:inline">
                  Bản Tiếng Anh:{' '}
                  {editingPost.translations?.en?.title ? (
                    <strong className="text-emerald-700 font-semibold">Đã có</strong>
                  ) : (
                    <strong className="text-amber-600 font-semibold">Chưa có</strong>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveLang('en')}
                  className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-blue-50 text-blue-700 font-bold border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  Chuyển sang bản Tiếng Anh &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Collapsible Vietnamese Reference Drawer when activeLang === 'en' */}
          {activeLang === 'en' && showViReference && (
            <div className="shrink-0 bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs max-h-48 overflow-y-auto space-y-2 shadow-sm animate-in fade-in custom-scrollbar">
              <div className="flex items-center justify-between text-amber-900 font-bold border-b border-amber-200/70 pb-1.5">
                <span className="flex items-center gap-1.5 text-xs">
                  <i className="fa-solid fa-language text-amber-700 text-sm"></i>
                  <span>Đối chiếu bản Tiếng Việt gốc (Để tham khảo khi dịch)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowViReference(false)}
                  className="text-amber-700 hover:text-amber-900 cursor-pointer p-0.5"
                  title="Đóng bảng đối chiếu"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
              <div>
                <span className="font-bold text-gray-700 text-[11px]">Tiêu đề gốc: </span>
                <span className="text-gray-900 font-semibold">
                  {editingPost.translations?.vi?.title || '(Chưa có tiêu đề Tiếng Việt)'}
                </span>
              </div>
              {editingPost.translations?.vi?.summary && (
                <div>
                  <span className="font-bold text-gray-700 text-[11px]">Tóm tắt gốc: </span>
                  <span className="text-gray-800 italic">
                    {editingPost.translations.vi.summary}
                  </span>
                </div>
              )}
              {editingPost.translations?.vi?.content_md && (
                <div>
                  <span className="font-bold text-gray-700 text-[11px] block mb-1">
                    Nội dung Markdown Tiếng Việt:
                  </span>
                  <pre className="p-2.5 bg-white/90 border border-amber-200 rounded-xl text-[11px] font-mono text-gray-800 whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar">
                    {editingPost.translations.vi.content_md}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Article Title & Summary Inputs (Compact, shrink-0) */}
          <div className="shrink-0 bg-white border border-gray-100 rounded-2xl p-2.5 sm:px-4 sm:py-2 shadow-xs space-y-1">
            <div>
              <input
                type="text"
                required
                value={currentTrans.title}
                onChange={(e) => updateTransField('title', e.target.value)}
                placeholder={activeLang === 'vi' ? 'Tiêu đề bài viết kỹ thuật...' : 'Technical article title...'}
                className="w-full text-base sm:text-lg font-black text-gray-900 border-b border-gray-100 pb-1 focus:outline-none placeholder-gray-300"
              />
            </div>

            <div>
              <input
                type="text"
                value={currentTrans.summary || ''}
                onChange={(e) => updateTransField('summary', e.target.value)}
                placeholder={activeLang === 'vi' ? 'Tóm tắt ngắn 1-2 câu làm nổi bật nội dung cốt lõi của bài viết...' : 'Concise 1-2 sentence executive summary highlighting key takeaways...'}
                className="w-full text-xs text-gray-700 focus:outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Notion-Style Format Toolbar (shrink-0) */}
          <div className="shrink-0 bg-white border border-gray-200 rounded-xl p-1.5 shadow-xs flex items-center justify-between gap-1 overflow-x-auto text-xs">
            <div className="flex items-center gap-1">
              {/* Quick Notion commands dropdown button */}
              <button
                type="button"
                onClick={() => setShowSlashMenu(!showSlashMenu)}
                className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <i className="fa-solid fa-bolt text-xs"></i>
                <span>/ Lệnh Notion</span>
                <i className="fa-solid fa-chevron-down text-[9px] ml-0.5"></i>
              </button>

              <div className="h-5 w-px bg-gray-200 mx-1" />

              {/* Formatting buttons */}
              <button
                type="button"
                onClick={() => insertTextAtCursor('**', '**', 'chữ đậm')}
                className="p-1.5 px-2.5 rounded-lg hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                title="Bold (**text**)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('*', '*', 'chữ nghiêng')}
                className="p-1.5 px-2.5 rounded-lg hover:bg-gray-100 italic font-serif text-gray-700 cursor-pointer"
                title="Italic (*text*)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('`', '`', 'code')}
                className="p-1.5 px-2 rounded-lg hover:bg-gray-100 font-mono text-red-600 cursor-pointer"
                title="Inline Code (`code`)"
              >
                {`</>`}
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('$ ', ' $', 'E = mc^2')}
                className="p-1.5 px-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer flex items-center justify-center"
                title="Inline Math ($ formula $)"
              >
                <i className="fa-solid fa-square-root-variable text-xs"></i>
              </button>

              <div className="h-5 w-px bg-gray-200 mx-1" />

              {/* Headings */}
              <button
                type="button"
                onClick={() => insertTextAtCursor('## ', '', 'Tiêu đề H2')}
                className="p-1.5 px-2 rounded-lg hover:bg-gray-100 font-extrabold text-gray-800 cursor-pointer"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('### ', '', 'Tiêu đề H3')}
                className="p-1.5 px-2 rounded-lg hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                title="Heading 3"
              >
                H3
              </button>

              <div className="h-5 w-px bg-gray-200 mx-1" />

              {/* Lists */}
              <button
                type="button"
                onClick={() => insertTextAtCursor('- ', '', 'Mục')}
                className="p-1.5 px-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                title="Bullet list"
              >
                • Danh sách
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('> ', '', 'Trích dẫn')}
                className="p-1.5 px-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                title="Blockquote"
              >
                “ Trích dẫn
              </button>

              <div className="h-5 w-px bg-gray-200 mx-1" />

              {/* 2.3.4.1 Mermaid Shortcut */}
              <button
                type="button"
                onClick={() => insertTextAtCursor('\n' + MERMAID_SAMPLE + '\n')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Chèn sơ đồ kiến trúc Mermaid"
              >
                <i className="fa-solid fa-diagram-project text-xs"></i>
                <span>Mermaid</span>
              </button>

              {/* 2.3.4.2 LaTeX Shortcut */}
              <button
                type="button"
                onClick={() => insertTextAtCursor('\n' + LATEX_SAMPLE + '\n')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Chèn công thức toán LaTeX / KaTeX"
              >
                <i className="fa-solid fa-square-root-variable text-xs"></i>
                <span>LaTeX</span>
              </button>
            </div>
          </div>

          {/* Slash Menu Modal / Dropdown */}
          {showSlashMenu && (
            <div className="relative z-40">
              <div className="p-4 rounded-3xl bg-white border border-gray-200 shadow-xl max-w-lg space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Menu Lệnh Notion (Gõ / để chèn nhanh)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSlashMenu(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <input
                  type="text"
                  autoFocus
                  value={slashQuery}
                  onChange={(e) => setSlashQuery(e.target.value)}
                  placeholder="Tìm khối lệnh: h1, mermaid, latex, code, table..."
                  className="w-full px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto">
                  {filteredCommands.map((cmd, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        cmd.action();
                        setShowSlashMenu(false);
                        setSlashQuery('');
                      }}
                      className="p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 text-left flex items-start gap-2.5 transition-all cursor-pointer"
                    >
                      <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center shrink-0">
                        <i className={cmd.iconClass}></i>
                      </span>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{cmd.label}</div>
                        <div className="text-[10px] text-gray-400 line-clamp-1">{cmd.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Canvas (Editor & Live Preview) - Fills ALL remaining height */}
          <div className={`flex-1 min-h-0 grid gap-3 sm:gap-4 ${editorMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} overflow-hidden`}>
            {/* Editor Area */}
            {editorMode !== 'preview' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100 shrink-0">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Nội dung Markdown ({activeLang.toUpperCase()})
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Hỗ trợ Mermaid ```mermaid & KaTeX $$ math $$
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={currentTrans.content_md}
                  onChange={(e) => updateTransField('content_md', e.target.value)}
                  placeholder="Bắt đầu viết bài viết kỹ thuật ở đây. Sử dụng # để tạo tiêu đề, ```mermaid để vẽ sơ đồ, $$ để viết công thức toán..."
                  className="w-full flex-1 min-h-0 p-1 bg-transparent text-gray-900 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none placeholder-gray-300 overflow-y-auto"
                />
              </div>
            )}

            {/* Live Preview Area */}
            {editorMode !== 'write' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 shrink-0">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Xem Trước Trực Tiếp (Live Render)</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    100% giao diện Blog
                  </span>
                </div>

                {/* Rendered Article Body with internal scrolling */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                  <article className="prose prose-sm sm:prose max-w-none text-gray-800 leading-relaxed">
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                      {currentTrans.title || 'Tiêu đề bài viết'}
                    </h1>

                    {currentTrans.summary && (
                      <div className="my-3 border-l-4 border-red-500 bg-red-50/50 p-3 rounded-r-xl italic text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {currentTrans.summary}
                      </div>
                    )}

                    <div
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                      className="article-preview-content space-y-3"
                    />
                  </article>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Right Sidebar (Publishing Settings & Select Tags) */}
        {showSidebar && (
          <aside className="w-80 shrink-0 h-full overflow-y-auto bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-t-4 border-t-red-600 space-y-3.5 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-gear text-red-600 text-sm"></i>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Cài Đặt Bài Viết
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-bold">
                Publishing
              </span>
            </div>

            {/* 2.3.2. Chuyên Mục Kỹ Thuật (Category) */}
            <div>
              <label className="block text-xs text-gray-700 font-bold mb-1.5">
                Chuyên Mục Kỹ Thuật <span className="text-red-500">*</span>
              </label>
              <select
                aria-label="Chọn chuyên mục kỹ thuật"
                value={editingPost.category_id || ''}
                onChange={(e) => {
                  const catId = e.target.value || null;
                  setEditingPost((prev) => ({ ...prev, category_id: catId }));
                }}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
              >
                <option value="">-- Chọn chuyên mục --</option>
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.id || c.slug}>
                    {c.translations?.[activeLang]?.name || c.translations?.vi?.name || c.slug}
                  </option>
                ))}
              </select>
            </div>

            {/* 2.3.4. Ngày Đăng Bài (Smart date recommendation) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-700 font-bold">
                  Ngày Đăng Bài
                </label>
                <button
                  type="button"
                  onClick={handleRecommendDate}
                  className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                  title="Gợi ý ngày Thứ tương ứng lịch chuyên mục gần nhất"
                >
                  <i className="fa-solid fa-calendar-check text-[10px]"></i>
                  <span>Gợi ý lịch</span>
                </button>
              </div>
              <input
                type="date"
                value={editingPost.published_at ? editingPost.published_at.substring(0, 10) : ''}
                onChange={(e) => setEditingPost({ ...editingPost, published_at: e.target.value || null })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-gray-200 text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors"
              />
            </div>

            {/* Slug URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-700 font-bold">
                  Slug ({activeLang.toUpperCase()}) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const baseTitle = currentTrans.title || '';
                    if (baseTitle) {
                      const newSlug = generateSlug(baseTitle);
                      updateTransField('slug', newSlug);
                    }
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer"
                >
                  Tạo từ tiêu đề
                </button>
              </div>
              <input
                type="text"
                required
                value={currentTrans.slug || (activeLang === 'vi' ? editingPost.slug : '')}
                onChange={(e) => updateTransField('slug', generateSlug(e.target.value))}
                placeholder={`slug-url-${activeLang}`}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-gray-200 text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors"
              />
              <span className="text-[10px] text-gray-400 mt-1 block font-mono">
                /{activeLang}/blog/{currentTrans.slug || (activeLang === 'vi' ? editingPost.slug : 'url-slug')}
              </span>
            </div>

            {/* ⏱️ Công Cụ Tính Thời Gian Đọc Tự Động */}
            <div className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-gray-50/70 rounded-2xl p-3 border border-indigo-100/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-calculator text-indigo-600 text-xs"></i>
                  <span className="text-xs font-bold text-gray-800">Thời Gian Đọc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isAutoReadTime ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200" title="Tự động tính từ độ dài và cấu trúc bài viết">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Tự động</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100/90 text-amber-800 border border-amber-200" title="Đang ở chế độ tùy chỉnh thủ công">
                      <span>Thủ công</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleRecalculateReadingTime}
                    className="p-1 px-1.5 rounded-lg text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100/80 transition-colors cursor-pointer flex items-center gap-1"
                    title="Tính toán lại thời gian đọc theo nội dung hiện tại"
                  >
                    <i className="fa-solid fa-rotate text-[10px]"></i>
                    <span className="hidden sm:inline">Tính lại</span>
                  </button>
                </div>
              </div>

              {/* Main Prominent Display */}
              <div className="flex items-baseline justify-between bg-white rounded-xl p-2.5 border border-gray-200/90 shadow-2xs">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-gray-900 font-mono tracking-tight">
                      {editingPost.read_time || autoCalculatedMinutes}
                    </span>
                    <span className="text-xs font-bold text-gray-600">phút đọc</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1 font-mono">
                    <span>{readingStats.words} từ</span>
                    <span>•</span>
                    <span>{readingStats.characters} ký tự</span>
                  </div>
                </div>

                {/* Toggle details button */}
                <button
                  type="button"
                  onClick={() => setShowReadingCalcDetails(!showReadingCalcDetails)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{showReadingCalcDetails ? 'Thu gọn' : 'Chi tiết'}</span>
                  <i className={`fa-solid fa-chevron-${showReadingCalcDetails ? 'up' : 'down'} text-[9px]`}></i>
                </button>
              </div>

              {/* Detailed Breakdown Panel */}
              {showReadingCalcDetails && (
                <div className="p-2.5 bg-white/95 rounded-xl border border-gray-200/90 space-y-2 text-[11px] animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-1.5 text-gray-600">
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                      <span>Tốc độ đọc:</span>
                      <strong className="font-mono text-gray-800">200 từ/ph</strong>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                      <span>Khối Code:</span>
                      <strong className="font-mono text-gray-800">{readingStats.codeBlocks}</strong>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                      <span>Sơ đồ Mermaid:</span>
                      <strong className="font-mono text-gray-800">{readingStats.diagrams}</strong>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                      <span>Hình ảnh:</span>
                      <strong className="font-mono text-gray-800">{readingStats.images}</strong>
                    </div>
                  </div>

                  {/* Dual-language comparison */}
                  <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span className={activeLang === 'vi' ? 'font-bold text-red-600' : ''}>
                      🇻🇳 VI: {viReadingStats.minutes}p ({viReadingStats.words} từ)
                    </span>
                    <span className={activeLang === 'en' ? 'font-bold text-blue-600' : ''}>
                      🇬🇧 EN: {enReadingStats.minutes}p ({enReadingStats.words} từ)
                    </span>
                  </div>

                  {/* Manual Override Option */}
                  <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                    <label className="text-[10px] text-gray-500 font-medium">Tùy chỉnh thủ công:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={editingPost.read_time || autoCalculatedMinutes}
                        onChange={(e) => {
                          setIsAutoReadTime(false);
                          setEditingPost({ ...editingPost, read_time: Number(e.target.value) || 1 });
                        }}
                        className="w-14 px-1.5 py-0.5 text-xs text-right font-mono rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        title="Nhập số phút tùy chỉnh nếu cần"
                      />
                      <span className="text-[10px] text-gray-500">phút</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2.3.3. Thẻ Kỹ Thuật (Tags) - Dạng Select theo yêu cầu của user */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-700 font-bold">
                  Thẻ Kỹ Thuật (Tags)
                </label>
                {selectedTags.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setEditingPost({ ...editingPost, tag_ids: [], tags: [] })}
                    className="text-[10px] text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Dropdown Select to pick tags */}
              <select
                aria-label="Chọn thẻ kỹ thuật"
                value=""
                onChange={(e) => {
                  handleAddTag(e.target.value);
                  e.target.value = '';
                }}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
              >
                <option value="">+ Chọn thêm thẻ kỹ thuật...</option>
                {unselectedTags.length === 0 ? (
                  <option value="" disabled>Đã chọn tất cả thẻ khả dụng</option>
                ) : (
                  unselectedTags.map((tg) => (
                    <option key={tg.id || tg.slug} value={tg.id || tg.slug}>
                      #{tg.slug} — {tg.translations?.[activeLang]?.name || tg.translations?.vi?.name || tg.slug}
                    </option>
                  ))
                )}
              </select>

              {/* Selected tag chips */}
              <div className="flex flex-wrap gap-1.5 mt-2 min-h-[28px]">
                {selectedTags.length === 0 ? (
                  <span className="text-[11px] text-gray-400 italic">
                    Chưa chọn thẻ nào. Chọn thẻ từ menu trên.
                  </span>
                ) : (
                  selectedTags.map((tg) => (
                    <span
                      key={tg.id || tg.slug}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold animate-in fade-in"
                    >
                      <span>#{tg.slug}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tg.id || tg.slug)}
                        className="hover:text-red-900 font-bold ml-0.5 cursor-pointer text-xs"
                        title={`Bỏ thẻ #${tg.slug}`}
                      >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* SEO Summary in Sidebar */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-700">Điểm SEO Google</span>
                <span className="text-xs font-mono font-bold text-red-600">{seoResult.score} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${seoResult.score >= 80 ? 'bg-emerald-500' : seoResult.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${seoResult.score}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSeoDrawer(true)}
                className="mt-2.5 w-full py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-[11px] font-bold text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Xem chi tiết SEO & Snippet</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* SEO Modal Popup (Does not push layout or cause page scroll) */}
      {showSeoDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bullseye text-red-600 text-lg"></i>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  2.3.4.5 Công Cụ Tính Toán & Tối Ưu Hóa SEO Google
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800">
                  Điểm chất lượng: {seoResult.score} / 100
                </span>
                <button
                  type="button"
                  onClick={() => setShowSeoDrawer(false)}
                  className="text-gray-400 hover:text-gray-700 text-base font-bold cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Google SERP Card Preview */}
              <div className="lg:col-span-6 space-y-2">
                <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                  Mô phỏng hiển thị trên Google Search:
                </span>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center">
                      T
                    </span>
                    <div className="truncate">
                      <span className="font-semibold text-gray-900">huynhnhattan.dev</span>
                      <span className="text-gray-400"> › {activeLang} › blog › {currentSlug || 'slug'}</span>
                    </div>
                  </div>
                  <div className="text-base sm:text-lg font-medium text-blue-700 hover:underline cursor-pointer leading-snug pt-0.5 line-clamp-2">
                    {currentTrans.title || 'Tiêu đề bài viết kỹ thuật sẽ hiển thị tại đây'}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 pt-0.5">
                    {currentTrans.summary ||
                      'Đoạn tóm tắt meta description của bài viết sẽ được hiển thị trên Google để thu hút độc giả nhấp chuột vào đọc...'}
                  </p>
                </div>
              </div>

              {/* Checklist items */}
              <div className="lg:col-span-6 space-y-2.5">
                <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                  Đánh giá tiêu chí kỹ thuật:
                </span>
                <div className="space-y-2 text-xs">
                  {seoResult.checks.map((chk, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${chk.passed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                        }`}
                    >
                      <span className="font-bold text-sm shrink-0">
                        {chk.passed ? (
                          <i className="fa-solid fa-circle-check text-emerald-600"></i>
                        ) : (
                          <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                        )}
                      </span>
                      <div>
                        <div className="font-bold">{chk.label}</div>
                        <div className="text-[11px] opacity-90 mt-0.5">{chk.recommendation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

