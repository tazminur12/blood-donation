import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch a single blood request by ID (public access)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const requestsCollection = db.collection("bloodRequests");

    const requestDoc = await requestsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!requestDoc) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Format request (exclude sensitive info like requesterEmail)
    const formattedRequest = {
      id: requestDoc._id.toString(),
      patientName: requestDoc.patientName || null,
      bloodGroup: requestDoc.bloodGroup || null,
      units: requestDoc.units || 1,
      hospital: requestDoc.hospital || null,
      address: requestDoc.address || null,
      division: requestDoc.division || null,
      district: requestDoc.district || null,
      upazila: requestDoc.upazila || null,
      contactPerson: requestDoc.contactPerson || null,
      contactNumber: requestDoc.contactNumber || null,
      urgency: requestDoc.urgency || "normal",
      status: requestDoc.status || "pending",
      description: requestDoc.description || null,
      requiredDate: requestDoc.requiredDate || null,
      createdAt: requestDoc.createdAt || null,
      updatedAt: requestDoc.updatedAt || null,
    };

    return NextResponse.json(
      { request: formattedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blood request:", error);
    return NextResponse.json(
      { error: "Failed to fetch blood request" },
      { status: 500 }
    );
  }
}

