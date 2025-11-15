"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaNewspaper,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaTag,
  FaCalendarAlt,
  FaFileImage,
  FaLink,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function GobindhagonjNewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    publishDate: "",
    imageUrl: "",
    link: "",
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

    loadNews();
  }, [session, status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNews();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/admin/gobindhagonj-news?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setNews(data.news || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "সংবাদ লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading news:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সংবাদ লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setFormData({
        ...formData,
        imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddNews = async () => {
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

      const res = await fetch("/api/admin/gobindhagonj-news", {
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
          text: "সংবাদ সফলভাবে যোগ করা হয়েছে",
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
          publishDate: "",
          imageUrl: "",
          link: "",
          isActive: true,
        });
        setShowAddModal(false);
        loadNews();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "সংবাদ যোগ করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error adding news:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "সংবাদ যোগ করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title || "",
      description: newsItem.description || "",
      category: newsItem.category || "",
      publishDate: newsItem.publishDate
        ? new Date(newsItem.publishDate).toISOString().split("T")[0]
        : "",
      imageUrl: newsItem.imageUrl || "",
      link: newsItem.link || "",
      isActive: newsItem.isActive !== undefined ? newsItem.isActive : true,
    });
    setShowEditModal(true);
  };

  const handleUpdateNews = async () => {
    if (!editingNews) return;

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

      const res = await fetch(`/api/admin/gobindhagonj-news/${editingNews.id}`, {
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
          text: "সংবাদ সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        setShowEditModal(false);
        setEditingNews(null);
        setFormData({
          title: "",
          description: "",
          category: "",
          publishDate: "",
          imageUrl: "",
          link: "",
          isActive: true,
        });
        loadNews();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "সংবাদ আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating news:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সংবাদ আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (newsId, newsTitle) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "সংবাদ মুছে ফেলুন?",
      html: `<p>আপনি কি নিশ্চিত যে আপনি "<strong>${newsTitle || "এই সংবাদ"}</strong>" মুছে ফেলতে চান?</p><p class="text-sm text-red-600 mt-2">এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>`,
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
      const res = await fetch(`/api/admin/gobindhagonj-news?newsId=${newsId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "সংবাদ সফলভাবে মুছে ফেলা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        loadNews();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "সংবাদ মুছে ফেলতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সংবাদ মুছে ফেলতে ব্যর্থ হয়েছে",
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
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "সংবাদ লোড হচ্ছে..."}
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
            <FaNewspaper className="text-purple-600" />
            Gobindhagonj News
          </h1>
          <p className="text-slate-600 mt-1">
            গোবিন্দগঞ্জের সংবাদ পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FaPlus />
          <span>নতুন সংবাদ যোগ করুন</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট সংবাদ</p>
          <p className="text-2xl font-bold text-slate-900">{news.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">সক্রিয়</p>
          <p className="text-2xl font-bold text-purple-700">
            {news.filter((n) => n.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-pink-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">এই মাসে</p>
          <p className="text-2xl font-bold text-pink-700">
            {
              news.filter((n) => {
                const newsDate = new Date(n.publishDate || n.createdAt);
                const now = new Date();
                return (
                  newsDate.getMonth() === now.getMonth() &&
                  newsDate.getFullYear() === now.getFullYear()
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
            placeholder="সংবাদের শিরোনাম, বিবরণ বা ক্যাটেগরি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* News List */}
      {news.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FaNewspaper className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">কোন সংবাদ পাওয়া যায়নি</p>
          <p className="text-slate-400 text-sm mb-4">
            নতুন সংবাদ যোগ করতে &quot;নতুন সংবাদ যোগ করুন&quot; বাটনে ক্লিক করুন
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaPlus />
            <span>নতুন সংবাদ যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((newsItem) => (
            <div
              key={newsItem.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              {newsItem.imageUrl && (
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="p-2 bg-white rounded-full text-purple-600 hover:bg-purple-50 transition-colors"
                      title="সম্পাদনা করুন"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.id, newsItem.title)}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}

              {/* News Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 flex-1">
                    {newsItem.title || "Untitled"}
                  </h3>
                  {!newsItem.isActive && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded ml-2">
                      <FaEyeSlash className="inline mr-1" />
                      নিষ্ক্রিয়
                    </span>
                  )}
                </div>
                {newsItem.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {newsItem.description}
                  </p>
                )}
                <div className="space-y-2 text-xs text-slate-500">
                  {newsItem.category && (
                    <div className="flex items-center gap-1">
                      <FaTag />
                      <span>{newsItem.category}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{formatDate(newsItem.publishDate)}</span>
                  </div>
                </div>
                {newsItem.link && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <a
                      href={newsItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium"
                    >
                      <FaLink />
                      <span>আরও পড়ুন</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add News Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                নতুন সংবাদ যোগ করুন
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    publishDate: "",
                    imageUrl: "",
                    link: "",
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
                  placeholder="সংবাদের শিরোনাম"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  placeholder="সংবাদের বিবরণ"
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                    placeholder="উদাহরণ: স্থানীয়, জাতীয়, আন্তর্জাতিক"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-green-600" />
                    প্রকাশনার তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) =>
                      setFormData({ ...formData, publishDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                    />
                    {uploading && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                        <FaSpinner className="animate-spin" />
                        <span>আপলোড হচ্ছে...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaLink className="inline mr-2 text-green-600" />
                  সংবাদের লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://example.com/news-article"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
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
                    publishDate: "",
                    imageUrl: "",
                    link: "",
                    isActive: true,
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleAddNews}
                disabled={uploading || !formData.title}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

      {/* Edit News Modal */}
      {showEditModal && editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                সংবাদ সম্পাদনা করুন
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingNews(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    publishDate: "",
                    imageUrl: "",
                    link: "",
                    isActive: true,
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview */}
              {editingNews.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={editingNews.imageUrl}
                    alt={editingNews.title}
                    className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}

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
                  placeholder="সংবাদের শিরোনাম"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  placeholder="সংবাদের বিবরণ"
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                    placeholder="উদাহরণ: স্থানীয়, জাতীয়, আন্তর্জাতিক"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-green-600" />
                    প্রকাশনার তারিখ
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) =>
                      setFormData({ ...formData, publishDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaFileImage className="inline mr-2 text-blue-600" />
                  ছবি (ঐচ্ছিক)
                </label>
                {editingNews.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={editingNews.imageUrl}
                      alt={editingNews.title}
                      className="max-w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {formData.imageUrl && formData.imageUrl !== editingNews.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="max-w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    {uploading && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                        <FaSpinner className="animate-spin" />
                        <span>আপলোড হচ্ছে...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaLink className="inline mr-2 text-green-600" />
                  সংবাদের লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://example.com/news-article"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
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
                  setEditingNews(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    publishDate: "",
                    imageUrl: "",
                    link: "",
                    isActive: true,
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleUpdateNews}
                disabled={uploading || !formData.title}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

