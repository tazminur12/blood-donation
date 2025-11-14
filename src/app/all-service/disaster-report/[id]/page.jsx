"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaExclamationTriangle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaPhone,
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaHome,
  FaFlag,
} from "react-icons/fa";

export default function DisasterReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageViewer, setImageViewer] = useState({
    open: false,
    src: "",
    index: 0,
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/disaster-reports/${params.id}`);
        const data = await res.json();

        if (res.ok && data.success && data.report) {
          setReport(data.report);
        } else {
          // Fallback: try fetching all and finding the one
          const allRes = await fetch("/api/disaster-reports");
          const allData = await allRes.json();
          if (allRes.ok && allData.success) {
            const found = allData.reports?.find((r) => r.id === params.id);
            if (found) {
              setReport(found);
            } else {
              setError("রিপোর্ট পাওয়া যায়নি");
            }
          } else {
            setError("ডেটা লোড করতে সমস্যা হয়েছে");
          }
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "corruption":
        return "bg-red-100 text-red-800 border-red-200";
      case "disaster":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "injustice":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "other":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "investigating":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="w-5 h-5" />;
      case "investigating":
        return <FaEye className="w-5 h-5" />;
      case "resolved":
        return <FaCheckCircle className="w-5 h-5" />;
      case "rejected":
        return <FaTimesCircle className="w-5 h-5" />;
      default:
        return <FaClock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">রিপোর্ট লোড হচ্ছে...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ত্রুটি</h2>
            <p className="text-gray-600 mb-4">{error || "রিপোর্ট পাওয়া যায়নি"}</p>
            <Link
              href="/all-service/disaster-report"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
            >
              <FaArrowLeft className="inline mr-2" />
              ফিরে যান
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Image Modal Viewer */}
      {imageViewer.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              type="button"
              onClick={() => setImageViewer({ open: false, src: "", index: 0 })}
              className="absolute -top-10 right-0 text-white text-3xl"
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={imageViewer.src}
              alt={`Image ${imageViewer.index + 1}`}
              className="w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-red-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/all-service/disaster-report"
              className="text-white hover:text-red-200 transition"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {report.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                    report.category
                  )}`}
                >
                  <FaFlag className="mr-2" />
                  {getCategoryText(report.category)}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                    report.priority
                  )}`}
                >
                  <FaExclamationTriangle className="mr-2" />
                  {getPriorityText(report.priority)} অগ্রাধিকার
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    report.status
                  )}`}
                >
                  {getStatusIcon(report.status)}
                  <span className="ml-2">{getStatusText(report.status)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              বিস্তারিত বিবরণ
            </h3>
            <p className="text-gray-700 leading-relaxed">{report.description}</p>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location */}
            {report.location && (
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">অবস্থান</h4>
                  <p className="text-gray-600">{report.location}</p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-start">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FaCalendarAlt className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">রিপোর্টের তারিখ</h4>
                <p className="text-gray-600">
                  {new Date(report.createdAt).toLocaleDateString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Evidence */}
            {report.evidence && (
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FaFileAlt className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">প্রমাণ/সাক্ষ্য</h4>
                  <p className="text-gray-600">{report.evidence}</p>
                </div>
              </div>
            )}

            {/* Contact Info */}
            {report.contactInfo && (
              <div className="flex items-start">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <FaPhone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">যোগাযোগের তথ্য</h4>
                  <p className="text-gray-600">{report.contactInfo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          {report.images && report.images.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                সংযুক্ত ছবি
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.images.map((image, index) => {
                  const src = typeof image === "string" ? image : image.url;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setImageViewer({ open: true, src, index })
                        }
                        className="block w-full focus:outline-none"
                      >
                        <img
                          src={src}
                          alt={`${report.title} - Image ${index + 1}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.style.display = "flex";
                            }
                          }}
                        />
                      </button>
                      <div
                        className="hidden w-full h-48 bg-gray-100 items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-sm text-gray-500">ছবি লোড হয়নি</p>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="text-sm text-gray-600 text-center">
                          ছবি {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setImageViewer({ open: true, src, index })
                          }
                          className="block mt-2 w-full text-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          বড় করে দেখুন
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                সংযুক্ত ছবি
              </h3>
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-500">কোনো ছবি সংযুক্ত করা হয়নি</p>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              স্ট্যাটাস টাইমলাইন
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    রিপোর্ট জমা দেওয়া হয়েছে
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString("bn-BD")}
                  </p>
                </div>
              </div>

              {report.status !== "pending" && (
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {report.status === "investigating"
                        ? "তদন্ত শুরু হয়েছে"
                        : report.status === "resolved"
                        ? "সমাধান হয়েছে"
                        : "প্রত্যাখ্যাত হয়েছে"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {report.updatedAt && report.updatedAt !== report.createdAt
                        ? new Date(report.updatedAt).toLocaleDateString("bn-BD")
                        : "সম্প্রতি"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Link
              href="/all-service/disaster-report"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <FaHome className="mr-2" />
              সব রিপোর্ট দেখুন
            </Link>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaFileAlt className="mr-2" />
              প্রিন্ট করুন
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

