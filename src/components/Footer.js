"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-rose-50 text-gray-700 mt-10 border-t border-rose-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="text-center md:text-left space-y-3">
            <div className="flex items-center justify-center space-x-2 md:justify-start">
              <span className="text-lg font-extrabold tracking-tight text-rose-700">
                গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
              </span>
              <span className="text-lg">🩸</span>
            </div>
            <p className="text-sm text-gray-600">
              মানবতার সেবায় আমরা প্রতিশ্রুতিবদ্ধ—রক্তের প্রয়োজনেই পাশে থাকি। জরুরি
              মুহূর্তে নিরাপদ রক্ত নিশ্চিত করতে আমরা কাজ করি স্বচ্ছতা ও দায়িত্বশীলতার সাথে।
            </p>
            {/* Newsletter */}
            <NewsletterForm />
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 text-gray-800">দ্রুত লিংক</h4>
            <div className="flex justify-center gap-3 text-sm md:flex-col md:justify-start">
              <Link href="/" className="hover:text-rose-700 hover:underline">
                হোম
              </Link>
              <Link href="/search" className="hover:text-rose-700 hover:underline">
                দাতা খুঁজুন
              </Link>
              <Link href="/request" className="hover:text-rose-700 hover:underline">
                রক্তের আবেদন
              </Link>
              <Link href="/registration" className="hover:text-rose-700 hover:underline">
                দাতা নিবন্ধন
              </Link>
              <Link href="/blog" className="hover:text-rose-700 hover:underline">
                ব্লগ
              </Link>
              <Link href="/funding" className="hover:text-rose-700 hover:underline">
                ফান্ডিং
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 text-gray-800">রিসোর্স</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-rose-700 hover:underline">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-700 hover:underline">
                  যোগাযোগ করুন
                </Link>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-rose-700">
                  নীতিমালা ও শর্তাবলী
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-rose-700">
                  গোপনীয়তা নীতি
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left md:justify-self-end space-y-1">
            <h4 className="font-semibold mb-3 text-gray-800">যোগাযোগ</h4>
            <p className="text-sm text-gray-600">গোবিন্দগঞ্জ, গাইবান্ধা</p>
            <p className="text-sm text-gray-600">ইমেইল: info@gsrs.org</p>
            <p className="text-sm text-gray-600">ফোন: 01XXXXXXXXX</p>
            <div className="pt-2 text-sm">
              <a href="#" className="mr-3 hover:text-rose-700 hover:underline">
                ফেসবুক
              </a>
              <a href="#" className="mr-3 hover:text-rose-700 hover:underline">
                ইউটিউব
              </a>
              <a href="#" className="hover:text-rose-700 hover:underline">
                মেসেঞ্জার
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-rose-200 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

function NewsletterForm() {
  return (
    <form
      className="mx-auto flex max-w-sm items-center gap-2 md:mx-0"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        type="email"
        placeholder="আপনার ইমেইল"
        className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
      />
      <button
        type="submit"
        className="rounded-md bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
      >
        সাবস্ক্রাইব
      </button>
    </form>
  );
}
