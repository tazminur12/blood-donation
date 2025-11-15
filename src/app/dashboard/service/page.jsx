"use client";

import Link from "next/link";
import {
  FaHeartbeat,
  FaHospital,
  FaUserMd,
  FaAmbulance,
  FaFireExtinguisher,
  FaShieldAlt,
  FaGavel,
  FaNewspaper,
  FaBus,
  FaTrain,
  FaCar,
  FaBox,
  FaBolt,
  FaWifi,
  FaGlobe,
  FaMapMarkedAlt,
  FaTint,
  FaCity,
  FaCloudSun,
  FaSchool,
  FaPlaneDeparture,
  FaUtensils,
  FaCalendarAlt,
  FaBlog,
  FaVideo,
  FaExclamationTriangle,
} from "react-icons/fa";

// ✅ All services list
const allServices = [
  {
    id: 1,
    title: "Gobindhagonj News",
    description: "গোবিন্দগঞ্জের সর্বশেষ সংবাদ ও খবর জানুন।",
    icon: <FaNewspaper className="text-4xl text-purple-600" />,
    link: "/dashboard/admin/gobindhagonj-news",
  },
  {
    id: 2,
    title: "হাসপাতালের তথ্য",
    description: "বিভিন্ন হাসপাতাল ও ক্লিনিকের ঠিকানা ও যোগাযোগ মাধ্যম।",
    icon: <FaHospital className="text-4xl text-blue-600" />,
    link: "/dashboard/service/hospital-list",
  },
  {
    id: 3,
    title: "ডাক্তার তালিকা",
    description: "বিশ্বস্ত ডাক্তারদের তালিকা ও যোগাযোগ তথ্য।",
    icon: <FaUserMd className="text-4xl text-green-600" />,
    link: "/dashboard/service/doctor-list",
  },
  {
    id: 4,
    title: "অ্যাম্বুলেন্স সেবা",
    description: "জরুরী অ্যাম্বুলেন্স সেবার তথ্য এবং নম্বর।",
    icon: <FaAmbulance className="text-4xl text-red-600" />,
    link: "/dashboard/service/ambulance",
  },
  {
    id: 5,
    title: "ফায়ার সার্ভিস",
    description: "গোবিন্দগঞ্জের ফায়ার সার্ভিস স্টেশন ও যোগাযোগ।",
    icon: <FaFireExtinguisher className="text-4xl text-orange-500" />,
    link: "/dashboard/service/fire-station",
  },
  {
    id: 6,
    title: "পুলিশ সেবা",
    description: "গোবিন্দগঞ্জের থানা ও পুলিশের জরুরি নম্বর।",
    icon: <FaShieldAlt className="text-4xl text-indigo-500" />,
    link: "/dashboard/service/police-station",
  },
  {
    id: 7,
    title: "কনটেন্ট ক্রিয়েটর",
    description: "ভিডিও, ফটো, ভয়েস ওভার ও সোশ্যাল মিডিয়া কনটেন্ট ক্রিয়েটরদের তালিকা।",
    icon: <FaVideo className="text-4xl text-purple-600" />,
    link: "/dashboard/service/content-creator",
  },
  {
    id: 8,
    title: "আইনজীবী তথ্য",
    description: "যোগ্য ও অভিজ্ঞ আইনজীবীদের তালিকা।",
    icon: <FaGavel className="text-4xl text-purple-600" />,
    link: "/dashboard/service/lawyer",
  },
  {
    id: 9,
    title: "সাংবাদিক সংযোগ",
    description: "স্থানীয় সাংবাদিকদের সাথে যোগাযোগের তথ্য।",
    icon: <FaNewspaper className="text-4xl text-blue-500" />,
    link: "/dashboard/service/journalist",
  },
  {
    id: 10,
    title: "বাস টিকিট সেবা",
    description: "বাস কাউন্টার ও টিকিট সংক্রান্ত তথ্য।",
    icon: <FaBus className="text-4xl text-yellow-500" />,
    link: "/dashboard/service/bus",
  },
  {
    id: 11,
    title: "ভ্রমণ গন্তব্য",
    description: "গোবিন্দগঞ্জের দর্শনীয় স্থানসমূহ ও ভ্রমণ গাইড।",
    icon: <FaPlaneDeparture className="text-4xl text-indigo-500" />,
    link: "/dashboard/service/destination",
  },
  {
    id: 13,
    title: "বিদ্যুৎ অফিস",
    description: "পিডিবি/পল্লী বিদ্যুৎ অফিস ও সেবাসমূহ।",
    icon: <FaBolt className="text-4xl text-yellow-600" />,
    link: "/dashboard/service/electricity",
  },
  {
    id: 15,
    title: "ই-সেবা কেন্দ্র",
    description: "জাতীয় ডিজিটাল সেবা কেন্দ্র সম্পর্কিত তথ্য।",
    icon: <FaGlobe className="text-4xl text-lime-600" />,
    link: "/dashboard/service/esheba",
  },
  {
    id: 16,
    title: "ইউনিয়ন পরিষদ",
    description: "গোবিন্দগঞ্জের ইউনিয়ন পরিষদসমূহের তথ্য ও যোগাযোগ।",
    icon: <FaMapMarkedAlt className="text-4xl text-emerald-600" />,
    link: "/dashboard/service/union",
  },
  {
    id: 20,
    title: "কুরিয়ার সার্ভিস",
    description: "কুরিয়ার অফিস এবং ট্র্যাকিং ব্যবস্থা।",
    icon: <FaBox className="text-4xl text-teal-600" />,
    link: "/dashboard/service/courier",
  },
  {
    id: 21,
    title: "ভাড়ার গাড়ি",
    description: "গোবিন্দগঞ্জের ভাড়ার গাড়ির তালিকা ও যোগাযোগ।",
    icon: <FaCar className="text-4xl text-blue-600" />,
    link: "/dashboard/service/rent-car",
  },
  {
    id: 22,
    title: "রেস্টুরেন্ট তথ্য",
    description: "ভালো মানের খাবার ও রেস্টুরেন্ট লিস্ট।",
    icon: <FaUtensils className="text-4xl text-pink-600" />,
    link: "/dashboard/service/restaurant",
  },
  {
    id: 24,
    title: "ইভেন্টস",
    description: "গোবিন্দগঞ্জের সকল ইভেন্ট, মেলা ও আয়োজন দেখুন।",
    icon: <FaCalendarAlt className="text-4xl text-purple-500" />,
    link: "/dashboard/service/event",
  },
  {
    id: 23,
    title: "দুর্নীতি ও অন্যায় রিপোর্ট",
    description: "গোবিন্দগঞ্জের দুর্নীতি, দুর্যোগ ও অন্যায়ের বিরুদ্ধে রিপোর্ট করুন।",
    icon: <FaExclamationTriangle className="text-4xl text-red-600" />,
    link: "/dashboard/service/disaster-report",
  },
];

export default function ServicePage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">আমাদের সেবাসমূহ</h1>
        <p className="mt-2 text-sm text-slate-600">
          গোবিন্দগঞ্জের সকল গুরুত্বপূর্ণ সেবা একত্রে এখানে পাওয়া যাবে
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allServices.map((service) => (
          <Link
            key={service.id}
            href={service.link}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-sky-200 hover:shadow-md"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{service.description}</p>
            <span className="text-sm font-medium text-sky-600 group-hover:underline">
              বিস্তারিত পড়ুন →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

