"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaDonate,
  FaCreditCard,
  FaMobileAlt,
  FaBuilding,
  FaCopy,
  FaCheckCircle,
  FaInfoCircle,
  FaQrcode,
  FaUniversity,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaHeart,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function DonatePage() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const bankAccounts = [
    {
      bankName: "ডাচ-বাংলা ব্যাংক",
      accountName: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন",
      accountNumber: "123.456.7890",
      branch: "গোবিন্দগঞ্জ শাখা",
      routingNumber: "123456789",
      icon: <FaUniversity className="text-4xl text-blue-600" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      bankName: "বাংলাদেশ কৃষি ব্যাংক",
      accountName: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন",
      accountNumber: "987.654.3210",
      branch: "গোবিন্দগঞ্জ শাখা",
      routingNumber: "987654321",
      icon: <FaUniversity className="text-4xl text-green-600" />,
      color: "from-green-500 to-green-600",
    },
    {
      bankName: "সোনালী ব্যাংক",
      accountName: "গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন",
      accountNumber: "555.666.7777",
      branch: "গোবিন্দগঞ্জ শাখা",
      routingNumber: "555666777",
      icon: <FaUniversity className="text-4xl text-yellow-600" />,
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  const mobilePayments = [
    {
      name: "bKash",
      number: "01XXX-XXXXXX",
      type: "Personal",
      icon: <FaMobileAlt className="text-4xl text-green-600" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      instructions: [
        "bKash App খুলুন",
        "Send Money এ যান",
        "নম্বরটি দিয়ে Send করুন",
        "PIN দিয়ে Confirm করুন",
      ],
    },
    {
      name: "Nagad",
      number: "01XXX-XXXXXX",
      type: "Personal",
      icon: <FaMobileAlt className="text-4xl text-red-600" />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      instructions: [
        "Nagad App খুলুন",
        "Send Money এ যান",
        "নম্বরটি দিয়ে Send করুন",
        "PIN দিয়ে Confirm করুন",
      ],
    },
    {
      name: "Rocket",
      number: "01XXX-XXXXXX",
      type: "Personal",
      icon: <FaMobileAlt className="text-4xl text-blue-600" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      instructions: [
        "Rocket App খুলুন",
        "Send Money এ যান",
        "নম্বরটি দিয়ে Send করুন",
        "PIN দিয়ে Confirm করুন",
      ],
    },
  ];

  const paymentMethods = [
    {
      title: "ব্যাংক একাউন্ট",
      description: "সরাসরি ব্যাংকে টাকা জমা দিন",
      icon: <FaBuilding className="text-4xl text-blue-600" />,
      methods: bankAccounts,
    },
    {
      title: "মোবাইল পেমেন্ট",
      description: "bKash, Nagad, Rocket এর মাধ্যমে দান করুন",
      icon: <FaMobileAlt className="text-4xl text-green-600" />,
      methods: mobilePayments,
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
              <FaDonate className="text-5xl text-white animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                দান করুন
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-red-100 font-semibold mb-2">
              গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)
            </p>
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
              <p className="text-lg md:text-xl text-white font-medium italic">
                &ldquo;আপনার দান আমাদের কার্যক্রমকে এগিয়ে নিয়ে যাবে&rdquo;
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
            <h2 className="text-3xl font-bold text-gray-800">দান করার উপায়</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            <strong className="text-red-600">&ldquo;গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন&rdquo;</strong> একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও স্বেচ্ছাসেবী সংগঠন। আপনার দান আমাদের বিভিন্ন মানবসেবা কার্যক্রম পরিচালনা করতে সাহায্য করবে। আপনি নিচের যে কোনো উপায়ে দান করতে পারেন:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <FaBuilding className="text-blue-600 text-2xl" />
              <span className="text-gray-800 font-medium">ব্যাংক একাউন্ট</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <FaMobileAlt className="text-green-600 text-2xl" />
              <span className="text-gray-800 font-medium">মোবাইল পেমেন্ট</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <FaHandHoldingHeart className="text-purple-600 text-2xl" />
              <span className="text-gray-800 font-medium">সরাসরি যোগাযোগ</span>
            </div>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaBuilding className="text-blue-600" />
            ব্যাংক একাউন্ট
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {bankAccounts.map((account, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`bg-gradient-to-r ${account.color} p-6`}>
                  <div className="flex justify-center mb-4">{account.icon}</div>
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    {account.bankName}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">একাউন্ট নাম</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-semibold">
                        {account.accountName}
                      </p>
                      <button
                        onClick={() => copyToClipboard(account.accountName, `bank-name-${index}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="কপি করুন"
                      >
                        {copiedIndex === `bank-name-${index}` ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaCopy className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">একাউন্ট নম্বর</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-bold text-lg">
                        {account.accountNumber}
                      </p>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, `bank-account-${index}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="কপি করুন"
                      >
                        {copiedIndex === `bank-account-${index}` ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaCopy className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">শাখা</p>
                    <p className="text-gray-800 font-medium">{account.branch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">রাউটিং নম্বর</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-medium">
                        {account.routingNumber}
                      </p>
                      <button
                        onClick={() => copyToClipboard(account.routingNumber, `bank-routing-${index}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="কপি করুন"
                      >
                        {copiedIndex === `bank-routing-${index}` ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaCopy className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Payment Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <FaMobileAlt className="text-green-600" />
            মোবাইল পেমেন্ট
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mobilePayments.map((payment, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`bg-gradient-to-r ${payment.color} p-6`}>
                  <div className="flex justify-center mb-4">{payment.icon}</div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    {payment.name}
                  </h3>
                  <p className="text-white/90 text-center text-sm">{payment.type}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">মোবাইল নম্বর</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-bold text-xl">
                        {payment.number}
                      </p>
                      <button
                        onClick={() => copyToClipboard(payment.number, `mobile-${index}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="কপি করুন"
                      >
                        {copiedIndex === `mobile-${index}` ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaCopy className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className={`${payment.bgColor} p-4 rounded-lg`}>
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      কীভাবে পাঠাবেন:
                    </p>
                    <ul className="space-y-2">
                      {payment.instructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-lg p-8 md:p-12 mb-8 text-white">
          <div className="text-center">
            <FaInfoCircle className="text-5xl mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">মহত্বপূর্ণ নোট</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-lg leading-relaxed">
              <p>
                • দান করার পর আমাদের সাথে যোগাযোগ করুন যাতে আমরা আপনার দান নিশ্চিত করতে পারি
              </p>
              <p>
                • দানের সময় Transaction ID বা Reference Number সংরক্ষণ করুন
              </p>
              <p>
                • আপনার দান সম্পূর্ণ স্বচ্ছতার সাথে ব্যবহার করা হবে
              </p>
              <p>
                • দানের রশিদ বা কনফার্মেশন পেতে আমাদের সাথে যোগাযোগ করুন
              </p>
              <p>
                • আপনার দান আমাদের মানবসেবা কার্যক্রমে গুরুত্বপূর্ণ ভূমিকা রাখবে
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaPhone className="text-blue-600" />
            যোগাযোগ করুন
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            দান সম্পর্কে আরও তথ্যের জন্য বা দান নিশ্চিত করার জন্য আমাদের সাথে যোগাযোগ করতে পারেন:
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
              <p className="text-gray-700">info@gsrs.org</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaHandHoldingHeart className="text-purple-600" />
                <h3 className="font-semibold text-gray-800">ফেসবুক</h3>
              </div>
              <a
                href="https://bit.ly/2MD8v2T"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://bit.ly/2MD8v2T
              </a>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaShieldAlt className="text-orange-600" />
                <h3 className="font-semibold text-gray-800">নিরাপত্তা</h3>
              </div>
              <p className="text-gray-700 text-sm">
                আপনার দান সম্পূর্ণ নিরাপদ এবং স্বচ্ছতার সাথে ব্যবহার করা হবে
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

