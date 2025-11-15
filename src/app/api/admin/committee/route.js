import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all committee members
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

    const committeeCollection = db.collection("committee");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch committee members
    const members = await committeeCollection
      .find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format members
    const formattedMembers = members.map((member) => ({
      id: member._id.toString(),
      name: member.name || "",
      position: member.position || "",
      email: member.email || "",
      phone: member.phone || "",
      photo: member.photo || "",
      description: member.description || "",
      order: member.order || 0,
      isActive: member.isActive !== undefined ? member.isActive : true,
      createdAt: member.createdAt || null,
      updatedAt: member.updatedAt || null,
      createdBy: member.createdBy || session.user.email,
    }));

    // Get total count
    const totalCount = await committeeCollection.countDocuments(filter);

    // Get stats
    const stats = {
      total: totalCount,
      active: await committeeCollection.countDocuments({ ...filter, isActive: true }),
      byPosition: {},
    };

    const positions = await committeeCollection.distinct("position");
    for (const position of positions) {
      stats.byPosition[position] = await committeeCollection.countDocuments({
        ...filter,
        position: position,
      });
    }

    return NextResponse.json(
      {
        members: formattedMembers,
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
    console.error("Error fetching committee members:", error);
    return NextResponse.json(
      { error: "Failed to fetch committee members" },
      { status: 500 }
    );
  }
}

// POST - Create new committee member
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
    const { name, position, email, phone, photo, description, order, isActive } = body;

    if (!name || !position) {
      return NextResponse.json(
        { error: "Name and position are required" },
        { status: 400 }
      );
    }

    const committeeCollection = db.collection("committee");
    const userEmail = session.user.email;

    const memberData = {
      name,
      position,
      email: email || "",
      phone: phone || "",
      photo: photo || "",
      description: description || "",
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await committeeCollection.insertOne(memberData);

    // Fetch created member
    const createdMember = await committeeCollection.findOne({
      _id: result.insertedId,
    });

    const formattedMember = {
      id: createdMember._id.toString(),
      name: createdMember.name || "",
      position: createdMember.position || "",
      email: createdMember.email || "",
      phone: createdMember.phone || "",
      photo: createdMember.photo || "",
      description: createdMember.description || "",
      order: createdMember.order || 0,
      isActive: createdMember.isActive !== undefined ? createdMember.isActive : true,
      createdAt: createdMember.createdAt || null,
      updatedAt: createdMember.updatedAt || null,
      createdBy: createdMember.createdBy || userEmail,
    };

    return NextResponse.json(
      {
        message: "Committee member created successfully",
        member: formattedMember,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating committee member:", error);
    return NextResponse.json(
      { error: "Failed to create committee member" },
      { status: 500 }
    );
  }
}

// DELETE - Delete committee member
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
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const committeeCollection = db.collection("committee");

    // Check if member exists
    const member = await committeeCollection.findOne({
      _id: new ObjectId(memberId),
    });

    if (!member) {
      return NextResponse.json(
        { error: "Committee member not found" },
        { status: 404 }
      );
    }

    // Delete member
    await committeeCollection.deleteOne({
      _id: new ObjectId(memberId),
    });

    return NextResponse.json(
      {
        message: "Committee member deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting committee member:", error);
    return NextResponse.json(
      { error: "Failed to delete committee member" },
      { status: 500 }
    );
  }
}

