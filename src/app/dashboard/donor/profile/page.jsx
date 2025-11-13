"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTint,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaAward,
  FaMedal,
  FaStar,
  FaTrophy,
  FaGem,
  FaIdCard,
  FaDownload,
} from "react-icons/fa";

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

export default function DonorProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Load profile if authenticated
    if (status === "authenticated") {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/donor/profile");
      const data = await res.json();
      
      if (res.ok) {
        setProfile(data.profile);
      } else {
        console.error("Error loading profile:", data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "BD";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const badgeInfo = {
    first_donation: {
      label: "প্রথম দান",
      icon: FaAward,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      description: "প্রথম রক্তদান সম্পন্ন করেছেন",
    },
    regular_donor: {
      label: "নিয়মিত দাতা",
      icon: FaMedal,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      description: "৩+ বার রক্তদান করেছেন",
    },
    bronze_donor: {
      label: "ব্রোঞ্জ দাতা",
      icon: FaMedal,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      description: "৫+ বার রক্তদান করেছেন",
    },
    silver_donor: {
      label: "সিলভার দাতা",
      icon: FaStar,
      color: "bg-slate-100 text-slate-700 border-slate-200",
      description: "১০+ বার রক্তদান করেছেন",
    },
    gold_donor: {
      label: "গোল্ড দাতা",
      icon: FaStar,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      description: "২৫+ বার রক্তদান করেছেন",
    },
    platinum_donor: {
      label: "প্লাটিনাম দাতা",
      icon: FaTrophy,
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
      description: "৫০+ বার রক্তদান করেছেন",
    },
    diamond_donor: {
      label: "ডায়মন্ড দাতা",
      icon: FaGem,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      description: "১০০+ বার রক্তদান করেছেন",
    },
    lifesaver: {
      label: "জীবন রক্ষাকারী",
      icon: FaAward,
      color: "bg-rose-100 text-rose-700 border-rose-200",
      description: "জরুরী পরিস্থিতিতে রক্তদান করেছেন",
    },
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

  const generateIDCard = () => {
    if (!profile) return;

    const idCardHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Blood Donor ID Card</title>
        <style>
          @page { 
            size: A4 portrait; 
            margin: 0; 
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            background: #000;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }
          .id-card {
            background: white;
            width: 400px;
            height: 600px;
            position: relative;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          }
          
          /* Background pattern */
          .id-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px),
              repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px);
            opacity: 0.3;
            z-index: 0;
          }
          
          /* Red header banner */
          .header-banner {
            background: #dc2626;
            height: 120px;
            position: relative;
            z-index: 1;
            border-radius: 20px 20px 0 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
          }
          .org-title {
            color: white;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 8px;
          }
          .org-location {
            color: white;
            font-size: 14px;
            text-align: center;
            opacity: 0.95;
          }
          
          /* Profile picture section */
          .profile-section {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: -50px;
            margin-bottom: 20px;
          }
          .profile-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid #dc2626;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
          .profile-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .profile-placeholder {
            width: 100%;
            height: 100%;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: #9ca3af;
          }
          .member-badge {
            background: #dc2626;
            color: white;
            padding: 8px 30px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          /* Information section */
          .info-section {
            position: relative;
            z-index: 1;
            padding: 20px 30px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .info-label {
            font-size: 14px;
            color: #000;
            font-weight: 500;
            min-width: 120px;
          }
          .info-value {
            flex: 1;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            color: #000;
            text-align: right;
          }
          .info-value.blood-group {
            background: white;
            border: 2px solid #dc2626;
            color: #dc2626;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
          }
          
          /* Footer */
          .footer {
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 12px;
            color: #000;
            text-align: right;
          }
          
          @media print {
            body {
              background: white;
              padding: 20px;
            }
            .id-card {
              box-shadow: none;
              margin: 0 auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="id-card">
          <!-- Header Banner -->
          <div class="header-banner">
            <div class="org-title">গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন</div>
            <div class="org-location">গোবিন্দগঞ্জ, গাইবান্ধা, বাংলাদেশ</div>
          </div>
          
          <!-- Profile Section -->
          <div class="profile-section">
            <div class="profile-circle">
              ${profile.image 
                ? `<img src="${profile.image}" alt="${profile.name || 'Donor'}" class="profile-image" />`
                : `<div class="profile-placeholder">👤</div>`
              }
            </div>
            <div class="member-badge">সদস্য</div>
          </div>
          
          <!-- Information Section -->
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">নাম</span>
              <span class="info-value">${profile.name || "নির্ধারিত নয়"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ইমেইল</span>
              <span class="info-value">${profile.email || "নির্ধারিত নয়"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">জন্ম তারিখ</span>
              <span class="info-value">${profile.createdAt ? formatDate(profile.createdAt) : "নির্ধারিত নয়"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ঠিকানা</span>
              <span class="info-value">${[profile.upazila, profile.district, profile.division].filter(Boolean).join(", ") || "নির্ধারিত নয়"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">রক্তের গ্রুপ</span>
              <span class="info-value blood-group">${profile.bloodGroup || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">মোবাইল</span>
              <span class="info-value">${profile.mobile || "নির্ধারিত নয়"}</span>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            কর্তৃপক্ষের স্বাক্ষর
          </div>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/downloading
    const printWindow = window.open("", "_blank");
    printWindow.document.write(idCardHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

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

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">প্রোফাইল লোড করতে ব্যর্থ হয়েছে</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaUser className="text-rose-600" />
            আমার প্রোফাইল
          </h1>
          <p className="text-slate-600 mt-1">
            আপনার ব্যক্তিগত তথ্য এবং রক্তদানের ইতিহাস দেখুন
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => generateIDCard()}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            <FaIdCard />
            <span>ID Card</span>
          </button>
          <a
            href="/dashboard/donor/edit_profile"
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            <FaEdit />
            <span>সম্পাদনা করুন</span>
          </a>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-rose-50 to-sky-50 px-6 py-8 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name || "User"}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-sky-100 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-sky-700 font-semibold text-3xl">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}

            {/* Name and Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {profile.name || "নাম নেই"}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {profile.bloodGroup && (
                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${
                      bloodGroupColors[profile.bloodGroup] || bloodGroupColors["Unknown"]
                    }`}
                  >
                    <FaTint className="mr-2" />
                    {profile.bloodGroup}
                  </span>
                )}
                {(() => {
                  const eligibility = getDonationEligibility(profile.lastDonation);
                  return eligibility.canDonate ? (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <FaCheckCircle className="mr-2" />
                      রক্তদানের জন্য প্রস্তুত
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                      <FaTimesCircle className="mr-2" />
                      {eligibility.daysRemaining} দিন অপেক্ষা করুন
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                ব্যক্তিগত তথ্য
              </h3>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">ইমেইল</p>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <FaEnvelope className="text-sky-600" />
                  {profile.email || "নির্ধারিত নয়"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">মোবাইল</p>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <FaPhone className="text-sky-600" />
                  {profile.mobile || "নির্ধারিত নয়"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">রক্তের গ্রুপ</p>
                {profile.bloodGroup ? (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      bloodGroupColors[profile.bloodGroup] || bloodGroupColors["Unknown"]
                    }`}
                  >
                    <FaTint className="mr-1" />
                    {profile.bloodGroup}
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">নির্ধারিত নয়</span>
                )}
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">শেষ রক্তদানের তারিখ</p>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <FaCalendarAlt className="text-sky-600" />
                  {profile.lastDonation ? formatDate(profile.lastDonation) : "এখনও নেই"}
                </p>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                অবস্থান
              </h3>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">বিভাগ</p>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-sky-600" />
                  {profile.division || "নির্ধারিত নয়"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">জেলা</p>
                <p className="font-medium text-slate-900">
                  {profile.district || "নির্ধারিত নয়"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">উপজেলা</p>
                <p className="font-medium text-slate-900">
                  {profile.upazila || "নির্ধারিত নয়"}
                </p>
              </div>
            </div>
          </div>

          {/* Donation Eligibility Alert */}
          {(() => {
            const eligibility = getDonationEligibility(profile.lastDonation);
            if (!eligibility.canDonate) {
              return (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                    <div className="flex items-start">
                      <FaTimesCircle className="text-amber-600 text-xl mr-3 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-amber-800 mb-1">
                          এখন রক্তদান করা যাবে না
                        </h4>
                        <p className="text-amber-700">
                          {eligibility.message}
                        </p>
                        <p className="text-sm text-amber-600 mt-2">
                          শেষ রক্তদান: {profile.lastDonation ? formatDate(profile.lastDonation) : "নির্ধারিত নয়"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else if (profile.lastDonation) {
              return (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-lg">
                    <div className="flex items-start">
                      <FaCheckCircle className="text-emerald-600 text-xl mr-3 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-emerald-800 mb-1">
                          রক্তদানের জন্য প্রস্তুত
                        </h4>
                        <p className="text-emerald-700">
                          আপনি এখন রক্তদান করতে পারবেন। শেষ রক্তদানের পর ৪ মাস পূর্ণ হয়েছে।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Badges Section */}
          {profile.badges && profile.badges.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FaAward className="text-rose-600" />
                ব্যাজ এবং অর্জন
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.badges.map((badge) => {
                  const info = badgeInfo[badge];
                  if (!info) return null;
                  const Icon = info.icon;
                  return (
                    <div
                      key={badge}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${info.color}`}
                      title={info.description}
                    >
                      <Icon className="text-lg" />
                      <span className="font-semibold">{info.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Donation Statistics */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              রক্তদানের তথ্য
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                <p className="text-sm text-rose-600 mb-1">মোট রক্তদান</p>
                <p className="text-2xl font-bold text-rose-700">
                  {profile.totalDonations || 0}
                </p>
              </div>
              <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                <p className="text-sm text-sky-600 mb-1">শেষ রক্তদান</p>
                <p className="text-sm font-semibold text-sky-700">
                  {profile.lastDonation ? formatDate(profile.lastDonation) : "এখনও নেই"}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-emerald-600 mb-1">পরবর্তী রক্তদান</p>
                <p className="text-sm font-semibold text-emerald-700">
                  {(() => {
                    const eligibility = getDonationEligibility(profile.lastDonation);
                    if (!profile.lastDonation) {
                      return "এখনই দিতে পারেন";
                    }
                    if (eligibility.canDonate) {
                      return "এখনই দিতে পারেন";
                    }
                    return `${eligibility.daysRemaining} দিন পর`;
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              অ্যাকাউন্ট তথ্য
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">নিবন্ধনের তারিখ</p>
                <p className="font-medium text-slate-900 flex items-center gap-2">
                  <FaCalendarAlt className="text-sky-600" />
                  {formatDate(profile.createdAt)}
                </p>
              </div>
              {profile.lastLogin && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">শেষ লগইন</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <FaCalendarAlt className="text-sky-600" />
                    {formatDate(profile.lastLogin)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

