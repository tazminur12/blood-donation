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
        { success: false, error: "Invalid electricity ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const electricitiesCollection = db.collection("electricities");

    const electricity = await electricitiesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!electricity) {
      return NextResponse.json(
        { success: false, error: "Electricity not found" },
        { status: 404 }
      );
    }

    const formattedElectricity = {
      id: electricity._id.toString(),
      name: electricity.name || "",
      address: electricity.address || "",
      contact: electricity.contact || "",
      type: electricity.type || "",
      description: electricity.description || "",
      email: electricity.email || "",
      website: electricity.website || "",
      workingHours: electricity.workingHours || "",
      emergencyContact: electricity.emergencyContact || "",
      area: electricity.area || "",
      capacity: electricity.capacity || "",
      manager: electricity.manager || "",
      establishedYear: electricity.establishedYear || "",
      serviceArea: electricity.serviceArea || "",
      billingSystem: electricity.billingSystem || "",
      paymentMethods: electricity.paymentMethods || "",
      complaintsNumber: electricity.complaintsNumber || "",
      officeHours: electricity.officeHours || "",
      holidayInfo: electricity.holidayInfo || "",
      specialServices: electricity.specialServices || "",
      createdAt: electricity.createdAt || null,
      updatedAt: electricity.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        electricity: formattedElectricity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching electricity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch electricity" },
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
      address,
      contact,
      type,
      description,
      email,
      website,
      workingHours,
      emergencyContact,
      area,
      capacity,
      manager,
      establishedYear,
      serviceArea,
      billingSystem,
      paymentMethods,
      complaintsNumber,
      officeHours,
      holidayInfo,
      specialServices,
    } = body;

    // Validation
    if (!name || !address || !contact || !type || !area) {
      return NextResponse.json(
        { success: false, error: "Name, address, contact, type, and area are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const electricitiesCollection = db.collection("electricities");

    // Check if electricity exists
    const existingElectricity = await electricitiesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingElectricity) {
      return NextResponse.json(
        { success: false, error: "Electricity not found" },
        { status: 404 }
      );
    }

    // Update electricity
    const updateData = {
      name,
      address,
      contact,
      type,
      description: description || "",
      email: email || "",
      website: website || "",
      workingHours: workingHours || "",
      emergencyContact: emergencyContact || "",
      area,
      capacity: capacity || "",
      manager: manager || "",
      establishedYear: establishedYear || "",
      serviceArea: serviceArea || "",
      billingSystem: billingSystem || "",
      paymentMethods: paymentMethods || "",
      complaintsNumber: complaintsNumber || "",
      officeHours: officeHours || "",
      holidayInfo: holidayInfo || "",
      specialServices: specialServices || "",
      updatedAt: new Date(),
    };

    await electricitiesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated electricity
    const updatedElectricity = await electricitiesCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedElectricity = {
      id: updatedElectricity._id.toString(),
      name: updatedElectricity.name || "",
      address: updatedElectricity.address || "",
      contact: updatedElectricity.contact || "",
      type: updatedElectricity.type || "",
      description: updatedElectricity.description || "",
      email: updatedElectricity.email || "",
      website: updatedElectricity.website || "",
      workingHours: updatedElectricity.workingHours || "",
      emergencyContact: updatedElectricity.emergencyContact || "",
      area: updatedElectricity.area || "",
      capacity: updatedElectricity.capacity || "",
      manager: updatedElectricity.manager || "",
      establishedYear: updatedElectricity.establishedYear || "",
      serviceArea: updatedElectricity.serviceArea || "",
      billingSystem: updatedElectricity.billingSystem || "",
      paymentMethods: updatedElectricity.paymentMethods || "",
      complaintsNumber: updatedElectricity.complaintsNumber || "",
      officeHours: updatedElectricity.officeHours || "",
      holidayInfo: updatedElectricity.holidayInfo || "",
      specialServices: updatedElectricity.specialServices || "",
      createdAt: updatedElectricity.createdAt || null,
      updatedAt: updatedElectricity.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Electricity information updated successfully",
        electricity: formattedElectricity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating electricity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update electricity information" },
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
    const electricitiesCollection = db.collection("electricities");

    // Check if electricity exists
    const existingElectricity = await electricitiesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingElectricity) {
      return NextResponse.json(
        { success: false, error: "Electricity not found" },
        { status: 404 }
      );
    }

    await electricitiesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Electricity deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting electricity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete electricity" },
      { status: 500 }
    );
  }
}

