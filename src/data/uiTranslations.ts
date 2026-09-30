export interface UITranslation {
  common: {
    more: string;
    resetFilters: string;
    shareLink: string;
    copiedLink: string;
    scrollToTop: string;
    exportPdf: string;
    articlesBadge: string;
    overview: string;
    tableOfContents: string;
    teamSize: string;
    featuredProject: string;
    currentPosition: string;
    credentialId: string;
    article: string;
    showingArticles: string;
  };
  drawer: {
    navigation: string;
    preferences: string;
    language: string;
    theme: string;
    switchToLight: string;
    switchToDark: string;
    footerNote: string;
  };
  nav: {
    about: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    blog: string;
    contact: string;
    saveCv: string;
  };
  hero: {
    greeting: string;
    viewProjects: string;
    getInTouch: string;
    saveCv: string;
    workingTreeClean: string;
    focusPrompt: string;
  };
  about: {
    badge: string;
    title: string;
  };
  experience: {
    badge: string;
    title: string;
    subtitle: string;
    technologies: string;
    currentPosition: string;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    allWorks: string;
    caseStudies: string;
    githubRepos: string;
    viewArchitecture: string;
    sourceCode: string;
    demo: string;
    publicRepo: string;
    enterpriseSystem: string;
    featuredProject: string;
    team: string;
    objective: string;
    responsibilities: string;
    challengesSolutions: string;
    achievements: string;
    techStack: string;
    challenges: string;
    fullStack: string;
    challengeLabel: string;
    solutionLabel: string;
    closeModal: string;
    noProjects: string;
    resetFilters: string;
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    legendTitle: string;
    all?: string;
    level5: string;
    level4: string;
    level3: string;
    level2: string;
    level1: string;
    noSkills?: string;
  };
  education: {
    badge: string;
    title: string;
    subtitle: string;
    academicBg: string;
    certificationsTitle: string;
    viewCredential: string;
    credentialId: string;
  };
  blog: {
    title: string;
    subtitle: string;
    readArticle: string;
    closeArticle: string;
    backToHome: string;
    searchPlaceholder: string;
    allTopics: string;
    categoriesTitle?: string;
    categoriesSubtitle?: string;
    tagsTitle?: string;
    scheduleWeekly?: string;
    trackObjective?: string;
    filterByCategory?: string;
    filterByTag?: string;
    clearAll?: string;
    activeFilters?: string;
    noArticlesFound: string;
    article: string;
    showingArticles: string;
    resetFilters: string;
    loadMoreArticles?: string;
    loadingMore?: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailHint: string;
    phoneLabel: string;
    phoneHint: string;
    locationLabel: string;
    locationHint: string;
    locationCta: string;
    linkedinLabel: string;
    linkedinHint: string;
    copied: string;
    compose: string;
    call: string;
    zalo: string;
    callZalo: string;
    viewProfile: string;
  };
  footer: {
    hostedOn: string;
    allRightsReserved: string;
  };
  printCv: {
    summaryHeading: string;
    skillsHeading: string;
    experienceHeading: string;
    technologies: string;
    projectsHeading: string;
    keyTechnologies: string;
    educationHeading: string;
    academicBackground: string;
    certificationsAndBadges: string;
  };
}

