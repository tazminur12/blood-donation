"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AddDisasterReportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "corruption",
    priority: "medium",
    evidence: "",
    contactInfo: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = [];
    const previews = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const under5mb = file.size <= 5 * 1024 * 1024;

      if (!isImage) {
        Swal.fire("ত্রুটি", "শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে", "error");
        continue;
      }
      if (!under5mb) {
        Swal.fire("ত্রুটি", "প্রতি ইমেজ সর্বোচ্চ 5MB হতে পারবে", "error");
        continue;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
      if (validFiles.length >= 5) break;
    }

    setSelectedFiles(validFiles);
    setPreviewUrls(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      Swal.fire("ত্রুটি", "শিরোনাম এবং বিবরণ প্রয়োজন", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("location", formData.location);
      form.append("category", formData.category);
      form.append("priority", formData.priority);
      form.append("evidence", formData.evidence);
      form.append("contactInfo", formData.contactInfo);
      form.append("status", "pending");
      form.append("createdAt", new Date().toISOString());

      // Append files
      selectedFiles.forEach((file) => {
        form.append("attachments", file);
      });

      const res = await fetch("/api/disaster-reports", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire("সফল!", "রিপোর্ট সফলভাবে যোগ হয়েছে!", "success").then(() => {
          router.push("/all-service/disaster-report");
        });
      } else {
        throw new Error(data.error || "রিপোর্ট যোগ করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      Swal.fire("ত্রুটি", error.message || "রিপোর্ট যোগ করতে সমস্যা হয়েছে", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">নতুন রিপোর্ট যোগ করুন</h1>
          <Link
            href="/all-service/disaster-report"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            সব রিপোর্ট
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              শিরোনাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="রিপোর্টের শিরোনাম লিখুন"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              বিবরণ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="বিস্তারিত বিবরণ লিখুন"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              অবস্থান
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="ঘটনার অবস্থান"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিভাগ <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="corruption">দুর্নীতি</option>
                <option value="disaster">দুর্যোগ</option>
                <option value="injustice">অন্যায়</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অগ্রাধিকার <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="low">নিম্ন</option>
                <option value="medium">মাঝারি</option>
                <option value="high">উচ্চ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              প্রমাণ/সাক্ষ্য
            </label>
            <textarea
              rows="3"
              value={formData.evidence}
              onChange={(e) =>
                setFormData({ ...formData, evidence: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="প্রমাণ বা সাক্ষ্যের বিবরণ (ঐচ্ছিক)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ছবি আপলোড (সর্বোচ্চ ৫টি, প্রতি ছবি ৫MB)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {previewUrls.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-24 rounded-md overflow-hidden border"
                  >
                    <img
                      src={src}
                      alt={`attachment-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              যোগাযোগের তথ্য
            </label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="ফোন নম্বর বা ইমেইল (ঐচ্ছিক)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Link
              href="/all-service/disaster-report"
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

