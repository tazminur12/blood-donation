"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaVideo,
  FaSpinner,
} from "react-icons/fa";

export default function ContentCreatorPage() {
  const [contentCreators, setContentCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  useEffect(() => {
    const fetchContentCreators = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/content-creators");
        const data = await res.json();

        if (res.ok && data.success) {
          setContentCreators(data.contentCreators || []);
        } else {
          setError("ডেটা লোড করতে সমস্যা হয়েছে।");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchContentCreators();
  }, []);

  // Get unique specialties for filter
  const specialties = useMemo(() => {
    return [...new Set(contentCreators.map((creator) => creator.specialty).filter(Boolean))];
  }, [contentCreators]);

  // Filter creators based on search and specialty
  const filteredCreators = useMemo(() => {
    return contentCreators.filter((creator) => {
      const matchesSearch =
        !searchTerm ||
        creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty = !selectedSpecialty || creator.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [contentCreators, searchTerm, selectedSpecialty]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
              <FaVideo className="text-white text-xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              গোবিন্দগঞ্জের কনটেন্ট ক্রিয়েটর
            </h1>
            <p className="text-sm md:text-base text-purple-100 max-w-2xl mx-auto">
              ভিডিও, ফটো, ডিজাইন, ভয়েস ওভার, সোশ্যাল মিডিয়া ও আরও অনেক কনটেন্ট ক্রিয়েটরদের তালিকা
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-full inline-block mb-3">
              <FaVideo className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {contentCreators.length}
            </h3>
            <p className="text-gray-600 text-sm font-medium">মোট ক্রিয়েটর</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-2 rounded-full inline-block mb-3">
              <FaFilter className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {specialties.length}
            </h3>
            <p className="text-gray-600 text-sm font-medium">বিশেষত্ব</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full inline-block mb-3">
              <FaEnvelope className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">২৪/৭</h3>
            <p className="text-gray-600 text-sm font-medium">যোগাযোগ</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <FaSearch className="mr-2 text-purple-600" />
            কনটেন্ট ক্রিয়েটর খুঁজুন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="নাম বা বিশেষত্ব অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            {/* Specialty Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-sm cursor-pointer"
              >
                <option value="">সব বিশেষত্ব</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            {/* Results Count */}
            <div className="flex items-center justify-center md:justify-end">
              <div className="inline-flex items-center bg-purple-50 px-4 py-2 rounded-full">
                <span className="text-gray-700 text-sm">
                  <span className="font-bold text-purple-600">{filteredCreators.length}</span> জন
                  কনটেন্ট ক্রিয়েটর পাওয়া গেছে
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              কোন কনটেন্ট ক্রিয়েটর পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              অনুগ্রহ করে আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("");
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold text-sm"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group transform hover:-translate-y-1"
              >
                <div className="relative mb-4">
                  {creator.image ? (
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 shadow group-hover:border-purple-200 transition-colors duration-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 border-4 border-purple-100 flex items-center justify-center">
                      <FaVideo className="text-purple-600 text-2xl" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                  {creator.name}
                </h3>

                <p className="text-purple-600 font-medium mb-3 px-3 py-1 bg-purple-50 rounded-full text-sm">
                  {creator.specialty}
                </p>

                <div className="flex space-x-3 justify-center mb-4">
                  {creator.facebook && (
                    <a
                      href={creator.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                      title="Facebook"
                    >
                      <FaFacebook size={18} />
                    </a>
                  )}
                  {creator.instagram && (
                    <a
                      href={creator.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-700 transition-colors duration-200 p-2 rounded-full hover:bg-pink-50"
                      title="Instagram"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                  {creator.youtube && (
                    <a
                      href={creator.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                      title="YouTube"
                    >
                      <FaYoutube size={18} />
                    </a>
                  )}
                  {creator.tiktok && (
                    <a
                      href={creator.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50"
                      title="TikTok"
                    >
                      <FaTiktok size={18} />
                    </a>
                  )}
                  {creator.email && (
                    <a
                      href={`mailto:${creator.email}`}
                      className="text-gray-600 hover:text-purple-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50"
                      title="Email"
                    >
                      <FaEnvelope size={18} />
                    </a>
                  )}
                </div>

                <Link
                  href={`/all-service/content-creator/${creator.id}`}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium text-sm text-center"
                >
                  বিস্তারিত দেখুন
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

