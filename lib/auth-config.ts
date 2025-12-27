import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            try {
                // Check if user exists
                let dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!dbUser) {
                    // Create new user
                    dbUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name || "User",
                            password: "", // No password for OAuth users
                        },
                    });
                }

                // Link any guest orders to this user
                await prisma.order.updateMany({
                    where: {
                        customerEmail: {
                            equals: user.email,
                            mode: "insensitive",
                        },
                        userId: null,
                    },
                    data: {
                        userId: dbUser.id,
                    },
                });

                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });
                if (dbUser) {
                    token.userId = dbUser.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token.userId) {
                session.user.id = token.userId as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET || process.env.JWT_SECRET || "fallback-secret-for-development-only",
});
