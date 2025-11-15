"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaAward,
  FaSearch,
  FaFilter,
  FaTag,
  FaCalendarAlt,
  FaSpinner,
  FaBuilding,
} from "react-icons/fa";

export default function AwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    loadAwards();
    loadFilters();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAwards();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedOrganization]);

  const loadAwards = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      if (selectedOrganization) {
        params.append("organization", selectedOrganization);
      }
      params.append("limit", "100");

      const res = await fetch(`/api/awards?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setAwards(data.awards || []);
      } else {
        console.error("Error loading awards:", data.error);
      }
    } catch (error) {
      console.error("Error loading awards:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const res = await fetch("/api/awards?limit=1");
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || []);
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error("Error loading filters:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaAward className="text-3xl text-white animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                প্রাপ্ত পুরস্কার সমূহ
              </h1>
            </div>
            <p className="text-base md:text-lg text-yellow-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-sm md:text-base text-white font-medium italic">
                &ldquo;আমাদের অর্জন এবং স্বীকৃতি&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">মোট পুরস্কার</p>
            <p className="text-2xl font-bold text-slate-900">{awards.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-yellow-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">ক্যাটেগরি</p>
            <p className="text-2xl font-bold text-yellow-700">{categories.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">প্রতিষ্ঠান</p>
            <p className="text-2xl font-bold text-amber-700">{organizations.length}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="পুরস্কারের নাম, বিবরণ, ক্যাটেগরি বা প্রতিষ্ঠানের নাম দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">সব ক্যাটেগরি</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">সব প্রতিষ্ঠান</option>
                {organizations.map((organization) => (
                  <option key={organization} value={organization}>
                    {organization}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Awards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-yellow-600 mx-auto mb-4" />
              <p className="text-slate-600">পুরস্কার লোড হচ্ছে...</p>
            </div>
          </div>
        ) : awards.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FaAward className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">কোন পুরস্কার পাওয়া যায়নি</p>
            <p className="text-slate-400 text-sm">
              {searchTerm || selectedCategory || selectedOrganization
                ? "অনুসন্ধানের ফলাফল খালি"
                : "পুরস্কার যোগ করা হবে শীঘ্রই"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <div
                key={award.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                {award.imageUrl && (
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={award.imageUrl}
                      alt={award.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Award Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                    {award.title || "Untitled"}
                  </h3>
                  {award.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                      {award.description}
                    </p>
                  )}
                  <div className="space-y-2 text-xs text-slate-500">
                    {award.organization && (
                      <div className="flex items-center gap-1">
                        <FaBuilding className="text-yellow-600" />
                        <span className="font-medium">{award.organization}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {award.category && (
                        <span className="flex items-center gap-1">
                          <FaTag className="text-blue-600" />
                          {award.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-green-600" />
                        {formatDate(award.awardDate)}
                      </span>
                    </div>
                  </div>
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

