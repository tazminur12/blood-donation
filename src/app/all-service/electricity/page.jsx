"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaBolt,
  FaSearch,
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUser,
  FaCalendar,
  FaFilter,
  FaStar,
  FaShareAlt,
  FaClock,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { FiGrid, FiList } from "react-icons/fi";

export default function ElectricityPage() {
  const [electricities, setElectricities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);

  const areas = [
    "সব এলাকা",
    "গোবিন্দগঞ্জ",
    "বগুড়া সদর",
    "শিবগঞ্জ",
    "ধুনট",
    "আদমদীঘি",
    "নন্দীগ্রাম",
    "সারিয়াকান্দি",
    "শাজাহানপুর",
    "গাবতলী",
    "কাহালু",
    "দুপচাঁচিয়া",
    "সোনাতলা",
    "শেরপুর",
  ];

  const electricityTypes = [
    "সব ধরণ",
    "বিদ্যুৎ কেন্দ্র",
    "সাবস্টেশন",
    "বিতরণ কেন্দ্র",
    "গ্রাহক সেবা কেন্দ্র",
    "বিলিং অফিস",
    "রক্ষণাবেক্ষণ কেন্দ্র",
    "জরুরি সেবা কেন্দ্র",
    "আঞ্চলিক অফিস",
  ];

  const typeMap = {
    power_plant: "বিদ্যুৎ কেন্দ্র",
    substation: "সাবস্টেশন",
    distribution_center: "বিতরণ কেন্দ্র",
    customer_service: "গ্রাহক সেবা কেন্দ্র",
    billing_office: "বিলিং অফিস",
    maintenance_center: "রক্ষণাবেক্ষণ কেন্দ্র",
    emergency_service: "জরুরি সেবা কেন্দ্র",
    regional_office: "আঞ্চলিক অফিস",
  };

  // Fetch electricity data
  useEffect(() => {
    const fetchElectricities = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/electricities");
        const data = await res.json();

        if (res.ok && data.success) {
          setElectricities(data.electricities || []);
        } else {
          setError("ডেটা লোড করতে সমস্যা হয়েছে।");
        }
      } catch (error) {
        console.error("Error fetching electricities:", error);
        setError("ডেটা লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchElectricities();
  }, []);

  // Filter electricities based on search and filters
  const filteredElectricities = useMemo(() => {
    return electricities.filter((electricity) => {
      try {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          (electricity.name &&
            electricity.name.toLowerCase().includes(searchLower)) ||
          (electricity.address &&
            electricity.address.toLowerCase().includes(searchLower)) ||
          (electricity.manager &&
            electricity.manager.toLowerCase().includes(searchLower));

        // Area filter
        const matchesArea =
          !selectedArea ||
          selectedArea === "সব এলাকা" ||
          electricity.area === selectedArea;

        // Type filter
        const matchesType =
          !selectedType ||
          selectedType === "সব ধরণ" ||
          getTypeLabel(electricity.type) === selectedType;

        return matchesSearch && matchesArea && matchesType;
      } catch (error) {
        console.error("Error filtering electricity:", error);
        return true; // Show all if there's an error
      }
    });
  }, [electricities, searchTerm, selectedArea, selectedType]);

  const getTypeLabel = (type) => {
    try {
      if (!type) return "অজানা";
      return typeMap[type] || type;
    } catch (error) {
      console.error("Error getting type label:", error);
      return type || "অজানা";
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const shareCenter = async (electricity) => {
    const text = `${electricity.name} - ${electricity.address}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: electricity.name,
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("তথ্য কপি করা হয়েছে!");
      } catch (error) {
        console.error("Error copying:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">বিদ্যুৎ কেন্দ্রের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex justify-center items-center">
        <Navbar />
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <FaBolt className="text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              গোবিন্দগঞ্জের বিদ্যুৎ কেন্দ্রসমূহ
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-3xl mx-auto">
              গোবিন্দগঞ্জের সব বিদ্যুৎ সেবা কেন্দ্রের তথ্য, যোগাযোগের নম্বর এবং সেবার বিবরণ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="বিদ্যুৎ কেন্দ্রের নাম, ঠিকানা বা ব্যবস্থাপক খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Area Filter */}
            <div>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {electricityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredElectricities.length}টি কেন্দ্র পাওয়া গেছে
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiList className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredElectricities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaExclamationCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              কোনো বিদ্যুৎ কেন্দ্র পাওয়া যায়নি
            </h3>
            <p className="text-gray-500">
              অনুসন্ধানের শব্দ পরিবর্তন করে আবার চেষ্টা করুন
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredElectricities.map((electricity) => (
              <div
                key={electricity.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Card Header */}
                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                        <FaBolt className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {electricity.name}
                        </h3>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getTypeLabel(electricity.type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(electricity.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.includes(electricity.id)
                            ? "text-yellow-500 bg-yellow-50"
                            : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                        }`}
                      >
                        <FaStar
                          className={
                            favorites.includes(electricity.id) ? "fill-current" : ""
                          }
                        />
                      </button>
                      <button
                        onClick={() => shareCenter(electricity)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {electricity.area}
                        </p>
                        <p className="text-sm text-gray-600">{electricity.address}</p>
                      </div>
                    </div>

                    {electricity.manager && (
                      <div className="flex items-center gap-3">
                        <FaUser className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">ব্যবস্থাপক:</span>{" "}
                          {electricity.manager}
                        </p>
                      </div>
                    )}

                    {electricity.establishedYear && (
                      <div className="flex items-center gap-3">
                        <FaCalendar className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">প্রতিষ্ঠা:</span>{" "}
                          {electricity.establishedYear}
                        </p>
                      </div>
                    )}

                    {electricity.capacity && (
                      <div className="flex items-center gap-3">
                        <FaBolt className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">ক্ষমতা:</span>{" "}
                          {electricity.capacity}
                        </p>
                      </div>
                    )}

                    {electricity.officeHours && (
                      <div className="flex items-center gap-3">
                        <FaClock className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">সময়:</span>{" "}
                          {electricity.officeHours}
                        </p>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <FaPhone className="text-gray-400" />
                        <a
                          href={`tel:${electricity.contact}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {electricity.contact}
                        </a>
                      </div>

                      {electricity.emergencyContact && (
                        <div className="flex items-center gap-3 mb-2">
                          <FaExclamationCircle className="text-red-400" />
                          <a
                            href={`tel:${electricity.emergencyContact}`}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            জরুরি: {electricity.emergencyContact}
                          </a>
                        </div>
                      )}

                      {electricity.email && (
                        <div className="flex items-center gap-3 mb-2">
                          <FaEnvelope className="text-gray-400" />
                          <a
                            href={`mailto:${electricity.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {electricity.email}
                          </a>
                        </div>
                      )}

                      {electricity.website && (
                        <div className="flex items-center gap-3">
                          <FaGlobe className="text-gray-400" />
                          <a
                            href={electricity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            ওয়েবসাইট দেখুন
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer for List View */}
                {viewMode === "list" && (
                  <div className="p-6 bg-gray-50 border-l border-gray-200 flex flex-col justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {electricity.serviceArea &&
                          `সেবা এলাকা: ${electricity.serviceArea}`}
                      </p>
                      {electricity.description && (
                        <p className="text-sm text-gray-500 line-clamp-3">
                          {electricity.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaBolt className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              {electricities?.length || 0}
            </h3>
            <p className="text-gray-600">মোট বিদ্যুৎ কেন্দ্র</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaMapPin className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              {electricities?.length
                ? new Set(
                    electricities.filter((e) => e.area).map((e) => e.area)
                  ).size
                : 0}
            </h3>
            <p className="text-gray-600">সেবা প্রদানকারী এলাকা</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaPhone className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              {electricities?.filter((e) => e.emergencyContact)?.length || 0}
            </h3>
            <p className="text-gray-600">জরুরি সেবা কেন্দ্র</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaClock className="text-3xl text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">২৪/৭</h3>
            <p className="text-gray-600">সেবা সহজলভ্য</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

