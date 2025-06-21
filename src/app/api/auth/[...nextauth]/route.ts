import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { environmentConfig } from "@/config/environment.config";

const handler = NextAuth({
  secret: environmentConfig.get().NEXTAUTH_SECRET,
  providers: [
    Auth0Provider({
      clientId: environmentConfig.get().AUTH0_CLIENT_ID,
      clientSecret: environmentConfig.get().AUTH0_CLIENT_SECRET,
      issuer: environmentConfig.get().AUTH0_ISSUER,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };

