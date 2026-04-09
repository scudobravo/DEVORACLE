"use client";

import type { Messages } from "@/lib/dictionary";
import { useState } from "react";
import { CONTACT_TOPICS, type ContactTopicId } from "@/lib/contact-topics";

type ContactFormProps = {
  labels: Messages["contact"];
};

export function ContactForm({ labels }: ContactFormProps) {
  const [topic, setTopic] = useState<ContactTopicId>(CONTACT_TOPICS[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const topics = labels.topics;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, name, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? labels.form.genericError);
        return;
      }

      setSuccess(true);
      setMessage("");
    } catch {
      setError(labels.form.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="contact-topic"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
        >
          {labels.form.topic}
        </label>
        <select
          id="contact-topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as ContactTopicId)}
          className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
        >
          {CONTACT_TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {topics[t.id as keyof typeof topics]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
        >
          {labels.form.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
        >
          {labels.form.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
        >
          {labels.form.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={10000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={labels.form.placeholder}
          className="w-full resize-y rounded-xl border border-white/10 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
        />
        <p className="mt-1 text-xs text-on-surface-variant">{labels.form.minChars}</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {labels.form.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-500 py-4 font-bold text-white transition hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {loading ? labels.form.sending : labels.form.submit}
      </button>
    </form>
  );
}
