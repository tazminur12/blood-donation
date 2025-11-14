import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const policeStationsCollection = db.collection("policeStations");

    const policeStations = await policeStationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedPoliceStations = policeStations.map((station) => ({
      id: station._id.toString(),
      name: station.name || "",
      phone: station.phone || "",
      address: station.address || "",
      officer: station.officer || "",
      services: station.services || [],
      image: station.image || "",
      createdAt: station.createdAt || null,
      updatedAt: station.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        policeStations: formattedPoliceStations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching police stations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch police stations" },
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

    const userEmail = session.user.email;

    const newPoliceStation = {
      name,
      phone,
      address,
      officer,
      services: services || [],
      image: image || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await policeStationsCollection.insertOne(newPoliceStation);

    // Fetch created police station
    const createdStation = await policeStationsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedStation = {
      id: createdStation._id.toString(),
      name: createdStation.name || "",
      phone: createdStation.phone || "",
      address: createdStation.address || "",
      officer: createdStation.officer || "",
      services: createdStation.services || [],
      image: createdStation.image || "",
      createdAt: createdStation.createdAt || null,
      updatedAt: createdStation.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Police station information posted successfully",
        policeStation: formattedStation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating police station:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post police station information" },
      { status: 500 }
    );
  }
}

