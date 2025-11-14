"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaVideo,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaEnvelope,
  FaArrowLeft,
  FaSpinner,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

export default function ContentCreatorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/content-creators/${params.id}`);
        const data = await res.json();

        if (res.ok && data.success && data.contentCreator) {
          setCreator(data.contentCreator);
        } else {
          // Fallback: try fetching all and finding the one
          const allRes = await fetch("/api/content-creators");
          const allData = await allRes.json();
          if (allRes.ok && allData.success) {
            const found = allData.contentCreators?.find(
              (c) => c.id === params.id
            );
            if (found) {
              setCreator(found);
            } else {
              setError("কনটেন্ট ক্রিয়েটর পাওয়া যায়নি");
            }
          } else {
            setError("ডেটা লোড করতে সমস্যা হয়েছে");
          }
        }
      } catch (err) {
        console.error("Error fetching creator:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCreator();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-3" />
          <p className="text-purple-600 font-semibold text-lg">তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-3">⚠️</div>
            <p className="text-red-600 font-semibold text-lg mb-4">
              {error || "কনটেন্ট ক্রিয়েটর পাওয়া যায়নি"}
            </p>
            <Link
              href="/all-service/content-creator"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <FaArrowLeft />
              ফিরে যান
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/all-service/content-creator"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition"
          >
            <FaArrowLeft />
            <span>ফিরে যান</span>
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              {creator.image ? (
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <FaVideo className="text-white text-3xl" />
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {creator.name}
            </h1>
            <p className="text-lg text-purple-100">{creator.specialty}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Profile Section */}
          <div className="p-8 text-center border-b border-gray-200">
            <div className="relative inline-block mb-6">
              {creator.image ? (
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 shadow-lg mx-auto"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 border-4 border-purple-100 flex items-center justify-center mx-auto">
                  <FaUser className="text-purple-600 text-4xl" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <FaCheckCircle className="text-white text-sm" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {creator.name}
            </h2>
            <p className="text-purple-600 font-semibold text-lg mb-4 px-4 py-2 bg-purple-50 rounded-full inline-block">
              {creator.specialty}
            </p>
          </div>

          {/* Contact Information */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaEnvelope className="text-purple-600" />
              যোগাযোগের তথ্য
            </h3>

            <div className="space-y-4 mb-8">
              {creator.email && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaEnvelope className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">ইমেইল</p>
                    <a
                      href={`mailto:${creator.email}`}
                      className="text-gray-800 font-semibold hover:text-purple-600 transition"
                    >
                      {creator.email}
                    </a>
                  </div>
                  <a
                    href={`mailto:${creator.email}`}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                  >
                    ইমেইল করুন
                  </a>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaVideo className="text-purple-600" />
                সোশ্যাল মিডিয়া
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {creator.facebook && (
                  <a
                    href={creator.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group border border-blue-200"
                  >
                    <div className="bg-blue-600 p-3 rounded-full group-hover:scale-110 transition">
                      <FaFacebook className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Facebook</p>
                      <p className="text-gray-800 font-semibold group-hover:text-blue-600 transition">
                        Facebook Profile
                      </p>
                    </div>
                    <span className="text-blue-600">→</span>
                  </a>
                )}

                {creator.instagram && (
                  <a
                    href={creator.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition group border border-pink-200"
                  >
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full group-hover:scale-110 transition">
                      <FaInstagram className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Instagram</p>
                      <p className="text-gray-800 font-semibold group-hover:text-pink-600 transition">
                        Instagram Profile
                      </p>
                    </div>
                    <span className="text-pink-600">→</span>
                  </a>
                )}

                {creator.youtube && (
                  <a
                    href={creator.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition group border border-red-200"
                  >
                    <div className="bg-red-600 p-3 rounded-full group-hover:scale-110 transition">
                      <FaYoutube className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">YouTube</p>
                      <p className="text-gray-800 font-semibold group-hover:text-red-600 transition">
                        YouTube Channel
                      </p>
                    </div>
                    <span className="text-red-600">→</span>
                  </a>
                )}

                {creator.tiktok && (
                  <a
                    href={creator.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group border border-gray-200"
                  >
                    <div className="bg-black p-3 rounded-full group-hover:scale-110 transition">
                      <FaTiktok className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">TikTok</p>
                      <p className="text-gray-800 font-semibold group-hover:text-gray-600 transition">
                        TikTok Profile
                      </p>
                    </div>
                    <span className="text-gray-600">→</span>
                  </a>
                )}

                {!creator.facebook &&
                  !creator.instagram &&
                  !creator.youtube &&
                  !creator.tiktok && (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      <FaVideo className="text-4xl mx-auto mb-2 text-gray-300" />
                      <p>সোশ্যাল মিডিয়া লিঙ্ক যোগ করা হয়নি</p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {creator.email && (
                <a
                  href={`mailto:${creator.email}`}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  ইমেইল করুন
                </a>
              )}
              <Link
                href="/all-service/content-creator"
                className="flex-1 bg-white border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg hover:bg-purple-50 transition-all duration-200 font-semibold text-center flex items-center justify-center gap-2"
              >
                <FaArrowLeft />
                সব ক্রিয়েটর দেখুন
              </Link>
            </div>
          </div>
        </div>

        {/* Related Info */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            সম্পর্কিত তথ্য
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-700">বিশেষত্ব:</span>{" "}
              {creator.specialty}
            </div>
            {creator.createdAt && (
              <div>
                <span className="font-semibold text-gray-700">যোগ করা হয়েছে:</span>{" "}
                {new Date(creator.createdAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

