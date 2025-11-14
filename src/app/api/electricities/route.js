import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const electricitiesCollection = db.collection("electricities");

    const electricities = await electricitiesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedElectricities = electricities.map((electricity) => ({
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
      postedBy: electricity.postedBy || "",
      createdAt: electricity.createdAt || null,
      updatedAt: electricity.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        electricities: formattedElectricities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching electricities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch electricities" },
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

    const userEmail = session.user.email;

    const newElectricity = {
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
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await electricitiesCollection.insertOne(newElectricity);

    // Fetch created electricity
    const createdElectricity = await electricitiesCollection.findOne({
      _id: result.insertedId,
    });

    const formattedElectricity = {
      id: createdElectricity._id.toString(),
      name: createdElectricity.name || "",
      address: createdElectricity.address || "",
      contact: createdElectricity.contact || "",
      type: createdElectricity.type || "",
      description: createdElectricity.description || "",
      email: createdElectricity.email || "",
      website: createdElectricity.website || "",
      workingHours: createdElectricity.workingHours || "",
      emergencyContact: createdElectricity.emergencyContact || "",
      area: createdElectricity.area || "",
      capacity: createdElectricity.capacity || "",
      manager: createdElectricity.manager || "",
      establishedYear: createdElectricity.establishedYear || "",
      serviceArea: createdElectricity.serviceArea || "",
      billingSystem: createdElectricity.billingSystem || "",
      paymentMethods: createdElectricity.paymentMethods || "",
      complaintsNumber: createdElectricity.complaintsNumber || "",
      officeHours: createdElectricity.officeHours || "",
      holidayInfo: createdElectricity.holidayInfo || "",
      specialServices: createdElectricity.specialServices || "",
      createdAt: createdElectricity.createdAt || null,
      updatedAt: createdElectricity.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Electricity information posted successfully",
        electricity: formattedElectricity,
        insertedId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating electricity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post electricity information" },
      { status: 500 }
    );
  }
}

