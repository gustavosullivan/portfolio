export type ProjectCategory = "saas" | "systems" | "web" | "all";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  architecture: string;
  tech: string[];
  category: Exclude<ProjectCategory, "all">;
  liveUrl?: string;
  githubUrl?: string;
  metrics: { label: string; value: string }[];
  accent: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  hours?: string;
  image: string;
  pdf?: string;
  url?: string;
}

export interface TechItem {
  name: string;
  category: "backend" | "frontend" | "infra" | "tools";
  color: string;
}

export interface MethodologyItem {
  name: string;
  category: "agile" | "engineering" | "quality";
  summary: string;
}
