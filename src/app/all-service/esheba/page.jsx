"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaDesktop,
  FaClock,
  FaCheckCircle,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaSearch,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";

export default function EservicePage() {
  const [eservices, setEservices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/esheba");
        const data = await res.json();

        if (res.ok && data.success) {
          setEservices(data.esheba || []);
          setError(null);
        } else {
          setError("ই-সেবার তথ্য লোড করতে সমস্যা হয়েছে");
        }
      } catch (err) {
        console.error("Error loading eservices:", err);
        setError("ই-সেবার তথ্য লোড করতে সমস্যা হয়েছে");
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
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Coming Soon":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Normal":
        return "bg-blue-100 text-blue-800";
      case "Featured":
        return "bg-indigo-100 text-indigo-800";
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
      case "Maintenance":
        return "🟡";
      case "Coming Soon":
        return "🟣";
      default:
        return "⚪";
    }
  };

  // Filter services
  const filteredServices = useMemo(() => {
    return eservices.filter((service) => {
      const matchesSearch =
        !searchTerm ||
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || service.category === filterCategory;

      const matchesStatus =
        filterStatus === "all" || service.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [eservices, searchTerm, filterCategory, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
            <span className="text-gray-600 text-lg">ই-সেবা লোড হচ্ছে...</span>
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
              ই-সেবা তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।
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
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <FaDesktop className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              🖥️ সরকারি ই-সেবা
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
              ডিজিটাল বাংলাদেশের লক্ষ্যে সরকারি সেবাসমূহ অনলাইনে পাওয়া যায়।
              আপনার প্রয়োজনীয় সেবা নির্বাচন করে সহজেই আবেদন করুন।
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {eservices.length}
            </div>
            <div className="text-gray-600">মোট ই-সেবা</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {eservices.filter((s) => s.status === "Active").length}
            </div>
            <div className="text-gray-600">সক্রিয় সেবা</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {eservices.filter((s) => s.priority === "Urgent").length}
            </div>
            <div className="text-gray-600">জরুরি সেবা</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {eservices.filter((s) => s.priority === "Featured").length}
            </div>
            <div className="text-gray-600">বৈশিষ্ট্যযুক্ত</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FaSearch className="w-4 h-4 mr-2 text-blue-600" />
                অনুসন্ধান করুন
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="সেবার নাম, বিবরণ বা ক্যাটাগরি..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FaFilter className="w-4 h-4 mr-2 text-blue-600" />
                বিভাগ ফিল্টার
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">সব বিভাগ</option>
                <option value="নাগরিক সংক্রান্ত সেবা">
                  নাগরিক সংক্রান্ত সেবা
                </option>
                <option value="ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা">
                  ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা
                </option>
                <option value="আর্থিক ও ব্যাংকিং সেবা">
                  আর্থিক ও ব্যাংকিং সেবা
                </option>
                <option value="শিক্ষা সংক্রান্ত সেবা">
                  শিক্ষা সংক্রান্ত সেবা
                </option>
                <option value="স্বাস্থ্য সংক্রান্ত সেবা">
                  স্বাস্থ্য সংক্রান্ত সেবা
                </option>
                <option value="অন্যান্য গুরুত্বপূর্ণ সেবা">
                  অন্যান্য গুরুত্বপূর্ণ সেবা
                </option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FaFilter className="w-4 h-4 mr-2 text-blue-600" />
                স্ট্যাটাস ফিল্টার
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="Active">সক্রিয়</option>
                <option value="Inactive">নিষ্ক্রিয়</option>
                <option value="Maintenance">রক্ষণাবেক্ষণ</option>
                <option value="Coming Soon">শীঘ্রই আসছে</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-blue-600">
              {filteredServices.length}
            </span>{" "}
            টি ই-সেবা পাওয়া গেছে
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🖥️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              কোনো ই-সেবা নেই
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো ই-সেবা পাওয়া যায়নি।"
                : "বর্তমানে কোনো ই-সেবা উপলব্ধ নেই।"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <Link
                key={service.id}
                href={`/all-service/esheba/${service.id}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden border border-gray-200 h-full flex flex-col">
                  {/* Service Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">
                        #{index + 1}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          service.status
                        )}`}
                      >
                        {getStatusIcon(service.status)}{" "}
                        {service.status === "Active"
                          ? "সক্রিয়"
                          : service.status === "Inactive"
                          ? "নিষ্ক্রিয়"
                          : service.status === "Maintenance"
                          ? "রক্ষণাবেক্ষণ"
                          : "শীঘ্রই আসছে"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    {service.subCategory && (
                      <p className="text-blue-100 text-sm mt-1">
                        {service.subCategory}
                      </p>
                    )}
                  </div>

                  {/* Service Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    {/* Service Details */}
                    <div className="space-y-2 mb-4 flex-1">
                      {service.category && (
                        <div className="flex items-center text-sm">
                          <FaInfoCircle className="text-blue-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 line-clamp-1">
                            {service.category}
                          </span>
                        </div>
                      )}
                      {service.processingTime && (
                        <div className="flex items-center text-sm">
                          <FaClock className="text-orange-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">
                            {service.processingTime}
                          </span>
                        </div>
                      )}
                      {service.fees && (
                        <div className="flex items-center text-sm">
                          <span className="text-green-600 mr-2">💰</span>
                          <span className="text-gray-700">{service.fees}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-200 flex items-center justify-center gap-1">
                        <FaExternalLinkAlt className="text-xs" />
                        বিস্তারিত দেখুন
                      </button>
                      {service.websiteUrl && (
                        <a
                          href={service.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition duration-200 flex items-center justify-center gap-1"
                        >
                          <FaGlobe className="text-xs" />
                          ওয়েবসাইট
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Priority Badge */}
                  {service.priority === "Urgent" && (
                    <div className="bg-red-500 text-white text-xs font-medium px-3 py-1 text-center">
                      ⚡ জরুরি সেবা
                    </div>
                  )}
                  {service.priority === "Featured" && (
                    <div className="bg-indigo-500 text-white text-xs font-medium px-3 py-1 text-center">
                      ⭐ বৈশিষ্ট্যযুক্ত সেবা
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💡 ই-সেবা ব্যবহারের টিপস
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                প্রয়োজনীয় কাগজপত্র প্রস্তুত রাখুন
              </div>
              <div className="flex items-center justify-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                সঠিক তথ্য দিয়ে আবেদন করুন
              </div>
              <div className="flex items-center justify-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                আবেদনের স্ট্যাটাস নিয়মিত চেক করুন
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

