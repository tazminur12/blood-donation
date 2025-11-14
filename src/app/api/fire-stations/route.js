import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const fireStationsCollection = db.collection("fire-stations");

    const fireStations = await fireStationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedFireStations = fireStations.map((station) => ({
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
    }));

    return NextResponse.json(
      {
        success: true,
        fireStations: formattedFireStations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching fire stations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch fire stations" },
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

    const userEmail = session.user.email;

    const newFireStation = {
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
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await fireStationsCollection.insertOne(newFireStation);

    // Fetch created fire station
    const createdStation = await fireStationsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedStation = {
      id: createdStation._id.toString(),
      name: createdStation.name || "",
      officer: createdStation.officer || "",
      address: createdStation.address || "",
      contact: createdStation.contact || "",
      type: createdStation.type || "main",
      email: createdStation.email || "",
      description: createdStation.description || "",
      workingHours: createdStation.workingHours || "",
      emergencyContact: createdStation.emergencyContact || "",
      equipment: createdStation.equipment || [],
      postedBy: createdStation.postedBy || "",
      createdAt: createdStation.createdAt || null,
      updatedAt: createdStation.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Fire station added successfully",
        fireStation: formattedStation,
        insertedId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating fire station:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add fire station" },
      { status: 500 }
    );
  }
}

