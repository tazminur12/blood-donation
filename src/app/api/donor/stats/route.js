import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

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

    // Get user's email
    const userEmail = session.user.email;

    // Initialize stats
    const stats = {
      donations: 0,
      appointments: 0,
      history: 0,
      requests: 0,
    };

    // Count blood requests created by this user
    const bloodRequests = db.collection("bloodRequests");
    const userRequests = await bloodRequests.countDocuments({ requesterEmail: userEmail });
    stats.requests = userRequests;

    // If you have collections for donations, appointments, etc., you can query them:
    // const donations = db.collection("donations");
    // const userDonations = await donations.countDocuments({ donorEmail: userEmail });
    // stats.donations = userDonations;

    // const appointments = db.collection("appointments");
    // const userAppointments = await appointments.countDocuments({ 
    //   donorEmail: userEmail,
    //   status: { $in: ["pending", "confirmed"] }
    // });
    // stats.appointments = userAppointments;

    // const allDonations = await donations.countDocuments({ donorEmail: userEmail });
    // stats.history = allDonations;

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

