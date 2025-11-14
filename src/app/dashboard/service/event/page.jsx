"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
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
  FaUser,
  FaUsers,
  FaMoneyBillWave,
  FaInfoCircle,
} from "react-icons/fa";

export default function EventPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
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
    watch,
  } = useForm();

  const isFree = watch("isFree");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();

      if (res.ok && data.success) {
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      Swal.fire("❌ ত্রুটি", "ইভেন্ট তালিকা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description || "",
        category: formData.category,
        location: formData.location,
        date: formData.date,
        time: formData.time || "",
        organizer: formData.organizer,
        organizerPhone: formData.organizerPhone || "",
        organizerEmail: formData.organizerEmail || "",
        organizerWebsite: formData.organizerWebsite || "",
        capacity: formData.capacity || "",
        entryFee: formData.entryFee || "",
        isFree: isFree || false,
        targetAudience: formData.targetAudience || "",
        highlights: formData.highlights || "",
        requirements: formData.requirements || "",
        contactInfo: formData.contactInfo || "",
        socialMedia: {
          facebook: formData.facebook || "",
          instagram: formData.instagram || "",
          twitter: formData.twitter || "",
        },
        status: formData.status || "Upcoming",
        locationDetails: {
          address: formData.address || "",
          area: formData.area || "",
          landmark: formData.landmark || "",
          city: "গোবিন্দগঞ্জ",
          district: "গোবিন্দগঞ্জ",
          division: "রাজশাহী",
        },
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/events/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/events", {
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
            ? "ইভেন্ট সফলভাবে আপডেট করা হয়েছে"
            : "নতুন ইভেন্ট সফলভাবে যোগ হয়েছে!",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        loadEvents();
      } else {
        throw new Error(data.error || "Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      Swal.fire("❌ ত্রুটি", "ইভেন্ট যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    reset({
      title: event.title || "",
      description: event.description || "",
      category: event.category || "",
      location: event.location || "",
      date: event.date || "",
      time: event.time || "",
      organizer: event.organizer || "",
      organizerPhone: event.organizerPhone || "",
      organizerEmail: event.organizerEmail || "",
      organizerWebsite: event.organizerWebsite || "",
      capacity: event.capacity || "",
      entryFee: event.entryFee || "",
      isFree: event.isFree || false,
      targetAudience: event.targetAudience || "",
      highlights: event.highlights || "",
      requirements: event.requirements || "",
      contactInfo: event.contactInfo || "",
      facebook: event.socialMedia?.facebook || "",
      instagram: event.socialMedia?.instagram || "",
      twitter: event.socialMedia?.twitter || "",
      status: event.status || "Upcoming",
      address: event.locationDetails?.address || "",
      area: event.locationDetails?.area || "",
      landmark: event.locationDetails?.landmark || "",
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ইভেন্ট মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/events/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "মুছে ফেলা হয়েছে!",
            text: "ইভেন্ট সফলভাবে মুছে ফেলা হয়েছে",
            timer: 2000,
            showConfirmButton: false,
          });
          loadEvents();
        } else {
          throw new Error(data.error || "Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        Swal.fire("❌ ত্রুটি", "ইভেন্ট মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const resetForm = () => {
    setShowFormModal(false);
    setEditingId(null);
    reset();
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchTerm ||
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || event.category === filterCategory;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryLabel = (category) => {
    const categories = {
      Cultural: "🎭 সাংস্কৃতিক",
      Sports: "⚽ খেলাধুলা",
      Educational: "📚 শিক্ষামূলক",
      Business: "💼 ব্যবসায়িক",
      Religious: "🕊️ ধর্মীয়",
      Social: "👥 সামাজিক",
      Entertainment: "🎪 বিনোদন",
      Technology: "💻 প্রযুক্তি",
      Health: "🏥 স্বাস্থ্য",
      Environment: "🌱 পরিবেশ",
    };
    return categories[category] || category;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    const statuses = {
      Upcoming: "আসন্ন",
      Ongoing: "চলমান",
      Completed: "সম্পন্ন",
      Cancelled: "বাতিল",
    };
    return statuses[status] || status;
  };

  const eventCategories = [
    { value: "Cultural", label: "🎭 সাংস্কৃতিক" },
    { value: "Sports", label: "⚽ খেলাধুলা" },
    { value: "Educational", label: "📚 শিক্ষামূলক" },
    { value: "Business", label: "💼 ব্যবসায়িক" },
    { value: "Religious", label: "🕊️ ধর্মীয়" },
    { value: "Social", label: "👥 সামাজিক" },
    { value: "Entertainment", label: "🎪 বিনোদন" },
    { value: "Technology", label: "💻 প্রযুক্তি" },
    { value: "Health", label: "🏥 স্বাস্থ্য" },
    { value: "Environment", label: "🌱 পরিবেশ" },
  ];

  const targetAudiences = [
    { value: "All Ages", label: "সব বয়সের" },
    { value: "Children", label: "শিশু" },
    { value: "Youth", label: "যুবক" },
    { value: "Adults", label: "প্রাপ্তবয়স্ক" },
    { value: "Students", label: "ছাত্র-ছাত্রী" },
    { value: "Professionals", label: "পেশাজীবী" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ইভেন্ট ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-slate-600">
            ইভেন্টের তালিকা দেখুন, যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন ইভেন্ট যোগ করুন
        </button>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaSearch className="mr-2 h-4 w-4 text-purple-600" />
              অনুসন্ধান
            </label>
            <input
              type="text"
              placeholder="ইভেন্ট নাম, স্থান বা আয়োজক..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-purple-600" />
              ক্যাটাগরি
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="all">সব ক্যাটাগরি</option>
              {eventCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center">
              <FaFilter className="mr-2 h-4 w-4 text-purple-600" />
              অবস্থা
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="all">সব অবস্থা</option>
              <option value="Upcoming">আসন্ন</option>
              <option value="Ongoing">চলমান</option>
              <option value="Completed">সম্পন্ন</option>
              <option value="Cancelled">বাতিল</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaCalendarAlt className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো ইভেন্ট পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">প্রথম ইভেন্ট যোগ করুন</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {event.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-purple-50 text-purple-800 border-purple-200">
                      {getCategoryLabel(event.category)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                    {event.date && (
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-purple-600 mr-2 shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    )}
                    {event.time && (
                      <div className="flex items-center">
                        <FaClock className="text-blue-600 mr-2 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center">
                        <FaMapPin className="text-red-600 mr-2 shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    {event.organizer && (
                      <div className="flex items-center">
                        <FaUser className="text-green-600 mr-2 shrink-0" />
                        <span className="line-clamp-1">{event.organizer}</span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {event.capacity && (
                      <span className="flex items-center">
                        <FaUsers className="mr-1" />
                        {event.capacity} জন
                      </span>
                    )}
                    {event.isFree ? (
                      <span className="flex items-center text-green-600">
                        <FaMoneyBillWave className="mr-1" />
                        বিনামূল্যে
                      </span>
                    ) : (
                      event.entryFee && (
                        <span className="flex items-center">
                          <FaMoneyBillWave className="mr-1" />
                          ৳{event.entryFee}
                        </span>
                      )
                    )}
                    {event.targetAudience && (
                      <span className="flex items-center">
                        <FaUsers className="mr-1" />
                        {event.targetAudience}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                  >
                    <FaEdit className="h-3 w-3" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
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
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "ইভেন্ট সম্পাদনা করুন"
                        : "নতুন ইভেন্ট যোগ করুন"}
                    </h2>
                    <p className="text-purple-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-purple-200 text-2xl transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaCalendarAlt className="w-5 h-5 mr-2 text-purple-600" />
                  📋 মৌলিক তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 ইভেন্টের শিরোনাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: গোবিন্দগঞ্জ সাহিত্য উৎসব ২০২৫"
                      {...register("title", {
                        required: "ইভেন্টের শিরোনাম আবশ্যক",
                        minLength: {
                          value: 5,
                          message: "শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে",
                        },
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                        errors.title ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎭 ইভেন্টের ক্যাটাগরি <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("category", {
                        required: "ক্যাটাগরি আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                        errors.category ? "border-red-400" : "border-gray-300"
                      }`}
                    >
                      <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                      {eventCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 ইভেন্টের বিবরণ
                  </label>
                  <textarea
                    rows="4"
                    placeholder="ইভেন্ট সম্পর্কে বিস্তারিত বিবরণ লিখুন"
                    {...register("description")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Date and Time Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaClock className="w-5 h-5 mr-2 text-blue-600" />
                  🕐 তারিখ ও সময়
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 তারিখ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("date", {
                        required: "তারিখ আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                        errors.date ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.date && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🕐 সময়
                    </label>
                    <input
                      type="time"
                      {...register("time")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
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
                    📍 ইভেন্টের স্থান <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: গোবিন্দগঞ্জ জেলা প্রশাসকের কার্যালয়"
                    {...register("location", {
                      required: "স্থান আবশ্যক",
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                      errors.location ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏠 সম্পূর্ণ ঠিকানা
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ইভেন্টের সম্পূর্ণ ঠিকানা লিখুন"
                    {...register("address")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
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
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
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
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Organizer Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="w-5 h-5 mr-2 text-green-600" />
                  👤 আয়োজকের তথ্য
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 আয়োজকের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: গোবিন্দগঞ্জ সাহিত্য পরিষদ"
                      {...register("organizer", {
                        required: "আয়োজকের নাম আবশ্যক",
                      })}
                      className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                        errors.organizer ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.organizer && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.organizer.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      placeholder="উদাহরণ: 051-123456"
                      {...register("organizerPhone")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 ইমেইল
                    </label>
                    <input
                      type="email"
                      placeholder="উদাহরণ: info@event.com"
                      {...register("organizerEmail")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌐 ওয়েবসাইট
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.event.com"
                      {...register("organizerWebsite")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2 text-blue-600" />
                  📊 ইভেন্টের বিবরণ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👥 ধারণক্ষমতা
                    </label>
                    <input
                      type="number"
                      placeholder="উদাহরণ: ৫০০ জন"
                      {...register("capacity")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎯 লক্ষ্য দর্শক
                    </label>
                    <select
                      {...register("targetAudience")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    >
                      <option value="">লক্ষ্য দর্শক নির্বাচন করুন</option>
                      {targetAudiences.map((audience) => (
                        <option key={audience.value} value={audience.value}>
                          {audience.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💰 প্রবেশ ফি
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="টাকা"
                        {...register("entryFee")}
                        disabled={isFree}
                        className="flex-1 border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 disabled:bg-gray-100"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          {...register("isFree")}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        বিনামূল্যে
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2 text-yellow-600" />
                  ✨ অতিরিক্ত তথ্য
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⭐ বিশেষ আকর্ষণ
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ইভেন্টের বিশেষ আকর্ষণসমূহ লিখুন"
                    {...register("highlights")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 প্রয়োজনীয়তা
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ইভেন্টে অংশগ্রহণের জন্য প্রয়োজনীয়তা লিখুন"
                    {...register("requirements")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 যোগাযোগের তথ্য
                  </label>
                  <textarea
                    rows="3"
                    placeholder="অতিরিক্ত যোগাযোগের তথ্য লিখুন"
                    {...register("contactInfo")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
              </div>

              {/* Social Media Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaGlobe className="w-5 h-5 mr-2 text-blue-600" />
                  📱 সোশ্যাল মিডিয়া
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📘 ফেসবুক
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/event"
                      {...register("facebook")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📷 ইনস্টাগ্রাম
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/event"
                      {...register("instagram")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🐦 টুইটার
                    </label>
                    <input
                      type="url"
                      placeholder="https://twitter.com/event"
                      {...register("twitter")}
                      className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaCalendarAlt className="w-5 h-5 mr-2 text-purple-600" />
                  ⚙️ সেটিংস
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🟢 স্ট্যাটাস
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  >
                    <option value="Upcoming">আসন্ন</option>
                    <option value="Ongoing">চলমান</option>
                    <option value="Completed">সম্পন্ন</option>
                    <option value="Cancelled">বাতিল</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>➕ {editingId ? "আপডেট করুন" : "ইভেন্ট যোগ করুন"}</>
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

