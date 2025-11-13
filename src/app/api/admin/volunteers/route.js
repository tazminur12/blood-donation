import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all volunteers
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();
    
    console.log("Session in volunteers API:", JSON.stringify(session?.user, null, 2));

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

    // Fetch only volunteers (role === "volunteer")
    const volunteerList = await users
      .find({ role: "volunteer" })
      .project({
        password: 0, // Exclude password
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("Volunteers fetched:", volunteerList.length);

    const formattedVolunteers = volunteerList.map((volunteer) => ({
      id: volunteer._id.toString(),
      name: volunteer.name || null,
      email: volunteer.email || null,
      mobile: volunteer.mobile || null,
      image: volunteer.image || null,
      bloodGroup: volunteer.bloodGroup || null,
      division: volunteer.division || null,
      district: volunteer.district || null,
      upazila: volunteer.upazila || null,
      role: volunteer.role || "volunteer",
      createdAt: volunteer.createdAt || null,
      totalEvents: volunteer.totalEvents || 0,
      totalHours: volunteer.totalHours || 0,
      totalCampaigns: volunteer.totalCampaigns || 0,
      isActive: volunteer.isActive !== false, // Default to true
      skills: volunteer.skills || [],
      interests: volunteer.interests || [],
    }));

    // Calculate stats
    const stats = {
      total: formattedVolunteers.length,
      active: formattedVolunteers.filter(v => v.isActive).length,
      inactive: formattedVolunteers.filter(v => !v.isActive).length,
      byBloodGroup: {},
      totalEvents: formattedVolunteers.reduce((sum, v) => sum + (v.totalEvents || 0), 0),
      totalHours: formattedVolunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0),
      totalCampaigns: formattedVolunteers.reduce((sum, v) => sum + (v.totalCampaigns || 0), 0),
    };

    // Count by blood group
    formattedVolunteers.forEach((volunteer) => {
      const bg = volunteer.bloodGroup || "Unknown";
      stats.byBloodGroup[bg] = (stats.byBloodGroup[bg] || 0) + 1;
    });

    return NextResponse.json({ 
      volunteers: formattedVolunteers,
      stats: stats,
      total: formattedVolunteers.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch volunteers",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

