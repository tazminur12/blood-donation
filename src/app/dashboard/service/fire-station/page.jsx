"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaFire,
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
  FaShieldAlt,
  FaBolt,
  FaInfo,
  FaArrowLeft,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function FireStationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fireStations, setFireStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    officer: "",
    address: "",
    contact: "",
    type: "main",
    email: "",
    description: "",
    workingHours: "",
    emergencyContact: "",
    equipment: [],
  });

  const [errors, setErrors] = useState({});

  const equipmentOptions = [
    { value: "fire_truck", label: "ফায়ার ট্রাক", icon: "🚒" },
    { value: "water_tank", label: "জল ট্যাংক", icon: "💧" },
    { value: "ladder", label: "মই", icon: "🪜" },
    { value: "hose", label: "হোস পাইপ", icon: "🔗" },
    { value: "axe", label: "কুঠার", icon: "🪓" },
    { value: "oxygen_tank", label: "অক্সিজেন ট্যাংক", icon: "🫧" },
    { value: "first_aid", label: "প্রাথমিক চিকিৎসা", icon: "🏥" },
    { value: "communication", label: "যোগাযোগ সরঞ্জাম", icon: "📻" },
  ];

  useEffect(() => {
    loadFireStations();
  }, []);

  const loadFireStations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fire-stations");
      const data = await res.json();

      if (res.ok) {
        setFireStations(data.fireStations || []);
      }
    } catch (error) {
      console.error("Error loading fire stations:", error);
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

  const handleEquipmentToggle = (equipment) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter((e) => e !== equipment)
        : [...prev.equipment, equipment],
    }));
  };

  const handleEdit = (station) => {
    setEditingId(station.id);
    setFormData({
      name: station.name || "",
      officer: station.officer || "",
      address: station.address || "",
      contact: station.contact || "",
      type: station.type || "main",
      email: station.email || "",
      description: station.description || "",
      workingHours: station.workingHours || "",
      emergencyContact: station.emergencyContact || "",
      equipment: station.equipment || [],
    });
    setShowCreateModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "স্টেশনের নাম প্রয়োজন";
    }
    if (!formData.officer.trim()) {
      newErrors.officer = "অফিসারের নাম প্রয়োজন";
    }
    if (!formData.address.trim()) {
      newErrors.address = "ঠিকানা প্রয়োজন";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "যোগাযোগের নম্বর প্রয়োজন";
    } else if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(formData.contact)) {
      newErrors.contact = "সঠিক বাংলাদেশী মোবাইল নম্বর দিন";
    }
    if (!formData.type) {
      newErrors.type = "স্টেশনের ধরন নির্বাচন করুন";
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
        text: "ফায়ার স্টেশনের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
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
        res = await fetch(`/api/fire-stations/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/fire-stations", {
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
            ? "ফায়ার স্টেশনের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন ফায়ার স্টেশন সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadFireStations();
        });
      } else {
        throw new Error(data.error || "Failed to save fire station");
      }
    } catch (error) {
      console.error("Error saving fire station:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "ফায়ার স্টেশন যোগ করতে সমস্যা হয়েছে",
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
      officer: "",
      address: "",
      contact: "",
      type: "main",
      email: "",
      description: "",
      workingHours: "",
      emergencyContact: "",
      equipment: [],
    });
    setErrors({});
  };

  const getTypeText = (type) => {
    switch (type) {
      case "main":
        return "মূল স্টেশন";
      case "sub":
        return "উপ-স্টেশন";
      case "emergency":
        return "জরুরি স্টেশন";
      default:
        return type;
    }
  };

  const getEquipmentLabel = (equipment) => {
    const found = equipmentOptions.find((opt) => opt.value === equipment);
    return found ? found.label : equipment;
  };

  const getEquipmentIcon = (equipment) => {
    const found = equipmentOptions.find((opt) => opt.value === equipment);
    return found ? found.icon : "✓";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ফায়ার স্টেশন</h1>
          <p className="mt-1 text-sm text-slate-600">
            ফায়ার স্টেশনের তথ্য যোগ করুন এবং সম্পাদনা করুন
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
          নতুন ফায়ার স্টেশন যোগ করুন
        </button>
      </div>

      {/* Fire Stations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : fireStations.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaFire className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো ফায়ার স্টেশনের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম ফায়ার স্টেশনের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fireStations.map((station) => (
            <div
              key={station.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 flex-1">
                  {station.name}
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  {getTypeText(station.type)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {station.officer && (
                  <p className="text-sm text-slate-600 flex items-center">
                    <FaUser className="w-3 h-3 mr-2 text-slate-400" />
                    {station.officer}
                  </p>
                )}
                {station.address && (
                  <p className="text-sm text-slate-600 flex items-center line-clamp-1">
                    <FaMapMarkerAlt className="w-3 h-3 mr-2 text-slate-400 flex-shrink-0" />
                    {station.address}
                  </p>
                )}
                {station.contact && (
                  <p className="text-sm text-slate-600 flex items-center">
                    <FaPhone className="w-3 h-3 mr-2 text-slate-400" />
                    {station.contact}
                  </p>
                )}
                {station.emergencyContact && (
                  <p className="text-sm text-red-600 flex items-center font-medium">
                    <FaPhone className="w-3 h-3 mr-2" />
                    জরুরি: {station.emergencyContact}
                  </p>
                )}
              </div>

              {station.equipment && station.equipment.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    সরঞ্জাম ({station.equipment.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {station.equipment.slice(0, 3).map((eq, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700"
                      >
                        {getEquipmentIcon(eq)} {getEquipmentLabel(eq)}
                      </span>
                    ))}
                    {station.equipment.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                        +{station.equipment.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleEdit(station)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                <FaEdit className="h-3 w-3" />
                সম্পাদনা
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Fire Station Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaFire className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "ফায়ার স্টেশন সম্পাদনা করুন"
                        : "নতুন ফায়ার স্টেশন যোগ করুন"}
                    </h2>
                    <p className="text-red-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
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
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaShieldAlt className="w-5 h-5 mr-2 text-red-600" />
                    মৌলিক তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        স্টেশনের নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all ${
                          errors.name ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="ফায়ার স্টেশনের নাম"
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
                        স্টেশনের ধরন <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all ${
                          errors.type ? "border-red-500" : "border-slate-200"
                        }`}
                      >
                        <option value="main">মূল স্টেশন</option>
                        <option value="sub">উপ-স্টেশন</option>
                        <option value="emergency">জরুরি স্টেশন</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaPhone className="w-5 h-5 mr-2 text-red-600" />
                    যোগাযোগের তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        অফিসারের নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="officer"
                        value={formData.officer}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all ${
                          errors.officer ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="অফিসারের নাম"
                      />
                      {errors.officer && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfo className="w-3 h-3 mr-1" />
                          {errors.officer}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        যোগাযোগের নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all ${
                          errors.contact ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="01XXXXXXXXX"
                      />
                      {errors.contact && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfo className="w-3 h-3 mr-1" />
                          {errors.contact}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        জরুরি যোগাযোগের নম্বর
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                        placeholder="জরুরি নম্বর (ঐচ্ছিক)"
                      />
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
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                        placeholder="example@firestation.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 mr-2 text-red-600" />
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
                      className={`w-full rounded-lg border-2 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all ${
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

                {/* Equipment */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaBolt className="w-5 h-5 mr-2 text-red-600" />
                    সরঞ্জামসমূহ
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {equipmentOptions.map((equipment) => (
                      <label
                        key={equipment.value}
                        className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.equipment.includes(equipment.value)}
                          onChange={() => handleEquipmentToggle(equipment.value)}
                          className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm font-medium text-slate-700">
                          {equipment.icon} {equipment.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FaCalendar className="w-5 h-5 mr-2 text-red-600" />
                    অতিরিক্ত তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        কর্মঘণ্টা
                      </label>
                      <input
                        type="text"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                        placeholder="২৪ ঘণ্টা সেবা"
                      />
                    </div>
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
                    className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                    placeholder="ফায়ার স্টেশন সম্পর্কে বিস্তারিত বিবরণ..."
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
                  disabled={createLoading}
                  className={`flex-1 rounded-lg px-4 py-3 font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                    createLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
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
                      {editingId ? "আপডেট করুন" : "স্টেশন যোগ করুন"}
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

