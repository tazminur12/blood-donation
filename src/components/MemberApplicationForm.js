"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaIdCard, FaBriefcase, FaGraduationCap, FaFacebook } from "react-icons/fa";
import Swal from "sweetalert2";

export default function MemberApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    currentAddress: "",
    permanentAddress: "",
    dateOfBirth: "",
    bloodGroup: "",
    religion: "",
    nationality: "",
    birthRegNid: "",
    occupation: "",
    education: "",
    facebookId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const bloodGroups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  const religions = [
    "ইসলাম",
    "হিন্দু",
    "বৌদ্ধ",
    "খ্রিস্টান",
    "অন্যান্য",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "নাম আবশ্যক";
    }
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "পিতার নাম আবশ্যক";
    }
    if (!formData.motherName.trim()) {
      newErrors.motherName = "মাতার নাম আবশ্যক";
    }
    if (!formData.currentAddress.trim()) {
      newErrors.currentAddress = "বর্তমান ঠিকানা আবশ্যক";
    }
    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = "স্থায়ী ঠিকানা আবশ্যক";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "জন্ম তারিখ আবশ্যক";
    }
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "রক্তের গ্রুপ আবশ্যক";
    }
    if (!formData.religion) {
      newErrors.religion = "ধর্ম আবশ্যক";
    }
    if (!formData.nationality.trim()) {
      newErrors.nationality = "জাতীয়তা আবশ্যক";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "ভুল!",
        text: "অনুগ্রহ করে সব আবশ্যক ক্ষেত্র পূরণ করুন",
        confirmButtonText: "ঠিক আছে",
      });
      return;
    }

    setLoading(true);

    try {
      // Send data to API
      const response = await fetch("/api/member-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "আবেদন জমা দেওয়ার সময় একটি সমস্যা হয়েছে");
      }

      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: data.message || "আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে",
        confirmButtonText: "ঠিক আছে",
      });

      // Reset form
      setFormData({
        name: "",
        fatherName: "",
        motherName: "",
        currentAddress: "",
        permanentAddress: "",
        dateOfBirth: "",
        bloodGroup: "",
        religion: "",
        nationality: "",
        birthRegNid: "",
        occupation: "",
        education: "",
        facebookId: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: error.message || "আবেদন জমা দেওয়ার সময় একটি সমস্যা হয়েছে",
        confirmButtonText: "ঠিক আছে",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-8">
          সদস্যের আবেদন ফরম
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUser className="inline mr-2 text-red-600" />
                  নাম
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর নাম"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Current Address */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                  বর্তমান ঠিকানা
                </label>
                <input
                  type="text"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর বর্তমান ঠিকানা"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.currentAddress ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.currentAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentAddress}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaCalendar className="inline mr-2 text-red-600" />
                  জন্ম তারিখ
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Religion */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ধর্ম
                </label>
                <select
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.religion ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">ধর্ম</option>
                  {religions.map((religion) => (
                    <option key={religion} value={religion}>
                      {religion}
                    </option>
                  ))}
                </select>
                {errors.religion && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.religion}
                  </p>
                )}
              </div>

              {/* Facebook ID */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaFacebook className="inline mr-2 text-blue-600" />
                  ফেসবুক আইডি
                </label>
                <input
                  type="text"
                  name="facebookId"
                  value={formData.facebookId}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর ফেসবুক আইডি"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* Father's Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUser className="inline mr-2 text-red-600" />
                  পিতার নাম
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর পিতার নাম"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.fatherName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fatherName}
                  </p>
                )}
              </div>

              {/* Permanent Address */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                  স্থায়ী ঠিকানা
                </label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর স্থায়ী ঠিকানা"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.permanentAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.permanentAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.permanentAddress}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  রক্তের গ্রুপ
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.bloodGroup ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">রক্তের গ্রুপ</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bloodGroup}
                  </p>
                )}
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  জাতীয়তা
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর জাতীয়তা"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.nationality ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nationality && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nationality}
                  </p>
                )}
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              {/* Mother's Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUser className="inline mr-2 text-red-600" />
                  মাতার নাম
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর মাতার নাম"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.motherName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.motherName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.motherName}
                  </p>
                )}
              </div>

              {/* Birth Registration/NID */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaIdCard className="inline mr-2 text-red-600" />
                  জন্ম নিবন্ধন/NID নং
                </label>
                <input
                  type="text"
                  name="birthRegNid"
                  value={formData.birthRegNid}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর জন্ম নিবন্ধন/NID নং"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaBriefcase className="inline mr-2 text-red-600" />
                  পেশা
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর পেশা"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Educational Qualification */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaGraduationCap className="inline mr-2 text-red-600" />
                  শিক্ষাগত যোগ্যতা
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="আবেদনকারীর শিক্ষাগত যোগ্যতা"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "জমা দেওয়া হচ্ছে..." : "সাবমিট"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

