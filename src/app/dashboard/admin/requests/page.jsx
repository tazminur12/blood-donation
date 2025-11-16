"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaTint,
  FaCalendarAlt,
  FaHospital,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaEnvelope,
  FaUserCheck,
  FaCheck,
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

export default function AdminBloodRequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [filterDivision, setFilterDivision] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [locationData, setLocationData] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [availableDonors, setAvailableDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [assigningDonor, setAssigningDonor] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    fulfilled: 0,
    cancelled: 0,
    urgent: 0,
  });

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    if (session?.user?.role === "admin") {
      loadLocationData();
      loadRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, filterBloodGroup, filterStatus, filterUrgency, filterDivision, filterDistrict]);

  const loadLocationData = async () => {
    try {
      const res = await fetch("/assets/AllDivision.json");
      const data = await res.json();
      setLocationData(data);
    } catch (error) {
      console.error("Error loading location data:", error);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filterBloodGroup !== "all") {
        params.append("bloodGroup", filterBloodGroup);
      }
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      if (filterUrgency !== "all") {
        params.append("urgency", filterUrgency);
      }
      if (filterDivision !== "all") {
        params.append("division", filterDivision);
      }
      if (filterDistrict !== "all") {
        params.append("district", filterDistrict);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/admin/requests?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setRequests(data.requests || []);
        setStats(data.stats || {
          total: 0,
          pending: 0,
          fulfilled: 0,
          cancelled: 0,
          urgent: 0,
        });
      } else {
        console.error("Error loading requests:", data);
        if (data.currentRole) {
          Swal.fire({
            icon: "warning",
            title: "অনুমতি নেই",
            html: `<p>${data.error}</p><p class="mt-2"><strong>আপনার বর্তমান রোল:</strong> ${data.currentRole}</p>`,
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ত্রুটি",
            text: data.error || "রক্তের অনুরোধ লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "রক্তের অনুরোধ লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    const result = await Swal.fire({
      icon: "question",
      title: "স্ট্যাটাস আপডেট",
      text: `আপনি কি এই অনুরোধের স্ট্যাটাস "${newStatus}" এ পরিবর্তন করতে চান?`,
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, আপডেট করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "অনুরোধ স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        loadRequests();
        setSelectedRequest(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Get available divisions, districts
  const getDivisions = () => {
    if (!locationData) return [];
    return locationData.Bangladesh.map(div => div.Division).sort();
  };

  const getDistricts = () => {
    if (!locationData || filterDivision === "all") return [];
    const division = locationData.Bangladesh.find(d => d.Division === filterDivision);
    if (!division || !division.Districts) return [];
    return division.Districts.map(dist => dist.District).filter(Boolean).sort();
  };

  useEffect(() => {
    if (filterDivision === "all") {
      setFilterDistrict("all");
    }
  }, [filterDivision]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    loadRequests();
  };

  const loadAvailableDonors = async (bloodGroup) => {
    if (!bloodGroup) return;
    
    try {
      setLoadingDonors(true);
      const res = await fetch("/api/admin/donors");
      const data = await res.json();
      
      if (res.ok) {
        // Filter donors by blood group and availability
        const filtered = (data.donors || []).filter(
          donor => donor.bloodGroup === bloodGroup && donor.isAvailable !== false
        );
        setAvailableDonors(filtered);
      } else {
        console.error("Error loading donors:", data);
        setAvailableDonors([]);
      }
    } catch (error) {
      console.error("Error loading donors:", error);
      setAvailableDonors([]);
    } finally {
      setLoadingDonors(false);
    }
  };

  const handleAssignDonor = async (donorEmail) => {
    if (!selectedRequest || !donorEmail) return;

    const result = await Swal.fire({
      icon: "question",
      title: "রক্তদাতা নির্ধারণ",
      html: `<p>আপনি কি <strong>${selectedRequest.patientName}</strong> এর জন্য এই রক্তদাতাকে নির্ধারণ করতে চান?</p><p class="text-sm text-slate-600 mt-2">রক্তদাতার তথ্য Requester এর email এ পাঠানো হবে।</p>`,
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, নির্ধারণ করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setAssigningDonor(true);
      const res = await fetch("/api/admin/requests/assign-donor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          donorEmail: donorEmail,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: data.message || "রক্তদাতা সফলভাবে নির্ধারণ করা হয়েছে এবং Requester এর email এ তথ্য পাঠানো হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 3000,
          timerProgressBar: true,
        });
        loadRequests();
        setSelectedRequest(null);
        setShowDonorModal(false);
        setAvailableDonors([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "রক্তদাতা নির্ধারণ করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error assigning donor:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "রক্তদাতা নির্ধারণ করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setAssigningDonor(false);
    }
  };

  const openDonorModal = (request) => {
    setSelectedRequest(request);
    setShowDonorModal(true);
    loadAvailableDonors(request.bloodGroup);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <FaTint className="text-purple-600" />
          রক্তের অনুরোধ ব্যবস্থাপনা
        </h1>
        <p className="text-slate-600 mt-1">
          সমস্ত রক্তের অনুরোধ দেখুন এবং পরিচালনা করুন
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">মোট</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
              <FaTint className="text-sky-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">অপেক্ষমান</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <FaClock className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">পূরণ হয়েছে</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.fulfilled}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaCheckCircle className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">বাতিল</p>
              <p className="text-2xl font-bold text-rose-600">{stats.cancelled}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
              <FaTimesCircle className="text-rose-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">জরুরী</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-xl" />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="রোগীর নাম, হাসপাতাল, যোগাযোগ, ইমেইল খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সব রক্তের গ্রুপ</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমান</option>
              <option value="active">সক্রিয়</option>
              <option value="fulfilled">পূরণ হয়েছে</option>
              <option value="cancelled">বাতিল</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Urgency Filter */}
          <div>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সব জরুরিতা</option>
              <option value="urgent">জরুরী</option>
              <option value="normal">সাধারণ</option>
            </select>
          </div>

          {/* Division Filter */}
          <div>
            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সব বিভাগ</option>
              {getDivisions().map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              disabled={filterDivision === "all" || !locationData}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="all">সব জেলা</option>
              {getDistricts().length > 0 ? (
                getDistricts().map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))
              ) : filterDivision !== "all" && locationData ? (
                <option value="" disabled>জেলা পাওয়া যায়নি</option>
              ) : null}
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <FaTint className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">কোন রক্তের অনুরোধ পাওয়া যায়নি</p>
            <p className="text-slate-500 text-sm mt-2">
              ফিল্টার পরিবর্তন করুন
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Side - Request Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-bold text-slate-900">
                            {request.patientName || "অজানা রোগী"}
                          </h3>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {request.hospital && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaHospital className="text-purple-600" />
                              <span>{request.hospital}</span>
                            </div>
                          )}
                          {request.division && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaMapMarkerAlt className="text-purple-600" />
                              <span>
                                {request.division}
                                {request.district && `, ${request.district}`}
                                {request.upazila && `, ${request.upazila}`}
                              </span>
                            </div>
                          )}
                          {request.contactPerson && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaUser className="text-purple-600" />
                              <span>{request.contactPerson}</span>
                            </div>
                          )}
                          {request.contactNumber && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaPhone className="text-purple-600" />
                              <a
                                href={`tel:${request.contactNumber}`}
                                className="text-purple-600 hover:text-purple-700 hover:underline"
                              >
                                {request.contactNumber}
                              </a>
                            </div>
                          )}
                          {request.requesterName && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaUser className="text-purple-600" />
                              <span className="font-semibold">অনুরোধকারী: {request.requesterName}</span>
                            </div>
                          )}
                          {request.requesterEmail && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaEnvelope className="text-purple-600" />
                              <span>{request.requesterEmail}</span>
                            </div>
                          )}
                          {request.requiredDate && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaCalendarAlt className="text-purple-600" />
                              <span>প্রয়োজন: {formatDate(request.requiredDate)}</span>
                            </div>
                          )}
                          {request.createdAt && (
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                              <FaClock className="text-slate-400" />
                              <span>{getTimeAgo(request.createdAt)}</span>
                            </div>
                          )}
                        </div>

                        {request.description && (
                          <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                            {request.description}
                          </p>
                        )}
                      </div>

                      {/* Right Side - Status and Actions */}
                      <div className="flex flex-col items-end gap-2">
                        {request.status === "pending" || request.status === "active" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                            <FaClock className="mr-1" />
                            {request.status === "pending" ? "অপেক্ষমান" : "সক্রিয়"}
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

                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/request/${request.id}`)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
                          >
                            <FaEye />
                            <span>বিস্তারিত</span>
                          </button>
                          {request.status !== "fulfilled" && request.status !== "cancelled" && (
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition"
                            >
                              <FaEdit />
                              <span>আপডেট</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">অনুরোধের বিস্তারিত</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requester Info */}
                {(selectedRequest.requesterName || selectedRequest.requesterEmail || selectedRequest.requesterMobile) && (
                  <div className="md:col-span-2 bg-slate-50 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">অনুরোধকারীর তথ্য</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedRequest.requesterName && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">নাম</p>
                          <p className="font-semibold text-slate-900 flex items-center gap-2">
                            <FaUser className="text-purple-600" />
                            {selectedRequest.requesterName}
                          </p>
                        </div>
                      )}
                      {selectedRequest.requesterEmail && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">ইমেইল</p>
                          <p className="font-semibold text-slate-900 flex items-center gap-2">
                            <FaEnvelope className="text-purple-600" />
                            {selectedRequest.requesterEmail}
                          </p>
                        </div>
                      )}
                      {selectedRequest.requesterMobile && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">মোবাইল</p>
                          <a
                            href={`tel:${selectedRequest.requesterMobile}`}
                            className="font-semibold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-2"
                          >
                            <FaPhone className="text-purple-600" />
                            {selectedRequest.requesterMobile}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Patient Info */}
                <div>
                  <p className="text-sm text-slate-600 mb-1">রোগীর নাম</p>
                  <p className="font-semibold text-slate-900">{selectedRequest.patientName || "নির্ধারিত নয়"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">রক্তের গ্রুপ</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      bloodGroupColors[selectedRequest.bloodGroup] || bloodGroupColors["Unknown"]
                    }`}
                  >
                    <FaTint className="mr-1" />
                    {selectedRequest.bloodGroup || "নির্ধারিত নয়"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">প্রয়োজনীয় ইউনিট</p>
                  <p className="font-semibold text-slate-900">{selectedRequest.units || 1} ইউনিট</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">জরুরিতা</p>
                  {selectedRequest.urgency === "urgent" ? (
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
                {selectedRequest.hospital && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">হাসপাতাল</p>
                    <p className="font-semibold text-slate-900">{selectedRequest.hospital}</p>
                  </div>
                )}
                {selectedRequest.requiredDate && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">প্রয়োজনীয় তারিখ</p>
                    <p className="font-semibold text-slate-900">{formatDate(selectedRequest.requiredDate)}</p>
                  </div>
                )}
                {selectedRequest.division && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">অবস্থান</p>
                    <p className="font-semibold text-slate-900">
                      {selectedRequest.division}
                      {selectedRequest.district && `, ${selectedRequest.district}`}
                      {selectedRequest.upazila && `, ${selectedRequest.upazila}`}
                    </p>
                  </div>
                )}
                {selectedRequest.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-600 mb-1">ঠিকানা</p>
                    <p className="font-semibold text-slate-900">{selectedRequest.address}</p>
                  </div>
                )}
                {selectedRequest.contactPerson && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">যোগাযোগকারী</p>
                    <p className="font-semibold text-slate-900">{selectedRequest.contactPerson}</p>
                  </div>
                )}
                {selectedRequest.contactNumber && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">যোগাযোগের নম্বর</p>
                    <a
                      href={`tel:${selectedRequest.contactNumber}`}
                      className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      {selectedRequest.contactNumber}
                    </a>
                  </div>
                )}
                {selectedRequest.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-600 mb-1">বিবরণ</p>
                    <p className="text-slate-900 whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 mb-1">স্ট্যাটাস</p>
                  {selectedRequest.status === "pending" || selectedRequest.status === "active" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                      <FaClock className="mr-1" />
                      {selectedRequest.status === "pending" ? "অপেক্ষমান" : "সক্রিয়"}
                    </span>
                  ) : selectedRequest.status === "fulfilled" ? (
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
                </div>
                {selectedRequest.createdAt && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">তৈরি হয়েছে</p>
                    <p className="font-semibold text-slate-900">{formatDateTime(selectedRequest.createdAt)}</p>
                  </div>
                )}
                {selectedRequest.fulfilledBy && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">পূরণ করেছেন</p>
                    <p className="font-semibold text-slate-900">{selectedRequest.fulfilledBy}</p>
                  </div>
                )}
                {selectedRequest.fulfilledAt && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">পূরণের তারিখ</p>
                    <p className="font-semibold text-slate-900">{formatDateTime(selectedRequest.fulfilledAt)}</p>
                  </div>
                )}
              </div>

              {/* Status Update Section */}
              {selectedRequest.status !== "fulfilled" && selectedRequest.status !== "cancelled" && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="font-semibold text-slate-900 mb-3">অ্যাকশন</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openDonorModal(selectedRequest)}
                      disabled={updatingStatus || assigningDonor}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaUserCheck />
                      <span>রক্তদাতা নির্ধারণ করুন</span>
                    </button>
                    {selectedRequest.status !== "active" && (
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest.id, "active")}
                        disabled={updatingStatus || assigningDonor}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {updatingStatus ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheckCircle />
                        )}
                        <span>সক্রিয় করুন</span>
                      </button>
                    )}
                    {selectedRequest.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatusUpdate(selectedRequest.id, "cancelled")}
                        disabled={updatingStatus || assigningDonor}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {updatingStatus ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTimesCircle />
                        )}
                        <span>বাতিল করুন</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => router.push(`/request/${selectedRequest.id}`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                পাবলিক পেজ দেখুন
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donor Selection Modal */}
      {showDonorModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FaUserCheck className="text-purple-600" />
                রক্তদাতা নির্বাচন করুন
              </h2>
              <button
                onClick={() => {
                  setShowDonorModal(false);
                  setAvailableDonors([]);
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">রোগীর নাম:</p>
                <p className="font-semibold text-slate-900">{selectedRequest.patientName}</p>
                <p className="text-sm text-slate-600 mt-2 mb-1">রক্তের গ্রুপ:</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                    bloodGroupColors[selectedRequest.bloodGroup] || bloodGroupColors["Unknown"]
                  }`}
                >
                  <FaTint className="mr-1" />
                  {selectedRequest.bloodGroup}
                </span>
              </div>

              {loadingDonors ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-slate-600">রক্তদাতা লোড হচ্ছে...</span>
                </div>
              ) : availableDonors.length === 0 ? (
                <div className="text-center py-12">
                  <FaUser className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">কোন উপলব্ধ রক্তদাতা পাওয়া যায়নি</p>
                  <p className="text-slate-500 text-sm mt-2">
                    রক্তের গ্রুপ: <strong>{selectedRequest.bloodGroup}</strong>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">
                    <strong>{availableDonors.length}</strong> জন উপলব্ধ রক্তদাতা পাওয়া গেছে
                  </p>
                  {availableDonors.map((donor) => (
                    <div
                      key={donor.id}
                      className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {donor.name || "নাম নেই"}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                                bloodGroupColors[donor.bloodGroup] || bloodGroupColors["Unknown"]
                              }`}
                            >
                              {donor.bloodGroup}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                            {donor.mobile && (
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-purple-600" />
                                <a
                                  href={`tel:${donor.mobile}`}
                                  className="hover:text-purple-600 hover:underline"
                                >
                                  {donor.mobile}
                                </a>
                              </div>
                            )}
                            {donor.email && (
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-purple-600" />
                                <span>{donor.email}</span>
                              </div>
                            )}
                            {donor.division && (
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-purple-600" />
                                <span>
                                  {donor.division}
                                  {donor.district && `, ${donor.district}`}
                                  {donor.upazila && `, ${donor.upazila}`}
                                </span>
                              </div>
                            )}
                            {donor.totalDonations > 0 && (
                              <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-emerald-600" />
                                <span>{donor.totalDonations} বার রক্তদান করেছেন</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignDonor(donor.email)}
                          disabled={assigningDonor}
                          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                        >
                          {assigningDonor ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>নির্ধারণ করা হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <FaCheck />
                              <span>নির্ধারণ করুন</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setShowDonorModal(false);
                  setAvailableDonors([]);
                }}
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

