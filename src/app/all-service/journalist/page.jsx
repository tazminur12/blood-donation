"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaUserTie,
  FaNewspaper,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaBriefcase,
} from "react-icons/fa";

export default function JournalistPage() {
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");

  const mediaTypes = [
    { value: "newspaper", label: "সংবাদপত্র" },
    { value: "tv", label: "টেলিভিশন" },
    { value: "online", label: "অনলাইন পোর্টাল" },
    { value: "radio", label: "রেডিও" },
    { value: "magazine", label: "ম্যাগাজিন" },
  ];

  const beats = [
    "রাজনীতি",
    "অপরাধ",
    "খেলা",
    "বিনোদন",
    "অর্থনীতি",
    "আন্তর্জাতিক",
    "স্বাস্থ্য",
    "শিক্ষা",
    "প্রযুক্তি",
  ];

  const districts = [
    "চাঁপাইনবাবগঞ্জ",
    "নওগাঁ",
    "রাজশাহী",
    "সিরাজগঞ্জ",
    "পাবনা",
    "বগুড়া",
    "জয়পুরহাট",
  ];

  useEffect(() => {
    const fetchJournalists = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/journalists");
        const data = await res.json();

        if (res.ok && data.success) {
          setJournalists(data.journalists || []);
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

    fetchJournalists();
  }, []);

  // Get unique values for filters
  const availableBeats = useMemo(() => {
    return [...new Set(journalists.map((j) => j.beat).filter(Boolean))];
  }, [journalists]);

  const availableDistricts = useMemo(() => {
    return [...new Set(journalists.map((j) => j.district).filter(Boolean))];
  }, [journalists]);

  // Filter journalists based on search and filters
  const filteredJournalists = useMemo(() => {
    return journalists.filter((journalist) => {
      const matchesSearch =
        !searchTerm ||
        journalist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journalist.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journalist.mediaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journalist.beat?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBeat = !selectedBeat || journalist.beat === selectedBeat;
      const matchesDistrict =
        !selectedDistrict || journalist.district === selectedDistrict;
      const matchesMediaType =
        !selectedMediaType || journalist.mediaType === selectedMediaType;

      return (
        matchesSearch && matchesBeat && matchesDistrict && matchesMediaType
      );
    });
  }, [journalists, searchTerm, selectedBeat, selectedDistrict, selectedMediaType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
          <p className="text-blue-600 font-semibold text-lg">
            সাংবাদিকদের তালিকা লোড হচ্ছে...
          </p>
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
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
              <FaNewspaper className="text-white text-xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              গোবিন্দগঞ্জের সাংবাদিক
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
              স্থানীয় সাংবাদিকদের সাথে যোগাযোগের তথ্য - সংবাদপত্র, টেলিভিশন, অনলাইন
              পোর্টাল ও আরও অনেক
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full inline-block mb-3">
              <FaNewspaper className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {journalists.length}
            </h3>
            <p className="text-gray-600 text-sm font-medium">মোট সাংবাদিক</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-2 rounded-full inline-block mb-3">
              <FaFilter className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {availableBeats.length}
            </h3>
            <p className="text-gray-600 text-sm font-medium">বিভিন্ন বিট</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full inline-block mb-3">
              <FaMapMarkerAlt className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {availableDistricts.length}
            </h3>
            <p className="text-gray-600 text-sm font-medium">জেলা</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <FaSearch className="mr-2 text-blue-600" />
            সাংবাদিক খুঁজুন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="নাম, পদবি বা মিডিয়া অনুসন্ধান..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            {/* Beat Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedBeat}
                onChange={(e) => setSelectedBeat(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm cursor-pointer"
              >
                <option value="">সব বিট</option>
                {availableBeats.map((beat) => (
                  <option key={beat} value={beat}>
                    {beat}
                  </option>
                ))}
              </select>
            </div>
            {/* District Filter */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm cursor-pointer"
              >
                <option value="">সব জেলা</option>
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            {/* Media Type Filter */}
            <div className="relative">
              <FaNewspaper className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm cursor-pointer"
              >
                <option value="">সব মিডিয়া</option>
                {mediaTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Results Count */}
          <div className="mt-4 flex items-center justify-center">
            <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
              <span className="text-gray-700 text-sm">
                <span className="font-bold text-blue-600">
                  {filteredJournalists.length}
                </span>{" "}
                জন সাংবাদিক পাওয়া গেছে
              </span>
            </div>
          </div>
        </div>

        {/* Journalists Grid */}
        {filteredJournalists.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              কোন সাংবাদিক পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              অনুগ্রহ করে আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedBeat("");
                setSelectedDistrict("");
                setSelectedMediaType("");
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournalists.map((journalist) => (
              <div
                key={journalist.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 mb-4 group-hover:border-blue-300 transition-colors">
                  {journalist.image ? (
                    <img
                      src={journalist.image}
                      alt={journalist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 bg-gradient-to-br from-blue-100 to-indigo-100">
                      {journalist.name?.charAt(0) || "J"}
                    </div>
                  )}
                </div>

                {/* Name & Designation */}
                <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {journalist.name}
                </h2>
                <p className="text-blue-600 font-medium mb-3 px-3 py-1 bg-blue-50 rounded-full text-sm">
                  {journalist.designation}
                </p>

                {/* Media Info */}
                <div className="mb-3 space-y-1">
                  <p className="text-gray-700 text-sm flex items-center justify-center">
                    <FaUserTie className="mr-1 text-blue-500" />
                    <span className="font-medium">{journalist.mediaName}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {mediaTypes.find((t) => t.value === journalist.mediaType)
                      ?.label || journalist.mediaType}
                  </p>
                  {journalist.mediaWebsite && (
                    <p className="text-sm">
                      <a
                        href={journalist.mediaWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center justify-center"
                      >
                        <FaGlobe className="mr-1 text-green-500" />
                        Website
                      </a>
                    </p>
                  )}
                </div>

                {/* Location */}
                <p className="text-sm text-gray-600 mb-3 flex items-center justify-center">
                  <FaMapMarkerAlt className="mr-1 text-red-400" />
                  {journalist.district}, {journalist.beat} বিট
                </p>

                {/* Contact Info */}
                <div className="mt-auto space-y-2 text-sm text-gray-700 w-full">
                  <div className="flex items-center justify-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    <a
                      href={`tel:${journalist.phone}`}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {journalist.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-center">
                    <FaEnvelope className="mr-2 text-gray-600" />
                    <a
                      href={`mailto:${journalist.email}`}
                      className="text-gray-700 hover:text-blue-600 transition-colors truncate max-w-[200px]"
                    >
                      {journalist.email}
                    </a>
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

