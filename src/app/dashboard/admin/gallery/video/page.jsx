"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaVideo,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaTag,
  FaCalendarAlt,
  FaYoutube,
  FaLink,
} from "react-icons/fa";

export default function VideoGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    youtubeUrl: "",
    duration: "",
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

    loadVideos();
  }, [session, status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadVideos();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/admin/gallery/videos?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setVideos(data.videos || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ভিডিও লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading videos:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ভিডিও লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return "";
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleAddVideo = async () => {
    if (!formData.youtubeUrl) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে YouTube link প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const youtubeId = extractYouTubeId(formData.youtubeUrl);
    if (!youtubeId) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "অবৈধ YouTube link। অনুগ্রহ করে একটি বৈধ YouTube link প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setUploading(true);

      const videoData = {
        title: formData.title || "Untitled Video",
        description: formData.description || "",
        youtubeUrl: formData.youtubeUrl,
        thumbnailUrl: getYouTubeThumbnail(formData.youtubeUrl),
        category: formData.category || "",
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        duration: formData.duration || "",
      };

      // Save video to database
      const res = await fetch("/api/admin/gallery/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videos: [videoData] }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ভিডিও সফলভাবে যোগ করা হয়েছে",
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
          tags: "",
          youtubeUrl: "",
          duration: "",
        });
        setShowAddModal(false);
        loadVideos();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ভিডিও যোগ করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error adding video:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "ভিডিও যোগ করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || "",
      description: video.description || "",
      category: video.category || "",
      tags: video.tags ? video.tags.join(", ") : "",
      youtubeUrl: video.youtubeUrl || "",
      duration: video.duration || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo) return;

    if (!formData.youtubeUrl) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে YouTube link প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const youtubeId = extractYouTubeId(formData.youtubeUrl);
    if (!youtubeId) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "অবৈধ YouTube link। অনুগ্রহ করে একটি বৈধ YouTube link প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setUploading(true);

      const res = await fetch(`/api/admin/gallery/videos/${editingVideo.id}`, {
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
          youtubeUrl: formData.youtubeUrl,
          thumbnailUrl: getYouTubeThumbnail(formData.youtubeUrl),
          duration: formData.duration,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ভিডিও সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        setShowEditModal(false);
        setEditingVideo(null);
        setFormData({
          title: "",
          description: "",
          category: "",
          tags: "",
          youtubeUrl: "",
          duration: "",
        });
        loadVideos();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ভিডিও আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating video:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ভিডিও আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId, videoTitle) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ভিডিও মুছে ফেলুন?",
      html: `<p>আপনি কি নিশ্চিত যে আপনি "<strong>${videoTitle || "এই ভিডিও"}</strong>" মুছে ফেলতে চান?</p><p class="text-sm text-red-600 mt-2">এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>`,
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
      const res = await fetch(`/api/admin/gallery/videos?videoId=${videoId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ভিডিও সফলভাবে মুছে ফেলা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        loadVideos();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ভিডিও মুছে ফেলতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ভিডিও মুছে ফেলতে ব্যর্থ হয়েছে",
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
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "ভিডিও লোড হচ্ছে..."}
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
            <FaVideo className="text-red-600" />
            ভিডিও গ্যালারী
          </h1>
          <p className="text-slate-600 mt-1">
            ভিডিও গ্যালারী পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaPlus />
          <span>নতুন ভিডিও যোগ করুন</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট ভিডিও</p>
          <p className="text-2xl font-bold text-slate-900">{videos.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">এই মাসে</p>
          <p className="text-2xl font-bold text-red-700">
            {
              videos.filter((video) => {
                const videoDate = new Date(video.createdAt);
                const now = new Date();
                return (
                  videoDate.getMonth() === now.getMonth() &&
                  videoDate.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">আজ</p>
          <p className="text-2xl font-bold text-green-700">
            {
              videos.filter((video) => {
                const videoDate = new Date(video.createdAt);
                const now = new Date();
                return (
                  videoDate.getDate() === now.getDate() &&
                  videoDate.getMonth() === now.getMonth() &&
                  videoDate.getFullYear() === now.getFullYear()
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
            placeholder="ভিডিওর শিরোনাম, বিবরণ বা ক্যাটেগরি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FaVideo className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">কোন ভিডিও পাওয়া যায়নি</p>
          <p className="text-slate-400 text-sm mb-4">
            নতুন ভিডিও যোগ করতে &quot;নতুন ভিডিও যোগ করুন&quot; বাটনে ক্লিক করুন
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaPlus />
            <span>নতুন ভিডিও যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-slate-100">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <FaVideo className="text-4xl text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <FaTrash />
                  </button>
                </div>
                {/* YouTube Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-4 opacity-80 hover:opacity-100 transition-opacity">
                    <FaYoutube className="text-white text-2xl" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1 truncate">
                  {video.title || "Untitled"}
                </h3>
                {video.description && (
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaTag />
                    {video.category}
                  </span>
                  <span>{formatDate(video.createdAt).split(",")[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                নতুন ভিডিও যোগ করুন
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    tags: "",
                    youtubeUrl: "",
                    duration: "",
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaYoutube className="inline mr-2 text-red-600" />
                  YouTube Link <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  YouTube video URL বা embed link দিন
                </p>
                {formData.youtubeUrl && extractYouTubeId(formData.youtubeUrl) && (
                  <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                    <img
                      src={getYouTubeThumbnail(formData.youtubeUrl)}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaVideo className="inline mr-2 text-red-600" />
                    শিরোনাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="ভিডিওর শিরোনাম"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaTag className="inline mr-2 text-purple-600" />
                    ক্যাটেগরি <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="উদাহরণ: সাধারণ, ইভেন্ট, ক্যাম্পেইন"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
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
                  placeholder="ভিডিওর বিবরণ"
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaTag className="inline mr-2 text-gray-600" />
                    ট্যাগ (কমা দিয়ে আলাদা করুন)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="ট্যাগ1, ট্যাগ2, ট্যাগ3"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-green-600" />
                    সময়কাল (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="উদাহরণ: ৫:৩০"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
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
                    tags: "",
                    youtubeUrl: "",
                    duration: "",
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleAddVideo}
                disabled={uploading || !formData.youtubeUrl}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

      {/* Edit Video Modal */}
      {showEditModal && editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                ভিডিও সম্পাদনা করুন
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingVideo(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    tags: "",
                    youtubeUrl: "",
                    duration: "",
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Video Preview */}
              {editingVideo.thumbnailUrl && (
                <div className="flex justify-center">
                  <img
                    src={editingVideo.thumbnailUrl}
                    alt={editingVideo.title}
                    className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaYoutube className="inline mr-2 text-red-600" />
                  YouTube Link <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {formData.youtubeUrl && extractYouTubeId(formData.youtubeUrl) && (
                  <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                    <img
                      src={getYouTubeThumbnail(formData.youtubeUrl)}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaVideo className="inline mr-2 text-red-600" />
                    শিরোনাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="ভিডিওর শিরোনাম"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaTag className="inline mr-2 text-purple-600" />
                    ক্যাটেগরি <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="উদাহরণ: সাধারণ, ইভেন্ট, ক্যাম্পেইন"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
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
                  placeholder="ভিডিওর বিবরণ"
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaTag className="inline mr-2 text-gray-600" />
                    ট্যাগ (কমা দিয়ে আলাদা করুন)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="ট্যাগ1, ট্যাগ2, ট্যাগ3"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-green-600" />
                    সময়কাল (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="উদাহরণ: ৫:৩০"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingVideo(null);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    tags: "",
                    youtubeUrl: "",
                    duration: "",
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleUpdateVideo}
                disabled={uploading || !formData.title || !formData.youtubeUrl}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

