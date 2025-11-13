"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Lottie from "lottie-react";
import { BiEnvelope, BiHide, BiKey, BiShow } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { AuthContext } from "@/providers/AuthProvider";

const animationPath = "/assets/loginAnimation.json";

export default function LoginForm() {
  const { signIn, googleSignIn } = useContext(AuthContext);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(animationPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load animation");
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setAnimationData(data);
        }
      })
      .catch((error) => {
        console.error("Unable to load login animation:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value.trim();
    const pass = form.pass.value.trim();

    try {
      setLoading(true);
      const result = await signIn(email, pass);
      if (result?.error) {
        throw new Error(result.error);
      }

      // Wait a bit for session to be established after signIn
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Refresh router to update session
      router.refresh();
      
      // Wait a bit more for session to update
      await new Promise((resolve) => setTimeout(resolve, 300));

      Swal.fire({
        title: "স্বাগতম!",
        text: "আপনি সফলভাবে লগইন করেছেন।",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      router.replace(redirectTo);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "লগইন ব্যর্থ",
        text: error.message === "CredentialsSignin" || error.message === "Invalid password" 
          ? "ইমেইল বা পাসওয়ার্ড ভুল।" 
          : "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const result = await googleSignIn();
      if (result?.error) {
        throw new Error(result.error);
      }

      // Wait a bit for OAuth redirect and session to be established
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Refresh router to update session
      router.refresh();
      
      // Wait a bit more for session to update
      await new Promise((resolve) => setTimeout(resolve, 400));

      Swal.fire({
        title: "স্বাগতম!",
        text: "আপনি গুগলের মাধ্যমে সফলভাবে লগইন করেছেন।",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      router.replace(redirectTo);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "লগইন ব্যর্থ",
        text: "গুগল লগইন সম্পন্ন করা যায়নি।",
        icon: "error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-text sm:text-4xl">
              লগইন করুন
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text/80">
              আপনার অ্যাকাউন্টে প্রবেশ করুন এবং রক্তদানের এই মহৎ কাজে যোগ দিন।
            </p>
          </header>

          <div className="mt-12 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="order-2 flex w-full max-w-lg flex-1 flex-col gap-6 lg:order-1">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-xl border border-border bg-cardBg p-6 shadow-sm lg:p-8"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    ইমেইল <span className="text-highlighted">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <BiEnvelope className="absolute left-4 text-xl text-highlighted" />
                    <input
                      className="w-full rounded-lg border border-border bg-background py-3 pl-12 pr-4 text-text transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-highlighted"
                      type="email"
                      name="email"
                      placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    পাসওয়ার্ড <span className="text-highlighted">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <BiKey className="absolute left-4 text-xl text-highlighted" />
                    <input
                      className="w-full rounded-lg border border-border bg-background py-3 pl-12 pr-12 text-text transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-highlighted"
                      type={showPassword ? "text" : "password"}
                      name="pass"
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 text-highlighted transition-colors hover:text-highlighted/80"
                      aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                    >
                      {showPassword ? (
                        <BiHide className="text-xl" />
                      ) : (
                        <BiShow className="text-xl" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="cursor-pointer text-sm text-highlighted transition hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                </div>

                <div className="flex justify-center gap-2 text-sm text-text/80">
                  <span>অ্যাকাউন্ট নেই?</span>
                  <Link
                    href="/registration"
                    className="font-medium text-highlighted transition hover:underline"
                  >
                    নিবন্ধন করুন
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-text font-semibold transition-all duration-200 hover:border-highlighted hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <FcGoogle className="text-2xl" />
                  {googleLoading ? "গুগল দিয়ে লগইন হচ্ছে..." : "গুগল দিয়ে লগইন করুন"}
                </button>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg bg-cta px-4 py-3 text-btn-text font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </button>
              </form>
            </div>

            <div className="order-1 hidden w-full max-w-lg flex-1 lg:order-2 lg:block">
              <div className="flex items-center justify-center">
                {animationData ? (
                  <Lottie animationData={animationData} loop className="h-auto w-full" />
                ) : (
                  <div className="aspect-square w-full max-w-md animate-pulse rounded-3xl bg-rose-100/60" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

