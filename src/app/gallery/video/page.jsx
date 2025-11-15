"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaVideo,
  FaSearch,
  FaFilter,
  FaTag,
  FaCalendarAlt,
  FaSpinner,
  FaTimes,
  FaPlay,
  FaYoutube,
} from "react-icons/fa";

export default function VideoGalleryPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadVideos();
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadVideos();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      params.append("limit", "100");

      const res = await fetch(`/api/gallery/videos?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setVideos(data.videos || []);
      } else {
        console.error("Error loading videos:", data.error);
      }
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/gallery/videos?limit=1");
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
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

  const openModal = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
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

  const categoryLabels = {
    general: "সাধারণ",
    event: "ইভেন্ট",
    campaign: "ক্যাম্পেইন",
    donation: "রক্তদান",
    award: "পুরস্কার",
    other: "অন্যান্য",
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    if (!showModal) return;

    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaVideo className="text-3xl text-white animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                ভিডিও গ্যালারী
              </h1>
            </div>
            <p className="text-base md:text-lg text-pink-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-sm md:text-base text-white font-medium italic">
                &ldquo;আমাদের স্মৃতির মুহূর্তগুলো&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">মোট ভিডিও</p>
            <p className="text-2xl font-bold text-slate-900">{videos.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">ক্যাটেগরি</p>
            <p className="text-2xl font-bold text-red-700">{categories.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">দেখা হয়েছে</p>
            <p className="text-2xl font-bold text-green-700">—</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ভিডিওর শিরোনাম, বিবরণ বা ক্যাটেগরি দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">সব ক্যাটেগরি</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
              <p className="text-slate-600">ভিডিও লোড হচ্ছে...</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FaVideo className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">কোন ভিডিও পাওয়া যায়নি</p>
            <p className="text-slate-400 text-sm">
              {searchTerm || selectedCategory
                ? "অনুসন্ধানের ফলাফল খালি"
                : "ভিডিও যোগ করা হবে শীঘ্রই"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                onClick={() => openModal(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl) ? (
                    <img
                      src={video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl)}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <FaVideo className="text-4xl text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                      <FaPlay className="text-white text-2xl ml-1" />
                    </div>
                  </div>
                  {/* YouTube Badge */}
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold">
                    <FaYoutube className="text-white" />
                    <span>YouTube</span>
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
                      {categoryLabels[video.category] || video.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                  {video.duration && (
                    <div className="mt-2 text-xs text-slate-500">
                      সময়কাল: {video.duration}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Video Player */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full">
              {/* YouTube Embed */}
              <div className="relative aspect-video bg-black">
                {selectedVideo.youtubeUrl && extractYouTubeId(selectedVideo.youtubeUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideo.youtubeUrl) + "?autoplay=1"}
                    title={selectedVideo.title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaVideo className="text-4xl text-white" />
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedVideo.title || "Untitled"}
                    </h2>
                    {selectedVideo.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {selectedVideo.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2">
                    <FaTag className="text-red-600" />
                    <span className="font-medium">
                      {categoryLabels[selectedVideo.category] || selectedVideo.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-600" />
                    <span>{formatDate(selectedVideo.createdAt)}</span>
                  </div>
                  {selectedVideo.duration && (
                    <div className="flex items-center gap-2">
                      <FaPlay className="text-blue-600" />
                      <span>সময়কাল: {selectedVideo.duration}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* YouTube Link */}
                {selectedVideo.youtubeUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={selectedVideo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      <FaYoutube className="text-xl" />
                      <span>YouTube-এ দেখুন</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

