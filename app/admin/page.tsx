// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import AdminHeader from "../components/AdminHeader";
import BasicInfoSection from "../components/BasicInfoSection";
import SkillsSection from "../components/SkillsSection";
import ExperienceSection from "../components/ExperienceSection";

type SkillInput =
    {
        id?: number;
        name: string;
        category?: string | null;
        orderIndex?: number;
    };

type ExperienceInput =
    {
        id?: number;
        company: string;
        role: string;
        location?: string | null;
        startDate: string;
        endDate?: string | null;
        description: string;
        orderIndex?: number;
    };

type ResumeInput =
    {
        fullName: string;
        title: string;
        about: string;
        email: string;
        githubUrl?: string | null;
        linkedinUrl?: string | null;
        profileImageUrl?: string | null;
        skills: SkillInput[];
        experiences: ExperienceInput[];
    };

export default function AdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [resume, setResume] = useState<ResumeInput | null>(null);
    const [loadingResume, setLoadingResume] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const adminEmail = session?.user?.email ?? "";

    // اگر لاگین نیست → بفرستش صفحه لاگین
    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/admin/login");
        }
    }, [status, router]);

    // وقتی لاگین شد → رزومه رو لود کن
    useEffect(() => {
        if (status === "authenticated") {
            loadResume();
        }
    }, [status]);

    async function loadResume() {
        setLoadingResume(true);
        setResume(null);
        setSaveMessage(null);
        setSaveError(null);

        try {
            const res = await fetch("/api/resume");
            const data = await res.json();

            if (!data || (!data.id && !data.resume)) {
                setResume(
                    {
                        fullName: "",
                        title: "",
                        about: "",
                        email: adminEmail,
                        githubUrl: "",
                        linkedinUrl: "",
                        profileImageUrl: "",
                        skills: [],
                        experiences: []
                    });
                return;
            }

            const r = data.id ? data : data.resume;

            const mapped: ResumeInput =
            {
                fullName: r.fullName ?? "",
                title: r.title ?? "",
                about: r.about ?? "",
                email: r.email ?? "",
                githubUrl: r.githubUrl ?? "",
                linkedinUrl: r.linkedinUrl ?? "",
                profileImageUrl: r.profileImageUrl ?? "",
                skills: (r.skills ?? []).map((s: any) =>
                ({
                    id: s.id,
                    name: s.name,
                    category: s.category,
                    orderIndex: s.orderIndex
                })),
                experiences: (r.experiences ?? []).map((e: any) =>
                ({
                    id: e.id,
                    company: e.company,
                    role: e.role,
                    location: e.location,
                    startDate: (e.startDate || "").slice(0, 10),
                    endDate: e.endDate ? e.endDate.slice(0, 10) : "",
                    description: e.description,
                    orderIndex: e.orderIndex
                }))
            };

            setResume(mapped);
        }
        catch {
            setResume(
                {
                    fullName: "",
                    title: "",
                    about: "",
                    email: adminEmail,
                    githubUrl: "",
                    linkedinUrl: "",
                    profileImageUrl: "",
                    skills: [],
                    experiences: []
                });
        }
        finally {
            setLoadingResume(false);
        }
    }

    function updateField<K extends keyof ResumeInput>(field: K, value: ResumeInput[K]) {
        if (!resume) return;
        setResume({ ...resume, [field]: value });
    }

    function updateSkill(index: number, field: keyof SkillInput, value: any) {
        if (!resume) return;
        const skills = [...resume.skills];
        skills[index] = { ...skills[index], [field]: value };
        setResume({ ...resume, skills });
    }

    function addSkill() {
        if (!resume) return;
        setResume(
            {
                ...resume,
                skills:
                    [
                        ...resume.skills,
                        {
                            name: "",
                            category: ""
                        }
                    ]
            });
    }

    function removeSkill(index: number) {
        if (!resume) return;
        const skills = [...resume.skills];
        skills.splice(index, 1);
        setResume({ ...resume, skills });
    }

    function updateExperience(index: number, field: keyof ExperienceInput, value: any) {
        if (!resume) return;
        const experiences = [...resume.experiences];
        experiences[index] = { ...experiences[index], [field]: value };
        setResume({ ...resume, experiences });
    }

    function addExperience() {
        if (!resume) return;
        setResume(
            {
                ...resume,
                experiences:
                    [
                        ...resume.experiences,
                        {
                            company: "",
                            role: "",
                            location: "",
                            startDate: "",
                            endDate: "",
                            description: ""
                        }
                    ]
            });
    }

    function removeExperience(index: number) {
        if (!resume) return;
        const experiences = [...resume.experiences];
        experiences.splice(index, 1);
        setResume({ ...resume, experiences });
    }

    async function handleSave() {
        if (!resume) return;
        setSaveLoading(true);
        setSaveError(null);
        setSaveMessage(null);

        try {
            const res = await fetch("/api/resume",
                {
                    method: "PUT",
                    headers:
                    {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(resume)
                });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setSaveError(data.error ?? "Failed to save");
                return;
            }

            setSaveMessage("Saved successfully!");
        }
        catch {
            setSaveError("Network error");
        }
        finally {
            setSaveLoading(false);
        }
    }

    // وضعیت سشن
    if (status === "loading") {
        return (
            <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center">
                <p className="text-xs text-slate-400">Checking session...</p>
            </main>
        );
    }

    if (status !== "authenticated") {
        return (
            <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center">
                <p className="text-xs text-slate-400">Redirecting to login...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-100 px-4 py-4 md:px-6 md:py-6">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_60%),radial-gradient(circle_at_bottom,rgba(94,234,212,0.16),transparent_55%)] opacity-70" />

            <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
                {/* Sidebar */}
                <aside className="hidden md:flex md:flex-col w-60 shrink-0 rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.8)] p-5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-emerald-400 to-sky-400 flex items-center justify-center text-slate-950 text-lg font-bold">
                            CV
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">CV Builder</span>
                            <span className="text-[11px] text-emerald-300/80">
                                Admin panel
                            </span>
                        </div>
                    </div>

                    <nav className="space-y-1.5 text-sm">
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100">
                            <span>Resume editor</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <div className="px-3 py-2 rounded-xl text-slate-500 text-xs border border-dashed border-slate-800/70">
                            Future: Projects, Theme, Export PDF...
                        </div>
                    </nav>

                    <div className="mt-auto pt-6 text-[11px] text-slate-500 space-y-1">
                        <p className="truncate">
                            Logged in as <span className="text-slate-300">{adminEmail}</span>
                        </p>
                        <p className="text-slate-600">
                            Tip: Keep your CV short, sharp, and focused.
                        </p>
                    </div>
                </aside>

                {/* Main content */}
                <section className="flex-1 min-w-0 space-y-4 md:space-y-5">
                    {/* موبایل: هدر ساده جای سایدبار */}
                    <div className="md:hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">CV Builder</p>
                            <p className="text-sm font-semibold text-slate-100">
                                Admin panel
                            </p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>

                    <AdminHeader
                        onReload={loadResume}
                        onSave={handleSave}
                        saveLoading={saveLoading}
                    />

                    {loadingResume && (
                        <p className="text-xs text-slate-400">Loading resume...</p>
                    )}
                    {saveError && (
                        <p className="text-xs text-red-400">{saveError}</p>
                    )}
                    {saveMessage && (
                        <p className="text-xs text-emerald-400">{saveMessage}</p>
                    )}

                    {!resume ? (
                        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-6 text-sm text-slate-400">
                            No resume loaded yet.
                        </div>
                    ) : (
                        <div className="space-y-4 md:space-y-5">
                            <BasicInfoSection
                                resume={resume}
                                updateField={(field, value) =>
                                    updateField(field as keyof ResumeInput, value as any)
                                }
                            />

                            <SkillsSection
                                skills={resume.skills}
                                addSkill={addSkill}
                                removeSkill={removeSkill}
                                updateSkill={updateSkill}
                            />

                            <ExperienceSection
                                experiences={resume.experiences}
                                addExperience={addExperience}
                                removeExperience={removeExperience}
                                updateExperience={updateExperience}
                            />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
