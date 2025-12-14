import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOV Dotace Search - Vyhledávání v programu Fondu obnovy venkova",
  description: "Vyhledávejte v dokumentech dotačního programu FOV Středočeského kraje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
