"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaCheck,
  FaImage,
  FaGlobe,
  FaInfoCircle,
  FaBed,
  FaRoute,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function DestinationPage() {
  const { data: session, status } = useSession();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const categories = [
    { value: "Historical", label: "ঐতিহাসিক" },
    { value: "Natural", label: "প্রাকৃতিক" },
    { value: "Religious", label: "ধর্মীয়" },
    { value: "Entertainment", label: "বিনোদন কেন্দ্র" },
  ];

  const districts = [
    { value: "gobindaganj", label: "গোবিন্দগঞ্জ" },
    { value: "bogura", label: "বগুড়া" },
    { value: "rajshahi", label: "রাজশাহী" },
    { value: "chapainawabganj", label: "চাঁপাইনবাবগঞ্জ" },
    { value: "naogaon", label: "নওগাঁ" },
    { value: "sirajganj", label: "সিরাজগঞ্জ" },
    { value: "pabna", label: "পাবনা" },
    { value: "joypurhat", label: "জয়পুরহাট" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    image: "",
    mapLink: "",
    district: "gobindaganj",
    stayInfo: "",
    travelInfo: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/destinations");
      const data = await res.json();

      if (res.ok) {
        setDestinations(data.destinations || []);
      }
    } catch (error) {
      console.error("Error loading destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "গন্তব্যের নাম প্রয়োজন";
    if (!formData.location.trim()) newErrors.location = "অবস্থান প্রয়োজন";
    if (!formData.category) newErrors.category = "বিভাগ নির্বাচন করুন";
    if (!formData.image) newErrors.image = "ছবি প্রয়োজন";
    if (formData.mapLink && !/^https?:\/\//i.test(formData.mapLink)) {
      newErrors.mapLink = "সঠিক Google Map লিংক দিন (http/https দিয়ে শুরু)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "শুধুমাত্র ছবি ফাইল আপলোড করা যাবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ছবির সাইজ ১০ MB এর বেশি হতে পারবে না",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setImageUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormData({ ...formData, image: data.imageUrl });
        setImagePreview(data.imageUrl);
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ছবি সফলভাবে আপলোড হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ছবি আপলোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleEdit = (destination) => {
    setEditingId(destination.id);
    setFormData({
      name: destination.name || "",
      location: destination.location || "",
      category: destination.category || "",
      image: destination.image || "",
      mapLink: destination.mapLink || "",
      district: destination.district || "gobindaganj",
      stayInfo: destination.stayInfo || "",
      travelInfo: destination.travelInfo || "",
      description: destination.description || "",
    });
    setImagePreview(destination.image || "");
    setShowCreateModal(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নিশ্চিত করুন",
      text: "আপনি কি এই গন্তব্য মুছে ফেলতে চান?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/destinations/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "গন্তব্য সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
          loadDestinations();
        } else {
          throw new Error(data.error || "Failed to delete destination");
        }
      } catch (error) {
        console.error("Error deleting destination:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.message || "গন্তব্য মুছে ফেলতে সমস্যা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "গন্তব্যের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (imageUploading) {
      Swal.fire({
        icon: "info",
        title: "অনুগ্রহ করে অপেক্ষা করুন",
        text: "ছবি আপলোড শেষ না হওয়া পর্যন্ত অপেক্ষা করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        res = await fetch(`/api/destinations/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/destinations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: editingId
            ? "গন্তব্যের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন গন্তব্য সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadDestinations();
        });
      } else {
        throw new Error(data.error || "Failed to save destination");
      }
    } catch (error) {
      console.error("Error saving destination:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "গন্তব্য যোগ করতে সমস্যা হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setShowCreateModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      location: "",
      category: "",
      image: "",
      mapLink: "",
      district: "gobindaganj",
      stayInfo: "",
      travelInfo: "",
      description: "",
    });
    setImagePreview("");
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ভ্রমণ গন্তব্য</h1>
          <p className="mt-1 text-sm text-slate-600">
            গন্তব্যের তথ্য যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন গন্তব্য যোগ করুন
        </button>
      </div>

      {/* Destinations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : destinations.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaMapMarkerAlt className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো গন্তব্যের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম গন্তব্যের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200"
            >
              {destination.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {destination.name}
                  </h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                    {categories.find((c) => c.value === destination.category)
                      ?.label || destination.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  {destination.location}
                </p>
                {destination.description && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {destination.description}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(destination)}
                    className="flex-1 text-blue-600 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded text-sm font-medium"
                  >
                    <FaEdit className="inline mr-1" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => handleDelete(destination.id)}
                    className="flex-1 text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded text-sm font-medium"
                  >
                    <FaTrash className="inline mr-1" />
                    মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Destination Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "গন্তব্য সম্পাদনা করুন"
                        : "নতুন গন্তব্য যোগ করুন"}
                    </h2>
                    <p className="text-indigo-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-indigo-200 text-2xl transition"
                >
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-indigo-500" />
                    গন্তব্যের নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: মহাস্থানগড়"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.name
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-red-500" />
                    অবস্থান <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="উপজেলা বা এলাকা"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.location
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaInfoCircle className="mr-2 h-4 w-4 text-blue-500" />
                    বিভাগ <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.category
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  >
                    <option value="">বাছাই করুন</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-green-500" />
                    জেলা
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all"
                  >
                    {districts.map((district) => (
                      <option key={district.value} value={district.value}>
                        {district.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Map Link */}
                <div className="lg:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaGlobe className="mr-2 h-4 w-4 text-cyan-500" />
                    Google Map লিংক (ঐচ্ছিক)
                  </label>
                  <input
                    type="url"
                    name="mapLink"
                    value={formData.mapLink}
                    onChange={handleChange}
                    placeholder="Google Maps এর শেয়ার লিংক পেস্ট করুন"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.mapLink
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
                    }`}
                  />
                  {errors.mapLink && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.mapLink}
                    </p>
                  )}
                  {formData.mapLink && (
                    <a
                      href={formData.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-sm underline inline-flex items-center gap-1 mt-2"
                    >
                      লিংক খুলুন
                      <FaGlobe className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Image Upload */}
                <div className="lg:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaImage className="mr-2 h-4 w-4 text-purple-500" />
                    গন্তব্যের ছবি <span className="text-rose-600">*</span>
                  </label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-48 w-full rounded-xl object-cover border-4 border-green-200 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData({ ...formData, image: "" });
                        }}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                      <div className="mt-2 flex items-center justify-center text-green-600">
                        <FaCheck className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">
                          ছবি সফলভাবে আপলোড হয়েছে
                        </span>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-purple-400 transition-colors">
                      <FaUpload className="mb-3 h-8 w-8 text-slate-400" />
                      <p className="text-slate-600 mb-2">
                        {imageUploading ? (
                          <span className="flex items-center gap-2">
                            <FaSpinner className="animate-spin text-purple-500" />
                            ছবি আপলোড হচ্ছে...
                          </span>
                        ) : (
                          "ছবি নির্বাচন করুন বা এখানে ড্রপ করুন"
                        )}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.image && (
                    <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                {/* Stay Info */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaBed className="mr-2 h-4 w-4 text-orange-500" />
                    থাকার ব্যবস্থা
                  </label>
                  <textarea
                    name="stayInfo"
                    value={formData.stayInfo}
                    onChange={handleChange}
                    rows="4"
                    placeholder="হোটেল, গেস্ট হাউস, যোগাযোগের তথ্য..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all resize-none"
                  />
                </div>

                {/* Travel Info */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaRoute className="mr-2 h-4 w-4 text-teal-500" />
                    যাওয়ার উপায়
                  </label>
                  <textarea
                    name="travelInfo"
                    value={formData.travelInfo}
                    onChange={handleChange}
                    rows="4"
                    placeholder="বাস, ট্রেন, বা অন্যান্য পরিবহন তথ্য..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all resize-none"
                  />
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaInfoCircle className="mr-2 h-4 w-4 text-pink-500" />
                    বিস্তারিত বিবরণ
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="গন্তব্যটি সম্পর্কে আরও বিস্তারিত তথ্য, ইতিহাস, আকর্ষণীয় বিষয়াদি..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={createLoading || imageUploading}
                  className={`flex-1 rounded-xl px-4 py-3 font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                    createLoading || imageUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  }`}
                >
                  {createLoading ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>
                      <FaMapMarkerAlt className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "গন্তব্য যোগ করুন"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

