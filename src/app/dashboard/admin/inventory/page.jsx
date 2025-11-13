"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaTint,
  FaPlus,
  FaMinus,
  FaEdit,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaChartBar,
  FaBox,
} from "react-icons/fa";
import Swal from "sweetalert2";

const bloodGroupColors = {
  "A+": "bg-red-100 text-red-700 border-red-200",
  "A-": "bg-red-50 text-red-600 border-red-100",
  "B+": "bg-blue-100 text-blue-700 border-blue-200",
  "B-": "bg-blue-50 text-blue-600 border-blue-100",
  "AB+": "bg-purple-100 text-purple-700 border-purple-200",
  "AB-": "bg-purple-50 text-purple-600 border-purple-100",
  "O+": "bg-green-100 text-green-700 border-green-200",
  "O-": "bg-green-50 text-green-600 border-green-100",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inventory, setInventory] = useState({});
  const [pendingByBloodGroup, setPendingByBloodGroup] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalPending: 0,
    lowStock: 0,
  });
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    units: "",
    reason: "",
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

    if (session?.user?.role === "admin") {
      loadInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      
      if (res.ok) {
        setInventory(data.inventory || {});
        setPendingByBloodGroup(data.pendingByBloodGroup || {});
        setHistory(data.history || []);
        setStats(data.stats || {
          totalUnits: 0,
          totalPending: 0,
          lowStock: 0,
        });
      } else {
        console.error("Error loading inventory:", data);
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
            text: data.error || "ইনভেন্টরি লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ইনভেন্টরি লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryUpdate = async (type) => {
    if (!selectedBloodGroup) return;

    if (!formData.units || parseFloat(formData.units) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "ইউনিট সংখ্যা ০ এর বেশি হতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bloodGroup: selectedBloodGroup,
          units: parseInt(formData.units),
          type: type,
          reason: formData.reason || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: data.message || "ইনভেন্টরি সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        setShowAddModal(false);
        setShowRemoveModal(false);
        setShowAdjustModal(false);
        setSelectedBloodGroup(null);
        setFormData({ units: "", reason: "" });
        loadInventory();
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "ইনভেন্টরি আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "ইনভেন্টরি আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStockStatus = (units) => {
    if (units === 0) return { status: "out", color: "bg-rose-100 text-rose-700 border-rose-200", label: "স্টক নেই" };
    if (units < 10) return { status: "low", color: "bg-amber-100 text-amber-700 border-amber-200", label: "কম স্টক" };
    if (units < 30) return { status: "medium", color: "bg-blue-100 text-blue-700 border-blue-200", label: "মধ্যম স্টক" };
    return { status: "good", color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "পর্যাপ্ত স্টক" };
  };

  const formatDateTime = (date) => {
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

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">লোড হচ্ছে...</p>
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <FaBox className="text-purple-600" />
          রক্তের ইনভেন্টরি
        </h1>
        <p className="text-slate-600 mt-1">
          রক্তের স্টক দেখুন এবং পরিচালনা করুন
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">মোট ইউনিট</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUnits}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
              <FaTint className="text-sky-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">অপেক্ষমান অনুরোধ</p>
              <p className="text-2xl font-bold text-amber-600">{stats.totalPending}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <FaClock className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">কম স্টক</p>
              <p className="text-2xl font-bold text-rose-600">{stats.lowStock}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
              <FaExclamationTriangle className="text-rose-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bloodGroups.map((bg) => {
          const units = inventory[bg] || 0;
          const pending = pendingByBloodGroup[bg] || 0;
          const stockStatus = getStockStatus(units);
          
          return (
            <div
              key={bg}
              className={`bg-white rounded-xl border shadow-sm p-6 ${
                stockStatus.status === "out" || stockStatus.status === "low"
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                    bloodGroupColors[bg] || "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <FaTint className="mr-1" />
                  {bg}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">বর্তমান স্টক</p>
                  <p className="text-3xl font-bold text-slate-900">{units} ইউনিট</p>
                </div>
                {pending > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">অপেক্ষমান অনুরোধ</p>
                    <p className="text-lg font-semibold text-amber-600">{pending} ইউনিট</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedBloodGroup(bg);
                    setFormData({ units: "", reason: "" });
                    setShowAddModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
                >
                  <FaPlus />
                  <span>যোগ</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedBloodGroup(bg);
                    setFormData({ units: "", reason: "" });
                    setShowRemoveModal(true);
                  }}
                  disabled={units === 0}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaMinus />
                  <span>বিয়োগ</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedBloodGroup(bg);
                    setFormData({ units: units.toString(), reason: "" });
                    setShowAdjustModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm"
                >
                  <FaEdit />
                  <span>সেট</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FaHistory className="text-purple-600" />
            সাম্প্রতিক ইতিহাস
          </h2>
        </div>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-slate-500 text-center py-4">কোন ইতিহাস নেই</p>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                      bloodGroupColors[entry.bloodGroup] || "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {entry.bloodGroup}
                  </span>
                  <span className="text-sm text-slate-600">
                    {entry.type === "add" && (
                      <span className="text-emerald-600 font-semibold">+{entry.units} ইউনিট যোগ</span>
                    )}
                    {entry.type === "remove" && (
                      <span className="text-rose-600 font-semibold">-{entry.units} ইউনিট বিয়োগ</span>
                    )}
                    {entry.type === "adjust" && (
                      <span className="text-sky-600 font-semibold">{entry.units} ইউনিট সেট</span>
                    )}
                  </span>
                  {entry.reason && (
                    <span className="text-xs text-slate-500">({entry.reason})</span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {formatDateTime(entry.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && selectedBloodGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                রক্ত যোগ করুন - {selectedBloodGroup}
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInventoryUpdate("add");
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ইউনিট সংখ্যা <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ইউনিট সংখ্যা"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  কারণ (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="রক্ত যোগ করার কারণ"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedBloodGroup(null);
                    setFormData({ units: "", reason: "" });
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      যোগ করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      যোগ করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {showRemoveModal && selectedBloodGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                রক্ত বিয়োগ করুন - {selectedBloodGroup}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                বর্তমান স্টক: {inventory[selectedBloodGroup] || 0} ইউনিট
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInventoryUpdate("remove");
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ইউনিট সংখ্যা <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  required
                  min="1"
                  max={inventory[selectedBloodGroup] || 0}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ইউনিট সংখ্যা"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  কারণ (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="রক্ত বিয়োগ করার কারণ"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowRemoveModal(false);
                    setSelectedBloodGroup(null);
                    setFormData({ units: "", reason: "" });
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      বিয়োগ করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FaMinus />
                      বিয়োগ করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {showAdjustModal && selectedBloodGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                স্টক সেট করুন - {selectedBloodGroup}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                বর্তমান স্টক: {inventory[selectedBloodGroup] || 0} ইউনিট
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInventoryUpdate("adjust");
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  নতুন ইউনিট সংখ্যা <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ইউনিট সংখ্যা"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  কারণ (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="স্টক সেট করার কারণ"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedBloodGroup(null);
                    setFormData({ units: "", reason: "" });
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      সেট করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FaEdit />
                      সেট করুন
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

