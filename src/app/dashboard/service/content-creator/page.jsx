"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaVideo,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaCheck,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function ContentCreatorPage() {
  const { data: session, status } = useSession();
  const [contentCreators, setContentCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    specialty: "",
    email: "",
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
  });

  useEffect(() => {
    loadContentCreators();
  }, []);

  const loadContentCreators = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content-creators");
      const data = await res.json();

      if (res.ok) {
        setContentCreators(data.contentCreators || []);
      }
    } catch (error) {
      console.error("Error loading content creators:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleEdit = (creator) => {
    setEditingId(creator.id);
    setFormData({
      name: creator.name || "",
      image: creator.image || "",
      specialty: creator.specialty || "",
      email: creator.email || "",
      facebook: creator.facebook || "",
      instagram: creator.instagram || "",
      youtube: creator.youtube || "",
      tiktok: creator.tiktok || "",
    });
    setImagePreview(creator.image || "");
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নিশ্চিত করুন",
      text: "আপনি কি এই কনটেন্ট ক্রিয়েটর মুছে ফেলতে চান?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/content-creators/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "কনটেন্ট ক্রিয়েটর সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
          loadContentCreators();
        } else {
          throw new Error(data.error || "Failed to delete content creator");
        }
      } catch (error) {
        console.error("Error deleting content creator:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.message || "কনটেন্ট ক্রিয়েটর মুছে ফেলতে সমস্যা হয়েছে",
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
        text: "কনটেন্ট ক্রিয়েটরের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!formData.name || !formData.specialty || !formData.email) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "নাম, বিশেষত্ব এবং ইমেইল প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        res = await fetch(`/api/content-creators/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/content-creators", {
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
            ? "কনটেন্ট ক্রিয়েটরের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন কনটেন্ট ক্রিয়েটর সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadContentCreators();
        });
      } else {
        throw new Error(data.error || "Failed to save content creator");
      }
    } catch (error) {
      console.error("Error saving content creator:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "কনটেন্ট ক্রিয়েটর যোগ করতে সমস্যা হয়েছে",
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
      image: "",
      specialty: "",
      email: "",
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    });
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">কনটেন্ট ক্রিয়েটর</h1>
          <p className="mt-1 text-sm text-slate-600">
            কনটেন্ট ক্রিয়েটরের তথ্য যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন কনটেন্ট ক্রিয়েটর যোগ করুন
        </button>
      </div>

      {/* Content Creators List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : contentCreators.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaVideo className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো কনটেন্ট ক্রিয়েটরের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম কনটেন্ট ক্রিয়েটরের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left border-b">
                <th className="py-3 px-4 font-semibold text-gray-700">ছবি</th>
                <th className="py-3 px-4 font-semibold text-gray-700">নাম</th>
                <th className="py-3 px-4 font-semibold text-gray-700">বিশেষত্ব</th>
                <th className="py-3 px-4 font-semibold text-gray-700">সোশ্যাল মিডিয়া</th>
                <th className="py-3 px-4 font-semibold text-gray-700">ইমেইল</th>
                <th className="py-3 px-4 font-semibold text-gray-700">কর্ম</th>
              </tr>
            </thead>
            <tbody>
              {contentCreators.map((creator) => (
                <tr key={creator.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    {creator.image ? (
                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {creator.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{creator.specialty}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {creator.facebook && (
                        <a
                          href={creator.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FaFacebook className="h-5 w-5" />
                        </a>
                      )}
                      {creator.instagram && (
                        <a
                          href={creator.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-700 transition"
                        >
                          <FaInstagram className="h-5 w-5" />
                        </a>
                      )}
                      {creator.youtube && (
                        <a
                          href={creator.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <FaYoutube className="h-5 w-5" />
                        </a>
                      )}
                      {creator.tiktok && (
                        <a
                          href={creator.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black hover:text-gray-700 transition"
                        >
                          <FaTiktok className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{creator.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(creator)}
                        className="text-blue-600 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(creator.id)}
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

      {/* Create/Edit Content Creator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaVideo className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "কনটেন্ট ক্রিয়েটর সম্পাদনা করুন"
                        : "নতুন কনটেন্ট ক্রিয়েটর যোগ করুন"}
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
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUser className="mr-2 h-4 w-4 text-purple-500" />
                    নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="কনটেন্ট ক্রিয়েটরের নাম"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>

                {/* Specialty */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaVideo className="mr-2 h-4 w-4 text-pink-500" />
                    বিশেষত্ব <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: ভিডিও এডিটিং, ফটোগ্রাফি"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaEnvelope className="mr-2 h-4 w-4 text-blue-500" />
                    ইমেইল <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Facebook */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaInstagram className="mr-2 h-4 w-4 text-pink-500" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaYoutube className="mr-2 h-4 w-4 text-red-600" />
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>

                {/* TikTok */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaTiktok className="mr-2 h-4 w-4 text-black" />
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
                  />
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
                      <FaVideo className="h-4 w-4" />
                      {editingId
                        ? "আপডেট করুন"
                        : "কনটেন্ট ক্রিয়েটর যোগ করুন"}
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

