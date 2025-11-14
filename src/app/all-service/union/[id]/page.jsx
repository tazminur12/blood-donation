"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSpinner,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUsers,
  FaBuilding,
  FaCode,
  FaCalendarAlt,
  FaUser,
  FaInfoCircle,
} from "react-icons/fa";

export default function UnionDetailsPage() {
  const params = useParams();
  const [union, setUnion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnion = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/unions");
        const data = await res.json();

        if (res.ok && data.success) {
          const found = data.unions?.find((u) => u.id === params.id);
          if (found) {
            setUnion(found);
            setError(null);
          } else {
            setError("ইউনিয়ন পাওয়া যায়নি");
          }
        } else {
          setError("ডেটা লোড করতে সমস্যা হয়েছে");
        }
      } catch (err) {
        console.error("Error fetching union:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUnion();
    }
  }, [params.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
      case "Pending":
        return "🟡";
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
              ইউনিয়নের তথ্য লোড হচ্ছে...
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !union) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {error || "ইউনিয়ন পাওয়া যায়নি"}
            </h3>
            <Link
              href="/all-service/union"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              <FaArrowLeft />
              ইউনিয়ন তালিকায় ফিরে যান
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
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/all-service/union"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition text-sm"
          >
            <FaArrowLeft />
            <span>ইউনিয়ন তালিকায় ফিরে যান</span>
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <FaMapMarkerAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {union.name}
            </h1>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  union.status
                )}`}
              >
                {getStatusIcon(union.status)}{" "}
                {union.status === "Active"
                  ? "সক্রিয়"
                  : union.status === "Inactive"
                  ? "নিষ্ক্রিয়"
                  : "অপেক্ষমান"}
              </span>
              {union.upazila && (
                <div className="flex items-center text-white/90">
                  <FaMapMarkerAlt className="mr-1 text-sm" />
                  <span>{union.upazila}</span>
                </div>
              )}
              {union.code && (
                <div className="flex items-center text-white/90">
                  <FaCode className="mr-1 text-sm" />
                  <span>কোড: {union.code}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {union.population && (
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">জনসংখ্যা</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {Number(union.population).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          {union.area && (
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaBuilding className="text-purple-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">আয়তন</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {union.area} বর্গ কিমি
                  </div>
                </div>
              </div>
            </div>
          )}
          {union.wardCount && (
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaBuilding className="text-blue-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">ওয়ার্ড সংখ্যা</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {union.wardCount}
                  </div>
                </div>
              </div>
            </div>
          )}
          {union.villageCount && (
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FaMapMarkerAlt className="text-orange-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">গ্রাম সংখ্যা</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {union.villageCount}
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
            {union.description && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="text-emerald-600 mr-2" />
                  ইউনিয়নের বিবরণ
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {union.description}
                </p>
              </div>
            )}

            {/* Office Information */}
            {union.officeAddress && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaMapMarkerAlt className="text-red-600 mr-2" />
                  অফিসের ঠিকানা
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {union.officeAddress}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaPhone className="text-blue-600 mr-2" />
                যোগাযোগের তথ্য
              </h3>
              <div className="space-y-3">
                {union.officePhone && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-green-500" />
                    <span className="text-gray-700">{union.officePhone}</span>
                  </div>
                )}
                {union.officeEmail && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-500" />
                    <a
                      href={`mailto:${union.officeEmail}`}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {union.officeEmail}
                    </a>
                  </div>
                )}
                {union.website && (
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-purple-500" />
                    <a
                      href={union.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ওয়েবসাইট দেখুন
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Leadership */}
            {(union.chairmanName || union.secretaryName) && (
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="text-purple-600 mr-2" />
                  নেতৃত্ব
                </h3>
                <div className="space-y-4">
                  {union.chairmanName && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        চেয়ারম্যান
                      </div>
                      <div className="text-gray-800">{union.chairmanName}</div>
                      {union.chairmanPhone && (
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <FaPhone className="text-xs" />
                          {union.chairmanPhone}
                        </div>
                      )}
                    </div>
                  )}
                  {union.secretaryName && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        সচিব
                      </div>
                      <div className="text-gray-800">{union.secretaryName}</div>
                      {union.secretaryPhone && (
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <FaPhone className="text-xs" />
                          {union.secretaryPhone}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                অতিরিক্ত তথ্য
              </h3>
              <div className="space-y-3">
                {union.code && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">ইউনিয়ন কোড</div>
                    <div className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {union.code}
                    </div>
                  </div>
                )}
                {union.upazila && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">উপজেলা</div>
                    <div className="text-gray-800">{union.upazila}</div>
                  </div>
                )}
                {union.establishmentDate && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      প্রতিষ্ঠার তারিখ
                    </div>
                    <div className="text-gray-800 flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-500" />
                      {new Date(union.establishmentDate).toLocaleDateString(
                        "bn-BD",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

