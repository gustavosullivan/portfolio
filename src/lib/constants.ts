import type {
  Certificate,
  Experience,
  MethodologyItem,
  Project,
  TechItem,
} from "@/types";
import { withBase } from "@/lib/utils";

export const SITE = {
  name: "Gustavo Barbosa Portela",
  role: "Desenvolvedor Full Stack",
  roles: ["Desenvolvedor Full Stack", "Engenharia de Software"],
  tagline:
    "Estudante de Ciência da Computação na Atitus. Desenvolvo aplicações web e APIs escaláveis com foco em produção.",
  heroStack:
    "React · Node.js · FastAPI · Rust · Next.js · PostgreSQL · Supabase · Git / GitHub",
  about:
    "Sou Desenvolvedor Full Stack e estudante do 4º semestre de Ciência da Computação na Atitus, apaixonado por tecnologia e pela criação de soluções modernas. Trabalho com React, Next.js, Node.js, NestJS, FastAPI, Rust, PostgreSQL, Supabase, Docker e Git, desenvolvendo aplicações web e APIs escaláveis. Estou em constante evolução, buscando aprimorar minhas habilidades e contribuir com projetos que gerem impacto real.",
  email: "gubportela@gmail.com",
  whatsapp: "https://wa.me/5554993698492",
  whatsappLabel: "(55) 54 99369-8492",
  linkedin: "https://www.linkedin.com/in/gustavobportelacc",
  linkedinLabel: "gustavobportelacc",
  github: "https://github.com/gustavosullivan",
  githubLabel: "gustavosullivan",
  location: "Passo Fundo, Brasil",
  education: "4º semestre · Ciência da Computação · Atitus",
  url: "https://github.com/gustavosullivan/portfolio",
} as const;

export const STATS = [
  { label: "Semestre na Atitus", value: 4, suffix: "º" },
  { label: "Projetos profissionais", value: 3, suffix: "+" },
  { label: "Áreas de stack", value: 4, suffix: "" },
  { label: "Foco em produção", value: 100, suffix: "%" },
] as const;

export const TECH_STACK: TechItem[] = [
  { name: "React", category: "frontend", color: "#61DAFB" },
  { name: "Next.js", category: "frontend", color: "#FFE81F" },
  { name: "NestJS", category: "backend", color: "#E0234E" },
  { name: "Node.js", category: "backend", color: "#68A063" },
  { name: "FastAPI", category: "backend", color: "#009688" },
  { name: "PostgreSQL", category: "infra", color: "#4A90C4" },
  { name: "Supabase", category: "infra", color: "#3ECF8E" },
  { name: "Docker", category: "infra", color: "#2496ED" },
  { name: "Git / GitHub", category: "tools", color: "#F05032" },
];

