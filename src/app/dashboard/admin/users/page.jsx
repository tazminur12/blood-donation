"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaSearch,
  FaSpinner,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTint,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaEye,
  FaUserShield,
  FaUser,
  FaUserTie,
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

const roleIcons = {
  admin: FaUserShield,
  donor: FaUser,
  volunteer: FaUserTie,
  user: FaUsers,
};

const bloodGroupColors = {
  "A+": "bg-red-100 text-red-700 border-red-200",
  "A-": "bg-red-50 text-red-600 border-red-100",
  "B+": "bg-blue-100 text-blue-700 border-blue-200",
  "B-": "bg-blue-50 text-blue-600 border-blue-100",
  "AB+": "bg-purple-100 text-purple-700 border-purple-200",
  "AB-": "bg-purple-50 text-purple-600 border-purple-100",
  "O+": "bg-green-100 text-green-700 border-green-200",
  "O-": "bg-green-50 text-green-600 border-green-100",
  "Unknown": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function AllUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    donor: 0,
    volunteer: 0,
    user: 0,
    active: 0,
    inactive: 0,
    byBloodGroup: {},
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
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      
      if (res.ok) {
        console.log("Users loaded:", data.users?.length || 0);
        setUsers(data.users || []);
        setStats(data.stats || {
          total: 0,
          admin: 0,
          donor: 0,
          volunteer: 0,
          user: 0,
          active: 0,
          inactive: 0,
          byBloodGroup: {},
        });
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm) ||
      user.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesBloodGroup = 
      filterBloodGroup === "all" || user.bloodGroup === filterBloodGroup;
    
    return matchesSearch && matchesRole && matchesBloodGroup;
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

  const formatDate = (date) => {
    if (!date) return "নির্ধারিত নয়";
    try {
      return new Date(date).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "নির্ধারিত নয়";
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Show loading while session is loading or users are being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "ব্যবহারকারী লোড হচ্ছে..."}
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
            <FaUsers className="text-sky-600" />
            সমস্ত ব্যবহারকারী
          </h1>
          <p className="text-slate-600 mt-1">
            সমস্ত নিবন্ধিত ব্যবহারকারীর তথ্য দেখুন এবং পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
          <p className="text-2xl font-bold text-emerald-700">{stats.volunteer}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">ব্যবহারকারী</p>
          <p className="text-2xl font-bold text-slate-700">{stats.user}</p>
        </div>
        <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">ফিল্টার করা</p>
          <p className="text-2xl font-bold text-sky-700">{filteredUsers.length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, ইমেইল, মোবাইল বা রক্তের গ্রুপ দিয়ে খুঁজুন..."
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
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">সব রক্তের গ্রুপ</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
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
                  যোগাযোগ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  রোল
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  রক্তের গ্রুপ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  অবস্থান
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  কাজ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FaUsers className="text-4xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">কোন ব্যবহারকারী পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const RoleIcon = roleIcons[user.role] || FaUsers;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
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
                              <p className="text-xs text-slate-500">{user.mobile}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <FaEnvelope className="text-xs" />
                              <span className="truncate max-w-[200px]">{user.email}</span>
                            </div>
                          )}
                          {user.mobile && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <FaPhone className="text-xs" />
                              <span>{user.mobile}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            roleColors[user.role || "user"]
                          }`}
                        >
                          <RoleIcon className="mr-1" />
                          {roleLabels[user.role || "user"]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.bloodGroup ? (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                              bloodGroupColors[user.bloodGroup] || bloodGroupColors["Unknown"]
                            }`}
                          >
                            <FaTint className="mr-1" />
                            {user.bloodGroup}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {user.division && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <FaMapMarkerAlt className="text-xs" />
                              <span>{user.division}</span>
                            </div>
                          )}
                          {user.district && (
                            <p className="text-xs text-slate-500 ml-5">{user.district}</p>
                          )}
                          {user.upazila && (
                            <p className="text-xs text-slate-500 ml-5">{user.upazila}</p>
                          )}
                          {!user.division && !user.district && !user.upazila && (
                            <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition"
                          title="বিস্তারিত দেখুন"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">ব্যবহারকারীর বিস্তারিত তথ্য</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                {selectedUser.image ? (
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-sky-700 font-semibold text-xl">
                      {getInitials(selectedUser.name)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedUser.name || "নাম নেই"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedUser.bloodGroup && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                          bloodGroupColors[selectedUser.bloodGroup] || bloodGroupColors["Unknown"]
                        }`}
                      >
                        <FaTint className="mr-1" />
                        {selectedUser.bloodGroup}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                        roleColors[selectedUser.role || "user"]
                      }`}
                    >
                      {(() => {
                        const Icon = roleIcons[selectedUser.role] || FaUsers;
                        return <Icon className="mr-1" />;
                      })()}
                      {roleLabels[selectedUser.role || "user"]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">ইমেইল</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaEnvelope className="text-sky-600" />
                    {selectedUser.email || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">মোবাইল</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaPhone className="text-sky-600" />
                    {selectedUser.mobile || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">রোল</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      roleColors[selectedUser.role || "user"]
                    }`}
                  >
                    {(() => {
                      const Icon = roleIcons[selectedUser.role] || FaUsers;
                      return <Icon className="mr-1" />;
                    })()}
                    {roleLabels[selectedUser.role || "user"]}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">রক্তের গ্রুপ</p>
                  {selectedUser.bloodGroup ? (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                        bloodGroupColors[selectedUser.bloodGroup] || bloodGroupColors["Unknown"]
                      }`}
                    >
                      <FaTint className="mr-1" />
                      {selectedUser.bloodGroup}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">বিভাগ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-sky-600" />
                    {selectedUser.division || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">জেলা</p>
                  <p className="font-medium text-slate-900">
                    {selectedUser.district || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">উপজেলা</p>
                  <p className="font-medium text-slate-900">
                    {selectedUser.upazila || "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">অবস্থা</p>
                  {selectedUser.isActive !== false ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <FaCheckCircle className="mr-1" />
                      সক্রিয়
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                      <FaTimesCircle className="mr-1" />
                      নিষ্ক্রিয়
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">নিবন্ধনের তারিখ</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-sky-600" />
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">শেষ লগইন</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-sky-600" />
                    {formatDate(selectedUser.lastLogin)}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>দ্রষ্টব্য:</strong> এই পৃষ্ঠায় সমস্ত নিবন্ধিত ব্যবহারকারীর তথ্য দেখানো হয়েছে। আপনি রোল, 
          রক্তের গ্রুপ এবং অন্যান্য ফিল্টার ব্যবহার করে ব্যবহারকারী খুঁজে পেতে পারেন।
        </p>
      </div>
    </div>
  );
}

