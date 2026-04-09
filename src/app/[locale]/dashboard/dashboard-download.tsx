"use client";

import type { Messages } from "@/lib/dictionary";
import { useDashboard } from "./dashboard-context";
import { getAppDisplayName, getAppVersion, getMacDownloadUrl, getWinDownloadUrl } from "@/lib/download-env";

type DashboardDownloadProps = {
  dashboard: Messages["dashboard"];
};

export function DashboardDownload({ dashboard: d }: DashboardDownloadProps) {
  const { loadError } = useDashboard();

  const appName = getAppDisplayName();
  const version = getAppVersion();
  const macUrl =
    getMacDownloadUrl() || process.env.NEXT_PUBLIC_GITHUB_RELEASE_URL?.trim() || "https://github.com/scudobravo/cw-monorepo/releases";
  const winUrl =
    getWinDownloadUrl() || process.env.NEXT_PUBLIC_GITHUB_RELEASE_URL?.trim() || "https://github.com/scudobravo/cw-monorepo/releases";

  const versionLine = d.downloadPage.versionLine
    .replace("{version}", version ? version : d.downloadPage.latest);

  return (
    <>
      {loadError ? (
        <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">
          {loadError}
        </p>
      ) : null}
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{d.downloadPage.title}</h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href={macUrl}
            download
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-4 font-bold text-white transition hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]"
          >
            <span className="material-symbols-outlined">download</span>
            {d.downloadPage.macCta.replace("{appName}", appName)}
          </a>
          <a
            href={winUrl}
            download
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-bold transition hover:bg-white/10"
          >
            <span className="material-symbols-outlined">download</span>
            {d.downloadPage.winCta.replace("{appName}", appName)}
          </a>
        </div>
        <p className="text-sm text-on-surface-variant">{versionLine}</p>
      </div>
    </>
  );
}
