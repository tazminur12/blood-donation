"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSpinner,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUsers,
  FaMoneyBillWave,
  FaInfoCircle,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/${params.id}`);
        const data = await res.json();

        if (res.ok && data.success && data.event) {
          setEvent(data.event);
        } else {
          // Fallback: try fetching all and finding the one
          const allRes = await fetch("/api/events");
          const allData = await allRes.json();
          if (allRes.ok && allData.success) {
            const found = allData.events?.find((e) => e.id === params.id);
            if (found) {
              setEvent(found);
            } else {
              setError("ইভেন্ট পাওয়া যায়নি");
            }
          } else {
            setError("ডেটা লোড করতে সমস্যা হয়েছে");
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Cultural":
        return "🎭";
      case "Sports":
        return "⚽";
      case "Educational":
        return "📚";
      case "Business":
        return "💼";
      case "Religious":
        return "🕊️";
      case "Social":
        return "👥";
      case "Entertainment":
        return "🎪";
      case "Technology":
        return "💻";
      case "Health":
        return "🏥";
      case "Environment":
        return "🌱";
      default:
        return "📅";
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      Cultural: "🎭 সাংস্কৃতিক",
      Sports: "⚽ খেলাধুলা",
      Educational: "📚 শিক্ষামূলক",
      Business: "💼 ব্যবসায়িক",
      Religious: "🕊️ ধর্মীয়",
      Social: "👥 সামাজিক",
      Entertainment: "🎪 বিনোদন",
      Technology: "💻 প্রযুক্তি",
      Health: "🏥 স্বাস্থ্য",
      Environment: "🌱 পরিবেশ",
    };
    return categories[category] || category;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    const statuses = {
      Upcoming: "আসন্ন",
      Ongoing: "চলমান",
      Completed: "সম্পন্ন",
      Cancelled: "বাতিল",
    };
    return statuses[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-3" />
            <p className="text-gray-600 text-lg font-medium">
              ইভেন্ট লোড হচ্ছে...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ত্রুটি</h2>
            <p className="text-gray-600 mb-4">
              {error || "ইভেন্ট পাওয়া যায়নি"}
            </p>
            <Link
              href="/all-service/event"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200"
            >
              <FaArrowLeft className="inline mr-2" />
              সব ইভেন্টে ফিরে যান
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/all-service/event"
              className="text-white hover:text-purple-200 transition"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{getCategoryIcon(event.category)}</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    event.status
                  )}`}
                >
                  {getStatusLabel(event.status)}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-purple-100 text-sm">
                {getCategoryLabel(event.category)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image Placeholder */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-8xl">{getCategoryIcon(event.category)}</div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2 text-purple-600" />
                  📝 ইভেন্টের বিবরণ
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {event.highlights && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2 text-yellow-600" />
                  ⭐ বিশেষ আকর্ষণ
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.highlights}
                </p>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2 text-blue-600" />
                  📋 প্রয়োজনীয়তা
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.requirements}
                </p>
              </div>
            )}

            {/* Contact Info */}
            {event.contactInfo && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaPhone className="w-5 h-5 mr-2 text-green-600" />
                  📞 যোগাযোগের তথ্য
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.contactInfo}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📅 ইভেন্টের তথ্য
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-purple-600 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">তারিখ</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
                {event.time && (
                  <div className="flex items-start gap-3">
                    <FaClock className="text-green-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">সময়</p>
                      <p className="font-semibold text-gray-800">{event.time}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-600 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">স্থান</p>
                    <p className="font-semibold text-gray-800">
                      {event.location}
                    </p>
                    {event.locationDetails?.address && (
                      <p className="text-sm text-gray-600 mt-1">
                        {event.locationDetails.address}
                      </p>
                    )}
                  </div>
                </div>
                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <FaUsers className="text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">ধারণক্ষমতা</p>
                      <p className="font-semibold text-gray-800">
                        {event.capacity} জন
                      </p>
                    </div>
                  </div>
                )}
                {event.entryFee !== undefined && (
                  <div className="flex items-start gap-3">
                    <FaMoneyBillWave className="text-orange-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">প্রবেশ ফি</p>
                      <p className="font-semibold text-gray-800">
                        {event.isFree
                          ? "🆓 বিনামূল্যে"
                          : `💰 ${event.entryFee} টাকা`}
                      </p>
                    </div>
                  </div>
                )}
                {event.targetAudience && (
                  <div className="flex items-start gap-3">
                    <FaUsers className="text-indigo-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">লক্ষ্য দর্শক</p>
                      <p className="font-semibold text-gray-800">
                        {event.targetAudience}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                👤 আয়োজকের তথ্য
              </h3>
              <div className="space-y-3">
                {event.organizer && (
                  <div className="flex items-center gap-3">
                    <FaUser className="text-purple-600 shrink-0" />
                    <p className="text-gray-800 font-medium">{event.organizer}</p>
                  </div>
                )}
                {event.organizerPhone && (
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-600 shrink-0" />
                    <a
                      href={`tel:${event.organizerPhone}`}
                      className="text-gray-800 hover:text-purple-600 transition"
                    >
                      {event.organizerPhone}
                    </a>
                  </div>
                )}
                {event.organizerEmail && (
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-600 shrink-0" />
                    <a
                      href={`mailto:${event.organizerEmail}`}
                      className="text-gray-800 hover:text-purple-600 transition"
                    >
                      {event.organizerEmail}
                    </a>
                  </div>
                )}
                {event.organizerWebsite && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-indigo-600 shrink-0" />
                    <a
                      href={
                        event.organizerWebsite.startsWith("http")
                          ? event.organizerWebsite
                          : `https://${event.organizerWebsite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-purple-600 transition"
                    >
                      ওয়েবসাইট দেখুন
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(event.socialMedia?.facebook ||
              event.socialMedia?.instagram ||
              event.socialMedia?.twitter) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  📱 সোশ্যাল মিডিয়া
                </h3>
                <div className="space-y-3">
                  {event.socialMedia.facebook && (
                    <a
                      href={event.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaFacebook className="text-xl" />
                      <span>ফেসবুক</span>
                    </a>
                  )}
                  {event.socialMedia.instagram && (
                    <a
                      href={event.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-pink-600 hover:text-pink-800 transition"
                    >
                      <FaInstagram className="text-xl" />
                      <span>ইনস্টাগ্রাম</span>
                    </a>
                  )}
                  {event.socialMedia.twitter && (
                    <a
                      href={event.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-400 hover:text-blue-600 transition"
                    >
                      <FaTwitter className="text-xl" />
                      <span>টুইটার</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

