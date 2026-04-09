import { defaultLocale, isLocale, type Locale } from "./i18n-config";

/** Prefissa un path interno con la locale (es. /contact → /it/contact). */
export function withLocale(path: string, locale: Locale): string {
  if (!path.startsWith("/")) {
    return withLocale(`/${path}`, locale);
  }
  const segments = path.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) {
    return path;
  }
  if (path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}

/** Rimuove il segmento lingua dall’URL. */
export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return "/";
  if (isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : null;
}

/** Default usato nei redirect lato server (es. auth callback) quando manca il contesto. */
export function withDefaultLocale(path: string): string {
  return withLocale(path, defaultLocale);
}
