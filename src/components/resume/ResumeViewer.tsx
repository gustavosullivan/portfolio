"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/i18n";

const RESUME_OPEN_EVENT = "open-resume-viewer";

export function openResumeViewer() {
  window.dispatchEvent(new CustomEvent(RESUME_OPEN_EVENT));
}

export function ResumeViewerHost() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(RESUME_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(RESUME_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const modal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label={t.resume.close}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            <div className="relative flex min-h-full items-center justify-center p-3 sm:p-5 md:p-8">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="resume-modal-title"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="glass relative z-10 flex w-full max-w-[min(100%,26rem)] flex-col overflow-hidden border border-[#00f0ff]/20 bg-black/80 shadow-[0_0_48px_rgba(125, 211, 252,0.1)] backdrop-blur-xl sm:max-w-md md:max-w-lg"
              >
                <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[#00f0ff]/10 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5 md:px-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9px] tracking-[0.22em] text-[#00f0ff]/45 uppercase sm:text-[10px]">
                      {t.resume.modalEyebrow}
                    </p>
                    <h3
                      id="resume-modal-title"
                      className="display mt-0.5 text-lg font-semibold text-[#00f0ff] sm:mt-1 sm:text-xl"
                    >
                      {t.resume.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#00f0ff]/65 sm:mt-2 sm:text-sm">
                      {t.resume.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="shrink-0 border border-[#00f0ff]/20 p-1.5 text-[#00f0ff]/60 transition-colors hover:border-[#00f0ff]/45 hover:text-[#00f0ff] sm:p-2"
                    aria-label={t.resume.close}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="overflow-hidden bg-white">
                  <iframe
                    src={`${SITE.resume}#toolbar=0&navpanes=0&view=FitH`}
                    title="Currículo — Gustavo Barbosa Portela"
                    className="h-[min(44vh,380px)] w-full sm:h-[min(48vh,420px)] md:h-[min(50vh,440px)]"
                  />
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[#00f0ff]/10 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-5">
                  <p className="font-mono text-[9px] tracking-[0.18em] text-[#00f0ff]/40 uppercase sm:text-[10px]">
                    {SITE.resumeLabel}
                  </p>
                  <a
                    href={SITE.resume}
                    download="curriculo-gustavo-barbosa-portela.pdf"
                    className="inline-flex items-center gap-2 border border-[#00f0ff]/25 bg-[#00f0ff]/10 px-3 py-1.5 font-mono text-[9px] tracking-[0.18em] text-[#00f0ff] uppercase transition-colors hover:border-[#00f0ff]/45 hover:bg-[#00f0ff]/15 sm:px-4 sm:py-2 sm:text-[10px]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t.resume.download}
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );

  return modal;
}
