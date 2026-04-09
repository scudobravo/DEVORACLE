import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getContactTopicLabel, isContactTopicId } from "@/lib/contact-topics";

type ContactBody = {
  topic?: string;
  name?: string;
  email?: string;
  message?: string;
};

const MAX_NAME = 200;
const MAX_MESSAGE = 10000;
const MIN_MESSAGE = 10;

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_EMAIL_FROM?.trim();
  const to = process.env.CONTACT_EMAIL_TO?.trim();

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { error: "Contact form is not configured on the server." },
      { status: 503 },
    );
  }

  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const topic = body.topic?.trim() ?? "";
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!isContactTopicId(topic)) {
    return NextResponse.json({ error: "Please choose a valid topic." }, { status: 400 });
  }
  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ error: "Please enter your name (max 200 characters)." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length < MIN_MESSAGE || message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Message must be between ${MIN_MESSAGE} and ${MAX_MESSAGE} characters.` },
      { status: 400 },
    );
  }

  const topicLabel = getContactTopicLabel(topic);
  const subject = `[DevOracle contact] ${topicLabel}`;

  const text = [
    `Topic: ${topicLabel} (${topic})`,
    `From: ${name} <${email}>`,
    "",
    message,
  ].join("\n");

  const html = `
    <p><strong>Topic:</strong> ${escapeHtml(topicLabel)} <code>${escapeHtml(topic)}</code></p>
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <hr />
    <pre style="white-space:pre-wrap;font-family:sans-serif;">${escapeHtml(message)}</pre>
  `.trim();

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[contact]", error);
      return NextResponse.json({ error: "Failed to send message. Try again later." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "Failed to send message. Try again later." }, { status: 502 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
