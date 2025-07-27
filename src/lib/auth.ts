import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>> | undefined,
        req
      ) {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (
          user &&
          user.password &&
          bcrypt.compareSync(credentials.password, user.password)
        ) {
          return { id: user.id, email: user.email, name: user.name ?? undefined };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // necessário para CredentialsProvider :contentReference[oaicite:10]{index=10}
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        const userInDb = await prisma.user.findUnique({
          where: { id: token.id as string },
        })

        if (userInDb) {
          session.user.id = userInDb.id
          session.user.username = userInDb.username || null
          session.user.bio = userInDb.bio || null
          session.user.image = userInDb.image || null
          session.user.name = userInDb.name || null
        }
      }

      return session
    }

  },
});
