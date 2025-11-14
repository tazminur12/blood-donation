"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaGavel,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaBriefcase,
  FaMoneyBillWave,
} from "react-icons/fa";
import Swal from "sweetalert2";

const lawyerCategories = [
  "ফৌজদারি আইন",
  "পারিবারিক আইন",
  "জমিজমা আইন",
  "শ্রম আইন",
  "ব্যবসায়িক আইন",
  "সাইবার আইন",
  "সংবিধানিক আইন",
  "অন্যান্য",
];

export default function LawyerPage() {
  const { data: session, status } = useSession();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
    chamber: "",
    experience: "",
    consultationFee: "",
    bio: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/lawyers");
      const data = await res.json();

      if (res.ok) {
        setLawyers(data.lawyers || []);
      }
    } catch (error) {
      console.error("Error loading lawyers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "নাম প্রয়োজন";
    if (!formData.phone.trim()) newErrors.phone = "ফোন নম্বর প্রয়োজন";
    else if (!/^01[3-9]\d{8}$/.test(formData.phone))
      newErrors.phone = "সঠিক মোবাইল নম্বর লিখুন";
    if (!formData.category) newErrors.category = "বিশেষায়িত ক্ষেত্র নির্বাচন করুন";
    if (!formData.chamber) newErrors.chamber = "চেম্বার ঠিকানা প্রয়োজন";
    if (!formData.experience) newErrors.experience = "অভিজ্ঞতা প্রয়োজন";
    if (!formData.consultationFee) newErrors.consultationFee = "কনসাল্টেশন ফি প্রয়োজন";

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

  const handleEdit = (lawyer) => {
    setEditingId(lawyer.id);
    setFormData({
      name: lawyer.name || "",
      phone: lawyer.phone || "",
      email: lawyer.email || "",
      category: lawyer.category || "",
      chamber: lawyer.chamber || "",
      experience: lawyer.experience || "",
      consultationFee: lawyer.consultationFee || "",
      bio: lawyer.bio || "",
      image: lawyer.image || "",
    });
    setImagePreview(lawyer.image || "");
    setErrors({});
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নিশ্চিত করুন",
      text: "আপনি কি এই আইনজীবী মুছে ফেলতে চান?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/lawyers/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "আইনজীবী সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
          loadLawyers();
        } else {
          throw new Error(data.error || "Failed to delete lawyer");
        }
      } catch (error) {
        console.error("Error deleting lawyer:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.message || "আইনজীবী মুছে ফেলতে সমস্যা হয়েছে",
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
        text: "আইনজীবীর তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ফর্মে কিছু ত্রুটি আছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        res = await fetch(`/api/lawyers/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/lawyers", {
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
            ? "আইনজীবীর তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন আইনজীবী সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadLawyers();
        });
      } else {
        throw new Error(data.error || "Failed to save lawyer");
      }
    } catch (error) {
      console.error("Error saving lawyer:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "আইনজীবী যোগ করতে সমস্যা হয়েছে",
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
      phone: "",
      email: "",
      category: "",
      chamber: "",
      experience: "",
      consultationFee: "",
      bio: "",
      image: "",
    });
    setImagePreview("");
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">আইনজীবী</h1>
          <p className="mt-1 text-sm text-slate-600">
            আইনজীবীর তথ্য যোগ করুন এবং সম্পাদনা করুন
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
          নতুন আইনজীবী যোগ করুন
        </button>
      </div>

      {/* Lawyers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : lawyers.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaGavel className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো আইনজীবীর তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম আইনজীবীর তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {lawyer.image && (
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900">{lawyer.name}</h3>
              {lawyer.category && (
                <p className="mt-1 text-sm text-blue-600 font-medium">{lawyer.category}</p>
              )}
              {lawyer.phone && (
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                  <FaPhone className="h-3 w-3" />
                  {lawyer.phone}
                </p>
              )}
              {lawyer.chamber && (
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                  <FaMapMarkerAlt className="h-3 w-3" />
                  {lawyer.chamber.substring(0, 50)}...
                </p>
              )}
              {lawyer.experience && (
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                  <FaBriefcase className="h-3 w-3" />
                  {lawyer.experience} বছর অভিজ্ঞতা
                </p>
              )}
              {lawyer.consultationFee && (
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                  <FaMoneyBillWave className="h-3 w-3" />
                  {lawyer.consultationFee} টাকা
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(lawyer)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  <FaEdit className="h-3 w-3" />
                  সম্পাদনা
                </button>
                <button
                  onClick={() => handleDelete(lawyer.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Lawyer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaGavel className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId ? "আইনজীবী সম্পাদনা করুন" : "নতুন আইনজীবী যোগ করুন"}
                    </h2>
                    <p className="text-blue-100 mt-1 text-sm">সব তথ্য সঠিকভাবে পূরণ করুন</p>
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
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUser className="mr-2 h-4 w-4 text-blue-500" />
                    পূর্ণ নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.name
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaPhone className="mr-2 h-4 w-4 text-green-500" />
                    মোবাইল নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="০১XXXXXXXXX"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-green-500 focus:ring-green-100"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaEnvelope className="mr-2 h-4 w-4 text-purple-500" />
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="আপনার ইমেইল লিখুন"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaGavel className="mr-2 h-4 w-4 text-indigo-500" />
                    বিশেষায়িত ক্ষেত্র <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.category
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  >
                    <option value="">বিশেষায়িত ক্ষেত্র নির্বাচন করুন</option>
                    {lawyerCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaBriefcase className="mr-2 h-4 w-4 text-orange-500" />
                    অভিজ্ঞতা (বছর) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="অভিজ্ঞতার বছর সংখ্যা"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.experience
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-orange-500 focus:ring-orange-100"
                    }`}
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                  )}
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMoneyBillWave className="mr-2 h-4 w-4 text-green-500" />
                    কনসাল্টেশন ফি <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="টাকার পরিমাণ"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.consultationFee
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-green-500 focus:ring-green-100"
                    }`}
                  />
                  {errors.consultationFee && (
                    <p className="mt-1 text-sm text-red-600">{errors.consultationFee}</p>
                  )}
                </div>

                {/* Chamber Address */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-red-500" />
                    চেম্বার ঠিকানা <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    name="chamber"
                    value={formData.chamber}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="আপনার চেম্বারের সম্পূর্ণ ঠিকানা লিখুন"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.chamber
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-red-500 focus:ring-red-100"
                    }`}
                  />
                  {errors.chamber && (
                    <p className="mt-1 text-sm text-red-600">{errors.chamber}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    সংক্ষিপ্ত পরিচয় (ঐচ্ছিক)
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="আপনার পেশাগত পরিচয় ও বিশেষজ্ঞতা সম্পর্কে লিখুন"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUpload className="mr-2 h-4 w-4 text-orange-500" />
                    ছবি আপলোড (ঐচ্ছিক)
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
                        <span className="text-sm font-medium">ছবি সফলভাবে আপলোড হয়েছে</span>
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
                      <FaGavel className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "আইনজীবী যোগ করুন"}
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

