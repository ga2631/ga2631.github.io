import { CVData } from '../types/index.ts';

export const cvData: CVData = {
  personalInfo: {
    fullName: 'Tan Huynh Nhat',
    jobTitle: 'Polyglot Backend & Data Engineer | Technical Team Lead',
    tagline: 'Architecting Scalable Distributed Systems, Medallion Data Warehouses & High-Concurrency Pipelines',
    bio: 'Polyglot Backend & Data Engineer with 5+ years of experience architecting scalable distributed systems and optimizing high-concurrency applications. Proficient in Golang, Java (Spring Boot), Node.js, Python, and PHP (Laravel), with deep hands-on expertise in PostgreSQL, MySQL, Redis, RabbitMQ, and Docker. Proven track record of taking end-to-end technical ownership, notably migrating a 7-year legacy ERP database to a Medallion Data Warehouse using CDC pipelines with zero data loss. Passionate about bridging software engineering and data analytics to drive business value, reduce complex query times by 70%, and ensure system stability. Currently pursuing the Google Cloud Professional Data Engineer certification.',
    email: 'tanhuynh2631@gmail.com',
    phone: '+84-963684520',
    location: 'Tan Khanh Ward, Ho Chi Minh City, Vietnam',
    birthday: '23 Nov 1999',
    availability: 'Open for Senior / Lead Backend & Data Engineering Roles',
    githubUrl: 'https://github.com/ga2631',
    avatarUrl: 'https://github.com/ga2631.png',
    stats: [
      { label: 'Years Experience', value: '5+', subtext: 'Distributed Systems & Data' },
      { label: 'Data Reconciliation', value: '96%', subtext: 'Zero Data Loss Migration' },
      { label: 'Query Optimization', value: '>70%', subtext: 'Execution Time Reduction' },
      { label: 'Peak Concurrency', value: '1,000+', subtext: 'Active Concurrent Users' },
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
      description: 'Architected and executed the end-to-end migration of a 7-year-old legacy ERP database, transitioning from a complex Entity-Attribute-Value (EAV) model to a centralized Medallion Data Warehouse (Bronze-Silver-Gold) to unlock advanced analytics and reduce operational overhead.',
      category: 'Data / AI',
      tags: ['Golang', 'Python', 'MySQL Binlogs', 'PostgreSQL', 'Medallion Architecture', 'CDC', 'RabbitMQ', 'Docker'],
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
      description: 'Engineered a centralized Marketing Technology (MarTech) hub to aggregate cross-platform advertising metrics and process high-volume e-commerce conversion events, feeding structured data into real-time reporting dashboards.',
      category: 'Backend / Cloud',
      tags: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'Spring AOP', 'Spring Batch', 'Apache Kafka', 'PostgreSQL', 'Google BigQuery', 'Docker'],
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
      description: 'Led a cross-functional team to build a Client Portal directly integrated with the internal ERP system, delivering a centralized, transparent, and real-time reporting platform for clients to automate ad campaign data retrieval.',
      category: 'Fullstack',
      tags: ['Node.js (Express)', 'Vue.js (Frontend)', 'Redis Caching', 'ERP Integration', 'Docker', 'Agile/Scrum'],
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
      title: 'Internal ERP System Upgrade, Financial Automation & Operations',
      company: 'Viet Nam Gate Advertising JSC',
      role: 'Software Engineer',
      teamSize: '2 members',
      description: 'Modernized, scaled, and maintained the enterprise ERP system by automating cross-platform marketing data synchronization, streamlining financial workflows, and ensuring high system availability.',
      category: 'Backend / Cloud',
      tags: ['PHP (Laravel / CodeIgniter)', 'JavaScript / VueJS', 'MariaDB / MySQL', 'RabbitMQ', 'Linux / CentOS', 'Docker', 'CI/CD'],
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
      degree: 'Software Engineering & Information Technology',
      institution: 'Higher Education in Vietnam',
      location: 'Ho Chi Minh City, Vietnam',
      period: '2017 - 2021',
      gpaOrHonors: 'Specialization in Software Architecture & Data Systems',
      details: [
        'Solid foundation in Algorithms, Distributed Computing, Database Management Systems, and System Design.',
        'Continuous professional development in Cloud Computing, Big Data Pipelines, and Reactive Microservices.',
      ],
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'Google Cloud Professional Data Engineer',
      issuer: 'Google Cloud',
      issueDate: 'In Progress (Target: 2026)',
      status: 'Currently Pursuing',
      credentialUrl: 'https://cloud.google.com/learn/certification/data-engineer',
    },
    {
      id: 'cert-2',
      name: 'Medallion Architecture & CDC Pipeline Specialist',
      issuer: 'Enterprise Practical Engineering',
      issueDate: '2024 - 2026',
      badgeCode: 'DATA-CDC-MIGRATION',
      credentialUrl: 'https://github.com/ga2631',
    },
    {
      id: 'cert-3',
      name: 'Agile Leadership & Product Delivery Practitioner',
      issuer: 'Adtechnology Engineering Board',
      issueDate: '2021 - 2026',
      badgeCode: 'AGILE-LEAD-2024',
      credentialUrl: 'https://github.com/ga2631',
    },
  ],

  blogPosts: [
    {
      id: 'post-1',
      slug: 'migrating-legacy-erp-to-medallion-data-warehouse-cdc',
      title: 'Migrating a 7-Year Legacy ERP to a Medallion Data Warehouse using CDC and Zero Data Loss',
      summary: 'How we extracted MySQL binlogs with Change Data Capture, leveraged RabbitMQ idempotent workers, and reduced analytical query times by >70% with zero downtime.',
      publishedAt: 'May 2026',
      readTime: '7 min read',
      tags: ['Golang', 'CDC', 'Medallion Architecture', 'PostgreSQL', 'RabbitMQ', 'Data Engineering'],
      author: 'Tan Huynh Nhat',
      contentHtml: `
        <h3>The Challenge: Entity-Attribute-Value (EAV) Bottlenecks</h3>
        <p>Over 7 years of operation, our core ERP database grew organically with extensive EAV tables. Analytical queries required joining dozens of attribute tables, causing query execution times to exceed several minutes and overloading the operational database.</p>
        
        <h3>1. Bypassing Application Code with Change Data Capture (CDC)</h3>
        <p>Rather than modifying the rigid legacy monolithic codebase, we hooked directly into MySQL binary logs (binlogs). Every <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code> event was automatically captured and published to RabbitMQ queues, creating a complete historical audit trail with zero performance impact on the ERP app.</p>

        <h3>2. The Medallion Architecture (Bronze - Silver - Gold)</h3>
        <ul>
          <li><strong>Bronze Layer (Raw Ingestion):</strong> Stores raw JSON event payloads exactly as received from MySQL binlogs.</li>
          <li><strong>Silver Layer (Cleansed & Idempotent Processing):</strong> Idempotent Go workers consume RabbitMQ events, validate schemas, and perform <code>ON CONFLICT DO UPDATE</code> (UPSERTs) in PostgreSQL.</li>
          <li><strong>Gold Layer (Aggregated Data Marts):</strong> Structured dimensional tables optimized for Looker Studio dashboards and fast aggregation.</li>
        </ul>

        <h3>3. Key Results</h3>
        <p>The migration achieved a <strong>96% data reconciliation rate with zero data loss</strong>, reduced complex analytical query times by <strong>over 70%</strong>, and kept end-to-end CDC pipeline latency under 2 seconds.</p>
      `,
    },
    {
      id: 'post-2',
      slug: 'building-reactive-event-tracking-spring-webflux-kafka',
      title: 'Architecting High-Throughput Event Ingestion with Spring WebFlux, Kafka & Automated PII Masking',
      summary: 'Building a privacy-compliant MarTech analytics gateway that handles thousands of real-time e-commerce conversion events with sub-second latency.',
      publishedAt: 'Apr 2026',
      readTime: '6 min read',
      tags: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'Kafka', 'Google Analytics 4', 'Privacy'],
      author: 'Tan Huynh Nhat',
      contentHtml: `
        <h3>High-Throughput Non-Blocking Event Tracking</h3>
        <p>E-commerce checkout funnels require capturing micro-events (cart abandonment, add-on selections, voucher clicks) without introducing latency to user transactions. We leveraged <strong>Spring WebFlux</strong> to implement non-blocking asynchronous endpoints backed by Apache Kafka and RabbitMQ.</p>

        <h3>Automated PII Masking via Spring AOP</h3>
        <p>To comply with Decree 13/2023/ND-CP and international privacy laws, sensitive personal identifiable information (PII) must never reach third-party analytics endpoints like Google Analytics 4 (GA4). We implemented custom Spring AOP interceptors that recursively scan and mask sensitive fields prior to transmission.</p>

        <h3>Resilience with Circuit Breakers</h3>
        <p>Using Resilience4j Circuit Breakers and retry mechanisms, our API gateway gracefully absorbed external ad platform rate limits and network degradation without dropping customer conversion signals.</p>
      `,
    },
    {
      id: 'post-3',
      slug: 'scaling-customer-reporting-portal-high-concurrency-redis',
      title: 'Scaling an ERP Customer Reporting Portal to 1,000+ Concurrent Users with Redis & Node.js',
      summary: 'Techniques for caching heavy reporting queries, batch synchronization, and designing modular UI component architectures.',
      publishedAt: 'Jan 2026',
      readTime: '5 min read',
      tags: ['Node.js', 'Redis', 'Vue.js', 'High Concurrency', 'Architecture'],
      author: 'Tan Huynh Nhat',
      contentHtml: `
        <h3>The Concurrency Challenge</h3>
        <p>When multiple enterprise clients run heavy ad reporting analytics simultaneously during morning rush hours, database CPU usage spikes to 100%. We decoupled direct reporting queries from the transactional ERP database using Redis caching and intelligent query batching.</p>

        <h3>Modular Charting with Vue.js</h3>
        <p>By breaking reporting widgets into independent, reactive chart components with unified state contracts, client requests for new metrics could be rolled out in hours without touching backend core modules.</p>
      `,
    },
  ],
};
