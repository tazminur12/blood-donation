import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const journalistsCollection = db.collection("journalists");

    const journalists = await journalistsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedJournalists = journalists.map((journalist) => ({
      id: journalist._id.toString(),
      name: journalist.name || "",
      email: journalist.email || "",
      phone: journalist.phone || "",
      designation: journalist.designation || "",
      mediaType: journalist.mediaType || "",
      mediaName: journalist.mediaName || "",
      mediaWebsite: journalist.mediaWebsite || "",
      beat: journalist.beat || "",
      district: journalist.district || "",
      image: journalist.image || "",
      createdAt: journalist.createdAt || null,
      updatedAt: journalist.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        journalists: formattedJournalists,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching journalists:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch journalists" },
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
      email,
      phone,
      designation,
      mediaType,
      mediaName,
      mediaWebsite,
      beat,
      district,
      image,
    } = body;

    // Validation
    if (!name || !email || !phone || !designation || !mediaName || !beat || !district) {
      return NextResponse.json(
        { success: false, error: "Name, email, phone, designation, media name, beat, and district are required" },
        { status: 400 }
      );
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Phone validation
    if (!/^(?:\+88|01)?\d{11}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const journalistsCollection = db.collection("journalists");

    const userEmail = session.user.email;

    const newJournalist = {
      name,
      email,
      phone,
      designation,
      mediaType: mediaType || "newspaper",
      mediaName,
      mediaWebsite: mediaWebsite || "",
      beat,
      district,
      image: image || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await journalistsCollection.insertOne(newJournalist);

    // Fetch created journalist
    const createdJournalist = await journalistsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedJournalist = {
      id: createdJournalist._id.toString(),
      name: createdJournalist.name || "",
      email: createdJournalist.email || "",
      phone: createdJournalist.phone || "",
      designation: createdJournalist.designation || "",
      mediaType: createdJournalist.mediaType || "",
      mediaName: createdJournalist.mediaName || "",
      mediaWebsite: createdJournalist.mediaWebsite || "",
      beat: createdJournalist.beat || "",
      district: createdJournalist.district || "",
      image: createdJournalist.image || "",
      createdAt: createdJournalist.createdAt || null,
      updatedAt: createdJournalist.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Journalist information posted successfully",
        journalist: formattedJournalist,
        insertedId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating journalist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post journalist information" },
      { status: 500 }
    );
  }
}

