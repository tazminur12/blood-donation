"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaCalendarAlt,
  FaClock,
  FaHospital,
  FaMapMarkerAlt,
  FaUser,
  FaCheckCircle,
  FaPlus,
  FaInfoCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function BookAppointmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [locationData, setLocationData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    hospital: "",
    center: "",
    appointmentDate: "",
    appointmentTime: "",
    purpose: "regular",
    notes: "",
  });

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadProfile();
      loadLocationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/donor/profile");
      const data = await res.json();
      
      if (res.ok) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadLocationData = async () => {
    try {
      const res = await fetch("/assets/AllDivision.json");
      const data = await res.json();
      setLocationData(data);
    } catch (error) {
      console.error("Error loading location data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.hospital || !formData.appointmentDate || !formData.appointmentTime) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "হাসপাতাল, তারিখ এবং সময় প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Validate date is not in the past
    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    if (appointmentDateTime < new Date()) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "আপনি অতীতের তারিখ নির্বাচন করতে পারবেন না",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/donor/appointments", {
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
          text: "অ্যাপয়েন্টমেন্ট সফলভাবে বুক করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          // Reset form
          setFormData({
            hospital: "",
            center: "",
            appointmentDate: "",
            appointmentTime: "",
            purpose: "regular",
            notes: "",
          });
          // Optionally redirect to appointments page
          router.push("/dashboard/donor/appointments");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "অ্যাপয়েন্টমেন্ট বুক করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "অ্যাপয়েন্টমেন্ট বুক করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <FaCalendarAlt className="text-rose-600" />
          অ্যাপয়েন্টমেন্ট বুক করুন
        </h1>
        <p className="text-slate-600 mt-1">
          রক্তদানের জন্য অ্যাপয়েন্টমেন্ট বুক করুন
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <FaInfoCircle className="text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">মহানুভব রক্তদাতা,</p>
          <p>
            আপনার অ্যাপয়েন্টমেন্ট বুক করার পর, আমাদের টিম আপনার সাথে যোগাযোগ করবে 
            এবং অ্যাপয়েন্টমেন্ট নিশ্চিত করবে। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hospital */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                হাসপাতাল/কেন্দ্র <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <FaHospital className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="হাসপাতাল বা কেন্দ্রের নাম"
                />
              </div>
            </div>

            {/* Center (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                কেন্দ্র/শাখা
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.center}
                  onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="কেন্দ্র বা শাখার নাম (ঐচ্ছিক)"
                />
              </div>
            </div>

            {/* Appointment Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                তারিখ <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                  min={getMinDate()}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Appointment Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                সময় <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                উদ্দেশ্য
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="regular">নিয়মিত রক্তদান</option>
                <option value="emergency">জরুরী রক্তদান</option>
                <option value="specific">নির্দিষ্ট অনুরোধ</option>
                <option value="campaign">ক্যাম্পেইন</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            {/* Donor Info Display */}
            {profile && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">আপনার তথ্য:</p>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">
                    <FaUser className="inline mr-2 text-slate-400" />
                    {profile.name || "নাম নেই"}
                  </p>
                  {profile.bloodGroup && (
                    <p className="text-slate-700">
                      রক্তের গ্রুপ: <span className="font-semibold">{profile.bloodGroup}</span>
                    </p>
                  )}
                  {profile.mobile && (
                    <p className="text-slate-700">
                      মোবাইল: <span className="font-semibold">{profile.mobile}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              অতিরিক্ত তথ্য/নোট
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="কোন বিশেষ নির্দেশনা বা তথ্য থাকলে এখানে লিখুন..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.push("/dashboard/donor/appointments")}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  বুক করা হচ্ছে...
                </>
              ) : (
                <>
                  <FaPlus />
                  অ্যাপয়েন্টমেন্ট বুক করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">রক্তদানের আগে মনে রাখবেন</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-600 mt-0.5" />
            <span>রক্তদানের আগে ভালোভাবে খাবার খান এবং পর্যাপ্ত পানি পান করুন</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-600 mt-0.5" />
            <span>রক্তদানের আগে ৮ ঘণ্টা ভালোভাবে ঘুমান</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-600 mt-0.5" />
            <span>রক্তদানের আগে অ্যালকোহল বা ধূমপান করবেন না</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-600 mt-0.5" />
            <span>সর্বশেষ রক্তদানের পর কমপক্ষে ৪ মাস (১২০ দিন) অপেক্ষা করুন</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-600 mt-0.5" />
            <span>যদি আপনি অসুস্থ থাকেন বা কোন ওষুধ গ্রহণ করছেন, তাহলে আগে জানান</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

