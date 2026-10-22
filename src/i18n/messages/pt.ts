export const pt = {
  nav: {
    menu: "Menu",
    ariaPrimary: "Navegação principal",
    links: [
      { href: "#about", label: "Perfil" },
      { href: "#tech", label: "Stack" },
      { href: "#projects", label: "Projetos" },
      { href: "#certificates", label: "Certificações" },
      { href: "#resume", label: "Currículo" },
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
      "Sou Desenvolvedor Full Stack apaixonado por tecnologia e pela criação de soluções modernas. Trabalho com React, Next.js, Node.js, NestJS, FastAPI, Go, Rust, PostgreSQL, Supabase, Docker e Git — do front à API, com foco em produção, performance e ownership de ponta a ponta.",
    education: "Ciência da Computação · Atitus",
    location: "Passo Fundo, Brasil",
  },
  stats: [
    { label: "Projetos profissionais", value: 3, suffix: "+" },
    { label: "Áreas de stack", value: 4, suffix: "" },
    { label: "Foco em produção", value: 100, suffix: "%" },
  ],
  aboutUi: {
    descriptionEyebrow: "Descrição",
    profileTitle: "Perfil",
    careerEyebrow: "Carreira",
    experienceTitle: "Experiência profissional",
    focus: [
      "Apps web e APIs escaláveis em produção",
      "SaaS multi-tenant, painéis e integrações",
      "Arquitetura, deploy e sustentação end-to-end",
      "UX/UI, performance e código sustentável",
    ],
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
      "SN800, Elo Control, SN250 e Truco Games — ownership Full Stack.",
    filters: [
      { id: "all", label: "All" },
      { id: "saas", label: "SaaS" },
      { id: "systems", label: "Systems" },
      { id: "web", label: "Web" },
    ],
    caseStudy: "Case study",
    features: "Features",
    architecture: "Architecture",
    liveDemo: "Visitar",
    visit: "Visitar",
    github: "GitHub",
    close: "Fechar",
    closeModal: "Fechar modal",
    underConstruction: "Em construção — landing no ar, app ainda não funcional",
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
        id: "elo-control",
        title: "Elo Control",
        subtitle: "elocontrol.net — Sistema de Gestão Modular",
        description:
          "Sistema de gestão empresarial multi-tenant que une clientes, filas, atendimentos, pedidos, documentos, estoque e relatórios em uma plataforma modular — com módulos especializados por segmento.",
        features: [
          "Núcleo de gestão · clientes · filas · atendimentos · pedidos",
          "Documentos · estoque · relatórios financeiros e operacionais",
          "Multi-tenant · papéis · permissões · auditoria de ações",
          "Módulos sob medida · funerária · materiais de construção · custom",
          "Landing institucional · painel administrativo · suporte contínuo",
        ],
        architecture:
          "Next.js + NestJS + TypeScript + Supabase (PostgreSQL, RLS multi-tenant), com núcleo reutilizável e módulos especializados por segmento de negócio.",
        metrics: [
          { label: "Modelo", value: "SaaS" },
          { label: "Arquitetura", value: "Modular" },
          { label: "Tenant", value: "Multi" },
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
      "Aberto a oportunidades, freelance e ideias. Escolhe o canal ou manda no WhatsApp.",
    channelsEyebrow: "Canais",
    channelsHint: "Clique para abrir ou copiar",
    messageEyebrow: "Fala comigo",
    messageHint: "Gostou do meu trabalho? Me chama no WhatsApp e vamos conversar.",
    name: "Nome",
    namePlaceholder: "Seu nome",
    nameError: "Informe seu nome",
    email: "E-mail",
    emailPlaceholder: "voce@email.com",
    emailError: "E-mail inválido",
    message: "Mensagem",
    messagePlaceholder: "Conta um pouco sobre o projeto ou ideia…",
    messageError: "Escreva pelo menos 15 caracteres",
    sending: "Abrindo…",
    sent: "WhatsApp aberto!",
    send: "Enviar no WhatsApp",
    emailLabel: "E-mail",
    whatsappLabel: "WhatsApp",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    resumeLabel: "Currículo",
  },
  resume: {
    eyebrow: "Currículo",
    title: "Currículo em PDF",
    description:
      "Prévia resumida do currículo em PDF. Abre em um card centralizado — você também pode baixar o arquivo.",
    download: "Baixar PDF",
    close: "Fechar currículo",
    modalEyebrow: "Visualização",
  },
  footer: {
    crafted: "© {year} — Feito com Next.js & Three.js",
    top: "Topo",
  },
} as const;
