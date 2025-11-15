"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaUsersCog,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFileImage,
  FaEye,
  FaEyeSlash,
  FaSortNumericDown,
} from "react-icons/fa";

export default function CommitteePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    photo: "",
    description: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    loadMembers();
  }, [session, status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMembers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/admin/committee?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setMembers(data.members || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "কমিটি সদস্য লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading members:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "কমিটি সদস্য লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: uploadFormData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Image upload failed");
    }

    return data.imageUrl;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setFormData({
        ...formData,
        photo: imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddMember = async () => {
    if (!formData.name || !formData.position) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে নাম এবং পদবী প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setUploading(true);

      const res = await fetch("/api/admin/committee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "কমিটি সদস্য সফলভাবে যোগ করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        // Reset form
        setFormData({
          name: "",
          position: "",
          email: "",
          phone: "",
          photo: "",
          description: "",
          order: 0,
          isActive: true,
        });
        setShowAddModal(false);
        loadMembers();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "কমিটি সদস্য যোগ করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error adding member:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: error.message || "কমিটি সদস্য যোগ করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      position: member.position || "",
      email: member.email || "",
      phone: member.phone || "",
      photo: member.photo || "",
      description: member.description || "",
      order: member.order || 0,
      isActive: member.isActive !== undefined ? member.isActive : true,
    });
    setShowEditModal(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    if (!formData.name || !formData.position) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "অনুগ্রহ করে নাম এবং পদবী প্রদান করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setUploading(true);

      const res = await fetch(`/api/admin/committee/${editingMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "কমিটি সদস্য সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });

        setShowEditModal(false);
        setEditingMember(null);
        setFormData({
          name: "",
          position: "",
          email: "",
          phone: "",
          photo: "",
          description: "",
          order: 0,
          isActive: true,
        });
        loadMembers();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "কমিটি সদস্য আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating member:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "কমিটি সদস্য আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (memberId, memberName) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "কমিটি সদস্য মুছে ফেলুন?",
      html: `<p>আপনি কি নিশ্চিত যে আপনি "<strong>${memberName || "এই সদস্য"}</strong>" মুছে ফেলতে চান?</p><p class="text-sm text-red-600 mt-2">এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>`,
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/committee?memberId=${memberId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "কমিটি সদস্য সফলভাবে মুছে ফেলা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        loadMembers();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "কমিটি সদস্য মুছে ফেলতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "কমিটি সদস্য মুছে ফেলতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "কমিটি সদস্য লোড হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaUsersCog className="text-blue-600" />
            কমিটি
          </h1>
          <p className="text-slate-600 mt-1">
            কমিটি সদস্য পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          <span>নতুন সদস্য যোগ করুন</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট সদস্য</p>
          <p className="text-2xl font-bold text-slate-900">{members.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">সক্রিয়</p>
          <p className="text-2xl font-bold text-blue-700">
            {members.filter((m) => m.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">পদবী</p>
          <p className="text-2xl font-bold text-indigo-700">
            {new Set(members.map((m) => m.position).filter(Boolean)).size}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, পদবী, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Members List */}
      {members.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FaUsersCog className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">কোন কমিটি সদস্য পাওয়া যায়নি</p>
          <p className="text-slate-400 text-sm mb-4">
            নতুন সদস্য যোগ করতে &quot;নতুন সদস্য যোগ করুন&quot; বাটনে ক্লিক করুন
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            <span>নতুন সদস্য যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Photo */}
              <div className="relative aspect-square bg-slate-100">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                    <FaUser className="text-6xl text-blue-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <FaTrash />
                  </button>
                </div>
                {!member.isActive && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                    <FaEyeSlash className="inline mr-1" />
                    নিষ্ক্রিয়
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {member.name || "Untitled"}
                </h3>
                <p className="text-sm text-blue-600 font-semibold mb-3">
                  {member.position || "—"}
                </p>
                {member.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {member.description}
                  </p>
                )}
                <div className="space-y-1 text-xs text-slate-500">
                  {member.email && (
                    <div className="flex items-center gap-1">
                      <FaEnvelope className="text-blue-600" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-1">
                      <FaPhone className="text-green-600" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                নতুন কমিটি সদস্য যোগ করুন
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    name: "",
                    position: "",
                    email: "",
                    phone: "",
                    photo: "",
                    description: "",
                    order: 0,
                    isActive: true,
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaUser className="inline mr-2 text-blue-600" />
                    নাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="সদস্যের নাম"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    পদবী <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="উদাহরণ: সভাপতি, সম্পাদক"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-green-600" />
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaPhone className="inline mr-2 text-purple-600" />
                    ফোন (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaFileImage className="inline mr-2 text-blue-600" />
                  ছবি (ঐচ্ছিক)
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.photo && (
                  <div className="mt-2">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                    />
                    {uploading && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                        <FaSpinner className="animate-spin" />
                        <span>আপলোড হচ্ছে...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="সদস্যের সম্পর্কে সংক্ষিপ্ত বিবরণ"
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaSortNumericDown className="inline mr-2 text-indigo-600" />
                  ক্রম (ঐচ্ছিক)
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  কম সংখ্যা আগে দেখাবে
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  সক্রিয়
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    name: "",
                    position: "",
                    email: "",
                    phone: "",
                    photo: "",
                    description: "",
                    order: 0,
                    isActive: true,
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleAddMember}
                disabled={uploading || !formData.name || !formData.position}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>যোগ করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>যোগ করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                কমিটি সদস্য সম্পাদনা করুন
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                  setFormData({
                    name: "",
                    position: "",
                    email: "",
                    phone: "",
                    photo: "",
                    description: "",
                    order: 0,
                    isActive: true,
                  });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo Preview */}
              {editingMember.photo && (
                <div className="flex justify-center">
                  <img
                    src={editingMember.photo}
                    alt={editingMember.name}
                    className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaUser className="inline mr-2 text-blue-600" />
                    নাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="সদস্যের নাম"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    পদবী <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="উদাহরণ: সভাপতি, সম্পাদক"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-green-600" />
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaPhone className="inline mr-2 text-purple-600" />
                    ফোন (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaFileImage className="inline mr-2 text-blue-600" />
                  ছবি (ঐচ্ছিক)
                </label>
                {editingMember.photo && (
                  <div className="mb-2">
                    <img
                      src={editingMember.photo}
                      alt={editingMember.name}
                      className="max-w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.photo && formData.photo !== editingMember.photo && (
                  <div className="mt-2">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="max-w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    {uploading && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                        <FaSpinner className="animate-spin" />
                        <span>আপলোড হচ্ছে...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="সদস্যের সম্পর্কে সংক্ষিপ্ত বিবরণ"
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaSortNumericDown className="inline mr-2 text-indigo-600" />
                  ক্রম (ঐচ্ছিক)
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  কম সংখ্যা আগে দেখাবে
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActiveEdit" className="text-sm text-slate-700">
                  সক্রিয়
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                  setFormData({
                    name: "",
                    position: "",
                    email: "",
                    phone: "",
                    photo: "",
                    description: "",
                    order: 0,
                    isActive: true,
                  });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleUpdateMember}
                disabled={uploading || !formData.name || !formData.position}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>আপডেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>আপডেট করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

