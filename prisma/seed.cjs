// prisma/seed.cjs

const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function seedAdmin()
{
    const adminExists = await prisma.admin.findFirst();

    if (adminExists)
    {
        console.log("👮 Admin already exists. Skipping admin seed.");
        return;
    }

    const name  = process.env.SEED_ADMIN_NAME  || "Super Admin";
    const phone = process.env.SEED_ADMIN_PHONE || "09120000000";
    const email = (process.env.SEED_ADMIN_EMAIL || "admin@example.com").toLowerCase();
    const pass  = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

    const passwordHash = await hash(pass, 12);

    const admin = await prisma.admin.create(
    {
        data:
        {
            name,
            phone,
            email,
            password: passwordHash,
            isActive: true
        }
    });

    console.log("✅ Seed admin created:", { id: admin.id, name, phone, email });
}

async function main()
{
    await seedAdmin();
}

main()
    .catch((e) =>
    {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () =>
    {
        await prisma.$disconnect();
    });
