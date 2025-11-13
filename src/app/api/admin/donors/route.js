import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all donors
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();
    
    console.log("Session in donors API:", JSON.stringify(session?.user, null, 2));

    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // If role is not in session, fetch from database
    let userRole = session.user.role;
    if (!userRole) {
      console.log("Role not in session, fetching from database...");
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = db.collection("users");
      
      const dbUser = await users.findOne({ email: session.user.email });
      if (dbUser) {
        userRole = dbUser.role || "donor";
        console.log("Role from database:", userRole);
      }
    }

    console.log("Final user role:", userRole);

    // Check if user is admin
    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
          message: `Your current role is "${userRole}". Please contact an admin to change your role.`
        },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    // Fetch only donors (role === "donor")
    const donorList = await users
      .find({ role: "donor" })
      .project({
        password: 0, // Exclude password
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("Donors fetched:", donorList.length);

    const formattedDonors = donorList.map((donor) => ({
      id: donor._id.toString(),
      name: donor.name || null,
      email: donor.email || null,
      mobile: donor.mobile || null,
      image: donor.image || null,
      bloodGroup: donor.bloodGroup || null,
      division: donor.division || null,
      district: donor.district || null,
      upazila: donor.upazila || null,
      role: donor.role || "donor",
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

