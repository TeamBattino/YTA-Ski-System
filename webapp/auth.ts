import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { getAdminByEmail } from "@/lib/db-helper";
import { admin as Admin } from "@/src/generated/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  debug:true, 
  callbacks: {
    async signIn({user:{email} }) {
      if (!email){
        return false;
      }
      const admin = await getAdminByEmail(email);
      if (admin.length) {
        return true;
      }
      return Response.redirect(new URL('/dashboard/leaderboard'));;
    },
    async redirect({ url }) {
      return url;
    },
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});
