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
        { success: false, error: "Invalid bus ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const busesCollection = db.collection("buses");

    const bus = await busesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!bus) {
      return NextResponse.json(
        { success: false, error: "Bus not found" },
        { status: 404 }
      );
    }

    const formattedBus = {
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
      createdAt: bus.createdAt || null,
      updatedAt: bus.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        bus: formattedBus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bus:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bus" },
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

    // Check if bus exists
    const existingBus = await busesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingBus) {
      return NextResponse.json(
        { success: false, error: "Bus not found" },
        { status: 404 }
      );
    }

    // Update bus
    const updateData = {
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
      updatedAt: new Date(),
    };

    await busesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated bus
    const updatedBus = await busesCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedBus = {
      id: updatedBus._id.toString(),
      counterName: updatedBus.counterName || "",
      busName: updatedBus.busName || "",
      route: updatedBus.route || "",
      contactNumber: updatedBus.contactNumber || "",
      operatorName: updatedBus.operatorName || "",
      busType: updatedBus.busType || "",
      fare: updatedBus.fare || "",
      district: updatedBus.district || "gobindaganj",
      description: updatedBus.description || "",
      facilities: updatedBus.facilities || "",
      createdAt: updatedBus.createdAt || null,
      updatedAt: updatedBus.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Bus information updated successfully",
        bus: formattedBus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bus:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update bus information" },
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
    const busesCollection = db.collection("buses");

    // Check if bus exists
    const existingBus = await busesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingBus) {
      return NextResponse.json(
        { success: false, error: "Bus not found" },
        { status: 404 }
      );
    }

    await busesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bus deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bus:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete bus" },
      { status: 500 }
    );
  }
}

