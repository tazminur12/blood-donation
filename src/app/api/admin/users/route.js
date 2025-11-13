import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all users
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();
    
    console.log("Session in users API:", JSON.stringify(session?.user, null, 2));

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

    // Get total count first
    const totalCount = await users.countDocuments({});
    console.log("Total users in database:", totalCount);

    // Fetch all users
    const userList = await users
      .find({})
      .project({
        password: 0, // Exclude password
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("Users fetched:", userList.length);

    const formattedUsers = userList.map((user) => ({
      id: user._id.toString(),
      name: user.name || null,
      email: user.email || null,
      mobile: user.mobile || null,
      image: user.image || null,
      bloodGroup: user.bloodGroup || null,
      division: user.division || null,
      district: user.district || null,
      upazila: user.upazila || null,
      role: user.role || "user",
      createdAt: user.createdAt || null,
      lastLogin: user.lastLogin || null,
      isActive: user.isActive !== false, // Default to true
    }));

    // Calculate stats
    const stats = {
      total: formattedUsers.length,
      admin: 0,
      donor: 0,
      volunteer: 0,
      user: 0,
      active: 0,
      inactive: 0,
      byBloodGroup: {},
    };

    // Count by role and status
    formattedUsers.forEach((user) => {
      const role = user.role || "user";
      if (stats[role] !== undefined) {
        stats[role]++;
      }
      
      if (user.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }

      // Count by blood group
      const bg = user.bloodGroup || "Unknown";
      stats.byBloodGroup[bg] = (stats.byBloodGroup[bg] || 0) + 1;
    });

    return NextResponse.json({ 
      users: formattedUsers,
      stats: stats,
      total: formattedUsers.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch users",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

