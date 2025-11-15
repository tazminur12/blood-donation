import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all notices
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

    const noticesCollection = db.collection("notices");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch notices
    const notices = await noticesCollection
      .find(filter)
      .sort({ createdAt: -1 })
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
      isActive: notice.isActive !== undefined ? notice.isActive : true,
      createdAt: notice.createdAt || null,
      updatedAt: notice.updatedAt || null,
      createdBy: notice.createdBy || session.user.email,
    }));

    // Get total count
    const totalCount = await noticesCollection.countDocuments(filter);

    // Get stats
    const stats = {
      total: totalCount,
      active: await noticesCollection.countDocuments({ ...filter, isActive: true }),
      expired: await noticesCollection.countDocuments({
        ...filter,
        expiryDate: { $lt: new Date() },
      }),
    };

    return NextResponse.json(
      {
        notices: formattedNotices,
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
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

// POST - Create new notice
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
    const { title, description, category, fileUrl, fileName, publishDate, expiryDate, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const noticesCollection = db.collection("notices");
    const userEmail = session.user.email;

    const noticeData = {
      title,
      description: description || "",
      category: category || "",
      fileUrl: fileUrl || "",
      fileName: fileName || "",
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await noticesCollection.insertOne(noticeData);

    // Fetch created notice
    const createdNotice = await noticesCollection.findOne({
      _id: result.insertedId,
    });

    const formattedNotice = {
      id: createdNotice._id.toString(),
      title: createdNotice.title || "",
      description: createdNotice.description || "",
      category: createdNotice.category || "",
      fileUrl: createdNotice.fileUrl || "",
      fileName: createdNotice.fileName || "",
      publishDate: createdNotice.publishDate || null,
      expiryDate: createdNotice.expiryDate || null,
      isActive: createdNotice.isActive !== undefined ? createdNotice.isActive : true,
      createdAt: createdNotice.createdAt || null,
      updatedAt: createdNotice.updatedAt || null,
      createdBy: createdNotice.createdBy || userEmail,
    };

    return NextResponse.json(
      {
        message: "Notice created successfully",
        notice: formattedNotice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}

// DELETE - Delete notice
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
    const noticeId = searchParams.get("noticeId");

    if (!noticeId) {
      return NextResponse.json(
        { error: "Notice ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(noticeId)) {
      return NextResponse.json(
        { error: "Invalid notice ID" },
        { status: 400 }
      );
    }

    const noticesCollection = db.collection("notices");

    // Check if notice exists
    const notice = await noticesCollection.findOne({
      _id: new ObjectId(noticeId),
    });

    if (!notice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }

    // Delete notice
    await noticesCollection.deleteOne({
      _id: new ObjectId(noticeId),
    });

    return NextResponse.json(
      {
        message: "Notice deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}

