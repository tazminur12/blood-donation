"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaHeartbeat,
  FaSearch,
  FaSpinner,
  FaFilter,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaTint,
  FaUserTie,
  FaHandsHelping,
  FaPhone,
  FaBuilding,
} from "react-icons/fa";

const statusLabels = {
  scheduled: "নির্ধারিত",
  ongoing: "চলমান",
  completed: "সম্পন্ন",
  cancelled: "বাতিল",
};

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  ongoing: "bg-emerald-100 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

const driveTypeLabels = {
  regular: "নিয়মিত",
  emergency: "জরুরি",
  mobile: "মোবাইল",
  special: "বিশেষ",
};

export default function BloodDrivesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    totalTargetDonors: 0,
    totalTargetBloodUnits: 0,
    totalRegisteredDonors: 0,
    totalCollectedBloodUnits: 0,
    totalVolunteers: 0,
  });

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    // Check if user is admin only after session is loaded
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Only load drives if user is admin
    if (session?.user?.role === "admin") {
      loadDrives();
    }
  }, [session, status, router]);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/drives");
      const data = await res.json();
      
      if (res.ok) {
        console.log("Blood drives loaded:", data.drives?.length || 0);
        setDrives(data.drives || []);
        setStats(data.stats || {
          total: 0,
          scheduled: 0,
          ongoing: 0,
          completed: 0,
          cancelled: 0,
          totalTargetDonors: 0,
          totalTargetBloodUnits: 0,
          totalRegisteredDonors: 0,
          totalCollectedBloodUnits: 0,
          totalVolunteers: 0,
        });
      } else {
        console.error("Error response:", data);
        if (data.currentRole) {
          Swal.fire({
            icon: "warning",
            title: "অনুমতি নেই",
            html: `<p>${data.error}</p><p class="mt-2"><strong>আপনার বর্তমান রোল:</strong> ${data.currentRole}</p><p class="mt-2">রোল পরিবর্তন করতে একজন অ্যাডমিনের সাথে যোগাযোগ করুন।</p>`,
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ত্রুটি",
            text: data.error || data.message || "রক্তদান ড্রাইভ লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading blood drives:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "রক্তদান ড্রাইভ লোড করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.organizerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || drive.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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

  const formatTime = (time) => {
    if (!time) return "নির্ধারিত নয়";
    try {
      if (typeof time === "string") {
        return time;
      }
      return new Date(time).toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time || "নির্ধারিত নয়";
    }
  };

  const getProgressPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Show loading while session is loading or drives are being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-rose-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "রক্তদান ড্রাইভ লোড হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (redirect will happen)
  if (status === "unauthenticated") {
    return null;
  }

  // If not admin, don't render (redirect will happen)
  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaHeartbeat className="text-rose-600" />
            রক্তদান ড্রাইভ ব্যবস্থাপনা
          </h1>
          <p className="text-slate-600 mt-1">
            সমস্ত রক্তদান ড্রাইভের তথ্য দেখুন এবং পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট ড্রাইভ</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">নির্ধারিত</p>
          <p className="text-2xl font-bold text-blue-700">{stats.scheduled}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">চলমান</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.ongoing}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">সম্পন্ন</p>
          <p className="text-2xl font-bold text-slate-700">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">ফিল্টার করা</p>
          <p className="text-2xl font-bold text-sky-700">{filteredDrives.length}</p>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 rounded-lg">
              <FaUsers className="text-rose-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">লক্ষ্য রক্তদাতা</p>
              <p className="text-2xl font-bold text-rose-700">{stats.totalTargetDonors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 rounded-lg">
              <FaTint className="text-rose-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">লক্ষ্য রক্ত</p>
              <p className="text-2xl font-bold text-rose-700">{stats.totalTargetBloodUnits}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <FaUsers className="text-emerald-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">নিবন্ধিত</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.totalRegisteredDonors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <FaTint className="text-emerald-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">সংগৃহীত</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.totalCollectedBloodUnits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ড্রাইভ নাম, ভেন্যু, ঠিকানা বা আয়োজকের নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব অবস্থা</option>
              <option value="scheduled">নির্ধারিত</option>
              <option value="ongoing">চলমান</option>
              <option value="completed">সম্পন্ন</option>
              <option value="cancelled">বাতিল</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drives Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ড্রাইভ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  তারিখ ও সময়
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ভেন্যু
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  অগ্রগতি
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  অবস্থা
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  কাজ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDrives.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FaHeartbeat className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">কোন রক্তদান ড্রাইভ পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                filteredDrives.map((drive) => (
                  <tr key={drive.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {drive.image ? (
                          <img
                            src={drive.image}
                            alt={drive.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-rose-100 flex items-center justify-center">
                            <FaHeartbeat className="text-rose-600 text-xl" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">
                            {drive.title || "ড্রাইভ নাম নেই"}
                          </p>
                          {drive.organizerName && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <FaUserTie className="text-xs" />
                              {drive.organizerName}
                            </p>
                          )}
                          {drive.driveType && (
                            <span className="text-xs text-slate-400 mt-1">
                              {driveTypeLabels[drive.driveType] || drive.driveType}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="text-xs" />
                          <span>{formatDate(drive.driveDate)}</span>
                        </div>
                        {drive.startTime && drive.endTime && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <FaClock className="text-xs" />
                            <span>
                              {formatTime(drive.startTime)} - {formatTime(drive.endTime)}
                            </span>
                          </div>
                        )}
                        {!drive.driveDate && (
                          <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {drive.venue ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaBuilding className="text-xs" />
                            <span>{drive.venue}</span>
                          </div>
                        ) : (
                          <>
                            {drive.location && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FaMapMarkerAlt className="text-xs" />
                                <span>{drive.location}</span>
                              </div>
                            )}
                            {drive.address && (
                              <p className="text-xs text-slate-500">{drive.address}</p>
                            )}
                            {drive.division && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FaMapMarkerAlt className="text-xs" />
                                <span>{drive.division}</span>
                              </div>
                            )}
                            {drive.district && (
                              <p className="text-xs text-slate-500 ml-5">{drive.district}</p>
                            )}
                            {drive.upazila && (
                              <p className="text-xs text-slate-500 ml-5">{drive.upazila}</p>
                            )}
                          </>
                        )}
                        {!drive.venue && !drive.location && !drive.address && !drive.division && (
                          <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-600">রক্তদাতা</span>
                            <span className="font-semibold">
                              {drive.registeredDonors || 0} / {drive.targetDonors || 0}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${getProgressPercentage(
                                  drive.registeredDonors || 0,
                                  drive.targetDonors || 0
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-600">রক্ত</span>
                            <span className="font-semibold">
                              {drive.collectedBloodUnits || 0} / {drive.targetBloodUnits || 0}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-rose-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${getProgressPercentage(
                                  drive.collectedBloodUnits || 0,
                                  drive.targetBloodUnits || 0
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          statusColors[drive.status] || statusColors["scheduled"]
                        }`}
                      >
                        {statusLabels[drive.status] || drive.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDrive(drive)}
                        className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition"
                        title="বিস্তারিত দেখুন"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drive Detail Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">রক্তদান ড্রাইভের বিস্তারিত তথ্য</h2>
                <button
                  onClick={() => setSelectedDrive(null)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {selectedDrive.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={selectedDrive.image}
                    alt={selectedDrive.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {selectedDrive.title || "ড্রাইভ নাম নেই"}
                </h3>
                {selectedDrive.description && (
                  <p className="text-slate-600">{selectedDrive.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">ড্রাইভ তারিখ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-rose-600" />
                    {formatDate(selectedDrive.driveDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">সময়</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaClock className="text-rose-600" />
                    {selectedDrive.startTime && selectedDrive.endTime
                      ? `${formatTime(selectedDrive.startTime)} - ${formatTime(selectedDrive.endTime)}`
                      : "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">অবস্থা</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      statusColors[selectedDrive.status] || statusColors["scheduled"]
                    }`}
                  >
                    {statusLabels[selectedDrive.status] || selectedDrive.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">ড্রাইভ ধরন</p>
                  <p className="font-medium text-slate-900">
                    {driveTypeLabels[selectedDrive.driveType] || selectedDrive.driveType || "নিয়মিত"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">ভেন্যু</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaBuilding className="text-rose-600" />
                    {selectedDrive.venue || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">আয়োজক</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaUserTie className="text-rose-600" />
                    {selectedDrive.organizerName || selectedDrive.organizerEmail || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">অবস্থান</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-rose-600" />
                    {selectedDrive.address ||
                     selectedDrive.location ||
                     (selectedDrive.division && `${selectedDrive.division}${selectedDrive.district ? `, ${selectedDrive.district}` : ''}${selectedDrive.upazila ? `, ${selectedDrive.upazila}` : ''}`) ||
                     "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">যোগাযোগ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaPhone className="text-rose-600" />
                    {selectedDrive.contactPhone || selectedDrive.organizerPhone || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">স্বেচ্ছাসেবী</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaHandsHelping className="text-rose-600" />
                    {selectedDrive.volunteerCount || 0} জন
                  </p>
                </div>
              </div>

              {selectedDrive.notes && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">নোট</p>
                  <p className="text-slate-900">{selectedDrive.notes}</p>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">রক্তদাতা অগ্রগতি</p>
                    <span className="text-sm text-slate-600">
                      {selectedDrive.registeredDonors || 0} / {selectedDrive.targetDonors || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${getProgressPercentage(
                          selectedDrive.registeredDonors || 0,
                          selectedDrive.targetDonors || 0
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {getProgressPercentage(
                      selectedDrive.registeredDonors || 0,
                      selectedDrive.targetDonors || 0
                    )}% সম্পন্ন
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">রক্ত সংগ্রহ অগ্রগতি</p>
                    <span className="text-sm text-slate-600">
                      {selectedDrive.collectedBloodUnits || 0} / {selectedDrive.targetBloodUnits || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-rose-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${getProgressPercentage(
                          selectedDrive.collectedBloodUnits || 0,
                          selectedDrive.targetBloodUnits || 0
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {getProgressPercentage(
                      selectedDrive.collectedBloodUnits || 0,
                      selectedDrive.targetBloodUnits || 0
                    )}% সম্পন্ন
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDrive(null)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>দ্রষ্টব্য:</strong> এই পৃষ্ঠায় সমস্ত রক্তদান ড্রাইভের তথ্য দেখানো হয়েছে। আপনি অবস্থা, 
          তারিখ এবং অন্যান্য ফিল্টার ব্যবহার করে ড্রাইভ খুঁজে পেতে পারেন।
        </p>
      </div>
    </div>
  );
}

