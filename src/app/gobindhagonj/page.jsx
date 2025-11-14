"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaCity,
  FaLandmark,
  FaSchool,
  FaHospital,
  FaIndustry,
  FaTree,
  FaWater,
  FaRoad,
  FaHistory,
  FaInfoCircle,
  FaImage,
  FaStar,
} from "react-icons/fa";
import Image from "next/image";

export default function GobindhagonjPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              আমাদের গোবিন্দগঞ্জ
            </h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              গোবিন্দগঞ্জ সম্পর্কে বিস্তারিত তথ্য, ইতিহাস, ভৌগোলিক অবস্থান এবং
              গুরুত্বপূর্ণ স্থানসমূহ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FaInfoCircle className="text-4xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">গোবিন্দগঞ্জ সম্পর্কে</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              গোবিন্দগঞ্জ বাংলাদেশের গাইবান্ধা জেলার অন্তর্গত একটি প্রশাসনিক উপজেলা,
              যা রংপুর বিভাগে অবস্থিত। উপজেলাটির মোট আয়তন ৪৬০.৪২ বর্গকিলোমিটার এবং
              ২০২২ সালের আদমশুমারি অনুযায়ী জনসংখ্যা ৫,৪৩,১৪৪ জন। ভৌগোলিক অবস্থান
              ২৫°০৮′০২″ উত্তর অক্ষাংশ এবং ৮৯°২৩′৩৪″ পূর্ব দ্রাঘিমাংশে।
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              গোবিন্দগঞ্জ তার সমৃদ্ধ কৃষি, শিক্ষা প্রতিষ্ঠান এবং সাংস্কৃতিক
              বৈচিত্র্যের জন্য পরিচিত। এখানে রয়েছে ১৭টি ইউনিয়ন পরিষদ এবং ১টি
              পৌরসভা। উপজেলার অর্থনীতি মূলত কৃষিভিত্তিক যেখানে ধান, আখ, মাছ চাষ এবং
              গবাদি পশু পালন উল্লেখযোগ্য। মহিমাগঞ্জে অবস্থিত রংপুর সুগার মিলস
              লিমিটেড এলাকার অর্থনীতিতে গুরুত্বপূর্ণ ভূমিকা পালন করে।
            </p>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Location */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">ভৌগোলিক অবস্থান</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">জেলা:</span> গাইবান্ধা
              </p>
              <p>
                <span className="font-semibold">বিভাগ:</span> রংপুর
              </p>
              <p>
                <span className="font-semibold">দেশ:</span> বাংলাদেশ
              </p>
              <p>
                <span className="font-semibold">আয়তন:</span> ৪৬০.৪২ বর্গকিলোমিটার
              </p>
              <p>
                <span className="font-semibold">স্থানাঙ্ক:</span> ২৫°০৮′০২″ উত্তর,
                ৮৯°২৩′৩৪″ পূর্ব
              </p>
            </div>
          </div>

          {/* Population */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUsers className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">জনসংখ্যা</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">মোট জনসংখ্যা:</span> ৫,৪৩,১৪৪ জন
                (২০২২)
              </p>
              <p>
                <span className="font-semibold">পুরুষ:</span> ৫০.৮৯%
              </p>
              <p>
                <span className="font-semibold">নারী:</span> ৪৯.১১%
              </p>
              <p>
                <span className="font-semibold">পরিবার সংখ্যা:</span> ১,৩২,৫৭২টি
              </p>
              <p>
                <span className="font-semibold">সাক্ষরতার হার:</span> ৪২.৫৯% (৭ বছর ও
                তদূর্ধ্ব)
              </p>
              <p>
                <span className="font-semibold">আদিবাসী জনগোষ্ঠী:</span> ৩,৩৫১ জন
                (সাঁওতাল: ৩,০৮৬ জন)
              </p>
            </div>
          </div>

          {/* Administration */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaCity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">প্রশাসন</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">ইউনিয়ন পরিষদ:</span> ১৭টি
              </p>
              <p>
                <span className="font-semibold">পৌরসভা:</span> ১টি (৯টি ওয়ার্ড, ২২টি
                মহল্লা)
              </p>
              <p>
                <span className="font-semibold">ইউনিয়নসমূহ:</span> কামদিয়া,
                কাটাবাড়ী, শাখাহার, রাজাহার, সাপমারা, দরবস্ত, তালুক কানুপুর, নাকাই,
                হরিরামপুর, রাখালবুরুজ, ফুলবাড়ী, গুমানীগঞ্জ, কামারদহা, কোচাশহর,
                শিবপুর, মহিমাগঞ্জ, শালমারা
              </p>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaSchool className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">শিক্ষা</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">কলেজ:</span> ১৩টি
              </p>
              <p>
                <span className="font-semibold">মাধ্যমিক বিদ্যালয়:</span> ৭২টি
              </p>
              <p>
                <span className="font-semibold">প্রাথমিক বিদ্যালয়:</span> ২৩৯টি
              </p>
              <p>
                <span className="font-semibold">মাদ্রাসা:</span> ১৫৩টি
              </p>
            </div>
          </div>

          {/* Healthcare */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaHospital className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">স্বাস্থ্য সেবা</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                গোবিন্দগঞ্জে রয়েছে হাসপাতাল, ক্লিনিক, ফার্মেসি এবং বিভিন্ন
                স্বাস্থ্য সেবা কেন্দ্র যা এলাকার মানুষের স্বাস্থ্য সুরক্ষায়
                গুরুত্বপূর্ণ ভূমিকা পালন করে।
              </p>
            </div>
          </div>

          {/* Economy */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaIndustry className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">অর্থনীতি</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">অর্থনীতির ধরন:</span> কৃষিভিত্তিক
              </p>
              <p>
                <span className="font-semibold">প্রধান কৃষি:</span> ধান, আখ, মাছ
                চাষ, গবাদি পশু পালন
              </p>
              <p>
                <span className="font-semibold">শিল্প:</span> রংপুর সুগার মিলস
                লিমিটেড (মহিমাগঞ্জ)
              </p>
              <p>
                গোবিন্দগঞ্জের অর্থনীতি মূলত কৃষিভিত্তিক। এখানে ধান, আখ, মাছ চাষ এবং
                গবাদি পশু পালন উল্লেখযোগ্য। মহিমাগঞ্জে অবস্থিত রংপুর সুগার মিলস
                লিমিটেড এলাকার অর্থনীতিতে গুরুত্বপূর্ণ ভূমিকা পালন করে।
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaLandmark className="w-6 h-6 mr-3 text-indigo-600" />
            গোবিন্দগঞ্জের বিশেষত্ব
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaTree className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  প্রাকৃতিক সৌন্দর্য
                </h3>
                <p className="text-gray-600">
                  গোবিন্দগঞ্জ তার প্রাকৃতিক সৌন্দর্য, সবুজ পরিবেশ এবং সুন্দর
                  দৃশ্যের জন্য পরিচিত।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaWater className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  নদী ও জলাশয়
                </h3>
                <p className="text-gray-600">
                  গোবিন্দগঞ্জে রয়েছে বিভিন্ন নদী ও জলাশয় যা কৃষি ও মৎস্য চাষে
                  সহায়ক।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaRoad className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  যোগাযোগ ব্যবস্থা
                </h3>
                <p className="text-gray-600">
                  গোবিন্দগঞ্জের উন্নত সড়ক যোগাযোগ ব্যবস্থা রয়েছে যা বিভিন্ন
                  শহরের সাথে সংযুক্ত।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <FaHistory className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ঐতিহাসিক গুরুত্ব
                </h3>
                <p className="text-gray-600">
                  গোবিন্দগঞ্জের রয়েছে সমৃদ্ধ ইতিহাস এবং ঐতিহাসিক গুরুত্বপূর্ণ
                  স্থানসমূহ।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notable Educational Institutions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaSchool className="w-6 h-6 mr-3 text-yellow-600" />
            উল্লেখযোগ্য শিক্ষা প্রতিষ্ঠান
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                গোবিন্দগঞ্জ মাল্টিল্যাটারাল উচ্চ বিদ্যালয়
              </h3>
              <p className="text-sm text-gray-600">স্থাপিত: ১৯১২ সাল</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                গোবিন্দগঞ্জ ডিগ্রি কলেজ
              </h3>
              <p className="text-sm text-gray-600">স্থাপিত: ১৯৬৫ সাল</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                কামদিয়া নুরুল হক ডিগ্রি কলেজ
              </h3>
              <p className="text-sm text-gray-600">স্থাপিত: ১৯৭২ সাল</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                মহিমাগঞ্জ ডিগ্রি কলেজ
              </h3>
              <p className="text-sm text-gray-600">স্থাপিত: ১৯৭২ সাল</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                গোবিন্দগঞ্জ মহিলা কলেজ
              </h3>
              <p className="text-sm text-gray-600">স্থাপিত: ১৯৯১ সাল</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                মহিমাগঞ্জ আলিয়া কামিল মাদ্রাসা
              </h3>
              <p className="text-sm text-gray-600">উল্লেখযোগ্য ধর্মীয় শিক্ষা প্রতিষ্ঠান</p>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaImage className="w-6 h-6 mr-3 text-purple-600" />
            গোবিন্দগঞ্জের ছবি
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Actual Images */}
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md group bg-gray-100">
              <Image
                src="/image/Gob1.jpg"
                alt="গোবিন্দগঞ্জের দৃশ্য ১"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110 z-10"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 z-20 pointer-events-none">
                <p className="text-white font-semibold">
                  গোবিন্দগঞ্জের দৃশ্য
                </p>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md group bg-gray-100">
              <Image
                src="/image/gob2.jpg"
                alt="গোবিন্দগঞ্জের দৃশ্য ২"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110 z-10"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 z-20 pointer-events-none">
                <p className="text-white font-semibold">
                  গোবিন্দগঞ্জের দৃশ্য
                </p>
              </div>
            </div>
            {/* Placeholder for future images */}
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaSchool className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">শিক্ষা প্রতিষ্ঠান</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaIndustry className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">রংপুর সুগার মিলস</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaWater className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">নদী ও জলাশয়</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaLandmark className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">ঐতিহাসিক স্থান</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            💡 আরও ছবি যোগ করতে: /public/image/ ফোল্ডারে ছবি রাখুন
          </p>
        </div>

        {/* Notable Places Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaStar className="w-6 h-6 mr-3 text-amber-600" />
            উল্লেখযোগ্য স্থানসমূহ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaIndustry className="w-5 h-5 mr-2 text-orange-600" />
                রংপুর সুগার মিলস লিমিটেড
              </h3>
              <p className="text-gray-700">
                মহিমাগঞ্জে অবস্থিত এই শিল্প প্রতিষ্ঠানটি গোবিন্দগঞ্জের অর্থনীতিতে
                গুরুত্বপূর্ণ ভূমিকা পালন করে। এটি এলাকার চিনি শিল্পের প্রধান কেন্দ্র।
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaSchool className="w-5 h-5 mr-2 text-blue-600" />
                গোবিন্দগঞ্জ মাল্টিল্যাটারাল উচ্চ বিদ্যালয়
              </h3>
              <p className="text-gray-700">
                ১৯১২ সালে প্রতিষ্ঠিত এই বিদ্যালয়টি গোবিন্দগঞ্জের প্রাচীনতম শিক্ষা
                প্রতিষ্ঠানগুলোর মধ্যে একটি। এটি ঐতিহাসিক গুরুত্ব বহন করে।
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaWater className="w-5 h-5 mr-2 text-green-600" />
                নদী ও জলাশয়
              </h3>
              <p className="text-gray-700">
                গোবিন্দগঞ্জে রয়েছে বিভিন্ন নদী ও জলাশয় যা কৃষি, মৎস্য চাষ এবং
                পরিবেশের জন্য গুরুত্বপূর্ণ। এগুলো এলাকার প্রাকৃতিক সম্পদ।
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaLandmark className="w-5 h-5 mr-2 text-purple-600" />
                মহিমাগঞ্জ
              </h3>
              <p className="text-gray-700">
                মহিমাগঞ্জ গোবিন্দগঞ্জের একটি গুরুত্বপূর্ণ এলাকা যেখানে রয়েছে রংপুর
                সুগার মিলস এবং মহিমাগঞ্জ ডিগ্রি কলেজ সহ বিভিন্ন প্রতিষ্ঠান।
              </p>
            </div>
          </div>
        </div>

        {/* Services Available */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaInfoCircle className="w-6 h-6 mr-3 text-blue-600" />
            গোবিন্দগঞ্জে উপলব্ধ সেবাসমূহ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <FaHospital className="text-blue-600" />
              <span className="text-gray-800 font-medium">স্বাস্থ্য সেবা</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <FaSchool className="text-green-600" />
              <span className="text-gray-800 font-medium">শিক্ষা সেবা</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <FaCity className="text-purple-600" />
              <span className="text-gray-800 font-medium">প্রশাসনিক সেবা</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <FaIndustry className="text-orange-600" />
              <span className="text-gray-800 font-medium">ব্যবসায়িক সেবা</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <FaUsers className="text-red-600" />
              <span className="text-gray-800 font-medium">সামাজিক সেবা</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
              <FaMapMarkerAlt className="text-indigo-600" />
              <span className="text-gray-800 font-medium">পরিবহন সেবা</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

