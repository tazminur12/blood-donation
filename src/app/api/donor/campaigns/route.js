import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all campaigns for donors (read-only access)
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();

    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const campaigns = db.collection("campaigns");

    // Fetch all campaigns (donors can view all campaigns)
    const campaignList = await campaigns
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedCampaigns = campaignList.map((campaign) => ({
      id: campaign._id.toString(),
      title: campaign.title || null,
      description: campaign.description || null,
      image: campaign.image || null,
      startDate: campaign.startDate || null,
      endDate: campaign.endDate || null,
      location: campaign.location || null,
      division: campaign.division || null,
      district: campaign.district || null,
      upazila: campaign.upazila || null,
      status: campaign.status || "upcoming",
      organizer: campaign.organizer || null,
      organizerName: campaign.organizerName || null,
      organizerEmail: campaign.organizerEmail || null,
      targetDonors: campaign.targetDonors || 0,
      targetBloodUnits: campaign.targetBloodUnits || 0,
      registeredDonors: campaign.registeredDonors || 0,
      collectedBloodUnits: campaign.collectedBloodUnits || 0,
      volunteers: campaign.volunteers || [],
      volunteerCount: Array.isArray(campaign.volunteers) ? campaign.volunteers.length : 0,
      createdAt: campaign.createdAt || null,
      updatedAt: campaign.updatedAt || null,
    }));

    // Calculate stats
    const now = new Date();
    const stats = {
      total: formattedCampaigns.length,
      upcoming: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      totalTargetDonors: 0,
      totalTargetBloodUnits: 0,
      totalRegisteredDonors: 0,
      totalCollectedBloodUnits: 0,
      totalVolunteers: 0,
    };

    formattedCampaigns.forEach((campaign) => {
      const status = campaign.status || "upcoming";
      
      if (status === "cancelled") {
        stats.cancelled++;
      } else if (status === "completed") {
        stats.completed++;
      } else {
        // Check if campaign is active based on dates
        const startDate = campaign.startDate ? new Date(campaign.startDate) : null;
        const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
        
        if (startDate && endDate) {
          if (now >= startDate && now <= endDate) {
            stats.active++;
          } else if (now < startDate) {
            stats.upcoming++;
          } else {
            stats.completed++;
          }
        } else {
          stats.upcoming++;
        }
      }

      stats.totalTargetDonors += campaign.targetDonors || 0;
      stats.totalTargetBloodUnits += campaign.targetBloodUnits || 0;
      stats.totalRegisteredDonors += campaign.registeredDonors || 0;
      stats.totalCollectedBloodUnits += campaign.collectedBloodUnits || 0;
      stats.totalVolunteers += campaign.volunteerCount || 0;
    });

    return NextResponse.json({ 
      campaigns: formattedCampaigns,
      stats: stats,
      total: formattedCampaigns.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    
    // If campaigns collection doesn't exist, return empty array
    if (error.message?.includes("collection") || error.code === 26) {
      return NextResponse.json({ 
        campaigns: [],
        stats: {
          total: 0,
          upcoming: 0,
          active: 0,
          completed: 0,
          cancelled: 0,
          totalTargetDonors: 0,
          totalTargetBloodUnits: 0,
          totalRegisteredDonors: 0,
          totalCollectedBloodUnits: 0,
          totalVolunteers: 0,
        },
        total: 0 
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch campaigns",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

