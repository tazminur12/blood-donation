"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import {
  FaCog,
  FaSpinner,
  FaSave,
  FaLock,
  FaEnvelope,
  FaBell,
  FaShieldAlt,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bloodRequestAlerts: true,
    campaignAlerts: true,
    donationReminders: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public", // public, contacts, private
    showMobileNumber: true,
    showEmail: false,
    allowBloodRequests: true,
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

    // Load settings if authenticated
    if (status === "authenticated") {
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/donor/settings");
      const data = await res.json();

      if (res.ok && data.settings) {
        if (data.settings.notifications) {
          setNotificationSettings(data.settings.notifications);
        }
        if (data.settings.privacy) {
          setPrivacySettings(data.settings.privacy);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwordData.currentPassword) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "বর্তমান পাসওয়ার্ড প্রয়োজন",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "সতর্কতা",
        text: "নতুন পাসওয়ার্ড মিলছে না",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/donor/settings/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/donor/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifications: notificationSettings,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "বিজ্ঞপ্তি সেটিংস সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "সেটিংস আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সেটিংস আপডেট করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrivacySave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/donor/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privacy: privacySettings,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "গোপনীয়তা সেটিংস সফলভাবে আপডেট করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "সেটিংস আপডেট করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সেটিংস আপডেট করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "সতর্কতা!",
      html: `
        <p class="text-left mb-4">আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্ট মুছে ফেলতে চান?</p>
        <p class="text-left text-sm text-slate-600 mb-2">এই কাজটি:</p>
        <ul class="text-left text-sm text-slate-600 list-disc list-inside mb-4">
          <li>অপরিবর্তনীয়</li>
          <li>আপনার সব তথ্য স্থায়ীভাবে মুছে ফেলবে</li>
          <li>আপনার রক্তদানের ইতিহাস মুছে ফেলবে</li>
        </ul>
        <p class="text-left text-sm font-semibold text-rose-600">অ্যাকাউন্ট মুছে ফেলার জন্য আপনার ইমেইল লিখুন: <strong>${session?.user?.email}</strong></p>
      `,
      input: "text",
      inputPlaceholder: "ইমেইল লিখুন",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      inputValidator: (value) => {
        if (value !== session?.user?.email) {
          return "ইমেইল মিলছে না";
        }
      },
    });

    if (result.isConfirmed) {
      try {
        setSaving(true);
        const res = await fetch("/api/donor/settings/account", {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "অ্যাকাউন্ট মুছে ফেলা হয়েছে",
            text: "আপনার অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#10b981",
          }).then(() => {
            signOut({ callbackUrl: "/" });
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ত্রুটি",
            text: data.error || "অ্যাকাউন্ট মুছে ফেলতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: "অ্যাকাউন্ট মুছে ফেলতে ব্যর্থ হয়েছে: " + error.message,
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const tabs = [
    { id: "password", label: "পাসওয়ার্ড", icon: FaLock },
    { id: "notifications", label: "বিজ্ঞপ্তি", icon: FaBell },
    { id: "privacy", label: "গোপনীয়তা", icon: FaShieldAlt },
    { id: "account", label: "অ্যাকাউন্ট", icon: FaUserShield },
  ];

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

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaCog className="text-sky-600" />
            অ্যাকাউন্ট সেটিংস
          </h1>
          <p className="text-slate-600 mt-1">
            আপনার অ্যাকাউন্ট সেটিংস এবং পছন্দসমূহ পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Password Change Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  পাসওয়ার্ড পরিবর্তন করুন
                </h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <FaLock className="inline mr-2 text-sky-600" />
                      বর্তমান পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
                        placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      নতুন পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={8}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
                        placeholder="নতুন পাসওয়ার্ড লিখুন (কমপক্ষে ৮ অক্ষর)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      কমপক্ষে ৮ অক্ষরের হতে হবে
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      পাসওয়ার্ড নিশ্চিত করুন
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
                        placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

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
                        পাসওয়ার্ড পরিবর্তন করুন
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  বিজ্ঞপ্তি সেটিংস
                </h2>
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">ইমেইল বিজ্ঞপ্তি</p>
                      <p className="text-sm text-slate-600">
                        ইমেইলের মাধ্যমে বিজ্ঞপ্তি গ্রহণ করুন
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationChange("emailNotifications")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">এসএমএস বিজ্ঞপ্তি</p>
                      <p className="text-sm text-slate-600">
                        এসএমএসের মাধ্যমে বিজ্ঞপ্তি গ্রহণ করুন
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={() => handleNotificationChange("smsNotifications")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">রক্তের অনুরোধ বিজ্ঞপ্তি</p>
                      <p className="text-sm text-slate-600">
                        রক্তের অনুরোধ সম্পর্কে বিজ্ঞপ্তি পান
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bloodRequestAlerts}
                        onChange={() => handleNotificationChange("bloodRequestAlerts")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">ক্যাম্পেইন বিজ্ঞপ্তি</p>
                      <p className="text-sm text-slate-600">
                        ক্যাম্পেইন সম্পর্কে বিজ্ঞপ্তি পান
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.campaignAlerts}
                        onChange={() => handleNotificationChange("campaignAlerts")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">রক্তদানের অনুস্মারক</p>
                      <p className="text-sm text-slate-600">
                        পরবর্তী রক্তদানের তারিখের অনুস্মারক পান
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.donationReminders}
                        onChange={() => handleNotificationChange("donationReminders")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={handleNotificationSave}
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
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  গোপনীয়তা সেটিংস
                </h2>
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      প্রোফাইল দৃশ্যমানতা
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="public">সবার জন্য উন্মুক্ত</option>
                      <option value="contacts">শুধু পরিচিতদের জন্য</option>
                      <option value="private">ব্যক্তিগত</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      কে আপনার প্রোফাইল দেখতে পারবে
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">মোবাইল নম্বর দেখান</p>
                      <p className="text-sm text-slate-600">
                        আপনার প্রোফাইলে মোবাইল নম্বর দেখাবে
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showMobileNumber}
                        onChange={(e) => handlePrivacyChange("showMobileNumber", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">ইমেইল দেখান</p>
                      <p className="text-sm text-slate-600">
                        আপনার প্রোফাইলে ইমেইল দেখাবে
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showEmail}
                        onChange={(e) => handlePrivacyChange("showEmail", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">রক্তের অনুরোধ গ্রহণ করুন</p>
                      <p className="text-sm text-slate-600">
                        অন্যরা আপনার কাছে রক্তের অনুরোধ করতে পারবে
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowBloodRequests}
                        onChange={(e) => handlePrivacyChange("allowBloodRequests", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={handlePrivacySave}
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
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  অ্যাকাউন্ট ব্যবস্থাপনা
                </h2>
                <div className="space-y-4 max-w-2xl">
                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-2">অ্যাকাউন্ট তথ্য</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-slate-700">ইমেইল:</span>{" "}
                        <span className="text-slate-600">{session?.user?.email}</span>
                      </p>
                      <p>
                        <span className="font-medium text-slate-700">নাম:</span>{" "}
                        <span className="text-slate-600">{session?.user?.name || "নির্ধারিত নয়"}</span>
                      </p>
                      <p>
                        <span className="font-medium text-slate-700">ভূমিকা:</span>{" "}
                        <span className="text-slate-600 capitalize">{session?.user?.role || "donor"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-rose-50 rounded-lg border border-rose-200">
                    <div className="flex items-start gap-4">
                      <FaTrash className="text-rose-600 text-xl mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-rose-900 mb-2">
                          অ্যাকাউন্ট মুছে ফেলুন
                        </h3>
                        <p className="text-sm text-rose-700 mb-4">
                          আপনার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি অপরিবর্তনীয় এবং
                          আপনার সব তথ্য, রক্তদানের ইতিহাস এবং অন্যান্য ডেটা মুছে ফেলা হবে।
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={saving}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                          {saving ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              মুছে ফেলছি...
                            </>
                          ) : (
                            <>
                              <FaTrash />
                              অ্যাকাউন্ট মুছে ফেলুন
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

