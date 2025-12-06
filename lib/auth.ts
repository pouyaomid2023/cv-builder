// lib/auth.ts
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions =
{
    session:
    {
        strategy: "jwt",
        maxAge: 30 * 60,   // ⏳ نیم ساعت
        updateAge: 5 * 60  // هر 5 دقیقه اگر کاربر اکتیو باشد توکن تمدید می‌شود
    },
    providers:
        [
            CredentialsProvider(
                {
                    name: "Credentials",
                    credentials:
                    {
                        email:
                        {
                            label: "Email",
                            type: "text"
                        },
                        password:
                        {
                            label: "Password",
                            type: "password"
                        }
                    },
                    async authorize(credentials) {
                        const email = credentials?.email?.toLowerCase().trim();
                        const password = credentials?.password;

                        if (!email || !password) {
                            return null;
                        }

                        // فقط Admin ها
                        const admin = await prisma.admin.findFirst(
                            {
                                where:
                                {
                                    email,
                                    isActive: true
                                }
                            });

                        if (!admin) {
                            return null;
                        }

                        const ok = await compare(password, admin.password);
                        if (!ok) {
                            return null;
                        }

                        // چیزی که اینجا return می‌کنی، تو session و token میاد
                        return {
                            id: String(admin.id),
                            email: admin.email,
                            name: admin.name
                        };
                    }
                })
        ],
    pages:
    {
        // فرم لاگین ما اینجاست
        signIn: "/admin/login"
    }
};
