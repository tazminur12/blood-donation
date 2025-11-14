"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaPhone,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaSave,
  FaExclamationTriangle,
  FaUpload,
  FaCheck,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function AmbulancePage() {
  const { data: session, status } = useSession();
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  const [formData, setFormData] = useState({
    serviceName: "",
    area: "",
    type: "",
    availability: false,
    contact: "",
    emergencyNumber: "",
    features: [],
    imageUrl: "",
  });

  useEffect(() => {
    loadAmbulances();
  }, []);

  const loadAmbulances = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ambulances");
      const data = await res.json();

      if (res.ok) {
        setAmbulances(data.ambulances || []);
      }
    } catch (error) {
      console.error("Error loading ambulances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
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
        setFormData({ ...formData, imageUrl: data.imageUrl });
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

  const handleEdit = (ambulance) => {
    setEditingId(ambulance.id);
    setFormData({
      serviceName: ambulance.serviceName || ambulance.name || "",
      area: ambulance.area || ambulance.location || "",
      type: ambulance.type || ambulance.serviceType || "",
      availability: ambulance.availability || false,
      contact: ambulance.contact || ambulance.phoneNumber || "",
      emergencyNumber: ambulance.emergencyNumber || ambulance.alternativePhone || "",
      features: ambulance.features || [],
      imageUrl: ambulance.imageUrl || ambulance.image || "",
    });
    setImagePreview(ambulance.imageUrl || ambulance.image || "");
    setFeatureInput("");
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অ্যাম্বুলেন্সের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!formData.serviceName || !formData.area || !formData.contact) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "সার্ভিসের নাম, এলাকা এবং যোগাযোগ নম্বর প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!formData.imageUrl) {
      Swal.fire({
        icon: "warning",
        title: "দ্রষ্টব্য!",
        text: "একটি ছবি আপলোড করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        res = await fetch(`/api/ambulances/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/ambulances", {
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
            ? "অ্যাম্বুলেন্সের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন অ্যাম্বুলেন্স সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadAmbulances();
        });
      } else {
        throw new Error(data.error || "Failed to save ambulance");
      }
    } catch (error) {
      console.error("Error saving ambulance:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "অ্যাম্বুলেন্স যোগ করতে সমস্যা হয়েছে",
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
      serviceName: "",
      area: "",
      type: "",
      availability: false,
      contact: "",
      emergencyNumber: "",
      features: [],
      imageUrl: "",
    });
    setImagePreview("");
    setFeatureInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">অ্যাম্বুলেন্স সেবা</h1>
          <p className="mt-1 text-sm text-slate-600">
            অ্যাম্বুলেন্সের তথ্য যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন অ্যাম্বুলেন্স যোগ করুন
        </button>
      </div>

      {/* Ambulances List for Edit */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : ambulances.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaAmbulance className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো অ্যাম্বুলেন্সের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম অ্যাম্বুলেন্সের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ambulances.map((ambulance) => (
            <div
              key={ambulance.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {(ambulance.imageUrl || ambulance.image) && (
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={ambulance.imageUrl || ambulance.image}
                    alt={ambulance.serviceName || ambulance.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900">
                {ambulance.serviceName || ambulance.name}
              </h3>
              {ambulance.type && (
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  {ambulance.type}
                </p>
              )}
              {ambulance.area && (
                <p className="mt-1 text-sm text-slate-600">{ambulance.area}</p>
              )}
              {ambulance.contact && (
                <p className="mt-1 text-sm text-slate-600">{ambulance.contact}</p>
              )}
              <button
                onClick={() => handleEdit(ambulance)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                <FaEdit className="h-3 w-3" />
                সম্পাদনা
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Ambulance Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-red-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaAmbulance className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId ? "অ্যাম্বুলেন্স সম্পাদনা করুন" : "নতুন অ্যাম্বুলেন্স যোগ করুন"}
                    </h2>
                    <p className="text-red-100 mt-1 text-sm">সব তথ্য সঠিকভাবে পূরণ করুন</p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-red-200 text-2xl transition"
                >
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Name */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaAmbulance className="mr-2 h-4 w-4 text-red-500" />
                    সার্ভিসের নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: গোবিন্দগঞ্জ এ্যাম্বুলেন্স সার্ভিস"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-blue-500" />
                    এলাকা <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: সাতমাথা"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaAmbulance className="mr-2 h-4 w-4 text-green-500" />
                    ধরণ <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: ICU / নরমাল"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaPhone className="mr-2 h-4 w-4 text-purple-500" />
                    যোগাযোগ নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: 017XXXXXXXX"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>

                {/* Emergency Number */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaExclamationTriangle className="mr-2 h-4 w-4 text-red-500" />
                    জরুরি নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyNumber"
                    value={formData.emergencyNumber}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: 018XXXXXXXX"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>

                {/* Availability */}
                <div className="md:col-span-2">
                  <div className="flex items-center rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4">
                    <input
                      type="checkbox"
                      name="availability"
                      id="availability"
                      checked={formData.availability}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="availability" className="ml-3 text-base font-semibold text-slate-700">
                      বর্তমানে সার্ভিস প্রস্তুত
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaPlus className="mr-2 h-4 w-4 text-indigo-500" />
                    সুবিধাসমূহ
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="যেমন: অক্সিজেন, স্ট্রেচার"
                      className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 text-white font-semibold transition hover:from-indigo-600 hover:to-indigo-700 flex items-center gap-2"
                    >
                      <FaPlus className="h-4 w-4" />
                      যোগ করুন
                    </button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-800"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUpload className="mr-2 h-4 w-4 text-orange-500" />
                    ছবি আপলোড <span className="text-rose-600">*</span>
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
                          setFormData({ ...formData, imageUrl: "" });
                        }}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                      <div className="mt-2 flex items-center justify-center text-green-600">
                        <FaCheck className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">ছবি সফলভাবে আপলোড হয়েছে</span>
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
                      <FaAmbulance className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "অ্যাম্বুলেন্স যোগ করুন"}
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
