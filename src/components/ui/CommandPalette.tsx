"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, PROJECTS, SITE } from "@/lib/constants";

const ACTIONS = [
  ...NAV_LINKS.map((l) => ({ id: l.href, label: `Go to ${l.label}`, href: l.href })),
  ...PROJECTS.map((p) => ({
    id: `project-${p.id}`,
    label: `Open project ${p.title}`,
    href: "#projects",
  })),
  { id: "github", label: "Open GitHub", href: SITE.github },
  { id: "email", label: "Copy email", href: `mailto:${SITE.email}` },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACTIONS;
    return ACTIONS.filter((a) => a.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="glass w-full max-w-xl overflow-hidden"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands… (Ctrl+K)"
              className="w-full border-b border-white/10 bg-transparent px-5 py-4 text-sm text-white outline-none"
            />
            <ul className="max-h-72 overflow-auto py-2">
              {results.map((action) => (
                <li key={action.id}>
                  <a
                    href={action.href}
                    className="block px-5 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setOpen(false)}
                    target={action.href.startsWith("http") ? "_blank" : undefined}
                    rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {action.label}
                  </a>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-5 py-6 text-sm text-white/40">Nenhum resultado</li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
