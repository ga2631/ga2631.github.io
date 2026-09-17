import { CVData } from '../types/index.ts';

export interface UITranslation {
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
    principles: { title: string; description: string }[];
  };
  experience: {
    badge: string;
    title: string;
    subtitle: string;
    technologies: string;
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
    objective: string;
    challenges: string;
    fullStack: string;
    closeModal: string;
    noProjects: string;
    resetFilters: string;
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    expert: string;
    advanced: string;
    proficient: string;
  };
  education: {
    badge: string;
    title: string;
    subtitle: string;
    academicBg: string;
    certificationsTitle: string;
    viewCredential: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
    readArticle: string;
    closeArticle: string;
    backToHome: string;
    searchPlaceholder: string;
    allTopics: string;
    noArticlesFound: string;
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
    linkedinLabel: string;
    linkedinHint: string;
    copied: string;
    copyEmail: string;
    compose: string;
    callZalo: string;
    viewProfile: string;
  };
  footer: {
    hostedOn: string;
  };
}

export const uiTranslations: Record<'en' | 'vi', UITranslation> = {
  en: {
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
      workingTreeClean: '✔ Working tree clean (production ready)',
      focusPrompt: '$ focus = "Distributed Systems & Data"',
    },
    about: {
      badge: 'About Me',
      title: 'Engineering Excellence & Philosophy',
      principles: [
        {
          title: 'Architectural Resilience',
          description: 'Designing modular microservices and event-driven architectures with high availability, fault tolerance, and low latency.',
        },
        {
          title: 'Type Safety & Clean Code',
          description: 'Leveraging modern TypeScript, Golang, and domain-driven design to ensure maintainability, high test coverage, and robust data contracts.',
        },
        {
          title: 'DevOps & Automation',
          description: 'Automating multi-stage Docker containerization and CI/CD pipelines for reliable, zero-downtime deployment workflows.',
        },
        {
          title: 'Data & Performance Driven',
          description: 'Optimizing high-throughput CDC streaming pipelines, reducing query bottlenecks, and delivering sub-second analytic insights.',
        },
      ],
    },
    experience: {
      badge: 'Career Path',
      title: 'Professional Experience',
      subtitle: 'A timeline of engineering leadership, scalable backend architectures, and high-impact data systems.',
      technologies: 'Technologies:',
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
      objective: '🎯 Project Objective',
      challenges: '⚡ Key Engineering Challenges & Technical Solutions',
      fullStack: '🛠️ Full Technology Stack',
      closeModal: 'Close Case Study',
      noProjects: 'No projects found.',
      resetFilters: 'Reset Filters',
    },
    skills: {
      badge: 'Skills Matrix',
      title: 'Skills & Technologies',
      subtitle: 'Comprehensive technical toolkit spanning distributed backend engineering, modern data platforms, and cloud infrastructure.',
      expert: 'Expert',
      advanced: 'Advanced',
      proficient: 'Proficient',
    },
    education: {
      badge: 'Credentials',
      title: 'Academic Education & Certifications',
      subtitle: 'Formal computer science fundamentals, pedagogical communication edge, and continuous professional accreditations.',
      academicBg: 'Academic Background',
      certificationsTitle: 'Professional Certifications & Accreditations',
      viewCredential: 'View Credential',
    },
    blog: {
      badge: 'Technical Insights & Engineering Blog',
      title: 'Architecture Deep Dives & System Notes',
      subtitle: 'Technical writings on Change Data Capture, event-driven microservices, database performance, and distributed systems.',
      readArticle: 'Read Full Article',
      closeArticle: 'Close Article',
      backToHome: 'Back to Portfolio & CV',
      searchPlaceholder: 'Search articles by title, tags, or keywords...',
      allTopics: 'All Topics',
      noArticlesFound: 'No engineering articles match your search or filter.',
    },
    contact: {
      badge: 'Get In Touch',
      title: "Let's Build Something Scalable Together",
      subtitle: 'Open for Senior Backend & Data Engineering roles, Technical Lead opportunities, and high-impact architectural consulting.',
      emailLabel: 'Direct Email',
      emailHint: 'Best for engineering opportunities, technical discussions & consulting.',
      phoneLabel: 'Phone & Zalo',
      phoneHint: 'Available for calls, direct technical screening & instant messaging.',
      locationLabel: 'Location & Birthday',
      locationHint: 'Open for Hybrid / Onsite in Ho Chi Minh City & Remote worldwide.',
      linkedinLabel: 'LinkedIn Profile',
      linkedinHint: 'Connect for professional networking & career endorsements.',
      copied: 'Copied!',
      copyEmail: 'Copy Email',
      compose: 'Compose',
      callZalo: 'Call / Zalo',
      viewProfile: 'View Profile',
    },
    footer: {
      hostedOn: 'Hosted on GitHub Pages',
    },
  },
  vi: {
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
      workingTreeClean: '✔ Mã nguồn sẵn sàng cho môi trường Production',
      focusPrompt: '$ định_hướng = "Hệ thống Phân tán & Dữ liệu"',
    },
    about: {
      badge: 'Về bản thân',
      title: 'Triết lý Kỹ thuật & Năng lực Cốt lõi',
      principles: [
        {
          title: 'Kiến trúc Bền bỉ & Chịu tải',
          description: 'Thiết kế hệ thống microservices mô-đun hóa và kiến trúc hướng sự kiện (Event-Driven) với tính sẵn sàng cao, chịu lỗi tốt và độ trễ thấp.',
        },
        {
          title: 'An toàn Kiểu dữ liệu & Clean Code',
          description: 'Ứng dụng Golang, Java hiện đại và thiết kế hướng miền (DDD) nhằm đảm bảo tính bảo trì lâu dài, độ bao phủ kiểm thử cao và dữ liệu chuẩn mực.',
        },
        {
          title: 'Tự động hóa & DevOps',
          description: 'Tự động hóa đóng gói container Docker đa tầng và luồng CI/CD giúp quy trình triển khai phần mềm mượt mà, zero-downtime.',
        },
        {
          title: 'Tối ưu hóa Hiệu năng & Dữ liệu',
          description: 'Xây dựng luồng xử lý CDC thời gian thực, tối ưu hóa các điểm nghẽn truy vấn cơ sở dữ liệu và cung cấp báo cáo phân tích tức thì.',
        },
      ],
    },
    experience: {
      badge: 'Lộ trình Nghề nghiệp',
      title: 'Kinh nghiệm Làm việc Chuyên nghiệp',
      subtitle: 'Hành trình dẫn dắt kỹ thuật, thiết kế kiến trúc backend mở rộng và xây dựng các hệ thống dữ liệu doanh nghiệp.',
      technologies: 'Công nghệ sử dụng:',
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
      objective: '🎯 Mục tiêu Dự án',
      challenges: '⚡ Thách thức Kỹ thuật & Giải pháp Thực thi',
      fullStack: '🛠️ Toàn bộ Ngăn xếp Công nghệ',
      closeModal: 'Đóng chi tiết',
      noProjects: 'Không tìm thấy dự án phù hợp.',
      resetFilters: 'Đặt lại bộ lọc',
    },
    skills: {
      badge: 'Ma trận Kỹ năng',
      title: 'Kỹ năng & Công nghệ',
      subtitle: 'Tập hợp toàn diện các kỹ năng từ phát triển Backend phân tán, nền tảng Dữ liệu hiện đại đến Hạ tầng đám mây.',
      expert: 'Chuyên gia (Expert)',
      advanced: 'Nâng cao (Advanced)',
      proficient: 'Thành thạo (Proficient)',
    },
    education: {
      badge: 'Bằng cấp & Chứng chỉ',
      title: 'Học vấn & Chứng chỉ Chuyên môn',
      subtitle: 'Nền tảng Khoa học Máy tính vững chắc, tư duy sư phạm khúc chiết và tinh thần liên tục trau dồi chứng chỉ quốc tế.',
      academicBg: 'Nền tảng Học vấn',
      certificationsTitle: 'Chứng chỉ Chuyên môn Quốc tế & Doanh nghiệp',
      viewCredential: 'Xem chứng chỉ',
    },
    blog: {
      badge: 'Góc nhìn Kỹ thuật & Blog Kỹ sư',
      title: 'Kiến trúc Hệ thống & Ghi chép Kỹ thuật',
      subtitle: 'Các bài viết phân tích chuyên sâu về Change Data Capture, xử lý dòng sự kiện với Spring WebFlux, tối ưu hóa CSDL và tải cao.',
      readArticle: 'Đọc toàn bộ bài viết',
      closeArticle: 'Đóng bài viết',
      backToHome: 'Về trang Portfolio & CV',
      searchPlaceholder: 'Tìm kiếm bài viết theo tiêu đề, thẻ công nghệ, từ khóa...',
      allTopics: 'Tất cả chủ đề',
      noArticlesFound: 'Không tìm thấy bài viết nào phù hợp với tìm kiếm hoặc bộ lọc.',
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
      linkedinLabel: 'Hồ sơ LinkedIn',
      linkedinHint: 'Kết nối mạng lưới nghề nghiệp và tham khảo đánh giá năng lực.',
      copied: 'Đã sao chép!',
      copyEmail: 'Sao chép Email',
      compose: 'Soạn thư',
      callZalo: 'Gọi / Zalo',
      viewProfile: 'Xem hồ sơ',
    },
    footer: {
      hostedOn: 'Hosted on GitHub Pages',
    },
  },
};

