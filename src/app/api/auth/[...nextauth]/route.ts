// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, SessionStrategy } from "next-auth"; // Import AuthOptions and SessionStrategy
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";

// Extend the Session type to include 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: AuthOptions = { // Explicitly type authOptions as AuthOptions
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt" as SessionStrategy, // Explicitly cast "jwt" to SessionStrategy
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        return valid ? { id: user.id, email: user.email, name: user.name } : null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // sua página personalizada
  },
  callbacks: {
    session: async ({ session, token }) => {
      // Ensure session.user exists before assigning id
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };