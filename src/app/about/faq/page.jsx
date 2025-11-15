"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaQuestionCircle,
  FaTint,
  FaUsers,
  FaHeartbeat,
  FaHandsHelping,
  FaInfoCircle,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaHospital,
  FaUserCheck,
  FaShieldAlt,
  FaAward,
  FaFacebook,
  FaLink,
} from "react-icons/fa";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      icon: <FaTint className="text-4xl text-red-600" />,
      title: "রক্তদান সংক্রান্ত",
      faqs: [
        {
          question: "রক্তদান করতে কত বয়স হতে হবে?",
          answer:
            "রক্তদান করতে হলে ন্যূনতম ১৮ বছর এবং সর্বোচ্চ ৬৫ বছর বয়স হতে হবে। তবে প্রথমবার রক্তদান করার জন্য ১৭ বছর বয়সে অভিভাবকের অনুমতি নিয়ে রক্তদান করা যেতে পারে।",
        },
        {
          question: "রক্তদানের জন্য কী কী শর্ত পূরণ করতে হবে?",
          answer:
            "রক্তদান করতে হলে অবশ্যই সুস্থ হতে হবে, ওজন ন্যূনতম ৫০ কেজি হতে হবে, রক্তচাপ স্বাভাবিক থাকতে হবে, হিমোগ্লোবিনের মাত্রা যথেষ্ট থাকতে হবে (পুরুষের জন্য ন্যূনতম ১২.৫ গ্রাম/ডেসিলিটার এবং মহিলার জন্য ন্যূনতম ১২ গ্রাম/ডেসিলিটার), এবং কোনো সংক্রামক রোগ না থাকতে হবে।",
        },
        {
          question: "কতদিন পরপর রক্তদান করা যায়?",
          answer:
            "পুরুষরা ৩ মাস (৯০ দিন) পরপর এবং মহিলারা ৪ মাস (১২০ দিন) পরপর রক্তদান করতে পারেন। এটি শরীরের রক্ত পুনরায় তৈরি হওয়ার জন্য প্রয়োজনীয় সময়।",
        },
        {
          question: "রক্তদানের পর কী কী করতে হবে?",
          answer:
            "রক্তদানের পর কমপক্ষে ১০-১৫ মিনিট বিশ্রাম নিতে হবে, প্রচুর পানি পান করতে হবে, ভারী কাজ করা থেকে বিরত থাকতে হবে, ধূমপান ও মদপান করা থেকে বিরত থাকতে হবে, এবং ভারী ব্যায়াম করা থেকে বিরত থাকতে হবে।",
        },
        {
          question: "রক্তদানে কোনো ঝুঁকি আছে কি?",
          answer:
            "সঠিক নিয়ম মেনে রক্তদান করলে কোনো ঝুঁকি নেই। রক্তদানের আগে সম্পূর্ণ স্বাস্থ্য পরীক্ষা করা হয় এবং স্টেরাইল সুই ব্যবহার করা হয়। রক্তদানের পর সামান্য দুর্বলতা বা মাথা ঘোরা অনুভব করতে পারেন, কিন্তু এটি স্বাভাবিক এবং অল্প সময়ের মধ্যে ঠিক হয়ে যায়।",
        },
        {
          question: "কোন রোগ থাকলে রক্তদান করা যাবে না?",
          answer:
            "এইচআইভি, হেপাটাইটিস বি ও সি, সিফিলিস, ম্যালেরিয়া, টিবি (যক্ষ্মা), হৃদরোগ, উচ্চ রক্তচাপ, ডায়াবেটিস, ক্যান্সার, মৃগী রোগ, কিডনি রোগ, লিভার রোগ, রক্তক্ষরণ সমস্যা, এবং অন্যান্য সংক্রামক রোগ থাকলে রক্তদান করা যাবে না।",
        },
      ],
    },
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: "সংগঠন সংক্রান্ত",
      faqs: [
        {
          question: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন কখন প্রতিষ্ঠিত হয়?",
          answer:
            "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S) একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সংগঠন। সংগঠনটি গোবিন্দগঞ্জ, গাইবান্ধা এলাকায় মানবসেবা ও রক্তদান কার্যক্রম পরিচালনা করছে।",
        },
        {
          question: "সংগঠনের মূল লক্ষ্য কী?",
          answer:
            "সংগঠনের মূল লক্ষ্য হল মানবসেবা এবং রক্তদানের মাধ্যমে সমাজের উন্নয়নে অবদান রাখা, অসহায় মানুষের পাশে দাঁড়ানো, এবং একটি মাদকমুক্ত সুস্থ সমাজ গঠন করা।",
        },
        {
          question: "সংগঠন কী কী কার্যক্রম পরিচালনা করে?",
          answer:
            "সংগঠন রক্তদান কার্যক্রম, বিনামূল্যে রক্তের গ্রুপ নির্ণয়, মানবসেবা কার্যক্রম, ত্রাণ বিতরণ, চিকিৎসার জন্য অর্থ সংগ্রহ, সচেতনতামূলক কর্মসূচি, বৃক্ষরোপণ, এবং বিভিন্ন সামাজিক উন্নয়নমূলক কাজ পরিচালনা করে।",
        },
        {
          question: "সংগঠন কীভাবে পরিচালিত হয়?",
          answer:
            "সংগঠন একটি নির্বাহী কমিটি দ্বারা পরিচালিত হয়। কমিটি নিয়মিত সভা করে এবং সকল কার্যক্রম পরিকল্পনা করে। সংগঠনের সকল সদস্য নিয়মিত সভায় অংশগ্রহণ করে এবং কার্যক্রমে অংশ নেয়।",
        },
        {
          question: "সংগঠনের সাথে কীভাবে যোগাযোগ করা যায়?",
          answer:
            "সংগঠনের সাথে যোগাযোগ করতে পারেন ফেসবুক গ্রুপ (https://bit.ly/2MD8v2T) এবং ফেসবুক পেইজ (https://www.facebook.com/gsrs) এর মাধ্যমে। এছাড়াও সরাসরি সংগঠনের সদস্যদের সাথে যোগাযোগ করতে পারেন।",
        },
      ],
    },
    {
      icon: <FaUserCheck className="text-4xl text-green-600" />,
      title: "সদস্যপদ সংক্রান্ত",
      faqs: [
        {
          question: "সংগঠনের সদস্য হতে কী কী শর্ত পূরণ করতে হবে?",
          answer:
            "সংগঠনের সদস্য হতে হলে ন্যূনতম ১৮ বছর বয়স হতে হবে, ন্যূনতম SSC পাস হতে হবে, রক্তদানে আগ্রহী এবং স্বেচ্ছাসেবী হতে হবে, সংগঠনের সকল নিয়ম-কানুন মেনে চলতে হবে, এবং নিয়মিত সভায় উপস্থিত থাকতে হবে।",
        },
        {
          question: "সদস্য হতে কীভাবে আবেদন করতে হবে?",
          answer:
            "সদস্য হতে হলে সংগঠনের ফেসবুক গ্রুপে যোগ দিন এবং আবেদন ফরম পূরণ করুন। এছাড়াও সরাসরি সংগঠনের সদস্যদের সাথে যোগাযোগ করে আবেদন করতে পারেন। আবেদনপত্র পর্যালোচনার পর সদস্যপদ দেওয়া হবে।",
        },
        {
          question: "সদস্যপদের জন্য কী কী সুবিধা পাওয়া যাবে?",
          answer:
            "সদস্যদের জন্য রক্তদান কার্যক্রমে অগ্রাধিকার, বিনামূল্যে রক্তের গ্রুপ নির্ণয়, সংগঠনের বিভিন্ন কার্যক্রমে অংশগ্রহণের সুযোগ, মানবসেবা কার্যক্রমে অংশগ্রহণ, এবং সংগঠনের সদস্য হিসেবে পরিচিতি পাওয়া যাবে।",
        },
        {
          question: "সদস্যপদের জন্য কী কী দায়িত্ব রয়েছে?",
          answer:
            "সদস্যদের দায়িত্ব হল সংগঠনের নিয়ম-কানুন মেনে চলা, নিয়মিত সভায় উপস্থিত থাকা, রক্তদান কার্যক্রমে অংশগ্রহণ করা, সংগঠনের সুনাম বজায় রাখা, অন্যান্য সদস্যদের সহায়তা করা, এবং সংগঠনের উন্নয়নে ভূমিকা রাখা।",
        },
        {
          question: "সদস্যপদ কি স্থায়ী?",
          answer:
            "হ্যাঁ, সদস্যপদ স্থায়ী। তবে সংগঠনের নিয়ম-কানুন লঙ্ঘন করলে বা গুরুতর সমস্যা সৃষ্টি করলে সদস্যপদ বাতিল করা যেতে পারে। এছাড়াও নিজের ইচ্ছায় সদস্যপদ ত্যাগ করা যেতে পারে।",
        },
      ],
    },
    {
      icon: <FaHeartbeat className="text-4xl text-pink-600" />,
      title: "রক্ত সংগ্রহ সংক্রান্ত",
      faqs: [
        {
          question: "রক্তের প্রয়োজনে কীভাবে যোগাযোগ করতে হবে?",
          answer:
            "রক্তের প্রয়োজনে আমাদের ফেসবুক গ্রুপে পোস্ট করতে পারেন বা সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন। আমরা জরুরী পরিস্থিতিতে ২৪/৭ সেবা প্রদান করি। আমাদের সাথে যোগাযোগ করার পর প্রয়োজনীয় তথ্য (রক্তের গ্রুপ, প্রয়োজনীয় তারিখ, হাসপাতালের নাম, যোগাযোগের নম্বর) প্রদান করুন।",
        },
        {
          question: "রক্ত সংগ্রহ করতে কত সময় লাগে?",
          answer:
            "সাধারণত রক্ত সংগ্রহ করতে ২-৪ ঘণ্টা সময় লাগে। তবে জরুরী পরিস্থিতিতে আমরা দ্রুততম সময়ে রক্ত সংগ্রহ করার চেষ্টা করি। রক্তের গ্রুপ, এলাকা, এবং রক্তদাতার উপলব্ধতার উপর সময় নির্ভর করে।",
        },
        {
          question: "রক্ত সংগ্রহ কি বিনামূল্যে?",
          answer:
            "হ্যাঁ, আমাদের সংগঠনের মাধ্যমে রক্ত সংগ্রহ সম্পূর্ণ বিনামূল্যে। আমরা কোনো চার্জ নিই না। আমাদের লক্ষ্য হল মানবসেবা এবং অসহায় মানুষের সাহায্য করা।",
        },
        {
          question: "কোন রক্তের গ্রুপ পাওয়া যায়?",
          answer:
            "আমাদের সংগঠনে সকল রক্তের গ্রুপের রক্তদাতা রয়েছে। আমরা A+, A-, B+, B-, AB+, AB-, O+, এবং O- সব ধরনের রক্তের গ্রুপের জন্য রক্ত সংগ্রহ করতে পারি।",
        },
        {
          question: "রক্ত সংগ্রহ করার পর কী করা হয়?",
          answer:
            "রক্ত সংগ্রহ করার পর রক্তদাতা এবং গ্রহীতার মধ্যে সরাসরি যোগাযোগ স্থাপন করা হয়। রক্তদাতা নির্দিষ্ট তারিখে হাসপাতালে গিয়ে রক্তদান করে থাকেন। আমরা পুরো প্রক্রিয়ায় সাহায্য করি এবং নিশ্চিত করি যে রক্তদান সফলভাবে সম্পন্ন হয়েছে।",
        },
      ],
    },
    {
      icon: <FaHandsHelping className="text-4xl text-purple-600" />,
      title: "মানবসেবা সংক্রান্ত",
      faqs: [
        {
          question: "সংগঠন কী কী মানবসেবা কার্যক্রম পরিচালনা করে?",
          answer:
            "সংগঠন বিভিন্ন মানবসেবা কার্যক্রম পরিচালনা করে যেমন: ত্রাণ বিতরণ, চিকিৎসার জন্য অর্থ সংগ্রহ, শিক্ষার্থীদের সহায়তা, দুর্যোগকালীন সময়ে সাহায্য, বৃক্ষরোপণ, এবং বিভিন্ন সামাজিক উন্নয়নমূলক কাজ।",
        },
        {
          question: "মানবসেবা কার্যক্রমে কীভাবে অংশগ্রহণ করা যায়?",
          answer:
            "মানবসেবা কার্যক্রমে অংশগ্রহণ করতে হলে সংগঠনের সদস্য হতে হবে এবং নিয়মিত সভায় উপস্থিত থাকতে হবে। সংগঠনের ফেসবুক গ্রুপে মানবসেবা কার্যক্রমের নোটিশ দেওয়া হয় এবং সেখান থেকে অংশগ্রহণ করা যেতে পারে।",
        },
        {
          question: "মানবসেবা কার্যক্রমের জন্য কীভাবে সাহায্য করা যায়?",
          answer:
            "মানবসেবা কার্যক্রমের জন্য আর্থিক সাহায্য, স্বেচ্ছাসেবী হিসেবে কাজ করা, প্রয়োজনীয় সামগ্রী প্রদান, এবং কার্যক্রমে অংশগ্রহণ করা যেতে পারে। আর্থিক সাহায্যের জন্য সংগঠনের সদস্যদের সাথে যোগাযোগ করতে পারেন।",
        },
        {
          question: "সংগঠন কি ত্রাণ বিতরণ করে?",
          answer:
            "হ্যাঁ, সংগঠন বিভিন্ন সময়ে অসহায় মানুষের মাঝে ত্রাণ বিতরণ করে। বিশেষ করে বিভিন্ন ধর্মীয় উৎসব, দুর্যোগকালীন সময়ে, এবং মহামারীকালে ত্রাণ বিতরণ করা হয়।",
        },
      ],
    },
    {
      icon: <FaHospital className="text-4xl text-orange-600" />,
      title: "রক্তের গ্রুপ নির্ণয়",
      faqs: [
        {
          question: "রক্তের গ্রুপ নির্ণয় কি বিনামূল্যে?",
          answer:
            "হ্যাঁ, আমাদের সংগঠনের মাধ্যমে রক্তের গ্রুপ নির্ণয় সম্পূর্ণ বিনামূল্যে। আমরা বিভিন্ন স্কুল-কলেজ ও জনসাধারণের মাঝে বিনামূল্যে রক্তের গ্রুপ নির্ণয় ক্যাম্পেইন পরিচালনা করি।",
        },
        {
          question: "রক্তের গ্রুপ নির্ণয় ক্যাম্পেইন কোথায় হয়?",
          answer:
            "রক্তের গ্রুপ নির্ণয় ক্যাম্পেইন বিভিন্ন স্কুল, কলেজ, মাদ্রাসা, এবং জনসমাগম স্থানে পরিচালনা করা হয়। ক্যাম্পেইনের সময় ও স্থানের তথ্য সংগঠনের ফেসবুক গ্রুপে দেওয়া হয়।",
        },
        {
          question: "রক্তের গ্রুপ নির্ণয় করতে কত সময় লাগে?",
          answer:
            "রক্তের গ্রুপ নির্ণয় করতে সাধারণত ৫-১০ মিনিট সময় লাগে। আমরা আধুনিক পদ্ধতি ব্যবহার করে দ্রুততম সময়ে রক্তের গ্রুপ নির্ণয় করি।",
        },
        {
          question: "রক্তের গ্রুপ নির্ণয়ের জন্য কী করতে হবে?",
          answer:
            "রক্তের গ্রুপ নির্ণয়ের জন্য নির্দিষ্ট তারিখে ক্যাম্পেইন স্থানে উপস্থিত হতে হবে। কোনো প্রকার পূর্ব প্রস্তুতি বা নিবন্ধনের প্রয়োজন নেই। সরাসরি ক্যাম্পেইন স্থানে গিয়ে রক্তের গ্রুপ নির্ণয় করাতে পারেন।",
        },
      ],
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
              <FaQuestionCircle className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                প্রয়োজনীয় প্রশ্ন ও উত্তর
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                &ldquo;আপনার প্রশ্নের উত্তর এখানে&rdquo;
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
            <h2 className="text-3xl font-bold text-gray-800">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">&ldquo;গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন&rdquo;</strong> সম্পর্কে আপনার মনে যে কোনো প্রশ্ন থাকলে, এখানে আপনি তার উত্তর পাবেন। আমরা সবচেয়ে সাধারণ প্রশ্নগুলো এখানে উত্তর সহ প্রদান করেছি। যদি আপনার প্রশ্নের উত্তর এখানে না থাকে, তাহলে আমাদের সাথে সরাসরি যোগাযোগ করতে পারেন।
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            আমাদের লক্ষ্য হল আপনার সব প্রশ্নের সঠিক উত্তর প্রদান করা এবং আপনার সাথে পরিষ্কার যোগাযোগ রাখা। আমরা বিশ্বাস করি যে, ভালো যোগাযোগের মাধ্যমে আমরা আরও ভালো সেবা প্রদান করতে পারব।
          </p>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              {category.icon}
              <h2 className="text-3xl font-bold text-gray-800">{category.title}</h2>
            </div>
            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => {
                const index = `${categoryIndex}-${faqIndex}`;
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faqIndex}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <FaQuestionCircle className="text-red-600 mt-1 flex-shrink-0" />
                        <h3 className="text-lg font-bold text-gray-800 pr-4">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <FaChevronUp className="text-red-600 text-xl" />
                        ) : (
                          <FaChevronDown className="text-red-600 text-xl" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <div className="ml-10 pl-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg p-4">
                          <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaInfoCircle className="text-blue-600" />
            আরও প্রশ্ন থাকলে যোগাযোগ করুন
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            যদি আপনার প্রশ্নের উত্তর এখানে না থাকে, তাহলে আমাদের সাথে সরাসরি যোগাযোগ করতে পারেন। আমরা যথাসম্ভব দ্রুত আপনার প্রশ্নের উত্তর দেওয়ার চেষ্টা করব।
          </p>
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

