import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n-config";
import { updateSession } from "@/lib/supabase/middleware";

function skipLocaleRouting(pathname: string) {
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/.well-known")) return true;
  if (pathname === "/favicon.ico") return true;
  if (/\.[a-zA-Z0-9]{2,8}$/.test(pathname)) return true;
  return false;
}

function firstSegment(pathname: string) {
  return pathname.split("/").filter(Boolean)[0];
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.length > 1 && pathname.endsWith("/")) {
    const normalized = request.nextUrl.clone();
    normalized.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(normalized, 308);
  }

  const legacyBlogMatch = pathname.match(/^\/(en|de|it|es|pt|ru)\/blog(?:\/(.+))?$/);
  if (legacyBlogMatch) {
    const locale = legacyBlogMatch[1];
    const slug = legacyBlogMatch[2];
    const target = slug ? `/${locale}/guides/${slug}` : `/${locale}/guides`;
    return NextResponse.redirect(new URL(target, request.url), 308);
  }

  if (skipLocaleRouting(pathname)) {
    return updateSession(request);
  }

  const seg = firstSegment(pathname);
  if (!seg || !isLocale(seg)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
