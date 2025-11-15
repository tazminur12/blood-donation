"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaUsersCog,
  FaSearch,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSpinner,
} from "react-icons/fa";

export default function CommitteePage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    loadMembers();
    loadFilters();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMembers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedPosition]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (selectedPosition) {
        params.append("position", selectedPosition);
      }
      params.append("limit", "100");

      const res = await fetch(`/api/committee?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setMembers(data.members || []);
      } else {
        console.error("Error loading members:", data.error);
      }
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const res = await fetch("/api/committee?limit=1");
      const data = await res.json();

      if (res.ok) {
        setPositions(data.positions || []);
      }
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaUsersCog className="text-3xl text-white animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                কমিটি
              </h1>
            </div>
            <p className="text-base md:text-lg text-blue-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-sm md:text-base text-white font-medium italic">
                &ldquo;আমাদের কমিটি সদস্যদের সাথে পরিচিত হোন&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">মোট সদস্য</p>
            <p className="text-2xl font-bold text-slate-900">{members.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">পদবী</p>
            <p className="text-2xl font-bold text-blue-700">{positions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">সক্রিয় সদস্য</p>
            <p className="text-2xl font-bold text-indigo-700">{members.length}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="নাম, পদবী বা বিবরণ দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">সব পদবী</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600">কমিটি সদস্য লোড হচ্ছে...</p>
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FaUsersCog className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">কোন কমিটি সদস্য পাওয়া যায়নি</p>
            <p className="text-slate-400 text-sm">
              {searchTerm || selectedPosition
                ? "অনুসন্ধানের ফলাফল খালি"
                : "কমিটি সদস্য যোগ করা হবে শীঘ্রই"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Photo */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                      <FaUser className="text-6xl text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {member.name || "Untitled"}
                  </h3>
                  <p className="text-sm text-blue-600 font-semibold mb-3">
                    {member.position || "—"}
                  </p>
                  {member.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {member.description}
                    </p>
                  )}
                  <div className="space-y-1 text-xs text-slate-500">
                    {member.email && (
                      <div className="flex items-center justify-center gap-1">
                        <FaEnvelope className="text-blue-600" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-1">
                        <FaPhone className="text-green-600" />
                        <span>{member.phone}</span>
                      </div>
                    )}
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

