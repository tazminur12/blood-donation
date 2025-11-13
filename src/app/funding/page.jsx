"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";

const fundingAreas = [
  {
    title: "রক্ত সংগ্রহ কার্যক্রম",
    description: "রক্ত সংগ্রহ, পরীক্ষা, সংরক্ষণ এবং বিতরণের জন্য প্রয়োজনীয় সরঞ্জাম ও উপকরণ ক্রয়।",
    icon: "🩸",
  },
  {
    title: "স্বেচ্ছাসেবী প্রশিক্ষণ",
    description: "স্বেচ্ছাসেবীদের দক্ষতা বৃদ্ধি, রক্তদান সচেতনতা এবং জরুরি সাড়া প্রদানের প্রশিক্ষণ।",
    icon: "📚",
  },
  {
    title: "প্রযুক্তি উন্নয়ন",
    description: "ওয়েব প্ল্যাটফর্ম, মোবাইল অ্যাপ এবং ডাটাবেস উন্নয়ন ও রক্ষণাবেক্ষণ।",
    icon: "💻",
  },
  {
    title: "পরিবহন ও যোগাযোগ",
    description: "জরুরি রক্ত পরিবহন, স্বেচ্ছাসেবীদের চলাচল এবং যোগাযোগ খরচ।",
    icon: "🚗",
  },
  {
    title: "সচেতনতা কার্যক্রম",
    description: "রক্তদান সম্পর্কে জনসচেতনতা বৃদ্ধির জন্য ক্যাম্পেইন, সেমিনার এবং প্রচার।",
    icon: "📢",
  },
  {
    title: "জরুরি সাড়া",
    description: "২৪/৭ জরুরি রক্তের প্রয়োজন মেটাতে দ্রুত সাড়া প্রদানের ব্যবস্থা।",
    icon: "🚨",
  },
];

const donationMethods = [
  {
    method: "ব্যাংক ট্রান্সফার",
    details: "সরাসরি ব্যাংক একাউন্টে টাকা পাঠান",
    info: "একাউন্ট নম্বর: 1234567890123\nব্যাংক: সোনালী ব্যাংক লিমিটেড\nশাখা: গোবিন্দগঞ্জ, গাইবান্ধা",
    icon: "🏦",
  },
  {
    method: "মোবাইল ব্যাংকিং",
    details: "bKash, Nagad, Rocket এর মাধ্যমে সহজে দান করুন",
    info: "bKash: 01XXXXXXXXX\nNagad: 01XXXXXXXXX\nRocket: 01XXXXXXXXX",
    icon: "📱",
  },
  {
    method: "অনলাইন পেমেন্ট",
    details: "ক্রেডিট/ডেবিট কার্ড বা অনলাইন ওয়ালেট ব্যবহার করুন",
    info: "শীঘ্রই আসছে...",
    icon: "💳",
  },
];

const impactStats = [
  { label: "সংগৃহীত তহবিল", value: "৫,০০,০০০+" },
  { label: "সহায়ক দাতা", value: "২,৫০০+" },
  { label: "সম্পন্ন প্রকল্প", value: "১৫+" },
  { label: "সহায়ক পরিবার", value: "১০,০০০+" },
];

