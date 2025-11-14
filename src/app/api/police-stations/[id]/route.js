import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

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
      phone,
      address,
      officer,
      services,
      image,
    } = body;

    // Validation
    if (!name || !phone || !address || !officer) {
      return NextResponse.json(
        { success: false, error: "Name, phone, address, and officer are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const policeStationsCollection = db.collection("policeStations");

    // Check if police station exists
    const existingStation = await policeStationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingStation) {
      return NextResponse.json(
        { success: false, error: "Police station not found" },
        { status: 404 }
      );
    }

    // Update police station
    const updateData = {
      name,
      phone,
      address,
      officer,
      services: services || [],
      image: image || "",
      updatedAt: new Date(),
    };

    await policeStationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated police station
    const updatedStation = await policeStationsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedStation = {
      id: updatedStation._id.toString(),
      name: updatedStation.name || "",
      phone: updatedStation.phone || "",
      address: updatedStation.address || "",
      officer: updatedStation.officer || "",
      services: updatedStation.services || [],
      image: updatedStation.image || "",
      createdAt: updatedStation.createdAt || null,
      updatedAt: updatedStation.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Police station information updated successfully",
        policeStation: formattedStation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating police station:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update police station information" },
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
    const policeStationsCollection = db.collection("policeStations");

    // Check if police station exists
    const existingStation = await policeStationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingStation) {
      return NextResponse.json(
        { success: false, error: "Police station not found" },
        { status: 404 }
      );
    }

    await policeStationsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Police station deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting police station:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete police station" },
      { status: 500 }
    );
  }
}

