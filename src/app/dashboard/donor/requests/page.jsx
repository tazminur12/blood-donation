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
  FaPlus,
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

export default function BloodRequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    fulfilled: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [filterStatus, setFilterStatus] = useState(""); // Empty = default to active/pending requests
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [filterDivision, setFilterDivision] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [locationData, setLocationData] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form state for creating request
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    units: 1,
    hospital: "",
    address: "",
    division: "",
    district: "",
    upazila: "",
    contactPerson: "",
    contactNumber: "",
    urgency: "normal",
    description: "",
    requiredDate: "",
  });

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadLocationData();
      loadRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const loadLocationData = async () => {
    try {
      const res = await fetch("/assets/AllDivision.json");
      const data = await res.json();
      setLocationData(data);
      console.log("Location data loaded:", data?.Bangladesh?.length, "divisions");
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
      // Send status filter - if "all", API will not filter by status
      if (filterStatus === "all") {
        params.append("status", "all");
      } else if (filterStatus) {
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

      const res = await fetch(`/api/donor/requests?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setRequests(data.requests || []);
        setStats(data.stats || {
          total: 0,
          pending: 0,
          fulfilled: 0,
        });
      } else {
        console.error("Error loading requests:", data);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "রক্তের অনুরোধ লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
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

  // Get available divisions, districts, and upazilas
  const getDivisions = () => {
    if (!locationData) return [];
    return locationData.Bangladesh.map(div => div.Division).sort();
  };

  const getDistricts = (divisionName = null) => {
    if (!locationData || !locationData.Bangladesh) {
      console.log("Location data not loaded yet");
      return [];
    }
    const division = divisionName || filterDivision;
    if (division === "all" || !division) {
      return [];
    }
    const divisionObj = locationData.Bangladesh.find(d => d.Division === division);
    if (!divisionObj) {
      console.log("Division not found:", division);
      return [];
    }
    if (!divisionObj.Districts) {
      console.log("Districts not found for division:", division);
      return [];
    }
    const districts = divisionObj.Districts.map(dist => dist.District).filter(Boolean).sort();
    console.log("Found districts for", division, ":", districts.length);
    return districts;
  };

  const getUpazilas = (divisionName = null, districtName = null) => {
    if (!locationData) return [];
    const division = divisionName || filterDivision;
    const district = districtName || filterDistrict;
    if (division === "all" || !division || district === "all" || !district) return [];
    const divisionObj = locationData.Bangladesh.find(d => d.Division === division);
    if (!divisionObj) return [];
    const districtObj = divisionObj.Districts.find(d => d.District === district);
    if (!districtObj) return [];
    return districtObj.Upazilas.sort();
  };

  // Reset filters when division changes
  useEffect(() => {
    if (filterDivision === "all") {
      setFilterDistrict("all");
    } else if (filterDivision && locationData) {
      // When a division is selected, reset district to "all" to show all districts
      setFilterDistrict("all");
    }
  }, [filterDivision, locationData]);

  // Reload requests when filters change
  useEffect(() => {
    if (status === "authenticated") {
      loadRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBloodGroup, filterStatus, filterUrgency, filterDivision, filterDistrict]);

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

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.patientName || !formData.bloodGroup || !formData.contactNumber) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "রোগীর নাম, রক্তের গ্রুপ এবং যোগাযোগের নম্বর প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setCreateLoading(true);
      const res = await fetch("/api/donor/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "রক্তের অনুরোধ সফলভাবে তৈরি করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          setShowCreateModal(false);
          setFormData({
            patientName: "",
            bloodGroup: "",
            units: 1,
            hospital: "",
            address: "",
            division: "",
            district: "",
            upazila: "",
            contactPerson: "",
            contactNumber: "",
            urgency: "normal",
            description: "",
            requiredDate: "",
          });
          loadRequests();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "রক্তের অনুরোধ তৈরি করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error creating request:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "রক্তের অনুরোধ তৈরি করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadRequests();
  };

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaTint className="text-rose-600" />
            রক্তের অনুরোধ
          </h1>
          <p className="text-slate-600 mt-1">
            রক্তের অনুরোধ দেখুন এবং নতুন অনুরোধ তৈরি করুন
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
        >
          <FaPlus />
          <span>নতুন অনুরোধ</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">মোট অনুরোধ</p>
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
                  placeholder="রোগীর নাম, হাসপাতাল, ঠিকানা খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
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

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">সক্রিয় অনুরোধ</option>
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
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
              ফিল্টার পরিবর্তন করুন বা নতুন অনুরোধ তৈরি করুন
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
                        <div className="flex items-center gap-3 mb-2">
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
                              <FaHospital className="text-sky-600" />
                              <span>{request.hospital}</span>
                            </div>
                          )}
                          {request.division && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaMapMarkerAlt className="text-sky-600" />
                              <span>
                                {request.division}
                                {request.district && `, ${request.district}`}
                                {request.upazila && `, ${request.upazila}`}
                              </span>
                            </div>
                          )}
                          {request.contactPerson && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaUser className="text-sky-600" />
                              <span>{request.contactPerson}</span>
                            </div>
                          )}
                          {request.contactNumber && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaPhone className="text-sky-600" />
                              <a
                                href={`tel:${request.contactNumber}`}
                                className="text-sky-600 hover:text-sky-700 hover:underline"
                              >
                                {request.contactNumber}
                              </a>
                            </div>
                          )}
                          {request.requiredDate && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaCalendarAlt className="text-sky-600" />
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

                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition"
                        >
                          <FaEye />
                          <span>বিস্তারিত</span>
                        </button>
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                <div>
                  <p className="text-sm text-slate-600 mb-1">রোগীর নাম</p>
                  <p className="font-semibold text-slate-900">{selectedRequest.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">রক্তের গ্রুপ</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      bloodGroupColors[selectedRequest.bloodGroup] || bloodGroupColors["Unknown"]
                    }`}
                  >
                    <FaTint className="mr-1" />
                    {selectedRequest.bloodGroup}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">প্রয়োজনীয় ইউনিট</p>
                  <p className="font-semibold text-slate-900">{selectedRequest.units} ইউনিট</p>
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
                      className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
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
                      অপেক্ষমান
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
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              {selectedRequest.contactNumber && (
                <a
                  href={`tel:${selectedRequest.contactNumber}`}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                >
                  <FaPhone />
                  <span>কল করুন</span>
                </a>
              )}
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

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">নতুন রক্তের অনুরোধ</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    রোগীর নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="রোগীর নাম"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    রক্তের গ্রুপ <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    প্রয়োজনীয় ইউনিট <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) || 1 })}
                    required
                    min={1}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    জরুরিতা
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="normal">সাধারণ</option>
                    <option value="urgent">জরুরী</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    হাসপাতাল
                  </label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="হাসপাতালের নাম"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    প্রয়োজনীয় তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.requiredDate}
                    onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    বিভাগ
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => {
                      setFormData({ ...formData, division: e.target.value, district: "", upazila: "" });
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {getDivisions().map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    জেলা
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => {
                      setFormData({ ...formData, district: e.target.value, upazila: "" });
                    }}
                    disabled={!formData.division}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {getDistricts(formData.division).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    উপজেলা
                  </label>
                  <select
                    value={formData.upazila}
                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                    disabled={!formData.district}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {getUpazilas(formData.division, formData.district).map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ঠিকানা
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="বিস্তারিত ঠিকানা"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    যোগাযোগকারী
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="যোগাযোগকারীর নাম"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    যোগাযোগের নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    বিবরণ
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="অতিরিক্ত তথ্য বা বিবরণ"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      তৈরি হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      অনুরোধ তৈরি করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

