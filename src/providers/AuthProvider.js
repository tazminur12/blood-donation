"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext({
  user: null,
  loading: true,
  logOut: async () => {},
  signIn: async () => {},
  googleSignIn: async () => {},
  createUser: async () => {},
  updateUser: async () => {},
  setUser: () => {},
});

export default function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  // Normalize user object to match component expectations
  const user = session?.user
    ? {
        ...session.user,
        displayName: session.user.name || session.user.email?.split("@")[0] || "User",
        photoURL: session.user.image || null,
        email: session.user.email,
      }
    : null;

  const handleSignIn = useCallback(
    async (email, password) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    []
  );

  const handleGoogleSignIn = useCallback(async () => {
    const result = await signIn("google", {
      callbackUrl: "/",
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  }, []);

  const createUser = useCallback(
    async ({ name, email, mobile, photoURL, bloodGroup, division, district, upazila, password }) => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            mobile,
            password,
            photoURL,
            bloodGroup,
            division,
            district,
            upazila,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create user");
        }

        // After successful registration, sign in the user
        await handleSignIn(email, password);

        return data.user;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },
    [handleSignIn]
  );

  const logOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
  }, [router]);

  const updateUser = useCallback(async (updates) => {
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      // Refresh session to get updated data
      router.refresh();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      logOut,
      signIn: handleSignIn,
      googleSignIn: handleGoogleSignIn,
      createUser,
      updateUser,
      setUser: () => {}, // Not needed with NextAuth
    }),
    [user, loading, logOut, handleSignIn, handleGoogleSignIn, createUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

