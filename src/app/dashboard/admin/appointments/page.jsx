"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaHospital,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTint,
} from "react-icons/fa";
import Swal from "sweetalert2";

const purposeLabels = {
  regular: "নিয়মিত রক্তদান",
  emergency: "জরুরী রক্তদান",
  specific: "নির্দিষ্ট অনুরোধ",
  campaign: "ক্যাম্পেইন",
  other: "অন্যান্য",
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

export default function AdminAppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    upcoming: 0,
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
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, filterStatus]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setAppointments(data.appointments || []);
        setStats(data.stats || {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          upcoming: 0,
        });
      } else {
        console.error("Error loading appointments:", data);
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
            text: data.error || "অ্যাপয়েন্টমেন্ট লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "অ্যাপয়েন্টমেন্ট লোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    const result = await Swal.fire({
      icon: "question",
      title: "স্ট্যাটাস আপডেট",
      text: `আপনি কি এই অ্যাপয়েন্টমেন্টের স্ট্যাটাস "${newStatus}" এ পরিবর্তন করতে চান?`,
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, আপডেট করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "অ্যাপয়েন্টমেন্ট স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
        loadAppointments();
        setSelectedAppointment(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdatingStatus(false);
    }
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

  const formatTime = (time) => {
    if (!time) return "নির্ধারিত নয়";
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
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

  const isUpcoming = (appointmentDate, appointmentTime) => {
    if (!appointmentDate || !appointmentTime) return false;
    try {
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      return appointmentDateTime > new Date();
    } catch {
      return false;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadAppointments();
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
          <FaCalendarAlt className="text-purple-600" />
          অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা
        </h1>
        <p className="text-slate-600 mt-1">
          সমস্ত রক্তদান অ্যাপয়েন্টমেন্ট দেখুন এবং পরিচালনা করুন
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">মোট</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
              <FaCalendarAlt className="text-sky-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">অপেক্ষমান</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <FaClock className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">নিশ্চিত</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FaCheckCircle className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">সম্পন্ন</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaCheckCircle className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">বাতিল</p>
              <p className="text-2xl font-bold text-rose-600">{stats.cancelled}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
              <FaTimesCircle className="text-rose-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">আসন্ন</p>
              <p className="text-2xl font-bold text-purple-600">{stats.upcoming}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">ফিল্টার</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="রক্তদাতার নাম, ইমেইল, হাসপাতাল খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমান</option>
              <option value="confirmed">নিশ্চিত</option>
              <option value="completed">সম্পন্ন</option>
              <option value="cancelled">বাতিল</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <FaCalendarAlt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি</p>
            <p className="text-slate-500 text-sm mt-2">
              ফিল্টার পরিবর্তন করুন
            </p>
          </div>
        ) : (
          appointments.map((appointment) => {
            const upcoming = isUpcoming(appointment.appointmentDate, appointment.appointmentTime);
            
            return (
              <div
                key={appointment.id}
                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden ${
                  upcoming && appointment.status === "confirmed"
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-200"
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Side - Appointment Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-xl font-bold text-slate-900">
                              {appointment.hospital || "হাসপাতালের নাম নেই"}
                            </h3>
                            {upcoming && appointment.status === "confirmed" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                আসন্ন
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {appointment.donorName && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <FaUser className="text-purple-600" />
                                <span className="font-semibold">{appointment.donorName}</span>
                                {appointment.donorBloodGroup && (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                      bloodGroupColors[appointment.donorBloodGroup] || bloodGroupColors["Unknown"]
                                    }`}
                                  >
                                    <FaTint className="mr-1" />
                                    {appointment.donorBloodGroup}
                                  </span>
                                )}
                              </div>
                            )}
                            {appointment.donorEmail && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <FaEnvelope className="text-purple-600" />
                                <span>{appointment.donorEmail}</span>
                              </div>
                            )}
                            {appointment.donorMobile && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <FaPhone className="text-purple-600" />
                                <a
                                  href={`tel:${appointment.donorMobile}`}
                                  className="hover:text-purple-600 hover:underline"
                                >
                                  {appointment.donorMobile}
                                </a>
                              </div>
                            )}
                            {appointment.center && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <FaMapMarkerAlt className="text-purple-600" />
                                <span>{appointment.center}</span>
                              </div>
                            )}
                            {appointment.appointmentDate && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <FaCalendarAlt className="text-purple-600" />
                                <span>{formatDate(appointment.appointmentDate)}</span>
                              </div>
                            )}
                            {appointment.appointmentTime && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <FaClock className="text-purple-600" />
                                <span>{formatTime(appointment.appointmentTime)}</span>
                              </div>
                            )}
                            {appointment.purpose && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <span>{purposeLabels[appointment.purpose] || appointment.purpose}</span>
                              </div>
                            )}
                          </div>

                          {appointment.notes && (
                            <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                              {appointment.notes}
                            </p>
                          )}
                        </div>

                        {/* Right Side - Status and Actions */}
                        <div className="flex flex-col items-end gap-2">
                          {appointment.status === "pending" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                              <FaClock className="mr-1" />
                              অপেক্ষমান
                            </span>
                          ) : appointment.status === "confirmed" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                              <FaCheckCircle className="mr-1" />
                              নিশ্চিত
                            </span>
                          ) : appointment.status === "completed" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <FaCheckCircle className="mr-1" />
                              সম্পন্ন
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <FaTimesCircle className="mr-1" />
                              বাতিল
                            </span>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
                            >
                              <FaEye />
                              <span>বিস্তারিত</span>
                            </button>
                            {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                              <button
                                onClick={() => setSelectedAppointment(appointment)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition"
                              >
                                <FaEdit />
                                <span>আপডেট</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">অ্যাপয়েন্টমেন্টের বিস্তারিত</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Donor Info */}
                <div className="md:col-span-2 bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">রক্তদাতার তথ্য</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedAppointment.donorName && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">নাম</p>
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          <FaUser className="text-purple-600" />
                          {selectedAppointment.donorName}
                        </p>
                      </div>
                    )}
                    {selectedAppointment.donorEmail && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">ইমেইল</p>
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          <FaEnvelope className="text-purple-600" />
                          {selectedAppointment.donorEmail}
                        </p>
                      </div>
                    )}
                    {selectedAppointment.donorMobile && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">মোবাইল</p>
                        <a
                          href={`tel:${selectedAppointment.donorMobile}`}
                          className="font-semibold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-2"
                        >
                          <FaPhone className="text-purple-600" />
                          {selectedAppointment.donorMobile}
                        </a>
                      </div>
                    )}
                    {selectedAppointment.donorBloodGroup && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">রক্তের গ্রুপ</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                            bloodGroupColors[selectedAppointment.donorBloodGroup] || bloodGroupColors["Unknown"]
                          }`}
                        >
                          <FaTint className="mr-1" />
                          {selectedAppointment.donorBloodGroup}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Appointment Info */}
                <div>
                  <p className="text-sm text-slate-600 mb-1">হাসপাতাল/কেন্দ্র</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <FaHospital className="text-purple-600" />
                    {selectedAppointment.hospital || "নির্ধারিত নয়"}
                  </p>
                </div>
                {selectedAppointment.center && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">কেন্দ্র/শাখা</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-purple-600" />
                      {selectedAppointment.center}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 mb-1">তারিখ</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-600" />
                    {selectedAppointment.appointmentDate ? formatDate(selectedAppointment.appointmentDate) : "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">সময়</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <FaClock className="text-purple-600" />
                    {selectedAppointment.appointmentTime ? formatTime(selectedAppointment.appointmentTime) : "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">উদ্দেশ্য</p>
                  <p className="font-semibold text-slate-900">
                    {selectedAppointment.purpose ? (purposeLabels[selectedAppointment.purpose] || selectedAppointment.purpose) : "নির্ধারিত নয়"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">স্ট্যাটাস</p>
                  {selectedAppointment.status === "pending" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                      <FaClock className="mr-1" />
                      অপেক্ষমান
                    </span>
                  ) : selectedAppointment.status === "confirmed" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      <FaCheckCircle className="mr-1" />
                      নিশ্চিত
                    </span>
                  ) : selectedAppointment.status === "completed" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <FaCheckCircle className="mr-1" />
                      সম্পন্ন
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <FaTimesCircle className="mr-1" />
                      বাতিল
                    </span>
                  )}
                </div>
                {selectedAppointment.createdAt && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">তৈরি হয়েছে</p>
                    <p className="font-semibold text-slate-900">{formatDateTime(selectedAppointment.createdAt)}</p>
                  </div>
                )}
                {selectedAppointment.updatedAt && selectedAppointment.updatedAt !== selectedAppointment.createdAt && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">আপডেট হয়েছে</p>
                    <p className="font-semibold text-slate-900">{formatDateTime(selectedAppointment.updatedAt)}</p>
                  </div>
                )}
                {selectedAppointment.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-600 mb-1">নোট</p>
                    <p className="text-slate-900 whitespace-pre-wrap">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Status Update Section */}
              {selectedAppointment.status !== "completed" && selectedAppointment.status !== "cancelled" && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="font-semibold text-slate-900 mb-3">স্ট্যাটাস আপডেট করুন</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppointment.status !== "confirmed" && (
                      <button
                        onClick={() => handleStatusUpdate(selectedAppointment.id, "confirmed")}
                        disabled={updatingStatus}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {updatingStatus ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheckCircle />
                        )}
                        <span>নিশ্চিত করুন</span>
                      </button>
                    )}
                    {selectedAppointment.status !== "completed" && (
                      <button
                        onClick={() => handleStatusUpdate(selectedAppointment.id, "completed")}
                        disabled={updatingStatus}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {updatingStatus ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheckCircle />
                        )}
                        <span>সম্পন্ন করুন</span>
                      </button>
                    )}
                    {selectedAppointment.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatusUpdate(selectedAppointment.id, "cancelled")}
                        disabled={updatingStatus}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {updatingStatus ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTimesCircle />
                        )}
                        <span>বাতিল করুন</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

