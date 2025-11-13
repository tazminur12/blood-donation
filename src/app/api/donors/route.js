import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all donors (public access)
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    // Fetch only donors (role === "donor") who are available
    const donorList = await users
      .find({ role: "donor" })
      .project({
        password: 0, // Exclude password
        email: 0, // Exclude email for privacy
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("Public donors fetched:", donorList.length);

    const formattedDonors = donorList.map((donor) => ({
      id: donor._id.toString(),
      name: donor.name || null,
      mobile: donor.mobile || null,
      image: donor.image || null,
      bloodGroup: donor.bloodGroup || null,
      division: donor.division || null,
      district: donor.district || null,
      upazila: donor.upazila || null,
      createdAt: donor.createdAt || null,
      lastDonation: donor.lastDonation || null,
      totalDonations: donor.totalDonations || 0,
      isAvailable: donor.isAvailable !== false, // Default to true
    }));

    // Calculate stats
    const stats = {
      total: formattedDonors.length,
      available: formattedDonors.filter(d => d.isAvailable).length,
      unavailable: formattedDonors.filter(d => !d.isAvailable).length,
      byBloodGroup: {},
    };

    // Count by blood group
    formattedDonors.forEach((donor) => {
      const bg = donor.bloodGroup || "Unknown";
      stats.byBloodGroup[bg] = (stats.byBloodGroup[bg] || 0) + 1;
    });

    return NextResponse.json({ 
      donors: formattedDonors,
      stats: stats,
      total: formattedDonors.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donors:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch donors",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

