"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaSpinner,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTint,
  FaMapMarkerAlt,
  FaImage,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const divisionDataPath = "/assets/AllDivision.json";
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

export default function DonorEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [divisionsData, setDivisionsData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    image: "",
    bloodGroup: "",
    division: "",
    district: "",
    upazila: "",
    isAvailable: true,
    lastDonation: "",
  });

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Load division data and profile
    if (status === "authenticated") {
      loadDivisionData();
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  useEffect(() => {
    if (!formData.division) {
      setDistrictsData([]);
      return;
    }
    const selectedDivision = divisionsData.find(
      (division) => division.Division === formData.division
    );
    setDistrictsData(selectedDivision?.Districts ?? []);
  }, [divisionsData, formData.division]);

  useEffect(() => {
    if (!formData.district) {
      setUpazilasData([]);
      return;
    }
    const selectedDistrict = districtsData.find(
      (district) => district.District === formData.district
    );
    setUpazilasData(selectedDistrict?.Upazilas ?? []);
  }, [districtsData, formData.district]);

  const loadDivisionData = async () => {
    try {
      const response = await fetch(divisionDataPath);
      if (response.ok) {
        const data = await response.json();
        setDivisionsData(data?.Bangladesh ?? []);
      }
    } catch (error) {
      console.error("Error loading division data:", error);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/donor/profile");
      const data = await res.json();

      if (res.ok && data.profile) {
        const profile = data.profile;
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          mobile: profile.mobile || "",
          image: profile.image || "",
          bloodGroup: profile.bloodGroup || "",
          division: profile.division || "",
          district: profile.district || "",
          upazila: profile.upazila || "",
          isAvailable: profile.isAvailable !== false,
          lastDonation: profile.lastDonation ? new Date(profile.lastDonation).toISOString().split('T')[0] : "",
        });
        setImagePreview(profile.image || "");
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "প্রোফাইল লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "প্রোফাইল লোড করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDivisionChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      division: value,
      district: "",
      upazila: "",
    }));
  };

  const handleDistrictChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      district: value,
      upazila: "",
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "ত্রুটি",
        text: "শুধুমাত্র ছবি ফাইল আপলোড করা যাবে।",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "ত্রুটি",
        text: "ছবির সাইজ ৫MB এর বেশি হতে পারবে না।",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload to ImgBB
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Image upload failed");
      }

      // Set the uploaded image URL
      setFormData((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire({
        title: "ত্রুটি",
        text: "ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      setImagePreview(formData.image || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "নাম অবশ্যই প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (formData.mobile && formData.mobile.length < 11) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "মোবাইল নম্বর সঠিক নয়",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/donor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.mobile.trim() || null,
          image: formData.image || null,
          bloodGroup: formData.bloodGroup || null,
          division: formData.division || null,
          district: formData.district || null,
          upazila: formData.upazila || null,
          isAvailable: formData.isAvailable,
          lastDonation: formData.lastDonation || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          // Redirect to profile page after successful save
          router.push("/dashboard/donor/profile");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  const divisionList = useMemo(
    () => divisionsData.map((division) => division.Division),
    [divisionsData]
  );

  const districtList = useMemo(
    () => districtsData.map((district) => district.District),
    [districtsData]
  );

  const upazilaList = useMemo(
    () => upazilasData,
    [upazilasData]
  );

  // Calculate donation eligibility (4 months = 120 days)
  const getDonationEligibility = (lastDonation) => {
    if (!lastDonation) {
      return {
        canDonate: true,
        daysRemaining: 0,
        message: "রক্তদানের জন্য প্রস্তুত",
      };
    }

    const lastDonationDate = new Date(lastDonation);
    const today = new Date();
    const daysSinceDonation = Math.floor(
      (today - lastDonationDate) / (1000 * 60 * 60 * 24)
    );
    const requiredDays = 120; // 4 months
    const daysRemaining = requiredDays - daysSinceDonation;

    if (daysRemaining > 0) {
      return {
        canDonate: false,
        daysRemaining: daysRemaining,
        message: `এখন রক্ত দিতে পারবেন না। ${daysRemaining} দিন পর দিতে পারবেন।`,
      };
    } else {
      return {
        canDonate: true,
        daysRemaining: 0,
        message: "রক্তদানের জন্য প্রস্তুত",
      };
    }
  };

  if (status === "loading" || loading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaEdit className="text-sky-600" />
            প্রোফাইল সম্পাদনা করুন
          </h1>
          <p className="text-slate-600 mt-1">
            আপনার প্রোফাইল তথ্য সম্পাদনা করুন
          </p>
        </div>
        <a
          href="/dashboard/donor/profile"
          className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
        >
          প্রোফাইল দেখুন
        </a>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              ব্যক্তিগত তথ্য
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaUser className="inline mr-2 text-sky-600" />
                  নাম <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="আপনার নাম"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-sky-600" />
                  ইমেইল
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">ইমেইল পরিবর্তন করা যায় না</p>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaPhone className="inline mr-2 text-sky-600" />
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaTint className="inline mr-2 text-sky-600" />
                  রক্তের গ্রুপ
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Last Donation Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-sky-600" />
                  শেষ রক্তদানের তারিখ
                </label>
                <input
                  type="date"
                  name="lastDonation"
                  value={formData.lastDonation}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-xs text-slate-500 mt-1">আপনি সর্বশেষ কবে রক্ত দিয়েছেন</p>
                {formData.lastDonation && (() => {
                  const eligibility = getDonationEligibility(formData.lastDonation);
                  return (
                    <div className={`mt-2 p-3 rounded-lg border ${
                      eligibility.canDonate 
                        ? "bg-emerald-50 border-emerald-200" 
                        : "bg-amber-50 border-amber-200"
                    }`}>
                      <p className={`text-sm font-medium ${
                        eligibility.canDonate ? "text-emerald-700" : "text-amber-700"
                      }`}>
                        {eligibility.message}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Profile Image Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              প্রোফাইল ছবি
            </h2>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                    <FaUser className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaImage className="inline mr-2 text-sky-600" />
                  ছবি আপলোড করুন
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  সর্বোচ্চ ৫MB, JPG, PNG বা GIF
                </p>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              অবস্থান
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Division */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-sky-600" />
                  বিভাগ
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleDivisionChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  {divisionList.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  জেলা
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  disabled={!formData.division}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">নির্বাচন করুন</option>
                  {districtList.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  উপজেলা
                </label>
                <select
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  disabled={!formData.district}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">নির্বাচন করুন</option>
                  {upazilaList.map((upz) => (
                    <option key={upz} value={upz}>
                      {upz}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              রক্তদানের অবস্থা
            </h2>
            {(() => {
              const eligibility = getDonationEligibility(formData.lastDonation);
              return (
                <div className="space-y-4">
                  {/* Eligibility Alert */}
                  {!eligibility.canDonate && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                      <div className="flex items-start">
                        <FaTimesCircle className="text-amber-600 text-xl mr-3 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-amber-800 mb-1">
                            এখন রক্তদান করা যাবে না
                          </h4>
                          <p className="text-amber-700 text-sm">
                            {eligibility.message}
                          </p>
                          <p className="text-xs text-amber-600 mt-2">
                            রক্তদানের জন্য শেষ রক্তদানের পর কমপক্ষে ৪ মাস (১২০ দিন) অপেক্ষা করতে হবে।
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Manual Availability Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">রক্তদানের জন্য প্রস্তুত</p>
                      <p className="text-sm text-slate-600">
                        {eligibility.canDonate 
                          ? "আপনি বর্তমানে রক্তদানের জন্য প্রস্তুত" 
                          : "৪ মাস পূর্ণ হওয়ার পর স্বয়ংক্রিয়ভাবে সক্রিয় হবে"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable && eligibility.canDonate}
                        onChange={handleChange}
                        disabled={!eligibility.canDonate}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        !eligibility.canDonate 
                          ? "bg-slate-200 cursor-not-allowed" 
                          : "bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 peer-checked:bg-emerald-600"
                      }`}></div>
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        {formData.isAvailable && eligibility.canDonate ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <FaCheckCircle /> সক্রিয়
                          </span>
                        ) : (
                          <span className="text-amber-700 flex items-center gap-1">
                            <FaTimesCircle /> অপেক্ষা করুন
                          </span>
                        )}
                      </span>
                    </label>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.push("/dashboard/donor/profile")}
              className="px-6 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <FaSave />
                  সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

