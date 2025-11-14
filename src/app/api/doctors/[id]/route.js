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
      specialization,
      qualification,
      experience,
      chamber,
      hospital,
      availability,
      fee,
      description,
    } = body;

    // Validation
    if (!name || !specialization || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Name, specialization, and phone number are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const doctorsCollection = db.collection("doctors");

    // Check if doctor exists
    const existingDoctor = await doctorsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingDoctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    // Update doctor
    const updateData = {
      name,
      image: image || "",
      location: location || "",
      address: address || "",
      phoneNumber,
      email: email || "",
      specialization: specialization || "",
      qualification: qualification || "",
      experience: experience || "",
      chamber: chamber || "",
      hospital: hospital || "",
      availability: availability || "",
      fee: fee ? parseInt(fee, 10) || 0 : 0,
      description: description || "",
      updatedAt: new Date(),
    };

    await doctorsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated doctor
    const updatedDoctor = await doctorsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedDoctor = {
      id: updatedDoctor._id.toString(),
      name: updatedDoctor.name || "",
      image: updatedDoctor.image || "",
      location: updatedDoctor.location || "",
      address: updatedDoctor.address || "",
      phoneNumber: updatedDoctor.phoneNumber || "",
      email: updatedDoctor.email || "",
      specialization: updatedDoctor.specialization || "",
      qualification: updatedDoctor.qualification || "",
      experience: updatedDoctor.experience || "",
      chamber: updatedDoctor.chamber || "",
      hospital: updatedDoctor.hospital || "",
      availability: updatedDoctor.availability || "",
      fee: updatedDoctor.fee || 0,
      description: updatedDoctor.description || "",
      postedBy: updatedDoctor.postedBy || "",
      createdAt: updatedDoctor.createdAt || null,
      updatedAt: updatedDoctor.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Doctor information updated successfully",
        doctor: formattedDoctor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update doctor information" },
      { status: 500 }
    );
  }
}

