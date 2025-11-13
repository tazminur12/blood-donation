import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch donation history for the logged-in donor
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
    const donationsCollection = db.collection("donations");

    const userEmail = session.user.email;

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const status = searchParams.get("status"); // completed, pending, cancelled
    const bloodGroup = searchParams.get("bloodGroup");

    // Build filter
    const filter = { donorEmail: userEmail };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (bloodGroup && bloodGroup !== "all") {
      filter.bloodGroup = bloodGroup;
    }

    // Fetch donations
    const donations = await donationsCollection
      .find(filter)
      .sort({ donationDate: -1, createdAt: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format donations
    const formattedDonations = donations.map((donation) => ({
      id: donation._id.toString(),
      requestId: donation.requestId?.toString() || null,
      patientName: donation.patientName || null,
      bloodGroup: donation.bloodGroup || null,
      units: donation.units || 1,
      hospital: donation.hospital || null,
      donationDate: donation.donationDate || donation.createdAt || null,
      status: donation.status || "completed",
      createdAt: donation.createdAt || null,
    }));

    // Get total count for pagination
    const totalCount = await donationsCollection.countDocuments(filter);

    // Get stats
    const totalDonations = await donationsCollection.countDocuments({ donorEmail: userEmail });
    const completedDonations = await donationsCollection.countDocuments({ 
      donorEmail: userEmail,
      status: "completed" 
    });
    const totalUnits = await donationsCollection.aggregate([
      { $match: { donorEmail: userEmail, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$units" } } }
    ]).toArray();

    const stats = {
      total: totalDonations,
      completed: completedDonations,
      totalUnits: totalUnits[0]?.total || 0,
    };

    return NextResponse.json(
      {
        donations: formattedDonations,
        stats: stats,
        pagination: {
          total: totalCount,
          limit: limit,
          skip: skip,
          hasMore: skip + limit < totalCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation history" },
      { status: 500 }
    );
  }
}

