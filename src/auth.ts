import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { getApiUrl } from "@/lib/api"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string)?.trim()?.toLowerCase();
        const password = credentials?.password as string;

        if (!email || !password || password.length < 4) {
          return null;
        }

        const formattedName =
          email === "demo@wanderlust.com"
            ? "Demo User"
            : email
                .split("@")[0]
                .replace(/[._]/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          id: email,
          name: formattedName,
          email,
          image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.email) {
        token.id = user.id || token.sub;
        // Record login event to backend
        try {
          const apiUrl = getApiUrl();
          fetch(`${apiUrl}/user/login-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              loginAt: new Date().toISOString(),
            }),
          }).catch(() => {});
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
})
