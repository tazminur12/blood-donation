"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaGlobe,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

export default function EservicePage() {
  const { data: session, status } = useSession();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/esheba");
      const data = await res.json();

      if (res.ok && data.success) {
        setServices(data.esheba || []);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      Swal.fire("❌ ত্রুটি", "ই-সেবার তালিকা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        status: formData.status || "Active",
        priority: formData.priority || "Normal",
        websiteUrl: formData.websiteUrl,
        applicationUrl: formData.applicationUrl,
        requirements: formData.requirements,
        processingTime: formData.processingTime,
        fees: formData.fees,
        contactInfo: formData.contactInfo,
        officeHours: formData.officeHours,
        location: formData.location,
        documents: formData.documents,
        instructions: formData.instructions,
        benefits: formData.benefits,
        eligibility: formData.eligibility,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/esheba/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/esheba", {
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
            ? "ই-সেবা সফলভাবে আপডেট করা হয়েছে"
            : "নতুন ই-সেবা সফলভাবে যোগ হয়েছে!",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        loadServices();
      } else {
        throw new Error(data.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      Swal.fire("❌ ত্রুটি", "ই-সেবা যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    reset({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "",
      subCategory: service.subCategory || "",
      status: service.status || "Active",
      priority: service.priority || "Normal",
      websiteUrl: service.websiteUrl || "",
      applicationUrl: service.applicationUrl || "",
      requirements: service.requirements || "",
      processingTime: service.processingTime || "",
      fees: service.fees || "",
      contactInfo: service.contactInfo || "",
      officeHours: service.officeHours || "",
      location: service.location || "",
      documents: service.documents || "",
      instructions: service.instructions || "",
      benefits: service.benefits || "",
      eligibility: service.eligibility || "",
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ই-সেবা মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/esheba/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "ই-সেবা সফলভাবে মুছে ফেলা হয়েছে",
            timer: 2000,
            showConfirmButton: false,
          });
          loadServices();
        } else {
          throw new Error(data.error || "Failed to delete service");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        Swal.fire("❌ ত্রুটি", "ই-সেবা মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const resetForm = () => {
    setShowFormModal(false);
    setEditingId(null);
    reset();
  };

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !searchTerm ||
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || service.category === filterCategory;

    const matchesStatus =
      filterStatus === "all" || service.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Coming Soon":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Featured":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ই-সেবা ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-slate-600">
            ই-সেবার তালিকা দেখুন, যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন ই-সেবা যোগ করুন
        </button>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaSearch className="mr-2 h-4 w-4 text-blue-600" />
              অনুসন্ধান
            </label>
            <input
              type="text"
              placeholder="সেবার নাম, বিবরণ বা ক্যাটাগরি..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-blue-600" />
              ক্যাটাগরি
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">সব ক্যাটাগরি</option>
              <option value="নাগরিক সংক্রান্ত সেবা">নাগরিক সংক্রান্ত সেবা</option>
              <option value="ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা">ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা</option>
              <option value="আর্থিক ও ব্যাংকিং সেবা">আর্থিক ও ব্যাংকিং সেবা</option>
              <option value="শিক্ষা সংক্রান্ত সেবা">শিক্ষা সংক্রান্ত সেবা</option>
              <option value="স্বাস্থ্য সংক্রান্ত সেবা">স্বাস্থ্য সংক্রান্ত সেবা</option>
              <option value="অন্যান্য গুরুত্বপূর্ণ সেবা">অন্যান্য গুরুত্বপূর্ণ সেবা</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-blue-600" />
              স্ট্যাটাস
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="Active">সক্রিয়</option>
              <option value="Inactive">নিষ্ক্রিয়</option>
              <option value="Maintenance">রক্ষণাবেক্ষণ</option>
              <option value="Coming Soon">শীঘ্রই আসছে</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaGlobe className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো ই-সেবা পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম ই-সেবা যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {service.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status === "Active"
                        ? "সক্রিয়"
                        : service.status === "Inactive"
                        ? "নিষ্ক্রিয়"
                        : service.status === "Maintenance"
                        ? "রক্ষণাবেক্ষণ"
                        : "শীঘ্রই আসছে"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                        service.priority
                      )}`}
                    >
                      {service.priority === "Urgent"
                        ? "জরুরি"
                        : service.priority === "High"
                        ? "উচ্চ"
                        : service.priority === "Featured"
                        ? "বৈশিষ্ট্যযুক্ত"
                        : "সাধারণ"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-semibold">ক্যাটাগরি:</span>{" "}
                    {service.category}
                    {service.subCategory && (
                      <> | {service.subCategory}</>
                    )}
                  </p>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {service.processingTime && (
                      <span>⏱️ {service.processingTime}</span>
                    )}
                    {service.fees && <span>💰 {service.fees}</span>}
                    {service.location && <span>📍 {service.location}</span>}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(service)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    <FaEdit className="h-3 w-3" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaGlobe className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "ই-সেবা সম্পাদনা করুন"
                        : "নতুন ই-সেবা যোগ করুন"}
                    </h2>
                    <p className="text-blue-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-blue-200 text-2xl transition"
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

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 সেবার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: জাতীয় পরিচয়পত্র আবেদন, জন্ম নিবন্ধন, পাসপোর্ট আবেদন"
                    {...register("title", {
                      required: "সেবার নাম আবশ্যক",
                      minLength: {
                        value: 3,
                        message: "সেবার নাম কমপক্ষে ৩ অক্ষর হতে হবে",
                      },
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                      errors.title ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 সেবার বিস্তারিত বিবরণ{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    placeholder="সেবার বিস্তারিত বিবরণ লিখুন। যেমন: কীভাবে আবেদন করতে হবে, কী কী কাগজপত্র লাগবে, কত দিন সময় লাগবে ইত্যাদি।"
                    {...register("description", {
                      required: "বিস্তারিত বিবরণ আবশ্যক",
                      minLength: {
                        value: 10,
                        message: "বিস্তারিত বিবরণ কমপক্ষে ১০ অক্ষর হতে হবে",
                      },
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                      errors.description ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Category and Sub-Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📂 মূল ক্যাটাগরি <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("category", {
                        required: "ক্যাটাগরি নির্বাচন আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.category ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="">-- ক্যাটাগরি নির্বাচন করুন --</option>
                      <option value="নাগরিক সংক্রান্ত সেবা">
                        নাগরিক সংক্রান্ত সেবা
                      </option>
                      <option value="ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা">
                        ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা
                      </option>
                      <option value="আর্থিক ও ব্যাংকিং সেবা">
                        আর্থিক ও ব্যাংকিং সেবা
                      </option>
                      <option value="শিক্ষা সংক্রান্ত সেবা">
                        শিক্ষা সংক্রান্ত সেবা
                      </option>
                      <option value="স্বাস্থ্য সংক্রান্ত সেবা">
                        স্বাস্থ্য সংক্রান্ত সেবা
                      </option>
                      <option value="অন্যান্য গুরুত্বপূর্ণ সেবা">
                        অন্যান্য গুরুত্বপূর্ণ সেবা
                      </option>
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📁 উপ-ক্যাটাগরি
                    </label>
                    <select
                      {...register("subCategory")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    >
                      <option value="">-- উপ-ক্যাটাগরি নির্বাচন করুন --</option>
                      <option value="জাতীয় পরিচয়পত্র">জাতীয় পরিচয়পত্র</option>
                      <option value="জন্ম নিবন্ধন">জন্ম নিবন্ধন</option>
                      <option value="পাসপোর্ট">পাসপোর্ট</option>
                      <option value="পুলিশ ক্লিয়ারেন্স">পুলিশ ক্লিয়ারেন্স</option>
                      <option value="নাগরিক সনদ">নাগরিক সনদ</option>
                      <option value="রেশন কার্ড">রেশন কার্ড</option>
                      <option value="মোবাইল ব্যাংকিং">মোবাইল ব্যাংকিং</option>
                      <option value="বিল পরিশোধ">বিল পরিশোধ</option>
                      <option value="টিকিট বুকিং">টিকিট বুকিং</option>
                      <option value="ভর্তি আবেদন">ভর্তি আবেদন</option>
                      <option value="রেজাল্ট ও সার্টিফিকেট">
                        রেজাল্ট ও সার্টিফিকেট
                      </option>
                      <option value="ডাক্তারের অ্যাপয়েন্টমেন্ট">
                        ডাক্তারের অ্যাপয়েন্টমেন্ট
                      </option>
                      <option value="ভূমি সংক্রান্ত সেবা">
                        ভূমি সংক্রান্ত সেবা
                      </option>
                      <option value="ব্যবসা লাইসেন্স">ব্যবসা লাইসেন্স</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* URLs Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🌐 ওয়েবসাইট লিংক
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌐 মূল ওয়েবসাইট URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.example.gov.bd"
                      {...register("websiteUrl")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 আবেদন লিংক
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.example.gov.bd/apply"
                      {...register("applicationUrl")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Service Details Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ⚙️ সেবার বিবরণ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⏱️ প্রক্রিয়াকরণ সময়
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: ৭-১৫ কার্যদিবস"
                      {...register("processingTime")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💰 ফি/চার্জ
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: ৫০০ টাকা"
                      {...register("fees")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 প্রয়োজনীয় কাগজপত্র
                  </label>
                  <textarea
                    rows="3"
                    placeholder="প্রয়োজনীয় কাগজপত্রের তালিকা লিখুন। যেমন: জাতীয় পরিচয়পত্র, জন্ম সনদ, পাসপোর্ট সাইজের ছবি ইত্যাদি।"
                    {...register("documents")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 যোগ্যতা
                  </label>
                  <textarea
                    rows="3"
                    placeholder="সেবা গ্রহণের যোগ্যতা লিখুন। যেমন: বয়স, নাগরিকত্ব, শিক্ষাগত যোগ্যতা ইত্যাদি।"
                    {...register("eligibility")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Instructions & Benefits Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📖 নির্দেশনা ও সুবিধা
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 আবেদনের নির্দেশনা
                  </label>
                  <textarea
                    rows="4"
                    placeholder="আবেদন করার ধাপগুলো লিখুন। যেমন: ১. ওয়েবসাইটে যান, ২. ফর্ম পূরণ করুন, ৩. কাগজপত্র আপলোড করুন ইত্যাদি।"
                    {...register("instructions")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ✅ সেবার সুবিধা
                  </label>
                  <textarea
                    rows="3"
                    placeholder="এই সেবা থেকে কী কী সুবিধা পাওয়া যায় লিখুন।"
                    {...register("benefits")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Contact & Location Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📞 যোগাযোগ ও অবস্থান
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 যোগাযোগের তথ্য
                    </label>
                    <textarea
                      rows="3"
                      placeholder="ফোন নম্বর, ইমেইল, হেল্পলাইন ইত্যাদি"
                      {...register("contactInfo")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏢 অফিসের সময়
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: রবি-বৃহস্পতি: সকাল ৯টা-বিকাল ৫টা"
                      {...register("officeHours")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 অফিসের অবস্থান
                  </label>
                  <textarea
                    rows="2"
                    placeholder="অফিসের ঠিকানা লিখুন"
                    {...register("location")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Status & Priority Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ⚙️ সেটিংস
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🟢 স্ট্যাটাস
                    </label>
                    <select
                      {...register("status")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    >
                      <option value="Active">সক্রিয়</option>
                      <option value="Inactive">নিষ্ক্রিয়</option>
                      <option value="Maintenance">রক্ষণাবেক্ষণ</option>
                      <option value="Coming Soon">শীঘ্রই আসছে</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⚡ অগ্রাধিকার
                    </label>
                    <select
                      {...register("priority")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    >
                      <option value="Normal">সাধারণ</option>
                      <option value="High">উচ্চ</option>
                      <option value="Urgent">জরুরি</option>
                      <option value="Featured">বৈশিষ্ট্যযুক্ত</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>➕ {editingId ? "আপডেট করুন" : "সেবা যোগ করুন"}</>
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

