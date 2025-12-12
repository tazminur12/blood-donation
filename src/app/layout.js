import { Geist, Geist_Mono, Tiro_Bangla } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import AuthProvider from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tiroBangla = Tiro_Bangla({
  variable: "--font-bangla",
  subsets: ["latin", "bengali"],
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন | Blood Donation Management System",
  description: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S) - একটি সম্পূর্ণ ডিজিটাল রক্তদান ব্যবস্থাপনা প্ল্যাটফর্ম। রক্তদাতা, প্রশাসক এবং স্বেচ্ছাসেবীরা সহজেই রক্তদান প্রক্রিয়া পরিচালনা করতে পারবেন। Blood Donation Management System - Manage blood requests, appointments, campaigns, and connect donors with patients in need.",
  keywords: [
    "রক্তদান",
    "blood donation",
    "গোবিন্দগঞ্জ",
    "Gobindhagonj",
    "রক্তদান সংগঠন",
    "blood donation organization",
    "রক্তদাতা",
    "blood donor",
    "রক্তের প্রয়োজন",
    "blood request",
    "G.S.R.S",
  ],
  authors: [{ name: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন" }],
  icons: {
    icon: "/Favicon/hypertension.png",
    apple: "/Favicon/hypertension.png",
  },
  openGraph: {
    title: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন | Blood Donation Management System",
    description: "একটি সম্পূর্ণ ডিজিটাল রক্তদান ব্যবস্থাপনা প্ল্যাটফর্ম - রক্তদাতা, প্রশাসক এবং স্বেচ্ছাসেবীদের জন্য",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tiroBangla.variable} antialiased`}
      >
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
