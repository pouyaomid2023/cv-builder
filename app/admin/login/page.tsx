// app/admin/login/page.tsx
"use client";

import LoginForm from "../../components/LoginForm";

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-black via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center px-4">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_bottom,rgba(94,234,212,0.18),transparent_55%)] opacity-70" />
            <LoginForm />
        </main>
    );
}
