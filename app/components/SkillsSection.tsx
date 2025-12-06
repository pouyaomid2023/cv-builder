// components/admin/SkillsSection.tsx
"use client";

interface SkillInput {
    id?: number;
    name: string;
    category?: string | null;
    orderIndex?: number;
}

interface SkillsSectionProps {
    skills: SkillInput[];
    addSkill: () => void;
    removeSkill: (index: number) => void;
    updateSkill: (index: number, field: keyof SkillInput, value: any) => void;
}

export default function SkillsSection(
    {
        skills,
        addSkill,
        removeSkill,
        updateSkill
    }: SkillsSectionProps) {
    return (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-300">
                    Skills
                </h2>
                <button
                    onClick={addSkill}
                    className="px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-950 text-xs text-slate-100 hover:border-emerald-400/70 hover:text-emerald-300 transition-all"
                >
                    + Add skill
                </button>
            </div>

            <div className="space-y-2">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row gap-2 items-stretch"
                    >
                        <input
                            placeholder="Skill name"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                            value={skill.name}
                            onChange={e => updateSkill(index, "name", e.target.value)}
                        />
                        <input
                            placeholder="Category (optional)"
                            className="md:w-52 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60 transition-all"
                            value={skill.category ?? ""}
                            onChange={e => updateSkill(index, "category", e.target.value)}
                        />
                        <button
                            onClick={() => removeSkill(index)}
                            className="text-xs text-red-400 md:w-20"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {skills.length === 0 && (
                    <p className="text-xs text-slate-500">
                        No skills yet. Add your top technologies & tools here.
                    </p>
                )}
            </div>
        </div>
    );
}
