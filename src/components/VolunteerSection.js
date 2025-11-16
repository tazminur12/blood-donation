"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHandsHelping } from "react-icons/fa";

export default function VolunteerSection() {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/members.jpg"
          alt="স্বেচ্ছাসেবকগণ"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FaHandsHelping className="text-5xl md:text-6xl text-white" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            স্বেচ্ছাসেবক হোন
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 mb-8">
          <p className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed">
            আপনি কি একজন স্বেচ্ছাসেবক হতে প্রস্তুত? আপনি আমাদের সাথে স্বেচ্ছাশ্রমে মাধ্যমে আপনার সময়, দক্ষতা এবং জ্ঞান অবদান রাখতে পারেন। এটি একটি ইতিবাচক প্রভাব তৈরি করার একটি সুযোগ এবং শান্তি ও উন্নয়ন অর্জনের জন্য একটি গুরুত্বপূর্ণ শক্তি। অনেকের জীবনে একটা পার্থক্য গড়ে তুলুন!
          </p>
        </div>

        <Link
          href="/member-application"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          এখনি যোগ দিন
        </Link>
      </div>
    </section>
  );
}