export const METHODOLOGIES: MethodologyItem[] = [
  {
    name: "Scrum",
    category: "agile",
    summary:
      "Sprints, planning e reviews para entregar valor em ciclos curtos e previsíveis.",
  },
  {
    name: "Kanban",
    category: "agile",
    summary:
      "Fluxo contínuo com limite de WIP — bom pra suporte, bugs e entregas paralelas.",
  },
  {
    name: "Agile",
    category: "agile",
    summary:
      "Iteração, feedback e adaptação — priorizo o que move o produto de verdade.",
  },
  {
    name: "Clean Code",
    category: "engineering",
    summary:
      "Código legível, nomes claros e funções pequenas pra o time evoluir sem medo.",
  },
  {
    name: "SOLID",
    category: "engineering",
    summary:
      "Princípios de design pra APIs e módulos mais estáveis e fáceis de estender.",
  },
  {
    name: "Code Review",
    category: "quality",
    summary:
      "Revisão em PRs pra alinhar qualidade, compartilhar contexto e evitar regressão.",
  },
  {
    name: "CI / CD",
    category: "quality",
    summary:
      "Automação de build e deploy pra reduzir risco e acelerar o caminho até produção.",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "saicon",
    role: "Desenvolvedor Full Stack",
    company: "Saicon Sistemas de Pesagem",
    period: "Atual · Full Stack · PO",
    description:
      "Desenvolvimento de aplicações web para balanças industriais em diversos mercados. Ciclo completo do produto — requisitos, implementação, deploy e sustentação — com autonomia e atuação como Product Owner.",
    highlights: [
      "APIs REST · Python · FastAPI · PostgreSQL · regras de negócio e integrações industriais",
      "React · Material UI · Framer Motion · UX/UI e performance",
      "Integração de sistemas · RFID · APIs de terceiros · soluções sob demanda",
      "NestJS · Supabase · novos projetos e arquitetura",
      "Product Owner · ownership · priorização · decisões técnicas",
      "Docker · Render · Netlify · Git",
    ],
  },
  {
    id: "prefeitura",
    role: "Estágio — Infraestrutura e Redes",
    company: "Prefeitura Municipal de Passo Fundo",
    period: "Suporte · TI",
    description:
      "Suporte técnico e infraestrutura de TI na Prefeitura Municipal.",
    highlights: [
      "Manutenção de hardware · formatação e clonagem com Clonezilla",
      "Impressoras · racks · equipamentos de rede",
      "Pontos de rede · Wi-Fi · conectividade dos setores",
      "Diagnóstico e resolução de problemas · periféricos",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "sn800",
    title: "SN800",
    subtitle: "sn800.com.br — Plataforma de Pesagem Florestal",
    description:
      "SaaS multi-tenant para operações de pesagem florestal — cadastros, monitoramento, relatórios e integração em tempo real com balanças.",
    features: [
      "Landing institucional · painel administrativo",
      "API REST · Route Handlers · dashboards · relatórios",
      "Supabase · multi-tenant · RLS · perfis de acesso",
      "Edge Functions · ingestão de pesagens · validação · idempotência",
      "Balanças · equipamentos · caminhões · materiais · operações",
      "Next.js · TypeScript · PT / EN / ES",
    ],
    architecture:
      "Next.js + TypeScript + Supabase (multi-tenant, RLS) + Edge Functions para ingestão e validação de pesagens, com APIs REST e dashboards operacionais.",
    tech: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Edge Functions",
      "RLS",
      "APIs REST",
    ],
    category: "saas",
    liveUrl: "https://sn800.com.br/",
    metrics: [
      { label: "Status", value: "2025+" },
      { label: "Modelo", value: "SaaS" },
      { label: "i18n", value: "PT/EN/ES" },
    ],
    accent: "#22D3EE",
  },
  {
    id: "sn250",
    title: "SN250",
    subtitle: "sgpsaicon.com.br — Gestão de Confinamentos",
    description:
      "Sistema para operação nutricional do rebanho — dietas, trato e análise de desempenho.",
    features: [
      "API FastAPI · regras de negócio · integrações",
      "Dietas · lotes · ingredientes · estoque · pesagens · cargas",
      "Dashboard · indicadores zootécnicos · custos · consumo por lote",
      "Planejamento do trato · editor visual · matéria seca",
      "Balanças · RFID · equipamentos de campo",
      "Multi-tenant · PostgreSQL · Redis · Docker",
    ],
    architecture:
      "FastAPI + PostgreSQL + Redis + Docker, com integrações RFID e equipamentos de campo para operação nutricional multi-tenant.",
    tech: ["FastAPI", "PostgreSQL", "Redis", "Docker", "RFID", "Integrações"],
    category: "systems",
    liveUrl: "https://sgpsaicon.com.br/",
    metrics: [
      { label: "Escopo", value: "Full Stack" },
      { label: "Acesso", value: "Privado" },
      { label: "Campo", value: "RFID" },
    ],
    accent: "#A78BFA",
  },
  {
    id: "truco",
    title: "Truco Games",
    subtitle: "trucogames.com — Truco online",
    description:
      "Aplicação web de truco online com servidor próprio, partidas em tempo real e microtransações.",
    features: [
      "Partidas online · até 4 jogadores · tempo real",
      "WebSocket · servidor próprio · sincronização de jogo",
      "Node.js · React · Neon (PostgreSQL) · DBeaver",
      "Microtransações · economia do jogo",
    ],
    architecture:
      "React + Node.js + WebSocket + Neon (PostgreSQL). Servidor próprio para sincronização de partidas e economia do jogo.",
    tech: ["React", "Node.js", "WebSocket", "Neon", "PostgreSQL", "DBeaver"],
    category: "web",
    liveUrl: "https://trucogames.com",
    metrics: [
      { label: "Realtime", value: "WS" },
      { label: "Players", value: "até 4" },
      { label: "DB", value: "Neon" },
    ],
    accent: "#60A5FA",
  },
  {
    id: "carteira-rust",
    title: "Carteira Rust",
    subtitle: "Carteira de Investimentos — Fullstack em Rust",
    description:
      "Aplicação fullstack para cadastrar e acompanhar ativos de investimento, com API REST, autenticação JWT, PostgreSQL e dashboard web com valor total da carteira.",
    features: [
      "Cadastro e login de usuários · JWT em cookie",
      "API REST · listar, criar e atualizar ativos",
      "Dashboard web · lista de ativos · valor total da carteira",
      "PostgreSQL · SQLx · migrations",
      "Docker Compose · Askama templates · Tailwind",
    ],
    architecture:
      "Rust + Axum para API e rotas web, SQLx + PostgreSQL, autenticação JWT em cookies e templates Askama para o dashboard.",
    tech: ["Rust", "Axum", "SQLx", "PostgreSQL", "JWT", "Docker", "Askama"],
    category: "systems",
    githubUrl:
      "https://github.com/gustavosullivan/Carteira-de-Investimentos-Inteligente-com-Rust",
    metrics: [
      { label: "Stack", value: "Rust" },
      { label: "API", value: "Axum" },
      { label: "DB", value: "Postgres" },
    ],
    accent: "#F97316",
  },
];

