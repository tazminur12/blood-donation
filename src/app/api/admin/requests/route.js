import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all blood requests (admin only)
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    
    const user = await users.findOne({ email: session.user.email });
    const userRole = user?.role || session?.user?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    const requestsCollection = db.collection("bloodRequests");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending, active, fulfilled, cancelled
    const bloodGroup = searchParams.get("bloodGroup");
    const urgency = searchParams.get("urgency"); // urgent, normal
    const division = searchParams.get("division");
    const district = searchParams.get("district");
    const search = searchParams.get("search");

    // Build filter
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (bloodGroup && bloodGroup !== "all") {
      filter.bloodGroup = bloodGroup;
    }

    if (urgency && urgency !== "all") {
      filter.urgency = urgency;
    }

    if (division && division !== "all") {
      filter.division = division;
    }

    if (district && district !== "all") {
      filter.district = district;
    }

    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { hospital: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { contactNumber: { $regex: search, $options: "i" } },
        { requesterEmail: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch blood requests
    const requests = await requestsCollection
      .find(filter)
      .sort({ createdAt: -1, urgency: 1 }) // Sort by newest first, urgent first
      .toArray();

    // Get requester names
    const requesterEmails = [...new Set(requests.map(r => r.requesterEmail).filter(Boolean))];
    const requesters = await users.find(
      { email: { $in: requesterEmails } },
      { projection: { name: 1, email: 1, mobile: 1 } }
    ).toArray();
    
    const requesterMap = {};
    requesters.forEach(req => {
      requesterMap[req.email] = {
        name: req.name || null,
        mobile: req.mobile || null,
      };
    });

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
      requesterEmail: request.requesterEmail || null,
      requesterName: requesterMap[request.requesterEmail]?.name || null,
      requesterMobile: requesterMap[request.requesterEmail]?.mobile || null,
      fulfilledBy: request.fulfilledBy || null,
      fulfilledAt: request.fulfilledAt || null,
      createdAt: request.createdAt || null,
      updatedAt: request.updatedAt || null,
    }));

    // Get stats
    const totalRequests = await requestsCollection.countDocuments({});
    const pendingRequests = await requestsCollection.countDocuments({ status: { $in: ["pending", "active"] } });
    const fulfilledRequests = await requestsCollection.countDocuments({ status: "fulfilled" });
    const cancelledRequests = await requestsCollection.countDocuments({ status: "cancelled" });
    const urgentRequests = await requestsCollection.countDocuments({ urgency: "urgent", status: { $in: ["pending", "active"] } });

    return NextResponse.json(
      {
        requests: formattedRequests,
        stats: {
          total: totalRequests,
          pending: pendingRequests,
          fulfilled: fulfilledRequests,
          cancelled: cancelledRequests,
          urgent: urgentRequests,
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

// PUT - Update blood request status (admin only)
export async function PUT(request) {
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
    
    const user = await users.findOne({ email: session.user.email });
    const userRole = user?.role || session?.user?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "active", "fulfilled", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const requestsCollection = db.collection("bloodRequests");
    const { ObjectId } = await import("mongodb");

    // Get the request first
    const bloodRequest = await requestsCollection.findOne({
      _id: new ObjectId(requestId),
    });

    if (!bloodRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Update request
    const updateData = {
      status: status,
      updatedAt: new Date(),
    };

    if (status === "fulfilled" && !bloodRequest.fulfilledBy) {
      updateData.fulfilledBy = session.user.email;
      updateData.fulfilledAt = new Date();
    }

    const result = await requestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Get updated request
    const updatedRequest = await requestsCollection.findOne({
      _id: new ObjectId(requestId),
    });

    // Create notification for requester
    if (updatedRequest.requesterEmail) {
      const notificationsCollection = db.collection("notifications");
      const statusMessages = {
        active: "আপনার রক্তের অনুরোধ সক্রিয় করা হয়েছে",
        fulfilled: "আপনার রক্তের অনুরোধ পূরণ হয়েছে",
        cancelled: "আপনার রক্তের অনুরোধ বাতিল করা হয়েছে",
      };

      if (statusMessages[status]) {
        await notificationsCollection.insertOne({
          recipientEmail: updatedRequest.requesterEmail,
          type: status === "cancelled" ? "error" : status === "fulfilled" ? "success" : "info",
          title: "রক্তের অনুরোধ আপডেট",
          message: statusMessages[status],
          read: false,
          createdAt: new Date(),
          actionUrl: `/request/${requestId}`,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Request status updated successfully",
        request: {
          id: updatedRequest._id.toString(),
          status: updatedRequest.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

