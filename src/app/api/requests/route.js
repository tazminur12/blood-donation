import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch blood requests (public access)
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const requestsCollection = db.collection("bloodRequests");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get("bloodGroup");
    const division = searchParams.get("division");
    const district = searchParams.get("district");
    const status = searchParams.get("status"); // pending, fulfilled, cancelled
    const urgency = searchParams.get("urgency"); // urgent, normal
    const search = searchParams.get("search");

    // Build filter - only show active/pending requests by default
    const filter = {};

    // Only filter by status if specified and not "all"
    if (status && status !== "all") {
      filter.status = status;
    } else if (!status) {
      // Default: show only active/pending requests
      filter.status = { $in: ["pending", "active"] };
    }

    if (bloodGroup && bloodGroup !== "all") {
      filter.bloodGroup = bloodGroup;
    }

    if (division && division !== "all") {
      filter.division = division;
    }

    if (district && district !== "all") {
      filter.district = district;
    }

    if (urgency && urgency !== "all") {
      filter.urgency = urgency;
    }

    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { hospital: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch blood requests
    const requests = await requestsCollection
      .find(filter)
      .sort({ createdAt: -1, urgency: 1 }) // Sort by newest first, urgent first
      .toArray();

    // Format requests (exclude sensitive info like requesterEmail)
    const formattedRequests = requests.map((request) => ({
      id: request._id.toString(),
      patientName: request.patientName || null,
      bloodGroup: request.bloodGroup || null,
      units: request.units || 1,
      hospital: request.hospital || null,
      address: request.address || null,
      division: request.division || null,
      district: request.district || null,
      upazila: request.upazila || null,
      contactPerson: request.contactPerson || null,
      contactNumber: request.contactNumber || null,
      urgency: request.urgency || "normal",
      status: request.status || "pending",
      description: request.description || null,
      requiredDate: request.requiredDate || null,
      createdAt: request.createdAt || null,
      updatedAt: request.updatedAt || null,
    }));

    // Get stats
    const totalRequests = await requestsCollection.countDocuments({});
    const pendingRequests = await requestsCollection.countDocuments({ status: { $in: ["pending", "active"] } });
    const fulfilledRequests = await requestsCollection.countDocuments({ status: "fulfilled" });

    return NextResponse.json(
      {
        requests: formattedRequests,
        stats: {
          total: totalRequests,
          pending: pendingRequests,
          fulfilled: fulfilledRequests,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch blood requests" },
      { status: 500 }
    );
  }
}

