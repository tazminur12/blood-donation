import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch single video
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid video ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const videosCollection = db.collection("galleryVideos");

    const video = await videosCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    const formattedVideo = {
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
      createdBy: video.createdBy || "",
    };

    return NextResponse.json(
      { video: formattedVideo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

// PUT - Update video
export async function PUT(request, { params }) {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid video ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, category, tags, youtubeUrl, thumbnailUrl, duration } = body;

    const videosCollection = db.collection("galleryVideos");

    // Check if video exists
    const video = await videosCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Extract YouTube video ID and generate thumbnail if URL changed
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

    // Update video
    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (duration !== undefined) updateData.duration = duration;
    
    if (youtubeUrl !== undefined) {
      updateData.youtubeUrl = youtubeUrl;
      const youtubeId = extractYouTubeId(youtubeUrl);
      if (youtubeId) {
        updateData.youtubeId = youtubeId;
        if (!thumbnailUrl) {
          updateData.thumbnailUrl = generateThumbnail(youtubeId);
        }
      }
    }
    
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;

    await videosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated video
    const updatedVideo = await videosCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedVideo = {
      id: updatedVideo._id.toString(),
      title: updatedVideo.title || "",
      description: updatedVideo.description || "",
      youtubeUrl: updatedVideo.youtubeUrl || "",
      thumbnailUrl: updatedVideo.thumbnailUrl || "",
      category: updatedVideo.category || "general",
      tags: updatedVideo.tags || [],
      duration: updatedVideo.duration || "",
      createdAt: updatedVideo.createdAt || null,
      updatedAt: updatedVideo.updatedAt || null,
      createdBy: updatedVideo.createdBy || "",
    };

    return NextResponse.json(
      {
        message: "Video updated successfully",
        video: formattedVideo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

