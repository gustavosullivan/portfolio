import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const SITE_URL = "https://www.gudev.com.br";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gustavo Barbosa Portela — Full Stack & Engenharia de Software",
    template: "%s · Gustavo Portela",
  },
  description:
    "Desenvolvedor Full Stack e estudante de Ciência da Computação na Atitus. React, Next.js, NestJS, FastAPI, Rust, PostgreSQL, Supabase e Docker.",
  applicationName: "GuDev",
  keywords: [
    "Gustavo Barbosa Portela",
    "GuDev",
    "gudev.com.br",
    "Full Stack",
    "Desenvolvedor Full Stack",
    "Rust",
    "Next.js",
    "NestJS",
    "FastAPI",
    "Saicon",
    "Portfolio",
    "Passo Fundo",
  ],
  authors: [{ name: "Gustavo Barbosa Portela", url: SITE_URL }],
  creator: "Gustavo Barbosa Portela",
  publisher: "Gustavo Barbosa Portela",
  category: "technology",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      {
        url: "/favicon-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/favicon-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon-144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    title: "Gustavo Barbosa Portela — Full Stack & Engenharia de Software",
    description:
      "Desenvolvedor Full Stack — aplicações web e APIs escaláveis com foco em produção.",
    siteName: "GuDev · Gustavo Portela",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gustavo Barbosa Portela — Full Stack & Engenharia de Software",
    description:
      "Portfólio Full Stack: Saicon, SN800, SN250 e Truco Games.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const LOGO_URL = `${SITE_URL}/icon-512.png`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "GuDev",
      alternateName: "Gustavo Barbosa Portela",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
        width: 512,
        height: 512,
      },
      image: LOGO_URL,
      sameAs: [
        "https://github.com/gustavosullivan",
        "https://www.linkedin.com/in/gustavobportelacc",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "GuDev · Gustavo Portela",
      description:
        "Portfólio de Gustavo Barbosa Portela — desenvolvedor Full Stack.",
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Gustavo Barbosa Portela",
      url: SITE_URL,
      email: "mailto:gubportela@gmail.com",
      jobTitle: "Desenvolvedor Full Stack",
      image: LOGO_URL,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: [
        "https://github.com/gustavosullivan",
        "https://www.linkedin.com/in/gustavobportelacc",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Passo Fundo",
        addressCountry: "BR",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-[#ffe81f]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
