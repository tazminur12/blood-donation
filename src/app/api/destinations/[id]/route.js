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
        { success: false, error: "Invalid destination ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const destinationsCollection = db.collection("destinations");

    const destination = await destinationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!destination) {
      return NextResponse.json(
        { success: false, error: "Destination not found" },
        { status: 404 }
      );
    }

    const formattedDestination = {
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
      createdAt: destination.createdAt || null,
      updatedAt: destination.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        destination: formattedDestination,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch destination" },
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

    // Check if destination exists
    const existingDestination = await destinationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingDestination) {
      return NextResponse.json(
        { success: false, error: "Destination not found" },
        { status: 404 }
      );
    }

    // Update destination
    const updateData = {
      name,
      location,
      category,
      image,
      mapLink: mapLink || "",
      district: district || "gobindaganj",
      stayInfo: stayInfo || "",
      travelInfo: travelInfo || "",
      description: description || "",
      updatedAt: new Date(),
    };

    await destinationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated destination
    const updatedDestination = await destinationsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedDestination = {
      id: updatedDestination._id.toString(),
      name: updatedDestination.name || "",
      location: updatedDestination.location || "",
      category: updatedDestination.category || "",
      image: updatedDestination.image || "",
      mapLink: updatedDestination.mapLink || "",
      district: updatedDestination.district || "gobindaganj",
      stayInfo: updatedDestination.stayInfo || "",
      travelInfo: updatedDestination.travelInfo || "",
      description: updatedDestination.description || "",
      createdAt: updatedDestination.createdAt || null,
      updatedAt: updatedDestination.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Destination information updated successfully",
        destination: formattedDestination,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update destination information" },
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
    const destinationsCollection = db.collection("destinations");

    // Check if destination exists
    const existingDestination = await destinationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingDestination) {
      return NextResponse.json(
        { success: false, error: "Destination not found" },
        { status: 404 }
      );
    }

    await destinationsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Destination deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}

