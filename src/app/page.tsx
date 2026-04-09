import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n-config";

/** Fallback: il middleware reindirizza già `/` → `/en`; questa route evita pagine legacy che importano moduli rimossi. */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
