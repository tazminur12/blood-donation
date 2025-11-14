"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaCar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaSearch,
  FaFilter,
  FaMapPin,
  FaPhone,
  FaUser,
  FaMoneyBillWave,
  FaShieldAlt,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";

export default function RentCarPage() {
  const { data: session, status } = useSession();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  const selectedFeatures = watch("features") || [];

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rent-cars");
      const data = await res.json();

      if (res.ok && data.success) {
        setCars(data.cars || []);
      }
    } catch (error) {
      console.error("Error loading cars:", error);
      Swal.fire("❌ ত্রুটি", "গাড়ির তালিকা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        type: formData.type,
        color: formData.color || "",
        transmission: formData.transmission || "",
        fuelType: formData.fuelType || "",
        seats: formData.seats || "",
        rentPerDay: formData.rentPerDay,
        rentPerWeek: formData.rentPerWeek || "",
        rentPerMonth: formData.rentPerMonth || "",
        location: formData.location,
        contact: formData.contact,
        ownerName: formData.ownerName,
        description: formData.description || "",
        features: selectedFeatures || [],
        status: formData.status || "Available",
        insurance: formData.insurance || "",
        registrationNumber: formData.registrationNumber || "",
        mileage: formData.mileage || "",
        condition: formData.condition || "",
        additionalInfo: formData.additionalInfo || "",
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/rent-cars/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/rent-cars", {
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
            ? "গাড়ি সফলভাবে আপডেট করা হয়েছে"
            : "নতুন গাড়ি সফলভাবে যোগ হয়েছে!",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        loadCars();
      } else {
        throw new Error(data.error || "Failed to save car");
      }
    } catch (error) {
      console.error("Error saving car:", error);
      Swal.fire("❌ ত্রুটি", "গাড়ি যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleEdit = (car) => {
    setEditingId(car.id);
    reset({
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || "",
      type: car.type || "",
      color: car.color || "",
      transmission: car.transmission || "",
      fuelType: car.fuelType || "",
      seats: car.seats || "",
      rentPerDay: car.rentPerDay || "",
      rentPerWeek: car.rentPerWeek || "",
      rentPerMonth: car.rentPerMonth || "",
      location: car.location || "",
      contact: car.contact || "",
      ownerName: car.ownerName || "",
      description: car.description || "",
      features: car.features || [],
      status: car.status || "Available",
      insurance: car.insurance || "",
      registrationNumber: car.registrationNumber || "",
      mileage: car.mileage || "",
      condition: car.condition || "",
      additionalInfo: car.additionalInfo || "",
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই গাড়ি মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/rent-cars/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "গাড়ি সফলভাবে মুছে ফেলা হয়েছে",
            timer: 2000,
            showConfirmButton: false,
          });
          loadCars();
        } else {
          throw new Error(data.error || "Failed to delete car");
        }
      } catch (error) {
        console.error("Error deleting car:", error);
        Swal.fire("❌ ত্রুটি", "গাড়ি মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const resetForm = () => {
    setShowFormModal(false);
    setEditingId(null);
    reset();
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = selectedFeatures || [];
    if (currentFeatures.includes(feature)) {
      setValue(
        "features",
        currentFeatures.filter((f) => f !== feature)
      );
    } else {
      setValue("features", [...currentFeatures, feature]);
    }
  };

  // Filter cars
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      !searchTerm ||
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || car.type === filterType;
    const matchesStatus = filterStatus === "all" || car.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeLabel = (type) => {
    const types = {
      Sedan: "🚗 সেডান",
      SUV: "🚙 এসইউভি",
      Micro: "🚐 মাইক্রো",
      Luxury: "🏎️ লাক্সারি",
      Van: "🚐 ভ্যান",
      Truck: "🚛 ট্রাক",
      Pickup: "🛻 পিকআপ",
      Bus: "🚌 বাস",
    };
    return types[type] || type;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rented":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Maintenance":
        return "bg-red-100 text-red-800 border-red-200";
      case "Reserved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    const statuses = {
      Available: "🟢 উপলব্ধ",
      Rented: "🟡 ভাড়া দেওয়া",
      Maintenance: "🔴 মেরামত",
      Reserved: "🔵 সংরক্ষিত",
    };
    return statuses[status] || status;
  };

  const carTypes = [
    { value: "Sedan", label: "🚗 সেডান" },
    { value: "SUV", label: "🚙 এসইউভি" },
    { value: "Micro", label: "🚐 মাইক্রো" },
    { value: "Luxury", label: "🏎️ লাক্সারি" },
    { value: "Van", label: "🚐 ভ্যান" },
    { value: "Truck", label: "🚛 ট্রাক" },
    { value: "Pickup", label: "🛻 পিকআপ" },
    { value: "Bus", label: "🚌 বাস" },
  ];

  const transmissionTypes = [
    { value: "Manual", label: "ম্যানুয়াল" },
    { value: "Automatic", label: "অটোমেটিক" },
    { value: "CVT", label: "সিভিটি" },
  ];

  const fuelTypes = [
    { value: "Petrol", label: "পেট্রোল" },
    { value: "Diesel", label: "ডিজেল" },
    { value: "CNG", label: "সিএনজি" },
    { value: "Electric", label: "ইলেকট্রিক" },
    { value: "Hybrid", label: "হাইব্রিড" },
  ];

  const conditions = [
    { value: "Excellent", label: "চমৎকার" },
    { value: "Good", label: "ভালো" },
    { value: "Fair", label: "মাঝারি" },
    { value: "Poor", label: "খারাপ" },
  ];

  const availableFeatures = [
    "AC",
    "Power Steering",
    "Power Windows",
    "Central Locking",
    "Music System",
    "GPS Navigation",
    "Bluetooth",
    "USB Charger",
    "Backup Camera",
    "Airbags",
    "ABS",
    "Cruise Control",
    "Leather Seats",
    "Sunroof",
    "Alloy Wheels",
  ];

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("bn-BD").format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ভাড়ার গাড়ি ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-slate-600">
            গাড়ির তালিকা দেখুন, যোগ করুন এবং সম্পাদনা করুন
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
          নতুন গাড়ি যোগ করুন
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
              placeholder="ব্র্যান্ড, মডেল, অবস্থান বা যোগাযোগ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-blue-600" />
              গাড়ির ধরন
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">সব ধরন</option>
              {carTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-blue-600" />
              অবস্থা
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">সব অবস্থা</option>
              <option value="Available">🟢 উপলব্ধ</option>
              <option value="Rented">🟡 ভাড়া দেওয়া</option>
              <option value="Maintenance">🔴 মেরামত</option>
              <option value="Reserved">🔵 সংরক্ষিত</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaCar className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো গাড়ি পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">প্রথম গাড়ি যোগ করুন</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {car.brand} {car.model} ({car.year})
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-blue-50 text-blue-800 border-blue-200">
                      {getTypeLabel(car.type)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        car.status
                      )}`}
                    >
                      {getStatusLabel(car.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                    {car.location && (
                      <div className="flex items-center">
                        <FaMapPin className="text-blue-600 mr-2 flex-shrink-0" />
                        <span>{car.location}</span>
                      </div>
                    )}
                    {car.contact && (
                      <div className="flex items-center">
                        <FaPhone className="text-green-600 mr-2 flex-shrink-0" />
                        <span>{car.contact}</span>
                      </div>
                    )}
                    {car.ownerName && (
                      <div className="flex items-center">
                        <FaUser className="text-purple-600 mr-2 flex-shrink-0" />
                        <span>{car.ownerName}</span>
                      </div>
                    )}
                    {car.rentPerDay && (
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-green-600 mr-2 flex-shrink-0" />
                        <span className="font-semibold">
                          ৳{formatPrice(car.rentPerDay)}/দিন
                        </span>
                      </div>
                    )}
                  </div>
                  {car.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {car.description}
                    </p>
                  )}
                  {car.features && car.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {car.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {car.transmission && (
                      <span>⚙️ ট্রান্সমিশন: {car.transmission}</span>
                    )}
                    {car.fuelType && (
                      <span>⛽ জ্বালানি: {car.fuelType}</span>
                    )}
                    {car.seats && <span>💺 আসন: {car.seats}</span>}
                    {car.mileage && (
                      <span>📊 মাইলেজ: {formatPrice(car.mileage)} কিমি</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(car)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    <FaEdit className="h-3 w-3" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
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
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCar className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "গাড়ি সম্পাদনা করুন"
                        : "নতুন গাড়ি যোগ করুন"}
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaCar className="w-5 h-5 mr-2 text-blue-600" />
                  📋 মৌলিক তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🚗 ব্র্যান্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: Toyota, Honda, BMW"
                      {...register("brand", {
                        required: "ব্র্যান্ড আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.brand ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.brand && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🚙 মডেল <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: Corolla, Civic, X5"
                      {...register("model", {
                        required: "মডেল আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.model ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.model && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.model.message}
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 বছর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 2020"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      {...register("year", {
                        required: "বছর আবশ্যক",
                        min: {
                          value: 1990,
                          message: "বছর ১৯৯০ এর পরে হতে হবে",
                        },
                        max: {
                          value: new Date().getFullYear() + 1,
                          message: "সঠিক বছর দিন",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.year ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.year && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.year.message}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏷️ গাড়ির ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("type", {
                        required: "গাড়ির ধরন নির্বাচন আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.type ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="">ধরন নির্বাচন করুন</option>
                      {carTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎨 রং
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: সাদা, কালো, লাল"
                      {...register("color")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⚙️ ট্রান্সমিশন
                    </label>
                    <select
                      {...register("transmission")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    >
                      <option value="">ট্রান্সমিশন নির্বাচন করুন</option>
                      {transmissionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⛽ জ্বালানির ধরন
                    </label>
                    <select
                      {...register("fuelType")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    >
                      <option value="">জ্বালানির ধরন নির্বাচন করুন</option>
                      {fuelTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💺 আসনের সংখ্যা
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 4, 5, 7"
                      min="1"
                      max="20"
                      {...register("seats")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMoneyBillWave className="w-5 h-5 mr-2 text-green-600" />
                  💰 ভাড়ার তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 দৈনিক ভাড়া (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 1500"
                      min="0"
                      {...register("rentPerDay", {
                        required: "দৈনিক ভাড়ার দাম আবশ্যক",
                        min: {
                          value: 0,
                          message: "ভাড়ার দাম ০ এর চেয়ে বেশি হতে হবে",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.rentPerDay ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.rentPerDay && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.rentPerDay.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📆 সাপ্তাহিক ভাড়া (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 9000"
                      min="0"
                      {...register("rentPerWeek")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📆 মাসিক ভাড়া (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 35000"
                      min="0"
                      {...register("rentPerMonth")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Location and Contact */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMapPin className="w-5 h-5 mr-2 text-red-600" />
                  📍 অবস্থান ও যোগাযোগ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏠 অবস্থান <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: গোবিন্দগঞ্জ সদর, শেরপুর"
                      {...register("location", {
                        required: "অবস্থান আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.location ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.location && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📱 যোগাযোগের নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="যেমন: 01712345678"
                      {...register("contact", {
                        required: "যোগাযোগের নম্বর আবশ্যক",
                        pattern: {
                          value: /^(\+88|88)?(01[3-9]\d{8})$/,
                          message: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.contact ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.contact && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.contact.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 মালিকের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="গাড়ির মালিকের নাম"
                      {...register("ownerName", {
                        required: "মালিকের নাম আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                        errors.ownerName ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.ownerName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.ownerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🟢 অবস্থা
                    </label>
                    <select
                      {...register("status")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    >
                      <option value="Available">🟢 উপলব্ধ</option>
                      <option value="Rented">🟡 ভাড়া দেওয়া</option>
                      <option value="Maintenance">🔴 মেরামত</option>
                      <option value="Reserved">🔵 সংরক্ষিত</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2 text-blue-600" />
                  ℹ️ অতিরিক্ত তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🚗 রেজিস্ট্রেশন নম্বর
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ঢাকা-মেট্রো-গ-১২-৩৪৫৬"
                      {...register("registrationNumber")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📊 মাইলেজ (কিমি)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 50000"
                      min="0"
                      {...register("mileage")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⚡ গাড়ির অবস্থা
                    </label>
                    <select
                      {...register("condition")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    >
                      <option value="">অবস্থা নির্বাচন করুন</option>
                      {conditions.map((condition) => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🛡️ বীমা
                    </label>
                    <input
                      type="text"
                      placeholder="বীমার তথ্য"
                      {...register("insurance")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 বিবরণ
                  </label>
                  <textarea
                    rows="3"
                    placeholder="গাড়ির বিস্তারিত বিবরণ লিখুন..."
                    {...register("description")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 অতিরিক্ত তথ্য
                  </label>
                  <textarea
                    rows="2"
                    placeholder="অতিরিক্ত তথ্য বা শর্তাবলী..."
                    {...register("additionalInfo")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaShieldAlt className="w-5 h-5 mr-2 text-purple-600" />
                  🛡️ গাড়ির সুবিধাসমূহ
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableFeatures.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
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
                    <>➕ {editingId ? "আপডেট করুন" : "গাড়ি যোগ করুন"}</>
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

