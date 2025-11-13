"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaSpinner,
  FaPhone,
  FaTint,
  FaCalendarAlt,
  FaHospital,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaHandHoldingHeart,
} from "react-icons/fa";
import Swal from "sweetalert2";

const bloodGroupColors = {
  "A+": "bg-red-100 text-red-700 border-red-200",
  "A-": "bg-red-50 text-red-600 border-red-100",
  "B+": "bg-blue-100 text-blue-700 border-blue-200",
  "B-": "bg-blue-50 text-blue-600 border-blue-100",
  "AB+": "bg-purple-100 text-purple-700 border-purple-200",
  "AB-": "bg-purple-50 text-purple-600 border-purple-100",
  "O+": "bg-green-100 text-green-700 border-green-200",
  "O-": "bg-green-50 text-green-600 border-green-100",
  "Unknown": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function RequestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: sessionStatus } = useSession();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadRequest();
    }
  }, [params?.id]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/requests/${params.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setRequest(data.request);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "অনুরোধ লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        }).then(() => {
          router.push("/request");
        });
      }
    } catch (error) {
      console.error("Error loading request:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "অনুরোধ লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        router.push("/request");
      });
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

  const formatDateTime = (date) => {
    if (!date) return "নির্ধারিত নয়";
    try {
      return new Date(date).toLocaleString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "নির্ধারিত নয়";
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "";
    try {
      const now = new Date();
      const then = new Date(date);
      const diffMs = now - then;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins} মিনিট আগে`;
      } else if (diffHours < 24) {
        return `${diffHours} ঘণ্টা আগে`;
      } else if (diffDays < 7) {
        return `${diffDays} দিন আগে`;
      } else {
        return formatDate(date);
      }
    } catch {
      return "";
    }
  };

  const handleConfirmDonation = async () => {
    // Check if user is logged in
    if (sessionStatus === "loading") {
      return;
    }

    if (sessionStatus === "unauthenticated" || !session) {
      Swal.fire({
        icon: "warning",
        title: "লগইন প্রয়োজন",
        text: "দান নিশ্চিত করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "লগইন করুন",
        confirmButtonColor: "#ef4444",
        showCancelButton: true,
        cancelButtonText: "বাতিল",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    // Confirm with user
    const result = await Swal.fire({
      icon: "question",
      title: "দান নিশ্চিত করুন",
      html: `
        <p>আপনি কি নিশ্চিত যে আপনি এই রক্তের অনুরোধটি পূরণ করেছেন?</p>
        <div class="text-left mt-4 space-y-2">
          <p><strong>রোগীর নাম:</strong> ${request?.patientName || "N/A"}</p>
          <p><strong>রক্তের গ্রুপ:</strong> ${request?.bloodGroup || "N/A"}</p>
          <p><strong>ইউনিট:</strong> ${request?.units || 1}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, নিশ্চিত করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setConfirming(true);
      const res = await fetch(`/api/requests/${params.id}/confirm`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "দান সফলভাবে নিশ্চিত করা হয়েছে। আপনাকে ধন্যবাদ!",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          // Reload the request to show updated status
          loadRequest();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "দান নিশ্চিত করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error confirming donation:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "দান নিশ্চিত করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50/40">
        <Navbar />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="h-8 w-8 animate-spin text-rose-600 mx-auto mb-4" />
              <p className="text-slate-600">লোড হচ্ছে...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-rose-50/40">
        <Navbar />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <FaTimesCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">অনুরোধ পাওয়া যায়নি</p>
            <button
              onClick={() => router.push("/request")}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
            >
              ফিরে যান
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canConfirm = 
    sessionStatus === "authenticated" && 
    request.status !== "fulfilled" && 
    request.status !== "cancelled";

  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.push("/request")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <FaArrowLeft />
            <span>ফিরে যান</span>
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {request.patientName || "অজানা রোগী"}
                  </h1>
                  {request.urgency === "urgent" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                      <FaExclamationTriangle className="mr-1" />
                      জরুরী
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      bloodGroupColors[request.bloodGroup] || bloodGroupColors["Unknown"]
                    }`}
                  >
                    <FaTint className="mr-1" />
                    {request.bloodGroup}
                  </span>
                  <span className="text-sm text-slate-500">
                    {request.units} ইউনিট
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {request.status === "pending" || request.status === "active" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                      <FaClock className="mr-1" />
                      অপেক্ষমান
                    </span>
                  ) : request.status === "fulfilled" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <FaCheckCircle className="mr-1" />
                      পূরণ হয়েছে
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <FaTimesCircle className="mr-1" />
                      বাতিল
                    </span>
                  )}
                  {request.createdAt && (
                    <span className="text-sm text-slate-500">
                      {getTimeAgo(request.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-rose-600" />
                  রোগীর তথ্য
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">রোগীর নাম</p>
                    <p className="font-semibold text-slate-900">{request.patientName || "নির্ধারিত নয়"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">রক্তের গ্রুপ</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                        bloodGroupColors[request.bloodGroup] || bloodGroupColors["Unknown"]
                      }`}
                    >
                      <FaTint className="mr-1" />
                      {request.bloodGroup || "নির্ধারিত নয়"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">প্রয়োজনীয় ইউনিট</p>
                    <p className="font-semibold text-slate-900">{request.units || 1} ইউনিট</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">জরুরিতা</p>
                    {request.urgency === "urgent" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                        <FaExclamationTriangle className="mr-1" />
                        জরুরী
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        সাধারণ
                      </span>
                    )}
                  </div>
                  {request.requiredDate && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">প্রয়োজনীয় তারিখ</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-2">
                        <FaCalendarAlt className="text-rose-600" />
                        {formatDate(request.requiredDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hospital Information */}
              {request.hospital && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaHospital className="text-rose-600" />
                    হাসপাতাল
                  </h2>
                  <p className="font-semibold text-slate-900">{request.hospital}</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaPhone className="text-rose-600" />
                  যোগাযোগ
                </h2>
                <div className="space-y-3">
                  {request.contactPerson && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">যোগাযোগকারী</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-2">
                        <FaUser className="text-rose-600" />
                        {request.contactPerson}
                      </p>
                    </div>
                  )}
                  {request.contactNumber && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">যোগাযোগের নম্বর</p>
                      <a
                        href={`tel:${request.contactNumber}`}
                        className="font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-2"
                      >
                        <FaPhone className="text-rose-600" />
                        {request.contactNumber}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              {(request.division || request.district || request.upazila) && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-rose-600" />
                    অবস্থান
                  </h2>
                  <div className="space-y-2">
                    {request.division && (
                      <p className="text-slate-900">
                        <span className="text-slate-600">বিভাগ: </span>
                        <span className="font-semibold">{request.division}</span>
                      </p>
                    )}
                    {request.district && (
                      <p className="text-slate-900">
                        <span className="text-slate-600">জেলা: </span>
                        <span className="font-semibold">{request.district}</span>
                      </p>
                    )}
                    {request.upazila && (
                      <p className="text-slate-900">
                        <span className="text-slate-600">উপজেলা: </span>
                        <span className="font-semibold">{request.upazila}</span>
                      </p>
                    )}
                    {request.address && (
                      <p className="text-slate-900 mt-3">
                        <span className="text-slate-600">ঠিকানা: </span>
                        <span className="font-semibold">{request.address}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamp Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaClock className="text-rose-600" />
                  সময়
                </h2>
                <div className="space-y-2">
                  {request.createdAt && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">তৈরি হয়েছে</p>
                      <p className="font-semibold text-slate-900">{formatDateTime(request.createdAt)}</p>
                    </div>
                  )}
                  {request.updatedAt && request.updatedAt !== request.createdAt && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">আপডেট হয়েছে</p>
                      <p className="font-semibold text-slate-900">{formatDateTime(request.updatedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {request.description && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">বিবরণ</h2>
              <p className="text-slate-900 whitespace-pre-wrap leading-relaxed">
                {request.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {request.contactNumber && (
                <a
                  href={`tel:${request.contactNumber}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-md"
                >
                  <FaPhone />
                  <span>কল করুন</span>
                </a>
              )}
              {canConfirm && (
                <button
                  onClick={handleConfirmDonation}
                  disabled={confirming}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {confirming ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>নিশ্চিত করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FaHandHoldingHeart />
                      <span>দান নিশ্চিত করুন</span>
                    </>
                  )}
                </button>
              )}
              {request.status === "fulfilled" && (
                <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200">
                  <FaCheckCircle />
                  <span>এই অনুরোধটি পূরণ হয়েছে</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

