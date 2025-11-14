import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid content creator ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const contentCreatorsCollection = db.collection("contentCreators");

    const creator = await contentCreatorsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: "Content creator not found" },
        { status: 404 }
      );
    }

    const formattedCreator = {
      id: creator._id.toString(),
      name: creator.name || "",
      image: creator.image || "",
      specialty: creator.specialty || "",
      email: creator.email || "",
      facebook: creator.facebook || "",
      instagram: creator.instagram || "",
      youtube: creator.youtube || "",
      tiktok: creator.tiktok || "",
      createdAt: creator.createdAt || null,
      updatedAt: creator.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        contentCreator: formattedCreator,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching content creator:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content creator" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      image,
      specialty,
      email,
      facebook,
      instagram,
      youtube,
      tiktok,
    } = body;

    // Validation
    if (!name || !specialty || !email) {
      return NextResponse.json(
        { success: false, error: "Name, specialty, and email are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const contentCreatorsCollection = db.collection("contentCreators");

    // Check if content creator exists
    const existingCreator = await contentCreatorsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingCreator) {
      return NextResponse.json(
        { success: false, error: "Content creator not found" },
        { status: 404 }
      );
    }

    // Update content creator
    const updateData = {
      name,
      image: image || "",
      specialty,
      email,
      facebook: facebook || "",
      instagram: instagram || "",
      youtube: youtube || "",
      tiktok: tiktok || "",
      updatedAt: new Date(),
    };

    await contentCreatorsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated content creator
    const updatedCreator = await contentCreatorsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedCreator = {
      id: updatedCreator._id.toString(),
      name: updatedCreator.name || "",
      image: updatedCreator.image || "",
      specialty: updatedCreator.specialty || "",
      email: updatedCreator.email || "",
      facebook: updatedCreator.facebook || "",
      instagram: updatedCreator.instagram || "",
      youtube: updatedCreator.youtube || "",
      tiktok: updatedCreator.tiktok || "",
      createdAt: updatedCreator.createdAt || null,
      updatedAt: updatedCreator.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Content creator information updated successfully",
        contentCreator: formattedCreator,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating content creator:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update content creator information" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const contentCreatorsCollection = db.collection("contentCreators");

    // Check if content creator exists
    const existingCreator = await contentCreatorsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingCreator) {
      return NextResponse.json(
        { success: false, error: "Content creator not found" },
        { status: 404 }
      );
    }

    await contentCreatorsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content creator deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting content creator:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete content creator" },
      { status: 500 }
    );
  }
}

