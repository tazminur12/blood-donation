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
  FaMap,
  FaHotel,
  FaRoute,
  FaTree,
  FaMosque,
  FaLandmark,
  FaGlobe,
  FaInfoCircle,
} from "react-icons/fa";

export default function DestinationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/destinations/${params.id}`);
        const data = await res.json();

        if (res.ok && data.success && data.destination) {
          setDestination(data.destination);
        } else {
          // Fallback: try fetching all and finding the one
          const allRes = await fetch("/api/destinations");
          const allData = await allRes.json();
          if (allRes.ok && allData.success) {
            const found = allData.destinations?.find(
              (d) => d.id === params.id
            );
            if (found) {
              setDestination(found);
            } else {
              setError("গন্তব্য পাওয়া যায়নি");
            }
          } else {
            setError("ডেটা লোড করতে সমস্যা হয়েছে");
          }
        }
      } catch (err) {
        console.error("Error fetching destination:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDestination();
    }
  }, [params.id]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Historical":
        return <FaLandmark className="text-amber-600" />;
      case "Natural":
        return <FaTree className="text-green-600" />;
      case "Religious":
        return <FaMosque className="text-purple-600" />;
      case "Entertainment":
        return <FaHotel className="text-blue-600" />;
      default:
        return <FaMap className="text-gray-600" />;
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case "Historical":
        return "ঐতিহাসিক";
      case "Natural":
        return "প্রাকৃতিক";
      case "Religious":
        return "ধর্মীয়";
      case "Entertainment":
        return "বিনোদন কেন্দ্র";
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Historical":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Natural":
        return "bg-green-100 text-green-800 border-green-200";
      case "Religious":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Entertainment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
          <p className="text-blue-600 font-semibold text-lg">
            তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-3">⚠️</div>
            <p className="text-red-600 font-semibold text-lg mb-4">
              {error || "গন্তব্য পাওয়া যায়নি"}
            </p>
            <Link
              href="/all-service/destination"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaArrowLeft />
              ফিরে যান
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/all-service/destination"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-3 transition text-sm"
          >
            <FaArrowLeft />
            <span>ফিরে যান</span>
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
              {getCategoryIcon(destination.category)}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {destination.name}
            </h1>
            <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                  destination.category
                )}`}
              >
                {getCategoryIcon(destination.category)}
                <span className="ml-2">{getCategoryName(destination.category)}</span>
              </div>
              <div className="flex items-center text-white/90">
                <FaMapMarkerAlt className="mr-1 text-sm" />
                <span>{destination.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Image Section */}
          {destination.image && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          )}

          {/* Details Section */}
          <div className="p-8">
            {/* Description */}
            {destination.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="mr-2 text-blue-600" />
                  বিস্তারিত বিবরণ
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {destination.description}
                </p>
              </div>
            )}

            {/* Additional Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Stay Info */}
              {destination.stayInfo && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center mb-3">
                    <FaHotel className="text-blue-600 text-2xl mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">
                      থাকার ব্যবস্থা
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {destination.stayInfo}
                  </p>
                </div>
              )}

              {/* Travel Info */}
              {destination.travelInfo && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center mb-3">
                    <FaRoute className="text-green-600 text-2xl mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">
                      যাওয়ার উপায়
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {destination.travelInfo}
                  </p>
                </div>
              )}
            </div>

            {/* Map Link */}
            {destination.mapLink && (
              <div className="mb-8">
                <a
                  href={destination.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaGlobe className="text-xl" />
                  <span>Google Map এ দেখুন</span>
                </a>
              </div>
            )}

            {/* Location Info */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                অবস্থান তথ্য
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <span className="font-semibold">অবস্থান:</span>
                  <span className="ml-2">{destination.location}</span>
                </div>
                {destination.district && (
                  <div className="flex items-center">
                    <FaMap className="mr-2 text-blue-500" />
                    <span className="font-semibold">জেলা:</span>
                    <span className="ml-2">{destination.district}</span>
                  </div>
                )}
                {destination.createdAt && (
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-2 text-gray-500" />
                    <span className="font-semibold">যোগ করা হয়েছে:</span>
                    <span className="ml-2">
                      {new Date(destination.createdAt).toLocaleDateString(
                        "bn-BD",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/all-service/destination"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            <FaArrowLeft />
            <span>সব গন্তব্য দেখুন</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

