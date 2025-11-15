import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch single notice
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
        { error: "Invalid notice ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const noticesCollection = db.collection("notices");

    const notice = await noticesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!notice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }

    const formattedNotice = {
      id: notice._id.toString(),
      title: notice.title || "",
      description: notice.description || "",
      category: notice.category || "",
      fileUrl: notice.fileUrl || "",
      fileName: notice.fileName || "",
      publishDate: notice.publishDate || null,
      expiryDate: notice.expiryDate || null,
      isActive: notice.isActive !== undefined ? notice.isActive : true,
      createdAt: notice.createdAt || null,
      updatedAt: notice.updatedAt || null,
      createdBy: notice.createdBy || "",
    };

    return NextResponse.json(
      { notice: formattedNotice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notice:", error);
    return NextResponse.json(
      { error: "Failed to fetch notice" },
      { status: 500 }
    );
  }
}

// PUT - Update notice
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
        { error: "Invalid notice ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, category, fileUrl, fileName, publishDate, expiryDate, isActive } = body;

    const noticesCollection = db.collection("notices");

    // Check if notice exists
    const notice = await noticesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!notice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }

    // Update notice
    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (fileName !== undefined) updateData.fileName = fileName;
    if (publishDate !== undefined) updateData.publishDate = publishDate ? new Date(publishDate) : null;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    await noticesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated notice
    const updatedNotice = await noticesCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedNotice = {
      id: updatedNotice._id.toString(),
      title: updatedNotice.title || "",
      description: updatedNotice.description || "",
      category: updatedNotice.category || "",
      fileUrl: updatedNotice.fileUrl || "",
      fileName: updatedNotice.fileName || "",
      publishDate: updatedNotice.publishDate || null,
      expiryDate: updatedNotice.expiryDate || null,
      isActive: updatedNotice.isActive !== undefined ? updatedNotice.isActive : true,
      createdAt: updatedNotice.createdAt || null,
      updatedAt: updatedNotice.updatedAt || null,
      createdBy: updatedNotice.createdBy || "",
    };

    return NextResponse.json(
      {
        message: "Notice updated successfully",
        notice: formattedNotice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notice:", error);
    return NextResponse.json(
      { error: "Failed to update notice" },
      { status: 500 }
    );
  }
}

