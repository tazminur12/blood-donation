"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaChild,
  FaGraduationCap,
  FaHeartbeat,
  FaHome,
  FaUtensils,
  FaTshirt,
  FaBook,
  FaCheckCircle,
  FaInfoCircle,
  FaHandHoldingHeart,
  FaUsers,
  FaAward,
  FaChartLine,
  FaHeart,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaLink,
  FaDonate,
  FaUserFriends,
  FaSchool,
  FaStethoscope,
  FaGift,
  FaEnvelopeOpen,
  FaCamera,
  FaCalendarAlt,
  FaUser,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaPaperPlane,
  FaSpinner,
  FaUpload,
  FaImage,
  FaBaby,
} from "react-icons/fa";

export default function SponsorChildPage() {
  const [formData, setFormData] = useState({
    sponsorName: "",
    email: "",
    mobile: "",
    address: "",
    sponsorshipPackage: "",
    childName: "",
    childAge: "",
    childGender: "",
    childInfo: "",
    message: "",
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
        sponsorName: "",
        email: "",
        mobile: "",
        address: "",
        sponsorshipPackage: "",
        childName: "",
        childAge: "",
        childGender: "",
        childInfo: "",
        message: "",
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
      name: "মাসিক স্পন্সরশিপ",
      amount: "১,০০০ - ২,০০০ টাকা/মাস",
      icon: <FaHeart className="text-4xl text-red-500" />,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      benefits: [
        "শিশুর শিক্ষা খরচ",
        "স্বাস্থ্য সেবা",
        "খাদ্য ও পুষ্টি",
        "পোশাক ও অন্যান্য প্রয়োজনীয় সামগ্রী",
        "মাসিক রিপোর্ট",
        "শিশুর সাথে যোগাযোগ",
      ],
    },
    {
      name: "বার্ষিক স্পন্সরশিপ",
      amount: "১২,০০০ - ২৪,০০০ টাকা/বছর",
      icon: <FaGift className="text-4xl text-blue-500" />,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      benefits: [
        "মাসিক স্পন্সরশিপের সকল সুবিধা",
        "বছরের শুরুতে একবারে দান",
        "বিশেষ ছাড়",
        "বার্ষিক রিপোর্ট",
        "বিশেষ সম্মাননা",
        "শিশুর সাথে সরাসরি যোগাযোগ",
      ],
    },
    {
      name: "শিক্ষা স্পন্সরশিপ",
      amount: "৫,০০০ - ১০,০০০ টাকা/বছর",
      icon: <FaGraduationCap className="text-4xl text-green-500" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      benefits: [
        "স্কুল ফি",
        "কিতাব-খাতা",
        "ইউনিফর্ম",
        "শিক্ষা সামগ্রী",
        "পরীক্ষার ফি",
        "শিক্ষার অগ্রগতি রিপোর্ট",
      ],
    },
    {
      name: "স্বাস্থ্য স্পন্সরশিপ",
      amount: "৩,০০০ - ৫,০০০ টাকা/বছর",
      icon: <FaHeartbeat className="text-4xl text-pink-500" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      benefits: [
        "চিকিৎসা খরচ",
        "স্বাস্থ্য পরীক্ষা",
        "ঔষধ",
        "ভ্যাকসিন",
        "স্বাস্থ্য রিপোর্ট",
        "স্বাস্থ্য সচেতনতা",
      ],
    },
  ];

  const whatYouProvide = [
    {
      icon: <FaGraduationCap className="text-3xl text-blue-500" />,
      title: "শিক্ষা",
      description:
        "শিশুর শিক্ষা খরচ, স্কুল ফি, বই-খাতা, এবং শিক্ষা সামগ্রী প্রদান",
      items: [
        "স্কুল ফি",
        "বই-খাতা",
        "ইউনিফর্ম",
        "শিক্ষা সামগ্রী",
        "টিউশন ফি",
      ],
    },
    {
      icon: <FaHeartbeat className="text-3xl text-red-500" />,
      title: "স্বাস্থ্য",
      description:
        "শিশুর স্বাস্থ্য সেবা, চিকিৎসা, এবং স্বাস্থ্য পরীক্ষা প্রদান",
      items: [
        "চিকিৎসা খরচ",
        "স্বাস্থ্য পরীক্ষা",
        "ঔষধ",
        "ভ্যাকসিন",
        "স্বাস্থ্য সচেতনতা",
      ],
    },
    {
      icon: <FaUtensils className="text-3xl text-green-500" />,
      title: "খাদ্য ও পুষ্টি",
      description:
        "শিশুর জন্য পুষ্টিকর খাদ্য এবং পুষ্টি সংক্রান্ত সাহায্য প্রদান",
      items: [
        "পুষ্টিকর খাদ্য",
        "দুধ",
        "ফলমূল",
        "ভিটামিন",
        "পুষ্টি পরামর্শ",
      ],
    },
    {
      icon: <FaTshirt className="text-3xl text-purple-500" />,
      title: "পোশাক ও সামগ্রী",
      description:
        "শিশুর জন্য পোশাক, জুতা, এবং অন্যান্য প্রয়োজনীয় সামগ্রী প্রদান",
      items: [
        "পোশাক",
        "জুতা",
        "বিছানা",
        "ব্যক্তিগত সামগ্রী",
        "খেলনা",
      ],
    },
  ];

  const benefits = [
    {
      icon: <FaHeart className="text-3xl text-red-500" />,
      title: "একটি জীবন পরিবর্তন",
      description:
        "আপনার স্পন্সরশিপ একটি শিশুর জীবন পরিবর্তন করতে পারে এবং তাদের একটি সুন্দর ভবিষ্যৎ দিতে পারে",
    },
    {
      icon: <FaEnvelopeOpen className="text-3xl text-blue-500" />,
      title: "নিয়মিত আপডেট",
      description:
        "আপনি শিশুর অগ্রগতি সম্পর্কে নিয়মিত আপডেট এবং রিপোর্ট পাবেন",
    },
    {
      icon: <FaCamera className="text-3xl text-green-500" />,
      title: "ছবি ও ভিডিও",
      description:
        "শিশুর ছবি, ভিডিও, এবং তাদের জীবনের গুরুত্বপূর্ণ মুহূর্তগুলি দেখতে পাবেন",
    },
    {
      icon: <FaUserFriends className="text-3xl text-purple-500" />,
      title: "ব্যক্তিগত সম্পর্ক",
      description:
        "আপনি শিশুর সাথে সরাসরি যোগাযোগ করতে পারবেন এবং একটি ব্যক্তিগত সম্পর্ক গড়ে তুলতে পারবেন",
    },
  ];

  const process = [
    {
      step: "১",
      title: "স্পন্সরশিপ প্যাকেজ নির্বাচন করুন",
      description:
        "আপনার পছন্দসই স্পন্সরশিপ প্যাকেজ নির্বাচন করুন (মাসিক, বার্ষিক, শিক্ষা, বা স্বাস্থ্য)",
    },
    {
      step: "২",
      title: "শিশু নির্বাচন করুন",
      description:
        "আমাদের সাথে যোগাযোগ করে একটি শিশু নির্বাচন করুন বা আমাদের একটি শিশু বরাদ্দ করতে দিন",
    },
    {
      step: "৩",
      title: "স্পন্সরশিপ ফরম পূরণ করুন",
      description:
        "স্পন্সরশিপ ফরম পূরণ করুন এবং প্রয়োজনীয় তথ্য প্রদান করুন",
    },
    {
      step: "৪",
      title: "স্পন্সরশিপ প্রদান করুন",
      description:
        "নির্ধারিত পদ্ধতিতে স্পন্সরশিপ প্রদান করুন (ব্যাংক, মোবাইল পেমেন্ট, ইত্যাদি)",
    },
    {
      step: "৫",
      title: "শিশুর সাথে যোগাযোগ শুরু করুন",
      description:
        "স্পন্সরশিপ নিশ্চিত হওয়ার পর আপনি শিশুর সাথে যোগাযোগ করতে পারবেন এবং তাদের অগ্রগতি দেখতে পারবেন",
    },
  ];

  const impact = [
    {
      number: "১০০+",
      label: "স্পন্সর করা শিশু",
      icon: <FaChild className="text-4xl text-red-600" />,
    },
    {
      number: "৯৫%",
      label: "শিক্ষার অগ্রগতি",
      icon: <FaGraduationCap className="text-4xl text-blue-600" />,
    },
    {
      number: "১০০%",
      label: "স্বাস্থ্য সেবা",
      icon: <FaHeartbeat className="text-4xl text-green-600" />,
    },
    {
      number: "৫০+",
      label: "সক্রিয় স্পন্সর",
      icon: <FaUsers className="text-4xl text-purple-600" />,
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
              <FaChild className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Sponsor A Child
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                &ldquo;একটি শিশুর জীবন পরিবর্তন করুন, একটি সুন্দর ভবিষ্যৎ দিন&rdquo;
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
            <h2 className="text-3xl font-bold text-gray-800">শিশু স্পন্সরশিপ প্রোগ্রাম</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">&ldquo;গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন&rdquo;</strong> এর শিশু স্পন্সরশিপ প্রোগ্রাম হল একটি বিশেষ কার্যক্রম যেখানে আপনি একটি শিশুর শিক্ষা, স্বাস্থ্য, এবং উন্নয়নে সাহায্য করতে পারেন। আপনার স্পন্সরশিপ একটি শিশুর জীবন পরিবর্তন করতে পারে এবং তাদের একটি সুন্দর ভবিষ্যৎ দিতে পারে।
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            আমরা বিশ্বাস করি যে, প্রতিটি শিশুর শিক্ষা এবং স্বাস্থ্য পাওয়ার অধিকার আছে। আমাদের শিশু স্পন্সরশিপ প্রোগ্রামের মাধ্যমে আপনি একটি শিশুর শিক্ষা, স্বাস্থ্য, এবং সামগ্রিক উন্নয়নে সরাসরি অবদান রাখতে পারেন। আপনার স্পন্সরশিপ একটি শিশুর জীবনকে অর্থবহ করে তুলবে।
          </p>
        </div>

        {/* Impact Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaChartLine className="text-green-600" />
            আমাদের প্রভাব
          </h2>
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg p-8 md:p-12 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impact.map((item, index) => (
                <div
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors duration-300"
                >
                  <div className="flex justify-center mb-3 text-white">
                    {item.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {item.number}
                  </div>
                  <div className="text-sm md:text-base text-white/90">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  <h3 className="text-xl font-bold text-white text-center mb-2">
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

        {/* What You Provide Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaHandHoldingHeart className="text-red-600" />
            আপনি কী প্রদান করবেন
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {whatYouProvide.map((item, index) => (
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

        {/* Process Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaChild className="text-blue-600" />
            কীভাবে স্পন্সর করবেন
          </h2>
          <div className="space-y-6">
            {process.map((step, index) => (
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

        {/* Child Sponsorship Form Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaFileAlt className="text-blue-600" />
            শিশু স্পন্সরশিপ ফর্ম
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন - শিশু স্পন্সরশিপ
              </h3>
              <p className="text-gray-600">
                শিশু স্পন্সরশিপ ফর্ম পূরণ করুন এবং একটি শিশুর জীবন পরিবর্তন করুন
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold text-green-800">
                    ধন্যবাদ! আপনার শিশু স্পন্সরশিপ ফর্ম সফলভাবে জমা দেওয়া হয়েছে।
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব এবং একটি শিশু বরাদ্দ করব।
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
              {/* Sponsor Information Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  স্পন্সরের তথ্য
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Sponsor Name */}
                  <div>
                    <label
                      htmlFor="sponsorName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaUser className="inline mr-2 text-red-600" />
                      স্পন্সরের নাম <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="sponsorName"
                      name="sponsorName"
                      value={formData.sponsorName}
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

                  {/* Mobile */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaMobileAlt className="inline mr-2 text-green-600" />
                      মোবাইল নম্বর <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      placeholder="01XXX-XXXXXX"
                    />
                  </div>

                  {/* Address */}
                  <div>
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
                      placeholder="আপনার ঠিকানা লিখুন"
                    />
                  </div>
                </div>
              </div>

              {/* Sponsorship Package Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaGift className="text-purple-600" />
                  স্পন্সরশিপ প্যাকেজ
                </h4>
                <div>
                  <label
                    htmlFor="sponsorshipPackage"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaGift className="inline mr-2 text-orange-600" />
                    স্পন্সরশিপ প্যাকেজ নির্বাচন করুন <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="sponsorshipPackage"
                    name="sponsorshipPackage"
                    value={formData.sponsorshipPackage}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="monthly">মাসিক স্পন্সরশিপ (১,০০০ - ২,০০০ টাকা/মাস)</option>
                    <option value="annual">বার্ষিক স্পন্সরশিপ (১২,০০০ - ২৪,০০০ টাকা/বছর)</option>
                    <option value="education">শিক্ষা স্পন্সরশিপ (৫,০০০ - ১০,০০০ টাকা/বছর)</option>
                    <option value="health">স্বাস্থ্য স্পন্সরশিপ (৩,০০০ - ৫,০০০ টাকা/বছর)</option>
                  </select>
                </div>
              </div>

              {/* Child Information Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBaby className="text-pink-600" />
                  শিশুর তথ্য (ঐচ্ছিক)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  যদি আপনি একটি নির্দিষ্ট শিশু স্পন্সর করতে চান, তাহলে নিচের তথ্য পূরণ করুন। অন্যথায় আমরা আপনার জন্য একটি শিশু বরাদ্দ করব।
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Child Name */}
                  <div>
                    <label
                      htmlFor="childName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaChild className="inline mr-2 text-blue-600" />
                      শিশুর নাম
                    </label>
                    <input
                      type="text"
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      placeholder="শিশুর নাম (ঐচ্ছিক)"
                    />
                  </div>

                  {/* Child Age */}
                  <div>
                    <label
                      htmlFor="childAge"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaCalendarAlt className="inline mr-2 text-green-600" />
                      শিশুর বয়স
                    </label>
                    <input
                      type="number"
                      id="childAge"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleChange}
                      min="0"
                      max="18"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      placeholder="বয়স (ঐচ্ছিক)"
                    />
                  </div>

                  {/* Child Gender */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="childGender"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaChild className="inline mr-2 text-purple-600" />
                      শিশুর লিঙ্গ
                    </label>
                    <select
                      id="childGender"
                      name="childGender"
                      value={formData.childGender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    >
                      <option value="">নির্বাচন করুন (ঐচ্ছিক)</option>
                      <option value="male">ছেলে</option>
                      <option value="female">মেয়ে</option>
                      <option value="any">যেকোনো</option>
                    </select>
                  </div>

                  {/* Child Info */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="childInfo"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FaInfoCircle className="inline mr-2 text-gray-600" />
                      শিশু সম্পর্কে অতিরিক্ত তথ্য
                    </label>
                    <textarea
                      id="childInfo"
                      name="childInfo"
                      value={formData.childInfo}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                      placeholder="শিশু সম্পর্কে অতিরিক্ত তথ্য (ঐচ্ছিক)"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload and Message Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Photo Upload */}
                <div>
                  <label
                    htmlFor="photo"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    <FaImage className="inline mr-2 text-blue-600" />
                    ছবি (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
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

                {/* Message */}
                <div>
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
              <div className="flex justify-center pt-4">
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
                • স্পন্সরশিপ সম্পূর্ণ স্বচ্ছতার সাথে পরিচালিত হবে
              </p>
              <p>
                • শিশুর অগ্রগতি সম্পর্কে নিয়মিত রিপোর্ট প্রদান করা হবে
              </p>
              <p>
                • আপনি শিশুর সাথে সরাসরি যোগাযোগ করতে পারবেন
              </p>
              <p>
                • স্পন্সরশিপ যে কোনো সময় বন্ধ করা যাবে
              </p>
              <p>
                • আপনার স্পন্সরশিপ একটি শিশুর জীবন পরিবর্তন করবে
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
            শিশু স্পন্সরশিপ সম্পর্কে আরও তথ্য জানতে বা স্পন্সর করতে আমাদের সাথে যোগাযোগ করতে পারেন:
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
              <h3 className="font-semibold text-gray-800">অন্যান্য দান</h3>
            </div>
            <p className="text-gray-700">
              যদি আপনি শিশু স্পন্সরশিপের পরিবর্তে সাধারণ দান বা ইভেন্ট স্পন্সরশিপ করতে চান, তাহলে আমাদের <a href="/donate" className="text-red-600 hover:underline font-semibold">দান করুন</a> বা <a href="/donate/sponsor" className="text-red-600 hover:underline font-semibold">স্পন্সর করুন</a> পেজে যান।
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

