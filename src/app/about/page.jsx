"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VolunteerSection from "@/components/VolunteerSection";
import {
  FaHeartbeat,
  FaUsers,
  FaHandsHelping,
  FaBan,
  FaFacebook,
  FaLink,
  FaCheckCircle,
  FaTint,
  FaHospital,
  FaTree,
  FaHandHoldingHeart,
  FaShieldVirus,
  FaHandsWash,
  FaBox,
  FaChartLine,
  FaAward,
  FaCode,
  FaGraduationCap,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaUser,
  FaLinkedin,
  FaYoutube,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";

export default function GalleryPage() {
  const objectives = [
    {
      icon: <FaTint className="text-4xl text-red-600" />,
      title: "মুমূর্ষু রোগীর জীবন বাঁচাতে বিনামূল্যে রক্তদান",
      description: "জরুরী পরিস্থিতিতে রোগীদের জন্য রক্ত সরবরাহ নিশ্চিত করা",
    },
    {
      icon: <FaHandsHelping className="text-4xl text-blue-600" />,
      title: "অসহায়, ছিন্নমূল মানুষের পাশে দাঁড়ানো",
      description: "সমাজের অসহায় মানুষের পাশে থেকে সহায়তা প্রদান",
    },
    {
      icon: <FaBan className="text-4xl text-green-600" />,
      title: "মাদকমুক্ত সমাজ বিনির্মানে আমরা সর্বদাই বদ্ধপরিকর",
      description: "মাদকমুক্ত সমাজ গঠনে সচেতনতামূলক কার্যক্রম পরিচালনা",
    },
  ];

  const achievements = [
    {
      icon: <FaBox className="text-3xl text-orange-500" />,
      title: "বিভিন্ন ধর্মীয় উৎসবে গরীব দুঃখীদের মাঝে ত্রাণ বিতরন",
    },
    {
      icon: <FaHospital className="text-3xl text-red-500" />,
      title: "বিভিন্ন স্কুুল-কলেজ ও জনসাধারণের মাঝে ফ্রীতে রক্তের গ্রুপ নির্ণয় ক্যাম্পেইন",
    },
    {
      icon: <FaChartLine className="text-3xl text-blue-500" />,
      title: "গত দুই বছরে প্রায় ৩০০০ হাজার মানুষের ফ্রীতে রক্তের গ্রুপ নির্ণয় সম্পন্নকরণ",
    },
    {
      icon: <FaHeartbeat className="text-3xl text-pink-500" />,
      title: "থ্যালাসেমিয়া বিষয়ক জনসচেতনতামূলক কর্মসূচি",
    },
    {
      icon: <FaHospital className="text-3xl text-green-500" />,
      title: "বন্যা কবলিত এলাকায় ফ্রী মেডিকেল ক্যাম্প ও ঔষধ সামগ্রী বিতরণ (ইভেন্ট ২০১৯)",
    },
    {
      icon: <FaTree className="text-3xl text-green-600" />,
      title: "বৃক্ষরোপণ কর্মসূচি (ইভেন্ট ২০১৮)",
    },
    {
      icon: <FaHandHoldingHeart className="text-3xl text-red-500" />,
      title: "এতিম ছেলে ওয়াদুদ ভাইয়ের চিকিৎসার জন্য অর্থ সংগ্রহ (ইভেন্ট ২০১৮)",
    },
    {
      icon: <FaHandHoldingHeart className="text-3xl text-pink-500" />,
      title: "ছোট বোন ফাতেমার চিকিৎসার জন্য অর্থ সংগ্রহ (ইভেন্ট ২০১৯)",
    },
    {
      icon: <FaHandHoldingHeart className="text-3xl text-blue-500" />,
      title: "স্বেচ্ছাসেবী অন্তরা জাহান আপুর চিকিৎসার জন্য অর্থ সংগ্রহ (ইভেন্ট ২০১৯)",
    },
    {
      icon: <FaHospital className="text-3xl text-purple-500" />,
      title: "দিনমজুর মোজাম্মেল ভাইয়ের এপেন্ডিসাইট অপারেশন ও চিকিৎসার জন্য অর্থ সংগ্রহ (ইভেন্ট ২০২০)",
    },
    {
      icon: <FaShieldVirus className="text-3xl text-yellow-500" />,
      title: "বর্তমান সময়ে করোনা ভাইরাসের ছোবল থেকে রক্ষা পেতে জনসচেতনতামূলক কর্মসূচি হাতে নিয়েছে সংগঠনটি",
    },
    {
      icon: <FaHandsWash className="text-3xl text-cyan-500" />,
      title: "মহামারী করোনা ভাইরাস থেকে নিরাপদ থাকতে জনসাধারণের মাঝে মাস্ক, সাবান-হ্যান্ডস্যানেটাইজার, হ্যান্ড বিলসহ ইত্যাদি বিতরণ",
    },
    {
      icon: <FaBox className="text-3xl text-indigo-500" />,
      title: "মহামারীর এই দুর্দিনে অসহায় মানুষের মাঝে ত্রাণ বিতরণ",
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaHeartbeat className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              (G.S.R.S) গোবিন্দগঞ্জ, গাইবান্ধা
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                "মুমূর্ষু রোগীর প্রাণের টানে, এগিয়ে আসুন রক্তদানে।"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaUsers className="text-red-600" />
            আমাদের সম্পর্কে
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">"গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন"</strong> একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সংগঠন। শুরুর দিকে গোবিন্দগঞ্জবাসীর রক্তের প্রয়োজনে রক্ত সরবরাহ, বিনামূল্যে রক্তের গ্রুপ নির্ণয়ে কাজ করার পাশাপাশি রক্তদানে মানুষদের উৎসাহিত করলেও বর্তমানে বিভিন্ন সামাজিক উন্নয়নমূলক কর্মকান্ডে সম্পৃক্ত হয়েছে আমাদের প্রাণের এই সংগঠনটি। এছাড়াও রোগী এবং রক্তদাতা উভয়ের জন্য কার্যকরী একটি প্লাটফর্ম হিসেবে কাজ করে যাচ্ছে এটি।
          </p>
        </div>

        {/* Objectives Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaAward className="text-red-600" />
            আমাদের উদ্দেশ্য
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{objective.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {objective.title}
                </h3>
                <p className="text-gray-600 text-center">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaCheckCircle className="text-green-600" />
            আমাদের সম্পন্নকৃত কাজসমূহ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium leading-relaxed">
                      {achievement.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg p-8 md:p-12 mb-8 text-white">
          <div className="text-center">
            <FaTint className="text-6xl mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">আমাদের সাফল্য</h2>
            <p className="text-xl md:text-2xl leading-relaxed">
              আল্লাহর অশেষ কৃপায় আমরা গত <strong className="text-yellow-300">২ বছর ৬ মাস</strong>ে অত্র সংগঠনের মাধ্যমে প্রায়{" "}
              <strong className="text-yellow-300">৫ হাজারের অধিক</strong> মানুষকে রক্ত সংগ্রহ করে দিতে সক্ষম হয়েছি।
            </p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaFacebook className="text-blue-600" />
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

        {/* Developer Profile Section */}
        <div className="mt-16 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
              <FaUser className="text-red-600" />
              ডেভেলপারের সাথে পরিচিত হোন
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Profile Info */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-full border-4 border-red-200 overflow-hidden shadow-lg relative">
                    <Image 
                      src="/Developer/tanim.png" 
                      alt="তাজমিনুর রহমান তানিম" 
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    তাজমিনুর রহমান তানিম
                  </h3>
                  <p className="text-xl font-semibold text-red-600">
                    ফুল স্ট্যাক ডেভেলপার
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaMapMarkerAlt className="text-red-600" />
                    <span>Dhaka, Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaEnvelope className="text-red-600" />
                    <a 
                      href="mailto:tanimkhalifa55@gmail.com" 
                      className="text-sm hover:text-red-600 transition-colors"
                    >
                      tanimkhalifa55@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaPhone className="text-red-600" />
                    <a 
                      href="tel:01540288718" 
                      className="text-sm hover:text-red-600 transition-colors"
                    >
                      01540288718
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaGlobe className="text-red-600" />
                    <a 
                      href="https://tanimportfolio1.netlify.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm hover:text-red-600 transition-colors break-all"
                    >
                      https://tanimportfolio1.netlify.app
                    </a>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="pt-4">
                  <p className="text-center text-gray-600 mb-3 font-medium">আমার সাথে যুক্ত থাকুন</p>
                  <div className="flex justify-center gap-4">
                    <a
                      href="https://www.facebook.com/tan.im.921025"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                      title="Facebook"
                    >
                      <FaFacebook className="text-xl" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/tazminur-rahman-tanim-305315336"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="text-xl" />
                    </a>
                    <a
                      href="https://www.youtube.com/@tazminurrahman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                      title="YouTube"
                    >
                      <FaYoutube className="text-xl" />
                    </a>
                    <a
                      href="https://github.com/tazminur12"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-gray-900 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                      title="GitHub"
                    >
                      <FaGithub className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Sections */}
              <div className="space-y-6">
                {/* About Me Section */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <FaCode className="text-2xl text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-800">আমার সম্পর্কে</h3>
                  </div>
                  <div className="space-y-3 text-gray-700 leading-relaxed">
                    <p>
                      আমি তাজমিনুর রহমান তানিম। তৈরি করতে, গড়ে তুলতে আর জিনিসগুলো কীভাবে আরও ভালোভাবে কাজ করতে পারে সেটা ভাবতেই আমার ভালো লাগে। সেই জায়গা থেকেই ফুল স্ট্যাক ডেভেলপমেন্টে যাত্রা। ফ্রন্ট-এন্ডের অভিজ্ঞতা আর ব্যাক-এন্ডের স্থায়িত্ব—দুটো মিলিয়ে এমন সলিউশন তৈরি করতে চাই যা সত্যিকারের সমস্যা সমাধান করে।
                    </p>
                    <p>
                      এখন আমি University of Liberal Arts Bangladesh (ULAB) এ CSE পড়ছি। পড়াশোনার পাশাপাশি Flyoval Limited এ MERN Stack Developer Intern হিসেবে বাস্তব প্রজেক্টে কাজ করার সুযোগ পাচ্ছি। এখানে প্রতিদিন নতুন কিছু শেখা, বিভিন্ন চ্যালেঞ্জ মোকাবিলা করা আর কোডকে আরও জীবন্ত করে তোলার অভিজ্ঞতা হচ্ছে।
                    </p>
                    <p>
                      আমার লক্ষ্য একটাই—টেকনোলজি যেন মানুষের জীবনে কাজে লাগে, আর আমি যেন সেই কাজের ভিতরে নিজের অবদান রাখতে পারি।
                    </p>
                  </div>
                </div>

                {/* Education Section */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <FaGraduationCap className="text-2xl text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-800">শিক্ষা</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">
                          কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)
                        </h4>
                        <p className="text-gray-600">University of Liberal Arts Bangladesh</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>চলমান</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience Section */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <FaBriefcase className="text-2xl text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-800">অভিজ্ঞতা</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">
                          MERN Stack Developer (Intern)
                        </h4>
                        <p className="text-gray-600">Flyoval Limited</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>বর্তমান</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start pt-4 border-t border-gray-300">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">
                          ফুল স্ট্যাক ডেভেলপার
                        </h4>
                        <p className="text-gray-600">ব্যক্তিগত ও ক্লায়েন্ট প্রজেক্ট</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>২০২২ – বর্তমান</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">ব্যক্তিগত তথ্য</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>নাম:</strong> তাজমিনুর রহমান তানিম</p>
                    <p><strong>ভূমিকা:</strong> ফুল স্ট্যাক ডেভেলপার</p>
                    <p><strong>অবস্থান:</strong> Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Section */}
        <div className="mt-16 mb-12">
          <VolunteerSection />
        </div>
      </div>

      <Footer />
    </div>
  );
}

