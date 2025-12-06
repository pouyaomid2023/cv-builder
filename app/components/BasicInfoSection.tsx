// components/admin/BasicInfoSection.tsx
"use client";

import { useState } from "react";

type ResumeInput =
    {
        fullName: string;
        title: string;
        about: string;
        email: string;
        githubUrl?: string | null;
        linkedinUrl?: string | null;
        profileImageUrl?: string | null;
    };

interface BasicInfoSectionProps {
    resume: ResumeInput;
    updateField: <K extends keyof ResumeInput>(field: K, value: ResumeInput[K]) => void;
}

export default function BasicInfoSection(
    {
        resume,
        updateField
    }: BasicInfoSectionProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const avatarUrl = resume.profileImageUrl ?? "";

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/profile-image",
                {
                    method: "POST",
                    body: formData
                });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setUploadError(data.error ?? "Upload failed");
                return;
            }

            const data = await res.json();
            if (data?.url) {
                // اینجا رزومه رو آپدیت می‌کنیم
                updateField("profileImageUrl", data.url);
            }
        }
        catch {
            setUploadError("Network error during upload");
        }
        finally {
            setUploading(false);
        }
    }

    return (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-300">
                    Basic information
                </h2>
                <span className="text-[11px] text-slate-500">
                    Shown at the top of your CV
                </span>
            </div>

            {/* Avatar + upload + name/title */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Avatar preview + upload */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-2xl border border-slate-700/80 bg-slate-900/70 overflow-hidden flex items-center justify-center text-slate-500 text-xs">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span>Preview</span>
                            )}
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-500 max-w-xs">
                            <p>Upload a square profile photo (JPG, PNG, WEBP).</p>
                            <p className="text-[10px] text-slate-600">
                                Max size 2MB. It will appear on the left of your CV.
                            </p>
                        </div>
                    </div>

                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400/80 hover:text-emerald-300 transition-all">
                            {uploading ? "Uploading..." : "Choose image"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>

                    {uploadError && (
                        <p className="text-[11px] text-red-400">
                            {uploadError}
                        </p>
                    )}
                </div>

                {/* Name + title */}
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">
                            Full name
                        </label>
                        <input
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                            value={resume.fullName}
                            onChange={e => updateField("fullName", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">
                            Title / headline
                        </label>
                        <input
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                            value={resume.title}
                            onChange={e => updateField("title", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="space-y-1.5">
                <label className="text-xs text-slate-400">
                    About
                </label>
                <textarea
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all resize-none"
                    rows={4}
                    value={resume.about}
                    onChange={e => updateField("about", e.target.value)}
                />
            </div>

            {/* Contact + links */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">
                        Email
                    </label>
                    <input
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                        value={resume.email}
                        onChange={e => updateField("email", e.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">
                        GitHub URL
                    </label>
                    <input
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                        value={resume.githubUrl ?? ""}
                        onChange={e => updateField("githubUrl", e.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">
                        LinkedIn URL
                    </label>
                    <input
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                        value={resume.linkedinUrl ?? ""}
                        onChange={e => updateField("linkedinUrl", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
