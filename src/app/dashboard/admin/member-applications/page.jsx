"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaSearch,
  FaFilter,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTint,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaTrash,
  FaBriefcase,
  FaGraduationCap,
  FaIdCard,
  FaFacebook,
  FaClock,
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
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function MemberApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
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
      loadApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, filterStatus, filterBloodGroup]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/member-applications?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        let filteredApplications = data.applications || [];

        // Filter by blood group on client side
        if (filterBloodGroup !== "all") {
          filteredApplications = filteredApplications.filter(
            (app) => app.bloodGroup === filterBloodGroup
          );
        }

        setApplications(filteredApplications);
        setStats(data.stats || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "আবেদনসমূহ লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "আবেদনসমূহ লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(true);

      const result = await Swal.fire({
        title: newStatus === "approved" ? "আবেদন অনুমোদন করবেন?" : "আবেদন প্রত্যাখ্যান করবেন?",
        text: "আপনি কি নিশ্চিত?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: newStatus === "approved" ? "#10b981" : "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "হ্যাঁ",
        cancelButtonText: "না",
      });

      if (!result.isConfirmed) {
        setUpdatingStatus(false);
        return;
      }

      const res = await fetch(`/api/member-applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: data.message || "আবেদনের অবস্থা আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
        });
        loadApplications();
        setSelectedApplication(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "আবেদনের অবস্থা আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "আবেদনের অবস্থা আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (applicationId) => {
    try {
      const result = await Swal.fire({
        title: "আবেদন মুছে ফেলবেন?",
        text: "এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
        cancelButtonText: "বাতিল",
      });

      if (!result.isConfirmed) {
        return;
      }

      const res = await fetch(`/api/member-applications/${applicationId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "মুছে ফেলা হয়েছে!",
          text: "আবেদন সফলভাবে মুছে ফেলা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
        });
        loadApplications();
        setSelectedApplication(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "আবেদন মুছে ফেলতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "আবেদন মুছে ফেলতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="text-4xl text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">সদস্যের আবেদনসমূহ</h1>
          <p className="text-gray-600 mt-1">সকল সদস্য আবেদন দেখুন এবং পরিচালনা করুন</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">মোট আবেদন</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <FaUser className="text-3xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">বিচারাধীন</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <FaClock className="text-3xl text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">অনুমোদিত</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
            <FaCheckCircle className="text-3xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">প্রত্যাখ্যাত</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <FaTimesCircle className="text-3xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="নাম, পিতার নাম, ঠিকানা দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value === "") {
                    loadApplications();
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    loadApplications();
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                loadApplications();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">সব অবস্থা</option>
              <option value="pending">বিচারাধীন</option>
              <option value="approved">অনুমোদিত</option>
              <option value="rejected">প্রত্যাখ্যাত</option>
            </select>
            <select
              value={filterBloodGroup}
              onChange={(e) => {
                setFilterBloodGroup(e.target.value);
                loadApplications();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">সব রক্তের গ্রুপ</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  নাম
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  পিতার নাম
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  রক্তের গ্রুপ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অবস্থা
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  কাজ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    কোন আবেদন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{application.fatherName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.bloodGroup && (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                            bloodGroupColors[application.bloodGroup] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {application.bloodGroup}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                          statusColors[application.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {application.status === "pending"
                          ? "বিচারাধীন"
                          : application.status === "approved"
                          ? "অনুমোদিত"
                          : "প্রত্যাখ্যাত"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900"
                          title="বিস্তারিত দেখুন"
                        >
                          <FaEye />
                        </button>
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application.id, "approved")}
                              disabled={updatingStatus}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="অনুমোদন করুন"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, "rejected")}
                              disabled={updatingStatus}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="প্রত্যাখ্যান করুন"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(application.id)}
                          className="text-red-600 hover:text-red-900"
                          title="মুছে ফেলুন"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">আবেদনের বিস্তারিত</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaUser className="text-red-600" />
                    ব্যক্তিগত তথ্য
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">নাম</p>
                      <p className="font-medium">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">পিতার নাম</p>
                      <p className="font-medium">{selectedApplication.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">মাতার নাম</p>
                      <p className="font-medium">{selectedApplication.motherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">জন্ম তারিখ</p>
                      <p className="font-medium">{selectedApplication.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">রক্তের গ্রুপ</p>
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${
                          bloodGroupColors[selectedApplication.bloodGroup] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {selectedApplication.bloodGroup}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ধর্ম</p>
                      <p className="font-medium">{selectedApplication.religion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">জাতীয়তা</p>
                      <p className="font-medium">{selectedApplication.nationality}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    ঠিকানা
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">বর্তমান ঠিকানা</p>
                      <p className="font-medium">{selectedApplication.currentAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">স্থায়ী ঠিকানা</p>
                      <p className="font-medium">{selectedApplication.permanentAddress}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-700 mb-4 mt-6 flex items-center gap-2">
                    <FaBriefcase className="text-red-600" />
                    অন্যান্য তথ্য
                  </h3>
                  <div className="space-y-3">
                    {selectedApplication.birthRegNid && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FaIdCard className="text-red-600" />
                          জন্ম নিবন্ধন/NID নং
                        </p>
                        <p className="font-medium">{selectedApplication.birthRegNid}</p>
                      </div>
                    )}
                    {selectedApplication.occupation && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FaBriefcase className="text-red-600" />
                          পেশা
                        </p>
                        <p className="font-medium">{selectedApplication.occupation}</p>
                      </div>
                    )}
                    {selectedApplication.education && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FaGraduationCap className="text-red-600" />
                          শিক্ষাগত যোগ্যতা
                        </p>
                        <p className="font-medium">{selectedApplication.education}</p>
                      </div>
                    )}
                    {selectedApplication.facebookId && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FaFacebook className="text-blue-600" />
                          ফেসবুক আইডি
                        </p>
                        <p className="font-medium">{selectedApplication.facebookId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">আবেদনের তারিখ</p>
                    <p className="font-medium">{formatDate(selectedApplication.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">অবস্থা</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${
                        statusColors[selectedApplication.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedApplication.status === "pending"
                        ? "বিচারাধীন"
                        : selectedApplication.status === "approved"
                        ? "অনুমোদিত"
                        : "প্রত্যাখ্যাত"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedApplication.status === "pending" && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication.id, "approved");
                    }}
                    disabled={updatingStatus}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    অনুমোদন করুন
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication.id, "rejected");
                    }}
                    disabled={updatingStatus}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    প্রত্যাখ্যান করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

