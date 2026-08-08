import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, Kakao, Naver],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/start" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.sub) token.providerUserId = profile.sub;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id?: string }).id = token.sub || String(token.providerUserId || "");
      }
      return session;
    },
  },
});
