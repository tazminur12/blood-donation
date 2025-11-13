import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// POST - Confirm donation for a blood request
export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to confirm donation" },
        { status: 401 }
      );
    }

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
    const users = db.collection("users");

    // Get user info
    const userEmail = session.user.email;
    const user = await users.findOne(
      { email: userEmail },
      { projection: { name: 1, bloodGroup: 1, mobile: 1, role: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is a donor
    if (user.role !== "donor" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Only donors can confirm donations" },
        { status: 403 }
      );
    }

    // Get the blood request
    const bloodRequest = await requestsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!bloodRequest) {
      return NextResponse.json(
        { error: "Blood request not found" },
        { status: 404 }
      );
    }

    // Check if request is already fulfilled
    if (bloodRequest.status === "fulfilled") {
      return NextResponse.json(
        { error: "This request has already been fulfilled" },
        { status: 400 }
      );
    }

    // Check if request is cancelled
    if (bloodRequest.status === "cancelled") {
      return NextResponse.json(
        { error: "This request has been cancelled" },
        { status: 400 }
      );
    }

    // Update the request status to fulfilled
    const result = await requestsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "fulfilled",
          fulfilledBy: userEmail,
          fulfilledAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Create a donation record
    const donationsCollection = db.collection("donations");
    const donationResult = await donationsCollection.insertOne({
      requestId: new ObjectId(id),
      donorEmail: userEmail,
      donorName: user.name || null,
      donorBloodGroup: user.bloodGroup || null,
      patientName: bloodRequest.patientName || null,
      bloodGroup: bloodRequest.bloodGroup || null,
      units: bloodRequest.units || 1,
      hospital: bloodRequest.hospital || null,
      donationDate: new Date(),
      status: "completed",
      createdAt: new Date(),
    });

    const donationId = donationResult.insertedId;

    // Get updated donation count
    const updatedUser = await users.findOne({ email: userEmail });
    const newTotalDonations = (updatedUser.totalDonations || 0) + 1;

    // Update user's donation count
    await users.updateOne(
      { email: userEmail },
      {
        $inc: { totalDonations: 1 },
        $set: { lastDonation: new Date() },
      }
    );

    // Generate certificate number
    const certificateNumber = `BD-${Date.now()}-${donationId.toString().slice(-6).toUpperCase()}`;

    // Create certificate
    const certificatesCollection = db.collection("certificates");
    await certificatesCollection.insertOne({
      donationId: donationId,
      donorEmail: userEmail,
      donorName: user.name || null,
      patientName: bloodRequest.patientName || null,
      bloodGroup: bloodRequest.bloodGroup || null,
      units: bloodRequest.units || 1,
      hospital: bloodRequest.hospital || null,
      donationDate: new Date(),
      certificateNumber: certificateNumber,
      createdAt: new Date(),
    });

    // Update badges based on donation count
    const badges = [];
    if (newTotalDonations >= 1) badges.push("first_donation");
    if (newTotalDonations >= 5) badges.push("bronze_donor");
    if (newTotalDonations >= 10) badges.push("silver_donor");
    if (newTotalDonations >= 25) badges.push("gold_donor");
    if (newTotalDonations >= 50) badges.push("platinum_donor");
    if (newTotalDonations >= 100) badges.push("diamond_donor");
    if (newTotalDonations >= 1 && bloodRequest.urgency === "urgent") badges.push("lifesaver");
    if (newTotalDonations >= 3) badges.push("regular_donor");

    // Update user badges
    await users.updateOne(
      { email: userEmail },
      {
        $set: {
          badges: badges,
          updatedAt: new Date(),
        },
      }
    );

    // Create notification for requester (if they exist)
    if (bloodRequest.requesterEmail) {
      const notificationsCollection = db.collection("notifications");
      await notificationsCollection.insertOne({
        recipientEmail: bloodRequest.requesterEmail,
        type: "success",
        title: "রক্তের অনুরোধ পূরণ হয়েছে",
        message: `${user.name || "একজন রক্তদাতা"} আপনার রক্তের অনুরোধ পূরণ করেছেন।`,
        read: false,
        createdAt: new Date(),
        actionUrl: `/request/${id}`,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Donation confirmed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error confirming donation:", error);
    return NextResponse.json(
      { error: "Failed to confirm donation" },
      { status: 500 }
    );
  }
}

