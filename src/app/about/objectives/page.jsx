"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaBullseye,
  FaTint,
  FaHandsHelping,
  FaBan,
  FaHeartbeat,
  FaUsers,
  FaAward,
  FaChartLine,
  FaLightbulb,
  FaEye,
  FaRocket,
  FaCheckCircle,
  FaHospital,
  FaTree,
  FaHandHoldingHeart,
  FaShieldVirus,
  FaBox,
  FaInfoCircle,
  FaFacebook,
  FaLink,
} from "react-icons/fa";

export default function ObjectivesPage() {
  const mainObjectives = [
    {
      icon: <FaTint className="text-5xl text-red-600" />,
      title: "মুমূর্ষু রোগীর জীবন বাঁচাতে বিনামূল্যে রক্তদান",
      description: "জরুরী পরিস্থিতিতে রোগীদের জন্য রক্ত সরবরাহ নিশ্চিত করা",
      details: [
        "জরুরী রক্তের প্রয়োজনে ২৪/৭ সেবা প্রদান",
        "রক্তদাতাদের একটি সুসংগঠিত নেটওয়ার্ক তৈরি",
        "রক্তের গ্রুপ ভিত্তিক দ্রুত ম্যাচিং সিস্টেম",
        "বিনামূল্যে রক্ত সরবরাহ নিশ্চিত করা",
        "রক্তদানে মানুষদের উৎসাহিত করা",
      ],
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
    },
    {
      icon: <FaHandsHelping className="text-5xl text-blue-600" />,
      title: "অসহায়, ছিন্নমূল মানুষের পাশে দাঁড়ানো",
      description: "সমাজের অসহায় মানুষের পাশে থেকে সহায়তা প্রদান",
      details: [
        "অসহায় মানুষের জন্য ত্রাণ বিতরণ",
        "চিকিৎসার জন্য অর্থ সংগ্রহ",
        "শিক্ষার্থীদের সহায়তা প্রদান",
        "দুর্যোগকালীন সময়ে সাহায্যের হাত বাড়ানো",
        "সামাজিক নিরাপত্তা নিশ্চিত করা",
      ],
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <FaBan className="text-5xl text-green-600" />,
      title: "মাদকমুক্ত সমাজ বিনির্মানে আমরা সর্বদাই বদ্ধপরিকর",
      description: "মাদকমুক্ত সমাজ গঠনে সচেতনতামূলক কার্যক্রম পরিচালনা",
      details: [
        "যুবসমাজকে মাদক থেকে দূরে রাখা",
        "সচেতনতামূলক কর্মসূচি পরিচালনা",
        "শিক্ষা প্রতিষ্ঠানে সচেতনতা সৃষ্টি",
        "মাদকবিরোধী প্রচারাভিযান",
        "সুস্থ জীবনযাপনে উৎসাহিত করা",
      ],
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
  ];

  const goals = [
    {
      icon: <FaUsers className="text-3xl text-purple-600" />,
      title: "সদস্য বৃদ্ধি",
      description: "সংগঠনের সদস্য সংখ্যা বৃদ্ধি করে আরও বেশি মানুষকে রক্তদানে উৎসাহিত করা",
      target: "১০,০০০+ সদস্য",
    },
    {
      icon: <FaHeartbeat className="text-3xl text-red-600" />,
      title: "রক্তদান বৃদ্ধি",
      description: "বার্ষিক রক্তদান সংখ্যা বৃদ্ধি করে রক্তের চাহিদা পূরণ করা",
      target: "১০,০০০+ রক্তদান/বছর",
    },
    {
      icon: <FaHospital className="text-3xl text-blue-600" />,
      title: "স্বাস্থ্য সেবা",
      description: "বিনামূল্যে রক্তের গ্রুপ নির্ণয় ক্যাম্পেইন পরিচালনা",
      target: "৫,০০০+ মানুষ/বছর",
    },
    {
      icon: <FaHandHoldingHeart className="text-3xl text-pink-600" />,
      title: "মানবসেবা",
      description: "অসহায় মানুষের পাশে দাঁড়িয়ে সামাজিক উন্নয়নে অবদান রাখা",
      target: "৫০+ মানবসেবা কার্যক্রম/বছর",
    },
    {
      icon: <FaTree className="text-3xl text-green-600" />,
      title: "পরিবেশ সুরক্ষা",
      description: "পরিবেশ সুরক্ষা ও বৃক্ষরোপণ কর্মসূচি পরিচালনা",
      target: "১,০০০+ গাছ/বছর",
    },
    {
      icon: <FaAward className="text-3xl text-amber-600" />,
      title: "স্বীকৃতি",
      description: "সংগঠনের কাজের জন্য জাতীয় ও আন্তর্জাতিক স্বীকৃতি অর্জন",
      target: "উল্লেখযোগ্য স্বীকৃতি",
    },
  ];

  const visionMission = [
    {
      icon: <FaEye className="text-4xl text-indigo-600" />,
      title: "ভিশন",
      description:
        "আমাদের ভিশন হল একটি সুস্থ, উন্নত ও মানবিক সমাজ গঠন যেখানে প্রতিটি মানুষের কাছে প্রয়োজনীয় রক্ত সহজলভ্য হবে এবং সমাজের প্রতিটি স্তরে মানবসেবা পৌঁছানো হবে।",
      points: [
        "একটি রক্তদান সচেতন সমাজ গঠন",
        "মানবসেবায় আস্থা ও বিশ্বাস সৃষ্টি",
        "সামাজিক দায়বদ্ধতা বৃদ্ধি",
        "যুবসমাজের মধ্যে স্বেচ্ছাসেবার মনোভাব তৈরি",
        "একটি মাদকমুক্ত সুস্থ সমাজ",
      ],
    },
    {
      icon: <FaRocket className="text-4xl text-orange-600" />,
      title: "মিশন",
      description:
        "আমাদের মিশন হল মানবসেবা ও রক্তদানের মাধ্যমে সমাজের উন্নয়নে অবদান রাখা, অসহায় মানুষের পাশে দাঁড়ানো এবং একটি সুস্থ, উন্নত ও মানবিক সমাজ গঠন করা।",
      points: [
        "জরুরী রক্তের প্রয়োজনে ২৪/৭ সেবা প্রদান",
        "রক্তদানে মানুষদের উৎসাহিত করা",
        "সামাজিক উন্নয়নমূলক কাজে অংশগ্রহণ",
        "মানবসেবা কার্যক্রম পরিচালনা",
        "সচেতনতামূলক কর্মসূচি পরিচালনা",
      ],
    },
  ];

  const howWeAchieve = [
    {
      icon: <FaUsers className="text-3xl text-blue-500" />,
      title: "সদস্য নেটওয়ার্ক",
      description:
        "একটি শক্তিশালী সদস্য নেটওয়ার্ক তৈরি করে রক্তদান কার্যক্রম পরিচালনা",
    },
    {
      icon: <FaChartLine className="text-3xl text-green-500" />,
      title: "ডিজিটাল প্ল্যাটফর্ম",
      description:
        "আধুনিক ডিজিটাল প্ল্যাটফর্ম ব্যবহার করে রক্তদান প্রক্রিয়া সহজ ও দ্রুত করা",
    },
    {
      icon: <FaHandsHelping className="text-3xl text-red-500" />,
      title: "স্বেচ্ছাসেবী কাজ",
      description:
        "স্বেচ্ছাসেবীদের মাধ্যমে মানবসেবা ও সামাজিক উন্নয়নমূলক কাজ পরিচালনা",
    },
    {
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      title: "সচেতনতা সৃষ্টি",
      description:
        "সচেতনতামূলক কর্মসূচি পরিচালনা করে মানুষদের মধ্যে রক্তদান ও মানবসেবায় আগ্রহ সৃষ্টি",
    },
    {
      icon: <FaHospital className="text-3xl text-purple-500" />,
      title: "স্বাস্থ্য ক্যাম্প",
      description:
        "বিনামূল্যে রক্তের গ্রুপ নির্ণয় ক্যাম্প এবং স্বাস্থ্য সচেতনতামূলক কর্মসূচি পরিচালনা",
    },
    {
      icon: <FaAward className="text-3xl text-orange-500" />,
      title: "মানবসেবা",
      description:
        "অসহায় মানুষের পাশে দাঁড়িয়ে ত্রাণ বিতরণ, চিকিৎসার জন্য অর্থ সংগ্রহ সহ বিভিন্ন মানবসেবা কার্যক্রম",
    },
  ];

  const achievements = [
    {
      number: "৫,০০০+",
      label: "রক্তদান সম্পন্ন",
      icon: <FaTint className="text-4xl text-red-600" />,
    },
    {
      number: "৩,০০০+",
      label: "রক্তের গ্রুপ নির্ণয়",
      icon: <FaHospital className="text-4xl text-blue-600" />,
    },
    {
      number: "৫০+",
      label: "মানবসেবা কার্যক্রম",
      icon: <FaHandHoldingHeart className="text-4xl text-pink-600" />,
    },
    {
      number: "২ বছর ৬ মাস",
      label: "সফল কার্যক্রম",
      icon: <FaAward className="text-4xl text-green-600" />,
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
              <FaBullseye className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                লক্ষ ও উদ্দেশ্য
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                &ldquo;মানবসেবা ও রক্তদানের মাধ্যমে সমাজের উন্নয়নে অবদান রাখা&rdquo;
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
            <h2 className="text-3xl font-bold text-gray-800">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">&ldquo;গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন&rdquo;</strong> একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সংগঠন। আমাদের মূল লক্ষ্য হল মানবসেবা এবং রক্তদানের মাধ্যমে সমাজের উন্নয়নে অবদান রাখা। আমরা বিশ্বাস করি যে, একত্রে কাজ করার মাধ্যমে আমরা একটি সুস্থ, উন্নত ও মানবিক সমাজ গঠন করতে পারব।
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            আমাদের সংগঠন শুরুর দিকে গোবিন্দগঞ্জবাসীর রক্তের প্রয়োজনে রক্ত সরবরাহ, বিনামূল্যে রক্তের গ্রুপ নির্ণয় এবং রক্তদানে মানুষদের উৎসাহিত করলেও বর্তমানে বিভিন্ন সামাজিক উন্নয়নমূলক কর্মকাণ্ডে সম্পৃক্ত হয়েছে। আমরা অসহায় মানুষের পাশে দাঁড়িয়ে তাদের সাহায্য করি এবং একটি মাদকমুক্ত সুস্থ সমাজ গঠনের জন্য কাজ করি।
          </p>
        </div>

        {/* Main Objectives Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaBullseye className="text-red-600" />
            আমাদের মূল উদ্দেশ্যসমূহ
          </h2>
          <div className="space-y-8">
            {mainObjectives.map((objective, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
              >
                <div className={`bg-gradient-to-r ${objective.color} p-6`}>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">{objective.icon}</div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {objective.title}
                      </h3>
                      <p className="text-lg text-white/90">{objective.description}</p>
                    </div>
                  </div>
                </div>
                <div className={`${objective.bgColor} p-6`}>
                  <ul className="space-y-3">
                    {objective.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaEye className="text-indigo-600" />
            ভিশন ও মিশন
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {visionMission.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-center">
                  {item.description}
                </p>
                <ul className="space-y-2">
                  {item.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaRocket className="text-orange-600" />
            আমাদের লক্ষ্যসমূহ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">{goal.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {goal.title}
                </h3>
                <p className="text-gray-700 text-sm mb-4 text-center leading-relaxed">
                  {goal.description}
                </p>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold">
                    {goal.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How We Achieve Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaLightbulb className="text-yellow-600" />
            কীভাবে আমরা আমাদের লক্ষ্য অর্জন করি
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howWeAchieve.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm text-center leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaAward className="text-green-600" />
            আমাদের সাফল্য
          </h2>
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg p-8 md:p-12 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors duration-300"
                >
                  <div className="flex justify-center mb-3 text-white">
                    {achievement.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-sm md:text-base text-white/90">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-xl md:text-2xl leading-relaxed">
                আল্লাহর অশেষ কৃপায় আমরা গত <strong className="text-yellow-300">২ বছর ৬ মাস</strong> অত্র সংগঠনের মাধ্যমে প্রায়{" "}
                <strong className="text-yellow-300">৫ হাজারের অধিক</strong> মানুষকে রক্ত সংগ্রহ করে দিতে সক্ষম হয়েছি।
              </p>
            </div>
          </div>
        </div>

        {/* Future Plans Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaRocket className="text-purple-600" />
            ভবিষ্যৎ পরিকল্পনা
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">স্বল্পমেয়াদী পরিকল্পনা</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <span className="text-gray-700">রক্তদাতা নেটওয়ার্ক সম্প্রসারণ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <span className="text-gray-700">ডিজিটাল প্ল্যাটফর্ম উন্নয়ন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <span className="text-gray-700">নিয়মিত রক্তদান ক্যাম্পেইন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <span className="text-gray-700">সচেতনতামূলক কর্মসূচি বৃদ্ধি</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">দীর্ঘমেয়াদী পরিকল্পনা</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-blue-500 mt-1" />
                    <span className="text-gray-700">রক্তব্যাংক প্রতিষ্ঠা</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-blue-500 mt-1" />
                    <span className="text-gray-700">আঞ্চলিক পর্যায়ে সম্প্রসারণ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-blue-500 mt-1" />
                    <span className="text-gray-700">আন্তর্জাতিক স্বীকৃতি অর্জন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-blue-500 mt-1" />
                    <span className="text-gray-700">টেকসই উন্নয়ন লক্ষ্য অর্জন</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaInfoCircle className="text-blue-600" />
            আমাদের সাথে যুক্ত থাকুন
          </h2>
          <div className="space-y-4">
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
        </div>
      </div>

      <Footer />
    </div>
  );
}

