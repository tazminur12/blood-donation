"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUsers,
  FaBuilding,
  FaCode,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";

export default function UnionPage() {
  const [unions, setUnions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUpazila, setFilterUpazila] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/unions");
        const data = await res.json();

        if (res.ok && data.success) {
          setUnions(data.unions || []);
          setError(null);
        } else {
          setError("ইউনিয়নের তথ্য লোড করতে সমস্যা হয়েছে");
        }
      } catch (err) {
        console.error("Error loading unions:", err);
        setError("ইউনিয়নের তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return "🟢";
      case "Inactive":
        return "🔴";
      case "Pending":
        return "🟡";
      default:
        return "⚪";
    }
  };

  // Get unique upazilas for filter
  const upazilas = useMemo(() => {
    const unique = [...new Set(unions.map((union) => union.upazila))].filter(
      Boolean
    );
    return unique.sort();
  }, [unions]);

  // Filter unions
  const filteredUnions = useMemo(() => {
    return unions.filter((union) => {
      const matchesSearch =
        !searchTerm ||
        union.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        union.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        union.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        union.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUpazila =
        filterUpazila === "all" || union.upazila === filterUpazila;

      const matchesStatus =
        filterStatus === "all" || union.status === filterStatus;

      return matchesSearch && matchesUpazila && matchesStatus;
    });
  }, [unions, searchTerm, filterUpazila, filterStatus]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterUpazila("all");
    setFilterStatus("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
            <span className="text-gray-600 text-lg">লোড হচ্ছে...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              তথ্য লোড করতে সমস্যা
            </h3>
            <p className="text-gray-500">
              ইউনিয়নের তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <FaMapMarkerAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              🏛️ বগুড়া জেলার ইউনিয়ন পরিষদসমূহ
            </h1>
            <p className="text-sm md:text-base text-emerald-100 max-w-2xl mx-auto">
              বগুড়া জেলার সকল ইউনিয়ন পরিষদের তথ্য, যোগাযোগের ঠিকানা এবং সেবাসমূহ সম্পর্কে জানুন
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {unions.length}
            </div>
            <div className="text-sm text-gray-600">মোট ইউনিয়ন</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {unions.filter((u) => u.status === "Active").length}
            </div>
            <div className="text-sm text-gray-600">সক্রিয় ইউনিয়ন</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {unions.filter((u) => u.status === "Pending").length}
            </div>
            <div className="text-sm text-gray-600">অপেক্ষমান</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {unions.filter((u) => u.status === "Inactive").length}
            </div>
            <div className="text-sm text-gray-600">নিষ্ক্রিয়</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FaSearch className="w-4 h-4 mr-2 text-emerald-600" />
                অনুসন্ধান করুন
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ইউনিয়ন নাম, উপজেলা বা কোড..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Upazila Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FaFilter className="w-4 h-4 mr-2 text-emerald-600" />
                উপজেলা ফিল্টার
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                value={filterUpazila}
                onChange={(e) => setFilterUpazila(e.target.value)}
              >
                <option value="all">সব উপজেলা</option>
                {upazilas.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FaFilter className="w-4 h-4 mr-2 text-emerald-600" />
                স্ট্যাটাস ফিল্টার
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="Active">সক্রিয়</option>
                <option value="Inactive">নিষ্ক্রিয়</option>
                <option value="Pending">অপেক্ষমান</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                &nbsp;
              </label>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition duration-200 flex items-center justify-center gap-2"
              >
                <FaFilter />
                ফিল্টার মুছুন
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-emerald-600">
              {filteredUnions.length}
            </span>{" "}
            টি ইউনিয়ন পাওয়া গেছে
            {(searchTerm || filterUpazila !== "all" || filterStatus !== "all") && (
              <span className="text-sm text-gray-500">
                {" "}(ফিল্টার প্রয়োগ করা হয়েছে)
              </span>
            )}
          </p>
        </div>

        {/* Unions Grid */}
        {filteredUnions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              কোনো ইউনিয়ন পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ইউনিয়ন নেই।
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              সব ফিল্টার মুছুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnions.map((union) => (
              <div
                key={union.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden border border-gray-200"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{union.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        union.status
                      )}`}
                    >
                      {getStatusIcon(union.status)}{" "}
                      {union.status === "Active"
                        ? "সক্রিয়"
                        : union.status === "Inactive"
                        ? "নিষ্ক্রিয়"
                        : "অপেক্ষমান"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt />
                    <span>{union.upazila}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Code */}
                  <div className="flex items-center gap-2 mb-3">
                    <FaCode className="text-blue-500" />
                    <span className="text-sm text-gray-600">
                      কোড:{" "}
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {union.code}
                      </span>
                    </span>
                  </div>

                  {/* Description */}
                  {union.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {union.description}
                    </p>
                  )}

                  {/* Demographics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {union.population && (
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-green-500 text-sm" />
                        <span className="text-xs text-gray-600">
                          জনসংখ্যা: {Number(union.population).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {union.area && (
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-purple-500 text-sm" />
                        <span className="text-xs text-gray-600">
                          আয়তন: {union.area} বর্গ কিমি
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {union.officePhone && (
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-green-500 text-sm" />
                        <span className="text-xs text-gray-600">
                          {union.officePhone}
                        </span>
                      </div>
                    )}
                    {union.officeEmail && (
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-blue-500 text-sm" />
                        <span className="text-xs text-gray-600">
                          {union.officeEmail}
                        </span>
                      </div>
                    )}
                    {union.website && (
                      <div className="flex items-center gap-2">
                        <FaGlobe className="text-purple-500 text-sm" />
                        <a
                          href={union.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ওয়েবসাইট দেখুন
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Leadership */}
                  {(union.chairmanName || union.secretaryName) && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        নেতৃত্ব
                      </h4>
                      <div className="space-y-1">
                        {union.chairmanName && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">চেয়ারম্যান:</span>{" "}
                            {union.chairmanName}
                            {union.chairmanPhone &&
                              ` (${union.chairmanPhone})`}
                          </div>
                        )}
                        {union.secretaryName && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">সচিব:</span>{" "}
                            {union.secretaryName}
                            {union.secretaryPhone &&
                              ` (${union.secretaryPhone})`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Establishment Date */}
                  {union.establishmentDate && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-500 text-sm" />
                        <span className="text-xs text-gray-600">
                          প্রতিষ্ঠার তারিখ:{" "}
                          {new Date(union.establishmentDate).toLocaleDateString(
                            "bn-BD"
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      আইডি: {union.id?.slice(-8)}
                    </span>
                    <Link
                      href={`/all-service/union/${union.id}`}
                      className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded transition duration-200"
                    >
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🏛️ ইউনিয়ন পরিষদ সম্পর্কে
            </h3>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              ইউনিয়ন পরিষদ বাংলাদেশের স্থানীয় সরকার ব্যবস্থার সর্বনিম্ন স্তর।
              প্রতিটি ইউনিয়ন পরিষদ তার এলাকার উন্নয়ন, জনসেবা এবং প্রশাসনিক
              কার্যক্রম পরিচালনা করে। এখানে আপনি বগুড়া জেলার সকল ইউনিয়ন পরিষদের
              তথ্য পেতে পারেন।
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

