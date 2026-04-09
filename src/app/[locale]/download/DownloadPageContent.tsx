"use client";

import type { Messages } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n-config";
import { withLocale } from "@/lib/i18n-path";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getAppDisplayName,
  getAppVersion,
  getMacDownloadUrl,
  getWinDownloadUrl,
} from "@/lib/download-env";
import { createClient } from "@/lib/supabase/client";

type DetectedOS = "macos" | "windows" | "unknown";

function detectOS(ua: string): DetectedOS {
  if (!ua) return "unknown";
  if (/Windows|Win32|Win64|WOW64/i.test(ua)) return "windows";
  if (/Mac OS X|Macintosh/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) return "macos";
  return "unknown";
}

const GITHUB_RELEASES = "https://github.com/scudobravo/cw-monorepo/releases";

type DownloadPageContentProps = {
  locale: Locale;
  download: Messages["download"];
};

export function DownloadPageContent({ locale, download: d }: DownloadPageContentProps) {
  const appName = getAppDisplayName();
  const version = getAppVersion();
  const macUrl = getMacDownloadUrl();
  const winUrl = getWinDownloadUrl();
  const [os, setOs] = useState<DetectedOS>("unknown");
  const supabase = useMemo(() => createClient(), []);
  const home = withLocale("/", locale);

  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    queueMicrotask(() => setOs(detectOS(ua)));
  }, []);

  useEffect(() => {
    void supabase.auth.getSession();
  }, [supabase]);

  const versionSubtitle = version.length > 0 ? d.versionLine.replace("{version}", version) : d.versionUnknown;

  const missingUrls = !macUrl || !winUrl;

  const homeAria = d.homeAria.replace("{appName}", appName);
  const title = d.title.replace("{appName}", appName);

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <header className="border-b border-white/5 bg-[#13131b]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-6">
          <Link href={home} className="flex items-center gap-3" aria-label={homeAria}>
            <Image src="/logo-DEVORACLE.svg" alt="" width={140} height={32} className="h-7 w-auto" />
            <span className="font-headline text-sm font-bold tracking-tight text-on-surface">{appName}</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-12">
        <div className="mb-10 text-center">
          <h1 className="font-headline mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
          <p className="text-on-surface-variant">{versionSubtitle}</p>
        </div>

        {missingUrls ? (
          <p className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
            {d.missingUrls}
          </p>
        ) : null}

        <div
          className="mx-auto w-full max-w-[480px] rounded-2xl border border-white/10 bg-surface-container p-6 shadow-xl md:p-8"
          aria-label="Download installers"
        >
          {os === "macos" && !missingUrls ? (
            <div className="flex flex-col gap-6">
              <a
                href={macUrl}
                download
                className="group flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-container px-6 py-8 text-center font-bold text-on-primary-container transition hover:shadow-[0_0_24px_rgba(192,193,255,0.35)]"
              >
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  ios
                </span>
                <span className="text-lg">{d.macPrimary}</span>
                <span className="text-xs font-normal opacity-90">{d.macSub}</span>
              </a>
              <p className="text-center text-sm">
                <a
                  href={winUrl}
                  download
                  className="text-indigo-400 underline-offset-2 hover:text-indigo-300 hover:underline"
                >
                  {d.switchToWin}
                </a>
              </p>
            </div>
          ) : null}

          {os === "windows" && !missingUrls ? (
            <div className="flex flex-col gap-6">
              <a
                href={winUrl}
                download
                className="group flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-primary to-primary-container px-6 py-8 text-center font-bold text-on-primary-container transition hover:shadow-[0_0_24px_rgba(192,193,255,0.35)]"
              >
                <span className="material-symbols-outlined text-4xl">window</span>
                <span className="text-lg">{d.winPrimary}</span>
                <span className="text-xs font-normal opacity-90">{d.winSub}</span>
              </a>
              <p className="text-center text-sm">
                <a
                  href={macUrl}
                  download
                  className="text-indigo-400 underline-offset-2 hover:text-indigo-300 hover:underline"
                >
                  {d.switchToMac}
                </a>
              </p>
            </div>
          ) : null}

          {(os === "unknown" || missingUrls) && !missingUrls ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
              <a
                href={macUrl}
                download
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-6 text-center font-bold transition hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  ios
                </span>
                {d.macPrimary}
                <span className="text-xs font-normal text-on-surface-variant">{d.macSub}</span>
              </a>
              <a
                href={winUrl}
                download
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-6 text-center font-bold transition hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-3xl">window</span>
                {d.winPrimary}
                <span className="text-xs font-normal text-on-surface-variant">{d.winSub}</span>
              </a>
            </div>
          ) : null}

          {missingUrls ? (
            <div className="flex flex-col gap-4 opacity-50 sm:flex-row">
              <span className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/20 px-5 py-6 text-center text-sm text-on-surface-variant">
                {d.unavailableMac}
              </span>
              <span className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/20 px-5 py-6 text-center text-sm text-on-surface-variant">
                {d.unavailableWin}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mx-auto mt-12 max-w-[480px] space-y-3">
          <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface-variant">
            {d.installTitle}
          </h2>
          <details className="group rounded-xl border border-white/10 bg-surface-container/50">
            <summary className="cursor-pointer list-none p-4 font-semibold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                macOS
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </span>
            </summary>
            <ol className="list-decimal space-y-2 px-4 pb-4 pl-8 text-sm text-on-surface-variant">
              {d.macSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </details>
          <details className="group rounded-xl border border-white/10 bg-surface-container/50">
            <summary className="cursor-pointer list-none p-4 font-semibold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                Windows
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </span>
            </summary>
            <ol className="list-decimal space-y-2 px-4 pb-4 pl-8 text-sm text-on-surface-variant">
              {d.winSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </details>
        </div>

        <footer className="mx-auto mt-16 max-w-[480px] border-t border-white/10 pt-8 text-center text-sm text-on-surface-variant">
          <p className="mb-4">
            {d.plansPrompt}{" "}
            <Link
              href={`${withLocale("/", locale)}#pricing`}
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              {d.plansCta}
            </Link>
          </p>
          <p>
            {d.issues}{" "}
            <a href={GITHUB_RELEASES} className="font-semibold text-indigo-400 hover:text-indigo-300">
              {d.github}
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
