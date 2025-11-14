"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaExclamationTriangle,
  FaEye,
  FaPlus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";

export default function DisasterReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/disaster-reports");
        const data = await res.json();

        if (res.ok && data.success) {
          setReports(data.reports || []);
          setError(null);
        } else {
          setError("রিপোর্ট তথ্য লোড করা যায়নি");
        }
      } catch (err) {
        console.error("Error fetching disaster reports:", err);
        setError("রিপোর্ট তথ্য লোড করা যায়নি");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((report) => report.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((report) => report.priority === priorityFilter);
    }

    return filtered;
  }, [searchTerm, categoryFilter, statusFilter, priorityFilter, reports]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "corruption":
        return "bg-red-100 text-red-800";
      case "disaster":
        return "bg-orange-100 text-orange-800";
      case "injustice":
        return "bg-purple-100 text-purple-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case "corruption":
        return "দুর্নীতি";
      case "disaster":
        return "দুর্যোগ";
      case "injustice":
        return "অন্যায়";
      case "other":
        return "অন্যান্য";
      default:
        return category;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "উচ্চ";
      case "medium":
        return "মাঝারি";
      case "low":
        return "নিম্ন";
      default:
        return priority;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "অপেক্ষমান";
      case "investigating":
        return "তদন্তাধীন";
      case "resolved":
        return "সমাধান হয়েছে";
      case "rejected":
        return "প্রত্যাখ্যাত";
      default:
        return status;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-red-600 mx-auto mb-3" />
            <p className="text-gray-600 text-lg font-medium">
              রিপোর্ট লোড হচ্ছে...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ত্রুটি</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-red-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <FaExclamationTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              দুর্নীতি ও অন্যায় রিপোর্ট
            </h1>
            <p className="text-sm md:text-base text-red-100 max-w-2xl mx-auto leading-relaxed">
              গোবিন্দগঞ্জের দুর্নীতি, দুর্যোগ ও অন্যায়ের বিরুদ্ধে রিপোর্ট করুন
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Report Button */}
        <div className="text-center mb-8">
          <Link
            href="/all-service/disaster-report/add"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <FaPlus className="mr-2" />
            নতুন রিপোর্ট যোগ করুন
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অনুসন্ধান
              </label>
              <input
                type="text"
                placeholder="রিপোর্ট খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিভাগ
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="all">সব বিভাগ</option>
                <option value="corruption">দুর্নীতি</option>
                <option value="disaster">দুর্যোগ</option>
                <option value="injustice">অন্যায়</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                স্ট্যাটাস
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="pending">অপেক্ষমান</option>
                <option value="investigating">তদন্তাধীন</option>
                <option value="resolved">সমাধান হয়েছে</option>
                <option value="rejected">প্রত্যাখ্যাত</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অগ্রাধিকার
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="all">সব অগ্রাধিকার</option>
                <option value="high">উচ্চ</option>
                <option value="medium">মাঝারি</option>
                <option value="low">নিম্ন</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              কোনো রিপোর্ট নেই
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm ||
              categoryFilter !== "all" ||
              statusFilter !== "all" ||
              priorityFilter !== "all"
                ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো রিপোর্ট নেই।"
                : "প্রথম রিপোর্টটি যোগ করুন"}
            </p>
            {searchTerm ||
            categoryFilter !== "all" ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ? (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                🔄 সব দেখুন
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {report.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          report.category
                        )}`}
                      >
                        {getCategoryText(report.category)}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          report.priority
                        )}`}
                      >
                        {getPriorityText(report.priority)}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusText(report.status)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {report.description}
                  </p>

                  {/* Location */}
                  {report.location && (
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <FaMapMarkerAlt className="mr-2" />
                      <span className="line-clamp-1">{report.location}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      {new Date(report.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>

                  {/* Images Preview */}
                  {report.images && report.images.length > 0 ? (
                    <div className="mb-4">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {report.images.slice(0, 3).map((image, idx) => {
                          const src = typeof image === "string" ? image : image.url;
                          return (
                            <div
                              key={idx}
                              className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                            >
                              <img
                                src={src}
                                alt={`${report.title} - Image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                        {report.images.length > 3 && (
                          <div className="shrink-0 w-16 h-16 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                            +{report.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="text-center py-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">📷</div>
                        <p className="text-xs text-gray-500">কোনো ছবি নেই</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/all-service/disaster-report/${report.id}`}
                      className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      <FaEye className="mr-2" />
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {reports.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {reports.length}
              </div>
              <div className="text-sm text-gray-600">মোট রিপোর্ট</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {reports.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">অপেক্ষমান</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {reports.filter((r) => r.status === "investigating").length}
              </div>
              <div className="text-sm text-gray-600">তদন্তাধীন</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {reports.filter((r) => r.status === "resolved").length}
              </div>
              <div className="text-sm text-gray-600">সমাধান হয়েছে</div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚠️ রিপোর্ট সম্পর্কে
            </h3>
            <p className="text-gray-600 text-sm">
              গোবিন্দগঞ্জের দুর্নীতি, দুর্যোগ ও অন্যায়ের বিরুদ্ধে রিপোর্ট করুন।
              আপনার রিপোর্ট আমাদের কাছে গুরুত্বপূর্ণ এবং আমরা প্রতিটি রিপোর্ট
              নিয়ে যথাযথ ব্যবস্থা গ্রহণ করি।
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

