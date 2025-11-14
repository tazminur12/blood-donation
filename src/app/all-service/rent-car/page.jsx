"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaCar,
  FaPhone,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaSearch,
  FaFilter,
  FaEye,
  FaShieldAlt,
  FaGasPump,
  FaCog,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";

export default function RentCarPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Fetch all cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/rent-cars");
        const data = await res.json();

        if (res.ok && data.success) {
          setCars(data.cars || []);
          setError(null);
        } else {
          setError("গাড়ির তথ্য লোড করা যায়নি");
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("গাড়ির তথ্য লোড করা যায়নি");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Search and filter functionality
  const filteredCars = useMemo(() => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (car) =>
          car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((car) => car.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((car) => car.type === typeFilter);
    }

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      filtered = filtered.filter((car) => {
        const price = car.rentPerDay;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    return filtered;
  }, [searchTerm, statusFilter, typeFilter, priceFilter, cars]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Rented":
        return "bg-yellow-100 text-yellow-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      case "Reserved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return "🟢";
      case "Rented":
        return "🟡";
      case "Maintenance":
        return "🔴";
      case "Reserved":
        return "🔵";
      default:
        return "⚪";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Available":
        return "উপলব্ধ";
      case "Rented":
        return "ভাড়া দেওয়া";
      case "Maintenance":
        return "মেরামত";
      case "Reserved":
        return "সংরক্ষিত";
      default:
        return status || "N/A";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Sedan":
        return "🚗";
      case "SUV":
        return "🚙";
      case "Micro":
        return "🚐";
      case "Luxury":
        return "🏎️";
      case "Van":
        return "🚐";
      case "Truck":
        return "🚛";
      case "Pickup":
        return "🛻";
      case "Bus":
        return "🚌";
      default:
        return "🚗";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    return new Intl.NumberFormat("bn-BD").format(price);
  };

  const handleCall = (contact) => {
    if (contact) {
      window.location.href = `tel:${contact}`;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPriceFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600 text-lg font-medium">
              গাড়ির তালিকা লোড হচ্ছে...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ত্রুটি</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <FaCar className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              🚗 গোবিন্দগঞ্জের ভাড়ার গাড়ি
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
              গোবিন্দগঞ্জের সব ভাড়ার গাড়ি একসাথে দেখুন এবং আপনার প্রয়োজন অনুযায়ী
              বেছে নিন
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="গাড়ি, ব্র্যান্ড বা অবস্থান অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="all">সব অবস্থা</option>
                <option value="Available">🟢 উপলব্ধ</option>
                <option value="Rented">🟡 ভাড়া দেওয়া</option>
                <option value="Maintenance">🔴 মেরামত</option>
                <option value="Reserved">🔵 সংরক্ষিত</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="all">সব ধরন</option>
                <option value="Sedan">🚗 সেডান</option>
                <option value="SUV">🚙 এসইউভি</option>
                <option value="Micro">🚐 মাইক্রো</option>
                <option value="Luxury">🏎️ লাক্সারি</option>
                <option value="Van">🚐 ভ্যান</option>
                <option value="Truck">🚛 ট্রাক</option>
                <option value="Pickup">🛻 পিকআপ</option>
                <option value="Bus">🚌 বাস</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="all">সব দাম</option>
                <option value="0-1000">৳০ - ৳১,০০০</option>
                <option value="1000-2000">৳১,০০০ - ৳২,০০০</option>
                <option value="2000-3000">৳২,০০০ - ৳৩,০০০</option>
                <option value="3000-5000">৳৩,০০০ - ৳৫,০০০</option>
                <option value="5000-999999">৳৫,০০০+</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <FaFilter />
                ফিল্টার মুছুন
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              মোট:{" "}
              <span className="font-semibold text-blue-600">
                {filteredCars.length}
              </span>{" "}
              গাড়ি পাওয়া গেছে
            </span>
            {cars.length > 0 && (
              <span className="text-sm text-gray-600">
                গড় দাম:{" "}
                <span className="font-semibold text-green-600">
                  ৳
                  {formatPrice(
                    Math.round(
                      cars.reduce((sum, car) => sum + (car.rentPerDay || 0), 0) /
                        cars.length
                    )
                  )}
                </span>
                /দিন
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              কোনো গাড়ি নেই
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm ||
              statusFilter !== "all" ||
              typeFilter !== "all" ||
              priceFilter !== "all"
                ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো গাড়ি নেই।"
                : "এখনও কোনো গাড়ি যোগ করা হয়নি।"}
            </p>
            {(searchTerm ||
              statusFilter !== "all" ||
              typeFilter !== "all" ||
              priceFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                🔄 সব দেখুন
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
              >
                {/* Car Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-6xl">{getTypeIcon(car.type)}</div>
                </div>

                {/* Car Info */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {car.year} • {car.type}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        car.status
                      )}`}
                    >
                      {getStatusIcon(car.status)}{" "}
                      {getStatusLabel(car.status)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      <span className="text-xl font-bold text-green-600">
                        ৳{formatPrice(car.rentPerDay)}
                      </span>
                      <span className="text-sm text-gray-500">/দিন</span>
                    </div>
                    {car.rentPerWeek && (
                      <p className="text-xs text-gray-500 mt-1">
                        সাপ্তাহিক: ৳{formatPrice(car.rentPerWeek)}
                      </p>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="space-y-2 mb-4">
                    {car.transmission && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCog className="text-purple-500" />
                        <span>{car.transmission}</span>
                      </div>
                    )}
                    {car.fuelType && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaGasPump className="text-orange-500" />
                        <span>{car.fuelType}</span>
                      </div>
                    )}
                    {car.seats && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUsers className="text-indigo-500" />
                        <span>{car.seats} আসন</span>
                      </div>
                    )}
                    {car.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="line-clamp-1">{car.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Features Preview */}
                  {car.features && car.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaShieldAlt className="text-purple-500 text-sm" />
                        <span className="text-xs font-medium text-gray-700">
                          সুবিধাসমূহ
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {car.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {car.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                            +{car.features.length - 3} আরও
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {car.contact && (
                      <button
                        onClick={() => handleCall(car.contact)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center gap-1"
                        title="কল করুন"
                      >
                        <FaPhone />
                        কল করুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {cars.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {cars.length}
              </div>
              <div className="text-sm text-gray-600">মোট গাড়ি</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {cars.filter((c) => c.status === "Available").length}
              </div>
              <div className="text-sm text-gray-600">উপলব্ধ গাড়ি</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {cars.filter((c) => c.status === "Rented").length}
              </div>
              <div className="text-sm text-gray-600">ভাড়া দেওয়া</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                ৳
                {formatPrice(
                  Math.round(
                    cars.reduce((sum, car) => sum + (car.rentPerDay || 0), 0) /
                      cars.length
                  )
                )}
              </div>
              <div className="text-sm text-gray-600">গড় দৈনিক ভাড়া</div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🚗 ভাড়ার গাড়ি সম্পর্কে
            </h3>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              গোবিন্দগঞ্জের বিভিন্ন বিশ্বস্ত ভাড়ার গাড়ি সেবা প্রদানকারীদের মাধ্যমে
              আপনি আপনার প্রয়োজন অনুযায়ী গাড়ি ভাড়া নিতে পারেন। এখানে আপনি সকল
              ভাড়ার গাড়ির তথ্য, দাম এবং যোগাযোগের মাধ্যম সম্পর্কে জানতে পারবেন।
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

