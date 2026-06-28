import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Morgan – Full Stack Developer & AI Engineer",
  description: "Portfolio of Alex Morgan – crafting high-performance web applications and AI-powered products.",
  keywords: ["Full Stack Developer", "AI Engineer", "Next.js", "React", "TypeScript"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#050508] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
