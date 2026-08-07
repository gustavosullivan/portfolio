"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Code2,
  ExternalLink,
  Link2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const fieldClass =
  "w-full border border-[#ffe81f]/15 bg-black/50 px-4 py-3 text-sm text-[#ffe81f] outline-none transition-colors placeholder:text-[#ffe81f]/25 focus:border-[#ffe81f]/45";

function ChannelCard({
  href,
  onClick,
  icon,
  label,
  value,
  action,
}: {
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#ffe81f]/15 bg-black/40 text-[#ffe81f]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] tracking-[0.22em] text-[#ffe81f]/40 uppercase">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm text-[#ffe81f] md:text-base">
          {value}
        </span>
      </span>
      {action}
    </>
  );

  const classes =
    "glass group flex w-full items-center gap-4 p-4 text-left transition-colors hover:border-[#ffe81f]/35 md:p-5";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

function ContactForm() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t.contact.nameError),
        email: z.string().email(t.contact.emailError),
        message: z.string().min(10, t.contact.messageError),
      }),
    [t.contact.emailError, t.contact.messageError, t.contact.nameError],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!res.ok) {
        setSubmitError(payload?.error || "Não foi possível enviar. Tenta de novo.");
        return;
      }

      setSent(true);
      reset();
      window.setTimeout(() => setSent(false), 4000);
    } catch {
      setSubmitError("Falha de rede. Verifica a conexão e tenta de novo.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass flex flex-1 flex-col gap-5 border-[#ffe81f]/15 bg-black/55 p-6 backdrop-blur-md md:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-[#ffe81f]/45 uppercase"
          >
            {t.contact.name}
          </label>
          <input
            id="contact-name"
            {...register("name")}
            placeholder={t.contact.namePlaceholder}
            className={cn(fieldClass, errors.name && "border-rose-400/50")}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-[#ffe81f]/45 uppercase"
          >
            {t.contact.email}
          </label>
          <input
            id="contact-email"
            type="email"
            {...register("email")}
            placeholder={t.contact.emailPlaceholder}
            className={cn(fieldClass, errors.email && "border-rose-400/50")}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-400">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <label
          htmlFor="contact-message"
          className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-[#ffe81f]/45 uppercase"
        >
          {t.contact.message}
        </label>
        <textarea
          id="contact-message"
          rows={6}
          {...register("message")}
          placeholder={t.contact.messagePlaceholder}
          className={cn(
            fieldClass,
            "min-h-[140px] flex-1 resize-none",
            errors.message && "border-rose-400/50",
          )}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-rose-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="mt-auto pt-1">
        {submitError ? (
          <p className="mb-3 text-xs text-rose-400">{submitError}</p>
        ) : null}
        <MagneticButton
          type="submit"
          disabled={isSubmitting || sent}
          className="w-full"
        >
          {isSubmitting
            ? t.contact.sending
            : sent
              ? t.contact.sent
              : t.contact.send}
        </MagneticButton>
      </div>
    </form>
  );
}

export function Contact() {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(SITE.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="cv-auto section-pad relative mx-auto max-w-7xl pt-10 pb-8 md:pt-12 md:pb-10">
      <div className="mb-12 max-w-3xl">
        <p className="font-mono text-xs tracking-[0.28em] text-[#ffe81f]/80 uppercase">
          {t.contact.eyebrow}
        </p>
        <h2 className="display glow-text mt-3 text-4xl font-semibold text-[#ffe81f] md:text-5xl lg:text-6xl">
          {t.contact.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#ffe81f]/55 md:text-lg">
          {t.contact.description}
        </p>
      </div>

      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Canais */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-5 min-h-[3.25rem]">
            <p className="font-mono text-xs tracking-[0.24em] text-[#ffe81f]/55 uppercase">
              {t.contact.channelsEyebrow}
            </p>
            <p className="mt-1 text-sm text-[#ffe81f]/40">
              {t.contact.channelsHint}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <ChannelCard
              onClick={copyEmail}
              icon={<Mail className="h-4 w-4" />}
              label={t.contact.emailLabel}
              value={SITE.email}
              action={
                copied ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-[#ffe81f]/35 transition-colors group-hover:text-[#ffe81f]/70" />
                )
              }
            />
            <ChannelCard
              href={SITE.whatsapp}
              icon={<MessageCircle className="h-4 w-4" />}
              label={t.contact.whatsappLabel}
              value={SITE.whatsappLabel}
              action={
                <ExternalLink className="h-4 w-4 shrink-0 text-[#ffe81f]/35 transition-colors group-hover:text-[#ffe81f]/70" />
              }
            />
            <ChannelCard
              href={SITE.github}
              icon={<Code2 className="h-4 w-4" />}
              label={t.contact.githubLabel}
              value={SITE.githubLabel}
              action={
                <ExternalLink className="h-4 w-4 shrink-0 text-[#ffe81f]/35 transition-colors group-hover:text-[#ffe81f]/70" />
              }
            />
            <ChannelCard
              href={SITE.linkedin}
              icon={<Link2 className="h-4 w-4" />}
              label={t.contact.linkedinLabel}
              value={SITE.linkedinLabel}
              action={
                <ExternalLink className="h-4 w-4 shrink-0 text-[#ffe81f]/35 transition-colors group-hover:text-[#ffe81f]/70" />
              }
            />
          </div>
        </motion.div>

        {/* Formulário */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.06 }}
        >
          <div className="mb-5 min-h-[3.25rem]">
            <p className="font-mono text-xs tracking-[0.24em] text-[#ffe81f]/55 uppercase">
              {t.contact.messageEyebrow}
            </p>
            <p className="mt-1 text-sm text-[#ffe81f]/40">
              {t.contact.messageHint}
            </p>
          </div>

          <ContactForm key={locale} />
        </motion.div>
      </div>
    </section>
  );
}
