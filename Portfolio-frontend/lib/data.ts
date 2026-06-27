export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { label: 'Email', href: 'mailto:dev@example.com', icon: 'mail' },
];

export const roles = [
  'Full Stack Developer',
  'AI Engineer',
  'FinTech Builder',
  'Linux Enthusiast',
  'Open Source Contributor',
];

export const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '20+', label: 'Projects Shipped' },
  { value: '8+', label: 'Tech Stacks' },
  { value: '∞', label: 'Lines of Code' },
];

export const skills = {
  Frontend: [
    { name: 'React', level: 95 },
    { name: 'Next.js', level: 92 },
    { name: 'TypeScript', level: 90 },
    { name: 'Tailwind CSS', level: 95 },
    { name: 'Framer Motion', level: 85 },
  ],
  Backend: [
    { name: 'Node.js', level: 90 },
    { name: 'Python', level: 88 },
    { name: 'FastAPI', level: 85 },
    { name: 'Express', level: 88 },
    { name: 'GraphQL', level: 80 },
  ],
  AI: [
    { name: 'LangChain', level: 82 },
    { name: 'OpenAI API', level: 90 },
    { name: 'HuggingFace', level: 78 },
    { name: 'TensorFlow', level: 72 },
    { name: 'PyTorch', level: 70 },
  ],
  Database: [
    { name: 'PostgreSQL', level: 88 },
    { name: 'MongoDB', level: 85 },
    { name: 'Redis', level: 82 },
    { name: 'Supabase', level: 88 },
    { name: 'Prisma', level: 85 },
  ],
  DevOps: [
    { name: 'Docker', level: 85 },
    { name: 'GitHub Actions', level: 88 },
    { name: 'Linux', level: 90 },
    { name: 'Vercel', level: 92 },
    { name: 'AWS', level: 75 },
  ],
  Mobile: [
    { name: 'React Native', level: 80 },
    { name: 'Expo', level: 82 },
    { name: 'Flutter', level: 65 },
  ],
};

export const projects = [
  {
    id: 1,
    title: 'MonetIQ',
    subtitle: 'AI-Powered Financial Intelligence',
    description: 'A next-generation fintech platform that leverages machine learning to provide real-time investment insights, portfolio optimization, and automated trading signals. Built for retail investors who demand institutional-grade analytics.',
    image: '/projects/monetiq.png',
    gradient: 'from-purple-600 to-blue-600',
    tech: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'OpenAI', 'Stripe', 'Redis'],
    github: 'https://github.com',
    demo: 'https://example.com',
    featured: true,
    category: 'FinTech',
  },
  {
    id: 2,
    title: 'CBT Exam Portal',
    subtitle: 'Computer-Based Testing Platform',
    description: 'Enterprise-grade examination platform supporting 10,000+ concurrent users. Features adaptive testing algorithms, real-time proctoring, detailed analytics dashboards, and multi-tenant architecture for educational institutions.',
    image: '/projects/cbt.png',
    gradient: 'from-cyan-600 to-teal-600',
    tech: ['React', 'Node.js', 'MongoDB', 'WebSocket', 'Docker', 'AWS'],
    github: 'https://github.com',
    demo: 'https://example.com',
    featured: true,
    category: 'EdTech',
  },
  {
    id: 3,
    title: 'AROS AI Assistant',
    subtitle: 'Autonomous Research & Operations System',
    description: 'Sophisticated AI assistant that combines web research, document analysis, and autonomous task execution. Powered by a multi-agent architecture with tool use, memory persistence, and natural language planning capabilities.',
    image: '/projects/aros.png',
    gradient: 'from-pink-600 to-rose-600',
    tech: ['Python', 'LangChain', 'FastAPI', 'OpenAI', 'Supabase', 'React'],
    github: 'https://github.com',
    demo: 'https://example.com',
    featured: true,
    category: 'AI/ML',
  },
  {
    id: 4,
    title: 'CodyChat',
    subtitle: 'Developer-First AI Chat Interface',
    description: 'Code-aware chat application with syntax highlighting, multi-model support, conversation branching, and workspace collaboration. Built to supercharge developer productivity with AI-assisted coding workflows.',
    image: '/projects/codychat.png',
    gradient: 'from-amber-500 to-orange-600',
    tech: ['Next.js', 'TypeScript', 'OpenAI', 'Prisma', 'PostgreSQL', 'Tailwind'],
    github: 'https://github.com',
    demo: 'https://example.com',
    featured: false,
    category: 'Dev Tools',
  },
];

