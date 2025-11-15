import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all notices (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const noticesCollection = db.collection("notices");

    // Build filter - only show active notices that haven't expired
    const filter = {
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ],
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }
    if (category) {
      filter.category = category;
    }

    // Fetch notices
    const notices = await noticesCollection
      .find(filter)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format notices
    const formattedNotices = notices.map((notice) => ({
      id: notice._id.toString(),
      title: notice.title || "",
      description: notice.description || "",
      category: notice.category || "",
      fileUrl: notice.fileUrl || "",
      fileName: notice.fileName || "",
      publishDate: notice.publishDate || null,
      expiryDate: notice.expiryDate || null,
      createdAt: notice.createdAt || null,
    }));

    // Get total count
    const totalCount = await noticesCollection.countDocuments(filter);

    // Get categories for filter
    const categories = await noticesCollection.distinct("category", filter);

    return NextResponse.json(
      {
        notices: formattedNotices,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount,
        },
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

