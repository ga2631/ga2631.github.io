import { CVData } from '../types/index.ts';

export const cvData: CVData = {
  personalInfo: {
    fullName: 'Tan Huynh Nhat',
    jobTitle: 'Senior Software Engineer & Full-Stack Architect',
    tagline: 'Building High-Performance Distributed Systems, Resilient Cloud Architectures & Modern Web Applications',
    bio: 'Passionate Senior Software Engineer with over 6+ years of experience designing, architecting, and scaling modern web platforms and distributed backend services. Proficient in React, TypeScript, Node.js, Rust, Docker, and Cloud Native DevOps. Driven by engineering excellence, clean code craftsmanship, and delivering measurable business impact.',
    email: 'tanhn.dev@gmail.com',
    phone: '(+84) 9xx-xxx-xxx',
    location: 'Ho Chi Minh City, Vietnam (Open to Remote / Hybrid)',
    availability: 'Open for Senior / Lead Engineering Roles',
    githubUrl: 'https://github.com/ga2631',
    linkedinUrl: 'https://linkedin.com/in/tanhn',
    stats: [
      { label: 'Years Experience', value: '6+', subtext: 'In Web & Cloud' },
      { label: 'Projects Delivered', value: '25+', subtext: 'Enterprise & Open Source' },
      { label: 'System Uptime', value: '99.9%', subtext: 'Production SLA' },
      { label: 'Tech Mastered', value: '15+', subtext: 'Modern Frameworks' },
    ],
  },

  experiences: [
    {
      id: 'exp-1',
      role: 'Lead / Senior Full-Stack Engineer',
      company: 'Tech Horizons Global',
      companyUrl: 'https://github.com/ga2631',
      location: 'Ho Chi Minh City',
      period: '2023 - Present',
      current: true,
      summary: 'Spearheaded the technical design and transition from monolithic services to event-driven microservices, improving throughput by 40% while leading a team of 8 engineers.',
      achievements: [
        'Architected high-throughput REST and gRPC microservices handling over 5M+ daily requests with sub-50ms latency.',
        'Modernized the frontend architecture to React 19 + TypeScript, reducing bundle size by 35% and improving Core Web Vitals to 95+.',
        'Implemented end-to-end CI/CD pipelines on GitHub Actions and Kubernetes deployments with zero-downtime rolling updates.',
        'Mentored junior and mid-level developers through code reviews, technical workshops, and architectural RFC sessions.',
      ],
      technologies: ['React 19', 'TypeScript', 'Node.js', 'Rust', 'PostgreSQL', 'Docker', 'Kubernetes', 'GitHub Actions', 'AWS'],
    },
    {
      id: 'exp-2',
      role: 'Senior Software Engineer',
      company: 'NextGen Solutions',
      companyUrl: 'https://github.com/ga2631',
      location: 'Ho Chi Minh City',
      period: '2021 - 2023',
      current: false,
      summary: 'Developed enterprise web applications, real-time collaboration dashboards, and robust data processing engines for fintech and e-commerce clients.',
      achievements: [
        'Built real-time financial reporting analytics with React, WebSockets, and DuckDB analytical query processing.',
        'Designed database schemas with partitioning and optimized indexing strategies in PostgreSQL, eliminating query bottlenecks.',
        'Automated testing workflows with Jest, Playwright, and Vitest, reaching 85%+ test coverage across core modules.',
      ],
      technologies: ['React', 'TypeScript', 'Node.js / Express', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind / Vanilla CSS'],
    },
    {
      id: 'exp-3',
      role: 'Software Engineer',
      company: 'InnoVenture Labs',
      companyUrl: 'https://github.com/ga2631',
      location: 'Ho Chi Minh City',
      period: '2019 - 2021',
      current: false,
      summary: 'Collaborated with cross-functional teams to build responsive web applications, RESTful APIs, and third-party integrations.',
      achievements: [
        'Delivered 8+ client projects on time and within scope following agile scrum methodology.',
        'Integrated third-party payment gateways (Stripe, PayPal, VNPay) ensuring PCI-DSS compliance.',
        'Refactored legacy single-page apps into modular, reusable UI component libraries.',
      ],
      technologies: ['JavaScript (ES6+)', 'React', 'HTML5 / CSS3', 'Node.js', 'MongoDB', 'Git / CI-CD'],
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'Distributed Analytics & Telemetry Engine',
      description: 'High-performance real-time telemetry processing platform built with Rust, DuckDB, and React 19 visual dashboards.',
      category: 'Data / AI',
      tags: ['Rust', 'DuckDB', 'React 19', 'TypeScript', 'WebSockets', 'Docker'],
      highlights: [
        'Processes 100k+ events/sec with memory-safe Rust stream pipelines',
        'Interactive real-time aggregation chart components with zero lag',
        'Self-hosted multi-tenant data isolation and role-based access control',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'Cloud-Native Microservices Orchestrator',
      description: 'Modular microservice boilerplate and deployment dashboard with automated health checks, metrics, and CI/CD pipelines.',
      category: 'Backend / Cloud',
      tags: ['Node.js', 'TypeScript', 'Docker', 'Kubernetes', 'Prometheus', 'GitHub Actions'],
      highlights: [
        'Automated zero-downtime rolling deploys with automated rollback triggers',
        'Integrated OpenTelemetry tracing and Prometheus metrics exporters',
        'Preconfigured with secure JWT auth, rate limiting, and structured logging',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'Ultra-Fast Developer Portfolio & HTML Blog Engine',
      description: 'Zero-dependency React 19 + TypeScript portfolio with embedded HTML blog reader, printable CV format, and automated GitHub Pages CI/CD.',
      category: 'Frontend',
      tags: ['React 19', 'TypeScript', 'Vite', 'Vanilla CSS', 'GitHub Actions', 'Docker'],
      highlights: [
        'Score 100/100 Lighthouse performance, accessibility, and SEO rating',
        'Integrated Print Engine for clean 1-click A4 CV PDF export',
        'Extensible markdown & HTML article renderer ready for blog expansion',
      ],
      githubUrl: 'https://github.com/ga2631/ga2631.github.io',
      demoUrl: 'https://ga2631.github.io',
      featured: true,
    },
    {
      id: 'proj-4',
      title: 'Enterprise Task & Sprint Collaboration Hub',
      description: 'Full-stack agile project management suite with real-time kanban boards, markdown sprint notes, and team permissions.',
      category: 'Fullstack',
      tags: ['React', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker Compose'],
      highlights: [
        'Real-time optimistic UI updates with conflict resolution algorithms',
        'Customizable workflow pipelines, burndown charts, and exportable reports',
      ],
      githubUrl: 'https://github.com/ga2631',
      demoUrl: 'https://ga2631.github.io',
      featured: false,
    },
  ],

  skillCategories: [
    {
      title: 'Frontend Engineering',
      description: 'Creating accessible, lightning-fast, and responsive user interfaces',
      skills: [
        { name: 'React 19 / Next.js', level: 'Expert' },
        { name: 'TypeScript', level: 'Expert' },
        { name: 'Modern CSS3 / Vanilla CSS', level: 'Expert' },
        { name: 'HTML5 Semantic / SEO', level: 'Expert' },
        { name: 'State Management (Zustand / Redux)', level: 'Advanced' },
        { name: 'Vite / Webpack Build Tooling', level: 'Advanced' },
      ],
    },
    {
      title: 'Backend & Systems',
      description: 'Designing resilient microservices and performant APIs',
      skills: [
        { name: 'Node.js / Express / NestJS', level: 'Expert' },
        { name: 'Rust (Memory safety & performance)', level: 'Advanced' },
        { name: 'REST & GraphQL APIs', level: 'Expert' },
        { name: 'Microservices & Event-driven design', level: 'Advanced' },
        { name: 'Authentication & OAuth2 / JWT', level: 'Expert' },
      ],
    },
    {
      title: 'Databases & Storage',
      description: 'Relational, in-memory, and analytical database management',
      skills: [
        { name: 'PostgreSQL (Indexing & Partitioning)', level: 'Expert' },
        { name: 'Redis (Caching & Pub/Sub)', level: 'Advanced' },
        { name: 'DuckDB / Columnar Analytics', level: 'Advanced' },
        { name: 'Prisma / Drizzle ORM', level: 'Advanced' },
        { name: 'Schema Migration Management', level: 'Expert' },
      ],
    },
    {
      title: 'DevOps & Cloud Native',
      description: 'Automating pipelines, containerization, and infrastructure',
      skills: [
        { name: 'Docker & Multi-Stage Builds', level: 'Expert' },
        { name: 'Docker Compose', level: 'Expert' },
        { name: 'GitHub Actions CI/CD', level: 'Expert' },
        { name: 'Nginx Configuration & Reverse Proxy', level: 'Advanced' },
        { name: 'Linux / Bash Scripting', level: 'Advanced' },
        { name: 'AWS / Cloudflare CDN', level: 'Proficient' },
      ],
    },
  ],

  educations: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Software Engineering / Computer Science',
      institution: 'University of Information Technology (VNU-HCM)',
      location: 'Ho Chi Minh City, Vietnam',
      period: '2015 - 2019',
      gpaOrHonors: 'Good Standing (GPA: 3.4/4.0)',
      details: [
        'Core coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Distributed Computing, Software Architecture.',
        'Graduation Capstone: High-scalability E-commerce microservice platform with automated CI/CD deployment.',
      ],
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2023',
      credentialUrl: 'https://aws.amazon.com',
      badgeCode: 'AWS-SAA-2023',
    },
    {
      id: 'cert-2',
      name: 'Docker Certified Associate (DCA)',
      issuer: 'Docker Inc.',
      issueDate: '2022',
      credentialUrl: 'https://docker.com',
      badgeCode: 'DCA-2022',
    },
    {
      id: 'cert-3',
      name: 'Professional Scrum Master (PSM I)',
      issuer: 'Scrum.org',
      issueDate: '2021',
      credentialUrl: 'https://scrum.org',
      badgeCode: 'PSM-2021',
    },
  ],

  blogPosts: [
    {
      id: 'post-1',
      slug: 'react-19-production-architecture',
      title: 'Architecting High-Performance Web Apps with React 19 and Vite',
      summary: 'Exploring React 19 compiler optimizations, modern TypeScript patterns, and zero-runtime CSS for sub-second load times.',
      publishedAt: 'Sep 15, 2026',
      readTime: '6 min read',
      tags: ['React 19', 'TypeScript', 'Performance', 'Web Development'],
      author: 'Tan Huynh Nhat',
      contentHtml: `
        <h3>Introduction</h3>
        <p>With the release of React 19, modern web development has reached an exciting new peak. The combination of the new React compiler, native asset loading, and server-driven paradigms enables engineering teams to ship faster, lighter client experiences.</p>
        
        <h3>1. Key Architectural Improvements</h3>
        <p>In this article, we examine how we leveraged React 19 with Vite 6 to eliminate unnecessary re-renders and reduce main-thread execution time:</p>
        <ul>
          <li><strong>Compiler Automation:</strong> Automatic memoization without manual <code>useMemo</code> or <code>useCallback</code> overhead.</li>
          <li><strong>CSS Custom Property Tokens:</strong> Replacing heavy runtime CSS-in-JS with high-performance CSS variables and glassmorphism.</li>
          <li><strong>Zero-Overhead SVG Icon Registry:</strong> Inline vector rendering preventing layout shifts and bundle bloat.</li>
        </ul>

        <h3>2. Benchmark Results</h3>
        <p>By transitioning to this lean setup, initial DOM Interactive times dropped from 1.4s to 0.28s, with 100/100 scores across Google Lighthouse audits.</p>
      `,
    },
    {
      id: 'post-2',
      slug: 'modern-docker-nginx-ci-cd-github-pages',
      title: 'Building Automated CI/CD with Docker, Nginx, and GitHub Pages',
      summary: 'A deep dive into multi-stage Docker builds, Nginx SPA routing rules, and seamless GitHub Actions automated workflows.',
      publishedAt: 'Sep 10, 2026',
      readTime: '8 min read',
      tags: ['Docker', 'DevOps', 'GitHub Actions', 'Nginx', 'CI/CD'],
      author: 'Tan Huynh Nhat',
      contentHtml: `
        <h3>Why Multi-Stage Docker Builds Matter</h3>
        <p>Running web applications in modern production environments requires lightweight, secure container images. By utilizing a multi-stage Dockerfile, we separate the Node.js build environment from the final runtime container.</p>

        <h3>1. The Two-Stage Approach</h3>
        <p>Stage 1 compiles TypeScript and assets into static bundles using Node 22 Alpine. Stage 2 copies only the compiled <code>dist/</code> folder into a minimal Nginx Alpine image, resulting in a final container image under 25MB.</p>

        <h3>2. Automated GitHub Actions Deployments</h3>
        <p>With GitHub Actions, every pull request is validated through <code>tsc --noEmit</code> and <code>npm run build</code>, and every merge to the default branch triggers an atomic deployment to <code>ga2631.github.io</code>.</p>
      `,
    },
  ],
};
