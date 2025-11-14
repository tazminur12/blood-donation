"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaUtensils,
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
  FaStar,
  FaUsers,
  FaMoneyBillWave,
  FaParking,
  FaWifi,
} from "react-icons/fa";

export default function RestaurantPage() {
  const { data: session, status } = useSession();
  const [restaurants, setRestaurants] = useState([]);
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
  } = useForm();

  const dineIn = watch("dineIn");
  const takeaway = watch("takeaway");
  const delivery = watch("delivery");

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/restaurants");
      const data = await res.json();

      if (res.ok && data.success) {
        setRestaurants(data.restaurants || []);
      }
    } catch (error) {
      console.error("Error loading restaurants:", error);
      Swal.fire("❌ ত্রুটি", "রেস্টুরেন্ট তালিকা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        phone: formData.phone,
        email: formData.email || "",
        website: formData.website || "",
        description: formData.description || "",
        cuisine: formData.cuisine || "",
        priceRange: formData.priceRange || "",
        rating: formData.rating || "",
        capacity: formData.capacity || "",
        openingHours: formData.openingHours || "",
        closingHours: formData.closingHours || "",
        features: formData.features || "",
        specialties: formData.specialties || "",
        parking: formData.parking || "",
        wifi: formData.wifi || "",
        delivery: delivery || false,
        takeaway: takeaway || false,
        dineIn: dineIn || false,
        status: formData.status || "Active",
        location: {
          area: formData.area || "",
          landmark: formData.landmark || "",
          city: "গোবিন্দগঞ্জ",
          district: "বগুড়া",
          division: "রাজশাহী",
        },
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/restaurants/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/restaurants", {
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
            ? "রেস্টুরেন্ট সফলভাবে আপডেট করা হয়েছে"
            : "নতুন রেস্টুরেন্ট সফলভাবে যোগ হয়েছে!",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        loadRestaurants();
      } else {
        throw new Error(data.error || "Failed to save restaurant");
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
      Swal.fire("❌ ত্রুটি", "রেস্টুরেন্ট যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant.id);
    reset({
      name: restaurant.name || "",
      type: restaurant.type || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      email: restaurant.email || "",
      website: restaurant.website || "",
      description: restaurant.description || "",
      cuisine: restaurant.cuisine || "",
      priceRange: restaurant.priceRange || "",
      rating: restaurant.rating || "",
      capacity: restaurant.capacity || "",
      openingHours: restaurant.openingHours || "",
      closingHours: restaurant.closingHours || "",
      features: restaurant.features || "",
      specialties: restaurant.specialties || "",
      parking: restaurant.parking || "",
      wifi: restaurant.wifi || "",
      dineIn: restaurant.dineIn || false,
      takeaway: restaurant.takeaway || false,
      delivery: restaurant.delivery || false,
      status: restaurant.status || "Active",
      area: restaurant.location?.area || "",
      landmark: restaurant.location?.landmark || "",
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই রেস্টুরেন্ট মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/restaurants/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "রেস্টুরেন্ট সফলভাবে মুছে ফেলা হয়েছে",
            timer: 2000,
            showConfirmButton: false,
          });
          loadRestaurants();
        } else {
          throw new Error(data.error || "Failed to delete restaurant");
        }
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        Swal.fire("❌ ত্রুটি", "রেস্টুরেন্ট মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const resetForm = () => {
    setShowFormModal(false);
    setEditingId(null);
    reset();
  };

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      !searchTerm ||
      restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || restaurant.type === filterType;
    const matchesStatus =
      filterStatus === "all" || restaurant.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeLabel = (type) => {
    const types = {
      "Fast Food": "🍔 ফাস্ট ফুড",
      "Fine Dining": "🍽️ ফাইন ডাইনিং",
      Cafe: "☕ ক্যাফে",
      "Street Food": "🌮 স্ট্রিট ফুড",
      Bakery: "🥐 বেকারি",
      Chinese: "🥢 চাইনিজ",
      Indian: "🍛 ইন্ডিয়ান",
      Thai: "🍜 থাই",
      Local: "🍲 লোকাল",
      Seafood: "🐟 সীফুড",
      Vegetarian: "🥬 ভেজিটেরিয়ান",
    };
    return types[type] || type;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRatingStars = (rating) => {
    if (!rating) return "N/A";
    return "⭐".repeat(parseInt(rating));
  };

  const restaurantTypes = [
    { value: "Fast Food", label: "🍔 ফাস্ট ফুড" },
    { value: "Fine Dining", label: "🍽️ ফাইন ডাইনিং" },
    { value: "Cafe", label: "☕ ক্যাফে" },
    { value: "Street Food", label: "🌮 স্ট্রিট ফুড" },
    { value: "Bakery", label: "🥐 বেকারি" },
    { value: "Chinese", label: "🥢 চাইনিজ" },
    { value: "Indian", label: "🍛 ইন্ডিয়ান" },
    { value: "Thai", label: "🍜 থাই" },
    { value: "Local", label: "🍲 লোকাল" },
    { value: "Seafood", label: "🐟 সীফুড" },
    { value: "Vegetarian", label: "🥬 ভেজিটেরিয়ান" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">রেস্টুরেন্ট ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-slate-600">
            রেস্টুরেন্টের তালিকা দেখুন, যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন রেস্টুরেন্ট যোগ করুন
        </button>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaSearch className="mr-2 h-4 w-4 text-orange-600" />
              অনুসন্ধান
            </label>
            <input
              type="text"
              placeholder="রেস্টুরেন্ট নাম, ঠিকানা বা যোগাযোগ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-orange-600" />
              রেস্টুরেন্টের ধরন
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="all">সব ধরন</option>
              {restaurantTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-orange-600" />
              অবস্থা
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="all">সব অবস্থা</option>
              <option value="Active">সক্রিয়</option>
              <option value="Inactive">নিষ্ক্রিয়</option>
              <option value="Maintenance">রক্ষণাবেক্ষণ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurants List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaUtensils className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো রেস্টুরেন্ট পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">প্রথম রেস্টুরেন্ট যোগ করুন</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {restaurant.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-orange-50 text-orange-800 border-orange-200">
                      {getTypeLabel(restaurant.type)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        restaurant.status
                      )}`}
                    >
                      {restaurant.status === "Active"
                        ? "সক্রিয়"
                        : restaurant.status === "Inactive"
                        ? "নিষ্ক্রিয়"
                        : "রক্ষণাবেক্ষণ"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                    {restaurant.address && (
                      <div className="flex items-center">
                        <FaMapPin className="text-orange-600 mr-2 shrink-0" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>
                    )}
                    {restaurant.phone && (
                      <div className="flex items-center">
                        <FaPhone className="text-green-600 mr-2 shrink-0" />
                        <span>{restaurant.phone}</span>
                      </div>
                    )}
                    {restaurant.email && (
                      <div className="flex items-center">
                        <FaEnvelope className="text-blue-600 mr-2 shrink-0" />
                        <span className="line-clamp-1">{restaurant.email}</span>
                      </div>
                    )}
                    {restaurant.openingHours && restaurant.closingHours && (
                      <div className="flex items-center">
                        <FaClock className="text-purple-600 mr-2 shrink-0" />
                        <span>
                          {restaurant.openingHours} - {restaurant.closingHours}
                        </span>
                      </div>
                    )}
                  </div>
                  {restaurant.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {restaurant.rating && (
                      <span className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        {getRatingStars(restaurant.rating)}
                      </span>
                    )}
                    {restaurant.priceRange && (
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-1" />
                        {restaurant.priceRange}
                      </span>
                    )}
                    {restaurant.capacity && (
                      <span className="flex items-center">
                        <FaUsers className="mr-1" />
                        {restaurant.capacity} জন
                      </span>
                    )}
                    {restaurant.parking && (
                      <span className="flex items-center">
                        <FaParking className="mr-1" />
                        {restaurant.parking}
                      </span>
                    )}
                    {restaurant.wifi && (
                      <span className="flex items-center">
                        <FaWifi className="mr-1" />
                        {restaurant.wifi}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-700"
                  >
                    <FaEdit className="h-3 w-3" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
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
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaUtensils className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "রেস্টুরেন্ট সম্পাদনা করুন"
                        : "নতুন রেস্টুরেন্ট যোগ করুন"}
                    </h2>
                    <p className="text-orange-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-orange-200 text-2xl transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUtensils className="w-5 h-5 mr-2 text-orange-600" />
                  📋 মৌলিক তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🍽️ রেস্টুরেন্টের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: স্পাইসি চিকেন হাউস"
                      {...register("name", {
                        required: "রেস্টুরেন্টের নাম আবশ্যক",
                        minLength: {
                          value: 3,
                          message: "রেস্টুরেন্টের নাম কমপক্ষে ৩ অক্ষর হতে হবে",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
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
                      🍴 রেস্টুরেন্টের ধরণ <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("type", {
                        required: "রেস্টুরেন্টের ধরণ আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
                        errors.type ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="">ধরণ নির্বাচন করুন</option>
                      {restaurantTypes.map((type) => (
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
                </div>

                {/* Description */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 বিবরণ
                  </label>
                  <textarea
                    rows="3"
                    placeholder="রেস্টুরেন্ট সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন"
                    {...register("description")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Location Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMapPin className="w-5 h-5 mr-2 text-red-600" />
                  📍 অবস্থান তথ্য
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    placeholder="রেস্টুরেন্টের সম্পূর্ণ ঠিকানা লিখুন"
                    {...register("address", {
                      required: "ঠিকানা আবশ্যক",
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
                      errors.address ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏘️ এলাকা
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: গোবিন্দগঞ্জ সদর, শেরপুর"
                      {...register("area")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏛️ ল্যান্ডমার্ক
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: জেলা প্রশাসকের কার্যালয়ের কাছে"
                      {...register("landmark")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaPhone className="w-5 h-5 mr-2 text-green-600" />
                  📞 যোগাযোগের তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 ফোন নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="উদাহরণ: 051-123456"
                      {...register("phone", {
                        required: "ফোন নম্বর আবশ্যক",
                        pattern: {
                          value: /^[0-9\-\+\(\)\s]+$/,
                          message: "সঠিক ফোন নম্বর দিন",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
                        errors.phone ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 ইমেইল
                    </label>
                    <input
                      type="email"
                      placeholder="উদাহরণ: info@restaurant.com"
                      {...register("email")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌐 ওয়েবসাইট
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.restaurant.com"
                    {...register("website")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Restaurant Details Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUtensils className="w-5 h-5 mr-2 text-orange-600" />
                  🍽️ রেস্টুরেন্টের বিবরণ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🍲 রান্নার ধরণ
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: বাংলা, চাইনিজ, ইন্ডিয়ান"
                      {...register("cuisine")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💰 মূল্য পরিসর
                    </label>
                    <select
                      {...register("priceRange")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    >
                      <option value="">মূল্য নির্বাচন করুন</option>
                      <option value="Low">💰 সস্তা (১০০-৩০০ টাকা)</option>
                      <option value="Medium">💰💰 মাঝারি (৩০০-৮০০ টাকা)</option>
                      <option value="High">💰💰💰 ব্যয়বহুল (৮০০+ টাকা)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⭐ রেটিং
                    </label>
                    <select
                      {...register("rating")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    >
                      <option value="">রেটিং নির্বাচন করুন</option>
                      <option value="1">⭐ ১</option>
                      <option value="2">⭐⭐ ২</option>
                      <option value="3">⭐⭐⭐ ৩</option>
                      <option value="4">⭐⭐⭐⭐ ৪</option>
                      <option value="5">⭐⭐⭐⭐⭐ ৫</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👥 ধারণক্ষমতা
                  </label>
                  <input
                    type="number"
                    placeholder="উদাহরণ: ৫০ জন"
                    {...register("capacity")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Operating Hours Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaClock className="w-5 h-5 mr-2 text-purple-600" />
                  🕐 কর্মসময়
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌅 খোলার সময়
                    </label>
                    <input
                      type="time"
                      {...register("openingHours")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌆 বন্ধের সময়
                    </label>
                    <input
                      type="time"
                      {...register("closingHours")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaWifi className="w-5 h-5 mr-2 text-blue-600" />
                  ✨ বিশেষ সুবিধা
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🚗 পার্কিং
                    </label>
                    <select
                      {...register("parking")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    >
                      <option value="">পার্কিং নির্বাচন করুন</option>
                      <option value="Available">✅ উপলব্ধ</option>
                      <option value="Not Available">❌ নেই</option>
                      <option value="Street Parking">🅿️ সড়ক পার্কিং</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📶 ওয়াইফাই
                    </label>
                    <select
                      {...register("wifi")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                    >
                      <option value="">ওয়াইফাই নির্বাচন করুন</option>
                      <option value="Available">✅ উপলব্ধ</option>
                      <option value="Not Available">❌ নেই</option>
                      <option value="Paid">💰 পেইড</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🍽️ সেবার ধরণ
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("dineIn")}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">🍽️ ডাইন-ইন</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("takeaway")}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">📦 টেকঅ্যাওয়ে</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("delivery")}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">🚚 হোম ডেলিভারি</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Specialties Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaStar className="w-5 h-5 mr-2 text-yellow-600" />
                  🌟 বিশেষ খাবার
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🍽️ বিশেষ খাবারসমূহ
                  </label>
                  <textarea
                    rows="3"
                    placeholder="রেস্টুরেন্টের বিশেষ খাবারসমূহের তালিকা লিখুন"
                    {...register("specialties")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ✨ অতিরিক্ত সুবিধা
                  </label>
                  <textarea
                    rows="3"
                    placeholder="অতিরিক্ত সুবিধাসমূহ লিখুন"
                    {...register("features")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Status Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUtensils className="w-5 h-5 mr-2 text-orange-600" />
                  ⚙️ সেটিংস
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🟢 স্ট্যাটাস
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  >
                    <option value="Active">সক্রিয়</option>
                    <option value="Inactive">নিষ্ক্রিয়</option>
                    <option value="Maintenance">রক্ষণাবেক্ষণ</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>➕ {editingId ? "আপডেট করুন" : "রেস্টুরেন্ট যোগ করুন"}</>
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

