// components/admin/ExperienceSection.tsx
"use client";

interface ExperienceInput {
    id?: number;
    company: string;
    role: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    description: string;
    orderIndex?: number;
}

interface ExperienceSectionProps {
    experiences: ExperienceInput[];
    addExperience: () => void;
    removeExperience: (index: number) => void;
    updateExperience: (index: number, field: keyof ExperienceInput, value: any) => void;
}

export default function ExperienceSection(
    {
        experiences,
        addExperience,
        removeExperience,
        updateExperience
    }: ExperienceSectionProps) {
    return (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-300">
                    Experience
                </h2>
                <button
                    onClick={addExperience}
                    className="px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-slate-100 hover:border-emerald-400/70 hover:text-emerald-300 transition-all"
                >
                    + Add experience
                </button>
            </div>

            <div className="space-y-3">
                {experiences.map((exp, index) => (
                    <div
                        key={index}
                        className="border border-slate-800 rounded-2xl bg-slate-950/80 p-4 space-y-2 text-xs md:text-sm"
                    >
                        <div className="grid md:grid-cols-2 gap-2">
                            <input
                                placeholder="Company"
                                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                                value={exp.company}
                                onChange={e => updateExperience(index, "company", e.target.value)}
                            />
                            <input
                                placeholder="Role"
                                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                                value={exp.role}
                                onChange={e => updateExperience(index, "role", e.target.value)}
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-2">
                            <input
                                placeholder="Location"
                                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                                value={exp.location ?? ""}
                                onChange={e => updateExperience(index, "location", e.target.value)}
                            />
                            <input
                                type="date"
                                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                                value={exp.startDate}
                                onChange={e => updateExperience(index, "startDate", e.target.value)}
                            />
                            <input
                                type="date"
                                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                                value={exp.endDate ?? ""}
                                onChange={e => updateExperience(index, "endDate", e.target.value)}
                            />
                        </div>

                        <textarea
                            placeholder="Description"
                            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all resize-none"
                            rows={3}
                            value={exp.description}
                            onChange={e => updateExperience(index, "description", e.target.value)}
                        />

                        <div className="flex justify-end">
                            <button
                                onClick={() => removeExperience(index)}
                                className="text-xs text-red-400"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                {experiences.length === 0 && (
                    <p className="text-xs text-slate-500">
                        No experience yet. Add at least your main role.
                    </p>
                )}
            </div>
        </div>
    );
}
