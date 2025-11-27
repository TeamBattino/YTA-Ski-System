import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getAdminByEmail } from "@/lib/db-helper";

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
