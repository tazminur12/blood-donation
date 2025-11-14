"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaHeart,
  FaArrowLeft,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaFileAlt,
} from "react-icons/fa";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      loadBlog();
    }
  }, [params.id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!params.id) {
        setError("ব্লগ ID পাওয়া যায়নি");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/blogs/${params.id}`);
      const data = await res.json();

      if (res.ok && data.success && data.blog) {
        setBlog(data.blog);
      } else {
        console.error("Blog fetch error:", data);
        setError(data.error || "ব্লগ পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("ব্লগ লোড করতে সমস্যা হয়েছে: " + err.message);
    } finally {
      setLoading(false);
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

  const handleShare = (platform) => {
    if (!blog) return;
    
    const url = window.location.href;
    const title = blog.title;
    const text = blog.content ? blog.content.replace(/<[^>]*>/g, "").substring(0, 100) : blog.title;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-rose-600 mx-auto mb-4" />
          <p className="text-slate-600">ব্লগ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <FaFileAlt className="text-6xl text-slate-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">ব্লগ পাওয়া যায়নি</h1>
            <p className="text-slate-600 mb-2">
              {error || "এই ব্লগটি পাওয়া যায়নি বা এখনও প্রকাশিত হয়নি"}
            </p>
            {error && error.includes("ID") && (
              <p className="text-sm text-slate-500 mb-6">
                URL-এ সঠিক ব্লগ ID নেই
              </p>
            )}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
            >
              <FaArrowLeft />
              <span>ব্লগ লিস্টে ফিরে যান</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors mb-6"
        >
          <FaArrowLeft />
          <span>ব্লগ লিস্টে ফিরে যান</span>
        </Link>
      </div>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Blog Card with White Background */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {blog.title}
            </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
            <div className="flex items-center gap-2">
              <FaUser className="text-rose-600" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-rose-600" />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-rose-600" />
              <span>{blog.views || 0} বার দেখা হয়েছে</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="text-rose-600" />
              <span>{blog.likes || 0} লাইক</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-200">
            <span className="text-slate-600 font-medium">শেয়ার করুন:</span>
            <button
              onClick={() => handleShare("facebook")}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Facebook এ শেয়ার করুন"
            >
              <FaFacebook />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              title="Twitter এ শেয়ার করুন"
            >
              <FaTwitter />
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              title="WhatsApp এ শেয়ার করুন"
            >
              <FaWhatsapp />
            </button>
          </div>
        </header>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{
                fontSize: "1.125rem",
                lineHeight: "1.75",
              }}
            />
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-slate-600">
                <p className="font-medium mb-1">লেখক: {blog.author}</p>
                <p className="text-sm">
                  প্রকাশিত: {formatDate(blog.publishedAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span className="flex items-center gap-1">
                  <FaEye />
                  {blog.views || 0} ভিউ
                </span>
                <span className="flex items-center gap-1">
                  <FaHeart />
                  {blog.likes || 0} লাইক
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Back to Blog List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
        >
          <FaArrowLeft />
          <span>সমস্ত ব্লগ দেখুন</span>
        </Link>
      </div>

      <Footer />
    </div>
  );
}

