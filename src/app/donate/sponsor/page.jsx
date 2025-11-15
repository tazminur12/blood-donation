"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaHandshake,
  FaAward,
  FaUsers,
  FaHeartbeat,
  FaHandsHelping,
  FaTrophy,
  FaStar,
  FaCheckCircle,
  FaInfoCircle,
  FaChartLine,
  FaBullhorn,
  FaShieldAlt,
  FaGift,
  FaCalendarAlt,
  FaCamera,
  FaFacebook,
  FaLink,
  FaPhone,
  FaEnvelope,
  FaDonate,
  FaUser,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaPaperPlane,
  FaSpinner,
  FaUpload,
  FaImage,
} from "react-icons/fa";

export default function SponsorPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    aboutSponsor: "",
    photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setFileName(files[0].name);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // Here you would typically send the data to your API
      // For now, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        address: "",
        aboutSponsor: "",
        photo: null,
      });
      setFileName("");

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError("ফর্ম জমা দেওয়ার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };
  const sponsorshipPackages = [
    {
      name: "সিলভার স্পন্সর",
      amount: "৫,০০০ - ১০,০০০ টাকা",
      icon: <FaStar className="text-4xl text-gray-400" />,
      color: "from-gray-400 to-gray-500",
      bgColor: "bg-gray-50",
      benefits: [
        "স্পন্সর হিসেবে নাম প্রকাশ",
        "ইভেন্টে স্পন্সর হিসেবে উল্লেখ",
        "সোশ্যাল মিডিয়ায় স্পন্সর হিসেবে নাম",
        "ধন্যবাদ সার্টিফিকেট",
      ],
    },
    {
      name: "গোল্ড স্পন্সর",
      amount: "১০,০০০ - ২৫,০০০ টাকা",
      icon: <FaTrophy className="text-4xl text-yellow-500" />,
      color: "from-yellow-400 to-yellow-500",
      bgColor: "bg-yellow-50",
      benefits: [
        "সিলভার স্পন্সরের সকল সুবিধা",
        "ইভেন্টে লোগো প্রদর্শন",
        "ব্যানার/পোস্টারে লোগো",
        "ইভেন্টে বিশেষ আসন",
        "স্পন্সর হিসেবে বক্তব্য",
      ],
    },
    {
      name: "প্লাটিনাম স্পন্সর",
      amount: "২৫,০০০ - ৫০,০০০ টাকা",
      icon: <FaAward className="text-4xl text-blue-500" />,
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50",
      benefits: [
        "গোল্ড স্পন্সরের সকল সুবিধা",
        "ইভেন্টের প্রধান স্পন্সর হিসেবে",
        "মূল মঞ্চে লোগো প্রদর্শন",
        "মিডিয়া কভারেজে বিশেষ উল্লেখ",
        "স্পন্সর হিসেবে বিশেষ সম্মাননা",
      ],
    },
    {
      name: "ডায়মন্ড স্পন্সর",
      amount: "৫০,০০০+ টাকা",
      icon: <FaStar className="text-4xl text-purple-500" />,
      color: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-50",
      benefits: [
        "প্লাটিনাম স্পন্সরের সকল সুবিধা",
        "ইভেন্টের Title Sponsor",
        "সকল প্রচারমাধ্যমে প্রধান স্পন্সর",
        "বিশেষ সম্মাননা ক্রেস্ট",
        "সংগঠনের বিশেষ সদস্য",
        "বছরব্যাপী স্পন্সর হিসেবে",
      ],
    },
  ];

  const sponsorshipAreas = [
    {
      icon: <FaHeartbeat className="text-3xl text-red-500" />,
      title: "রক্তদান কার্যক্রম",
      description:
        "রক্তদান ক্যাম্পেইন, রক্ত সংগ্রহ, এবং রক্তদান কার্যক্রম স্পন্সর করুন",
    },
    {
      icon: <FaHandsHelping className="text-3xl text-blue-500" />,
      title: "মানবসেবা কার্যক্রম",
      description:
        "ত্রাণ বিতরণ, চিকিৎসার জন্য অর্থ সংগ্রহ, এবং মানবসেবা কার্যক্রম স্পন্সর করুন",
    },
    {
      icon: <FaUsers className="text-3xl text-green-500" />,
      title: "সামাজিক উন্নয়ন",
      description:
        "বৃক্ষরোপণ, সচেতনতামূলক কর্মসূচি, এবং সামাজিক উন্নয়ন কার্যক্রম স্পন্সর করুন",
    },
    {
      icon: <FaCalendarAlt className="text-3xl text-purple-500" />,
      title: "বিশেষ ইভেন্ট",
      description:
        "বিশেষ অনুষ্ঠান, সেমিনার, এবং বিভিন্ন ইভেন্ট স্পন্সর করুন",
    },
  ];

  const benefits = [
    {
      icon: <FaBullhorn className="text-3xl text-blue-500" />,
      title: "ব্র্যান্ড ভিজিবিলিটি",
      description:
        "আপনার ব্র্যান্ড বা প্রতিষ্ঠান বিভিন্ন ইভেন্ট এবং প্রচারমাধ্যমে প্রদর্শিত হবে",
    },
    {
      icon: <FaUsers className="text-3xl text-green-500" />,
      title: "কমিউনিটি এনগেজমেন্ট",
      description:
        "স্থানীয় কমিউনিটির সাথে সরাসরি যোগাযোগ এবং এনগেজমেন্টের সুযোগ",
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-500" />,
      title: "সামাজিক দায়বদ্ধতা",
      description:
        "CSR (Corporate Social Responsibility) পূরণ এবং সামাজিক দায়বদ্ধতা প্রদর্শন",
    },
    {
      icon: <FaAward className="text-3xl text-orange-500" />,
      title: "স্বীকৃতি",
      description:
        "সংগঠন এবং কমিউনিটির কাছ থেকে স্বীকৃতি এবং সম্মাননা",
    },
  ];

  const howToSponsor = [
    {
      step: "১",
      title: "স্পন্সরশিপ প্যাকেজ নির্বাচন করুন",
      description:
        "আপনার প্রতিষ্ঠান বা ব্যক্তিগত স্পন্সরশিপের জন্য উপযুক্ত প্যাকেজ নির্বাচন করুন।",
    },
    {
      step: "২",
      title: "স্পন্সরশিপ এরিয়া নির্ধারণ করুন",
      description:
        "কোন কার্যক্রম বা ইভেন্ট স্পন্সর করতে চান তা নির্ধারণ করুন।",
    },
    {
      step: "৩",
      title: "আমাদের সাথে যোগাযোগ করুন",
      description:
        "স্পন্সরশিপ সম্পর্কে বিস্তারিত আলোচনার জন্য আমাদের সাথে যোগাযোগ করুন।",
    },
    {
      step: "৪",
      title: "স্পন্সরশিপ চুক্তি সম্পাদন",
      description:
        "স্পন্সরশিপের শর্তাবলী নিয়ে আলোচনা এবং চুক্তি সম্পাদন করুন।",
    },
    {
      step: "৫",
      title: "স্পন্সরশিপ প্রদান",
      description:
        "চুক্তি অনুযায়ী স্পন্সরশিপ প্রদান করুন এবং আমাদের কার্যক্রমে অংশ নিন।",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaHandshake className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                স্পন্সর করুন
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                &ldquo;আমাদের সাথে অংশীদার হন, সমাজের উন্নয়নে অবদান রাখুন&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FaInfoCircle className="text-4xl text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">স্পন্সরশিপ সম্পর্কে</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">&ldquo;গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন&rdquo;</strong> একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সংগঠন। আমরা বিভিন্ন মানবসেবা কার্যক্রম, রক্তদান কার্যক্রম, এবং সামাজিক উন্নয়নমূলক কাজ পরিচালনা করি। আপনার স্পন্সরশিপ আমাদের এই কার্যক্রমগুলো সফলভাবে পরিচালনা করতে সাহায্য করবে।
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            স্পন্সরশিপ হল একটি পারস্পরিক উপকারী সম্পর্ক যেখানে আপনি আমাদের কার্যক্রমে আর্থিক সহায়তা প্রদান করবেন এবং আমরা আপনাকে বিভিন্ন সুবিধা এবং স্বীকৃতি প্রদান করব। এটি আপনার ব্র্যান্ড বা প্রতিষ্ঠানের জন্য একটি দুর্দান্ত CSR (Corporate Social Responsibility) সুযোগ।
          </p>
        </div>

        {/* Sponsorship Packages Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaGift className="text-purple-600" />
            স্পন্সরশিপ প্যাকেজ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipPackages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`bg-gradient-to-r ${pkg.color} p-6`}>
                  <div className="flex justify-center mb-4">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-white/90 text-center text-sm font-semibold">
                    {pkg.amount}
                  </p>
                </div>
                <div className={`${pkg.bgColor} p-6`}>
                  <ul className="space-y-3">
                    {pkg.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship Areas Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaHandsHelping className="text-green-600" />
            স্পন্সরশিপ এরিয়া
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipAreas.map((area, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{area.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {area.title}
                </h3>
                <p className="text-gray-700 text-sm text-center leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaAward className="text-orange-600" />
            স্পন্সরশিপের সুবিধা
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 text-sm text-center leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Sponsor Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaHandshake className="text-blue-600" />
            কীভাবে স্পন্সর করবেন
          </h2>
          <div className="space-y-6">
            {howToSponsor.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsor Form Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaFileAlt className="text-blue-600" />
            স্পন্সরশিপ ফর্ম
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন এ আপনাকে স্বাগতম, স্পন্সর করুন
              </h3>
              <p className="text-gray-600">
                স্পন্সরশিপ ফর্ম পূরণ করুন এবং আমাদের সাথে অংশীদার হন
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold text-green-800">
                    ধন্যবাদ! আপনার স্পন্সরশিপ ফর্ম সফলভাবে জমা দেওয়া হয়েছে।
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <FaInfoCircle className="text-red-600 text-2xl" />
                <p className="text-red-800">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Photo Upload */}
                <div>
                  <label
                    htmlFor="photo"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaImage className="inline mr-2 text-blue-600" />
                    ছবি নির্বাচন করুন <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      required
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <FaUpload className="text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        {fileName || "ফাইল নির্বাচন করুন"}
                      </span>
                    </label>
                  </div>
                  {fileName && (
                    <p className="mt-2 text-sm text-gray-600">
                      নির্বাচিত: {fileName}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaUser className="inline mr-2 text-red-600" />
                    নাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="নাম লিখুন"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaEnvelope className="inline mr-2 text-blue-600" />
                    ইমেইল <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="ইমেইল লিখুন"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaMobileAlt className="inline mr-2 text-green-600" />
                    মোবাইল <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="মোবাইল লিখুন"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaMapMarkerAlt className="inline mr-2 text-purple-600" />
                    ঠিকানা <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="ঠিকানা লিখুন"
                  />
                </div>

                {/* About Sponsor */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="aboutSponsor"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaInfoCircle className="inline mr-2 text-gray-600" />
                    স্পন্সর সম্পর্কে
                  </label>
                  <textarea
                    id="aboutSponsor"
                    name="aboutSponsor"
                    value={formData.aboutSponsor}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                    placeholder="স্পন্সর সম্পর্কে"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>জমা দেওয়া হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>সাবমিট করুন</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-600 text-center">
                <span className="text-red-600">*</span> চিহ্নিত ফিল্ডগুলো আবশ্যক
              </p>
            </form>
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg p-8 md:p-12 mb-8 text-white">
          <div className="text-center">
            <FaInfoCircle className="text-5xl mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">মহত্বপূর্ণ নোট</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-lg leading-relaxed">
              <p>
                • স্পন্সরশিপের শর্তাবলী আলোচনা সাপেক্ষে নির্ধারিত হবে
              </p>
              <p>
                • স্পন্সরশিপের জন্য লোগো, ব্যানার, এবং অন্যান্য উপকরণ সরবরাহ করতে হবে
              </p>
              <p>
                • স্পন্সরশিপের সুবিধা প্যাকেজ অনুযায়ী প্রদান করা হবে
              </p>
              <p>
                • স্পন্সরশিপ সম্পর্কে বিস্তারিত আলোচনার জন্য আমাদের সাথে যোগাযোগ করুন
              </p>
              <p>
                • আপনার স্পন্সরশিপ আমাদের কার্যক্রমে গুরুত্বপূর্ণ ভূমিকা রাখবে
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaPhone className="text-blue-600" />
            স্পন্সরশিপের জন্য যোগাযোগ করুন
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            স্পন্সরশিপ সম্পর্কে আরও তথ্য জানতে বা স্পন্সর করতে আমাদের সাথে যোগাযোগ করতে পারেন:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaPhone className="text-blue-600" />
                <h3 className="font-semibold text-gray-800">ফোন</h3>
              </div>
              <p className="text-gray-700">01XXX-XXXXXX</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaEnvelope className="text-green-600" />
                <h3 className="font-semibold text-gray-800">ইমেইল</h3>
              </div>
              <p className="text-gray-700">sponsor@gsrs.org</p>
            </div>
            <a
              href="https://bit.ly/2MD8v2T"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group"
            >
              <FaLink className="text-2xl text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                  ফেসবুক গ্রুপ
                </p>
                <p className="text-sm text-gray-600">https://bit.ly/2MD8v2T</p>
              </div>
            </a>
            <a
              href="https://www.facebook.com/gsrs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group"
            >
              <FaFacebook className="text-2xl text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                  ফেসবুক পেইজ
                </p>
                <p className="text-sm text-gray-600">https://www.facebook.com/gsrs</p>
              </div>
            </a>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FaDonate className="text-green-600" />
              <h3 className="font-semibold text-gray-800">সাধারণ দান করতে চান?</h3>
            </div>
            <p className="text-gray-700">
              যদি আপনি স্পন্সরশিপের পরিবর্তে সাধারণ দান করতে চান, তাহলে আমাদের <a href="/donate" className="text-red-600 hover:underline font-semibold">দান করুন</a> পেজে যান।
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

