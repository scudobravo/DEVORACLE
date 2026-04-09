/** Resolve download URLs supporting both NEXT_PUBLIC_DOWNLOAD_* and legacy *_URL names. */
export function getMacDownloadUrl(): string {
  return (
    process.env.NEXT_PUBLIC_DOWNLOAD_MAC?.trim() ||
    process.env.NEXT_PUBLIC_DOWNLOAD_MAC_URL?.trim() ||
    ""
  );
}

export function getWinDownloadUrl(): string {
  return (
    process.env.NEXT_PUBLIC_DOWNLOAD_WIN?.trim() ||
    process.env.NEXT_PUBLIC_DOWNLOAD_WIN_URL?.trim() ||
    ""
  );
}

export function getAppVersion(): string {
  return process.env.NEXT_PUBLIC_APP_VERSION?.trim() || "";
}

export function getAppDisplayName(): string {
  return process.env.NEXT_PUBLIC_APP_DISPLAY_NAME?.trim() || "DevOracle";
}