export default function FundingPage() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleDonorChange = (e) => {
    setDonorInfo({
      ...donorInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement donation submission logic
    alert("ধন্যবাদ! আপনার দানের জন্য আমরা কৃতজ্ঞ।");
    setDonorInfo({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setDonationAmount("");
    setSelectedMethod(null);
  };

  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PageTitle title="ফান্ডিং ও সহায়তা" />

        {/* Hero Section */}
        <section className="mb-12 rounded-3xl bg-gradient-to-br from-rose-500/90 via-rose-400 to-rose-500 p-8 text-white shadow-lg sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              মানবতার সেবায় আপনার সহায়তা
            </h1>
            <p className="mb-6 text-lg leading-relaxed text-rose-50/90 sm:text-xl">
              প্রতিটি অনুদান একটি জীবন বাঁচাতে সাহায্য করে। আপনার সহায়তায় আমরা আরও বেশি
              মানুষের কাছে নিরাপদ রক্ত পৌঁছে দিতে পারি।
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {impactStats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/80 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Funding Section */}
        <section className="mb-12 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="mb-8 text-center">
            <span className="inline-flex w-fit items-center rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600">
              কেন ফান্ডিং প্রয়োজন
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-rose-900 sm:text-3xl">
              আপনার দান কীভাবে ব্যবহৃত হয়
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-rose-900/70 sm:text-base">
              আমরা সম্পূর্ণ স্বচ্ছতার সাথে প্রতিটি টাকার হিসাব রাখি এবং নিয়মিত আর্থিক প্রতিবেদন
              প্রকাশ করি।
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fundingAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{area.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-rose-900">{area.title}</h3>
                <p className="text-sm text-rose-900/70">{area.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Donation Methods Section */}
        <section className="mb-12 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-rose-900 sm:text-3xl">
              দানের পদ্ধতি
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-rose-900/70 sm:text-base">
              আপনার সুবিধামতো যে কোনো পদ্ধতিতে দান করতে পারেন
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {donationMethods.map((method) => (
              <div
                key={method.method}
                className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                  selectedMethod === method.method
                    ? "border-rose-500 bg-rose-50 shadow-md"
                    : "border-rose-100 bg-white hover:border-rose-300 hover:shadow-sm"
                }`}
                onClick={() => setSelectedMethod(method.method)}
              >
                <div className="mb-3 text-4xl">{method.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-rose-900">{method.method}</h3>
                <p className="mb-3 text-sm text-rose-900/70">{method.details}</p>
                {selectedMethod === method.method && (
                  <div className="mt-4 rounded-lg bg-white p-3 text-xs text-rose-900/80 whitespace-pre-line">
                    {method.info}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="mb-12 rounded-3xl bg-gradient-to-br from-rose-500/90 to-rose-600 p-6 text-white shadow-lg sm:p-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center text-2xl font-semibold sm:text-3xl">
              এখনই দান করুন
            </h2>
            <form onSubmit={handleDonationSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  আপনার নাম <span className="text-rose-200">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={donorInfo.name}
                  onChange={handleDonorChange}
                  required
                  placeholder="আপনার নাম লিখুন"
                  className="w-full rounded-lg border border-rose-300 bg-white/90 p-3 text-gray-900 placeholder-gray-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    ইমেইল <span className="text-rose-200">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={donorInfo.email}
                    onChange={handleDonorChange}
                    required
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-rose-300 bg-white/90 p-3 text-gray-900 placeholder-gray-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    মোবাইল নম্বর <span className="text-rose-200">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={donorInfo.phone}
                    onChange={handleDonorChange}
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-rose-300 bg-white/90 p-3 text-gray-900 placeholder-gray-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">দানের পরিমাণ (টাকা)</label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="দানের পরিমাণ লিখুন"
                  min="1"
                  className="w-full rounded-lg border border-rose-300 bg-white/90 p-3 text-gray-900 placeholder-gray-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">বার্তা (ঐচ্ছিক)</label>
                <textarea
                  name="message"
                  value={donorInfo.message}
                  onChange={handleDonorChange}
                  rows="3"
                  placeholder="আপনার বার্তা লিখুন..."
                  className="w-full rounded-lg border border-rose-300 bg-white/90 p-3 text-gray-900 placeholder-gray-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-white px-6 py-3 text-lg font-semibold text-rose-600 shadow-md transition hover:bg-rose-50 hover:shadow-lg"
              >
                দান করুন
              </button>
            </form>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="mb-12 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-rose-900 sm:text-3xl">
              স্বচ্ছতা ও জবাবদিহিতা
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-rose-900/70 sm:text-base">
              আমরা বিশ্বাস করি সম্পূর্ণ স্বচ্ছতা আমাদের দায়িত্বশীলতার প্রমাণ
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/40 p-6">
              <h3 className="mb-3 text-xl font-semibold text-rose-900">আর্থিক প্রতিবেদন</h3>
              <p className="mb-4 text-sm text-rose-900/70">
                আমরা প্রতি ত্রৈমাসিকে বিস্তারিত আর্থিক প্রতিবেদন প্রকাশ করি যেখানে প্রতিটি
                আয়-ব্যয়ের হিসাব দেখানো হয়।
              </p>
              <Link
                href="#"
                className="inline-flex items-center text-sm font-medium text-highlighted hover:underline"
              >
                প্রতিবেদন দেখুন →
              </Link>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/40 p-6">
              <h3 className="mb-3 text-xl font-semibold text-rose-900">দাতাদের তালিকা</h3>
              <p className="mb-4 text-sm text-rose-900/70">
                আমাদের সম্মানিত দাতাদের তালিকা (ঐচ্ছিক) প্রকাশ করা হয়। আপনার নাম প্রকাশ করতে
                চাইলে দানের সময় জানাবেন।
              </p>
              <Link
                href="#"
                className="inline-flex items-center text-sm font-medium text-highlighted hover:underline"
              >
                দাতাদের তালিকা →
              </Link>
            </div>
          </div>
        </section>

        {/* Impact Stories Section */}
        <section className="mb-12 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-rose-900 sm:text-3xl">
              আপনার দানের প্রভাব
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-rose-900/70 sm:text-base">
              প্রতিটি দান একটি গল্প তৈরি করে—একটি পরিবারের আশা, একটি রোগীর সুস্থতা
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/60 p-6">
              <div className="mb-3 text-3xl">💝</div>
              <h3 className="mb-2 text-lg font-semibold text-rose-900">
                জরুরি রক্ত সরবরাহ
              </h3>
              <p className="text-sm text-rose-900/70">
                "আপনাদের সহায়তায় আমরা গত মাসে ১৫০+ জরুরি রক্ত সরবরাহ করতে পেরেছি। প্রতিটি
                রক্ত একটি জীবন বাঁচিয়েছে।" — স্বেচ্ছাসেবী দল
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/60 p-6">
              <div className="mb-3 text-3xl">🎓</div>
              <h3 className="mb-2 text-lg font-semibold text-rose-900">
                প্রশিক্ষণ কার্যক্রম
              </h3>
              <p className="text-sm text-rose-900/70">
                "২০০+ স্বেচ্ছাসেবীকে আমরা রক্তদান সম্পর্কিত প্রশিক্ষণ দিয়েছি। এখন তারা আরও
                দক্ষতার সাথে কাজ করতে পারছেন।" — প্রশিক্ষণ বিভাগ
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-3xl bg-rose-500/90 p-8 text-center text-white shadow-lg sm:p-12">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
            মানবতার সেবায় আপনার সহায়তা চাই
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-rose-50/90 sm:text-lg">
            প্রতিটি অনুদান আমাদের আরও বেশি মানুষের কাছে পৌঁছাতে সাহায্য করে। আপনার সহায়তায়
            আমরা আরও শক্তিশালী হতে পারি।
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-rose-600 shadow-md transition hover:bg-rose-50 hover:shadow-lg"
            >
              যোগাযোগ করুন
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              আমাদের সম্পর্কে জানুন
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

