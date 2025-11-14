"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaBolt,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaInfoCircle,
  FaClock,
  FaUser,
  FaBuilding,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function ElectricityPage() {
  const { data: session, status } = useSession();
  const [electricities, setElectricities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const electricityTypes = [
    { value: "power_plant", label: "বিদ্যুৎ কেন্দ্র" },
    { value: "substation", label: "সাবস্টেশন" },
    { value: "distribution_center", label: "বিতরণ কেন্দ্র" },
    { value: "customer_service", label: "গ্রাহক সেবা কেন্দ্র" },
    { value: "billing_office", label: "বিলিং অফিস" },
    { value: "maintenance_center", label: "রক্ষণাবেক্ষণ কেন্দ্র" },
    { value: "emergency_service", label: "জরুরি সেবা কেন্দ্র" },
    { value: "regional_office", label: "আঞ্চলিক অফিস" },
  ];

  const areas = [
    "গোবিন্দগঞ্জ",
    "বগুড়া সদর",
    "শিবগঞ্জ",
    "ধুনট",
    "আদমদীঘি",
    "নন্দীগ্রাম",
    "সারিয়াকান্দি",
    "শাজাহানপুর",
    "গাবতলী",
    "কাহালু",
    "দুপচাঁচিয়া",
    "সোনাতলা",
    "শেরপুর",
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    type: "",
    description: "",
    email: "",
    website: "",
    workingHours: "",
    emergencyContact: "",
    area: "",
    capacity: "",
    manager: "",
    establishedYear: "",
    serviceArea: "",
    billingSystem: "",
    paymentMethods: "",
    complaintsNumber: "",
    officeHours: "",
    holidayInfo: "",
    specialServices: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadElectricities();
  }, []);

  const loadElectricities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/electricities");
      const data = await res.json();

      if (res.ok) {
        setElectricities(data.electricities || []);
      }
    } catch (error) {
      console.error("Error loading electricities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "বিদ্যুৎ কেন্দ্রের নাম প্রয়োজন";
    if (!formData.address.trim()) newErrors.address = "ঠিকানা প্রয়োজন";
    if (!formData.contact.trim()) newErrors.contact = "যোগাযোগের নম্বর প্রয়োজন";
    if (!formData.type) newErrors.type = "কেন্দ্রের ধরণ নির্বাচন করুন";
    if (!formData.area) newErrors.area = "এলাকা নির্বাচন করুন";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (electricity) => {
    setEditingId(electricity.id);
    setFormData({
      name: electricity.name || "",
      address: electricity.address || "",
      contact: electricity.contact || "",
      type: electricity.type || "",
      description: electricity.description || "",
      email: electricity.email || "",
      website: electricity.website || "",
      workingHours: electricity.workingHours || "",
      emergencyContact: electricity.emergencyContact || "",
      area: electricity.area || "",
      capacity: electricity.capacity || "",
      manager: electricity.manager || "",
      establishedYear: electricity.establishedYear || "",
      serviceArea: electricity.serviceArea || "",
      billingSystem: electricity.billingSystem || "",
      paymentMethods: electricity.paymentMethods || "",
      complaintsNumber: electricity.complaintsNumber || "",
      officeHours: electricity.officeHours || "",
      holidayInfo: electricity.holidayInfo || "",
      specialServices: electricity.specialServices || "",
    });
    setShowCreateModal(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নিশ্চিত করুন",
      text: "আপনি কি এই বিদ্যুৎ কেন্দ্রের তথ্য মুছে ফেলতে চান?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/electricities/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "বিদ্যুৎ কেন্দ্রের তথ্য সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
          loadElectricities();
        } else {
          throw new Error(data.error || "Failed to delete electricity");
        }
      } catch (error) {
        console.error("Error deleting electricity:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.message || "বিদ্যুৎ কেন্দ্রের তথ্য মুছে ফেলতে সমস্যা হয়েছে",
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
        text: "বিদ্যুৎ কেন্দ্রের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        res = await fetch(`/api/electricities/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/electricities", {
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
            ? "বিদ্যুৎ কেন্দ্রের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন বিদ্যুৎ কেন্দ্রের তথ্য সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadElectricities();
        });
      } else {
        throw new Error(data.error || "Failed to save electricity");
      }
    } catch (error) {
      console.error("Error saving electricity:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "বিদ্যুৎ কেন্দ্রের তথ্য যোগ করতে সমস্যা হয়েছে",
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
      address: "",
      contact: "",
      type: "",
      description: "",
      email: "",
      website: "",
      workingHours: "",
      emergencyContact: "",
      area: "",
      capacity: "",
      manager: "",
      establishedYear: "",
      serviceArea: "",
      billingSystem: "",
      paymentMethods: "",
      complaintsNumber: "",
      officeHours: "",
      holidayInfo: "",
      specialServices: "",
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">বিদ্যুৎ অফিস</h1>
          <p className="mt-1 text-sm text-slate-600">
            বিদ্যুৎ কেন্দ্রের তথ্য যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-yellow-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন বিদ্যুৎ কেন্দ্র যোগ করুন
        </button>
      </div>

      {/* Electricities List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      ) : electricities.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaBolt className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো বিদ্যুৎ কেন্দ্রের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম বিদ্যুৎ কেন্দ্রের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left border-b">
                <th className="py-3 px-4 font-semibold text-gray-700">নাম</th>
                <th className="py-3 px-4 font-semibold text-gray-700">ধরণ</th>
                <th className="py-3 px-4 font-semibold text-gray-700">এলাকা</th>
                <th className="py-3 px-4 font-semibold text-gray-700">যোগাযোগ</th>
                <th className="py-3 px-4 font-semibold text-gray-700">ঠিকানা</th>
                <th className="py-3 px-4 font-semibold text-gray-700">কর্ম</th>
              </tr>
            </thead>
            <tbody>
              {electricities.map((electricity) => (
                <tr key={electricity.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {electricity.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {electricityTypes.find((t) => t.value === electricity.type)
                      ?.label || electricity.type}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{electricity.area}</td>
                  <td className="py-3 px-4 text-gray-600">{electricity.contact}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="max-w-xs truncate" title={electricity.address}>
                      {electricity.address}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(electricity)}
                        className="text-blue-600 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(electricity.id)}
                        className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Electricity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBolt className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId
                        ? "বিদ্যুৎ কেন্দ্র সম্পাদনা করুন"
                        : "নতুন বিদ্যুৎ কেন্দ্র যোগ করুন"}
                    </h2>
                    <p className="text-yellow-100 mt-1 text-sm">
                      সব তথ্য সঠিকভাবে পূরণ করুন
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:text-yellow-200 text-2xl transition"
                >
                  &times;
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FaBolt className="text-yellow-500" />
                  মৌলিক তথ্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      বিদ্যুৎ কেন্দ্রের নাম <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="যেমন: গোবিন্দগঞ্জ বিদ্যুৎ কেন্দ্র"
                      className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                        errors.name
                          ? "border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-yellow-500 focus:ring-yellow-100"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      কেন্দ্রের ধরণ <span className="text-rose-600">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                        errors.type
                          ? "border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-yellow-500 focus:ring-yellow-100"
                      }`}
                    >
                      <option value="">ধরণ নির্বাচন করুন</option>
                      {electricityTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      এলাকা/উপজেলা <span className="text-rose-600">*</span>
                    </label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                        errors.area
                          ? "border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-yellow-500 focus:ring-yellow-100"
                      }`}
                    >
                      <option value="">এলাকা নির্বাচন করুন</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    {errors.area && (
                      <p className="text-red-600 text-sm mt-1">{errors.area}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      কেন্দ্রের ক্ষমতা (মেগাওয়াট)
                    </label>
                    <input
                      type="text"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="যেমন: ৫০ মেগাওয়াট"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      কেন্দ্র ব্যবস্থাপক
                    </label>
                    <input
                      type="text"
                      name="manager"
                      value={formData.manager}
                      onChange={handleChange}
                      placeholder="ব্যবস্থাপকের নাম"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      প্রতিষ্ঠার বছর
                    </label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      placeholder="যেমন: ১৯৮৫"
                      min="1900"
                      max="2024"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FaPhone className="text-green-500" />
                  যোগাযোগের তথ্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      প্রধান ফোন নম্বর <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      placeholder="০৫১-৬২৩৪৫৬"
                      className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                        errors.contact
                          ? "border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-green-500 focus:ring-green-100"
                      }`}
                    />
                    {errors.contact && (
                      <p className="text-red-600 text-sm mt-1">{errors.contact}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      জরুরি যোগাযোগ নম্বর
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="জরুরি ফোন নম্বর"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      অভিযোগ নম্বর
                    </label>
                    <input
                      type="tel"
                      name="complaintsNumber"
                      value={formData.complaintsNumber}
                      onChange={handleChange}
                      placeholder="অভিযোগের জন্য ফোন নম্বর"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      ইমেইল ঠিকানা
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="info@electricity.gov.bd"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      ওয়েবসাইট
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.electricity.gov.bd"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FaMapPin className="text-red-500" />
                  অবস্থান ও সেবা এলাকা
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      সম্পূর্ণ ঠিকানা <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      placeholder="বিস্তারিত ঠিকানা দিন (গ্রাম, পোস্ট অফিস, জেলা)"
                      className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all resize-none ${
                        errors.address
                          ? "border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-red-500 focus:ring-red-100"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      সেবা প্রদান এলাকা
                    </label>
                    <textarea
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      rows="3"
                      placeholder="কোন কোন এলাকায় সেবা প্রদান করে"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      বিশেষ সেবাসমূহ
                    </label>
                    <textarea
                      name="specialServices"
                      value={formData.specialServices}
                      onChange={handleChange}
                      rows="3"
                      placeholder="বিশেষ সেবা বা সুবিধা"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FaGlobe className="text-purple-500" />
                  সেবা তথ্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      অফিস সময়
                    </label>
                    <input
                      type="text"
                      name="officeHours"
                      value={formData.officeHours}
                      onChange={handleChange}
                      placeholder="সকাল ৯টা - বিকাল ৫টা"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      ছুটির দিনের তথ্য
                    </label>
                    <input
                      type="text"
                      name="holidayInfo"
                      value={formData.holidayInfo}
                      onChange={handleChange}
                      placeholder="শুক্র-শনি বন্ধ"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      বিলিং সিস্টেম
                    </label>
                    <input
                      type="text"
                      name="billingSystem"
                      value={formData.billingSystem}
                      onChange={handleChange}
                      placeholder="মাসিক/দ্বিমাসিক বিলিং"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      পেমেন্ট পদ্ধতি
                    </label>
                    <input
                      type="text"
                      name="paymentMethods"
                      value={formData.paymentMethods}
                      onChange={handleChange}
                      placeholder="নগদ/ব্যাংক/মোবাইল ব্যাংকিং"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <FaInfoCircle className="text-blue-500" />
                  অতিরিক্ত তথ্য
                </h3>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    কেন্দ্রের বিবরণ
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="কেন্দ্রের বিস্তারিত বিবরণ, ইতিহাস, বিশেষত্ব ইত্যাদি"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                  />
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
                  disabled={createLoading}
                  className={`flex-1 rounded-xl px-4 py-3 font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                    createLoading
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
                      <FaBolt className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "বিদ্যুৎ কেন্দ্র যোগ করুন"}
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

