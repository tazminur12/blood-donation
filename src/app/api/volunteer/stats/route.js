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
      events: 0,
      hours: 0,
      campaigns: 0,
    };

    // If you have collections for events, campaigns, etc., you can query them:
    // const events = db.collection("events");
    // const volunteerEvents = await events.countDocuments({ 
    //   volunteerEmails: userEmail 
    // });
    // stats.events = volunteerEvents;

    // const volunteerHours = await events.aggregate([
    //   { $match: { volunteerEmails: userEmail } },
    //   { $group: { _id: null, totalHours: { $sum: "$hours" } } }
    // ]).toArray();
    // stats.hours = volunteerHours[0]?.totalHours || 0;

    // const campaigns = db.collection("campaigns");
    // const volunteerCampaigns = await campaigns.countDocuments({ 
    //   volunteerEmails: userEmail 
    // });
    // stats.campaigns = volunteerCampaigns;

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