export const uiTranslations: Record<'en' | 'vi', UITranslation> = {
  vi: {
    common: {
      more: 'khác',
      resetFilters: 'Đặt lại bộ lọc',
      shareLink: 'Chia sẻ / Sao chép liên kết',
      copiedLink: 'Đã sao chép liên kết!',
      scrollToTop: 'Cuộn lên đầu trang',
      exportPdf: 'Tải / Xuất CV dạng PDF',
      articlesBadge: 'Bài viết',
      overview: 'Tổng quan',
      tableOfContents: 'Mục lục bài viết',
      teamSize: 'Quy mô',
      featuredProject: 'Dự án Tiêu biểu',
      currentPosition: 'Vị trí hiện tại',
      credentialId: 'Mã chứng chỉ',
      article: 'Bài viết',
      showingArticles: 'Hiển thị {count} trên tổng số {total} bài viết',
    },
    drawer: {
      navigation: 'ĐIỀU HƯỚNG',
      preferences: 'TÙY CHỌN & TIỆN ÍCH',
      language: 'Ngôn ngữ:',
      theme: 'Giao diện:',
      switchToLight: 'Chuyển sang Giao diện Sáng',
      switchToDark: 'Chuyển sang Giao diện Tối',
      footerNote: 'Hồ sơ Kỹ sư Phần mềm',
    },
    nav: {
      about: 'Giới thiệu',
      experience: 'Kinh nghiệm',
      projects: 'Dự án',
      skills: 'Kỹ năng',
      education: 'Học vấn',
      blog: 'Bài viết',
      contact: 'Liên hệ',
      saveCv: 'Lưu CV',
    },
    hero: {
      greeting: 'Xin chào, tôi là',
      viewProjects: 'Xem dự án nổi bật',
      getInTouch: 'Liên hệ ngay',
      saveCv: 'Lưu CV',
      workingTreeClean: 'Mã nguồn sẵn sàng cho môi trường Production',
      focusPrompt: '$ định_hướng = "Hệ thống Phân tán & Dữ liệu"',
    },
    about: {
      badge: 'Về bản thân',
      title: 'Triết lý Kỹ thuật & Năng lực Cốt lõi',
    },
    experience: {
      badge: 'Lộ trình Nghề nghiệp',
      title: 'Kinh nghiệm Làm việc Chuyên nghiệp',
      subtitle: 'Hành trình dẫn dắt kỹ thuật, thiết kế kiến trúc backend mở rộng và xây dựng các hệ thống dữ liệu doanh nghiệp.',
      technologies: 'Công nghệ sử dụng:',
      currentPosition: 'Vị trí hiện tại',
    },
    projects: {
      badge: 'Dự án & Mã nguồn',
      title: 'Dự án Kỹ thuật Tiêu biểu',
      subtitle: 'Phân tích kiến trúc chuyên sâu các hệ thống doanh nghiệp và các kho mã nguồn mở nạp trực tiếp từ GitHub.',
      allWorks: 'Tất cả dự án',
      caseStudies: 'Kiến trúc Doanh nghiệp',
      githubRepos: 'Kho mã nguồn GitHub',
      viewArchitecture: 'Xem kiến trúc',
      sourceCode: 'Mã nguồn',
      demo: 'Bản thử nghiệm',
      publicRepo: 'Public Repo',
      enterpriseSystem: 'Hệ thống Doanh nghiệp',
      featuredProject: 'Dự án Tiêu biểu',
      team: 'Quy mô',
      objective: 'Mục tiêu Dự án (Project Objective)',
      responsibilities: 'Trách nhiệm chính & Thế mạnh (Key Responsibilities & Strengths)',
      challengesSolutions: 'Thách thức & Giải pháp (Challenges & Solutions)',
      achievements: 'Thành tựu & Kết quả định lượng (Achievements)',
      techStack: 'Ngăn xếp công nghệ (Tech Stack)',
      challenges: 'Thách thức Kỹ thuật & Giải pháp Thực thi',
      fullStack: 'Toàn bộ Ngăn xếp Công nghệ',
      challengeLabel: 'Thách thức',
      solutionLabel: 'Giải pháp',
      closeModal: 'Đóng chi tiết',
      noProjects: 'Không tìm thấy dự án phù hợp.',
      resetFilters: 'Đặt lại bộ lọc',
    },
    skills: {
      badge: 'Ma trận Kỹ năng',
      title: 'Kỹ năng & Công nghệ',
      subtitle: 'Tập hợp toàn diện các kỹ năng từ phát triển Backend phân tán, nền tảng Dữ liệu hiện đại đến Hạ tầng đám mây.',
      legendTitle: 'Thang điểm Thành thạo',
      all: 'Tất cả',
      level5: 'Chuyên gia',
      level4: 'Nâng cao',
      level3: 'Thành thạo',
      level2: 'Tiếp cận',
      level1: 'Cơ bản',
      noSkills: 'Không có kỹ năng ở cấp độ này trong danh mục.',
    },
    education: {
      badge: 'Bằng cấp & Chứng chỉ',
      title: 'Học vấn & Chứng chỉ Chuyên môn',
      subtitle: 'Nền tảng Khoa học Máy tính vững chắc, tư duy sư phạm khúc chiết và tinh thần liên tục trau dồi chứng chỉ quốc tế.',
      academicBg: 'Nền tảng Học vấn',
      certificationsTitle: 'Chứng chỉ Chuyên môn Quốc tế & Doanh nghiệp',
      viewCredential: 'Xem chứng chỉ',
      credentialId: 'Mã chứng chỉ',
    },
    blog: {
      title: 'Ghi chép Kỹ thuật & Kiến trúc Hệ thống',
      subtitle: 'Daily articles to build knowledge and experience',
      readArticle: 'Đọc toàn bộ bài viết',
      closeArticle: 'Đóng bài viết',
      backToHome: 'Về trang Portfolio & CV',
      searchPlaceholder: 'Tìm kiếm bài viết theo tiêu đề, thẻ, từ khóa...',
      allTopics: 'Tất cả Thẻ & Từ khoá',
      categoriesTitle: 'Chuyên đề',
      categoriesSubtitle: 'Lịch phát hành Thứ 2 – Thứ 6',
      tagsTitle: 'Thẻ & Từ khoá',
      scheduleWeekly: 'Lịch đăng',
      trackObjective: 'Mục tiêu chuyên đề',
      filterByCategory: 'Chuyên đề',
      filterByTag: 'Thẻ',
      clearAll: 'Xóa bộ lọc',
      activeFilters: 'Đang lọc theo',
      noArticlesFound: 'Không tìm thấy bài viết nào phù hợp với tìm kiếm hoặc bộ lọc.',
      article: 'Bài viết',
      showingArticles: 'Hiển thị {count} trên tổng số {total} bài viết',
      resetFilters: 'Đặt lại bộ lọc',
      loadMoreArticles: 'Tải thêm bài viết',
      loadingMore: 'Đang tải dữ liệu...',
    },
    contact: {
      badge: 'Kết nối & Hợp tác',
      title: 'Sẵn sàng Xây dựng Hệ thống Quy mô lớn',
      subtitle: 'Mở rộng cơ hội hợp tác cho các vị trí Senior Backend & Data Engineer, Technical Team Lead và tư vấn kiến trúc phần mềm.',
      emailLabel: 'Email Trực tiếp',
      emailHint: 'Kênh tốt nhất để thảo luận cơ hội nghề nghiệp, kỹ thuật & hợp tác dự án.',
      phoneLabel: 'Điện thoại & Zalo',
      phoneHint: 'Sẵn sàng tiếp nhận cuộc gọi trao đổi chuyên môn & nhắn tin nhanh qua Zalo.',
      locationLabel: 'Địa điểm & Ngày sinh',
      locationHint: 'Làm việc Linh hoạt (Hybrid) / Trực tiếp tại TP.HCM & Remote toàn cầu.',
      locationCta: 'Văn phòng / Từ xa / Linh hoạt',
      linkedinLabel: 'Hồ sơ LinkedIn',
      linkedinHint: 'Kết nối mạng lưới nghề nghiệp và tham khảo đánh giá năng lực.',
      copied: 'Đã sao chép!',
      compose: 'Soạn thư',
      call: 'Gọi điện',
      zalo: 'Nhắn Zalo',
      callZalo: 'Gọi / Zalo',
      viewProfile: 'Xem hồ sơ',
    },
    footer: {
      hostedOn: 'Lưu trữ trên GitHub Pages',
      allRightsReserved: 'Đã đăng ký bản quyền',
    },
    printCv: {
      summaryHeading: 'TÓM TẮT NĂNG LỰC CHUYÊN MÔN',
      skillsHeading: 'KỸ NĂNG CHUYÊN MÔN CỐT LÕI',
      experienceHeading: 'KINH NGHIỆM LÀM VIỆC',
      technologies: 'Công nghệ:',
      projectsHeading: 'DỰ ÁN KIẾN TRÚC DOANH NGHIỆP TIÊU BIỂU',
      keyTechnologies: 'Công nghệ chính:',
      educationHeading: 'HỌC VẤN & CHỨNG CHỈ CHUYÊN MÔN',
      academicBackground: 'Nền tảng học vấn:',
      certificationsAndBadges: 'Chứng chỉ chuyên môn & Huy hiệu:',
    },
  },
  en: {
    common: {
      more: 'more',
      resetFilters: 'Reset filters',
      shareLink: 'Share / Copy Link',
      copiedLink: 'Copied Link!',
      scrollToTop: 'Scroll to top',
      exportPdf: 'Save / Export CV as PDF',
      articlesBadge: 'Articles',
      overview: 'Overview',
      tableOfContents: 'Table of Contents',
      teamSize: 'Team',
      featuredProject: 'Featured Project',
      currentPosition: 'Current Position',
      credentialId: 'Credential ID',
      article: 'Article',
      showingArticles: 'Showing {count} of {total} articles',
    },
    drawer: {
      navigation: 'NAVIGATION',
      preferences: 'PREFERENCES & ACTIONS',
      language: 'Language:',
      theme: 'Theme Mode:',
      switchToLight: 'Switch to Light Mode',
      switchToDark: 'Switch to Dark Mode',
      footerNote: 'Engineering Portfolio',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      blog: 'Blog',
      contact: 'Contact',
      saveCv: 'Save CV',
    },
    hero: {
      greeting: "Hi, I'm",
      viewProjects: 'View Featured Projects',
      getInTouch: 'Get In Touch',
      saveCv: 'Save CV',
      workingTreeClean: 'Working tree clean (production ready)',
      focusPrompt: '$ focus = "Distributed Systems & Data"',
    },
    about: {
      badge: 'About Me',
      title: 'Engineering Excellence & Philosophy',
    },
    experience: {
      badge: 'Career Path',
      title: 'Professional Experience',
      subtitle: 'A timeline of engineering leadership, scalable backend architectures, and high-impact data systems.',
      technologies: 'Technologies:',
      currentPosition: 'Current Position',
    },
    projects: {
      badge: 'Portfolio & Repositories',
      title: 'Featured Engineering Projects',
      subtitle: 'Enterprise architecture deep-dives and public open-source repositories loaded live from GitHub.',
      allWorks: 'All Works',
      caseStudies: 'Architecture Case Studies',
      githubRepos: 'GitHub Repositories',
      viewArchitecture: 'View Architecture',
      sourceCode: 'Source Code',
      demo: 'Demo',
      publicRepo: 'Public Repo',
      enterpriseSystem: 'Enterprise System',
      featuredProject: 'Featured Project',
      team: 'Team',
      objective: 'Project Objective',
      responsibilities: 'Key Responsibilities & Strengths',
      challengesSolutions: 'Challenges & Solutions',
      achievements: 'Key Achievements & Metrics',
      techStack: 'Technology Stack',
      challenges: 'Key Engineering Challenges & Technical Solutions',
      fullStack: 'Full Technology Stack',
      challengeLabel: 'Challenge',
      solutionLabel: 'Solution',
      closeModal: 'Close Case Study',
      noProjects: 'No projects found.',
      resetFilters: 'Reset Filters',
    },
    skills: {
      badge: 'Skills Matrix',
      title: 'Skills & Technologies',
      subtitle: 'Comprehensive technical toolkit spanning distributed backend engineering, modern data platforms, and cloud infrastructure.',
      legendTitle: 'Proficiency Scale',
      all: 'All',
      level5: 'Expert',
      level4: 'Advanced',
      level3: 'Proficient',
      level2: 'Familiar',
      level1: 'Fundamental',
      noSkills: 'No skills at this level in this category.',
    },
    education: {
      badge: 'Credentials',
      title: 'Academic Education & Certifications',
      subtitle: 'Formal computer science fundamentals, pedagogical communication edge, and continuous professional accreditations.',
      academicBg: 'Academic Background',
      certificationsTitle: 'Professional Certifications & Accreditations',
      viewCredential: 'View Credential',
      credentialId: 'Credential ID',
    },
    blog: {
      title: 'System Architecture & Engineering Notes',
      subtitle: 'Technical writings on Change Data Capture, event-driven microservices, database performance, and distributed systems.',
      readArticle: 'Read Full Article',
      closeArticle: 'Close Article',
      backToHome: 'Back to Portfolio & CV',
      searchPlaceholder: 'Search articles by title, tags, or keywords...',
      allTopics: 'All Topics',
      categoriesTitle: 'Topics',
      categoriesSubtitle: 'Monday to Friday Publishing',
      tagsTitle: 'Tags & Keywords',
      scheduleWeekly: 'Schedule',
      trackObjective: 'Track Objectives',
      filterByCategory: 'Category',
      filterByTag: 'Tag',
      clearAll: 'Clear Filters',
      activeFilters: 'Active Filters',
      noArticlesFound: 'No engineering articles match your search or filter.',
      article: 'Article',
      showingArticles: 'Showing {count} of {total} articles',
      resetFilters: 'Reset filters',
      loadMoreArticles: 'Load more articles',
      loadingMore: 'Loading archives...',
    },
    contact: {
      badge: 'Get In Touch',
      title: "Let's Build Something Scalable Together",
      subtitle: 'Open for Senior Backend & Data Engineering roles, Technical Lead opportunities, and high-impact architectural consulting.',
      emailLabel: 'Direct Email',
      emailHint: 'Best for engineering opportunities, technical discussions & consulting.',
      phoneLabel: 'Phone & Zalo',
      phoneHint: 'Available for calls, direct technical screening & instant messaging.',
      locationLabel: 'Location',
      locationHint: 'Open for Hybrid / Onsite in Ho Chi Minh City & Remote worldwide.',
      locationCta: 'Onsite / Hybrid / Remote',
      linkedinLabel: 'LinkedIn Profile',
      linkedinHint: 'Connect for professional networking & career endorsements.',
      copied: 'Copied!',
      compose: 'Compose',
      call: 'Call',
      zalo: 'Chat Zalo',
      callZalo: 'Call / Zalo',
      viewProfile: 'View Profile',
    },
    footer: {
      hostedOn: 'Hosted on GitHub Pages',
      allRightsReserved: 'All rights reserved',
    },
    printCv: {
      summaryHeading: 'PROFESSIONAL SUMMARY',
      skillsHeading: 'CORE TECHNICAL SKILLS',
      experienceHeading: 'PROFESSIONAL EXPERIENCE',
      technologies: 'Technologies:',
      projectsHeading: 'FEATURED ENGINEERING ARCHITECTURE CASE STUDIES',
      keyTechnologies: 'Key Technologies:',
      educationHeading: 'EDUCATION & CERTIFICATIONS',
      academicBackground: 'Academic Background:',
      certificationsAndBadges: 'Professional Certifications & Badges:',
    },
  },
};
