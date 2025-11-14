"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import PageTitle from "@/components/PageTitle";
import { FaSpinner, FaImage, FaFileAlt, FaUpload, FaTimes, FaUser } from "react-icons/fa";

// Dynamically import JoditEditor only on client side
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="h-[500px] border border-gray-300 rounded-lg flex items-center justify-center"><FaSpinner className="animate-spin text-gray-400" /></div>
});

export default function EditBlog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const editor = useRef(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    content: "",
    status: "published",
    author: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [useUrlInput, setUseUrlInput] = useState(false);

  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleContentChange = useCallback((newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  }, []);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    // Check if user is admin only after session is loaded
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Load blog data if we have an ID
    if (params.id) {
      loadBlog();
    }
  }, [session, status, router, params.id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/blogs?id=${params.id}`);
      const data = await res.json();

      if (res.ok && data.blog) {
        setFormData({
          title: data.blog.title || "",
          thumbnail: data.blog.thumbnail || "",
          content: data.blog.content || "",
          status: data.blog.status || "published",
          author: data.blog.author || "",
        });
        setImagePreview(data.blog.thumbnail || "");
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ব্লগ লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        }).then(() => {
          router.push("/dashboard/admin/blogs");
        });
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ব্লগ লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        router.push("/dashboard/admin/blogs");
      });
    } finally {
      setLoading(false);
    }
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
      
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormData({ ...formData, thumbnail: data.imageUrl });
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
      setImagePreview(formData.thumbnail || "");
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ছবি আপলোড করতে ব্যর্থ হয়েছে: " + (error.message || "অজানা ত্রুটি"),
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setImageUploading(false);
      // Clean up preview URL
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, thumbnail: "" });
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Basic field validation
    if (!formData.title || !formData.thumbnail || !formData.content || !formData.author) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "সব ফিল্ড পূরণ করা আবশ্যক (শিরোনাম, থাম্বনেইল, কনটেন্ট এবং লেখকের নাম)",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Validate content length
    const textContent = formData.content.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 50) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ব্লগ কনটেন্ট কমপক্ষে ৫০ অক্ষরের হতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const blogData = {
        blogId: params.id,
        title: formData.title,
        thumbnail: formData.thumbnail,
        content: formData.content,
        status: formData.status,
        author: formData.author.trim(),
      };

      const res = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ব্লগ সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          router.push("/dashboard/admin/blogs");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || data.message || "ব্লগ আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ব্লগ আপডেট করতে ব্যর্থ হয়েছে: " + err.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while session is loading or blog is being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "ব্লগ লোড হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, don't render (redirect will happen)
  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <PageTitle title="ব্লগ সম্পাদনা করুন" />
      
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        noValidate
      >
        {/* Title input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FaFileAlt className="inline mr-2" />
            ব্লগ শিরোনাম
          </label>
          <input
            type="text"
            name="title"
            placeholder="ব্লগের শিরোনাম লিখুন"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Author name input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FaUser className="inline mr-2" />
            লেখকের নাম
          </label>
          <input
            type="text"
            name="author"
            placeholder="লেখকের নাম লিখুন"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            এই নামটি ব্লগে লেখক হিসেবে দেখানো হবে
          </p>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            অবস্থা
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="draft">ড্রাফ্ট</option>
            <option value="published">প্রকাশিত</option>
            <option value="archived">আর্কাইভ</option>
          </select>
        </div>

        {/* Thumbnail Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FaImage className="inline mr-2" />
            থাম্বনেইল ইমেজ
          </label>
          
          {/* Toggle between upload and URL */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUseUrlInput(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !useUrlInput
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <FaUpload className="inline mr-2" />
              ফাইল আপলোড
            </button>
            <button
              type="button"
              onClick={() => setUseUrlInput(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                useUrlInput
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <FaImage className="inline mr-2" />
              URL ব্যবহার করুন
            </button>
          </div>

          {!useUrlInput ? (
            /* File Upload Section */
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-rose-500 transition-colors text-center">
                    {imageUploading ? (
                      <div className="flex items-center justify-center gap-2 text-slate-600">
                        <FaSpinner className="animate-spin" />
                        <span>আপলোড হচ্ছে...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FaUpload className="text-2xl text-slate-400" />
                        <span className="text-slate-600">
                          ছবি আপলোড করতে ক্লিক করুন
                        </span>
                        <span className="text-xs text-slate-500">
                          সর্বোচ্চ ৫ MB (JPG, PNG, GIF)
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Preview uploaded image */}
              {(imagePreview || formData.thumbnail) && (
                <div className="relative">
                  <div className="relative w-full max-w-md h-64 rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-slate-50">
                    <Image
                      src={imagePreview || formData.thumbnail}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      title="ছবি সরান"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    আপলোডকৃত ছবি
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* URL Input Section */
            <div className="space-y-3">
              <input
                type="url"
                name="thumbnail"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnail}
                onChange={(e) => {
                  setFormData({ ...formData, thumbnail: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500">
                অথবা একটি ইমেজ URL দিন
              </p>
              
              {/* Preview thumbnail if provided */}
              {formData.thumbnail && (
                <div className="relative">
                  <div className="relative w-full max-w-md h-64 rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-slate-50">
                    <Image
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, thumbnail: "" });
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      title="ছবি সরান"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rich text editor for blog content */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FaFileAlt className="inline mr-2" />
            ব্লগ কনটেন্ট
          </label>
          <div 
            className="border border-slate-300 rounded-lg overflow-hidden"
            onKeyDown={(e) => {
              // Prevent form submission when typing in editor
              const isInEditor = e.target.closest('.jodit-container') || 
                                 e.target.closest('.jodit-wysiwyg') ||
                                 e.target.closest('[contenteditable="true"]');
              if (isInEditor && e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }}
            onKeyPress={(e) => {
              // Prevent form submission
              const isInEditor = e.target.closest('.jodit-container') || 
                                 e.target.closest('.jodit-wysiwyg') ||
                                 e.target.closest('[contenteditable="true"]');
              if (isInEditor) {
                e.stopPropagation();
              }
            }}
          >
            <JoditEditor
              ref={editor}
              value={formData.content}
              onChange={handleContentChange}
              config={{
                height: 500,
                placeholder: "আপনার ব্লগ কনটেন্ট লিখুন...",
                buttons: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "|",
                  "superscript",
                  "subscript",
                  "|",
                  "align",
                  "|",
                  "ul",
                  "ol",
                  "|",
                  "outdent",
                  "indent",
                  "|",
                  "font",
                  "fontsize",
                  "brush",
                  "paragraph",
                  "|",
                  "image",
                  "video",
                  "table",
                  "link",
                  "|",
                  "hr",
                  "eraser",
                  "copyformat",
                  "|",
                  "fullsize",
                  "selectall",
                  "print",
                  "|",
                  "source",
                  "|",
                  "undo",
                  "redo",
                ],
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            কমপক্ষে ৫০ অক্ষরের কনটেন্ট প্রয়োজন
          </p>
        </div>

        {/* Submit button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>আপডেট করা হচ্ছে...</span>
              </>
            ) : (
              <span>ব্লগ আপডেট করুন</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
          >
            বাতিল
          </button>
        </div>
      </form>
    </div>
  );
}

