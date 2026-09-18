import { BlogPost } from '../types/index.ts';

export interface StandardSectionDef {
  id: string;
  order: number;
  title: {
    vi: string;
    en: string;
  };
  keywords: {
    vi: string[];
    en: string[];
  };
}

export interface CategoryStructureDef {
  categoryId: string;
  categoryName: {
    vi: string;
    en: string;
  };
  sections: StandardSectionDef[];
}

/**
 * Standard content structure requirements per blog category track.
 */
export const CATEGORY_STRUCTURE_DEFINITIONS: Record<string, CategoryStructureDef> = {
  'architecture-system-design': {
    categoryId: 'architecture-system-design',
    categoryName: {
      vi: 'System Design & Architecture',
      en: 'System Design & Architecture',
    },
    sections: [
      {
        id: 'context-problem',
        order: 1,
        title: {
          vi: 'Bối cảnh & Vấn đề',
          en: 'Context & Problem Statement',
        },
        keywords: {
          vi: ['bối cảnh', 'vấn đề', 'thách thức'],
          en: ['context', 'problem', 'background', 'challenge'],
        },
      },
      {
        id: 'system-requirements',
        order: 2,
        title: {
          vi: 'Yêu cầu hệ thống',
          en: 'System Requirements',
        },
        keywords: {
          vi: ['yêu cầu hệ thống', 'yêu cầu chức năng', 'yêu cầu phi chức năng'],
          en: ['system requirements', 'requirements', 'functional requirements'],
        },
      },
      {
        id: 'architecture-design',
        order: 3,
        title: {
          vi: 'Thiết kế kiến trúc',
          en: 'Architecture Design',
        },
        keywords: {
          vi: ['thiết kế kiến trúc', 'kiến trúc hệ thống', 'mô hình kiến trúc'],
          en: ['architecture design', 'architecture', 'system architecture'],
        },
      },
      {
        id: 'trade-offs-analysis',
        order: 4,
        title: {
          vi: 'Phân tích đánh đổi',
          en: 'Trade-offs Analysis',
        },
        keywords: {
          vi: ['phân tích đánh đổi', 'đánh đổi', 'trade-off', 'trade-offs'],
          en: ['trade-offs', 'trade-off', 'tradeoffs analysis', 'trade-offs analysis'],
        },
      },
      {
        id: 'lessons-best-practices',
        order: 5,
        title: {
          vi: 'Bài học thực tế & Best Practices',
          en: 'Real-World Lessons & Best Practices',
        },
        keywords: {
          vi: ['bài học thực tế', 'best practices', 'kinh nghiệm thực tế', 'bài học'],
          en: ['lessons', 'best practices', 'real-world lessons', 'practical lessons'],
        },
      },
    ],
  },
  'data-engineering-analytics': {
    categoryId: 'data-engineering-analytics',
    categoryName: {
      vi: 'Data Engineering & Analytics',
      en: 'Data Engineering & Analytics',
    },
    sections: [
      {
        id: 'business-data-requirements',
        order: 1,
        title: {
          vi: 'Đề bài kinh doanh / Yêu cầu dữ liệu',
          en: 'Business Context & Data Requirements',
        },
        keywords: {
          vi: ['đề bài kinh doanh', 'yêu cầu dữ liệu', 'bối cảnh kinh doanh'],
          en: ['business context', 'data requirements', 'business requirements'],
        },
      },
      {
        id: 'data-modeling',
        order: 2,
        title: {
          vi: 'Mô hình hóa dữ liệu',
          en: 'Data Modeling & Schema Design',
        },
        keywords: {
          vi: ['mô hình hóa dữ liệu', 'mô hình dữ liệu', 'schema'],
          en: ['data modeling', 'schema design', 'data model'],
        },
      },
      {
        id: 'pipeline-construction',
        order: 3,
        title: {
          vi: 'Xây dựng Pipeline / Script xử lý',
          en: 'Pipeline Construction & Processing Logic',
        },
        keywords: {
          vi: ['xây dựng pipeline', 'pipeline', 'script xử lý', 'luồng xử lý'],
          en: ['pipeline construction', 'pipeline', 'processing logic'],
        },
      },
      {
        id: 'testing-optimization',
        order: 4,
        title: {
          vi: 'Kiểm thử dữ liệu & Tối ưu hiệu năng',
          en: 'Data Validation & Performance Tuning',
        },
        keywords: {
          vi: ['kiểm thử dữ liệu', 'tối ưu hiệu năng', 'tối ưu hóa'],
          en: ['data validation', 'performance tuning', 'testing', 'optimization'],
        },
      },
      {
        id: 'summary-recommendations',
        order: 5,
        title: {
          vi: 'Tổng kết & Khuyến nghị',
          en: 'Summary & Recommendations',
        },
        keywords: {
          vi: ['tổng kết', 'khuyến nghị', 'kết luận'],
          en: ['summary', 'recommendations', 'conclusion'],
        },
      },
    ],
  },
  'devops-cloud-tooling': {
    categoryId: 'devops-cloud-tooling',
    categoryName: {
      vi: 'DevOps, Infra & Tooling',
      en: 'DevOps, Infra & Tooling',
    },
    sections: [
      {
        id: 'article-objectives',
        order: 1,
        title: {
          vi: 'Mục tiêu bài viết',
          en: 'Article Objectives & Motivation',
        },
        keywords: {
          vi: ['mục tiêu bài viết', 'mục tiêu', 'đặt vấn đề'],
          en: ['article objectives', 'objectives', 'goals', 'motivation'],
        },
      },
      {
        id: 'architecture-principles',
        order: 2,
        title: {
          vi: 'Kiến trúc / Nguyên lý hoạt động',
          en: 'Architecture & Core Principles',
        },
        keywords: {
          vi: ['kiến trúc', 'nguyên lý hoạt động', 'nguyên lý'],
          en: ['architecture', 'core principles', 'principles', 'mechanism'],
        },
      },
      {
        id: 'step-by-step-setup',
        order: 3,
        title: {
          vi: 'Từng bước thiết lập',
          en: 'Step-by-Step Setup & Implementation',
        },
        keywords: {
          vi: ['từng bước thiết lập', 'các bước thiết lập', 'cài đặt', 'triển khai'],
          en: ['step-by-step', 'setup', 'implementation', 'step-by-step setup'],
        },
      },
      {
        id: 'troubleshooting-pitfalls',
        order: 4,
        title: {
          vi: 'Troubleshooting & Common Pitfalls',
          en: 'Troubleshooting & Common Pitfalls',
        },
        keywords: {
          vi: ['troubleshooting', 'common pitfalls', 'lỗi thường gặp', 'xử lý sự cố'],
          en: ['troubleshooting', 'common pitfalls', 'pitfalls', 'debugging'],
        },
      },
      {
        id: 'evaluation-scaling',
        order: 5,
        title: {
          vi: 'Đánh giá & Mở rộng',
          en: 'Evaluation & Future Scaling',
        },
        keywords: {
          vi: ['đánh giá', 'mở rộng', 'kết luận & mở rộng'],
          en: ['evaluation', 'future scaling', 'scaling', 'assessment'],
        },
      },
    ],
  },
  'code-craftsmanship-languages': {
    categoryId: 'code-craftsmanship-languages',
    categoryName: {
      vi: 'Algorithms & Data Structures',
      en: 'Algorithms & Data Structures',
    },
    sections: [
      {
        id: 'problem-statement',
        order: 1,
        title: {
          vi: 'Mô tả bài toán',
          en: 'Problem Statement & Objectives',
        },
        keywords: {
          vi: ['mô tả bài toán', 'bài toán', 'đề bài'],
          en: ['problem statement', 'problem', 'challenge'],
        },
      },
      {
        id: 'initial-approach',
        order: 2,
        title: {
          vi: 'Ý tưởng tiếp cận ban đầu',
          en: 'Initial Naive Approach',
        },
        keywords: {
          vi: ['ý tưởng tiếp cận ban đầu', 'tiếp cận ban đầu', 'tiếp cận sơ khởi'],
          en: ['initial approach', 'naive approach', 'initial idea'],
        },
      },
      {
        id: 'optimization-thinking',
        order: 3,
        title: {
          vi: 'Tư duy tối ưu hóa',
          en: 'Optimization Thinking',
        },
        keywords: {
          vi: ['tư duy tối ưu hóa', 'tối ưu hóa', 'tối ưu'],
          en: ['optimization thinking', 'optimization', 'optimizing'],
        },
      },
      {
        id: 'code-implementation',
        order: 4,
        title: {
          vi: 'Triển khai Code',
          en: 'Code Implementation',
        },
        keywords: {
          vi: ['triển khai code', 'mã nguồn', 'triển khai'],
          en: ['code implementation', 'implementation', 'code'],
        },
      },
      {
        id: 'complexity-applications',
        order: 5,
        title: {
          vi: 'Phân tích độ phức tạp & Ứng dụng',
          en: 'Complexity Analysis & Real-World Applications',
        },
        keywords: {
          vi: ['phân tích độ phức tạp', 'độ phức tạp', 'ứng dụng'],
          en: ['complexity analysis', 'complexity', 'applications', 'real-world applications'],
        },
      },
    ],
  },
  'tech-radar-career-insights': {
    categoryId: 'tech-radar-career-insights',
    categoryName: {
      vi: 'Languages, Tech Radar & Career',
      en: 'Languages, Tech Radar & Career',
    },
    sections: [
      {
        id: 'introduction',
        order: 1,
        title: {
          vi: 'Mở đầu',
          en: 'Introduction & Perspective',
        },
        keywords: {
          vi: ['mở đầu', 'giới thiệu', 'đặt vấn đề'],
          en: ['introduction', 'perspective', 'overview'],
        },
      },
      {
        id: 'multi-dimensional-evaluation',
        order: 2,
        title: {
          vi: 'So sánh / Đánh giá đa chiều',
          en: 'Multi-Dimensional Evaluation & Comparison',
        },
        keywords: {
          vi: ['so sánh', 'đánh giá đa chiều', 'đánh giá'],
          en: ['multi-dimensional evaluation', 'comparison', 'evaluation', 'analysis'],
        },
      },
      {
        id: 'case-study-experience',
        order: 3,
        title: {
          vi: 'Case Study / Trải nghiệm thực tế',
          en: 'Case Study & Practical Lessons',
        },
        keywords: {
          vi: ['case study', 'trải nghiệm thực tế', 'bài học thực tế'],
          en: ['case study', 'practical lessons', 'real-world experience', 'experience'],
        },
      },
      {
        id: 'actionable-recommendations',
        order: 4,
        title: {
          vi: 'Gợi ý hành động',
          en: 'Actionable Recommendations',
        },
        keywords: {
          vi: ['gợi ý hành động', 'hành động', 'khuyến nghị', 'roadmap'],
          en: ['actionable recommendations', 'actionable advice', 'recommendations', 'roadmap'],
        },
      },
      {
        id: 'open-questions-discussion',
        order: 5,
        title: {
          vi: 'Câu hỏi mở, thảo luận',
          en: 'Open Questions & Discussion',
        },
        keywords: {
          vi: ['câu hỏi mở', 'thảo luận', 'trao đổi'],
          en: ['open questions', 'discussion', 'takeaways'],
        },
      },
    ],
  },
};

