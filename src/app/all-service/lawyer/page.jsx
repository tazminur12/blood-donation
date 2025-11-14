"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaGavel,
  FaSearch,
  FaFilter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaSpinner,
  FaUser,
} from "react-icons/fa";

const lawyerCategories = [
  "ফৌজদারি আইন",
  "পারিবারিক আইন",
  "জমিজমা আইন",
  "শ্রম আইন",
  "ব্যবসায়িক আইন",
  "সাইবার আইন",
  "সংবিধানিক আইন",
  "অন্যান্য",
];

export default function LawyerPage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/lawyers");
        const data = await res.json();

        if (res.ok && data.success) {
          setLawyers(data.lawyers || []);
        } else {
          setError("ডেটা লোড করতে সমস্যা হয়েছে।");
        }
      } catch (err) {
        console.error("Error fetching lawyers:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // Get unique categories and areas
  const categories = useMemo(() => {
    return [...new Set(lawyers.map((lawyer) => lawyer.category).filter(Boolean))];
  }, [lawyers]);

  const areas = useMemo(() => {
    const areaList = lawyers
      .map((lawyer) => {
        if (lawyer.chamber) {
          // Try to extract area from chamber address
          const parts = lawyer.chamber.split(",");
          return parts[0]?.trim();
        }
        return null;
      })
      .filter(Boolean);
    return [...new Set(areaList)];
  }, [lawyers]);

  // Filter lawyers
  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const matchesSearch =
        !searchTerm ||
        lawyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || lawyer.category === selectedCategory;

      const matchesArea =
        !selectedArea || (lawyer.chamber && lawyer.chamber.includes(selectedArea));

      return matchesSearch && matchesCategory && matchesArea;
    });
  }, [lawyers, searchTerm, selectedCategory, selectedArea]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
          <p className="text-blue-600 font-semibold text-lg">তথ্য লোড হচ্ছে...</p>
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
              <FaGavel className="text-white text-xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              গোবিন্দগঞ্জের আইনজীবীদের তালিকা
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
              যোগ্য ও অভিজ্ঞ আইনজীবীদের সাথে যোগাযোগ করুন
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full inline-block mb-3">
              <FaGavel className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{lawyers.length}</h3>
            <p className="text-gray-600 text-sm font-medium">মোট আইনজীবী</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-2 rounded-full inline-block mb-3">
              <FaFilter className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{categories.length}</h3>
            <p className="text-gray-600 text-sm font-medium">আইনের ক্ষেত্র</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-full inline-block mb-3">
              <FaMapMarkerAlt className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{areas.length}</h3>
            <p className="text-gray-600 text-sm font-medium">অঞ্চল</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <FaSearch className="mr-2 text-blue-600" />
            আইনজীবী খুঁজুন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">খুঁজুন</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="নাম বা ক্ষেত্র লিখুন"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                আইনের ক্ষেত্র
              </label>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm cursor-pointer appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">সব</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Area Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">অঞ্চল</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm cursor-pointer"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">সব</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Results Count */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
              <span className="text-gray-700 text-sm">
                <span className="font-bold text-blue-600">{filteredLawyers.length}</span> জন
                আইনজীবী পাওয়া গেছে
              </span>
            </div>
          </div>
        </div>

        {/* Lawyer List */}
        <div className="space-y-6">
          {filteredLawyers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
              <FaGavel className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                কোন আইনজীবী পাওয়া যায়নি
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedArea("");
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm"
              >
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="md:flex">
                  {/* Lawyer Image */}
                  <div className="md:w-1/4 h-64 md:h-auto bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    {lawyer.image ? (
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center mx-auto mb-3">
                          <FaUser className="text-blue-600 text-4xl" />
                        </div>
                        <p className="text-gray-500 text-sm">ছবি নেই</p>
                      </div>
                    )}
                  </div>

                  {/* Lawyer Info */}
                  <div className="p-6 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                          {lawyer.name}
                        </h2>
                        <p className="text-blue-600 font-semibold text-base mb-2">
                          {lawyer.category}
                        </p>
                      </div>
                      <div className="text-left md:text-right mt-2 md:mt-0">
                        <p className="text-sm text-gray-600 mb-1">কনসাল্টেশন ফি</p>
                        <p className="text-blue-600 font-bold text-2xl">
                          {lawyer.consultationFee} ৳
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {lawyer.experience && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBriefcase className="text-blue-500" />
                          <span className="text-sm">
                            <strong>অভিজ্ঞতা:</strong> {lawyer.experience} বছর
                          </span>
                        </div>
                      )}
                      {lawyer.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-green-500" />
                          <a
                            href={`tel:${lawyer.phone}`}
                            className="text-sm hover:text-blue-600 transition"
                          >
                            {lawyer.phone}
                          </a>
                        </div>
                      )}
                      {lawyer.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope className="text-purple-500" />
                          <a
                            href={`mailto:${lawyer.email}`}
                            className="text-sm hover:text-blue-600 transition"
                          >
                            {lawyer.email}
                          </a>
                        </div>
                      )}
                      {lawyer.chamber && (
                        <div className="flex items-start gap-2 text-gray-600 md:col-span-2">
                          <FaMapMarkerAlt className="text-red-500 mt-1" />
                          <span className="text-sm">
                            <strong>চেম্বার:</strong> {lawyer.chamber}
                          </span>
                        </div>
                      )}
                    </div>

                    {lawyer.bio && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-2">{lawyer.bio}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {lawyer.phone && (
                        <a
                          href={`tel:${lawyer.phone}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition text-center flex items-center justify-center gap-2"
                        >
                          <FaPhone />
                          কল করুন
                        </a>
                      )}
                      {lawyer.email && (
                        <a
                          href={`mailto:${lawyer.email}`}
                          className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg text-sm font-medium transition text-center flex items-center justify-center gap-2"
                        >
                          <FaEnvelope />
                          ইমেইল করুন
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

