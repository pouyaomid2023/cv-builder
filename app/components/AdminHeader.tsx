// components/admin/AdminHeader.tsx
"use client";

interface AdminHeaderProps {
    onReload: () => void;
    onSave: () => void;
    saveLoading: boolean;
}

export default function AdminHeader(
    {
        onReload,
        onSave,
        saveLoading
    }: AdminHeaderProps) {
    return (
        <header className="rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_14px_40px_rgba(0,0,0,0.8)]">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">
                    Resume editor
                </h1>
                <p className="text-xs text-slate-400">
                    Update your one-page portfolio in real time.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onReload}
                    className="px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-slate-200 hover:border-emerald-400/70 hover:text-emerald-300 transition-all"
                >
                    Reload
                </button>
                <button
                    onClick={onSave}
                    disabled={saveLoading}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold shadow-[0_10px_30px_rgba(34,197,94,0.4)] disabled:opacity-60 disabled:shadow-none transition-all"
                >
                    {saveLoading ? "Saving..." : "Save changes"}
                </button>
            </div>
        </header>
    );
}
