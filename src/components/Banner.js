"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const animationPath = "/assets/blood%20donner.json";

export default function Banner() {
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
        console.error("Failed to load banner animation:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <div className="container mx-auto flex min-h-[80vh] flex-col-reverse items-center justify-between gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:py-12 lg:px-8">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-tight">
            মুমূর্ষু রোগির প্রাণের টানে,
            <span className="text-highlighted"> এগিয়ে আসুন রক্তদানে</span>
          </h1>
          <p className="mx-auto max-w-md text-base lg:mx-0">
            প্রতিটি ফোঁটা গুরুত্বপূর্ণ। স্বেচ্ছায় রক্ত দিন, কারও জীবনে আলো ফিরিয়ে আনুন।
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/search"
              className="rounded-lg bg-cta px-6 py-2.5 text-base font-semibold text-btn-text shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:rounded-full"
            >
              🔍 দাতা খুঁজুন
            </Link>
            <Link
              href="/registration"
              className="rounded-lg border-2 border-highlighted px-6 py-2.5 text-base font-medium text-highlighted transition-all duration-300 hover:bg-rose-50"
            >
              দাতা হোন
            </Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          <div className="max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]">
            {animationData ? (
              <Lottie animationData={animationData} loop />
            ) : (
              <div className="aspect-square w-full animate-pulse rounded-3xl bg-rose-100/60" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
