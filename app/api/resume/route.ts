// app/api/resume/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";


// IMPORTANT: NextAuth v4 needs Node runtime, not Edge
export const runtime = "nodejs";

type SkillInput =
    {
        name: string;
        category?: string | null;
        orderIndex?: number;
    };

type ExperienceInput =
    {
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

// ---------- GET: public, no auth ----------
export async function GET(_req: NextRequest) {
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
        return NextResponse.json({ resume: null }, { status: 200 });
    }

    return NextResponse.json(resume, { status: 200 });
}

// ---------- PUT: only logged-in admin ----------
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    // if no valid session → 401
    if (!session || !session.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    let body: ResumeInput;
    try {
        body = (await req.json()) as ResumeInput;
    }
    catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    if (!body.fullName || !body.title || !body.email) {
        return NextResponse.json(
            { error: "fullName, title, email are required" },
            { status: 400 }
        );
    }

    const skillsData = (body.skills ?? []).map((s, idx) =>
    ({
        name: s.name,
        category: s.category ?? null,
        orderIndex: s.orderIndex ?? idx
    }));

    const experiencesData = (body.experiences ?? []).map((e, idx) =>
    ({
        company: e.company,
        role: e.role,
        location: e.location ?? null,
        startDate: new Date(e.startDate),
        endDate: e.endDate ? new Date(e.endDate) : null,
        description: e.description,
        orderIndex: e.orderIndex ?? idx
    }));

    const existing = await prisma.resume.findFirst();

    // create if not exists
    if (!existing) {
        const created = await prisma.resume.create(
            {
                data:
                {
                    fullName: body.fullName,
                    title: body.title,
                    about: body.about,
                    email: body.email,
                    githubUrl: body.githubUrl ?? null,
                    linkedinUrl: body.linkedinUrl ?? null,
                    profileImageUrl: body.profileImageUrl ?? null,
                    skills:
                    {
                        create: skillsData
                    },
                    experiences:
                    {
                        create: experiencesData
                    }
                },
                include:
                {
                    skills: true,
                    experiences: true
                }
            });

        return NextResponse.json(created, { status: 201 });
    }

    // otherwise update (delete nested & recreate)
    await prisma.skill.deleteMany(
        {
            where:
            {
                resumeId: existing.id
            }
        });

    await prisma.experience.deleteMany(
        {
            where:
            {
                resumeId: existing.id
            }
        });

    const updated = await prisma.resume.update(
        {
            where:
            {
                id: existing.id
            },
            data:
            {
                fullName: body.fullName,
                title: body.title,
                about: body.about,
                email: body.email,
                githubUrl: body.githubUrl ?? null,
                linkedinUrl: body.linkedinUrl ?? null,
                profileImageUrl: body.profileImageUrl ?? null,
                skills:
                {
                    create: skillsData
                },
                experiences:
                {
                    create: experiencesData
                }
            },
            include:
            {
                skills: true,
                experiences: true
            }
        });
    revalidatePath("/");
    return NextResponse.json(updated, { status: 200 });
}
