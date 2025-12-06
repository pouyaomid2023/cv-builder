// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

export const metadata = {
  title: "CV Builder",
  description: "Minimal personal resume site with admin panel"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020617] text-slate-100 antialiased">
        {/* subtle gradient background */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_55%)]" />
        {/* content wrapper */}
        <div className="min-h-screen flex flex-col items-center">
          <div className="w-full max-w-6xl px-4 md:px-8 py-6 md:py-10">
            <AuthProvider>
              {children}
            </AuthProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
