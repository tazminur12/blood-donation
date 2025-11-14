"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiSearch,
  FiMapPin,
  FiPhone,
  FiUser,
  FiZap,
  FiAlertTriangle,
  FiShield,
  FiNavigation,
  FiClock,
  FiMail,
  FiExternalLink,
} from "react-icons/fi";

export default function FireServicePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("stations");
  const [loading, setLoading] = useState(true);
  const [fireStations, setFireStations] = useState([]);

  useEffect(() => {
    const fetchFireStations = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/fire-stations");
        const data = await res.json();

        if (res.ok) {
          setFireStations(data.fireStations || []);
        } else {
          setFireStations([]);
        }
      } catch (error) {
        console.error("Error fetching fire stations:", error);
        setFireStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFireStations();
  }, []);

  // Fire safety tips
  const safetyTips = [
    {
      id: 1,
      title: "বাড়িতে আগুন নিরাপত্তা",
      icon: "🏠",
      tips: [
        "রান্নার সময় চুলা থেকে দূরে সরে যাবেন না",
        "বিদ্যুতের খারাপ তার পরিবর্তন করুন",
        "ধূমপান করলে সিগারেট সম্পূর্ণ নিভিয়ে ফেলুন",
        "বাড়িতে ফায়ার এক্সটিংগুইশার রাখুন",
      ],
    },
    {
      id: 2,
      title: "বাণিজ্যিক ভবনে নিরাপত্তা",
      icon: "🏢",
      tips: [
        "নিয়মিত ফায়ার ড্রিল করুন",
        "জরুরী প্রস্থানের পথ পরিষ্কার রাখুন",
        "ফায়ার অ্যালার্ম সিস্টেম ইনস্টল করুন",
        "কর্মীদের ফায়ার সেফটি ট্রেনিং দিন",
      ],
    },
    {
      id: 3,
      title: "গ্যাস লিক হলে করণীয়",
      icon: "🔥",
      tips: [
        "বিদ্যুতের সুইচ স্পর্শ করবেন না",
        "জানালা-দরজা খুলে দিন",
        "গ্যাসের মেইন সুইচ বন্ধ করুন",
        "অবিলম্বে ফায়ার সার্ভিসে কল করুন",
      ],
    },
  ];

  // Filter fire stations
  const filteredStations = fireStations.filter((station) => {
    const matchesSearch =
      !searchTerm ||
      station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.officer?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || station.type === selectedType;

    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "main":
        return "bg-red-100 text-red-800 border-red-200";
      case "sub":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "emergency":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "main":
        return "🔥";
      case "sub":
        return "🚒";
      case "emergency":
        return "🚨";
      default:
        return "🏢";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "main":
        return "মূল স্টেশন";
      case "sub":
        return "উপ-স্টেশন";
      case "emergency":
        return "জরুরি স্টেশন";
      default:
        return type;
    }
  };

  const getEquipmentIcon = (equipment) => {
    const icons = {
      fire_truck: "🚒",
      water_tank: "💧",
      ladder: "🪜",
      hose: "🔗",
      axe: "🪓",
      oxygen_tank: "🫧",
      first_aid: "🏥",
      communication: "📻",
    };
    return icons[equipment] || "⚙️";
  };

  const getEquipmentLabel = (equipment) => {
    const labels = {
      fire_truck: "ফায়ার ট্রাক",
      water_tank: "জল ট্যাংক",
      ladder: "মই",
      hose: "হোস পাইপ",
      axe: "কুঠার",
      oxygen_tank: "অক্সিজেন ট্যাংক",
      first_aid: "প্রাথমিক চিকিৎসা",
      communication: "যোগাযোগ সরঞ্জাম",
    };
    return labels[equipment] || equipment.replace("_", " ");
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            ফায়ার স্টেশন তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Navbar />

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FiAlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">জরুরী ফায়ার সার্ভিস</h2>
                <p className="text-red-100">২৪/৭ জরুরী সেবা, দ্রুত সাড়া</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:16163"
                className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-gray-100 transition duration-300 shadow-lg"
              >
                <FiPhone className="w-5 h-5 mr-2" />
                <span className="text-lg">জরুরী কল: ১৬১৬৩</span>
              </a>
              <a
                href="tel:999"
                className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-yellow-600 transition duration-300 shadow-lg"
              >
                <FiPhone className="w-5 h-5 mr-2" />
                <span className="text-lg">জাতীয় জরুরী: ৯৯৯</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-3">
            <FiZap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            গোবিন্দগঞ্জ ফায়ার সার্ভিস ও সিভিল ডিফেন্স
          </h1>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            অগ্নিকাণ্ড ও জরুরী পরিস্থিতিতে সাহায্যের জন্য। আমাদের দক্ষ টিম ২৪/৭
            আপনার সেবায় নিয়োজিত।
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiZap className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মোট স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fireStations.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiShield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মূল স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fireStations.filter((s) => s.type === "main").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">উপ-স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fireStations.filter((s) => s.type === "sub").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiNavigation className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">জরুরি স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fireStations.filter((s) => s.type === "emergency").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-3 px-6 font-semibold text-lg transition-colors ${
              activeTab === "stations"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("stations")}
          >
            <FiZap className="inline w-5 h-5 mr-2" />
            ফায়ার স্টেশন
          </button>
          <button
            className={`py-3 px-6 font-semibold text-lg transition-colors ${
              activeTab === "safety"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("safety")}
          >
            <FiShield className="inline w-5 h-5 mr-2" />
            অগ্নি নিরাপত্তা টিপস
          </button>
        </div>

        {activeTab === "stations" ? (
          <>
            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    খুঁজুন
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="স্টেশন নাম, ঠিকানা বা অফিসার দিয়ে খুঁজুন..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    স্টেশন ধরন
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">সব ধরনের স্টেশন</option>
                    <option value="main">মূল স্টেশন</option>
                    <option value="sub">উপ-স্টেশন</option>
                    <option value="emergency">জরুরি স্টেশন</option>
                  </select>
                </div>
                {/* Results Count */}
                <div className="flex items-end">
                  <div className="bg-gray-50 px-4 py-3 rounded-lg w-full">
                    <p className="text-sm text-gray-600">মোট ফলাফল</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredStations.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fire Station List */}
            <div className="space-y-6">
              {filteredStations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                  <FiZap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    কোন ফায়ার স্টেশন পাওয়া যায়নি
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedType !== "all"
                      ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো স্টেশন নেই।"
                      : "এখনও কোনো ফায়ার স্টেশন যোগ করা হয়নি।"}
                  </p>
                </div>
              ) : (
                filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="md:flex">
                      {/* Station Info */}
                      <div className="p-8 md:w-2/3">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-2">
                                {getTypeIcon(station.type)}
                              </span>
                              <h2 className="text-2xl font-bold text-gray-800">
                                {station.name}
                              </h2>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                                station.type
                              )}`}
                            >
                              {getTypeText(station.type)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">জরুরী নম্বর</p>
                            <p className="text-xl font-bold text-red-600">১৬১৬৩</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
                          <span>{station.address}</span>
                        </div>

                        {/* Officer Info */}
                        <div className="bg-red-50 p-4 rounded-lg mb-6">
                          <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
                            <FiUser className="w-4 h-4 mr-1" />
                            স্টেশন অফিসার
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {station.officer}
                              </p>
                              <p className="text-sm text-gray-600">স্টেশন কমান্ডার</p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <button
                                onClick={() => handleCall(station.contact)}
                                className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                              >
                                <FiPhone className="w-4 h-4 mr-1" />
                                {station.contact}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center text-gray-600">
                            <FiClock className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm">{station.workingHours}</span>
                          </div>
                          {station.email && (
                            <div className="flex items-center text-gray-600">
                              <FiMail className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-sm">{station.email}</span>
                            </div>
                          )}
                        </div>

                        {/* Equipment */}
                        {station.equipment && station.equipment.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              সরঞ্জামসমূহ:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {station.equipment.map((equipment, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                >
                                  <span className="mr-1">
                                    {getEquipmentIcon(equipment)}
                                  </span>
                                  {getEquipmentLabel(equipment)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={() => handleCall(station.contact)}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                          >
                            <FiPhone className="w-4 h-4 mr-2" />
                            সরাসরি কল করুন
                          </button>
                          {station.emergencyContact && (
                            <button
                              onClick={() => handleCall(station.emergencyContact)}
                              className="px-6 py-3 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
                            >
                              <FiPhone className="w-4 h-4 mr-2" />
                              জরুরি কল: {station.emergencyContact}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Station Image Placeholder */}
                      <div className="md:w-1/3 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center p-8">
                        <div className="text-center">
                          <FiZap className="w-24 h-24 text-red-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            ফায়ার স্টেশন
                          </h3>
                          <p className="text-gray-600 text-sm">২৪/৭ জরুরী সেবা</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Fire Safety Tips Section */
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FiShield className="w-8 h-8 mr-3 text-red-600" />
                অগ্নি নিরাপত্তা নির্দেশিকা
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                অগ্নিকাণ্ড প্রতিরোধ ও জরুরী পরিস্থিতি মোকাবেলায় এই টিপসগুলো
                অনুসরণ করুন
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {safetyTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="text-4xl mb-4">{tip.icon}</div>
                    <h3 className="text-xl font-semibold text-red-600 mb-4">
                      {tip.title}
                    </h3>
                    <ul className="space-y-3">
                      {tip.tips.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Procedures */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-xl border border-red-100">
              <h3 className="text-2xl font-semibold text-red-800 mb-6 flex items-center">
                <FiAlertTriangle className="w-6 h-6 mr-2" />
                অগ্নিকাণ্ডের সময় করণীয়
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-red-700 mb-4 text-lg">
                    যদি আপনি আগুনে আটকে পড়েন:
                  </h4>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>শান্ত থাকুন এবং আতঙ্কিত হবেন না</li>
                    <li>নিচু হয়ে মাটিতে হামাগুড়ি দিয়ে চলুন</li>
                    <li>গায়ে পানি ঢেলে নিন বা ভেজা কাপড় জড়িয়ে নিন</li>
                    <li>জানালা বা দরজা দিয়ে বের হওয়ার চেষ্টা করুন</li>
                    <li>সাহায্যের জন্য চিৎকার করুন</li>
                  </ol>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-red-700 mb-4 text-lg">
                    আগুন নেভানোর উপায়:
                  </h4>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>
                      ছোট আগুনে পানি বা ফায়ার এক্সটিংগুইশার ব্যবহার করুন
                    </li>
                    <li>তেলের আগুনে পানি ব্যবহার করবেন না</li>
                    <li>বিদ্যুৎ সংযোগ বিচ্ছিন্ন করুন</li>
                    <li>নিরাপদ দূরত্ব বজায় রাখুন</li>
                    <li>নিয়ন্ত্রণের বাইরে গেলে ফায়ার সার্ভিসে কল করুন</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            অতিরিক্ত সম্পদ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-red-600">
              <div className="text-4xl mb-4">🎓</div>
              <h4 className="text-xl font-semibold mb-4">
                ফায়ার নিরাপত্তা প্রশিক্ষণ
              </h4>
              <p className="text-gray-600 mb-6">
                ফায়ার নিরাপত্তা বিষয়ে প্রশিক্ষণ ও কর্মশালার জন্য আবেদন করুন
              </p>
              <a
                href="https://fireservice.gov.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-semibold hover:underline flex items-center cursor-pointer"
              >
                আবেদন করুন
                <FiExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600">
              <div className="text-4xl mb-4">🛡️</div>
              <h4 className="text-xl font-semibold mb-4">
                ফায়ার নিরাপত্তা সরঞ্জাম
              </h4>
              <p className="text-gray-600 mb-6">
                ফায়ার এক্সটিংগুইশার ও নিরাপত্তা সরঞ্জাম কোথায় কিনবেন
              </p>
              <a
                href="https://fireservice.gov.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline flex items-center cursor-pointer"
              >
                দেখুন
                <FiExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-green-600">
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-xl font-semibold mb-4">ফায়ার ড্রিল পরিকল্পনা</h4>
              <p className="text-gray-600 mb-6">
                আপনার বাড়ি বা অফিসের জন্য ফায়ার ড্রিল পরিকল্পনা তৈরি করুন
              </p>
              <a
                href="https://fireservice.gov.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-semibold hover:underline flex items-center cursor-pointer"
              >
                ডাউনলোড
                <FiExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

