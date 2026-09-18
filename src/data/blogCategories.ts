export interface BlogCategoryDef {
  id: string;
  dayCode: 'ALL' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  scheduleDay: {
    vi: string;
    en: string;
  };
  scheduleFull: {
    vi: string;
    en: string;
  };
  title: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  iconName: string;
}

export const BLOG_CATEGORY_DEFINITIONS: BlogCategoryDef[] = [
  {
    id: 'all',
    dayCode: 'ALL',
    scheduleDay: {
      vi: 'T2 - T6',
      en: 'Mon - Fri',
    },
    scheduleFull: {
      vi: 'Thứ 2 – Thứ 6 hàng tuần',
      en: 'Every weekday (Mon - Fri)',
    },
    title: {
      vi: 'Tất cả chuyên đề',
      en: 'All Topics & Categories',
    },
    description: {
      vi: 'Tổng hợp toàn bộ các bài viết ghi chép kiến trúc, kỹ thuật và bài học kinh nghiệm.',
      en: 'Complete collection of system architecture notes, engineering insights, and technical articles.',
    },
    iconName: 'BookOpenIcon',
  },
  {
    id: 'architecture-system-design',
    dayCode: 'MON',
    scheduleDay: {
      vi: 'Thứ 2',
      en: 'Mon',
    },
    scheduleFull: {
      vi: 'Thứ 2 hàng tuần',
      en: 'Every Monday',
    },
    title: {
      vi: 'Architecture & System Design',
      en: 'Architecture & System Design',
    },
    description: {
      vi: 'Các bài viết về clean architecture, tối ưu hệ thống và thiết kế hệ thống phân tán chịu tải cao.',
      en: 'Clean architecture, high-throughput system design, scalability, and distributed systems optimization.',
    },
    iconName: 'LayersIcon',
  },
  {
    id: 'data-engineering-analytics',
    dayCode: 'TUE',
    scheduleDay: {
      vi: 'Thứ 3',
      en: 'Tue',
    },
    scheduleFull: {
      vi: 'Thứ 3 hàng tuần',
      en: 'Every Tuesday',
    },
    title: {
      vi: 'Data Engineering & Analytics',
      en: 'Data Engineering & Analytics',
    },
    description: {
      vi: 'Các bài viết tổ chức CSDL, tối ưu query, Change Data Capture (CDC), Data Pipeline và trực quan hoá dữ liệu.',
      en: 'Database modeling, query tuning, Change Data Capture (CDC), data pipelines, and analytics.',
    },
    iconName: 'DatabaseIcon',
  },
  {
    id: 'devops-cloud-tooling',
    dayCode: 'WED',
    scheduleDay: {
      vi: 'Thứ 4',
      en: 'Wed',
    },
    scheduleFull: {
      vi: 'Thứ 4 hàng tuần',
      en: 'Every Wednesday',
    },
    title: {
      vi: 'DevOps, Cloud & Tooling',
      en: 'DevOps, Cloud & Tooling',
    },
    description: {
      vi: 'Các bài viết về hạ tầng đám mây, Docker, Kubernetes, CI/CD tự động hoá và môi trường phát triển.',
      en: 'Cloud infrastructure, Docker, Kubernetes, CI/CD pipelines, and developer tooling.',
    },
    iconName: 'ServerIcon',
  },
  {
    id: 'code-craftsmanship-languages',
    dayCode: 'THU',
    scheduleDay: {
      vi: 'Thứ 5',
      en: 'Thu',
    },
    scheduleFull: {
      vi: 'Thứ 5 hàng tuần',
      en: 'Every Thursday',
    },
    title: {
      vi: 'Code Craftsmanship & Languages',
      en: 'Code Craftsmanship & Languages',
    },
    description: {
      vi: 'Các bài viết về thuật toán, ngôn ngữ lập trình (Go, Java, TS/Rust), framework và mẹo refactor code.',
      en: 'Algorithms, programming languages (Go, Java, TS/Rust), frameworks, and clean code refactoring craftsmanship.',
    },
    iconName: 'CodeIcon',
  },
  {
    id: 'tech-radar-career-insights',
    dayCode: 'FRI',
    scheduleDay: {
      vi: 'Thứ 6',
      en: 'Fri',
    },
    scheduleFull: {
      vi: 'Thứ 6 hàng tuần',
      en: 'Every Friday',
    },
    title: {
      vi: 'Tech Radar & Career Insights',
      en: 'Tech Radar & Career Insights',
    },
    description: {
      vi: 'Các xu hướng công nghệ hiện tại, góc nhìn cá nhân, chia sẻ kinh nghiệm, trải nghiệm và những thứ khác ngoài công nghệ.',
      en: 'Emerging tech radar, engineering mindset, career experiences, and practical reflections beyond code.',
    },
    iconName: 'SparklesIcon',
  },
];
