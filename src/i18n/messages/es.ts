import type { Messages } from "./types";

export const es = {
  nav: {
    menu: "Menú",
    ariaPrimary: "Navegación principal",
    links: [
      { href: "#about", label: "Perfil" },
      { href: "#tech", label: "Stack" },
      { href: "#projects", label: "Proyectos" },
      { href: "#certificates", label: "Certificaciones" },
      { href: "#contact", label: "Contacto" },
    ],
  },
  hero: {
    viewProjects: "Ver proyectos",
    contact: "Contacto",
    scroll: "Scroll",
  },
  site: {
    role: "Desarrollador Full Stack",
    roles: ["Desarrollador Full Stack", "Ingeniería de Software"],
    tagline:
      "Estudiante de Ciencias de la Computación en Atitus. Desarrollo aplicaciones web y APIs escalables con enfoque en producción.",
    about:
      "Soy Desarrollador Full Stack y estudiante del 4.º semestre de Ciencias de la Computación en Atitus, apasionado por la tecnología y la creación de soluciones modernas. Trabajo con React, Next.js, Node.js, NestJS, FastAPI, Rust, PostgreSQL, Supabase, Docker y Git, desarrollando aplicaciones web y APIs escalables. Estoy en constante evolución, buscando mejorar mis habilidades y contribuir a proyectos que generen impacto real.",
    education: "4.º semestre · Ciencias de la Computación · Atitus",
    location: "Passo Fundo, Brasil",
  },
  stats: [
    { label: "Semestre en Atitus", value: 4, suffix: "º" },
    { label: "Proyectos profesionales", value: 3, suffix: "+" },
    { label: "Áreas de stack", value: 4, suffix: "" },
    { label: "Enfoque en producción", value: 100, suffix: "%" },
  ],
  aboutUi: {
    descriptionEyebrow: "Descripción",
    profileTitle: "Perfil",
    careerEyebrow: "Carrera",
    experienceTitle: "Experiencia profesional",
  },
  experiences: [
    {
      id: "saicon",
      role: "Desarrollador Full Stack",
      company: "Saicon Sistemas de Pesagem",
      period: "Actual · Full Stack · PO",
      description:
        "Desarrollo de aplicaciones web para básculas industriales en diversos mercados. Ciclo completo del producto — requisitos, implementación, deploy y soporte — con autonomía y rol de Product Owner.",
      highlights: [
        "APIs REST · Python · FastAPI · PostgreSQL · reglas de negocio e integraciones industriales",
        "React · Material UI · Framer Motion · UX/UI y rendimiento",
        "Integración de sistemas · RFID · APIs de terceros · soluciones a demanda",
        "NestJS · Supabase · nuevos proyectos y arquitectura",
        "Product Owner · ownership · priorización · decisiones técnicas",
        "Docker · Render · Netlify · Git",
      ],
    },
    {
      id: "prefeitura",
      role: "Pasantía — Infraestructura y Redes",
      company: "Prefeitura Municipal de Passo Fundo",
      period: "Soporte · TI",
      description:
        "Soporte técnico e infraestructura de TI en la Prefeitura Municipal.",
      highlights: [
        "Mantenimiento de hardware · formateo y clonación con Clonezilla",
        "Impresoras · racks · equipos de red",
        "Puntos de red · Wi-Fi · conectividad de los sectores",
        "Diagnóstico y resolución de problemas · periféricos",
      ],
    },
  ],
  tech: {
    stackEyebrow: "Stack",
    stackTitle: "Tecnologías",
    stackDesc: "Herramientas del día a día — del front a la infra.",
    methodsEyebrow: "Metodologías",
    methodsTitle: "Cómo entrego",
    methodsDesc: "Proceso y calidad en el día a día.",
    filterAll: "Todo",
    layers: [
      { id: "frontend", label: "Interfaz", blurb: "UI y apps web" },
      { id: "backend", label: "APIs", blurb: "Servicios y reglas" },
      { id: "infra", label: "Datos e infra", blurb: "Persistencia y deploy" },
      { id: "tools", label: "Flujo", blurb: "Control de versiones" },
    ],
    methodGroups: [
      { id: "agile", label: "Agilidad", blurb: "Entrega en ciclos" },
      { id: "engineering", label: "Ingeniería", blurb: "Código sostenible" },
      { id: "quality", label: "Calidad", blurb: "Revisión y deploy" },
    ],
    methodologies: [
      {
        name: "Scrum",
        category: "agile",
        summary:
          "Sprints, planning y reviews para entregar valor en ciclos cortos y predecibles.",
      },
      {
        name: "Kanban",
        category: "agile",
        summary:
          "Flujo continuo con límite de WIP — ideal para soporte, bugs y entregas en paralelo.",
      },
      {
        name: "Agile",
        category: "agile",
        summary:
          "Iteración, feedback y adaptación — priorizo lo que realmente mueve el producto.",
      },
      {
        name: "Clean Code",
        category: "engineering",
        summary:
          "Código legible, nombres claros y funciones pequeñas para que el equipo evolucione sin miedo.",
      },
      {
        name: "SOLID",
        category: "engineering",
        summary:
          "Principios de diseño para APIs y módulos más estables y fáciles de extender.",
      },
      {
        name: "Code Review",
        category: "quality",
        summary:
          "Revisión en PRs para alinear calidad, compartir contexto y evitar regresiones.",
      },
      {
        name: "CI / CD",
        category: "quality",
        summary:
          "Automatización de build y deploy para reducir riesgo y acelerar el camino a producción.",
      },
    ],
    cloudEyebrow: "Cloud",
    cloudBlurb: "Computación en la nube",
    cloudIntro:
      "Experiencia con infraestructura y servicios en la nube para deploy, escala y operación de aplicaciones.",
    cloudLabel: "Cloud",
    clouds: [
      {
        name: "AWS",
        summary:
          "Amazon Web Services — uso de servicios en la nube para hospedar, escalar y operar aplicaciones: compute, storage, bases gestionadas y deploy con foco en disponibilidad.",
      },
      {
        name: "Azure",
        summary:
          "Microsoft Azure — plataforma en la nube para infraestructura y apps: VMs, App Services, bases de datos e integraciones en el ecosistema Microsoft, con deploy y monitoreo en producción.",
      },
    ],
    cloudModalEyebrow: "Computación en la nube",
    methodModalFallback: "Metodología",
  },
  projects: {
    eyebrow: "Proyectos",
    title: "Profesionales",
    description:
      "SN800, SN250 y Truco Games — sistemas en producción con ownership Full Stack.",
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
    close: "Cerrar",
    closeModal: "Cerrar modal",
    items: [
      {
        id: "sn800",
        title: "SN800",
        subtitle: "sn800.com.br — Plataforma de Pesaje Forestal",
        description:
          "SaaS multi-tenant para operaciones de pesaje forestal — registros, monitoreo, reportes e integración en tiempo real con básculas.",
        features: [
          "Landing institucional · panel administrativo",
          "API REST · Route Handlers · dashboards · reportes",
          "Supabase · multi-tenant · RLS · perfiles de acceso",
          "Edge Functions · ingestión de pesajes · validación · idempotencia",
          "Básculas · equipos · camiones · materiales · operaciones",
          "Next.js · TypeScript · PT / EN / ES",
        ],
        architecture:
          "Next.js + TypeScript + Supabase (multi-tenant, RLS) + Edge Functions para ingestión y validación de pesajes, con APIs REST y dashboards operativos.",
        metrics: [
          { label: "Status", value: "2025+" },
          { label: "Modelo", value: "SaaS" },
          { label: "i18n", value: "PT/EN/ES" },
        ],
      },
      {
        id: "sn250",
        title: "SN250",
        subtitle: "sgpsaicon.com.br — Gestión de Confinamientos",
        description:
          "Sistema para la operación nutricional del rebaño — dietas, alimento y análisis de rendimiento.",
        features: [
          "API FastAPI · reglas de negocio · integraciones",
          "Dietas · lotes · ingredientes · stock · pesajes · cargas",
          "Dashboard · indicadores zootécnicos · costos · consumo por lote",
          "Planificación del alimento · editor visual · materia seca",
          "Básculas · RFID · equipos de campo",
          "Multi-tenant · PostgreSQL · Redis · Docker",
        ],
        architecture:
          "FastAPI + PostgreSQL + Redis + Docker, con integraciones RFID y equipos de campo para operación nutricional multi-tenant.",
        metrics: [
          { label: "Alcance", value: "Full Stack" },
          { label: "Acceso", value: "Privado" },
          { label: "Campo", value: "RFID" },
        ],
      },
      {
        id: "truco",
        title: "Truco Games",
        subtitle: "trucogames.com — Truco online",
        description:
          "Aplicación web de truco online con servidor propio, partidas en tiempo real y microtransacciones.",
        features: [
          "Partidas online · hasta 4 jugadores · tiempo real",
          "WebSocket · servidor propio · sincronización de juego",
          "Node.js · React · Neon (PostgreSQL) · DBeaver",
          "Microtransacciones · economía del juego",
        ],
        architecture:
          "React + Node.js + WebSocket + Neon (PostgreSQL). Servidor propio para sincronización de partidas y economía del juego.",
        metrics: [
          { label: "Realtime", value: "WS" },
          { label: "Players", value: "hasta 4" },
          { label: "DB", value: "Neon" },
        ],
      },
      {
        id: "carteira-rust",
        title: "Carteira Rust",
        subtitle: "Cartera de Inversiones — Fullstack en Rust",
        description:
          "Aplicación fullstack para registrar y seguir activos de inversión, con API REST, autenticación JWT, PostgreSQL y dashboard web con el valor total de la cartera.",
        features: [
          "Registro e inicio de sesión · JWT en cookie",
          "API REST · listar, crear y actualizar activos",
          "Dashboard web · lista de activos · valor total de la cartera",
          "PostgreSQL · SQLx · migrations",
          "Docker Compose · Askama templates · Tailwind",
        ],
        architecture:
          "Rust + Axum para API y rutas web, SQLx + PostgreSQL, autenticación JWT en cookies y templates Askama para el dashboard.",
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
    title: "Certificaciones",
    description:
      "Certificado completo en el centro. Los laterales salen de la página — desplázate o arrastra para que entre el siguiente.",
    titles: {
      "rust-ai-dev": "Santander 2026 — Rust AI Developer (Bootcamp)",
      "fundamentos-ia":
        "Fundamentos de la IA Moderna: Machine Learning, LLMs, IA Generativa y Agentes",
      "carreira-ia":
        "Potenciando Tus Estudios y Carrera con IA (Chatbots, Copilotos y Agentes)",
      "apps-junior": "Cualificación en Desarrollo de Aplicaciones Junior",
      "fullstack-qualifica":
        "Cualificación en Desarrollo de Soluciones Full Stack",
    },
  },
  contact: {
    eyebrow: "Contacto",
    title: "Hablemos",
    description:
      "Abierto a oportunidades, freelance e ideas. Elige el canal o envía un mensaje.",
    channelsEyebrow: "Canales",
    channelsHint: "Haz clic para abrir o copiar",
    messageEyebrow: "Mensaje",
    messageHint: "Respondo lo más rápido posible",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    nameError: "Ingresa tu nombre",
    email: "Correo",
    emailPlaceholder: "tu@email.com",
    emailError: "Correo inválido",
    message: "Mensaje",
    messagePlaceholder: "Cuéntame un poco sobre el proyecto o idea…",
    messageError: "Escribe al menos algunas líneas",
    sending: "Enviando…",
    sent: "¡Mensaje enviado!",
    send: "Enviar mensaje",
    emailLabel: "Correo",
    whatsappLabel: "WhatsApp",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
  },
  footer: {
    crafted: "© {year} — Hecho con Next.js & Three.js",
    top: "Inicio",
  },
} satisfies Messages;
