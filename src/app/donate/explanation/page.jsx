"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaInfoCircle,
  FaHandHoldingHeart,
  FaHeartbeat,
  FaUsers,
  FaHospital,
  FaHandsHelping,
  FaTree,
  FaBox,
  FaAward,
  FaCheckCircle,
  FaLightbulb,
  FaShieldAlt,
  FaChartLine,
  FaQuestionCircle,
  FaDonate,
  FaMobileAlt,
  FaBuilding,
  FaFacebook,
  FaLink,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaCalendarAlt,
  FaFileAlt,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

export default function DonationExplanationPage() {
  const [formData, setFormData] = useState({
    donorName: "",
    email: "",
    phone: "",
    amount: "",
    paymentMethod: "",
    transactionId: "",
    donationDate: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        donorName: "",
        email: "",
        phone: "",
        amount: "",
        paymentMethod: "",
        transactionId: "",
        donationDate: "",
        message: "",
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError("ফর্ম জমা দেওয়ার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };
  const whyDonate = [
    {
      icon: <FaHeartbeat className="text-4xl text-red-600" />,
      title: "মানবসেবা",
      description:
        "আপনার দান অসহায় মানুষের জীবন বাঁচাতে এবং তাদের সাহায্য করতে গুরুত্বপূর্ণ ভূমিকা রাখবে।",
    },
    {
      icon: <FaHandsHelping className="text-4xl text-blue-600" />,
      title: "সমাজের উন্নয়ন",
      description:
        "দান সমাজের উন্নয়নে অবদান রাখে এবং একটি সুস্থ ও মানবিক সমাজ গঠনে সহায়তা করে।",
    },
    {
      icon: <FaUsers className="text-4xl text-green-600" />,
      title: "সামাজিক দায়বদ্ধতা",
      description:
        "দান আমাদের সামাজিক দায়বদ্ধতা পূরণ করে এবং সমাজে ইতিবাচক পরিবর্তন আনে।",
    },
    {
      icon: <FaAward className="text-4xl text-purple-600" />,
      title: "আধ্যাত্মিক সন্তুষ্টি",
      description:
        "দান আধ্যাত্মিক সন্তুষ্টি দেয় এবং একটি সুন্দর সমাজ গঠনে আপনাকে অংশীদার করে তোলে।",
    },
  ];

  const whereUsed = [
    {
      icon: <FaHospital className="text-3xl text-red-500" />,
      title: "রক্তদান কার্যক্রম",
      description:
        "রক্তদান কার্যক্রম পরিচালনা, রক্ত সংগ্রহ, এবং জরুরী পরিস্থিতিতে রক্ত সরবরাহ",
      items: [
        "রক্তদাতাদের নেটওয়ার্ক তৈরি",
        "জরুরী রক্ত সরবরাহ",
        "রক্তদান ক্যাম্পেইন",
        "রক্তের গ্রুপ নির্ণয়",
      ],
    },
    {
      icon: <FaHandsHelping className="text-3xl text-blue-500" />,
      title: "মানবসেবা",
      description:
        "অসহায় মানুষের জন্য ত্রাণ বিতরণ, চিকিৎসার জন্য অর্থ সংগ্রহ, এবং সামাজিক উন্নয়ন",
      items: [
        "ত্রাণ বিতরণ",
        "চিকিৎসার জন্য অর্থ সংগ্রহ",
        "শিক্ষার্থীদের সহায়তা",
        "দুর্যোগকালীন সাহায্য",
      ],
    },
    {
      icon: <FaTree className="text-3xl text-green-500" />,
      title: "সামাজিক উন্নয়ন",
      description:
        "পরিবেশ সুরক্ষা, বৃক্ষরোপণ, সচেতনতামূলক কর্মসূচি, এবং বিভিন্ন সামাজিক কার্যক্রম",
      items: [
        "বৃক্ষরোপণ কর্মসূচি",
        "পরিবেশ সুরক্ষা",
        "সচেতনতামূলক কর্মসূচি",
        "মাদকবিরোধী প্রচারাভিযান",
      ],
    },
    {
      icon: <FaBox className="text-3xl text-orange-500" />,
      title: "সংগঠন পরিচালনা",
      description:
        "সংগঠনের কার্যক্রম পরিচালনা, সভা আয়োজন, এবং বিভিন্ন কর্মসূচি বাস্তবায়ন",
      items: [
        "সভা আয়োজন",
        "কার্যক্রম পরিচালনা",
        "সদস্য বৃদ্ধি",
        "প্রশিক্ষণ কর্মসূচি",
      ],
    },
  ];

  const donationProcess = [
    {
      step: "১",
      title: "দান করার সিদ্ধান্ত নিন",
      description:
        "আপনার হৃদয় থেকে দান করার সিদ্ধান্ত নিন এবং আমাদের কার্যক্রম সম্পর্কে জানুন।",
    },
    {
      step: "২",
      title: "দানের পরিমাণ নির্ধারণ করুন",
      description:
        "আপনার সামর্থ্য অনুযায়ী দানের পরিমাণ নির্ধারণ করুন। যেকোনো পরিমাণ দান গুরুত্বপূর্ণ।",
    },
    {
      step: "৩",
      title: "দানের মাধ্যম নির্বাচন করুন",
      description:
        "ব্যাংক একাউন্ট, bKash, Nagad, বা Rocket এর মাধ্যমে দান করতে পারেন।",
    },
    {
      step: "৪",
      title: "দান করুন",
      description:
        "নির্বাচিত মাধ্যমে দান করুন এবং Transaction ID বা Reference Number সংরক্ষণ করুন।",
    },
    {
      step: "৫",
      title: "যোগাযোগ করুন",
      description:
        "দান করার পর আমাদের সাথে যোগাযোগ করুন যাতে আমরা আপনার দান নিশ্চিত করতে পারি।",
    },
  ];

  const benefits = [
    {
      icon: <FaCheckCircle className="text-3xl text-green-500" />,
      title: "স্বচ্ছতা",
      description:
        "আমাদের সকল কার্যক্রম সম্পূর্ণ স্বচ্ছতার সাথে পরিচালিত হয় এবং দানের ব্যবহার নিয়মিত প্রকাশ করা হয়।",
    },
    {
      icon: <FaShieldAlt className="text-3xl text-blue-500" />,
      title: "নিরাপত্তা",
      description:
        "আপনার দান সম্পূর্ণ নিরাপদ এবং আমাদের সংগঠনের মাধ্যমে সঠিকভাবে ব্যবহার করা হবে।",
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-500" />,
      title: "প্রভাব",
      description:
        "আপনার দান সরাসরি মানবসেবা এবং সামাজিক উন্নয়নে প্রভাব ফেলবে।",
    },
    {
      icon: <FaAward className="text-3xl text-orange-500" />,
      title: "স্বীকৃতি",
      description:
        "আপনার দানের জন্য আমাদের কাছ থেকে স্বীকৃতি এবং রশিদ প্রদান করা হবে।",
    },
  ];

  const faqs = [
    {
      question: "দান করার জন্য ন্যূনতম পরিমাণ কত?",
      answer:
        "দান করার জন্য কোনো ন্যূনতম পরিমাণ নেই। আপনি আপনার সামর্থ্য অনুযায়ী যেকোনো পরিমাণ দান করতে পারেন। প্রতিটি দানই আমাদের কাছে গুরুত্বপূর্ণ।",
    },
    {
      question: "দান কীভাবে ব্যবহার হবে?",
      answer:
        "আপনার দান রক্তদান কার্যক্রম, মানবসেবা, সামাজিক উন্নয়ন, এবং সংগঠনের কার্যক্রম পরিচালনায় ব্যবহার করা হবে। আমরা সম্পূর্ণ স্বচ্ছতার সাথে দানের ব্যবহার প্রকাশ করি।",
    },
    {
      question: "দানের জন্য রশিদ পাবেন কি?",
      answer:
        "হ্যাঁ, আপনি দানের জন্য রশিদ পাবেন। দান করার পর আমাদের সাথে যোগাযোগ করুন এবং আমরা আপনাকে রশিদ প্রদান করব।",
    },
    {
      question: "দান করলে ট্যাক্স সুবিধা পাওয়া যাবে?",
      answer:
        "হ্যাঁ, আমাদের সংগঠনের মাধ্যমে দান করলে ট্যাক্স সুবিধা পাওয়া যেতে পারে। রশিদ প্রদানের মাধ্যমে আপনি এই সুবিধা পেতে পারেন।",
    },
    {
      question: "দান কি গোপন রাখা যাবে?",
      answer:
        "হ্যাঁ, আপনি যদি চান তবে আপনার দান গোপন রাখা যাবে। আমরা আপনার গোপনীয়তা রক্ষা করব।",
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
              <FaInfoCircle className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                দানের ব্যাখ্যা
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                &ldquo;দান সম্পর্কে জানুন, মানবসেবায় অংশ নিন&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FaHandHoldingHeart className="text-4xl text-red-600" />
            <h2 className="text-3xl font-bold text-gray-800">দান সম্পর্কে</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">&ldquo;গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন&rdquo;</strong> একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সংগঠন। আমাদের সংগঠন মানবসেবা, রক্তদান কার্যক্রম, এবং সামাজিক উন্নয়নের মাধ্যমে সমাজের উন্নয়নে অবদান রাখছে। আপনার দান আমাদের এই কার্যক্রমগুলো পরিচালনা করতে সাহায্য করবে।
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            দান হল মানবসেবার একটি গুরুত্বপূর্ণ অংশ এবং এটি সমাজের উন্নয়নে অবদান রাখে। আমরা বিশ্বাস করি যে, একত্রে কাজ করার মাধ্যমে আমরা একটি সুস্থ, উন্নত ও মানবিক সমাজ গঠন করতে পারব।
          </p>
        </div>

        {/* Why Donate Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaLightbulb className="text-yellow-600" />
            কেন দান করবেন
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyDonate.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm text-center leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Where Used Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaChartLine className="text-green-600" />
            দান কোথায় ব্যবহার হবে
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {whereUsed.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  {item.icon}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {item.items.map((listItem, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{listItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Process Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaDonate className="text-blue-600" />
            দান করার প্রক্রিয়া
          </h2>
          <div className="space-y-6">
            {donationProcess.map((step, index) => (
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

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaAward className="text-purple-600" />
            দানের সুবিধা
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

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaQuestionCircle className="text-orange-600" />
            প্রায়শই জিজ্ঞাসিত প্রশ্ন
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <FaQuestionCircle className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Approval Form Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaFileAlt className="text-blue-600" />
            দান অনুমোদন ফর্ম
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold text-green-800">
                    ধন্যবাদ! আপনার দানের তথ্য সফলভাবে জমা দেওয়া হয়েছে।
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
                {/* Donor Name */}
                <div>
                  <label
                    htmlFor="donorName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaUser className="inline mr-2 text-red-600" />
                    দাতার নাম <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="donorName"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="আপনার নাম লিখুন"
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
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaPhone className="inline mr-2 text-green-600" />
                    মোবাইল নম্বর <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="01XXX-XXXXXX"
                  />
                </div>

                {/* Donation Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaCreditCard className="inline mr-2 text-purple-600" />
                    দানের পরিমাণ (টাকা) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="১০০০"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaMobileAlt className="inline mr-2 text-orange-600" />
                    দানের মাধ্যম <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="bank">ব্যাংক একাউন্ট</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div>
                  <label
                    htmlFor="transactionId"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaFileAlt className="inline mr-2 text-indigo-600" />
                    Transaction ID/Reference Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="Transaction ID বা Reference Number"
                  />
                </div>

                {/* Donation Date */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="donationDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaCalendarAlt className="inline mr-2 text-pink-600" />
                    দানের তারিখ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    id="donationDate"
                    name="donationDate"
                    value={formData.donationDate}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaInfoCircle className="inline mr-2 text-gray-600" />
                    বার্তা (ঐচ্ছিক)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                    placeholder="আপনার বার্তা বা মন্তব্য লিখুন..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>জমা দেওয়া হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>দান অনুমোদন ফর্ম জমা দিন</span>
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
                • আপনার দান সম্পূর্ণ স্বচ্ছতার সাথে ব্যবহার করা হবে
              </p>
              <p>
                • দানের রিপোর্ট নিয়মিত প্রকাশ করা হবে
              </p>
              <p>
                • দান করার পর Transaction ID সংরক্ষণ করুন
              </p>
              <p>
                • দান নিশ্চিত করতে উপরের ফর্মটি পূরণ করুন
              </p>
              <p>
                • আপনার দান মানবসেবা এবং সামাজিক উন্নয়নে গুরুত্বপূর্ণ ভূমিকা রাখবে
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaHandHoldingHeart className="text-red-600" />
            আরও তথ্যের জন্য যোগাযোগ করুন
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            দান সম্পর্কে আরও তথ্য জানতে বা দান করতে আমাদের সাথে যোগাযোগ করতে পারেন:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
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
              <h3 className="font-semibold text-gray-800">দান করতে চান?</h3>
            </div>
            <p className="text-gray-700 mb-4">
              দান করতে চাইলে আমাদের <a href="/donate" className="text-red-600 hover:underline font-semibold">দান করুন</a> পেজে যান এবং আপনার পছন্দের মাধ্যম নির্বাচন করুন।
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

