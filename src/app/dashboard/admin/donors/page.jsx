"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaUser,
  FaUsers,
  FaSearch,
  FaSpinner,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTint,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
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
  "Unknown": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function DonorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    byBloodGroup: {},
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

    // Only load donors if user is admin
    if (session?.user?.role === "admin") {
      loadDonors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/donors");
      const data = await res.json();
      
      if (res.ok) {
        console.log("Donors loaded:", data.donors?.length || 0);
        setDonors(data.donors || []);
        setStats(data.stats || {
          total: 0,
          available: 0,
          unavailable: 0,
          byBloodGroup: {},
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
            text: data.error || data.message || "রক্তদাতা লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading donors:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "রক্তদাতা লোড করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.mobile?.includes(searchTerm) ||
      donor.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBloodGroup = 
      filterBloodGroup === "all" || donor.bloodGroup === filterBloodGroup;
    
    const matchesAvailability = 
      filterAvailability === "all" || 
      (filterAvailability === "available" && donor.isAvailable) ||
      (filterAvailability === "unavailable" && !donor.isAvailable);
    
    return matchesSearch && matchesBloodGroup && matchesAvailability;
  });

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Show loading while session is loading or donors are being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-rose-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "রক্তদাতা লোড হচ্ছে..."}
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
            <FaUser className="text-rose-600" />
            রক্তদাতা ব্যবস্থাপনা
          </h1>
          <p className="text-slate-600 mt-1">
            সমস্ত রক্তদাতার তথ্য দেখুন এবং পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট রক্তদাতা</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">সক্রিয়</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.available}</p>
        </div>
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">নিষ্ক্রিয়</p>
          <p className="text-2xl font-bold text-rose-700">{stats.unavailable}</p>
        </div>
        <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">ফিল্টার করা</p>
          <p className="text-2xl font-bold text-sky-700">{filteredDonors.length}</p>
        </div>
      </div>

      {/* Blood Group Stats */}
      {Object.keys(stats.byBloodGroup).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">রক্তের গ্রুপ অনুযায়ী</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {bloodGroups.map((bg) => {
              const count = stats.byBloodGroup[bg] || 0;
              return (
                <div
                  key={bg}
                  className={`text-center p-2 rounded-lg border ${
                    bloodGroupColors[bg] || bloodGroupColors["Unknown"]
                  }`}
                >
                  <p className="text-xs font-semibold">{bg}</p>
                  <p className="text-lg font-bold mt-1">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, ইমেইল, মোবাইল বা রক্তের গ্রুপ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব রক্তের গ্রুপ</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব অবস্থা</option>
              <option value="available">সক্রিয়</option>
              <option value="unavailable">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  রক্তদাতা
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  যোগাযোগ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  রক্তের গ্রুপ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  অবস্থান
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
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FaUsers className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">কোন রক্তদাতা পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {donor.image ? (
                          <img
                            src={donor.image}
                            alt={donor.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                            <span className="text-rose-700 font-semibold text-sm">
                              {getInitials(donor.name)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">
                            {donor.name || "নাম নেই"}
                          </p>
                          {donor.totalDonations > 0 && (
                            <p className="text-xs text-slate-500">
                              {donor.totalDonations} বার রক্তদান
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {donor.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaEnvelope className="text-xs" />
                            <span>{donor.email}</span>
                          </div>
                        )}
                        {donor.mobile && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaPhone className="text-xs" />
                            <span>{donor.mobile}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donor.bloodGroup ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            bloodGroupColors[donor.bloodGroup] || bloodGroupColors["Unknown"]
                          }`}
                        >
                          <FaTint className="mr-1" />
                          {donor.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {donor.division && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaMapMarkerAlt className="text-xs" />
                            <span>{donor.division}</span>
                          </div>
                        )}
                        {donor.district && (
                          <p className="text-xs text-slate-500 ml-5">{donor.district}</p>
                        )}
                        {donor.upazila && (
                          <p className="text-xs text-slate-500 ml-5">{donor.upazila}</p>
                        )}
                        {!donor.division && !donor.district && !donor.upazila && (
                          <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donor.isAvailable ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <FaCheckCircle className="mr-1" />
                          সক্রিয়
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                          <FaTimesCircle className="mr-1" />
                          নিষ্ক্রিয়
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDonor(donor)}
                        className="p-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition"
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

      {/* Donor Detail Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">রক্তদাতার বিস্তারিত তথ্য</h2>
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                {selectedDonor.image ? (
                  <img
                    src={selectedDonor.image}
                    alt={selectedDonor.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-rose-700 font-semibold text-xl">
                      {getInitials(selectedDonor.name)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedDonor.name || "নাম নেই"}
                  </h3>
                  {selectedDonor.bloodGroup && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border mt-2 ${
                        bloodGroupColors[selectedDonor.bloodGroup] || bloodGroupColors["Unknown"]
                      }`}
                    >
                      <FaTint className="mr-1" />
                      {selectedDonor.bloodGroup}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">ইমেইল</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaEnvelope className="text-rose-600" />
                    {selectedDonor.email || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">মোবাইল</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaPhone className="text-rose-600" />
                    {selectedDonor.mobile || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">বিভাগ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-rose-600" />
                    {selectedDonor.division || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">জেলা</p>
                  <p className="font-medium text-slate-900">
                    {selectedDonor.district || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">উপজেলা</p>
                  <p className="font-medium text-slate-900">
                    {selectedDonor.upazila || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">অবস্থা</p>
                  {selectedDonor.isAvailable ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <FaCheckCircle className="mr-1" />
                      সক্রিয়
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                      <FaTimesCircle className="mr-1" />
                      নিষ্ক্রিয়
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">মোট রক্তদান</p>
                  <p className="font-medium text-slate-900">
                    {selectedDonor.totalDonations || 0} বার
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">শেষ রক্তদান</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-rose-600" />
                    {formatDate(selectedDonor.lastDonation)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">নিবন্ধনের তারিখ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-rose-600" />
                    {formatDate(selectedDonor.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDonor(null)}
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
          <strong>দ্রষ্টব্য:</strong> এই পৃষ্ঠায় সমস্ত রক্তদাতার তথ্য দেখানো হয়েছে। আপনি রক্তের গ্রুপ, 
          অবস্থা এবং অন্যান্য ফিল্টার ব্যবহার করে রক্তদাতা খুঁজে পেতে পারেন।
        </p>
      </div>
    </div>
  );
}

