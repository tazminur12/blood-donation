"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaTint,
  FaHospital,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowRight,
  FaEye,
} from "react-icons/fa";

const bloodGroupColors = {
  "A+": "bg-red-100 text-red-700 border-red-200",
  "A-": "bg-red-50 text-red-600 border-red-100",
  "B+": "bg-blue-100 text-blue-700 border-blue-200",
  "B-": "bg-blue-50 text-blue-600 border-blue-100",
  "AB+": "bg-purple-100 text-purple-700 border-purple-200",
  "AB-": "bg-purple-50 text-purple-600 border-purple-100",
  "O+": "bg-green-100 text-green-700 border-green-200",
  "O-": "bg-green-50 text-green-600 border-green-100",
  Unknown: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function RecentRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentRequests();
  }, []);

  const loadRecentRequests = async () => {
    try {
      setLoading(true);
      // Fetch only active/pending requests (API defaults to pending/active)
      const res = await fetch("/api/requests");
      const data = await res.json();

      if (res.ok && data.requests) {
        // Take only first 6 most recent requests
        setRequests(data.requests.slice(0, 6));
      }
    } catch (error) {
      console.error("Error loading recent requests:", error);
    } finally {
      setLoading(false);
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

  const getTimeAgo = (date) => {
    if (!date) return "";
    try {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);

      if (diffInSeconds < 60) return "এখনই";
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} মিনিট আগে`;
      }
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ঘন্টা আগে`;
      }
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} দিন আগে`;
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaSpinner className="h-8 w-8 text-rose-600 animate-spin mx-auto" />
            <p className="text-slate-600 mt-4">রক্তের অনুরোধ লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  if (requests.length === 0) {
    return null; // Don't show section if no requests
  }

  return (
    <section className="py-16 bg-gradient-to-b from-rose-50/50 to-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold text-highlighted mb-4">
            জরুরী রক্তের অনুরোধ 🩸
          </span>
          <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl mb-4">
            সাম্প্রতিক রক্তের অনুরোধ
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            জরুরী রক্তের প্রয়োজনে সাহায্যের হাত বাড়ান। আপনার একটি রক্তদান কারও জীবন বাঁচাতে পারে।
          </p>
        </div>

        {/* Request Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header with Patient Name and Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                      {request.patientName || "অজানা রোগী"}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {request.urgency === "urgent" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                          <FaExclamationTriangle className="mr-1 text-xs" />
                          জরুরী
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                          bloodGroupColors[request.bloodGroup] || bloodGroupColors["Unknown"]
                        }`}
                      >
                        <FaTint className="mr-1 text-xs" />
                        {request.bloodGroup}
                      </span>
                      <span className="text-xs text-slate-500">
                        {request.units} ইউনিট
                      </span>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="space-y-2 mb-4">
                  {request.hospital && (
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <FaHospital className="text-rose-600 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{request.hospital}</span>
                    </div>
                  )}
                  {request.division && (
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <FaMapMarkerAlt className="text-rose-600 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">
                        {request.division}
                        {request.district && `, ${request.district}`}
                        {request.upazila && `, ${request.upazila}`}
                      </span>
                    </div>
                  )}
                  {request.contactPerson && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaUser className="text-rose-600" />
                      <span>{request.contactPerson}</span>
                    </div>
                  )}
                  {request.contactNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <FaPhone className="text-rose-600" />
                      <a
                        href={`tel:${request.contactNumber}`}
                        className="text-rose-600 hover:text-rose-700 hover:underline font-medium"
                      >
                        {request.contactNumber}
                      </a>
                    </div>
                  )}
                  {request.requiredDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendarAlt className="text-rose-600" />
                      <span>প্রয়োজন: {formatDate(request.requiredDate)}</span>
                    </div>
                  )}
                  {request.createdAt && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FaClock className="text-slate-400" />
                      <span>{getTimeAgo(request.createdAt)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {request.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {request.description}
                  </p>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => router.push(`/request/${request.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors duration-200 group-hover:bg-rose-100"
                >
                  <FaEye />
                  <span>বিস্তারিত দেখুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <span>সব অনুরোধ দেখুন</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

