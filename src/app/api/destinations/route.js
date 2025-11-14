import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const destinationsCollection = db.collection("destinations");

    const destinations = await destinationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedDestinations = destinations.map((destination) => ({
      id: destination._id.toString(),
      name: destination.name || "",
      location: destination.location || "",
      category: destination.category || "",
      image: destination.image || "",
      mapLink: destination.mapLink || "",
      district: destination.district || "gobindaganj",
      stayInfo: destination.stayInfo || "",
      travelInfo: destination.travelInfo || "",
      description: destination.description || "",
      postedBy: destination.postedBy || "",
      createdAt: destination.createdAt || null,
      updatedAt: destination.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        destinations: formattedDestinations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch destinations" },
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
      location,
      category,
      image,
      mapLink,
      district,
      stayInfo,
      travelInfo,
      description,
    } = body;

    // Validation
    if (!name || !location || !category || !image) {
      return NextResponse.json(
        { success: false, error: "Name, location, category, and image are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const destinationsCollection = db.collection("destinations");

    const userEmail = session.user.email;

    const newDestination = {
      name,
      location,
      category,
      image,
      mapLink: mapLink || "",
      district: district || "gobindaganj",
      stayInfo: stayInfo || "",
      travelInfo: travelInfo || "",
      description: description || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await destinationsCollection.insertOne(newDestination);

    // Fetch created destination
    const createdDestination = await destinationsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedDestination = {
      id: createdDestination._id.toString(),
      name: createdDestination.name || "",
      location: createdDestination.location || "",
      category: createdDestination.category || "",
      image: createdDestination.image || "",
      mapLink: createdDestination.mapLink || "",
      district: createdDestination.district || "gobindaganj",
      stayInfo: createdDestination.stayInfo || "",
      travelInfo: createdDestination.travelInfo || "",
      description: createdDestination.description || "",
      createdAt: createdDestination.createdAt || null,
      updatedAt: createdDestination.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Destination information posted successfully",
        destination: formattedDestination,
        insertedId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post destination information" },
      { status: 500 }
    );
  }
}

