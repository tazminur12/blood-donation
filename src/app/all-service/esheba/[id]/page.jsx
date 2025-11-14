"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaDesktop,
  FaArrowLeft,
  FaSpinner,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaFileAlt,
  FaUserCheck,
  FaList,
  FaLightbulb,
} from "react-icons/fa";

export default function EserviceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/esheba");
        const data = await res.json();

        if (res.ok && data.success) {
          const found = data.esheba?.find((s) => s.id === params.id);
          if (found) {
            setService(found);
            setError(null);
          } else {
            setError("ই-সেবা পাওয়া যায়নি");
          }
        } else {
          setError("ডেটা লোড করতে সমস্যা হয়েছে");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Coming Soon":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Featured":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
            <span className="text-gray-600 text-lg">
              ই-সেবার তথ্য লোড হচ্ছে...
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {error || "ই-সেবা পাওয়া যায়নি"}
            </h3>
            <Link
              href="/all-service/esheba"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <FaArrowLeft />
              ই-সেবা তালিকায় ফিরে যান
            </Link>
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
          <Link
            href="/all-service/esheba"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition text-sm"
          >
            <FaArrowLeft />
            <span>ই-সেবা তালিকায় ফিরে যান</span>
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <FaDesktop className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {service.title}
            </h1>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
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
              {service.priority && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                    service.priority
                  )}`}
                >
                  {service.priority === "Urgent"
                    ? "⚡ জরুরি"
                    : service.priority === "High"
                    ? "🔺 উচ্চ"
                    : service.priority === "Featured"
                    ? "⭐ বৈশিষ্ট্যযুক্ত"
                    : "📌 সাধারণ"}
                </span>
              )}
              {service.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                  {service.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {service.processingTime && (
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FaClock className="text-orange-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">প্রক্রিয়াকরণ সময়</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {service.processingTime}
                  </div>
                </div>
              </div>
            </div>
          )}
          {service.fees && (
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">ফি/চার্জ</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {service.fees}
                  </div>
                </div>
              </div>
            </div>
          )}
          {service.location && (
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">অফিসের অবস্থান</div>
                  <div className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {service.location}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaInfoCircle className="text-blue-600 mr-2" />
                সেবার বিবরণ
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Instructions */}
            {service.instructions && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaList className="text-indigo-600 mr-2" />
                  আবেদনের নির্দেশনা
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.instructions}
                </div>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaLightbulb className="text-yellow-600 mr-2" />
                  সেবার সুবিধা
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.benefits}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                দ্রুত কাজ
              </h3>
              <div className="space-y-3">
                {service.applicationUrl && (
                  <a
                    href={service.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaExternalLinkAlt />
                    আবেদন করুন
                  </a>
                )}
                {service.websiteUrl && (
                  <a
                    href={service.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaGlobe />
                    ওয়েবসাইট দেখুন
                  </a>
                )}
              </div>
            </div>

            {/* Requirements */}
            {service.documents && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFileAlt className="text-red-600 mr-2" />
                  প্রয়োজনীয় কাগজপত্র
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.documents}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {service.eligibility && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUserCheck className="text-green-600 mr-2" />
                  যোগ্যতা
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.eligibility}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {service.contactInfo && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaPhone className="text-blue-600 mr-2" />
                  যোগাযোগের তথ্য
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.contactInfo}
                </div>
              </div>
            )}

            {/* Office Hours */}
            {service.officeHours && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaClock className="text-orange-600 mr-2" />
                  অফিসের সময়
                </h3>
                <div className="text-gray-700">{service.officeHours}</div>
              </div>
            )}

            {/* Location */}
            {service.location && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMapMarkerAlt className="text-red-600 mr-2" />
                  অফিসের অবস্থান
                </h3>
                <div className="text-gray-700 leading-relaxed">
                  {service.location}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {(service.requirements || service.subCategory) && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              অতিরিক্ত তথ্য
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.subCategory && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">উপ-ক্যাটাগরি</div>
                  <div className="text-gray-800 font-medium">
                    {service.subCategory}
                  </div>
                </div>
              )}
              {service.requirements && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">অতিরিক্ত প্রয়োজনীয়তা</div>
                  <div className="text-gray-800 whitespace-pre-line">
                    {service.requirements}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" />
            আবেদনের আগে মনে রাখুন
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <span>সকল প্রয়োজনীয় কাগজপত্র প্রস্তুত রাখুন</span>
            </div>
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <span>সঠিক ও সম্পূর্ণ তথ্য প্রদান করুন</span>
            </div>
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <span>আবেদনের স্ট্যাটাস নিয়মিত চেক করুন</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

