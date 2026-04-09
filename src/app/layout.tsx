import "./globals.css";

/** Next richiede un root layout; `<html>` e font vivono in `app/[locale]/layout.tsx`. */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
