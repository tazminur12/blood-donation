"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaBell,
  FaSearch,
  FaFilter,
  FaTag,
  FaCalendarAlt,
  FaSpinner,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaDownload,
} from "react-icons/fa";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadNotices();
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotices();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      params.append("limit", "100");

      const res = await fetch(`/api/notices?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setNotices(data.notices || []);
      } else {
        console.error("Error loading notices:", data.error);
      }
    } catch (error) {
      console.error("Error loading notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/notices?limit=1");
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "নির্ধারিত নয়";
    try {
      return new Date(date).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "নির্ধারিত নয়";
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFile />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FaFilePdf className="text-red-600" />;
    if (["doc", "docx"].includes(ext)) return <FaFileWord className="text-blue-600" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return <FaFileImage className="text-green-600" />;
    return <FaFile />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaBell className="text-3xl text-white animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                সর্বশেষ বিজ্ঞপ্তি
              </h1>
            </div>
            <p className="text-base md:text-lg text-green-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-sm md:text-base text-white font-medium italic">
                &ldquo;সর্বশেষ খবর এবং বিজ্ঞপ্তি&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">মোট বিজ্ঞপ্তি</p>
            <p className="text-2xl font-bold text-slate-900">{notices.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">ক্যাটেগরি</p>
            <p className="text-2xl font-bold text-green-700">{categories.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">এই মাসে</p>
            <p className="text-2xl font-bold text-emerald-700">
              {
                notices.filter((notice) => {
                  const noticeDate = new Date(notice.publishDate || notice.createdAt);
                  const now = new Date();
                  return (
                    noticeDate.getMonth() === now.getMonth() &&
                    noticeDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="বিজ্ঞপ্তির শিরোনাম, বিবরণ বা ক্যাটেগরি দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">সব ক্যাটেগরি</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
              <p className="text-slate-600">বিজ্ঞপ্তি লোড হচ্ছে...</p>
            </div>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FaBell className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">কোন বিজ্ঞপ্তি পাওয়া যায়নি</p>
            <p className="text-slate-400 text-sm">
              {searchTerm || selectedCategory
                ? "অনুসন্ধানের ফলাফল খালি"
                : "বিজ্ঞপ্তি যোগ করা হবে শীঘ্রই"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {notice.title || "Untitled"}
                      </h3>
                      {notice.description && (
                        <p className="text-slate-600 mb-3 leading-relaxed">
                          {notice.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {notice.category && (
                          <span className="flex items-center gap-1">
                            <FaTag className="text-green-600" />
                            {notice.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-600" />
                          প্রকাশ: {formatDate(notice.publishDate || notice.createdAt)}
                        </span>
                        {notice.expiryDate && (
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-red-600" />
                            মেয়াদ: {formatDate(notice.expiryDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {notice.fileUrl && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <a
                        href={notice.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        {getFileIcon(notice.fileName)}
                        <span>{notice.fileName || "ফাইল ডাউনলোড করুন"}</span>
                        <FaDownload className="text-sm" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

