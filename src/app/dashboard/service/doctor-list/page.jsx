"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaUserMd,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPlus,
  FaSpinner,
  FaImage,
  FaTimes,
  FaEdit,
  FaSave,
  FaBriefcase,
  FaGraduationCap,
  FaClock,
  FaBuilding,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function DoctorListPage() {
  const { data: session, status } = useSession();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    location: "",
    address: "",
    phoneNumber: "",
    email: "",
    specialization: "",
    qualification: "",
    experience: "",
    chamber: "",
    hospital: "",
    availability: "",
    fee: "",
    description: "",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctors");
      const data = await res.json();

      if (res.ok) {
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
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

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setFormData({
      name: doctor.name || "",
      image: doctor.image || "",
      location: doctor.location || "",
      address: doctor.address || "",
      phoneNumber: doctor.phoneNumber || "",
      email: doctor.email || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience || "",
      chamber: doctor.chamber || "",
      hospital: doctor.hospital || "",
      availability: doctor.availability || "",
      fee: doctor.fee || "",
      description: doctor.description || "",
    });
    setImagePreview(doctor.image || "");
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ডাক্তারের তথ্য পোস্ট করতে আপনাকে লগইন করতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!formData.name || !formData.specialization || !formData.phoneNumber) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ডাক্তারের নাম, বিশেষতা এবং ফোন নম্বর প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setCreateLoading(true);
      let res;
      if (editingId) {
        // Update existing doctor
        const doctorData = {
          ...formData,
          fee: formData.fee ? parseInt(formData.fee, 10) || 0 : 0,
        };
        res = await fetch(`/api/doctors/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctorData),
        });
      } else {
        // Create new doctor
        const doctorData = {
          ...formData,
          fee: formData.fee ? parseInt(formData.fee, 10) || 0 : 0,
        };
        res = await fetch("/api/doctors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctorData),
        });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "সফলভাবে যুক্ত হয়েছে!",
          text: editingId
            ? `${formData.name} এর তথ্য আপডেট করা হয়েছে`
            : `${formData.name} কে ডাক্তার তালিকায় যোগ করা হয়েছে`,
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#14b8a6",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          resetForm();
          loadDoctors();
        });
      } else {
        throw new Error(data.error || "Failed to save doctor");
      }
    } catch (error) {
      console.error("Error saving doctor:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "ডাক্তারের তথ্য সেভ করতে ব্যর্থ হয়েছে",
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
      image: "",
      location: "",
      address: "",
      phoneNumber: "",
      email: "",
      specialization: "",
      qualification: "",
      experience: "",
      chamber: "",
      hospital: "",
      availability: "",
      fee: "",
      description: "",
    });
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ডাক্তার তালিকা</h1>
          <p className="mt-1 text-sm text-slate-600">
            ডাক্তারের তথ্য যোগ করুন এবং সম্পাদনা করুন
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <FaPlus className="h-4 w-4" />
          নতুন ডাক্তার যোগ করুন
        </button>
      </div>

      {/* Doctors List for Edit */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <FaUserMd className="mx-auto h-16 w-16 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            কোনো ডাক্তারের তথ্য পাওয়া যায়নি
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            প্রথম ডাক্তারের তথ্য যোগ করুন
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {doctor.image && (
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
              {doctor.specialization && (
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  {doctor.specialization}
                </p>
              )}
              {doctor.location && (
                <p className="mt-1 text-sm text-slate-600">{doctor.location}</p>
              )}
              {doctor.phoneNumber && (
                <p className="mt-1 text-sm text-slate-600">{doctor.phoneNumber}</p>
              )}
              <button
                onClick={() => handleEdit(doctor)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
              >
                <FaEdit className="h-3 w-3" />
                সম্পাদনা
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Doctor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? "ডাক্তার সম্পাদনা করুন" : "নতুন ডাক্তার যোগ করুন"}
              </h2>
              <button
                onClick={resetForm}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ডাক্তারের ছবি
                </label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full rounded-lg object-cover"
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
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-green-500 hover:bg-green-50">
                    <FaImage className="mb-2 h-8 w-8 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {imageUploading ? (
                        <span className="flex items-center gap-2">
                          <FaSpinner className="animate-spin" />
                          আপলোড হচ্ছে...
                        </span>
                      ) : (
                        "ছবি আপলোড করুন (সর্বোচ্চ ৫ MB)"
                      )}
                    </span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    ডাক্তারের নাম <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="ডাক্তারের নাম"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    অবস্থান
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="অবস্থান"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    ইমেইল
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="ইমেইল ঠিকানা"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    বিশেষতা <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({ ...formData, specialization: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="বিশেষতা"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    যোগ্যতা
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData({ ...formData, qualification: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="যোগ্যতা"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    হাসপাতাল
                  </label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) =>
                      setFormData({ ...formData, hospital: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="হাসপাতাল"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    চেম্বার
                  </label>
                  <input
                    type="text"
                    value={formData.chamber}
                    onChange={(e) =>
                      setFormData({ ...formData, chamber: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="চেম্বার"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    যোগাযোগ
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="যোগাযোগ"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    অভ্যর্থনা সময়
                  </label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="অভ্যর্থনা সময়"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    অভিজ্ঞতা
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="অভিজ্ঞতা (যেমনঃ ১৫ বছর)"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    ফি
                  </label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={(e) =>
                      setFormData({ ...formData, fee: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="ফি (যেমনঃ ৫০০)"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ঠিকানা
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="বিস্তারিত ঠিকানা"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  বিবরণ
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ডাক্তার সম্পর্কে অতিরিক্ত তথ্য"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {createLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      {editingId ? "আপডেট করা হচ্ছে..." : "পোস্ট করা হচ্ছে..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {editingId ? <FaSave className="h-4 w-4" /> : <FaPlus className="h-4 w-4" />}
                      {editingId ? "আপডেট করুন" : "যোগ করুন"}
                    </span>
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