export const HARD_SKILLS = [
  "React",
  "Next.js",
  "Node.js",
  "NestJS",
  "FastAPI",
  "Rust",
  "TypeScript",
  "JavaScript (ES6+)",
  "HTML5 & CSS3",
  "Tailwind CSS",
  "PostgreSQL",
  "Supabase",
  "Prisma ORM",
  "REST APIs",
  "WebSockets",
  "Docker",
  "Git & GitHub",
  "Linux",
  "JWT Authentication",
  "Arquitetura de Software",
  "Microsserviços",
  "Clean Code",
  "SOLID",
  "Design Patterns",
  "Postman / Insomnia",
  "CI/CD · GitHub Actions",
  "Vercel",
  "Railway",
  "Redis",
] as const;

export const SOFT_SKILLS = [
  "Resolução de Problemas",
  "Pensamento Analítico",
  "Aprendizado Contínuo",
  "Comunicação Eficiente",
  "Trabalho em Equipe",
  "Proatividade",
  "Adaptabilidade",
  "Organização",
  "Gestão de Tempo",
  "Liderança",
  "Criatividade",
  "Atenção aos Detalhes",
  "Pensamento Crítico",
  "Inteligência Emocional",
  "Growth Mindset",
  "Qualidade de Código",
  "Pesquisa & Autoaprendizado",
  "Aprender novas tecnologias",
] as const;

export const DIFFERENTIALS = [
  "Desenvolvimento Full Stack",
  "APIs escaláveis",
  "Modelagem de Banco de Dados",
  "Integração entre sistemas",
  "Boas práticas",
  "Versionamento com Git",
  "Containers com Docker",
  "Deploy em Cloud",
  "Performance e Otimização",
  "Arquitetura moderna",
] as const;

export const CERTIFICATES: Certificate[] = [
  {
    id: "rust-ai-dev",
    title: "Santander 2026 — Rust AI Developer (Bootcamp)",
    issuer: "DIO · Santander",
    year: "2026",
    hours: "45h",
    image: withBase("/certificates/rust-ai-dev.png"),
    pdf: withBase("/certificates/rust-ai-dev.pdf"),
  },
  {
    id: "fundamentos-ia",
    title:
      "Fundamentos da IA Moderna: Machine Learning, LLMs, IA Generativa e Agentes",
    issuer: "DIO",
    year: "2026",
    hours: "2h",
    image: withBase("/certificates/fundamentos-ia.png"),
    pdf: withBase("/certificates/fundamentos-ia.pdf"),
  },
  {
    id: "carreira-ia",
    title:
      "Potencializando Seus Estudos e Carreira com IA (Chatbots, Copilotos e Agentes)",
    issuer: "DIO",
    year: "2026",
    hours: "2h",
    image: withBase("/certificates/carreira-ia.png"),
    pdf: withBase("/certificates/carreira-ia.pdf"),
  },
  {
    id: "apps-junior",
    title: "Qualificação em Desenvolvimento de Aplicações Júnior",
    issuer: "Atitus Educação",
    year: "2025/1",
    hours: "400h",
    image: withBase("/certificates/apps-junior.png"),
    pdf: withBase("/certificates/apps-junior.pdf"),
  },
  {
    id: "fullstack-qualifica",
    title: "Qualificação em Desenvolvimento de Soluções Full Stack",
    issuer: "Atitus Educação",
    year: "2025/2",
    hours: "400h",
    image: withBase("/certificates/fullstack-qualifica.png"),
    pdf: withBase("/certificates/fullstack-qualifica.pdf"),
  },
];

export const NAV_LINKS = [
  { href: "#about", label: "Perfil" },
  { href: "#tech", label: "Stack" },
  { href: "#projects", label: "Projetos" },
  { href: "#contact", label: "Contato" },
] as const;
