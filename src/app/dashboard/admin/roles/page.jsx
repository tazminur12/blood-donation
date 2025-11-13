"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaUserShield,
  FaUser,
  FaUsers,
  FaSearch,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaFilter,
} from "react-icons/fa";

const roleLabels = {
  admin: "অ্যাডমিন",
  donor: "রক্তদাতা",
  volunteer: "স্বেচ্ছাসেবী",
  user: "ব্যবহারকারী",
};

const roleColors = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  donor: "bg-rose-100 text-rose-700 border-rose-200",
  volunteer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  user: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function RoleManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    donor: 0,
    volunteer: 0,
    user: 0,
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

    // Only load users if user is admin
    if (session?.user?.role === "admin") {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      
      if (res.ok) {
        console.log("Users loaded:", data.users?.length || 0);
        setUsers(data.users || []);
        calculateStats(data.users || []);
      } else {
        console.error("Error response:", data);
        if (data.currentRole) {
          Swal.fire({
            icon: "warning",
            title: "অনুমতি নেই",
            html: `<p>${data.error}</p><p class="mt-2"><strong>আপনার বর্তমান রোল:</strong> ${data.currentRole}</p><p class="mt-2">রোল পরিবর্তন করতে একজন অ্যাডমিনের সাথে যোগাযোগ করুন।</p>`,
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ত্রুটি",
            text: data.error || data.message || "ব্যবহারকারী লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading users:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ব্যবহারকারী লোড করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList) => {
    const newStats = {
      total: userList.length,
      admin: 0,
      donor: 0,
      volunteer: 0,
      user: 0,
    };

    userList.forEach((user) => {
      const role = user.role || "user";
      if (newStats[role] !== undefined) {
        newStats[role]++;
      }
    });

    setStats(newStats);
  };

  const handleEditRole = (user) => {
    setEditingUserId(user.id);
    setNewRole(user.role || "user");
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewRole("");
  };

  const handleUpdateRole = async (userId) => {
    if (!newRole) {
      Swal.fire({
        icon: "warning",
        title: "রোল নির্বাচন করুন",
        text: "অনুগ্রহ করে একটি রোল নির্বাচন করুন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch("/api/admin/roles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        calculateStats(updatedUsers);
        setEditingUserId(null);
        setNewRole("");
        
        // Show success message
        if (data.warning) {
          Swal.fire({
            icon: "info",
            title: "রোল আপডেট",
            text: data.message || "রোল আপডেট করা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#3b82f6",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "সফল!",
            html: `<p>রোল সফলভাবে আপডেট করা হয়েছে</p><p class="mt-2 text-sm text-gray-600">নতুন রোল: <strong>${roleLabels[newRole] || newRole}</strong></p>`,
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
        }
      } else {
        console.error("Error response:", data);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || data.details || "রোল আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "রোল আপডেট করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading while session is loading or users are being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "লোড হচ্ছে..."}
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
            <FaUserShield className="text-rose-600" />
            রোল ম্যানেজমেন্ট
          </h1>
          <p className="text-slate-600 mt-1">
            ব্যবহারকারীদের রোল দেখুন এবং পরিবর্তন করুন
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">মোট ব্যবহারকারী</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">অ্যাডমিন</p>
          <p className="text-2xl font-bold text-purple-700">{stats.admin}</p>
        </div>
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">রক্তদাতা</p>
          <p className="text-2xl font-bold text-rose-700">{stats.donor}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">স্বেচ্ছাসেবী</p>
          <p className="text-2xl font-bold text-emerald-700">
            {stats.volunteer}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">ব্যবহারকারী</p>
          <p className="text-2xl font-bold text-slate-700">{stats.user}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব রোল</option>
              <option value="admin">অ্যাডমিন</option>
              <option value="donor">রক্তদাতা</option>
              <option value="volunteer">স্বেচ্ছাসেবী</option>
              <option value="user">ব্যবহারকারী</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ব্যবহারকারী
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ইমেইল
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  রক্তের গ্রুপ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  বর্তমান রোল
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  কাজ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FaUsers className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">কোন ব্যবহারকারী পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                            <span className="text-sky-700 font-semibold text-sm">
                              {getInitials(user.name)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">
                            {user.name || "নাম নেই"}
                          </p>
                          {user.mobile && (
                            <p className="text-sm text-slate-500">{user.mobile}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-600">
                        {user.bloodGroup || "নির্ধারিত নয়"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        >
                          <option value="user">ব্যবহারকারী</option>
                          <option value="donor">রক্তদাতা</option>
                          <option value="volunteer">স্বেচ্ছাসেবী</option>
                          <option value="admin">অ্যাডমিন</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            roleColors[user.role || "user"]
                          }`}
                        >
                          {roleLabels[user.role || "user"]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateRole(user.id)}
                            disabled={updating}
                            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                          >
                            {updating ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={updating}
                            className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition disabled:opacity-50"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditRole(user)}
                          className="p-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>দ্রষ্টব্য:</strong> রোল পরিবর্তন করলে ব্যবহারকারীকে লগআউট করে আবার
          লগইন করতে হবে নতুন রোলের সুবিধা পেতে।
        </p>
      </div>
    </div>
  );
}

