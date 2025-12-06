// components/admin/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginError(null);
        setLoginLoading(true);

        const result = await signIn("credentials",
            {
                email,
                password,
                redirect: false
            });

        setLoginLoading(false);

        if (result?.error) {
            setLoginError(result.error || "Login failed");
            return;
        }

        // لاگین موفق → برو پنل
        router.push("/admin");
    }

    return (
        <div className="relative w-full max-w-sm rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-[0_22px_60px_rgba(0,0,0,0.85)] p-7 space-y-5">
            <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xl">
                    CV
                </div>
                <h1 className="text-lg font-semibold tracking-tight mt-1">
                    Admin Console
                </h1>
                <p className="text-xs text-slate-400">
                    Sign in with your admin credentials to edit your resume.
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                    <label className="block text-xs text-slate-400">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-xs text-slate-400">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {loginError && (
                    <p className="text-xs text-red-400">{loginError}</p>
                )}

                <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full mt-1 rounded-xl bg-linear-to-r from-emerald-400 via-cyan-400 to-sky-400 text-slate-950 text-sm font-semibold py-2.5 shadow-[0_10px_30px_rgba(34,197,94,0.35)] disabled:opacity-60 disabled:shadow-none transition-all"
                >
                    {loginLoading ? "Logging in..." : "Login as Admin"}
                </button>
            </form>

            <p className="text-[11px] text-slate-500 text-center">
                Admin account is created automatically from <span className="font-mono">.env</span> on first run.
            </p>
        </div>
    );
}
