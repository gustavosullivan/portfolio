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
  FileText,
  Link2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { openResumeViewer } from "@/components/resume/ResumeViewer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const WHATSAPP_NUMBER = "5554993698492";

const fieldClass =
  "w-full border border-[#00f0ff]/15 bg-black/50 px-4 py-3 text-sm text-[#e8f7ff] outline-none transition-colors placeholder:text-slate-500 focus:border-[#00f0ff]/45";

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
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#00f0ff]/15 bg-black/40 text-[#00f0ff]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="neon-label block font-mono text-[10px]">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm text-[#e8f7ff] md:text-base">
          {value}
        </span>
      </span>
      {action}
    </>
  );

  const classes =
    "glass group flex w-full items-center gap-4 p-4 text-left transition-colors hover:border-[#00f0ff]/35 md:p-5";

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

function WhatsAppForm() {
  const { t, locale } = useI18n();
  const [opened, setOpened] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t.contact.nameError),
        email: z.string().email(t.contact.emailError),
        message: z.string().trim().min(15, t.contact.messageError),
      }),
    [t.contact.emailError, t.contact.messageError, t.contact.nameError],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    const body =
      locale === "en"
        ? `Hi Gustavo! I'm ${data.name}.\nEmail: ${data.email}\n\n${data.message}`
        : locale === "es"
          ? `¡Hola Gustavo! Soy ${data.name}.\nEmail: ${data.email}\n\n${data.message}`
          : `Olá Gustavo! Meu nome é ${data.name}.\nEmail: ${data.email}\n\n${data.message}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpened(true);
    reset();
    window.setTimeout(() => setOpened(false), 3500);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass relative flex flex-1 flex-col gap-5 border-[#00f0ff]/15 bg-black/55 p-6 backdrop-blur-md md:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="neon-label mb-2 block font-mono text-[10px]"
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
            className="neon-label mb-2 block font-mono text-[10px]"
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
          className="neon-label mb-2 block font-mono text-[10px]"
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
        <MagneticButton type="submit" disabled={opened} className="w-full">
          {opened ? t.contact.sent : t.contact.send}
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
    <section
      id="contact"
      className="cv-auto section-pad relative mx-auto max-w-7xl overflow-x-clip pt-10 pb-8 md:pt-12 md:pb-10"
    >
      <div className="mb-12 mx-auto max-w-3xl text-center">
        <h2 className="display neon-title tron-underline mx-auto text-4xl font-semibold md:text-5xl lg:text-6xl">
          {t.contact.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
          {t.contact.description}
        </p>
      </div>

      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-5 min-h-[3.25rem] text-center">
            <p className="neon-label font-mono text-xs">
              {t.contact.channelsEyebrow}
            </p>
            <p className="mt-1 text-sm text-slate-500">
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
                  <Copy className="h-4 w-4 shrink-0 text-[#00f0ff]/35 transition-colors group-hover:text-[#00f0ff]/70" />
                )
              }
            />
            <ChannelCard
              href={SITE.whatsapp}
              icon={<MessageCircle className="h-4 w-4" />}
              label={t.contact.whatsappLabel}
              value={SITE.whatsappLabel}
              action={
                <ExternalLink className="h-4 w-4 shrink-0 text-[#00f0ff]/35 transition-colors group-hover:text-[#00f0ff]/70" />
              }
            />
            <ChannelCard
              href={SITE.github}
              icon={<Code2 className="h-4 w-4" />}
              label={t.contact.githubLabel}
              value={SITE.githubLabel}
              action={
                <ExternalLink className="h-4 w-4 shrink-0 text-[#00f0ff]/35 transition-colors group-hover:text-[#00f0ff]/70" />
              }
            />
            <ChannelCard
              href={SITE.linkedin}
              icon={<Link2 className="h-4 w-4" />}
              label={t.contact.linkedinLabel}
              value={SITE.linkedinLabel}
              action={
                <ExternalLink className="h-4 w-4 shrink-0 text-[#00f0ff]/35 transition-colors group-hover:text-[#00f0ff]/70" />
              }
            />
            <div id="resume" className="scroll-mt-28">
              <ChannelCard
                onClick={openResumeViewer}
                icon={<FileText className="h-4 w-4" />}
                label={t.contact.resumeLabel}
                value={SITE.resumeLabel}
                action={
                  <ExternalLink className="h-4 w-4 shrink-0 text-[#00f0ff]/35 transition-colors group-hover:text-[#00f0ff]/70" />
                }
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.06 }}
        >
          <div className="mb-5 min-h-[3.25rem] text-center">
            <p className="neon-label font-mono text-xs">
              {t.contact.messageEyebrow}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {t.contact.messageHint}
            </p>
          </div>

          <WhatsAppForm key={locale} />
        </motion.div>
      </div>
    </section>
  );
}
