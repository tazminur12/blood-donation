"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaBell,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaTag,
  FaCalendarAlt,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaDownload,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function NoticesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fileUrl: "",
    fileName: "",
    publishDate: "",
    expiryDate: "",
    isActive: true,
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

    loadNotices();
  }, [session, status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotices();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/admin/notices?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setNotices(data.notices || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "বিজ্ঞপ্তি লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading notices:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বিজ্ঞপ্তি লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: uploadFormData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "File upload failed");
    }

    return data.imageUrl;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileUrl = await uploadFile(file);
      setFormData({
        ...formData,
        fileUrl,
        fileName: file.name,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "ফাইল আপলোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFile />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FaFilePdf className="text-red-600" />;
    if (["doc", "docx"].includes(ext)) return <FaFileWord className="text-blue-600" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return <FaFileImage className="text-green-600" />;
    return <FaFile />;
  };

  const handleAddNotice = async () => {
    if (!formData.title) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে শিরোনাম প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setUploading(true);

      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "বিজ্ঞপ্তি সফলভাবে যোগ করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          fileUrl: "",
          fileName: "",
          publishDate: "",
          expiryDate: "",
          isActive: true,
        });
        setShowAddModal(false);
        loadNotices();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "বিজ্ঞপ্তি যোগ করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "বিজ্ঞপ্তি যোগ করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      category: notice.category || "",
      fileUrl: notice.fileUrl || "",
      fileName: notice.fileName || "",
      publishDate: notice.publishDate
        ? new Date(notice.publishDate).toISOString().split("T")[0]
        : "",
      expiryDate: notice.expiryDate
        ? new Date(notice.expiryDate).toISOString().split("T")[0]
        : "",
      isActive: notice.isActive !== undefined ? notice.isActive : true,
    });
    setShowEditModal(true);
  };

  const handleUpdateNotice = async () => {
    if (!editingNotice) return;

    if (!formData.title) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে শিরোনাম প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setUploading(true);

      const res = await fetch(`/api/admin/notices/${editingNotice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "বিজ্ঞপ্তি সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        setShowEditModal(false);
        setEditingNotice(null);
        setFormData({
          title: "",
          description: "",
          category: "",
          fileUrl: "",
          fileName: "",
          publishDate: "",
          expiryDate: "",
          isActive: true,
        });
        loadNotices();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "বিজ্ঞপ্তি আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বিজ্ঞপ্তি আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (noticeId, noticeTitle) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "বিজ্ঞপ্তি মুছে ফেলুন?",
      html: `<p>আপনি কি নিশ্চিত যে আপনি "<strong>${noticeTitle || "এই বিজ্ঞপ্তি"}</strong>" মুছে ফেলতে চান?</p><p class="text-sm text-red-600 mt-2">এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>`,
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
      const res = await fetch(`/api/admin/notices?noticeId=${noticeId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "বিজ্ঞপ্তি সফলভাবে মুছে ফেলা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        loadNotices();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "বিজ্ঞপ্তি মুছে ফেলতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বিজ্ঞপ্তি মুছে ফেলতে ব্যর্থ হয়েছে",
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
      });
    } catch {
      return "নির্ধারিত নয়";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "বিজ্ঞপ্তি লোড হচ্ছে..."}
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
            <FaBell className="text-green-600" />
            সর্বশেষ বিজ্ঞপ্তি
          </h1>
          <p className="text-slate-600 mt-1">
            বিজ্ঞপ্তি পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>নতুন বিজ্ঞপ্তি যোগ করুন</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট বিজ্ঞপ্তি</p>
          <p className="text-2xl font-bold text-slate-900">{notices.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">সক্রিয়</p>
          <p className="text-2xl font-bold text-green-700">
            {notices.filter((n) => n.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মেয়াদ শেষ</p>
          <p className="text-2xl font-bold text-red-700">
            {
              notices.filter((n) => {
                if (!n.expiryDate) return false;
                return new Date(n.expiryDate) < new Date();
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
            placeholder="বিজ্ঞপ্তির শিরোনাম, বিবরণ বা ক্যাটেগরি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notices List */}
      {notices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FaBell className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">কোন বিজ্ঞপ্তি পাওয়া যায়নি</p>
          <p className="text-slate-400 text-sm mb-4">
            নতুন বিজ্ঞপ্তি যোগ করতে &quot;নতুন বিজ্ঞপ্তি যোগ করুন&quot; বাটনে ক্লিক করুন
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlus />
            <span>নতুন বিজ্ঞপ্তি যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {notice.title || "Untitled"}
                      </h3>
                      {!notice.isActive && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          <FaEyeSlash className="inline mr-1" />
                          নিষ্ক্রিয়
                        </span>
                      )}
                      {notice.expiryDate && new Date(notice.expiryDate) < new Date() && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                          মেয়াদ শেষ
                        </span>
                      )}
                    </div>
                    {notice.description && (
                      <p className="text-slate-600 mb-3 line-clamp-2">
                        {notice.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {notice.category && (
                        <span className="flex items-center gap-1">
                          <FaTag />
                          {notice.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        প্রকাশ: {formatDate(notice.publishDate)}
                      </span>
                      {notice.expiryDate && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          মেয়াদ: {formatDate(notice.expiryDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="সম্পাদনা করুন"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id, notice.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {notice.fileUrl && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <a
                      href={notice.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      {getFileIcon(notice.fileName)}
                      <span>{notice.fileName || "ফাইল ডাউনলোড করুন"}</span>
                      <FaDownload className="text-sm" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                নতুন বিজ্ঞপ্তি যোগ করুন
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    fileUrl: "",
                    fileName: "",
                    publishDate: "",
                    expiryDate: "",
                    isActive: true,
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                  placeholder="বিজ্ঞপ্তির শিরোনাম"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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
                  placeholder="বিজ্ঞপ্তির বিবরণ"
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaTag className="inline mr-2 text-purple-600" />
                  ক্যাটেগরি
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="উদাহরণ: সাধারণ, গুরুত্বপূর্ণ, ইভেন্ট"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-green-600" />
                    প্রকাশের তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) =>
                      setFormData({ ...formData, publishDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-red-600" />
                    মেয়াদ শেষের তারিখ (ঐচ্ছিক)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaFileImage className="inline mr-2 text-blue-600" />
                  ছবি (ঐচ্ছিক)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.fileUrl && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    {getFileIcon(formData.fileName)}
                    <span>{formData.fileName}</span>
                    {uploading && <FaSpinner className="animate-spin" />}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  সক্রিয়
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    fileUrl: "",
                    fileName: "",
                    publishDate: "",
                    expiryDate: "",
                    isActive: true,
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleAddNotice}
                disabled={uploading || !formData.title}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>যোগ করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>যোগ করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {showEditModal && editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                বিজ্ঞপ্তি সম্পাদনা করুন
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingNotice(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    fileUrl: "",
                    fileName: "",
                    publishDate: "",
                    expiryDate: "",
                    isActive: true,
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                  placeholder="বিজ্ঞপ্তির শিরোনাম"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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
                  placeholder="বিজ্ঞপ্তির বিবরণ"
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaTag className="inline mr-2 text-purple-600" />
                  ক্যাটেগরি
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="উদাহরণ: সাধারণ, গুরুত্বপূর্ণ, ইভেন্ট"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-green-600" />
                    প্রকাশের তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) =>
                      setFormData({ ...formData, publishDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-red-600" />
                    মেয়াদ শেষের তারিখ (ঐচ্ছিক)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaFileImage className="inline mr-2 text-blue-600" />
                  ছবি (ঐচ্ছিক)
                </label>
                {editingNotice.fileUrl && (
                  <div className="mb-2 flex items-center gap-2 text-sm text-green-600">
                    {getFileIcon(editingNotice.fileName)}
                    <span>{editingNotice.fileName}</span>
                    <a
                      href={editingNotice.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaDownload />
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.fileUrl && formData.fileUrl !== editingNotice.fileUrl && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    {getFileIcon(formData.fileName)}
                    <span>{formData.fileName}</span>
                    {uploading && <FaSpinner className="animate-spin" />}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isActiveEdit" className="text-sm text-slate-700">
                  সক্রিয়
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingNotice(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    fileUrl: "",
                    fileName: "",
                    publishDate: "",
                    expiryDate: "",
                    isActive: true,
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleUpdateNotice}
                disabled={uploading || !formData.title}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

