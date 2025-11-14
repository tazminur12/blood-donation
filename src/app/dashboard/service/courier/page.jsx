"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaBox,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaSearch,
  FaFilter,
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

export default function CourierPage() {
  const { data: session, status } = useSession();
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  const selectedServices = watch("services") || [];

  useEffect(() => {
    loadCouriers();
  }, []);

  const loadCouriers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/couriers");
      const data = await res.json();

      if (res.ok && data.success) {
        setCouriers(data.couriers || []);
      }
    } catch (error) {
      console.error("Error loading couriers:", error);
      Swal.fire("❌ ত্রুটি", "কুরিয়ার তালিকা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        contact: formData.contact,
        type: formData.type || "domestic",
        description: formData.description || "",
        email: formData.email || "",
        website: formData.website || "",
        workingHours: formData.workingHours || "",
        services: selectedServices || [],
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/couriers/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/couriers", {
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
            ? "কুরিয়ার সফলভাবে আপডেট করা হয়েছে"
            : "নতুন কুরিয়ার সফলভাবে যোগ হয়েছে!",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        loadCouriers();
      } else {
        throw new Error(data.error || "Failed to save courier");
      }
    } catch (error) {
      console.error("Error saving courier:", error);
      Swal.fire("❌ ত্রুটি", "কুরিয়ার যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleEdit = (courier) => {
    setEditingId(courier.id);
    reset({
      name: courier.name || "",
      address: courier.address || "",
      contact: courier.contact || "",
      type: courier.type || "domestic",
      description: courier.description || "",
      email: courier.email || "",
      website: courier.website || "",
      workingHours: courier.workingHours || "",
      services: courier.services || [],
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই কুরিয়ার মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/couriers/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "কুরিয়ার সফলভাবে মুছে ফেলা হয়েছে",
            timer: 2000,
            showConfirmButton: false,
          });
          loadCouriers();
        } else {
          throw new Error(data.error || "Failed to delete courier");
        }
      } catch (error) {
        console.error("Error deleting courier:", error);
        Swal.fire("❌ ত্রুটি", "কুরিয়ার মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const resetForm = () => {
    setShowFormModal(false);
    setEditingId(null);
    reset();
  };

  const handleServiceToggle = (service) => {
    const currentServices = selectedServices || [];
    if (currentServices.includes(service)) {
      setValue(
        "services",
        currentServices.filter((s) => s !== service)
      );
    } else {
      setValue("services", [...currentServices, service]);
    }
  };

  // Filter couriers
  const filteredCouriers = couriers.filter((courier) => {
    const matchesSearch =
      !searchTerm ||
      courier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.contact?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || courier.type === filterType;

    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type) => {
    const types = {
      domestic: "দেশীয় কুরিয়ার",
      international: "আন্তর্জাতিক কুরিয়ার",
      both: "উভয় ধরনের",
    };
    return types[type] || type;
  };

  const serviceOptions = [
    { value: "domestic", label: "দেশীয় কুরিয়ার", icon: "🏠" },
    { value: "international", label: "আন্তর্জাতিক কুরিয়ার", icon: "🌍" },
    { value: "express", label: "এক্সপ্রেস ডেলিভারি", icon: "⚡" },
    { value: "same_day", label: "সেইম ডে ডেলিভারি", icon: "🚀" },
    { value: "next_day", label: "নেক্সট ডে ডেলিভারি", icon: "📅" },
    { value: "cod", label: "ক্যাশ অন ডেলিভারি", icon: "💰" },
    { value: "tracking", label: "পার্সেল ট্র্যাকিং", icon: "📍" },
    { value: "insurance", label: "পার্সেল ইন্সুরেন্স", icon: "🛡️" },
  ];

  const getServiceLabel = (value) => {
    const service = serviceOptions.find((s) => s.value === value);
    return service ? `${service.icon} ${service.label}` : value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">কুরিয়ার সার্ভিস ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-slate-600">
            কুরিয়ারের তালিকা দেখুন, যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন কুরিয়ার যোগ করুন
        </button>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaSearch className="mr-2 h-4 w-4 text-teal-600" />
              অনুসন্ধান
            </label>
            <input
              type="text"
              placeholder="কুরিয়ার নাম, ঠিকানা বা যোগাযোগ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-teal-600" />
              কুরিয়ারের ধরন
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option value="all">সব ধরন</option>
              <option value="domestic">দেশীয় কুরিয়ার</option>
              <option value="international">আন্তর্জাতিক কুরিয়ার</option>
              <option value="both">উভয় ধরনের</option>
            </select>
          </div>
        </div>
      </div>

      {/* Couriers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : filteredCouriers.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaBox className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো কুরিয়ার পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম কুরিয়ার যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCouriers.map((courier) => (
            <div
              key={courier.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {courier.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                      {getTypeLabel(courier.type)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                    {courier.address && (
                      <div className="flex items-center">
                        <FaMapPin className="text-teal-600 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{courier.address}</span>
                      </div>
                    )}
                    {courier.contact && (
                      <div className="flex items-center">
                        <FaPhone className="text-green-600 mr-2 flex-shrink-0" />
                        <span>{courier.contact}</span>
                      </div>
                    )}
                    {courier.email && (
                      <div className="flex items-center">
                        <FaEnvelope className="text-blue-600 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{courier.email}</span>
                      </div>
                    )}
                    {courier.workingHours && (
                      <div className="flex items-center">
                        <FaClock className="text-purple-600 mr-2 flex-shrink-0" />
                        <span>{courier.workingHours}</span>
                      </div>
                    )}
                  </div>
                  {courier.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {courier.description}
                    </p>
                  )}
                  {courier.services && courier.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {courier.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                        >
                          {getServiceLabel(service)}
                        </span>
                      ))}
                    </div>
                  )}
                  {courier.website && (
                    <div className="flex items-center text-xs text-slate-500">
                      <FaGlobe className="mr-2" />
                      <a
                        href={courier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                      >
                        {courier.website}
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(courier)}
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700"
                  >
                    <FaEdit className="h-3 w-3" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(courier.id)}
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
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBox className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "কুরিয়ার সম্পাদনা করুন"
                        : "নতুন কুরিয়ার যোগ করুন"}
                    </h2>
                    <p className="text-teal-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-teal-200 text-2xl transition"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📦 কুরিয়ারের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="কুরিয়ারের নাম লিখুন"
                      {...register("name", {
                        required: "কুরিয়ারের নাম আবশ্যক",
                        minLength: {
                          value: 3,
                          message: "কুরিয়ারের নাম কমপক্ষে ৩ অক্ষর হতে হবে",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200 ${
                        errors.name ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏷️ কুরিয়ারের ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("type", {
                        required: "কুরিয়ারের ধরন নির্বাচন আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200 ${
                        errors.type ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="domestic">দেশীয় কুরিয়ার</option>
                      <option value="international">আন্তর্জাতিক কুরিয়ার</option>
                      <option value="both">উভয় ধরনের</option>
                    </select>
                    {errors.type && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📞 যোগাযোগের তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📱 যোগাযোগের নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      {...register("contact", {
                        required: "যোগাযোগের নম্বর আবশ্যক",
                        pattern: {
                          value: /^(\+88|88)?(01[3-9]\d{8})$/,
                          message: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200 ${
                        errors.contact ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.contact && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.contact.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 ইমেইল
                    </label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      {...register("email", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "সঠিক ইমেইল ঠিকানা দিন",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200 ${
                        errors.email ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📍 ঠিকানা
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏠 সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    placeholder="বিস্তারিত ঠিকানা লিখুন"
                    {...register("address", {
                      required: "ঠিকানা আবশ্যক",
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200 ${
                      errors.address ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Services Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🌐 সেবাসমূহ
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {serviceOptions.map((service) => (
                    <label
                      key={service.value}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.value)}
                        onChange={() => handleServiceToggle(service.value)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {service.icon} {service.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Working Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⏰ কর্মঘণ্টা
                    </label>
                    <input
                      type="text"
                      placeholder="সকাল ৯টা - সন্ধ্যা ৬টা"
                      {...register("workingHours")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌐 ওয়েবসাইট
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      {...register("website", {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "সঠিক URL দিন",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200 ${
                        errors.website ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.website && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.website.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 বিবরণ
                  </label>
                  <textarea
                    rows="4"
                    placeholder="কুরিয়ার সার্ভিস সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                    {...register("description")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>➕ {editingId ? "আপডেট করুন" : "কুরিয়ার যোগ করুন"}</>
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

