"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaGavel,
  FaUsers,
  FaHeartbeat,
  FaHandsHelping,
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt,
  FaUserShield,
  FaFileAlt,
  FaAward,
  FaBell,
  FaUserCheck,
} from "react-icons/fa";

export default function RulesPage() {
  const generalRules = [
    {
      icon: <FaUsers className="text-3xl text-blue-600" />,
      title: "সদস্যপদ",
      rules: [
        "সংগঠনের সদস্য হতে হলে ১৮ বছরের উর্ধ্বে হতে হবে",
        "সদস্য হতে হলে ন্যূনতম SSC পাস হতে হবে",
        "রক্তদানে আগ্রহী এবং স্বেচ্ছাসেবী হতে হবে",
        "সংগঠনের সকল নিয়ম-কানুন মেনে চলতে হবে",
        "নিয়মিত সভায় উপস্থিত থাকতে হবে",
      ],
    },
    {
      icon: <FaHeartbeat className="text-3xl text-red-600" />,
      title: "রক্তদান সংক্রান্ত",
      rules: [
        "রক্তদাতাকে অবশ্যই সুস্থ হতে হবে",
        "রক্তদানের আগে প্রয়োজনীয় স্বাস্থ্য পরীক্ষা করতে হবে",
        "রক্তদান ৩ মাস পরপর করা যাবে",
        "রক্তদানের সময় সঠিক তথ্য প্রদান করতে হবে",
        "রক্তদানের পর নির্দেশিত সময় বিশ্রাম নিতে হবে",
      ],
    },
    {
      icon: <FaHandsHelping className="text-3xl text-green-600" />,
      title: "স্বেচ্ছাসেবী কাজ",
      rules: [
        "সংগঠনের সকল কার্যক্রমে অংশগ্রহণ করতে হবে",
        "অসহায় মানুষের পাশে দাঁড়াতে হবে",
        "সামাজিক উন্নয়নমূলক কাজে অংশগ্রহণ করতে হবে",
        "সংগঠনের সুনাম বজায় রাখতে হবে",
        "একসাথে কাজ করার মনোভাব থাকতে হবে",
      ],
    },
  ];

  const codeOfConduct = [
    {
      icon: <FaBan className="text-2xl text-red-500" />,
      title: "নিষিদ্ধ কাজসমূহ",
      items: [
        "রাজনৈতিক কর্মকাণ্ডে জড়িত হওয়া",
        "ধূমপান ও মাদক সেবন",
        "অনৈতিক কাজে লিপ্ত হওয়া",
        "সংগঠনের বিরুদ্ধে কোনো কাজ করা",
        "অন্যের সাথে দুর্ব্যবহার করা",
        "সংগঠনের তথ্য অবৈধভাবে প্রকাশ করা",
      ],
    },
    {
      icon: <FaCheckCircle className="text-2xl text-green-500" />,
      title: "অনুমোদিত কাজসমূহ",
      items: [
        "রক্তদান কার্যক্রমে অংশগ্রহণ",
        "সামাজিক উন্নয়নমূলক কাজ",
        "মানবসেবা মূলক কার্যক্রম",
        "সচেতনতামূলক কর্মসূচি",
        "অসহায় মানুষের সাহায্য",
        "সংগঠনের উন্নয়নমূলক কাজ",
      ],
    },
  ];

  const responsibilities = [
    {
      icon: <FaUserShield className="text-3xl text-purple-600" />,
      title: "সদস্যদের দায়িত্ব",
      points: [
        "সংগঠনের নিয়ম-কানুন মেনে চলা",
        "নিয়মিত সভায় উপস্থিত থাকা",
        "রক্তদান কার্যক্রমে অংশগ্রহণ করা",
        "সংগঠনের সুনাম বজায় রাখা",
        "অন্যান্য সদস্যদের সহায়তা করা",
        "সংগঠনের উন্নয়নে ভূমিকা রাখা",
      ],
    },
    {
      icon: <FaShieldAlt className="text-3xl text-indigo-600" />,
      title: "নির্বাহী কমিটির দায়িত্ব",
      points: [
        "সংগঠনের কার্যক্রম পরিচালনা করা",
        "সদস্যদের সাথে নিয়মিত যোগাযোগ রাখা",
        "রক্তদান কার্যক্রম সুসংগঠিত করা",
        "অর্থ ব্যবস্থাপনা নিয়ন্ত্রণ করা",
        "সংগঠনের উন্নয়ন পরিকল্পনা করা",
        "সভা আহ্বান ও পরিচালনা করা",
      ],
    },
  ];

  const disciplinaryActions = [
    {
      icon: <FaExclamationTriangle className="text-2xl text-yellow-500" />,
      title: "সতর্কতা",
      description: "প্রথমবার নিয়ম ভঙ্গ করলে লিখিত সতর্কতা প্রদান",
    },
    {
      icon: <FaBell className="text-2xl text-orange-500" />,
      title: "সাময়িক স্থগিত",
      description: "বারবার নিয়ম ভঙ্গ করলে ৩-৬ মাসের জন্য সদস্যপদ স্থগিত",
    },
    {
      icon: <FaBan className="text-2xl text-red-500" />,
      title: "সদস্যপদ বাতিল",
      description: "গুরুতর নিয়ম ভঙ্গ করলে স্থায়ীভাবে সদস্যপদ বাতিল",
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
              <FaGavel className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                বিধি মালা
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                &ldquo;নিয়ম মেনে চলি, সবার সাথে এগিয়ে যাই&rdquo;
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
            <h2 className="text-3xl font-bold text-gray-800">সংগঠনের বিধি মালা</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">&ldquo;গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন&rdquo;</strong> একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সংগঠন। সংগঠনের সঠিক পরিচালনা ও উন্নয়নের জন্য কিছু নিয়ম-কানুন রয়েছে যা প্রতিটি সদস্যকে মেনে চলতে হবে। এই বিধি মালা সংগঠনের সকল সদস্য, নির্বাহী কমিটি এবং স্বেচ্ছাসেবীদের জন্য সমভাবে প্রযোজ্য।
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            আমাদের মূল লক্ষ্য হল মানবসেবা এবং রক্তদানের মাধ্যমে সমাজের উন্নয়নে অবদান রাখা। এই লক্ষ্য অর্জনের জন্য আমাদের সকলকে একত্রে কাজ করতে হবে এবং সংগঠনের নিয়ম-কানুন মেনে চলতে হবে।
          </p>
        </div>

        {/* General Rules Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaFileAlt className="text-red-600" />
            সাধারণ নিয়মাবলী
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {generalRules.map((rule, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{rule.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {rule.title}
                </h3>
                <ul className="space-y-3">
                  {rule.rules.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Code of Conduct Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaUserCheck className="text-blue-600" />
            আচরণবিধি
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {codeOfConduct.map((conduct, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  {conduct.icon}
                  <h3 className="text-xl font-bold text-gray-800">{conduct.title}</h3>
                </div>
                <ul className="space-y-3">
                  {conduct.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className={`mt-1 flex-shrink-0 ${
                          index === 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {index === 0 ? "✗" : "✓"}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Responsibilities Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaAward className="text-purple-600" />
            দায়িত্ব ও কর্তব্য
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {responsibilities.map((responsibility, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{responsibility.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {responsibility.title}
                </h3>
                <ul className="space-y-3">
                  {responsibility.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Disciplinary Actions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaExclamationTriangle className="text-orange-600" />
            শাস্তিমূলক ব্যবস্থা
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
              সংগঠনের নিয়ম-কানুন লঙ্ঘন করলে নিম্নলিখিত শাস্তিমূলক ব্যবস্থা গ্রহণ করা হবে:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {disciplinaryActions.map((action, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-gray-200 hover:border-red-300 transition-colors duration-300"
                >
                  <div className="flex justify-center mb-4">{action.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                    {action.title}
                  </h3>
                  <p className="text-gray-700 text-sm text-center leading-relaxed">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg p-8 md:p-12 mb-8 text-white">
          <div className="text-center">
            <FaInfoCircle className="text-5xl mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">মহত্বপূর্ণ নোট</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-lg leading-relaxed">
              <p>
                • সংগঠনের সকল সদস্যকে অবশ্যই এই বিধি মালা পড়ে বুঝে নিতে হবে
              </p>
              <p>
                • কোনো সমস্যা বা প্রশ্ন থাকলে নির্বাহী কমিটির সাথে যোগাযোগ করতে হবে
              </p>
              <p>
                • বিধি মালায় পরিবর্তন আনতে হলে সাধারণ সভায় আলোচনা করতে হবে
              </p>
              <p>
                • সংগঠনের সুনাম বজায় রাখাই আমাদের প্রধান লক্ষ্য
              </p>
              <p>
                • মানবসেবা ও রক্তদানের মাধ্যমে আমরা সমাজের উন্নয়নে অবদান রাখব
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaInfoCircle className="text-blue-600" />
            আরও তথ্যের জন্য যোগাযোগ করুন
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">ফেসবুক গ্রুপ</h3>
              <a
                href="https://bit.ly/2MD8v2T"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://bit.ly/2MD8v2T
              </a>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">ফেসবুক পেইজ</h3>
              <a
                href="https://www.facebook.com/gsrs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://www.facebook.com/gsrs
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

