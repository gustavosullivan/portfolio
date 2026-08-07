export const pt = {
  nav: {
    menu: "Menu",
    ariaPrimary: "Navegação principal",
    links: [
      { href: "#about", label: "Perfil" },
      { href: "#tech", label: "Stack" },
      { href: "#projects", label: "Projetos" },
      { href: "#certificates", label: "Certificações" },
      { href: "#contact", label: "Contato" },
    ],
  },
  hero: {
    viewProjects: "Ver projetos",
    contact: "Contato",
    scroll: "Scroll",
  },
  site: {
    role: "Desenvolvedor Full Stack",
    roles: ["Desenvolvedor Full Stack", "Engenharia de Software"],
    tagline:
      "Estudante de Ciência da Computação na Atitus. Desenvolvo aplicações web e APIs escaláveis com foco em produção.",
    about:
      "Sou Desenvolvedor Full Stack e estudante do 4º semestre de Ciência da Computação na Atitus, apaixonado por tecnologia e pela criação de soluções modernas. Trabalho com React, Next.js, Node.js, NestJS, FastAPI, Rust, PostgreSQL, Supabase, Docker e Git, desenvolvendo aplicações web e APIs escaláveis. Estou em constante evolução, buscando aprimorar minhas habilidades e contribuir com projetos que gerem impacto real.",
    education: "4º semestre · Ciência da Computação · Atitus",
    location: "Passo Fundo, Brasil",
  },
  stats: [
    { label: "Semestre na Atitus", value: 4, suffix: "º" },
    { label: "Projetos profissionais", value: 3, suffix: "+" },
    { label: "Áreas de stack", value: 4, suffix: "" },
    { label: "Foco em produção", value: 100, suffix: "%" },
  ],
  aboutUi: {
    descriptionEyebrow: "Descrição",
    profileTitle: "Perfil",
    careerEyebrow: "Carreira",
    experienceTitle: "Experiência profissional",
  },
  experiences: [
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
      description: "Suporte técnico e infraestrutura de TI na Prefeitura Municipal.",
      highlights: [
        "Manutenção de hardware · formatação e clonagem com Clonezilla",
        "Impressoras · racks · equipamentos de rede",
        "Pontos de rede · Wi-Fi · conectividade dos setores",
        "Diagnóstico e resolução de problemas · periféricos",
      ],
    },
  ],
  tech: {
    stackEyebrow: "Stack",
    stackTitle: "Tecnologias",
    stackDesc: "Ferramentas do dia a dia — do front à infra.",
    methodsEyebrow: "Metodologias",
    methodsTitle: "Como eu entrego",
    methodsDesc: "Processo e qualidade no dia a dia.",
    filterAll: "Tudo",
    layers: [
      { id: "frontend", label: "Interface", blurb: "UI e apps web" },
      { id: "backend", label: "APIs", blurb: "Serviços e regras" },
      { id: "infra", label: "Dados & infra", blurb: "Persistência e deploy" },
      { id: "tools", label: "Fluxo", blurb: "Versionamento" },
    ],
    methodGroups: [
      { id: "agile", label: "Agilidade", blurb: "Entrega em ciclos" },
      { id: "engineering", label: "Engenharia", blurb: "Código sustentável" },
      { id: "quality", label: "Qualidade", blurb: "Revisão e deploy" },
    ],
    methodologies: [
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
    ],
    cloudEyebrow: "Cloud",
    cloudBlurb: "Computação em nuvem",
    cloudIntro:
      "Experiência com infraestrutura e serviços em nuvem para deploy, escala e operação de aplicações.",
    cloudLabel: "Cloud",
    clouds: [
      {
        name: "AWS",
        summary:
          "Amazon Web Services — uso de serviços de nuvem pra hospedar, escalar e operar aplicações: compute, storage, bancos gerenciados e deploy com foco em disponibilidade.",
      },
      {
        name: "Azure",
        summary:
          "Microsoft Azure — plataforma de nuvem pra infraestrutura e apps: VMs, App Services, bancos e integrações no ecossistema Microsoft, com deploy e monitoramento em produção.",
      },
    ],
    cloudModalEyebrow: "Computação em nuvem",
    methodModalFallback: "Metodologia",
  },
  projects: {
    eyebrow: "Projetos",
    title: "Profissionais",
    description:
      "SN800, SN250 e Truco Games — sistemas em produção com ownership Full Stack.",
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
    close: "Fechar",
    closeModal: "Fechar modal",
    items: [
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
        metrics: [
          { label: "Status", value: "2025+" },
          { label: "Modelo", value: "SaaS" },
          { label: "i18n", value: "PT/EN/ES" },
        ],
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
        metrics: [
          { label: "Escopo", value: "Full Stack" },
          { label: "Acesso", value: "Privado" },
          { label: "Campo", value: "RFID" },
        ],
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
        metrics: [
          { label: "Realtime", value: "WS" },
          { label: "Players", value: "até 4" },
          { label: "DB", value: "Neon" },
        ],
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
        metrics: [
          { label: "Stack", value: "Rust" },
          { label: "API", value: "Axum" },
          { label: "DB", value: "Postgres" },
        ],
      },
    ],
  },
  certificates: {
    eyebrow: "Certificados",
    title: "Certificações",
    description:
      "Certificado completo no centro. Laterais saem da página — role ou arraste para o próximo entrar.",
    titles: {
      "rust-ai-dev": "Santander 2026 — Rust AI Developer (Bootcamp)",
      "fundamentos-ia":
        "Fundamentos da IA Moderna: Machine Learning, LLMs, IA Generativa e Agentes",
      "carreira-ia":
        "Potencializando Seus Estudos e Carreira com IA (Chatbots, Copilotos e Agentes)",
      "apps-junior": "Qualificação em Desenvolvimento de Aplicações Júnior",
      "fullstack-qualifica":
        "Qualificação em Desenvolvimento de Soluções Full Stack",
    },
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos conversar",
    description:
      "Aberto a oportunidades, freelance e ideias. Escolhe o canal ou manda uma mensagem.",
    channelsEyebrow: "Canais",
    channelsHint: "Clique para abrir ou copiar",
    messageEyebrow: "Mensagem",
    messageHint: "Respondo o mais rápido possível",
    name: "Nome",
    namePlaceholder: "Seu nome",
    nameError: "Informe seu nome",
    email: "E-mail",
    emailPlaceholder: "voce@email.com",
    emailError: "E-mail inválido",
    message: "Mensagem",
    messagePlaceholder: "Conta um pouco sobre o projeto ou ideia…",
    messageError: "Escreva pelo menos algumas linhas",
    sending: "Enviando…",
    sent: "Mensagem enviada!",
    send: "Enviar mensagem",
    emailLabel: "E-mail",
    whatsappLabel: "WhatsApp",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
  },
  footer: {
    crafted: "© {year} — Feito com Next.js & Three.js",
    top: "Topo",
  },
} as const;
