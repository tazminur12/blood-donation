import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch single photo
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
        { error: "Invalid photo ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const photosCollection = db.collection("galleryPhotos");

    const photo = await photosCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    const formattedPhoto = {
      id: photo._id.toString(),
      title: photo.title || "",
      description: photo.description || "",
      imageUrl: photo.imageUrl || "",
      category: photo.category || "general",
      tags: photo.tags || [],
      createdAt: photo.createdAt || null,
      updatedAt: photo.updatedAt || null,
      createdBy: photo.createdBy || "",
    };

    return NextResponse.json(
      { photo: formattedPhoto },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}

// PUT - Update photo
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
        { error: "Invalid photo ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, category, tags, imageUrl } = body;

    const photosCollection = db.collection("galleryPhotos");

    // Check if photo exists
    const photo = await photosCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    // Update photo
    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    await photosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated photo
    const updatedPhoto = await photosCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedPhoto = {
      id: updatedPhoto._id.toString(),
      title: updatedPhoto.title || "",
      description: updatedPhoto.description || "",
      imageUrl: updatedPhoto.imageUrl || "",
      category: updatedPhoto.category || "general",
      tags: updatedPhoto.tags || [],
      createdAt: updatedPhoto.createdAt || null,
      updatedAt: updatedPhoto.updatedAt || null,
      createdBy: updatedPhoto.createdBy || "",
    };

    return NextResponse.json(
      {
        message: "Photo updated successfully",
        photo: formattedPhoto,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    );
  }
}

