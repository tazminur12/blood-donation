"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaBriefcase,
  FaSearch,
  FaSpinner,
  FaFilter,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaTint,
  FaUserTie,
  FaHandsHelping,
} from "react-icons/fa";

const statusLabels = {
  upcoming: "আসন্ন",
  active: "সক্রিয়",
  completed: "সম্পন্ন",
  cancelled: "বাতিল",
};

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function CampaignsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    active: 0,
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

    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Load campaigns if user is authenticated
    if (status === "authenticated") {
      loadCampaigns();
    }
  }, [session, status, router]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/donor/campaigns");
      const data = await res.json();
      
      if (res.ok) {
        console.log("Campaigns loaded:", data.campaigns?.length || 0);
        setCampaigns(data.campaigns || []);
        setStats(data.stats || {
          total: 0,
          upcoming: 0,
          active: 0,
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
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || data.message || "ক্যাম্পেইন লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ক্যাম্পেইন লোড করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.organizerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
    
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

  const getProgressPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Show loading while session is loading or campaigns are being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "ক্যাম্পেইন লোড হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (redirect will happen)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaBriefcase className="text-purple-600" />
            ক্যাম্পেইন
          </h1>
          <p className="text-slate-600 mt-1">
            সমস্ত রক্তদান ক্যাম্পেইনের তথ্য দেখুন
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট ক্যাম্পেইন</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">আসন্ন</p>
          <p className="text-2xl font-bold text-blue-700">{stats.upcoming}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">সক্রিয়</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">সম্পন্ন</p>
          <p className="text-2xl font-bold text-slate-700">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">ফিল্টার করা</p>
          <p className="text-2xl font-bold text-sky-700">{filteredCampaigns.length}</p>
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
              placeholder="ক্যাম্পেইন নাম, বিবরণ, অবস্থান বা আয়োজকের নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব অবস্থা</option>
              <option value="upcoming">আসন্ন</option>
              <option value="active">সক্রিয়</option>
              <option value="completed">সম্পন্ন</option>
              <option value="cancelled">বাতিল</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <FaBriefcase className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">কোন ক্যাম্পেইন পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Campaign Image */}
              {campaign.image ? (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <FaBriefcase className="text-6xl text-purple-400" />
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Title and Status */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {campaign.title || "ক্যাম্পেইন নাম নেই"}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      statusColors[campaign.status] || statusColors["upcoming"]
                    }`}
                  >
                    {statusLabels[campaign.status] || campaign.status}
                  </span>
                </div>

                {/* Description */}
                {campaign.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {campaign.description}
                  </p>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaMapMarkerAlt className="text-purple-600" />
                  <span>
                    {campaign.location || 
                     (campaign.division && `${campaign.division}${campaign.district ? `, ${campaign.district}` : ''}${campaign.upazila ? `, ${campaign.upazila}` : ''}`) ||
                     "নির্ধারিত নয়"}
                  </span>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FaCalendarAlt className="text-purple-600" />
                    <span>শুরু: {formatDate(campaign.startDate)}</span>
                  </div>
                  {campaign.endDate && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaClock className="text-purple-600" />
                      <span>শেষ: {formatDate(campaign.endDate)}</span>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">রক্তদাতা</span>
                      <span className="font-semibold">
                        {campaign.registeredDonors || 0} / {campaign.targetDonors || 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${getProgressPercentage(
                            campaign.registeredDonors || 0,
                            campaign.targetDonors || 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">রক্ত</span>
                      <span className="font-semibold">
                        {campaign.collectedBloodUnits || 0} / {campaign.targetBloodUnits || 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${getProgressPercentage(
                            campaign.collectedBloodUnits || 0,
                            campaign.targetBloodUnits || 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Organizer */}
                {campaign.organizerName && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-200">
                    <FaUserTie className="text-purple-600" />
                    <span>{campaign.organizerName}</span>
                  </div>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => setSelectedCampaign(campaign)}
                  className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <FaEye />
                  <span>বিস্তারিত দেখুন</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">ক্যাম্পেইনের বিস্তারিত তথ্য</h2>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {selectedCampaign.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={selectedCampaign.image}
                    alt={selectedCampaign.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {selectedCampaign.title || "ক্যাম্পেইন নাম নেই"}
                </h3>
                {selectedCampaign.description && (
                  <p className="text-slate-600">{selectedCampaign.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">শুরুর তারিখ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-600" />
                    {formatDateTime(selectedCampaign.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">শেষ তারিখ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaClock className="text-purple-600" />
                    {formatDateTime(selectedCampaign.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">অবস্থা</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      statusColors[selectedCampaign.status] || statusColors["upcoming"]
                    }`}
                  >
                    {statusLabels[selectedCampaign.status] || selectedCampaign.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">আয়োজক</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaUserTie className="text-purple-600" />
                    {selectedCampaign.organizerName || selectedCampaign.organizerEmail || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">অবস্থান</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-purple-600" />
                    {selectedCampaign.location || 
                     (selectedCampaign.division && `${selectedCampaign.division}${selectedCampaign.district ? `, ${selectedCampaign.district}` : ''}${selectedCampaign.upazila ? `, ${selectedCampaign.upazila}` : ''}`) ||
                     "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">স্বেচ্ছাসেবী</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaHandsHelping className="text-purple-600" />
                    {selectedCampaign.volunteerCount || 0} জন
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">রক্তদাতা অগ্রগতি</p>
                    <span className="text-sm text-slate-600">
                      {selectedCampaign.registeredDonors || 0} / {selectedCampaign.targetDonors || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${getProgressPercentage(
                          selectedCampaign.registeredDonors || 0,
                          selectedCampaign.targetDonors || 0
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {getProgressPercentage(
                      selectedCampaign.registeredDonors || 0,
                      selectedCampaign.targetDonors || 0
                    )}% সম্পন্ন
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">রক্ত সংগ্রহ অগ্রগতি</p>
                    <span className="text-sm text-slate-600">
                      {selectedCampaign.collectedBloodUnits || 0} / {selectedCampaign.targetBloodUnits || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-rose-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${getProgressPercentage(
                          selectedCampaign.collectedBloodUnits || 0,
                          selectedCampaign.targetBloodUnits || 0
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {getProgressPercentage(
                      selectedCampaign.collectedBloodUnits || 0,
                      selectedCampaign.targetBloodUnits || 0
                    )}% সম্পন্ন
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
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
          <strong>দ্রষ্টব্য:</strong> এই পৃষ্ঠায় সমস্ত রক্তদান ক্যাম্পেইনের তথ্য দেখানো হয়েছে। আপনি অবস্থা, 
          তারিখ এবং অন্যান্য ফিল্টার ব্যবহার করে ক্যাম্পেইন খুঁজে পেতে পারেন।
        </p>
      </div>
    </div>
  );
}

