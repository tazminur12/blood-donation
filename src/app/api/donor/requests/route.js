import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch blood requests
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
    const users = db.collection("users");
    const requestsCollection = db.collection("bloodRequests");

    // Get user's profile to filter by blood group
    const userEmail = session.user.email;
    const user = await users.findOne(
      { email: userEmail },
      { projection: { bloodGroup: 1, division: 1, district: 1, upazila: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get("bloodGroup");
    const division = searchParams.get("division");
    const district = searchParams.get("district");
    const status = searchParams.get("status"); // pending, fulfilled, cancelled
    const urgency = searchParams.get("urgency"); // urgent, normal
    const search = searchParams.get("search");

    // Build filter
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

    // Format requests
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
      requesterEmail: request.requesterEmail || null,
      fulfilledBy: request.fulfilledBy || null,
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

// POST - Create a new blood request
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      patientName,
      bloodGroup,
      units,
      hospital,
      address,
      division,
      district,
      upazila,
      contactPerson,
      contactNumber,
      urgency,
      description,
      requiredDate,
    } = body;

    // Validation
    if (!patientName || !bloodGroup || !contactNumber) {
      return NextResponse.json(
        { error: "Patient name, blood group, and contact number are required" },
        { status: 400 }
      );
    }

    if (!units || units < 1) {
      return NextResponse.json(
        { error: "Units must be at least 1" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const requestsCollection = db.collection("bloodRequests");

    const userEmail = session.user.email;

    // Create blood request
    const newRequest = {
      patientName,
      bloodGroup,
      units: parseInt(units) || 1,
      hospital: hospital || null,
      address: address || null,
      division: division || null,
      district: district || null,
      upazila: upazila || null,
      contactPerson: contactPerson || patientName,
      contactNumber,
      urgency: urgency || "normal",
      status: "pending",
      description: description || null,
      requiredDate: requiredDate ? new Date(requiredDate) : null,
      requesterEmail: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
      fulfilledBy: null,
    };

    const result = await requestsCollection.insertOne(newRequest);

    // Fetch created request
    const createdRequest = await requestsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedRequest = {
      id: createdRequest._id.toString(),
      patientName: createdRequest.patientName || null,
      bloodGroup: createdRequest.bloodGroup || null,
      units: createdRequest.units || 1,
      hospital: createdRequest.hospital || null,
      address: createdRequest.address || null,
      division: createdRequest.division || null,
      district: createdRequest.district || null,
      upazila: createdRequest.upazila || null,
      contactPerson: createdRequest.contactPerson || null,
      contactNumber: createdRequest.contactNumber || null,
      urgency: createdRequest.urgency || "normal",
      status: createdRequest.status || "pending",
      description: createdRequest.description || null,
      requiredDate: createdRequest.requiredDate || null,
      createdAt: createdRequest.createdAt || null,
      updatedAt: createdRequest.updatedAt || null,
      requesterEmail: createdRequest.requesterEmail || null,
      fulfilledBy: createdRequest.fulfilledBy || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Blood request created successfully",
        request: formattedRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blood request:", error);
    return NextResponse.json(
      { error: "Failed to create blood request" },
      { status: 500 }
    );
  }
}

