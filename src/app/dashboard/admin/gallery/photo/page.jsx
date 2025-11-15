"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaImage,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaTimes,
  FaCheck,
  FaEye,
  FaTag,
} from "react-icons/fa";

export default function PhotoGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    tags: "",
  });

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    loadPhotos();
  }, [session, status, router]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/admin/gallery/photos?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setPhotos(data.photos || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ফটো লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading photos:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ফটো লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPhotos();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter only image files
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "কিছু ফাইল ছবি নয় এবং উপেক্ষা করা হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
    }

    if (imageFiles.length === 0) return;

    // Create previews for all files
    const previewPromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ file, preview: reader.result });
        };
        reader.onerror = () => {
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    });

    const newPreviews = await Promise.all(previewPromises);
    const validPreviews = newPreviews.filter((preview) => preview !== null);

    setSelectedFiles((prev) => [...prev, ...imageFiles]);
    setPreviews((prev) => [...prev, ...validPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: uploadFormData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Image upload failed");
    }

    return data.imageUrl;
  };

  const handleAddPhotos = async () => {
    if (selectedFiles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে অন্তত একটি ছবি নির্বাচন করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload all images
      const uploadPromises = selectedFiles.map((file) => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      // Create photo objects
      const photosToCreate = imageUrls.map((imageUrl, index) => ({
        title: formData.title || `Photo ${index + 1}`,
        description: formData.description || "",
        imageUrl,
        category: formData.category || "general",
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      }));

      // Save photos to database
      const res = await fetch("/api/admin/gallery/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photos: photosToCreate }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: `${photosToCreate.length}টি ছবি সফলভাবে যোগ করা হয়েছে`,
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "general",
          tags: "",
        });
        setSelectedFiles([]);
        setPreviews([]);
        setShowAddModal(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        loadPhotos();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ছবি যোগ করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error adding photos:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "ছবি যোগ করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title || "",
      description: photo.description || "",
      category: photo.category || "general",
      tags: photo.tags ? photo.tags.join(", ") : "",
    });
    setShowEditModal(true);
  };

  const handleUpdatePhoto = async () => {
    if (!editingPhoto) return;

    try {
      setUploading(true);

      const res = await fetch(`/api/admin/gallery/photos/${editingPhoto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags
            ? formData.tags.split(",").map((tag) => tag.trim())
            : [],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ছবি সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        setShowEditModal(false);
        setEditingPhoto(null);
        setFormData({
          title: "",
          description: "",
          category: "general",
          tags: "",
        });
        loadPhotos();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ছবি আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ছবি আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId, photoTitle) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ছবি মুছে ফেলুন?",
      html: `<p>আপনি কি নিশ্চিত যে আপনি "<strong>${photoTitle || "এই ছবি"}</strong>" মুছে ফেলতে চান?</p><p class="text-sm text-red-600 mt-2">এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>`,
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery/photos?photoId=${photoId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ছবি সফলভাবে মুছে ফেলা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        loadPhotos();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ছবি মুছে ফেলতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ছবি মুছে ফেলতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const formatDate = (date) => {
    if (!date) return "নির্ধারিত নয়";
    try {
      return new Date(date).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "নির্ধারিত নয়";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "ফটো লোড হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaImage className="text-blue-600" />
            ফটো গ্যালারী
          </h1>
          <p className="text-slate-600 mt-1">
            ফটো গ্যালারী পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          <span>নতুন ছবি যোগ করুন</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট ছবি</p>
          <p className="text-2xl font-bold text-slate-900">{photos.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">এই মাসে</p>
          <p className="text-2xl font-bold text-blue-700">
            {
              photos.filter((photo) => {
                const photoDate = new Date(photo.createdAt);
                const now = new Date();
                return (
                  photoDate.getMonth() === now.getMonth() &&
                  photoDate.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">আজ</p>
          <p className="text-2xl font-bold text-green-700">
            {
              photos.filter((photo) => {
                const photoDate = new Date(photo.createdAt);
                const now = new Date();
                return (
                  photoDate.getDate() === now.getDate() &&
                  photoDate.getMonth() === now.getMonth() &&
                  photoDate.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ছবির শিরোনাম, বিবরণ বা ক্যাটেগরি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FaImage className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">কোন ছবি পাওয়া যায়নি</p>
          <p className="text-slate-400 text-sm mb-4">
            নতুন ছবি যোগ করতে &quot;নতুন ছবি যোগ করুন&quot; বাটনে ক্লিক করুন
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            <span>নতুন ছবি যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Photo */}
              <div className="relative aspect-square bg-slate-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id, photo.title)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Photo Info */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1 truncate">
                  {photo.title || "Untitled"}
                </h3>
                {photo.description && (
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                    {photo.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaTag />
                    {photo.category}
                  </span>
                  <span>{formatDate(photo.createdAt).split(",")[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                নতুন ছবি যোগ করুন
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFiles([]);
                  setPreviews([]);
                  setFormData({
                    title: "",
                    description: "",
                    category: "general",
                    tags: "",
                  });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ছবি নির্বাচন করুন (একাধিক) <span className="text-red-600">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FaUpload className="text-4xl text-slate-400" />
                    <span className="text-slate-600 font-medium">
                      ক্লিক করুন বা ছবিগুলো এখানে ড্র্যাগ করুন
                    </span>
                    <span className="text-sm text-slate-400">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </label>
                </div>

                {/* File Previews */}
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative border border-slate-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={preview.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                        <div className="p-2 bg-white">
                          <p className="text-xs text-slate-600 truncate">
                            {preview.file.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(preview.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="ছবির শিরোনাম"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ক্যাটেগরি
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">সাধারণ</option>
                    <option value="event">ইভেন্ট</option>
                    <option value="campaign">ক্যাম্পেইন</option>
                    <option value="donation">রক্তদান</option>
                    <option value="award">পুরস্কার</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  বিবরণ
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="ছবির বিবরণ"
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ট্যাগ (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="ট্যাগ1, ট্যাগ2, ট্যাগ3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFiles([]);
                  setPreviews([]);
                  setFormData({
                    title: "",
                    description: "",
                    category: "general",
                    tags: "",
                  });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleAddPhotos}
                disabled={uploading || selectedFiles.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>যোগ করুন ({selectedFiles.length}টি)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Photo Modal */}
      {showEditModal && editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                ছবি সম্পাদনা করুন
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPhoto(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "general",
                    tags: "",
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo Preview */}
              <div className="flex justify-center">
                <img
                  src={editingPhoto.imageUrl}
                  alt={editingPhoto.title}
                  className="max-w-full h-64 object-contain rounded-lg border border-slate-200"
                />
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    শিরোনাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="ছবির শিরোনাম"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ক্যাটেগরি <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">সাধারণ</option>
                    <option value="event">ইভেন্ট</option>
                    <option value="campaign">ক্যাম্পেইন</option>
                    <option value="donation">রক্তদান</option>
                    <option value="award">পুরস্কার</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  বিবরণ
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="ছবির বিবরণ"
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ট্যাগ (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="ট্যাগ1, ট্যাগ2, ট্যাগ3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPhoto(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "general",
                    tags: "",
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleUpdatePhoto}
                disabled={uploading || !formData.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>আপডেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>আপডেট করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

