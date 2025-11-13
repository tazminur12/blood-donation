"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";

const animationPath = "/assets/Lottie red.json";

export default function Contact() {
  const [animationData, setAnimationData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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
        console.error("Failed to load contact animation:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
    alert("ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে।");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <PageTitle title="যোগাযোগ করুন" />

        {/* Intro Card */}
        <div className="bg-cardBg rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-highlighted">
            সাহায্য লাগলে আমরা আছি আপনার পাশে
          </h2>
          <p className="mt-2">
            রক্তদাতা খোঁজ, রক্তের আবেদন, কিংবা সহযোগিতা বিষয়ে যেকোনো প্রশ্ন থাকলে আমাদেরকে
            বার্তা দিন। আমরা দ্রুত উত্তর দেওয়ার চেষ্টা করি।
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Lottie Animation */}
          <div className="flex justify-center md:justify-start">
            <div className="max-w-[350px] sm:max-w-[400px] lg:max-w-[450px]">
              {animationData ? (
                <Lottie animationData={animationData} loop={true} />
              ) : (
                <div className="aspect-square w-full animate-pulse rounded-3xl bg-rose-100/60" />
              )}
            </div>
          </div>

          {/* Contact Form */}
          <form
            className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-rose-100 w-full"
            onSubmit={handleSubmit}
          >
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                আপনার নাম
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="আপনার নাম লিখুন"
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                আপনার ইমেইল
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                বিষয়
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="বার্তার বিষয়"
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                আপনার বার্তা
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="আপনার বার্তা লিখুন..."
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-cta text-btn-text font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              বার্তা পাঠান
            </button>
          </form>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border p-6 bg-white/70">
            <h3 className="text-lg font-semibold mb-1">ঠিকানা</h3>
            <p className="text-sm text-gray-700">গোবিন্দগঞ্জ, গাইবান্ধা</p>
          </div>
          <div className="rounded-xl border border-border p-6 bg-white/70">
            <h3 className="text-lg font-semibold mb-1">যোগাযোগ</h3>
            <p className="text-sm text-gray-700">ইমেইল: info@gsrs.org</p>
            <p className="text-sm text-gray-700">ফোন: 01XXXXXXXXX</p>
          </div>
          <div className="rounded-xl border border-border p-6 bg-white/70">
            <h3 className="text-lg font-semibold mb-1">সোশ্যাল</h3>
            <div className="text-sm">
              <a href="#" className="mr-3 hover:underline hover:text-rose-700">
                ফেসবুক
              </a>
              <a href="#" className="mr-3 hover:underline hover:text-rose-700">
                ইউটিউব
              </a>
              <a href="#" className="hover:underline hover:text-rose-700">
                মেসেঞ্জার
              </a>
            </div>
          </div>
        </div>

        {/* Help CTA */}
        <div className="text-center">
          <Link
            href="/faq"
            className="inline-block px-6 py-3 rounded-lg border border-rose-200 hover:border-highlighted hover:text-highlighted transition"
          >
            সাধারণ জিজ্ঞাসা (FAQ)
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

