import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all photos
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    
    const user = await users.findOne(
      { email: session.user.email },
      { projection: { role: 1 } }
    );

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";

    const photosCollection = db.collection("galleryPhotos");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
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
      createdBy: photo.createdBy || session.user.email,
    }));

    // Get total count
    const totalCount = await photosCollection.countDocuments(filter);

    // Get stats
    const stats = {
      total: totalCount,
      byCategory: {},
    };

    const categories = await photosCollection.distinct("category");
    for (const category of categories) {
      stats.byCategory[category] = await photosCollection.countDocuments({
        ...filter,
        category,
      });
    }

    return NextResponse.json(
      {
        photos: formattedPhotos,
        stats,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount,
        },
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

// POST - Create new photo(s)
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    
    const user = await users.findOne(
      { email: session.user.email },
      { projection: { role: 1 } }
    );

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { photos } = body;

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: "Photos array is required" },
        { status: 400 }
      );
    }

    const photosCollection = db.collection("galleryPhotos");
    const userEmail = session.user.email;

    // Insert multiple photos
    const photosToInsert = photos.map((photo) => ({
      title: photo.title || "",
      description: photo.description || "",
      imageUrl: photo.imageUrl || "",
      category: photo.category || "general",
      tags: photo.tags || [],
      createdBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await photosCollection.insertMany(photosToInsert);

    // Fetch created photos
    const createdPhotoIds = Object.values(result.insertedIds);
    const createdPhotos = await photosCollection
      .find({
        _id: { $in: createdPhotoIds },
      })
      .toArray();

    const formattedPhotos = createdPhotos.map((photo) => ({
      id: photo._id.toString(),
      title: photo.title || "",
      description: photo.description || "",
      imageUrl: photo.imageUrl || "",
      category: photo.category || "general",
      tags: photo.tags || [],
      createdAt: photo.createdAt || null,
      updatedAt: photo.updatedAt || null,
      createdBy: photo.createdBy || userEmail,
    }));

    return NextResponse.json(
      {
        message: "Photos created successfully",
        photos: formattedPhotos,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating photos:", error);
    return NextResponse.json(
      { error: "Failed to create photos" },
      { status: 500 }
    );
  }
}

// DELETE - Delete photo(s)
export async function DELETE(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    
    const user = await users.findOne(
      { email: session.user.email },
      { projection: { role: 1 } }
    );

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("photoId");

    if (!photoId) {
      return NextResponse.json(
        { error: "Photo ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(photoId)) {
      return NextResponse.json(
        { error: "Invalid photo ID" },
        { status: 400 }
      );
    }

    const photosCollection = db.collection("galleryPhotos");

    // Check if photo exists
    const photo = await photosCollection.findOne({
      _id: new ObjectId(photoId),
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    // Delete photo
    await photosCollection.deleteOne({
      _id: new ObjectId(photoId),
    });

    return NextResponse.json(
      {
        message: "Photo deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}

