import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/gustavosullivan/portfolio"),
  title: {
    default: "Gustavo Barbosa Portela — Full Stack & Engenharia de Software",
    template: "%s · Gustavo Portela",
  },
  description:
    "Desenvolvedor Full Stack e estudante de Ciência da Computação na Atitus. React, Next.js, NestJS, FastAPI, Rust, PostgreSQL, Supabase e Docker.",
  keywords: [
    "Gustavo Barbosa Portela",
    "Full Stack",
    "Rust",
    "Next.js",
    "NestJS",
    "FastAPI",
    "Saicon",
    "Portfolio",
  ],
  authors: [{ name: "Gustavo Barbosa Portela" }],
  creator: "Gustavo Barbosa Portela",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://github.com/gustavosullivan/portfolio",
    title: "Gustavo Barbosa Portela — Full Stack & Engenharia de Software",
    description:
      "Desenvolvedor Full Stack — aplicações web e APIs escaláveis com foco em produção.",
    siteName: "Gustavo Portela",
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
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
