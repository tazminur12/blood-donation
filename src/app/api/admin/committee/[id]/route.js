import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch single committee member
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
        { error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const committeeCollection = db.collection("committee");

    const member = await committeeCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!member) {
      return NextResponse.json(
        { error: "Committee member not found" },
        { status: 404 }
      );
    }

    const formattedMember = {
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
      createdBy: member.createdBy || "",
    };

    return NextResponse.json(
      { member: formattedMember },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching committee member:", error);
    return NextResponse.json(
      { error: "Failed to fetch committee member" },
      { status: 500 }
    );
  }
}

// PUT - Update committee member
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
        { error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, position, email, phone, photo, description, order, isActive } = body;

    const committeeCollection = db.collection("committee");

    // Check if member exists
    const member = await committeeCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!member) {
      return NextResponse.json(
        { error: "Committee member not found" },
        { status: 404 }
      );
    }

    // Update member
    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (photo !== undefined) updateData.photo = photo;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    await committeeCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated member
    const updatedMember = await committeeCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedMember = {
      id: updatedMember._id.toString(),
      name: updatedMember.name || "",
      position: updatedMember.position || "",
      email: updatedMember.email || "",
      phone: updatedMember.phone || "",
      photo: updatedMember.photo || "",
      description: updatedMember.description || "",
      order: updatedMember.order || 0,
      isActive: updatedMember.isActive !== undefined ? updatedMember.isActive : true,
      createdAt: updatedMember.createdAt || null,
      updatedAt: updatedMember.updatedAt || null,
      createdBy: updatedMember.createdBy || "",
    };

    return NextResponse.json(
      {
        message: "Committee member updated successfully",
        member: formattedMember,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating committee member:", error);
    return NextResponse.json(
      { error: "Failed to update committee member" },
      { status: 500 }
    );
  }
}

