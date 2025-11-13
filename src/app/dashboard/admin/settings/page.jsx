"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaCog,
  FaSpinner,
  FaSave,
  FaGlobe,
  FaEnvelope,
  FaSms,
  FaBell,
  FaShieldAlt,
  FaToggleOn,
  FaToggleOff,
  FaDatabase,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

export default function SystemSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "Blood Donation",
      siteDescription: "Life Saving Platform",
      maintenanceMode: false,
      registrationEnabled: true,
      allowPublicDonorSearch: true,
    },
    email: {
      enabled: true,
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "",
      fromName: "Blood Donation",
    },
    sms: {
      enabled: false,
      provider: "",
      apiKey: "",
      senderId: "",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      donorRegistrationAlert: true,
      bloodRequestAlert: true,
      campaignAlert: true,
    },
    security: {
      requireEmailVerification: false,
      requirePhoneVerification: false,
      minPasswordLength: 8,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
    },
    features: {
      donorRegistration: true,
      bloodRequest: true,
      campaigns: true,
      bloodDrives: true,
      volunteerManagement: true,
      analytics: true,
    },
  });
  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    totalDrives: 0,
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

    // Only load settings if user is admin
    if (session?.user?.role === "admin") {
      loadSettings();
    }
  }, [session, status, router]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      
      if (res.ok) {
        setSettings(data.settings || settings);
        setDbStats(data.dbStats || dbStats);
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
            text: data.error || data.message || "সেটিংস লোড করতে ব্যর্থ হয়েছে",
            confirmButtonText: "ঠিক আছে",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সেটিংস লোড করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: data.error || "সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে: " + error.message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const toggleSetting = (section, key) => {
    updateSetting(section, key, !settings[section][key]);
  };

  const tabs = [
    { id: "general", label: "সাধারণ", icon: FaGlobe },
    { id: "email", label: "ইমেইল", icon: FaEnvelope },
    { id: "sms", label: "এসএমএস", icon: FaSms },
    { id: "notifications", label: "বিজ্ঞপ্তি", icon: FaBell },
    { id: "security", label: "নিরাপত্তা", icon: FaShieldAlt },
    { id: "features", label: "ফিচার", icon: FaToggleOn },
    { id: "database", label: "ডাটাবেস", icon: FaDatabase },
  ];

  // Show loading while session is loading or settings are being fetched
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">
            {status === "loading" ? "সেশন লোড হচ্ছে..." : "সেটিংস লোড হচ্ছে..."}
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
            <FaCog className="text-sky-600" />
            সিস্টেম সেটিংস
          </h1>
          <p className="text-slate-600 mt-1">
            সিস্টেমের বিভিন্ন সেটিংস কনফিগার করুন
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50 flex items-center gap-2"
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
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  সাইটের নাম
                </label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting("general", "siteName", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  সাইটের বিবরণ
                </label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting("general", "siteDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">রক্ষণাবেক্ষণ মোড</p>
                  <p className="text-sm text-slate-600">সাইটটি রক্ষণাবেক্ষণের জন্য বন্ধ রাখুন</p>
                </div>
                <button
                  onClick={() => toggleSetting("general", "maintenanceMode")}
                  className="text-2xl"
                >
                  {settings.general.maintenanceMode ? (
                    <FaToggleOn className="text-emerald-600" />
                  ) : (
                    <FaToggleOff className="text-slate-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">নিবন্ধন সক্রিয়</p>
                  <p className="text-sm text-slate-600">নতুন ব্যবহারকারী নিবন্ধন করতে পারবে</p>
                </div>
                <button
                  onClick={() => toggleSetting("general", "registrationEnabled")}
                  className="text-2xl"
                >
                  {settings.general.registrationEnabled ? (
                    <FaToggleOn className="text-emerald-600" />
                  ) : (
                    <FaToggleOff className="text-slate-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">পাবলিক রক্তদাতা অনুসন্ধান</p>
                  <p className="text-sm text-slate-600">সবার জন্য রক্তদাতা খোঁজার সুবিধা</p>
                </div>
                <button
                  onClick={() => toggleSetting("general", "allowPublicDonorSearch")}
                  className="text-2xl"
                >
                  {settings.general.allowPublicDonorSearch ? (
                    <FaToggleOn className="text-emerald-600" />
                  ) : (
                    <FaToggleOff className="text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">ইমেইল সক্রিয়</p>
                  <p className="text-sm text-slate-600">ইমেইল বিজ্ঞপ্তি পাঠানো হবে</p>
                </div>
                <button
                  onClick={() => toggleSetting("email", "enabled")}
                  className="text-2xl"
                >
                  {settings.email.enabled ? (
                    <FaToggleOn className="text-emerald-600" />
                  ) : (
                    <FaToggleOff className="text-slate-400" />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting("email", "smtpHost", e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting("email", "smtpPort", parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SMTP User
                  </label>
                  <input
                    type="text"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSetting("email", "smtpUser", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSetting("email", "smtpPassword", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting("email", "fromEmail", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting("email", "fromName", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SMS Settings */}
          {activeTab === "sms" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">এসএমএস সক্রিয়</p>
                  <p className="text-sm text-slate-600">এসএমএস বিজ্ঞপ্তি পাঠানো হবে</p>
                </div>
                <button
                  onClick={() => toggleSetting("sms", "enabled")}
                  className="text-2xl"
                >
                  {settings.sms.enabled ? (
                    <FaToggleOn className="text-emerald-600" />
                  ) : (
                    <FaToggleOff className="text-slate-400" />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    প্রোভাইডার
                  </label>
                  <input
                    type="text"
                    value={settings.sms.provider}
                    onChange={(e) => updateSetting("sms", "provider", e.target.value)}
                    placeholder="Twilio, Nexmo, etc."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={settings.sms.apiKey}
                    onChange={(e) => updateSetting("sms", "apiKey", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sender ID
                  </label>
                  <input
                    type="text"
                    value={settings.sms.senderId}
                    onChange={(e) => updateSetting("sms", "senderId", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              {[
                { key: "emailNotifications", label: "ইমেইল বিজ্ঞপ্তি", desc: "ইমেইলের মাধ্যমে বিজ্ঞপ্তি পাঠান" },
                { key: "smsNotifications", label: "এসএমএস বিজ্ঞপ্তি", desc: "এসএমএসের মাধ্যমে বিজ্ঞপ্তি পাঠান" },
                { key: "pushNotifications", label: "পুশ বিজ্ঞপ্তি", desc: "ব্রাউজার পুশ বিজ্ঞপ্তি পাঠান" },
                { key: "donorRegistrationAlert", label: "রক্তদাতা নিবন্ধন সতর্কতা", desc: "নতুন রক্তদাতা নিবন্ধন হলে সতর্কতা" },
                { key: "bloodRequestAlert", label: "রক্ত অনুরোধ সতর্কতা", desc: "নতুন রক্ত অনুরোধ হলে সতর্কতা" },
                { key: "campaignAlert", label: "ক্যাম্পেইন সতর্কতা", desc: "নতুন ক্যাম্পেইন হলে সতর্কতা" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting("notifications", item.key)}
                    className="text-2xl"
                  >
                    {settings.notifications[item.key] ? (
                      <FaToggleOn className="text-emerald-600" />
                    ) : (
                      <FaToggleOff className="text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">ইমেইল যাচাইকরণ প্রয়োজন</p>
                  <p className="text-sm text-slate-600">নিবন্ধনের সময় ইমেইল যাচাইকরণ প্রয়োজন</p>
                </div>
                <button
                  onClick={() => toggleSetting("security", "requireEmailVerification")}
                  className="text-2xl"
                >
                  {settings.security.requireEmailVerification ? (
                    <FaToggleOn className="text-emerald-600" />
                  ) : (
                    <FaToggleOff className="text-slate-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">ফোন যাচাইকরণ প্রয়োজন</p>
                  <p className="text-sm text-slate-600">নিবন্ধনের সময় ফোন নম্বর যাচাইকরণ প্রয়োজন</p>
                </div>
                <button
                  onClick={() => toggleSetting("security", "requirePhoneVerification")}
                  className="text-2xl"
                >
                  {settings.security.requirePhoneVerification ? (
                    <FaToggleOn className="text-emerald-600" />
                  ) : (
                    <FaToggleOff className="text-slate-400" />
                  )}
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  সর্বনিম্ন পাসওয়ার্ড দৈর্ঘ্য
                </label>
                <input
                  type="number"
                  value={settings.security.minPasswordLength}
                  onChange={(e) => updateSetting("security", "minPasswordLength", parseInt(e.target.value))}
                  min={6}
                  max={32}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  সেশন টাইমআউট (ঘণ্টা)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting("security", "sessionTimeout", parseInt(e.target.value))}
                  min={1}
                  max={168}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  সর্বোচ্চ লগইন প্রচেষ্টা
                </label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting("security", "maxLoginAttempts", parseInt(e.target.value))}
                  min={3}
                  max={10}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* Features Settings */}
          {activeTab === "features" && (
            <div className="space-y-4">
              {[
                { key: "donorRegistration", label: "রক্তদাতা নিবন্ধন", desc: "রক্তদাতা নিবন্ধনের সুবিধা" },
                { key: "bloodRequest", label: "রক্ত অনুরোধ", desc: "রক্ত অনুরোধ করার সুবিধা" },
                { key: "campaigns", label: "ক্যাম্পেইন", desc: "ক্যাম্পেইন ব্যবস্থাপনা" },
                { key: "bloodDrives", label: "রক্তদান ড্রাইভ", desc: "রক্তদান ড্রাইভ ব্যবস্থাপনা" },
                { key: "volunteerManagement", label: "স্বেচ্ছাসেবী ব্যবস্থাপনা", desc: "স্বেচ্ছাসেবী ব্যবস্থাপনা" },
                { key: "analytics", label: "বিশ্লেষণ", desc: "সিস্টেম বিশ্লেষণ" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting("features", item.key)}
                    className="text-2xl"
                  >
                    {settings.features[item.key] ? (
                      <FaToggleOn className="text-emerald-600" />
                    ) : (
                      <FaToggleOff className="text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Database Info */}
          {activeTab === "database" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-600 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">ডাটাবেস তথ্য</p>
                    <p className="text-sm text-blue-800">
                      এই বিভাগে ডাটাবেসের সাধারণ তথ্য দেখানো হয়েছে। ডাটাবেস কনফিগারেশন পরিবর্তন করতে .env ফাইল সম্পাদনা করুন।
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">ডাটাবেস নাম</p>
                  <p className="font-semibold text-slate-900">blood-donation</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">সংযোগ অবস্থা</p>
                  <p className="font-semibold text-emerald-700 flex items-center gap-2">
                    <FaCheckCircle />
                    সংযুক্ত
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">মোট ব্যবহারকারী</p>
                  <p className="font-semibold text-slate-900">{dbStats.totalUsers}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">মোট ক্যাম্পেইন</p>
                  <p className="font-semibold text-slate-900">{dbStats.totalCampaigns}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">মোট ড্রাইভ</p>
                  <p className="font-semibold text-slate-900">{dbStats.totalDrives}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

