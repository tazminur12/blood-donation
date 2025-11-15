import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all videos (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const videosCollection = db.collection("galleryVideos");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = category;
    }

    // Fetch videos
    const videos = await videosCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format videos
    const formattedVideos = videos.map((video) => ({
      id: video._id.toString(),
      title: video.title || "",
      description: video.description || "",
      youtubeUrl: video.youtubeUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      category: video.category || "general",
      tags: video.tags || [],
      duration: video.duration || "",
      createdAt: video.createdAt || null,
      updatedAt: video.updatedAt || null,
    }));

    // Get total count
    const totalCount = await videosCollection.countDocuments(filter);

    // Get categories for filter
    const categories = await videosCollection.distinct("category");

    return NextResponse.json(
      {
        videos: formattedVideos,
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
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

