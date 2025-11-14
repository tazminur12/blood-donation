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

    // Check if courier exists
    const existingCourier = await couriersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingCourier) {
      return NextResponse.json(
        { success: false, error: "Courier not found" },
        { status: 404 }
      );
    }

    const updateData = {
      name,
      address,
      contact,
      type: type || "domestic",
      description: description || "",
      email: email || "",
      website: website || "",
      workingHours: workingHours || "",
      services: services || [],
      updatedAt: new Date(),
    };

    await couriersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedCourier = await couriersCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedCourier = {
      id: updatedCourier._id.toString(),
      name: updatedCourier.name || "",
      address: updatedCourier.address || "",
      contact: updatedCourier.contact || "",
      type: updatedCourier.type || "domestic",
      description: updatedCourier.description || "",
      email: updatedCourier.email || "",
      website: updatedCourier.website || "",
      workingHours: updatedCourier.workingHours || "",
      services: updatedCourier.services || [],
      createdAt: updatedCourier.createdAt || null,
      updatedAt: updatedCourier.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "কুরিয়ার সফলভাবে আপডেট করা হয়েছে",
        courier: formattedCourier,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating courier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update courier" },
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
    const couriersCollection = db.collection("couriers");

    const result = await couriersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Courier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "কুরিয়ার সফলভাবে মুছে ফেলা হয়েছে",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting courier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete courier" },
      { status: 500 }
    );
  }
}

