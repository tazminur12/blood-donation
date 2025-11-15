import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch single award
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
        { error: "Invalid award ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const awardsCollection = db.collection("awards");

    const award = await awardsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!award) {
      return NextResponse.json(
        { error: "Award not found" },
        { status: 404 }
      );
    }

    const formattedAward = {
      id: award._id.toString(),
      title: award.title || "",
      description: award.description || "",
      category: award.category || "",
      organization: award.organization || "",
      awardDate: award.awardDate || null,
      imageUrl: award.imageUrl || "",
      isActive: award.isActive !== undefined ? award.isActive : true,
      createdAt: award.createdAt || null,
      updatedAt: award.updatedAt || null,
      createdBy: award.createdBy || "",
    };

    return NextResponse.json(
      { award: formattedAward },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching award:", error);
    return NextResponse.json(
      { error: "Failed to fetch award" },
      { status: 500 }
    );
  }
}

// PUT - Update award
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
        { error: "Invalid award ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, category, organization, awardDate, imageUrl, isActive } = body;

    const awardsCollection = db.collection("awards");

    // Check if award exists
    const award = await awardsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!award) {
      return NextResponse.json(
        { error: "Award not found" },
        { status: 404 }
      );
    }

    // Update award
    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (organization !== undefined) updateData.organization = organization;
    if (awardDate !== undefined) updateData.awardDate = awardDate ? new Date(awardDate) : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    await awardsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated award
    const updatedAward = await awardsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedAward = {
      id: updatedAward._id.toString(),
      title: updatedAward.title || "",
      description: updatedAward.description || "",
      category: updatedAward.category || "",
      organization: updatedAward.organization || "",
      awardDate: updatedAward.awardDate || null,
      imageUrl: updatedAward.imageUrl || "",
      isActive: updatedAward.isActive !== undefined ? updatedAward.isActive : true,
      createdAt: updatedAward.createdAt || null,
      updatedAt: updatedAward.updatedAt || null,
      createdBy: updatedAward.createdBy || "",
    };

    return NextResponse.json(
      {
        message: "Award updated successfully",
        award: formattedAward,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating award:", error);
    return NextResponse.json(
      { error: "Failed to update award" },
      { status: 500 }
    );
  }
}

