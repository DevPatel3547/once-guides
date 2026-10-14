import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Once — do it once, share the how",
  description: "Capture a workflow. Make a beautiful step-by-step guide. Local-first editing and free HTML, Markdown, JSON, and PDF exports.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
