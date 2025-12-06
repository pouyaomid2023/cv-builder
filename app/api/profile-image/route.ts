// app/api/profile-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    // فقط ادمین لاگین کرده حق آپلود دارد
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json(
            { error: "No file provided" },
            { status: 400 }
        );
    }

    // محدودیت سایز (مثلاً 2 مگ)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        return NextResponse.json(
            { error: "File too large (max 2MB)" },
            { status: 413 }
        );
    }

    const mime = file.type || "";
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(mime)) {
        return NextResponse.json(
            { error: "Only JPG, PNG, and WEBP are allowed" },
            { status: 400 }
        );
    }

    // استخراج پسوند
    let ext = ".png";
    if (mime === "image/jpeg") ext = ".jpg";
    if (mime === "image/webp") ext = ".webp";

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // مطمئن شو فولدر وجود داره
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${randomUUID()}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // URL قابل دسترس از سمت کلاینت
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json(
        {
            url: publicUrl
        },
        { status: 200 }
    );
}
