import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const fireStationsCollection = db.collection("fire-stations");

    const station = await fireStationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!station) {
      return NextResponse.json(
        { success: false, error: "Fire station not found" },
        { status: 404 }
      );
    }

    const formattedStation = {
      id: station._id.toString(),
      name: station.name || "",
      officer: station.officer || "",
      address: station.address || "",
      contact: station.contact || "",
      type: station.type || "main",
      email: station.email || "",
      description: station.description || "",
      workingHours: station.workingHours || "",
      emergencyContact: station.emergencyContact || "",
      equipment: station.equipment || [],
      postedBy: station.postedBy || "",
      createdAt: station.createdAt || null,
      updatedAt: station.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        fireStation: formattedStation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching fire station:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch fire station" },
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
      officer,
      address,
      contact,
      type,
      email,
      description,
      workingHours,
      emergencyContact,
      equipment,
    } = body;

    // Validation
    if (!name || !officer || !address || !contact) {
      return NextResponse.json(
        { success: false, error: "Name, officer, address, and contact are required" },
        { status: 400 }
      );
    }

    // Validate phone number format (Bangladeshi mobile)
    const phoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(contact)) {
      return NextResponse.json(
        { success: false, error: "Invalid Bangladeshi mobile number format" },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const fireStationsCollection = db.collection("fire-stations");

    // Check if fire station exists
    const existingStation = await fireStationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingStation) {
      return NextResponse.json(
        { success: false, error: "Fire station not found" },
        { status: 404 }
      );
    }

    // Update fire station
    const updateData = {
      name: name.trim(),
      officer: officer.trim(),
      address: address.trim(),
      contact: contact.trim(),
      type: type || "main",
      email: email?.trim() || "",
      description: description?.trim() || "",
      workingHours: workingHours?.trim() || "",
      emergencyContact: emergencyContact?.trim() || "",
      equipment: equipment || [],
      updatedAt: new Date(),
    };

    await fireStationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated fire station
    const updatedStation = await fireStationsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedStation = {
      id: updatedStation._id.toString(),
      name: updatedStation.name || "",
      officer: updatedStation.officer || "",
      address: updatedStation.address || "",
      contact: updatedStation.contact || "",
      type: updatedStation.type || "main",
      email: updatedStation.email || "",
      description: updatedStation.description || "",
      workingHours: updatedStation.workingHours || "",
      emergencyContact: updatedStation.emergencyContact || "",
      equipment: updatedStation.equipment || [],
      postedBy: updatedStation.postedBy || "",
      createdAt: updatedStation.createdAt || null,
      updatedAt: updatedStation.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Fire station updated successfully",
        fireStation: formattedStation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating fire station:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update fire station" },
      { status: 500 }
    );
  }
}

