import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const ambulancesCollection = db.collection("ambulances");

    const ambulances = await ambulancesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedAmbulances = ambulances.map((ambulance) => ({
      id: ambulance._id.toString(),
      // New fields
      serviceName: ambulance.serviceName || ambulance.name || "",
      area: ambulance.area || ambulance.location || "",
      type: ambulance.type || ambulance.serviceType || "",
      availability: ambulance.availability !== undefined ? ambulance.availability : false,
      contact: ambulance.contact || ambulance.phoneNumber || "",
      emergencyNumber: ambulance.emergencyNumber || ambulance.alternativePhone || "",
      features: ambulance.features || [],
      imageUrl: ambulance.imageUrl || ambulance.image || "",
      // Legacy fields for backward compatibility
      name: ambulance.serviceName || ambulance.name || "",
      image: ambulance.imageUrl || ambulance.image || "",
      location: ambulance.area || ambulance.location || "",
      address: ambulance.address || "",
      phoneNumber: ambulance.contact || ambulance.phoneNumber || "",
      alternativePhone: ambulance.emergencyNumber || ambulance.alternativePhone || "",
      email: ambulance.email || "",
      serviceType: ambulance.type || ambulance.serviceType || "",
      vehicleNumber: ambulance.vehicleNumber || "",
      description: ambulance.description || "",
      postedBy: ambulance.postedBy || "",
      createdAt: ambulance.createdAt || null,
      updatedAt: ambulance.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        ambulances: formattedAmbulances,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching ambulances:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ambulances" },
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
      serviceName,
      area,
      type,
      availability,
      contact,
      emergencyNumber,
      features,
      imageUrl,
      // Legacy fields for backward compatibility
      name,
      image,
      location,
      address,
      phoneNumber,
      alternativePhone,
      email,
      serviceType,
      vehicleNumber,
      description,
    } = body;

    // Use new fields if available, otherwise fall back to legacy fields
    const finalServiceName = serviceName || name;
    const finalArea = area || location;
    const finalContact = contact || phoneNumber;
    const finalImageUrl = imageUrl || image;
    const finalType = type || serviceType;
    const finalEmergencyNumber = emergencyNumber || alternativePhone;
    const finalFeatures = features || [];
    const finalAvailability = availability !== undefined ? availability : false;

    // Validation
    if (!finalServiceName || !finalArea || !finalContact) {
      return NextResponse.json(
        { success: false, error: "Service name, area, and contact are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const ambulancesCollection = db.collection("ambulances");

    const userEmail = session.user.email;

    // Create ambulance with new field structure
    const newAmbulance = {
      serviceName: finalServiceName,
      area: finalArea,
      type: finalType,
      availability: finalAvailability,
      contact: finalContact,
      emergencyNumber: finalEmergencyNumber,
      features: finalFeatures,
      imageUrl: finalImageUrl,
      // Store legacy fields for backward compatibility
      name: finalServiceName,
      location: finalArea,
      phoneNumber: finalContact,
      image: finalImageUrl,
      serviceType: finalType,
      alternativePhone: finalEmergencyNumber,
      address: address || "",
      email: email || "",
      vehicleNumber: vehicleNumber || "",
      description: description || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ambulancesCollection.insertOne(newAmbulance);

    // Fetch created ambulance
    const createdAmbulance = await ambulancesCollection.findOne({
      _id: result.insertedId,
    });

    const formattedAmbulance = {
      id: createdAmbulance._id.toString(),
      // New fields
      serviceName: createdAmbulance.serviceName || createdAmbulance.name || "",
      area: createdAmbulance.area || createdAmbulance.location || "",
      type: createdAmbulance.type || createdAmbulance.serviceType || "",
      availability: createdAmbulance.availability !== undefined ? createdAmbulance.availability : false,
      contact: createdAmbulance.contact || createdAmbulance.phoneNumber || "",
      emergencyNumber: createdAmbulance.emergencyNumber || createdAmbulance.alternativePhone || "",
      features: createdAmbulance.features || [],
      imageUrl: createdAmbulance.imageUrl || createdAmbulance.image || "",
      // Legacy fields for backward compatibility
      name: createdAmbulance.serviceName || createdAmbulance.name || "",
      image: createdAmbulance.imageUrl || createdAmbulance.image || "",
      location: createdAmbulance.area || createdAmbulance.location || "",
      address: createdAmbulance.address || "",
      phoneNumber: createdAmbulance.contact || createdAmbulance.phoneNumber || "",
      alternativePhone: createdAmbulance.emergencyNumber || createdAmbulance.alternativePhone || "",
      email: createdAmbulance.email || "",
      serviceType: createdAmbulance.type || createdAmbulance.serviceType || "",
      vehicleNumber: createdAmbulance.vehicleNumber || "",
      description: createdAmbulance.description || "",
      postedBy: createdAmbulance.postedBy || "",
      createdAt: createdAmbulance.createdAt || null,
      updatedAt: createdAmbulance.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Ambulance information posted successfully",
        ambulance: formattedAmbulance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ambulance:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post ambulance information" },
      { status: 500 }
    );
  }
}

