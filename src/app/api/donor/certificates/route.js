import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch certificates for the logged-in donor
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const certificatesCollection = db.collection("certificates");

    const userEmail = session.user.email;

    // Fetch certificates
    const certificates = await certificatesCollection
      .find({ donorEmail: userEmail })
      .sort({ donationDate: -1, createdAt: -1 })
      .toArray();

    // Format certificates
    const formattedCertificates = certificates.map((cert) => ({
      id: cert._id.toString(),
      donationId: cert.donationId?.toString() || null,
      patientName: cert.patientName || null,
      bloodGroup: cert.bloodGroup || null,
      units: cert.units || 1,
      hospital: cert.hospital || null,
      donationDate: cert.donationDate || cert.createdAt || null,
      certificateNumber: cert.certificateNumber || null,
      createdAt: cert.createdAt || null,
    }));

    return NextResponse.json(
      {
        certificates: formattedCertificates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