/**
 * Validates whether an article adheres strictly to the category's standard 5-section structure.
 */
export function validateBlogPostStructure(
  post: BlogPost | (Omit<BlogPost, 'contentHtml'> & { contentHtml?: string }),
  lang: 'vi' | 'en' = 'vi'
): { isValid: boolean; missingSections: string[]; foundSections: string[]; errors: string[] } {
  const categoryId = post.category || '';
  const structure = categoryId ? CATEGORY_STRUCTURE_DEFINITIONS[categoryId] : undefined;
  if (!structure) {
    return {
      isValid: false,
      missingSections: [],
      foundSections: [],
      errors: [`Unknown or missing category ID: "${post.category}" on post "${post.id}"`],
    };
  }

  const errors: string[] = [];
  const missingSections: string[] = [];
  const foundSections: string[] = [];

  // 1. If post has structured sections dictionary { "key": "<html content>" }, validate directly
  if (post.sections && typeof post.sections === 'object' && !Array.isArray(post.sections)) {
    const presentKeys = Object.keys(post.sections);
    const expectedKeys = structure.sections.map((s) => s.id);

    // Check for unexpected extra keys
    presentKeys.forEach((key) => {
      if (!expectedKeys.includes(key)) {
        errors.push(`Post "${post.id}" has unexpected section key "${key}"`);
      }
    });

    structure.sections.forEach((defSec: StandardSectionDef) => {
      const content = post.sections ? post.sections[defSec.id] : undefined;
      if (content === undefined) {
        missingSections.push(defSec.title[lang]);
        errors.push(
          `Post "${post.id}" is missing required section "${defSec.id}" (${defSec.title[lang]})`
        );
        return;
      }

      if (typeof content !== 'string' || content.trim().length === 0) {
        errors.push(`Post "${post.id}" has empty content for section "${defSec.id}"`);
      }

      foundSections.push(defSec.title[lang]);
    });

    return {
      isValid: errors.length === 0,
      missingSections,
      foundSections,
      errors,
    };
  }

  // 2. Fallback to HTML content matching if sections array is not provided
  const content = post.contentHtml || '';
  structure.sections.forEach((sec: StandardSectionDef) => {
    const requiredTitle = sec.title[lang];
    const keywords: string[] = sec.keywords[lang] || [];

    const titleRegex = new RegExp(
      `<h[1-6][^>]*>.*?(?:${requiredTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${keywords.map((k: string) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}).*?<\\/h[1-6]>`,
      'i'
    );

    if (titleRegex.test(content)) {
      foundSections.push(requiredTitle);
    } else {
      missingSections.push(requiredTitle);
      errors.push(`Post "${post.id}" in category "${post.category}" is missing section #${sec.order}: "${requiredTitle}"`);
    }
  });

  return {
    isValid: missingSections.length === 0 && errors.length === 0,
    missingSections,
    foundSections,
    errors,
  };
}
