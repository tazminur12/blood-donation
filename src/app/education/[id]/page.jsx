"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FiBookOpen,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiCalendar,
  FiUsers,
  FiArrowLeft,
  FiExternalLink,
  FiHome,
  FiAward,
  FiActivity,
  FiStar,
  FiImage,
} from "react-icons/fi";

export default function EducationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/educations/${params.id}`);
        const data = await res.json();

        if (res.ok && data.success && data.education) {
          setInstitute(data.education);
        } else {
          // Fallback: try fetching all and finding the one
          const allRes = await fetch("/api/educations");
          const allData = await allRes.json();
          if (allRes.ok) {
            const found = allData.educations?.find((inst) => inst.id === params.id);
            if (found) {
              setInstitute(found);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching institute:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInstitute();
    }
  }, [params.id]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "school":
        return <FiHome className="w-8 h-8" />;
      case "college":
        return <FiAward className="w-8 h-8" />;
      case "school_and_college":
        return <FiBookOpen className="w-8 h-8" />;
      case "university":
        return <FiBookOpen className="w-8 h-8" />;
      case "medical":
        return <FiActivity className="w-8 h-8" />;
      case "madrasa":
        return <FiBookOpen className="w-8 h-8" />;
      default:
        return <FiBookOpen className="w-8 h-8" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "school":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "college":
        return "bg-green-100 text-green-800 border-green-200";
      case "school_and_college":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "university":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "medical":
        return "bg-red-100 text-red-800 border-red-200";
      case "madrasa":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "school":
        return "স্কুল";
      case "college":
        return "কলেজ";
      case "school_and_college":
        return "স্কুল এবং কলেজ";
      case "university":
        return "বিশ্ববিদ্যালয়";
      case "medical":
        return "মেডিকেল";
      case "madrasa":
        return "মাদ্রাসা";
      default:
        return type;
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case "primary":
        return "প্রাথমিক";
      case "secondary":
        return "মাধ্যমিক";
      case "higher_secondary":
        return "উচ্চ মাধ্যমিক";
      case "primary_secondary_higher":
        return "প্রাথমিক, মাধ্যমিক এবং উচ্চ";
      case "secondary_higher":
        return "মাধ্যমিক এবং উচ্চ";
      case "school_and_college":
        return "স্কুল এবং কলেজ";
      case "university":
        return "বিশ্ববিদ্যালয়";
      case "medical":
        return "মেডিকেল";
      default:
        return level;
    }
  };

  const getFacilityLabel = (facility) => {
    const labels = {
      library: "গ্রন্থাগার",
      laboratory: "ল্যাবরেটরি",
      computer_lab: "কম্পিউটার ল্যাব",
      playground: "খেলার মাঠ",
      canteen: "ক্যান্টিন",
      transport: "পরিবহন",
      hostel: "হোস্টেল",
      medical: "চিকিৎসা কেন্দ্র",
      sports: "ক্রীড়া সুবিধা",
      auditorium: "অডিটোরিয়াম",
    };
    return labels[facility] || facility;
  };

  const getFacilityIcon = (facility) => {
    const icons = {
      library: "📚",
      laboratory: "🧪",
      computer_lab: "💻",
      playground: "⚽",
      canteen: "🍽️",
      transport: "🚌",
      hostel: "🏠",
      medical: "🏥",
      sports: "🏃",
      auditorium: "🎭",
    };
    return icons[facility] || "✓";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <FiBookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            প্রতিষ্ঠান পাওয়া যায়নি
          </h1>
          <p className="text-gray-600 mb-8">
            আপনি যে প্রতিষ্ঠানটি খুঁজছেন তা পাওয়া যায়নি।
          </p>
          <Link
            href="/all-service/education"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            ফিরে যান
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/all-service/education"
            className="inline-flex items-center text-blue-100 hover:text-white mb-3 transition-colors text-sm"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            ফিরে যান
          </Link>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full">
              {getTypeIcon(institute.type)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{institute.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                    institute.type
                  )}`}
                >
                  {getTypeText(institute.type)}
                </span>
                <span className="text-blue-100 text-sm">{getLevelText(institute.level)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            {institute.images && institute.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FiImage className="w-6 h-6 mr-2 text-indigo-600" />
                  প্রতিষ্ঠানের ছবি
                </h2>
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={institute.images[selectedImageIndex]?.url}
                      alt={institute.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumbnail Gallery */}
                  {institute.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {institute.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-indigo-600"
                              : "border-transparent hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`${institute.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {institute.description && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  প্রতিষ্ঠান সম্পর্কে
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {institute.description}
                </p>
              </div>
            )}

            {/* Facilities */}
            {institute.facilities && institute.facilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FiStar className="w-6 h-6 mr-2 text-indigo-600" />
                  সুবিধা সমূহ
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {institute.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-2xl mr-3">
                        {getFacilityIcon(facility)}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {getFacilityLabel(facility)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                যোগাযোগের তথ্য
              </h2>
              <div className="space-y-4">
                {institute.address && (
                  <div className="flex items-start">
                    <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">ঠিকানা</p>
                      <p className="text-gray-700">{institute.address}</p>
                    </div>
                  </div>
                )}

                {institute.phone && (
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        যোগাযোগের নম্বর
                      </p>
                      <a
                        href={`tel:${institute.phone}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {institute.phone}
                      </a>
                    </div>
                  </div>
                )}

                {institute.email && (
                  <div className="flex items-center">
                    <FiMail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">ইমেইল</p>
                      <a
                        href={`mailto:${institute.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {institute.email}
                      </a>
                    </div>
                  </div>
                )}

                {institute.website && (
                  <div className="flex items-center">
                    <FiGlobe className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">ওয়েবসাইট</p>
                      <a
                        href={institute.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                      >
                        ওয়েবসাইট দেখুন
                        <FiExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                অতিরিক্ত তথ্য
              </h2>
              <div className="space-y-4">
                {institute.principal && (
                  <div className="flex items-center">
                    <FiUsers className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">অধ্যক্ষ</p>
                      <p className="text-gray-700">{institute.principal}</p>
                    </div>
                  </div>
                )}

                {institute.established && (
                  <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        প্রতিষ্ঠার বছর
                      </p>
                      <p className="text-gray-700">{institute.established}</p>
                    </div>
                  </div>
                )}

                {institute.students && (
                  <div className="flex items-center">
                    <FiUsers className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        শিক্ষার্থীর সংখ্যা
                      </p>
                      <p className="text-gray-700">{institute.students}</p>
                    </div>
                  </div>
                )}

                {institute.upazila && (
                  <div className="flex items-center">
                    <FiMapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">উপজেলা</p>
                      <p className="text-gray-700">{institute.upazila}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">দ্রুত যোগাযোগ</h3>
              {institute.phone && (
                <a
                  href={`tel:${institute.phone}`}
                  className="block w-full text-center px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors mb-3"
                >
                  <FiPhone className="w-5 h-5 inline mr-2" />
                  কল করুন
                </a>
              )}
              {institute.email && (
                <a
                  href={`mailto:${institute.email}`}
                  className="block w-full text-center px-4 py-3 bg-white bg-opacity-20 text-white rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
                >
                  <FiMail className="w-5 h-5 inline mr-2" />
                  ইমেইল করুন
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

