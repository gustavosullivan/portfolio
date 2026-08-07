"use client";

import { ArrowUp } from "lucide-react";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/i18n";

export function Footer() {
  const { t } = useI18n();
  const year = String(new Date().getFullYear());

  return (
    <footer className="section-pad border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="display text-lg font-semibold text-[#ffe81f]">
            {SITE.name.split(" ")[0]}
            <span className="text-[#ffe81f]">.</span>
          </p>
          <p className="mt-1 text-sm text-[#ffe81f]/40">
            {t.footer.crafted.replace("{year}", year)}
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm text-[#ffe81f]/50">
          <a href={SITE.github} target="_blank" rel="noreferrer" className="hover:text-[#ffe81f]">
            GitHub
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#ffe81f]">
            LinkedIn
          </a>
          <a href={`mailto:${SITE.email}`} className="hover:text-[#ffe81f]">
            Email
          </a>
          <a
            href="#top"
            className="glass inline-flex items-center gap-2 px-3 py-2 text-xs tracking-wider text-[#ffe81f]/70 uppercase hover:text-[#ffe81f]"
          >
            {t.footer.top} <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
