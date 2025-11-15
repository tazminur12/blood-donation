import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all photos (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const photosCollection = db.collection("galleryPhotos");

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

    // Fetch photos
    const photos = await photosCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format photos
    const formattedPhotos = photos.map((photo) => ({
      id: photo._id.toString(),
      title: photo.title || "",
      description: photo.description || "",
      imageUrl: photo.imageUrl || "",
      category: photo.category || "general",
      tags: photo.tags || [],
      createdAt: photo.createdAt || null,
      updatedAt: photo.updatedAt || null,
    }));

    // Get total count
    const totalCount = await photosCollection.countDocuments(filter);

    // Get categories for filter
    const categories = await photosCollection.distinct("category");

    return NextResponse.json(
      {
        photos: formattedPhotos,
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
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

