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
    const finalFeatures = features !== undefined ? features : [];
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

    // Check if ambulance exists
    const existingAmbulance = await ambulancesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingAmbulance) {
      return NextResponse.json(
        { success: false, error: "Ambulance not found" },
        { status: 404 }
      );
    }

    // Update ambulance with new field structure
    const updateData = {
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
      updatedAt: new Date(),
    };

    await ambulancesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated ambulance
    const updatedAmbulance = await ambulancesCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedAmbulance = {
      id: updatedAmbulance._id.toString(),
      // New fields
      serviceName: updatedAmbulance.serviceName || updatedAmbulance.name || "",
      area: updatedAmbulance.area || updatedAmbulance.location || "",
      type: updatedAmbulance.type || updatedAmbulance.serviceType || "",
      availability: updatedAmbulance.availability !== undefined ? updatedAmbulance.availability : false,
      contact: updatedAmbulance.contact || updatedAmbulance.phoneNumber || "",
      emergencyNumber: updatedAmbulance.emergencyNumber || updatedAmbulance.alternativePhone || "",
      features: updatedAmbulance.features || [],
      imageUrl: updatedAmbulance.imageUrl || updatedAmbulance.image || "",
      // Legacy fields for backward compatibility
      name: updatedAmbulance.serviceName || updatedAmbulance.name || "",
      image: updatedAmbulance.imageUrl || updatedAmbulance.image || "",
      location: updatedAmbulance.area || updatedAmbulance.location || "",
      address: updatedAmbulance.address || "",
      phoneNumber: updatedAmbulance.contact || updatedAmbulance.phoneNumber || "",
      alternativePhone: updatedAmbulance.emergencyNumber || updatedAmbulance.alternativePhone || "",
      email: updatedAmbulance.email || "",
      serviceType: updatedAmbulance.type || updatedAmbulance.serviceType || "",
      vehicleNumber: updatedAmbulance.vehicleNumber || "",
      description: updatedAmbulance.description || "",
      postedBy: updatedAmbulance.postedBy || "",
      createdAt: updatedAmbulance.createdAt || null,
      updatedAt: updatedAmbulance.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Ambulance information updated successfully",
        ambulance: formattedAmbulance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating ambulance:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ambulance information" },
      { status: 500 }
    );
  }
}

