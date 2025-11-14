"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaPhone,
  FaExclamationTriangle,
  FaSpinner,
  FaSearch,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

export default function AmbulancePage() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("সব এলাকা");
  const [selectedType, setSelectedType] = useState("সব ধরণ");

  useEffect(() => {
    loadAmbulances();
  }, []);

  const loadAmbulances = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ambulances");
      const data = await res.json();

      if (res.ok) {
        setAmbulances(data.ambulances || []);
      }
    } catch (error) {
      console.error("Error loading ambulances:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const areas = useMemo(() => {
    const unique = [
      ...new Set(
        ambulances
          .map((a) => a.area || a.location)
          .filter((a) => a && a.trim() !== "")
      ),
    ];
    return ["সব এলাকা", ...unique];
  }, [ambulances]);

  const types = useMemo(() => {
    const unique = [
      ...new Set(
        ambulances
          .map((a) => a.type || a.serviceType)
          .filter((t) => t && t.trim() !== "")
      ),
    ];
    return ["সব ধরণ", ...unique];
  }, [ambulances]);

  // Filter ambulances
  const filteredAmbulances = useMemo(() => {
    return ambulances.filter((ambulance) => {
      const search = searchTerm.toLowerCase();
      const serviceName = ambulance.serviceName || ambulance.name || "";
      const area = ambulance.area || ambulance.location || "";

      const matchesSearch =
        !searchTerm ||
        serviceName.toLowerCase().includes(search) ||
        area.toLowerCase().includes(search);

      const matchesArea =
        selectedArea === "সব এলাকা" ||
        (ambulance.area || ambulance.location) === selectedArea;

      const matchesType =
        selectedType === "সব ধরণ" ||
        (ambulance.type || ambulance.serviceType) === selectedType;

      return matchesSearch && matchesArea && matchesType;
    });
  }, [ambulances, searchTerm, selectedArea, selectedType]);

  return (
    <div className="min-h-screen bg-rose-50/40">
      <Navbar />

      {/* Emergency Call Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-4 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <FaExclamationTriangle className="h-6 w-6 shrink-0 text-yellow-300" />
              <div>
                <h2 className="text-lg font-bold">জরুরী এম্বুলেন্স কল করুন</h2>
                <p className="text-sm text-red-100">২৪/৭ সার্ভিস, দ্রুত সাড়া</p>
              </div>
            </div>
            <a
              href="tel:999"
              className="flex items-center gap-3 rounded-lg bg-white px-6 py-3 text-red-600 font-bold text-lg hover:bg-red-50 transition shadow-lg"
            >
              <FaPhone className="h-6 w-6" />
              <span>৯৯৯</span>
            </a>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            গোবিন্দগঞ্জের এম্বুলেন্স সার্ভিস
          </h1>
          <p className="mt-2 text-base text-slate-600">
            জরুরী প্রয়োজনে নিকটবর্তী এম্বুলেন্স খুঁজুন
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search Input */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                সার্ভিস খুঁজুন
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="সার্ভিস নাম বা এলাকা লিখুন"
                  className="w-full rounded-lg border border-slate-300 bg-white px-12 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col gap-4 sm:flex-row lg:w-auto">
              <div className="sm:w-48">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  এলাকা
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:w-48">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ধরণ
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Ambulance List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : filteredAmbulances.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <FaAmbulance className="mx-auto h-16 w-16 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              কোনো অ্যাম্বুলেন্সের তথ্য পাওয়া যায়নি
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {searchTerm || selectedArea !== "সব এলাকা" || selectedType !== "সব ধরণ"
                ? "অনুসন্ধানের সাথে মিলছে না"
                : "প্রথম অ্যাম্বুলেন্সের তথ্য যোগ করুন"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAmbulances.map((ambulance) => {
              const serviceName = ambulance.serviceName || ambulance.name || "";
              const area = ambulance.area || ambulance.location || "";
              const type = ambulance.type || ambulance.serviceType || "";
              const contact = ambulance.contact || ambulance.phoneNumber || "";
              const emergencyNumber = ambulance.emergencyNumber || ambulance.alternativePhone || "";
              const imageUrl = ambulance.imageUrl || ambulance.image || "";
              const features = ambulance.features || [];
              const availability = ambulance.availability;

              return (
                <div
                  key={ambulance.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-md transition hover:shadow-xl overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header: Service Name and Area */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-slate-900 flex-1">
                        {serviceName}
                      </h3>
                      {area && (
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            এলাকা
                          </span>
                          <p className="text-sm font-medium text-slate-700 mt-1">{area}</p>
                        </div>
                      )}
                    </div>

                    {/* Service Status Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {availability !== undefined && availability && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 border border-green-200">
                          সার্ভিস প্রস্তুত
                        </span>
                      )}
                      {type && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 border border-blue-200">
                          {type}
                        </span>
                      )}
                    </div>

                    {/* Features Section */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        সুবিধা সমূহ:
                      </p>
                      {features.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">কোনো সুবিধা যোগ করা হয়নি</p>
                      )}
                    </div>

                    {/* Contact Information - Two Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-200">
                      {/* Regular Contact */}
                      {contact && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1">
                            নিয়মিত যোগাযোগ:
                          </p>
                          <a
                            href={`tel:${contact.replace(/\s+/g, "")}`}
                            className="flex items-center gap-2 text-base font-bold text-slate-700 hover:text-red-600 transition"
                          >
                            <FaPhone className="h-4 w-4 text-slate-500" />
                            {contact}
                          </a>
                        </div>
                      )}

                      {/* Emergency Number */}
                      {emergencyNumber && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1">
                            জরুরী নম্বর:
                          </p>
                          <a
                            href={`tel:${emergencyNumber.replace(/\s+/g, "")}`}
                            className="flex items-center gap-2 text-base font-bold text-red-600 hover:text-red-700 transition"
                          >
                            <FaClock className="h-4 w-4 text-red-500" />
                            {emergencyNumber}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Call Now Button */}
                    {(contact || emergencyNumber) && (
                      <a
                        href={`tel:${(emergencyNumber || contact).replace(/\s+/g, "")}`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700 shadow-md"
                      >
                        <FaPhone className="h-4 w-4" />
                        এখনই কল করুন
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Emergency Health Services Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">জরুরী স্বাস্থ্য সেবা</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* National Emergency */}
            <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
                <span className="text-2xl font-bold">৯৯৯</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">জাতীয় জরুরী নম্বর</h3>
              <p className="text-sm text-slate-600">সকল জরুরী সেবার জন্য</p>
              <a
                href="tel:999"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
              >
                <FaPhone className="h-4 w-4" />
                কল করুন
              </a>
            </div>

            {/* Health Helpline */}
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                <span className="text-2xl font-bold">১৬২৬৩</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">স্বাস্থ্য বাতায়ন</h3>
              <p className="text-sm text-slate-600">স্বাস্থ্য সেবা পরামর্শ</p>
              <a
                href="tel:16263"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                <FaPhone className="h-4 w-4" />
                কল করুন
              </a>
            </div>

            {/* Special Service */}
            <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                <span className="text-2xl font-bold">৩৩৩</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">বিশেষ সেবা</h3>
              <p className="text-sm text-slate-600">কোভিড ও বিশেষ সহায়তা</p>
              <a
                href="tel:333"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700"
              >
                <FaPhone className="h-4 w-4" />
                কল করুন
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
