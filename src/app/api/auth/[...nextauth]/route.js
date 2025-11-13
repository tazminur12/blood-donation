import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword, createUser, updateUser } from "@/lib/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await getUserByEmail(credentials.email);
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if user has a password (OAuth users might not have one)
          if (!user.password) {
            throw new Error("This account can only be accessed via Google sign in");
          }

          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            bloodGroup: user.bloodGroup,
            division: user.division,
            district: user.district,
            upazila: user.upazila,
            role: user.role || "donor",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign in
      if (account?.provider === "google") {
        try {
          const existingUser = await getUserByEmail(user.email);
          
          if (!existingUser) {
            // Create new user from Google account
            await createUser({
              name: user.name || profile?.name || user.email.split("@")[0],
              email: user.email,
              password: null, // No password for OAuth users
              photoURL: user.image || profile?.picture || null,
              bloodGroup: null,
              division: null,
              district: null,
              upazila: null,
              role: "donor", // Default role for new users (donor)
            });
          } else {
            // Update user image if available and different
            if (user.image && user.image !== existingUser.image) {
              await updateUser(user.email, { image: user.image });
            }
          }
          
          return true;
        } catch (error) {
          console.error("Error in Google sign in:", error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.bloodGroup = user.bloodGroup;
        token.division = user.division;
        token.district = user.district;
        token.upazila = user.upazila;
        token.role = user.role || "user";
      }

      // Fetch fresh user data for Google users on each sign in
      if (account?.provider === "google" && user?.email) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.bloodGroup = dbUser.bloodGroup;
          token.division = dbUser.division;
          token.district = dbUser.district;
          token.upazila = dbUser.upazila;
          token.role = dbUser.role || "donor";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.bloodGroup = token.bloodGroup;
        session.user.division = token.division;
        session.user.district = token.district;
        session.user.upazila = token.upazila;
        session.user.role = token.role || "donor";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

