"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaCheck,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2";

const allServices = [
  "জরুরী সহায়তা",
  "এফআইআর",
  "সাধারণ অভিযোগ",
  "নারী ও শিশু সহায়তা",
  "অপরাধ রিপোর্ট",
  "ট্রাফিক ম্যানেজমেন্ট",
  "সাইবার ক্রাইম",
  "সামাজিক নিরাপত্তা",
];

export default function PoliceStationPage() {
  const { data: session, status } = useSession();
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    officer: "",
    services: [],
    image: "",
  });

  useEffect(() => {
    loadPoliceStations();
  }, []);

  const loadPoliceStations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/police-stations");
      const data = await res.json();

      if (res.ok) {
        setPoliceStations(data.policeStations || []);
      }
    } catch (error) {
      console.error("Error loading police stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "services") {
      const updatedServices = checked
        ? [...formData.services, value]
        : formData.services.filter((service) => service !== value);
      setFormData({ ...formData, services: updatedServices });
    } else {
      setFormData({ ...formData, [name]: value });
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
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormData({ ...formData, image: data.imageUrl });
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

  const handleEdit = (station) => {
    setEditingId(station.id);
    setFormData({
      name: station.name || "",
      phone: station.phone || "",
      address: station.address || "",
      officer: station.officer || "",
      services: station.services || [],
      image: station.image || "",
    });
    setImagePreview(station.image || "");
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নিশ্চিত করুন",
      text: "আপনি কি এই পুলিশ স্টেশন মুছে ফেলতে চান?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/police-stations/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "পুলিশ স্টেশন সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
          loadPoliceStations();
        } else {
          throw new Error(data.error || "Failed to delete police station");
        }
      } catch (error) {
        console.error("Error deleting police station:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.message || "পুলিশ স্টেশন মুছে ফেলতে সমস্যা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "পুলিশ স্টেশনের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.officer) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "সব প্রয়োজনীয় তথ্য পূরণ করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        res = await fetch(`/api/police-stations/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/police-stations", {
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
            ? "পুলিশ স্টেশনের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন পুলিশ স্টেশন সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadPoliceStations();
        });
      } else {
        throw new Error(data.error || "Failed to save police station");
      }
    } catch (error) {
      console.error("Error saving police station:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "পুলিশ স্টেশন যোগ করতে সমস্যা হয়েছে",
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
      phone: "",
      address: "",
      officer: "",
      services: [],
      image: "",
    });
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">পুলিশ স্টেশন</h1>
          <p className="mt-1 text-sm text-slate-600">
            পুলিশ স্টেশনের তথ্য যোগ করুন এবং সম্পাদনা করুন
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
          নতুন পুলিশ স্টেশন যোগ করুন
        </button>
      </div>

      {/* Police Stations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : policeStations.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaShieldAlt className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো পুলিশ স্টেশনের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম পুলিশ স্টেশনের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {policeStations.map((station) => (
            <div
              key={station.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {station.image && (
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={station.image}
                    alt={station.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900">{station.name}</h3>
              {station.officer && (
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                  <FaUser className="h-3 w-3" />
                  {station.officer}
                </p>
              )}
              {station.address && (
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                  <FaMapMarkerAlt className="h-3 w-3" />
                  {station.address}
                </p>
              )}
              {station.phone && (
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                  <FaPhone className="h-3 w-3" />
                  {station.phone}
                </p>
              )}
              {station.services && station.services.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {station.services.slice(0, 3).map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                    >
                      {service}
                    </span>
                  ))}
                  {station.services.length > 3 && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      +{station.services.length - 3} আরো
                    </span>
                  )}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(station)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  <FaEdit className="h-3 w-3" />
                  সম্পাদনা
                </button>
                <button
                  onClick={() => handleDelete(station.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Police Station Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId ? "পুলিশ স্টেশন সম্পাদনা করুন" : "নতুন পুলিশ স্টেশন যোগ করুন"}
                    </h2>
                    <p className="text-indigo-100 mt-1 text-sm">সব তথ্য সঠিকভাবে পূরণ করুন</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Station Name */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaShieldAlt className="mr-2 h-4 w-4 text-indigo-500" />
                    থানার নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: সদর থানা"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaPhone className="mr-2 h-4 w-4 text-green-500" />
                    ফোন নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: ০১৭xxxxxxxx"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>

                {/* Officer */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUser className="mr-2 h-4 w-4 text-purple-500" />
                    অফিসারের নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="officer"
                    value={formData.officer}
                    onChange={handleChange}
                    required
                    placeholder="দায়িত্বপ্রাপ্ত অফিসারের নাম"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4 text-blue-500" />
                    ঠিকানা <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="ঠিকানা লিখুন"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Services */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    সেবাসমূহ
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    {allServices.map((service) => (
                      <label
                        key={service}
                        className="flex items-center gap-2 text-sm p-2 rounded border bg-white hover:bg-indigo-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          name="services"
                          value={service}
                          checked={formData.services.includes(service)}
                          onChange={handleChange}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                  {formData.services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.services.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-2 rounded-full bg-indigo-100 border border-indigo-200 px-3 py-1 text-sm font-medium text-indigo-800"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                services: formData.services.filter((service) => service !== s),
                              });
                            }}
                            className="text-indigo-600 hover:text-red-600 transition-colors"
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
                    ছবি আপলোড
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
                          setFormData({ ...formData, image: "" });
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
                      <FaShieldAlt className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "পুলিশ স্টেশন যোগ করুন"}
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

