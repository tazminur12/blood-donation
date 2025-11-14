"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaPhone,
} from "react-icons/fa";

export default function DisasterReportPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/disaster-reports");
      const data = await res.json();

      if (res.ok && data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      Swal.fire("❌ ত্রুটি", "রিপোর্ট তালিকা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = [];
    const previews = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const under5mb = file.size <= 5 * 1024 * 1024;

      if (!isImage) {
        Swal.fire("ত্রুটি", "শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে", "error");
        continue;
      }
      if (!under5mb) {
        Swal.fire("ত্রুটি", "প্রতি ইমেজ সর্বোচ্চ 5MB হতে পারবে", "error");
        continue;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
      if (validFiles.length >= 5) break;
    }

    setSelectedFiles(validFiles);
    setPreviewUrls(previews);
  };

  const onSubmit = async (formData) => {
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("location", formData.location || "");
      form.append("category", formData.category);
      form.append("priority", formData.priority);
      form.append("evidence", formData.evidence || "");
      form.append("contactInfo", formData.contactInfo || "");
      form.append("status", formData.status || "pending");
      form.append("createdAt", new Date().toISOString());

      // Append files
      selectedFiles.forEach((file) => {
        form.append("attachments", file);
      });

      let res;
      if (editingId) {
        // For update, we'll need to create a PUT endpoint
        res = await fetch(`/api/disaster-reports/${editingId}`, {
          method: "PUT",
          body: form,
        });
      } else {
        res = await fetch("/api/disaster-reports", {
          method: "POST",
          body: form,
        });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "✅ সফল!",
          text: editingId
            ? "রিপোর্ট সফলভাবে আপডেট করা হয়েছে"
            : "নতুন রিপোর্ট সফলভাবে যোগ হয়েছে!",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        loadReports();
      } else {
        throw new Error(data.error || "Failed to save report");
      }
    } catch (error) {
      console.error("Error saving report:", error);
      Swal.fire("❌ ত্রুটি", "রিপোর্ট যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleEdit = (report) => {
    setEditingId(report.id);
    reset({
      title: report.title || "",
      description: report.description || "",
      location: report.location || "",
      category: report.category || "corruption",
      priority: report.priority || "medium",
      evidence: report.evidence || "",
      contactInfo: report.contactInfo || "",
      status: report.status || "pending",
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowFormModal(true);
  };

  const handleView = (report) => {
    setViewingReport(report);
    setShowViewModal(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const statusText = getStatusText(newStatus);
    const result = await Swal.fire({
      title: "স্ট্যাটাস আপডেট",
      text: `আপনি কি নিশ্চিত যে এই রিপোর্টের স্ট্যাটাস "${statusText}" করতে চান?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, আপডেট করুন",
      cancelButtonText: "না, বাতিল করুন",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/disaster-reports/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire("সফল!", `রিপোর্টের স্ট্যাটাস "${statusText}" করা হয়েছে!`, "success");
          loadReports();
        } else {
          throw new Error(data.error || "Failed to update status");
        }
      } catch (error) {
        console.error("Status update error:", error);
        Swal.fire("ত্রুটি!", "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই রিপোর্ট মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/disaster-reports/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে",
            timer: 2000,
            showConfirmButton: false,
          });
          loadReports();
        } else {
          throw new Error(data.error || "Failed to delete report");
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire("❌ ত্রুটি", "রিপোর্ট মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const resetForm = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setEditingId(null);
    setViewingReport(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    reset();
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      !searchTerm ||
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || report.category === filterCategory;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            দুর্নীতি ও অন্যায় রিপোর্ট ব্যবস্থাপনা
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            রিপোর্টের তালিকা দেখুন, যোগ করুন এবং ব্যবস্থাপনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন রিপোর্ট যোগ করুন
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট রিপোর্ট</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">অপেক্ষমান</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">তদন্তাধীন</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.status === "investigating").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">সমাধান হয়েছে</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.status === "resolved").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaSearch className="mr-2 h-4 w-4 text-red-600" />
              অনুসন্ধান
            </label>
            <input
              type="text"
              placeholder="রিপোর্ট খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-red-600" />
              বিভাগ
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="all">সব বিভাগ</option>
              <option value="corruption">দুর্নীতি</option>
              <option value="disaster">দুর্যোগ</option>
              <option value="injustice">অন্যায়</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-red-600" />
              স্ট্যাটাস
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমান</option>
              <option value="investigating">তদন্তাধীন</option>
              <option value="resolved">সমাধান হয়েছে</option>
              <option value="rejected">প্রত্যাখ্যাত</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("all");
                setFilterStatus("all");
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              ফিল্টার রিসেট
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  রিপোর্ট
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  বিভাগ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অগ্রাধিকার
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  স্ট্যাটাস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  কর্ম
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin h-6 w-6 text-red-500 mr-2" />
                      <span className="text-gray-600">রিপোর্ট লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {report.description}
                        </div>
                        {report.location && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {report.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(
                          report.category
                        )}`}
                      >
                        {getCategoryText(report.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                          report.priority
                        )}`}
                      >
                        {getPriorityText(report.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString("bn-BD")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="দেখুন"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(report)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="সম্পাদনা"
                        >
                          <FaEdit />
                        </button>

                        {report.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(report.id, "investigating")
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="তদন্ত শুরু করুন"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(report.id, "rejected")
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="প্রত্যাখ্যান করুন"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}

                        {report.status === "investigating" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(report.id, "resolved")
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="সমাধান হয়েছে"
                          >
                            <FaCheck />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="মুছুন"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    কোনো রিপোর্ট পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "রিপোর্ট সম্পাদনা করুন"
                        : "নতুন রিপোর্ট যোগ করুন"}
                    </h2>
                    <p className="text-red-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-red-200 text-2xl transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaExclamationTriangle className="w-5 h-5 mr-2 text-red-600" />
                  📋 মৌলিক তথ্য
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    শিরোনাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="রিপোর্টের শিরোনাম লিখুন"
                    {...register("title", {
                      required: "শিরোনাম আবশ্যক",
                      minLength: {
                        value: 5,
                        message: "শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে",
                      },
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200 ${
                      errors.title ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিবরণ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    placeholder="বিস্তারিত বিবরণ লিখুন"
                    {...register("description", {
                      required: "বিবরণ আবশ্যক",
                      minLength: {
                        value: 10,
                        message: "বিবরণ কমপক্ষে ১০ অক্ষর হতে হবে",
                      },
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200 ${
                      errors.description ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অবস্থান
                  </label>
                  <input
                    type="text"
                    placeholder="ঘটনার অবস্থান"
                    {...register("location")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Category and Priority */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFileAlt className="w-5 h-5 mr-2 text-blue-600" />
                  📊 বিভাগ ও অগ্রাধিকার
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      বিভাগ <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("category", {
                        required: "বিভাগ আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200 ${
                        errors.category ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="corruption">দুর্নীতি</option>
                      <option value="disaster">দুর্যোগ</option>
                      <option value="injustice">অন্যায়</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অগ্রাধিকার <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("priority", {
                        required: "অগ্রাধিকার আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200 ${
                        errors.priority ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="low">নিম্ন</option>
                      <option value="medium">মাঝারি</option>
                      <option value="high">উচ্চ</option>
                    </select>
                    {errors.priority && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFileAlt className="w-5 h-5 mr-2 text-purple-600" />
                  📝 অতিরিক্ত তথ্য
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    প্রমাণ/সাক্ষ্য
                  </label>
                  <textarea
                    rows="3"
                    placeholder="প্রমাণ বা সাক্ষ্যের বিবরণ (ঐচ্ছিক)"
                    {...register("evidence")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    যোগাযোগের তথ্য
                  </label>
                  <input
                    type="text"
                    placeholder="ফোন নম্বর বা ইমেইল (ঐচ্ছিক)"
                    {...register("contactInfo")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaFileAlt className="w-5 h-5 mr-2 text-green-600" />
                  📷 ছবি আপলোড
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ছবি আপলোড (সর্বোচ্চ ৫টি, প্রতি ছবি ৫MB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  {previewUrls.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {previewUrls.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-full h-24 rounded-md overflow-hidden border"
                        >
                          <img
                            src={src}
                            alt={`attachment-${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaExclamationTriangle className="w-5 h-5 mr-2 text-red-600" />
                  ⚙️ সেটিংস
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🟢 স্ট্যাটাস
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200"
                  >
                    <option value="pending">অপেক্ষমান</option>
                    <option value="investigating">তদন্তাধীন</option>
                    <option value="resolved">সমাধান হয়েছে</option>
                    <option value="rejected">প্রত্যাখ্যাত</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>➕ {editingId ? "আপডেট করুন" : "রিপোর্ট যোগ করুন"}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
                >
                  🔄 বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  রিপোর্টের বিস্তারিত
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    শিরোনাম
                  </label>
                  <p className="text-gray-900 font-medium">{viewingReport.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    বিবরণ
                  </label>
                  <p className="text-gray-900">{viewingReport.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      বিভাগ
                    </label>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        viewingReport.category
                      )}`}
                    >
                      {getCategoryText(viewingReport.category)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      অগ্রাধিকার
                    </label>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        viewingReport.priority
                      )}`}
                    >
                      {getPriorityText(viewingReport.priority)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      স্ট্যাটাস
                    </label>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        viewingReport.status
                      )}`}
                    >
                      {getStatusText(viewingReport.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      তারিখ
                    </label>
                    <p className="text-gray-900">
                      {viewingReport.createdAt
                        ? new Date(viewingReport.createdAt).toLocaleDateString(
                            "bn-BD"
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {viewingReport.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      অবস্থান
                    </label>
                    <p className="text-gray-900">{viewingReport.location}</p>
                  </div>
                )}

                {viewingReport.evidence && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      প্রমাণ/সাক্ষ্য
                    </label>
                    <p className="text-gray-900">{viewingReport.evidence}</p>
                  </div>
                )}

                {viewingReport.contactInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      যোগাযোগের তথ্য
                    </label>
                    <p className="text-gray-900">{viewingReport.contactInfo}</p>
                  </div>
                )}

                {/* Images Display */}
                {viewingReport.images && viewingReport.images.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      সংযুক্ত ছবি
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {viewingReport.images.map((image, index) => {
                        const src = typeof image === "string" ? image : image.url;
                        return (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <img
                              src={src}
                              alt={`${viewingReport.title} - Image ${index + 1}`}
                              className="w-full h-24 object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextElementSibling) {
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }
                              }}
                            />
                            <div
                              className="hidden w-full h-24 bg-gray-100 items-center justify-center"
                              style={{ display: "none" }}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-1">📷</div>
                                <p className="text-xs text-gray-500">
                                  ছবি লোড হয়নি
                                </p>
                              </div>
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs text-gray-600 text-center">
                                ছবি {index + 1}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      সংযুক্ত ফাইল
                    </label>
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">📷</div>
                      <p className="text-sm text-gray-500">
                        কোনো ফাইল সংযুক্ত করা হয়নি
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

