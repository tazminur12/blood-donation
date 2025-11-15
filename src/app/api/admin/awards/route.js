import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all awards
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

    const awardsCollection = db.collection("awards");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch awards
    const awards = await awardsCollection
      .find(filter)
      .sort({ awardDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format awards
    const formattedAwards = awards.map((award) => ({
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
      createdBy: award.createdBy || session.user.email,
    }));

    // Get total count
    const totalCount = await awardsCollection.countDocuments(filter);

    // Get stats
    const stats = {
      total: totalCount,
      active: await awardsCollection.countDocuments({ ...filter, isActive: true }),
      byOrganization: {},
    };

    const organizations = await awardsCollection.distinct("organization");
    for (const organization of organizations) {
      stats.byOrganization[organization] = await awardsCollection.countDocuments({
        ...filter,
        organization: organization,
      });
    }

    return NextResponse.json(
      {
        awards: formattedAwards,
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
    console.error("Error fetching awards:", error);
    return NextResponse.json(
      { error: "Failed to fetch awards" },
      { status: 500 }
    );
  }
}

// POST - Create new award
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
    const { title, description, category, organization, awardDate, imageUrl, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const awardsCollection = db.collection("awards");
    const userEmail = session.user.email;

    const awardData = {
      title,
      description: description || "",
      category: category || "",
      organization: organization || "",
      awardDate: awardDate ? new Date(awardDate) : new Date(),
      imageUrl: imageUrl || "",
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await awardsCollection.insertOne(awardData);

    // Fetch created award
    const createdAward = await awardsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedAward = {
      id: createdAward._id.toString(),
      title: createdAward.title || "",
      description: createdAward.description || "",
      category: createdAward.category || "",
      organization: createdAward.organization || "",
      awardDate: createdAward.awardDate || null,
      imageUrl: createdAward.imageUrl || "",
      isActive: createdAward.isActive !== undefined ? createdAward.isActive : true,
      createdAt: createdAward.createdAt || null,
      updatedAt: createdAward.updatedAt || null,
      createdBy: createdAward.createdBy || userEmail,
    };

    return NextResponse.json(
      {
        message: "Award created successfully",
        award: formattedAward,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating award:", error);
    return NextResponse.json(
      { error: "Failed to create award" },
      { status: 500 }
    );
  }
}

// DELETE - Delete award
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
    const awardId = searchParams.get("awardId");

    if (!awardId) {
      return NextResponse.json(
        { error: "Award ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(awardId)) {
      return NextResponse.json(
        { error: "Invalid award ID" },
        { status: 400 }
      );
    }

    const awardsCollection = db.collection("awards");

    // Check if award exists
    const award = await awardsCollection.findOne({
      _id: new ObjectId(awardId),
    });

    if (!award) {
      return NextResponse.json(
        { error: "Award not found" },
        { status: 404 }
      );
    }

    // Delete award
    await awardsCollection.deleteOne({
      _id: new ObjectId(awardId),
    });

    return NextResponse.json(
      {
        message: "Award deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting award:", error);
    return NextResponse.json(
      { error: "Failed to delete award" },
      { status: 500 }
    );
  }
}

