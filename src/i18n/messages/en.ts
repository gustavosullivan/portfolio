import type { Messages } from "./types";

export const en = {
  nav: {
    menu: "Menu",
    ariaPrimary: "Primary navigation",
    links: [
      { href: "#about", label: "Profile" },
      { href: "#tech", label: "Stack" },
      { href: "#projects", label: "Projects" },
      { href: "#certificates", label: "Certificates" },
      { href: "#contact", label: "Contact" },
    ],
  },
  hero: {
    viewProjects: "View projects",
    contact: "Contact",
    scroll: "Scroll",
  },
  site: {
    role: "Full Stack Developer",
    roles: ["Full Stack Developer", "Software Engineering"],
    tagline:
      "Computer Science student at Atitus. I build web applications and scalable APIs with a production focus.",
    about:
      "I'm a Full Stack Developer and a 4th-semester Computer Science student at Atitus, passionate about technology and building modern solutions. I work with React, Next.js, Node.js, NestJS, FastAPI, Rust, PostgreSQL, Supabase, Docker, and Git, developing web applications and scalable APIs. I'm constantly evolving, sharpening my skills and contributing to projects that deliver real impact.",
    education: "4th semester · Computer Science · Atitus",
    location: "Passo Fundo, Brazil",
  },
  stats: [
    { label: "Semester at Atitus", value: 4, suffix: "th" },
    { label: "Professional projects", value: 3, suffix: "+" },
    { label: "Stack areas", value: 4, suffix: "" },
    { label: "Production focus", value: 100, suffix: "%" },
  ],
  aboutUi: {
    descriptionEyebrow: "Description",
    profileTitle: "Profile",
    careerEyebrow: "Career",
    experienceTitle: "Professional experience",
  },
  experiences: [
    {
      id: "saicon",
      role: "Full Stack Developer",
      company: "Saicon Sistemas de Pesagem",
      period: "Current · Full Stack · PO",
      description:
        "Building web applications for industrial scales across multiple markets. Full product cycle — requirements, implementation, deploy, and support — with autonomy and Product Owner responsibilities.",
      highlights: [
        "REST APIs · Python · FastAPI · PostgreSQL · business rules and industrial integrations",
        "React · Material UI · Framer Motion · UX/UI and performance",
        "System integration · RFID · third-party APIs · on-demand solutions",
        "NestJS · Supabase · new projects and architecture",
        "Product Owner · ownership · prioritization · technical decisions",
        "Docker · Render · Netlify · Git",
      ],
    },
    {
      id: "prefeitura",
      role: "Internship — Infrastructure & Networking",
      company: "Passo Fundo City Hall",
      period: "Support · IT",
      description:
        "Technical support and IT infrastructure at the Municipal Government.",
      highlights: [
        "Hardware maintenance · formatting and cloning with Clonezilla",
        "Printers · racks · networking equipment",
        "Network points · Wi-Fi · department connectivity",
        "Troubleshooting · peripherals",
      ],
    },
  ],
  tech: {
    stackEyebrow: "Stack",
    stackTitle: "Technologies",
    stackDesc: "Day-to-day tools — from front end to infra.",
    methodsEyebrow: "Methodologies",
    methodsTitle: "How I deliver",
    methodsDesc: "Process and quality every day.",
    filterAll: "All",
    layers: [
      { id: "frontend", label: "Interface", blurb: "UI and web apps" },
      { id: "backend", label: "APIs", blurb: "Services and rules" },
      { id: "infra", label: "Data & infra", blurb: "Persistence and deploy" },
      { id: "tools", label: "Workflow", blurb: "Version control" },
    ],
    methodGroups: [
      { id: "agile", label: "Agility", blurb: "Delivery in cycles" },
      { id: "engineering", label: "Engineering", blurb: "Sustainable code" },
      { id: "quality", label: "Quality", blurb: "Review and deploy" },
    ],
    methodologies: [
      {
        name: "Scrum",
        category: "agile",
        summary:
          "Sprints, planning, and reviews to deliver value in short, predictable cycles.",
      },
      {
        name: "Kanban",
        category: "agile",
        summary:
          "Continuous flow with WIP limits — great for support, bugs, and parallel deliveries.",
      },
      {
        name: "Agile",
        category: "agile",
        summary:
          "Iteration, feedback, and adaptation — I prioritize what truly moves the product.",
      },
      {
        name: "Clean Code",
        category: "engineering",
        summary:
          "Readable code, clear names, and small functions so the team can evolve without fear.",
      },
      {
        name: "SOLID",
        category: "engineering",
        summary:
          "Design principles for more stable APIs and modules that are easier to extend.",
      },
      {
        name: "Code Review",
        category: "quality",
        summary:
          "PR reviews to align quality, share context, and prevent regressions.",
      },
      {
        name: "CI / CD",
        category: "quality",
        summary:
          "Build and deploy automation to reduce risk and speed the path to production.",
      },
    ],
    cloudEyebrow: "Cloud",
    cloudBlurb: "Cloud computing",
    cloudIntro:
      "Experience with cloud infrastructure and services for deploy, scale, and application operations.",
    cloudLabel: "Cloud",
    clouds: [
      {
        name: "AWS",
        summary:
          "Amazon Web Services — cloud services to host, scale, and operate applications: compute, storage, managed databases, and deploy with a focus on availability.",
      },
      {
        name: "Azure",
        summary:
          "Microsoft Azure — cloud platform for infrastructure and apps: VMs, App Services, databases, and Microsoft ecosystem integrations, with production deploy and monitoring.",
      },
    ],
    cloudModalEyebrow: "Cloud computing",
    methodModalFallback: "Methodology",
  },
  projects: {
    eyebrow: "Projects",
    title: "Professional",
    description:
      "SN800, SN250, and Truco Games — production systems with Full Stack ownership.",
    filters: [
      { id: "all", label: "All" },
      { id: "saas", label: "SaaS" },
      { id: "systems", label: "Systems" },
      { id: "web", label: "Web" },
    ],
    caseStudy: "Case study",
    features: "Features",
    architecture: "Architecture",
    liveDemo: "Live Demo",
    github: "GitHub",
    close: "Close",
    closeModal: "Close modal",
    items: [
      {
        id: "sn800",
        title: "SN800",
        subtitle: "sn800.com.br — Forestry Weighing Platform",
        description:
          "Multi-tenant SaaS for forestry weighing operations — registries, monitoring, reports, and real-time scale integration.",
        features: [
          "Institutional landing · admin panel",
          "REST API · Route Handlers · dashboards · reports",
          "Supabase · multi-tenant · RLS · access profiles",
          "Edge Functions · weighing ingestion · validation · idempotency",
          "Scales · equipment · trucks · materials · operations",
          "Next.js · TypeScript · PT / EN / ES",
        ],
        architecture:
          "Next.js + TypeScript + Supabase (multi-tenant, RLS) + Edge Functions for weighing ingestion and validation, with REST APIs and operational dashboards.",
        metrics: [
          { label: "Status", value: "2025+" },
          { label: "Model", value: "SaaS" },
          { label: "i18n", value: "PT/EN/ES" },
        ],
      },
      {
        id: "sn250",
        title: "SN250",
        subtitle: "sgpsaicon.com.br — Feedlot Management",
        description:
          "System for herd nutritional operations — diets, feeding, and performance analysis.",
        features: [
          "FastAPI API · business rules · integrations",
          "Diets · batches · ingredients · inventory · weighings · loads",
          "Dashboard · zootechnical indicators · costs · batch consumption",
          "Feeding planning · visual editor · dry matter",
          "Scales · RFID · field equipment",
          "Multi-tenant · PostgreSQL · Redis · Docker",
        ],
        architecture:
          "FastAPI + PostgreSQL + Redis + Docker, with RFID and field equipment integrations for multi-tenant nutritional operations.",
        metrics: [
          { label: "Scope", value: "Full Stack" },
          { label: "Access", value: "Private" },
          { label: "Field", value: "RFID" },
        ],
      },
      {
        id: "truco",
        title: "Truco Games",
        subtitle: "trucogames.com — Online Truco",
        description:
          "Online truco web app with a custom server, real-time matches, and microtransactions.",
        features: [
          "Online matches · up to 4 players · real time",
          "WebSocket · custom server · game synchronization",
          "Node.js · React · Neon (PostgreSQL) · DBeaver",
          "Microtransactions · in-game economy",
        ],
        architecture:
          "React + Node.js + WebSocket + Neon (PostgreSQL). Custom server for match sync and in-game economy.",
        metrics: [
          { label: "Realtime", value: "WS" },
          { label: "Players", value: "up to 4" },
          { label: "DB", value: "Neon" },
        ],
      },
      {
        id: "carteira-rust",
        title: "Carteira Rust",
        subtitle: "Investment Portfolio — Fullstack in Rust",
        description:
          "Fullstack app to register and track investment assets, with a REST API, JWT auth, PostgreSQL, and a web dashboard showing total portfolio value.",
        features: [
          "User signup and login · JWT in cookie",
          "REST API · list, create, and update assets",
          "Web dashboard · asset list · total portfolio value",
          "PostgreSQL · SQLx · migrations",
          "Docker Compose · Askama templates · Tailwind",
        ],
        architecture:
          "Rust + Axum for API and web routes, SQLx + PostgreSQL, JWT auth in cookies, and Askama templates for the dashboard.",
        metrics: [
          { label: "Stack", value: "Rust" },
          { label: "API", value: "Axum" },
          { label: "DB", value: "Postgres" },
        ],
      },
    ],
  },
  certificates: {
    eyebrow: "Certificates",
    title: "Certifications",
    description:
      "Full certificate in the center. Side cards leave the page — scroll or drag to bring the next one in.",
    titles: {
      "rust-ai-dev": "Santander 2026 — Rust AI Developer (Bootcamp)",
      "fundamentos-ia":
        "Fundamentals of Modern AI: Machine Learning, LLMs, Generative AI & Agents",
      "carreira-ia":
        "Boosting Your Studies and Career with AI (Chatbots, Copilots & Agents)",
      "apps-junior": "Junior Application Development Qualification",
      "fullstack-qualifica": "Full Stack Solutions Development Qualification",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk",
    description:
      "Open to opportunities, freelance, and ideas. Pick a channel or send a message.",
    channelsEyebrow: "Channels",
    channelsHint: "Click to open or copy",
    messageEyebrow: "Message",
    messageHint: "I'll reply as soon as possible",
    name: "Name",
    namePlaceholder: "Your name",
    nameError: "Please enter your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    emailError: "Invalid email",
    message: "Message",
    messagePlaceholder: "Tell me a bit about the project or idea…",
    messageError: "Please write at least a few lines",
    sending: "Sending…",
    sent: "Message sent!",
    send: "Send message",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
  },
  footer: {
    crafted: "© {year} — Built with Next.js & Three.js",
    top: "Top",
  },
} satisfies Messages;
