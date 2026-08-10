import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  checkRateLimit,
  getClientIp,
  isAllowedOrigin,
} from "@/lib/contact-guard";

const MIN_MESSAGE_CHARS = 15;

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z
    .string()
    .trim()
    .min(MIN_MESSAGE_CHARS, {
      message: `A mensagem precisa ter pelo menos ${MIN_MESSAGE_CHARS} caracteres.`,
    })
    .max(5000),
  /** Honeypot — bots fill this; humans never see it. */
  website: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error:
          limit.reason === "too_fast"
            ? `Aguarde ${limit.retryAfterSec}s antes de enviar outra mensagem.`
            : `Muitas mensagens. Tenta de novo em ${limit.retryAfterSec}s.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    "Portfolio Contato <contato@gudev.com.br>";

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        error:
          "Envio de e-mail não configurado. Defina RESEND_API_KEY e CONTACT_TO_EMAIL no Vercel.",
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const messageIssue = parsed.error.issues.find((i) =>
      i.path.includes("message"),
    );
    return NextResponse.json(
      {
        error: messageIssue?.message || "Dados inválidos.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success so scripts stop retrying differently.
  if (parsed.data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = parsed.data;
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Contato do portfolio — ${name}`,
      text: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        `IP: ${ip}`,
        "",
        message,
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Falha ao enviar." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro inesperado ao enviar." },
      { status: 500 },
    );
  }
}
