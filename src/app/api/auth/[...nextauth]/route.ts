import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { environmentConfig } from "@/config/environment.config";
import { authService } from "@/services/auth.service";

const handler = NextAuth({
  secret: environmentConfig.get().NEXTAUTH_SECRET,
  providers: [
    Auth0Provider({
      clientId: environmentConfig.get().AUTH0_CLIENT_ID,
      clientSecret: environmentConfig.get().AUTH0_CLIENT_SECRET,
      issuer: environmentConfig.get().AUTH0_ISSUER,
      authorization: {
        params: {
          prompt: "login",
          scope: "openid profile email read:roles"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.id_token) {
          try {
            console.log('ID Token exists:', !!account.id_token);
            console.log('ID Token length:', account.id_token.length);
            
            const tokenParts = account.id_token.split('.');
            console.log('Token parts count:', tokenParts.length);
            
            if (tokenParts.length !== 3) {
              console.log('Invalid JWT token format - expected 3 parts');
              token.role = 'user';
              return {
                ...token,
                accessToken: account.access_token,
              };
            }
            
            const payloadBase64 = tokenParts[1];
            console.log('Payload base64 length:', payloadBase64.length);
            
            const paddedPayload = payloadBase64 + '='.repeat((4 - payloadBase64.length % 4) % 4);
            
            const payloadString = Buffer.from(paddedPayload, 'base64').toString('utf8');
            console.log('Payload string:', payloadString);
            
            const payload = JSON.parse(payloadString);
            
            console.log('Full JWT Payload:', JSON.stringify(payload, null, 2));
            console.log('User ID:', user.id);
            console.log('User Email:', user.email);
            
            const roles = authService.parseAuth0Roles(payload);
            
            const isAdmin = authService.checkAdminRole(roles);
            
            token.role = isAdmin ? 'admin' : 'user';
            
            console.log('Parsed roles:', roles);
            console.log('Is admin check:', isAdmin);
            console.log('Final assigned role:', token.role);
            console.log('🔍 === AUTH0 DEBUG END ===');
            
          } catch (error) {
            console.error('Error parsing JWT token:', error);
            console.error('Error details:', {
              message: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : 'No stack trace'
            });
            token.role = 'user'; 
          }
        } else {
          console.log('No ID token found');
        }
        
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
      if (token.role) {
        session.user.role = token.role as string;
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

