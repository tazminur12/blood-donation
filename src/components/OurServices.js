"use client";

import Link from "next/link";
import {
  FaHeartbeat,
  FaHospital,
  FaUserMd,
  FaAmbulance,
  FaFireExtinguisher,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

// First 6 services
const services = [
  {
    id: 1,
    title: "আমাদের গোবিন্দগঞ্জ",
    description: "গোবিন্দগঞ্জ সম্পর্কে বিস্তারিত তথ্য জানুন।",
    icon: <FaHeartbeat className="text-4xl text-red-500" />,
    link: "/gobindhagonj",
    color: "bg-red-50 hover:bg-red-100",
  },
  {
    id: 2,
    title: "হাসপাতালের তথ্য",
    description: "বিভিন্ন হাসপাতাল ও ক্লিনিকের ঠিকানা ও যোগাযোগ মাধ্যম।",
    icon: <FaHospital className="text-4xl text-blue-600" />,
    link: "/all-service/hospital-list",
    color: "bg-blue-50 hover:bg-blue-100",
  },
  {
    id: 3,
    title: "ডাক্তার তালিকা",
    description: "বিশ্বস্ত ডাক্তারদের তালিকা ও যোগাযোগ তথ্য।",
    icon: <FaUserMd className="text-4xl text-green-600" />,
    link: "/all-service/doctor-list",
    color: "bg-green-50 hover:bg-green-100",
  },
  {
    id: 4,
    title: "অ্যাম্বুলেন্স সেবা",
    description: "জরুরী অ্যাম্বুলেন্স সেবার তথ্য এবং নম্বর।",
    icon: <FaAmbulance className="text-4xl text-red-600" />,
    link: "/all-service/ambulance",
    color: "bg-rose-50 hover:bg-rose-100",
  },
  {
    id: 5,
    title: "ফায়ার সার্ভিস",
    description: "গোবিন্দগঞ্জের ফায়ার সার্ভিস স্টেশন ও যোগাযোগ।",
    icon: <FaFireExtinguisher className="text-4xl text-orange-500" />,
    link: "/all-service/fire-service",
    color: "bg-orange-50 hover:bg-orange-100",
  },
  {
    id: 6,
    title: "পুলিশ সেবা",
    description: "গোবিন্দগঞ্জের থানা ও পুলিশের জরুরি নম্বর।",
    icon: <FaShieldAlt className="text-4xl text-indigo-500" />,
    link: "/all-service/police-service",
    color: "bg-indigo-50 hover:bg-indigo-100",
  },
];

export default function OurServices() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold text-highlighted mb-4">
            আমাদের সেবাসমূহ 🏥
          </span>
          <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl mb-4">
            গোবিন্দগঞ্জের সকল গুরুত্বপূর্ণ সেবা
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            আপনার প্রয়োজনীয় সকল সেবা একত্রে এখানে পাওয়া যাবে
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.link}
              className="group block"
            >
              <div
                className={`${service.color} border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full transform hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors duration-200">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* View More Link */}
                <div className="flex items-center gap-2 text-rose-600 font-medium group-hover:gap-3 transition-all duration-200">
                  <span>বিস্তারিত দেখুন</span>
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Services Button */}
        <div className="text-center">
          <Link
            href="/service"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <span>সব সেবা দেখুন</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

