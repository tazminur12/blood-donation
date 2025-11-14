"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaBus,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaMapPin,
  FaPhone,
  FaUser,
  FaRoute,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function BusPage() {
  const { data: session, status } = useSession();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const districts = [
    { value: "gobindaganj", label: "গোবিন্দগঞ্জ" },
    { value: "bogura", label: "বগুড়া" },
    { value: "rajshahi", label: "রাজশাহী" },
    { value: "chapainawabganj", label: "চাঁপাইনবাবগঞ্জ" },
    { value: "naogaon", label: "নওগাঁ" },
    { value: "sirajganj", label: "সিরাজগঞ্জ" },
    { value: "pabna", label: "পাবনা" },
    { value: "joypurhat", label: "জয়পুরহাট" },
  ];

  const [formData, setFormData] = useState({
    counterName: "",
    busName: "",
    route: "",
    contactNumber: "",
    operatorName: "",
    busType: "",
    fare: "",
    district: "gobindaganj",
    description: "",
    facilities: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/buses");
      const data = await res.json();

      if (res.ok) {
        setBuses(data.buses || []);
      }
    } catch (error) {
      console.error("Error loading buses:", error);
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
    if (!formData.counterName.trim()) newErrors.counterName = "কাউন্টারের নাম প্রয়োজন";
    if (!formData.busName.trim()) newErrors.busName = "বাসের নাম প্রয়োজন";
    if (!formData.route.trim()) newErrors.route = "রুট প্রয়োজন";
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "যোগাযোগের নম্বর প্রয়োজন";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (bus) => {
    setEditingId(bus.id);
    setFormData({
      counterName: bus.counterName || "",
      busName: bus.busName || "",
      route: bus.route || "",
      contactNumber: bus.contactNumber || "",
      operatorName: bus.operatorName || "",
      busType: bus.busType || "",
      fare: bus.fare || "",
      district: bus.district || "bogura",
      description: bus.description || "",
      facilities: bus.facilities || "",
    });
    setShowCreateModal(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নিশ্চিত করুন",
      text: "আপনি কি এই বাসের তথ্য মুছে ফেলতে চান?",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/buses/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "বাসের তথ্য সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
          loadBuses();
        } else {
          throw new Error(data.error || "Failed to delete bus");
        }
      } catch (error) {
        console.error("Error deleting bus:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: error.message || "বাসের তথ্য মুছে ফেলতে সমস্যা হয়েছে",
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
        text: "বাসের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
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
        res = await fetch(`/api/buses/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/buses", {
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
            ? "বাসের তথ্য সফলভাবে আপডেট করা হয়েছে"
            : "নতুন বাসের তথ্য সফলভাবে যোগ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadBuses();
        });
      } else {
        throw new Error(data.error || "Failed to save bus");
      }
    } catch (error) {
      console.error("Error saving bus:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "বাসের তথ্য যোগ করতে সমস্যা হয়েছে",
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
      counterName: "",
      busName: "",
      route: "",
      contactNumber: "",
      operatorName: "",
      busType: "",
      fare: "",
      district: "gobindaganj",
      description: "",
      facilities: "",
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">বাস টিকিট সেবা</h1>
          <p className="mt-1 text-sm text-slate-600">
            বাস কাউন্টার ও টিকিট সংক্রান্ত তথ্য যোগ করুন এবং সম্পাদনা করুন
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
          নতুন বাস যোগ করুন
        </button>
      </div>

      {/* Buses List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      ) : buses.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaBus className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো বাসের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম বাসের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left border-b">
                <th className="py-3 px-4 font-semibold text-gray-700">কাউন্টার</th>
                <th className="py-3 px-4 font-semibold text-gray-700">বাসের নাম</th>
                <th className="py-3 px-4 font-semibold text-gray-700">রুট</th>
                <th className="py-3 px-4 font-semibold text-gray-700">ধরন</th>
                <th className="py-3 px-4 font-semibold text-gray-700">ভাড়া</th>
                <th className="py-3 px-4 font-semibold text-gray-700">যোগাযোগ</th>
                <th className="py-3 px-4 font-semibold text-gray-700">জেলা</th>
                <th className="py-3 px-4 font-semibold text-gray-700">কর্ম</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {bus.counterName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{bus.busName}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="max-w-xs truncate" title={bus.route}>
                      {bus.route}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{bus.busType || "-"}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {bus.fare ? `৳${bus.fare}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{bus.contactNumber}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {districts.find((d) => d.value === bus.district)?.label || bus.district}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bus)}
                        className="text-blue-600 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bus.id)}
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

      {/* Create/Edit Bus Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBus className="h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingId ? "বাসের তথ্য সম্পাদনা করুন" : "নতুন বাস যোগ করুন"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Counter Name */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapPin className="mr-2 h-4 w-4 text-yellow-500" />
                    কাউন্টারের নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="counterName"
                    value={formData.counterName}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: বগুড়া বাস স্ট্যান্ড"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.counterName
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-yellow-500 focus:ring-yellow-100"
                    }`}
                  />
                  {errors.counterName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.counterName}
                    </p>
                  )}
                </div>

                {/* Bus Name */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaBus className="mr-2 h-4 w-4 text-blue-500" />
                    বাসের নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="busName"
                    value={formData.busName}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: গ্রীন লাইন"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.busName
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {errors.busName && (
                    <p className="text-red-600 text-sm mt-1">{errors.busName}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaPhone className="mr-2 h-4 w-4 text-green-500" />
                    যোগাযোগের নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: ০১৭১১-XXXXXX"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all ${
                      errors.contactNumber
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-green-500 focus:ring-green-100"
                    }`}
                  />
                  {errors.contactNumber && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* Operator Name */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaUser className="mr-2 h-4 w-4 text-purple-500" />
                    অপারেটরের নাম
                  </label>
                  <input
                    type="text"
                    name="operatorName"
                    value={formData.operatorName}
                    onChange={handleChange}
                    placeholder="বাস অপারেটরের নাম"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                </div>

                {/* Bus Type */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaBus className="mr-2 h-4 w-4 text-indigo-500" />
                    বাসের ধরন
                  </label>
                  <input
                    type="text"
                    name="busType"
                    value={formData.busType}
                    onChange={handleChange}
                    placeholder="যেমন: এসি, লোকাল"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Fare */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaDollarSign className="mr-2 h-4 w-4 text-orange-500" />
                    ভাড়া (টাকা)
                  </label>
                  <input
                    type="text"
                    name="fare"
                    value={formData.fare}
                    onChange={handleChange}
                    placeholder="যেমন: ৫০০ (AC), ৩০০ (Non-AC)"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaMapPin className="mr-2 h-4 w-4 text-red-500" />
                    জেলা
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                  >
                    {districts.map((district) => (
                      <option key={district.value} value={district.value}>
                        {district.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Route */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaRoute className="mr-2 h-4 w-4 text-cyan-500" />
                    রুট ও সময়সূচী <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="যেমন: বগুড়া - ঢাকা | সকাল ৭টা"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base focus:outline-none focus:ring-4 transition-all resize-none ${
                      errors.route
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
                    }`}
                  />
                  {errors.route && (
                    <p className="text-red-600 text-sm mt-1">{errors.route}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaInfoCircle className="mr-2 h-4 w-4 text-teal-500" />
                    বিবরণ
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="বাস সম্পর্কে অতিরিক্ত তথ্য..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all resize-none"
                  />
                </div>

                {/* Facilities */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-slate-700 flex items-center">
                    <FaInfoCircle className="mr-2 h-4 w-4 text-pink-500" />
                    সুবিধা
                  </label>
                  <input
                    type="text"
                    name="facilities"
                    value={formData.facilities}
                    onChange={handleChange}
                    placeholder="যেমন: WiFi, AC, Snacks"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
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
                      <FaBus className="h-4 w-4" />
                      {editingId ? "আপডেট করুন" : "বাস যোগ করুন"}
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

