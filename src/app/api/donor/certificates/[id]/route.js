import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Get certificate details for download/view
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid certificate ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const certificatesCollection = db.collection("certificates");
    const users = db.collection("users");

    const userEmail = session.user.email;

    // Get certificate
    const certificate = await certificatesCollection.findOne({
      _id: new ObjectId(id),
      donorEmail: userEmail,
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Get donor info
    const donor = await users.findOne(
      { email: userEmail },
      { projection: { name: 1, bloodGroup: 1, mobile: 1 } }
    );

    const formattedCertificate = {
      id: certificate._id.toString(),
      donationId: certificate.donationId?.toString() || null,
      donorName: donor?.name || null,
      donorBloodGroup: donor?.bloodGroup || null,
      patientName: certificate.patientName || null,
      bloodGroup: certificate.bloodGroup || null,
      units: certificate.units || 1,
      hospital: certificate.hospital || null,
      donationDate: certificate.donationDate || certificate.createdAt || null,
      certificateNumber: certificate.certificateNumber || null,
      createdAt: certificate.createdAt || null,
    };

    return NextResponse.json(
      {
        certificate: formattedCertificate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate" },
      { status: 500 }
    );
  }
}

