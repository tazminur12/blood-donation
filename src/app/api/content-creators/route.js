import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const contentCreatorsCollection = db.collection("contentCreators");

    const contentCreators = await contentCreatorsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedContentCreators = contentCreators.map((creator) => ({
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
    }));

    return NextResponse.json(
      {
        success: true,
        contentCreators: formattedContentCreators,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching content creators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content creators" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const userEmail = session.user.email;

    const newContentCreator = {
      name,
      image: image || "",
      specialty,
      email,
      facebook: facebook || "",
      instagram: instagram || "",
      youtube: youtube || "",
      tiktok: tiktok || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await contentCreatorsCollection.insertOne(newContentCreator);

    // Fetch created content creator
    const createdCreator = await contentCreatorsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedCreator = {
      id: createdCreator._id.toString(),
      name: createdCreator.name || "",
      image: createdCreator.image || "",
      specialty: createdCreator.specialty || "",
      email: createdCreator.email || "",
      facebook: createdCreator.facebook || "",
      instagram: createdCreator.instagram || "",
      youtube: createdCreator.youtube || "",
      tiktok: createdCreator.tiktok || "",
      createdAt: createdCreator.createdAt || null,
      updatedAt: createdCreator.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Content creator information posted successfully",
        contentCreator: formattedCreator,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating content creator:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post content creator information" },
      { status: 500 }
    );
  }
}

