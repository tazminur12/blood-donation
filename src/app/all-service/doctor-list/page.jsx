"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaUserMd,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSearch,
  FaSpinner,
  FaGraduationCap,
  FaHospital,
  FaUsers,
  FaClock,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("সব বিশেষতা");
  const [selectedHospital, setSelectedHospital] = useState("সব হাসপাতাল");
  const [selectedArea, setSelectedArea] = useState("সব এলাকা");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctors");
      const data = await res.json();

      if (res.ok) {
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const specialties = useMemo(() => {
    const unique = [
      ...new Set(
        doctors
          .map((d) => d.specialization)
          .filter((s) => s && s.trim() !== "")
      ),
    ];
    return ["সব বিশেষতা", ...unique];
  }, [doctors]);

  const hospitals = useMemo(() => {
    const unique = [
      ...new Set(
        doctors
          .map((d) => d.chamber)
          .filter((h) => h && h.trim() !== "")
      ),
    ];
    return ["সব হাসপাতাল", ...unique];
  }, [doctors]);

  const areas = useMemo(() => {
    const unique = [
      ...new Set(
        doctors
          .map((d) => d.location)
          .filter((a) => a && a.trim() !== "")
      ),
    ];
    return ["সব এলাকা", ...unique];
  }, [doctors]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        doctor.name?.toLowerCase().includes(search) ||
        doctor.specialization?.toLowerCase().includes(search) ||
        doctor.location?.toLowerCase().includes(search) ||
        doctor.chamber?.toLowerCase().includes(search);

      const matchesSpecialty =
        selectedSpecialty === "সব বিশেষতা" ||
        doctor.specialization === selectedSpecialty;

      const matchesHospital =
        selectedHospital === "সব হাসপাতাল" ||
        doctor.chamber === selectedHospital;

      const matchesArea =
        selectedArea === "সব এলাকা" || doctor.location === selectedArea;

      return matchesSearch && matchesSpecialty && matchesHospital && matchesArea;
    });
  }, [doctors, searchTerm, selectedSpecialty, selectedHospital, selectedArea]);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalDoctors: doctors.length,
      totalHospitals: hospitals.length - 1,
      totalSpecialties: specialties.length - 1,
    };
  }, [doctors, hospitals, specialties]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            গোবিন্দগঞ্জের ডাক্তার তালিকা
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            আপনার পছন্দের বিশেষজ্ঞ ডাক্তার খুঁজে নিন এবং স্বাস্থ্যসেবা নিশ্চিত করুন
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ডাক্তার, বিশেষতা বা এলাকা খুঁজুন"
                  className="w-full rounded-lg border border-slate-300 bg-white px-12 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col gap-3 sm:flex-row lg:w-auto">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>

              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {hospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>
                    {hosp}
                  </option>
                ))}
              </select>

              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-teal-100 p-3">
                <FaUsers className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">মোট ডাক্তার</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalDoctors} জন
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <FaHospital className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">হাসপাতাল</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalHospitals} টি
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3">
                <FaGraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">বিশেষতা</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalSpecialties} ধরনের
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <FaUserMd className="mx-auto h-16 w-16 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {searchTerm || selectedSpecialty !== "সব বিশেষতা"
                ? "আপনার অনুসন্ধানের সাথে মিলে যাওয়া কোনো ডাক্তার পাওয়া যায়নি"
                : "কোনো ডাক্তারের তথ্য পাওয়া যায়নি"}
            </h3>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Doctor Photo */}
                  {doctor.image ? (
                    <div className="relative h-64 w-full overflow-hidden lg:h-auto lg:w-64 lg:shrink-0">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center bg-slate-100 lg:h-auto lg:w-64 lg:shrink-0">
                      <FaUserMd className="h-24 w-24 text-slate-300" />
                    </div>
                  )}

                  {/* Doctor Details */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Name and Specialty */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {doctor.name}
                      </h3>
                      {doctor.specialization && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2">
                          <FaBriefcase className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-semibold text-teal-700">
                            {doctor.specialization}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    {doctor.qualification && (
                      <div className="mb-3 flex items-start gap-2 text-slate-700">
                        <FaGraduationCap className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                        <span className="text-sm">{doctor.qualification}</span>
                      </div>
                    )}

                    {/* Experience */}
                    {doctor.experience && (
                      <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
                        <FaClock className="h-4 w-4 shrink-0 text-green-600" />
                        <span>অভিজ্ঞতা: {doctor.experience}</span>
                      </div>
                    )}

                    {/* Hospital */}
                    {doctor.chamber && (
                      <div className="mb-2 flex items-start gap-2 text-slate-700">
                        <FaHospital className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                        <div>
                          <span className="text-sm font-medium">হাসপাতাল:</span>{" "}
                          <span className="text-sm">{doctor.chamber}</span>
                        </div>
                      </div>
                    )}

                    {/* Chamber Address */}
                    {doctor.location && (
                      <div className="mb-4 flex items-start gap-2 text-slate-700">
                        <FaMapMarkerAlt className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                        <div>
                          <span className="text-sm font-medium">চেম্বার:</span>{" "}
                          <span className="text-sm">{doctor.location}</span>
                          {doctor.address && (
                            <span className="text-sm text-slate-600">
                              , {doctor.address}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="mt-auto space-y-2 border-t border-slate-200 pt-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                          {doctor.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="h-4 w-4 shrink-0 text-green-600" />
                              <span className="text-sm font-medium text-slate-700">
                                ফোন:
                              </span>
                              <a
                                href={`tel:${doctor.phoneNumber}`}
                                className="font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                              >
                                {doctor.phoneNumber}
                              </a>
                            </div>
                          )}

                          {doctor.email && (
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="h-4 w-4 shrink-0 text-green-600" />
                              <a
                                href={`mailto:${doctor.email}`}
                                className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                              >
                                {doctor.email}
                              </a>
                            </div>
                          )}
                        </div>

                        {doctor.phoneNumber && (
                          <a
                            href={`tel:${doctor.phoneNumber}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            <FaPhone className="h-3 w-3" />
                            কল করুন
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
