"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaMapMarkedAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaSearch,
  FaFilter,
  FaBuilding,
  FaCode,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

export default function UnionPage() {
  const { data: session, status } = useSession();
  const [unions, setUnions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUpazila, setFilterUpazila] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    loadUnions();
  }, []);

  const loadUnions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/unions");
      const data = await res.json();

      if (res.ok && data.success) {
        setUnions(data.unions || []);
      }
    } catch (error) {
      console.error("Error loading unions:", error);
      Swal.fire("❌ ত্রুটি", "ইউনিয়নের তালিকা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        upazila: formData.upazila,
        code: formData.code,
        status: formData.status || "Active",
        chairmanName: formData.chairmanName,
        chairmanPhone: formData.chairmanPhone,
        secretaryName: formData.secretaryName,
        secretaryPhone: formData.secretaryPhone,
        officeAddress: formData.officeAddress,
        officePhone: formData.officePhone,
        officeEmail: formData.officeEmail,
        website: formData.website,
        population: formData.population,
        area: formData.area,
        wardCount: formData.wardCount,
        villageCount: formData.villageCount,
        establishmentDate: formData.establishmentDate,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/unions/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/unions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "✅ সফল!",
          text: editingId
            ? "ইউনিয়ন সফলভাবে আপডেট করা হয়েছে"
            : "নতুন ইউনিয়ন সফলভাবে যোগ হয়েছে!",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        loadUnions();
      } else {
        throw new Error(data.error || "Failed to save union");
      }
    } catch (error) {
      console.error("Error saving union:", error);
      Swal.fire("❌ ত্রুটি", "ইউনিয়ন যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleEdit = (union) => {
    setEditingId(union.id);
    reset({
      name: union.name || "",
      description: union.description || "",
      upazila: union.upazila || "",
      code: union.code || "",
      status: union.status || "Active",
      chairmanName: union.chairmanName || "",
      chairmanPhone: union.chairmanPhone || "",
      secretaryName: union.secretaryName || "",
      secretaryPhone: union.secretaryPhone || "",
      officeAddress: union.officeAddress || "",
      officePhone: union.officePhone || "",
      officeEmail: union.officeEmail || "",
      website: union.website || "",
      population: union.population || "",
      area: union.area || "",
      wardCount: union.wardCount || "",
      villageCount: union.villageCount || "",
      establishmentDate: union.establishmentDate || "",
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ইউনিয়ন মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/unions/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "ইউনিয়ন সফলভাবে মুছে ফেলা হয়েছে",
            timer: 2000,
            showConfirmButton: false,
          });
          loadUnions();
        } else {
          throw new Error(data.error || "Failed to delete union");
        }
      } catch (error) {
        console.error("Error deleting union:", error);
        Swal.fire("❌ ত্রুটি", "ইউনিয়ন মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const resetForm = () => {
    setShowFormModal(false);
    setEditingId(null);
    reset();
  };

  // Filter unions
  const filteredUnions = unions.filter((union) => {
    const matchesSearch =
      !searchTerm ||
      union.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      union.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      union.upazila?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      union.code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUpazila =
      filterUpazila === "all" || union.upazila === filterUpazila;

    const matchesStatus =
      filterStatus === "all" || union.status === filterStatus;

    return matchesSearch && matchesUpazila && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const upazilas = [
    "বগুড়া সদর",
    "শেরপুর",
    "ধুনট",
    "সারিয়াকান্দি",
    "শিবগঞ্জ",
    "কাহালু",
    "নন্দীগ্রাম",
    "আদমদীঘি",
    "দুপচাঁচিয়া",
    "গাবতলী",
    "সোনাতলা",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ইউনিয়ন পরিষদ ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-slate-600">
            ইউনিয়নের তালিকা দেখুন, যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন ইউনিয়ন যোগ করুন
        </button>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaSearch className="mr-2 h-4 w-4 text-emerald-600" />
              অনুসন্ধান
            </label>
            <input
              type="text"
              placeholder="ইউনিয়ন নাম, উপজেলা বা কোড..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-emerald-600" />
              উপজেলা
            </label>
            <select
              value={filterUpazila}
              onChange={(e) => setFilterUpazila(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="all">সব উপজেলা</option>
              {upazilas.map((upazila) => (
                <option key={upazila} value={upazila}>
                  {upazila}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-emerald-600" />
              স্ট্যাটাস
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="Active">সক্রিয়</option>
              <option value="Inactive">নিষ্ক্রিয়</option>
              <option value="Pending">অপেক্ষমান</option>
            </select>
          </div>
        </div>
      </div>

      {/* Unions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredUnions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaMapMarkedAlt className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো ইউনিয়ন পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম ইউনিয়ন যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUnions.map((union) => (
            <div
              key={union.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {union.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        union.status
                      )}`}
                    >
                      {union.status === "Active"
                        ? "সক্রিয়"
                        : union.status === "Inactive"
                        ? "নিষ্ক্রিয়"
                        : "অপেক্ষমান"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                    {union.upazila && (
                      <div className="flex items-center">
                        <FaMapMarkedAlt className="text-emerald-600 mr-2 flex-shrink-0" />
                        <span>{union.upazila}</span>
                      </div>
                    )}
                    {union.code && (
                      <div className="flex items-center">
                        <FaCode className="text-blue-600 mr-2 flex-shrink-0" />
                        <span>কোড: {union.code}</span>
                      </div>
                    )}
                    {union.chairmanName && (
                      <div className="flex items-center">
                        <FaUsers className="text-purple-600 mr-2 flex-shrink-0" />
                        <span>চেয়ারম্যান: {union.chairmanName}</span>
                      </div>
                    )}
                    {union.officePhone && (
                      <div className="flex items-center">
                        <FaPhone className="text-green-600 mr-2 flex-shrink-0" />
                        <span>{union.officePhone}</span>
                      </div>
                    )}
                  </div>
                  {union.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {union.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {union.population && (
                      <span>👥 জনসংখ্যা: {union.population}</span>
                    )}
                    {union.area && <span>📏 আয়তন: {union.area} বর্গ কিমি</span>}
                    {union.wardCount && (
                      <span>🏘️ ওয়ার্ড: {union.wardCount}</span>
                    )}
                    {union.villageCount && (
                      <span>🏘️ গ্রাম: {union.villageCount}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(union)}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <FaEdit className="h-3 w-3" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(union.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    <FaTrash className="h-3 w-3" />
                    মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaMapMarkedAlt className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "ইউনিয়ন সম্পাদনা করুন"
                        : "নতুন ইউনিয়ন যোগ করুন"}
                    </h2>
                    <p className="text-emerald-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-emerald-200 text-2xl transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📋 মৌলিক তথ্য
                </h3>

                {/* Union Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏛️ ইউনিয়ন নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: বগুড়া সদর ইউনিয়ন, শেরপুর ইউনিয়ন"
                    {...register("name", {
                      required: "ইউনিয়ন নাম আবশ্যক",
                      minLength: {
                        value: 3,
                        message: "ইউনিয়ন নাম কমপক্ষে ৩ অক্ষর হতে হবে",
                      },
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200 ${
                      errors.name ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 ইউনিয়নের বিবরণ
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ইউনিয়নের সংক্ষিপ্ত বিবরণ লিখুন। যেমন: অবস্থান, বিশেষত্ব, ইতিহাস ইত্যাদি।"
                    {...register("description")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                  />
                </div>

                {/* Upazila and Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📍 উপজেলা <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("upazila", {
                        required: "উপজেলা নির্বাচন আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200 ${
                        errors.upazila ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="">-- উপজেলা নির্বাচন করুন --</option>
                      {upazilas.map((upazila) => (
                        <option key={upazila} value={upazila}>
                          {upazila}
                        </option>
                      ))}
                    </select>
                    {errors.upazila && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.upazila.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔢 ইউনিয়ন কোড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: 123456"
                      {...register("code", {
                        required: "ইউনিয়ন কোড আবশ্যক",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "শুধুমাত্র সংখ্যা ব্যবহার করুন",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200 ${
                        errors.code ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.code && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.code.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Leadership Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  👥 নেতৃত্ব
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👨‍💼 চেয়ারম্যানের নাম
                    </label>
                    <input
                      type="text"
                      placeholder="চেয়ারম্যানের পূর্ণ নাম"
                      {...register("chairmanName")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 চেয়ারম্যানের ফোন
                    </label>
                    <input
                      type="tel"
                      placeholder="উদাহরণ: 01712345678"
                      {...register("chairmanPhone")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👨‍💼 সচিবের নাম
                    </label>
                    <input
                      type="text"
                      placeholder="সচিবের পূর্ণ নাম"
                      {...register("secretaryName")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 সচিবের ফোন
                    </label>
                    <input
                      type="tel"
                      placeholder="উদাহরণ: 01712345678"
                      {...register("secretaryPhone")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Office Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🏢 অফিসের তথ্য
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 অফিসের ঠিকানা
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ইউনিয়ন পরিষদ অফিসের সম্পূর্ণ ঠিকানা"
                    {...register("officeAddress")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 অফিস ফোন
                    </label>
                    <input
                      type="tel"
                      placeholder="উদাহরণ: 051-123456"
                      {...register("officePhone")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 অফিস ইমেইল
                    </label>
                    <input
                      type="email"
                      placeholder="উদাহরণ: union@example.com"
                      {...register("officeEmail")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌐 ওয়েবসাইট
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.example.com"
                    {...register("website")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Demographics Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📊 জনসংখ্যা ও ভূগোল
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👥 জনসংখ্যা
                    </label>
                    <input
                      type="number"
                      placeholder="উদাহরণ: 25000"
                      {...register("population")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📏 আয়তন (বর্গ কিমি)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="উদাহরণ: 15.5"
                      {...register("area")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏘️ ওয়ার্ড সংখ্যা
                    </label>
                    <input
                      type="number"
                      placeholder="উদাহরণ: 9"
                      {...register("wardCount")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏘️ গ্রাম সংখ্যা
                    </label>
                    <input
                      type="number"
                      placeholder="উদাহরণ: 25"
                      {...register("villageCount")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 প্রতিষ্ঠার তারিখ
                  </label>
                  <input
                    type="date"
                    {...register("establishmentDate")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Status Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ⚙️ সেটিংস
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🟢 স্ট্যাটাস
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition duration-200"
                  >
                    <option value="Active">সক্রিয়</option>
                    <option value="Inactive">নিষ্ক্রিয়</option>
                    <option value="Pending">অপেক্ষমান</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>➕ {editingId ? "আপডেট করুন" : "ইউনিয়ন যোগ করুন"}</>
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
    </div>
  );
}

