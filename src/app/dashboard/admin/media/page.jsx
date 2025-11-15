"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaImage,
  FaVideo,
  FaBell,
  FaNewspaper,
  FaAward,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";

export default function MediaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    // Check if user is admin only after session is loaded
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Set loading to false after all checks
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  const mediaCards = [
    {
      id: 1,
      title: "ফটো গ্যালারী",
      description: "ফটো গ্যালারী পরিচালনা করুন",
      icon: <FaImage className="text-4xl" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/dashboard/admin/gallery/photo",
      count: 0,
    },
    {
      id: 2,
      title: "ভিডিও গ্যালারী",
      description: "ভিডিও গ্যালারী পরিচালনা করুন",
      icon: <FaVideo className="text-4xl" />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      href: "/dashboard/admin/gallery/video",
      count: 0,
    },
    {
      id: 3,
      title: "সর্বশেষ বিজ্ঞপ্তি",
      description: "বিজ্ঞপ্তি পরিচালনা করুন",
      icon: <FaBell className="text-4xl" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      href: "/dashboard/admin/notices",
      count: 0,
    },
    {
      id: 4,
      title: "বিভিন্ন পত্রিকায় প্রকাশিত সংবাদ",
      description: "সংবাদ পরিচালনা করুন",
      icon: <FaNewspaper className="text-4xl" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/dashboard/admin/news",
      count: 0,
    },
    {
      id: 5,
      title: "প্রাপ্ত পুরস্কার সমূহ",
      description: "পুরস্কার পরিচালনা করুন",
      icon: <FaAward className="text-4xl" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/dashboard/admin/awards",
      count: 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">মিডিয়া</h1>
          <p className="text-gray-600">
            মিডিয়া কন্টেন্ট পরিচালনা করুন
          </p>
        </div>

        {/* Media Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${card.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className={`${card.iconColor} text-white`}>
                      {card.icon}
                    </div>
                    <FaArrowRight className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Card Body */}
                <div className={`${card.bgColor} p-6`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {card.description}
                  </p>
                  {card.count !== undefined && (
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">মোট আইটেম</span>
                      <span className={`px-3 py-1 rounded-full ${card.iconColor} bg-white font-semibold text-sm`}>
                        {card.count}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <FaBell className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                মিডিয়া পরিচালনা
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                উপরের কার্ডগুলোর মাধ্যমে বিভিন্ন মিডিয়া কন্টেন্ট পরিচালনা করতে পারেন। 
                ফটো গ্যালারী, ভিডিও গ্যালারী, বিজ্ঞপ্তি, সংবাদ এবং পুরস্কার পরিচালনা করুন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

