"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaNewspaper,
  FaSearch,
  FaFilter,
  FaTag,
  FaCalendarAlt,
  FaSpinner,
  FaLink,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function GobindhagonjNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadNews();
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNews();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const loadNews = async () => {
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

      const res = await fetch(`/api/gobindhagonj-news?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setNews(data.news || []);
      } else {
        console.error("Error loading news:", data.error);
      }
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/gobindhagonj-news?limit=1");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaNewspaper className="text-3xl text-white animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Gobindhagonj News
              </h1>
            </div>
            <p className="text-base md:text-lg text-purple-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-sm md:text-base text-white font-medium italic">
                &ldquo;গোবিন্দগঞ্জের সর্বশেষ সংবাদ ও খবর&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">মোট সংবাদ</p>
            <p className="text-2xl font-bold text-slate-900">{news.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">ক্যাটেগরি</p>
            <p className="text-2xl font-bold text-purple-700">{categories.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-pink-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">এই মাসে</p>
            <p className="text-2xl font-bold text-pink-700">
              {
                news.filter((item) => {
                  const newsDate = new Date(item.publishDate || item.createdAt);
                  const now = new Date();
                  return (
                    newsDate.getMonth() === now.getMonth() &&
                    newsDate.getFullYear() === now.getFullYear()
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
                placeholder="সংবাদের শিরোনাম, বিবরণ বা ক্যাটেগরি দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
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

        {/* News Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
              <p className="text-slate-600">সংবাদ লোড হচ্ছে...</p>
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FaNewspaper className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">কোন সংবাদ পাওয়া যায়নি</p>
            <p className="text-slate-400 text-sm">
              {searchTerm || selectedCategory
                ? "অনুসন্ধানের ফলাফল খালি"
                : "সংবাদ যোগ করা হবে শীঘ্রই"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((newsItem) => (
              <div
                key={newsItem.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                {newsItem.imageUrl && (
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={newsItem.imageUrl}
                      alt={newsItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* News Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                    {newsItem.title || "Untitled"}
                  </h3>
                  {newsItem.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                      {newsItem.description}
                    </p>
                  )}
                  <div className="space-y-2 text-xs text-slate-500 mb-3">
                    {newsItem.category && (
                      <div className="flex items-center gap-1">
                        <FaTag className="text-purple-600" />
                        <span>{newsItem.category}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-green-600" />
                      <span>{formatDate(newsItem.publishDate || newsItem.createdAt)}</span>
                    </div>
                  </div>
                  {newsItem.link && (
                    <a
                      href={newsItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                    >
                      <FaLink />
                      <span>আরও পড়ুন</span>
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
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