export const experience = [
  {
    id: 1,
    role: 'Senior Full Stack Engineer',
    company: 'TechCorp Global',
    period: '2023 – Present',
    location: 'Remote',
    description: 'Leading development of AI-powered features across fintech and productivity products. Architecting scalable microservices, mentoring junior developers, and driving adoption of modern development practices.',
    tech: ['Next.js', 'Python', 'AWS', 'PostgreSQL', 'OpenAI'],
    type: 'full-time',
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    company: 'InnovateLab',
    period: '2022 – 2023',
    location: 'Lagos, NG',
    description: 'Built and launched 3 production SaaS products from zero to paying customers. Implemented real-time features using WebSockets, designed database schemas, and integrated third-party APIs.',
    tech: ['React', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
    type: 'full-time',
  },
  {
    id: 3,
    role: 'Frontend Developer',
    company: 'StartupXYZ',
    period: '2021 – 2022',
    location: 'Remote',
    description: 'Developed responsive web applications serving 50K+ monthly active users. Collaborated with designers to implement pixel-perfect UIs and improved core web vitals by 40%.',
    tech: ['React', 'TypeScript', 'Tailwind', 'GraphQL'],
    type: 'contract',
  },
  {
    id: 4,
    role: 'Software Engineer Intern',
    company: 'Digital Agency Co.',
    period: '2020 – 2021',
    location: 'Lagos, NG',
    description: 'Contributed to client projects in e-commerce and content management. Built reusable component libraries, fixed production bugs, and participated in code reviews.',
    tech: ['JavaScript', 'Vue.js', 'PHP', 'MySQL'],
    type: 'internship',
  },
];

export const certifications = [
  { title: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2024', icon: '☁️' },
  { title: 'Google Cloud Professional', issuer: 'Google Cloud', year: '2023', icon: '🌐' },
  { title: 'Meta React Developer', issuer: 'Meta', year: '2023', icon: '⚛️' },
  { title: 'OpenAI API Fundamentals', issuer: 'OpenAI', year: '2024', icon: '🤖' },
  { title: 'Docker & Kubernetes', issuer: 'CNCF', year: '2023', icon: '🐳' },
  { title: 'Linux Professional', issuer: 'LPI', year: '2022', icon: '🐧' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CTO at TechCorp',
    avatar: 'SC',
    text: 'One of the most technically gifted developers I\'ve worked with. Delivered a complex AI feature in half the estimated time without sacrificing code quality.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Founder, FinStartup',
    avatar: 'MJ',
    text: 'Built our entire fintech platform from scratch. The attention to performance and security was exceptional. Our product went from idea to production in 3 months.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Amara Osei',
    role: 'Product Lead, EdTech Co.',
    avatar: 'AO',
    text: 'The CBT platform exceeded all our expectations. Handles exam days with thousands of concurrent users flawlessly. The code architecture is clean and maintainable.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Liam Torres',
    role: 'Engineering Manager',
    avatar: 'LT',
    text: 'Incredible full stack skills combined with a deep understanding of AI/ML. A rare combination that brings real business value to every project.',
    rating: 5,
  },
];

export const blogPosts = [
  {
    id: 1,
    title: 'Building Production AI Agents with LangChain in 2025',
    excerpt: 'A deep dive into building reliable, scalable AI agents for real-world applications — covering memory, tool use, and deployment strategies.',
    date: 'June 10, 2025',
    readTime: '12 min read',
    tag: 'AI/ML',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    id: 2,
    title: 'The Architecture Behind Scalable Real-Time Systems',
    excerpt: 'How I designed a WebSocket-based system handling 10,000 concurrent connections for the CBT Exam Portal, and what I learned along the way.',
    date: 'May 22, 2025',
    readTime: '8 min read',
    tag: 'Backend',
    gradient: 'from-cyan-600 to-teal-600',
  },
  {
    id: 3,
    title: 'Next.js 15 Performance Patterns You Should Know',
    excerpt: 'Practical patterns and techniques for building blazing-fast Next.js 15 applications — from Server Components to streaming and caching strategies.',
    date: 'April 15, 2025',
    readTime: '10 min read',
    tag: 'Frontend',
    gradient: 'from-pink-600 to-rose-600',
  },
];
