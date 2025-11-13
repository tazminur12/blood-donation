"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaSearch,
  FaFilter,
  FaTint,
  FaCalendarAlt,
  FaHospital,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaHistory,
  FaEye,
  FaChartBar,
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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonationHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    totalUnits: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, filterStatus, filterBloodGroup]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      if (filterBloodGroup !== "all") {
        params.append("bloodGroup", filterBloodGroup);
      }

      const res = await fetch(`/api/donor/history?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setDonations(data.donations || []);
        setStats(data.stats || {
          total: 0,
          completed: 0,
          totalUnits: 0,
        });
      } else {
        console.error("Error loading history:", data);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "দান ইতিহাস লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading history:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "দান ইতিহাস লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
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
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);

      if (diffMins < 60) {
        return `${diffMins} মিনিট আগে`;
      } else if (diffHours < 24) {
        return `${diffHours} ঘণ্টা আগে`;
      } else if (diffDays < 30) {
        return `${diffDays} দিন আগে`;
      } else if (diffMonths < 12) {
        return `${diffMonths} মাস আগে`;
      } else {
        return `${diffYears} বছর আগে`;
      }
    } catch {
      return "";
    }
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      !searchTerm ||
      donation.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <FaHistory className="text-rose-600" />
          দান ইতিহাস
        </h1>
        <p className="text-slate-600 mt-1">
          আপনার সমস্ত রক্তদানের রেকর্ড দেখুন
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">মোট দান</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
              <FaHistory className="text-sky-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">সম্পন্ন</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaCheckCircle className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">মোট ইউনিট</p>
              <p className="text-2xl font-bold text-rose-600">{stats.totalUnits}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
              <FaChartBar className="text-rose-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">ফিল্টার</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="রোগীর নাম, হাসপাতাল, রক্তের গ্রুপ খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="completed">সম্পন্ন</option>
              <option value="pending">অপেক্ষমান</option>
              <option value="cancelled">বাতিল</option>
            </select>
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">সব রক্তের গ্রুপ</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <FaHistory className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">কোন দান ইতিহাস পাওয়া যায়নি</p>
            <p className="text-slate-500 text-sm mt-2">
              আপনি এখনও কোন রক্তদান করেননি
            </p>
          </div>
        ) : (
          filteredDonations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Side - Donation Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-bold text-slate-900">
                            {donation.patientName || "অজানা রোগী"}
                          </h3>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                              bloodGroupColors[donation.bloodGroup] || bloodGroupColors["Unknown"]
                            }`}
                          >
                            <FaTint className="mr-1" />
                            {donation.bloodGroup}
                          </span>
                          <span className="text-sm text-slate-500">
                            {donation.units} ইউনিট
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {donation.hospital && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaHospital className="text-sky-600" />
                              <span>{donation.hospital}</span>
                            </div>
                          )}
                          {donation.donationDate && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaCalendarAlt className="text-sky-600" />
                              <span>{formatDate(donation.donationDate)}</span>
                            </div>
                          )}
                          {donation.createdAt && (
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                              <FaClock className="text-slate-400" />
                              <span>{getTimeAgo(donation.createdAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Status */}
                      <div className="flex flex-col items-end gap-2">
                        {donation.status === "completed" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <FaCheckCircle className="mr-1" />
                            সম্পন্ন
                          </span>
                        ) : donation.status === "pending" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                            <FaClock className="mr-1" />
                            অপেক্ষমান
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <FaTimesCircle className="mr-1" />
                            বাতিল
                          </span>
                        )}

                        {donation.requestId && (
                          <button
                            onClick={() => router.push(`/request/${donation.requestId}`)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition"
                          >
                            <FaEye />
                            <span>অনুরোধ দেখুন</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">দানের বিস্তারিত</h2>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">রোগীর নাম</p>
                  <p className="font-semibold text-slate-900">{selectedDonation.patientName || "নির্ধারিত নয়"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">রক্তের গ্রুপ</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      bloodGroupColors[selectedDonation.bloodGroup] || bloodGroupColors["Unknown"]
                    }`}
                  >
                    <FaTint className="mr-1" />
                    {selectedDonation.bloodGroup || "নির্ধারিত নয়"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">ইউনিট</p>
                  <p className="font-semibold text-slate-900">{selectedDonation.units || 1} ইউনিট</p>
                </div>
                {selectedDonation.hospital && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">হাসপাতাল</p>
                    <p className="font-semibold text-slate-900">{selectedDonation.hospital}</p>
                  </div>
                )}
                {selectedDonation.donationDate && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">দানের তারিখ</p>
                    <p className="font-semibold text-slate-900">{formatDate(selectedDonation.donationDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 mb-1">স্ট্যাটাস</p>
                  {selectedDonation.status === "completed" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <FaCheckCircle className="mr-1" />
                      সম্পন্ন
                    </span>
                  ) : selectedDonation.status === "pending" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                      <FaClock className="mr-1" />
                      অপেক্ষমান
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <FaTimesCircle className="mr-1" />
                      বাতিল
                    </span>
                  )}
                </div>
                {selectedDonation.createdAt && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">তৈরি হয়েছে</p>
                    <p className="font-semibold text-slate-900">{formatDateTime(selectedDonation.createdAt)}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              {selectedDonation.requestId && (
                <button
                  onClick={() => {
                    setSelectedDonation(null);
                    router.push(`/request/${selectedDonation.requestId}`);
                  }}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                >
                  অনুরোধ দেখুন
                </button>
              )}
              <button
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

