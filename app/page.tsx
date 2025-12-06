// app/page.tsx
import { prisma } from "@/lib/prisma";
import PrintButtons from "./components/PrintButtons";

type SkillView =
    {
        id: number;
        name: string;
        category: string | null;
        orderIndex: number;
    };

type ExperienceView =
    {
        id: number;
        company: string;
        role: string;
        location: string | null;
        startDate: string;        // YYYY-MM
        endDate: string | null;   // YYYY-MM یا null
        description: string;
        orderIndex: number;
    };

type ResumeView =
    {
        id: number;
        fullName: string;
        title: string;
        about: string;
        email: string;
        githubUrl: string | null;
        linkedinUrl: string | null;
        profileImageUrl: string | null;
        skills: SkillView[];
        experiences: ExperienceView[];
    };

// این خط یعنی: این صفحه رو Static بساز
export const dynamic = "force-static";

function formatYearMonth(date: Date | null): string | null {
    if (!date) {
        return null;
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
}

async function getResume(): Promise<ResumeView | null> {
    const resume = await prisma.resume.findFirst(
        {
            include:
            {
                skills:
                {
                    orderBy:
                    {
                        orderIndex: "asc"
                    }
                },
                experiences:
                {
                    orderBy:
                    {
                        orderIndex: "asc"
                    }
                }
            }
        });

    if (!resume) {
        return null;
    }

    return {
        id: resume.id,
        fullName: resume.fullName,
        title: resume.title,
        about: resume.about,
        email: resume.email,
        githubUrl: resume.githubUrl,
        linkedinUrl: resume.linkedinUrl,
        profileImageUrl: resume.profileImageUrl,
        skills: resume.skills.map(s =>
        ({
            id: s.id,
            name: s.name,
            category: s.category,
            orderIndex: s.orderIndex
        })),
        experiences: resume.experiences.map(e =>
        ({
            id: e.id,
            company: e.company,
            role: e.role,
            location: e.location,
            startDate: formatYearMonth(e.startDate) ?? "",
            endDate: formatYearMonth(e.endDate),
            description: e.description,
            orderIndex: e.orderIndex
        }))
    };
}

export default async function HomePage() {
    const resume = await getResume();

    if (!resume) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-200 flex items-center justify-center px-4">
                <div className="max-w-md text-center space-y-3">
                    <h1 className="text-2xl font-semibold">No resume yet</h1>
                    <p className="text-slate-400 text-sm">
                        Login to the admin panel at <span className="font-mono text-slate-300">/admin</span> and create your first CV.
                    </p>
                </div>
            </main>
        );
    }

    const initials = resume.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join("");

    return (
        <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-100 px-4 py-6 md:px-6 md:py-10 print:bg-white print:text-black">

            {/* PDF buttons (client component) */}
            <PrintButtons />

            {/* Background (hidden on print) */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(94,234,212,0.12),_transparent_55%)] opacity-60 print:hidden" />

            <div className="relative max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10 pb-14 md:pb-0">
                {/* LEFT: profile card */}
                <aside className="w-full lg:w-72 shrink-0 print:w-64">
                    <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.7)] p-5 md:p-6 flex flex-col items-center gap-4 print:bg-white print:border-gray-300 print:shadow-none">
                        <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-cyan-400 via-emerald-400 to-sky-500 p-[2px] print:p-0 print:bg-transparent">
                            <div className="h-full w-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center text-2xl md:text-3xl font-semibold tracking-tight print:bg-gray-200 print:text-black">
                                {resume.profileImageUrl ? (
                                    <img
                                        src={resume.profileImageUrl}
                                        alt={resume.fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    (initials || "CV")
                                )}
                            </div>
                        </div>

                        <div className="text-center space-y-1">
                            <h1 className="text-lg md:text-xl font-semibold tracking-tight print:text-black">
                                {resume.fullName}
                            </h1>
                            <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-emerald-300/80 print:text-gray-600">
                                {resume.title}
                            </p>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/70 to-transparent my-2 print:bg-gray-300 print:from-gray-300 print:via-gray-300 print:to-gray-300" />

                        <div className="w-full text-sm space-y-2">
                            <p className="flex items-center gap-2 text-slate-300 print:text-black">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 print:bg-black" />
                                <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400 print:text-gray-600">
                                    Contact
                                </span>
                            </p>
                            <div className="space-y-1 text-xs break-words">
                                <a
                                    href={`mailto:${resume.email}`}
                                    className="block text-slate-300 hover:text-emerald-300 transition-colors"
                                >
                                    {resume.email}
                                </a>
                                {resume.githubUrl && (
                                    <span className="block text-slate-400 hover:text-emerald-300 transition-colors print:text-black">
                                        GitHub: {resume.githubUrl}
                                    </span>
                                )}
                                {resume.linkedinUrl && (
                                    <span className="block text-slate-400 hover:text-emerald-300 transition-colors print:text-black">
                                        LinkedIn: {resume.linkedinUrl}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-800/70 my-2 print:bg-gray-300" />

                        <div className="w-full">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2 print:text-gray-600">
                                Key skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {resume.skills.slice(0, 8).map(skill => (
                                    <span
                                        key={skill.id}
                                        className="px-2.5 py-1 rounded-full bg-slate-900/80 text-[11px] border border-slate-700/70 text-slate-200 print:bg-gray-100 print:border-gray-300 print:text-black"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT: content */}
                <section className="flex-1 space-y-6 md:space-y-8">
                    {/* About */}
                    <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 backdrop-blur-xl p-5 md:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.6)] print:bg-white print:border-gray-300 print:shadow-none">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-1 w-6 rounded-full bg-emerald-400 print:bg-black" />
                            <h2 className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-slate-300 print:text-black">
                                About
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-200 print:text-black">
                            {resume.about}
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 backdrop-blur-xl p-5 md:p-6 print:bg-white print:border-gray-300 print:shadow-none">
                        <div className="flex items-center justify-between mb-3 gap-2">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-6 rounded-full bg-cyan-400 print:bg-black" />
                                <h2 className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-slate-300 print:text-black">
                                    Skills
                                </h2>
                            </div>
                            <p className="text-[10px] md:text-[11px] text-slate-500 print:text-gray-600 whitespace-nowrap">
                                {resume.skills.length} skills
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {resume.skills.map(skill => (
                                <span
                                    key={skill.id}
                                    className="px-3 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 text-xs text-slate-100 shadow-[0_0_0_1px_rgba(15,23,42,0.9)] print:bg-gray-100 print:border-gray-300 print:text-black print:shadow-none"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 backdrop-blur-xl p-5 md:p-6 print:bg-white print:border-gray-300 print:shadow-none">
                        <div className="flex items-center justify-between mb-4 md:mb-5 gap-2">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-6 rounded-full bg-sky-400 print:bg-black" />
                                <h2 className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-slate-300 print:text-black">
                                    Experience
                                </h2>
                            </div>
                            <p className="text-[10px] md:text-[11px] text-slate-500 print:text-gray-600 whitespace-nowrap">
                                {resume.experiences.length} positions
                            </p>
                        </div>

                        <div className="space-y-4">
                            {resume.experiences.map(exp => (
                                <article
                                    key={exp.id}
                                    className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-slate-900/80 p-4 print:bg-white print:border-gray-300"
                                >
                                    <div className="absolute left-0 top-4 h-8 w-[2px] bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full opacity-80 print:bg-black print:from-black print:to-black" />
                                    <div className="pl-4">
                                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-1">
                                            <h3 className="text-sm font-semibold text-slate-100 print:text-black">
                                                {exp.role}
                                            </h3>
                                            <span className="text-[11px] text-slate-400 font-mono print:text-gray-600">
                                                {exp.startDate} –{" "}
                                                {exp.endDate ?? "Present"}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-slate-400 mb-1.5 print:text-gray-700">
                                            {exp.company}
                                            {exp.location ? ` · ${exp.location}` : ""}
                                        </p>
                                        <p className="text-[12px] text-slate-200 leading-relaxed print:text-black">
                                            {exp.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
