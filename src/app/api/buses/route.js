import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const busesCollection = db.collection("buses");

    const buses = await busesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedBuses = buses.map((bus) => ({
      id: bus._id.toString(),
      counterName: bus.counterName || "",
      busName: bus.busName || "",
      route: bus.route || "",
      contactNumber: bus.contactNumber || "",
      operatorName: bus.operatorName || "",
      busType: bus.busType || "",
      fare: bus.fare || "",
      district: bus.district || "gobindaganj",
      description: bus.description || "",
      facilities: bus.facilities || "",
      postedBy: bus.postedBy || "",
      createdAt: bus.createdAt || null,
      updatedAt: bus.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        buses: formattedBuses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch buses" },
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
      counterName,
      busName,
      route,
      contactNumber,
      operatorName,
      busType,
      fare,
      district,
      description,
      facilities,
    } = body;

    // Validation
    if (!counterName || !busName || !route || !contactNumber) {
      return NextResponse.json(
        { success: false, error: "Counter name, bus name, route, and contact number are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const busesCollection = db.collection("buses");

    const userEmail = session.user.email;

    const newBus = {
      counterName,
      busName,
      route,
      contactNumber,
      operatorName: operatorName || "",
      busType: busType || "",
      fare: fare || "",
      district: district || "gobindaganj",
      description: description || "",
      facilities: facilities || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await busesCollection.insertOne(newBus);

    // Fetch created bus
    const createdBus = await busesCollection.findOne({
      _id: result.insertedId,
    });

    const formattedBus = {
      id: createdBus._id.toString(),
      counterName: createdBus.counterName || "",
      busName: createdBus.busName || "",
      route: createdBus.route || "",
      contactNumber: createdBus.contactNumber || "",
      operatorName: createdBus.operatorName || "",
      busType: createdBus.busType || "",
      fare: createdBus.fare || "",
      district: createdBus.district || "gobindaganj",
      description: createdBus.description || "",
      facilities: createdBus.facilities || "",
      createdAt: createdBus.createdAt || null,
      updatedAt: createdBus.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Bus information posted successfully",
        bus: formattedBus,
        insertedId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bus:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post bus information" },
      { status: 500 }
    );
  }
}

