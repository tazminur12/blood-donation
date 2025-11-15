import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all committee members (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";
    const position = searchParams.get("position") || "";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const committeeCollection = db.collection("committee");

    // Build filter - only show active members
    const filter = {
      isActive: true,
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { position: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }
    if (position) {
      filter.position = position;
    }

    // Fetch committee members
    const members = await committeeCollection
      .find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format members
    const formattedMembers = members.map((member) => ({
      id: member._id.toString(),
      name: member.name || "",
      position: member.position || "",
      email: member.email || "",
      phone: member.phone || "",
      photo: member.photo || "",
      description: member.description || "",
      order: member.order || 0,
      createdAt: member.createdAt || null,
    }));

    // Get total count
    const totalCount = await committeeCollection.countDocuments(filter);

    // Get positions for filter
    const positions = await committeeCollection.distinct("position", filter);

    return NextResponse.json(
      {
        members: formattedMembers,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount,
        },
        positions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching committee members:", error);
    return NextResponse.json(
      { error: "Failed to fetch committee members" },
      { status: 500 }
    );
  }
}

