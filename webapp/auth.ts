import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  debug: false,
  callbacks: {
    async signIn({user:{email} }) {
      if (!email){
        return false;
      }
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (admin) {
        return true;
      }
      return '/dashboard/login';
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
