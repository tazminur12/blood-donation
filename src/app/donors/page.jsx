"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaUser,
  FaUsers,
  FaSearch,
  FaSpinner,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaTint,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaEye,
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

export default function AllDonorsPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [filterDivision, setFilterDivision] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [filterUpazila, setFilterUpazila] = useState("all");
  const [locationData, setLocationData] = useState(null);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    byBloodGroup: {},
  });

  useEffect(() => {
    loadLocationData();
    loadDonors();
  }, []);

  const loadLocationData = async () => {
    try {
      const res = await fetch("/assets/AllDivision.json");
      const data = await res.json();
      setLocationData(data);
    } catch (error) {
      console.error("Error loading location data:", error);
    }
  };

  const loadDonors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/donors");
      const data = await res.json();
      
      if (res.ok) {
        console.log("Donors loaded:", data.donors?.length || 0);
        setDonors(data.donors || []);
        setStats(data.stats || {
          total: 0,
          available: 0,
          unavailable: 0,
          byBloodGroup: {},
        });
      } else {
        console.error("Error loading donors:", data);
      }
    } catch (error) {
      console.error("Error loading donors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get available divisions, districts, and upazilas based on filters
  const getDivisions = () => {
    if (!locationData) return [];
    return locationData.Bangladesh.map(div => div.Division).sort();
  };

  const getDistricts = () => {
    if (!locationData || filterDivision === "all") return [];
    const division = locationData.Bangladesh.find(d => d.Division === filterDivision);
    if (!division) return [];
    return division.Districts.map(dist => dist.District).sort();
  };

  const getUpazilas = () => {
    if (!locationData || filterDivision === "all" || filterDistrict === "all") return [];
    const division = locationData.Bangladesh.find(d => d.Division === filterDivision);
    if (!division) return [];
    const district = division.Districts.find(d => d.District === filterDistrict);
    if (!district) return [];
    return district.Upazilas.sort();
  };

  // Reset district and upazila when division changes
  useEffect(() => {
    if (filterDivision === "all") {
      setFilterDistrict("all");
      setFilterUpazila("all");
    }
  }, [filterDivision]);

  // Reset upazila when district changes
  useEffect(() => {
    if (filterDistrict === "all") {
      setFilterUpazila("all");
    }
  }, [filterDistrict]);

  const filteredDonors = donors.filter((donor) => {
    // Only show donors who have location data
    if (!donor.division && !donor.district && !donor.upazila) {
      return false;
    }

    const matchesSearch =
      donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.mobile?.includes(searchTerm) ||
      donor.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.division?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.upazila?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBloodGroup = 
      filterBloodGroup === "all" || donor.bloodGroup === filterBloodGroup;
    
    const matchesAvailability = 
      filterAvailability === "all" || 
      (filterAvailability === "available" && donor.isAvailable) ||
      (filterAvailability === "unavailable" && !donor.isAvailable);
    
    const matchesDivision = 
      filterDivision === "all" || 
      donor.division?.toLowerCase() === filterDivision.toLowerCase();
    
    const matchesDistrict = 
      filterDistrict === "all" || 
      donor.district?.toLowerCase() === filterDistrict.toLowerCase();
    
    const matchesUpazila = 
      filterUpazila === "all" || 
      donor.upazila?.toLowerCase() === filterUpazila.toLowerCase();
    
    return matchesSearch && matchesBloodGroup && matchesAvailability && matchesDivision && matchesDistrict && matchesUpazila;
  });

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  const getTimeSinceLastDonation = (lastDonation) => {
    if (!lastDonation) {
      return { months: 0, days: 0, text: "" };
    }
    
    const lastDonationDate = new Date(lastDonation);
    const today = new Date();
    const diffTime = Math.abs(today - lastDonationDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    let text = "";
    if (months > 0 && days > 0) {
      text = `${months} মাস ${days} দিন আগে`;
    } else if (months > 0) {
      text = `${months} মাস আগে`;
    } else if (days > 0) {
      text = `${days} দিন আগে`;
    } else {
      text = "আজ";
    }
    
    return { months, days, text, totalDays: diffDays };
  };

  const getDonationStatus = (lastDonation) => {
    if (!lastDonation) {
      return { 
        canDonate: true, 
        message: "✅ দিতে পারবেন", 
        statusText: "কখনও দেননি",
        days: 0,
        icon: "✅"
      };
    }
    
    const lastDonationDate = new Date(lastDonation);
    const today = new Date();
    const daysSinceLastDonation = Math.floor((today - lastDonationDate) / (1000 * 60 * 60 * 24));
    const requiredDays = 120; // 4 months (120 days) between donations
    
    if (daysSinceLastDonation >= requiredDays) {
      return { 
        canDonate: true, 
        message: "✅ দিতে পারবেন", 
        statusText: "✅ সময় হয়েছে",
        days: 0,
        icon: "✅"
      };
    } else {
      const daysRemaining = requiredDays - daysSinceLastDonation;
      return { 
        canDonate: false, 
        message: `${daysRemaining} দিন পর দিতে পারবে`, 
        statusText: "⏳ সময় হয়নি",
        days: daysRemaining,
        icon: "⏳"
      };
    }
  };

  const formatDateShort = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "";
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-2">
              <FaUsers className="text-rose-600" />
              সমস্ত রক্তদাতা
            </h1>
            <p className="text-slate-600 text-lg">
              রক্তদাতা খুঁজুন এবং যোগাযোগ করুন
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-sm text-slate-600 mb-1">মোট রক্তদাতা</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
              <p className="text-sm text-slate-600 mb-1">সক্রিয়</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.available}</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="নাম, মোবাইল, রক্তের গ্রুপ বা এলাকা দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={filterBloodGroup}
                  onChange={(e) => setFilterBloodGroup(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">সব রক্তের গ্রুপ</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">সব অবস্থা</option>
                  <option value="available">সক্রিয়</option>
                  <option value="unavailable">নিষ্ক্রিয়</option>
                </select>
              </div>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">সব বিভাগ</option>
                  {getDivisions().map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>
              {filterDivision !== "all" && (
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select
                    value={filterDistrict}
                    onChange={(e) => setFilterDistrict(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">সব জেলা</option>
                    {getDistricts().map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {filterDistrict !== "all" && (
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select
                    value={filterUpazila}
                    onChange={(e) => setFilterUpazila(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">সব উপজেলা</option>
                    {getUpazilas().map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-rose-600 mx-auto mb-4" />
                <p className="text-slate-600">রক্তদাতা লোড হচ্ছে...</p>
              </div>
            </div>
          ) : (
            /* Donors Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <FaUsers className="text-4xl text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-lg">কোন রক্তদাতা পাওয়া যায়নি</p>
                </div>
              ) : (
                filteredDonors.map((donor) => {
                  const donationStatus = getDonationStatus(donor.lastDonation);
                  const timeSince = getTimeSinceLastDonation(donor.lastDonation);
                  
                  return (
                    <div
                      key={donor.id}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
                    >
                      {/* Name and Blood Group */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 text-xl">
                          {donor.name || "নাম নেই"}
                        </h3>
                        {donor.bloodGroup && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-rose-100 text-red-700">
                            {donor.bloodGroup}
                          </span>
                        )}
                      </div>

                      {/* Contact and Location */}
                      <div className="space-y-2 mb-4">
                        {donor.mobile && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaPhone className="text-rose-600" />
                            <a
                              href={`tel:${donor.mobile}`}
                              className="hover:text-rose-600 transition"
                            >
                              {donor.mobile}
                            </a>
                          </div>
                        )}
                        {(donor.division || donor.district || donor.upazila) && (
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                            <FaMapMarkerAlt className="text-rose-600 mt-0.5" />
                            <span>
                              {donor.division || donor.district || donor.upazila}
                            </span>
                          </div>
                        )}
                        
                        {/* Last Donation Date */}
                        {donor.lastDonation ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaCalendarAlt className="text-rose-600" />
                            <span>সর্বশেষ: {formatDateShort(donor.lastDonation)}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500">
                            কোন তথ্য নেই
                          </div>
                        )}
                        
                        {/* Time Since Last Donation */}
                        {donor.lastDonation && timeSince.text && (
                          <div className="text-sm text-emerald-600 font-medium">
                            {timeSince.text}
                          </div>
                        )}
                        
                        {/* Donation Status */}
                        <div className="mt-2">
                          {donor.lastDonation ? (
                            donationStatus.canDonate ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                  {donationStatus.statusText}
                                </span>
                                <div className="text-sm text-emerald-700 font-medium">
                                  {donationStatus.message}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                                  {donationStatus.statusText}
                                </span>
                                <div className="text-sm text-amber-700 font-medium">
                                  {donationStatus.message}
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="space-y-1">
                              <span className="text-sm text-slate-600">
                                {donationStatus.statusText}
                              </span>
                              <div className="text-sm text-emerald-700 font-medium">
                                {donationStatus.message}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDonor(donor)}
                        className="w-full bg-rose-100 text-rose-700 py-2 rounded-lg hover:bg-rose-200 transition font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        বিস্তারিত দেখুন
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Donor Detail Modal */}
        {selectedDonor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">রক্তদাতার বিস্তারিত তথ্য</h2>
                  <button
                    onClick={() => setSelectedDonor(null)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <FaTimesCircle className="text-2xl" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                  {selectedDonor.image ? (
                    <img
                      src={selectedDonor.image}
                      alt={selectedDonor.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center">
                      <span className="text-rose-700 font-semibold text-xl">
                        {getInitials(selectedDonor.name)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedDonor.name || "নাম নেই"}
                    </h3>
                    {selectedDonor.bloodGroup && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border mt-2 ${
                          bloodGroupColors[selectedDonor.bloodGroup] || bloodGroupColors["Unknown"]
                        }`}
                      >
                        <FaTint className="mr-1" />
                        {selectedDonor.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">মোবাইল</p>
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                      <FaPhone className="text-rose-600" />
                      {selectedDonor.mobile ? (
                        <a
                          href={`tel:${selectedDonor.mobile}`}
                          className="hover:text-rose-600 transition"
                        >
                          {selectedDonor.mobile}
                        </a>
                      ) : (
                        "নির্ধারিত নয়"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">বিভাগ</p>
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-rose-600" />
                      {selectedDonor.division || "নির্ধারিত নয়"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">জেলা</p>
                    <p className="font-medium text-slate-900">
                      {selectedDonor.district || "নির্ধারিত নয়"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">উপজেলা</p>
                    <p className="font-medium text-slate-900">
                      {selectedDonor.upazila || "নির্ধারিত নয়"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">অবস্থা</p>
                    {selectedDonor.isAvailable ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <FaCheckCircle className="mr-1" />
                        সক্রিয়
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                        <FaTimesCircle className="mr-1" />
                        নিষ্ক্রিয়
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">শেষ রক্তদান</p>
                    {selectedDonor.lastDonation ? (
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        <FaCalendarAlt className="text-rose-600" />
                        {formatDate(selectedDonor.lastDonation)}
                      </p>
                    ) : (
                      <p className="font-medium text-slate-500">
                        কোন তথ্য নেই
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">রক্তদান করতে পারবে</p>
                    {(() => {
                      const donationStatus = getDonationStatus(selectedDonor.lastDonation);
                      return donationStatus.canDonate ? (
                        <div className="space-y-2">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            {donationStatus.statusText}
                          </span>
                          <div className="text-sm text-emerald-700 font-medium">
                            {donationStatus.message}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                            {donationStatus.statusText}
                          </span>
                          <div className="text-sm text-amber-700 font-medium">
                            {donationStatus.message}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

