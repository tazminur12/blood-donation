import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const couriersCollection = db.collection("couriers");

    const couriers = await couriersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedCouriers = couriers.map((courier) => ({
      id: courier._id.toString(),
      name: courier.name || "",
      address: courier.address || "",
      contact: courier.contact || "",
      type: courier.type || "domestic",
      description: courier.description || "",
      email: courier.email || "",
      website: courier.website || "",
      workingHours: courier.workingHours || "",
      services: courier.services || [],
      createdAt: courier.createdAt || null,
      updatedAt: courier.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        couriers: formattedCouriers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching couriers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch couriers" },
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
      address,
      contact,
      type,
      description,
      email,
      website,
      workingHours,
      services,
    } = body;

    // Validation
    if (!name || !address || !contact) {
      return NextResponse.json(
        { success: false, error: "Name, address, and contact are required" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(contact)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const couriersCollection = db.collection("couriers");

    const userEmail = session.user.email;

    const newCourier = {
      name,
      address,
      contact,
      type: type || "domestic",
      description: description || "",
      email: email || "",
      website: website || "",
      workingHours: workingHours || "",
      services: services || [],
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await couriersCollection.insertOne(newCourier);

    const createdCourier = await couriersCollection.findOne({
      _id: result.insertedId,
    });

    const formattedCourier = {
      id: createdCourier._id.toString(),
      name: createdCourier.name || "",
      address: createdCourier.address || "",
      contact: createdCourier.contact || "",
      type: createdCourier.type || "domestic",
      description: createdCourier.description || "",
      email: createdCourier.email || "",
      website: createdCourier.website || "",
      workingHours: createdCourier.workingHours || "",
      services: createdCourier.services || [],
      createdAt: createdCourier.createdAt || null,
      updatedAt: createdCourier.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "কুরিয়ার সফলভাবে যোগ হয়েছে",
        courier: formattedCourier,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating courier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create courier" },
      { status: 500 }
    );
  }
}

