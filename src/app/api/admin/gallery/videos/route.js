import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all videos
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

    const videosCollection = db.collection("galleryVideos");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
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
      createdBy: video.createdBy || session.user.email,
    }));

    // Get total count
    const totalCount = await videosCollection.countDocuments(filter);

    // Get stats
    const stats = {
      total: totalCount,
      byCategory: {},
    };

    const categories = await videosCollection.distinct("category");
    for (const category of categories) {
      stats.byCategory[category] = await videosCollection.countDocuments({
        ...filter,
        category,
      });
    }

    return NextResponse.json(
      {
        videos: formattedVideos,
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
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST - Create new video(s)
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
    const { videos } = body;

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "Videos array is required" },
        { status: 400 }
      );
    }

    const videosCollection = db.collection("galleryVideos");
    const userEmail = session.user.email;

    // Extract YouTube video ID and generate thumbnail
    const extractYouTubeId = (url) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const generateThumbnail = (youtubeId) => {
      if (!youtubeId) return "";
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    };

    // Insert multiple videos
    const videosToInsert = videos.map((video) => {
      const youtubeId = extractYouTubeId(video.youtubeUrl);
      return {
        title: video.title || "",
        description: video.description || "",
        youtubeUrl: video.youtubeUrl || "",
        youtubeId: youtubeId || "",
        thumbnailUrl: video.thumbnailUrl || (youtubeId ? generateThumbnail(youtubeId) : ""),
        category: video.category || "general",
        tags: video.tags || [],
        duration: video.duration || "",
        createdBy: userEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const result = await videosCollection.insertMany(videosToInsert);

    // Fetch created videos
    const createdVideoIds = Object.values(result.insertedIds);
    const createdVideos = await videosCollection
      .find({
        _id: { $in: createdVideoIds },
      })
      .toArray();

    const formattedVideos = createdVideos.map((video) => ({
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
      createdBy: video.createdBy || userEmail,
    }));

    return NextResponse.json(
      {
        message: "Videos created successfully",
        videos: formattedVideos,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating videos:", error);
    return NextResponse.json(
      { error: "Failed to create videos" },
      { status: 500 }
    );
  }
}

// DELETE - Delete video(s)
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
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(videoId)) {
      return NextResponse.json(
        { error: "Invalid video ID" },
        { status: 400 }
      );
    }

    const videosCollection = db.collection("galleryVideos");

    // Check if video exists
    const video = await videosCollection.findOne({
      _id: new ObjectId(videoId),
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Delete video
    await videosCollection.deleteOne({
      _id: new ObjectId(videoId),
    });

    return NextResponse.json(
      {
        message: "Video deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}

