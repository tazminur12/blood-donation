import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all awards (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const organization = searchParams.get("organization") || "";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const awardsCollection = db.collection("awards");

    // Build filter - only show active awards
    const filter = {
      isActive: true,
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { organization: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (organization) {
      filter.organization = organization;
    }

    // Fetch awards
    const awards = await awardsCollection
      .find(filter)
      .sort({ awardDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format awards
    const formattedAwards = awards.map((award) => ({
      id: award._id.toString(),
      title: award.title || "",
      description: award.description || "",
      category: award.category || "",
      organization: award.organization || "",
      awardDate: award.awardDate || null,
      imageUrl: award.imageUrl || "",
      createdAt: award.createdAt || null,
    }));

    // Get total count
    const totalCount = await awardsCollection.countDocuments(filter);

    // Get categories and organizations for filter
    const categories = await awardsCollection.distinct("category", filter);
    const organizations = await awardsCollection.distinct("organization", filter);

    return NextResponse.json(
      {
        awards: formattedAwards,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount,
        },
        categories,
        organizations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json(
      { error: "Failed to fetch awards" },
      { status: 500 }
    );
  }
}

