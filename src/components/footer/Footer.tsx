"use client";

import { ArrowUp } from "lucide-react";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/i18n";

export function Footer() {
  const { t } = useI18n();
  const year = String(new Date().getFullYear());

  return (
    <footer className="glass-footer section-pad py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="display text-lg font-semibold text-[#00f0ff]">
            {SITE.name.split(" ")[0]}
            <span className="text-[#00f0ff]">.</span>
          </p>
          <p className="mt-1 text-sm text-[#00f0ff]/45">
            {t.footer.crafted.replace("{year}", year)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-[#00f0ff]/55">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[#00f0ff]"
          >
            GitHub
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[#00f0ff]"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="transition-colors hover:text-[#00f0ff]"
          >
            Email
          </a>
          <a
            href="#top"
            className="glass inline-flex items-center gap-2 px-3 py-2 text-xs tracking-wider text-[#00f0ff]/75 uppercase transition-colors hover:text-[#00f0ff]"
          >
            {t.footer.top} <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
