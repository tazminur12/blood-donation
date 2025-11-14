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
      image,
      location,
      address,
      phoneNumber,
      email,
      website,
      description,
      division,
      district,
      upazila,
    } = body;

    // Validation
    if (!name || !location || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Name, location, and phone number are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const hospitalsCollection = db.collection("hospitals");

    // Check if hospital exists and user has permission
    const existingHospital = await hospitalsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingHospital) {
      return NextResponse.json(
        { success: false, error: "Hospital not found" },
        { status: 404 }
      );
    }

    // Update hospital
    const updateData = {
      name,
      image: image || "",
      location,
      address: address || "",
      phoneNumber,
      email: email || "",
      website: website || "",
      description: description || "",
      division: division || "",
      district: district || "",
      upazila: upazila || "",
      updatedAt: new Date(),
    };

    await hospitalsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated hospital
    const updatedHospital = await hospitalsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedHospital = {
      id: updatedHospital._id.toString(),
      name: updatedHospital.name || "",
      image: updatedHospital.image || "",
      location: updatedHospital.location || "",
      address: updatedHospital.address || "",
      phoneNumber: updatedHospital.phoneNumber || "",
      email: updatedHospital.email || "",
      website: updatedHospital.website || "",
      description: updatedHospital.description || "",
      division: updatedHospital.division || "",
      district: updatedHospital.district || "",
      upazila: updatedHospital.upazila || "",
      postedBy: updatedHospital.postedBy || "",
      createdAt: updatedHospital.createdAt || null,
      updatedAt: updatedHospital.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Hospital information updated successfully",
        hospital: formattedHospital,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating hospital:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hospital information" },
      { status: 500 }
    );
  }
}