export const cvDataEn: CVData = {
  personalInfo: {
    fullName: 'Tan Huynh Nhat',
    jobTitle: 'Polyglot Backend & Data Engineer | Technical Team Lead',
    tagline: 'Architecting Scalable Distributed Systems, Medallion Data Warehouses & High-Concurrency Pipelines',
    bio: 'Polyglot Backend & Data Engineer with 5+ years of experience architecting high-concurrency distributed systems and modern Data Warehouses. Strong technical ownership across Golang, Java (Spring Boot), Node.js, and Python — specializing in real-time CDC pipelines, database optimization, and scalable microservices.',
    email: 'tanhuynh2631@gmail.com',
    phone: '+84-963684520',
    location: 'Tan Khanh Ward, Ho Chi Minh City, Vietnam',
    birthday: '23 Nov 1999',
    availability: 'Open to work',
    githubUrl: 'https://github.com/ga2631',
    avatarUrl: 'https://github.com/ga2631.png',
    stats: [
      { label: 'Years Experience', value: '5+', subtext: 'Backend & Data Pipelines' },
      { label: 'Data Reconciliation', value: '96%', subtext: 'Zero Data Loss Migration' },
      { label: 'Query Performance', value: '70%+', subtext: 'Latency Reduction' },
      { label: 'Peak Concurrency', value: '1,000+', subtext: 'Concurrent Users' },
    ],
  },

  experiences: [
    {
      id: 'exp-1',
      role: 'Data Engineer',
      company: 'Adtechnology Technology Joint Stock Company',
      companySubtitle: 'Collaboration with Viet Nam Gate Advertising JSC, AdsBase Advertising Technology JSC, bePro.vn Service Company',
      companyUrl: 'https://github.com/ga2631',
      location: 'Ban Co Ward, Ho Chi Minh City',
      period: '04/2026 – 06/2026',
      current: false,
      summary: 'Formulated product analytics specifications and built high-impact data pipelines and reporting solutions for cross-platform marketing and e-commerce conversion funnels.',
      achievements: [
        'Formulated product analytics tracking specifications (GA4) for e-commerce conversion funnels to identify drop-offs and optimize revenue strategies.',
        'Built automated reporting dashboards utilizing Looker Studio and AI integrations to ground product prioritization decisions.',
        'Engineered secure data protocols for PII before Google Analytics transmission, ensuring strict privacy compliance.',
      ],
      technologies: ['Google Analytics 4 (GA4)', 'Google Tag Manager (GTM)', 'Looker Studio', 'BigQuery', 'SQL', 'Python', 'AI Workflows'],
    },
    {
      id: 'exp-2',
      role: 'Software Engineer / Team Lead',
      company: 'Adtechnology Technology Joint Stock Company',
      companySubtitle: 'Collaboration with Viet Nam Gate Advertising JSC, AdsBase Advertising Technology JSC, bePro.vn Service Company',
      companyUrl: 'https://github.com/ga2631',
      location: 'Ban Co Ward, Ho Chi Minh City',
      period: '01/2024 – 03/2026',
      current: false,
      summary: 'Led technical delivery for an engineering team maintaining and scaling core enterprise ERP platforms, driving automation and API reliability.',
      achievements: [
        'Led technical delivery for a team of 4-5 engineers maintaining and scaling core ERP platforms.',
        'Integrated Zalo Notification Service (ZNS) end-to-end and designed an automated accounts receivable management feature.',
        'Translated business requirements into actionable PRDs and User Stories, and conducted rigorous code/API reviews to prevent scope drift and ensure system stability.',
      ],
      technologies: ['Golang', 'Java (Spring Boot)', 'Node.js', 'PHP (Laravel)', 'PostgreSQL', 'MySQL', 'Redis', 'RabbitMQ', 'Docker'],
    },
    {
      id: 'exp-3',
      role: 'Software Engineer / Project Manager',
      company: 'Adtechnology Technology Joint Stock Company',
      companySubtitle: 'Collaboration with Viet Nam Gate Advertising JSC, AdsBase Advertising Technology JSC, bePro.vn Service Company',
      companyUrl: 'https://github.com/ga2631',
      location: 'Ban Co Ward, Ho Chi Minh City',
      period: '03/2021 – 12/2023',
      current: false,
      summary: 'Directed a team of 8 in end-to-end development of ad reporting modules, performance optimization, and CI/CD automation.',
      achievements: [
        'Directed a team of 8 in the end-to-end development of ad reporting modules, aggregating data across Google, Facebook, and TikTok into centralized dashboards.',
        'Optimized application performance, established CI/CD pipelines, and implemented system caching, drastically improving response times.',
        'Developed accounting and affiliate management modules and maintained the company WordPress website.',
      ],
      technologies: ['PHP (Laravel, CodeIgniter)', 'JavaScript (VueJS, ReactJS)', 'MySQL', 'MariaDB', 'Redis', 'RabbitMQ', 'Linux', 'Docker', 'CI/CD'],
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'ERP Data Infrastructure & Medallion Data Warehouse Migration',
      company: 'Viet Nam Gate Advertising JSC',
      role: 'Project Manager & System Architect',
      teamSize: '6 members',
      shortDescription: 'Migrated a 7-year legacy ERP EAV database to a Medallion Data Warehouse (Bronze-Silver-Gold) via MySQL CDC binlogs & RabbitMQ.',
      description: 'Architected and executed the end-to-end migration of a 7-year-old legacy ERP database, transitioning from a complex Entity-Attribute-Value (EAV) model to a centralized Medallion Data Warehouse (Bronze-Silver-Gold) to unlock advanced analytics and reduce operational overhead.',
      category: 'Data / AI',
      tags: ['Golang', 'MySQL Binlogs', 'PostgreSQL', 'Medallion CDC', 'RabbitMQ', 'Docker'],
      keyImpacts: [
        '⚡ Reduced analytical query times by over 70%',
        '🔒 96% reconciliation rate with zero data loss',
        '🚀 Near real-time CDC sync latency (<2s)',
      ],
      highlights: [
        'Bypassed slow-to-modify legacy ERP source code by implementing Change Data Capture (CDC) reading directly from MySQL binlogs, completely decoupling extraction and capturing full audit trails.',
        'Built idempotent Go workers consuming RabbitMQ queues enforcing exactly-once processing with PostgreSQL UPSERTs (On Conflict) and strict schema validation.',
        'Mitigated disk I/O bottlenecks during massive ingestion by horizontally scaling containerized Go services via Docker and tuning RabbitMQ prefetch limits.',
        'Achieved 96% data reconciliation rate between legacy source and target warehouse with zero data loss.',
        'Reduced complex analytical query execution time by over 70% by eliminating EAV joins in favor of structured data marts.',
        'Maintained near real-time CDC synchronization with pipeline latency under a few seconds, with strict compliance to Decree 13/2023/ND-CP on PII data protection.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'Omnichannel MarTech Hub & Conversion Funnel Analytics',
      company: 'Adtechnology Technology Joint Stock Company',
      role: 'Backend Engineer / Data Engineer',
      teamSize: '6 members',
      shortDescription: 'Real-time e-commerce conversion tracking and automated marketing ETL data marts with reactive streaming & automated PII masking.',
      description: 'Engineered a centralized Marketing Technology (MarTech) hub to aggregate cross-platform advertising metrics and process high-volume e-commerce conversion events, feeding structured data into real-time reporting dashboards.',
      category: 'Backend / Cloud',
      tags: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'Spring AOP', 'Kafka', 'BigQuery', 'Docker'],
      keyImpacts: [
        '⚡ Sub-second latency for thousands of daily funnel events',
        '🛡️ 100% PII privacy compliance via Spring AOP',
        '⏱️ Reduced daily report generation time by >40%',
      ],
      highlights: [
        'Developed high-throughput event tracking service using Spring WebFlux (non-blocking reactive API) and Apache Kafka / RabbitMQ to capture real-time user journey events without impacting core booking performance.',
        'Engineered secure data gateway using Spring AOP and custom Interceptors to automatically detect, encrypt, and strip PII before transmitting to Google Analytics 4 (GA4).',
        'Implemented automated ingestion pipelines using Spring WebClient and Resilience4j (Circuit Breaker & Retry patterns) to gracefully handle Google, Facebook, and TikTok API rate limits and timeouts.',
        'Built automated ETL jobs utilizing Spring Batch to process large-scale Avro data extracts from Google BigQuery into PostgreSQL, optimizing schema specifically for instant Looker Studio dashboard loading.',
        'Successfully ingested thousands of daily conversion funnel events with sub-second latency, achieving 100% data privacy compliance and reducing daily report generation time by over 40%.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'High-Concurrency Customer Application Reporting Portal',
      company: 'Viet Nam Gate Advertising JSC',
      role: 'Project Manager & Tech Lead',
      teamSize: '6 members',
      shortDescription: 'Enterprise Client Portal handling 1,000+ concurrent users with Redis query caching and modular Vue.js interactive chart widgets.',
      description: 'Led a cross-functional team to build a Client Portal directly integrated with the internal ERP system, delivering a centralized, transparent, and real-time reporting platform for clients to automate ad campaign data retrieval.',
      category: 'Fullstack',
      tags: ['Node.js', 'Vue.js', 'Redis Caching', 'ERP Integration', 'Docker', 'Agile'],
      keyImpacts: [
        '👥 Scaled smoothly under 1,000+ peak concurrent users',
        '📉 40% reduction in manual data extraction requests',
        '🧩 Modular frontend charts adaptable to frequent UX changes',
      ],
      highlights: [
        'Managed full SDLC and resource allocation from system design phase to User Acceptance Testing (UAT).',
        'Redesigned data synchronization flow with batch processing and Redis caching, smoothly handling 1,000 concurrent users without overloading the core ERP database.',
        'Guided frontend team to adopt a modular Vue.js architecture with highly reusable charting components, rapidly accommodating frequent client UI/metric modifications without breaking sprint delivery.',
        'Reduced time spent on manual data extraction requests by 40%, significantly improving client satisfaction.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-4',
      title: 'Internal ERP System Upgrade & Financial Automation',
      company: 'Viet Nam Gate Advertising JSC',
      role: 'Software Engineer',
      teamSize: '2 members',
      shortDescription: 'Financial cash inflow automation module, multi-channel ad metrics sync, and zero-downtime CI/CD upgrades for legacy ERP.',
      description: 'Modernized, scaled, and maintained the enterprise ERP system by automating cross-platform marketing data synchronization, streamlining financial workflows, and ensuring high system availability.',
      category: 'Backend / Cloud',
      tags: ['PHP (Laravel)', 'VueJS', 'MariaDB', 'RabbitMQ', 'CentOS', 'CI/CD'],
      keyImpacts: [
        '📉 Decreased report generation time by 63%',
        '⏳ Saved 10-12 hours/week in manual accounting entry',
        '🔄 100% zero-downtime automated deployments',
      ],
      highlights: [
        'Built and maintained automated data pipelines integrating Google Ads, Facebook Ads, and TikTok APIs to fetch and centralize advertising metrics.',
        'Developed dynamic cash inflow module that automatically splits total received amounts into discrete accounting components based on strict financial formulas.',
        'Profiled and optimized complex relational database queries, decreasing report generation time by 63%.',
        'Eliminated manual data entry for the accounting team, saving 10-12 hours/week and reducing calculation errors to near zero.',
        'Administered ERP server infrastructure (Docker, Nginx) and integrated CI/CD pipelines to ensure seamless zero-downtime upgrades.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: false,
    },
  ],

  skillCategories: [
    {
      title: 'Core Engineering',
      description: 'Polyglot backend development, clean architecture, and modern microservices',
      skills: [
        { name: 'Golang', level: 'Advanced' },
        { name: 'Java (Spring Boot, WebFlux, Batch)', level: 'Advanced' },
        { name: 'Python (Django, Flask, Scripting)', level: 'Advanced' },
        { name: 'JavaScript / TypeScript (Node.js, VueJS, ReactJS)', level: 'Advanced' },
        { name: 'PHP (Laravel, CodeIgniter)', level: 'Expert' },
        { name: 'Rust', level: 'Proficient' },
      ],
    },
    {
      title: 'Database & Infrastructure',
      description: 'Relational data modeling, queuing systems, and containerized deployments',
      skills: [
        { name: 'PostgreSQL (Indexing & Optimization)', level: 'Expert' },
        { name: 'MySQL / MariaDB', level: 'Expert' },
        { name: 'Redis (Caching & Rate Limiting)', level: 'Advanced' },
        { name: 'RabbitMQ / Apache Kafka', level: 'Advanced' },
        { name: 'Docker & Docker Compose', level: 'Expert' },
        { name: 'Linux / CentOS Server Administration', level: 'Advanced' },
        { name: 'CI/CD Pipelines & Nginx', level: 'Advanced' },
      ],
    },
    {
      title: 'Product Analytics & Data Engineering',
      description: 'Data warehousing, funnel tracking, and BI dashboard visualization',
      skills: [
        { name: 'Google Analytics 4 (GA4)', level: 'Expert' },
        { name: 'Google Tag Manager (GTM)', level: 'Expert' },
        { name: 'Looker Studio Reporting', level: 'Expert' },
        { name: 'Google BigQuery & Advanced SQL', level: 'Advanced' },
        { name: 'Medallion Data Architecture (Bronze-Silver-Gold)', level: 'Advanced' },
        { name: 'Change Data Capture (CDC) Pipelines', level: 'Advanced' },
      ],
    },
    {
      title: 'Product, Agile & AI Workflow',
      description: 'Technical leadership, PRD specification, and generative AI productivity',
      skills: [
        { name: 'PRD Writing & User Stories', level: 'Expert' },
        { name: 'Sprint Planning & Agile / Scrum', level: 'Expert' },
        { name: 'Cross-functional Stakeholder Management', level: 'Expert' },
        { name: 'SDLC & User Acceptance Testing (UAT)', level: 'Expert' },
        { name: 'Gemini & Antigravity (Daily AI Workflows)', level: 'Expert' },
        { name: 'English & Vietnamese (Bilingual)', level: 'Expert' },
      ],
    },
  ],

  educations: [
    {
      id: 'edu-1',
      degree: 'Informatics & Computer Science Education',
      institution: 'Ho Chi Minh City University of Education (HCMUE)',
      location: 'Ho Chi Minh City, Vietnam',
      period: '2018 - 2022',
      gpaOrHonors: 'Completed 100% Core Major Curriculum • Early Industry Transition',
      details: [
        'Completed Comprehensive CS Foundations: Mastered Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Database Management Systems (DBMS / Relational SQL), Computer Architecture, Operating Systems, Computer Networks, and Software Engineering Methodologies.',
        'Unique Pedagogical & Communication Edge: Formal informatics pedagogical training fostered exceptional capabilities in technical documentation, structured problem decomposition, team mentoring, and effective technical-to-business stakeholder communication.',
        'Early Professional Industry Transition: Fueled by a relentless passion for practical software engineering and real-world system architecture, entered the industry early in 2021 to build production-scale enterprise systems, accumulating 5+ years of verified hands-on engineering and team leadership experience.',
      ],
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'Google Cloud Professional Data Engineer',
      issuer: 'Google Cloud',
      issueDate: 'Target: 2027',
      status: 'Currently Pursuing',
      // credentialUrl: 'https://cloud.google.com/learn/certification/data-engineer',
    },
  ],
};

export const cvDataVi: CVData = {
  personalInfo: {
    fullName: 'Huỳnh Nhật Tân',
    jobTitle: 'Kỹ sư Backend & Dữ liệu đa ngôn ngữ | Trưởng nhóm Kỹ thuật',
    tagline: 'Kiến trúc Hệ thống Phân tán Mở rộng, Medallion Data Warehouse & Đường ống Dữ liệu Tải cao',
    bio: 'Kỹ sư Backend & Dữ liệu đa ngôn ngữ với hơn 5 năm kinh nghiệm kiến trúc các hệ thống phân tán tải cao và Data Warehouse hiện đại. Năng lực làm chủ kỹ thuật chuyên sâu trên Golang, Java (Spring Boot), Node.js và Python — chuyên trách các đường ống dữ liệu CDC thời gian thực, tối ưu hóa cơ sở dữ liệu và microservices quy mô lớn.',
    email: 'tanhuynh2631@gmail.com',
    phone: '+84-963684520',
    location: 'Phường Tân Khánh, TP. Hồ Chí Minh, Việt Nam',
    birthday: '23/11/1999',
    availability: 'Sẵn sàng nhận việc',
    githubUrl: 'https://github.com/ga2631',
    avatarUrl: 'https://github.com/ga2631.png',
    stats: [
      { label: 'Năm kinh nghiệm', value: '5+', subtext: 'Backend & Data Pipelines' },
      { label: 'Khớp nối dữ liệu', value: '96%', subtext: 'Chuyển đổi không mất dữ liệu' },
      { label: 'Hiệu năng truy vấn', value: '70%+', subtext: 'Giảm độ trễ thực thi' },
      { label: 'Tải đồng thời tối đa', value: '1,000+', subtext: 'Người dùng đồng thời (CCU)' },
    ],
  },

  experiences: [
    {
      id: 'exp-1',
      role: 'Kỹ sư Dữ liệu (Data Engineer)',
      company: 'Công ty Cổ phần Công nghệ Adtechnology',
      companySubtitle: 'Hợp tác cùng Viet Nam Gate Advertising JSC, AdsBase Advertising Technology JSC, bePro.vn Service Company',
      companyUrl: 'https://github.com/ga2631',
      location: 'Phường Bàn Cờ, TP. Hồ Chí Minh',
      period: '04/2026 – 06/2026',
      current: false,
      summary: 'Xây dựng đặc tả đo lường dữ liệu sản phẩm và phát triển các đường ống dữ liệu, hệ thống báo cáo hiệu quả cao cho phễu chuyển đổi thương mại điện tử và tiếp thị đa kênh.',
      achievements: [
        'Thiết lập đặc tả đo lường phân tích sản phẩm (GA4) cho phễu chuyển đổi TMĐT nhằm phát hiện điểm rơi và tối ưu chiến lược doanh thu.',
        'Xây dựng bảng điều khiển báo cáo tự động trên Looker Studio kết hợp AI nhằm hỗ trợ ban giám đốc ra quyết định ưu tiên sản phẩm.',
        'Thiết kế giao thức bảo mật dữ liệu định danh cá nhân (PII) trước khi truyền sang Google Analytics, tuân thủ nghiêm ngặt quy định bảo mật dữ liệu.',
      ],
      technologies: ['Google Analytics 4 (GA4)', 'Google Tag Manager (GTM)', 'Looker Studio', 'BigQuery', 'SQL', 'Python', 'AI Workflows'],
    },
    {
      id: 'exp-2',
      role: 'Kỹ sư Phần mềm / Trưởng nhóm Kỹ thuật (Tech Lead)',
      company: 'Công ty Cổ phần Công nghệ Adtechnology',
      companySubtitle: 'Hợp tác cùng Viet Nam Gate Advertising JSC, AdsBase Advertising Technology JSC, bePro.vn Service Company',
      companyUrl: 'https://github.com/ga2631',
      location: 'Phường Bàn Cờ, TP. Hồ Chí Minh',
      period: '01/2024 – 03/2026',
      current: false,
      summary: 'Dẫn dắt kỹ thuật đội ngũ kỹ sư bảo trì và mở rộng nền tảng ERP doanh nghiệp cốt lõi, thúc đẩy tự động hóa quy trình và độ tin cậy của API.',
      achievements: [
        'Dẫn dắt chuyển giao kỹ thuật cho nhóm 4-5 kỹ sư duy trì và mở rộng hệ thống ERP doanh nghiệp cốt lõi.',
        'Tích hợp toàn diện dịch vụ Zalo Notification Service (ZNS) và thiết kế tính năng quản lý công nợ phải thu tự động.',
        'Chuyển hóa yêu cầu kinh doanh thành tài liệu PRD và User Story rõ ràng, thực hiện code review/API review chặt chẽ để đảm bảo hệ thống vận hành ổn định.',
      ],
      technologies: ['Golang', 'Java (Spring Boot)', 'Node.js', 'PHP (Laravel)', 'PostgreSQL', 'MySQL', 'Redis', 'RabbitMQ', 'Docker'],
    },
    {
      id: 'exp-3',
      role: 'Kỹ sư Phần mềm / Quản lý Dự án (Project Manager)',
      company: 'Công ty Cổ phần Công nghệ Adtechnology',
      companySubtitle: 'Hợp tác cùng Viet Nam Gate Advertising JSC, AdsBase Advertising Technology JSC, bePro.vn Service Company',
      companyUrl: 'https://github.com/ga2631',
      location: 'Phường Bàn Cờ, TP. Hồ Chí Minh',
      period: '03/2021 – 12/2023',
      current: false,
      summary: 'Điều hành nhóm 8 thành viên phát triển mô-đun báo cáo quảng cáo đa nền tảng, tối ưu hóa hiệu năng ứng dụng và tự động hóa CI/CD.',
      achievements: [
        'Quản lý nhóm 8 nhân sự phát triển trọn gói các mô-đun báo cáo quảng cáo, tổng hợp dữ liệu Google, Facebook và TikTok về bảng điều khiển trung tâm.',
        'Tối ưu hóa hiệu năng ứng dụng, xây dựng luồng CI/CD và triển khai caching đa tầng giúp cải thiện rõ rệt tốc độ phản hồi hệ thống.',
        'Phát triển mô-đun kế toán và quản lý đối tác liên kết (Affiliate), quản trị vận hành website WordPress của doanh nghiệp.',
      ],
      technologies: ['PHP (Laravel, CodeIgniter)', 'JavaScript (VueJS, ReactJS)', 'MySQL', 'MariaDB', 'Redis', 'RabbitMQ', 'Linux', 'Docker', 'CI/CD'],
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'Hạ tầng Dữ liệu ERP & Chuyển đổi Medallion Data Warehouse',
      company: 'Viet Nam Gate Advertising JSC',
      role: 'Quản lý Dự án & Kiến trúc sư Hệ thống',
      teamSize: '6 thành viên',
      shortDescription: 'Chuyển đổi CSDL ERP EAV 7 năm tuổi sang kiến trúc Medallion Data Warehouse (Bronze-Silver-Gold) qua MySQL CDC binlogs & RabbitMQ.',
      description: 'Thiết kế kiến trúc và triển khai chuyển đổi toàn diện CSDL ERP kế thừa 7 năm tuổi từ mô hình phức tạp Entity-Attribute-Value (EAV) sang kiến trúc tập trung Medallion Data Warehouse (Bronze-Silver-Gold), giải phóng năng lực phân tích nâng cao và giảm thiểu chi phí vận hành.',
      category: 'Data / AI',
      tags: ['Golang', 'MySQL Binlogs', 'PostgreSQL', 'Medallion CDC', 'RabbitMQ', 'Docker'],
      keyImpacts: [
        '⚡ Giảm hơn 70% thời gian thực thi truy vấn phân tích',
        '🔒 Tỷ lệ khớp nối 96% với 0% mất mát dữ liệu',
        '🚀 Độ trễ đồng bộ CDC gần thời gian thực (<2s)',
      ],
      highlights: [
        'Bỏ qua mã nguồn monolithic cũ kỹ bằng cách triển khai Change Data Capture (CDC) đọc trực tiếp từ MySQL binlogs, tách biệt hoàn toàn quá trình trích xuất và lưu vết kiểm toán đầy đủ.',
        'Xây dựng các Go worker có tính chất Idempotent tiêu thụ hàng đợi RabbitMQ, đảm bảo xử lý chính xác một lần (Exactly-Once) với PostgreSQL UPSERTs và xác thực lược đồ nghiêm ngặt.',
        'Khắc phục nghẽn I/O ổ đĩa khi tải lớn bằng cách mở rộng quy mô ngang các dịch vụ Go trên Docker và tinh chỉnh prefetch limit của RabbitMQ.',
        'Đạt tỷ lệ khớp nối dữ liệu 96% giữa nguồn ERP cũ và kho dữ liệu mới mà không làm mất mát dữ liệu.',
        'Giảm hơn 70% thời gian thực thi truy vấn phân tích phức tạp nhờ loại bỏ join bảng EAV sang các data mart cấu trúc chuẩn.',
        'Duy trì độ trễ đồng bộ đường ống CDC dưới vài giây, tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'Trung tâm MarTech Đa kênh & Phân tích Phễu Chuyển đổi',
      company: 'Công ty Cổ phần Công nghệ Adtechnology',
      role: 'Kỹ sư Backend / Kỹ sư Dữ liệu',
      teamSize: '6 thành viên',
      shortDescription: 'Thu thập chuyển đổi TMĐT thời gian thực và xây dựng data mart ETL tự động với luồng Reactive Streaming & mã hóa PII tự động.',
      description: 'Xây dựng trung tâm Marketing Technology (MarTech) tập trung để tổng hợp chỉ số quảng cáo đa kênh và xử lý khối lượng lớn sự kiện chuyển đổi thương mại điện tử phục vụ các báo cáo trực quan theo thời gian thực.',
      category: 'Backend / Cloud',
      tags: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'Spring AOP', 'Kafka', 'BigQuery', 'Docker'],
      keyImpacts: [
        '⚡ Độ trễ dưới 1 giây cho hàng nghìn sự kiện phễu mỗi ngày',
        '🛡️ Tuân thủ 100% quyền riêng tư PII qua Spring AOP',
        '⏱️ Giảm hơn 40% thời gian tổng hợp báo cáo định kỳ',
      ],
      highlights: [
        'Phát triển dịch vụ theo dõi sự kiện thông lượng cao sử dụng Spring WebFlux (Reactive API bất đồng bộ) cùng Apache Kafka / RabbitMQ để ghi nhận hành vi người dùng mà không ảnh hưởng hiệu năng giao dịch cốt lõi.',
        'Xây dựng cổng dữ liệu bảo mật bằng Spring AOP và Interceptor tùy biến nhằm tự động phát hiện, mã hóa và loại bỏ PII trước khi gửi sang Google Analytics 4 (GA4).',
        'Triển khai các đường ống ingestion tự động sử dụng Spring WebClient và Resilience4j (Circuit Breaker & Retry patterns) để xử lý mượt mà giới hạn rate-limit từ các API Google, Facebook và TikTok.',
        'Xây dựng các tác vụ ETL tự động với Spring Batch xử lý file Avro dung lượng lớn từ BigQuery vào PostgreSQL, tối ưu schema cho việc tải Looker Studio tức thì.',
        'Xử lý thành công hàng nghìn sự kiện phễu chuyển đổi mỗi ngày với độ trễ dưới 1 giây, bảo vệ 100% dữ liệu PII và giảm hơn 40% thời gian xuất báo cáo.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'Cổng Báo cáo Ứng dụng Khách hàng Tải cao (1,000+ CCU)',
      company: 'Viet Nam Gate Advertising JSC',
      role: 'Quản lý Dự án & Trưởng nhóm Kỹ thuật',
      teamSize: '6 thành viên',
      shortDescription: 'Cổng thông tin khách hàng doanh nghiệp chịu tải 1,000+ CCU với cơ chế đệm truy vấn Redis và biểu đồ Vue.js dạng mô-đun.',
      description: 'Dẫn dắt nhóm liên chức năng xây dựng Cổng thông tin khách hàng tích hợp trực tiếp vào hệ thống ERP nội bộ, cung cấp nền tảng báo cáo minh bạch và tự động trích xuất dữ liệu chiến dịch quảng cáo.',
      category: 'Fullstack',
      tags: ['Node.js', 'Vue.js', 'Redis Caching', 'ERP Integration', 'Docker', 'Agile'],
      keyImpacts: [
        '👥 Vận hành ổn định dưới tải đỉnh 1,000+ người dùng đồng thời',
        '📉 Giảm 40% yêu cầu trích xuất dữ liệu thủ công',
        '🧩 Mô-đun biểu đồ linh hoạt thích ứng thay đổi giao diện',
      ],
      highlights: [
        'Quản lý toàn bộ vòng đời phát triển phần mềm (SDLC) từ thiết kế kiến trúc đến kiểm thử nghiệm thu người dùng (UAT).',
        'Tái cấu trúc luồng đồng bộ dữ liệu kết hợp xử lý theo lô (batch) và bộ nhớ đệm Redis, đáp ứng ổn định 1,000 người dùng đồng thời mà không gây quá tải CSDL ERP.',
        'Định hướng đội ngũ frontend áp dụng kiến trúc mô-đun Vue.js với các component biểu đồ tái sử dụng cao, đáp ứng nhanh các yêu cầu tinh chỉnh giao diện của khách hàng.',
        'Giảm 40% thời gian xử lý các yêu cầu trích xuất dữ liệu thủ công, nâng cao sự hài lòng của đối tác.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-4',
      title: 'Nâng cấp Hệ thống ERP Nội bộ & Tự động hóa Tài chính',
      company: 'Viet Nam Gate Advertising JSC',
      role: 'Kỹ sư Phần mềm',
      teamSize: '2 thành viên',
      shortDescription: 'Mô-đun tự động hóa phân bổ dòng tiền tài chính, đồng bộ chỉ số quảng cáo đa kênh và CI/CD nâng cấp zero-downtime.',
      description: 'Hiện đại hóa, mở rộng và bảo trì hệ thống ERP doanh nghiệp bằng cách tự động hóa đồng bộ dữ liệu tiếp thị đa nền tảng, tinh gọn quy trình tài chính và đảm bảo độ sẵn sàng cao của hệ thống.',
      category: 'Backend / Cloud',
      tags: ['PHP (Laravel)', 'VueJS', 'MariaDB', 'RabbitMQ', 'CentOS', 'CI/CD'],
      keyImpacts: [
        '📉 Giảm 63% thời gian tạo báo cáo tài chính',
        '⏳ Tiết kiệm 10-12 giờ/tuần nhập liệu thủ công cho kế toán',
        '🔄 Triển khai nâng cấp tự động 100% không gián đoạn',
      ],
      highlights: [
        'Phát triển và duy trì các đường ống dữ liệu tự động tích hợp API Google Ads, Facebook Ads, TikTok Ads để thu thập số liệu tập trung.',
        'Xây dựng mô-đun phân bổ dòng tiền tự động chia tách tổng số tiền thu được theo các thành phần tài chính dựa trên công thức nghiêm ngặt.',
        'Phân tích profiling và tối ưu hóa các truy vấn CSDL quan hệ phức tạp, giảm 63% thời gian xuất báo cáo.',
        'Xóa bỏ hoàn toàn việc nhập liệu thủ công cho đội kế toán, tiết kiệm 10-12 giờ mỗi tuần và giảm sai sót tính toán về mức xấp xỉ 0.',
        'Quản trị hạ tầng máy chủ ERP (Docker, Nginx) và thiết lập CI/CD đảm bảo triển khai nâng cấp mượt mà.',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: false,
    },
  ],

  skillCategories: [
    {
      title: 'Lập trình & Kiến trúc Cốt lõi',
      description: 'Phát triển backend đa ngôn ngữ, clean architecture và microservices hiện đại',
      skills: [
        { name: 'Golang', level: 'Advanced' },
        { name: 'Java (Spring Boot, WebFlux, Batch)', level: 'Advanced' },
        { name: 'Python (Django, Flask, Scripting)', level: 'Advanced' },
        { name: 'JavaScript / TypeScript (Node.js, VueJS, ReactJS)', level: 'Advanced' },
        { name: 'PHP (Laravel, CodeIgniter)', level: 'Expert' },
        { name: 'Rust', level: 'Proficient' },
      ],
    },
    {
      title: 'Cơ sở Dữ liệu & Hạ tầng',
      description: 'Mô hình hóa CSDL quan hệ, hàng đợi thông điệp và triển khai container hóa',
      skills: [
        { name: 'PostgreSQL (Indexing & Tối ưu hóa)', level: 'Expert' },
        { name: 'MySQL / MariaDB', level: 'Expert' },
        { name: 'Redis (Caching & Rate Limiting)', level: 'Advanced' },
        { name: 'RabbitMQ / Apache Kafka', level: 'Advanced' },
        { name: 'Docker & Docker Compose', level: 'Expert' },
        { name: 'Linux / CentOS Server Administration', level: 'Advanced' },
        { name: 'CI/CD Pipelines & Nginx', level: 'Advanced' },
      ],
    },
    {
      title: 'Phân tích Sản phẩm & Kỹ thuật Dữ liệu',
      description: 'Kiến trúc Data Warehouse, theo dõi phễu chuyển đổi và bảng điều khiển BI',
      skills: [
        { name: 'Google Analytics 4 (GA4)', level: 'Expert' },
        { name: 'Google Tag Manager (GTM)', level: 'Expert' },
        { name: 'Looker Studio Reporting', level: 'Expert' },
        { name: 'Google BigQuery & Advanced SQL', level: 'Advanced' },
        { name: 'Medallion Data Architecture (Bronze-Silver-Gold)', level: 'Advanced' },
        { name: 'Change Data Capture (CDC) Pipelines', level: 'Advanced' },
      ],
    },
    {
      title: 'Quản trị Sản phẩm, Agile & Quy trình AI',
      description: 'Dẫn dắt kỹ thuật, viết đặc tả PRD và ứng dụng Generative AI tăng năng suất',
      skills: [
        { name: 'Viết PRD & User Stories', level: 'Expert' },
        { name: 'Sprint Planning & Agile / Scrum', level: 'Expert' },
        { name: 'Quản lý Stakeholder Liên chức năng', level: 'Expert' },
        { name: 'SDLC & Kiểm thử Nghiệm thu (UAT)', level: 'Expert' },
        { name: 'Gemini & Antigravity (Quy trình AI hàng ngày)', level: 'Expert' },
        { name: 'Tiếng Anh & Tiếng Việt (Song ngữ)', level: 'Expert' },
      ],
    },
  ],

  educations: [
    {
      id: 'edu-1',
      degree: 'Sư phạm Tin học',
      institution: 'Trường Đại học Sư phạm TP.HCM (HCMUE)',
      location: 'TP. Hồ Chí Minh, Việt Nam',
      period: '2018 - 2022',
      gpaOrHonors: 'Hoàn thành 100% chương trình chuyên ngành • Bắt đầu làm việc từ sớm',
      details: [
        'Nền tảng Khoa học Máy tính Toàn diện: Nắm vững Cấu trúc Dữ liệu & Giải thuật (DSA), Lập trình Hướng đối tượng (OOP), Cơ sở Dữ liệu (DBMS / Relational SQL), Kiến trúc Máy tính, Hệ điều hành, Mạng máy tính và Phương pháp luận Kỹ thuật Phần mềm.',
        'Lợi thế Sư phạm & Kỹ năng Truyền đạt: Đào tạo sư phạm chính quy rèn luyện năng lực vượt trội trong việc viết tài liệu kỹ thuật, phân rã bài toán phức tạp, cố vấn chuyên môn (mentoring) và kết nối giao tiếp hiệu quả giữa đội ngũ kỹ thuật và khối kinh doanh.',
        'Bắt đầu làm việc từ sớm: Được thôi thúc bởi đam mê mạnh mẽ với kỹ thuật phần mềm thực tế, tham gia thị trường lao động từ đầu năm 2021 để xây dựng các hệ thống quy mô lớn, tích lũy hơn 5 năm kinh nghiệm thực chiến và lãnh đạo kỹ thuật.',
      ],
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'Google Cloud Professional Data Engineer',
      issuer: 'Google Cloud',
      issueDate: 'Mục tiêu 2027',
      status: 'Đang theo học',
      // credentialUrl: 'https://cloud.google.com/learn/certification/data-engineer',
    },
  ],
};

export const cvData = cvDataEn;
