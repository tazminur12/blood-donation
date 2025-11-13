"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaSpinner,
  FaTint,
  FaCalendarAlt,
  FaHospital,
  FaDownload,
  FaFilePdf,
  FaAward,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2";

const bloodGroupColors = {
  "A+": "bg-red-100 text-red-700 border-red-200",
  "A-": "bg-red-50 text-red-600 border-red-100",
  "B+": "bg-blue-100 text-blue-700 border-blue-200",
  "B-": "bg-blue-50 text-blue-600 border-blue-100",
  "AB+": "bg-purple-100 text-purple-700 border-purple-200",
  "AB-": "bg-purple-50 text-purple-600 border-purple-100",
  "O+": "bg-green-100 text-green-700 border-green-200",
  "O-": "bg-green-50 text-green-600 border-green-100",
  "Unknown": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function CertificatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadCertificates();
    }
  }, [session, status, router]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/donor/certificates");
      const data = await res.json();
      
      if (res.ok) {
        setCertificates(data.certificates || []);
      } else {
        console.error("Error loading certificates:", data);
      }
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "নির্ধারিত নয়";
    try {
      return new Date(date).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "নির্ধারিত নয়";
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const res = await fetch(`/api/donor/certificates/${certificateId}`);
      const data = await res.json();
      
      if (res.ok) {
        // Generate and download certificate
        generateCertificatePDF(data.certificate);
      } else {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: "সার্টিফিকেট লোড করতে ব্যর্থ হয়েছে",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সার্টিফিকেট ডাউনলোড করতে ব্যর্থ হয়েছে",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const generateCertificatePDF = (certificate) => {
    const donationDate = certificate.donationDate 
      ? new Date(certificate.donationDate).toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        })
      : new Date().toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        });

    // Create professional certificate matching the design
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate of Blood Donation</title>
        <style>
          @page { 
            size: A4 landscape; 
            margin: 0; 
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            margin: 0;
            padding: 50px;
            background: #f5f5f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            width: 100%;
            max-width: 1000px;
            min-height: 650px;
            position: relative;
            padding: 60px 80px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          
          /* Decorative corner shapes */
          .corner-shape-top {
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 200px;
            background: #dc2626;
            transform: rotate(45deg);
            transform-origin: top right;
            margin-top: -100px;
            margin-right: -100px;
          }
          .corner-shape-top::before {
            content: '';
            position: absolute;
            top: 50px;
            right: 50px;
            width: 150px;
            height: 150px;
            background: #ef4444;
            transform: rotate(-45deg);
          }
          .corner-shape-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200px;
            height: 200px;
            background: #dc2626;
            transform: rotate(-45deg);
            transform-origin: bottom left;
            margin-bottom: -100px;
            margin-left: -100px;
          }
          .corner-shape-bottom::before {
            content: '';
            position: absolute;
            bottom: 50px;
            left: 50px;
            width: 150px;
            height: 150px;
            background: #ef4444;
            transform: rotate(45deg);
          }
          
          /* Background blood drop */
          .blood-drop-bg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 500px;
            background: rgba(220, 38, 38, 0.05);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            z-index: 0;
          }
          
          /* Header */
          .header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
          }
          .logo {
            width: 50px;
            height: 50px;
            background: #dc2626;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
          }
          .org-name {
            font-size: 20px;
            font-weight: bold;
            color: #000;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          
          /* Title */
          .title-section {
            text-align: center;
            margin-bottom: 50px;
            position: relative;
            z-index: 1;
          }
          .main-title {
            font-size: 48px;
            font-weight: bold;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 10px;
          }
          .sub-title {
            font-size: 18px;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          /* Certificate text */
          .certificate-text {
            text-align: center;
            margin: 50px 0;
            position: relative;
            z-index: 1;
          }
          .presented-text {
            font-family: 'Georgia', serif;
            font-size: 24px;
            color: #dc2626;
            font-style: italic;
            margin-bottom: 30px;
            font-weight: normal;
          }
          .donor-name {
            font-size: 42px;
            font-weight: bold;
            color: #dc2626;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 30px 0;
            line-height: 1.2;
          }
          .acknowledgment {
            font-size: 16px;
            color: #000;
            line-height: 1.8;
            max-width: 700px;
            margin: 30px auto;
          }
          
          /* Footer */
          .footer {
            position: absolute;
            bottom: 50px;
            left: 0;
            right: 0;
            padding: 0 80px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            position: relative;
            z-index: 1;
            margin-top: 60px;
          }
          .date-location {
            text-align: left;
          }
          .date-location p {
            font-size: 14px;
            color: #000;
            margin-bottom: 5px;
            text-decoration: underline;
          }
          .award-seal {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            border-radius: 50%;
            border: 8px solid #dc2626;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 2;
          }
          .award-seal::after {
            content: '✓';
            font-size: 60px;
            color: white;
            font-weight: bold;
          }
          .ribbon {
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 40px;
            background: #dc2626;
            z-index: 1;
          }
          .ribbon::before,
          .ribbon::after {
            content: '';
            position: absolute;
            bottom: 0;
            width: 30px;
            height: 30px;
            background: #dc2626;
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          .ribbon::before {
            left: -15px;
          }
          .ribbon::after {
            right: -15px;
          }
          .signature-section {
            text-align: right;
          }
          .signature-title {
            font-size: 14px;
            color: #000;
            margin-bottom: 40px;
          }
          .signature-line {
            width: 200px;
            height: 2px;
            background: #000;
            margin: 0 0 10px auto;
            border-radius: 2px;
          }
          .signature-name {
            font-size: 14px;
            color: #000;
            text-decoration: underline;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .certificate {
              box-shadow: none;
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <!-- Decorative corner shapes -->
          <div class="corner-shape-top"></div>
          <div class="corner-shape-bottom"></div>
          
          <!-- Background blood drop -->
          <div class="blood-drop-bg"></div>
          
          <!-- Header -->
          <div class="header">
            <div class="logo">🩸</div>
            <div class="org-name">গোবিন্দগঞ্জ স্বেচ্ছায় রক্তদান সংগঠন (G.S.R.S)</div>
          </div>
          
          <!-- Title -->
          <div class="title-section">
            <div class="main-title">CERTIFICATE</div>
            <div class="sub-title">OF BLOOD DONATION</div>
          </div>
          
          <!-- Certificate Content -->
          <div class="certificate-text">
            <div class="presented-text">This Certificate is Presented to</div>
            <div class="donor-name">${certificate.donorName?.toUpperCase() || "BLOOD DONOR"}</div>
            <div class="acknowledgment">
              for following and participating in blood donation. Thank you. We really appreciate your actions.
              ${certificate.patientName ? `This donation was made for ${certificate.patientName}.` : ""}
              ${certificate.hospital ? `Donation was made at ${certificate.hospital}.` : ""}
              ${certificate.bloodGroup ? `Blood Group: ${certificate.bloodGroup}` : ""}
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="date-location">
              <p>${donationDate}</p>
              <p>${certificate.hospital || "Blood Donation Center"}</p>
            </div>
            
            <div class="award-seal">
              <div class="ribbon"></div>
            </div>
            
            <div class="signature-section">
              <div class="signature-title">Head of The Blood Donation Unit</div>
              <div class="signature-line"></div>
              <div class="signature-name">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(certificateHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <FaAward className="text-rose-600" />
          আমার সার্টিফিকেট
        </h1>
        <p className="text-slate-600 mt-1">
          আপনার রক্তদানের সার্টিফিকেট দেখুন এবং ডাউনলোড করুন
        </p>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {certificates.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <FaAward className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">কোন সার্টিফিকেট পাওয়া যায়নি</p>
            <p className="text-slate-500 text-sm mt-2">
              আপনি এখনও কোন রক্তদান করেননি
            </p>
          </div>
        ) : (
          certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Side - Certificate Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FaAward className="text-rose-600" />
                        রক্তদান সার্টিফিকেট
                      </h3>
                      {certificate.certificateNumber && (
                        <span className="text-sm text-slate-500">
                          #{certificate.certificateNumber}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {certificate.patientName && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaUser className="text-sky-600" />
                          <span>রোগী: {certificate.patientName}</span>
                        </div>
                      )}
                      {certificate.bloodGroup && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaTint className="text-sky-600" />
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                              bloodGroupColors[certificate.bloodGroup] || bloodGroupColors["Unknown"]
                            }`}
                          >
                            {certificate.bloodGroup}
                          </span>
                        </div>
                      )}
                      {certificate.hospital && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaHospital className="text-sky-600" />
                          <span>{certificate.hospital}</span>
                        </div>
                      )}
                      {certificate.donationDate && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="text-sky-600" />
                          <span>{formatDate(certificate.donationDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>ইউনিট: {certificate.units || 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Download Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDownloadCertificate(certificate.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                    >
                      <FaDownload />
                      <span>ডাউনলোড</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

