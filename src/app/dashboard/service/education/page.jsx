"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaBookOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaSave,
  FaUser,
  FaCalendar,
  FaUsers,
  FaGlobe,
  FaImage,
  FaUpload,
  FaEye,
  FaInfo,
  FaArrowLeft,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function EducationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "school",
    level: "primary",
    address: "",
    phone: "",
    email: "",
    principal: "",
    established: "",
    students: "",
    description: "",
    website: "",
    district: "bogura",
    upazila: "",
    facilities: [],
    images: [],
  });

  const [errors, setErrors] = useState({});

  const facilityOptions = [
    { value: "library", label: "গ্রন্থাগার", icon: "📚" },
    { value: "laboratory", label: "ল্যাবরেটরি", icon: "🧪" },
    { value: "computer_lab", label: "কম্পিউটার ল্যাব", icon: "💻" },
    { value: "playground", label: "খেলার মাঠ", icon: "⚽" },
    { value: "canteen", label: "ক্যান্টিন", icon: "🍽️" },
    { value: "transport", label: "পরিবহন", icon: "🚌" },
    { value: "hostel", label: "হোস্টেল", icon: "🏠" },
    { value: "medical", label: "চিকিৎসা কেন্দ্র", icon: "🏥" },
    { value: "sports", label: "ক্রীড়া সুবিধা", icon: "🏃" },
    { value: "auditorium", label: "অডিটোরিয়াম", icon: "🎭" },
  ];

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/educations");
      const data = await res.json();

      if (res.ok) {
        setEducations(data.educations || []);
      }
    } catch (error) {
      console.error("Error loading educations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFacilityToggle = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      Swal.fire("ত্রুটি", "আপলোড করার জন্য একটি ছবি নির্বাচন করুন", "error");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "শুধুমাত্র ছবি ফাইল আপলোড করা যাবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ছবির সাইজ ৫ MB এর বেশি হতে পারবে না",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setImageUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", selectedFile);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const uploadedImage = {
          url: data.imageUrl,
          delete_url: data.deleteUrl || "",
          title: selectedFile.name,
          time: new Date().toISOString(),
        };

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, uploadedImage],
        }));

        setSelectedFile(null);
        setImagePreview("");

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

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (education) => {
    setEditingId(education.id);
    setFormData({
      name: education.name || "",
      type: education.type || "school",
      level: education.level || "primary",
      address: education.address || "",
      phone: education.phone || "",
      email: education.email || "",
      principal: education.principal || "",
      established: education.established || "",
      students: education.students || "",
      description: education.description || "",
      website: education.website || "",
      district: education.district || "bogura",
      upazila: education.upazila || "",
      facilities: education.facilities || [],
      images: education.images || [],
    });
    setImagePreview("");
    setSelectedFile(null);
    setShowCreateModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "প্রতিষ্ঠানের নাম প্রয়োজন";
    }
    if (!formData.principal.trim()) {
      newErrors.principal = "অধ্যক্ষের নাম প্রয়োজন";
    }
    if (!formData.address.trim()) {
      newErrors.address = "ঠিকানা প্রয়োজন";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "যোগাযোগের নম্বর প্রয়োজন";
    } else if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(formData.phone)) {
      newErrors.phone = "সঠিক বাংলাদেশী মোবাইল নম্বর দিন";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "সঠিক ইমেইল ঠিকানা দিন";
    }
    if (!formData.type) {
      newErrors.type = "প্রতিষ্ঠানের ধরন নির্বাচন করুন";
    }
    if (!formData.level) {
      newErrors.level = "শিক্ষার স্তর নির্বাচন করুন";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "শিক্ষা প্রতিষ্ঠানের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!validateForm()) {
      Swal.fire("ত্রুটি", "সব তথ্য সঠিকভাবে পূরণ করুন", "error");
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        res = await fetch(`/api/educations/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/educations", {
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
            ? "শিক্ষা প্রতিষ্ঠানের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন শিক্ষা প্রতিষ্ঠান সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadEducations();
        });
      } else {
        throw new Error(data.error || "Failed to save education");
      }
    } catch (error) {
      console.error("Error saving education:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "শিক্ষা প্রতিষ্ঠান যোগ করতে সমস্যা হয়েছে",
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
      type: "school",
      level: "primary",
      address: "",
      phone: "",
      email: "",
      principal: "",
      established: "",
      students: "",
      description: "",
      website: "",
      district: "bogura",
      upazila: "",
      facilities: [],
      images: [],
    });
    setImagePreview("");
    setSelectedFile(null);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">শিক্ষা প্রতিষ্ঠান</h1>
          <p className="mt-1 text-sm text-slate-600">
            শিক্ষা প্রতিষ্ঠানের তথ্য যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন শিক্ষা প্রতিষ্ঠান যোগ করুন
        </button>
      </div>

      {/* Educations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : educations.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaBookOpen className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো শিক্ষা প্রতিষ্ঠানের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম শিক্ষা প্রতিষ্ঠানের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {educations.map((education) => (
            <div
              key={education.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {education.images && education.images.length > 0 && (
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={education.images[0].url}
                    alt={education.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900">{education.name}</h3>
              {education.type && (
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  {education.type === "school"
                    ? "স্কুল"
                    : education.type === "college"
                    ? "কলেজ"
                    : education.type === "university"
                    ? "বিশ্ববিদ্যালয়"
                    : education.type}
                </p>
              )}
              {education.principal && (
                <p className="mt-1 text-sm text-slate-600 flex items-center">
                  <FaUser className="w-3 h-3 mr-1" />
                  {education.principal}
                </p>
              )}
              {education.phone && (
                <p className="mt-1 text-sm text-slate-600 flex items-center">
                  <FaPhone className="w-3 h-3 mr-1" />
                  {education.phone}
                </p>
              )}
              {education.address && (
                <p className="mt-1 text-sm text-slate-600 flex items-center line-clamp-1">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1 flex-shrink-0" />
                  {education.address}
                </p>
              )}
              <button
                onClick={() => handleEdit(education)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                <FaEdit className="h-3 w-3" />
                সম্পাদনা
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Education Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBookOpen className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "শিক্ষা প্রতিষ্ঠান সম্পাদনা করুন"
                        : "নতুন শিক্ষা প্রতিষ্ঠান যোগ করুন"}
                    </h2>
                    <p className="text-indigo-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-indigo-200 text-2xl transition"
                >
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaBookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                    মৌলিক তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                          errors.name ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="শিক্ষা প্রতিষ্ঠানের নাম"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfo className="w-3 h-3 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        প্রতিষ্ঠানের ধরন <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                          errors.type ? "border-red-500" : "border-slate-200"
                        }`}
                      >
                        <option value="school">স্কুল</option>
                        <option value="college">কলেজ</option>
                        <option value="school_and_college">স্কুল এবং কলেজ</option>
                        <option value="university">বিশ্ববিদ্যালয়</option>
                        <option value="medical">মেডিকেল</option>
                        <option value="madrasa">মাদ্রাসা</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        শিক্ষার স্তর <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                          errors.level ? "border-red-500" : "border-slate-200"
                        }`}
                      >
                        <option value="primary">প্রাথমিক</option>
                        <option value="secondary">মাধ্যমিক</option>
                        <option value="higher_secondary">উচ্চ মাধ্যমিক</option>
                        <option value="primary_secondary_higher">
                          প্রাথমিক, মাধ্যমিক এবং উচ্চ
                        </option>
                        <option value="secondary_higher">মাধ্যমিক এবং উচ্চ</option>
                        <option value="university">বিশ্ববিদ্যালয়</option>
                        <option value="medical">মেডিকেল</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        উপজেলা
                      </label>
                      <input
                        type="text"
                        name="upazila"
                        value={formData.upazila}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                        placeholder="উপজেলার নাম"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaPhone className="w-5 h-5 mr-2 text-indigo-600" />
                    যোগাযোগের তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        অধ্যক্ষের নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="principal"
                        value={formData.principal}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                          errors.principal ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="অধ্যক্ষের নাম"
                      />
                      {errors.principal && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfo className="w-3 h-3 mr-1" />
                          {errors.principal}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        যোগাযোগের নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                          errors.phone ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="01XXXXXXXXX"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfo className="w-3 h-3 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        ইমেইল
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                          errors.email ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="example@institute.edu.bd"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfo className="w-3 h-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        ওয়েবসাইট
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                        placeholder="https://www.institute.edu.bd"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 mr-2 text-indigo-600" />
                    ঠিকানা
                  </h3>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      required
                      className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                        errors.address ? "border-red-500" : "border-slate-200"
                      }`}
                      placeholder="বিস্তারিত ঠিকানা"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaInfo className="w-3 h-3 mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaCalendar className="w-5 h-5 mr-2 text-indigo-600" />
                    অতিরিক্ত তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        প্রতিষ্ঠার বছর
                      </label>
                      <input
                        type="text"
                        name="established"
                        value={formData.established}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                        placeholder="১৯৬২"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        শিক্ষার্থীর সংখ্যা
                      </label>
                      <input
                        type="text"
                        name="students"
                        value={formData.students}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                        placeholder="৫০০০+"
                      />
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaUsers className="w-5 h-5 mr-2 text-indigo-600" />
                    সুবিধা সমূহ
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {facilityOptions.map((facility) => (
                      <label
                        key={facility.value}
                        className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility.value)}
                          onChange={() => handleFacilityToggle(facility.value)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm font-medium text-slate-700">
                          {facility.icon} {facility.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaImage className="w-5 h-5 mr-2 text-indigo-600" />
                    প্রতিষ্ঠানের ছবি
                  </h3>

                  {/* Image Upload Area */}
                  <div className="mb-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <div className="space-y-4">
                        <FaUpload className="w-12 h-12 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-slate-700 mb-2">
                            ছবি আপলোড করুন
                          </p>
                          <p className="text-sm text-slate-500 mb-4">
                            JPG, PNG, GIF ফাইল (সর্বোচ্চ ৫ মেগাবাইট)
                          </p>
                        </div>
                        <div className="flex items-center justify-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                          >
                            <FaUpload className="w-4 h-4 mr-2" />
                            ছবি নির্বাচন করুন
                          </label>
                          {selectedFile && (
                            <button
                              type="button"
                              onClick={handleImageUpload}
                              disabled={imageUploading}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {imageUploading ? (
                                <>
                                  <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                                  আপলোড হচ্ছে...
                                </>
                              ) : (
                                <>
                                  <FaUpload className="w-4 h-4 mr-2" />
                                  আপলোড করুন
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4 bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">
                          প্রিভিউ
                        </h4>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setImagePreview("");
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Uploaded Images */}
                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">
                          আপলোডকৃত ছবি ({formData.images.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-slate-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => window.open(image.url, "_blank")}
                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                    title="দেখুন"
                                  >
                                    <FaEye className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    title="মুছুন"
                                  >
                                    <FaTimes className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    বিবরণ
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    placeholder="শিক্ষা প্রতিষ্ঠান সম্পর্কে বিস্তারিত বিবরণ..."
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={createLoading || imageUploading}
                  className={`flex-1 rounded-lg px-4 py-3 font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                    createLoading || imageUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                  }`}
                >
                  {createLoading ? (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "যোগ হচ্ছে..."}
                    </>
                  ) : (
                    <>
                      <FaSave className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "প্রতিষ্ঠান যোগ করুন"}
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
