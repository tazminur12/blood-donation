"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaNewspaper,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaCheck,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaBriefcase,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function JournalistPage() {
  const { data: session, status } = useSession();
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const mediaTypes = [
    { value: "newspaper", label: "সংবাদপত্র" },
    { value: "tv", label: "টেলিভিশন" },
    { value: "online", label: "অনলাইন পোর্টাল" },
    { value: "radio", label: "রেডিও" },
    { value: "magazine", label: "ম্যাগাজিন" },
  ];

  const beats = [
    "রাজনীতি",
    "অপরাধ",
    "খেলা",
    "বিনোদন",
    "অর্থনীতি",
    "আন্তর্জাতিক",
    "স্বাস্থ্য",
    "শিক্ষা",
    "প্রযুক্তি",
  ];

  const districts = [
    "চাঁপাইনবাবগঞ্জ",
    "নওগাঁ",
    "রাজশাহী",
    "সিরাজগঞ্জ",
    "পাবনা",
    "বগুড়া",
    "জয়পুরহাট",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    mediaType: "newspaper",
    mediaName: "",
    mediaWebsite: "",
    beat: "",
    district: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadJournalists();
  }, []);

  const loadJournalists = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/journalists");
      const data = await res.json();

      if (res.ok) {
        setJournalists(data.journalists || []);
      }
    } catch (error) {
      console.error("Error loading journalists:", error);
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
    if (!formData.name.trim()) newErrors.name = "নাম প্রয়োজন";
    if (!formData.email.trim()) {
      newErrors.email = "ইমেইল প্রয়োজন";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "সঠিক ইমেইল দিন";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "ফোন নম্বর প্রয়োজন";
    } else if (!/^(?:\+88|01)?\d{11}$/.test(formData.phone)) {
      newErrors.phone = "সঠিক ফোন নম্বর দিন";
    }
    if (!formData.designation.trim()) newErrors.designation = "পদবি প্রয়োজন";
    if (!formData.mediaName.trim()) newErrors.mediaName = "মিডিয়ার নাম প্রয়োজন";
    if (!formData.beat) newErrors.beat = "বিট নির্বাচন করুন";
    if (!formData.district) newErrors.district = "জেলা নির্বাচন করুন";
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

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ছবির সাইজ ৫ MB এর বেশি হতে পারবে না",
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

  const handleEdit = (journalist) => {
    setEditingId(journalist.id);
    setFormData({
      name: journalist.name || "",
      email: journalist.email || "",
      phone: journalist.phone || "",
      designation: journalist.designation || "",
      mediaType: journalist.mediaType || "newspaper",
      mediaName: journalist.mediaName || "",
      mediaWebsite: journalist.mediaWebsite || "",
      beat: journalist.beat || "",
      district: journalist.district || "",
      image: journalist.image || "",
    });
    setImagePreview(journalist.image || "");
    setShowCreateModal(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নিশ্চিত করুন",
      text: "আপনি কি এই সাংবাদিক মুছে ফেলতে চান?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/journalists/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "সাংবাদিক সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
          loadJournalists();
        } else {
          throw new Error(data.error || "Failed to delete journalist");
        }
      } catch (error) {
        console.error("Error deleting journalist:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.message || "সাংবাদিক মুছে ফেলতে সমস্যা হয়েছে",
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
        text: "সাংবাদিকের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
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
        res = await fetch(`/api/journalists/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/journalists", {
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
            ? "সাংবাদিকের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন সাংবাদিক সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadJournalists();
        });
      } else {
        throw new Error(data.error || "Failed to save journalist");
      }
    } catch (error) {
      console.error("Error saving journalist:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "সাংবাদিক যোগ করতে সমস্যা হয়েছে",
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
      email: "",
      phone: "",
      designation: "",
      mediaType: "newspaper",
      mediaName: "",
      mediaWebsite: "",
      beat: "",
      district: "",
      image: "",
    });
    setImagePreview("");
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">সাংবাদিক</h1>
          <p className="mt-1 text-sm text-slate-600">
            সাংবাদিকের তথ্য যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন সাংবাদিক যোগ করুন
        </button>
      </div>

      {/* Journalists List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : journalists.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaNewspaper className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো সাংবাদিকের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম সাংবাদিকের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left border-b">
                <th className="py-3 px-4 font-semibold text-gray-700">ছবি</th>
                <th className="py-3 px-4 font-semibold text-gray-700">নাম</th>
                <th className="py-3 px-4 font-semibold text-gray-700">পদবি</th>
                <th className="py-3 px-4 font-semibold text-gray-700">মিডিয়া</th>
                <th className="py-3 px-4 font-semibold text-gray-700">বিট</th>
                <th className="py-3 px-4 font-semibold text-gray-700">জেলা</th>
                <th className="py-3 px-4 font-semibold text-gray-700">ইমেইল</th>
                <th className="py-3 px-4 font-semibold text-gray-700">ফোন</th>
                <th className="py-3 px-4 font-semibold text-gray-700">কর্ম</th>
              </tr>
            </thead>
            <tbody>
              {journalists.map((journalist) => (
                <tr key={journalist.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    {journalist.image ? (
                      <img
                        src={journalist.image}
                        alt={journalist.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {journalist.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {journalist.designation}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div>
                      <div className="font-medium">{journalist.mediaName}</div>
                      <div className="text-xs text-gray-500">
                        {mediaTypes.find((t) => t.value === journalist.mediaType)?.label || journalist.mediaType}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{journalist.beat}</td>
                  <td className="py-3 px-4 text-gray-600">{journalist.district}</td>
                  <td className="py-3 px-4 text-gray-600">{journalist.email}</td>
                  <td className="py-3 px-4 text-gray-600">{journalist.phone}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(journalist)}
                        className="text-blue-600 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(journalist.id)}
                        className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Journalist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaNewspaper className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "সাংবাদিক সম্পাদনা করুন"
                        : "নতুন সাংবাদিক যোগ করুন"}
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
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUser className="mr-2 h-4 w-4 text-blue-500" />
                    নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="সাংবাদিকের নাম"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.name
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaEnvelope className="mr-2 h-4 w-4 text-green-500" />
                    ইমেইল <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.email
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-green-500 focus:ring-green-100"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaPhone className="mr-2 h-4 w-4 text-purple-500" />
                    ফোন <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="01XXXXXXXXX"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-purple-500 focus:ring-purple-100"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaBriefcase className="mr-2 h-4 w-4 text-orange-500" />
                    পদবি <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: সিনিয়র রিপোর্টার"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.designation
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-orange-500 focus:ring-orange-100"
                    }`}
                  />
                  {errors.designation && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.designation}
                    </p>
                  )}
                </div>

                {/* Media Type */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaNewspaper className="mr-2 h-4 w-4 text-blue-600" />
                    মিডিয়ার ধরন <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="mediaType"
                    value={formData.mediaType}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    {mediaTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Media Name */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaNewspaper className="mr-2 h-4 w-4 text-indigo-500" />
                    মিডিয়ার নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="mediaName"
                    value={formData.mediaName}
                    onChange={handleChange}
                    required
                    placeholder="মিডিয়ার নাম"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.mediaName
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />
                  {errors.mediaName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.mediaName}
                    </p>
                  )}
                </div>

                {/* Media Website */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaGlobe className="mr-2 h-4 w-4 text-cyan-500" />
                    ওয়েবসাইট
                  </label>
                  <input
                    type="url"
                    name="mediaWebsite"
                    value={formData.mediaWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 transition-all"
                  />
                </div>

                {/* Beat */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaBriefcase className="mr-2 h-4 w-4 text-pink-500" />
                    বিট <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="beat"
                    value={formData.beat}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.beat
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-pink-500 focus:ring-pink-100"
                    }`}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {beats.map((beat) => (
                      <option key={beat} value={beat}>
                        {beat}
                      </option>
                    ))}
                  </select>
                  {errors.beat && (
                    <p className="text-red-600 text-sm mt-1">{errors.beat}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-red-500" />
                    জেলা <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.district
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUpload className="mr-2 h-4 w-4 text-orange-500" />
                    ছবি আপলোড
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
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-orange-400 transition-colors">
                      <FaUpload className="mb-3 h-8 w-8 text-slate-400" />
                      <p className="text-slate-600 mb-2">
                        {imageUploading ? (
                          <span className="flex items-center gap-2">
                            <FaSpinner className="animate-spin text-orange-500" />
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
                      <FaNewspaper className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "সাংবাদিক যোগ করুন"}
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

