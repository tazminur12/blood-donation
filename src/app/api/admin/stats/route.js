import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    // Get all users
    const allUsers = await users.find({}).toArray();

    // Calculate stats
    const stats = {
      users: allUsers.length,
      donors: 0,
      volunteers: 0,
      requests: 0, // This would come from a requests collection if you have one
    };

    // Count users by role
    allUsers.forEach((user) => {
      const role = user.role || "user";
      if (role === "donor") {
        stats.donors++;
      } else if (role === "volunteer") {
        stats.volunteers++;
      }
    });

    // If you have a requests collection, you can add:
    // const requests = db.collection("requests");
    // const pendingRequests = await requests.countDocuments({ status: "pending" });
    // stats.requests = pendingRequests;

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

