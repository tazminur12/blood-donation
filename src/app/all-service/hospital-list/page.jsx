"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";

export default function HospitalListPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hospitals");
      const data = await res.json();

      if (res.ok) {
        setHospitals(data.hospitals || []);
      }
    } catch (error) {
      console.error("Error loading hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const search = searchTerm.toLowerCase();
    return (
      hospital.name?.toLowerCase().includes(search) ||
      hospital.location?.toLowerCase().includes(search) ||
      hospital.address?.toLowerCase().includes(search) ||
      hospital.description?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            গোবিন্দগঞ্জ জেলার হাসপাতাল সমূহ
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            জরুরী প্রয়োজনে নিকটবর্তী হাসপাতাল খুঁজুন
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <label className="mb-3 block text-base font-semibold text-slate-700">
            হাসপাতাল খুঁজুন
          </label>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="হাসপাতালের নাম বা এলাকা লিখুন"
              className="w-full rounded-lg border border-slate-300 bg-white px-12 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Hospitals List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <FaHospital className="mx-auto h-16 w-16 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {searchTerm
                ? "আপনার অনুসন্ধানের সাথে মিলে যাওয়া কোনো হাসপাতাল পাওয়া যায়নি"
                : "কোনো হাসপাতালের তথ্য পাওয়া যায়নি"}
            </h3>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Hospital Image */}
                  {hospital.image ? (
                    <div className="relative h-64 w-full overflow-hidden lg:h-auto lg:w-80 lg:shrink-0">
                      <img
                        src={hospital.image}
                        alt={hospital.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center bg-slate-100 lg:h-auto lg:w-80 lg:shrink-0">
                      <FaHospital className="h-20 w-20 text-slate-300" />
                    </div>
                  )}

                  {/* Hospital Details */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Hospital Name and Type */}
                    <div className="mb-4 flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-blue-100 p-2">
                        <FaHospital className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {hospital.name}
                        </h3>
                        <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          হাসপাতাল
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    {hospital.location && (
                      <div className="mb-3 flex items-start gap-2 text-slate-700">
                        <FaMapMarkerAlt className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                        <div>
                          <p className="font-medium">{hospital.location}</p>
                          {hospital.address && (
                            <p className="mt-1 text-sm text-slate-600">
                              {hospital.address}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Specialized Services Tags */}
                    {hospital.description && (
                      <div className="mb-4">
                        <p className="mb-2 text-sm font-semibold text-slate-700">
                          বিশেষায়িত সেবা:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {hospital.description
                            .split(",")
                            .slice(0, 3)
                            .map((service, idx) => (
                              <span
                                key={idx}
                                className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                              >
                                {service.trim()}
                              </span>
                            ))}
                          {!hospital.description.includes(",") && (
                            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {hospital.description.length > 50
                                ? hospital.description.substring(0, 50) + "..."
                                : hospital.description}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="mt-auto space-y-2 border-t border-slate-200 pt-4">
                      {hospital.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <FaPhone className="h-4 w-4 shrink-0 text-blue-600" />
                          <span className="font-semibold text-slate-900">
                            {hospital.phoneNumber}
                          </span>
                          <a
                            href={`tel:${hospital.phoneNumber}`}
                            className="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <span className="flex items-center gap-2">
                              <FaPhone className="h-3 w-3" />
                              কল করুন
                            </span>
                          </a>
                        </div>
                      )}

                      {/* Emergency Contact */}
                      {hospital.phoneNumber && (
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold text-red-600">জরুরী:</span>{" "}
                          {hospital.phoneNumber}
                          {hospital.email && `, ${hospital.email}`}
                        </p>
                      )}

                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        {hospital.email && (
                          <a
                            href={`mailto:${hospital.email}`}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 hover:underline"
                          >
                            <FaEnvelope className="h-4 w-4" />
                            {hospital.email}
                          </a>
                        )}
                        {hospital.website && (
                          <a
                            href={hospital.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 hover:underline"
                          >
                            <FaGlobe className="h-4 w-4" />
                            ওয়েবসাইট
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
