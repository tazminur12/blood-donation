"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaBell,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaTimesCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaTrash,
} from "react-icons/fa";

const typeLabels = {
  info: "তথ্য",
  success: "সফল",
  warning: "সতর্কতা",
  error: "ত্রুটি",
  donor: "রক্তদাতা",
  request: "অনুরোধ",
  campaign: "ক্যাম্পেইন",
  system: "সিস্টেম",
};

const typeColors = {
  info: "bg-blue-100 text-blue-700 border-blue-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  error: "bg-rose-100 text-rose-700 border-rose-200",
  donor: "bg-rose-100 text-rose-700 border-rose-200",
  request: "bg-purple-100 text-purple-700 border-purple-200",
  campaign: "bg-sky-100 text-sky-700 border-sky-200",
  system: "bg-slate-100 text-slate-700 border-slate-200",
};

const typeIcons = {
  info: FaInfoCircle,
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  error: FaExclamationCircle,
  donor: FaInfoCircle,
  request: FaInfoCircle,
  campaign: FaInfoCircle,
  system: FaInfoCircle,
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    recipientEmail: "",
    recipientRole: "all",
    priority: "normal",
  });
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    byType: {},
  });

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

    // Only load notifications if user is admin
    if (session?.user?.role === "admin") {
      loadNotifications();
    }
  }, [session, status, router]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType !== "all") params.append("type", filterType);
      if (filterStatus !== "all") params.append("status", filterStatus);
      
      const res = await fetch(`/api/admin/notifications?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        console.log("Notifications loaded:", data.notifications?.length || 0);
        setNotifications(data.notifications || []);
        setStats(data.stats || {
          total: 0,
          unread: 0,
          read: 0,
          byType: {},
        });
      } else {
        console.error("Error response:", data);
        if (data.currentRole) {
          Swal.fire({
            icon: "warning",
            title: "অনুমতি নেই",
            html: `<p>${data.error}</p><p class="mt-2"><strong>আপনার বর্তমান রোল:</strong> ${data.currentRole}</p>`,
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ত্রুটি",
            text: data.error || data.message || "বিজ্ঞপ্তি লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বিজ্ঞপ্তি লোড করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "admin") {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterStatus]);

  const handleMarkAsRead = async (notificationId, currentReadStatus) => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          read: !currentReadStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, read: !currentReadStatus, readAt: !currentReadStatus ? new Date() : null }
              : n
          )
        );
        // Reload to update stats
        loadNotifications();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "বিজ্ঞপ্তি আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বিজ্ঞপ্তি আপডেট করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      Swal.fire({
        icon: "warning",
        title: "অনুগ্রহ করে",
        text: "শিরোনাম এবং বার্তা প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNotification),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "বিজ্ঞপ্তি সফলভাবে তৈরি করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        setShowCreateModal(false);
        setNewNotification({
          title: "",
          message: "",
          type: "info",
          recipientEmail: "",
          recipientRole: "all",
          priority: "normal",
        });
        loadNotifications();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "বিজ্ঞপ্তি তৈরি করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "বিজ্ঞপ্তি তৈরি করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (date) => {
    if (!date) return "নির্ধারিত নয়";
    try {
      return new Date(date).toLocaleString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "নির্ধারিত নয়";
    }
  };

  // Show loading while session is loading or notifications are being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "বিজ্ঞপ্তি লোড হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (redirect will happen)
  if (status === "unauthenticated") {
    return null;
  }

  // If not admin, don't render (redirect will happen)
  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaBell className="text-sky-600" />
            বিজ্ঞপ্তি ব্যবস্থাপনা
          </h1>
          <p className="text-slate-600 mt-1">
            সমস্ত বিজ্ঞপ্তি দেখুন এবং পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition flex items-center gap-2"
        >
          <FaPlus />
          নতুন বিজ্ঞপ্তি
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট বিজ্ঞপ্তি</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">অপঠিত</p>
          <p className="text-2xl font-bold text-blue-700">{stats.unread}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">পঠিত</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.read}</p>
        </div>
        <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">ফিল্টার করা</p>
          <p className="text-2xl font-bold text-sky-700">{filteredNotifications.length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="শিরোনাম, বার্তা বা প্রাপকের ইমেইল দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব ধরন</option>
              <option value="info">তথ্য</option>
              <option value="success">সফল</option>
              <option value="warning">সতর্কতা</option>
              <option value="error">ত্রুটি</option>
              <option value="donor">রক্তদাতা</option>
              <option value="request">অনুরোধ</option>
              <option value="campaign">ক্যাম্পেইন</option>
              <option value="system">সিস্টেম</option>
            </select>
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব অবস্থা</option>
              <option value="unread">অপঠিত</option>
              <option value="read">পঠিত</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-200">
          {filteredNotifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FaBell className="text-4xl text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">কোন বিজ্ঞপ্তি পাওয়া যায়নি</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = typeIcons[notification.type] || FaInfoCircle;
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-slate-50 transition ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        typeColors[notification.type] || typeColors["info"]
                      }`}
                    >
                      <Icon className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">
                              {notification.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                                typeColors[notification.type] || typeColors["info"]
                              }`}
                            >
                              {typeLabels[notification.type] || notification.type}
                            </span>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-slate-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            {notification.recipientEmail && (
                              <span>প্রাপক: {notification.recipientEmail}</span>
                            )}
                            {notification.recipientRole && notification.recipientRole !== "all" && (
                              <span>রোল: {notification.recipientRole}</span>
                            )}
                            <span>সময়: {formatDate(notification.createdAt)}</span>
                            {notification.read && notification.readAt && (
                              <span>পঠিত: {formatDate(notification.readAt)}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleMarkAsRead(notification.id, notification.read)}
                          className={`p-2 rounded-lg transition ${
                            notification.read
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                          title={notification.read ? "অপঠিত হিসাবে চিহ্নিত করুন" : "পঠিত হিসাবে চিহ্নিত করুন"}
                        >
                          {notification.read ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">নতুন বিজ্ঞপ্তি তৈরি করুন</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  শিরোনাম *
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="বিজ্ঞপ্তির শিরোনাম"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  বার্তা *
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="বিজ্ঞপ্তির বার্তা"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ধরন
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="info">তথ্য</option>
                    <option value="success">সফল</option>
                    <option value="warning">সতর্কতা</option>
                    <option value="error">ত্রুটি</option>
                    <option value="donor">রক্তদাতা</option>
                    <option value="request">অনুরোধ</option>
                    <option value="campaign">ক্যাম্পেইন</option>
                    <option value="system">সিস্টেম</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    প্রাপকের রোল
                  </label>
                  <select
                    value={newNotification.recipientRole}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, recipientRole: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">সবাই</option>
                    <option value="admin">অ্যাডমিন</option>
                    <option value="donor">রক্তদাতা</option>
                    <option value="volunteer">স্বেচ্ছাসেবী</option>
                    <option value="user">ব্যবহারকারী</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    প্রাপকের ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={newNotification.recipientEmail}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, recipientEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    অগ্রাধিকার
                  </label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, priority: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="low">নিম্ন</option>
                    <option value="normal">সাধারণ</option>
                    <option value="high">উচ্চ</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                বাতিল
              </button>
              <button
                onClick={handleCreateNotification}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              >
                তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>দ্রষ্টব্য:</strong> এই পৃষ্ঠায় সমস্ত বিজ্ঞপ্তি দেখানো হয়েছে। আপনি বিজ্ঞপ্তি তৈরি করতে পারেন, 
          পঠিত/অপঠিত হিসাবে চিহ্নিত করতে পারেন এবং ফিল্টার ব্যবহার করে বিজ্ঞপ্তি খুঁজে পেতে পারেন।
        </p>
      </div>
    </div>
  );
}

